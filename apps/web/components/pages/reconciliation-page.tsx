import { AppShell } from "../app-shell";
import { DataTable } from "../data-table";
import { FilterBar } from "../filter-bar";
import { StatsGrid } from "../stats-grid";
import styles from "../styles.module.css";
import { reconciliations } from "../../lib/mock-data";

export function ReconciliationPage() {
  return (
    <AppShell
      eyebrow="Analise"
      title="Consolidacao da conciliacao"
      actions={
        <>
          <button className={styles.secondaryButton} type="button">
            Simular regras
          </button>
          <button className={styles.primaryButton} type="button">
            Rodar conciliacao
          </button>
        </>
      }
    >
      <div className={styles.pageGrid}>
        <StatsGrid
          items={[
            { label: "Conciliadas", value: "101.245", tone: "success" },
            { label: "Divergentes", value: "3.674", tone: "warning" },
            { label: "Sugestoes", value: "1.182" },
            { label: "Nao encontradas", value: "18.240", tone: "danger" }
          ]}
        />

        <article className={styles.panel}>
          <div className={styles.panelTitleRow}>
            <h2 className={styles.panelTitle}>Filtros fortes de conciliacao</h2>
          </div>
          <FilterBar
            fields={[
              { label: "Busca rapida", placeholder: "CPF, nome, contrato ou telefone" },
              { label: "Operadora", placeholder: "Filtrar operadora" },
              { label: "Vendedor", placeholder: "Filtrar vendedor" },
              { label: "Status", placeholder: "Conciliado, divergente..." }
            ]}
          />
        </article>

        <article className={styles.panel}>
          <div className={styles.panelTitleRow}>
            <h2 className={styles.panelTitle}>Detalhamento por registro</h2>
          </div>
          <DataTable
            columns={["Cliente", "CPF", "Operadora", "Vendedor", "Status", "Score", "Regra aplicada"]}
            rows={reconciliations.map((item) => [
              item.customerName,
              item.cpf,
              item.operator,
              item.seller,
              item.status,
              String(item.matchScore),
              item.appliedRule
            ])}
          />
        </article>
      </div>
    </AppShell>
  );
}
