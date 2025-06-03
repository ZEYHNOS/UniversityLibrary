package com.library.universitylibrary.controller;

import com.library.universitylibrary.dto.category.CategoryList;
import com.library.universitylibrary.dto.category.CategoryRequest;
import com.library.universitylibrary.entity.Category;
import com.library.universitylibrary.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/category")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping("/add")
    public ResponseEntity<Category> addCategory(@RequestBody CategoryRequest request) {
        Category saved = categoryService.saveCategory(request);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/list")
    public ResponseEntity<List<CategoryList>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getCategoryLists());
    }
}
