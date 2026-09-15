package com.gymflow.api.sales.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record SaleItemRequest(
        @NotNull Long productId,
        @NotNull @Positive Integer quantity
) {}