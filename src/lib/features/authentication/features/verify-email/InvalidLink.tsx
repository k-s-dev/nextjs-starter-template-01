import AuthInvalidLink from "../../components/AuthInvalidLink";

export default function InvalidLink({
  title = "Invalid Link",
}: {
  title?: string;
}) {
  return (
    <AuthInvalidLink title="Email Verification" subTitle={title}>
      Email verification link can be generated from <b>Sign In</b> page.
    </AuthInvalidLink>
  );
}
