package com.gymflow.api.member.dto;

import com.gymflow.api.member.MemberStatus;

import java.time.LocalDateTime;

public record MemberResponse(
        Long id,
        String fullName,
        String email,
        String phone,
        String documentId,
        MemberStatus status,
        LocalDateTime createdAt
) {}