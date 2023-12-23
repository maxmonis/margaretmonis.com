import nodemailer from "nodemailer"

export const transporter = nodemailer.createTransport({
  auth: {
    pass: process.env.NODEMAILER_PASSWORD,
    user: process.env.NODEMAILER_EMAIL,
  },
  service: "gmail",
})
