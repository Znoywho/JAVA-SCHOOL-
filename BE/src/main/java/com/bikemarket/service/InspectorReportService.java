package com.bikemarket.service;

import com.bikemarket.dto.InspectorReportRequestDTO;
import com.bikemarket.entity.InspectorReport;
import com.bikemarket.entity.Product;
import com.bikemarket.entity.User;
import com.bikemarket.enums.InspectorReportStatus;
import com.bikemarket.enums.Role;
import com.bikemarket.exception.ResourceNotFoundException;
import com.bikemarket.repository.InspectorReportRepository;
import com.bikemarket.repository.ProductRepository;
import com.bikemarket.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.util.List;

@Service
@Transactional
public class InspectorReportService implements IInspectorReportService {

    @Autowired
    private InspectorReportRepository inspectorReportRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public InspectorReport createInspectorReport(InspectorReport inspectorReport) {
        return inspectorReportRepository.save(inspectorReport);
    }

    @Override
    public InspectorReport createInspectorReport(InspectorReportRequestDTO request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + request.getProductId()));
        User inspector = userRepository.findById(request.getInspectorId())
                .orElseThrow(() -> new ResourceNotFoundException("Inspector not found with id: " + request.getInspectorId()));

        if (inspector.getRole() != Role.INSPECTOR) {
            throw new IllegalArgumentException("User is not an inspector");
        }

        InspectorReport report = new InspectorReport(
                product,
                inspector,
                request.getScoreRating() != null ? request.getScoreRating() : 0.0,
                request.getReportDetails()
        );
        report.setStatus(request.getStatus() != null ? request.getStatus() : InspectorReportStatus.PENDING);
        return inspectorReportRepository.save(report);
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
    public List<InspectorReport> getReportsByInspector(Long inspectorId) {
        return inspectorReportRepository.findByInspector(inspectorId);
    }

    @Override
    public List<InspectorReport> getReportsByProduct(Long productId) {
        return inspectorReportRepository.findByProduct(productId);
    }

    @Override
    public InspectorReport getLatestReportByProduct(Long productId) {
        return inspectorReportRepository.findLatestByProduct(productId).stream()
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Inspector report not found for product id: " + productId));
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
    public InspectorReport updateInspectorReport(Long id, InspectorReportRequestDTO request) {
        InspectorReport existingReport = getInspectorReportById(id);

        if (request.getProductId() != null) {
            Product product = productRepository.findById(request.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + request.getProductId()));
            existingReport.setProduct(product);
        }
        if (request.getInspectorId() != null) {
            User inspector = userRepository.findById(request.getInspectorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Inspector not found with id: " + request.getInspectorId()));
            if (inspector.getRole() != Role.INSPECTOR) {
                throw new IllegalArgumentException("User is not an inspector");
            }
            existingReport.setInspectorId(inspector);
        }
        if (request.getStatus() != null) {
            existingReport.setStatus(request.getStatus());
        }
        if (request.getReportDetails() != null) {
            existingReport.setReport_details(request.getReportDetails());
        }
        if (request.getScoreRating() != null) {
            existingReport.setScore_rating(request.getScoreRating());
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

