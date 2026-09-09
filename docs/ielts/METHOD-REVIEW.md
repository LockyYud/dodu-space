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

---

## 10. Xếp lại lịch theo quỹ thời gian thật (2026-09-08)

Phản hồi sau khi dùng bản đầy đủ: *"tôi chỉ dành được 30–60 phút thôi"*, và làm rõ thêm:
**ngày thường phải đi làm, chỉ rảnh buổi tối; cuối tuần thì nhiều thời gian hơn.**

### 10.1 Lỗi thiết kế

Tôi xếp lịch theo "mỗi kỹ năng cần bao nhiêu" mà **chưa bao giờ nhân với "người học có bao
nhiêu"**. Đo phút phải ngồi xuống, đã trừ podcast khi di chuyển, gia sư và mock:

| Giai đoạn | Ngày nặng nhất (bản cũ) |
|---|---|
| 0 — Quay lại | 55' |
| 1 — Học format | 70' |
| 2 — Nâng band | **100'** |
| 3 — Trước thi | 75' |

Giai đoạn 2 có bốn trong năm ngày vượt 60 phút. Không phải sát mép — gấp đôi.

Tệ hơn, lịch cũ rải đều T2–T6 và **bỏ trống cuối tuần**: đặt việc nặng đúng vào lúc không có
thời gian, và bỏ không hai ngày duy nhất có thời gian. Trường `learner_profile.daily_minutes`
đã tồn tại, có ô nhập trên trang Hồ sơ, nhãn ghi đúng "số phút rảnh mỗi ngày — và **không chỗ
nào trong app đọc nó**.

### 10.2 Hình dạng mới

**T2–T6 nhẹ · thứ Sáu nghỉ · việc dài dồn về T7 và CN.** Thứ Sáu nghỉ hẳn vì tối thứ Sáu sau
một tuần làm việc là buổi ít khả thi nhất; bản cũ chọn Chủ nhật làm ngày nghỉ, đúng ngược.

Bốn luật mới, mỗi luật có test:

1. **`WEEKDAY_DESK_CAP = 60`.** `deskMinutesForDay()` đo phút phải ngồi của một ngày cụ thể, và
   test chạy qua mọi giai đoạn × mọi mức tải × mọi tuần × T2–T6.
2. **`isOutsideDesk()`** loại gia sư và mock khỏi quỹ đó: một buổi là hẹn với người thật, một
   buổi là khối ba giờ cuối tuần. Cả hai không cạnh tranh với buổi tối ngày thường.
3. **`WeeklySlot.exclusive`** — mock chiếm trọn ngày của nó. Trước đó tuần có mock sẽ xếp mock
   *cộng* hai bài bấm giờ lên cùng một thứ Bảy, tức tái tạo đúng vấn đề đang sửa. Và nhường chỗ
   là đúng về nội dung: mock đã đo cả Listening và Reading.
4. **Buổi bấm giờ tính luôn là phần tiếp nhận của ngày.** `dailyItems()` nay khớp theo kỹ năng
   thay vì theo slot `input`: 50 phút Reading bấm giờ **là** đọc.

Hai thay đổi nội dung đi kèm: giai đoạn 2 rút bản viết lại từ 30 xuống **20 phút** (nó chỉ nhắm
tối đa năm nhóm lỗi đã chọn), và giai đoạn 3 **tắt ô bắt từ mới** — "không nạp bài mới" là nghĩa
đúng của giai đoạn taper, mà bắt từ mới chính là nạp bài mới.

### 10.3 Trang Hôm nay đọc quỹ thật

`profile.dailyMinutes` cuối cùng cũng được dùng: danh sách bị cắt theo nó vào T2–T6, việc vượt
quỹ tụt xuống dưới với dấu `+` và chữ "nếu còn thời gian", không tính vào số việc còn lại. Cuối
tuần không cắt. Podcast không ăn vào quỹ — trang loại nó giống hệt cách phần tính giờ loại nó,
bằng không trang sẽ cắt mất việc mà lịch coi là vẫn trong quỹ. Tiêu đề đổi thành
"~N phút **ngồi**".

### 10.4 Kết quả

| Mức tải | Ngày nặng nhất trong tuần thường | Tổng 26 tuần |
|---|---|---|
| Tuần bận (4 buổi) | 60' | **180 giờ** |
| Tuần thường (5 buổi) | 60' | **201 giờ** |
| Tuần rảnh (6 buổi) | 60' | **222 giờ** |

Quỹ giờ **tăng** so với bản trước (193 → 201) dù mỗi ngày thường nhẹ hơn, vì việc dài chuyển
sang cuối tuần thay vì bị nhồi vào buổi tối. Và ngay cả tuần bận cũng đạt 180 giờ — mép dưới
của khoảng cần cho 7.0 — vì cuối tuần không bị cắt khi tuần bận.

Cuối tuần đổi lại phải nặng thật: giai đoạn 2 có thứ Bảy 135 phút ngồi cộng một buổi gia sư.
Nếu chỗ này không khả thi thì phải cắt khối lượng hoặc lùi thi, không có đường thứ ba.

**Test:** `npm run ielts:test` — 6 bộ, 92 check.

---

## 11. App là sổ ghi chép, không phải hướng dẫn (2026-09-08)

Phản hồi sau khi dùng bản đã xếp lại lịch: *"tôi thực sự không hiểu là học như nào"*.

Đây là lỗ hổng nặng nhất trong cả loạt rà soát, và nó nằm ở tầng khác với mọi lỗi trước đó.
Những lần trước sai về *khối lượng* và *thời điểm*. Lần này sai về việc app **không dạy gì cả**:
mỗi dòng nói "làm 10 phút" rồi dừng.

Đọc lại từng dòng bằng mắt người chưa biết cách học:

| Ô | App nói | Người học còn thiếu |
|---|---|---|
| Nghe | "Podcast hoặc video khi di chuyển" | podcast nào, mức nào, nghe rồi làm gì |
| Đọc | "Một bài báo ngắn" | bài ở đâu, đọc kiểu gì, có tra từ không |
| Bắt từ mới | "4 cụm từ từ bài vừa đọc" | chọn cụm nào, theo tiêu chí gì |
| Drill ngữ pháp | "Đánh vào nhóm lỗi lặp nhiều nhất" | **nhóm nào**, và drill bằng bài tập gì |

Ô drill là tệ nhất: app bảo drill, **không cung cấp bài tập nào**, rồi mời bấm "Đã làm".

Nguồn học vốn có trong ROADMAP §8. Nhưng nó nằm trong tài liệu, tức nằm ngoài app, tức **không
tồn tại** với người đang mở trang lên để học.

### 11.1 `src/lib/ielts/howto.ts`

Mỗi ô — mọi ô hằng ngày và mọi suất tuần của cả bốn giai đoạn — có một `HowTo` gồm:

- `steps`: các bước đúng thứ tự, đủ cụ thể để làm ngay mà không phải hỏi thêm.
- `sources`: link thật, **lọc theo giai đoạn** (BBC 6 Minute English ở giai đoạn 0–1, TED ở
  giai đoạn 2 — không thể dùng chung một nguồn cho cả lộ trình).
- `pitfall`: cái bẫy hay gặp nhất của đúng ô đó.

Bốn bất biến có test: không ô nào của bất kỳ giai đoạn nào bị thiếu hướng dẫn; hướng dẫn nào
cũng có ít nhất ba bước và không bước nào cụt dưới 20 ký tự; mọi nguồn là `https://` thật; và
các bước là **văn bản thuần** — `HowToBlock` không parse markdown, nên `**đậm**` trong dữ liệu
sẽ hiện ra nguyên dấu sao (đã mắc đúng lỗi này lần đầu, giờ có test chặn).

Hiển thị bằng `<details>` server-rendered, mặc định đóng: mở ra không tốn JS, và danh sách vẫn
đọc được như một bản kế hoạch với người đã quen.

### 11.2 Ô drill có vật liệu thật

Dữ liệu để trả lời "nhóm nào" nằm ngay trong bảng thẻ. `topErrorRule()` đếm `error_card.rule`
và bỏ qua `other` — đó là thùng chứa phần không phân loại được, không phải một nhóm để luyện,
và trỏ người học vào đó thì không có unit ngữ pháp nào để mở.

Ô drill nay nói thẳng: *"Nhóm bạn lặp nhiều nhất: Danh từ số nhiều thiếu -s (2 thẻ) · Mở đúng
nhóm này · Tra: Murphy Unit 68–70"*. Link trỏ tới `/ielts/errors?rule=plural-s` — bộ lọc mới,
vì không có nó thì lời khuyên "đánh vào nhóm lỗi lặp nhiều nhất" là không làm theo được.

Bài tập là **chính những câu người học đã sai**: che phần sửa, tự viết lại, rồi so. Không cần
soạn nội dung, và nó đúng nguyên tắc retrieval practice trên vật liệu cá nhân hoá.
`RULE_STUDY_HINT` map từng nhóm lỗi sang đúng unit Murphy; test khẳng định cả năm nhóm nền tảng
của giai đoạn 0 đều tra được.

**Test:** `npm run ielts:test` — 7 bộ, 98 check.

---

## 12. Bắt từ mới: app dựng thẻ, người học chỉ đưa từ (2026-09-09)

Phản hồi: *"chỉ cần đưa các từ mới và app phải tự build các thành phần tương ứng kèm theo chứ
không phải để user điền hết"*. Đúng — bản đầu bắt người học chọn cụm, tìm câu chứa nó, dán cả
hai, rồi chọn loại. Bốn việc, trong đó ba việc app làm được.

### 12.1 Luồng mới

Dán một danh sách, mỗi dòng một cụm, bấm **Tra và dựng thẻ**. Một lời gọi LLM cho cả lô trả về,
cho mỗi cụm: dạng chuẩn (sửa chính tả, đưa về nguyên thể), loại (cụm / từ đơn), nghĩa tiếng
Việt ngắn, một câu ví dụ ở giọng học thuật, và 2–3 cụm hay đi cùng. Người học xem lại, bỏ tick
cụm không đáng học, rồi lưu một lượt.

**Nguyên tắc giữ lại từ bản đầu:** câu ví dụ lấy từ **bài người học vừa đọc** vẫn tốt hơn câu do
máy sinh, vì thứ cần nhớ là cách dùng trong ngữ cảnh đã gặp. Nên ô dán đoạn văn là **tuỳ chọn**:
có thì `sentenceContaining()` tìm câu thật trong đó và thẻ ghi rõ "câu từ bài bạn đọc"; không có
thì mới dùng câu model sinh.

Prompt có một luật đáng chú ý: **không được đoán nghĩa cho cụm không nhận ra** — phải ghi vào
`note` thay vì bịa. Cụm bị gắn cờ hiện mờ và không được tick sẵn.

### 12.2 Trần thẻ tính trên cả lô

`addVocabCards()` xử lý toàn bộ danh sách trong một transaction, đếm phòng còn lại từ đầu rồi
trừ dần. Nếu mỗi cụm tự kiểm tra riêng thì một lần dán 12 cụm sẽ làm trần thành vô nghĩa. Trả
về `{added, repeated, capped}` để người học biết chuyện gì đã xảy ra với từng phần. Kiểm thật:
đã có 2 thẻ, gửi 7 cụm → thêm 3, dừng ở trần 5, 4 cụm để mai.

### 12.3 Lỗi thật phát hiện khi kiểm chứng: mặt trước thẻ lộ đáp án

Người học ghi cụm ở dạng nguyên thể (`raise concerns`) còn bài đọc dùng dạng đã biến đổi
(`raised concerns`). `blankOut()` tìm nguyên dạng nên không khớp, và **mặt trước thẻ giữ nguyên
cả câu** — tức đáp án nằm ngay trên câu hỏi, thẻ vô dụng mà vẫn trông như bình thường.

Sửa bằng `termPattern()`: dựng regex theo từng từ của cụm, cho phép đuôi `s|es|ed|d|ing`, và bỏ
`-e` cuối trước khi thêm đuôi để bắt `mitigate → mitigating`. Khớp theo biên từ, nên `art` không
khớp vào giữa `startup`. `sentenceContaining()` nay dùng **chung** bộ khớp đó: tìm được câu bằng
luật này thì chắc chắn che được chỗ trống.

Khi vẫn không khớp nổi, thẻ **không** rơi về dạng hiện cả câu nữa mà chuyển sang hỏi cụm với
ngữ cảnh ở mặt sau — thà thẻ yếu hơn là thẻ lộ đáp án.

### 12.4 Ghi chú môi trường

`LLM_API_KEY` trong `.env` local đang bị từ chối: `401 Incorrect API key`. Phần tra cứu vì thế
được kiểm bằng một endpoint giả tương thích OpenAI, chạy trọn chuỗi tra → xem trước → lưu →
dựng thẻ. **Nếu key trên Vercel cũng là key này thì chấm Writing đang chết trên production** —
cần kiểm riêng.

**Test:** `npm run ielts:test` — 8 bộ, 111 check.
