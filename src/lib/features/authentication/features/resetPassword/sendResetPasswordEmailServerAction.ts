"use server";

import { getUserByEmail } from "@/lib/dataModels/auth/user/dataAccessControl";
import { sendVerificationEmail } from "../../verification";
import { auth } from "../../auth";
import { headers } from "next/headers";

export async function sendResetPasswordEmailServerAction(): Promise<IReturn> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // validate: existing user
  if (!session?.user.email)
    return {
      status: "error",
      message: "UnAuthorized access.",
    };

  const user = await getUserByEmail(session?.user.email, "server");

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
    await sendVerificationEmail(user.email, "RESET_PASSWORD");
  } catch {
    return {
      status: "error",
      message: "Internal server error. Please try again later.",
    };
  }
  return {
    status: "success",
    message: `Reset password link sent to "${user.email}"`,
  };
}

interface IReturn {
  status: "error" | "success";
  message: string | React.ReactNode;
}
