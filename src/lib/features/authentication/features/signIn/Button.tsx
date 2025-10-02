import styles from "./Button.module.scss";
import Link from "next/link";
import { routes } from "@/lib/utils/routeMapper";

export default function SignInLinkBtn({ title = "Sign In" }: IProps) {
  return (
    <Link href={routes.all.signIn} className={styles.button}>
      {title}
    </Link>
  );
}

interface IProps {
  title?: string;
}
