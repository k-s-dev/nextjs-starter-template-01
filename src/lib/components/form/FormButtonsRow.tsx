"use client";

import styles from "./FormButtonsRow.module.scss";

export default function FormButtonsRow({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className={styles.buttonsRow}>{children}</section>;
}
