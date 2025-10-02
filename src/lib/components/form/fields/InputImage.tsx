import styles from "./InputImage.module.scss";
import { Dispatch, SetStateAction } from "react";
import Image from "next/image";
import FormControl from "../control/FormControl";

export function InputImage({
  formId,
  imageFile,
  setImageFile,
  initialImageUrl,
  errors,
  fieldName = "imageFile",
  fieldLabel = "Pick image",
  fieldPlaceholder = "Image",
  fieldId = "imageFile",
}: {
  formId: string;
  imageFile: File | null;
  setImageFile: Dispatch<SetStateAction<File | null>>;
  initialImageUrl?: string;
  errors?: string[];
  fieldName?: string;
  fieldLabel?: string;
  fieldPlaceholder?: string;
  fieldId?: string;
}) {
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    let files;
    const target = e.target as HTMLInputElement;
    if (target) files = target.files;
    if (files) setImageFile(files[0]);
  }

  const fileName =
    imageFile?.name || initialImageUrl?.split("/").slice(-1) || "...";

  let img;
  if (imageFile && imageFile.size > 0) {
    img = (
      <Image
        src={URL.createObjectURL(imageFile)}
        alt=""
        className={styles.image}
        fill
      />
    );
  } else {
    if (initialImageUrl) {
      img = (
        <Image
          src={`${initialImageUrl}?q=${new Date()}`}
          alt=""
          className={styles.image}
          fill
        />
      );
    } else {
      img = <div></div>;
    }
  }

  return (
    <>
      <div className={styles.field}>
        <FormControl errorsProps={{ errors }}>
          <div className={styles.imagecontainer}>{img}</div>
          <div>File name: {fileName}</div>
          <label htmlFor={fieldId} className={styles.imageLabel}>
            {fieldLabel}
          </label>
          <input
            hidden
            form={formId}
            type="file"
            id={fieldId}
            name={fieldName}
            placeholder={fieldPlaceholder}
            accept="image/*"
            onChange={handleFileChange}
          />
        </FormControl>
      </div>
    </>
  );
}
