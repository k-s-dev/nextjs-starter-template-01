import ResetPasswordCard from "@/lib/features/authentication/features/resetPassword/ResetPasswordCard";
import ResetPasswordForm from "@/lib/features/authentication/features/resetPassword/Form";
import { verifyToken } from "@/lib/features/authentication/verification";
import AuthInvalidLink from "@/lib/features/authentication/components/AuthInvalidLink";

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
          <ResetPasswordForm email={result.data.payload.email as string} />
        </ResetPasswordCard>
      </div>
    );
  }
}

function InvalidLink() {
  return (
    <AuthInvalidLink title="Reset Password">
      Invalid link. Reset password link can be generated from Sign In page.
    </AuthInvalidLink>
  );
}
