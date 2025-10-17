"use server";

import { Prisma } from "@/generated/prisma/client";
import { checkPermissionsAttributes } from "../globalPermissions";
import { TDataRequestMode } from "@/lib/utils/types";
import { TUserPublic } from "../user/definitions";
import prisma from "@/database/prismaClient";
import { DbError } from "@/lib/utils/errors";

export async function updateAccountByEmail(
  email: string,
  data: Prisma.AccountUpdateInput,
  mode: TDataRequestMode = "client",
  sessionUser?: TUserPublic,
) {
  await checkPermissionsAttributes(mode, sessionUser);
  let account;
  const accounts = await prisma.user
    .findUnique({ where: { email: email } })
    .accounts();

  if (accounts) {
    try {
      account = await prisma.account.update({
        where: { id: accounts[0].id },
        data: data,
      });
    } catch (error) {
      throw new DbError({
        message: "User update failed due to internal server error.",
        cause: error,
        log: {
          message: "DbError: User update failed.",
          data: data,
        },
      });
    }
  }

  return account;
}
