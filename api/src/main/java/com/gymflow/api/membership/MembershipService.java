package com.gymflow.api.membership;

import com.gymflow.api.audit.Auditable;
import com.gymflow.api.common.exception.NotFoundException;
import com.gymflow.api.member.Member;
import com.gymflow.api.member.MemberService;
import com.gymflow.api.member.MemberStatus;
import com.gymflow.api.membership.dto.MembershipResponse;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class MembershipService {

    private final MembershipRepository repository;
    private final MemberService memberService;
    private final MembershipPlanService planService;

    public MembershipService(MembershipRepository repository, MemberService memberService,
                              MembershipPlanService planService) {
        this.repository = repository;
        this.memberService = memberService;
        this.planService = planService;
    }

    public MembershipResponse create(Long memberId, Long planId) {
        Member member = memberService.getEntity(memberId);
        if (member.getStatus() != MemberStatus.ACTIVE) {
            throw new IllegalArgumentException("El cliente está inactivo, no puede contratar un plan");
        }

        MembershipPlan plan = planService.getEntity(planId);
        if (!plan.isActive()) {
            throw new IllegalArgumentException("El plan seleccionado ya no está disponible");
        }

        LocalDate start = LocalDate.now();
        Membership membership = Membership.builder()
                .member(member)
                .plan(plan)
                .startDate(start)
                .endDate(start.plusDays(plan.getDurationDays()))
                .status(MembershipStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();

        return toResponse(repository.save(membership));
    }

    public List<MembershipResponse> findByMember(Long memberId) {
        return repository.findByMemberId(memberId).stream()
                .map(this::recalculateIfExpired)
                .map(this::toResponse)
                .toList();
    }

    public MembershipResponse findById(Long id) {
        return toResponse(recalculateIfExpired(getEntity(id)));
    }

    public Membership getEntity(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Membresía no encontrada: " + id));
    }

    // Regla de negocio: una membresía PENDING solo pasa a ACTIVE cuando hay un pago COMPLETED (lo llama PaymentService)
    public void activate(Long membershipId) {
        Membership membership = getEntity(membershipId);
        if (membership.getStatus() != MembershipStatus.PENDING) {
            throw new IllegalArgumentException("Solo se puede activar una membresía en estado PENDING");
        }
        membership.setStatus(MembershipStatus.ACTIVE);
        repository.save(membership);
    }

    @Auditable(action = "CANCEL_MEMBERSHIP")
    public void cancel(Long membershipId) {
        Membership membership = getEntity(membershipId);
        membership.setStatus(MembershipStatus.CANCELLED);
        repository.save(membership);
    }

    // Regla de negocio: si ya pasó la fecha de fin y sigue marcada ACTIVE, se recalcula a EXPIRED
    private Membership recalculateIfExpired(Membership m) {
        if (m.getStatus() == MembershipStatus.ACTIVE && m.getEndDate().isBefore(LocalDate.now())) {
            m.setStatus(MembershipStatus.EXPIRED);
            repository.save(m);
        }
        return m;
    }

    private MembershipResponse toResponse(Membership m) {
        return new MembershipResponse(m.getId(), m.getMember().getId(), m.getMember().getFullName(),
                m.getPlan().getName(), m.getStartDate(), m.getEndDate(), m.getStatus());
    }
}