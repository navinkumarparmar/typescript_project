import dotenv from 'dotenv';
const nodemailer = require('nodemailer');
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = (to: string, subject: string, text: string,) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to,
    subject,
    text,
   
  };

  transporter.sendMail(mailOptions, (error: any, info: any) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
      
    }
  });
};

export { sendEmail };

  




