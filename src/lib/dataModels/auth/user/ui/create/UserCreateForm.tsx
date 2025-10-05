"use client";

import React, { useActionState, useEffect, useState } from "react";
import { Button, Divider } from "@mantine/core";
import FormError from "@/lib/components/form/FormError";
import FormMessage from "@/lib/components/form/FormMessage";
import { createUserClientAction } from "./actions/clientAction";
import { IFormBtnProps } from "@/lib/components/form/FormSubmitButton";
import { TUserFormState, TUserFormStateData } from "../../definitions";
import { routes } from "@/lib/utils/routeMapper";
import FormContainer from "@/lib/components/form/FormContainer";
import FormHeader from "@/lib/components/form/FormHeader";
import { UserForm } from "../UserForm";
import { USER_ROLE } from "@/generated/prisma";
import { notifications } from "@mantine/notifications";
import { redirect } from "next/navigation";
import FormButtonsRow from "@/lib/components/form/FormButtonsRow";
import LinkButton from "@/lib/components/LinkButton";

export default function UserCreateForm({
  formId = `user-create-form`,
}: {
  formId?: string;
}) {
  const [imageFile, setImageFile] = useState<File | null>(null);

  const initialFormState: TUserFormState = {
    data: { role: USER_ROLE.USER } as TUserFormStateData,
    mode: "create",
  };

  const [formState, formAction, isPending] = useActionState(
    createUserClientAction.bind(null, imageFile),
    initialFormState,
  );

  useEffect(() => {
    if (formState.status === "success") {
      notifications.show({
        message: (
          <p>
            User: <b>{formState.data?.email}</b> created successfully.
          </p>
        ),
        autoClose: 3000,
        color: "green",
      });
      redirect(routes.admin.user.read);
    }
  }, [formState]);

  return (
    <FormContainer>
      <FormHeaderUser formId={formId} isPending={isPending} />
      <UserForm
        formId={formId}
        formState={formState}
        formAction={formAction}
        imageFile={imageFile}
        setImageFileAction={setImageFile}
      />
      <FormError errors={formState.errors?.root} />
      <FormMessage messages={formState.messages} />
      <Divider size="md" my="sm" />
      <FormRowBtnsUser formId={formId} isPending={isPending} />
    </FormContainer>
  );
}

export function FormRowBtnsUser({ formId, isPending }: IFormBtnProps) {
  return (
    <FormButtonsRow>
      <Button
        type="submit"
        form={formId}
        disabled={isPending}
        data-test-cy="user-create-form-submit-button"
        color="yellow.1"
      >
        Save
      </Button>
      <LinkButton href={routes.admin.user.read} color="blue.1">Cancel</LinkButton>
    </FormButtonsRow>
  );
}

export function FormHeaderUser({ formId, isPending }: IFormBtnProps) {
  return (
    <FormHeader>
      <h1>User: Create</h1>
      <FormRowBtnsUser formId={formId} isPending={isPending} />
    </FormHeader>
  );
}
