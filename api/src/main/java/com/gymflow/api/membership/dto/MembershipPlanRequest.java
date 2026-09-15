package com.gymflow.api.membership.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

public record MembershipPlanRequest(
        @NotBlank String name,
        String description,
        @NotNull @Positive BigDecimal price,
        @NotNull @Positive Integer durationDays,
        String imageUrl 
) {}