"use client";

import styles from "./EditIcon.module.scss";
import { Tooltip } from "@mantine/core";
import { FaPenToSquare } from "react-icons/fa6";

export default function EditIcon() {
  return (
    <Tooltip label="Edit">
      <FaPenToSquare className={styles.icon} />
    </Tooltip>
  );
}
