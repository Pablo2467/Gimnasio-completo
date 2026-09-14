package com.gymflow.api.payment.dto;

import com.gymflow.api.payment.PaymentMethod;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

public record PaymentRequest(
        @NotNull Long membershipId,
        @NotNull @Positive BigDecimal amount,
        @NotNull PaymentMethod method
) {}
