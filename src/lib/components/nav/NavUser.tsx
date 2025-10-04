"use client";

import { signOut, useSession } from "next-auth/react";
import {
  Menu,
  MenuDropdown,
  MenuItem,
  MenuTarget,
  Skeleton,
} from "@mantine/core";
import UserAvatar from "@/lib/features/authentication/components/UserAvatar";
import { TUserPublic } from "@/lib/dataModels/auth/user/definitions";
import { useEffect } from "react";
import { getUser } from "@/lib/dataModels/auth/user/dataAccess";
import SignInLinkBtn from "@/lib/features/authentication/features/signIn/Button";
import SignUpLinkBtn from "@/lib/features/authentication/features/signUp/Button";
import { sendResetPasswordEmail } from "@/lib/features/authentication/features/resetPassword/sendResetPasswordEmail.ts";
import { notifications } from "@mantine/notifications";
import SignOut from "@/lib/features/authentication/features/signOut/SignOut";

export default function NavUser() {
  const { data: session, status } = useSession();

  useEffect(() => {
    const checkDbUser = async () => {
      if (session?.user) {
        const dbUser = await getUser({ id: session?.user.id }, "server");
        if (!dbUser) signOut();
      }
    };
    checkDbUser();
  }, [session?.user]);

  const user = session?.user as TUserPublic;

  if (status === "loading") {
    return <Skeleton circle height={20} />;
  }

  if (status === "unauthenticated") {
    return (
      <>
        <SignInLinkBtn />
        <SignUpLinkBtn />
      </>
    );
  }

  async function handleResetPassword() {
    let result = null;
    if (session?.user.email) {
      result = await sendResetPasswordEmail(session.user.email);
    }
    if (result?.status) {
      notifications.show({
        message: result.message,
        color: result.status === "error" ? "red" : "green",
      });
    } else {
      notifications.show({
        message: "Session not valid. SignIn again.",
        color: "red",
      });
    }
  }

  return (
    <>
      <Menu trigger="click-hover" shadow="md">
        <MenuTarget>
          {/* div needed for click/hover trigger to work */}
          <div>
            <UserAvatar src={user?.image} userName={user?.name} />
          </div>
        </MenuTarget>
        <MenuDropdown mx="md">
          <MenuItem onClick={handleResetPassword} fz="lg">
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
