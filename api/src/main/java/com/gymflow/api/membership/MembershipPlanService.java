package com.gymflow.api.membership;

import com.gymflow.api.common.exception.NotFoundException;
import com.gymflow.api.membership.dto.MembershipPlanRequest;
import com.gymflow.api.membership.dto.MembershipPlanResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public MembershipPlanResponse create(MembershipPlanRequest request) {
    MembershipPlan plan = MembershipPlan.builder()
            .name(request.name())
            .description(request.description())
            .price(request.price())
            .durationDays(request.durationDays())
            .imageUrl(request.imageUrl())   // nuevo
            .active(true)
            .build();
    return toResponse(repository.save(plan));
}

public MembershipPlanResponse update(Long id, MembershipPlanRequest request) {
    MembershipPlan plan = getEntity(id);
    plan.setName(request.name());
    plan.setDescription(request.description());
    plan.setPrice(request.price());
    plan.setDurationDays(request.durationDays());
    plan.setImageUrl(request.imageUrl());   // nuevo
    return toResponse(repository.save(plan));
}

private MembershipPlanResponse toResponse(MembershipPlan p) {
    return new MembershipPlanResponse(p.getId(), p.getName(), p.getDescription(),
            p.getPrice(), p.getDurationDays(), p.getImageUrl(), p.isActive());
}