package com.gymflow.api.membership;

import com.gymflow.api.member.Member;
import com.gymflow.api.member.MemberRepository;
import com.gymflow.api.member.MemberStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class MembershipIntegrationTest {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private MemberRepository memberRepository;
    @Autowired
    private MembershipPlanRepository planRepository;

    private Long memberId;
    private Long planId;

    @BeforeEach
    void setUp() {
        Member member = memberRepository.save(Member.builder()
                .fullName("Integración Test")
                .email("integracion@test.com")
                .documentId("999999")
                .status(MemberStatus.ACTIVE)
                .createdAt(LocalDateTime.now())
                .build());
        memberId = member.getId();

        MembershipPlan plan = planRepository.save(MembershipPlan.builder()
                .name("Plan Test")
                .price(BigDecimal.valueOf(50000))
                .durationDays(30)
                .active(true)
                .build());
        planId = plan.getId();
    }

    @Test
    @WithMockUser(username = "admin@gymflow.com", roles = "ADMIN")
    void contratarPlan_deberiaQuedarEnPending() throws Exception {
        mockMvc.perform(post("/members/{id}/memberships", memberId)
                        .contentType("application/json")
                        .content("{\"planId\": " + planId + "}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("PENDING"))
                .andExpect(jsonPath("$.planName").value("Plan Test"));
    }

    @Test
    void sinToken_deberiaRechazarConNoAutorizado() throws Exception {
        
        mockMvc.perform(post("/members/{id}/memberships", memberId)
                        .contentType("application/json")
                        .content("{\"planId\": " + planId + "}"))
                .andExpect(status().is4xxClientError());
    }
}
