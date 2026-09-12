import type { ErrorRule } from "./error-rules";
import type { PhaseId, SlotId } from "./plan";

/**
 * "Làm thế nào" cho từng ô trong ngày.
 *
 * Lộ trình v3 nói *làm gì* và *bao lâu*, rồi dừng ở đó. Người học mở trang lên
 * thấy "Drill ngữ pháp ~10 phút" và không có bài tập nào, không có nguồn nào,
 * chỉ có một nút "Đã làm" — tức app là sổ ghi chép chứ không phải hướng dẫn.
 *
 * Mỗi ô ở đây phải trả lời được hai câu: các bước cụ thể trong mấy phút đó,
 * và lấy vật liệu ở đâu. Nguồn trước nằm trong ROADMAP §8, tức nằm ngoài
 * app, tức không tồn tại với người đang học.
 *
 * Thuần dữ liệu. Test khẳng định không ô nào của bất kỳ giai đoạn nào bị thiếu.
 */

export interface HowToSource {
  label: string;
  url: string;
  /** Chỉ hiện ở các giai đoạn này. Bỏ trống là mọi giai đoạn. */
  phases?: PhaseId[];
}

export interface HowTo {
  /** Các bước, đúng thứ tự, đủ cụ thể để làm ngay mà không phải hỏi thêm. */
  steps: string[];
  sources?: HowToSource[];
  /** Câu nhắc cái bẫy hay gặp nhất của ô này. */
  pitfall?: string;
}

/** Khoá: `DailyTarget.key` hoặc `SlotId`. */
export type HowToKey =
  | "input-listen"
  | "input-read"
  | "vocab"
  | "srs"
  | "speak-drill"
  | SlotId;

const HOW_TO: Record<HowToKey, HowTo> = {
  "input-listen": {
    steps: [
      "Mở một tập podcast tầm 6–15 phút, chủ đề nào cũng được miễn là bạn thấy hiểu được khoảng 70–80%.",
      "Nghe lần một, không dừng, không transcript. Chỉ cần nắm ý chính.",
      "Nghe lần hai, dừng ở 2–3 chỗ bạn thấy trôi mất, nghe lại đúng chỗ đó.",
      "Xong thì bấm ghi số phút. Không cần chấm, không cần ghi chú.",
    ],
    sources: [
      {
        label: "BBC 6 Minute English",
        url: "https://www.bbc.co.uk/learningenglish/english/features/6-minute-english",
        phases: ["return", "format"],
      },
      {
        label: "BBC Learning English — Lingohack",
        url: "https://www.bbc.co.uk/learningenglish/english/features/lingohack",
        phases: ["return", "format"],
      },
      {
        label: "TED Talks",
        url: "https://www.ted.com/talks",
        phases: ["build", "taper"],
      },
    ],
    pitfall:
      "Đừng chọn bài quá khó. Nghe mà hiểu dưới 50% thì đó là bài tập giải mã, không phải bài tập tiếp nhận.",
  },

  "input-read": {
    steps: [
      "Chọn một bài báo 400–700 từ, chủ đề bạn vốn thích đọc bằng tiếng Việt.",
      "Đọc một lượt liền mạch, không tra từ. Gặp từ lạ thì đoán rồi đi tiếp.",
      "Đọc lượt hai, lần này gạch chân 3–5 cụm từ nghe hay hoặc lạ — cụm, không phải từ đơn.",
      "Chuyển sang ô Bắt từ mới ngay bên dưới để lưu chúng.",
    ],
    sources: [
      {
        label: "BBC News",
        url: "https://www.bbc.com/news",
        phases: ["return", "format"],
      },
      {
        label: "The Guardian",
        url: "https://www.theguardian.com/international",
        phases: ["build", "taper"],
      },
      {
        label: "Aeon — bài dài, giọng học thuật",
        url: "https://aeon.co/essays",
        phases: ["build", "taper"],
      },
    ],
    pitfall:
      "Tra từng từ lạ là cách chắc chắn nhất để 10 phút thành 40 phút và rồi bỏ hẳn.",
  },

  vocab: {
    steps: [
      "Lấy 3–5 cụm đã gạch chân ở bài vừa đọc.",
      "Chọn cụm nào bạn hiểu nghĩa nhưng sẽ không tự viết ra được — đó mới là cụm đáng học.",
      "Dán cả danh sách vào ô, mỗi dòng một cụm, rồi bấm Tra và dựng thẻ. App tự lo nghĩa, câu ví dụ và các cụm hay đi cùng.",
      "Xem lại kết quả, bỏ tick cụm nào không đáng học, rồi lưu.",
      "Muốn câu ví dụ lấy từ chính bài bạn đọc thay vì câu máy sinh thì dán thêm đoạn văn vào ô tuỳ chọn.",
    ],
    sources: [
      {
        label: "Academic Word List — tra xem cụm có thuộc vốn học thuật không",
        url: "https://www.wgtn.ac.nz/lals/resources/academicwordlist",
      },
    ],
    pitfall:
      "Từ đơn dịch được bằng một từ Việt thì bỏ qua. Ưu tiên collocation và cụm động từ.",
  },

  srs: {
    steps: [
      "Bấm Ôn lỗi, làm hết số thẻ đến hạn — thường 5–15 thẻ.",
      "Với mỗi thẻ: tự viết ra câu đúng trước, rồi mới mở đáp án. Nhìn đáp án trước là mất toàn bộ tác dụng.",
      "Chấm thật: sai thì bấm 'Lại', đừng bấm 'Được' cho xong.",
      "Hết thẻ là xong. Không cần ôn thêm.",
    ],
    pitfall:
      "Ôn lỗi phải làm đầu buổi. Để cuối thì nó luôn là thứ bị cắt khi hết giờ.",
  },

  "speak-drill": {
    steps: [
      "Chọn một đề Speaking Part 2 và ghi 3 gạch đầu dòng trong 1 phút.",
      "Bấm ghi âm, nói 4 phút về đề đó. Đừng dừng để sửa, cứ nói tiếp.",
      "Nói lại cùng nội dung trong 3 phút. Rồi lần ba, 2 phút.",
      "Nghe lại đúng lượt ba. Ghi vào app: lượt ba có gọn trong 2 phút hay không.",
    ],
    sources: [
      {
        label: "Ngân hàng đề Speaking Part 2 — IELTS Liz",
        url: "https://ieltsliz.com/ielts-speaking-part-2-topics/",
      },
    ],
    pitfall:
      "Ba lượt phải cùng một nội dung. Đổi đề mỗi lượt thì đây thành ba bài nói rời, mất hẳn tác dụng lên độ trôi chảy.",
  },

  grammar: {
    steps: [
      "Mở Kho lỗi, lọc theo nhóm lỗi bạn lặp nhiều nhất (link ở dưới trỏ sẵn tới đó).",
      "Đọc 3–5 câu bạn từng sai trong nhóm đó. Che phần sửa lại.",
      "Tự viết lại từng câu cho đúng vào giấy hoặc notes, rồi so với phần sửa.",
      "Câu nào vẫn sai thì mở đúng unit ngữ pháp tương ứng, đọc 5 phút, viết thêm 2 câu mới của chính bạn dùng cấu trúc đó.",
    ],
    sources: [
      {
        label: "English Grammar in Use (Murphy) — tra unit theo nhóm lỗi",
        url: "https://www.cambridge.org/gb/cambridgeenglish/catalog/grammar-vocabulary-and-pronunciation/english-grammar-use-5th-edition",
      },
      {
        label: "Perfect English Grammar — bài tập miễn phí theo chủ điểm",
        url: "https://www.perfect-english-grammar.com/grammar-exercises.html",
      },
    ],
    pitfall:
      "Drill không phải đọc lý thuyết. Không tự viết ra câu thì không tính là drill.",
  },

  writing: {
    steps: [
      "Đọc đề, gạch 2 ý cho mỗi bên trong 3 phút. Chưa viết câu nào.",
      "Viết liền mạch cho hết thời lượng của ô. Không sửa giữa đường, không tra từ.",
      "Bấm chấm bài và đợi kết quả — đừng đọc lại bài trong lúc chờ.",
      "Đọc feedback, chọn tối đa 5 nhóm lỗi để lưu thẻ. Chỉ đọc — không sửa hôm nay.",
    ],
    pitfall:
      "Sửa bài ngay sau khi nhận feedback là chép lại, không phải học. Bản viết lại là việc của hôm sau.",
  },

  rewrite: {
    steps: [
      "Mở bài đã chấm hôm trước và danh sách nhóm lỗi đã chọn.",
      "Viết lại toàn bộ bài, không sửa vá từng câu.",
      "Vừa viết vừa để ý đúng những nhóm lỗi đó, đừng cố sửa mọi thứ cùng lúc.",
      "Bấm chấm lại và xem mật độ lỗi có xuống không. Đó là con số duy nhất đáng theo ở giai đoạn này.",
    ],
    pitfall:
      "Viết lại cùng ngày với bài gốc thì bạn chỉ đang nhớ câu, chưa nhớ luật.",
  },

  dictation: {
    steps: [
      "Chọn một đoạn 60–90 giây, có transcript.",
      "Nghe từng câu, dừng, chép nguyên văn. Được nghe lại một câu tối đa 3 lần.",
      "Mở transcript, so từng chữ. Đếm số chỗ sai và tổng số từ.",
      "Nhập hai con số đó vào app. Liệt kê chỗ nghe sai theo dạng 'nghe thành → đúng là' để nó thành thẻ ôn.",
    ],
    sources: [
      {
        label: "Listen & Write — chép chính tả có transcript",
        url: "https://www.listen-and-write.com/",
      },
      {
        label: "BBC Learning English — có transcript đầy đủ",
        url: "https://www.bbc.co.uk/learningenglish",
      },
    ],
    pitfall:
      "Chỗ sai hầu hết là âm nối, dạng yếu và đuôi -s/-ed. Đó là dữ liệu, không phải chuyện bất cẩn.",
  },

  "timed-listening": {
    steps: [
      "Bấm giờ đúng thời lượng thi cho một section. Không dừng, không nghe lại.",
      "Chấm điểm. Ghi số đúng vào app.",
      "Với mỗi câu sai, mở transcript và viết một dòng: vì sao sai — nghe không ra, hay hiểu sai câu hỏi.",
      "Nghe lại đúng những đoạn đó, lần này có transcript.",
    ],
    sources: [
      {
        label: "Mini-IELTS — đề lẻ, có đáp án",
        url: "https://mini-ielts.com/",
      },
      { label: "IELTS Online Tests", url: "https://ieltsonlinetests.com/" },
    ],
    pitfall:
      "Bỏ bước 'vì sao sai' thì bài bấm giờ chỉ còn là một con số, không dạy được gì.",
  },

  "timed-reading": {
    steps: [
      "Bấm giờ đúng thời lượng thi cho một passage. Không tra từ giữa bài.",
      "Chấm điểm. Ghi số đúng vào app.",
      "Với mỗi câu sai, tìm lại đúng câu trong bài chứa đáp án và viết một dòng vì sao mình chọn sai.",
      "Nếu hết giờ mà chưa xong: lần sau phân bổ lại thời gian, đừng đọc kỹ hơn.",
    ],
    sources: [
      {
        label: "Mini-IELTS — đề lẻ, có đáp án",
        url: "https://mini-ielts.com/",
      },
      {
        label: "IELTS Liz — lý thuyết từng dạng câu hỏi",
        url: "https://ieltsliz.com/ielts-reading/",
      },
    ],
    pitfall:
      "Reading 7.5 phần lớn là bài toán tốc độ. Đọc chậm mà đúng vẫn là chưa đạt.",
  },

  mock: {
    steps: [
      "Chọn một khung 3 giờ liền, tắt điện thoại. Làm Listening rồi Reading liên tiếp, đúng thời lượng thi.",
      "Chấm cả hai, quy ra band theo bảng điểm của bộ đề.",
      "Nhập cả hai band vào app — mock không có band thì không tính.",
      "Chỉ soát lỗi vào hôm sau, đừng soát ngay khi vừa xong.",
    ],
    sources: [
      {
        label: "Cambridge IELTS 15–19 — đề full test",
        url: "https://www.cambridge.org/gb/cambridgeenglish/catalog/cambridge-english-exams-ielts",
      },
    ],
    pitfall: "Mock để đo sức bền. Nghỉ giữa hai kỹ năng là tự làm sai phép đo.",
  },

  input: {
    steps: ["Ô này gộp phần Nghe và Đọc hằng ngày — xem hướng dẫn ở từng ô."],
  },
};

export function howToFor(key: HowToKey): HowTo | null {
  return HOW_TO[key] ?? null;
}

/** Nguồn phù hợp với giai đoạn đang học. */
export function sourcesFor(key: HowToKey, phase: PhaseId): HowToSource[] {
  const entry = HOW_TO[key];
  if (!entry?.sources) return [];
  return entry.sources.filter((s) => !s.phases || s.phases.includes(phase));
}

/**
 * Unit ngữ pháp cần mở cho từng nhóm lỗi, để ô drill trỏ đúng chỗ thay vì nói
 * chung chung "mở sách ngữ pháp".
 */
export const RULE_STUDY_HINT: Partial<Record<ErrorRule, string>> = {
  "plural-s": "Murphy Unit 68–70 (đếm được / không đếm được, số nhiều)",
  sva: "Murphy Unit 79–80 (hoà hợp chủ ngữ - động từ)",
  "tense-consistency": "Murphy Unit 1–20 (hệ thống thì)",
  "tense-choice": "Murphy Unit 5–14 (hiện tại hoàn thành vs quá khứ đơn)",
  article: "Murphy Unit 72–78 (a/an, the, không mạo từ)",
  "prep-time": "Murphy Unit 118–121 (giới từ thời gian)",
  "prep-place": "Murphy Unit 122–125 (giới từ nơi chốn)",
  "prep-verb": "Murphy Unit 129–136 (động từ + giới từ)",
  "word-form": "Murphy Unit 98–100 (tính từ và trạng từ)",
  "adverb-position": "Murphy Unit 110–112 (vị trí trạng từ)",
  "run-on": "Murphy Unit 113–117 (liên từ và câu ghép)",
  fragment: "Murphy Unit 113–117 (thành phần bắt buộc của câu)",
  countable: "Murphy Unit 68–71 (đếm được / không đếm được)",
  punctuation: "Cambridge Write & Improve — dấu câu trong văn học thuật",
};
