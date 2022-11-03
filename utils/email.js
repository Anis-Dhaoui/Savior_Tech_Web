const nodemailer = require("nodemailer");

const sendEmail = (email, subject, message) => {
  const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    service: process.env.SERVICE,
    port: 587,
    secure: true,
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.SENDER_PWD,
    },
  });

  transporter.sendMail({
    from: 'SAVIOR TECH',
    to: email,
    subject: subject,
    html: message
  }, console.log("Email was sent succesfully"))
    .catch(err => console.log(err))
};

module.exports = sendEmail;