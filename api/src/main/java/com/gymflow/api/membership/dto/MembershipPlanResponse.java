package com.gymflow.api.membership.dto;

import java.math.BigDecimal;

public record MembershipPlanResponse(
        Long id,
        String name,
        String description,
        BigDecimal price,
        Integer durationDays,
        String imageUrl,
        boolean active
) {}