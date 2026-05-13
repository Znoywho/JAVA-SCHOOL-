package com.bikemarket.dto;

import com.bikemarket.enums.InspectorReportStatus;
import lombok.Data;

@Data
public class InspectorReportRequestDTO {
    private Long productId;
    private Long inspectorId;
    private Double scoreRating;
    private String reportDetails;
    private InspectorReportStatus status;
}
