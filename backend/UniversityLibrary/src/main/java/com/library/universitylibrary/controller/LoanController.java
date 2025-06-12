package com.library.universitylibrary.controller;

import com.library.universitylibrary.dto.loan.AdminLoanListResponseDto;
import com.library.universitylibrary.dto.loan.LoanListResponseDto;
import com.library.universitylibrary.dto.loan.LoanRequestDto;
import com.library.universitylibrary.entity.Book;
import com.library.universitylibrary.entity.Loan;
import com.library.universitylibrary.entity.User;
import com.library.universitylibrary.repository.BookRepository;
import com.library.universitylibrary.repository.LoanRepository;
import com.library.universitylibrary.repository.UserRepository;
import com.library.universitylibrary.dto.loan.LoanInfoDto;
import com.library.universitylibrary.service.LoanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/loan")
@RequiredArgsConstructor
public class LoanController {

    private final LoanRepository loanRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final LoanService loanService;

    @PostMapping("/create")
    public ResponseEntity<String> createLoan(@RequestBody LoanRequestDto dto) {

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("존재하지 않는 회원입니다"));

        // 활성화 상태가 아니면 대출 불가능
        if (!"ACTIVE".equalsIgnoreCase(user.getUserStatus())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("현재 대출이 불가능한 사용자입니다.");
        }

        Book book = bookRepository.findById(dto.getBookId().longValue())
                .orElseThrow(() -> new RuntimeException("존재하지 않는 책입니다"));

        // 이미 대출 중인 책은 대출 불가 처리
        if ("N".equals(book.getBookStatus())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("이미 대출 중인 책입니다.");
        }


        // 책 상태 변경
        book.setBookStatus("N");
        bookRepository.save(book);

        LocalDate loanStartDate = LocalDate.now(); // 대출일
        LocalDate loanEndDate = loanStartDate.plusDays(14); // 대출일 포함 15일
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime end = loanEndDate.atTime(23, 59, 59); // 15일째 자정까지

        Loan loan = Loan.builder()
                .user(user)
                .book(book)
                .loanStart(now)
                .loanEnd(end)
                .loanReturn("N")
                .loanReturnDate(null)
                .build();

        loanRepository.save(loan);

        return ResponseEntity.ok("대출 등록 완료");
    }

    @GetMapping("/return/not")
    public ResponseEntity<List<LoanInfoDto>> getNotReturnedLoanIds(@RequestParam String userId) {
        List<Loan> loans = loanRepository.findByUser_UserIdAndLoanReturn(userId, "N");

        List<LoanInfoDto> loanInfos = loans.stream()
                .map(loan -> new LoanInfoDto(
                        loan.getLoanId(),
                        loan.getBook().getBookTitle(),
                        loan.getLoanStart()
                ))
                .toList();

        return ResponseEntity.ok(loanInfos);
    }

    @PatchMapping("/return/{loanId}")
    public ResponseEntity<String> returnLoan(@PathVariable Long loanId) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("대출 정보를 찾을 수 없습니다."));

        if ("Y".equals(loan.getLoanReturn())) {
            return ResponseEntity.badRequest().body("이미 반납된 대출입니다.");
        }

        // 반납여부 Y로 바꿈처리
        loan.setLoanReturn("Y");
        loan.setLoanReturnDate(LocalDateTime.now());

        // 책 상태도 Y로 바꿈처리
        Book book = loan.getBook();
        book.setBookStatus("Y");
        bookRepository.save(book);

        loanRepository.save(loan);

        return ResponseEntity.ok("반납 완료");
    }

    @GetMapping("/list/{userId}")
    public ResponseEntity<List<LoanListResponseDto>> getLoanListByUser(@PathVariable String userId) {
        List<LoanListResponseDto> loanList = loanService.getLoansByUserId(userId);
        return ResponseEntity.ok(loanList);
    }

    // 관리자 전용 대출내역 조회
    @GetMapping("/list")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AdminLoanListResponseDto>> getAllLoans() {
        return ResponseEntity.ok(loanService.getAllLoans());
    }
}