"use server";

import * as v from "valibot";
import { VSSignInForm } from "../../definitions";
import { parseFormData } from "@/lib/utils/form";
import { TUserFormState } from "@/lib/dataModels/auth/user/definitions";
import { getUserByEmail } from "@/lib/dataModels/auth/user/dataAccessControl";
import { auth } from "@/lib/features/authentication/auth";

export async function credentialsSignInActionServer(
  prevState: TUserFormState | null,
  formData: FormData,
): Promise<TUserFormState> {
  // retreive data
  const rawFormData = parseFormData(formData);

  // Validate form
  const validationResult = v.safeParse(VSSignInForm, rawFormData);

  // handle validation errors
  if (!validationResult.success) {
    const errors = v.flatten<typeof VSSignInForm>(validationResult.issues);
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

  // validate: verification status
  if (!user?.emailVerified) {
    return {
      mode: "read",
      data: rawFormData,
      errors: {
        root: ["Email is not verified yet."],
      },
    };
  }

  // validate: password: handled by better-auth
  // session management
  await auth.api.signInEmail({
    body: {
      email: apiSubmissionData.email,
      password: apiSubmissionData.password,
    },
  });

  return {
    mode: "read",
    status: "success",
    data: { ...validationResult.output },
  };
}
