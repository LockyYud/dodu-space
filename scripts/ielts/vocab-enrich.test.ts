import assert from "node:assert/strict";
import {
  backOf,
  MAX_TERMS_PER_LOOKUP,
  parseEnrichment,
  parseTermList,
  sentenceContaining,
} from "../../src/lib/ielts/vocab-enrich";

let passed = 0;
const check = (name: string, fn: () => void) => {
  fn();
  passed++;
  console.log(`  ✓ ${name}`);
};

check("danh sách nhận cả xuống dòng, dấu phẩy và gạch đầu dòng", () => {
  assert.deepEqual(
    parseTermList("- mitigate\n* raise concerns, a growing body"),
    ["mitigate", "raise concerns", "a growing body"],
  );
  assert.deepEqual(parseTermList("1. mitigate\n2) mitigate"), ["mitigate"]);
  assert.deepEqual(parseTermList("   \n  "), []);
});

check("câu ví dụ lấy từ bài đọc khi tìm được", () => {
  const passage =
    "Cities are growing fast. There is a growing body of evidence that green space improves health. Nobody disputes this.";
  assert.equal(
    sentenceContaining(passage, "a growing body of evidence"),
    "There is a growing body of evidence that green space improves health.",
  );
});

check("biến thể vẫn bắt được qua từ đầu của cụm", () => {
  const passage = "The report raised concerns about air quality.";
  // Người học ghi nguyên thể "raise concerns", bài viết dùng "raised".
  assert.equal(
    sentenceContaining(passage, "raise concerns"),
    "The report raised concerns about air quality.",
  );
});

check("không tìm được thì trả null để dùng câu model sinh", () => {
  assert.equal(sentenceContaining("Something unrelated.", "mitigate"), null);
  // Từ đầu quá ngắn thì không đoán mò, tránh khớp bừa.
  assert.equal(sentenceContaining("The cat sat.", "at odds with"), null);
});

check("parse ưu tiên câu trong bài đọc hơn câu model sinh", () => {
  const passage = "There is a growing body of evidence that sleep matters.";
  const raw = JSON.stringify({
    terms: [
      {
        term: "a growing body of evidence",
        kind: "collocation",
        meaning: "ngày càng nhiều bằng chứng",
        example: "A generated sentence that should lose.",
        collocations: ["mounting evidence", "compelling evidence"],
      },
    ],
  });
  const [entry] = parseEnrichment(raw, ["a growing body of evidence"], passage);
  assert.equal(entry.example, passage);
  assert.equal(entry.fromPassage, true);
  assert.equal(entry.collocations.length, 2);
});

check("không có đoạn văn thì dùng câu model sinh", () => {
  const raw = JSON.stringify({
    terms: [
      {
        term: "mitigate",
        kind: "vocab",
        meaning: "làm giảm nhẹ",
        example: "Governments must mitigate the effects of rising sea levels.",
        collocations: [],
      },
    ],
  });
  const [entry] = parseEnrichment(raw, ["mitigate"]);
  assert.equal(entry.fromPassage, false);
  assert.match(entry.example, /mitigate/);
});

check("kết quả hỏng thì báo lỗi, không dựng thẻ rỗng", () => {
  assert.throws(() => parseEnrichment("không phải JSON", ["x"]), /tra cứu/i);
  assert.throws(() => parseEnrichment('{"ok":true}', ["x"]), /danh sách/i);
});

check("model không nhận ra cụm thì giữ nguyên cụm và mang ghi chú", () => {
  const raw = JSON.stringify({
    terms: [{ note: "Không nhận ra cụm này.", kind: "vocab" }],
  });
  const [entry] = parseEnrichment(raw, ["asdfgh"]);
  assert.equal(entry.term, "asdfgh");
  assert.ok(entry.note);
});

check("mặt sau gộp nghĩa và các cụm hay đi cùng", () => {
  assert.equal(
    backOf({
      term: "mitigate",
      kind: "vocab",
      meaning: "làm giảm nhẹ",
      example: "x",
      fromPassage: false,
      collocations: ["mitigate the impact", "mitigate risks"],
    }),
    "làm giảm nhẹ · Hay đi với: mitigate the impact, mitigate risks",
  );
});

check("một lần tra có trần số cụm", () => {
  assert.ok(MAX_TERMS_PER_LOOKUP > 0 && MAX_TERMS_PER_LOOKUP <= 20);
});

console.log(`\n✓ VocabEnrich: ${passed}/${passed} checks passed`);
