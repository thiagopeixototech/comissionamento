import { ReconciliationPage } from "../../components/pages/reconciliation-page";
import { getReconciliations } from "../../lib/api";

export default async function ReconciliationRoutePage() {
  const reconciliations = await getReconciliations();

  return <ReconciliationPage reconciliations={reconciliations} />;
}
