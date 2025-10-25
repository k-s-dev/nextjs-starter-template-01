import AppShellHome from "@/lib/components/layout/home/AppShell";
import styles from "./layout.module.scss";
import Navbar from "@/lib/components/nav/Navbar";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <AppShellHome nav={<Navbar />}>
      <aside></aside>
      <main className={styles.main}>{children}</main>
    </AppShellHome>
  );
}
