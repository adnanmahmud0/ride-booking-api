import { ICreateAccount, IResetPassword } from '../types/emailTamplate';

const commonStyle = {
  background: 'linear-gradient(#2b2b2b, #1f1f1f)',
  cardBg: '#2b2b2b',
  text: '#f5f5f5',
  secondaryText: '#cccccc',
  accent: '#00bfbf',
  logoDark: 'https://i.ibb.co/k2tNpGbB/ridebooking-dark.png',
};

const createAccount = (values: ICreateAccount) => {
  const data = {
    to: values.email,
    subject: 'Verify Your RideBooking Account',
    html: `
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background: ${commonStyle.background}; color: ${commonStyle.text};">
  <div style="max-width: 600px; margin: 40px auto; background-color: ${commonStyle.cardBg}; border-radius: 10px; overflow: hidden; box-shadow: 0 0 15px rgba(0,0,0,0.4);">
    <div style="padding: 20px; text-align: center;">
      <img src="${commonStyle.logoDark}" alt="RideBooking Logo" style="width: 120px; margin-bottom: 20px;" />
      <h2 style="font-size: 22px; margin-bottom: 10px;">Hey ${values.name},</h2>
      <p style="font-size: 16px; color: ${commonStyle.secondaryText}; margin-bottom: 20px;">Welcome to <strong style="color: ${commonStyle.accent};">RideBooking</strong>! Use the code below to verify your account.</p>
      <div style="background-color: ${commonStyle.accent}; color: #ffffff; font-size: 24px; letter-spacing: 3px; padding: 12px 24px; border-radius: 6px; display: inline-block; margin: 20px 0;">
        ${values.otp}
      </div>
      <p style="font-size: 14px; color: ${commonStyle.secondaryText};">This code is valid for <strong>3 minutes</strong>.</p>
    </div>
  </div>
</body>`,
  };
  return data;
};

const resetPassword = (values: IResetPassword) => {
  const data = {
    to: values.email,
    subject: 'Reset Your RideBooking Password',
    html: `
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background: ${commonStyle.background}; color: ${commonStyle.text};">
  <div style="max-width: 600px; margin: 40px auto; background-color: ${commonStyle.cardBg}; border-radius: 10px; overflow: hidden; box-shadow: 0 0 15px rgba(0,0,0,0.4);">
    <div style="padding: 20px; text-align: center;">
      <img src="${commonStyle.logoDark}" alt="RideBooking Logo" style="width: 120px; margin-bottom: 20px;" />
      <h2 style="font-size: 22px; margin-bottom: 10px;">Reset Your Password</h2>
      <p style="font-size: 16px; color: ${commonStyle.secondaryText}; margin-bottom: 20px;">Use the code below to reset your <strong style="color: ${commonStyle.accent};">RideBooking</strong> account password.</p>
      <div style="background-color: ${commonStyle.accent}; color: #ffffff; font-size: 24px; letter-spacing: 3px; padding: 12px 24px; border-radius: 6px; display: inline-block; margin: 20px 0;">
        ${values.otp}
      </div>
      <p style="font-size: 14px; color: ${commonStyle.secondaryText};">This code is valid for <strong>3 minutes</strong>.</p>
      <p style="font-size: 13px; color: #999999; text-align: left; margin-top: 20px;">
        If you did not request a password reset, you can safely ignore this email.
      </p>
    </div>
  </div>
</body>`,
  };
  return data;
};

export const emailTemplate = {
  createAccount,
  resetPassword,
};
