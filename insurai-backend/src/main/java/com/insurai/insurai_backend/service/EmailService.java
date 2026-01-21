package com.insurai.insurai_backend.service;

import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.*;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import org.springframework.stereotype.Service;
import java.io.IOException;

@Service
public class EmailService {
    
    private final SendGrid sendGrid;
    private final String FROM_EMAIL = "anushkadutta102@gmail.com"; // Change to your verified sender email
    
    public EmailService() {
        String apiKey = System.getenv("SENDGRID_API_KEY");
        if (apiKey == null || apiKey.isEmpty()) {
            System.err.println("⚠️ WARNING: SENDGRID_API_KEY environment variable not set. Email functionality disabled.");
            this.sendGrid = null;
        } else {
            this.sendGrid = new SendGrid(apiKey);
        }
    }
    
    /**
     * Send claim approval email to employee
     */
    public void sendClaimApprovalEmail(String employeeEmail, String employeeName, 
                                       Long claimId, String policyName, Double amount) {
        if (sendGrid == null) {
            System.err.println("⚠️ SendGrid not configured. Skipping email send.");
            return;
        }
        
        String subject = "Your Claim Has Been Approved - InsurAI";
        String htmlContent = String.format("""
            <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background-color: #198754; color: white; padding: 20px; border-radius: 5px 5px 0 0; text-align: center; }
                        .content { background-color: #f9f9f9; padding: 20px; }
                        .success-box { background-color: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin: 20px 0; }
                        .detail { padding: 10px 0; border-bottom: 1px solid #eee; }
                        .detail-label { font-weight: bold; color: #198754; }
                        .footer { background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; border-radius: 0 0 5px 5px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h2>Claim Approval Notification</h2>
                        </div>
                        <div class="content">
                            <p>Dear <strong>%s</strong>,</p>
                            
                            <div class="success-box">
                                <h3 style="color: #198754; margin: 0;">✓ Your Claim Has Been APPROVED!</h3>
                            </div>
                            
                            <div class="detail">
                                <span class="detail-label">Claim ID:</span> #%d
                            </div>
                            <div class="detail">
                                <span class="detail-label">Policy Name:</span> %s
                            </div>
                            <div class="detail">
                                <span class="detail-label">Approved Amount:</span> $%.2f
                            </div>
                            
                            <p style="margin-top: 20px;">
                                You will receive the payment to your registered bank account within <strong>5-7 business days</strong>. 
                                Please ensure your banking information is up to date in your account profile.
                            </p>
                            
                            <p>
                                If you have any questions regarding this decision, please don't hesitate to contact our support team 
                                or your assigned HR manager.
                            </p>
                            
                            <p style="margin-top: 30px;">
                                Best regards,<br/>
                                <strong>InsurAI Support Team</strong>
                            </p>
                        </div>
                        <div class="footer">
                            <p>This is an automated message. Please do not reply to this email.</p>
                            <p>&copy; 2024 InsurAI Policy Automation System. All rights reserved.</p>
                        </div>
                    </div>
                </body>
            </html>
            """, employeeName, claimId, policyName, amount);
        
        sendEmail(employeeEmail, subject, htmlContent);
    }
    
    /**
     * Send claim rejection email to employee
     */
    public void sendClaimRejectionEmail(String employeeEmail, String employeeName, 
                                        Long claimId, String policyName, String reason) {
        if (sendGrid == null) {
            System.err.println("⚠️ SendGrid not configured. Skipping email send.");
            return;
        }
        
        String subject = "Claim Status Update - InsurAI";
        String htmlContent = String.format("""
            <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background-color: #dc3545; color: white; padding: 20px; border-radius: 5px 5px 0 0; text-align: center; }
                        .content { background-color: #f9f9f9; padding: 20px; }
                        .warning-box { background-color: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 5px; margin: 20px 0; }
                        .detail { padding: 10px 0; border-bottom: 1px solid #eee; }
                        .detail-label { font-weight: bold; color: #dc3545; }
                        .footer { background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; border-radius: 0 0 5px 5px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h2>Claim Review Decision</h2>
                        </div>
                        <div class="content">
                            <p>Dear <strong>%s</strong>,</p>
                            
                            <div class="warning-box">
                                <h3 style="color: #dc3545; margin: 0;">✕ Your Claim Has Not Been Approved</h3>
                            </div>
                            
                            <div class="detail">
                                <span class="detail-label">Claim ID:</span> #%d
                            </div>
                            <div class="detail">
                                <span class="detail-label">Policy Name:</span> %s
                            </div>
                            <div class="detail">
                                <span class="detail-label">Reason:</span> %s
                            </div>
                            
                            <p style="margin-top: 20px;">
                                After careful review of your claim, our team has determined that it does not meet the requirements 
                                for approval at this time based on the policy terms and the information provided.
                            </p>
                            
                            <p>
                                <strong>What you can do:</strong>
                            </p>
                            <ul>
                                <li>Review the claim details and reason for rejection</li>
                                <li>Submit additional supporting documentation if applicable</li>
                                <li>Contact our support team to discuss your options</li>
                                <li>File an appeal if you believe this decision is incorrect</li>
                            </ul>
                            
                            <p>
                                For more information or to discuss this decision, please reach out to our HR team or 
                                submit a query through the InsurAI portal.
                            </p>
                            
                            <p style="margin-top: 30px;">
                                Best regards,<br/>
                                <strong>InsurAI Support Team</strong>
                            </p>
                        </div>
                        <div class="footer">
                            <p>This is an automated message. Please do not reply to this email.</p>
                            <p>&copy; 2024 InsurAI Policy Automation System. All rights reserved.</p>
                        </div>
                    </div>
                </body>
            </html>
            """, employeeName, claimId, policyName, reason);
        
        sendEmail(employeeEmail, subject, htmlContent);
    }
    
    /**
     * Generic email sending method
     */
    private void sendEmail(String toEmail, String subject, String htmlContent) {
        if (sendGrid == null) {
            System.err.println("⚠️ SendGrid not configured. Cannot send email.");
            return;
        }
        
        try {
            Email from = new Email(FROM_EMAIL);
            Email to = new Email(toEmail);
            Content content = new Content("text/html", htmlContent);
            Mail mail = new Mail(from, subject, to, content);
            
            com.sendgrid.Request request = new com.sendgrid.Request();
            request.setMethod(com.sendgrid.Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            
            com.sendgrid.Response response = sendGrid.api(request);
            
            if (response.getStatusCode() >= 200 && response.getStatusCode() < 300) {
                System.out.println("✓ Email sent successfully to " + toEmail);
            } else {
                System.err.println("✗ SendGrid error: " + response.getStatusCode() + " - " + response.getBody());
            }
        } catch (IOException e) {
            System.err.println("✗ Error sending email to " + toEmail + ": " + e.getMessage());
            e.printStackTrace();
        } catch (Exception e) {
            System.err.println("✗ Unexpected error sending email: " + e.getMessage());
            e.printStackTrace();
        }
    }
    public void sendClaimSubmissionEmail(
        String employeeEmail,
        String employeeName,
        Long claimId,
        String claimTitle,
        Double amount
) {
    if (sendGrid == null) return;

    String subject = "Claim Submitted Successfully - InsurAI";
    String htmlContent = String.format("""
        <html>
        <body style="font-family: Arial, sans-serif;">
            <h2>Claim Submitted</h2>
            <p>Dear <strong>%s</strong>,</p>
            <p>Your claim has been submitted successfully.</p>
            <ul>
                <li><b>Claim ID:</b> #%d</li>
                <li><b>Type:</b> %s</li>
                <li><b>Amount:</b> ₹%.2f</li>
                <li><b>Status:</b> Pending</li>
            </ul>
            <p>Our HR team will review your claim shortly.</p>
            <p>Regards,<br/>InsurAI Team</p>
        </body>
        </html>
        """, employeeName, claimId, claimTitle, amount);

    sendEmail(employeeEmail, subject, htmlContent);
}
public void sendClaimAssignedToHrEmail(
        String hrEmail,
        String hrName,
        Long claimId,
        String claimTitle,
        Double amount
) {
    if (sendGrid == null) return;

    String subject = "New Claim Assigned to You - InsurAI";
    String htmlContent = String.format("""
        <html>
        <body style="font-family: Arial, sans-serif;">
            <h2>New Claim Assigned</h2>
            <p>Dear <strong>%s</strong>,</p>
            <p>A new claim has been assigned to you for review.</p>
            <ul>
                <li><b>Claim ID:</b> #%d</li>
                <li><b>Type:</b> %s</li>
                <li><b>Amount:</b> ₹%.2f</li>
            </ul>
            <p>Please log in to the HR dashboard to take action.</p>
            <p>Regards,<br/>InsurAI System</p>
        </body>
        </html>
        """, hrName, claimId, claimTitle, amount);

    sendEmail(hrEmail, subject, htmlContent);
}
public void sendEmployeeQueryToAgentEmail(
        String agentEmail,
        String employeeName,
        Long queryId,
        String queryText,
        String policyName,
        String claimType
) {
    if (sendGrid == null) return;

    String subject = "New Employee Query - InsurAI";
    String htmlContent = String.format("""
        <html>
        <body style="font-family: Arial, sans-serif;">
            <h2>New Employee Query</h2>
            <p>An employee has submitted a new query.</p>
            <ul>
                <li><b>Employee:</b> %s</li>
                <li><b>Query ID:</b> #%d</li>
                <li><b>Query:</b> %s</li>
                <li><b>Policy:</b> %s</li>
                <li><b>Claim Type:</b> %s</li>
            </ul>
            <p>Please log in to the Agent dashboard to respond.</p>
            <p>Regards,<br/>InsurAI System</p>
        </body>
        </html>
        """, employeeName, queryId, queryText, policyName, claimType);

    sendEmail(agentEmail, subject, htmlContent);
}
public void sendAgentResponseToEmployeeEmail(
        String employeeEmail,
        Long queryId,
        String queryText,
        String response,
        String policyName,
        String claimType
) {
    if (sendGrid == null) return;

    String subject = "Response to Your Query - InsurAI";
    String htmlContent = String.format("""
        <html>
        <body style="font-family: Arial, sans-serif;">
            <h2>Query Response</h2>
            <p>Your query has been answered.</p>
            <ul>
                <li><b>Query ID:</b> #%d</li>
                <li><b>Query:</b> %s</li>
                <li><b>Response:</b> %s</li>
                <li><b>Policy:</b> %s</li>
                <li><b>Claim Type:</b> %s</li>
            </ul>
            <p>You may log in to your dashboard for more details.</p>
            <p>Regards,<br/>InsurAI Team</p>
        </body>
        </html>
        """, queryId, queryText, response, policyName, claimType);

    sendEmail(employeeEmail, subject, htmlContent);
}
public void sendResetPasswordEmail(
        String toEmail,
        String employeeName,
        String resetLink
) {
    if (sendGrid == null) return;

    String subject = "Reset Your Password - InsurAI";
    String htmlContent = String.format("""
        <html>
        <body style="font-family: Arial, sans-serif;">
            <h2>Password Reset Request</h2>
            <p>Dear <strong>%s</strong>,</p>
            <p>We received a request to reset your password.</p>
            <p>
                <a href="%s"
                   style="display:inline-block;padding:10px 15px;
                          background-color:#0d6efd;color:white;
                          text-decoration:none;border-radius:4px;">
                    Reset Password
                </a>
            </p>
            <p>This link is valid for <strong>30 minutes</strong>.</p>
            <p>If you did not request this, please ignore this email.</p>
            <p>Regards,<br/>InsurAI Support Team</p>
        </body>
        </html>
        """, employeeName, resetLink);

    sendEmail(toEmail, subject, htmlContent);
}
}
