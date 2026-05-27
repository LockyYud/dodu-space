import { LocalizedText } from "@/components/custom/localized-text";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const items = [
  {
    id: "rag-map",
    title: { vi: "RAG System Map", en: "RAG System Map" },
    description: {
      vi: "Sơ đồ nhỏ cho pipeline ingestion, retrieval và answer trace.",
      en: "A compact map for ingestion, retrieval, and answer trace pipelines.",
    },
    kind: "system",
  },
  {
    id: "terminal",
    title: { vi: "Terminal Workflow", en: "Terminal Workflow" },
    description: {
      vi: "Một panel mô phỏng workflow engineer khi debug retrieval.",
      en: "A panel that simulates an engineer debugging retrieval quality.",
    },
    kind: "terminal",
  },
  {
    id: "signal",
    title: { vi: "Evaluation Signal", en: "Evaluation Signal" },
    description: {
      vi: "Visual compact cho precision, latency và groundedness.",
      en: "A compact visual for precision, latency, and groundedness signals.",
    },
    kind: "signal",
  },
] as const;

function CraftVisual({
  kind,
}: Readonly<{ kind: (typeof items)[number]["kind"] }>) {
  if (kind === "terminal") {
    return (
      <div className="rounded-lg border bg-black p-4 text-left text-xs text-zinc-300 shadow-inner">
        <div className="mb-4 flex gap-1.5">
          <span className="size-2 rounded-full bg-red-400" />
          <span className="size-2 rounded-full bg-yellow-400" />
          <span className="size-2 rounded-full bg-emerald-400" />
        </div>
        <div className="space-y-2 font-mono">
          <p>
            <span className="text-sky-300">$</span> run retrieval-eval --suite
            rag
          </p>
          <p className="text-emerald-300">✓ recall@8 improved +7.2%</p>
          <p className="text-zinc-500">
            trace: query → hybrid → rerank → answer
          </p>
          <p className="text-amber-300">latency p95: 820ms</p>
        </div>
      </div>
    );
  }

  if (kind === "signal") {
    return (
      <div className="grid gap-3 rounded-lg border bg-card/80 p-4">
        {[
          ["precision", "82%"],
          ["groundedness", "91%"],
          ["p95 latency", "0.82s"],
        ].map(([label, value]) => (
          <div key={label} className="space-y-2">
            <div className="flex justify-between tech-mono text-xs">
              <span className="text-muted-foreground">{label}</span>
              <span>{value}</span>
            </div>
            <div className="h-2 rounded-full bg-muted">
              <div
                className="h-2 rounded-full bg-[var(--color-accent-text)]"
                style={{ width: value === "0.82s" ? "64%" : value }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card/80 p-4">
      <div className="grid grid-cols-3 gap-3">
        {["Ingest", "Index", "Retrieve", "Rerank", "Context", "Answer"].map(
          (step, index) => (
            <div
              key={step}
              className="rounded-md border bg-background/70 p-3 text-center"
            >
              <p className="tech-mono text-[10px] text-[var(--color-accent-text)]">
                0{index + 1}
              </p>
              <p className="mt-1 text-sm font-medium">{step}</p>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

export default function CraftPage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-accent-text)]">
          craft — visual experiments
        </p>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          <LocalizedText
            vi="Giao diện và công cụ kỹ thuật"
            en="Engineering interfaces & tooling"
          />
        </h1>
        <p className="max-w-2xl text-sm leading-7 text-foreground/75">
          <LocalizedText
            vi="Nơi thử nghiệm các visual code-native: system diagrams, terminal workflows và debug interfaces cho AI engineering. Không phải design — là công cụ để nghĩ."
            en="Code-native visuals for AI engineering workflows: system diagrams, terminal panels, and debug interfaces. Not design showcases — thinking tools."
          />
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Dialog key={item.id}>
            <DialogTrigger
              render={
                <button
                  type="button"
                  className="group flex h-full flex-col gap-4 rounded-lg border bg-card/75 p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--color-accent-text)]"
                >
                  <CraftVisual kind={item.kind} />
                  <span>
                    <span className="block font-semibold">
                      <LocalizedText vi={item.title.vi} en={item.title.en} />
                    </span>
                    <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                      <LocalizedText
                        vi={item.description.vi}
                        en={item.description.en}
                      />
                    </span>
                  </span>
                </button>
              }
            />
            <DialogContent className="max-w-3xl bg-background/95 p-6">
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight">
                    <LocalizedText vi={item.title.vi} en={item.title.en} />
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    <LocalizedText
                      vi={item.description.vi}
                      en={item.description.en}
                    />
                  </p>
                </div>
                <CraftVisual kind={item.kind} />
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  );
}
