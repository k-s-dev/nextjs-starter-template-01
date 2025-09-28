// clear test.db, generated prisma client folder

import { rm } from "node:fs/promises";
import path from "node:path";

const paths = {
  root: process.cwd(),
  get src() {
    return path.join(this.root, "src");
  },
  get db() {
    return path.join(this.root, "test.db");
  },
  get generated() {
    return path.join(this.src, "generated");
  },
};

export async function clearTestDbSetup() {
  await rm(paths.db, { recursive: true, force: true });
  await rm(paths.generated, { recursive: true, force: true });
}

clearTestDbSetup();
