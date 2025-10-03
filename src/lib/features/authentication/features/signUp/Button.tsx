import styles from "./Button.module.scss";
import Link from "next/link";
import { routes } from "@/lib/utils/routeMapper";

export default function SignUpLinkBtn({ title = "Sign Up" }: IProps) {
  return (
    <Link href={routes.all.signUp} className={styles.button}>
      {title}
    </Link>
  );
}

interface IProps {
  title?: string;
}
