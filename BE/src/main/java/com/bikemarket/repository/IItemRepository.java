package com.bikemarket.repository;

import com.bikemarket.entity.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

@Repository
public interface IItemRepository extends JpaRepository<Item, Long> {
    @Query("SELECT i FROM Item i WHERE i.cart.Id = :cartId")
    List<Item> findByCartId(@Param("cartId") long cartId);

    @Query("SELECT i FROM Item i WHERE i.cart.Id = :cartId AND i.product.Id = :productId")
    Optional<Item> findByCartIdAndProductId(@Param("cartId") long cartId, @Param("productId") long productId);

    @Query("DELETE FROM Item i WHERE i.cart.Id = :cartId AND i.product.Id = :productId")
    @Modifying
    void deleteByCartIdAndProductId(@Param("cartId") long cartId, @Param("productId") long productId);
}
