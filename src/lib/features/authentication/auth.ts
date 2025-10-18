import prisma from "@/database/prismaClient";
import { USER_ROLE } from "@/generated/prisma/enums";
import { getUser } from "@/lib/dataModels/auth/user/dataAccessControl";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { customSession } from "better-auth/plugins";
import { sendVerificationEmail } from "./verification";
import { getHostUrl } from "@/lib/actions/getHostUrl";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [
    customSession(async ({ user, session }) => {
      const dbUser = await getUser({ id: session.userId }, "server");
      return {
        session,
        user: {
          ...user,
          role: dbUser?.role as USER_ROLE,
        },
      };
    }),
    // nextCookies has to be last
    nextCookies(),
  ],
  emailAndPassword: {
    enabled: true,
    // TODO: review eslint disable
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sendResetPassword: async ({ user, url, token }, request) => {
      await sendVerificationEmail(user.email, url, "RESET_PASSWORD");
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.AUTH_GOOGLE_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
    },
    github: {
      clientId: process.env.AUTH_GITHUB_ID as string,
      clientSecret: process.env.AUTH_GITHUB_SECRET as string,
    },
  },
  trustedOrigins: ["*"],
});
