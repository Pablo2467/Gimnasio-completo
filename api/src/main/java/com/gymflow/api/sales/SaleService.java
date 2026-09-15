package com.gymflow.api.sales;

import com.gymflow.api.common.exception.NotFoundException;
import com.gymflow.api.inventory.Product;
import com.gymflow.api.inventory.ProductService;
import com.gymflow.api.member.Member;
import com.gymflow.api.member.MemberService;
import com.gymflow.api.sales.dto.*;
import com.gymflow.api.user.User;
import com.gymflow.api.user.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class SaleService {

    private final SaleRepository repository;
    private final ProductService productService;
    private final MemberService memberService;
    private final UserRepository userRepository;

    public SaleService(SaleRepository repository, ProductService productService,
                        MemberService memberService, UserRepository userRepository) {
        this.repository = repository;
        this.productService = productService;
        this.memberService = memberService;
        this.userRepository = userRepository;
    }

    @Transactional
    public SaleResponse create(SaleRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User employee = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Usuario autenticado no encontrado"));

        Member member = null;
        if (request.memberId() != null) {
            member = memberService.getEntity(request.memberId());
        }

        Sale sale = Sale.builder()
                .member(member)
                .employee(employee)
                .status(SaleStatus.COMPLETED)
                .total(BigDecimal.ZERO)
                .createdAt(LocalDateTime.now())
                .items(new ArrayList<>())
                .build();

        BigDecimal total = BigDecimal.ZERO;

        for (SaleItemRequest itemReq : request.items()) {
            Product product = productService.getEntity(itemReq.productId());

            if (product.getStock() < itemReq.quantity()) {
                throw new IllegalArgumentException(
                        "Stock insuficiente para \"%s\" (disponible: %d, solicitado: %d)"
                                .formatted(product.getName(), product.getStock(), itemReq.quantity()));
            }

            product.setStock(product.getStock() - itemReq.quantity());
            productService.save(product);

            SaleItem item = SaleItem.builder()
                    .sale(sale)
                    .product(product)
                    .quantity(itemReq.quantity())
                    .unitPrice(product.getPrice())
                    .build();
            sale.getItems().add(item);

            total = total.add(product.getPrice().multiply(BigDecimal.valueOf(itemReq.quantity())));
        }

        sale.setTotal(total);
        Sale saved = repository.save(sale);
        return toResponse(saved);
    }

    public List<SaleResponse> findAll() {
        return repository.findAll().stream().map(this::toResponse).toList();
    }

    public SaleResponse findById(Long id) {
        return toResponse(getEntity(id));
    }

    public Sale getEntity(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Venta no encontrada: " + id));
    }

    @Transactional
    public void cancel(Long id) {
        Sale sale = getEntity(id);
        if (sale.getStatus() != SaleStatus.COMPLETED) {
            throw new IllegalArgumentException("Solo se puede cancelar una venta en estado COMPLETED");
        }

        // Regla de negocio simétrica: cancelar una venta devuelve el stock
        for (SaleItem item : sale.getItems()) {
            Product product = item.getProduct();
            product.setStock(product.getStock() + item.getQuantity());
            productService.save(product);
        }

        sale.setStatus(SaleStatus.CANCELLED);
        repository.save(sale);
    }

    private SaleResponse toResponse(Sale sale) {
        List<SaleItemResponse> items = sale.getItems().stream()
                .map(i -> new SaleItemResponse(
                        i.getProduct().getId(),
                        i.getProduct().getName(),
                        i.getQuantity(),
                        i.getUnitPrice(),
                        i.getUnitPrice().multiply(BigDecimal.valueOf(i.getQuantity()))
                ))
                .toList();

        return new SaleResponse(
                sale.getId(),
                sale.getMember() != null ? sale.getMember().getId() : null,
                sale.getMember() != null ? sale.getMember().getFullName() : null,
                sale.getEmployee().getEmail(),
                sale.getStatus(),
                sale.getTotal(),
                items,
                sale.getCreatedAt()
        );
    }
}
