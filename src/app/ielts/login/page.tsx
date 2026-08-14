import { LoginForm } from "@/components/ielts/login-form";

export default async function IeltsLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 py-16">
      <div className="space-y-1 text-center">
        <h1 className="text-xl font-semibold tracking-tight">
          Private workspace
        </h1>
        <p className="text-sm text-muted-foreground">
          Khu vực riêng tư — cần đăng nhập để tiếp tục.
        </p>
      </div>
      <LoginForm
        next={
          next?.startsWith("/ielts") || next?.startsWith("/quiz")
            ? next
            : "/ielts/today"
        }
      />
    </div>
  );
}
