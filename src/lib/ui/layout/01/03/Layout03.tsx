"use client";

import { Container, Flex } from "@mantine/core";
import { ReactNode } from "react";

/**
 * Generic container for main section with responsive width for phone and
 * phone-up screens.
 */
export default function Layout03({ children }: { children: ReactNode }) {
  return (
    <Container w={{ base: "99%", sm: "75%" }} m={"auto"}>
      <Flex direction={"column"}>{children}</Flex>
    </Container>
  );
}
