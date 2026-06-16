# Chương 2: Multi-armed Bandits — Câu hỏi trắc nghiệm

> Bộ câu hỏi ôn tập chi tiết cho Chương 2, sách *Reinforcement Learning: An Introduction* (Sutton & Barto, 2nd ed.)

## 2.1 A k-armed Bandit Problem

**Câu 1.** Đặc điểm quan trọng nhất phân biệt reinforcement learning với các loại học khác là gì?

- A. Nó dùng evaluative feedback — đánh giá hành động đã thực hiện tốt đến đâu, thay vì chỉ ra hành động đúng nên làm.
- B. Nó dùng instructive feedback — chỉ ra hành động đúng cần thực hiện độc lập với hành động đã chọn.
- C. Nó luôn yêu cầu một tập dữ liệu được gán nhãn trước bởi một supervisor bên ngoài.
- D. Nó học mà không cần bất kỳ active exploration nào, chỉ dựa trên dữ liệu quan sát thụ động.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — RL dùng training information mang tính evaluative (đánh giá hành động đã thực hiện tốt đến đâu), chứ không phải instructive (chỉ ra hành động đúng độc lập với hành động đã chọn — đây là cơ sở của supervised learning, phương án B). Chính evaluative feedback tạo ra nhu cầu active exploration, nên C và D đều sai.

</details>

---

**Câu 2.** Trong bài toán k-armed bandit, "value" của một hành động `a` được định nghĩa là gì?

- A. Tổng tích lũy của mọi phần thưởng nhận được khi chọn `a` trong suốt quá trình học.
- B. Phương sai (variance) của phân phối phần thưởng tương ứng với việc chọn hành động `a`.
- C. Phần thưởng kỳ vọng (mean reward) khi `a` được chọn: q*(a) = E[Rt | At = a].
- D. Số lần hành động `a` được chọn tính tới thời điểm hiện tại, ký hiệu Nt(a).

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Value của hành động là phần thưởng kỳ vọng (trung bình) khi hành động đó được chọn: q*(a) = E[Rt | At = a]. Qt(a) là estimated value của `a` tại time step t, và ta muốn Qt(a) tiến gần q*(a). Tổng tích lũy (A), variance (B) và số lần chọn (D) đều là các đại lượng khác.

</details>

---

**Câu 3.** Theo định nghĩa trong sách, "greedy actions" là gì?

- A. Những hành động chưa từng được chọn lần nào tính tới thời điểm hiện tại.
- B. Hành động (hoặc các hành động) có estimated value Qt(a) cao nhất tại time step hiện tại.
- C. Những hành động được rút ra một cách ngẫu nhiên đồng đều giữa k lựa chọn.
- D. Hành động (hoặc các hành động) có true value q*(a) cao nhất trong bài toán.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Greedy actions là những hành động có estimated value Qt(a) lớn nhất tại thời điểm hiện tại. Chọn greedy action gọi là exploiting; chọn nongreedy action gọi là exploring. Lưu ý greedy dựa trên *ước lượng* Qt(a) chứ không phải true value q*(a) (phương án D là một bẫy phổ biến).

</details>

---

**Câu 4.** Tại sao đôi khi nên exploring thay vì luôn exploiting?

- A. Vì exploring luôn mang lại phần thưởng tức thời (immediate reward) cao hơn so với exploiting.
- B. Vì greedy action gần như luôn là lựa chọn sai trong các bài toán bandit thực tế.
- C. Vì exploring không bao giờ làm giảm phần thưởng, kể cả trong ngắn hạn lẫn dài hạn.
- D. Vì exploiting tối ưu cho immediate reward, nhưng exploring có thể cho greater total reward dài hạn.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Exploitation là đúng để tối đa expected reward trong một bước, nhưng exploration có thể tạo ra greater total reward trong dài hạn: phần thưởng thấp hơn trong ngắn hạn khi exploring nhưng cao hơn về sau vì sau khi phát hiện hành động tốt hơn ta có thể exploit chúng nhiều lần. Đây là "conflict" giữa exploration và exploitation. A sai vì exploring thường cho immediate reward thấp hơn.

</details>

---

**Câu 5.** [Khó] Việc nên explore hay exploit phụ thuộc vào những yếu tố nào theo sách?

- A. Chỉ phụ thuộc vào giá trị ε được chọn trước, độc lập với trạng thái ước lượng hiện tại.
- B. Phụ thuộc tinh tế vào estimates hiện tại, uncertainties của chúng, và số bước còn lại.
- C. Chỉ phụ thuộc vào reward variance của bài toán, không liên quan tới số bước còn lại.
- D. Chỉ phụ thuộc vào việc bài toán là stationary hay nonstationary, không gì khác.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Sách chỉ ra rằng việc explore hay exploit ở một thời điểm phụ thuộc một cách tinh tế (intricate) vào các estimates hiện tại, uncertainties của chúng, và số bước còn lại. Exploration có lợi khi uncertainty về các nongreedy action còn lớn và còn nhiều bước để tận dụng tri thức thu được. Các phương án A, C, D đều quy giản vấn đề về một yếu tố đơn lẻ.

</details>

---

## 2.2 Action-value Methods

**Câu 6.** Phương pháp sample-average ước lượng action value như thế nào?

- A. Lấy phần thưởng lớn nhất từng nhận được trong các lần chọn hành động `a` trước đó.
- B. Trung bình các phần thưởng thực tế nhận được khi `a` được chọn trước thời điểm t.
- C. Giữ nguyên giá trị khởi tạo Q1(a) cố định và không cập nhật theo thời gian.
- D. Trọng số theo cấp số nhân giảm dần cho các phần thưởng gần đây nhất.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Sample-average lấy trung bình các phần thưởng thực tế nhận được: Qt(a) = (tổng phần thưởng khi chọn `a` trước t) / (số lần chọn `a` trước t). Theo law of large numbers, khi mẫu số tiến tới vô cùng, Qt(a) hội tụ về q*(a). Phương án D mô tả constant step-size (exponential recency-weighted), không phải sample-average.

</details>

---

**Câu 7.** Quy tắc greedy action selection được viết là At = argmax_a Qt(a). Điều nào đúng về nó?

- A. Nó luôn dành một phần thời gian để sample các hành động trông kém để kiểm tra lại chúng.
- B. Nó chỉ áp dụng được cho các bài toán nonstationary, không dùng cho stationary.
- C. Nó luôn exploit kiến thức hiện tại để tối đa immediate reward, không sample các action kém.
- D. Nó chọn ngẫu nhiên đồng đều giữa tất cả k hành động ở mỗi time step.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Greedy action selection luôn exploit kiến thức hiện tại để tối đa immediate reward; nó không dành thời gian nào để sample các hành động trông kém hơn (nên A sai). Nếu có nhiều greedy action, ta chọn một cách tùy ý (ví dụ ngẫu nhiên) giữa *chúng* — chứ không phải giữa toàn bộ k action (nên D sai).

</details>

---

**Câu 8.** Ưu điểm tiệm cận (asymptotic) của ε-greedy methods so với greedy là gì?

- A. Nó loại bỏ hoàn toàn nhu cầu exploration ngay từ những bước đầu tiên.
- B. Mọi action được sample vô số lần nên Qt(a) → q*(a), và xác suất chọn optimal action > 1 − ε.
- C. Nó hội tụ nhanh hơn greedy trong một vài bước đầu tiên của quá trình học.
- D. Nó không bao giờ chọn nongreedy action, nhờ vậy đảm bảo immediate reward tối đa.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Vì ε-greedy thỉnh thoảng chọn ngẫu nhiên, trong giới hạn mọi hành động được sample vô số lần nên tất cả Qt(a) hội tụ về q*(a), và xác suất chọn optimal action hội tụ về giá trị lớn hơn 1 − ε. Đây chỉ là asymptotic guarantee, nói rất ít về hiệu quả thực tế. D mô tả greedy chứ không phải ε-greedy.

</details>

---

**Câu 9.** Trong ε-greedy với 2 hành động và ε = 0.5, xác suất greedy action được chọn là bao nhiêu? (Bài tập 2.1)

- A. 0.25
- B. 0.5
- C. 0.75
- D. 1.0

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Với xác suất 1 − ε = 0.5 chọn greedy trực tiếp. Với xác suất ε = 0.5 chọn ngẫu nhiên giữa 2 hành động, trong đó có 0.5 khả năng trúng greedy action. Vậy tổng = 0.5 + 0.5 × 0.5 = 0.75.

</details>

---

**Câu 10.** [Khó] Một học viên cho rằng với ε = 0.1 và k = 4 action, xác suất chọn greedy action ở mỗi bước đúng bằng 0.9. Đánh giá nào đúng?

- A. Đúng hoàn toàn: ε = 0.1 nghĩa là 90% thời gian chọn greedy và 10% chọn ngẫu nhiên.
- B. Sai: xác suất thực là 0.1 × (1/4) = 0.025, vì greedy chỉ trúng trong nhánh ngẫu nhiên.
- C. Sai: xác suất thực là 0.9 − 0.1 × (1/4) = 0.875, vì phải trừ phần ngẫu nhiên.
- D. Sai: xác suất thực là 0.9 + 0.1 × (1/4) = 0.925, vì nhánh ngẫu nhiên vẫn có thể trúng greedy.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Greedy được chọn theo hai con đường: nhánh exploit (xác suất 1 − ε = 0.9) chọn nó trực tiếp, và nhánh explore (xác suất ε = 0.1) chọn ngẫu nhiên đồng đều giữa 4 action nên có 1/4 khả năng trúng nó. Tổng = 0.9 + 0.1 × 0.25 = 0.925. Sai lầm phổ biến là quên rằng lần chọn ngẫu nhiên vẫn có thể rơi vào greedy action.

</details>

---

## 2.3 The 10-armed Testbed

**Câu 11.** 10-armed testbed được xây dựng như thế nào?

- A. 2000 bài toán bandit ngẫu nhiên với k = 10; q*(a) ~ Normal(0,1), reward Rt ~ Normal(q*(At),1).
- B. Một bài toán bandit duy nhất với reward cố định, hoàn toàn không có nhiễu ngẫu nhiên.
- C. 1000 bài toán bandit với k = 10, mỗi bài chỉ được chạy đúng 2000 bước riêng lẻ.
- D. 2000 bài toán bandit với k = 2 và reward được lấy từ phân phối đều (uniform).

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Testbed gồm 2000 bài toán bandit sinh ngẫu nhiên với k = 10. Các true value q*(a) lấy từ Normal(mean 0, variance 1); khi chọn At, reward thực Rt lấy từ Normal(mean q*(At), variance 1). Một run = 1000 bước trên một bài, lặp lại 2000 run độc lập để lấy trung bình. C đảo ngược số bài/số bước.

</details>

---

**Câu 12.** Trong Figure 2.2, vì sao greedy method lại kém hơn đáng kể trong dài hạn?

- A. Vì nó dùng step-size quá lớn khiến ước lượng dao động và không bao giờ ổn định.
- B. Vì nó thường bị kẹt ở suboptimal action — các mẫu đầu của optimal action gây thất vọng.
- C. Vì nó chọn ngẫu nhiên quá nhiều nên không tận dụng được kiến thức đã tích lũy.
- D. Vì nó không dùng sample-average mà dùng một ước lượng thiên lệch ngay từ đầu.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Greedy method chỉ tìm được optimal action ở khoảng một phần ba số bài. Ở hai phần ba còn lại, các mẫu ban đầu của optimal action gây thất vọng nên nó bị kẹt vào suboptimal action và không bao giờ quay lại. Nó đạt reward-per-step khoảng 1 so với best possible ~1.54. C sai vì greedy không hề chọn ngẫu nhiên.

</details>

---

**Câu 13.** Khi nào greedy method có thể hoạt động *tốt nhất* và ε-greedy ít có lợi thế?

- A. Khi reward variance rất lớn (ví dụ bằng 10) khiến mỗi mẫu reward rất nhiễu.
- B. Khi số hành động k rất lớn nên cần thử nhiều mới phủ hết không gian action.
- C. Khi bài toán là nonstationary và true value thay đổi liên tục theo thời gian.
- D. Khi reward variance bằng 0 (deterministic) và bài toán stationary.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Nếu reward variance bằng 0, greedy method biết true value của mỗi action ngay sau khi thử một lần, nên nó sớm tìm ra optimal action và không cần explore. Ngược lại, reward nhiễu hơn (A) làm ε-greedy có lợi thế hơn. Lưu ý: ngay cả trong deterministic case, nếu bài toán nonstationary (C) thì exploration vẫn cần thiết.

</details>

---

## 2.4 Incremental Implementation

**Câu 14.** Công thức incremental update cho sample-average là gì?

- A. Q_{n+1} = Q_n + (1/n)(R_n − Q_n).
- B. Q_{n+1} = Q_n + α(R_n − Q_n) với α là một hằng số cố định trong (0,1].
- C. Q_{n+1} = (R_1 + R_2 + ... + R_n) / n, tính lại toàn bộ tổng mỗi bước.
- D. Q_{n+1} = R_n, tức luôn lấy đúng phần thưởng vừa nhận làm ước lượng mới.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Công thức incremental: Q_{n+1} = Q_n + (1/n)(R_n − Q_n). Nó cho cùng kết quả như tính trung bình toàn bộ (C) nhưng chỉ cần bộ nhớ cho Q_n và n, cùng một lượng tính toán nhỏ và cố định mỗi bước. Phương án B là trường hợp constant step-size (mục 2.5), không phải sample-average.

</details>

---

**Câu 15.** Dạng tổng quát "NewEstimate ← OldEstimate + StepSize [Target − OldEstimate]". Biểu thức [Target − OldEstimate] biểu diễn cái gì?

- A. Chính là step-size parameter điều chỉnh tốc độ học của thuật toán.
- B. Một error (sai số) trong ước lượng, được giảm dần bằng cách bước về phía Target.
- C. Số lần hành động được chọn tính tới thời điểm hiện tại, dùng làm trọng số.
- D. Phần thưởng kỳ vọng q*(a) mà ta đang cố gắng ước lượng từ dữ liệu.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — [Target − OldEstimate] là error trong ước lượng. Nó được giảm bằng cách bước một bước về phía Target. Target được giả định chỉ ra hướng mong muốn để di chuyển (dù có thể noisy); trong trường hợp sample-average, target chính là phần thưởng thứ n, R_n.

</details>

---

**Câu 16.** Trong incremental method cho sample-average, step-size parameter thay đổi như thế nào theo thời gian?

- A. Cố định bằng một hằng số α ở mọi bước, không thay đổi theo n.
- B. Tăng dần theo n để các bước về sau có ảnh hưởng lớn hơn các bước đầu.
- C. Thay đổi từng bước, dùng 1/n khi xử lý phần thưởng thứ n.
- D. Bằng ln(t), tăng chậm theo thời gian như trong số hạng UCB.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Step-size trong sample-average thay đổi theo thời gian: khi xử lý phần thưởng thứ n, nó dùng 1/n. Trong sách, step-size được ký hiệu là α hoặc tổng quát hơn α_t(a). Trường hợp constant step-size (A) là cách khác, dùng cho nonstationary. 1/n giảm dần (không tăng) theo n nên B sai.

</details>

---

## 2.5 Tracking a Nonstationary Problem

**Câu 17.** Đối với bài toán nonstationary, vì sao nên dùng constant step-size α thay vì sample-average?

- A. Vì constant step-size hội tụ chính xác và ổn định hơn về đúng q*(a).
- B. Vì nó tiêu tốn ít bộ nhớ hơn rõ rệt so với phương pháp sample-average.
- C. Vì nó loại bỏ hoàn toàn bias từ giá trị khởi tạo Q1(a) ngay sau bước đầu.
- D. Vì nó cho trọng số lớn hơn cho recent rewards so với rewards xa trong quá khứ.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Trong môi trường nonstationary, reward probabilities thay đổi theo thời gian, nên hợp lý khi cho trọng số lớn hơn cho recent rewards. Constant step-size α làm được điều này: Q_{n+1} = Q_n + α(R_n − Q_n), với α ∈ (0,1]. A sai vì constant α không hội tụ hoàn toàn; cả hai phương pháp đều dùng bộ nhớ tương đương (B sai).

</details>

---

**Câu 18.** Với constant step-size, Q_{n+1} được gọi là loại trung bình nào?

- A. Trung bình cộng đơn giản (simple average) của toàn bộ các phần thưởng đã nhận.
- B. Exponential recency-weighted average — trọng số α(1−α)^{n−i} cho R_i giảm theo cấp số nhân.
- C. Trung bình có trọng số bằng nhau cho mọi phần thưởng bất kể thời điểm nhận.
- D. Trung bình trượt (moving average) với một cửa sổ kích thước cố định trên thời gian.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Q_{n+1} = (1−α)^n Q_1 + Σ α(1−α)^{n−i} R_i. Tổng các trọng số bằng 1 nên gọi là weighted average. Trọng số α(1−α)^{n−i} của R_i giảm theo cấp số nhân khi số phần thưởng xen giữa tăng — đó là exponential recency-weighted average. Lưu ý vẫn còn trọng số (1−α)^n cho Q_1 (bias khởi tạo giảm dần nhưng không biến mất hẳn). Nó không phải moving average cửa sổ cố định (D).

</details>

---

**Câu 19.** Điều kiện hội tụ với xác suất 1 (stochastic approximation) cho dãy step-size là gì?

- A. Σ α_n(a) = ∞ và Σ α_n²(a) < ∞.
- B. Σ α_n(a) < ∞ và Σ α_n²(a) = ∞.
- C. α_n(a) phải là một hằng số dương cố định ở mọi bước.
- D. α_n(a) phải tăng đơn điệu theo n để vượt qua nhiễu.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Hai điều kiện (2.7): Σ α_n(a) = ∞ (đảm bảo các bước đủ lớn để vượt qua điều kiện ban đầu và dao động ngẫu nhiên) và Σ α_n²(a) < ∞ (đảm bảo các bước cuối cùng đủ nhỏ để hội tụ). Phương án B đảo ngược hai điều kiện.

</details>

---

**Câu 20.** Trường hợp constant step-size α_n(a) = α thỏa mãn điều kiện hội tụ (2.7) hay không?

- A. Thỏa mãn cả hai điều kiện nên ước lượng hội tụ chắc chắn về q*(a).
- B. Không thỏa mãn điều kiện thứ nhất Σα = ∞ vì tổng bị chặn trên.
- C. Thỏa mãn điều kiện 1 nhưng không thỏa mãn điều kiện 2, nên ước lượng tiếp tục dao động.
- D. Không thỏa mãn cả hai điều kiện, nên ước lượng phân kỳ ra vô cùng theo thời gian.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Với constant α, Σα = ∞ (đạt điều kiện 1) nhưng Σα² = ∞ chứ không < ∞ (không đạt điều kiện 2). Nghĩa là ước lượng không bao giờ hội tụ hoàn toàn mà tiếp tục thay đổi theo recent rewards — điều này thực ra *desirable* trong môi trường nonstationary. Sample-average (α_n = 1/n) thì thỏa mãn cả hai.

</details>

---

**Câu 21.** [Khó] Bài tập 2.5 yêu cầu so sánh sample-average và constant step-size trên một bài toán nonstationary nơi các q*(a) đi bộ ngẫu nhiên (random walk) theo thời gian. Kết quả kỳ vọng là gì?

- A. Sample-average hoạt động tốt hơn vì nó hội tụ chính xác về q*(a) hơn.
- B. Constant step-size hoạt động tốt hơn vì nó tiếp tục theo dõi (track) q*(a) đang thay đổi.
- C. Hai phương pháp cho kết quả gần như giống hệt nhau vì bài toán vẫn stationary.
- D. Cả hai cùng thất bại vì không phương pháp nào xử lý được random walk.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Khi q*(a) đi bộ ngẫu nhiên (nonstationary), sample-average (α = 1/n) cho trọng số ngày càng nhỏ cho recent rewards nên ngày càng kém theo dõi sự thay đổi; trọng số quá khứ cũ kỹ kéo ước lượng lệch. Constant step-size giữ trọng số cố định cho recent rewards nên track tốt hơn các giá trị đang trôi. Đây chính là điểm sách muốn minh họa qua bài tập 2.5.

</details>

---

## 2.6 Optimistic Initial Values

**Câu 22.** Về bias khởi tạo, khác biệt giữa sample-average và constant step-size là gì?

- A. Với sample-average bias là vĩnh viễn; với constant α bias biến mất ngay sau bước đầu.
- B. Cả hai phương pháp đều hoàn toàn không có bias khởi tạo từ giá trị Q1(a).
- C. Với sample-average bias biến mất sau khi mọi action được chọn ≥ 1 lần; với constant α bias là vĩnh viễn nhưng giảm dần.
- D. Cả hai phương pháp đều giữ bias khởi tạo vĩnh viễn và không bao giờ giảm.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Mọi method đều phụ thuộc vào Q1(a) ban đầu nên bị biased. Với sample-average, bias biến mất khi mọi action đã được chọn ít nhất một lần (vì 1/n triệt tiêu Q1). Với constant α, bias là vĩnh viễn nhưng giảm dần theo thời gian như công thức (2.6) chỉ ra qua số hạng (1−α)^n Q_1. Phương án A đảo ngược, B và D đều sai.

</details>

---

**Câu 23.** Optimistic initial values khuyến khích exploration bằng cách nào?

- A. Bằng cách thêm số hạng UCB c·√(ln t / Nt(a)) vào ước lượng của mỗi action.
- B. Bằng cách chọn ngẫu nhiên một action với xác suất ε ở mỗi time step.
- C. Bằng cách giảm dần step-size theo thời gian để ổn định các ước lượng.
- D. Bằng cách khởi tạo Q1(a) cao (ví dụ +5); reward thực thấp hơn nên learner "thất vọng" và thử action khác.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Khởi tạo Q1(a) = +5 (trong khi q*(a) lấy từ mean 0, variance 1) là wildly optimistic. Bất kỳ action nào được chọn cũng cho reward nhỏ hơn ước lượng khởi tạo, nên learner "disappointed" và chuyển sang action khác. Kết quả là mọi action được thử nhiều lần trước khi ước lượng hội tụ — exploration xảy ra ngay cả khi luôn chọn greedy. A là UCB, B là ε-greedy.

</details>

---

**Câu 24.** Vì sao optimistic initial values *không* phù hợp với bài toán nonstationary?

- A. Vì động lực exploration của nó về bản chất chỉ tạm thời (temporary), chỉ tập trung vào điều kiện ban đầu.
- B. Vì nó tiêu tốn quá nhiều bộ nhớ để lưu trữ các giá trị khởi tạo cho mọi action.
- C. Vì nó buộc agent phải chọn ngẫu nhiên mãi mãi, không bao giờ exploit được.
- D. Vì nó đòi hỏi phải biết trước true value q*(a) để đặt giá trị khởi tạo đúng.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Động lực exploration của optimistic initial values là inherently temporary. Nếu task thay đổi (nonstationary) tạo nhu cầu exploration mới, method này không giúp được, vì nó chỉ tập trung vào điều kiện khởi tạo. "The beginning of time occurs only once" nên không nên tập trung quá mức vào nó. B, C, D đều mô tả sai cơ chế.

</details>

---

**Câu 25.** [Khó] Trong Figure 2.3, đường optimistic greedy (Q1 = 5) ban đầu kém hơn đường realistic ε-greedy (Q1 = 0) nhưng sau đó vượt lên. Lý giải nào đúng?

- A. Vì optimistic method khởi tạo sai nên không bao giờ tìm được optimal action.
- B. Vì optimistic method explore rất mạnh trong giai đoạn đầu (gây dao động/kém ban đầu) nhưng sau đó hội tụ vào greedy nên vượt lên.
- C. Vì ε-greedy ngừng explore sau một số bước nhất định nên tụt lại phía sau.
- D. Vì optimistic method có reward variance thấp hơn nên luôn ổn định hơn ngay từ đầu.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Giai đoạn đầu optimistic method explore rất nhiều (mọi action liên tục gây thất vọng), nên đường % optimal action có spike và dao động, ban đầu kém. Sau khi exploration tạm thời này kết thúc, nó về thực chất là greedy nhưng đã có ước lượng tốt, nên vượt lên trên ε-greedy (vốn vẫn explore ε phần thời gian mãi mãi). C sai vì ε-greedy vẫn explore liên tục với tỉ lệ ε cố định.

</details>

---

## 2.7 Upper-Confidence-Bound (UCB) Action Selection

**Câu 26.** Công thức UCB action selection là gì?

- A. At = argmax_a [Qt(a) + c · √(ln t / Nt(a))].
- B. At = argmax_a [Qt(a) − c · Nt(a)], trừ đi số lần đã chọn để phạt action quen thuộc.
- C. At = argmax_a Qt(a) với xác suất 1 − ε và chọn ngẫu nhiên còn lại.
- D. At = argmax_a [Ht(a) + c · ln t], cộng preference với một số hạng tăng theo log.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — UCB: At = argmax_a [Qt(a) + c·√(ln t / Nt(a))]. Trong đó Nt(a) là số lần chọn `a` trước t, c > 0 điều khiển mức độ exploration. Số hạng căn bậc hai là thước đo uncertainty/variance trong ước lượng giá trị của `a`; toàn biểu thức là một upper bound trên true value khả dĩ của `a`. C mô tả ε-greedy, D dùng preference Ht(a) của gradient bandit.

</details>

---

**Câu 27.** Trong số hạng UCB, vì sao việc *chọn* một hành động khác (không phải `a`) lại làm tăng uncertainty estimate của `a`?

- A. Vì giá trị c tăng dần theo thời gian, khuếch đại số hạng exploration của mọi action.
- B. Vì t tăng (xuất hiện ở tử số qua ln t) nhưng Nt(a) không đổi, nên uncertainty của `a` tăng.
- C. Vì Qt(a) tự động giảm mỗi khi một action khác được chọn thay cho `a`.
- D. Vì Nt(a) tăng làm mẫu số tăng, khiến số hạng uncertainty co lại nhỏ hơn.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Mỗi lần chọn `a`, Nt(a) tăng (ở mẫu số) nên uncertainty giảm (đó là D, mô tả trường hợp ngược lại). Mỗi lần chọn action *khác*, t tăng (ở tử số qua ln t) nhưng Nt(a) không đổi, nên uncertainty estimate của `a` tăng. Dùng natural logarithm làm các mức tăng nhỏ dần theo thời gian nhưng vẫn unbounded — mọi action cuối cùng đều được chọn.

</details>

---

**Câu 28.** Khó khăn chính của UCB khi mở rộng ra ngoài bandit problem là gì?

- A. UCB không bao giờ chọn được optimal action nên vô dụng trong thực tế.
- B. UCB cần một xác suất ε cố định để hoạt động đúng như mọi exploration method.
- C. UCB khó xử lý nonstationary problems và large state spaces (đặc biệt với function approximation).
- D. UCB chỉ hoạt động đúng khi số hành động k đúng bằng 10 như trong testbed.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — UCB thường hoạt động tốt nhưng khó mở rộng hơn ε-greedy ra các thiết lập RL tổng quát. Khó khăn: (1) nonstationary problems cần method phức tạp hơn mục 2.5; (2) large state spaces, đặc biệt với function approximation (Part II). Trong các thiết lập nâng cao này, ý tưởng UCB thường không thực tế. A, B, D đều mô tả sai về UCB.

</details>

---

**Câu 29.** [Khó] Theo cài đặt trong sách, nếu một action `a` có Nt(a) = 0 (chưa từng được chọn), UCB xử lý nó thế nào?

- A. Bỏ qua hẳn action đó vì không thể tính căn bậc hai khi mẫu số bằng 0.
- B. Coi `a` là một maximizing action — nó được ưu tiên chọn trước mọi action đã thử.
- C. Gán cho `a` uncertainty bằng 0 nên nó hiếm khi được chọn cho tới rất muộn.
- D. Chọn `a` với xác suất ε giống như cơ chế của ε-greedy thông thường.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Sách quy định nếu Nt(a) = 0 thì `a` được coi là một maximizing action (uncertainty xem như vô hạn). Điều này đảm bảo mọi action được thử ít nhất một lần trước khi UCB bắt đầu phân biệt dựa trên Qt(a) và số hạng confidence. Nó tránh được vấn đề chia cho 0 đồng thời cưỡng bức exploration ban đầu đầy đủ. C nói ngược lại bản chất "optimism in the face of uncertainty".

</details>

---

## 2.8 Gradient Bandit Algorithms

**Câu 30.** Gradient bandit algorithms học cái gì thay vì action values?

- A. Một step-size parameter α_t(a) riêng cho từng action để tối ưu tốc độ học.
- B. Phương sai của reward để dùng làm thước đo uncertainty như trong UCB.
- C. Một numerical preference Ht(a) cho mỗi action; chỉ preference tương đối là quan trọng.
- D. Một confidence bound trên cho true value của mỗi action giống như UCB.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Gradient bandit học một numerical preference Ht(a) ∈ R cho mỗi action. Preference càng lớn, action càng hay được chọn, nhưng preference không có ý nghĩa về reward. Chỉ relative preference là quan trọng — cộng 1000 vào tất cả preference không thay đổi action probabilities. A, B, D thuộc về các phương pháp khác.

</details>

---

**Câu 31.** Action probabilities trong gradient bandit được xác định theo phân phối nào?

- A. Soft-max (Gibbs/Boltzmann): Pr{At = a} = e^{Ht(a)} / Σ_b e^{Ht(b)} = πt(a).
- B. Phân phối normal (Gaussian) với mean Ht(a) và phương sai cố định bằng 1.
- C. Phân phối đều (uniform) trên k action ở mọi bước, không phụ thuộc preference.
- D. Phân phối ε-greedy: greedy với xác suất 1 − ε, ngẫu nhiên với xác suất ε.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Action probabilities được xác định theo soft-max distribution (Gibbs hay Boltzmann): Pr{At = a} = e^{Ht(a)} / Σ_{b=1}^k e^{Ht(b)} = πt(a). Ban đầu mọi preference bằng nhau (H1(a) = 0) nên mọi action có xác suất bằng nhau (chỉ ở bước đầu, không phải mọi bước như C). B và D mô tả phân phối khác.

</details>

---

**Câu 32.** Quy tắc cập nhật preference của gradient bandit là gì?

- A. Tăng Ht(At) một lượng cố định bất kể reward, các action khác giữ nguyên không đổi.
- B. Ht+1(At) = Ht(At) + α(Rt − R̄t)(1 − πt(At)); với a ≠ At: Ht+1(a) = Ht(a) − α(Rt − R̄t)πt(a).
- C. Ht+1(a) = Ht(a) + (1/n)(Rt − Ht(a)) áp dụng cho mọi action a giống nhau.
- D. Ht+1(a) = c · √(ln t / Nt(a)) cập nhật theo số hạng confidence của UCB.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Quy tắc (2.12) dựa trên stochastic gradient ascent: cho action được chọn At, Ht+1(At) = Ht(At) + α(Rt − R̄t)(1 − πt(At)); cho mọi a ≠ At, Ht+1(a) = Ht(a) − α(Rt − R̄t)πt(a). Ở đây R̄t là baseline (trung bình các reward đến trước thời điểm t). A bỏ qua baseline và non-selected actions.

</details>

---

**Câu 33.** Vai trò của baseline R̄t trong gradient bandit là gì?

- A. Nó chính là step-size parameter điều chỉnh độ lớn của mỗi bước cập nhật.
- B. Nó quyết định số lượng action k trong bài toán bandit đang xét.
- C. Nó là true value q*(At) của action vừa được chọn ở bước hiện tại.
- D. Nó là mức tham chiếu để so sánh reward: reward > baseline thì tăng xác suất At, ngược lại giảm.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — R̄t là baseline để so sánh reward. Nếu reward cao hơn baseline, xác suất chọn At trong tương lai tăng; nếu thấp hơn baseline, xác suất giảm. Các non-selected action di chuyển theo hướng ngược lại. Việc cộng thêm +4 vào tất cả reward không ảnh hưởng đến gradient bandit nhờ baseline thích nghi; bỏ baseline sẽ làm hiệu năng giảm đáng kể.

</details>

---

**Câu 34.** Tại sao gradient bandit được coi là một instance của stochastic gradient ascent?

- A. Vì nó sử dụng soft-max distribution để biến preference thành xác suất.
- B. Vì expected update của nó bằng gradient của expected reward ∂E[Rt]/∂Ht(a).
- C. Vì nó luôn chọn greedy action có preference cao nhất ở mỗi bước.
- D. Vì nó hoạt động được mà hoàn toàn không cần đến số hạng baseline.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Các cập nhật của thuật toán (2.12) bằng (2.13) về mặt expected value, tức expected update bằng gradient của expected reward. Điều này khiến nó là một instance của stochastic gradient ascent và đảm bảo robust convergence properties. Việc dùng soft-max (A) là cách biểu diễn policy, không phải lý do nó là SGA; việc chọn baseline không ảnh hưởng expected update nhưng ảnh hưởng variance và tốc độ hội tụ.

</details>

---

**Câu 35.** [Khó] Tại sao việc thêm một baseline (không phụ thuộc action) vào quy tắc cập nhật gradient bandit *không* làm thay đổi expected update?

- A. Vì baseline được chọn đủ nhỏ nên ảnh hưởng của nó là không đáng kể về mặt số học.
- B. Vì Σ_a ∂πt(a)/∂Ht(a) = 0, nên một số hạng hằng số nhân với gradient này triệt tiêu trong kỳ vọng.
- C. Vì baseline chỉ tác động lên action được chọn At, mà action đó luôn được chuẩn hóa lại.
- D. Vì soft-max tự động trừ đi baseline khỏi mọi preference trước khi tính xác suất.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Trong dẫn xuất (2.13), một số hạng dạng (baseline)·Σ_a ∂πt(a)/∂Ht(a) xuất hiện. Vì tổng các action probabilities luôn bằng 1, đạo hàm của tổng đó theo Ht(a) bằng 0, nên Σ_a ∂πt(a)/∂Ht(a) = 0. Do đó một baseline bất kỳ không phụ thuộc action bị triệt tiêu khỏi expected update. Baseline chỉ ảnh hưởng variance của update (và do đó tốc độ hội tụ), không ảnh hưởng kỳ vọng.

</details>

---

## 2.9 Associative Search (Contextual Bandits)

**Câu 36.** Associative search task khác với nonassociative k-armed bandit ở điểm nào?

- A. Nó hoàn toàn không có reward signal, chỉ học từ các tình huống quan sát được.
- B. Nó chỉ có một hành động duy nhất nên không cần lựa chọn giữa các action.
- C. Nó học một policy — ánh xạ từ các tình huống tới hành động tốt nhất, dựa trên clue phân biệt task.
- D. Nó không cần trial-and-error learning vì best action được cho biết trước cho mỗi tình huống.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Trong associative search, learner nhận được clue phân biệt (ví dụ màu hiển thị của slot machine) và học một policy ánh xạ từ tình huống tới best action (ví dụ: nếu đỏ chọn arm 1, nếu xanh chọn arm 2). Nó kết hợp trial-and-error search với association giữa action và situation. Ngày nay thường gọi là contextual bandits. A, B, D đều mô tả sai.

</details>

---

**Câu 37.** Associative search task nằm ở vị trí nào giữa k-armed bandit và full RL problem?

- A. Nó là trung gian: giống full RL ở chỗ học policy, nhưng giống bandit ở chỗ action chỉ ảnh hưởng immediate reward.
- B. Nó giống full RL hoàn toàn vì action ảnh hưởng đến cả tình huống tiếp theo lẫn reward.
- C. Nó đơn giản hơn cả k-armed bandit thông thường vì không cần explore.
- D. Nó hoàn toàn tương đương k-armed bandit thông thường, chỉ đổi tên gọi.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Associative search là trung gian giữa k-armed bandit và full RL. Giống full RL ở chỗ học policy, nhưng giống bandit ở chỗ mỗi action chỉ ảnh hưởng đến immediate reward (không ảnh hưởng tình huống kế tiếp). Nếu action được phép ảnh hưởng cả tình huống tiếp theo lẫn reward (B), thì ta có full reinforcement learning problem.

</details>

---

## 2.10 Summary

**Câu 38.** Mỗi phương pháp đạt được exploration theo cách đặc trưng nào?

- A. Cả ba phương pháp ε-greedy, UCB và gradient bandit đều dựa vào optimistic initial values.
- B. ε-greedy chọn deterministic theo Qt(a); UCB ngược lại chọn hoàn toàn ngẫu nhiên giữa các action.
- C. ε-greedy chọn ngẫu nhiên một phần nhỏ thời gian; UCB chọn deterministic nhưng ưu ái action ít được sample; gradient bandit dùng soft-max trên preference.
- D. UCB và gradient bandit đều dùng xác suất ε để chọn action ngẫu nhiên ở mỗi bước.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — ε-greedy chọn ngẫu nhiên một phần nhỏ thời gian; UCB chọn deterministic nhưng đạt exploration bằng cách subtly ưu ái các action nhận ít sample hơn; gradient bandit ước lượng action preferences (không phải action values) và ưa các action được ưa thích hơn theo cách graded, probabilistic dùng soft-max. B mô tả ngược về UCB; D sai vì chỉ ε-greedy dùng ε.

</details>

---

**Câu 39.** Trong parameter study (Figure 2.6), điều gì là đặc trưng chung của tất cả thuật toán?

- A. Hiệu năng tăng đơn điệu theo giá trị parameter — parameter càng lớn càng tốt.
- B. Hiệu năng hoàn toàn độc lập với giá trị parameter trên dải được khảo sát.
- C. Tất cả đều đạt hiệu năng tốt nhất khi parameter được đặt đúng bằng 0.
- D. Hình dạng inverted-U đặc trưng — tốt nhất ở giá trị parameter trung bình, không quá lớn cũng không quá nhỏ.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Parameter study cho thấy hình inverted-U đặc trưng: mọi thuật toán hoạt động tốt nhất ở giá trị parameter trung bình, không quá lớn cũng không quá nhỏ. Các parameter (ε, α, c, Q0) được biến đổi theo bội số 2 và biểu diễn trên log scale. Các thuật toán khá insensitive, hoạt động tốt trên một dải parameter khoảng một order of magnitude. Trên bài toán này, UCB có vẻ tốt nhất.

</details>

---

**Câu 40.** Gittins index và Thompson sampling thuộc nhóm phương pháp nào, và hạn chế chính là gì?

- A. Chúng là distribution-free methods, không cần bất kỳ giả định nào về phân phối ban đầu.
- B. Chúng chỉ là các biến thể nhỏ của ε-greedy với một lịch trình ε khác biệt.
- C. Chúng chỉ áp dụng được cho nonstationary problem, không dùng được cho stationary.
- D. Chúng là Bayesian methods, giả định biết initial distribution; cập nhật có thể rất phức tạp và khó khái quát cho full RL.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Gittins index là một instance của Bayesian methods, giả định biết initial distribution trên action values và cập nhật distribution chính xác sau mỗi bước (giả định true action values stationary). Tính toán cập nhật nói chung rất phức tạp (trừ conjugate priors). Posterior/Thompson sampling chọn action theo posterior probability là best action, thường hoạt động tương đương với best của các distribution-free methods. Cả lý thuyết lẫn tính khả thi tính toán đều không khái quát tốt cho full RL.

</details>

---

**Câu 41.** [Khó] Một kỹ sư áp dụng gradient bandit cho một bài toán mà *mọi* reward đều rất lớn và dương (ví dụ dao động quanh +1000). So với một thuật toán dùng action-value với optimistic initial values, gradient bandit sẽ phản ứng thế nào?

- A. Gradient bandit sẽ thất bại vì preference Ht(a) tăng vô hạn không kiểm soát được.
- B. Gradient bandit phần lớn không bị ảnh hưởng nhờ baseline R̄t thích nghi với mức reward chung; trong khi action-value method nhạy với việc đặt Q1.
- C. Cả hai phương pháp đều thất bại như nhau vì reward quá lớn làm tràn số.
- D. Action-value method tự động bù mức reward lớn, còn gradient bandit thì không.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Baseline R̄t (trung bình reward đã thấy) tự thích nghi tới mức ~+1000, nên gradient bandit chỉ phản ứng với *độ lệch* (Rt − R̄t) quanh baseline — việc cộng một hằng số lớn vào mọi reward không thay đổi hành vi. Ngược lại, action-value method với optimistic initialization phụ thuộc vào việc Q1 được đặt cao *hơn* mức reward kỳ vọng để tạo "thất vọng"; nếu reward quanh +1000 mà Q1 đặt theo thói quen (ví dụ +5) thì cơ chế optimism sụp đổ. Đây minh họa vì sao baseline khiến gradient bandit robust với mức (scale/offset) của reward.

</details>

---

**Câu 42.** [Khó] Giả sử bài toán bandit là stationary và bạn có ngân sách rất lớn (hàng triệu bước). Giữa greedy thuần túy và ε-greedy với ε = 0.01, lựa chọn nào tốt hơn về reward trung bình tiệm cận, và vì sao?

- A. Greedy thuần túy, vì nó không bao giờ lãng phí bước vào nongreedy action.
- B. ε-greedy với ε = 0.01, vì asymptotically nó tìm ra optimal action gần như chắc chắn và chỉ mất ~1% reward cho exploration.
- C. Hai phương pháp cho reward tiệm cận hệt nhau vì bài toán là stationary.
- D. Greedy thuần túy, vì với ngân sách lớn nó luôn hội tụ về optimal action.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Greedy thuần túy có xác suất hữu hạn bị kẹt vĩnh viễn ở suboptimal action (do early disappointing samples) nên reward tiệm cận của nó bị kéo xuống. ε-greedy với ε nhỏ đảm bảo mọi action được sample vô số lần, nên gần như chắc chắn xác định được optimal action; nó chỉ trả giá ~ε phần thời gian cho exploration. Với ε = 0.01, xác suất chọn optimal action tiệm cận khoảng 99.1% (= 0.99 + 0.01/k), cao hơn nhiều so với khoảng một phần ba của greedy. Đó là lý do ε-greedy thắng về asymptotic performance.

</details>
