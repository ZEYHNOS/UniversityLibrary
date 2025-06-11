package com.library.universitylibrary.service;

import com.library.universitylibrary.dto.loan.LoanListResponseDto;
import com.library.universitylibrary.entity.Book;
import com.library.universitylibrary.entity.Loan;
import com.library.universitylibrary.repository.BookRepository;
import com.library.universitylibrary.repository.LoanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LoanService {

    private final LoanRepository loanRepository;
    private final BookRepository bookRepository;

    public List<LoanListResponseDto> getLoansByUserId(String userId) {
        List<Loan> loans = loanRepository.findByUser_UserId(userId);

        return loans.stream().map(loan -> {
            Book book = bookRepository.findById(loan.getBook().getBookId())
                    .orElseThrow(() -> new IllegalArgumentException("도서 정보 없음"));

            return new LoanListResponseDto(
                    book.getBookId(),
                    book.getBookTitle(),
                    book.getBookImageUrl(),
                    loan.getLoanStart(),
                    loan.getLoanReturnDate(),
                    loan.getLoanReturn(),
                    loan.getLoanEnd()
            );
        }).collect(Collectors.toList());
    }
}