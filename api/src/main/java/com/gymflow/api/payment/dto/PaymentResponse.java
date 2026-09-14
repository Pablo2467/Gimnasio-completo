package com.gymflow.api.payment.dto;

import com.gymflow.api.payment.PaymentMethod;
import com.gymflow.api.payment.PaymentStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PaymentResponse(
        Long id,
        Long membershipId,
        BigDecimal amount,
        PaymentMethod method,
        PaymentStatus status,
        LocalDateTime paidAt
) {}
