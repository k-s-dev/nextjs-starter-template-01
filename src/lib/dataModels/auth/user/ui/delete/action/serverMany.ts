"use server";

import { getSessionUser } from "@/lib/features/authentication/getSessionUser";
import { deleteManyUsers } from "../../../dataAccessControl";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { routes } from "@/lib/utils/routeMapper";

export async function deleteManyUsersServerAction(
  ids: string[],
) {
  const sessionUser = await getSessionUser();
  const failedDeleteUsers = await deleteManyUsers(ids, "client", sessionUser);
  if (failedDeleteUsers) {
    return failedDeleteUsers;
  }
  revalidatePath(routes.admin.root);
  return redirect(routes.admin.user.read);
}
