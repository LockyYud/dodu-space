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
```
Tất cả 8 route `/ielts/*` đã build, typecheck sạch, biome sạch, curl 200. Còn lại chỉ là
tinh chỉnh nội dung/UX khi dùng thực tế.

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
│   └── grading.ts                 # Prompt + gọi Claude (mục 6)
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
```
