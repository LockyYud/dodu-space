"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addBand } from "@/server/ielts/bands";

const FIELDS = [
  ["listening", "L"],
  ["reading", "R"],
  ["writing", "W"],
  ["speaking", "S"],
] as const;

export function BandForm() {
  const [vals, setVals] = useState<Record<string, string>>({});
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, startSave] = useTransition();

  function save() {
    startSave(async () => {
      await addBand({
        listening: vals.listening ? Number(vals.listening) : undefined,
        reading: vals.reading ? Number(vals.reading) : undefined,
        writing: vals.writing ? Number(vals.writing) : undefined,
        speaking: vals.speaking ? Number(vals.speaking) : undefined,
        note: note || undefined,
        isMock: true,
      });
      setVals({});
      setNote("");
      setSaved(true);
    });
  }

  return (
    <div className="space-y-2 rounded-lg border p-3">
      <p className="text-sm font-medium">Thêm mock test</p>
      <div className="flex flex-wrap gap-2">
        {FIELDS.map(([key, label]) => (
          <div key={key} className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground">{label}</span>
            <Input
              value={vals[key] ?? ""}
              onChange={(e) =>
                setVals((v) => ({ ...v, [key]: e.target.value }))
              }
              placeholder="—"
              className="w-16"
              inputMode="decimal"
            />
          </div>
        ))}
      </div>
      <Input
        placeholder="Ghi chú (tuỳ chọn)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <div className="flex items-center gap-3">
        <Button size="sm" onClick={save} disabled={saving}>
          {saving ? "Đang lưu…" : "Lưu"}
        </Button>
        {saved && (
          <span className="text-sm text-emerald-600 dark:text-emerald-400">
            Đã lưu ✓
          </span>
        )}
      </div>
    </div>
  );
}
