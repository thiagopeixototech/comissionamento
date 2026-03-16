import styles from "./styles.module.css";

export function StatsGrid({
  items
}: {
  items: Array<{ label: string; value: string; tone?: "default" | "success" | "warning" | "danger" }>;
}) {
  return (
    <section className={styles.statsGrid}>
      {items.map((item) => (
        <article className={styles.statCard} key={item.label} data-tone={item.tone ?? "default"}>
          <span className={styles.statLabel}>{item.label}</span>
          <strong className={styles.statValue}>{item.value}</strong>
        </article>
      ))}
    </section>
  );
}
