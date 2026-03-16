import { AppShell } from "../app-shell";
import { StatsGrid } from "../stats-grid";
import styles from "../styles.module.css";
import type { DashboardSummary } from "@teleconcilia/contracts";

export function DashboardPage({ summary }: { summary: DashboardSummary }) {
  const summaryItems = [
    { label: "Vendas importadas", value: summary.totalImportedSales.toLocaleString("pt-BR") },
    { label: "Conciliadas", value: summary.totalReconciled.toLocaleString("pt-BR"), tone: "success" as const },
    { label: "Nao conciliadas", value: summary.totalNotReconciled.toLocaleString("pt-BR"), tone: "warning" as const },
    { label: "Duplicadas", value: summary.totalDuplicates.toLocaleString("pt-BR"), tone: "danger" as const },
    { label: "Comissao prevista", value: summary.estimatedCommission.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }) },
    { label: "Comissao bloqueada", value: summary.blockedCommission.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }), tone: "warning" as const }
  ];

  const chartRows = (summary.charts.reconciliationByOperator.length > 0
    ? summary.charts.reconciliationByOperator
    : [{ label: "Geral", value: Math.round(summary.reconciliationRate) }]
  ).map((item) => ({
    label: item.label,
    width: `${item.value}%`,
    value: `${item.value}%`
  }));

  return (
    <AppShell
      eyebrow="Visao executiva"
      title="Dashboard operacional do TeleConcilia"
      actions={
        <>
          <button className={styles.secondaryButton} type="button">
            Exportar resumo
          </button>
          <button className={styles.primaryButton} type="button">
            Nova conciliacao
          </button>
        </>
      }
    >
      <div className={styles.pageGrid}>
        <StatsGrid items={summaryItems} />

        <section className={styles.twoColumns}>
          <article className={styles.panel}>
            <div className={styles.panelTitleRow}>
              <h2 className={styles.panelTitle}>Taxa de conciliacao por operadora</h2>
            </div>

            <div className={styles.miniChart}>
              {chartRows.map((row) => (
                <div className={styles.chartRow} key={row.label}>
                  <span>{row.label}</span>
                  <div className={styles.chartBar} style={{ width: row.width }} />
                  <strong>{row.value}</strong>
                </div>
              ))}
            </div>
          </article>

          <article className={styles.panel}>
            <div className={styles.panelTitleRow}>
              <h2 className={styles.panelTitle}>Leituras rapidas</h2>
            </div>
            <div className={styles.cardsGrid}>
              <div className={styles.infoCard}>
                <strong>Principais perdas</strong>
                <p>Cancelamento apos venda, linha a linha nao reconhecido e status divergente.</p>
              </div>
              <div className={styles.infoCard}>
                <strong>Maior risco</strong>
                <p>4.210 registros em duplicidade aguardando decisao para liberar comissao.</p>
              </div>
              <div className={styles.infoCard}>
                <strong>Reprocessamento</strong>
                <p>Ultimo lote executado em 18,2s com 24.102 registros validos.</p>
              </div>
            </div>
          </article>
        </section>
      </div>
    </AppShell>
  );
}
