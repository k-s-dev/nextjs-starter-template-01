"use client";

import React, { useActionState, useState } from "react";
import { Button, Divider } from "@mantine/core";
import FormError from "@/lib/components/form/FormError";
import FormMessage from "@/lib/components/form/FormMessage";
import { IFormBtnProps } from "@/lib/components/form/FormSubmitButton";
import {
  TUserFormState,
  TUserFormStateData,
  TUserPublic,
} from "../../definitions";
import { routes } from "@/lib/utils/routeMapper";
import FormContainer from "@/lib/components/form/FormContainer";
import FormHeader from "@/lib/components/form/FormHeader";
import { UserForm } from "../UserForm";
import { updateUserClientAction } from "./actions/clientAction";
import FormButtonsRow from "@/lib/components/form/FormButtonsRow";
import LinkButton from "@/lib/components/LinkButton";

export default function UserUpdateForm({
  user,
  formId = `user-update-form`,
}: {
  user: TUserPublic;
  formId?: string;
}) {
  const [imageFile, setImageFile] = useState<File | null>(null);

  const initialFormState: TUserFormState = {
    mode: "update",
    data: { ...user } as TUserFormStateData,
  };

  const [formState, formAction, isPending] = useActionState(
    updateUserClientAction.bind(null, user, imageFile),
    initialFormState,
  );

  return (
    <FormContainer>
      <FormHeaderUser id={user.id} formId={formId} isPending={isPending} />
      <UserForm
        formId={formId}
        formState={formState}
        formAction={formAction}
        imageFile={imageFile}
        setImageFileAction={setImageFile}
        initialImageUrl={user.image}
      />
      <FormError errors={formState.errors?.root} />
      <FormMessage messages={formState.messages} />
      <Divider size="md" my="sm" />
      <FormRowBtnsUser id={user.id} formId={formId} isPending={isPending} />
    </FormContainer>
  );
}

export function FormRowBtnsUser({
  id,
  formId,
  isPending,
}: IFormBtnProps & { id: string }) {
  return (
    <FormButtonsRow>
      <Button
        type="submit"
        form={formId}
        disabled={isPending}
        data-test-cy="save-user-updates-button"
        color="green.1"
      >
        Save
      </Button>
      <LinkButton
        href={routes.admin.user.withId(id, "detail")}
        color="yellow.1"
      >
        Cancel
      </LinkButton>
    </FormButtonsRow>
  );
}

export function FormHeaderUser({
  id,
  formId,
  isPending,
}: IFormBtnProps & { id: string }) {
  return (
    <FormHeader>
      <h1>User: Update</h1>
      <FormRowBtnsUser id={id} formId={formId} isPending={isPending} />
    </FormHeader>
  );
}
