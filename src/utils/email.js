import nodemailer from 'nodemailer';

// Configure the transport using environment variables
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE, // e.g., 'Gmail'
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (to, verificationURL) => {
  await transporter.sendMail({
    to,
    from: process.env.EMAIL_USER,
    subject: 'Email Verification',
    html: `<p>Please verify your email by clicking <a href="${verificationURL}">here</a>.</p>`,
  });
};
