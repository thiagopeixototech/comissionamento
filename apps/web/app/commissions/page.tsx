import { CommissionsPage } from "../../components/pages/commissions-page";
import { getCommissionSummary } from "../../lib/api";

export default async function CommissionsRoutePage() {
  const summary = await getCommissionSummary();

  return <CommissionsPage summary={summary} />;
}
