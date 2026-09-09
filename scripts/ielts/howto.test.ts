import assert from "node:assert/strict";
import { FOUNDATION_RULES } from "../../src/lib/ielts/error-rules";
import {
  howToFor,
  RULE_STUDY_HINT,
  sourcesFor,
} from "../../src/lib/ielts/howto";
import { PHASES } from "../../src/lib/ielts/plan";

let passed = 0;
const check = (name: string, fn: () => void) => {
  fn();
  passed++;
  console.log(`  ✓ ${name}`);
};

check("mọi ô của mọi giai đoạn đều có hướng dẫn", () => {
  // Đây là bất biến quan trọng nhất của tệp này: thêm một ô mới vào lộ trình
  // mà quên viết hướng dẫn thì người học lại gặp đúng "làm 10 phút" mà không
  // biết làm gì.
  for (const phase of PHASES) {
    for (const target of phase.daily) {
      assert.ok(
        howToFor(target.key),
        `${phase.id}: ô hằng ngày "${target.key}" chưa có hướng dẫn`,
      );
    }
    for (const slot of phase.weekly) {
      assert.ok(
        howToFor(slot.slot),
        `${phase.id}: suất "${slot.slot}" chưa có hướng dẫn`,
      );
    }
  }
});

check("hướng dẫn nào cũng có ít nhất ba bước cụ thể", () => {
  for (const phase of PHASES) {
    for (const key of [
      ...phase.daily.map((d) => d.key),
      ...phase.weekly.map((s) => s.slot),
    ]) {
      const howTo = howToFor(key);
      if (!howTo || key === "input") continue;
      assert.ok(
        howTo.steps.length >= 3,
        `${key}: chỉ có ${howTo.steps.length} bước`,
      );
      for (const step of howTo.steps) {
        assert.ok(step.length > 20, `${key}: bước quá cụt — "${step}"`);
      }
    }
  }
});

check("nguồn nghe đổi theo giai đoạn", () => {
  // Giai đoạn 0 cần bài dễ; giai đoạn 2 cần bài giảng thật, không thể dùng chung.
  const early = sourcesFor("input-listen", "return").map((s) => s.label);
  const later = sourcesFor("input-listen", "build").map((s) => s.label);
  assert.ok(early.some((l) => l.includes("BBC 6 Minute")));
  assert.ok(later.some((l) => l.includes("TED")));
  assert.ok(!later.some((l) => l.includes("BBC 6 Minute")));
});

check("mọi nguồn đều là link thật", () => {
  for (const phase of PHASES) {
    for (const key of [
      ...phase.daily.map((d) => d.key),
      ...phase.weekly.map((s) => s.slot),
    ]) {
      for (const source of sourcesFor(key, phase.id)) {
        assert.match(source.url, /^https:\/\//, `${key}: ${source.url}`);
        assert.ok(source.label.length > 3, `${key}: nhãn quá cụt`);
      }
    }
  }
});

check("năm nhóm lỗi nền tảng đều trỏ được tới unit ngữ pháp", () => {
  // Mục tiêu giai đoạn 0 là triệt đúng năm nhóm này, nên ô drill phải nói được
  // mở cái gì ra đọc, không chỉ nói "mở sách ngữ pháp".
  for (const rule of FOUNDATION_RULES) {
    assert.ok(RULE_STUDY_HINT[rule], `nhóm "${rule}" chưa có chỗ tra`);
  }
});

check("các bước là văn bản thuần, không markdown", () => {
  // HowToBlock không parse markdown, nên "**đậm**" trong dữ liệu sẽ hiện ra
  // nguyên dấu sao trên trang.
  for (const phase of PHASES) {
    for (const key of [
      ...phase.daily.map((d) => d.key),
      ...phase.weekly.map((s) => s.slot),
    ]) {
      const howTo = howToFor(key);
      if (!howTo) continue;
      for (const text of [...howTo.steps, howTo.pitfall ?? ""]) {
        assert.ok(!text.includes("**"), `${key}: còn markdown — "${text}"`);
        assert.ok(!text.includes("`"), `${key}: còn backtick — "${text}"`);
      }
    }
  }
});

console.log(`\n✓ HowTo: ${passed}/${passed} checks passed`);
