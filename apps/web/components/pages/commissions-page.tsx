import { AppShell } from "../app-shell";
import { DataTable } from "../data-table";
import { StatsGrid } from "../stats-grid";
import styles from "../styles.module.css";
import type { CommissionSummary } from "@teleconcilia/contracts";

export function CommissionsPage({ summary }: { summary: CommissionSummary }) {
  return (
    <AppShell
      eyebrow="Financeiro e comissao"
      title="Apuracao auditavel de comissoes"
      actions={
        <>
          <button className={styles.secondaryButton} type="button">
            Exportar CSV
          </button>
          <button className={styles.primaryButton} type="button">
            Recalcular comissao
          </button>
        </>
      }
    >
      <div className={styles.pageGrid}>
        <StatsGrid
          items={[
            { label: "Valor total de comissao", value: summary.totals.totalCommissionAmount.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }), tone: "success" },
            { label: "Valor bloqueado", value: summary.totals.totalBlockedAmount.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }), tone: "warning" },
            { label: "Valor pendente", value: summary.totals.totalPendingAmount.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }) },
            { label: "Valor ajustado", value: summary.totals.totalAdjustedAmount.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }) }
          ]}
        />

        <article className={styles.panel}>
          <div className={styles.panelTitleRow}>
            <h2 className={styles.panelTitle}>Detalhamento por vendedor</h2>
          </div>
          <DataTable
            columns={[
              "Vendedor",
              "Vendas",
              "Conciliadas",
              "Instaladas",
              "Divergentes",
              "Base comissionavel",
              "Comissao"
            ]}
            rows={summary.sellers.map((item) => [
              item.sellerName,
              item.totalSales.toLocaleString("pt-BR"),
              item.reconciledSales.toLocaleString("pt-BR"),
              item.installedSales.toLocaleString("pt-BR"),
              item.divergentSales.toLocaleString("pt-BR"),
              item.commissionableValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
              item.commissionAmount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
            ])}
          />
        </article>

        <section className={styles.cardsGrid}>
          <div className={styles.infoCard}>
            <strong>Regra rastreavel</strong>
            <p>Cada item de comissao deve apontar a versao da regra, a base de calculo e o motivo de bloqueio.</p>
          </div>
          <div className={styles.infoCard}>
            <strong>Processamento backend</strong>
            <p>Nenhum calculo critico depende do frontend. O cliente so consome resultados e explicacoes.</p>
          </div>
          <div className={styles.infoCard}>
            <strong>Reprocessamento seguro</strong>
            <p>Alteracoes de regra devem recalcular apenas os lotes impactados, preservando historico anterior.</p>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
