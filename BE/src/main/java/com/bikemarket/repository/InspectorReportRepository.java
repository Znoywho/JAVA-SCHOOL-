package com.bikemarket.repository;

import com.bikemarket.entity.InspectorReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InspectorReportRepository extends JpaRepository<InspectorReport, Long> {
    @Query("SELECT r FROM InspectorReport r LEFT JOIN FETCH r.product p LEFT JOIN FETCH r.InspectorId i WHERE i.Id = :inspectorId ORDER BY r.created_at DESC")
    List<InspectorReport> findByInspector(@Param("inspectorId") Long inspectorId);

    @Query("SELECT r FROM InspectorReport r LEFT JOIN FETCH r.product p LEFT JOIN FETCH r.InspectorId i WHERE p.Id = :productId ORDER BY r.created_at DESC")
    List<InspectorReport> findByProduct(@Param("productId") Long productId);

    @Query("SELECT r FROM InspectorReport r LEFT JOIN FETCH r.product p LEFT JOIN FETCH r.InspectorId i WHERE p.Id = :productId ORDER BY r.created_at DESC")
    List<InspectorReport> findLatestByProduct(@Param("productId") Long productId);
}

