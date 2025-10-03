import ResetPasswordCard from "@/lib/features/authentication/features/resetPassword/ResetPasswordCard";
import styles from "./page.module.scss";
import ResetPasswordForm from "@/lib/features/authentication/features/resetPassword/Form";
import { verifyToken } from "@/lib/features/authentication/verification";
import { routes } from "@/lib/utils/routeMapper";
import clsx from "clsx";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const token = (await searchParams).verificationToken;

  if (!token || typeof token !== "string") {
    return <InvalidLink />;
  }

  const result = await verifyToken(token, "RESET_PASSWORD");

  if (
    !result ||
    !result.data ||
    !result.data.payload ||
    !result.data.payload.email ||
    result.status === "failed"
  ) {
    return <InvalidLink />;
  }

  if (result.status === "success") {
    return (
      <div>
        <ResetPasswordCard>
          <ResetPasswordForm />
        </ResetPasswordCard>
      </div>
    );
  }
}

function InvalidLink() {
  return (
    <ResetPasswordCard>
      <p className={clsx(styles.text, styles.textInvalid)}>
        Invalid link. Reset password link can be generated from{" "}
        <a href={routes.all.signIn}>SignIn</a> page.
      </p>
    </ResetPasswordCard>
  );
}
