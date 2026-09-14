package com.gymflow.api.membership;

import com.gymflow.api.membership.dto.MembershipRequest;
import com.gymflow.api.membership.dto.MembershipResponse;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class MembershipController {

    private final MembershipService service;

    public MembershipController(MembershipService service) {
        this.service = service;
    }

    @PostMapping("/members/{memberId}/memberships")
    public MembershipResponse create(@PathVariable Long memberId, @Valid @RequestBody MembershipRequest request) {
        return service.create(memberId, request.planId());
    }

    @GetMapping("/members/{memberId}/memberships")
    public List<MembershipResponse> findByMember(@PathVariable Long memberId) {
        return service.findByMember(memberId);
    }

    @GetMapping("/memberships/{id}")
    public MembershipResponse findById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping("/memberships/{id}/cancel")
    @PreAuthorize("hasRole('ADMIN')")
    public void cancel(@PathVariable Long id) {
        service.cancel(id);
    }
}