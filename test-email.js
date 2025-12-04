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

// Test email
const mailOptions = {
  from: '"Neon Capital" <info@neonbankcapital.com>',
  to: 'yawboafo77@gmail.com',
  subject: 'Test OTP - Neon Capital',
  text: 'Your verification code is: 123456',
  html: `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Your Verification Code</h2>
      <p>Your Neon Capital verification code is:</p>
      <h1 style="color: #00ff88; letter-spacing: 5px;">123456</h1>
      <p>This code will expire in 10 minutes.</p>
      <p style="color: #666; font-size: 12px;">Never share this code with anyone.</p>
    </div>
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
