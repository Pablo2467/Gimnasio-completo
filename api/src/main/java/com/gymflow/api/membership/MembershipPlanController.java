package com.gymflow.api.membership;

import com.gymflow.api.membership.dto.MembershipPlanRequest;
import com.gymflow.api.membership.dto.MembershipPlanResponse;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/membership-plans")
public class MembershipPlanController {

    private final MembershipPlanService service;

    public MembershipPlanController(MembershipPlanService service) {
        this.service = service;
    }

    @GetMapping
    public List<MembershipPlanResponse> findAll() {
        return service.findAllActive();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public MembershipPlanResponse create(@Valid @RequestBody MembershipPlanRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public MembershipPlanResponse update(@PathVariable Long id, @Valid @RequestBody MembershipPlanRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deactivate(@PathVariable Long id) {
        service.deactivate(id);
    }
}