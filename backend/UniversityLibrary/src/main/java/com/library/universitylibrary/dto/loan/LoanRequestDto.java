package com.library.universitylibrary.dto.loan;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoanRequestDto {

    private String userId;
    private Integer bookId;

}
