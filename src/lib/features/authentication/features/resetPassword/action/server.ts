"use server";

import * as v from "valibot";
import { redirect } from "next/navigation";
import { routes } from "@/lib/utils/routeMapper";
import { VSResetPasswordForm } from "../definitions";
import { parseFormData } from "@/lib/utils/form";
import { TUserFormState } from "@/lib/dataModels/auth/user/definitions";
import { auth } from "../../../auth";

export async function resetPasswordServerAction(
  token: string,
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
      },
      errors: errors,
    };
  }

  // prepare form data for submission to backend
  const apiSubmissionData = {
    ...validationResult.output,
  };
  let data;

  // try submitting data to backend
  try {
    data = await auth.api.resetPassword({
      body: {
        newPassword: apiSubmissionData.password,
        token: token,
      }
    })
    console.log(data)
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
