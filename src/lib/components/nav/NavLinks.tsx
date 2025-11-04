"use client";

import styles from "./NavLinks.module.scss";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { routes } from "@/lib/utils/routeMapper";
import { Title } from "@mantine/core";
import { theme } from "@/lib/components/theme";
import { INavLink } from "@/lib/types/navLinks";
import { renderNavLinks } from "@/lib/utils/render/navLinks";

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      <NavLinksTitle />
      {navLinks.map((link) => {
        return renderNavLinks({
          link,
          classNames: { base: styles.link, active: styles.active },
          pathname,
          screen: "phone-up",
        });
      })}
    </>
  );
}

export function NavLinksTitle() {
  return (
    <Title order={6} size="h1">
      <Link href={routes.generic.home}>Next</Link>
      <Link href={routes.generic.home} style={{ color: theme.colors.green[5] }}>
        Demo
      </Link>
    </Title>
  );
}

export const navLinks: INavLink[] = [
  {
    title: "Admin",
    href: routes.admin.root,
  },
  {
    title: "Products",
    href: "/product",
    links: [
      {
        title: "All Products",
        href: "/product/list",
      },
    ],
  },
];
