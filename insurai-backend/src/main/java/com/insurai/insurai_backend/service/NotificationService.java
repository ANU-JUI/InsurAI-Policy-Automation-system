package com.insurai.insurai_backend.service;

import java.time.format.DateTimeFormatter;

import org.springframework.stereotype.Service;

import com.insurai.insurai_backend.model.Claim;
import com.insurai.insurai_backend.model.EmployeeQuery;
import com.insurai.insurai_backend.model.Hr;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final EmailService emailService; // ✅ SendGrid service

    // 🔹 Common Date Format
    private static final DateTimeFormatter FORMATTER =
            DateTimeFormatter.ofPattern("dd MMM yyyy hh:mm a");

    // ========================= Claim Notifications =========================

    public void sendClaimStatusEmail(String to, Claim claim) {
        if (claim == null || claim.getEmployee() == null) return;

        if ("Approved".equalsIgnoreCase(claim.getStatus())) {
            emailService.sendClaimApprovalEmail(
                    to,
                    claim.getEmployee().getName(),
                    claim.getId(),
                    claim.getTitle(),
                    claim.getAmount()
            );
        } else if ("Rejected".equalsIgnoreCase(claim.getStatus())) {
            emailService.sendClaimRejectionEmail(
                    to,
                    claim.getEmployee().getName(),
                    claim.getId(),
                    claim.getTitle(),
                    claim.getRemarks() != null ? claim.getRemarks() : "Not specified"
            );
        } else {
            // Pending / Submitted
            emailService.sendClaimSubmissionEmail(
                    to,
                    claim.getEmployee().getName(),
                    claim.getId(),
                    claim.getTitle(),
                    claim.getAmount()
            );
        }
    }

    public void sendNewClaimAssignedToHr(String to, Hr hr, Claim claim) {
        if (claim == null || hr == null) return;

        emailService.sendClaimAssignedToHrEmail(
                to,
                hr.getName(),
                claim.getId(),
                claim.getTitle(),
                claim.getAmount()
        );
    }

    // ========================= Employee-Agent Query Notifications =========================

    public void sendEmployeeQueryNotificationToAgent(String to, EmployeeQuery query) {
        if (query == null) return;

        emailService.sendEmployeeQueryToAgentEmail(
                to,
                query.getEmployee() != null ? query.getEmployee().getName() : "Employee",
                query.getId(),
                query.getQueryText(),
                query.getPolicyName(),
                query.getClaimType()
        );
    }

    public void sendAgentResponseNotificationToEmployee(String to, EmployeeQuery query) {
        if (query == null) return;

        emailService.sendAgentResponseToEmployeeEmail(
                to,
                query.getId(),
                query.getQueryText(),
                query.getResponse(),
                query.getPolicyName(),
                query.getClaimType()
        );
    }
}
