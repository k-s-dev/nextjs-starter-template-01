import styles from "./AuthProviderIcons.module.scss";
import { FaGithub, FaGoogle } from "react-icons/fa6";
import { signIn } from "../config";

export default function AuthProviderIcons() {
  return (
    <>
      <section className={styles.iconRow}>
        <form
          action={async () => {
            "use server";
            await signIn("github");
          }}
        >
          <button className={styles.iconButton}>
            <FaGithub className={styles.icon}/>
          </button>
        </form>
        <form
          action={async () => {
            "use server";
            await signIn("google");
          }}
        >
          <button className={styles.iconButton}>
            <FaGoogle className={styles.icon}/>
          </button>
        </form>
      </section>
    </>
  );
}
