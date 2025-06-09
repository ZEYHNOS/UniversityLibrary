package com.library.universitylibrary.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "book")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(nullable = false)
    private String bookTitle;

    @Column(nullable = false)
    private String bookAuthor;

    @Column(nullable = false)
    private String bookPublisher;

    private LocalDate bookYear;

    @Column(nullable = false)
    private Integer bookPrice;

    @Column(name = "book_image_url")
    private String bookImageUrl;

    @Column(name = "book_status", nullable = false, length = 1)
    private String bookStatus;
}
