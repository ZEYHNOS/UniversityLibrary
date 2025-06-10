package com.library.universitylibrary.service;

import com.library.universitylibrary.dto.book.BookUpdateRequest;
import com.library.universitylibrary.entity.Book;
import com.library.universitylibrary.entity.Category;
import com.library.universitylibrary.repository.BookRepository;
import com.library.universitylibrary.repository.CategoryRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;

    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }
    // 도서 정보 수정
    @Transactional
    public void updateBook(Long id, BookUpdateRequest dto) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 책이 없습니다. ID = " + id));
        Category category = categoryRepository.findById(dto.getCategory_id())
                .orElseThrow(() -> new IllegalArgumentException("해당 카테고리가 없습니다. ID = " + dto.getCategory_id()));

        book.setBookTitle(dto.getBookTitle());
        book.setBookAuthor(dto.getBookAuthor());
        book.setBookPublisher(dto.getBookPublisher());
        book.setBookYear(LocalDate.parse(dto.getBookYear()));
        book.setBookPrice(dto.getBookPrice());
        book.setCategory(category);
    }

    // 도서 정보 삭제
    @Transactional
    public void deleteBook(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 책이 없습니다. ID = " + id));
        bookRepository.delete(book);
    }
}
