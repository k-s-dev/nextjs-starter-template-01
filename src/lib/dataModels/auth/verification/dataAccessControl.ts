"use server";

import prisma from "@/database/prismaClient";
import { Prisma, TOKEN_TYPE } from "@/generated/prisma/client";
import { DbError } from "@/lib/utils/errors";

export async function createVerificationToken(
  dataIn: Prisma.VerificationCreateInput,
) {
  try {
    await prisma.verification.create({ data: dataIn });
  } catch (error) {
    throw new DbError({
      message: "Internal server error.",
      cause: error,
      log: {
        message: "DbError: failed to create token.",
        data: dataIn,
      },
    });
  }
}

export async function getVerificationTokenByEmail(
  email: string,
  tokenType: TOKEN_TYPE,
) {
  let dbToken;
  try {
    dbToken = await prisma.verification.findFirst({
      where: {
        identifier: email,
        type: tokenType,
      },
    });
  } catch (error) {
    throw new DbError({
      message: "Invalid token.",
      cause: error,
      log: {
        message: "DbError: failed to get token.",
        data: {
          email,
          tokenType,
        },
      },
    });
  }
  return dbToken;
}

export async function getVerificationToken(
  email: string,
  tokenType: TOKEN_TYPE,
  token?: string,
) {
  let dbToken;
  try {
    dbToken = await prisma.verification.findFirst({
      where: {
        identifier: email,
        type: tokenType,
        value: token,
      },
    });
  } catch (error) {
    throw new DbError({
      message: "Invalid token.",
      cause: error,
      log: {
        message: "DbError: failed to get token.",
        data: {
          email,
          tokenType,
        },
      },
    });
  }
  return dbToken;
}

export async function deleteVerificationToken(
  email: string,
  tokenType: TOKEN_TYPE,
  token: string,
) {
  const existingToken = await getVerificationToken(email, tokenType, token);
  if (existingToken) {
    try {
      await prisma.verification.delete({
        where: {
          id: existingToken.id,
        },
      });
    } catch (error) {
      throw new DbError({
        message: "Internal server error.",
        cause: error,
        log: {
          message: "DbError: failed to delete token.",
          data: {
            email,
            token,
            tokenType,
          },
        },
      });
    }
  }
}

export async function deleteExpiredVerificationTokens() {
  try {
    await prisma.verification.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  } catch (error) {
    throw new DbError({
      message: "Internal server error.",
      cause: error,
      log: {
        message: "DbError: failed to delete expired tokens.",
      },
    });
  }
}
