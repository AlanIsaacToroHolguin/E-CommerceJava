package com.javaecommerce.service;

import com.javaecommerce.dto.category.CategoryRequest;
import com.javaecommerce.dto.category.CategoryResponse;
import com.javaecommerce.entity.Category;
import com.javaecommerce.exception.ConflictException;
import com.javaecommerce.exception.ResourceNotFoundException;
import com.javaecommerce.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public List<CategoryResponse> findAll() {
        return categoryRepository.findAll().stream().map(CategoryResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public CategoryResponse findById(Long id) {
        return CategoryResponse.from(getOrThrow(id));
    }

    @Transactional
    public CategoryResponse create(CategoryRequest req) {
        if (categoryRepository.existsByNameIgnoreCase(req.name())) {
            throw new ConflictException("Category already exists: " + req.name());
        }
        Category c = Category.builder()
                .name(req.name())
                .description(req.description())
                .imageUrl(req.imageUrl())
                .build();
        return CategoryResponse.from(categoryRepository.save(c));
    }

    @Transactional
    public CategoryResponse update(Long id, CategoryRequest req) {
        Category c = getOrThrow(id);
        c.setName(req.name());
        c.setDescription(req.description());
        c.setImageUrl(req.imageUrl());
        return CategoryResponse.from(c);
    }

    @Transactional
    public void delete(Long id) {
        Category c = getOrThrow(id);
        categoryRepository.delete(c);
    }

    private Category getOrThrow(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", id));
    }
}
