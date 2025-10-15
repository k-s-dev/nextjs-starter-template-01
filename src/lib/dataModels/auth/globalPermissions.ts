"use server";

import { TDataRequestMode } from "@/lib/utils/types";
import { PermissionError } from "@/lib/utils/errors";
import { Prisma, USER_ROLE } from "@/generated/prisma/client";
import { TUserPublic } from "./user/definitions";

export async function checkPermissionsAttributes(
  mode: TDataRequestMode,
  sessionUser?: TUserPublic,
) {
  if (mode === "server") return;

  if (mode === "client" && !sessionUser) {
    throw new PermissionError({
      message: "Permission denied.",
      log: {
        message: "Permission denied to get user.",
        data: {
          sessionUser,
        },
      },
    });
  }

  return;
}

export async function checkGlobalPermissions(
  operation: "create" | "read" | "update" | "delete" | "deleteMany" | "count",
  model: Prisma.ModelName,
  mode: TDataRequestMode,
  sessionUser?: TUserPublic,
) {
  if (mode === "server") return;

  switch (operation) {
    default:
      if (sessionUser && sessionUser.role !== USER_ROLE.SUPERUSER) {
        throw new PermissionError({
          message: "Permission denied.",
          log: {
            message: `Permission denied to ${operation} ${model}.`,
            data: {
              sessionUser,
            },
          },
        });
      }
      break;
  }
}
