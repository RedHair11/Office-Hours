import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Create a transporter object using your email service details
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE_PROVIDER, //gmail
    auth: {
        user: process.env.EMAIL_USER, // Email addresss
        pass: process.env.EMAIL_PASS, //Email Password
    }
});

export default transporter;