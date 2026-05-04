const nodemailer = require('nodemailer');

// Create a transporter for sending emails
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send notification email when a new question is submitted
const sendQuestionNotification = async (questionData) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to admin email
      subject: 'New Question Submitted - Bhaktapur International Hospital',
      html: `
        <h2>New Question Submitted</h2>
        <p><strong>Name:</strong> ${questionData.name}</p>
        <p><strong>Email:</strong> ${questionData.email}</p>
        <p><strong>Question:</strong> ${questionData.question}</p>
        <p><strong>Submitted at:</strong> ${new Date(questionData.createdAt).toLocaleString()}</p>
        <p>Please log into the admin panel to respond to this question.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Question notification email sent successfully');
  } catch (error) {
    console.error('Error sending question notification email:', error);
  }
};

// Send response email when a question is answered
const sendQuestionResponse = async (questionData) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: questionData.email, // Send back to the user
      subject: 'Response to Your Question - Bhaktapur International Hospital',
      html: `
        <h2>Response to Your Question</h2>
        <p>Dear ${questionData.name},</p>
        <p>Thank you for your question. Here is our response:</p>
        <p><strong>Your Question:</strong> ${questionData.question}</p>
        <p><strong>Our Answer:</strong> ${questionData.answer}</p>
        <p>If you have any further questions, please feel free to ask us.</p>
        <p>Best regards,<br/>
        Bhaktapur International Hospital Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Question response email sent successfully');
  } catch (error) {
    console.error('Error sending question response email:', error);
  }
};

module.exports = {
  sendQuestionNotification,
  sendQuestionResponse
};