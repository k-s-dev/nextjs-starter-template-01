"use client";

import styles from "./UserUpdateForm.module.scss";
import React, { useActionState, useState } from "react";
import Link from "next/link";
import { Divider } from "@mantine/core";
import FormError from "@/lib/components/form/FormError";
import FormMessage from "@/lib/components/form/FormMessage";
import {
  FormSubmitButton,
  IPropsFormBtn,
} from "@/lib/components/form/FormSubmitButton";
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
}: IPropsFormBtn & { id: string }) {
  return (
    <FormButtonsRow>
      <FormSubmitButton
        formId={formId}
        isPending={isPending}
        buttonText="Save"
        data-test-cy="save-user-updates-button"
      />
      <Link
        href={routes.admin.user.withId(id, "detail")}
        className={styles.cancelButton}
      >
        Cancel
      </Link>
    </FormButtonsRow>
  );
}

export function FormHeaderUser({
  id,
  formId,
  isPending,
}: IPropsFormBtn & { id: string }) {
  return (
    <FormHeader>
      <h1>User: Update</h1>
      <FormRowBtnsUser id={id} formId={formId} isPending={isPending} />
    </FormHeader>
  );
}
