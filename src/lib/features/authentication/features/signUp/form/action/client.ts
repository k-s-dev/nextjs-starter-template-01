"use client";

import * as v from "valibot";

import { parseFormData } from "@/lib/utils/form";
import { signUpActionServer } from "./server";
import { TUserFormState } from "@/lib/dataModels/auth/user/definitions";
import { VSSignUpForm } from "../../definitions";

export async function signUpActionClient(
  prevState: TUserFormState | null,
  formData: FormData,
): Promise<TUserFormState> {
  const rawFormData = parseFormData(formData);

  const validationResult = v.safeParse(VSSignUpForm, rawFormData);

  if (!validationResult.success) {
    const errors = v.flatten<typeof VSSignUpForm>(validationResult.issues);
    return {
      ...prevState,
      mode: "create",
      status: "error",
      data: rawFormData,
      errors: errors,
    };
  }

  return await signUpActionServer(prevState, formData);
}
