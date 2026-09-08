import assert from "node:assert/strict";
import {
  daysForWeek,
  deskMinutesForDay,
  FORMAT_WEEK_COUNT,
  FORMAT_WEEKS,
  formatWeek,
  guidedMinutesForWeek,
  isOutsideDesk,
  isSelfLoggable,
  mondayOf,
  nextPhaseId,
  PHASES,
  type PhaseId,
  PLANNED_WEEKS_TOTAL,
  phaseById,
  plannedGuidedHours,
  plannedWeeksRemaining,
  scheduledByWeekday,
  selfLoggableSlots,
  slotsForWeek,
  studyDaysForWeek,
  WEEK_LOADS,
  WEEKDAY_DESK_CAP,
  WEEKDAY_SHORT,
  weekdayOf,
  weeklyMinutes,
  weeklyTargets,
} from "../../src/lib/ielts/plan";
import { pickPrompt, promptsFor } from "../../src/lib/ielts/prompts";

let passed = 0;
const check = (name: string, fn: () => void) => {
  fn();
  passed++;
  console.log(`  ✓ ${name}`);
};

check("four phases, ordered, ending at the taper", () => {
  assert.deepEqual(
    PHASES.map((p) => p.id),
    ["return", "format", "build", "taper"],
  );
  assert.equal(nextPhaseId("return"), "format");
  assert.equal(nextPhaseId("taper"), null);
  // 26 tuần: bản 22 tuần không đủ quỹ giờ, xem METHOD-REVIEW §3.
  assert.equal(PLANNED_WEEKS_TOTAL, 26);
});

check("early phases coach, later phases grade", () => {
  assert.equal(phaseById("return").gradingMode, "coach");
  assert.equal(phaseById("format").gradingMode, "coach");
  assert.equal(phaseById("build").gradingMode, "band");
  assert.equal(phaseById("taper").gradingMode, "band");
});

check("every phase has a daily input + SRS habit", () => {
  for (const phase of PHASES) {
    const keys = phase.daily.map((d) => d.key);
    for (const required of ["input-listen", "input-read", "srs"] as const) {
      assert.ok(keys.includes(required), `${phase.id} thiếu ${required}`);
    }
    const total = phase.daily.reduce((sum, d) => sum + d.minutes, 0);
    assert.ok(total <= 75, `${phase.id}: daily load ${total}' is too heavy`);
  }
});

check("bắt từ mới có ở mọi giai đoạn trừ giai đoạn trước thi", () => {
  // "Không nạp bài mới" là nghĩa đúng của giai đoạn taper, và bắt từ mới
  // chính là nạp bài mới.
  const has = (id: PhaseId) =>
    phaseById(id).daily.some((d) => d.key === "vocab");
  for (const id of ["return", "format", "build"] as const) {
    assert.equal(has(id), true, `${id} phải có ô từ vựng`);
  }
  assert.equal(has("taper"), false);
});

check("ô 4/3/2 mở từ giai đoạn 1, không phải giai đoạn 0", () => {
  // Giai đoạn 0 chỉ có một việc: giữ được nhịp. Chất thêm vào đó là cách v1 chết.
  const has = (id: PhaseId) =>
    phaseById(id).daily.some((d) => d.key === "speak-drill");
  assert.equal(has("return"), false);
  for (const id of ["format", "build", "taper"] as const) {
    assert.equal(has(id), true, `${id} phải có ô 4/3/2`);
  }
});

check("chép chính tả chỉ có ở giai đoạn nâng band", () => {
  const has = (id: PhaseId) =>
    phaseById(id).weekly.some((s) => s.slot === "dictation");
  assert.equal(has("build"), true);
  for (const id of ["return", "format", "taper"] as const) {
    assert.equal(has(id), false, `${id} không nên có chép chính tả`);
  }
  // Ba lần mỗi tuần khi rảnh, tụt còn một khi bận — nó là việc 10 phút, đúng
  // loại việc vừa với một buổi tối ngày thường.
  const build = phaseById("build");
  assert.equal(weeklyTargets(build, "light", 1).get("dictation"), 1);
  assert.equal(weeklyTargets(build, "normal", 1).get("dictation"), 2);
  assert.equal(weeklyTargets(build, "full", 1).get("dictation"), 3);
});

check("every phase has a weekly tutor slot", () => {
  for (const phase of PHASES) {
    const tutor = phase.weekly.filter((s) => s.slot === "tutor");
    assert.equal(tutor.length, 1, `${phase.id} tutor slot`);
    // Đúng hai buổi ở mọi mức tải: gia sư là hẹn với người thật, không phải
    // suất để âm thầm bỏ khi tuần bận. Cả hai nằm ở cuối tuần.
    for (const load of WEEK_LOADS) {
      assert.equal(
        weeklyTargets(phase, load, 1).get("tutor"),
        2,
        `${phase.id} ${load} tutor`,
      );
    }
  }
});

check(
  "writing has a rewrite partner wherever it is graded for progress",
  () => {
    for (const id of ["return", "format", "build"] as const) {
      const phase = phaseById(id);
      assert.ok(
        phase.weekly.some((s) => s.slot === "writing"),
        `${id} writing`,
      );
      assert.ok(
        phase.weekly.some((s) => s.slot === "rewrite"),
        `${id} rewrite`,
      );
    }
  },
);

check("mocks appear every third week of the build phase only", () => {
  const build = phaseById("build");
  const mock = build.weekly.find((s) => s.slot === "mock");
  assert.ok(mock);
  assert.equal(mock.everyNWeeks, 3);
  assert.equal(
    slotsForWeek(build, 1).some((s) => s.slot === "mock"),
    false,
  );
  assert.equal(
    slotsForWeek(build, 3).some((s) => s.slot === "mock"),
    true,
  );
  assert.equal(
    slotsForWeek(build, 6).some((s) => s.slot === "mock"),
    true,
  );
  for (const id of ["return", "format", "taper"] as const) {
    assert.equal(
      phaseById(id).weekly.some((s) => s.slot === "mock"),
      false,
      `${id} must not schedule mocks`,
    );
  }
});

check("Task 1 alternates weeks in the build phase", () => {
  const build = phaseById("build");
  const week1 = slotsForWeek(build, 1).filter((s) => s.slot === "writing");
  const week2 = slotsForWeek(build, 2).filter((s) => s.slot === "writing");
  assert.equal(week1.length, 1); // Task 2 only
  assert.equal(week2.length, 2); // Task 2 + Task 1
});

check("only tool-less slots may be ticked by hand", () => {
  const selfLoggable = selfLoggableSlots();
  // The grammar drill has no tool, so without this it could never be completed.
  assert.ok(selfLoggable.includes("grammar"));
  // Anything with a tool must be completed by saving real work: ticking a mock
  // by hand would skip the bands the mock exists to produce.
  for (const slot of ["writing", "rewrite", "mock", "tutor", "timed-reading"]) {
    assert.equal(
      isSelfLoggable(slot),
      false,
      `${slot} must not be self-loggable`,
    );
  }
});

check("every phase can be exited by a measurable criterion", () => {
  for (const phase of PHASES) {
    assert.ok(phase.exit.length > 0, `${phase.id} needs exit criteria`);
    for (const criterion of phase.exit) {
      assert.ok(criterion.target > 0, `${phase.id}/${criterion.id} target`);
      assert.ok(criterion.label.length > 10, `${phase.id} label`);
    }
  }
});

check("planned weeks remaining shrinks as the plan progresses", () => {
  assert.equal(plannedWeeksRemaining("return", 1), PLANNED_WEEKS_TOTAL);
  assert.ok(
    plannedWeeksRemaining("return", 3) < plannedWeeksRemaining("return", 1),
  );
  assert.equal(plannedWeeksRemaining("taper", 3), 1);
  assert.ok(
    plannedWeeksRemaining("build", 1) > plannedWeeksRemaining("taper", 1),
  );
});

check("the format phase teaches one question type set per week", () => {
  assert.equal(FORMAT_WEEKS.length, FORMAT_WEEK_COUNT);
  assert.equal(formatWeek(1)?.reading, "True / False / Not Given");
  assert.equal(formatWeek(FORMAT_WEEK_COUNT + 1), null);
});

check("prompt bank serves each phase and never repeats until exhausted", () => {
  assert.ok(promptsFor("return").every((p) => p.kind === "free"));
  assert.ok(promptsFor("format").every((p) => p.kind === "task2"));

  const pool = promptsFor("return");
  const used: string[] = [];
  for (let i = 0; i < pool.length; i++) {
    const next = pickPrompt("return", used);
    assert.ok(next, "bank ran dry");
    assert.equal(used.includes(next.id), false, "repeated before exhausting");
    used.push(next.id);
  }
  // Exhausted: falls back to the least recently used rather than returning null.
  const recycled = pickPrompt("return", used);
  assert.equal(recycled?.id, used[0]);
});

check("every prompt carries a word target the grader can use", () => {
  for (const phase of ["return", "format", "build"] as const) {
    for (const prompt of promptsFor(phase)) {
      assert.ok(prompt.words >= 100, `${prompt.id} word target`);
      assert.ok(prompt.text.length > 40, `${prompt.id} text`);
    }
  }
});

check("the fixed week is 4 / 5 / 6 study days by load", () => {
  for (const phase of PHASES) {
    const light = studyDaysForWeek(phase, "light", 1);
    const normal = studyDaysForWeek(phase, "normal", 1);
    const full = studyDaysForWeek(phase, "full", 1);
    assert.equal(light, 4, `${phase.id} light`);
    assert.ok(normal >= light, `${phase.id}: normal must not shrink`);
    assert.ok(full >= normal, `${phase.id}: full must not shrink`);
    assert.ok(full <= 6, `${phase.id}: ${full} days is more than six`);
  }
});

check("ngày nghỉ là thứ Sáu, không phải Chủ nhật", () => {
  // Đảo lại so với bản trước: cuối tuần là hai ngày duy nhất người học có
  // nhiều thời gian, còn tối thứ Sáu sau một tuần làm việc là buổi ít khả thi
  // nhất. Bỏ trống cuối tuần đồng nghĩa đặt việc nặng vào đúng lúc không có giờ.
  for (const phase of PHASES) {
    for (const load of WEEK_LOADS) {
      for (const day of daysForWeek(phase, load, 1)) {
        assert.notEqual(day.day, 5, `${phase.id} ${load} ${WEEKDAY_SHORT[5]}`);
      }
    }
  }
});

check("every scheduled key names a real weekly slot", () => {
  for (const phase of PHASES) {
    const keys = new Set(phase.weekly.map((s) => s.key));
    for (const day of phase.schedule) {
      assert.ok(day.keys.length > 0, `${phase.id} day ${day.day} is empty`);
      for (const key of day.keys) {
        assert.ok(keys.has(key), `${phase.id}: no slot "${key}"`);
      }
    }
  }
});

check("every weekly slot is actually scheduled somewhere", () => {
  // A slot with no day would show as a target the learner is never told when
  // to do — exactly the failure this schedule exists to remove.
  for (const phase of PHASES) {
    const scheduled = new Set(phase.schedule.flatMap((d) => d.keys));
    for (const slot of phase.weekly) {
      assert.ok(
        scheduled.has(slot.key),
        `${phase.id}: ${slot.key} unscheduled`,
      );
    }
  }
});

check("a lighter week is a subset of a heavier one", () => {
  for (const phase of PHASES) {
    const light = daysForWeek(phase, "light", 1).map((d) => d.day);
    const full = daysForWeek(phase, "full", 1).map((d) => d.day);
    for (const day of light) {
      assert.ok(full.includes(day), `${phase.id}: day ${day} lost when full`);
    }
  }
});

check("the mock only lands on a mock week", () => {
  const build = phaseById("build");
  assert.equal(weeklyTargets(build, "full", 1).get("mock"), undefined);
  assert.equal(weeklyTargets(build, "full", 3).get("mock"), 1);
});

check("weekly minutes grow with the load, never shrink", () => {
  const phase = phaseById("return");
  const light = weeklyTargets(phase, "light", 1);
  const full = weeklyTargets(phase, "full", 1);
  for (const [slot, count] of light) {
    assert.ok((full.get(slot) ?? 0) >= count, `${slot} shrank when full`);
  }
});

check("một suất chỉ bị đòi khi ngày của nó đã tới", () => {
  const phase = phaseById("return");
  // Viết lại nằm ở T2 và T4; bài viết mới nằm ở T7 và CN.
  assert.equal(scheduledByWeekday(phase, "light", 1, 1, "rewrite"), 1);
  assert.equal(scheduledByWeekday(phase, "light", 1, 2, "rewrite"), 1);
  assert.equal(scheduledByWeekday(phase, "light", 1, 3, "rewrite"), 2);
  // Đầu tuần chưa đòi bài viết nào: nó là việc của cuối tuần.
  assert.equal(scheduledByWeekday(phase, "light", 1, 4, "writing"), 0);
  assert.equal(scheduledByWeekday(phase, "light", 1, 6, "writing"), 1);
  assert.equal(scheduledByWeekday(phase, "light", 1, 7, "writing"), 2);
});

check("weekdays and week starts are Monday-based", () => {
  assert.equal(weekdayOf("2026-09-08"), 2); // a Tuesday
  assert.equal(weekdayOf("2026-09-13"), 7); // the Sunday after
  assert.equal(mondayOf("2026-09-13"), "2026-09-07");
  assert.equal(mondayOf("2026-09-07"), "2026-09-07");
});

check("quỹ giờ tập trung không tính nghe thụ động", () => {
  const phase = phaseById("build");
  const passive =
    phase.daily.find((d) => d.key === "input-listen")?.minutes ?? 0;
  const desk = phase.daily.reduce((s, d) => s + d.minutes, 0) - passive;
  const days = studyDaysForWeek(phase, "normal", 1);
  assert.equal(
    guidedMinutesForWeek(phase, "normal", 1),
    weeklyMinutes(phase, "normal", 1) + desk * days,
  );
  // Nghe thụ động phải bị loại, nếu không quỹ giờ trông đủ trong khi thiếu.
  assert.ok(
    guidedMinutesForWeek(phase, "normal", 1) <
      weeklyMinutes(phase, "normal", 1) +
        phase.daily.reduce((s, d) => s + d.minutes, 0) * days,
  );
});

check("giờ kế hoạch còn lại giảm dần và tăng theo mức tải", () => {
  const week1 = plannedGuidedHours("return", 1, "normal");
  const later = plannedGuidedHours("build", 5, "normal");
  assert.ok(week1 > later, "còn lại phải giảm khi đi sâu vào lộ trình");
  assert.ok(
    plannedGuidedHours("return", 1, "full") > week1,
    "tuần rảnh phải cấp nhiều giờ hơn tuần thường",
  );
  // Bản 26 tuần ở mức thường phải vượt 150 giờ tập trung, nếu không thì chính
  // quyết định lùi thi + tăng giờ ở METHOD-REVIEW §3.3 đã không được thực hiện.
  assert.ok(week1 > 150, `chỉ có ${week1.toFixed(0)}h`);
});

check("không buổi tối ngày thường nào vượt quỹ 60 phút", () => {
  // Ràng buộc thật của người học: T2–T6 là buổi tối sau khi đi làm. Lịch v3
  // ban đầu có ngày lên tới 100 phút vì nó chưa bao giờ nhân với quỹ này.
  for (const phase of PHASES) {
    for (const load of WEEK_LOADS) {
      for (let w = 1; w <= phase.plannedWeeks; w++) {
        for (const day of [1, 2, 3, 4, 5] as const) {
          const desk = deskMinutesForDay(phase, load, w, day);
          assert.ok(
            desk <= WEEKDAY_DESK_CAP,
            `${phase.id} ${load} tuần ${w} ${WEEKDAY_SHORT[day]}: ${desk}' > ${WEEKDAY_DESK_CAP}'`,
          );
        }
      }
    }
  }
});

check("việc dài nằm ở cuối tuần, và thứ Sáu luôn nghỉ", () => {
  for (const phase of PHASES) {
    const days = daysForWeek(phase, "full", 1).map((d) => d.day);
    assert.ok(!days.includes(5), `${phase.id} xếp việc vào thứ Sáu`);
    assert.ok(
      days.includes(6) || days.includes(7),
      `${phase.id} không dùng cuối tuần`,
    );
  }
});

check("gia sư và mock không tính vào quỹ ngồi xuống", () => {
  assert.equal(isOutsideDesk("tutor"), true);
  assert.equal(isOutsideDesk("mock"), true);
  assert.equal(isOutsideDesk("writing"), false);
  assert.equal(isOutsideDesk("dictation"), false);
});

check("tuần có mock thì mock chiếm trọn ngày của nó", () => {
  const build = phaseById("build");
  const mockDay = daysForWeek(build, "full", 3).find((d) => d.day === 6);
  // Mock đã đo cả Listening và Reading, nên hai bài bấm giờ nhường chỗ.
  assert.deepEqual(mockDay?.keys, ["mock"]);
  const plain = daysForWeek(build, "full", 1).find((d) => d.day === 6);
  assert.ok(plain?.keys.includes("timed-listening"));
  assert.ok(!plain?.keys.includes("mock"));
});

console.log(`\n✓ Plan: ${passed}/${passed} checks passed`);
