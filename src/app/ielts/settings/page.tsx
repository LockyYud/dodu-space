import { ExternalBenchmarkForm } from "@/components/ielts/external-benchmark-form";
import { ProfileForm } from "@/components/ielts/profile-form";
import { listExternalBenchmarks } from "@/server/ielts/benchmarks";
import { getProfile } from "@/server/ielts/profile";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const [profile, benchmarks] = await Promise.all([
    getProfile(),
    listExternalBenchmarks(),
  ]);

  return (
    <section className="max-w-2xl space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Hồ sơ học</h1>
        <p className="text-sm text-muted-foreground">
          Đổi mục tiêu, lịch học, chiến lược ngay tại đây — không cần sửa{" "}
          <code>.env</code> hay redeploy.
        </p>
      </header>
      <ProfileForm profile={profile} />
      <ExternalBenchmarkForm benchmarks={benchmarks} />
    </section>
  );
}
