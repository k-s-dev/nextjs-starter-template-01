"use client";

import { Button, ButtonProps } from "@mantine/core";

export function FormSubmitButton({
  formId,
  isPending,
  buttonText = "Submit",
  children,
  ...props
}: IFormButtonSubmitProps) {
  return (
    <Button form={formId} disabled={isPending} {...props}>
      {buttonText}
      {children}
    </Button>
  );
}

export interface IFormBtnProps {
  formId: string;
  isPending: boolean;
}

export interface IFormButtonSubmitProps extends IFormBtnProps, ButtonProps {
  buttonText?: string;
  children?: React.ReactNode;
}
