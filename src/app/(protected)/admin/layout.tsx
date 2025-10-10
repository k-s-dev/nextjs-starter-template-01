import AdminSidebarWrapper from "@/lib/features/admin/ui/AdminSidebarWrappper";
import styles from "./layout.module.scss";

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className={styles.rootLayout}>
        <aside className={styles.leftSidebar}>
          <AdminSidebarWrapper />
        </aside>
        <main className={styles.main}>{children}</main>
      </div>
    </>
  );
}
