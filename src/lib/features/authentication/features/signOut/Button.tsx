"use client";

import styles from "./Button.module.scss";
import { signOut } from "next-auth/react";
import { signOutAction } from "./action";
import { useRouter } from "next/navigation";
import { routes } from "@/lib/utils/routeMapper";

export default function SignOutButton({
  className,
}: {
  className?: string;
}) {
  const router = useRouter();

  return (
    <button
      className={className || styles.signOutButton}
      type="button"
      onClick={async () => {
        await signOut({ redirect: false });
        await signOutAction();
        router.replace(routes.generic.home);
      }}
    >
      Sign Out
    </button>
  );
}
