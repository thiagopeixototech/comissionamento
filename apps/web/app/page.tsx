import { DashboardPage } from "../components/pages/dashboard-page";
import { getDashboardSummary } from "../lib/api";

export default async function HomePage() {
  const summary = await getDashboardSummary();

  return <DashboardPage summary={summary} />;
}
