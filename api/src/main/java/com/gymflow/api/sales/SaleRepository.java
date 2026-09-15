package com.gymflow.api.sales;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SaleRepository extends JpaRepository<Sale, Long> {
    long countByStatusAndCreatedAtBetween(SaleStatus status, LocalDateTime start, LocalDateTime end);

    @org.springframework.data.jpa.repository.Query(
    "SELECT COALESCE(SUM(s.total), 0) FROM Sale s WHERE s.status = 'COMPLETED' AND s.createdAt BETWEEN :start AND :end"
    )
    BigDecimal sumRevenueBetween(LocalDateTime start, LocalDateTime end);
}