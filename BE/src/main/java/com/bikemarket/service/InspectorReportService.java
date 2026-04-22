package com.bikemarket.service;

import com.bikemarket.entity.InspectorReport;
import com.bikemarket.exception.ResourceNotFoundException;
import com.bikemarket.repository.InspectorReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.util.List;

@Service
@Transactional
public class InspectorReportService implements IInspectorReport {

    @Autowired
    private InspectorReportRepository inspectorReportRepository;

    @Override
    public InspectorReport createInspectorReport(InspectorReport inspectorReport) {
        return inspectorReportRepository.save(inspectorReport);
    }

    @Override
    public List<InspectorReport> getAllInspectorReports() {
        return inspectorReportRepository.findAll();
    }

    @Override
    public InspectorReport getInspectorReportById(Long id) {
        return inspectorReportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inspector report not found with id: " + id));
    }

    @Override
    public InspectorReport updateInspectorReport(Long id, InspectorReport inspectorReport) {
        InspectorReport existingReport = getInspectorReportById(id);

        if (inspectorReport.getProduct() != null) {
            existingReport.setProduct(inspectorReport.getProduct());
        }
        if (inspectorReport.getInspectorId() != null) {
            existingReport.setInspectorId(inspectorReport.getInspectorId());
        }
        if (inspectorReport.getStatus() != null) {
            existingReport.setStatus(inspectorReport.getStatus());
        }
        if (inspectorReport.getReport_details() != null) {
            existingReport.setReport_details(inspectorReport.getReport_details());
        }
        if (inspectorReport.getScore_rating() != 0.0) {
            existingReport.setScore_rating(inspectorReport.getScore_rating());
        }

        return inspectorReportRepository.save(existingReport);
    }

    @Override
    public void deleteInspectorReport(Long id) {
        if (!inspectorReportRepository.existsById(id)) {
            throw new ResourceNotFoundException("Inspector report not found with id: " + id);
        }
        inspectorReportRepository.deleteById(id);
    }
}

