"use client";

import { signOut } from "next-auth/react";
import { signOutSa } from "./serverAction";
import { useRouter } from "next/navigation";
import { routes } from "@/lib/utils/routeMapper";

export default function SignOut({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <div
      onClick={async () => {
        await signOut({ redirect: false });
        await signOutSa();
        router.replace(routes.generic.home);
      }}
    >
      {children}
    </div>
  );
}
