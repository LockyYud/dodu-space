# Chương 12: Eligibility Traces — Câu hỏi trắc nghiệm

> Bộ câu hỏi ôn tập chi tiết cho Chương 12, sách *Reinforcement Learning: An Introduction* (Sutton & Barto, 2nd ed.)

## Giới thiệu chung

**Câu 1.** Eligibility trace là gì và nó song hành với thành phần nào trong hệ thống học?

- A. Là một vector bộ nhớ dài hạn lưu giá trị tích lũy suốt vòng đời của toàn hệ thống học.
- B. Là vector bộ nhớ ngắn hạn `z_t ∈ R^d` song hành với weight vector dài hạn `w_t ∈ R^d`.
- C. Là một ma trận lưu trữ `n` feature vector gần nhất giống như cơ chế của n-step methods.
- D. Là một tham số vô hướng điều khiển tốc độ học, tương tự step-size `α`.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Eligibility trace là vector bộ nhớ ngắn hạn `z_t ∈ R^d`, cùng số chiều với weight vector `w_t`. Trong khi `w_t` là bộ nhớ dài hạn tích lũy suốt vòng đời hệ thống, thì `z_t` là bộ nhớ ngắn hạn (thường tồn tại ngắn hơn độ dài một episode). Khi một thành phần của `w_t` tham gia tạo ra giá trị ước lượng, thành phần tương ứng của `z_t` được "bump up" rồi mờ dần theo trace-decay parameter `λ`. A sai vì trace là short-term; C nhầm với n-step methods (chính cái mà trace tránh được); D nhầm trace với scalar parameter.

</details>

---

**Câu 2.** Eligibility traces hợp nhất (unify) và tổng quát hóa hai họ phương pháp nào, với hai đầu của phổ tương ứng với giá trị `λ` nào?

- A. Dynamic Programming ở `λ=0` và Monte Carlo ở `λ=1`.
- B. Monte Carlo ở `λ=1` và one-step TD ở `λ=0`.
- C. Q-learning ở `λ=0` và Sarsa ở `λ=1`.
- D. Forward view ở `λ=0` và backward view ở `λ=1`.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Khi TD methods được bổ sung eligibility traces, chúng tạo ra một họ phương pháp trải dài trên một phổ: Monte Carlo ở một đầu (`λ=1`) và one-step TD ở đầu kia (`λ=0`). Ở giữa là các phương pháp trung gian thường tốt hơn cả hai cực. A sai vì đầu `λ=0` là one-step TD chứ không phải DP; C nhầm với các thuật toán control cụ thể; D sai vì forward/backward view là hai cách nhìn cùng một thuật toán, không phải hai đầu của phổ `λ`.

</details>

---

**Câu 3.** Lợi thế tính toán chính của eligibility traces so với n-step methods là gì?

- A. Chúng đảm bảo hội tụ tới weight vector có sai số bình phương tối thiểu tuyệt đối.
- B. Chúng loại bỏ hoàn toàn nhu cầu tính TD error ở mỗi bước.
- C. Chỉ cần một trace vector duy nhất thay vì lưu `n` feature vector gần nhất, và học diễn ra liên tục đều đặn theo thời gian.
- D. Chúng loại bỏ nhu cầu duy trì weight vector `w_t` trong quá trình học.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Lợi thế tính toán chính là chỉ cần một trace vector duy nhất thay vì phải lưu `n` feature vector gần nhất. Học diễn ra liên tục, đều đặn theo thời gian thay vì bị trì hoãn rồi "đuổi kịp" ở cuối episode, và có thể ảnh hưởng đến hành vi ngay sau khi gặp một state thay vì bị trễ `n` bước. A sai (TD(λ) hội tụ tới điểm gần nhưng có cận sai số); B sai vì TD(λ) dùng TD error; D sai vì `w_t` vẫn là cốt lõi.

</details>

---

## 12.1 The lambda-return

**Câu 4.** Một update hướng về trung bình có trọng số của nhiều n-step returns khác nhau được gọi là gì, và điều kiện về trọng số là gì?

- A. Compound update; các trọng số phải dương và có tổng bằng 1.
- B. Bootstrapped update; các trọng số phải dương và có tổng bằng `γ`.
- C. Off-line update; các trọng số phải bằng nhau và tổng bằng 1.
- D. Simple update; các trọng số có thể âm miễn là tổng bằng 1.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Một update lấy trung bình các component updates đơn giản hơn được gọi là compound update. Bất kỳ tập n-step returns nào cũng có thể được trung bình hóa như vậy (kể cả tập vô hạn), miễn là các trọng số đều dương và có tổng bằng 1. Compound update có error reduction property tương tự n-step returns nên đảm bảo hội tụ. B sai (tổng bằng 1 chứ không phải `γ`); C sai (trọng số không cần bằng nhau — TD(λ) gán trọng số giảm dần); D sai (trọng số phải dương).

</details>

---

**Câu 5.** Công thức của λ-return (dạng state-based) trong phương trình (12.2) là:

- A. `G_t^λ = Σ_{n=1}^∞ λ^n G_{t:t+n}`
- B. `G_t^λ = λ Σ_{n=1}^∞ (1-λ)^{n-1} G_{t:t+n}`
- C. `G_t^λ = (1-λ) Σ_{n=1}^∞ λ^{n-1} G_{t:t+n}`
- D. `G_t^λ = (1-λ) Σ_{n=1}^∞ γ^{n-1} G_{t:t+n}`

<details>
<summary>Đáp án</summary>

**Đáp án: C** — λ-return được định nghĩa là `G_t^λ = (1-λ) Σ_{n=1}^∞ λ^{n-1} G_{t:t+n}`. Mỗi n-step update được gán trọng số tỷ lệ với `λ^{n-1}` (với `λ ∈ [0,1)`) và chuẩn hóa bởi thừa số `(1-λ)` để tổng trọng số bằng 1. A thiếu thừa số chuẩn hóa `(1-λ)` và lũy thừa sai; B hoán đổi vai trò `λ` và `(1-λ)`; D nhầm thừa số decay là `γ` thay vì `λ` (λ-return decay theo `λ`, không phải discount rate).

</details>

---

**Câu 6.** Trong λ-return, trọng số gán cho các n-step return giảm theo quy luật nào?

- A. Mọi n-step return có trọng số bằng nhau là `1/n`, không phụ thuộc khoảng cách thời gian.
- B. one-step return có trọng số lớn nhất `(1-λ)`, sau mỗi bước trọng số mờ đi thêm thừa số `λ`.
- C. one-step return có trọng số nhỏ nhất, trọng số tăng dần với các return dài hơn.
- D. Trọng số tăng theo cấp số nhân với hệ số `γ` cho tới khi gặp terminal state.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — one-step return được gán trọng số lớn nhất `(1-λ)`; two-step return có `(1-λ)λ`; three-step return có `(1-λ)λ^2`; v.v. Trọng số mờ đi thêm thừa số `λ` sau mỗi bước. Sau khi đạt terminal state, mọi n-step return tiếp theo đều bằng conventional return `G_t`. A sai (TD(λ) không trọng số đều); C đảo ngược (return ngắn có trọng số lớn hơn); D sai vì trọng số giảm theo `λ`, không tăng theo `γ`.

</details>

---

**Câu 7.** Khi `λ=1` và khi `λ=0`, λ-return rút gọn về cái gì (xem phương trình 12.3)?

- A. `λ=1` cho conventional return `G_t` (Monte Carlo); `λ=0` cho one-step return `G_{t:t+1}` (one-step TD).
- B. `λ=1` cho one-step TD; `λ=0` cho Monte Carlo.
- C. `λ=1` cho DP backup; `λ=0` cho compound update.
- D. Cả hai trường hợp đều rút gọn về conventional return `G_t`.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Khi `λ=1`, phần tổng chính trong (12.3) triệt tiêu về 0 và phần còn lại rút gọn về conventional return `G_t`, nên update theo λ-return là một thuật toán Monte Carlo. Khi `λ=0`, λ-return rút gọn về `G_{t:t+1}` — chính là one-step return, tức one-step TD. B đảo ngược hai trường hợp; C nhầm; D sai vì hai cực cho hai kết quả khác nhau.

</details>

---

**Câu 8.** Đặc điểm chính của off-line λ-return algorithm là gì?

- A. Cập nhật weight vector trên mỗi bước trong episode, dùng `G_{t:t+1}` làm target.
- B. Chỉ áp dụng được cho continuing problems chứ không cho episodic problems.
- C. Dùng eligibility trace để lan TD error ngược về các state đã thăm trước đó.
- D. Không thay đổi weight vector trong suốt episode; cuối episode mới thực hiện cả chuỗi semi-gradient update với λ-return làm target.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Off-line λ-return algorithm không thay đổi weight vector trong suốt episode. Đến cuối episode, cả một chuỗi off-line updates được thực hiện theo quy tắc semi-gradient thông thường, dùng λ-return làm target: `w_{t+1} = w_t + α[G_t^λ - v̂(S_t,w_t)] ∇v̂(S_t,w_t)`. A mô tả thuật toán online/TD chứ không phải off-line; B sai (đây là episodic); C mô tả backward view của TD(λ), không phải off-line λ-return (đây là forward view, chưa dùng trace).

</details>

---

**Câu 9.** Cách tiếp cận "nhìn về phía trước" (forward view) của một thuật toán học được mô tả như thế nào?

- A. Dùng TD error hiện tại để nhìn ngược về các state vừa thăm thông qua eligibility trace.
- B. Với mỗi state đã thăm, ta nhìn về phía trước tới mọi reward và state tương lai để quyết định cách kết hợp chúng cập nhật giá trị.
- C. Chỉ cập nhật state ngay liền trước state hiện tại, bỏ qua các state xa hơn.
- D. Bỏ qua hoàn toàn các reward tương lai và chỉ dùng immediate reward `R_{t+1}`.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Forward view (theoretical view): với mỗi state đã thăm, ta nhìn về phía trước tới mọi future reward và quyết định cách kết hợp tốt nhất. Sau khi cập nhật một state, ta chuyển sang state kế và không bao giờ phải làm việc với state trước đó nữa. Forward view khó cài đặt vì update phụ thuộc vào những thứ chưa xảy ra. A là backward view (TD(λ)); C mô tả TD(0); D sai vì forward view dùng toàn bộ tương lai.

</details>

---

## 12.2 TD(lambda)

**Câu 10.** TD(λ) cải thiện so với off-line λ-return algorithm theo ba cách. Đâu KHÔNG phải một trong ba cách đó?

- A. Cập nhật weight vector trên mỗi bước của episode chứ không chỉ ở cuối.
- B. Tính toán được phân bổ đều theo thời gian thay vì dồn hết vào cuối episode.
- C. Có thể áp dụng cho cả continuing problems chứ không chỉ episodic problems.
- D. Đảm bảo hội tụ về weight vector có sai số bình phương tối thiểu tuyệt đối.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — TD(λ) cải thiện theo ba cách: (1) cập nhật weight vector mỗi bước nên ước lượng có thể tốt hơn sớm hơn; (2) tính toán phân bổ đều theo thời gian; (3) áp dụng được cho continuing problems. Nó KHÔNG đảm bảo hội tụ về weight vector sai số tối thiểu — linear TD(λ) hội tụ về một weight vector gần đó phụ thuộc `λ`, với cận `VE(w_∞) ≤ (1-γλ)/(1-γ) · min_w VE(w)`. A, B, C đều là ba cải thiện thực sự.

</details>

---

**Câu 11.** Công thức cập nhật eligibility trace trong TD(λ) (phương trình 12.5) là gì?

- A. `z_t = λ z_{t-1} - ∇v̂(S_t,w_t)`, với `z_{-1} = 0`.
- B. `z_t = γ z_{t-1} + λ ∇v̂(S_t,w_t)`, với `z_{-1} = 0`.
- C. `z_t = z_{t-1} + γλ ∇v̂(S_t,w_t)`, với `z_{-1} = 0`.
- D. `z_t = γλ z_{t-1} + ∇v̂(S_t,w_t)`, với `z_{-1} = 0`.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Trace được khởi tạo `z_{-1} = 0` và cập nhật mỗi bước bằng value gradient rồi mờ đi theo `γλ`: `z_t = γλ z_{t-1} + ∇v̂(S_t,w_t)` với `0 ≤ t ≤ T`. Trong linear function approximation, `∇v̂(S_t,w_t)` chính là feature vector `x_t`. A có dấu trừ sai và thiếu `γ`; B đặt `λ` lên gradient thay vì lên decay; C không có decay nhân với trace cũ (sẽ tích lũy mãi mãi).

</details>

---

**Câu 12.** TD error cho state-value prediction và quy tắc cập nhật weight trong TD(λ) (phương trình 12.6 và 12.7) lần lượt là:

- A. `δ_t = R_{t+1} - v̂(S_t,w_t)` và `w_{t+1} = w_t + α δ_t x_t`.
- B. `δ_t = R_{t+1} + γ v̂(S_{t+1},w_t) - v̂(S_t,w_t)` và `w_{t+1} = w_t + α δ_t z_t`.
- C. `δ_t = v̂(S_t,w_t) - v̂(S_{t+1},w_t)` và `w_{t+1} = w_t + α z_t`.
- D. `δ_t = R_{t+1} + γλ v̂(S_{t+1},w_t)` và `w_{t+1} = w_t - α δ_t z_t`.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — TD error là `δ_t = R_{t+1} + γ v̂(S_{t+1},w_t) - v̂(S_t,w_t)` (12.6). Weight vector được cập nhật mỗi bước tỷ lệ với TD error vô hướng và vector trace: `w_{t+1} = w_t + α δ_t z_t` (12.7). A thiếu số hạng bootstrap `γv̂(S_{t+1})` và dùng `x_t` thay vì `z_t`; C đảo dấu và bỏ TD error; D dùng `γλ` sai chỗ và dấu trừ sai.

</details>

---

**Câu 13.** Tại sao TD(λ) được gọi là "oriented backward in time" (backward view)?

- A. Vì nó lưu toàn bộ trajectory rồi xử lý từ cuối episode ngược ra đầu.
- B. Vì nó tính các reward theo thứ tự ngược thời gian từ terminal về start.
- C. Vì tại mỗi thời điểm, ta nhìn vào TD error hiện tại và gán nó ngược về mỗi state trước đó theo mức độ state đó đóng góp vào trace hiện tại.
- D. Vì nó chỉ thực hiện học một lần ở cuối mỗi episode sau khi đã quan sát đủ.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — TD(λ) hướng về phía sau theo thời gian: tại mỗi thời điểm, ta nhìn vào TD error hiện tại và gán nó ngược về mỗi prior state tùy theo mức độ state đó đã đóng góp vào trace. Hình dung như đang "cưỡi" theo dòng state, tính TD error và "hét ngược" về các state đã thăm. Nơi TD error gặp trace là nơi diễn ra update (12.7). A, D mô tả off-line; B hiểu sai (reward không tính ngược).

</details>

---

**Câu 14.** Khi `λ=0`, vì sao TD(λ) rút gọn về one-step TD update (tức TD(0))?

- A. Vì khi `λ=0`, trace tại bước `t` đúng bằng value gradient của `S_t`, nên chỉ một state ngay trước được cập nhật bởi TD error.
- B. Vì khi `λ=0` thì TD error `δ_t` luôn bằng 0 nên không có update nào diễn ra.
- C. Vì khi `λ=0` thì weight update bị triệt tiêu hoàn toàn về `w_t`.
- D. Vì khi `λ=0` thì discount rate `γ` tự động trở thành 1.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Nếu `λ=0`, theo (12.5) trace tại bước `t` đúng bằng value gradient ứng với `S_t` (số hạng `γλ z_{t-1}` triệt tiêu). Do đó (12.7) rút gọn về one-step semi-gradient TD update (trong tabular case là quy tắc TD 6.2). Đây là lý do tên gọi TD(0) — chỉ một state ngay trước được cập nhật. B sai (`δ_t` không bằng 0); C sai (update vẫn diễn ra cho `S_t`); D sai (`γ` không liên quan tới `λ`).

</details>

---

**Câu 15.** TD(1) có lợi thế gì so với các Monte Carlo methods truyền thống đã trình bày trước đó?

- A. TD(1) cho sai số bình phương luôn nhỏ hơn TD(0) trong mọi bài toán.
- B. TD(1) áp dụng được cho discounted continuing tasks, chạy incrementally và online, học ngay từ episode đang diễn ra dở thay vì chờ episode kết thúc.
- C. TD(1) không bao giờ bootstrap nên hoàn toàn không có bias.
- D. TD(1) không cần đến eligibility trace nên rẻ hơn về bộ nhớ.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — TD(1) là cách cài đặt Monte Carlo tổng quát hơn. Trong khi MC truyền thống giới hạn ở episodic tasks và phải chờ kết thúc, TD(1) áp dụng được cho cả discounted continuing tasks, chạy incrementally và online. Online TD(1) học theo kiểu n-step TD từ episode đang dở, nên nếu có gì bất thường giữa episode, control methods dựa trên TD(1) có thể học và đổi hành vi ngay trong episode đó. A sai (không có đảm bảo này); C đúng phần "không bootstrap" nhưng không phải lợi thế then chốt được nêu; D sai (TD(1) vẫn dùng trace).

</details>

---

## 12.3 n-step Truncated lambda-return Methods

**Câu 16.** Vì sao cần đến truncated λ-return, và horizon `h` đóng vai trò gì?

- A. Vì λ-return luôn phân kỳ về vô cực trong continuing case nếu không cắt.
- B. Vì cần loại bỏ hoàn toàn TD error khỏi phép tính để tăng tốc độ.
- C. Vì horizon `h` thay thế cho discount rate `γ` trong việc giảm trọng số reward.
- D. Vì λ-return (12.2) chưa biết cho đến cuối episode (continuing case thì không bao giờ biết); cắt chuỗi sau `h` bước, với `h` đóng vai trò như thời điểm kết thúc `T`.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Off-line λ-return algorithm hạn chế vì λ-return chưa biết cho tới cuối episode (continuing case thì về kỹ thuật không bao giờ biết, vì phụ thuộc n-step return với `n` lớn tùy ý). Sự phụ thuộc yếu dần với reward trễ lâu hơn (giảm `γλ` mỗi bước). Truncated λ-return `G_{t:h}^λ` cắt sau số bước nhất định: `h` đóng vai trò như thời điểm kết thúc `T`, trọng số dư được gán cho n-step return dài nhất khả dụng `G_{t:h}`. A sai (λ-return không phân kỳ vì discount); B sai (vẫn dùng TD error); C sai (`h` không thay `γ`).

</details>

---

**Câu 17.** Họ thuật toán state-value dựa trên truncated λ-return được gọi là gì, và đặc tính tính toán của nó?

- A. Truncated TD(λ) hay TTD(λ); cài đặt hiệu quả sao cho tính toán mỗi bước không tỷ lệ với `n`.
- B. Online λ-return algorithm; tính toán mỗi bước tỷ lệ với `n^2`.
- C. True Online TD(λ); bắt buộc phải lưu mọi feature vector đã gặp.
- D. GTD(λ); luôn cần hai step-size parameter riêng biệt.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Họ này được gọi là Truncated TD(λ), hay TTD(λ). Giống n-step methods, update bị trễ `n` bước và chỉ tính `n` reward đầu, nhưng nay bao gồm mọi k-step return (`1 ≤ k ≤ n`) với trọng số hình học. TTD(λ) cài đặt hiệu quả sao cho tính toán mỗi bước KHÔNG tỷ lệ với `n` (dù bộ nhớ thì có), nhờ k-step λ-return viết được dưới dạng tổng các TD error `δ'_t`. B, C, D là các thuật toán khác.

</details>

---

**Câu 18.** [Khó] Trong truncated λ-return, vì sao sự phụ thuộc của target vào các reward bị trễ lâu lại "yếu dần" đủ để việc cắt chuỗi sau `h` bước không gây sai số lớn?

- A. Vì các reward trễ luôn bằng 0 nên cắt bỏ chúng không thay đổi gì.
- B. Vì horizon `h` được chọn đủ lớn để bao trùm toàn bộ episode trong mọi trường hợp.
- C. Vì mỗi bước trễ thêm, đóng góp của n-step return tương ứng bị nhân với thừa số `γλ`, nên trọng số của các return rất dài tiến nhanh về 0.
- D. Vì importance sampling tự động loại bỏ ảnh hưởng của các reward xa.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Sự phụ thuộc của λ-return vào các reward xa giảm theo thừa số `γλ` cho mỗi bước trễ thêm: trọng số của n-step return giảm dạng hình học (`λ^{n-1}`), và discounting `γ` càng làm yếu thêm ảnh hưởng. Do đó các return rất dài đóng góp rất ít, nên cắt chuỗi sau `h` bước chỉ bỏ đi phần đuôi nhỏ. A sai (reward không nhất thiết bằng 0); B sai (`h` thường nhỏ hơn episode); D sai (đây là context on-policy không cần IS).

</details>

---

## 12.4 Redoing Updates: Online lambda-return Algorithm

**Câu 19.** Ý tưởng cốt lõi của online λ-return algorithm là gì?

- A. Trên mỗi bước khi có thêm dữ liệu mới, quay lại làm lại tất cả update kể từ đầu episode, mỗi lần dùng horizon dài hơn một chút và luôn bắt đầu từ `w_0`.
- B. Chỉ thực hiện một update duy nhất ở cuối episode dùng full λ-return.
- C. Bỏ qua mọi update cũ và chỉ giữ lại update mới nhất ở bước hiện tại.
- D. Lấy trung bình toàn bộ weight vector của tất cả các horizon đã tính.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Ý tưởng: trên mỗi bước khi thu thập thêm một increment dữ liệu, ta quay lại làm lại toàn bộ các update kể từ đầu episode. Update mới tốt hơn vì tính thêm dữ liệu mới của bước hiện tại. Mỗi lần horizon nới rộng, mọi update làm lại bắt đầu từ `w_0`. Dạng tổng quát: `w_{t+1}^h = w_t^h + α[G_{t:h}^λ - v̂(S_t,w_t^h)] ∇v̂(S_t,w_t^h)`, với `w_t = w_t^t`. B là off-line; C, D mô tả sai bản chất "redoing".

</details>

---

**Câu 20.** Nhược điểm và ưu điểm chính của online λ-return algorithm so với off-line λ-return algorithm là gì?

- A. Đơn giản hơn về tính toán nhưng cho ước lượng kém chính xác hơn ở cuối episode.
- B. Tốn ít bộ nhớ hơn rõ rệt nhưng có nguy cơ phân kỳ trong continuing tasks.
- C. Phức tạp về tính toán hơn (mỗi bước quét lại phần episode đã qua), nhưng hoạt động tốt hơn — kể cả cuối episode — vì weight vector dùng để bootstrap đã được cập nhật nhiều lần hơn.
- D. Không cập nhật trong episode nhưng thực hiện nhiều update hơn ở cuối episode.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Online λ-return algorithm fully online (xác định `w_t` mới ở mỗi bước, chỉ dùng thông tin có tại bước `t`). Nhược điểm chính: phức tạp về tính toán — mỗi bước quét lại phần episode đã qua (phức tạp hơn cả off-line). Đổi lại nó hoạt động tốt hơn, không chỉ trong episode (off-line không update) mà cả ở cuối episode, vì weight vector dùng bootstrap trong `G_{t:h}^λ` đã trải qua nhiều update có thông tin hơn. A, B, D mô tả sai.

</details>

---

## 12.5 True Online TD(lambda)

**Câu 21.** True online TD(λ) có quan hệ thế nào với online λ-return algorithm, và "truer" nghĩa là gì?

- A. Là một xấp xỉ thô và rẻ tiền nhưng kém chính xác của online λ-return algorithm.
- B. Là cài đặt backward-view chính xác (exact) của online λ-return algorithm cho linear function approximation — tạo ra đúng cùng chuỗi weight vector `w_t`; "truer" vì trung thành với lý tưởng hơn TD(λ).
- C. Là một biến thể chỉ hoạt động đúng khi `λ=0`, các trường hợp khác phải xấp xỉ.
- D. Là một thuật toán bỏ hoàn toàn eligibility trace để giảm chi phí tính toán.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — True online TD(λ) là cài đặt backward-view chính xác và rẻ về tính toán của online λ-return algorithm cho linear function approximation. Nó được chứng minh tạo ra ĐÚNG cùng chuỗi weight vector `w_t` (van Seijen et al., 2016). Tên "true online" vì "truer" (trung thực hơn) với lý tưởng so với TD(λ). Chiến lược: chỉ cần các weight vector trên đường chéo `w_t^t`, đặt `w_t = w_t^t`. A sai (nó exact); C, D sai.

</details>

---

**Câu 22.** Trong true online TD(λ), quy tắc cập nhật weight (cho linear case `v̂(s,w) = w^T x(s)`) có dạng nào?

- A. `w_{t+1} = w_t + α δ_t z_t` (giống hệt TD(λ) thông thường).
- B. `w_{t+1} = w_t + α[G_t^λ - v̂(S_t,w_t)] x_t`.
- C. `w_{t+1} = w_t + α δ_t z_t + α(w_t^T x_t - w_{t-1}^T x_t)(z_t - x_t)`.
- D. `w_{t+1} = w_t - α δ_t (z_t + x_t)`.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — True online TD(λ) dùng `w_{t+1} = w_t + α δ_t z_t + α(w_t^T x_t - w_{t-1}^T x_t)(z_t - x_t)`, với `x_t = x(S_t)`, `δ_t` định nghĩa như TD(λ) (12.6). Bộ nhớ giống TD(λ), tính toán mỗi bước tăng ~50% (thêm một inner product), độ phức tạp vẫn O(d). A là TD(λ) thông thường (thiếu số hạng hiệu chỉnh); B là forward-view off-line; D sai dấu và cấu trúc.

</details>

---

**Câu 23.** Eligibility trace dùng trong true online TD(λ) (phương trình 12.11) được gọi là gì và có công thức nào?

- A. accumulating trace: `z_t = γλ z_{t-1} + x_t`.
- B. replacing trace: `z_{i,t} = 1` nếu `x_{i,t}=1`, ngược lại decay.
- C. followon trace: `z_t = ρ_t γ_t F_t + x_t`.
- D. dutch trace: `z_t = γλ z_{t-1} + (1 - αγλ z_{t-1}^T x_t) x_t`.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Trace (12.11) dùng trong true online TD(λ) gọi là dutch trace: `z_t = γλ z_{t-1} + (1 - αγλ z_{t-1}^T x_t) x_t`, để phân biệt với trace (12.5) trong TD(λ) thông thường — gọi là accumulating trace. Tên "dutch trace" ghi nhận đóng góp của van Seijen và van Hasselt. A là accumulating trace; B là replacing trace; C là followon trace (Emphatic-TD).

</details>

---

**Câu 24.** Replacing trace (12.12) được định nghĩa thế nào, và quan điểm hiện đại về nó ra sao?

- A. `z_{i,t} = 1` nếu `x_{i,t}=1`, ngược lại `z_{i,t} = γλ z_{i,t-1}`; chỉ định nghĩa cho tabular/binary features; ngày nay xem là xấp xỉ thô của dutch trace.
- B. `z_{i,t} = 0` ở mọi thành phần; được chứng minh vượt trội dutch trace trong mọi trường hợp.
- C. `z_t = γλ z_{t-1} + x_t` ở mọi thành phần; là dạng tổng quát nhất của trace.
- D. `z_{i,t} = αγλ` cố định; chỉ dùng được cho nonlinear function approximation.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Replacing trace chỉ định nghĩa cho tabular case hoặc binary feature vectors (như tile coding): `z_{i,t} = 1` nếu `x_{i,t}=1`, ngược lại `z_{i,t} = γλ z_{i,t-1}`. Ngày nay xem replacing traces như xấp xỉ thô của dutch traces, vốn phần lớn đã thay thế chúng và có cơ sở lý thuyết rõ hơn. Accumulating traces vẫn quan tâm cho nonlinear function approximation, nơi dutch traces không khả dụng. C là accumulating trace; B, D sai.

</details>

---

**Câu 25.** [Khó] Với binary features, xét một feature `i` được kích hoạt liên tiếp ở hai bước. So sánh giá trị trace `z_i` mà accumulating trace và replacing trace tạo ra. Sự khác biệt này dẫn tới rủi ro gì cho accumulating trace?

- A. Cả hai cho cùng giá trị; không có rủi ro đáng kể nào.
- B. Replacing trace cộng dồn còn accumulating trace bão hòa ở 1; rủi ro là replacing trace bị tràn số.
- C. Accumulating trace có thể vượt 1 (cộng dồn các lần kích hoạt) còn replacing trace bị chặn ở 1; accumulating trace có thể gán "credit" quá lớn cho một state được thăm lặp lại, làm tăng variance.
- D. Cả hai bị chặn ở 1 nhưng replacing trace decay nhanh hơn nên hội tụ chậm hơn.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Với feature `i` kích hoạt ở bước `t`: accumulating trace cộng `+1` vào giá trị đã decay (`z_i ← γλ z_i + 1`), nên nếu state được thăm lặp lại liên tiếp, `z_i` có thể vượt quá 1 và cộng dồn. Replacing trace đặt thẳng `z_i = 1`, bị chặn ở 1. Hệ quả: accumulating trace có thể gán credit quá lớn cho một state thăm nhiều lần, làm tăng variance — đây là động cơ lịch sử cho việc đề xuất replacing trace (và sau này là dutch trace). A, B, D mô tả sai cơ chế.

</details>

---

## 12.6 Dutch Traces in Monte Carlo Learning

**Câu 26.** Điểm bất ngờ và quan trọng của việc dẫn xuất dutch trace từ linear Monte Carlo (LMS) là gì?

- A. Nó chứng minh rằng eligibility traces chỉ có thể tồn tại trong khuôn khổ TD learning.
- B. Nó cho thấy traces (đặc biệt dutch trace) xuất hiện cả trong Monte Carlo learning — không liên quan TD; chúng cơ bản hơn TD, nhu cầu về trace nảy sinh bất cứ khi nào muốn học long-term predictions hiệu quả.
- C. Nó chứng minh Monte Carlo learning luôn rẻ hơn TD learning về tính toán.
- D. Nó chứng minh rằng LMS rule không thể được cài đặt theo kiểu incremental.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Dù gắn liền lịch sử với TD, traces thực ra không phụ thuộc TD. Linear MC algorithm (LMS rule), xem như forward view, dẫn ra được backward-view algorithm tương đương nhưng rẻ hơn dùng dutch traces (`z_t` ở đây là dutch trace cho trường hợp `γλ=1`). Điều này bất ngờ vì khái niệm trace nảy sinh trong bối cảnh KHÔNG có TD — trace cơ bản hơn TD, cần thiết bất cứ khi nào học long-term predictions hiệu quả. Đây là phép tương đương forward-/backward-view duy nhất được chứng minh tường minh trong sách; cài đặt incremental đạt O(d) và bỏ nhu cầu lưu mọi feature vector. A, C, D sai.

</details>

---

## 12.7 Sarsa(lambda)

**Câu 27.** Sarsa(λ) khác TD(λ) ở những điểm nào (quy tắc cập nhật, TD error, eligibility trace)?

- A. Dùng quy tắc cập nhật hoàn toàn khác và loại bỏ khái niệm TD error.
- B. Loại bỏ eligibility trace và quay lại dùng n-step return trực tiếp.
- C. Chỉ áp dụng cho bài toán prediction, không dùng được cho control.
- D. Dùng cùng quy tắc `w_{t+1} = w_t + α δ_t z_t` nhưng với action-value TD error `δ_t = R_{t+1} + γ q̂(S_{t+1},A_{t+1},w_t) - q̂(S_t,A_t,w_t)` và trace dùng `∇q̂` thay vì `∇v̂`.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Sarsa(λ) là TD method cho action values, xấp xỉ forward view của action-value λ-return. Nó dùng CÙNG quy tắc cập nhật như TD(λ): `w_{t+1} = w_t + α δ_t z_t`, nhưng với action-value TD error `δ_t = R_{t+1} + γ q̂(S_{t+1},A_{t+1},w_t) - q̂(S_t,A_t,w_t)`, và action-value trace `z_t = γλ z_{t-1} + ∇q̂(S_t,A_t,w_t)` (12.16). A, B, C đều mô tả sai (Sarsa(λ) vẫn dùng TD error, trace, và là phương pháp control).

</details>

---

**Câu 28.** Trong ví dụ Gridworld (Example 12.1), khi đạt goal, các phương pháp khác nhau cập nhật action-values như thế nào?

- A. Cả ba phương pháp (one-step, n-step, trace) đều tăng đồng đều mọi action-value trong episode.
- B. one-step cập nhật toàn bộ trajectory; eligibility trace chỉ cập nhật action cuối cùng.
- C. one-step chỉ tăng action value cuối; n-step tăng đều `n` action cuối (giả sử `γ=1`); eligibility trace cập nhật mọi action-value tới đầu episode, mờ dần theo recency.
- D. n-step không cập nhật gì cho tới khi episode tiếp theo kết thúc.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Khi đạt goal: one-step chỉ tăng action value cuối; n-step tăng đều `n` action cuối (giả sử `γ=1`); eligibility trace cập nhật mọi action-value tới tận đầu episode, ở mức khác nhau, mờ dần theo recency. Chiến lược fading này thường tốt nhất. Trên Mountain Car (Example 12.2), fading-trace bootstrapping của Sarsa(λ) học hiệu quả hơn n-step Sarsa. A, B đảo vai trò one-step và trace; D sai.

</details>

---

**Câu 29.** Trong pseudocode Sarsa(λ) với binary features, sự khác biệt giữa accumulating traces và replacing traces khi feature `i` đang active là gì?

- A. accumulating: `z_i = z_i + 1`; replacing: `z_i = 1`.
- B. accumulating: `z_i = 1`; replacing: `z_i = z_i + 1`.
- C. cả hai đều đặt `z_i = 0` rồi decay ở bước sau.
- D. accumulating: `z_i = γλ`; replacing: `z_i = αγλ`.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Với binary features, khi feature `i` thuộc tập active `F(S,A)`: accumulating traces đặt `z_i = z_i + 1` (cộng dồn), replacing traces đặt `z_i = 1` (thay thế). Hình 12.11 cho thấy True Online Sarsa(λ) tốt hơn Sarsa(λ) thông thường với cả accumulating lẫn replacing traces. Còn có biến thể clearing — đặt về 0 trace của state và các action không được chọn ở mỗi bước. B đảo ngược; C, D sai.

</details>

---

**Câu 30.** [Khó] Trên bài toán Mountain Car (Example 12.2), vì sao Sarsa(λ) với fading-trace bootstrapping thường học hiệu quả hơn n-step Sarsa, dù cả hai đều tổng quát hóa one-step Sarsa?

- A. Vì Sarsa(λ) không dùng bootstrapping nên tránh được bias hoàn toàn.
- B. Vì n-step Sarsa chỉ phân phối credit cho đúng `n` bước với trọng số bằng nhau, còn Sarsa(λ) phân phối credit cho mọi bước trước đó với trọng số giảm mượt theo recency, tận dụng thông tin tốt hơn và phản ứng nhanh với reward trễ.
- C. Vì n-step Sarsa cần lưu nhiều state hơn nên chạy chậm tới mức không học kịp.
- D. Vì Sarsa(λ) chỉ cập nhật khi gặp greedy action nên ổn định hơn.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Cả hai mở rộng one-step Sarsa, nhưng n-step Sarsa cứng nhắc: nó gán credit cho đúng `n` bước với cấu trúc trọng số cố định, phải chọn một `n` duy nhất. Sarsa(λ) phân phối credit cho mọi bước đã qua với trọng số mờ dần mượt theo recency (kết hợp mọi độ dài backup), nên dùng thông tin của trajectory tốt hơn và lan reward trễ về nhanh hơn — dẫn tới học hiệu quả hơn trên các task có reward trễ như Mountain Car. A sai (Sarsa(λ) vẫn bootstrap khi `λ<1`); C sai (chi phí không phải lý do); D mô tả Watkins's Q(λ), không phải Sarsa(λ).

</details>

---

## 12.8 Variable lambda and gamma

**Câu 31.** Việc tổng quát hóa `λ` và `γ` thành các hàm `λ_t = λ(S_t,A_t)` và `γ_t = γ(S_t)` mang lại điều gì, và vì sao termination function `γ` đặc biệt quan trọng?

- A. Nó đảm bảo thuật toán luôn hội tụ nhanh hơn so với `λ`, `γ` hằng số.
- B. Nó loại bỏ hoàn toàn nhu cầu về importance sampling trong off-policy learning.
- C. Nó cho phép trình bày cả episodic và continuing setting trên một luồng kinh nghiệm duy nhất không cần terminal state đặc biệt; `γ` thay đổi return — biến ngẫu nhiên cơ bản mà ta ước lượng kỳ vọng.
- D. Nó biến mọi return thành Monte Carlo return bất kể giá trị `λ`.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Tổng quát hóa mức độ bootstrapping và discounting thành hàm phụ thuộc state/action. Termination function `γ` đặc biệt quan trọng vì nó thay đổi return — biến ngẫu nhiên cơ bản mà ta tìm kỳ vọng: `G_t = R_{t+1} + γ_{t+1} G_{t+1}`. Một tiện lợi: trình bày episodic setting trên một luồng kinh nghiệm duy nhất, không cần terminal states; terminal state cũ thành state có `γ(s)=0` rồi về start distribution. A, B, D sai.

</details>

---

**Câu 32.** State-based λ-return tổng quát viết dưới dạng đệ quy (phương trình 12.18) là:

- A. `G_t^{λs} = R_{t+1} + λ_{t+1} G_{t+1}^{λs}`
- B. `G_t^{λs} = R_{t+1} + γ_{t+1} v̂(S_{t+1},w_t)`
- C. `G_t^{λs} = (1-λ) R_{t+1} + γ_{t+1} v̂(S_{t+1},w_t)`
- D. `G_t^{λs} = R_{t+1} + γ_{t+1}[(1-λ_{t+1}) v̂(S_{t+1},w_t) + λ_{t+1} G_{t+1}^{λs}]`

<details>
<summary>Đáp án</summary>

**Đáp án: D** — `G_t^{λs} = R_{t+1} + γ_{t+1}[(1-λ_{t+1}) v̂(S_{t+1},w_t) + λ_{t+1} G_{t+1}^{λs}]`. Diễn giải: λ-return là reward đầu tiên (không discount), cộng số hạng thứ hai tùy mức không discount ở state kế (`γ_{t+1}`, bằng 0 nếu state kế là terminal); số hạng đó lại chia hai phần theo mức bootstrapping — phần bootstrap là giá trị ước lượng tại state, phần còn lại là λ-return của bước kế. A bỏ qua discounting và bootstrapping; B là one-step TD target; C đặt `(1-λ)` sai chỗ.

</details>

---

## 12.9 Off-policy Traces with Control Variates

**Câu 33.** Đối với các phương pháp dùng λ-return không bị truncate, importance sampling được tích hợp như thế nào?

- A. Áp dụng trọng số importance sampling trực tiếp lên target return giống hệt n-step methods.
- B. Bỏ hoàn toàn importance sampling vì λ-return tự khử bias off-policy.
- C. Chỉ cần nhân TD error với discount rate `γ` ở mỗi bước là đủ.
- D. Không có lựa chọn thực tế nào áp trọng số lên target return; thay vào đó dùng bootstrapping generalization của per-decision importance sampling with control variates.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Với các phương pháp dùng non-truncated λ-return, KHÔNG có lựa chọn thực tế nào áp trọng số importance-sampling lên target return (như n-step methods ở Mục 7.3). Thay vào đó chuyển sang bootstrapping generalization của per-decision importance sampling with control variates (Mục 7.4). Single-step ratio là `ρ_t = π(A_t|S_t)/b(A_t|S_t)`. A bất khả thi với λ-return; B sai (vẫn cần IS); C không đủ.

</details>

---

**Câu 34.** General accumulating trace update cho state values với control variates (phương trình 12.25) là:

- A. `z_t = ρ_t(γ_t λ_t z_{t-1} + ∇v̂(S_t,w_t))`
- B. `z_t = γ_t λ_t z_{t-1} + ρ_t ∇v̂(S_t,w_t)`
- C. `z_t = ρ_t γ_t λ_t z_{t-1} + ρ_t^2 ∇v̂(S_t,w_t)`
- D. `z_t = γ_t λ_t (z_{t-1} + ∇v̂(S_t,w_t))`

<details>
<summary>Đáp án</summary>

**Đáp án: A** — `z_t = ρ_t(γ_t λ_t z_{t-1} + ∇v̂(S_t,w_t))` (12.25). Cùng quy tắc semi-gradient (12.7), đây là general TD(λ) cho cả on-policy lẫn off-policy. On-policy thì `ρ_t = 1` nên (12.25) về accumulating trace thông thường (12.5). Off-policy thường hoạt động tốt nhưng — là semi-gradient — KHÔNG đảm bảo ổn định. B chỉ nhân `ρ_t` vào gradient (sai vị trí); C có `ρ_t^2` thừa; D thiếu `ρ_t`.

</details>

---

**Câu 35.** Action-value eligibility trace với control variates dạng Expected Sarsa (phương trình 12.29) là `z_t = γ_t λ_t ρ_t z_{t-1} + ∇q̂(S_t,A_t,w_t)`. Khẳng định nào đúng?

- A. Nó được đảm bảo ổn định trong mọi trường hợp linear function approximation.
- B. Cùng expectation-based TD error (12.28) và quy tắc (12.7), tạo nên Expected Sarsa(λ) — áp dụng được cả on-policy lẫn off-policy; on-policy với `γ`, `λ` hằng số thì về Sarsa(λ).
- C. Nó không dùng được cho off-policy data vì thiếu importance sampling.
- D. Nó loại bỏ hoàn toàn nhu cầu về importance sampling ratio `ρ`.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — `z_t = γ_t λ_t ρ_t z_{t-1} + ∇q̂(S_t,A_t,w_t)` (12.29), cùng expectation-based action TD error `δ_t^a = R_{t+1} + γ_{t+1} V̄_t(S_{t+1}) - q̂(S_t,A_t,w_t)` (12.28) và quy tắc (12.7), tạo nên Expected Sarsa(λ) — dùng được cho cả on-policy lẫn off-policy, "có lẽ là thuật toán tốt nhất loại này hiện nay" (dù chưa đảm bảo ổn định cho tới khi kết hợp phương pháp Mục 12.11). On-policy với `γ`, `λ` hằng số và state-action TD error thông thường thì trùng Sarsa(λ). A sai (không đảm bảo ổn định); C, D sai (nó dùng `ρ` cho off-policy).

</details>

---

**Câu 36.** Khi `λ < 1`, các thuật toán off-policy này gặp vấn đề gì về ổn định?

- A. Chúng tự động loại bỏ deadly triad nhờ control variates.
- B. Chúng luôn ổn định trong mọi cấu hình function approximation.
- C. Tất cả đều bootstrap nên deadly triad áp dụng — chỉ đảm bảo ổn định cho tabular, state aggregation và vài dạng FA hạn chế; với linear/tổng quát hơn parameter vector có thể phân kỳ tới vô cực.
- D. Chúng chỉ hoạt động được khi đặt discount rate `γ = 0`.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Nếu `λ < 1`, mọi thuật toán off-policy này đều bootstrap nên deadly triad áp dụng (Mục 11.3): chỉ đảm bảo ổn định cho tabular case, state aggregation và vài dạng FA hạn chế. Với linear và tổng quát hơn, parameter vector có thể phân kỳ tới vô cực. Off-policy traces xử lý hiệu quả phần đầu của thách thức off-policy (sửa kỳ vọng target) nhưng không xử lý phần thứ hai (phân phối các update). A, B, D sai.

</details>

---

**Câu 37.** [Khó] Off-policy eligibility traces với control variates được nói là "xử lý phần đầu của thách thức off-policy nhưng không phần thứ hai". Hai phần đó là gì, và hệ quả thực tiễn là gì?

- A. Phần đầu là exploration, phần hai là exploitation; hệ quả là agent học chậm.
- B. Phần đầu là sửa kỳ vọng của target để đúng cho target policy `π`; phần hai là phân phối các update (distribution of updates) không khớp với `π`; vì traces chỉ sửa phần đầu mà không phần hai nên semi-gradient method vẫn có thể phân kỳ dưới function approximation.
- C. Phần đầu là giảm variance, phần hai là giảm bias; hệ quả là cần step-size nhỏ hơn.
- D. Phần đầu là discounting, phần hai là bootstrapping; hệ quả là phải đặt `λ=1`.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Off-policy learning có hai thách thức (Mục 11.1). Phần đầu: sửa kỳ vọng của target sao cho đúng với target policy `π` — importance sampling / control variates trong traces làm tốt việc này. Phần hai: phân phối các update (distribution of updates) sinh theo behavior policy `b` không khớp với phân phối on-policy của `π`. Traces không sửa phần hai, nên các semi-gradient off-policy method (như general TD(λ), Expected Sarsa(λ)) vẫn có thể bất ổn/phân kỳ dưới function approximation — đó là lý do cần các phương pháp ổn định ở Mục 12.11. A, C, D mô tả sai hai thành phần.

</details>

---

## 12.10 Watkins's Q(lambda) to Tree-Backup(lambda)

**Câu 38.** Watkins's Q(λ) xử lý eligibility trace như thế nào?

- A. Decay trace theo cách thông thường chừng nào còn chọn greedy action, rồi cắt trace về 0 ngay sau non-greedy action đầu tiên.
- B. Không bao giờ cắt trace, luôn decay đều theo `γλ` tới cuối episode.
- C. Cắt trace về 0 ngay sau greedy action đầu tiên, giữ nguyên khi non-greedy.
- D. Luôn nhân trace với importance sampling ratio `ρ_t` ở mỗi bước.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Watkins's Q(λ) decay trace theo cách thông thường chừng nào còn chọn greedy action, rồi cắt trace về 0 ngay sau non-greedy action đầu tiên. Chuỗi component update kết thúc hoặc ở cuối episode hoặc ở non-greedy action đầu tiên, tùy cái nào đến trước (Hình 12.12). B sai (nó có cắt); C đảo ngược greedy/non-greedy; D mô tả phương pháp dùng IS, không phải Watkins's Q(λ).

</details>

---

**Câu 39.** Tree-Backup(λ) (TB(λ)) khác biệt cốt lõi gì so với Expected Sarsa(λ), và eligibility trace của nó có dạng nào?

- A. TB(λ) chỉ áp dụng được cho on-policy data, khác Expected Sarsa(λ).
- B. TB(λ) dùng importance sampling ratio `ρ` trong trace thay vì target probability.
- C. TB(λ) giữ tính chất KHÔNG dùng importance sampling (kế thừa Q-learning); trace dùng target-policy probability: `z_t = γ_t λ_t π(A_t|S_t) z_{t-1} + ∇q̂(S_t,A_t,w_t)`.
- D. TB(λ) hoàn toàn không sử dụng eligibility trace.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — TB(λ) được lập luận là "true successor" của Q-learning vì giữ đặc tính hấp dẫn KHÔNG dùng importance sampling, dù vẫn áp dụng được cho off-policy data. Trace dùng target-policy probability của action được chọn: `z_t = γ_t λ_t π(A_t|S_t) z_{t-1} + ∇q̂(S_t,A_t,w_t)` (dùng `π(A_t|S_t)` thay `ρ_t`). Như mọi semi-gradient algorithm, TB(λ) không đảm bảo ổn định với off-policy data và FA mạnh. A, B, D mô tả sai.

</details>

---

**Câu 40.** [Khó] Watkins's Q(λ) cắt trace về 0 sau non-greedy action, còn Tree-Backup(λ) nhân trace với `π(A_t|S_t)`. Vì sao có thể xem cách làm của Watkins's Q(λ) như một trường hợp đặc biệt/thô hơn của cơ chế trong TB(λ)?

- A. Vì cả hai đều dùng importance sampling ratio nên hoàn toàn tương đương.
- B. Vì với target policy greedy/deterministic, `π(A_t|S_t)` bằng 1 cho greedy action (giữ nguyên trace) và bằng 0 cho non-greedy action (cắt trace về 0) — cơ chế nhân `π` của TB(λ) tổng quát hóa việc cắt cứng của Watkins's Q(λ).
- C. Vì Watkins's Q(λ) thực ra nhân trace với `π` chứ không cắt, hai thuật toán giống hệt nhau.
- D. Vì TB(λ) cũng cắt trace về 0 sau non-greedy action y hệt Watkins's Q(λ).

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Trace của TB(λ) nhân với `π(A_t|S_t)` mỗi bước. Nếu target policy là greedy/deterministic thì `π(A_t|S_t)=1` khi `A_t` là greedy action (trace giữ nguyên, decay bình thường) và `=0` khi `A_t` non-greedy (trace bị nhân 0, tức cắt về 0). Đó chính là hành vi của Watkins's Q(λ). Vậy cơ chế nhân `π` mượt của TB(λ) tổng quát hóa việc cắt cứng của Watkins's Q(λ) cho target policy tùy ý (stochastic). A, C sai (TB(λ) dùng `π` không phải `ρ`); D sai (TB(λ) nhân `π`, không cắt cứng nếu `π` stochastic).

</details>

---

## 12.11 Stable Off-policy Methods with Traces

**Câu 41.** Bốn phương pháp ổn định off-policy với traces (GTD(λ), GQ(λ), HTD(λ), Emphatic TD(λ)) dựa trên những ý tưởng nền nào, và giả định về function approximation?

- A. Dựa trên Monte Carlo learning; giả định nonlinear function approximation.
- B. Dựa trên dynamic programming; không cần function approximation nào.
- C. Dựa trên replacing traces; chỉ dùng được cho tabular case.
- D. Dựa trên Gradient-TD hoặc Emphatic-TD; đều giả định linear function approximation.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Bốn phương pháp đạt đảm bảo ổn định dưới off-policy training đều dựa trên Gradient-TD (Mục 11.7) hoặc Emphatic-TD (Mục 11.8), và đều giả định linear function approximation (có thể mở rộng nonlinear trong tài liệu). GTD(λ) tương tự TDC cho state values; GQ(λ) là Gradient-TD cho action values (làm control nếu target policy là ε-greedy); HTD(λ) là thuật toán lai; Emphatic TD(λ) mở rộng Emphatic-TD. A, B, C sai.

</details>

---

**Câu 42.** Đặc điểm hấp dẫn nhất của HTD(λ) là gì?

- A. Nó là strict generalization của TD(λ) sang off-policy: nếu behavior policy trùng target policy thì HTD(λ) trở thành đúng TD(λ) (điều không đúng với GTD(λ)).
- B. Nó hoàn toàn không cần duy trì weight vector trong quá trình học.
- C. Nó được chứng minh luôn hội tụ nhanh hơn mọi phương pháp khác trong nhóm.
- D. Nó loại bỏ được second step-size parameter mà các Gradient-TD methods cần.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — HTD(λ) là hybrid state-value algorithm kết hợp GTD(λ) và TD(λ). Đặc điểm hấp dẫn nhất: nó là strict generalization của TD(λ) sang off-policy — nếu behavior policy trùng target policy thì HTD(λ) trở thành đúng TD(λ), điều này KHÔNG đúng với GTD(λ). Hấp dẫn vì TD(λ) thường nhanh hơn GTD(λ) khi cả hai hội tụ và chỉ cần một step size. HTD(λ) có bộ trace thứ hai `z̄_t` (accumulating trace thông thường cho behavior policy). B, C, D sai.

</details>

---

**Câu 43.** Emphatic TD(λ) có ưu nhược điểm gì, và trong on-policy case nó so với TD(λ) ra sao về tính hội tụ?

- A. Variance thấp, hội tụ luôn nhanh hơn nhưng kém TD(λ) về độ chính xác.
- B. Không bao giờ hội tụ trong off-policy và giống hệt TD(λ) trong on-policy.
- C. Chỉ áp dụng được cho tabular case, không dùng được với function approximation.
- D. Giữ đảm bảo hội tụ off-policy mạnh ở mọi mức bootstrapping nhưng đánh đổi bằng variance cao và hội tụ có thể chậm; on-policy nó hội tụ với mọi hàm `γ` phụ thuộc state, còn TD(λ) chỉ đảm bảo với `γ` hằng số.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Emphatic TD(λ) giữ đảm bảo hội tụ off-policy mạnh trong khi cho phép mọi mức bootstrapping, nhưng đánh đổi bằng variance cao và hội tụ tiềm tàng chậm. Nó dùng emphasis `M_t`, followon trace `F_t`, và interest `I_t`. On-policy nó vẫn khác đáng kể TD(λ): Emphatic-TD(λ) đảm bảo hội tụ cho mọi hàm `γ` phụ thuộc state, còn TD(λ) chỉ đảm bảo với `γ` hằng số (phản ví dụ của Yu). A, B, C sai.

</details>

---

## 12.12 Implementation Issues

**Câu 44.** Trên máy tính tuần tự (serial computers) thông thường, làm sao để cài đặt tabular methods với eligibility traces hiệu quả mà không bị tốn kém?

- A. Phải cập nhật trace của mọi state ở mọi bước, không có cách nào tránh.
- B. Lợi dụng việc với `λ`, `γ` điển hình, trace của hầu hết state gần như luôn xấp xỉ 0; chỉ cần theo dõi và cập nhật vài trace có giá trị đáng kể (các state mới thăm gần đây).
- C. Bắt buộc phải dùng máy tính song song SIMD mới khả thi.
- D. Phải lưu toàn bộ trajectory rồi xử lý một lần ở cuối episode.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Cài đặt ngây thơ đòi hỏi mọi state cập nhật cả value lẫn trace ở mọi bước — không vấn đề trên máy song song SIMD hay ANN, nhưng tốn trên máy tuần tự. May mắn, với `λ`, `γ` điển hình, trace của hầu hết state gần như luôn xấp xỉ 0; chỉ các state mới thăm gần đây có trace đáng kể, nên chỉ cần theo dõi vài trace đó. Chi phí dùng traces trong tabular methods chỉ vài lần one-step method; với function approximation (ANN + backprop) traces thường chỉ tăng gấp đôi bộ nhớ và tính toán mỗi bước. A, C, D sai.

</details>

---

## 12.13 Conclusions

**Câu 45.** Theo kết luận chương, nên đặt eligibility trace methods ở đâu trên phổ từ Monte Carlo tới one-step TD, dựa trên bằng chứng thực nghiệm?

- A. Luôn đặt ở `λ=1` (Monte Carlo thuần túy) để tối đa hóa thông tin.
- B. Luôn đặt ở `λ=0` (one-step TD) để tối thiểu hóa variance.
- C. Một mức trung gian là tốt nhất: task có nhiều bước mỗi episode (hoặc trong half-life của discounting) thì dùng traces tốt hơn rõ rệt; nhưng nếu traces dài tới mức gần Monte Carlo thuần thì hiệu năng giảm mạnh.
- D. Không bao giờ nên dùng eligibility traces vì chi phí tính toán quá cao.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Bằng chứng thực nghiệm: trên task có nhiều bước mỗi episode (hoặc nhiều bước trong half-life của discounting), dùng traces tốt hơn rõ rệt so với không dùng (Hình 12.14). Ngược lại, nếu traces dài tới mức cho ra Monte Carlo thuần (hoặc gần vậy) thì hiệu năng giảm mạnh. Một mức trung gian là tốt nhất — traces nên đưa ta hướng về Monte Carlo nhưng không đi hết đường. A, B, D quá cực đoan.

</details>

---

**Câu 46.** Khi nào nên dùng và khi nào KHÔNG nên dùng eligibility traces?

- A. Luôn nên dùng trong mọi trường hợp vì traces luôn cải thiện tốc độ học.
- B. Chỉ nên dùng khi có nguồn dữ liệu rẻ và gần như vô hạn từ mô phỏng.
- C. Không bao giờ nên dùng cho các non-Markov tasks.
- D. Nên dùng khi dữ liệu khan hiếm và không thể xử lý lặp lại (ví dụ ứng dụng online); không đáng dùng trong ứng dụng off-line nơi dữ liệu sinh rẻ (mục tiêu là xử lý càng nhiều dữ liệu càng nhanh).

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Methods dùng traces cần nhiều tính toán hơn one-step methods nhưng học nhanh hơn đáng kể, đặc biệt khi reward bị trễ nhiều bước. Nên dùng khi dữ liệu khan hiếm và không thể xử lý lặp lại (ứng dụng online). Trong ứng dụng off-line nơi dữ liệu sinh rẻ, thường không đáng dùng traces — mục tiêu là xử lý càng nhiều dữ liệu càng nhanh, speedup-per-datum của traces không bõ chi phí. Vì làm TD giống Monte Carlo hơn, traces cũng có lợi trong non-Markov tasks — là "tuyến phòng thủ đầu tiên" chống cả long-delayed rewards lẫn non-Markov tasks. A, B, C sai.

</details>

---

**Câu 47.** [Khó] Một kỹ sư cho rằng "vì TD(λ) với `λ=1` tương đương Monte Carlo, ta nên luôn đặt `λ=1` để có ước lượng không thiên lệch (unbiased)". Lập luận này có vấn đề gì xét theo nội dung chương 12?

- A. Không có vấn đề gì — `λ=1` luôn là lựa chọn tối ưu vì loại bỏ bias.
- B. `λ=1` tuy giảm bias nhưng làm tăng variance mạnh và bỏ bootstrapping; thực nghiệm (Hình 12.14) cho thấy `λ` gần 1 (Monte Carlo thuần) làm hiệu năng giảm mạnh, mức trung gian mới tốt nhất nhờ cân bằng bias–variance.
- C. `λ=1` là sai vì khi đó eligibility trace luôn bằng 0 nên không học được.
- D. `λ=1` chỉ dùng được cho continuing tasks nên kỹ sư đã chọn nhầm setting.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Đặt `λ=1` (Monte Carlo) cho ước lượng ít bias hơn nhưng variance cao hơn nhiều và bỏ hoàn toàn lợi ích của bootstrapping. Bằng chứng thực nghiệm (Hình 12.14, Mục 12.13) cho thấy khi traces dài tới mức cho ra Monte Carlo thuần, hiệu năng giảm mạnh; một mức `λ` trung gian thường tốt nhất nhờ cân bằng bias–variance và lan credit hợp lý. Vậy "luôn `λ=1`" là sai. A sai (mâu thuẫn thực nghiệm); C sai (ở `λ=1` trace không bằng 0, mà decay theo `γ`); D sai (Monte Carlo cổ điển giới hạn ở episodic, nhưng đó không phải lỗi của lập luận).

</details>

---

**Câu 48.** [Khó] Một sinh viên dùng TD(λ) thông thường (accumulating trace) trên bài off-policy prediction với linear function approximation, và thấy weight vector phân kỳ tới vô cực dù dùng step-size rất nhỏ. Nguyên nhân khả dĩ nhất và hướng khắc phục theo chương 12 là gì?

- A. Step-size vẫn còn quá lớn; chỉ cần giảm `α` nhỏ hơn nữa là chắc chắn hội tụ.
- B. Đây là biểu hiện của deadly triad (bootstrapping + function approximation + off-policy): semi-gradient TD(λ) không đảm bảo ổn định trong off-policy; nên chuyển sang phương pháp ổn định như GTD(λ), GQ(λ) hoặc Emphatic TD(λ).
- C. Lỗi do dùng accumulating trace; chỉ cần đổi sang replacing trace là hết phân kỳ.
- D. Phải đặt `λ=0` vì TD(λ) chỉ ổn định khi `λ=0`, mọi `λ>0` đều phân kỳ.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Off-policy + bootstrapping (`λ<1`) + function approximation chính là deadly triad (Mục 11.3): semi-gradient TD(λ) không được đảm bảo ổn định trong setting này, parameter vector có thể phân kỳ tới vô cực bất kể step-size nhỏ thế nào. Khắc phục: dùng các phương pháp ổn định off-policy với traces ở Mục 12.11 — GTD(λ)/GQ(λ) (Gradient-TD) hoặc Emphatic TD(λ). A sai (giảm `α` không sửa được phân kỳ kiểu deadly triad); C sai (loại trace không phải nguyên nhân); D sai (`λ>0` không tự phân kỳ trong on-policy; vấn đề là off-policy).

</details>
