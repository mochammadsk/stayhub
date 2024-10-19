const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

// Function to send password reset email
function sendResetPasswordEmail(email, userName, resetToken) {
  return new Promise((resolve, reject) => {
    // Create reusable transporter object using SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,
      },
    });

    transporter.verify((error, success) => {
      if (error) {
        console.log(error);
      } else {
        console.log("User password reset service:", success);
      }
    });

    // Send mail with defined transport object
    transporter.sendMail(
      {
        from: `"noreply" <${process.env.AUTH_EMAIL}>`,
        to: email,
        subject: "Password Reset",
        html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
            <div style="text-align: center;">
              <a href="https://ibb.co.com/rxgRDYd"><img src="https://i.ibb.co.com/rxgRDYd/Stay-Hub-Logo.png" alt="StayHub-Logo" style="max-width: 100x;"></a>
            </div>
            <p style="color: #333;">
              Hello <b>${userName}</b>,
            </p>
            <p style="color: #333;">
              To reset your password, please click the link below
            </p>
            <div style="text-align: center; margin: 20px 0;">
              <a href='http://localhost:8000/user/forgot-password/${resetToken}' style="display: inline-block; padding: 10px 20px; color: #fff; background-color: #007BFF; border-radius: 5px; text-decoration: none;">
                Reset Password
              </a>
            </div>
            <p style="color: #333;">
              If you did not request a password reset, please ignore this email.
            </p>
            <p style="color: #333;">Best regards,<br/>
              <b>Ganesha Inovasi Teknologi Team</b>
            </p>
          </div>
        </div>
      `,
      },
      (error, info) => {
        if (error) {
          reject(error);
        } else {
          resolve(info);
        }
      }
    );
  });
}

module.exports = sendResetPasswordEmail;
