package com.gymflow.api.auth;

public record TokenResponse(
        String accessToken,
        String role
) {}
