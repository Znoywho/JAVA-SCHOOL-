package com.bikemarket.repository;

import com.bikemarket.entity.ShippingCompany;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IShippingCompanyRepository extends JpaRepository<ShippingCompany, Long> {
    List<ShippingCompany> findByActiveTrueOrderByBaseFeeAsc();

    Optional<ShippingCompany> findByCode(String code);
}
