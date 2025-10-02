import styles from "./page.module.scss";
import Link from "next/link";
import { verifyToken } from "@/lib/features/authentication/verification";
import { routes } from "@/lib/utils/routeMapper";
import VerifyEmailCard from "@/lib/features/authentication/features/verify-email/verifyEmailCard";
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

  const result = await verifyToken(token, "EMAIL_VERFICATION");

  if (!result || !result.data?.payload || !result.data.payload.email) {
    return <InvalidLink />;
  }

  let verficationStatusMessage;

  if (result.status === "verified") {
    verficationStatusMessage = (
      <p className={clsx(styles.text, styles.textValid)}>
        <span>Email: </span>
        <span className={styles.textHighlight}>
          {result.data.payload.email as string}
        </span>
        <span>, is already verified and can be used to sign in.</span>
      </p>
    );
  }

  verficationStatusMessage = (
    <p className={clsx(styles.text, styles.textValid)}>
      <span>Email: </span>
      <span className={styles.textHighlight}>
        {result.data.payload.email as string}
      </span>
      <span>, has been verified and can be used to sign in.</span>
    </p>
  );

  return (
    <VerifyEmailCard>
      {verficationStatusMessage}
      <Link href={routes.all.signIn} className={styles.signInButton}>Sign In</Link>
    </VerifyEmailCard>
  );
}

function InvalidLink() {
  return (
    <VerifyEmailCard>
      <p className={clsx(styles.text, styles.textInvalid)}>
        Invalid link. Email verification link can be generated from{" "}
        <a href={routes.all.signIn} className={styles.signInButton}>SignIn</a> page.
      </p>
    </VerifyEmailCard>
  );
}
