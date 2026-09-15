package com.gymflow.api.sales.dto;

import com.gymflow.api.sales.SaleStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record SaleResponse(
        Long id,
        Long memberId,
        String memberName,
        String employeeEmail,
        SaleStatus status,
        BigDecimal total,
        List<SaleItemResponse> items,
        LocalDateTime createdAt
) {}
