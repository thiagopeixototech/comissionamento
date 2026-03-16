import styles from "./styles.module.css";

export function FilterBar({
  fields
}: {
  fields: Array<{ label: string; placeholder: string }>;
}) {
  return (
    <section className={styles.filterBar}>
      {fields.map((field) => (
        <label className={styles.filterField} key={field.label}>
          <span>{field.label}</span>
          <input placeholder={field.placeholder} />
        </label>
      ))}
      <button className={styles.primaryButton} type="button">
        Aplicar filtros
      </button>
    </section>
  );
}
