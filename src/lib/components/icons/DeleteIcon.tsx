"use client";

import styles from "./DeleteIcon.module.scss";
import { Tooltip } from "@mantine/core";
import { FaTrash } from "react-icons/fa6";

export default function DeleteIcon({ label = "Delete" }: { label?: string }) {
  return (
    <Tooltip label={label}>
      <FaTrash className={styles.icon}/>
    </Tooltip>
  );
}
