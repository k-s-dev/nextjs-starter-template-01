"use server";

import { revalidatePath } from "next/cache";
import { deleteUser } from "../../../dataAccessControl";
import { routes } from "@/lib/utils/routeMapper";
import { getSessionUser } from "@/lib/features/authentication/getSessionUser";
import { redirect } from "next/navigation";

export async function deleteUserServerAction(
  id?: string,
): Promise<"error" | never> {
  const sessionUser = await getSessionUser();

  try {
    await deleteUser({ id: id }, "client", sessionUser);
  } catch {
    return "error";
  }

  revalidatePath(routes.admin.root);
  redirect(routes.admin.user.read);
}
