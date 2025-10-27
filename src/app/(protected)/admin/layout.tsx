import AdminSidebarWrapper from "@/lib/features/admin/ui/AdminSidebarWrappper";
import styles from "./layout.module.scss";
import { auth } from "@/lib/features/authentication/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { routes } from "@/lib/utils/routeMapper";
import { Blockquote, Card, Center } from "@mantine/core";
import AppShellHome from "@/lib/components/layout/home/AppShell";
import Navbar from "@/lib/components/nav/Navbar";

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect(routes.authentication.signIn);
  }

  if (session.user.role !== "SUPERUSER") {
    return (
      <Center>
        <Card shadow="lg" radius="lg" w={{ base: "99%", xl: "80%" }} maw={500}>
          <Blockquote color="red.3">Unauthorized access.</Blockquote>
        </Card>
      </Center>
    );
  }

  return (
    <AppShellHome nav={<Navbar />}>
      <div className={styles.rootLayout}>
        <aside className={styles.leftSidebar}>
          <AdminSidebarWrapper />
        </aside>
        <main className={styles.main}>{children}</main>
      </div>
    </AppShellHome>
  );
}
