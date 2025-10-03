"use server";

import { getUserByEmail } from "@/lib/dataModels/auth/user/dataAccess";
import { TUser } from "@/lib/dataModels/auth/user/definitions";
import { sendVerificationEmail } from "../../verification";

export async function sendResetPasswordEmail(email: string): Promise<IReturn> {
  const user: TUser = await getUserByEmail(email, "server");

  // validate: existing user
  if (!user)
    return {
      status: "error",
      message: "User does not exist.",
    };

  // validate: verification status
  if (!user?.emailVerified)
    return {
      status: "error",
      message: "Email not verified. Please verify email first.",
    };

  // send reset password link
  try {
    await sendVerificationEmail(email, "RESET_PASSWORD");
  } catch {
    return {
      status: "error",
      message: "Internal server error. Please try again later.",
    };
  }
  return {
    status: "success",
    message: "Reset password link sent to the registered email.",
  };
}

interface IReturn {
  status: "error" | "success";
  message: string;
}
