import nodemailer from "nodemailer";
import config from "../config";
import { ISendEmail } from "../types/email";
import { errorLogger, logger } from "../shared/looger";

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: Number(config.email.port),
  secure: true, // true for 465, false for other ports
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

const sendEmail = async (values: ISendEmail) => {
  try {
    const info = await transporter.sendMail({
      from: `"Ride Booking" ${config.email.from}`,
      to: values.to,
      subject: values.subject,
      html: values.html,
    });

    logger.info("Mail send successfully", info.accepted);
  } catch (error) {
    errorLogger.error("Email", error);
  }
};

export const emailHelper = {
  sendEmail,
};
