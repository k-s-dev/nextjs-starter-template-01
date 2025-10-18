"use server";

import * as jose from "jose";
import { getEnvVariableValue } from "@/lib/utils/env";
import {
  createVerificationToken,
  deleteExpiredVerificationTokens,
  deleteVerificationToken,
  getVerificationToken,
} from "@/lib/dataModels/auth/verification/dataAccessControl";
import {
  getUser,
  updateUser,
} from "@/lib/dataModels/auth/user/dataAccessControl";
import { sendMail } from "@/lib/utils/email";
import { DbError } from "@/lib/utils/errors";
import { createEmailHtml } from "./createEmailHtml";
import { TOKEN_TYPE } from "./definitions";

const { authSecret } = await getAuthEnvVariables();
const jwtSecret = jose.base64url.decode(authSecret);

export async function getAuthEnvVariables() {
  const authSecret = await getEnvVariableValue("BETTER_AUTH_SECRET");
  const authEmailId = await getEnvVariableValue("EMAIL_ID");
  const authEmailPassword = await getEnvVariableValue("EMAIL_PASSWORD");

  return { authSecret, authEmailId, authEmailPassword };
}

export async function generateVerificationToken(
  email: string,
  tokenType: TOKEN_TYPE,
) {
  const tokenObj = await getVerificationToken(email, tokenType);
  if (tokenObj) {
    await deleteVerificationToken(
      tokenObj.identifier,
      tokenType,
      tokenObj.value,
    );
    await deleteExpiredVerificationTokens();
  }

  const expires = new Date(new Date().getTime() + 2 * 3600 * 1000);
  const payloadIn = { email };

  const jwt = await new jose.EncryptJWT(payloadIn)
    .setProtectedHeader({ alg: "dir", enc: "A128CBC-HS256" })
    .setExpirationTime(expires)
    .encrypt(jwtSecret);

  await createVerificationToken({
    identifier: email,
    value: jwt,
    expiresAt: expires,
  });

  return jwt;
}

export async function sendVerificationEmail(
  email: string,
  url: string,
  tokenType: TOKEN_TYPE,
) {
  const appName = process.env.APP_NAME?.toUpperCase();
  const nodeEnv = process.env.NODE_ENV;

  await deleteExpiredVerificationTokens();

  let title, text;

  switch (tokenType) {
    case "EMAIL_VERIFICATION":
      title = "Email verification";
      text = "verify your email";
      break;

    case "RESET_PASSWORD":
      title = "Reset password";
      text = "reset your password";
      break;

    default:
      return;
  }

  if (nodeEnv === "production") {
    await sendMail({
      to: email,
      subject: `${appName}: ${title} link`,
      html: createEmailHtml(url, title),
      text: `Click the link to ${text}: ${url}`,
    });
  } else {
    console.log(`${tokenType} verification url:\n${url}`)
  }
}

export async function verifyToken(
  token: string,
  tokenType: TOKEN_TYPE,
): Promise<{
  data?: jose.JWTDecryptResult<jose.JWTPayload> | undefined;
  status?: "success" | "failed" | "verified";
  message?: string;
  log?: string;
}> {
  let result;

  try {
    result = await jose.jwtDecrypt(token, jwtSecret, {});
  } catch {
    return {
      status: "failed",
      data: result,
      message: "Invalid token.",
    };
  }

  const existingToken = await getVerificationToken(
    result.payload.email as string,
    "RESET_PASSWORD",
    token,
  );

  if (!existingToken) {
    return {
      status: "failed",
      data: result,
      message: "Invalid token.",
    };
  }

  if (tokenType === "EMAIL_VERIFICATION") {
    const user = await getUser(
      {
        email: result.payload.email as string,
      },
      "server",
    );

    if (!user) {
      return {
        status: "failed",
        message: "Invalid token.",
      };
    }

    if (user.emailVerified) {
      return {
        status: "verified",
        data: result,
      };
    }
  }

  try {
    await updateUser(
      { email: result.payload.email as string },
      {
        emailVerified: true,
      },
      "server",
    );
  } catch (error) {
    throw new DbError({
      message: "Email verification failed due to internal server error.",
      cause: error,
      log: {
        message: "DbError: User update failed.",
        data: result.payload,
      },
    });
  }

  // await deleteVerificationToken(
  //   result.payload.email as string,
  //   token,
  //   tokenType,
  // );

  await deleteExpiredVerificationTokens();

  return {
    status: "success",
    data: result,
  };
}
