// import nodemailer from "nodemailer";
// import dotenv from "dotenv";
// dotenv.config();

// // Create a transporter object using SMTP
// const transporter = nodemailer.createTransport({        
//     host: process.env.SMTP_HOST,
//     port: process.env.SMTP_PORT,
//     secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
//     auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASS,
//     },
// });
// // Function to send email
// export const sendEmail = async (to, subject, text, html) => {
//     try {
//         const mailOptions = {
//             from: `"Aifule" <${process.env.SMTP_USER}>`, // sender address
//             to, // list of receivers
//             subject, // Subject line
//             text, // plain text body
//             html, // html body
//         };

//         // Send mail with defined transport object
//         const info = await transporter.sendMail(mailOptions);
//         console.log("Message sent: %s", info.messageId);
//     } catch (error) {
//         console.error("Error sending email:", error);
//     }
// }
// // Export the transporter for use in other modules
// export default transporter;
// // This transporter can be used to send emails throughout your application
// // For example, you can use it in your user registration or password reset flows


// //let's send a mail to varify the email address without this user cannot login by genrating a otp
// export const sendVerificationEmail = async (user) => {
//     const verificationToken = user.verificationToken; // Assuming you have a verification token in the user model
//     const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    
//     const subject = "Email Verification - Aifule";
//     const text = `Please verify your email by clicking on the following link: ${verificationUrl}`;
//     const html = `<p>Please verify your email by clicking on the following link:</p><a href="${verificationUrl}">Verify Email</a>`;
    
//     try {
//         await sendEmail(user.email, subject, text, html);
//         console.log("Verification email sent successfully");
//     } catch (error) {
//         console.error("Error sending verification email:", error);
//     }
// }
// // This function can be called after user registration to send a verification email
// // Make sure to generate a verification token and save it in the user model before calling this function
// // You can use a library like jsonwebtoken to generate the token