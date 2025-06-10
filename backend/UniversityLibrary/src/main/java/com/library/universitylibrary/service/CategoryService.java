package com.library.universitylibrary.service;

import com.library.universitylibrary.dto.category.CategoryList;
import com.library.universitylibrary.dto.category.CategoryRequest;
import com.library.universitylibrary.entity.Category;
import com.library.universitylibrary.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public Category saveCategory(CategoryRequest request) {
        Category category = Category.builder()
                .categoryId(request.getCategoryId())
                .categoryName(request.getCategoryName())
                .categoryLocation(request.getCategoryLocation())
                .build();

        return categoryRepository.save(category);
    }

    public List<CategoryList> getCategoryLists() {
        return categoryRepository.findAll()
                .stream()
                .map(c -> new CategoryList(c.getCategoryId(), c.getCategoryName()))
                .collect(Collectors.toList());
    }
}
