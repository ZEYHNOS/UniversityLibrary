package com.library.universitylibrary.repository;

import com.library.universitylibrary.entity.Loan;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LoanRepository extends JpaRepository<Loan, Long> {
}
