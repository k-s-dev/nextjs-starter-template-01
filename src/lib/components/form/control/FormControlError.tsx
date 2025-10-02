import FormError from "../FormError";
import styles from "./FormControlError.module.scss";

export default function FormControlError({
  errors,
  containerClass = styles.container,
  listClass = styles.container,
  itemClass = styles.item,
  appendContainerClass = true,
  appendItemClass = true,
}: FormControlErrorProps) {
  return (
    <FormError
      errors={errors}
      title={null}
      containerClass={containerClass}
      listClass={listClass}
      itemClass={itemClass}
      appendContainerClass={appendContainerClass}
      appendItemClass={appendItemClass}
    />
  );
}

export interface FormControlErrorProps {
  errors?: string[];
  containerClass?: string;
  listClass?: string;
  itemClass?: string;
  appendContainerClass?: boolean;
  appendItemClass?: boolean;
}
