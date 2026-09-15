package com.gymflow.api.audit;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Aspect
@Component
public class AuditAspect {

    private final AuditLogRepository repository;

    public AuditAspect(AuditLogRepository repository) {
        this.repository = repository;
    }

    @AfterReturning("@annotation(auditable)")
    public void logAction(JoinPoint joinPoint, Auditable auditable) {
        String email = "SYSTEM";
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            email = authentication.getName();
        }

        AuditLog log = AuditLog.builder()
                .action(auditable.action())
                .performedBy(email)
                .methodName(joinPoint.getSignature().toShortString())
                .timestamp(LocalDateTime.now())
                .build();

        repository.save(log);
    }
}