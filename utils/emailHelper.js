const nodemailer = require("nodemailer");

const mailHelper = async (option) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const message = {
    from: "aliimranadil2@gmail.com", //sender address..
    to: option.email, //receiver address..
    subject: option.subject, //subject..
    text: option.message, //message..
    // html: "", //html body
  };

  //send mail with defined transport object...

  await transporter.sendMail(message);
};

module.exports = mailHelper;
