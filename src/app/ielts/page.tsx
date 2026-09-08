import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

/**
 * The learner's home is the actionable Today checklist. The old metrics
 * dashboard was already unreachable behind this redirect and duplicated what
 * /ielts/today and /ielts/progress now show, so it has been removed rather
 * than carried forward into roadmap v3.
 */
export default function IeltsHome() {
  redirect("/ielts/today");
}
