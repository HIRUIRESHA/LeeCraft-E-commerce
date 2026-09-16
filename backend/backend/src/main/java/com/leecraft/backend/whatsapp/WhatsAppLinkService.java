package com.leecraft.backend.whatsapp;

import com.leecraft.backend.order.models.Order;
import com.leecraft.backend.order.models.OrderItem;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Builds wa.me deep links carrying a prefilled order summary. There is no
 * WhatsApp Business API integration (no credentials for one), so "connecting"
 * an order to WhatsApp means handing back a link that opens a chat with the
 * message already typed in, for a human (admin or customer) to send.
 */
@Service
public class WhatsAppLinkService {

    private final String businessNumber;

    public WhatsAppLinkService(@Value("${business.whatsapp.number}") String businessNumber) {
        this.businessNumber = normalize(businessNumber);
    }

    /** Link to the business number, prefilled with the new order's details — for admin use. */
    public String newOrderNotificationLink(Order order) {
        return buildLink(businessNumber, buildOrderSummary(order));
    }

    /** Link to the customer's own number, so an admin can message them directly about their order. */
    public String customerContactLink(Order order) {
        String normalized = normalize(order.getContactNumber());
        String message = "Hi " + order.getFullName() + ", this is LeeCraft regarding your order "
                + order.getOrderNumber() + ".";
        return buildLink(normalized, message);
    }

    private String buildLink(String number, String message) {
        String encoded = URLEncoder.encode(message, StandardCharsets.UTF_8);
        return "https://wa.me/" + number + "?text=" + encoded;
    }

    private String buildOrderSummary(Order order) {
        String itemLines = order.getItems().stream()
                .map(this::formatItem)
                .collect(Collectors.joining("\n"));

        return "New order " + order.getOrderNumber() + "\n"
                + "Customer: " + order.getFullName() + " (" + order.getContactNumber() + ")\n"
                + "Items:\n" + itemLines + "\n"
                + "Subtotal: Rs. " + order.getSubtotal() + "\n"
                + "Shipping (" + order.getShippingMethod() + "): Rs. " + order.getShippingCost() + "\n"
                + "Total: Rs. " + order.getTotal() + "\n"
                + "Deliver to: " + order.getAddress() + ", " + order.getCity() + " " + order.getPostalCode();
    }

    private String formatItem(OrderItem item) {
        return "- " + item.getProductName() + " x" + item.getQty() + " = Rs. " + item.getLineTotal();
    }

    /** Sri Lankan local numbers (0XXXXXXXXX) become 94XXXXXXXXX; a leading + is stripped. */
    private String normalize(String rawNumber) {
        String digits = rawNumber.replaceAll("[^0-9]", "");
        if (digits.startsWith("0")) {
            return "94" + digits.substring(1);
        }
        return digits;
    }
}
