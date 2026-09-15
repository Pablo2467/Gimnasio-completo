package com.gymflow.api.dashboard;

import com.gymflow.api.member.MemberRepository;
import com.gymflow.api.member.MemberStatus;
import com.gymflow.api.membership.MembershipRepository;
import com.gymflow.api.membership.MembershipStatus;
import com.gymflow.api.sales.SaleRepository;
import com.gymflow.api.sales.SaleStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;

@Service
public class DashboardService {

    private final MemberRepository memberRepository;
    private final MembershipRepository membershipRepository;
    private final SaleRepository saleRepository;

    public DashboardService(MemberRepository memberRepository,
                             MembershipRepository membershipRepository,
                             SaleRepository saleRepository) {
        this.memberRepository = memberRepository;
        this.membershipRepository = membershipRepository;
        this.saleRepository = saleRepository;
    }

    public DashboardSummary getSummary() {
        long activeMembers = memberRepository.countByStatus(MemberStatus.ACTIVE);
        long activeMemberships = membershipRepository.countByStatus(MembershipStatus.ACTIVE);

        YearMonth thisMonth = YearMonth.now();
        LocalDateTime monthStart = thisMonth.atDay(1).atStartOfDay();
        LocalDateTime monthEnd = thisMonth.atEndOfMonth().atTime(23, 59, 59);
        var revenueThisMonth = saleRepository.sumRevenueBetween(monthStart, monthEnd);

        LocalDate today = LocalDate.now();
        long salesToday = saleRepository.countByStatusAndCreatedAtBetween(
                SaleStatus.COMPLETED, today.atStartOfDay(), today.atTime(23, 59, 59));

        return new DashboardSummary(activeMembers, activeMemberships, revenueThisMonth, salesToday);
    }
}
