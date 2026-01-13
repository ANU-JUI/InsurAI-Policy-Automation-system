package com.insurai.insurai_backend.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.*;
import lombok.*;

@Data
@Entity
@Table(name = "employees")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 👇 Corporate employee ID
    @Column(unique = true, nullable = false)
    private String employeeId;

    private String name;
    // Add these fields to your Employee Entity
private String lastUserAgent;      // To track device changes
private Integer failedAttempt = 0;     // To count failed logins
private LocalDateTime lockTime;    // To store account lock expiry
   // Optional: for the AI features we discussed

    @Column(unique = true, nullable = false)
    private String email;

    private String password;

    @Enumerated(EnumType.STRING)
    private Role role = Role.EMPLOYEE;

    private boolean active = true;

    // -------------------- Password Reset Fields --------------------
    @Column(name = "reset_token", length = 100)
    private String resetToken; // Token for resetting password

    @Column(name = "reset_token_expiry")
    private LocalDateTime resetTokenExpiry; // Token expiry timestamp

    // -------------------- Role Enum --------------------
    public enum Role {
        EMPLOYEE, HR, ADMIN
    }
}