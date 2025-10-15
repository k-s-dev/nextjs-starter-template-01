"use server";

import { TDataRequestMode } from "@/lib/utils/types";
import { TUserPublic } from "./definitions";
import { PermissionError } from "@/lib/utils/errors";
import { Prisma, USER_ROLE } from "@/generated/prisma/client";

export async function checkPermissions(
  operation: "create" | "read" | "update" | "delete" | "deleteMany" | "count",
  mode: TDataRequestMode,
  sessionUser?: TUserPublic,
  user?: Prisma.UserModel | null,
) {
  if (mode === "server") return;

  switch (operation) {
    case "read":
    case "update":
    case "delete":
      if (
        sessionUser &&
        sessionUser.role !== USER_ROLE.SUPERUSER &&
        sessionUser.id !== user?.id
      ) {
        throw new PermissionError({
          message: "Permission denied.",
          log: {
            message: `Permission denied to ${operation} user.`,
            data: {
              user,
              sessionUser,
            },
          },
        });
      }
      break;

    case "count":
    case "deleteMany":
      if (sessionUser && sessionUser.role !== USER_ROLE.SUPERUSER) {
        throw new PermissionError({
          message: "Permission denied.",
          log: {
            message: `Permission denied to ${operation} users.`,
            data: {
              sessionUser,
            },
          },
        });
      }
      break;

    default:
      break;
  }
}
