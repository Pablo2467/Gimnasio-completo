package com.gymflow.api.membership.dto;

import com.gymflow.api.membership.MembershipStatus;
import java.time.LocalDate;

public record MembershipResponse(
        Long id,
        Long memberId,
        String memberName,
        String planName,
        LocalDate startDate,
        LocalDate endDate,
        MembershipStatus status
) {}