package com.library.universitylibrary.controller;

import com.library.universitylibrary.dto.book.BookRequest;
import com.library.universitylibrary.entity.Book;
import com.library.universitylibrary.entity.Category;
import com.library.universitylibrary.repository.BookRepository;
import com.library.universitylibrary.repository.CategoryRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.UUID;

@RestController
@RequestMapping("/api/book")
public class BookController {

    private final CategoryRepository categoryRepository;
    private final BookRepository bookRepository;

    public BookController(CategoryRepository categoryRepository, BookRepository bookRepository) {
        this.categoryRepository = categoryRepository;
        this.bookRepository = bookRepository;
    }

    @PostMapping("/upload/images")
    public ResponseEntity<String> uploadBookImage(@RequestParam("image") MultipartFile imageFile) {
        try {
            // 저장할 경로 지정
            String uploadDir = "E:/libraryimage/";
            String fileName = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();
            Path filePath = Paths.get(uploadDir + fileName);

            // 디렉토리 없으면 생성
            Files.createDirectories(filePath.getParent());

            // 파일 저장
            Files.copy(imageFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // 반환할 URL 경로
            String fileUrl = "/libraryimage/" + fileName;

            return ResponseEntity.ok(fileUrl);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("업로드 실패: " + e.getMessage());
        }
    }

    @PostMapping("/add")
    public ResponseEntity<Book> addBook(@RequestBody BookRequest request) {
        Category category = categoryRepository.findById(request.getCategory_id())
                .orElseThrow(() -> new IllegalArgumentException("카테고리 없음"));

        Book book = Book.builder()
                .category(category)
                .bookTitle(request.getBook_title())
                .bookAuthor(request.getBook_author())
                .bookPublisher(request.getBook_publisher())
                .bookYear(request.getBook_year() != null && !request.getBook_year().isEmpty()
                        ? LocalDate.parse(request.getBook_year())
                        : null)
                .bookPrice(request.getBook_price())
                .bookImageUrl(request.getBook_img_url())
                .build();

        Book saved = bookRepository.save(book);
        return ResponseEntity.ok(saved);
    }
}
