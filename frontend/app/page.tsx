import { SubmissionForm } from "@/components/submission-form";
import { SiteShell } from "@/components/site-shell";

export default function Home() {
  return (
    <SiteShell>
      <main className="flex flex-1 items-start justify-center py-8">
        <SubmissionForm />
      </main>
    </SiteShell>
  );
}
