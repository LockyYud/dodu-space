# Rà soát phương pháp học — đối chiếu lộ trình v3 với nghiên cứu

> Rà soát ngày **2026-09-08**, sau khi lộ trình v3 và lịch tuần cố định đã lên code.
> Đọc kèm [ROADMAP.md](./ROADMAP.md) (nội dung) và [TECH-DESIGN.md](./TECH-DESIGN.md) (kỹ thuật).
> Tài liệu này trả lời đúng một câu hỏi: **phương pháp đang áp dụng đã ổn chưa, thiếu gì.**

---

## 1. Kết luận

**Phương pháp đúng. Số học không đủ.**

Phần khó nhất — vòng phản hồi cho Writing — repo đang làm đúng theo nghiên cứu. Điều đáng lo
không nằm ở cách học mà ở **quỹ giờ**: lộ trình 22 tuần cấp khoảng **130 giờ học tập trung**,
trong khi mốc thường được dẫn là 120–200 giờ cho **mỗi** band. Mục tiêu 7.0 (tức +1.5 band) hiện
không được cấp vốn, và app chưa nói ra điều đó ở đâu cả.

Ngoài ra có ba lỗ hổng phương pháp, xếp theo giá trị: **từ vựng không có hệ thống**, **Speaking
khoán trọn cho gia sư**, **Listening thiếu phần giải mã âm**.

> **Cập nhật 2026-09-08:** quỹ giờ đã được chốt theo phương án kết hợp — xem 3.3b. Lộ trình
> thành 26 tuần và app đã biết tự báo chênh lệch giờ. Ba lỗ hổng bên dưới chưa làm, và chúng
> chính là phần giờ tăng thêm mà quyết định đó cam kết.

---

## 2. Những gì đang đúng

Ghi lại để các bản sau đừng vô tình bỏ mất.

| Đang làm | Vì sao đúng |
|---|---|
| Gộp lỗi theo `rule`, xếp hạng theo tần suất lặp, **tối đa 5 thẻ** mỗi bài | Nghiên cứu về written corrective feedback cho thấy sửa **có trọng điểm** hiệu quả hơn sửa tràn lan: người học không tiếp thu nổi khi bị chỉ ra quá nhiều lỗi cùng lúc |
| Viết → nhận feedback → **viết lại vào hôm sau** | Kết hợp pushed output với sửa bài, và khoảng cách một ngày là spacing chứ không phải chép lại |
| Giai đoạn đầu đo **mật độ lỗi / 100 từ**, không đo band | Band ở vùng 5.0 nhiễu quá lớn để làm tín hiệu tuần; mật độ lỗi phản ứng nhanh và đúng thứ đang sửa |
| SRS trên **lỗi thật của mình** | Retrieval practice có spacing, trên vật liệu cá nhân hoá thay vì danh sách dựng sẵn |
| Chuyển giai đoạn theo **điều kiện ra**, không theo lịch | Tránh việc trôi qua giai đoạn mà chưa đạt năng lực nền |
| Bấm giờ và mock **chỉ xuất hiện từ giai đoạn 2** | Sức ép thời gian ở band 5.0 chỉ che mất vấn đề ngôn ngữ |
| Tiếp nhận hằng ngày, tách khỏi bài bấm giờ | Khối lượng tiếp xúc là thứ kéo L/R, và nó phải rẻ đủ để sống sót qua ngày bận |

---

## 3. Vấn đề lớn nhất: quỹ giờ không mua nổi mục tiêu

### 3.1 Lộ trình đang cấp bao nhiêu giờ

Tính trực tiếp từ `src/lib/ielts/plan.ts` (lịch tuần × số tuần dự kiến của từng giai đoạn):

*(Số của **bản 22 tuần**, tức trạng thái lúc rà soát. Sau quyết định ở 3.3b, `plan.ts`
là 26 tuần — chạy lại sẽ ra số khác. Giữ nguyên ở đây vì đây là phần chẩn đoán.)*

| Mức tải | Tổng 22 tuần |
|---|---|
| Tuần bận (4 buổi) | 136 giờ |
| **Tuần thường (5 buổi)** | **171 giờ** |
| Tuần rảnh (6 buổi) | 199 giờ |

Nhưng 171 giờ đó gồm **40 giờ nghe podcast khi di chuyển**. Nghe thụ động là thật và đáng giữ,
song nó không phải "giờ học có hướng dẫn" theo nghĩa các mốc dưới đây dùng. Trừ ra:

> **Giờ học tập trung thực tế: khoảng 130 giờ.**

Chia theo giai đoạn, ở mức tuần thường: Quay lại 5,9h/tuần · Học format 6,7h/tuần ·
Nâng band 9,0h/tuần · Trước thi 6,1h/tuần.

### 3.2 Cần bao nhiêu

Con số hay được dẫn từ Cambridge là **~200 giờ học có hướng dẫn cho mỗi band**; một số nguồn
đưa khoảng rộng hơn, 120–150 giờ. Xuất phát điểm đã hiệu chỉnh là L 5.5 · R 5.5 · W 5.0 · S 5.0,
trung bình 5.25 → **overall 5.5**.

| Mục tiêu | Mức tăng | Giờ cần (120–200 h/band) | Lộ trình đang cấp |
|---|---|---|---|
| Overall 6.5 | +1.0 | 120 – 200 giờ | 130 giờ |
| Overall 7.0 | +1.5 | 180 – 300 giờ | 130 giờ |

**6.5 nằm ở mép trên của khoảng lạc quan. 7.0 thì không.**

Cần công bằng ở hai điểm trước khi kết tội lộ trình:

1. Một phần điểm IELTS đến từ **quen định dạng đề**, rẻ hơn nhiều so với nâng trình độ thật.
   Giai đoạn 1 tồn tại chính vì lý do đó và nó có lãi cao trên mỗi giờ bỏ ra.
2. Nền TOEIC LR 700 nghĩa là Listening/Reading đã có sẵn vốn tiếp nhận; phần tăng ở L/R có thể
   rẻ hơn trung bình, còn Writing/Speaking thì không.

Nhưng chênh lệch cỡ này không phải sai số làm tròn. Nó là một quyết định đang bị bỏ ngỏ.

### 3.3 Ba đường ra — cần chốt một

| | Cách | Con số | Đánh đổi |
|---|---|---|---|
| **A** | Lùi ngày thi, giữ nhịp hiện tại | 7.0 cần **31–51 tuần** thay vì 22 → thi khoảng **tháng 4 đến tháng 8/2027** | Kéo dài, rủi ro mất đà cao hơn |
| **B** | Giữ tháng 2/2027, tăng giờ | 7.0 cần **8,2–13,6 giờ tập trung/tuần** (hiện 5,9) — thêm khoảng 30–90 phút mỗi ngày học | Chỉ khả thi nếu lịch sống thật sự cho phép; ép quá là lặp lại v1 |
| **C** | Giữ tháng 2/2027, hạ mục tiêu | 130 giờ ≈ **6.0 (thực tế) đến 6.5 (lạc quan)** | Trung thực nhất, nhưng phải chấp nhận 7.0 là mục tiêu của lần thi sau |

**Đề xuất: B rút gọn, nhắm 6.5.** Tăng lên khoảng **9 giờ tập trung/tuần** — tương đương luôn để
tuần ở mức "Tuần rảnh" cộng thêm chút ít — thì 22 tuần cấp ~200 giờ, đủ cho +1.0 band một cách
thoải mái thay vì cưỡng ép. Giữ 7.0 làm mục tiêu **có điều kiện**: chỉ chốt sau mock tuần 13, và
chỉ khi L/R đã chạm 7.0.

### 3.3b Quyết định đã chốt (2026-09-08)

Duy chọn **kết hợp A và B**: tăng giờ dần dần, và lùi ngày thi thêm khoảng một tháng.

- **Lùi thi:** Giai đoạn 2 kéo từ 12 lên **16 tuần** — bốn tuần thêm vào đúng giai đoạn đắt nhất
  chứ không rải đều. Lộ trình thành **26 tuần**, ngày thi sớm nhất khoảng **23/03/2027**.
- **Tăng giờ:** không nhồi thêm bài cùng loại. **Ba bổ sung ở mục 4–6 chính là phần giờ tăng
  thêm**, và chúng vào theo thứ tự giai đoạn để đường dốc lên từ từ: từ vựng ở giai đoạn 0,
  4/3/2 ở giai đoạn 1, chép chính tả ở giai đoạn 2.

| Giai đoạn | Bổ sung | Giờ tập trung / tuần |
|---|---|---|
| 0 — Quay lại | thẻ từ vựng | 4,3 → ~4,7 |
| 1 — Học format | + ô 4/3/2 | 5,0 → ~6,3 |
| 2 — Nâng band | + chép chính tả | 6,9 → ~8,5 |
| 3 — Trước thi | bỏ chép chính tả | 4,8 → ~6,0 |

Tổng: **~194 giờ tập trung trong 26 tuần** (bản cũ: 130). Đủ chắc cho 6.5, chạm mép dưới của
khoảng cần cho 7.0. **7.0 giữ nguyên là mục tiêu có điều kiện**, chỉ chốt sau mock tuần 13 và
chỉ khi L/R đã chạm 7.0.

Riêng phần lùi thi và cảnh báo quỹ giờ **đã lên code**; ba bổ sung thì chưa, nên hiện app báo
~158 giờ. Con số đó sẽ tự lên ~194 khi mục 4–6 xong — không phải sửa tay, vì quỹ giờ được tính
ra từ chính lịch tuần.

---

### 3.4 App phải đổi gì

Hiện `paceStatus()` chỉ so **số tuần** kế hoạch với số tuần còn lại. Nó chưa bao giờ so **số giờ**,
nên một tuần bận liên tiếp không hề làm mục tiêu band lung lay trên màn hình.

**Đã làm (2026-09-08):**

- `guidedMinutesForWeek()` và `plannedGuidedHours()` trong `plan.ts` — hàm thuần, tính giờ tập
  trung từ lịch tuần và mức tải, **trừ nghe thụ động**. Có test khẳng định phần thụ động bị loại.
- `guidedHoursStudied()` trong `server/ielts/sessions.ts` — giờ thật đã học, cùng cách loại trừ.
- `hoursOutlook()` trong `pace.ts` — so giờ dự phóng với `(target − start) × 120…200` và trả về
  ba trạng thái: chưa đủ / sát mép / đủ hẳn.
- Trang Hôm nay hiện một thẻ cảnh báo khi chưa đủ hoặc sát mép, kèm ba cách xoay.

`START_OVERALL_ESTIMATE = 5.5` là ước tính tạm trong `plan.ts`; thay bằng baseline thật trong
`band_history` ngay khi có (cuối giai đoạn 1).

---

## 4. Lỗ hổng: không có hệ thống từ vựng

**Đây là lỗ hổng phương pháp lớn nhất.**

Nation ước tính cần khoảng **8.000–9.000 word family** để đạt 98% độ phủ văn bản học thuật;
vùng band 7 thường được đặt ở **6.000–8.000**. Lexical resource lại là một trong bốn tiêu chí
chấm cả Writing lẫn Speaking, tức nó vừa là đầu vào vừa là đầu ra.

Trong repo, **SRS chỉ chứa thẻ lỗi**. Ô đọc hằng ngày ghi "gạch 3–5 cụm từ mới nếu thấy hay",
rồi không có đường nào đưa chúng vào đâu cả. Từ vựng đang hoàn toàn nằm ngoài hệ thống.

### Thiết kế đề xuất

Rẻ, vì hạ tầng đã có sẵn: `error_card` đã có `sourceType`, `errorType` (gồm `vocab` và
`collocation`), `front`/`back`/`context` và toàn bộ trạng thái SM-2. Không cần bộ máy thứ hai.

- **Đường nhập:** một ô nhỏ ngay tại ô "Đọc" hằng ngày — dán cụm từ + câu chứa nó, chọn
  `vocab` hoặc `collocation`. Không dịch sẵn, không định nghĩa dài; **thẻ phải mang ngữ cảnh**,
  vì thứ cần nhớ là cách dùng chứ không phải nghĩa rời.
- **Chỉ tiêu:** 3–5 mục mỗi ngày học. Qua 22 tuần ≈ 350–550 mục — đúng tầm phần từ vựng học
  thuật cần bổ khuyết, không phải tham vọng 8.000 từ.
- **Trần thẻ mới mỗi ngày:** bắt buộc. Nếu không, thẻ từ vựng sẽ nhấn chìm thẻ lỗi trong hàng
  đợi đến hạn, mà thẻ lỗi mới là thứ đang gỡ trần band Writing. Đề xuất: tối đa 5 thẻ từ vựng
  mới/ngày, và ô "Ôn lỗi" hiển thị tách hai loại.
- **Ưu tiên ngược lại:** một cụm từ **xuất hiện lại** trong bài đọc sau đáng giá hơn một cụm
  từ đẹp gặp một lần. Có thể xếp hạng theo số lần được nhập trùng, giống cách `rankErrors`
  đang xếp theo số lần lặp lỗi.

---

## 5. Lỗ hổng: Speaking khoán trọn cho gia sư

Toàn bộ ngân sách Speaking là **2 buổi × 45 phút**. Giữa các buổi: không có gì. Với mục tiêu
6.5 thì đó là quá ít, và nó cũng là kỹ năng duy nhất app không có dữ liệu nào ngoài band ước
tính do gia sư đưa.

### Thiết kế đề xuất: 4/3/2

Kỹ thuật **4/3/2** — nói cùng một nội dung trong 4 phút, rồi lặp lại trong 3, rồi trong 2 — có
bằng chứng khá vững về cải thiện độ trôi chảy: tốc độ nói tăng và số lần ngập ngừng giảm rõ giữa
lượt đầu và lượt cuối. Ưu điểm lớn với hoàn cảnh này: **không cần người nghe, không cần AI chấm.**

- Một ô **10 phút/ngày**, tự ghi log, ghi âm bằng điện thoại.
- Chủ đề lấy luôn từ ngân hàng đề Speaking Part 2 — dùng lại `prompts.ts`.
- Số duy nhất cần nhập: **có nói hết được trong 2 phút ở lượt ba không**. Đủ để thấy tiến bộ,
  đủ nhẹ để không bỏ.
- Buổi gia sư nhận thêm nhiệm vụ: nghe một bản ghi lượt ba trong tuần, và để ý **đúng nhóm lỗi
  ngữ pháp mà kho lỗi Writing đang chỉ ra**. Đây là chỗ nối hai kỹ năng lại với nhau mà hiện
  chưa có.

**Phát âm** hiện không xuất hiện ở bất kỳ đâu trong lộ trình, dù chiếm 25% band Speaking. Thêm
nữa, luyện phát âm được ghi nhận là cải thiện cả khả năng **nghe** — trúng hai đích. Cách rẻ
nhất: 5 phút shadowing gắn vào chính ô 4/3/2, dùng lại đoạn nghe của hôm đó.

---

## 6. Lỗ hổng: Listening thiếu phần giải mã âm

Nghiên cứu về L2 listening tách hai tầng: **top-down** (đoán ý từ ngữ cảnh) và **bottom-up**
(giải mã âm, tách từ trong dòng nói liền). Luyện bottom-up có tác dụng riêng và **không thay thế
được bằng cách nghe nhiều hơn**. Repo hiện chỉ có "nghe lại phần sai kèm transcript" trong ô
Listening bấm giờ — đó là sửa đáp án, không phải luyện giải mã.

### Thiết kế đề xuất

- Một ô **chép chính tả 60–90 giây**, 10 phút, hai lần mỗi tuần: nghe và chép nguyên văn, rồi
  đối chiếu transcript.
- Thước đo dùng lại được nguyên: **lỗi trên 100 từ**, đúng hàm `errorDensity()` đang có. Đường
  cong này tụt xuống là bằng chứng trực tiếp cho việc nghe khá lên, sớm hơn nhiều so với band.
- Cái chép sai thường rơi vào âm nối, dạng yếu, đuôi `-s`/`-ed`. Đó cũng đúng những nhóm lỗi mà
  kho lỗi Writing đang theo dõi — nên **cho thẻ chép sai vào chung SRS**, cùng bộ `rule`.

---

## 7. Những gì cố ý không đổi

| Bị chất vấn | Giữ nguyên vì |
|---|---|
| Giai đoạn 0 và 1 cho viết **không bấm giờ** | Gần như mọi trang luyện thi đều nói "luôn bấm giờ". Đó là ý kiến huấn luyện thi, không phải kết quả nghiên cứu. Ở band 5.0, sức ép thời gian che mất vấn đề ngôn ngữ. Bấm giờ đã có từ giai đoạn 2, đúng chỗ của nó. |
| App **không chấm Speaking** | Chấm phát âm và độ trôi chảy bằng LLM từ văn bản là đoán mò. Gia sư là người thật, rẻ hơn và đúng hơn. |
| Coach mode **không trả band** ở hai giai đoạn đầu | Band ở vùng 5.0 nhiễu hơn tín hiệu. Trả một con số sai mỗi tuần còn hại hơn không trả gì. |
| Ôn lỗi vẫn là việc **số 1 mỗi ngày** | Retrieval trước, tiếp nhận sau. Đảo lại thì SRS luôn là thứ bị cắt khi hết giờ. |

---

## 8. Thứ tự triển khai đề xuất

Xếp theo giá trị trên công bỏ ra. Mỗi mục là một commit riêng.

| # | Việc | Vì sao trước |
|---|---|---|
| 1 | ~~**Chốt quỹ giờ** (mục 3.3) và cập nhật ROADMAP~~ ✅ | Ba lựa chọn dẫn tới ba lộ trình khác nhau; mọi thứ dưới đây phụ thuộc vào nó |
| 2 | ~~**Cảnh báo quỹ giờ** (mục 3.4)~~ ✅ | Rẻ, thuần hàm, và làm cho vấn đề số 1 hiện ra thay vì trôi |
| 3 | ~~**Thẻ từ vựng vào SRS** (mục 4)~~ ✅ | Lỗ hổng phương pháp lớn nhất, hạ tầng đã có sẵn |
| 4 | ~~**Ô 4/3/2** (mục 5)~~ ✅ | Không cần công cụ chấm, chỉ cần một ô tự log |
| 5 | ~~**Ô chép chính tả** (mục 6)~~ ✅ | Dùng lại `errorDensity()` và bộ `rule` đang có |

Mục 3, 4, 5 đều thêm việc vào tuần, nên **phải làm sau mục 1** — nếu không thì chính tài liệu
này lại nhét thêm giờ vào một lộ trình vốn đã không đủ giờ. Mục 1 đã chốt (xem 3.3b), nên ba mục
còn lại giờ mở đường: chúng **chính là** phần giờ tăng thêm mà quyết định đó cam kết.

---

## 8b. Đã triển khai (2026-09-08)

Toàn bộ mục 3–6 đã lên code. Quỹ giờ mức "tuần thường" đo lại từ `plan.ts`: **193 giờ tập
trung trong 26 tuần**, khớp con số ~194 dự tính ở 3.3b, với đường dốc 4,7 → 6,3 → 8,5 → 6,1
giờ mỗi tuần đúng như bảng.

| Mục | Nằm ở |
|---|---|
| Từ vựng | `lib/ielts/vocab.ts` (thuần), `server/ielts/vocab.ts`, `components/ielts/vocab-capture.tsx` |
| 4/3/2 | `logSpeakDrill()` trong `server/ielts/input.ts`, `components/ielts/speak-drill.tsx` |
| Chép chính tả | `server/ielts/dictation.ts`, `components/ielts/dictation-log.tsx` |
| Hàng đợi tách loại | `countDueSplit()` trong `server/ielts/reviews.ts` |

### Ba quyết định đáng ghi lại

**Thẻ từ vựng là điền vào chỗ trống, không phải từ → nghĩa.** `makeVocabCard()` thay cụm từ
trong chính câu đã gặp bằng `____`, mặt sau là cụm từ. Ôn kiểu đó là nhớ lại **cách dùng**,
đúng thứ Writing và Speaking cần, thay vì nhớ một nghĩa rời không biết ghép vào đâu. Không có
ngữ cảnh thì thẻ bị từ chối thẳng.

**Bắt lại không sinh thẻ thứ hai.** Một cụm gặp lại trong bài đọc sau đáng giá hơn một cụm đẹp
gặp một lần, nên thẻ cũ được kéo về hạn hôm nay và ngữ cảnh mới ghép thêm. Lần bắt lại **không**
tính vào trần 5 thẻ mới mỗi ngày.

**Chép chính tả dùng chung thước đo với Writing.** Số từ và số chỗ sai lưu vào
`study_session.raw_score` dạng `"4/86"`, mật độ tính lại bằng chính `errorDensity()`. Hai kỹ
năng chia nhau một thước đo thay vì mỗi bên một kiểu.

### Ba lỗi thật phát hiện khi kiểm chứng

1. **Trần thẻ đếm nhầm thẻ lỗi.** Lọc theo `error_type` là sai: một thẻ lỗi từ bài viết cũng
   mang `collocation`. Tệ hơn, so trùng có thể **sửa nhầm vào thẻ lỗi của bài viết**. Sửa bằng
   marker `error_card.source_ref` (`VOCAB_CARD_MARKER`, `DICTATION_CARD_MARKER`).
2. **Trần "mỗi ngày" lệch múi giờ.** SQLite mặc định `datetime('now')` là UTC, còn mọi cột ngày
   trong app là ngày địa phương. Ở UTC+7, thẻ tạo trước 7 giờ sáng mang ngày UTC hôm trước và
   không được đếm — trần bị vượt vào sáng sớm. Sửa bằng `toLocalTimestamp()` ghi tường minh.
3. **Bản production che thông điệp lỗi của server action.** `throw new Error("Hôm nay đã đủ 5
   thẻ")` đến tay người dùng thành *"An error occurred in the Server Components render"*. Mà lý
   do bị từ chối lại là phần đáng đọc nhất — nó dạy vì sao có luật đó. Thêm `ActionResult<T>`
   trong `lib/ielts/result.ts`: thất bại **đã lường trước** thì *trả về*, `throw` để dành cho lỗi
   ngoài dự tính. Áp cho `addVocabCard`, `logDictation`, và cả hai chỗ **có sẵn từ trước** cũng
   dính lỗi này là `logSlot`, `logDailyInput` và `updateProfile`.

**Test:** `npm run ielts:test` — 6 bộ, 85 check.

---

## 9. Nguồn

- Cambridge English — *How long will it take IELTS students to improve their band score?*
  https://www.cambridge.org/elt/blog/2021/07/14/how-long-ielts-students-improve-score/
  (trang trả HTTP 403 khi rà soát; con số 200 giờ lấy qua các nguồn dẫn lại)
- IELTS etc — *How many hours to improve your IELTS score? 12 key factors*
  https://ieltsetc.com/2020/07/how-long-does-it-take-to-get-ielts-band-7/
- *Investigating the Relationship between IELTS Scores and Receptive Vocabulary Size*
  https://www.academia.edu/38180476/Investigating_the_Relationship_between_IELTS_Scores_and_Receptive_Vocabulary_Size
- Phung & Ha (2022) — *Vocabulary Demands of the IELTS Listening Test*
  https://journals.sagepub.com/doi/full/10.1177/21582440221079934
- IELTS.org — *How to address vocabulary in an IELTS preparation course*
  https://www.ielts.org/news-and-insights/how-to-address-vocabulary-in-an-ielts-preparation-course
- *Relative Effects of Direct Focused and Unfocused Written Corrective Feedback* (ERIC)
  https://files.eric.ed.gov/fulltext/EJ1284730.pdf
- *Getting to the bottom of L2 listening instruction: Making a case for bottom-up activities* (ERIC)
  https://files.eric.ed.gov/fulltext/EJ1135116.pdf
- *Pronunciation Instruction Can Improve L2 Learners' Bottom-Up Processing for Listening*
  https://scholarship.richmond.edu/context/lalis-faculty-publications/article/1166/viewcontent/Pronunciation_Instruction_Can_Improve_L2_Learners_Bottom_Up_Processing_for_Listening_Accepted_Version.pdf
- *Improving Speaking Fluency Through 4/3/2 Technique and Self-Assessment* (TESL-EJ)
  https://www.tesl-ej.org/pdf/ej102/a1.pdf
- Saito (2021) — *Effects of the 4/3/2 Activity Revisited*
  http://kazuyasaito.net/LTR2021.pdf

**Lưu ý về mức độ chắc chắn:** các con số giờ ở mục 3 là quy tắc ngón tay cái được dẫn rộng rãi,
không phải kết quả đo trên một người học cụ thể. Dùng chúng để **phát hiện chênh lệch cỡ lớn** —
mà ở đây chênh lệch là cỡ gấp đôi — chứ đừng dùng để tính ngày thi tới từng tuần.
