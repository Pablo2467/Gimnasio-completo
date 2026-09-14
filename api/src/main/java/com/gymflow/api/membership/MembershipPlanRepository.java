package com.gymflow.api.membership;

import org.springframework.data.jpa.repository.JpaRepository;

public interface MembershipPlanRepository extends JpaRepository<MembershipPlan, Long> {
    java.util.List<MembershipPlan> findByActiveTrue();
}