import type { PhaseId } from "./plan";

/**
 * Writing prompt bank. ROADMAP v3 §9.5: the app must hand the learner a real
 * question. Leaving the prompt box optional meant a free-write got graded
 * against Task Response, which measures answering a question that was never
 * asked.
 *
 * `free` prompts are everyday writing for the return phase. `task2` and `task1`
 * are IELTS-shaped questions written for this app (generic question forms, not
 * transcribed exam papers).
 */

export type PromptKind = "free" | "task2" | "task1";

export interface WritingPrompt {
  id: string;
  kind: PromptKind;
  topic: string;
  /** The question or instruction shown to the learner. */
  text: string;
  /** Word target for this prompt, which the grader also uses. */
  words: number;
}

const FREE: WritingPrompt[] = [
  {
    id: "free-school",
    kind: "free",
    topic: "Bản thân",
    text: "Describe the high school you went to: what it was like, what you studied, and one thing you still remember.",
    words: 130,
  },
  {
    id: "free-workday",
    kind: "free",
    topic: "Công việc",
    text: "Describe an ordinary working day of yours from start to finish.",
    words: 130,
  },
  {
    id: "free-trip",
    kind: "free",
    topic: "Trải nghiệm",
    text: "Write about a trip you took recently: where you went, who you went with, and whether it went as planned.",
    words: 130,
  },
  {
    id: "free-learning",
    kind: "free",
    topic: "Học tập",
    text: "Write about something you taught yourself. How did you learn it, and what was hardest?",
    words: 130,
  },
  {
    id: "free-city",
    kind: "free",
    topic: "Nơi sống",
    text: "Describe the place you live now and how it is different from where you grew up.",
    words: 130,
  },
  {
    id: "free-habit",
    kind: "free",
    topic: "Thói quen",
    text: "Write about a habit you would like to change, and what has stopped you so far.",
    words: 130,
  },
  {
    id: "free-tech",
    kind: "free",
    topic: "Công nghệ",
    text: "Describe a piece of software or a tool you use every day and why you rely on it.",
    words: 130,
  },
  {
    id: "free-person",
    kind: "free",
    topic: "Con người",
    text: "Write about someone who influenced how you work or study, and how they did it.",
    words: 130,
  },
];

const TASK2: WritingPrompt[] = [
  {
    id: "t2-edu-1",
    kind: "task2",
    topic: "Education",
    text: "Some people believe that schools should teach practical skills such as money management and cooking, rather than only academic subjects. To what extent do you agree or disagree?",
    words: 250,
  },
  {
    id: "t2-edu-2",
    kind: "task2",
    topic: "Education",
    text: "In many countries, students are required to study subjects they have no interest in. Do the advantages of this outweigh the disadvantages?",
    words: 250,
  },
  {
    id: "t2-env-1",
    kind: "task2",
    topic: "Environment",
    text: "Some argue that individual action is not enough to address environmental problems and that only governments can make a real difference. Discuss both views and give your own opinion.",
    words: 250,
  },
  {
    id: "t2-env-2",
    kind: "task2",
    topic: "Environment",
    text: "Cities are increasingly restricting private cars in their centres. What are the benefits of this policy, and what problems might it cause?",
    words: 250,
  },
  {
    id: "t2-tech-1",
    kind: "task2",
    topic: "Technology",
    text: "Artificial intelligence is replacing tasks that people used to be paid for. Is this a positive or a negative development?",
    words: 250,
  },
  {
    id: "t2-tech-2",
    kind: "task2",
    topic: "Technology",
    text: "Some people think children should be taught to write computer programs from primary school. To what extent do you agree or disagree?",
    words: 250,
  },
  {
    id: "t2-health-1",
    kind: "task2",
    topic: "Health",
    text: "Many people work long hours and get little exercise. What are the causes of this, and what can employers do about it?",
    words: 250,
  },
  {
    id: "t2-health-2",
    kind: "task2",
    topic: "Health",
    text: "Governments should tax unhealthy food in the same way they tax tobacco. To what extent do you agree or disagree?",
    words: 250,
  },
  {
    id: "t2-society-1",
    kind: "task2",
    topic: "Society & Crime",
    text: "Some believe that longer prison sentences are the best way to reduce crime, while others argue that education and employment matter more. Discuss both views and give your own opinion.",
    words: 250,
  },
  {
    id: "t2-society-2",
    kind: "task2",
    topic: "Society & Crime",
    text: "In some cities, public spaces are monitored by cameras at all times. Do the benefits of this outweigh the loss of privacy?",
    words: 250,
  },
  {
    id: "t2-work-1",
    kind: "task2",
    topic: "Work & Career",
    text: "Many employees now work from home permanently. What are the advantages of this for workers, and what are the drawbacks for companies?",
    words: 250,
  },
  {
    id: "t2-work-2",
    kind: "task2",
    topic: "Work & Career",
    text: "Some people change careers several times in their working lives, while others stay in one field. Which approach do you think is better, and why?",
    words: 250,
  },
  {
    id: "t2-culture-1",
    kind: "task2",
    topic: "Culture & Media",
    text: "Traditional skills and crafts are disappearing in many countries. Is this a problem, and what could be done about it?",
    words: 250,
  },
  {
    id: "t2-culture-2",
    kind: "task2",
    topic: "Culture & Media",
    text: "Most people now get their news from social media rather than newspapers. What effects does this have on society?",
    words: 250,
  },
  {
    id: "t2-gov-1",
    kind: "task2",
    topic: "Government & Money",
    text: "Some argue that governments should fund public transport rather than building more roads. To what extent do you agree or disagree?",
    words: 250,
  },
  {
    id: "t2-gov-2",
    kind: "task2",
    topic: "Government & Money",
    text: "Spending public money on space exploration cannot be justified while problems on Earth remain unsolved. Discuss both views and give your own opinion.",
    words: 250,
  },
];

const TASK1: WritingPrompt[] = [
  {
    id: "t1-line-internet",
    kind: "task1",
    topic: "Line graph",
    text: `The line graph shows the percentage of households with home internet access in four countries. Summarise the information and make comparisons where relevant.

        2005   2010   2015   2020
Vietnam   8%     26%    52%    78%
Thailand  12%    31%    47%    69%
Japan     58%    72%    83%    91%
Brazil    14%    29%    51%    74%`,
    words: 150,
  },
  {
    id: "t1-bar-transport",
    kind: "task1",
    topic: "Bar chart",
    text: `The bar chart shows how people in one city travelled to work in 2010 and 2022. Summarise the information and make comparisons where relevant.

           2010   2022
Car        46%    31%
Motorbike  28%    22%
Bus        14%    19%
Bicycle     7%    13%
Walking     5%    15%`,
    words: 150,
  },
  {
    id: "t1-table-energy",
    kind: "task1",
    topic: "Table",
    text: `The table shows electricity generated by source in one country, in terawatt-hours. Summarise the information and make comparisons where relevant.

          2000   2010   2020
Coal      120     168     94
Hydro      41      55     62
Gas        18      47     88
Solar       0       3     41
Wind        1       9     37`,
    words: 150,
  },
  {
    id: "t1-process-coffee",
    kind: "task1",
    topic: "Process",
    text: "The diagram describes how instant coffee is produced: harvesting the beans, drying them in the sun, roasting at high temperature, grinding, brewing a concentrate, freeze-drying the concentrate into granules, and finally packing and sealing the jars. Summarise the process, describing the main stages.",
    words: 150,
  },
  {
    id: "t1-pie-spending",
    kind: "task1",
    topic: "Pie chart",
    text: `Two pie charts show household spending in one country in 1990 and 2020. Summarise the information and make comparisons where relevant.

              1990   2020
Food           38%    22%
Housing        21%    31%
Transport      12%    16%
Education       9%    14%
Healthcare      7%    11%
Other          13%     6%`,
    words: 150,
  },
];

const ALL = [...FREE, ...TASK2, ...TASK1];

export function promptById(id: string): WritingPrompt | undefined {
  return ALL.find((p) => p.id === id);
}

/** Which prompt kinds a phase draws from, in preference order. */
export function promptKindsFor(phase: PhaseId): PromptKind[] {
  switch (phase) {
    case "return":
      return ["free"];
    case "format":
      return ["task2"];
    default:
      return ["task2", "task1"];
  }
}

export function promptsFor(phase: PhaseId, kind?: PromptKind): WritingPrompt[] {
  const kinds = kind ? [kind] : promptKindsFor(phase);
  return ALL.filter((p) => kinds.includes(p.kind));
}

/**
 * Next prompt for the phase: the first unused one, falling back to the
 * least-recently-used when the bank has been exhausted.
 */
export function pickPrompt(
  phase: PhaseId,
  usedIds: string[],
  kind?: PromptKind,
): WritingPrompt | null {
  const pool = promptsFor(phase, kind);
  if (pool.length === 0) return null;
  const used = new Set(usedIds);
  const fresh = pool.find((p) => !used.has(p.id));
  if (fresh) return fresh;
  // All used: pick the one whose last use is furthest back in `usedIds`.
  const lastUse = new Map<string, number>();
  usedIds.forEach((id, index) => {
    lastUse.set(id, index);
  });
  return [...pool].sort(
    (a, b) => (lastUse.get(a.id) ?? -1) - (lastUse.get(b.id) ?? -1),
  )[0];
}
