package com.library.universitylibrary.dto.book;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookRequest {
    private String category_id;
    private String book_title;
    private String book_author;
    private String book_publisher;
    private String book_year; // 문자열로 받아서 LocalDate로 파싱
    private Integer book_price;
    private String book_img_url;
    private String bookStatus;
}