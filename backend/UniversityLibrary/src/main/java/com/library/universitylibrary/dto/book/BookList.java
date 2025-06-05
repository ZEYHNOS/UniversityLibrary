package com.library.universitylibrary.dto.book;

import com.library.universitylibrary.entity.Book;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookList {
    private Long bookId;
    private String bookTitle;
    private String bookAuthor;
    private String bookPublisher;
    private String bookYear;
    private Integer bookPrice;
    private String bookImageUrl;
    private String categoryName;

    public BookList(Book book) {
        this.bookId = book.getBookId();
        this.bookTitle = book.getBookTitle();
        this.bookAuthor = book.getBookAuthor();
        this.bookPublisher = book.getBookPublisher();
        this.bookYear = book.getBookYear() != null ? book.getBookYear().toString() : null;
        this.bookPrice = book.getBookPrice();
        this.bookImageUrl = "http://localhost:2866" + book.getBookImageUrl();
        this.categoryName = book.getCategory().getCategoryName(); // LAZY라도 여기서 접근하므로 초기화됨
    }
}
