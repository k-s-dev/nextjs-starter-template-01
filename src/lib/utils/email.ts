"use server";

import * as nodemailer from "nodemailer";

import { SendMailError } from "@/lib/utils/errors";
import { getAuthEnvVariables } from "@/lib/features/authentication/verification";
import { getEnvVariableValue } from "./env";

const { authEmailId, authEmailPassword } = await getAuthEnvVariables();
const nodeEnv = await getEnvVariableValue("NODE_ENV");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: authEmailId,
    pass: authEmailPassword,
  },
});

export async function sendMail(dataIn: {
  to: string;
  html: string;
  text: string;
  from?: string;
  subject?: string;
}) {
  if (!dataIn.from) {
    dataIn.from = '"Shoonya Dev" <shunya.acad@gmail.com>';
  }

  try {
    if (nodeEnv === "production") {
      await transporter.sendMail(dataIn);
    } else {
      console.log(`send email: ${dataIn.to}, ${dataIn.subject}`);
    }
  } catch (error) {
    throw new SendMailError({
      message: "Failed to send email.",
      cause: error,
      log: {
        data: dataIn,
      },
    });
  }
}

