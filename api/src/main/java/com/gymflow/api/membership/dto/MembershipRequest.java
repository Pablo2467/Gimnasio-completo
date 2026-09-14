package com.gymflow.api.membership.dto;

import jakarta.validation.constraints.NotNull;

public record MembershipRequest(
        @NotNull Long planId
) {}
