import { Blockquote, Flex, Text } from "@mantine/core";
import SignInLinkButton from "../signIn/SignInLinkButton";
import { FaUserCheck } from "react-icons/fa6";

export default function EmailVerfied({
  title,
  email,
}: {
  title?: string;
  email: string;
}) {
  return (
    <>
      <Blockquote color="green.3" mb="md" data-test-cy="email-verified">
        <Flex align="flex-end" justify="center">
          <Text component="h2" c="green.8" fz="h2">
            <FaUserCheck /> {title}
          </Text>
        </Flex>
        <Text component="span">Email: </Text>
        <Text component="span" fw="bold" td="undeline">
          {email}
        </Text>{" "}
        can be used to sign in.
      </Blockquote>
      <SignInLinkButton />
    </>
  );
}
