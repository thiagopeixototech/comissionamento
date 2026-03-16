import Link from "next/link";
import styles from "../styles.module.css";

export function LoginPage() {
  return (
    <main className={styles.loginWrap}>
      <section className={styles.loginCard}>
        <div className={styles.loginHero}>
          <span className={styles.eyebrow}>Acesso seguro</span>
          <h1>TeleConcilia</h1>
          <p>
            Plataforma para conciliar vendas telecom, tratar duplicidades, calcular comissao e
            auditar cada decisao operacional.
          </p>
          <p>
            O MVP ja foi desenhado para processamento pesado no backend, historico confiavel e
            operacao rapida com muitos registros.
          </p>
        </div>

        <div className={styles.loginForm}>
          <div>
            <span className={styles.eyebrow}>Entrar</span>
            <h2>Acesse sua operacao</h2>
          </div>

          <form>
            <label>
              <span>E-mail</span>
              <input defaultValue="admin@teleconcilia.local" type="email" />
            </label>
            <label>
              <span>Senha</span>
              <input defaultValue="teleconcilia" type="password" />
            </label>
            <Link className={styles.primaryButton} href="/">
              Entrar no dashboard
            </Link>
          </form>
        </div>
      </section>
    </main>
  );
}
