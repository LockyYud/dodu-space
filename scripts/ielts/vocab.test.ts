import assert from "node:assert/strict";
import {
  appendContext,
  makeVocabCard,
  normalizeTerm,
} from "../../src/lib/ielts/vocab";

let passed = 0;
const check = (name: string, fn: () => void) => {
  fn();
  passed++;
  console.log(`  ✓ ${name}`);
};

check("thẻ dựng ở dạng điền chỗ trống trong chính câu đã gặp", () => {
  const card = makeVocabCard({
    term: "a growing body of evidence",
    context: "There is a growing body of evidence that sleep affects memory.",
    kind: "collocation",
  });
  assert.equal(card.front, "There is ____ that sleep affects memory.");
  assert.equal(card.back, "a growing body of evidence");
  assert.equal(card.explanation, null);
});

check("biến thể không khớp thì giữ nguyên câu, không vứt thẻ", () => {
  const card = makeVocabCard({
    term: "raise concerns",
    context: "The report raised concerns about air quality.",
    kind: "collocation",
  });
  assert.equal(card.front, "The report raised concerns about air quality.");
  assert.ok(card.explanation);
});

check("từ đứng một mình bị từ chối", () => {
  assert.throws(
    () => makeVocabCard({ term: "mitigate", context: "  ", kind: "vocab" }),
    /câu chứa cụm từ/i,
  );
  assert.throws(
    () => makeVocabCard({ term: " ", context: "something", kind: "vocab" }),
    /Chưa nhập/,
  );
});

check("khoá so trùng bỏ qua dấu câu, hoa thường và khoảng trắng", () => {
  assert.equal(normalizeTerm("  Raise   CONCERNS, "), "raise concerns");
  assert.equal(normalizeTerm("well-known"), "well-known");
  // Cùng một cụm bắt lại phải ra cùng khoá, nếu không sẽ sinh thẻ trùng.
  assert.equal(normalizeTerm("Mitigate."), normalizeTerm("mitigate"));
});

check("ngữ cảnh mới ghép thêm, không ghi đè và không lặp", () => {
  assert.equal(appendContext(null, "câu A"), "câu A");
  assert.equal(appendContext("câu A", "câu B"), "câu A\n---\ncâu B");
  assert.equal(appendContext("câu A", "câu A"), "câu A");
});

console.log(`\n✓ Vocab: ${passed}/${passed} checks passed`);
