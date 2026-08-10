"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { LearnerProfile } from "@/lib/ielts/profile";
import { updateProfile } from "@/server/ielts/profile";

function Field({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {children}
    </div>
  );
}

export function ProfileForm({ profile }: { profile: LearnerProfile }) {
  const [name, setName] = useState(profile.name);
  const [examGoal, setExamGoal] = useState(profile.examGoal);
  const [startPoint, setStartPoint] = useState(profile.startPoint);
  const [dailyMinutes, setDailyMinutes] = useState(
    String(profile.dailyMinutes),
  );
  const [targetOverall, setTargetOverall] = useState(
    String(profile.targetOverall),
  );
  const [targetListening, setTargetListening] = useState(
    String(profile.targetBands.listening),
  );
  const [targetReading, setTargetReading] = useState(
    String(profile.targetBands.reading),
  );
  const [targetWriting, setTargetWriting] = useState(
    String(profile.targetBands.writing),
  );
  const [targetSpeaking, setTargetSpeaking] = useState(
    String(profile.targetBands.speaking),
  );
  const [strategy, setStrategy] = useState(profile.strategy);
  const [constraints, setConstraints] = useState(
    profile.constraints.join("\n"),
  );
  const [priorities, setPriorities] = useState(profile.priorities.join("\n"));
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, startSave] = useTransition();

  function save() {
    setError(null);
    setSaved(false);
    startSave(async () => {
      try {
        await updateProfile({
          name,
          examGoal,
          startPoint,
          dailyMinutes: Number(dailyMinutes) || 0,
          targetOverall: Number(targetOverall) || 0,
          targetListening: Number(targetListening) || 0,
          targetReading: Number(targetReading) || 0,
          targetWriting: Number(targetWriting) || 0,
          targetSpeaking: Number(targetSpeaking) || 0,
          strategy,
          constraints: constraints
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean),
          priorities: priorities
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean),
        });
        setSaved(true);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Lưu thất bại.");
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Mục tiêu & lịch học</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field id="profile-name" label="Tên">
            <Input
              id="profile-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>
          <Field id="profile-exam-goal" label="Mục tiêu kỳ thi">
            <Input
              id="profile-exam-goal"
              value={examGoal}
              onChange={(e) => setExamGoal(e.target.value)}
            />
          </Field>
        </div>

        <Field id="profile-start-point" label="Điểm xuất phát">
          <Textarea
            id="profile-start-point"
            value={startPoint}
            onChange={(e) => setStartPoint(e.target.value)}
            rows={2}
          />
        </Field>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field id="profile-daily-minutes" label="Số phút học/ngày">
            <Input
              id="profile-daily-minutes"
              type="number"
              value={dailyMinutes}
              onChange={(e) => setDailyMinutes(e.target.value)}
            />
          </Field>
          <Field id="profile-target-overall" label="Overall target">
            <Input
              id="profile-target-overall"
              type="number"
              step="0.5"
              value={targetOverall}
              onChange={(e) => setTargetOverall(e.target.value)}
            />
          </Field>
        </div>

        <div className="grid gap-3 sm:grid-cols-4">
          <Field id="profile-target-listening" label="Listening">
            <Input
              id="profile-target-listening"
              type="number"
              step="0.5"
              value={targetListening}
              onChange={(e) => setTargetListening(e.target.value)}
            />
          </Field>
          <Field id="profile-target-reading" label="Reading">
            <Input
              id="profile-target-reading"
              type="number"
              step="0.5"
              value={targetReading}
              onChange={(e) => setTargetReading(e.target.value)}
            />
          </Field>
          <Field id="profile-target-writing" label="Writing">
            <Input
              id="profile-target-writing"
              type="number"
              step="0.5"
              value={targetWriting}
              onChange={(e) => setTargetWriting(e.target.value)}
            />
          </Field>
          <Field id="profile-target-speaking" label="Speaking">
            <Input
              id="profile-target-speaking"
              type="number"
              step="0.5"
              value={targetSpeaking}
              onChange={(e) => setTargetSpeaking(e.target.value)}
            />
          </Field>
        </div>

        <Field id="profile-strategy" label="Chiến lược">
          <Textarea
            id="profile-strategy"
            value={strategy}
            onChange={(e) => setStrategy(e.target.value)}
            rows={2}
          />
        </Field>

        <Field id="profile-constraints" label="Ràng buộc (mỗi dòng một mục)">
          <Textarea
            id="profile-constraints"
            value={constraints}
            onChange={(e) => setConstraints(e.target.value)}
            rows={3}
          />
        </Field>

        <Field id="profile-priorities" label="Ưu tiên (mỗi dòng một mục)">
          <Textarea
            id="profile-priorities"
            value={priorities}
            onChange={(e) => setPriorities(e.target.value)}
            rows={3}
          />
        </Field>

        {error && <p className="text-sm text-destructive">{error}</p>}
        {saved && !saving && (
          <p className="text-sm text-muted-foreground">Đã lưu.</p>
        )}

        <Button onClick={save} disabled={saving}>
          {saving ? "Đang lưu…" : "Lưu hồ sơ"}
        </Button>
      </CardContent>
    </Card>
  );
}
