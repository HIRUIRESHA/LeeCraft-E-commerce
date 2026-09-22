package com.leecraft.backend.cart.service;

import com.leecraft.backend.cart.dto.AddToCartRequest;
import com.leecraft.backend.cart.dto.CartItemResponse;
import com.leecraft.backend.cart.dto.CartResponse;
import com.leecraft.backend.cart.dto.UpdateCartRequest;
import com.leecraft.backend.cart.model.Cart;
import com.leecraft.backend.cart.model.CartItem;
import com.leecraft.backend.cart.repository.CartRepository;
import com.leecraft.backend.product.model.Product;
import com.leecraft.backend.product.repository.ProductRepository;
import com.leecraft.backend.user.User;
import com.leecraft.backend.user.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;

@Service
@Transactional
public class CartService {

    private static final BigDecimal FREE_SHIPPING_THRESHOLD =
            new BigDecimal("8000");

    private static final BigDecimal SHIPPING_FEE =
            new BigDecimal("400");

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartService(
            CartRepository cartRepository,
            ProductRepository productRepository,
            UserRepository userRepository
    ) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    /**
     * Get the currently authenticated user.
     */
    private User getCurrentUser() {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return userRepository
                .findByEmailIgnoreCase(email)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.UNAUTHORIZED,
                                "User not found"
                        )
                );
    }

    /**
     * Find the current user's cart.
     * If the cart does not exist, create it.
     */
    private Cart getOrCreateCart() {

        User user = getCurrentUser();

        return cartRepository
                .findByUser(user)
                .orElseGet(() -> {

                    Cart cart = Cart.builder()
                            .user(user)
                            .build();

                    return cartRepository.save(cart);
                });
    }

    /**
     * Get the current user's cart.
     *
     * This method intentionally uses the normal transaction
     * because getOrCreateCart() may create a new cart.
     */
    public CartResponse getCart() {

        Cart cart = getOrCreateCart();

        return buildCartResponse(cart);
    }

    /**
     * Add a product to the cart.
     */
    public CartResponse addToCart(AddToCartRequest request) {

        Cart cart = getOrCreateCart();

        Product product = productRepository
                .findById(request.getProductId())
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Product not found"
                        )
                );

        validateStock(
                product,
                request.getQuantity()
        );

        CartItem cartItem = cart.getItems()
                .stream()
                .filter(item ->
                        item.getProduct()
                                .getId()
                                .equals(product.getId())
                )
                .findFirst()
                .orElse(null);

        if (cartItem != null) {

            int newQuantity =
                    cartItem.getQuantity()
                            + request.getQuantity();

            validateStock(
                    product,
                    newQuantity
            );

            cartItem.setQuantity(newQuantity);

        } else {

            CartItem newItem = CartItem.builder()
                    .product(product)
                    .quantity(request.getQuantity())
                    .build();

            cart.addItem(newItem);
        }

        cartRepository.save(cart);

        return buildCartResponse(cart);
    }

    /**
     * Update the quantity of a product in the cart.
     */
    public CartResponse updateCartItem(
            Long productId,
            UpdateCartRequest request
    ) {

        Cart cart = getOrCreateCart();

        CartItem cartItem = cart.getItems()
                .stream()
                .filter(item ->
                        item.getProduct()
                                .getId()
                                .equals(productId)
                )
                .findFirst()
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Product is not in the cart"
                        )
                );

        Product product = cartItem.getProduct();

        validateStock(
                product,
                request.getQuantity()
        );

        cartItem.setQuantity(
                request.getQuantity()
        );

        cartRepository.save(cart);

        return buildCartResponse(cart);
    }

    /**
     * Remove one product from the cart.
     */
    public CartResponse removeCartItem(Long productId) {

        Cart cart = getOrCreateCart();

        CartItem cartItem = cart.getItems()
                .stream()
                .filter(item ->
                        item.getProduct()
                                .getId()
                                .equals(productId)
                )
                .findFirst()
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Product is not in the cart"
                        )
                );

        cart.removeItem(cartItem);

        cartRepository.save(cart);

        return buildCartResponse(cart);
    }

    /**
     * Remove all products from the cart.
     */
    public void clearCart() {

        Cart cart = getOrCreateCart();

        cart.getItems().clear();

        cartRepository.save(cart);
    }

    /**
     * Check whether requested quantity is available.
     */
    private void validateStock(
            Product product,
            Integer requestedQuantity
    ) {

        Integer stock = product.getStockQuantity();

        if (stock == null || stock <= 0) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Product is out of stock"
            );
        }

        if (requestedQuantity > stock) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Only " + stock +
                            " item(s) are available in stock"
            );
        }
    }

    /**
     * Convert the Cart entity into the response sent to Angular.
     */
    private CartResponse buildCartResponse(Cart cart) {

        List<CartItemResponse> items =
                cart.getItems()
                        .stream()
                        .map(item ->
                                CartItemResponse.builder()
                                        .productId(
                                                item.getProduct().getId()
                                        )
                                        .name(
                                                item.getProduct().getName()
                                        )
                                        .price(
                                                item.getProduct().getPrice()
                                        )
                                        .image(
                                                item.getProduct().getImageUrl()
                                        )
                                        .quantity(
                                                item.getQuantity()
                                        )
                                        .build()
                        )
                        .toList();

        BigDecimal subtotal = items.stream()
                .map(item ->
                        item.getPrice()
                                .multiply(
                                        BigDecimal.valueOf(
                                                item.getQuantity()
                                        )
                                )
                )
                .reduce(
                        BigDecimal.ZERO,
                        BigDecimal::add
                );

        int itemCount = items.stream()
                .mapToInt(
                        CartItemResponse::getQuantity
                )
                .sum();

        BigDecimal shipping;

        if (subtotal.compareTo(
                BigDecimal.ZERO
        ) == 0) {

            shipping = BigDecimal.ZERO;

        } else if (
                subtotal.compareTo(
                        FREE_SHIPPING_THRESHOLD
                ) >= 0
        ) {

            shipping = BigDecimal.ZERO;

        } else {

            shipping = SHIPPING_FEE;
        }

        BigDecimal total = subtotal.add(shipping);

        return CartResponse.builder()
                .items(items)
                .subtotal(subtotal)
                .shipping(shipping)
                .total(total)
                .itemCount(itemCount)
                .build();
    }
}