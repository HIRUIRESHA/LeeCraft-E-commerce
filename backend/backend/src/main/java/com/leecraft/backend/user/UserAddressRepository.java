package com.leecraft.backend.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserAddressRepository extends JpaRepository<UserAddress, Long> {

    List<UserAddress> findByUserOrderByIsDefaultDescCreatedAtDesc(User user);

    Optional<UserAddress> findByIdAndUser(Long id, User user);
}
