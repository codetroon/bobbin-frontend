"use client";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (
  from: string,
  html: string,
  subject: string = "Customer Inquiry"
) => {
  try {
    const email = await resend.emails.send({
      from,
      to: "support@bobbin.com.bd",
      subject,
      html,
    });
    return email;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
