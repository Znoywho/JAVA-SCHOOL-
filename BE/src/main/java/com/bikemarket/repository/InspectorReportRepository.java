package com.bikemarket.repository;

import com.bikemarket.entity.InspectorReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InspectorReportRepository extends JpaRepository<InspectorReport, Long> {

}

