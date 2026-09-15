package com.gymflow.api.member;

import com.gymflow.api.common.exception.NotFoundException;
import com.gymflow.api.member.dto.MemberRequest;
import com.gymflow.api.member.dto.MemberResponse;
import org.springframework.stereotype.Service;
import com.gymflow.api.audit.Auditable;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MemberService {

    private final MemberRepository repository;

    public MemberService(MemberRepository repository) {
        this.repository = repository;
    }

    public List<MemberResponse> findAll() {
        return repository.findAll().stream().map(this::toResponse).toList();
    }

    public MemberResponse findById(Long id) {
        return toResponse(getEntity(id));
    }

    public Member getEntity(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Cliente no encontrado: " + id));
    }

    public MemberResponse create(MemberRequest request) {
        repository.findByEmail(request.email()).ifPresent(m -> {
            throw new IllegalArgumentException("Ya existe un cliente con ese email");
        });
        repository.findByDocumentId(request.documentId()).ifPresent(m -> {
            throw new IllegalArgumentException("Ya existe un cliente con ese documento");
        });

        Member member = Member.builder()
                .fullName(request.fullName())
                .email(request.email())
                .phone(request.phone())
                .documentId(request.documentId())
                .status(MemberStatus.ACTIVE)
                .createdAt(LocalDateTime.now())
                .build();

        return toResponse(repository.save(member));
    }

    public MemberResponse update(Long id, MemberRequest request) {
        Member member = getEntity(id);
        member.setFullName(request.fullName());
        member.setEmail(request.email());
        member.setPhone(request.phone());
        member.setDocumentId(request.documentId());
        return toResponse(repository.save(member));
    }

    @Auditable(action = "DEACTIVATE_MEMBER")
    public void deactivate(Long id) {
        Member member = getEntity(id);
        member.setStatus(MemberStatus.INACTIVE);
        repository.save(member);
    }

    private MemberResponse toResponse(Member m) {
        return new MemberResponse(m.getId(), m.getFullName(), m.getEmail(), m.getPhone(),
                m.getDocumentId(), m.getStatus(), m.getCreatedAt());
    }
}