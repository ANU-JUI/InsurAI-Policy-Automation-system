package com.insurai.insurai_backend.service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.insurai.insurai_backend.model.Claim;
import com.insurai.insurai_backend.model.Employee;
import com.insurai.insurai_backend.model.Hr;
import com.insurai.insurai_backend.repository.ClaimRepository;

@Service
public class ClaimService {

    @Autowired
    private ClaimRepository claimRepository;

    @Autowired
    private HrService hrService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private FraudService fraudService;

    @Autowired
    private InAppNotificationService inAppNotificationService; // ✅ Added InAppNotificationService

    /**
     * Submit a new claim with automatic HR assignment
     */
    @Transactional
    public Claim submitClaim(Claim claim) throws Exception {
        if (claim.getAmount() > claim.getPolicy().getCoverageAmount()) {
            throw new Exception("Claim amount exceeds policy coverage!");
        }

        claim.setStatus("Pending");
        claim.setCreatedAt(LocalDateTime.now());
        claim.setUpdatedAt(LocalDateTime.now());

        if (claim.getClaimDate() == null) {
            claim.setClaimDate(LocalDateTime.now());
        }

        // Fraud detection
        try {
            if (claim.getEmployee() != null && claim.getPolicy() != null) {
                List<Claim> employeeClaims = claimRepository.findByEmployee(claim.getEmployee());
                fraudService.runFraudDetection(claim, employeeClaims);
            } else {
                claim.setFraudFlag(false);
                claim.setFraudReason(null);
            }
        } catch (Exception e) {
            System.err.println("⚠️ Fraud detection failed: " + e.getMessage());
            claim.setFraudFlag(false);
            claim.setFraudReason(null);
        }

        // Automatic HR assignment
        List<Hr> activeHrs = hrService.getAllActiveHrs();
        Hr selectedHr = null;
        if (!activeHrs.isEmpty()) {
            selectedHr = activeHrs.stream()
                    .min(Comparator.comparingInt(this::getPendingClaimCount))
                    .orElse(null);
            claim.setAssignedHr(selectedHr);
        }

        // Save claim
        Claim savedClaim = claimRepository.save(claim);

        // Send email notification to employee
        try {
            notificationService.sendClaimStatusEmail(savedClaim.getEmployee().getEmail(), savedClaim);
        } catch (Exception e) {
            System.err.println("⚠️ Failed to send claim submission email to employee: " + e.getMessage());
        }

        // Send in-app notification to employee
        inAppNotificationService.createNotification(
                "Claim Submitted",
                "Your claim #" + savedClaim.getId() + " has been submitted.",
                savedClaim.getEmployee().getId(),
                "EMPLOYEE",
                "CLAIM"
        );

        // Send email notification to assigned HR
        if (selectedHr != null && selectedHr.getEmail() != null) {
            try {
                notificationService.sendNewClaimAssignedToHr(selectedHr.getEmail(), selectedHr, savedClaim);
            } catch (Exception e) {
                System.err.println("⚠️ Failed to send claim assignment email to HR: " + e.getMessage());
            }
        }

        // Send in-app notification to assigned HR
        if (selectedHr != null) {
            inAppNotificationService.createNotification(
                    "New Claim Assigned",
                    "A new claim #" + savedClaim.getId() + " has been assigned to you.",
                    selectedHr.getId(),
                    "HR",
                    "CLAIM"
            );
        }

        return savedClaim;
    }

    private int getPendingClaimCount(Hr hr) {
        return claimRepository.countByAssignedHrAndStatus(hr, "Pending");
    }
    
    @Transactional(readOnly = true)
    public List<Claim> getClaimsByEmployee(Employee employee) {
        List<Claim> claims = claimRepository.findByEmployee(employee);
        // Initialize lazy collections while the transactional session is open
        for (Claim c : claims) {
            if (c.getDocuments() != null) {
                c.getDocuments().size();
            }
            // Initialize associations used by DTO mapping
            if (c.getEmployee() != null) {
                c.getEmployee().getId();
                c.getEmployee().getName();
            }
            if (c.getPolicy() != null) {
                c.getPolicy().getId();
                c.getPolicy().getPolicyName();
            }
            if (c.getAssignedHr() != null) {
                c.getAssignedHr().getId();
                c.getAssignedHr().getName();
            }
        }
        return claims;
    }

    public List<Claim> getClaimsByEmployeeId(String employeeId) {
        return claimRepository.findByEmployee_EmployeeId(employeeId);
    }
    public List<Claim> getClaimsByIds(List<Long> ids) {
        return claimRepository.findAllById(ids);
    }

    public void saveAll(List<Claim> claims) {
        claimRepository.saveAll(claims);
    }

    @Transactional(readOnly = true)
    public List<Claim> getAllClaims() {
        List<Claim> claims = claimRepository.findAll();
        for (Claim c : claims) {
            if (c.getDocuments() != null) {
                c.getDocuments().size();
            }
            // Initialize associations used by AdminController.ClaimDTO mapping
            if (c.getEmployee() != null) {
                c.getEmployee().getId();
                c.getEmployee().getName();
            }
            if (c.getPolicy() != null) {
                c.getPolicy().getId();
                c.getPolicy().getPolicyName();
            }
            if (c.getAssignedHr() != null) {
                c.getAssignedHr().getId();
                c.getAssignedHr().getName();
            }
        }
        return claims;
    }

    /**
     * Approve a claim (Fast - notifications sent async)
     */
    @Transactional
    public Claim approveClaim(Long claimId, String remarks) throws Exception {
        Claim claim = claimRepository.findByIdWithEmployee(claimId)
                .orElseThrow(() -> new Exception("Claim not found"));

        claim.setStatus("Approved");
        claim.setRemarks(remarks);
        claim.setUpdatedAt(LocalDateTime.now());
        Claim updatedClaim = claimRepository.save(claim);

        // Email notification - TEMPORARY: back to sync for debugging
        if (updatedClaim.getEmployee() != null && updatedClaim.getEmployee().getEmail() != null) {
            try {
                notificationService.sendClaimStatusEmail(updatedClaim.getEmployee().getEmail(), updatedClaim);
            } catch (Exception e) {
                System.err.println("⚠️ Failed to send claim approval email: " + e.getMessage());
            }
        }

        // In-app notification
        inAppNotificationService.createClaimApprovedNotification(updatedClaim);

        // Eagerly initialize relationships for DTO mapping
        if (updatedClaim.getDocuments() != null) {
            updatedClaim.getDocuments().size();
        }
        if (updatedClaim.getPolicy() != null) {
            updatedClaim.getPolicy().getId();
            updatedClaim.getPolicy().getPolicyName();
        }
        if (updatedClaim.getAssignedHr() != null) {
            updatedClaim.getAssignedHr().getId();
            updatedClaim.getAssignedHr().getName();
        }

        return updatedClaim;
    }

    /**
     * Reject a claim (Fast - notifications sent async)
     */
    @Transactional
    public Claim rejectClaim(Long claimId, String remarks) throws Exception {
        Claim claim = claimRepository.findByIdWithEmployee(claimId)
                .orElseThrow(() -> new Exception("Claim not found"));

        claim.setStatus("Rejected");
        claim.setRemarks(remarks);
        claim.setUpdatedAt(LocalDateTime.now());
        Claim updatedClaim = claimRepository.save(claim);

        // Email notification - TEMPORARY: back to sync for debugging
        if (updatedClaim.getEmployee() != null && updatedClaim.getEmployee().getEmail() != null) {
            try {
                notificationService.sendClaimStatusEmail(updatedClaim.getEmployee().getEmail(), updatedClaim);
            } catch (Exception e) {
                System.err.println("⚠️ Failed to send claim rejection email: " + e.getMessage());
            }
        }

        // In-app notification
        inAppNotificationService.createClaimRejectedNotification(updatedClaim);

        // Eagerly initialize relationships for DTO mapping
        if (updatedClaim.getDocuments() != null) {
            updatedClaim.getDocuments().size();
        }
        if (updatedClaim.getPolicy() != null) {
            updatedClaim.getPolicy().getId();
            updatedClaim.getPolicy().getPolicyName();
        }
        if (updatedClaim.getAssignedHr() != null) {
            updatedClaim.getAssignedHr().getId();
            updatedClaim.getAssignedHr().getName();
        }

        return updatedClaim;
    }

    public List<Claim> getClaimsByStatus(String status) {
        return claimRepository.findByStatus(status);
    }

    public List<Claim> getClaimsByEmployeeAndStatus(Employee employee, String status) {
        return claimRepository.findByEmployeeAndStatus(employee, status);
    }

    public List<Claim> getClaimsByEmployeeIdAndStatus(String employeeId, String status) {
        return claimRepository.findByEmployee_EmployeeIdAndStatus(employeeId, status);
    }

    @Transactional(readOnly = true)
    public List<Claim> getClaimsByAssignedHr(Long hrId) {
        List<Claim> claims = claimRepository.findByAssignedHr_Id(hrId);
        // Initialize lazy collections while the transactional session is open
        for (Claim c : claims) {
            if (c.getDocuments() != null) {
                c.getDocuments().size();
            }
            if (c.getEmployee() != null) {
                c.getEmployee().getId();
                c.getEmployee().getName();
            }
            if (c.getPolicy() != null) {
                c.getPolicy().getId();
                c.getPolicy().getPolicyName();
            }
            if (c.getAssignedHr() != null) {
                c.getAssignedHr().getId();
                c.getAssignedHr().getName();
            }
        }
        return claims;
    }

    @Transactional(readOnly = true)
    public Claim getClaimById(Long claimId) {
        Claim claim = claimRepository.findById(claimId).orElse(null);
        if (claim != null) {
            if (claim.getDocuments() != null) {
                claim.getDocuments().size();
            }
            if (claim.getEmployee() != null) {
                claim.getEmployee().getId();
                claim.getEmployee().getName();
            }
            if (claim.getPolicy() != null) {
                claim.getPolicy().getId();
                claim.getPolicy().getPolicyName();
            }
            if (claim.getAssignedHr() != null) {
                claim.getAssignedHr().getId();
                claim.getAssignedHr().getName();
            }
        }
        return claim;
    }

    public Claim updateClaim(Claim claim) throws Exception {
        if (claim.getAmount() > claim.getPolicy().getCoverageAmount()) {
            throw new Exception("Claim amount exceeds policy coverage!");
        }

        claim.setUpdatedAt(LocalDateTime.now());
        return claimRepository.save(claim);
    }

    public List<Claim> getAllClaimsForAdmin() {
        return claimRepository.findAll();
    }

    public List<Claim> getFraudClaimsByAssignedHr(Long hrId) {
        return claimRepository.findByAssignedHr_IdAndFraudFlag(hrId, true);
    }
}
