package com.gymflow.api.payment;

import com.gymflow.api.audit.Auditable;
import com.gymflow.api.membership.Membership;
import com.gymflow.api.membership.MembershipService;
import com.gymflow.api.payment.dto.PaymentRequest;
import com.gymflow.api.payment.dto.PaymentResponse;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class PaymentService {

    private final PaymentRepository repository;
    private final MembershipService membershipService;

    public PaymentService(PaymentRepository repository, MembershipService membershipService) {
        this.repository = repository;
        this.membershipService = membershipService;
    }

    @Auditable(action = "CREATE_PAYMENT")
    public PaymentResponse create(PaymentRequest request) {
        Membership membership = membershipService.getEntity(request.membershipId());

        BigDecimal expectedPrice = membership.getPlan().getPrice();
        if (request.amount().compareTo(expectedPrice) != 0) {
            throw new IllegalArgumentException(
                    "El monto (%s) no coincide con el precio del plan (%s)"
                            .formatted(request.amount(), expectedPrice));
        }

        Payment payment = Payment.builder()
                .membership(membership)
                .amount(request.amount())
                .method(request.method())
                .status(PaymentStatus.COMPLETED)   // simulamos pago exitoso inmediato (sin pasarela real)
                .paidAt(LocalDateTime.now())
                .createdAt(LocalDateTime.now())
                .build();

        Payment saved = repository.save(payment);

        // Regla de negocio central de la semana:
        membershipService.activate(membership.getId());

        return toResponse(saved);
    }

    private PaymentResponse toResponse(Payment p) {
        return new PaymentResponse(p.getId(), p.getMembership().getId(), p.getAmount(),
                p.getMethod(), p.getStatus(), p.getPaidAt());
    }
}