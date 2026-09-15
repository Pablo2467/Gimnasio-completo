package com.gymflow.api.inventory;

import com.gymflow.api.common.exception.NotFoundException;
import com.gymflow.api.inventory.dto.ProductRequest;
import com.gymflow.api.inventory.dto.ProductResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository repository;

    public ProductService(ProductRepository repository) {
        this.repository = repository;
    }

    public List<ProductResponse> findAll() {
        return repository.findAll().stream().map(this::toResponse).toList();
    }

    public ProductResponse findById(Long id) {
        return toResponse(getEntity(id));
    }

    public Product getEntity(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Producto no encontrado: " + id));
    }

    public ProductResponse create(ProductRequest request) {
        Product product = Product.builder()
                .name(request.name())
                .category(request.category())
                .price(request.price())
                .stock(request.stock())
                .description(request.description())
                .imageUrl(request.imageUrl())
                .build();
        return toResponse(repository.save(product));
    }

    public ProductResponse update(Long id, ProductRequest request) {
        Product product = getEntity(id);
        product.setName(request.name());
        product.setCategory(request.category());
        product.setPrice(request.price());
        product.setStock(request.stock());
        product.setDescription(request.description());
        product.setImageUrl(request.imageUrl());
        return toResponse(repository.save(product));
    }

    public void delete(Long id) {
        repository.delete(getEntity(id));
    }

    public Product save(Product product) {
        return repository.save(product);
    }

    private ProductResponse toResponse(Product p) {
        return new ProductResponse(p.getId(), p.getName(), p.getCategory(), p.getPrice(),
                p.getStock(), p.getDescription(), p.getImageUrl());
    }
}