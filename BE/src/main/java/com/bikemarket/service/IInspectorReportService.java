package com.bikemarket.service;

import com.bikemarket.entity.InspectorReport;

import java.util.List;


public interface IInspectorReport {
    InspectorReport createInspectorReport(InspectorReport inspectorReport);
    List<InspectorReport> getAllInspectorReports();
    InspectorReport getInspectorReportById(Long id);
    InspectorReport updateInspectorReport(Long id, InspectorReport inspectorReport);
    void deleteInspectorReport(Long id);
}