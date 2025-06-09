package com.library.universitylibrary.controller;

import com.library.universitylibrary.dto.book.BookList;
import com.library.universitylibrary.dto.book.BookRequest;
import com.library.universitylibrary.entity.Book;
import com.library.universitylibrary.entity.Category;
import com.library.universitylibrary.repository.BookRepository;
import com.library.universitylibrary.repository.CategoryRepository;
import com.library.universitylibrary.service.BookService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.security.SecureRandom;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/book")
public class BookController {

    private final CategoryRepository categoryRepository;
    private final BookRepository bookRepository;
    private final BookService bookService;


    public BookController(CategoryRepository categoryRepository, BookRepository bookRepository, BookService bookService) {
        this.categoryRepository = categoryRepository;
        this.bookRepository = bookRepository;
        this.bookService = bookService;
    }

    @PostMapping("/upload/images")
    public ResponseEntity<String> uploadBookImage(@RequestParam("image") MultipartFile imageFile) {
        try {
            String uploadDir = "E:/libraryimage/";

            // 확장자 추출
            String originalName = imageFile.getOriginalFilename();
            String extension = "";

            if (originalName != null && originalName.contains(".")) {
                extension = originalName.substring(originalName.lastIndexOf("."));
            }

            // 안전한 10글자 영문+숫자 랜덤 문자열 생성
            String fileName = generateRandomFileName(10) + extension;

            Path filePath = Paths.get(uploadDir + fileName);

            Files.createDirectories(filePath.getParent());
            Files.copy(imageFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            String fileUrl = "/libraryimage/" + fileName;

            return ResponseEntity.ok(fileUrl);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("업로드 실패: " + e.getMessage());
        }
    }

    // 랜덤 파일명 생성 메서드
    private String generateRandomFileName(int length) {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }
    
    // 도서 추가(관리자전용)
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
                .bookStatus("Y")
                .build();

        Book saved = bookRepository.save(book);
        return ResponseEntity.ok(saved);
    }
    
    // 도서 리스트(사용자, 관리자)
    @GetMapping("/list")
    public List<BookList> getAllBooks() {
        return bookService.getAllBooks().stream()
                .map(BookList::new)
                .toList();
    }

    @GetMapping("/search")
    public ResponseEntity<List<BookList>> searchBooks(
            @RequestParam("type") String type,
            @RequestParam("keyword") String keyword
    ) {
        List<Book> books;

        switch (type.toLowerCase()) {
            case "title":
                books = bookRepository.findByBookTitleContainingIgnoreCase(keyword);
                break;
            case "author":
                books = bookRepository.findByBookAuthorContainingIgnoreCase(keyword);
                break;
            case "publisher":
                books = bookRepository.findByBookPublisherContainingIgnoreCase(keyword);
                break;
            default:
                return ResponseEntity.badRequest().build();
        }

        List<BookList> result = books.stream()
                .map(BookList::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }
}
