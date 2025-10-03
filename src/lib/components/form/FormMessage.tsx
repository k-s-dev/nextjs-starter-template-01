"use client";

import styles from "./FormMessage.module.scss";
import { Divider } from "@mantine/core";
import clsx from "clsx";

export default function FormMessage({
  messages,
  error = false,
  title = "Message",
  containerClass,
  listClass,
  itemClass,
  headerClass,
  appendContainerClass = true,
  appendItemClass = true,
  appendHeaderClass = true,
}: FormMessageProps) {
  if (!messages || messages.length <= 0) return null;

  const finalContainerClass = clsx(
    appendContainerClass && styles.container,
    containerClass,
  );

  const finalListClass = clsx(
    appendContainerClass && styles.container,
    appendHeaderClass && !error && styles.message,
    appendHeaderClass && error && styles.error,
    listClass,
  );

  const finalItemClass = clsx(appendItemClass && styles.item, itemClass);

  const finalHeaderClass = clsx(
    appendHeaderClass && styles.header,
    headerClass,
  );

  const messageList = messages.map((msg) => {
    return (
      <li
        key={msg}
        className={finalItemClass}
        data-test-cy={error ? "form-error-item" : "form-message-item"}
      >
        {msg}
      </li>
    );
  });

  return (
    <section className={finalContainerClass}>
      {title && (
        <>
          <Divider size="md" my="sm" />
          <header className={finalHeaderClass}>
            <h4>{title}</h4>
          </header>
        </>
      )}
      <ul className={finalListClass}>{messageList}</ul>
    </section>
  );
}

export interface FormMessageProps {
  messages?: string[];
  error?: boolean;
  title?: string | null;
  containerClass?: string;
  listClass?: string;
  itemClass?: string;
  headerClass?: string;
  appendContainerClass?: boolean;
  appendItemClass?: boolean;
  appendHeaderClass?: boolean;
}
