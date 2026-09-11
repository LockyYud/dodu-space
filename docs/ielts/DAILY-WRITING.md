# Viết mỗi ngày — Thiết kế

> Trang con `/ielts/daily` của IELTS Tracker: mỗi ngày quay ngẫu nhiên một câu hỏi đời
> sống, viết ngắn, AI chấm, và cứ nửa chu kỳ thì viết lại chính những câu đã viết để đo
> tiến bộ. Đọc kèm [TECH-DESIGN.md](./TECH-DESIGN.md) (kỹ thuật nền) và
> [ROADMAP.md](./ROADMAP.md) (nội dung học). Bank câu hỏi tách riêng ở
> [DAILY-WRITING-PROMPTS.md](./DAILY-WRITING-PROMPTS.md). Ngày lập: 2026-09-10.

---

## 1. Vì sao tách khỏi `/ielts/writing`

`/ielts/writing` phục vụ **bài thi**: đề Task 1 / Task 2, 150–250 từ, canh giờ, chấm band
theo bốn tiêu chí. Nó nặng — đúng như nó cần nặng.

Cái đang thiếu là **thói quen viết hằng ngày**: 5–10 phút, 60–100 từ, không band, không áp
lực. Nhồi hai thứ này vào một trang thì mỗi lần mở trang lại phải quyết định "hôm nay viết
kiểu gì", và quyết định đó chính là thứ làm đứt chuỗi.

**Nguyên tắc:** không dựng pipeline mới. Trang này dùng lại `extractErrors()`, kho lỗi,
SRS, streak sẵn có. Phần code mới chỉ gồm ba thứ: **vòng quay + lượt quay**, **chu kỳ 2
tuần**, và **màn hình so sánh hai lần viết**.

| | `/ielts/writing` | `/ielts/daily` |
|---|---|---|
| Đề | Task 1 / Task 2 theo phase | Câu hỏi đời sống, quay ngẫu nhiên |
| Độ dài | 150–250 từ | 60–100 từ |
| Thời gian | 20–40 phút, canh giờ thi | 5–10 phút, đồng hồ chỉ để tham khảo |
| Chấm | `coach` hoặc `band` tuỳ phase | Luôn `coach` + bản viết lại mẫu |
| Nhịp | Theo lịch tuần trong roadmap | Mỗi ngày, một lượt |

Bài 80 từ mà gắn band 5.5 thì con số vô nghĩa và làm nản — nên trang này **không hiện band,
không bao giờ**.

---

## 2. Chọn chủ đề

### 2.1 Câu hỏi, không phải chủ đề

"Family" thì bí không biết viết gì. "Ai trong nhà bạn dậy sớm nhất, và họ làm gì đầu tiên?"
thì viết được ngay. Mọi mục trong bank đều là **một câu hỏi trả lời được**, ba tiêu chí lọc:

1. Trả lời được bằng chuyện **hôm qua hoặc hôm nay** — không phải nghĩ ra ý tưởng.
2. **Không cần kiến thức xã hội.** Loại hết dạng "ô nhiễm môi trường", "giáo dục nên…".
3. Kéo theo **từ vựng đời sống lặp lại nhiều** — đó là vốn từ thực sự thiếu.

### 2.2 Ba dạng câu, luân phiên trong mỗi cụm

| Dạng | Ví dụ | Vì sao có |
|---|---|---|
| **Kể** (`recall`) | *Tell me about the last time you were late for something.* | Quá khứ đơn, trình tự sự việc |
| **Tả** (`describe`) | *Describe the room you are sitting in right now.* | Hiện tại, tính từ, giới từ nơi chốn |
| **Ý kiến nhẹ** (`opinion`) | *Do you prefer cooking at home or eating out? Why?* | Cầu nối lên Task 2, tập nêu lý do |

### 2.3 12 cụm

`morning` · `food` · `commute` · `work` · `home` · `shopping` · `health` · `people` ·
`weekend` · `weather` · `tech` · `evening`

Mỗi cụm 8 câu → **96 câu**. Xem [DAILY-WRITING-PROMPTS.md](./DAILY-WRITING-PROMPTS.md).

---

## 3. Vòng quay và lượt quay

### 3.1 Random thật, chặn bằng lượt — không phải bằng kết quả định sẵn

Bấm quay → **server** chọn đề bằng `crypto.randomInt` → ghi kết quả và trừ lượt **trong
cùng một transaction**. Client nhận kết quả rồi mới tính góc dừng để animate tới đó.

Reload không quay lại được vì **lượt đã tiêu**, chứ không phải vì kết quả bị sắp trước. Đây
là điểm cố ý: nếu kết quả được tính sẵn theo ngày thì người xây app biết rõ nó không ngẫu
nhiên, và phần thú vị của việc quay biến mất.

> Hệ quả cần chấp nhận: quay xong mà đóng tab thì đề đó vẫn là đề của hôm nay. Đúng như
> mong muốn — lượt quay là cam kết, không phải xem trước.

### 3.2 Ba loại lượt

| Loại | Khi nào | Số lần | Tính streak |
|---|---|---|---|
| **Quay hôm nay** | Mở trang, chưa quay | 1 | ✅ |
| **Bỏ qua đề này** | Quay rồi nhưng bí | 1 lần/ngày, **không có đề thay thế** | ❌ |
| **Quay tự do** | Sau khi đã nộp bài chính thức | không giới hạn | ❌ |

- **Lượt không cộng dồn.** Dồn được thì thành quay hàng loạt để chọn đề dễ.
- **"Bỏ qua" phải trả giá.** Có đường thoát nhưng mất luôn ngày hôm đó, nếu không thì nó
  chính là lượt quay thứ hai trá hình. Đề bị bỏ qua **quay lại pool**.
- **Quay tự do** vẫn chấm và vẫn lưu vào kho lỗi, chỉ không đụng streak và không đẩy tiến
  độ chu kỳ. Đây là chỗ xả cho hôm nào muốn viết thêm.

### 3.3 Vòng quay hiển thị gì

Quay **12 cụm**, không quay 96 câu — 96 lát cắt thì không đọc được chữ nào. Hai nhịp:
bánh xe dừng ở một cụm → câu hỏi trong cụm đó hiện ra bên dưới.

- Cụm **không nằm trong chu kỳ hiện tại** làm mờ và không thể dừng vào. Nhìn thấy được
  rằng vòng quay có luật, chứ không phải random mù.
- `framer-motion`, `rotate` 0 → `1440 + góc đích`, `duration 2.6s`,
  easing `[0.16, 1, 0.3, 1]` — vọt nhanh rồi trôi chậm về đích. Ease-out tuyến tính trông giả.
- Câu hỏi hiện **sau khi bánh xe dừng ~200ms**, fade + trượt lên. Khoảng lặng ngắn đó là
  phần đắt nhất của hiệu ứng.
- `prefers-reduced-motion` → bỏ animation, hiện thẳng đề.
- Có đề rồi thì bánh xe **thu lại thành một chip** (`layoutId`), nhường màn hình cho ô viết.

> **Cần chốt:** bánh xe tròn hay reel trượt ngang kiểu máy slot. Reel hiển thị chữ tiếng
> Việt dễ hơn hẳn (chữ nằm ngang, không xoay theo lát cắt) và gọn hơn trên mobile; bánh xe
> thì "đã" hơn. Mặc định trong bản này: **bánh xe**, đổi được vì logic không phụ thuộc.

---

## 4. Chu kỳ 2 tuần

### 4.1 Cấu trúc

Một chu kỳ = **14 bài**, bật **3 cụm** (24 câu), chia đôi:

| Bài | Nửa | Pool để quay |
|---|---|---|
| 1–7 | `fresh` — tuần mới | 24 câu của 3 cụm đang bật, không lặp |
| 8–14 | `rewrite` — tuần viết lại | Đúng 7 câu đã quay ở nửa đầu, mỗi câu một lần |

Nửa sau **vẫn quay ngẫu nhiên thật**, chỉ là quay trong 7 câu của chính mình. Pool teo dần
nên cả 7 câu đều được viết lại, nhưng thứ tự thì không đoán được.

12 cụm ÷ 3 = **4 chu kỳ ≈ 8 tuần** thì quay lại cụm cũ, và khi đó bốc câu khác trong cụm.
Thứ tự cụm của mỗi chu kỳ cũng bốc ngẫu nhiên trong số cụm chưa dùng của vòng 8 tuần.

### 4.2 Chu kỳ đếm theo số bài đã viết, không theo ngày lịch

Nghỉ 3 ngày thì tuần viết lại **vẫn có đủ 7 câu** để lặp. Nếu đếm theo lịch, một tuần bận
là nửa chu kỳ đó hỏng và không so sánh được gì.

`cycleIndex` của một lượt quay = số bài đã **viết xong** trong chu kỳ. Lượt bị bỏ qua hoặc
quay rồi không viết thì không làm tăng chỉ số này.

### 4.3 Ở tuần viết lại, giấu bản cũ trước khi viết

Hiện đề, **không** hiện bài lần 1. Viết xong, chấm xong mới mở hai cột cạnh nhau. Cho xem
trước thì thành chép lại và không đo được gì cả.

---

## 5. Chấm và so sánh

### 5.1 Chấm

Dùng lại `extractErrors()` trong [`src/lib/ielts/extract.ts`](../../src/lib/ielts/extract.ts)
— pass bắt lỗi, không chạy pass band. Thêm một lời gọi LLM ngắn trả về:

```json
{
  "strength": "một điều đã làm được, tiếng Việt",
  "rewrite": "toàn bộ đoạn viết lại tự nhiên, giữ đúng ý người viết",
  "phrases": [{ "instead_of": "...", "say": "...", "note": "..." }]
}
```

`rewrite` là thứ dạy nhiều nhất ở bài ngắn và là thứ workbench hiện chưa có. `phrases` tối
đa 3, đổ thẳng vào SRS qua đường thẻ từ vựng sẵn có.

Chỉ số duy nhất hiện ra: **lỗi/100 từ** (`errorDensity`, đã có sẵn), kèm mũi tên so với
trung bình 7 ngày.

### 5.2 Màn hình so sánh (chỉ ở nửa `rewrite`)

```
  Lần 1 · 27/08              Lần 2 · 10/09
  ─────────────              ─────────────
  6.2 lỗi/100 từ      →      3.1 lỗi/100 từ   ▼ 50%
  82 từ                      104 từ

  Lỗi đã hết:  ▪ article trước danh từ đếm được
               ▪ thì quá khứ của động từ bất quy tắc
  Vẫn còn:     ▪ giới từ đi với "depend"
```

Dòng **"vẫn còn"** là dòng có giá trị nhất — nó chỉ thẳng cái cần mang vào chu kỳ sau. Dữ
liệu đã có: so tập `rule` của hai lần trích lỗi, không cần gọi LLM.

---

## 6. Giao diện

Một cột, một màn hình, không tab, không sidebar. Bốn trạng thái nối tiếp nhau **trên cùng
một trang** — không điều hướng đi đâu giữa chừng.

```
┌─────────────────────────────────────────┐
│  Viết mỗi ngày        🔥 12 ngày         │
│  ▪▪▫▪▪▪▪▫▪▪▪▪▪▪▪▪▫▪▪▪▪▪▪▪▪▪▪   (30 ô)   │
│  Chu kỳ 3 · bài 9/14 · tuần viết lại     │
├─────────────────────────────────────────┤
│           ╭───────────╮                  │
│        Ăn uống │ Đi lại                  │  ① chưa quay
│      Nhà cửa ──┼── Công việc             │
│           ╰───────────╯                  │
│              [ QUAY ]                    │
├─────────────────────────────────────────┤
│  🍜 Ăn uống              [ Bỏ qua đề ]   │  ② có đề
│  What did you eat for breakfast          │
│  today, and who made it?                 │
│  Gợi ý: món gì · ăn ở đâu · có thích không│
├─────────────────────────────────────────┤
│  [ textarea lớn, không toolbar ]         │  ③ đang viết
│                    62 từ · 04:11  [Chấm] │
└─────────────────────────────────────────┘
        ④ kết quả nối tiếp bên dưới
```

Khối kết quả, theo thứ tự: **bản sửa inline** (block to nhất, chính câu của mình với phần
sửa highlight) → **một điểm được + một lỗi cần sửa** (đúng một, không liệt kê bảy lỗi) →
**2–3 cách nói tự nhiên hơn** + nút lưu thẻ → **ô lỗi/100 từ** → (nếu là bài viết lại)
**bảng so sánh §5.2**.

Ba quyết định giữ lại:

- **Heatmap 30 ô bấm được** → mở lại bài ngày đó. Đọc bài cũ của chính mình là động lực
  mạnh hơn con số streak.
- **Không hiện band.** Xem §1.
- **Đồng hồ không cưỡng chế.** Chạy để biết, hết 10 phút không khoá gì cả. Đây là trang
  thói quen, không phải trang luyện thi.

---

## 7. Dữ liệu

### 7.1 Bảng mới — `daily_spin`

Migration **0005** (lưu ý: `0004_lame_red_ghost` — week_load — vẫn **chưa chạy trên Turso**,
phải chạy trước).

```ts
export const dailySpin = sqliteTable("daily_spin", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  date: text("date").notNull().unique(),        // YYYY-MM-DD — unique = 1 lượt/ngày
  cycleId: integer("cycle_id").notNull(),
  // Ba cụm của chu kỳ, ngăn bằng dấu phẩy, lặp trên mọi hàng của cùng chu kỳ.
  cycleClusters: text("cycle_clusters").notNull(),
  cycleIndex: integer("cycle_index").notNull(), // 0..13, đếm theo bài đã viết
  half: text("half").$type<"fresh" | "rewrite">().notNull(),
  clusterId: text("cluster_id").notNull(),
  promptId: text("prompt_id").notNull(),
  // Chỉ ở half="rewrite": bài lần 1 để so sánh.
  rewriteOfSubmissionId: integer("rewrite_of_submission_id"),
  status: text("status").$type<"spun" | "written" | "skipped">()
    .notNull().default("spun"),
  submissionId: integer("submission_id"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});
```

`date` unique là chỗ ép "một lượt mỗi ngày" — ép ở tầng DB, không ở tầng UI.

Chu kỳ **không cần bảng riêng**. Bộ 3 cụm được chép vào `cycle_clusters` trên từng hàng —
thừa về mặt chuẩn hoá, nhưng suy ngược từ "những cụm đã xuất hiện ở chu kỳ này" thì hàng
**đầu tiên** của chu kỳ không suy ra nổi bộ cụm của chính nó, và đó lại đúng là lúc cần
biết. Chép ra rẻ hơn dựng thêm một bảng chỉ để giữ ba dòng cấu hình.

### 7.2 Dùng lại bảng sẵn có

- **`writing_submission`** — không đổi cấu trúc. `task_type` là cột `text` không có `CHECK`
  nên chỉ cần nới TS type thành `"task1" | "task2" | "free"`.
- **`study_session`** — mỗi bài ghi một dòng `skill="writing"` để vào streak và cửa sổ pace,
  với marker `sourceUrl = "ielts:daily"` (theo đúng lối `REVIEW_SESSION_MARKER` đang dùng).
- **`error_card`** — thẻ lỗi và thẻ cụm từ đi thẳng vào SRS hiện có, không có đường riêng.

### 7.3 Bank câu hỏi

`src/lib/ielts/daily-prompts.ts`, cùng dạng với
[`prompts.ts`](../../src/lib/ielts/prompts.ts) hiện tại:

```ts
export interface DailyPrompt {
  id: string;            // "food-01"
  cluster: ClusterId;
  form: "recall" | "describe" | "opinion";
  text: string;          // câu hỏi tiếng Anh
  hint: string;          // gợi ý tiếng Việt, 3 mảnh ngắn
  words: number;         // 60–100
}
```

---

## 8. Theo dõi

Đúng **ba** con số, không hơn:

| Chỉ số | Nguồn | Ý nghĩa |
|---|---|---|
| **Streak** | `computeStreak()` sẵn có | Thói quen có đứt không |
| **Lỗi/100 từ theo thời gian** | `writing_submission.errorDensity` | Có khá lên không |
| **Top 5 rule lỗi lặp lại** | `error_card` gộp theo `rule` | Nên học gì tiếp |

Chỉ số thứ 3 là chỉ số thực sự dùng để ra quyết định. Hai chỉ số đầu chỉ để không bỏ cuộc.

Đặt vào `/ielts/analytics` như một khối riêng, **không** dựng trang thống kê thứ hai.

---

## 9. Thứ tự build

Mỗi lát tự chạy được, dừng ở đâu cũng dùng được.

```
✅ d1  Bank 96 câu + 12 cụm + trang /ielts/daily quay được, viết được, chấm coach
✅ d2  daily_spin + lượt quay ép ở DB + "bỏ qua" + ghi study_session (streak chạy)
✅ d3  Bản viết lại mẫu + cụm từ gợi ý → lưu vào SRS
✅ d4  Chu kỳ 2 tuần: 3 cụm/chu kỳ, nửa fresh / nửa rewrite
✅ d5  Màn hình so sánh hai lần viết + khối thống kê trong /ielts/analytics
✅ d6  Quay tự do sau khi đã nộp bài chính thức
```

**Đã code (2026-09-10).** Luật chu kỳ nằm ở `src/lib/ielts/daily.ts`, thuần và có
`scripts/ielts/daily.test.ts` phủ; bank ở `daily-prompts.ts`; chấm ở `daily-coach.ts`;
server action ở `src/server/ielts/daily.ts`; UI ở `daily-writer.tsx` + `spin-wheel.tsx`.

d1 đã là một trang dùng được hằng ngày. Chu kỳ (d4) chỉ có ý nghĩa sau khi đã có ~7 bài,
nên không việc gì phải làm sớm.

---

## 10. Còn phải chốt

1. **Bánh xe tròn hay reel trượt ngang** (§3.3). Ảnh hưởng UI, không ảnh hưởng logic.
2. **Chu kỳ 14 bài có phải con số đúng không.** 7 bài mới rồi 7 bài viết lại là giả định;
   nếu thấy viết lại nhàm thì đổi thành 10 mới + 4 viết lại, cấu trúc không phải sửa.
3. **Bài viết lại có nên nhận đúng đề cũ nguyên văn không**, hay đổi một chi tiết
   ("...last week" → "...last month") để không thành chép lại từ trí nhớ.
4. **Model chấm.** Prod đang dùng `nex-agi/nex-n2.5-mini:free`; bài 80 từ thì rẻ, nhưng
   phần `rewrite` cần chất lượng hơn phần bắt lỗi — có thể cần tách model như
   `LLM_GRADER_MODEL` đang làm.
