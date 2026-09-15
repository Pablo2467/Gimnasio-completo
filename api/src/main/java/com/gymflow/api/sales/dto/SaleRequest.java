package com.gymflow.api.sales.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public record SaleRequest(
        Long memberId,  
        @NotEmpty @Valid List<SaleItemRequest> items
) {}
