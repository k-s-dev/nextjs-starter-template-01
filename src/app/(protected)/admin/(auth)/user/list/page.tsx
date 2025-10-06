import styles from "./page.module.scss";
import "@/styles/components/_button.scss";
import { getUsers } from "@/lib/dataModels/auth/user/dataAccess";
import { Divider } from "@mantine/core";
import { routes } from "@/lib/utils/routeMapper";
import { UserTable } from "@/lib/dataModels/auth/user/ui/UserTable";
import { getSessionUser } from "@/lib/features/authentication/getSessionUser";
import LinkButton from "@/lib/components/LinkButton";

export default async function Page() {
  const sessionUser = await getSessionUser()
  const users = await getUsers({}, "client", sessionUser);

  return (
    <div>
      <header className={styles.rootHeader}>
        <h1>User: List</h1>
        <LinkButton href={routes.admin.user.create} color="blue.1" fz="lg">
          Create User
        </LinkButton>
      </header>
      <Divider size="md" mb="md" />
      <UserTable users={users} />
    </div>
  );
}
