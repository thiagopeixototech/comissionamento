import styles from "./styles.module.css";

export function WorkflowSteps({
  currentStep
}: {
  currentStep: number;
}) {
  const steps = [
    "Fonte",
    "Mapeamento",
    "Validacao",
    "Normalizacao",
    "Conciliacao",
    "Comissao"
  ];

  return (
    <section className={styles.workflow}>
      {steps.map((step, index) => {
        const status =
          index < currentStep ? "done" : index === currentStep ? "current" : "upcoming";

        return (
          <div className={styles.workflowStep} data-status={status} key={step}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{step}</strong>
          </div>
        );
      })}
    </section>
  );
}
