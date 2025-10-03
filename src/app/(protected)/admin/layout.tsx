import styles from "./layout.module.scss";
import AdminSidebarWrapper from "@/lib/features/admin/AdminSidebarContainer";

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
