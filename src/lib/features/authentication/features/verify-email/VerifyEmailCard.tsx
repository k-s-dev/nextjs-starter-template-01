import AuthCard from "../../components/AuthCard";
import EmailVerfied from "./EmailVerified";

export default function VerifyEmailCard({
  verificationStatus,
  email,
}: {
  verificationStatus: TVerificationStatus;
  email?: string;
}) {
  return (
    <AuthCard subTitle="Email Verification">
      {verificationStatus === "verified" && email && (
        <EmailVerfied title="Email already verified" email={email} />
      )}
      {verificationStatus === "success" && email && (
        <EmailVerfied title="Email verified" email={email} />
      )}
    </AuthCard>
  );
}

export type TVerificationStatus = "success" | "error" | "verified";
