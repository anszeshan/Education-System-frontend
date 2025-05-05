const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your-email@gmail.com",
    pass: "your-email-password",
  },
});

exports.sendInvite = (email, name) => {
  const mailOptions = {
    from: "your-email@gmail.com",
    to: email,
    subject: "Welcome to Gafen School System",
    text: `Hello ${name},\n\nYou have been invited to join the Gafen School System as a guide. Please log in to get started.\n\nBest regards,\nGafen Team`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) console.log(err);
    else console.log("Email sent: " + info.response);
  });
};