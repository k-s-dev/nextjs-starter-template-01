import * as v from "valibot";

import { parseFormData } from "@/lib/utils/form";
import {
  TUserFormState,
  TUserPublic,
  userRoleEnum,
  VSUserCrudForm,
} from "../../../definitions";
import { updateUserServerAction } from "./serverAction";

export async function updateUserClientAction(
  user: TUserPublic,
  imageFile: File | null,
  prevState: TUserFormState | null,
  formData: FormData,
): Promise<TUserFormState> {
  let rawFormData = parseFormData(formData, ["imageFile"]);
  if (user.role === userRoleEnum.SUPERUSER) {
    rawFormData = {
      ...rawFormData,
      role: userRoleEnum.SUPERUSER,
    };
  }

  const validationResult = v.safeParse(VSUserCrudForm, rawFormData);
  if (!validationResult.success) {
    const errors = v.flatten<typeof VSUserCrudForm>(validationResult.issues);
    return {
      ...prevState,
      mode: "update",
      status: "failed",
      data: { ...rawFormData },
      errors: errors,
    };
  }

  return await updateUserServerAction(user, imageFile, prevState, formData);
}
