import styles from "./Card.module.scss";
import Link from "next/link";
import { routes } from "@/lib/utils/routeMapper";
import { Card, CardContent } from "@/lib/components/card";
import AuthCardHeader from "../../components/AuthCardHeader";
import AuthProviderIcons from "../../components/AuthProviderIcons";
import { Divider } from "@mantine/core";
import SignUpForm from "./form/Form";

export default function SignUpCard() {
  return (
    <Card>
      <AuthCardHeader />
      <CardContent>
        <SignUpForm />
        <Divider size="lg" label="Or sign in with other auth providers..." />
        <AuthProviderIcons />
        <Divider size="lg" label="Already have an account?" />
        <SignIn />
        <p>
          *Using OAuth provider (e.g. GitHub or Google) automatically creates
          an account.
        </p>
      </CardContent>
    </Card>
  );
}

function SignIn() {
  return (
    <Link href={routes.all.signIn} className={styles.signInButton}>
      Sign In
    </Link>
  );
}
