package com.javaecommerce.service;

import com.javaecommerce.dto.common.PageResponse;
import com.javaecommerce.dto.product.ProductRequest;
import com.javaecommerce.dto.product.ProductResponse;
import com.javaecommerce.entity.Category;
import com.javaecommerce.entity.Product;
import com.javaecommerce.exception.ResourceNotFoundException;
import com.javaecommerce.repository.CategoryRepository;
import com.javaecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    private static final BigDecimal MAX_PRICE = new BigDecimal("999999999");

    @Transactional(readOnly = true)
    public PageResponse<ProductResponse> search(String name, Long categoryId,
                                                BigDecimal minPrice, BigDecimal maxPrice,
                                                Pageable pageable) {
        Page<Product> page = productRepository.search(
                name == null ? "" : name,
                categoryId == null ? 0L : categoryId,
                minPrice == null ? BigDecimal.ZERO : minPrice,
                maxPrice == null ? MAX_PRICE : maxPrice,
                pageable
        );
        return PageResponse.from(page, ProductResponse::from);
    }

    @Transactional(readOnly = true)
    public ProductResponse findById(Long id) {
        return ProductResponse.from(getOrThrow(id));
    }

    @Transactional
    public ProductResponse create(ProductRequest req) {
        Category category = categoryRepository.findById(req.categoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", req.categoryId()));
        Product p = Product.builder()
                .name(req.name())
                .brand(req.brand())
                .modelCode(req.modelCode())
                .description(req.description())
                .price(req.price())
                .stock(req.stock())
                .imageUrl(req.imageUrl())
                .color(req.color())
                .bodyWood(req.bodyWood())
                .neckWood(req.neckWood())
                .fingerboard(req.fingerboard())
                .pickupConfig(req.pickupConfig())
                .active(req.active() == null || req.active())
                .category(category)
                .build();
        return ProductResponse.from(productRepository.save(p));
    }

    @Transactional
    public ProductResponse update(Long id, ProductRequest req) {
        Product p = getOrThrow(id);
        Category category = categoryRepository.findById(req.categoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", req.categoryId()));
        p.setName(req.name());
        p.setBrand(req.brand());
        p.setModelCode(req.modelCode());
        p.setDescription(req.description());
        p.setPrice(req.price());
        p.setStock(req.stock());
        p.setImageUrl(req.imageUrl());
        p.setColor(req.color());
        p.setBodyWood(req.bodyWood());
        p.setNeckWood(req.neckWood());
        p.setFingerboard(req.fingerboard());
        p.setPickupConfig(req.pickupConfig());
        if (req.active() != null) p.setActive(req.active());
        p.setCategory(category);
        return ProductResponse.from(p);
    }

    @Transactional
    public void delete(Long id) {
        Product p = getOrThrow(id);
        p.setActive(false);
    }

    private Product getOrThrow(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", id));
    }
}
