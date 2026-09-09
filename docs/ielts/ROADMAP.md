# Lộ trình IELTS 7.0 — bản v3 (xây từ trình độ thật)

> Tài liệu nguồn cho lộ trình học của Duy và là spec nội dung cho app `/ielts` trong
> `dodu-space`. **Bản v3 lập 2026-09-08**, thay thế v2. Phần 9 đã triển khai xong trong
> `src/lib/ielts/plan.ts`. Xem thêm [METHOD-REVIEW.md](./METHOD-REVIEW.md) — rà soát phương
> pháp đối chiếu nghiên cứu, và **một chênh lệch quỹ giờ chưa được chốt**.

---

## 1. Vì sao có bản v3

Hai bản trước đều xây trên một giả định trình độ chưa được kiểm chứng, và đều có cùng một
lỗi hình dạng: xếp lịch cho đều thay vì xếp theo cách từng kỹ năng tiến bộ.

| Bản | Sai ở đâu | Bằng chứng |
|---|---|---|
| v1 (07/2026) | 60 phút × 7 ngày, không ngày bù, không tín hiệu lệch tiến độ | 2 buổi học trong 7 tuần |
| v2 (07/09) | Giữ được thói quen nhưng bài số 1 đã đo bằng thước band IELTS; bốn kỹ năng ép chung khuôn "mỗi ngày một bài"; giai đoạn chia theo tuần chứ không theo năng lực | Bài viết tự do đầu tiên bị chấm 4.5 kèm lời khuyên "viết 4 đoạn" |

v3 khác ở ba điểm gốc: **xuất phát từ trình độ đã hiệu chỉnh**, **ba luồng chạy song song với
nhịp khác nhau**, và **chuyển giai đoạn theo việc đã làm được**.

---

## 2. Trình độ xuất phát (đã hiệu chỉnh)

Duy chủ động hạ điểm TOEIC cũ để phản ánh thời gian nghỉ.

| Nguồn | Điểm | Quy đổi IELTS ước tính |
|---|---|---|
| TOEIC Listening & Reading | 700 | Listening ~5.5 · Reading ~5.5 |
| TOEIC Speaking & Writing | 220 / 400 | Writing ~5.0 · Speaking ~5.0 |

Mẫu viết tự do 102 từ ngày 07/09 xác nhận mức Writing: mật độ khoảng một lỗi mỗi tám từ,
tập trung ở năm nhóm **lỗi quy tắc lặp lại**: danh từ số nhiều, hoà hợp chủ ngữ và động từ,
thì, giới từ, viết hoa và mạo từ. Đây là loại lỗi sửa nhanh và cho lợi tức band cao nhất.

> Con số trên là **sàn**. Bài baseline thật làm ở cuối Giai đoạn 1 (mục 5) sẽ thay nó.

---

## 3. Mục tiêu và mức độ thực tế

Mục tiêu giữ nguyên: **overall 7.0**, không ràng buộc band tối thiểu từng kỹ năng. Mốc thi
muộn nhất: **đầu tháng 2/2027**, tức 22 tuần kể từ 2026-09-08.

Tổng 27.0 là đủ (27/4 = 6.75, làm tròn 7.0). Với xuất phát điểm mới, các kịch bản:

| Kịch bản | L | R | W | S | Tổng | Overall |
|---|---|---|---|---|---|---|
| Cơ sở, khả năng cao | 6.5 | 6.5 | 6.0 | 6.0 | 25 | 6.5 |
| Kéo L/R | 7.0 | 7.0 | 6.0 | 6.0 | 26 | 6.5 |
| **Đạt mục tiêu** | **7.5** | **7.5** | 6.0 | 6.0 | 27 | **7.0** |

Điều này nói thẳng: **7.0 vào tháng 2 chỉ xảy ra nếu Listening và Reading cùng lên 7.5**, tức
+2.0 band mỗi kỹ năng trong 22 tuần. Writing và Speaking chỉ cần 6.0, tức +1.0, dễ hơn v1 tưởng.

Quỹ giờ khả dụng trong 22 tuần, tính cả nghe thụ động và gia sư, vào khoảng 180 đến 200 giờ.
Đó xấp xỉ một bậc CEFR, tức B1+ lên B2, tương đương 5.5 lên 6.5 đồng đều. Vì vậy:

- **Kịch bản cơ sở là 6.5.** Kế hoạch được thiết kế để tối đa hoá cơ hội lên 7.0, không hứa.
- **Điểm quyết định ở tuần 14** (mục 5): mock cho L+R ≥ 14.0 thì đăng ký thi tháng 2; chưa
  thì dời sang tháng 4 hoặc 5/2027 và kéo dài Giai đoạn 2. Không nén.

---

## 4. Ba luồng, ba nhịp

Mỗi kỹ năng tiến bộ theo cách khác nhau, nên có nhịp khác nhau. Đây là thay đổi lớn nhất so
với v2.

| Luồng | Nhịp | Vì sao nhịp này | App làm gì |
|---|---|---|---|
| **Tiếp nhận** (Listening + Reading) | **mỗi ngày**, 20 đến 30 phút | L/R lên band nhờ khối lượng tiếp xúc; một bài mỗi tuần là quá thưa cho +2.0 band | tick "đã nghe / đã đọc" mỗi ngày; mỗi tuần một bài bấm giờ có ghi lỗi theo dạng câu hỏi |
| **Sản xuất** (Writing) | **2 lần mỗi tuần** + viết lại hôm sau | Writing lên band nhờ vòng phản hồi, không nhờ số lượng | viết → coach sửa → viết lại; đo **mật độ lỗi trên 100 từ** trước, band sau |
| **Speaking** | 2 buổi gia sư mỗi tuần | có người thật, là điểm neo cam kết của tuần | ghi band ước tính và lỗi; nhờ gia sư sửa cùng năm nhóm lỗi ngữ pháp ở trên |
| **SRS** | mỗi ngày, 5 đến 10 phút | keo dán của ba luồng | như hiện tại; một ngày chỉ ôn vẫn là một ngày học |

**Một ngày bình thường** = tiếp nhận + SRS, khoảng 25 đến 30 phút, phần lớn khi di chuyển.
**Hai ngày trong tuần** nặng hơn vì có viết. Chủ nhật chỉ nghe thụ động.

### 4.1 Tuần cố định theo thứ, ba mức tải

Bản v3 lúc đầu chỉ khai báo chỉ tiêu tuần mà không gắn vào thứ nào, nên câu hỏi "hôm nay làm
gì?" vẫn để người học tự trả lời mỗi sáng. Đó đúng là việc mà app tồn tại để làm. Nay mỗi giai
đoạn có một **lịch cố định theo thứ**, và một **mức tải tuần** để lịch cố định vẫn sống được
qua một tuần bận:

| Mức tải | Số buổi | Dùng khi |
|---|---|---|
| Tuần bận | 4 | tuần nhiều việc, chỉ giữ phần lõi |
| Tuần thường | 5 | nhịp mặc định |
| Tuần rảnh | 6 | tuần trống, chạy hết lịch |

### Ràng buộc thật: tối ngày thường 30–60 phút, cuối tuần rộng hơn

Bản lịch đầu rải đều T2–T6 và bỏ trống cuối tuần — tức đặt việc nặng đúng vào lúc không có
thời gian. Đo lại thì giai đoạn 2 có **bốn trong năm ngày vượt 60 phút**, ngày nặng nhất 100.
Nguyên nhân: lịch xếp theo "mỗi kỹ năng cần bao nhiêu" mà chưa bao giờ nhân với "người học có
bao nhiêu".

Lịch nay theo đúng nhịp sống: **T2–T6 nhẹ, thứ Sáu nghỉ, việc dài dồn về T7 và CN.**

| Giai đoạn | Nền phải ngồi | T2 | T3 | T4 | T7 | CN |
|---|---|---|---|---|---|---|
| 0 — Quay lại | 25' | 45' | 35' | 45' | 50' + gia sư | 60' + gia sư |
| 1 — Học format | 35' | 60' | 45' | 60' | 90' + gia sư | 100' + gia sư |
| 2 — Nâng band | 40' | 60' | 50' | 50' | 135' + gia sư | 100' + gia sư |
| 3 — Trước thi | 30' | 60' | 30' + gia sư | 60' | 70' + gia sư | — |

Ba luật đi kèm:

- **Không ngày thường nào vượt 60 phút ngồi.** Có test khẳng định, chạy trên mọi giai đoạn,
  mọi mức tải, mọi tuần. Gia sư và mock không tính vào quỹ này: một buổi là hẹn với người thật,
  một buổi là khối ba giờ cuối tuần.
- **Mock chiếm trọn ngày của nó.** Tuần có mock thì thứ Bảy chỉ có mock, hai bài bấm giờ nhường
  chỗ — chính mock đã đo cả Listening và Reading.
- **Một buổi bấm giờ tính luôn là phần tiếp nhận của ngày đó.** 50 phút Reading bấm giờ *là*
  đọc; đòi thêm một bài báo 15 phút trong cùng ngày là bắt làm hai lần một việc.

Trang Hôm nay còn cắt danh sách theo **quỹ mỗi tối** trong Hồ sơ học (mặc định 60 phút): việc
vượt quỹ tụt xuống dưới, ghi "nếu còn thời gian", và không tính vào số việc còn lại của ngày.
Cuối tuần không cắt.

Hai quy tắc giữ cho lịch cố định không biến thành sổ nợ:

1. **Chỉ tiêu tuần suy ra từ lịch**, không khai báo hai lần, nên lịch và bộ đếm không thể lệch.
2. **Làm muộn vẫn tính.** Một việc gắn vào thứ Ba coi như xong khi trong tuần đã có đủ số buổi
   của loại đó, bất kể chúng rơi vào thứ nào. Trượt một ngày chỉ dời việc sang hôm sau trong
   cùng tuần, không tạo ra ngày "trễ".

Tuần có mock nên để ở "Tuần rảnh": mock là khối ba giờ, chỉ nằm trong lịch của tuần rảnh.

---

## 4.2 Quỹ giờ — quyết định 2026-09-08

[METHOD-REVIEW.md](./METHOD-REVIEW.md) §3 chỉ ra bản 22 tuần chỉ cấp khoảng **130 giờ học tập
trung**, trong khi mốc thường được dẫn là 120–200 giờ cho mỗi band, và mục tiêu 7.0 là +1.5 band.
Duy chốt phương án kết hợp: **tăng giờ dần dần, và lùi ngày thi thêm khoảng một tháng.**

Lùi thi thực hiện bằng cách kéo **Giai đoạn 2 từ 12 lên 16 tuần** — bốn tuần thêm vào đúng giai
đoạn đắt nhất, nơi L/R phải lên +2.0 band, chứ không rải đều. Lộ trình thành **26 tuần**, ngày
thi sớm nhất khoảng **23/03/2027**.

Tăng giờ thì **không phải nhồi thêm bài cùng loại**. Ba bổ sung ở METHOD-REVIEW §4–6 chính là
phần giờ tăng thêm, và chúng vào theo thứ tự để đường dốc lên từ từ:

| Giai đoạn | Bổ sung | Giờ tập trung / tuần |
|---|---|---|
| 0 — Quay lại | thẻ từ vựng từ bài đọc | 5,4 |
| 1 — Học format | thêm ô 4/3/2 nói | 7,4 |
| 2 — Nâng band | thêm ô chép chính tả | 8,5 |
| 3 — Trước thi | bỏ từ vựng và chép chính tả | 6,4 |

Cộng lại, đo từ chính lịch tuần: **180 giờ ở tuần bận · 201 giờ ở tuần thường · 222 giờ ở tuần
rảnh**, so với 130 giờ của bản 22 tuần. Đáng chú ý là ngay cả **tuần bận cũng đạt 180 giờ** —
vì việc dài nằm ở cuối tuần, nơi tuần bận không cắt vào.

Nghĩa là: **6.5 được cấp vốn chắc chắn** (cần 120–200 giờ), và **7.0 chạm được mép dưới** của
khoảng 180–300. 7.0 vì thế vẫn là mục tiêu có điều kiện, không phải mục tiêu mặc định.

**7.0 vẫn là mục tiêu có điều kiện**, chỉ chốt sau mock tuần 13 và chỉ khi L/R đã chạm 7.0. Trang
Hôm nay nay hiện thẳng chênh lệch giờ thay vì để nó âm thầm trôi tới sát ngày thi.

*Trạng thái: đã lên code đầy đủ. Quỹ giờ đo lại từ `plan.ts` là **193 giờ** ở mức tuần thường,
đúng đường dốc trong bảng trên.*

---

## 5. Bốn giai đoạn, chuyển theo năng lực

Số tuần là dự kiến để khớp mốc tháng 2. Điều kiện ra mới là thứ quyết định.

### Giai đoạn 0 — Quay lại · tuần 1–3 · 08/09 → 28/09

Mục tiêu: ngồi xuống mỗi ngày, và triệt năm nhóm lỗi cơ bản. **Không band, không bấm giờ, không test.**

| Luồng | Việc làm |
|---|---|
| Tiếp nhận | 20' podcast dễ (BBC 6 Minute English) + 10' một bài báo ngắn, mỗi ngày |
| Sản xuất | 2 bài viết tự do 120–150 từ mỗi tuần theo gợi ý đời thường (kể về trường cũ, một ngày làm việc, một chuyến đi); **chế độ coach**: chỉ chỉ lỗi ngôn ngữ, sinh thẻ; hôm sau viết lại |
| Ngữ pháp | 10' mỗi hai ngày: drill năm nhóm lỗi, nạp vào SRS |
| Speaking | gia sư như thường, báo gia sư năm nhóm lỗi để sửa cả khi nói |

**Điều kiện ra:** ít nhất 14 trong 21 ngày có tiếp nhận · 6 bài viết đã có thẻ lỗi · mật độ lỗi
của hai bản viết lại gần nhất dưới 5 lỗi / 100 từ.

### Giai đoạn 1 — Học format · tuần 4–7 · 29/09 → 26/10

Mục tiêu: biết từng dạng câu hỏi, viết được essay đủ cấu trúc, rồi **đo baseline thật**.

| Tuần | Reading học dạng | Listening học dạng | Writing |
|---|---|---|---|
| 4 | True/False/Not Given | Form / note completion | 1 đoạn body cho một đề Task 2 thật (app đưa đề) |
| 5 | Matching headings | Map / plan labelling | 2 đoạn body cho cùng một đề |
| 6 | Matching information / features | Matching | Essay 4 đoạn, không bấm giờ, có band tham khảo |
| 7 | Gap fill / MCQ | MCQ | Essay 4 đoạn, không bấm giờ |

Tiếp nhận hằng ngày vẫn chạy nền. Mỗi tuần thêm **một passage và một section bấm giờ** đúng
dạng đang học, ghi "vì sao sai" theo dạng câu hỏi.

**Cuối tuần 7: baseline thật.** Một Listening đủ 4 section + một Reading đủ 3 passage, bấm giờ,
cùng một Task 2 40 phút. Đây là mốc thay cho ước tính ở mục 2.

**Điều kiện ra:** đã có baseline · essay 4 đoạn ≥ 250 từ · mật độ lỗi dưới 4 / 100 từ.

### Giai đoạn 2 — Nâng band · tuần 8–23 · 26/10 → 14/02

Mục tiêu: đẩy L/R về 7.5, giữ W/S ở 6.0, luyện sức bền.

| Luồng | Việc làm mỗi tuần |
|---|---|
| Tiếp nhận | nền hằng ngày, nâng độ khó (TED, bài giảng); **2 bài bấm giờ**: 1 Listening, 1 Reading; từ tuần 12 là full test |
| Sản xuất | 1 Task 2 đúng 40 phút có band + 1 viết lại; **Task 1 bắt đầu từ tuần 10**, mỗi hai tuần một bài |
| Speaking | gia sư 2 buổi; ghi band mỗi tháng |
| SRS | ưu tiên lỗi cứng đầu |

**Mock mỗi 3 tuần:** tuần 10, 13, 16, 19, 22. Khung 3 giờ cuối tuần, ngoài quỹ ngày.

**Điểm quyết định, tuần 14 (07/12):** dựa trên mock tuần 13.

| Kết quả mock tuần 13 | Quyết định |
|---|---|
| L + R ≥ 14.0 và Writing ≥ 5.5 | đăng ký thi tháng 3/2027 |
| L + R từ 13.0 đến 13.5 | đăng ký tháng 5/2027, kéo Giai đoạn 2 thêm 8 tuần |
| L + R dưới 13.0 | dời tháng 6/2027, hạ mục tiêu về 6.5 |

### Giai đoạn 3 — Trước thi · tuần 24–26 · 15/02 → 07/03

Mock cuối ở tuần 22, ngay trước khi vào giai đoạn này. Sau đó chỉ SRS và tiếp nhận nhẹ,
**không nạp bài mới**. Thi khoảng **08 đến 23/03/2027**.

---

## 6. Cột mốc band kỳ vọng

| Mốc | L | R | W | S | Tổng |
|---|---|---|---|---|---|
| Ước tính hiện tại | 5.5 | 5.5 | 5.0 | 5.0 | 21 |
| Baseline thật, cuối tuần 7 | 6.0 | 6.0 | 5.5 | 5.5 | 23 |
| Mock tuần 13, điểm quyết định | 6.5–7.0 | 6.5–7.0 | 5.5–6.0 | 6.0 | 24.5–26 |
| Mock tuần 22 | 7.0–7.5 | 7.0–7.5 | 6.0 | 6.0 | 26–27 |

Writing trong Giai đoạn 0 và 1 **không đo bằng band** mà bằng mật độ lỗi / 100 từ. Band chỉ
xuất hiện từ tuần 6.

---

## 7. Chế độ hạ tải

Giữ từ v2, có sửa: kích hoạt khi 14 ngày gần nhất có dưới 6 ngày học; hành vi là chỉ yêu cầu
tiếp nhận 10 phút + SRS; **một ngày chỉ ôn SRS vẫn là một ngày học**; thoát khi cửa sổ 14 ngày
đủ 6 ngày trở lại.

Từ 2026-09-08 chế độ này chỉ báo, không tự đổi lịch: nó khuyên hạ tuần xuống **Tuần bận**, và
việc hạ là quyết định của người học. Nó cũng chỉ bật sau 14 ngày kể từ lúc bắt đầu lộ trình,
vì trước đó cửa sổ 14 ngày chưa có nghĩa.

---

## 8. Nguồn học

> Bảng này nay đã **nằm trong app**: mỗi ô trên trang Hôm nay có phần "Cách làm" gồm các bước
> cụ thể và link nguồn lọc theo giai đoạn. Xem `src/lib/ielts/howto.ts` và METHOD-REVIEW §11.
> Nguồn nằm trong tài liệu là nguồn không tồn tại với người đang mở app lên để học.


| Loại | Nguồn |
|---|---|
| Nghe thụ động | BBC 6 Minute English (GĐ 0–1) · TED Talks, BBC Learning English "Lingohack" (GĐ 2) |
| Đề Reading / Listening | Mini-IELTS · IELTS Online Tests · Cambridge IELTS 15–19 |
| Lý thuyết dạng câu hỏi | IELTS Liz · British Council LearnEnglish |
| Ngữ pháp năm nhóm lỗi | English Grammar in Use (Murphy), các unit về số nhiều, hoà hợp, thì, giới từ, mạo từ |
| Từ vựng | Academic Word List, học theo collocation trong bài đọc hằng ngày |

---

## 9. App đã đổi gì (triển khai 2026-09-08)

Phần giữ nguyên: SRS, Track, Speaking, chế độ hạ tải, hồ sơ học, auth. Phần đã viết lại,
tất cả đều có test trong `npm run ielts:test`:

1. ✅ **Hàng đợi tuyến tính 105 bài → checklist ngày + suất tuần.** Mỗi ngày: tiếp nhận + SRS.
   Mỗi tuần: 2 suất viết, 1–2 bài bấm giờ, 2 buổi gia sư. `plan.ts` mô tả giai đoạn và suất,
   không mô tả từng ngày.
2. ✅ **Chuyển giai đoạn theo điều kiện ra**, tính từ dữ liệu thật: ngày có tiếp nhận, số bài viết,
   mật độ lỗi, baseline đã có hay chưa. Không theo tuần đã trôi.
3. ✅ **Chế độ coach cho Writing.** Prompt riêng, trả nhận xét và thẻ lỗi, không trả band, không
   ghi band vào buổi học. Ẩn ô band, ẩn nhãn Task, đồng hồ chỉ là gợi ý mềm.
4. ✅ **Mật độ lỗi / 100 từ** là chỉ số tiến bộ Writing ở Giai đoạn 0 và 1; bản viết lại so số
   lỗi, không so band.
5. ✅ **Ngân hàng đề**: gợi ý đời thường cho Giai đoạn 0, đề Task 2 thật theo chủ đề cho Giai
   đoạn 1 trở đi. Ô đề bài không còn tuỳ chọn.
6. ✅ **Thẻ lỗi**: yêu cầu AI trích 3 đến 5 thẻ, mỗi thẻ một lỗi, gộp trùng; UI giữ tối đa 3.
7. ✅ **Baseline** dời về cuối Giai đoạn 1. **Điểm quyết định tuần 14** hiện thành một thẻ trên
   trang Hôm nay với ba nhánh ở mục 5.
8. ✅ **Tiếp nhận hằng ngày** là một hành động mới trong app: một nút "đã nghe / đã đọc" với số
   phút, không cần nguồn, không cần điểm.
9. ✅ **Chấm bài AI làm lại** theo `TECH-DESIGN.md` §10: tách bước trích lỗi khỏi bước chấm, hai
   chế độ coach và band, descriptor thật thay tóm tắt, trung vị nhiều mẫu, thẻ một lỗi có
   `rule` để đếm lỗi lặp, và **bộ đo chuẩn** để biết chấm có tốt hơn hay không thay vì cảm giác.

### Ghi chú triển khai

- `src/lib/ielts/plan.ts` chỉ còn mô tả giai đoạn, mục tiêu ngày và suất tuần. Không còn
  khái niệm "bài số N".
- `src/lib/ielts/progress.ts` là nơi duy nhất đánh giá dữ liệu thật so với kế hoạch; thuần và
  có test, nên các ngưỡng không thể trôi khỏi tài liệu này nữa.
- `study_session.slot` là đơn vị đếm cho cả ngày lẫn tuần. Ôn SRS, tiếp nhận, viết, viết lại,
  bấm giờ, mock và gia sư đều ghi slot riêng.
- Điểm quyết định tuần 14 nằm ở tiêu chí ra của Giai đoạn 2: đủ 4 mock có band, và đã chốt
  ngày thi. Bảng ba nhánh ở mục 5 là quyết định của bạn, app chỉ cung cấp số.
