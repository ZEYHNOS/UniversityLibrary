package com.library.universitylibrary.repository;

import com.library.universitylibrary.entity.Loan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LoanRepository extends JpaRepository<Loan, Long> {

    // user_id와 loan_return 조건으로 대출 조회
    List<Loan> findByUser_UserIdAndLoanReturn(String userId, String loanReturn);

    List<Loan> findByUser_UserId(String userId);

    List<Loan> findAll();
}
