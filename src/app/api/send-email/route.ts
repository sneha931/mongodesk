
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { recipients, subject, body } = await req.json();

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json({ error: "Recipients required" }, { status: 400 });
    }

    // Gmail transporter with App Password
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER, // your Gmail address
        pass: process.env.SMTP_PASS, // your 16-char app password
      },
    });

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: recipients.join(","),
      subject: subject || "AI Summary",
      text: body,
    });

    return NextResponse.json({ ok: true, messageId: info.messageId });
  } catch (err: unknown) {
    const error = err as Error;
  console.error(error);
    return NextResponse.json(
    { error: error.message || "Failed to send email" },
    { status: 500 }
  );
  }
}
