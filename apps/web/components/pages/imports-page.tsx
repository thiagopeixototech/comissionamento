import { AppShell } from "../app-shell";
import { DataTable } from "../data-table";
import { FilterBar } from "../filter-bar";
import { WorkflowSteps } from "../workflow-steps";
import styles from "../styles.module.css";
import { imports } from "../../lib/mock-data";

export function ImportsPage() {
  return (
    <AppShell
      eyebrow="Operacao"
      title="Importacoes e preparacao dos dados"
      actions={
        <button className={styles.primaryButton} type="button">
          Novo processo de importacao
        </button>
      }
    >
      <div className={styles.pageGrid}>
        <article className={styles.panel}>
          <div className={styles.panelTitleRow}>
            <h2 className={styles.panelTitle}>Fluxo guiado do processamento</h2>
          </div>
          <WorkflowSteps currentStep={3} />
        </article>

        <article className={styles.panel}>
          <div className={styles.panelTitleRow}>
            <h2 className={styles.panelTitle}>Filtros da fila de importacoes</h2>
          </div>
          <FilterBar
            fields={[
              { label: "Fonte", placeholder: "Arquivo, linha a linha..." },
              { label: "Empresa", placeholder: "Uma ou varias empresas" },
              { label: "Operadora", placeholder: "Uma ou varias operadoras" },
              { label: "Status", placeholder: "Status do lote" }
            ]}
          />
        </article>

        <article className={styles.panel}>
          <div className={styles.panelTitleRow}>
            <h2 className={styles.panelTitle}>Ultimos lotes processados</h2>
            <button className={styles.secondaryButton} type="button">
              Baixar rejeitados
            </button>
          </div>
          <DataTable
            columns={["Lote", "Fonte", "Empresa", "Operadora", "Status", "Validos", "Tempo"]}
            rows={imports.map((item) => [
              item.id,
              item.sourceType,
              item.company,
              item.operator,
              item.status,
              item.totalValid.toLocaleString("pt-BR"),
              `${(item.processingTimeMs / 1000).toFixed(1).replace(".", ",")}s`
            ])}
          />
        </article>

        <section className={styles.cardsGrid}>
          <div className={styles.infoCard}>
            <strong>Validacao obrigatoria</strong>
            <p>O fluxo impede avancar sem arquivo valido quando a fonte escolhida for importacao por arquivo.</p>
          </div>
          <div className={styles.infoCard}>
            <strong>Filtros amplos</strong>
            <p>Ao escolher vendas internas, o operador pode selecionar varias empresas, vendedores e operadoras sem bloqueios artificiais.</p>
          </div>
          <div className={styles.infoCard}>
            <strong>Mapeamento reaproveitavel</strong>
            <p>Modelos de coluna ficam versionados para reduzir retrabalho e aumentar consistencia operacional.</p>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
