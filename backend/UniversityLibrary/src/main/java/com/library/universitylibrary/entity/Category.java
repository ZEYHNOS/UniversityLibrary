package com.library.universitylibrary.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "category")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category {

    @Id
    @Column(length = 10)
    private String categoryId;

    @Column(nullable = false)
    private String categoryName;

    @Column(nullable = false)
    private String categoryLocation;

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
    private List<Book> books;
}
