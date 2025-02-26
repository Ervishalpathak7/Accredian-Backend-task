import nodemailer from 'nodemailer';


// Configure the transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER, 
    pass: process.env.GMAIL_APP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false, 
},
});

// Send referral email
const sendReferralEmail = async (referrerName, referrerEmail, referredName, referredEmail) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: referredEmail,
    subject: 'You’ve been referred!',
    html: `
      <h2>Hello ${referredName},</h2>
      <p><b>${referrerName}</b> has referred you to join our platform! 🎉</p>
      <p>Click the link below to register and claim your spot:</p>
      <a href="http://yourapp.com/register?email=${referredEmail}">Register Now</a>
      <p>Cheers,<br />The Team</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📩 Referral email sent to ${referredEmail}`);
  } catch (error) {
    console.error('Failed to send referral email:', error);
    throw error;
  }
};

export default sendReferralEmail;