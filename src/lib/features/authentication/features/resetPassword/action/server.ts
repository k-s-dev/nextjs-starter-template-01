"use server";

import * as v from "valibot";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

import { routes } from "@/lib/utils/routeMapper";
import { VSResetPasswordForm } from "../definitions";
import { parseFormData } from "@/lib/utils/form";
import { TUserFormState } from "@/lib/dataModels/auth/user/definitions";
import { getUserByEmail } from "@/lib/dataModels/auth/user/dataAccessControl";
import { updateAccountByEmail } from "@/lib/dataModels/auth/account/dataAccessControl";

export async function resetPasswordServerAction(
  email: string,
  prevState: TUserFormState | null,
  formData: FormData,
): Promise<TUserFormState> {
  // retreive data
  const rawFormData = parseFormData(formData);

  // Validate form
  const validationResult = v.safeParse(VSResetPasswordForm, rawFormData);

  // handle validation errors
  if (!validationResult.success) {
    const errors = v.flatten<typeof VSResetPasswordForm>(
      validationResult.issues,
    );
    return {
      mode: "update",
      data: {
        ...rawFormData,
        email: email,
      },
      errors: errors,
    };
  }

  // prepare form data for submission to backend
  const apiSubmissionData = {
    ...validationResult.output,
    email: email,
  };

  const hashedPassword = await bcrypt.hash(
    validationResult.output.password,
    10,
  );

  const existingUser = await getUserByEmail(apiSubmissionData.email, "server");

  if (!existingUser) {
    return {
      mode: "update",
      data: {
        ...rawFormData,
        email: email,
      },
      errors: {
        root: ["User not found."],
      },
    };
  }

  // try submitting data to backend
  try {
    await updateAccountByEmail(
      apiSubmissionData.email,
      { password: hashedPassword },
      "server",
    );
  } catch (error) {
    console.log(error);
    return {
      mode: "update",
      status: "error",
      errors: {
        root: [
          "Failed to update user due to internal server error. Please try again",
        ],
      },
    };
  }

  redirect(routes.all.signIn);
}
