export default function ResumePage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Resume</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Snapshot of experience, skills, and education.
        </p>
      </header>

      <section className="space-y-3 text-sm leading-7 text-muted-foreground">
        <p>(You can replace this with your real CV content later.)</p>
      </section>
    </div>
  );
}
