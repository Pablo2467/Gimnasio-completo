package com.gymflow.api.dashboard;

import java.math.BigDecimal;

public record DashboardSummary(
        long activeMembers,
        long activeMemberships,
        BigDecimal revenueThisMonth,
        long salesToday
) {}