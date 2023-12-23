import transporter from "./transporter"

export default async function sendEmail(
  email: Parameters<(typeof transporter)["sendMail"]>[0],
) {
  await new Promise((resolve, reject) => {
    transporter.verify((error, success) =>
      error ? reject(error) : resolve(success),
    )
  })
  await new Promise((resolve, reject) => {
    transporter.sendMail(
      {
        from: process.env.NODEMAILER_EMAIL,
        to: process.env.NODEMAILER_RECIPIENT,
        ...email,
      },
      (error, info) => (error ? reject(error) : resolve(info)),
    )
  })
  return true
}
