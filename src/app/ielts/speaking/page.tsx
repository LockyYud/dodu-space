import { SpeakingForm } from "@/components/ielts/speaking-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { lessonSequence } from "@/lib/ielts/plan";
import { listSpeaking } from "@/server/ielts/speaking";

export const dynamic = "force-dynamic";

export default async function SpeakingPage({
  searchParams,
}: {
  searchParams?: Promise<{ lessonId?: string | string[] }>;
}) {
  const [sessions, params] = await Promise.all([listSpeaking(), searchParams]);
  const lessonId = Array.isArray(params?.lessonId)
    ? params.lessonId[0]
    : params?.lessonId;
  const lesson = lessonId
    ? lessonSequence().find((item) => item.id === lessonId)
    : undefined;
  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Speaking</h1>
        <p className="text-sm text-muted-foreground">
          Sau buổi gia sư, ghi lại band, 1–3 lỗi ưu tiên và một việc cần làm
          lại. Bài hôm nay sẽ tự hoàn thành sau khi lưu.
        </p>
      </header>

      <SpeakingForm lesson={lesson} />

      <div className="space-y-2">
        <h2 className="text-sm font-medium text-muted-foreground">
          Buổi đã ghi ({sessions.length})
        </h2>
        {sessions.length === 0 && (
          <p className="text-sm text-muted-foreground">Chưa có buổi nào.</p>
        )}
        {sessions.map((s) => (
          <Card key={s.id}>
            <CardContent className="flex items-start justify-between gap-3 py-3">
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium">{s.date}</span>
                  {s.durationMin != null && (
                    <Badge variant="outline" className="text-[10px]">
                      {s.durationMin}′
                    </Badge>
                  )}
                  {s.bandEstimate != null && (
                    <Badge variant="secondary" className="text-[10px]">
                      band {s.bandEstimate.toFixed(1)}
                    </Badge>
                  )}
                </div>
                {s.tutorNotes && (
                  <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                    {s.tutorNotes}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
