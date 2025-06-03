package com.library.universitylibrary.dto.category;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryRequest {
    private String categoryId;
    private String categoryName;
    private String categoryLocation;
}