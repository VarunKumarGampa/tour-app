const nodemailer = require('nodemailer');
// const { login } = require('../controllers/authController');

const sendEmail = async options => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 25,
    logger : true,
    secure:false,
    debug : true,
    tls:{
        rejectUnauthorized: true
    },
    auth: {
      user: 'f3b6471574edc5',
      pass: 'b63d0796945f83'
    }
  });
  
  // 2) Define the email options
  const mailOptions = {
    from: 'test@jonas.io',
    to: options.email,
    subject: options.subject,
    text: options.message
    // html:
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
