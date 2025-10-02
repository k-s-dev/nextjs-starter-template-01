import Link from "next/link";

import styles from "./ResetPasswordCard.module.scss";
import { routes } from "@/lib/utils/routeMapper";
import { Card, CardContent } from "@/lib/components/card";
import AuthCardHeader from "../../components/AuthCardHeader";
import AuthProviderIcons from "../../components/AuthProviderIcons";

export default function ResetPasswordCard({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Card>
      <AuthCardHeader subTitle="Reset password" />
      <CardContent>
        {children}
        <AuthProviderIcons />
        <SignIn />
      </CardContent>
    </Card>
  );
}

function SignIn() {
  return (
    <section className={styles.container}>
      <h4>Already have an account?</h4>
      <Link href={routes.all.signIn} className={styles.btn}>
        Sign In
      </Link>
    </section>
  );
}
