"use server";

import { Button } from "@mantine/core";
import "./page.scss";
import Link from "next/link";

export default async function Page() {
  return (
    <main className="home-container">
      <header className="home-header">
        <h1>Nextjs App Template</h1>
        <section className="home-tech_stack-row">
          {stack.map(([title, href], idx) => {
            return (
              <Link key={idx} href={href} target="_blank">
                <Button fullWidth variant="outline" color="gray" fz="md">
                  {title}
                </Button>
              </Link>
            );
          })}
        </section>
      </header>
    </main>
  );
}

const stack = [
  ["Vercel", "https://www.vercel.com/"],
  ["Nextjs", "https://www.nextjs.org/"],
  ["Vercel Blob", "https://vercel.com/storage/blob"],
  ["Prisma", "https://www.prisma.io/"],
  ["Postgres", "www.postgresql.org"],
  ["Authjs", "https://authjs.dev/"],
  ["Mantine UI", "https://mantine.dev/"],
];
