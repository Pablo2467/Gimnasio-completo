package com.gymflow.api.member;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findByEmail(String email);
    Optional<Member> findByDocumentId(String documentId);
    long countByStatus(MemberStatus status);
}