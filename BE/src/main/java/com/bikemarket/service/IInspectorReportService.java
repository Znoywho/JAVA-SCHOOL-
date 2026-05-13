package com.bikemarket.service;

import com.bikemarket.dto.InspectorReportRequestDTO;
import com.bikemarket.entity.InspectorReport;

import java.util.List;


public interface IInspectorReportService {
    InspectorReport createInspectorReport(InspectorReport inspectorReport);
    InspectorReport createInspectorReport(InspectorReportRequestDTO request);
    List<InspectorReport> getAllInspectorReports();
    InspectorReport getInspectorReportById(Long id);
    List<InspectorReport> getReportsByInspector(Long inspectorId);
    List<InspectorReport> getReportsByProduct(Long productId);
    InspectorReport getLatestReportByProduct(Long productId);
    InspectorReport updateInspectorReport(Long id, InspectorReport inspectorReport);
    InspectorReport updateInspectorReport(Long id, InspectorReportRequestDTO request);
    void deleteInspectorReport(Long id);
}
