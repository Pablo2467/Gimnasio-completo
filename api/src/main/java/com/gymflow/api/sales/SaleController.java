package com.gymflow.api.sales;

import com.gymflow.api.sales.dto.SaleRequest;
import com.gymflow.api.sales.dto.SaleResponse;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sales")
public class SaleController {

    private final SaleService service;

    public SaleController(SaleService service) {
        this.service = service;
    }

    @PostMapping
    public SaleResponse create(@Valid @RequestBody SaleRequest request) {
        return service.create(request);
    }

    @GetMapping
    public List<SaleResponse> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public SaleResponse findById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping("/{id}/cancel")
    @PreAuthorize("hasRole('ADMIN')")
    public void cancel(@PathVariable Long id) {
        service.cancel(id);
    }
}
