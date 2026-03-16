import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./styles.module.css";
import { session } from "../lib/mock-data";

const navigation = [
  { href: "/", label: "Dashboard" },
  { href: "/masters", label: "Cadastros" },
  { href: "/imports", label: "Importacoes" },
  { href: "/reconciliation", label: "Conciliacao" },
  { href: "/duplicates", label: "Duplicidades" },
  { href: "/commissions", label: "Comissionamento" }
];

export function AppShell({
  title,
  eyebrow,
  actions,
  children
}: {
  title: string;
  eyebrow: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div>
          <div className={styles.brand}>TeleConcilia</div>
          <p className={styles.brandText}>
            Plataforma de conciliacao e comissionamento para operacoes telecom.
          </p>
          <div className={styles.userBadge}>
            <strong>{session.user.fullName}</strong>
            <span>{session.user.email}</span>
          </div>
        </div>

        <nav className={styles.nav}>
          {navigation.map((item) => (
            <Link className={styles.navItem} href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.stageCard}>
          <span className={styles.stageLabel}>Etapa atual</span>
          <strong>MVP operacional</strong>
          <p>Importacao, conciliacao, duplicidades e comissao com trilha auditavel.</p>
        </div>
      </aside>

      <main className={styles.main}>
        <header className={styles.header}>
          <div>
            <span className={styles.eyebrow}>{eyebrow}</span>
            <h1 className={styles.title}>{title}</h1>
          </div>
          <div className={styles.headerActions}>{actions}</div>
        </header>
        {children}
      </main>
    </div>
  );
}
