package com.bikemarket.controller;

import com.bikemarket.dto.ApiResponse;
import com.bikemarket.dto.InspectorReportRequestDTO;
import com.bikemarket.entity.InspectorReport;
import com.bikemarket.service.InspectorReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/inspector-reports")
public class InspectorReportController {

    @Autowired
    private InspectorReportService inspectorReportService;

    @PostMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> createInspectorReport(@RequestBody InspectorReportRequestDTO request) {
        InspectorReport createdReport = inspectorReportService.createInspectorReport(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(toResponse(createdReport), "Inspector report created successfully"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getAllInspectorReports() {
        return ResponseEntity.ok(ApiResponse.ok(
                inspectorReportService.getAllInspectorReports().stream().map(this::toResponse).toList(),
                "Inspector reports retrieved successfully"
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getInspectorReportById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(toResponse(inspectorReportService.getInspectorReportById(id))));
    }

    @GetMapping("/inspector/{inspectorId}")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getReportsByInspector(@PathVariable Long inspectorId) {
        return ResponseEntity.ok(ApiResponse.ok(
                inspectorReportService.getReportsByInspector(inspectorId).stream().map(this::toResponse).toList()
        ));
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getReportsByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(ApiResponse.ok(
                inspectorReportService.getReportsByProduct(productId).stream().map(this::toResponse).toList()
        ));
    }

    @GetMapping("/product/{productId}/latest")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getLatestReportByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(ApiResponse.ok(toResponse(inspectorReportService.getLatestReportByProduct(productId))));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateInspectorReport(
            @PathVariable Long id,
            @RequestBody InspectorReportRequestDTO request
    ) {
        InspectorReport updatedReport = inspectorReportService.updateInspectorReport(id, request);
        return ResponseEntity.ok(ApiResponse.ok(toResponse(updatedReport), "Inspector report updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInspectorReport(@PathVariable Long id) {
        inspectorReportService.deleteInspectorReport(id);
        return ResponseEntity.noContent().build();
    }

    private Map<String, Object> toResponse(InspectorReport report) {
        Map<String, Object> data = new HashMap<>();
        data.put("id", report.getId());
        data.put("productId", report.getProduct() != null ? report.getProduct().getId() : null);
        data.put("productTitle", report.getProduct() != null ? report.getProduct().getTitle() : null);
        data.put("inspectorId", report.getInspectorId() != null ? report.getInspectorId().getId() : null);
        data.put("inspectorName", report.getInspectorId() != null ? report.getInspectorId().getName() : null);
        data.put("createdAt", report.getCreated_at());
        data.put("status", report.getStatus() != null ? report.getStatus().name() : null);
        data.put("scoreRating", report.getScore_rating());
        data.put("reportDetails", report.getReport_details());
        return data;
    }
}
