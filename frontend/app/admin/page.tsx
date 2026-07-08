import { AdminDashboard } from "@/components/admin-dashboard";
import { SiteShell } from "@/components/site-shell";

export default function AdminPage() {
  return (
    <SiteShell>
      <main className="py-8">
        <AdminDashboard />
      </main>
    </SiteShell>
  );
}
