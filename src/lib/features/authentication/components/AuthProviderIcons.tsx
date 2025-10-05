import { FaGithub, FaGoogle } from "react-icons/fa6";
import { signIn } from "../config";
import { Button, Flex } from "@mantine/core";
import { OAuthProviderId } from "@auth/core/providers";

export default function AuthProviderIcons() {
  return (
    <>
      <Flex
        component="section"
        gap="1rem"
        justify="space-evenly"
        align="center"
        wrap="wrap"
      >
        <ProviderForm oAuthProvider="github">
          <FaGithub />
        </ProviderForm>
        <ProviderForm oAuthProvider="google">
          <FaGoogle />
        </ProviderForm>
      </Flex>
    </>
  );
}

export function ProviderForm({
  oAuthProvider,
  children,
}: {
  oAuthProvider: OAuthProviderId;
  children: React.ReactNode;
}) {
  return (
    <form
      action={async () => {
        "use server";
        await signIn(oAuthProvider);
      }}
    >
      <Button
        type="submit"
        fz={24}
        variant="gradient"
        gradient={{ from: "green", to: "blue", deg: 45 }}
      >
        {children}
      </Button>
    </form>
  );
}
