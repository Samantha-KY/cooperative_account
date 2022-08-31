// const nodemailer = require("nodemailer");


// const  sendEmail = async (param) => {

//     let testAccount = await nodemailer.createTestAccount();

//   // create reusable transporter object using the default SMTP transport
//   let transporter = nodemailer.createTransport({
//     host: "smtp.ethereal.email",
//     port: 587,
//     secure: false, // true for 465, false for other ports
//     auth: {
//       user: testAccount.user, // generated ethereal user
//       pass: testAccount.pass, // generated ethereal password
//     },
//   });

//   const emailPayload = {
//     from: '"Agriculture Cooperative Admin 👻" <admin@agricoop.rw>', // sender addres
//     to: param.to.join(","),
//     subject : param.subject,
//     text: param.text,
//     html: param.html
//   };

//   const parms = {
//     to : ["test@mail.com"],
//     subject: "TITLE",
//     text: "SENDING EMAIL",
//     html: "<b><b>"
//   }

//   // send mail with defined transport object
//   let info = await transporter.sendMail(emailPayload);

//   console.log("Message sent: %s", info.messageId);
//   // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

//   // Preview only available when sending through an Ethereal account
//   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

//   return info;
// };

// module.exports = sendEmail(
// );