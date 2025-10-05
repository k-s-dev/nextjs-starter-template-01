"use client";

import * as v from "valibot";

import { parseFormData } from "@/lib/utils/form";
import { VSResetPasswordForm } from "../definitions";
import { TUserFormState } from "@/lib/dataModels/auth/user/definitions";
import { resetPasswordServerAction } from "./server";

export async function resetPasswordClientAction(
  serverAction: typeof resetPasswordServerAction,
  validationSchema: typeof VSResetPasswordForm,
  email: string,
  prevState: TUserFormState | null,
  formData: FormData,
): Promise<TUserFormState> {
  const rawFormData = parseFormData(formData);

  const validationResult = v.safeParse(validationSchema, rawFormData);
  if (!validationResult.success) {
    const errors = v.flatten<typeof validationSchema>(validationResult.issues);
    return {
      ...prevState,
      mode: "update",
      status: "failed",
      data: { ...rawFormData, email: email },
      errors: errors,
    };
  }

  return await serverAction(email, prevState, formData);
}
