import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { SettingsForm } from "@/components/admin/settings-form";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Admin · Settings" };

export default async function AdminSettings() {
  const rows = await db.setting.findMany();
  const settings = Object.fromEntries(rows.map((s) => [s.key, s.value]));

  return (
    <Container className="max-w-3xl py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      <p className="mt-1 text-muted">Platform configuration for deposits and referrals.</p>

      <div className="mt-8">
        <SettingsForm initial={settings} />
      </div>
    </Container>
  );
}
