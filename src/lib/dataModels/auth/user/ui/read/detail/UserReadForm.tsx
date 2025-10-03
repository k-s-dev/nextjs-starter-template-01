"use client";

import styles from "./UserReadForm.module.scss";
import React, { useActionState, useState } from "react";
import Link from "next/link";
import { Divider } from "@mantine/core";
import FormError from "@/lib/components/form/FormError";
import FormMessage from "@/lib/components/form/FormMessage";
import { routes } from "@/lib/utils/routeMapper";
import FormContainer from "@/lib/components/form/FormContainer";
import FormHeader from "@/lib/components/form/FormHeader";
import {
  TUserFormState,
  TUserFormStateData,
  TUserPublic,
} from "../../../definitions";
import { UserForm } from "../../UserForm";
import DeleteModal from "@/lib/components/form/DeleteModal";
import { FaArrowLeft, FaPenToSquare } from "react-icons/fa6";
import { deleteUserServerAction } from "../../delete/action/serverSingle";
import FormButtonsRow from "@/lib/components/form/FormButtonsRow";

export default function UserReadForm({
  user,
  formId = `user-create-form`,
}: {
  user: TUserPublic;
  formId?: string;
}) {
  const [imageFile, setImageFile] = useState<File | null>(null);

  const initialFormState: TUserFormState = {
    data: { ...user } as TUserFormStateData,
    mode: "read",
  };

  const [formState, formAction] = useActionState(
    (formState) => formState,
    initialFormState,
  );

  if (formState.status === "success") {
    return (
      <div className="form-success-message">
        <p>User created succuesfully.</p>
      </div>
    );
  }

  return (
    <FormContainer>
      <Header id={user.id} email={user.email} />
      <UserForm
        formId={formId}
        formState={formState}
        formAction={formAction}
        imageFile={imageFile}
        setImageFileAction={setImageFile}
        initialImageUrl={user.image}
        inert={true}
      />
      <FormError errors={formState.errors?.root} />
      <FormMessage messages={formState.messages} />
      <Divider size="md" my="sm" />
      <BtnsRow id={user.id} email={user.email} />
    </FormContainer>
  );
}

function BtnsRow({ id, email }: { id: string; email: string }) {
  return (
    <FormButtonsRow>
      <Link
        href={routes.admin.user.withId(id, "update")}
        className={styles.editIcon}
      >
        <FaPenToSquare />
      </Link>
      <DeleteModal
        resource="User"
        identifier={`${email} (id: ${id})`}
        deleteAction={async () => await deleteUserServerAction(id)}
        data-test-cy="delete-user-button"
      />
      <Link href={routes.admin.user.read} className={styles.backIcon}>
        <FaArrowLeft />
      </Link>
    </FormButtonsRow>
  );
}

function Header({ id, email }: { id: string; email: string }) {
  return (
    <FormHeader>
      <h1>User: Details</h1>
      <BtnsRow id={id} email={email} />
    </FormHeader>
  );
}
