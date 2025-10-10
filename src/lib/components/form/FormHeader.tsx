"use client";

import styles from "./FormHeader.module.scss";
import { Divider } from "@mantine/core";

export default function AdminFormHeader({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <section className={styles.header}>{children}</section>
      <Divider size="md" my="sm" />
    </>
  );
}
