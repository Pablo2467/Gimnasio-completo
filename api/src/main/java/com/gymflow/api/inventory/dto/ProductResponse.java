package com.gymflow.api.inventory.dto;

import java.math.BigDecimal;

public record ProductResponse(
        Long id,
        String name,
        String category,
        BigDecimal price,
        Integer stock,
        String description,
        String imageUrl
) {}