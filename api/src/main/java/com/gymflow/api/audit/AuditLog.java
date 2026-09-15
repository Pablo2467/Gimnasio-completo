package com.gymflow.api.audit;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String action;

    @Column(name = "performed_by", nullable = false)
    private String performedBy; 

    @Column(name = "method_name", nullable = false)
    private String methodName;

    @Column(nullable = false)
    private LocalDateTime timestamp;
}