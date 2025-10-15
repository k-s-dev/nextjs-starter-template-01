"use server";

import { getSessionUser } from "@/lib/features/authentication/getSessionUser";
import { deleteManyUsers } from "../../../dataAccessControl";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { routes } from "@/lib/utils/routeMapper";

export async function deleteManyUsersServerAction(
  ids: string[],
): Promise<"error" | never> {
  const sessionUser = await getSessionUser();

  try {
    await deleteManyUsers(ids, "client", sessionUser);
  } catch {
    return "error";
  }

  revalidatePath(routes.admin.root);
  redirect(routes.admin.user.read);
}
