const nodemailer = require('nodemailer');

// Your Hostinger SMTP credentials
const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true, // true for 465, false for 587
  auth: {
    user: 'info@neonbankcapital.com',
    pass: 'Infosonkay@20'
  }
});

// Test email with professional template
const otp = '123456';
const userName = 'Test User';

const mailOptions = {
  from: '"Neon Capital Bank" <info@neonbankcapital.com>',
  to: 'yawboafo77@gmail.com',
  subject: 'Your Neon Capital Bank Security Code',
  text: `Dear ${userName},\n\nYour one-time verification code is: ${otp}\n\nThis code will expire in 10 minutes.\n\nFor your security, never share this code with anyone, including Neon Capital Bank staff.\n\nIf you did not request this code, please contact our support team immediately.\n\nBest regards,\nNeon Capital Bank Security Team\n\nThis is an automated message. Please do not reply to this email.`,
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Neon Capital Bank - Security Code</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f7fa;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center" style="padding: 40px 20px;">
            <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
              
              <!-- Header with Logo -->
              <tr>
                <td style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 32px 40px; border-radius: 12px 12px 0 0; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                    Neon Capital Bank
                  </h1>
                  <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.9); font-size: 14px; font-weight: 500;">
                    Secure Banking Solutions
                  </p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 40px 32px 40px;">
                  <h2 style="margin: 0 0 16px 0; color: #1f2937; font-size: 22px; font-weight: 600;">
                    Hello ${userName},
                  </h2>
                  <p style="margin: 0 0 24px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                    You requested a one-time verification code to access your Neon Capital Bank account. Please use the code below to complete your login:
                  </p>
                  
                  <!-- OTP Code Box -->
                  <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 32px 0;">
                    <tr>
                      <td style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border: 2px solid #3b82f6; border-radius: 10px; padding: 24px; text-align: center;">
                        <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                          Your Verification Code
                        </p>
                        <p style="margin: 0; color: #1e40af; font-size: 42px; font-weight: 700; letter-spacing: 12px; font-family: 'Courier New', monospace;">
                          ${otp}
                        </p>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="margin: 0 0 24px 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                    <strong style="color: #ef4444;">⏱️ This code will expire in 10 minutes.</strong> For your security, please do not share this code with anyone.
                  </p>
                  
                  <!-- Security Notice -->
                  <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 24px 0; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 6px;">
                    <tr>
                      <td style="padding: 16px 20px;">
                        <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.5;">
                          <strong>🔒 Security Reminder:</strong><br>
                          Neon Capital Bank will never ask you to share your verification code via phone, email, or text message. If you did not request this code, please contact our support team immediately.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f9fafb; padding: 32px 40px; border-radius: 0 0 12px 12px; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0 0 12px 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                    Best regards,<br>
                    <strong style="color: #1f2937;">Neon Capital Bank Security Team</strong>
                  </p>
                  
                  <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 20px 0 16px 0;">
                    <tr>
                      <td style="text-align: center; padding: 16px 0; border-top: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb;">
                        <p style="margin: 0 0 8px 0; color: #9ca3af; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                          Need Help?
                        </p>
                        <p style="margin: 0; color: #1e40af; font-size: 14px; font-weight: 600;">
                          support@neonbankcapital.com
                        </p>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="margin: 16px 0 0 0; color: #9ca3af; font-size: 11px; line-height: 1.5; text-align: center;">
                    This is an automated message from Neon Capital Bank. Please do not reply to this email.<br>
                    © ${new Date().getFullYear()} Neon Capital Bank. All rights reserved.<br>
                    <span style="color: #d1d5db;">|</span> FDIC Insured <span style="color: #d1d5db;">|</span> Member FDIC <span style="color: #d1d5db;">|</span> Equal Housing Lender
                  </p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
};

// Send test email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('❌ Error sending email:', error);
  } else {
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);
  }
});
