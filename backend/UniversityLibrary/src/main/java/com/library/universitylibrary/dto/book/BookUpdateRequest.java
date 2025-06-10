package com.library.universitylibrary.dto.book;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookUpdateRequest {
    private String bookTitle;
    private String bookAuthor;
    private String bookPublisher;
    private String bookYear;
    private Integer bookPrice;
    private String category_id;
}
