"use client";

import * as v from "valibot";

import { parseFormData } from "@/lib/utils/form";
import { signUpActionServer } from "./server";
import { TUserFormState } from "@/lib/dataModels/auth/user/definitions";
import { VSSignUpForm } from "../../definitions";
import { authClient } from "@/lib/features/authentication/auth-client";
import { routes } from "@/lib/utils/routeMapper";

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

  const result = await authClient.signUp.email({
    ...validationResult.output,
    callbackURL: routes.generic.home,
  });

  if (result.error?.message) {
    return {
      ...prevState,
      mode: "create",
      status: "error",
      data: rawFormData,
      errors: { root: [result.error.message] },
    };
  }

  return await signUpActionServer(prevState, formData);
}
