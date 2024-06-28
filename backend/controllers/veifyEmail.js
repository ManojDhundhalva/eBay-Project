const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = async (req, resp) => {
  const code = Math.floor(Math.random() * 9000);
  const { username, emailid } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      requireTLS: true,
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASS,
      },
    });

    const mailOptions = {
      from: process.env.USER_EMAIL,
      to: emailid,
      subject: "for verification mail",
      html: "<p> Hii " + username + ", Your 4-digit code is : " + String(code),
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Email has been sent: ", info.response);
      }
    });
    resp.status(200).json({ code });
  } catch (err) {
    console.log(err.message);
    resp.json({ message: "fail" });
  }
};

module.exports = { sendEmail };
