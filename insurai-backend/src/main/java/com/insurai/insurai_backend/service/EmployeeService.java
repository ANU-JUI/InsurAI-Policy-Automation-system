package com.insurai.insurai_backend.service;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.insurai.insurai_backend.model.Employee;
import com.insurai.insurai_backend.repository.EmployeeRepository;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    // ⚠️ Ideally move this to env variable later
    private final String jwtSecret =
            "4ee115278b1e85f9cfb083d7b350d43ceff5868caf4cd7e8944bf0e91908f6b1";

    // ================= Register Employee =================
    public Employee register(Employee employee) throws Exception {
        if (employeeRepository.findByEmail(employee.getEmail()).isPresent()) {
            throw new Exception("Email already exists");
        }
        if (employeeRepository.findByEmployeeId(employee.getEmployeeId()).isPresent()) {
            throw new Exception("Employee ID already exists");
        }
        return employeeRepository.save(employee);
    }

    // ================= Validate Credentials =================
    public boolean validateCredentials(
            Employee employee,
            String rawPassword,
            PasswordEncoder passwordEncoder
    ) {
        return passwordEncoder.matches(rawPassword, employee.getPassword());
    }

    // ================= Simple Token (non-JWT utility) =================
    public String generateEmployeeToken(String identifier) {
        String tokenData = identifier + ":" + System.currentTimeMillis();
        return Base64.getEncoder()
                .encodeToString(tokenData.getBytes(StandardCharsets.UTF_8));
    }

    // ================= JWT: Check if Employee =================
    public boolean isEmployee(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) return false;

        try {
            String token = authHeader.substring(7).trim();
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(jwtSecret.getBytes(StandardCharsets.UTF_8))
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            String email = claims.getSubject();
            return employeeRepository.findByEmail(email).isPresent();

        } catch (Exception e) {
            System.out.println("[EmployeeService] JWT validation failed: " + e.getMessage());
            return false;
        }
    }

    // ================= Get Employee from JWT =================
    public Employee getEmployeeFromToken(String token) {
        if (token == null || token.isBlank()) return null;

        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(jwtSecret.getBytes(StandardCharsets.UTF_8))
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            String email = claims.getSubject();
            return employeeRepository.findByEmail(email).orElse(null);

        } catch (Exception e) {
            System.out.println("[EmployeeService] Failed to parse JWT: " + e.getMessage());
            return null;
        }
    }

    // ================= Lookup Helpers =================
    public Employee findByEmail(String email) {
        return employeeRepository.findByEmail(email).orElse(null);
    }

    public Employee findByEmployeeId(String employeeId) {
        return employeeRepository.findByEmployeeId(employeeId).orElse(null);
    }
}
