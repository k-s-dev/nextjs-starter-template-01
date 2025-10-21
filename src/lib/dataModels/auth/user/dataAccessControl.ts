"use server";

import prisma from "@/database/prismaClient";
import { DbError, PermissionError } from "@/lib/utils/errors";
import { TDataRequestMode } from "@/lib/utils/types";
import { TUserPublic } from "./definitions";
import { Prisma } from "@/generated/prisma/client";
import { checkPermissions } from "./permissions";
import { checkPermissionsAttributes } from "../globalPermissions";

const clientMask: Prisma.UserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  image: true,
  emailVerified: true,
};

export async function createUser(
  dataIn: Prisma.UserCreateInput,
  mode: TDataRequestMode = "client",
) {
  let user;

  // permissions check
  // anyone can signUp so no checks

  // create object
  try {
    user = await prisma.user.create({
      data: dataIn,
      select: mode === "client" ? clientMask : null,
    });
  } catch (error) {
    throw new DbError({
      message: "User creation failed due to internal server error.",
      cause: error,
      log: {
        message: "User creation failed.",
        data: dataIn,
      },
    });
  }

  return user;
}

export async function getUser(
  where: Prisma.UserWhereUniqueInput,
  mode: TDataRequestMode = "client",
  sessionUser?: TUserPublic,
): Promise<Prisma.UserModel | null> {
  let user;

  // check permissions attributes
  await checkPermissionsAttributes(mode, sessionUser);

  try {
    user = await prisma.user.findUnique({
      where: where,
      select: mode === "client" ? clientMask : null,
    });
  } catch (error) {
    throw new DbError({
      message: "Get user failed due to internal server error.",
      cause: error,
      log: {
        message: "Get user failed.",
        data: where,
      },
    });
  }

  //check permissions
  await checkPermissions("read", mode, sessionUser, user);

  return user;
}

export async function getUserByEmail(
  email: string,
  mode: TDataRequestMode = "client",
  sessionUser?: TUserPublic,
) {
  let user;

  // check permissions
  await checkPermissionsAttributes(mode, sessionUser);

  try {
    user = await prisma.user.findUnique({
      where: { email },
      select: mode === "client" ? clientMask : null,
    });
  } catch (error) {
    throw new DbError({
      message: "Get user failed due to internal server error.",
      cause: error,
      log: {
        message: "Get user failed.",
        data: { email },
      },
    });
  }

  //check permissions
  await checkPermissions("read", mode, sessionUser, user);

  return user;
}

export async function getUsers(
  where: Prisma.UserWhereInput,
  mode: TDataRequestMode = "client",
  sessionUser?: TUserPublic,
) {
  let users;

  //check permissions
  await checkPermissionsAttributes(mode, sessionUser);
  await checkPermissions("read", mode, sessionUser);

  try {
    users = await prisma.user.findMany({
      where: where,
      select: mode === "client" ? clientMask : null,
    });
  } catch (error) {
    throw new DbError({
      message: "Get user failed due to internal server error.",
      cause: error,
      log: {
        message: "Get user failed.",
        data: where,
      },
    });
  }

  return users;
}

export async function getUserCount(
  where: Prisma.UserWhereInput,
  mode: TDataRequestMode = "server",
  sessionUser?: TUserPublic,
) {
  let count;

  await checkPermissionsAttributes(mode, sessionUser);
  await checkPermissions("count", mode, sessionUser);

  try {
    count = await prisma.user.count({ where });
  } catch (error) {
    throw new DbError({
      message: "Get user failed due to internal server error.",
      cause: error,
      log: {
        message: "Get user failed.",
        data: where,
      },
    });
  }

  return count;
}

export async function updateUser(
  where: Prisma.UserWhereUniqueInput,
  dataIn: Prisma.UserUpdateInput,
  mode: TDataRequestMode = "client",
  sessionUser?: TUserPublic,
) {
  let user = await prisma.user.findUnique({ where: where });

  //check permissions
  await checkPermissionsAttributes(mode, sessionUser);
  await checkPermissions("update", mode, sessionUser, user);

  try {
    user = await prisma.user.update({
      where: where,
      data: dataIn,
      select: mode === "client" ? clientMask : null,
    });
  } catch (error) {
    throw new DbError({
      message: "User update failed due to internal server error.",
      cause: error,
      log: {
        message: "DbError: User update failed.",
        data: dataIn,
      },
    });
  }

  return user;
}

export async function deleteUser(
  where: Prisma.UserWhereUniqueInput,
  mode: TDataRequestMode = "client",
  sessionUser?: TUserPublic,
) {
  let user = await prisma.user.findUnique({ where: where });

  //check permissions
  await checkPermissionsAttributes(mode, sessionUser);
  await checkPermissions("delete", mode, sessionUser, user);

  try {
    user = await prisma.user.delete({
      where: where,
      select: mode === "client" ? clientMask : null,
    });
  } catch (error) {
    throw new DbError({
      message: "User delete failed due to internal server error.",
      cause: error,
      log: {
        message: "DbError: User delete failed.",
      },
    });
  }

  return user;
}

export async function deleteManyUsers(
  ids: string[],
  mode: TDataRequestMode = "client",
  sessionUser?: TUserPublic,
) {
  //check permissions
  await checkPermissionsAttributes(mode, sessionUser);
  await checkPermissions("deleteMany", mode, sessionUser);

  const failedDeleteMessages: string[] = [];

  try {
    const users = await prisma.user.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    users.forEach(async (user) => {
      if (user.role === "SUPERUSER") {
        failedDeleteMessages.push(
          `${user.email}: Superusers can only be deleted from backend.`,
        );
        throw new PermissionError({
          message:
            "Permission denied: SUPERUSER can only be deleted from backend.",
          log: {
            data: { user, sessionUser },
          },
        });
      }
      try {
        await deleteUser({ id: user.id }, mode, sessionUser);
      } catch {
        failedDeleteMessages.push(
          `${user.email}: failed to delete user due to internal server error.`,
        );
      }
    });
  } catch (error) {
    throw new DbError({
      message: "User delete failed due to internal server error.",
      cause: error,
      log: {
        message: "DbError: User delete failed.",
        data: { ids },
      },
    });
  }

  return failedDeleteMessages;
}
