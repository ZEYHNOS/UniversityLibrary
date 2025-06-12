package com.library.universitylibrary.dto.loan;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class AdminLoanListResponseDto {
    private Long loanId;
    private String userId;
    private String userName;
    private Long bookId;
    private String bookTitle;
    private LocalDateTime loanStart;
    private LocalDateTime loanEnd;
    private LocalDateTime loanReturnDate;
    private String loanReturn;
}
