"use client";

import {
  Menu,
  MenuDropdown,
  MenuItem,
  MenuTarget,
  Skeleton,
} from "@mantine/core";
import UserAvatar from "@/lib/features/authentication/components/UserAvatar";
import { useEffect } from "react";
import { getUser } from "@/lib/dataModels/auth/user/dataAccessControl";
import SignOut from "@/lib/features/authentication/features/signOut/SignOut";
import SignUpLinkButton from "@/lib/features/authentication/features/signUp/SignUpLinkButton";
import SignInLinkButton from "@/lib/features/authentication/features/signIn/SignInLinkButton";
import { authClient, Session } from "@/lib/features/authentication/auth-client";
import { redirect } from "next/navigation";
import { routes } from "@/lib/utils/routeMapper";
import { requestResetPasswordClientAction } from "@/lib/features/authentication/features/resetPassword/requestResetPasswordClientAction";

export default function NavUser() {
  const { data: session, isPending, error } = authClient.useSession();

  if (isPending) {
    return <Skeleton circle height={20} />;
  }

  if (error || !session) {
    return (
      <>
        <SignInLinkButton />
        <SignUpLinkButton />
      </>
    );
  }

  return <NavUserAvatar session={session} />;
}

export function NavUserAvatar({ session }: { session: Session }) {
  useEffect(() => {
    const checkDbUser = async () => {
      if (session?.user) {
        const dbUser = await getUser({ id: session?.user.id }, "server");
        if (!dbUser) authClient.signOut();
        redirect(routes.DEFAULT_LOGIN_REDIRECT);
      }
    };
    checkDbUser();
  }, [session?.user]);

  const user = session?.user;

  return (
    <>
      <Menu trigger="click-hover" shadow="md">
        <MenuTarget>
          {/* div needed for click/hover trigger to work */}
          <div>
            <UserAvatar src={user?.image || undefined} userName={user?.name} />
          </div>
        </MenuTarget>
        <MenuDropdown mx="md">
          <MenuItem
            onClick={async () => {
              await requestResetPasswordClientAction();
            }}
            fz="lg"
          >
            Reset Password
          </MenuItem>
          <MenuItem fz="lg" color="red">
            <SignOut>Sign Out</SignOut>
          </MenuItem>
        </MenuDropdown>
      </Menu>
    </>
  );
}
