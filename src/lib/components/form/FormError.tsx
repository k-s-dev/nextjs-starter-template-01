"use client";

import FormMessage from "./FormMessage";

export default function FormError({
  errors,
  title = "Form Error",
  containerClass,
  listClass,
  itemClass,
  headerClass,
  appendContainerClass = true,
  appendItemClass = true,
  appendHeaderClass = true,
}: {
  errors?: string[];
  title?: string | null;
  containerClass?: string;
  listClass?: string;
  itemClass?: string;
  headerClass?: string;
  appendContainerClass?: boolean;
  appendItemClass?: boolean;
  appendHeaderClass?: boolean;
}) {
  return (
    <>
      <FormMessage
        messages={errors}
        error
        title={title}
        containerClass={containerClass}
        listClass={listClass}
        itemClass={itemClass}
        headerClass={headerClass}
        appendContainerClass={appendContainerClass}
        appendItemClass={appendItemClass}
        appendHeaderClass={appendHeaderClass}
      />
    </>
  );
}
