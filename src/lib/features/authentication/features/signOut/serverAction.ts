"use server";

import { signOut } from "../../config";

export async function signOutSa() {
  return signOut({ redirect: false });
}
