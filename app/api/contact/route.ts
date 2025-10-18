import { sendEmail } from "@/lib/resend";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, contact, message } = body;

    // Validate input
    if (!name || !contact || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Create HTML email template
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
            }
            .header {
              background-color: #000;
              color: #fff;
              padding: 20px;
              text-align: center;
              border-radius: 5px 5px 0 0;
            }
            .content {
              background-color: #fff;
              padding: 30px;
              border-radius: 0 0 5px 5px;
            }
            .field {
              margin-bottom: 20px;
            }
            .label {
              font-weight: bold;
              color: #555;
              margin-bottom: 5px;
            }
            .value {
              padding: 10px;
              background-color: #f5f5f5;
              border-left: 3px solid #000;
              border-radius: 3px;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              color: #777;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">New Customer Inquiry</h1>
              <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">Bobbin Contact Form</p>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Customer Name:</div>
                <div class="value">${name}</div>
              </div>
              <div class="field">
                <div class="label">Contact Information:</div>
                <div class="value">${contact}</div>
              </div>
              <div class="field">
                <div class="label">Message:</div>
                <div class="value">${message.replace(/\n/g, "<br>")}</div>
              </div>
              <div class="footer">
                <p>Received on ${new Date().toLocaleString()}</p>
                <p>This email was sent from your Bobbin website contact form.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email
    await sendEmail(
      "onboarding@resend.dev",
      emailHtml,
      `New Customer Inquiry from ${name}`
    );

    return NextResponse.json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}
