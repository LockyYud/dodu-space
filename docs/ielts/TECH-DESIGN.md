# IELTS Tracker — Thiết kế kỹ thuật MVP

> Bản thiết kế kỹ thuật cho tính năng IELTS tracker, triển khai như một khu vực trong
> `dodu-space` (Next.js 16). Đọc kèm [ROADMAP.md](./ROADMAP.md) — roadmap là "nội dung",
> tài liệu này là "kỹ thuật". Ngày lập: 2026-07-19. Chưa code — đây là bản để chốt trước.

---

## 1. Phạm vi & nguyên tắc

- **Single-user, self-host.** Chỉ Duy dùng → **không cần auth/multi-user** ở MVP.
- **MVP v1 = lõi giá trị:** Writing chấm bằng AI → error log → SRS. Đây là thứ không app nào có.
- **Không xây lại cái web ngoài đã làm tốt** (đề Reading/Listening) → chỉ link + trace.
- **Tận dụng stack sẵn có** của `dodu-space`: Next.js 16 App Router, Tailwind v4, shadcn,
  framer-motion. Không thêm thư viện lạ nếu không cần.

**Thứ tự build (mỗi slice tự chạy được) — ĐÃ HOÀN THÀNH:**
```
✅ v1  Writing AI chấm → error card → SRS review        (writing/review/errors)
✅ v2  Dashboard + tiến độ: streak, band theo thời gian, phase   (progress + dashboard)
✅ v3  Trace Reading/Listening bằng screenshot + AI vision       (track)
✅ v4  Speaking tracking + lịch hôm nay theo roadmap             (speaking + today)
✅ v5  Auth cho toàn khu /ielts + hồ sơ học chỉnh trong app      (login + settings)
✅ v6  Lịch sử theo bài, hành trình, analytics                   (history + journey + analytics)
✅ v7  Lộ trình v2: hàng đợi 5+1, pace, baseline/mock, viết lại  (plan + pace)
```

**Route hiện có:** `/ielts` (redirect sang today) · `today` · `writing` · `review` ·
`errors` · `progress` · `track` · `speaking` · `history` (+ `history/[lessonId]`) ·
`journey` (redirect sang history) · `analytics` · `settings` · `login`.

---

## 2. Quyết định lớn nhất: lưu trữ ở đâu

Hiện `dodu-space` **chưa có DB** (content file-based, deploy hướng Vercel). Tính năng này
cần dữ liệu động (error card, SRS state, band history) → cần một DB thật.

**Đề xuất: libSQL (SQLite) + Drizzle ORM.** Lý do:

| Tiêu chí | libSQL + Drizzle |
|---|---|
| Self-host local | File `file:./ielts.db` — zero infra, dữ liệu nằm ngay máy bạn |
| Nếu sau deploy Vercel | Đổi connection string sang **Turso** (libSQL hosted, free tier) — **SQL y hệt**, không viết lại |
| Type-safe | Drizzle sinh type TS từ schema → khớp phong cách repo (đang dùng TS strict) |
| Nhẹ | Không cần Postgres/container cho 1 người dùng |

> **Vì sao không dùng chính:** better-sqlite3 (file thuần) sẽ **không persist trên Vercel serverless**
> (FS ephemeral). libSQL tránh được bẫy đó mà vẫn chạy file local — chọn 1 lần, không phải migrate.

**Thay thế cân nhắc (nếu muốn đơn giản hơn nữa cho v1):** IndexedDB (Dexie) client-side —
zero backend, nhưng dữ liệu SRS quý mà kẹt 1 trình duyệt, khó backup. **Không khuyên** cho dữ liệu
cần bền như error log. → Đi thẳng libSQL.

---

## 3. Kiến trúc

```
dodu-space/
├── src/app/ielts/                 # UI (App Router)
│   ├── page.tsx                   # Dashboard (v2)
│   ├── today/page.tsx             # Kế hoạch hôm nay theo roadmap (v4)
│   ├── writing/page.tsx           # Nộp bài → xem chấm → xem card sinh ra (v1)
│   ├── review/page.tsx            # Phiên SRS (flashcard) (v1)
│   ├── errors/page.tsx            # Duyệt/quản lý error card, "lỗi cứng đầu" (v1)
│   └── progress/page.tsx          # Biểu đồ band + log session (v2)
├── src/app/api/ielts/
│   ├── grade-writing/route.ts     # Claude chấm essay → bands + feedback + card gợi ý (v1)
│   └── parse-screenshot/route.ts  # Claude vision đọc ảnh kết quả L/R (v3)
├── src/server/ielts/              # Server Actions (CRUD, mutations)
│   ├── cards.ts  reviews.ts  sessions.ts  submissions.ts  bands.ts
├── src/lib/ielts/
│   ├── db.ts                      # libSQL client + Drizzle
│   ├── schema.ts                  # Drizzle schema (mục 4)
│   ├── srs.ts                     # Thuật toán SM-2 (mục 5)
│   ├── plan.ts                    # Hàng đợi bài của lộ trình v2 (mục 9)
│   ├── pace.ts                    # Pace + chế độ hạ tải (mục 9), thuần, có test
│   ├── bands.ts                   # overallOf() dùng chung cho band_history
│   ├── profile.ts                 # Hồ sơ học (DB thắng, .env chỉ là seed)
│   ├── insights.ts                # Coach: gap band, lỗi cứng đầu, baseline
│   └── grading.ts                 # Prompt + gọi LLM (mục 6)
└── docs/ielts/                    # ROADMAP.md, TECH-DESIGN.md (tài liệu này)
```

**Nguyên tắc:** dùng **Server Actions** cho CRUD (gọn hơn API route trong Next 16), chỉ dùng
**Route Handlers** cho phần gọi AI (giữ API key server-side, có thể stream).

---

## 4. Data model (Drizzle / SQLite)

Bảng chính (mô tả logic, tên cột dạng snake tuỳ chỉnh khi code):

**`study_session`** — mỗi hoạt động học đã hoàn thành
```
id · date · skill (reading|listening|writing|speaking|vocab)
phase · week · duration_min · source_url (nullable) · status
raw_score (vd "32/40", nullable) · band_estimate (nullable)
screenshot_ref (nullable) · notes · created_at
```

**`writing_submission`** — riêng cho Writing (nối 1-1 với session)
```
id · session_id · task_type (task1|task2) · topic · prompt
essay_text · word_count
band_ta · band_cc · band_lr · band_gra · band_overall   -- 4 tiêu chí + tổng
feedback_json    -- nhận xét chi tiết theo tiêu chí (JSON)
is_rewrite (bool) · parent_submission_id (nullable)      -- cho vòng "viết lại"
created_at
```

**`error_card`** — đơn vị SRS (lõi của app)
```
id · source_type (writing|reading|listening|speaking)
source_ref · error_type (grammar|vocab|collocation|coherence|spelling|listening-catch|reading-trap)
front (câu/điểm sai) · back (câu đúng) · explanation · context
-- SRS state (SM-2):
ease_factor (default 2.5) · interval_days · repetitions · lapses
due_date · last_reviewed · created_at
```

**`review_log`** — mỗi lần ôn 1 card
```
id · card_id · reviewed_at · grade (again|hard|good|easy)
prev_interval · new_interval
```

**`band_history`** — điểm mốc cho biểu đồ (chủ yếu từ mock test)
```
id · date · listening · reading · writing · speaking · overall
is_mock (bool) · note
```

**`speaking_session`** — buổi với gia sư (v4)
```
id · date · duration_min · tutor_notes · band_estimate
```

**`learner_profile`** — hồ sơ học, 1 dòng duy nhất (v5, mở rộng ở v7)
```
id · name · exam_goal · start_point · daily_minutes
target_overall · target_listening · target_reading · target_writing · target_speaking
strategy · constraints (JSON) · priorities (JSON)
plan_start · exam_date (nullable) · weekly_target   -- v7: nhịp lộ trình
updated_at
```

> `study_session` có thêm `lesson_id` và `phase`/`week` lấy từ **hàng đợi**, không lấy
> từ lịch — nghỉ bao lâu cũng không làm sai metadata (xem REVIEW-PERSONALIZATION.md §2).

> "Lỗi cứng đầu" = `error_card` có `lapses >= 3` → app đánh dấu ôn dày hơn.

---

## 5. Thuật toán SRS (SM-2, nền của Anki)

4 nút khi ôn: **Again / Hard / Good / Easy**. Logic (`src/lib/ielts/srs.ts`):

```
Khởi tạo card: ease=2.5, interval=0, repetitions=0, lapses=0

Again (quên):   repetitions=0; lapses+=1; ease=max(1.3, ease-0.20); interval=0 (ôn lại trong ngày)
Hard:           ease=max(1.3, ease-0.15); interval=max(1, round(interval*1.2))
Good:           repetitions==0 → interval=1
                repetitions==1 → interval=6
                else           → interval=round(interval*ease)
                repetitions+=1
Easy:           ease=ease+0.15; interval=round(interval*ease*1.3); repetitions+=1

due_date = today + interval_days (ngày)
```

- **ease floor = 1.3** (chuẩn SM-2, tránh card rơi vào "địa ngục ôn tập").
- Phiên ôn lấy các card `due_date <= hôm nay`, **ưu tiên `lapses` cao trước** (lỗi cứng đầu).
- Mỗi lần bấm nút → ghi `review_log` + cập nhật state trên `error_card` (1 transaction).

*(Có thể nâng lên FSRS sau nếu muốn lịch tối ưu hơn — SM-2 đủ tốt cho MVP.)*

---

## 6. Tích hợp AI (OpenAI-compatible, env-driven)

> ✅ **ĐÃ CHỐT:** Dùng **API OpenAI-compatible**, **mọi cấu hình đẩy vào `.env`** — base URL,
> API key, tên model đều là biến môi trường (không hard-code, không khoá vào 1 nhà cung cấp).
> `.env*` đã được gitignore sẵn.

SDK: **`openai`** (npm) — client OpenAI chuẩn nhưng trỏ `baseURL` tuỳ ý → chạy được với bất kỳ
endpoint OpenAI-compatible nào (OpenAI, Azure, hoặc gateway nội bộ). Gọi từ **route handler**
(server-side), không lộ key ra client.

**Biến môi trường:**
```bash
LLM_BASE_URL=...      # vd https://api.openai.com/v1  (hoặc gateway khác)
LLM_API_KEY=...
LLM_MODEL=...         # vd gpt-4o  (tên model tuỳ endpoint)
LLM_VISION_MODEL=...  # (tuỳ chọn) model đọc ảnh cho v3; mặc định = LLM_MODEL
```

Client (`src/lib/ielts/llm.ts`):
```ts
import OpenAI from "openai";
export const llm = new OpenAI({ baseURL: process.env.LLM_BASE_URL, apiKey: process.env.LLM_API_KEY });
export const LLM_MODEL = process.env.LLM_MODEL!;
```

### 6a. Chấm Writing — `POST /api/ielts/grade-writing`

- **API:** `llm.chat.completions.create({ model: LLM_MODEL, messages, response_format })`.
- **Structured output:** ưu tiên `response_format: { type: "json_schema", json_schema: {...} }`
  (OpenAI hỗ trợ strict). Fallback cho endpoint không hỗ trợ json_schema →
  `response_format: { type: "json_object" }` + mô tả schema trong prompt. Schema trả về:

```jsonc
{
  "bands": { "task_response": 6.0, "coherence": 6.5, "lexical": 6.0, "grammar": 5.5, "overall": 6.0 },
  "feedback": {
    "task_response": "…", "coherence": "…", "lexical": "…", "grammar": "…",
    "to_reach_7": ["gợi ý cụ thể 1", "…"]
  },
  "error_cards": [
    { "error_type": "grammar", "front": "câu sai", "back": "câu đúng", "explanation": "…" }
    // AI tự trích lỗi → app đổ thẳng vào bảng error_card
  ]
}
```

- Prompt chấm **theo đúng band descriptor IELTS thật** (nhúng tiêu chí band 5–7 vào system prompt).
- Không cần stream ở MVP (bài chấm ngắn). Muốn hiện dần sau → `stream: true`.

> Điểm hay: 1 lần gọi vừa **ra band + nhận xét**, vừa **tự sinh error_card** → giết 2 việc,
> đúng tinh thần low-friction đã bàn.

### 6b. Đọc screenshot L/R — `POST /api/ielts/parse-screenshot` (v3)

- **Model:** `LLM_VISION_MODEL` (một model OpenAI-compatible có thị giác).
- Gửi ảnh dạng data URL trong message content (`{ type: "image_url", image_url: { url: "data:..." } }`)
  + yêu cầu trả JSON: `{ raw_score, total, wrong_items: [...], suggested_cards: [...] }`.
- Fallback: ảnh không đọc được → form nhập tay điểm (self-report).

### 6c. Ghi chú chi phí

Chi phí tuỳ endpoint/model bạn cấu hình trong env — app không ràng buộc nhà cung cấp. 1 bài Task 2
(~350 từ vào + ~800 từ nhận xét ra) thường chỉ vài cent/bài → không đáng kể với tần suất học.

---

## 7. Các trang v1 (chi tiết vừa đủ)

- **`/ielts/writing`**: textarea nộp essay + chọn Task 1/2 + đề → nút "Chấm" → hiện band 4 tiêu chí +
  nhận xét + danh sách card gợi ý (tick để đưa vào SRS) → nút "Viết lại" tạo submission con.
- **`/ielts/review`**: rút card đến hạn (ưu tiên lỗi cứng đầu) → hiện `front` → lật xem `back` +
  giải thích → 4 nút Again/Hard/Good/Easy → cập nhật SRS.
- **`/ielts/errors`**: bảng mọi card, lọc theo `error_type`, tab "Lỗi cứng đầu" (`lapses>=3`),
  sửa/xóa thủ công.

---

## 8. Quyết định đã chốt (2026-07-19)

1. ✅ **Storage:** libSQL (SQLite) + Drizzle — file local, swap Turso khi cần.
2. ✅ **AI chấm:** OpenAI-compatible, cấu hình toàn bộ qua env (`LLM_BASE_URL` / `LLM_API_KEY` / `LLM_MODEL`).
3. ✅ **Slice bắt đầu:** **Nền tảng trước** — DB + schema + thuật toán SRS + seed dữ liệu mẫu,
   trước khi làm UI. (UI writing/review/errors là slice kế tiếp.)

---

## 9. Lộ trình v2 — pace, baseline và vòng viết lại (2026-09-07)

Bản v1 của app chạy đúng về kỹ thuật nhưng lộ trình không sống được khi dùng thật.
Xem `docs/ielts/ROADMAP.md` §1 cho chẩn đoán. Phần kỹ thuật thay đổi như sau.

### 9a. Hàng đợi bài — `src/lib/ielts/plan.ts`

- 20 tuần × 6 bài = **120 bài**, trong đó **105 bắt buộc**. Chủ nhật không có bài.
- `Lesson.required = false` cho ngày bù thứ Bảy. `lessonQueueStatus()` chỉ chọn
  `current` trong các bài bắt buộc, còn ngày bù trả về ở `queue.buffer` để UI mời thêm.
- `Activity.kind` là `core | baseline | rewrite | mock | buffer` — UI và server đọc
  `kind` để đổi hành vi (bắt buộc nhập band, mở bài gốc để viết lại...).
- `Lesson.stage` là `A | B1 | B2`; `Lesson.phase` giữ dạng số 0/1/2 để không phải
  migrate cột `study_session.phase`.
- `habitGatePassed()` quyết định khi nào app gợi ý đặt ngày thi.

### 9b. Pace — `src/lib/ielts/pace.ts` + `src/server/ielts/pace.ts`

`paceStatus()` là hàm thuần, nhận số bài còn lại, mục tiêu tuần, ngày thi và số ngày
học trong 14 ngày gần nhất; trả về `on-track | behind | at-risk | no-exam` cùng cờ
`degraded`. `getPaceOverview()` gom dữ liệu từ DB rồi gọi hàm thuần đó, nên toàn bộ
logic đều test được không cần DB (`scripts/ielts/pace.test.ts`).

`degraded = dưới 6 ngày học trong 14 ngày` → Hôm nay hiện banner giữ nhịp và coach
đổi khuyến nghị sang một phiên SRS ngắn.

### 9c. Baseline và mock ghi band trong cùng transaction

`saveTrackSession()` đọc `kind` của bài: `baseline` bắt buộc có `bandEstimate`, `mock`
bắt buộc có cả `bandListening` và `bandReading`; cả hai đều chèn `band_history` ngay
trong transaction lưu session. Baseline một kỹ năng cố tình để `overall = null` để
không vẽ điểm giả trên biểu đồ overall.

### 9d. Vòng viết lại thật

`latestRewritableSubmission()` tìm bài đã chấm gần nhất chưa có bản viết lại.
Bài `kind: "rewrite"` mở thẳng `/ielts/writing?lessonId=…&rewriteOf=<id>`, workbench
hiển thị bài gốc, feedback cũ và chênh lệch band sau khi chấm lại; `saveSubmission()`
ghi `is_rewrite` và `parent_submission_id`.

Bài Giai đoạn A dài 25 phút nên `minimumWordsFor()` hạ ngưỡng xuống 100 từ thay vì
250 — giữ nguyên 150/250 cho các bài full-length.

### 9e. Sáu mâu thuẫn logic đã xử lý (2026-09-07)

Rà lại sau khi v2 lên, các chỗ code cũ còn giữ giả định của v1:

1. **Ôn tập không được tính là buổi học.** `submitReview()` giờ ghi thêm một dòng
   `study_session` mỗi ngày (`source_url = ielts:review`, `status = review`) trong cùng
   transaction. Trước đó streak và cửa sổ 14 ngày chỉ đọc `study_session`, nên lời khuyên
   "ôn 10 phút là đủ" không bao giờ đưa người học ra khỏi chế độ hạ tải.
2. **Loại task đoán từ nhãn bài.** Nhãn "Viết lại Task 2 + Task 1" bị đọc thành Task 1,
   khiến UI cho chấm ở 150 từ còn server chặn lưu ở 250. Nay `Activity.taskType` khai báo
   tường minh và là nguồn duy nhất.
3. **Điều kiện thói quen không có chiều thời gian.** Chuyển từ đếm bài theo tuần-lộ-trình
   sang `completionsPerWeek()`/`habitGatePassed()` trong `pace.ts`, đếm theo ngày thật kể
   từ `plan_start`, chỉ tính tuần đã trọn.
4. **Ngày bù Giai đoạn B ghi 45 phút nhưng các bước cộng lại 25.** Các bước nay suy ra từ
   giai đoạn, và có test bắt buộc `sum(steps) === minutes` cho toàn bộ 120 bài.
5. **Buổi học bị đóng dấu bài hiện tại.** Writing/Track/Speaking nay đóng dấu đúng bài
   người học mở (`stamp`), trong khi điều kiện hoàn thành vẫn phải là bài hiện tại nên
   không thể nhảy cóc.
6. **Quỹ thời gian ngày bị dùng như độ dài buổi.** `dailyMinutes` là thời gian rảnh; coach
   và prompt chấm bài nay dùng thời lượng bài của hôm nay. `gradeAction()` nhận `lessonId`
   để LLM biết đang chấm đoạn 15 phút hay bài thi 40 phút.

### 9f. Test

`npm run ielts:test` chạy 3 bộ: `srs.test.ts`, `plan.test.ts`, `pace.test.ts` (35 check).
```

---

## 10. Chấm bài AI v2 — vì sao chưa tốt và sửa gì (2026-09-08)

Duy nhận xét phần chấm hiện tại chưa tốt. Đọc lại `src/lib/ielts/grading.ts`, cảm giác đó có
căn cứ kỹ thuật rõ ràng. Mục này là spec cho lần làm lại; chưa code.

### 10a. Chẩn đoán

| Hiện trạng trong code | Hệ quả người học thấy |
|---|---|
| Một prompt "giám khảo IELTS" cho mọi tình huống | Bài viết tự do tuần 1 bị chấm 4.5 và khuyên "viết 4 đoạn" |
| Band descriptor tóm thành hai câu, model tự nhớ phần còn lại | Điểm trôi theo cảm tính của model, không có mốc để so |
| Band, nhận xét và thẻ lỗi sinh trong **một lần gọi** | Trích thẻ tranh chỗ với chấm; thẻ trùng, thẻ gộp bốn lỗi, trả 8 thẻ trong khi UI giữ 3 |
| Chỉ một mẫu duy nhất từ model cỡ nhỏ (`LLM_MODEL=gpt-5-mini`) | Chấm lại cùng bài có thể lệch 0.5 đến 1.0 |
| Task Response vẫn được chấm khi không có đề | Con số vô nghĩa nhưng vẫn hiển thị và lưu |
| `to_reach_7` cố định, không biết mục tiêu Writing thật là 6.0 | Lời khuyên nhắm sai đích |
| Band thiếu hoặc lỗi parse → `num()` trả 0 lặng lẽ | Sai số hiển thị như dữ liệu thật |
| Không có bộ đo chuẩn | "Chưa tốt" mãi là cảm giác, không đo được có cải thiện hay không |

### 10b. Kiến trúc mới: hai chế độ, hai bước

```
                 ┌──────────────────────┐
  essay + đề ──▶ │ B1. Trích lỗi        │ ──▶ danh sách lỗi có cấu trúc
  + lesson       │ (model nhỏ, rẻ)      │     {span, sửa, error_type, rule, lý do}
                 └──────────────────────┘     đã gộp trùng theo rule
                            │
             ┌──────────────┴───────────────┐
             ▼                              ▼
   chế độ COACH                    chế độ BAND
   (Giai đoạn 0–1)                 (Giai đoạn 1 cuối trở đi)
   - mật độ lỗi / 100 từ           - B2. Chấm (model mạnh hơn, LLM_GRADER_MODEL)
   - 1 điều làm tốt                  nhận essay + đề + danh sách lỗi làm bằng chứng
   - 1 việc sửa tiếp theo            + descriptor thật band 5–7 + anchor
   - thẻ lỗi                       - lấy trung vị 3 mẫu / tiêu chí, cảnh báo nếu lệch ≥ 1.0
   - KHÔNG band                    - nhận xét theo tiêu chí + "việc kế tiếp" nhắm target band
                                   - thẻ lỗi
```

Tách bước trích lỗi ra riêng giải quyết cùng lúc bốn việc: thẻ sạch hơn, mật độ lỗi tính
được, so sánh bản viết lại theo lỗi, và bước chấm có bằng chứng thay vì ấn tượng chung.

### 10c. Hai chế độ trả về gì

| | Coach | Band |
|---|---|---|
| Khi nào | `Activity.gradingMode = "coach"`: Giai đoạn 0, đầu Giai đoạn 1, mọi bài không có đề | `"band"`: từ tuần 6, và mọi bài có đề Task 1/2 thật |
| Đầu vào bắt buộc | essay | essay **và đề bài** (không đề thì từ chối chấm band, đề nghị chuyển coach) |
| Trả về | `errorDensity`, `strengths[1]`, `nextFix[1]`, `cards[]` | thêm `bands` 4 tiêu chí + overall, `feedback` theo tiêu chí, `nextSteps[≤3]`, `confidence` |
| Ghi DB | `writing_submission` với `band_* = null`, `error_density` | như hiện tại + `error_density`, `grader_spread` |
| UI | ẩn 5 ô band, ẩn nhãn Task, đồng hồ mềm | như hiện tại + cảnh báo khi `confidence` thấp |

### 10d. Prompt chấm (chế độ band)

- **Nhúng descriptor thật** cho band 5, 6, 7 của từng tiêu chí (bản công khai của IELTS), không
  tóm tắt. Model đối chiếu, không nhớ.
- **Anchor**: 2 đoạn mẫu ngắn đã biết band (một band 5, một band 7) cho GRA và LR, để neo thang.
- **Bằng chứng**: danh sách lỗi từ B1 và số từ. Under-length (<250 Task 2, <150 Task 1) phải
  kéo Task Response xuống đúng luật.
- **Ngữ cảnh bài**: đây là đoạn 15 phút hay bài thi 40 phút; target Writing của Duy là 6.0
  (đọc từ hồ sơ), nên "việc kế tiếp" nhắm 6.0, không nhắm 7.
- **Giọng**: xưng "bạn", giọng đồng nghiệp sửa bài, tiếng Việt, không "em".
- Yêu cầu **`json_schema` strict** khi endpoint hỗ trợ; fallback `json_object`. Thiếu trường
  band → **ném lỗi**, không điền 0.

### 10e. Thẻ lỗi

Quy tắc cho B1, kiểm ở tầng code chứ không chỉ dặn trong prompt:

1. **Một thẻ một lỗi.** `front` là cụm tối thiểu chứa lỗi, không phải cả câu.
2. **Gắn `rule`** ngoài `error_type`: ví dụ `plural-s`, `sva`, `tense-consistency`, `prep-time`,
   `article`, `adverb-position`, `run-on`. Danh sách rule đóng, nằm trong code.
3. **Gộp trùng theo `rule` trong cùng bài**: 4 lần thiếu -s thành một thẻ có 4 ví dụ, không
   thành 4 thẻ.
4. **Xếp hạng** theo tần suất trong bài × tần suất lịch sử (đếm `rule` trên `error_card` cũ).
5. Trả **tối đa 5**, UI giữ **tối đa 3** như cũ. Không còn cảnh trả 8 rồi bỏ 5.

Schema: thêm `error_card.rule` (text, nullable) và `writing_submission.error_density` (real),
`writing_submission.grader_spread` (real, nullable). Migration 0003. "Lỗi cứng đầu" khi đó có
thể tính ở mức rule, đúng với cách người học thật sự mắc lỗi lặp.

### 10f. Đánh giá bản viết lại

Có danh sách lỗi của bài gốc và bản viết lại thì so được: **đã sửa / còn nguyên / mới phát
sinh**, theo rule. Đây là phản hồi có ý nghĩa ở Giai đoạn 0–1, thay cho chênh lệch band. Ở chế
độ band, hiện cả hai.

### 10g. Bộ đo chuẩn — việc quan trọng nhất

Không có bộ đo thì mọi chỉnh prompt đều là đoán. Tạo `scripts/ielts/grading-eval.ts`:

- Fixture 10 đến 15 bài Task 2 công khai đã có band giám khảo (Cambridge, IDP, British
  Council đều có bài mẫu kèm band), trải từ 5.0 đến 7.5, lưu ở `scripts/ielts/fixtures/`.
- Chạy grader, so từng tiêu chí. Chỉ số: **MAE theo tiêu chí** và **tỉ lệ lệch ≥ 1.0**.
- Ngưỡng chấp nhận: MAE ≤ 0.5, không bài nào lệch ≥ 1.0 ở overall. Chưa đạt thì chưa được
  gọi là tốt, bất kể prompt nghe hợp lý đến đâu.
- Chạy lại mỗi khi đổi prompt hoặc đổi model. Tốn vài chục cent một lần.

### 10h. Cấu hình

```bash
LLM_MODEL=...          # bước trích lỗi và vision: rẻ, nhanh
LLM_GRADER_MODEL=...   # bước chấm band: mạnh hơn; mặc định = LLM_MODEL nếu bỏ trống
LLM_GRADER_SAMPLES=3   # số mẫu lấy trung vị ở chế độ band
```

### 10i. Thứ tự làm

1. Bộ đo chuẩn trước (10g), chạy trên grader hiện tại để có số gốc.
2. Tách B1 trích lỗi + rule + gộp trùng + mật độ lỗi (10e), migration 0003.
3. Chế độ coach dùng B1, ẩn band (10c). Đây là thứ Giai đoạn 0 cần ngay.
4. Chấm band với descriptor thật, anchor, trung vị 3 mẫu, target từ hồ sơ (10d).
5. Diff lỗi cho bản viết lại (10f).
6. Chạy lại bộ đo, so với số gốc, ghi kết quả vào mục này.

---

## 11. Trạng thái triển khai v3 (2026-09-08)

Roadmap v3 và chấm bài v2 đã được code. Những gì thay đổi so với bản thiết kế ở §9 và §10:

**Đã bỏ hẳn**
- `src/server/ielts/lessons.ts` và toàn bộ khái niệm hàng đợi bài.
- `today-workbench.tsx`, dashboard cũ ở `/ielts` (đã là code chết sau redirect), và
  route `history/[lessonId]`.
- `scripts/ielts/verify.ts`, `verify-v2.ts` — thay bằng test thuần.

**Đã thêm**

| File | Vai trò |
|---|---|
| `src/lib/ielts/plan.ts` | Bốn giai đoạn, mục tiêu ngày, suất tuần, tiêu chí ra |
| `src/lib/ielts/progress.ts` | Đánh giá dữ liệu thật so với kế hoạch (thuần) |
| `src/lib/ielts/prompts.ts` | Ngân hàng đề: 8 đề tự do, 16 Task 2, 5 Task 1 |
| `src/lib/ielts/error-rules.ts` | Danh sách rule đóng để gộp và đếm lỗi lặp |
| `src/lib/ielts/extract.ts` | Bước 1 chấm bài: trích lỗi, gộp theo rule, mật độ lỗi |
| `src/lib/ielts/descriptors.ts` | Tiêu chí band diễn giải lại + hai đoạn neo |
| `src/server/ielts/plan-state.ts` | Bảng `phase_state`, chuyển giai đoạn có xác nhận |
| `src/server/ielts/input.ts` | Ghi tiếp nhận hằng ngày |
| `src/server/ielts/progress.ts` | Nạp dữ liệu cho `progressReport()` |
| `src/server/ielts/today.ts` | Nạp một lần cho trang Hôm nay |
| `src/server/ielts/history.ts` | Lịch sử theo ngày |
| `scripts/ielts/grading-eval.ts` | Bộ đo grader: `--consistency` và `--accuracy` |

**Migration 0003** thêm `study_session.slot`, `error_card.rule`,
`writing_submission.prompt_id / error_density / grading_mode / grader_spread`, bảng
`phase_state`, và unique index `phase_state_one_open`.

> Index đó có lý do cụ thể: trang Hôm nay và trang Tiến độ cùng gọi `currentPhase()`,
> nên lần chạy đầu trên DB trống đã tạo **hai** giai đoạn đang mở. Đã sửa bằng cách
> kiểm lại bên trong transaction, cộng index chặn ở tầng dữ liệu, và gộp về một loader
> duy nhất cho trang Hôm nay.

**Bộ đo grader chưa có số.** `scripts/ielts/fixtures/` hiện trống: đo độ chính xác cần
bài đã được giám khảo chấm và công bố band, và bịa ra ground truth thì tệ hơn là không có.
README trong thư mục đó nói rõ lấy ở đâu. Chế độ `--consistency` chạy được ngay khi có
bài bất kỳ và đo đúng thứ đã hỏng trước đây: chấm lại cùng một bài có ra cùng band không.

**Test:** `npm run ielts:test` chạy 5 bộ, 52 check — SRS, Plan, Pace, Progress, Grading.
