"use server";

import * as v from "valibot";

import { VSSignInFormBase } from "../../definitions";
import { parseFormData } from "@/lib/utils/form";
import { TUserFormState } from "@/lib/dataModels/auth/user/definitions";
import { getUserByEmail } from "@/lib/dataModels/auth/user/dataAccessControl";
import { auth } from "@/lib/features/authentication/auth";
import { routes } from "@/lib/utils/routeMapper";

export async function sendVerificationLinkActionServer(
  prevState: TUserFormState | null,
  formData: FormData,
): Promise<TUserFormState> {
  // retreive data
  const rawFormData = parseFormData(formData);

  // Validate form
  const validationResult = v.safeParse(VSSignInFormBase, rawFormData);

  // handle validation errors
  if (!validationResult.success) {
    const errors = v.flatten<typeof VSSignInFormBase>(validationResult.issues);
    return {
      mode: "read",
      data: rawFormData,
      errors: errors,
    };
  }

  // prepare form data for submission to backend
  const apiSubmissionData = {
    ...validationResult.output,
  };

  const user = await getUserByEmail(apiSubmissionData.email, "server");

  // validate: existing user
  if (!user) {
    return {
      mode: "read",
      data: rawFormData,
      errors: {
        root: ["Invalid credentials."],
      },
    };
  }

  if (user.emailVerified) {
    return {
      mode: "read",
      data: rawFormData,
      messages: ["Email already verified."],
    };
  }

  // send reset password link
  const data = await auth.api.sendVerificationEmail({
    body: {
      email: apiSubmissionData.email,
      callbackURL: routes.generic.home,
    },
  });
  if (data.status) {
    return {
      mode: "read",
      data: rawFormData,
      messages: [`Email verfication link sent to "${user.email}".`],
    };
  }

  return {
    mode: "read",
    data: rawFormData,
    messages: ["Failed to send email verification link, please try again."],
  };
}
