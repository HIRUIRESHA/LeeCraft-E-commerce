package com.leecraft.backend.contact.service;

import com.leecraft.backend.contact.dto.ContactMessageRequest;
import com.leecraft.backend.contact.dto.ContactMessageResponse;
import com.leecraft.backend.contact.model.ContactMessage;
import com.leecraft.backend.contact.repository.ContactMessageRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContactMessageService {

    private final ContactMessageRepository contactMessageRepository;

    public ContactMessageService(ContactMessageRepository contactMessageRepository) {
        this.contactMessageRepository = contactMessageRepository;
    }

    public ContactMessageResponse submit(ContactMessageRequest request) {
        ContactMessage saved = contactMessageRepository.save(
                new ContactMessage(request.getName(), request.getEmail(), request.getMessage()));
        return toResponse(saved);
    }

    public List<ContactMessageResponse> getAllMessages() {
        return contactMessageRepository.findAllByOrderByCreatedAtDesc().stream().map(this::toResponse).toList();
    }

    public ContactMessageResponse markAsRead(Long id) {
        ContactMessage message = contactMessageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contact message not found with id: " + id));
        message.setRead(true);
        return toResponse(contactMessageRepository.save(message));
    }

    public void deleteMessage(Long id) {
        if (!contactMessageRepository.existsById(id)) {
            throw new RuntimeException("Contact message not found with id: " + id);
        }
        contactMessageRepository.deleteById(id);
    }

    private ContactMessageResponse toResponse(ContactMessage message) {
        return new ContactMessageResponse(
                message.getId(),
                message.getName(),
                message.getEmail(),
                message.getMessage(),
                message.isRead(),
                message.getCreatedAt());
    }
}
