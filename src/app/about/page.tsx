export default function AboutPage() {
  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">About</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          I am an AI Engineer focused on making Large Language Models useful,
          reliable, and observable in production.
        </p>
      </header>

      <section className="space-y-6 text-sm leading-7 text-muted-foreground">
        <div className="space-y-3">
          <h2 className="text-base font-semibold tracking-tight text-foreground">
            About me
          </h2>
          <p>
            My work revolves around Information Retrieval (IR), bridging
            standard backend architectures with advanced vector and graph search
            systems.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-base font-semibold tracking-tight text-foreground">
            What I build
          </h2>
          <p>
            I specialize in constructing robust RAG (Retrieval-Augmented
            Generation) pipelines. From embedding search with Qdrant to modeling
            complex relationships in Neo4j, I enjoy solving the “context
            problem” for AI agents.
          </p>
          <p>
            Recently, I&apos;ve been involved in AI for sustainability
            (biodiversity datasets) and automated QA for Blockchain protocols.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-base font-semibold tracking-tight text-foreground">
            My stack & workflow
          </h2>
          <p>
            I live in the terminal. My daily driver is a heavily customized
            Linux environment (BSPWM + Polybar) and Neovim.
          </p>
          <ul className="ml-5 list-disc space-y-2">
            <li>
              <span className="font-medium text-foreground">AI/ML:</span>{" "}
              LangChain, Hugging Face, LLM evaluation (Langfuse/LangTrace).
            </li>
            <li>
              <span className="font-medium text-foreground">
                Backend/Search:
              </span>{" "}
              Python, FastAPI, Neo4j, Qdrant.
            </li>
            <li>
              <span className="font-medium text-foreground">Frontend:</span>{" "}
              TypeScript, Next.js, TailwindCSS.
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-base font-semibold tracking-tight text-foreground">
            Off-screen
          </h2>
          <p>
            When I&apos;m not configuring system runtimes or reading about LoRA
            & PEFT, I play the guitar. Currently trying to master
            Beethoven&apos;s Moonlight Sonata.
          </p>
        </div>
      </section>
    </div>
  );
}
