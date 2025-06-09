package com.library.universitylibrary.dto.loan;

import lombok.Getter;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class LoanInfoDto {
    private Long loanId;
    private String bookTitle;
    private LocalDateTime loanStart;
}