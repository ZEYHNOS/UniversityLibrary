package com.library.universitylibrary.repository;

import com.library.universitylibrary.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long> {
    List<Book> findByBookTitleContainingIgnoreCase(String bookTitle);

    List<Book> findByBookAuthorContainingIgnoreCase(String bookAuthor);

    List<Book> findByBookPublisherContainingIgnoreCase(String bookPublisher);
}
