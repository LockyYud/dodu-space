# Review IELTS Tracker — cá nhân hoá, độ tin cậy và an toàn dữ liệu

Ngày review: 2026-08-10  
Phạm vi: khu vực `/ielts` trong `dodu-space`, tập trung vào luồng học được thiết kế riêng cho một người dùng: roadmap, Writing AI, SRS, Reading/Listening tracking và coach recommendation.

## Tóm tắt

Feature đã có một hướng cá nhân hoá tốt: profile học viên chứa mục tiêu band và ràng buộc thời gian; roadmap ưu tiên Writing/SRS; recommendation dựa trên band, lỗi đến hạn và lỗi cứng đầu. Tuy nhiên, trước khi đưa lên một website có thể truy cập từ Internet hoặc trước khi dựa vào dữ liệu này để theo dõi dài hạn, nên giải quyết các vấn đề sau:

| Ưu tiên | Vấn đề | Tác động chính |
| --- | --- | --- |
| High | Không bảo vệ khu vực IELTS và các Server Actions | Lộ dữ liệu học cá nhân, thay đổi dữ liệu hoặc phát sinh chi phí AI nếu site public |
| Medium | Metadata phase/week dùng lịch thay vì tiến độ queue | Lịch sử học và phân tích có thể sai khi học chậm, nghỉ hoặc bắt đầu lại |
| Medium | Ghi dữ liệu nhiều bước không có transaction | Có thể xuất hiện dữ liệu mồ côi hoặc state SRS không khớp audit log |
| Medium | Card bấm `Again` không được ôn lại trong cùng phiên | Cơ chế củng cố lỗi quên chưa đạt kỳ vọng của SRS |
| Product | Cấu hình cá nhân chỉ nằm trong environment variables | Muốn đổi mục tiêu/lịch học phải sửa `.env` và restart/deploy |

## 1. Bảo vệ dữ liệu và Server Actions

**Mức độ: High nếu site được deploy public; không phải blocker nếu app chỉ chạy local, private network hoặc đã được bảo vệ ở reverse proxy.**

### Hiện trạng

- Thiết kế ghi rõ app là single-user, self-host và không cần auth ở MVP.
- Các trang IELTS đọc trực tiếp dữ liệu học: bài Writing, note, error cards, band history và session.
- Server Actions cho phép chấm AI, tạo card, lưu bài, review và xóa card, nhưng không có kiểm tra danh tính/quyền trong action.
- Không thấy middleware hay lớp bảo vệ route trong repository.

Các điểm cần chú ý:

- `src/server/ielts/writing.ts`: `gradeAction()` gọi LLM và `saveSubmission()` ghi bài viết/card.
- `src/server/ielts/today.ts`: `captureLessonCards()` gọi LLM hoặc fallback rồi ghi card.
- `src/server/ielts/reviews.ts`: `submitReview()` thay đổi lịch SRS.
- `src/server/ielts/errors.ts`: `deleteCard()` xóa dữ liệu.

### Vấn đề

Server Actions không tự biến một tính năng thành private. Nếu `/ielts` được phục vụ trên domain public, người truy cập có thể xem dữ liệu render từ server; action mutation cũng phải được xem là bề mặt cần bảo vệ. Ngoài quyền riêng tư, action gọi LLM có thể bị kích hoạt để tiêu tốn quota/API cost.

### Hướng xử lý

#### Phương án A — Chỉ chạy local / private network

Phù hợp khi đây thực sự là công cụ trên máy cá nhân.

- Bind app vào loopback hoặc đặt sau VPN/Tailscale.
- Không expose port/app ra Internet.
- Giữ nguyên kiến trúc không auth.

Ưu điểm: ít code, trải nghiệm đơn giản.  
Nhược điểm: không phù hợp cho Vercel/public domain.

#### Phương án B — Basic Auth ở reverse proxy hoặc Vercel protection

Phù hợp khi vẫn là một người dùng và không cần hệ thống tài khoản.

- Bảo vệ toàn bộ `/ielts/:path*` bằng Basic Auth ở Nginx/Cloudflare Access/Vercel Deployment Protection.
- Đảm bảo các endpoint/action cùng origin cũng không bị bypass.
- Thêm rate limit cho thao tác gọi AI nếu hạ tầng hỗ trợ.

Ưu điểm: triển khai nhanh, đúng nhu cầu single-user.  
Nhược điểm: quyền truy cập vẫn nằm ngoài ứng dụng; cần cấu hình deployment chính xác.

#### Phương án C — Auth và authorization trong Next.js

Phù hợp nếu muốn dùng đa thiết bị an toàn hoặc có khả năng mở rộng.

- Thêm auth provider/session.
- Chặn `/ielts` qua middleware hoặc layout server-side.
- Tạo `requireIeltsUser()` và gọi nó đầu mỗi Server Action mutation/LLM action.
- Nếu tương lai có nhiều người dùng, thêm `userId` vào mọi bảng và filter mọi query theo user.

Ưu điểm: bảo vệ ở đúng lớp ứng dụng, mở rộng được.  
Nhược điểm: nhiều code và migration hơn mức MVP.

### Khuyến nghị

Nếu deploy public, chọn **B ngay** để đóng rủi ro, sau đó chọn **C** nếu feature sẽ tiếp tục phát triển. Đồng thời đặt giới hạn kích thước essay/raw capture và rate-limit action gọi AI.

## 2. Phase/week được tính theo lịch thay vì queue học thực tế

**Mức độ: Medium.**

### Hiện trạng

- UI hiện dùng `lessonQueueStatus()` để chọn bài chưa hoàn thành đầu tiên. Bài chỉ chuyển khi bấm “Hoàn thành bài này”, nên người học có thể nghỉ bao lâu cũng được mà không bị nhảy bài.
- `saveSubmission()` và `saveTrackSession()` lại gọi `planStatus()` không truyền trạng thái queue. `planStatus()` tính tuần/phase từ `IELTS_PLAN_START` và ngày hiện tại.

Ví dụ: người học hoàn thành được vài bài Phase 0 rồi nghỉ ba tháng. Khi quay lại nộp Writing, queue vẫn đang ở Phase 0, nhưng session mới có thể bị gắn Phase 2 vì ngày lịch đã đi xa.

### Vấn đề

Hai khái niệm tiến độ đang song song nhưng không đồng bộ:

1. **Tiến độ học thật:** lesson queue, dựa trên lesson đã complete.
2. **Metadata học được lưu:** phase/week, dựa trên calendar start date.

Hệ quả là lịch sử session, progress view, recommendation hoặc các báo cáo sau này có thể diễn giải sai giai đoạn học. Điều này đặc biệt mâu thuẫn với thông điệp UX “Nếu bỏ qua vài ngày, bài này vẫn nằm ở đây.”

### Hướng xử lý

#### Phương án A — Dùng queue làm nguồn chân lý

- Trước khi ghi session, lấy `listCompletedLessonIds()` rồi gọi `lessonQueueStatus()`.
- Lưu `phase`, `week` và tốt hơn là `lessonId` của `queue.current`.
- Dùng `lessonId` để có thể tra lại chính xác activity/roadmap khi cần.

Ưu điểm: khớp hoàn toàn với UX hiện tại; ít thay đổi schema nếu chỉ thêm logic.  
Nhược điểm: hoạt động ngoài roadmap vẫn sẽ bị gắn với lesson hiện tại, cần quy ước rõ.

#### Phương án B — Tách rõ “planned phase” và “actual phase”

- Giữ `plannedPhase/plannedWeek` tính từ lịch nếu vẫn cần timeline dự kiến.
- Thêm `lessonId`, `actualPhase`, `actualWeek` tính từ queue.
- Báo cáo hiển thị actual mặc định, planned chỉ dùng để so sánh pace.

Ưu điểm: phân biệt được học chậm/nhanh so với dự kiến.  
Nhược điểm: migration và UI phức tạp hơn.

#### Phương án C — Có trạng thái plan riêng trong DB

- Tạo bảng `learner_plan_state` chứa current lesson, start/resume date, target cadence.
- Không suy diễn state từ các session marker.
- Cho phép pause/resume/reset roadmap có kiểm soát.

Ưu điểm: mô hình dài hạn rõ ràng nhất.  
Nhược điểm: quá mức cần thiết nếu roadmap vẫn đơn giản.

### Khuyến nghị

Chọn **A**, và thêm `lessonId` vào `study_session`. Đây là thay đổi nhỏ nhưng loại bỏ divergence quan trọng nhất.

## 3. Các ghi nhiều bước chưa dùng transaction

**Mức độ: Medium.**

### Hiện trạng

- Lưu Writing thực hiện tuần tự: tạo `study_session` → tạo `writing_submission` → tạo nhiều `error_card`.
- Lưu Track cũng tạo session rồi tạo cards.
- Submit review cập nhật `error_card` trước, sau đó insert `review_log`.
- Tài liệu kỹ thuật mô tả update SRS và ghi log nên ở “1 transaction”, nhưng implementation hiện chưa thực hiện điều đó.

### Vấn đề

Nếu một câu lệnh sau thất bại (network issue với Turso, constraint/schema problem, timeout), dữ liệu trước đó vẫn commit:

- Writing session tồn tại nhưng không có submission.
- Submission tồn tại nhưng không có các card người học đã chọn.
- Card đã có schedule mới nhưng không có audit log, hoặc ngược lại trong trường hợp refactor sau này.

Đây không phải lỗi thường xuyên với local SQLite, nhưng dữ liệu SRS là dữ liệu dài hạn; cần bảo toàn tính nhất quán ngay từ đầu.

### Hướng xử lý

#### Phương án A — Dùng transaction của Drizzle/libSQL

- Bao toàn bộ các insert của Writing/Track trong `db.transaction(async (tx) => ...)`.
- Với review, update card và insert log trong cùng transaction.
- Chỉ `revalidatePath()` sau khi transaction thành công.

Ưu điểm: thay đổi nhỏ, xử lý đúng bất biến dữ liệu.  
Nhược điểm: cần xác nhận driver/libSQL deployment đang dùng hỗ trợ transaction theo cách Drizzle mong đợi.

#### Phương án B — Batch SQL / libSQL transaction API

- Dùng transaction/batch của `@libsql/client` trực tiếp nếu cần tương thích tốt hơn với Turso.
- Giữ repository layer để các action không phải tự ghép nhiều mutation.

Ưu điểm: kiểm soát rõ behaviour remote libSQL.  
Nhược điểm: coupling với driver nhiều hơn.

#### Phương án C — Idempotency và repair job

- Kèm `idempotencyKey` cho mỗi lần lưu từ client.
- Định kỳ tìm session Writing thiếu submission hoặc state review thiếu log.

Ưu điểm: bảo vệ thêm trước retry/double submit.  
Nhược điểm: không thay thế transaction; chỉ nên làm sau A/B nếu cần.

### Khuyến nghị

Chọn **A** cho Writing, Track và Review. Thêm unique/idempotency cho các thao tác người dùng có thể click/retry nhiều lần là bước tiếp theo.

## 4. Card `Again` không quay lại trong phiên ôn

**Mức độ: Medium.**

### Hiện trạng

- `schedule(..., "again")` đặt `intervalDays = 0`, vì vậy card vẫn due trong hôm nay.
- `ReviewSession` nhận `initialCards` một lần và chỉ tăng `index` sau mỗi lần bấm grade.
- Sau khi bấm `Again`, card không được chèn lại vào mảng trong client. Nó chỉ xuất hiện trở lại sau refresh như dòng thông báo cuối phiên cũng ghi.

### Vấn đề

“Again” thường mang ý nghĩa người học chưa nhớ được đáp án. Việc bỏ card đó khỏi phiên hiện tại làm SRS chưa tạo được vòng nhắc lại ngắn. Với các lỗi grammar/collocation cứng đầu, đây là phần có giá trị nhất của phiên ôn.

### Hướng xử lý

#### Phương án A — Requeue ngay trong client

- Khi grade là `again`, thêm card vào cuối queue (hoặc sau 2–3 card khác).
- Giới hạn số lần lặp mỗi phiên để tránh loop vô hạn, ví dụ tối đa 2 lần/card/ngày trong một session.
- UI hiển thị “Sẽ hỏi lại sau vài card”.

Ưu điểm: UX nhanh, không cần refetch.  
Nhược điểm: state client phức tạp hơn một chút.

#### Phương án B — Server trả queue mới

- Sau review, gọi lại `getDueCards()` hoặc một endpoint/action chỉ lấy card tiếp theo.
- Server quyết định thứ tự gồm card Again vừa due, card stubborn và card mới.

Ưu điểm: một nguồn chân lý, phù hợp đa tab.  
Nhược điểm: thêm round-trip cho từng card.

#### Phương án C — Learning steps rõ ràng hơn

- Mở rộng state SRS với `learningStep`/`dueAt` (datetime thay vì date), ví dụ Again → 10 phút.
- Queue card theo timestamp, sau đó mới chuyển sang SM-2 day intervals.

Ưu điểm: gần Anki/FSRS hơn và đúng ngữ nghĩa “học lại trong ngày”.  
Nhược điểm: schema, migration và logic phức tạp hơn.

### Khuyến nghị

Chọn **A** ở MVP: requeue `Again` về cuối queue sau ít nhất 2 card khác, với giới hạn retry. Khi cần ôn theo phút thực sự, nâng lên C.

## 5. Cá nhân hoá hiện là cấu hình kỹ thuật, chưa có trải nghiệm chỉnh trong app

**Mức độ: Product gap, không phải bug chức năng.**

### Hiện trạng

`learnerProfile()` đọc tất cả thông tin cá nhân hoá từ environment variables:

- tên và điểm xuất phát;
- mục tiêu overall và từng kỹ năng;
- số phút học/ngày;
- strategy, constraints, priorities;
- ngày bắt đầu roadmap.

`.env.example` đã có template đầy đủ cho một learner cụ thể.

### Vấn đề

Đây là cá nhân hoá theo deployment, không phải runtime. Khi mục tiêu đổi từ 7.0 sang 7.5, lịch học đổi từ 60 sang 30 phút, hoặc cần pause/reset roadmap, người dùng phải sửa `.env` rồi restart/redeploy. Cũng không có lịch sử target cũ hay ngày thay đổi target, nên progress dễ bị so với mục tiêu hiện tại một cách thiếu ngữ cảnh.

### Hướng xử lý

#### Phương án A — Giữ env-only

Phù hợp nếu app chỉ do một người kỹ thuật vận hành và thông số hiếm khi đổi.

- Document rõ các biến trong README/IELTS docs.
- Thêm validation khi app boot để báo biến số không hợp lệ.

Ưu điểm: đơn giản, không migration.  
Nhược điểm: trải nghiệm chỉnh mục tiêu kém.

#### Phương án B — Trang “Hồ sơ học” trong app

- Tạo bảng `learner_profile` (single row) hoặc JSON config trong DB.
- Thêm `/ielts/settings` để chỉnh mục tiêu, daily minutes, strategy, start/resume date.
- Env chỉ làm seed/default khi DB chưa có profile.

Ưu điểm: đúng nghĩa customize cho riêng người học; không phải redeploy.  
Nhược điểm: cần validation và quyền truy cập (liên quan mục 1).

#### Phương án C — Versioned goals

- Thêm `goal_history` với `effectiveFrom`, target bands, daily minutes và note lý do thay đổi.
- Progress chart đọc target theo thời điểm dữ liệu được ghi.

Ưu điểm: phân tích tiến bộ chính xác khi target thay đổi.  
Nhược điểm: chỉ cần khi đã dùng app lâu hoặc hay đổi mục tiêu.

### Khuyến nghị

Nếu đây là tool dùng xuyên nhiều tháng, chọn **B**. Có thể làm B trước, rồi chỉ thêm C khi thực sự cần so sánh tiến độ qua nhiều mục tiêu.

## Thứ tự triển khai đề xuất

1. Nếu app public: bảo vệ `/ielts` và actions, giới hạn request LLM.
2. Đưa Writing/Track/Review vào transaction.
3. Đồng bộ session metadata với lesson queue; ưu tiên lưu `lessonId`.
4. Requeue card `Again` trong cùng phiên.
5. Tạo trang Profile/Settings nếu muốn tự đổi mục tiêu/lịch mà không redeploy.

## Kiểm tra đã thực hiện trong review

- `npm run ielts:test`: pass 8/8 test cho scheduler SRS.
- `npx tsc --noEmit`: pass.
- Biome check riêng các file IELTS thay đổi: pass.
- `npm run lint` toàn repository hiện fail do các file quiz và Drizzle metadata ngoài phạm vi IELTS; không phải lỗi từ 5 file IELTS được thay đổi trong review này.
