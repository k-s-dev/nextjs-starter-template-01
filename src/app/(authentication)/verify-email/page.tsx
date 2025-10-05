import { verifyToken } from "@/lib/features/authentication/verification";
import InvalidLink from "@/lib/features/authentication/features/verify-email/InvalidLink";
import VerifyEmailCard, {
  TVerificationStatus,
} from "@/lib/features/authentication/features/verify-email/VerifyEmailCard";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const token = (await searchParams).verificationToken;

  let verificationStatus: TVerificationStatus;

  if (!token || typeof token !== "string") {
    return <InvalidLink />;
  }

  const result = await verifyToken(token, "EMAIL_VERFICATION");

  if (!result || !result.data?.payload || !result.data.payload.email) {
    return <InvalidLink />;
  }

  if (result.status === "verified") {
    verificationStatus = "verified";
  } else {
    verificationStatus = "success";
  }

  return (
    <VerifyEmailCard
      verificationStatus={verificationStatus}
      email={result.data.payload.email as string}
    />
  );
}
