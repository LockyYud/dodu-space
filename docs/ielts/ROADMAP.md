# Lộ trình IELTS 7.0 — bản v2 (chiến lược thực thi)

> Tài liệu nguồn cho lộ trình học của Duy, đồng thời là spec nội dung cho app
> `/ielts` trong `dodu-space`. Lộ trình được mã hoá trong `src/lib/ielts/plan.ts`.
> Bản v1 lập 2026-07-19. **Bản v2 lập 2026-09-07, reset mốc bắt đầu về 2026-09-07.**

---

## 1. Vì sao có bản v2

Bản v1 có chiến lược band đúng nhưng đổ ở khâu thực thi. Sau 7 tuần kể từ mốc
2026-07-19, dữ liệu thật chỉ ghi nhận 2 buổi học, hàng đợi vẫn đứng ở bài đầu tiên,
không có baseline, không có buổi Speaking nào và 3 error card chưa được ôn lần nào.

Nguyên nhân nằm ở thiết kế kế hoạch, không nằm ở ý chí:

| Lỗi thiết kế của v1 | Hệ quả |
|---|---|
| 60 phút/ngày, 7 ngày/tuần, không ngày bù | Bận một ngày là bỏ hẳn, bỏ vài ngày là mất đà |
| 140 bài khác nhau | Áp lực "phải học đúng bài hôm nay" thay vì hình thành thói quen |
| Speaking nằm ngoài kế hoạch | Không có điểm cam kết với người thật |
| Mốc thi cố định nhưng tiến độ theo hàng đợi | Ngày thi trôi đi trong im lặng, app không báo |
| Baseline chỉ là một dòng text | Không có số khởi điểm, mọi biểu đồ và khuyến nghị đều mù |
| Bước viết lại không được ép | Viết xong rồi thôi, vòng lặp đẩy band không khép lại |

Bản v2 giữ nguyên chiến lược band và thay toàn bộ cách thực thi.

---

## 2. Chiến lược band — giữ nguyên từ v1

IELTS overall là trung bình 4 kỹ năng, làm tròn 0.5. Tổng 27.0 đã đủ ra 7.0.

| Kịch bản | L | R | W | S | Tổng | Overall |
|---|---|---|---|---|---|---|
| Cân bằng (khó) | 7.0 | 7.0 | 7.0 | 7.0 | 28 | 7.0 |
| **Bù trừ (đang áp dụng)** ⭐ | 7.5 | 7.5 | **6.5** | 6.5 | 28 | **7.0** |

Kim chỉ nam: L/R là lợi thế từ nền TOEIC nên đẩy lên 7.5, Writing chỉ cần chạm 6.5
chắc chắn. Mục tiêu không ràng buộc band tối thiểu từng kỹ năng.

---

## 3. Sáu nguyên tắc của v2

1. **Thói quen trước, band sau.** Không tăng thời lượng khi chưa giữ được nhịp.
2. **Ít loại bài, lặp nhiều.** Ba vòng lặp cố định thay cho 140 bài riêng biệt.
3. **Có buffer.** 5 bài bắt buộc mỗi tuần, thứ Bảy là ngày bù, Chủ nhật nghỉ hẳn.
4. **Neo bằng người thật.** Buổi gia sư Speaking là điểm cam kết bên ngoài của tuần.
5. **Đo trước khi chạy.** Chưa có baseline thì chưa đặt ngày thi.
6. **Cho phép thua có kiểm soát.** Học thưa quá thì hạ tải, không để hàng đợi đứng im.

---

## 4. Hai giai đoạn

Tổng 20 tuần, 120 bài, trong đó **105 bài bắt buộc** và 15 ngày bù tuỳ chọn.

```
GIAI ĐOẠN A — Thói quen    4 tuần   (tuần 1–4)    25'/ngày · 5 bài/tuần
GIAI ĐOẠN B1 — Xây nền     8 tuần   (tuần 5–12)   45–60'/ngày · đề lẻ
GIAI ĐOẠN B2 — Luyện đề    8 tuần   (tuần 13–20)  45–60'/ngày · full test
```

### 4.1 Giai đoạn A — Thói quen (tuần 1–4), 25 phút/ngày

Mục tiêu duy nhất là giữ nhịp. Không mock, không ép độ dài bài viết.

| Ngày | Vòng lặp | Nội dung 25 phút | Đầu ra trong app |
|---|---|---|---|
| T2 | Writing | 1 đoạn body Task 2 (~120 từ) theo chủ đề tuần, chấm AI | submission + error card |
| T3 | Listening | 1 section, ghi "vì sao sai" | track session + card |
| T4 | Viết lại | Viết lại đoạn hôm T2 theo feedback | submission `is_rewrite` |
| T5 | Reading | 1 passage, ghi "vì sao sai" | track session + card |
| T6 | Speaking | Buổi gia sư: band ước tính + 1–3 lỗi | speaking session + card |
| T7 | Ngày bù | Làm bù bài thiếu, hoặc chỉ ôn SRS | tuỳ chọn |
| CN | Nghỉ | — | — |
| Mỗi ngày | SRS | 5–10 phút đầu buổi, trước mọi việc khác | review log |

**Tuần 1 bắt buộc có baseline.** Bài T3 và T5 của tuần 1 là bài đo: làm bấm giờ thật
rồi nhập band. App chặn lưu nếu thiếu band, vì đây là mốc so sánh của cả lộ trình.

**Điều kiện mở sang Giai đoạn B:** 4 tuần liên tiếp, mỗi tuần đạt đủ số bài bắt buộc.
Chưa đạt thì Giai đoạn A kéo dài thêm, không nhảy cóc. App tính điều kiện này qua
`habitGatePassed` và chỉ gợi ý đặt ngày thi sau khi đã qua.

**Listening thụ động:** 20 phút podcast mỗi ngày khi di chuyển, không tính vào 25 phút,
không cần trace. Đây là phần rẻ nhất để kéo Listening lên 7.5.

### 4.2 Giai đoạn B1 và B2 (tuần 5–20), 45–60 phút/ngày

Cấu trúc tuần giữ nguyên, chỉ tăng lượng đề.

| Ngày | Nội dung B1 (tuần 5–12) | Nội dung B2 (tuần 13–20) |
|---|---|---|
| T2 | Task 2 full 40 phút, chấm AI | như B1 |
| T3 | 2 Listening section | Listening full test 4 section |
| T4 | Viết lại Task 2 (30') + Task 1 (20') | như B1 |
| T5 | 2 Reading passage | Reading full test 3 passage |
| T6 | Buổi gia sư, kèm nhờ xem bản viết lại hôm T4 | như B1 |
| T7 | Ngày bù, hoặc mock ở tuần có mock | như B1 |
| CN | Nghỉ, ôn SRS nếu muốn | như B1 |

**Mock ở tuần 7, 10, 13, 16, 19.** Mock là bài bắt buộc, khung 3 giờ nằm ngoài ngân
sách ngày thường, và bắt buộc nhập cả band Listening lẫn band Reading.

**Chủ đề Writing xoay theo tuần:** Education, Environment, Technology, Health,
Society & Crime, Work & Career, Culture & Media, Government & Money. App hiển thị
chủ đề của tuần ngay trong bài.

---

## 5. Cột mốc band và quy tắc dời thi

| Mốc | Listening | Reading | Writing | Speaking |
|---|---|---|---|---|
| Baseline (tuần 1) | đo thật | đo thật | ~5.5 theo AI | gia sư đánh giá |
| Cuối B1 (tuần 12) | 6.5–7.0 | 7.0 | 6.0 | 6.0 |
| Trước thi (tuần 19) | **7.5** | **7.5** | **6.5** | **6.5** |

**Quy tắc dời thi:** nếu mock tuần 16 chưa đạt L+R ≥ 14.0, hoặc Writing dưới 6.0 ở
3 bài liên tiếp, thì dời thi 6 tuần. Không nén lộ trình để đuổi ngày thi.

**Mốc thi mặc định:** bắt đầu 2026-09-07, 20 tuần học cộng 2 tuần đệm, ngày thi sớm
nhất khoảng **2027-02-08**. Ngày thi để trống trong app cho tới khi qua được điều kiện
thói quen ở mục 4.1.

---

## 6. Chế độ hạ tải

Kế hoạch được phép thua, nhưng phải thua có kiểm soát.

- **Kích hoạt** khi 14 ngày gần nhất có dưới 6 ngày học.
- **Hành vi:** app hiện banner "chế độ giữ nhịp", đề xuất một phiên SRS 10 phút thay
  cho bài của hôm nay. Hàng đợi không trôi, bài vẫn nằm nguyên chỗ cũ.
- **Thoát** khi có 5 ngày học liên tiếp.

---

## 7. Phân vai từng kỹ năng trong app

| Kỹ năng | App làm gì | Nguồn học |
|---|---|---|
| 📖 Reading | Link ra web free, nhập điểm hoặc đọc screenshot, log lỗi vào SRS | Mini-IELTS, IELTS Online Tests, Cambridge 15–19 |
| 👂 Listening | Như Reading, cộng thêm dictation câu nghe sai | Mini-IELTS, BBC Learning English, Cambridge |
| ✍️ Writing | Lõi của app: AI chấm, sinh error card, ép vòng viết lại | Nội bộ app + đề Cambridge |
| 🗣️ Speaking | Bài bắt buộc mỗi tuần: ghi band và lỗi gia sư nêu | Gia sư |
| 🧠 Vocab/Grammar | Error log chung + SRS xuyên suốt | Sinh từ chính lỗi của bạn |

---

## 8. Nguồn học ngoài (free/public)

| Loại | Nguồn | Ghi chú |
|---|---|---|
| Đề Reading/Listening | Mini-IELTS · IELTS Online Tests | Có chấm tự động, dễ chụp màn hình |
| Đề gốc chất lượng | Cambridge IELTS 15–19 | Sát đề thật nhất |
| Listening bổ trợ | BBC 6 Minute English · TED Talks · British Council | Luyện tai và accent đa dạng |
| Lý thuyết và bài mẫu | IELTS Liz · engVid · British Council LearnEnglish | Task 2 band 7+ mẫu |
| Từ vựng | Academic Word List · collocation theo topic | Học theo cụm, không học lẻ |

---

## 9. Chỉ số app theo dõi

- Streak ngày liên tục và số bài bắt buộc đã hoàn thành trên tổng 105.
- **Pace:** số bài cần làm mỗi tuần để kịp ngày thi, so với mục tiêu tuần.
- Band từng kỹ năng theo thời gian, mốc từ baseline và các mock.
- Error card: tổng, đến hạn, và "lỗi cứng đầu" (lapses ≥ 3).
- Điều kiện thói quen: đã đủ 4 tuần liên tiếp đạt target hay chưa.
- Chế độ hạ tải: đang bật hay tắt.

---

## 10. Rủi ro và cách phòng

| Rủi ro | Cách phòng trong v2 |
|---|---|
| Bỏ bê Writing vì khó | Bài viết lại là bài riêng trong hàng đợi, mở sẵn bài gốc kèm feedback |
| Bận việc, đứt nhịp | Ngày bù thứ Bảy, Chủ nhật nghỉ, chế độ hạ tải khi học thưa |
| Học mãi không đo | Baseline bắt buộc ở tuần 1, mock bắt buộc 5 lần, đều chặn lưu nếu thiếu band |
| Ngày thi trôi trong im lặng | Chỉ số pace hiện trên Hôm nay và Tiến độ, đổi màu theo mức rủi ro |
| Mất động lực | Chênh lệch band giữa bài gốc và bản viết lại hiện ngay sau khi chấm |
| Speaking bị quên | Là bài bắt buộc mỗi tuần, không hoàn thành thì hàng đợi không đi tiếp |
