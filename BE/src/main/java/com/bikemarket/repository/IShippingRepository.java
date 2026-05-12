package com.bikemarket.repository;

import com.bikemarket.entity.Shipping;
import com.bikemarket.enums.ShippingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IShippingRepository extends JpaRepository<Shipping, Long> {
    Optional<Shipping> findByOrderId(Long orderId);

    List<Shipping> findByShippingCompanyId(Long shippingCompanyId);

    List<Shipping> findByStatus(ShippingStatus status);
}
