"use client";

import styles from "./FormContainer.module.scss";

export default function FormContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className={styles.container}>{children}</section>;
}
