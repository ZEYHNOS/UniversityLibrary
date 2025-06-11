package com.library.universitylibrary.dto.loan;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class LoanListResponseDto {
    private Long bookId;
    private String bookTitle;
    private String bookImageUrl;
    private LocalDateTime loanStart;
    private LocalDateTime loanReturnDate;
    private String loanReturn;
    private LocalDateTime loanEnd;
}
