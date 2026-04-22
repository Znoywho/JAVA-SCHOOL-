package com.bikemarket.controller;

import com.bikemarket.entity.InspectorReport;
import com.bikemarket.service.InspectorReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inspector-reports")
public class InspectorReportController {

    @Autowired
    private InspectorReportService inspectorReportService;

    @PostMapping
    public ResponseEntity<InspectorReport> createInspectorReport(@RequestBody InspectorReport inspectorReport) {
        InspectorReport createdReport = inspectorReportService.createInspectorReport(inspectorReport);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdReport);
    }

    @GetMapping
    public ResponseEntity<List<InspectorReport>> getAllInspectorReports() {
        return ResponseEntity.ok(inspectorReportService.getAllInspectorReports());
    }

    @GetMapping("/{id}")
    public ResponseEntity<InspectorReport> getInspectorReportById(@PathVariable Long id) {
        return ResponseEntity.ok(inspectorReportService.getInspectorReportById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<InspectorReport> updateInspectorReport(
            @PathVariable Long id,
            @RequestBody InspectorReport inspectorReport
    ) {
        InspectorReport updatedReport = inspectorReportService.updateInspectorReport(id, inspectorReport);
        return ResponseEntity.ok(updatedReport);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInspectorReport(@PathVariable Long id) {
        inspectorReportService.deleteInspectorReport(id);
        return ResponseEntity.noContent().build();
    }
}
