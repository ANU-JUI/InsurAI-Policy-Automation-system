package com.insurai.insurai_backend.controller;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.insurai.insurai_backend.config.JwtUtil;
import com.insurai.insurai_backend.model.Employee;
import com.insurai.insurai_backend.model.ForgotPasswordRequest;
import com.insurai.insurai_backend.model.LoginRequest;
import com.insurai.insurai_backend.model.RegisterRequest;
import com.insurai.insurai_backend.repository.EmployeeRepository;
import com.insurai.insurai_backend.service.AuditLogService;
import com.insurai.insurai_backend.service.EmailService;
import com.insurai.insurai_backend.service.EmployeeService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "https://insurai-automation-system.netlify.app")
public class AuthController {

    private final EmployeeService employeeService;
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuditLogService auditLogService;
    private final EmailService emailService; // ✅ SendGrid EmailService

    // ================= Employee Registration =================
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (employeeRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }
        if (employeeRepository.findByEmployeeId(request.getEmployeeId()).isPresent()) {
            return ResponseEntity.badRequest().body("Employee ID already exists");
        }

        Employee emp = new Employee();
        emp.setEmployeeId(request.getEmployeeId());
        emp.setName(request.getName());
        emp.setEmail(request.getEmail());
        emp.setPassword(passwordEncoder.encode(request.getPassword()));
        emp.setRole(Employee.Role.EMPLOYEE);

        try {
            employeeService.register(emp);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }

        auditLogService.logAction(
                emp.getEmployeeId(),
                emp.getName(),
                "EMPLOYEE",
                "REGISTER",
                "Employee registered successfully"
        );

        return ResponseEntity.ok("Employee registered successfully");
    }

    // ================= Employee Login =================
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request,
            HttpServletRequest servletRequest
    ) {
        Employee emp = null;

        if (request.getEmployeeId() != null && !request.getEmployeeId().isBlank()) {
            emp = employeeRepository.findByEmployeeId(request.getEmployeeId()).orElse(null);
        } else if (request.getEmail() != null && !request.getEmail().isBlank()) {
            emp = employeeRepository.findByEmail(request.getEmail()).orElse(null);
        }

        if (emp == null) {
            return ResponseEntity.status(404).body("User not found");
        }

        if (emp.getLockTime() != null && emp.getLockTime().isAfter(LocalDateTime.now())) {
            return ResponseEntity.status(423)
                    .body("Account locked. Try again after " + emp.getLockTime());
        }

        if (!passwordEncoder.matches(request.getPassword(), emp.getPassword())) {
            emp.setFailedAttempt(emp.getFailedAttempt() + 1);

            if (emp.getFailedAttempt() >= 5) {
                emp.setLockTime(LocalDateTime.now().plusMinutes(15));
                auditLogService.logAction(
                        emp.getEmployeeId(),
                        emp.getName(),
                        "EMPLOYEE",
                        "ACCOUNT_LOCKED",
                        "Too many failed attempts"
                );
            }

            employeeRepository.save(emp);
            return ResponseEntity.status(401)
                    .body("Incorrect password. Attempts remaining: " +
                            Math.max(0, 5 - emp.getFailedAttempt()));
        }

        String currentAgent = servletRequest.getHeader("User-Agent");
        if (emp.getLastUserAgent() != null && !emp.getLastUserAgent().equals(currentAgent)) {
            auditLogService.logAction(
                    emp.getEmployeeId(),
                    emp.getName(),
                    "EMPLOYEE",
                    "SECURITY_ALERT",
                    "Login from new device/browser"
            );
        }

        emp.setFailedAttempt(0);
        emp.setLockTime(null);
        emp.setLastUserAgent(currentAgent);
        employeeRepository.save(emp);

        String token = jwtUtil.generateToken(emp.getEmail(), emp.getRole().name());

        auditLogService.logAction(
                emp.getEmployeeId(),
                emp.getName(),
                "EMPLOYEE",
                "LOGIN",
                "Employee logged in successfully"
        );

        return ResponseEntity.ok(Map.of(
                "token", token,
                "role", emp.getRole().name(),
                "name", emp.getName(),
                "employeeId", emp.getEmployeeId(),
                "id", emp.getId()
        ));
    }

    // ================= Get All Employees =================
    @GetMapping("/employees")
    public ResponseEntity<?> getAllEmployees() {
        return ResponseEntity.ok(employeeRepository.findAll());
    }

    // ================= Forgot Password (SendGrid) =================
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request
    ) {
        Optional<Employee> optionalEmp =
                employeeRepository.findByEmail(request.getEmail());

        if (optionalEmp.isEmpty()) {
            return ResponseEntity.status(404).body("Email not found");
        }

        Employee emp = optionalEmp.get();
        String resetToken = UUID.randomUUID().toString();

        emp.setResetToken(resetToken);
        emp.setResetTokenExpiry(LocalDateTime.now().plusMinutes(30));
        employeeRepository.save(emp);

        String resetLink =
                "https://insurai-automation-system.netlify.app/reset-password/" + resetToken;

        // ✅ Send reset email via SendGrid
        emailService.sendResetPasswordEmail(
                emp.getEmail(),
                emp.getName(),
                resetLink
        );

        auditLogService.logAction(
                emp.getEmployeeId(),
                emp.getName(),
                "EMPLOYEE",
                "FORGOT_PASSWORD",
                "Requested password reset"
        );

        return ResponseEntity.ok("Reset password link sent to your email");
    }

    // ================= Reset Password =================
    @PostMapping("/reset-password/{token}")
    public ResponseEntity<?> resetPassword(
            @PathVariable String token,
            @RequestBody Map<String, String> body
    ) {
        Optional<Employee> optionalEmp =
                employeeRepository.findByResetToken(token);

        if (optionalEmp.isEmpty()) {
            return ResponseEntity.status(400).body("Invalid or expired token");
        }

        Employee emp = optionalEmp.get();

        if (emp.getResetTokenExpiry() == null ||
                emp.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            return ResponseEntity.status(400).body("Token has expired");
        }

        String newPassword = body.get("newPassword");
        if (newPassword == null || newPassword.isBlank()) {
            return ResponseEntity.badRequest().body("New password is required");
        }

        emp.setPassword(passwordEncoder.encode(newPassword));
        emp.setResetToken(null);
        emp.setResetTokenExpiry(null);
        employeeRepository.save(emp);

        auditLogService.logAction(
                emp.getEmployeeId(),
                emp.getName(),
                "EMPLOYEE",
                "RESET_PASSWORD",
                "Password reset successfully"
        );

        return ResponseEntity.ok("Password reset successfully");
    }
}
