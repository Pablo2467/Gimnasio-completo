package com.gymflow.api.membership;

import com.gymflow.api.member.Member;
import com.gymflow.api.member.MemberService;
import com.gymflow.api.member.MemberStatus;
import com.gymflow.api.membership.dto.MembershipResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MembershipServiceTest {

    @Mock
    private MembershipRepository repository;
    @Mock
    private MemberService memberService;
    @Mock
    private MembershipPlanService planService;

    @InjectMocks
    private MembershipService membershipService;

    private Member activeMember;
    private MembershipPlan activePlan;

    @BeforeEach
    void setUp() {
        activeMember = Member.builder()
                .id(1L)
                .fullName("Cliente de prueba")
                .status(MemberStatus.ACTIVE)
                .build();

        activePlan = MembershipPlan.builder()
                .id(10L)
                .name("Básico")
                .price(BigDecimal.valueOf(70000))
                .durationDays(30)
                .active(true)
                .build();
    }

    @Test
    void create_deberiaCrearMembresiaEnEstadoPending() {
        when(memberService.getEntity(1L)).thenReturn(activeMember);
        when(planService.getEntity(10L)).thenReturn(activePlan);
        when(repository.save(any(Membership.class))).thenAnswer(inv -> {
            Membership m = inv.getArgument(0);
            m.setId(100L);
            return m;
        });

        MembershipResponse response = membershipService.create(1L, 10L);

        assertThat(response.status()).isEqualTo(MembershipStatus.PENDING);
        assertThat(response.endDate()).isEqualTo(LocalDate.now().plusDays(30));
        verify(repository).save(any(Membership.class));
    }

    @Test
    void create_deberiaRechazarSiElClienteEstaInactivo() {
        activeMember.setStatus(MemberStatus.INACTIVE);
        when(memberService.getEntity(1L)).thenReturn(activeMember);

        assertThatThrownBy(() -> membershipService.create(1L, 10L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("inactivo");

        verify(repository, never()).save(any());
    }

    @Test
    void create_deberiaRechazarSiElPlanEstaDesactivado() {
        activePlan.setActive(false);
        when(memberService.getEntity(1L)).thenReturn(activeMember);
        when(planService.getEntity(10L)).thenReturn(activePlan);

        assertThatThrownBy(() -> membershipService.create(1L, 10L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("disponible");

        verify(repository, never()).save(any());
    }

    @Test
    void activate_deberiaActivarUnaMembresiaPending() {
        Membership pending = Membership.builder().id(100L).status(MembershipStatus.PENDING).build();
        when(repository.findById(100L)).thenReturn(java.util.Optional.of(pending));

        membershipService.activate(100L);

        assertThat(pending.getStatus()).isEqualTo(MembershipStatus.ACTIVE);
        verify(repository).save(pending);
    }

    @Test
    void activate_deberiaRechazarSiNoEstaPending() {
        Membership active = Membership.builder().id(100L).status(MembershipStatus.ACTIVE).build();
        when(repository.findById(100L)).thenReturn(java.util.Optional.of(active));

        assertThatThrownBy(() -> membershipService.activate(100L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("PENDING");

        verify(repository, never()).save(any());
    }

    @Test
    void cancel_deberiaMarcarComoCancelled() {
        Membership active = Membership.builder().id(100L).status(MembershipStatus.ACTIVE).build();
        when(repository.findById(100L)).thenReturn(java.util.Optional.of(active));

        membershipService.cancel(100L);

        assertThat(active.getStatus()).isEqualTo(MembershipStatus.CANCELLED);
        verify(repository).save(active);
    }
}
