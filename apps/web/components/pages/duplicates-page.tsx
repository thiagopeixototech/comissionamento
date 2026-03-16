import { AppShell } from "../app-shell";
import styles from "../styles.module.css";
import { duplicateGroups } from "../../lib/mock-data";

export function DuplicatesPage() {
  return (
    <AppShell
      eyebrow="Revisao manual"
      title="Duplicidades agrupadas por cliente"
      actions={
        <button className={styles.primaryButton} type="button">
          Aplicar decisoes
        </button>
      }
    >
      <div className={styles.pageGrid}>
        {duplicateGroups.map((group) => (
          <article className={styles.panel} key={group.cpf}>
            <div className={styles.panelTitleRow}>
              <div>
                <h2 className={styles.panelTitle}>
                  {group.customerName} - CPF {group.cpf}
                </h2>
                <span className={styles.eyebrow}>{group.recordCount} registros relacionados</span>
              </div>
              <button className={styles.secondaryButton} type="button">
                Escolher principal
              </button>
            </div>
            <div className={styles.cardsGrid}>
              <div className={styles.infoCard}>
                <strong>Sugestao automatica</strong>
                <p>Registro {group.suggestedRecordId} com prioridade operacional mais alta.</p>
              </div>
              {group.items.map((item) => (
                <div className={styles.infoCard} key={item.id}>
                  <strong>Registro</strong>
                  <p>
                    {item.seller}, {item.saleDate}, {item.status}, prioridade {item.priorityScore}
                    {item.operatorRecognition ? ", reconhecido pela operadora" : ", sem reconhecimento"}
                  </p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </AppShell>
  );
}
