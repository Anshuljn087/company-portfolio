import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(req:Request){

  const form = await req.formData();

  const email = form.get("email");
  const phone = form.get("phone");
  const message = form.get("message");

  const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
      user:process.env.SMTP_EMAIL,
      pass:process.env.SMTP_PASS,
    }
  });

  await transporter.sendMail({
    from:process.env.SMTP_EMAIL,
    to:process.env.ADMIN_EMAIL,
    subject:"New Contact Request",
    text:`Email: ${email}\nPhone:${phone}\nMessage:${message}`
  });

  return NextResponse.json({success:true});
}