const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "",
  port: 587,
  auth: {
    user: "",
    pass: "",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

async function mailer(to, subject, html, text) {
  const info = await transporter.sendMail({
    from: "",
    to,
    subject,
    html,
    text,
  });
}

module.exports = mailer;
