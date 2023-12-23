import nodemailer from "nodemailer"

export default nodemailer.createTransport({
  auth: {
    pass: process.env.NODEMAILER_PASSWORD,
    user: process.env.NODEMAILER_EMAIL,
  },
  service: "gmail",
})
