import { AppShell } from "../app-shell";
import { DataTable } from "../data-table";
import styles from "../styles.module.css";
import { companies, operators, sellers } from "../../lib/mock-data";

export function MastersPage() {
  return (
    <AppShell
      eyebrow="Configuracoes base"
      title="Cadastros mestres do MVP"
      actions={
        <button className={styles.primaryButton} type="button">
          Novo cadastro
        </button>
      }
    >
      <div className={styles.pageGrid}>
        <article className={styles.panel}>
          <div className={styles.panelTitleRow}>
            <h2 className={styles.panelTitle}>Empresas</h2>
          </div>
          <DataTable
            columns={["Nome", "Fantasia", "Status", "Equipes", "Vendedores"]}
            rows={companies.map((item) => [
              item.name,
              item.tradeName,
              item.status,
              String(item.teams),
              String(item.sellers)
            ])}
          />
        </article>

        <article className={styles.panel}>
          <div className={styles.panelTitleRow}>
            <h2 className={styles.panelTitle}>Operadoras</h2>
          </div>
          <DataTable
            columns={["Nome", "Codigo", "Status", "Taxa de conciliacao"]}
            rows={operators.map((item) => [
              item.name,
              item.code,
              item.status,
              `${item.reconciliationRate}%`
            ])}
          />
        </article>

        <article className={styles.panel}>
          <div className={styles.panelTitleRow}>
            <h2 className={styles.panelTitle}>Vendedores</h2>
          </div>
          <DataTable
            columns={["Nome", "Empresa", "Operadora", "Equipe", "Status"]}
            rows={sellers.map((item) => [
              item.fullName,
              item.companyName,
              item.operatorName,
              item.teamName,
              item.status
            ])}
          />
        </article>
      </div>
    </AppShell>
  );
}
