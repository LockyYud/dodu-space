# Chương 9: On-policy Prediction with Approximation — Câu hỏi trắc nghiệm

> Bộ câu hỏi ôn tập chi tiết cho Chương 9, sách *Reinforcement Learning: An Introduction* (Sutton & Barto, 2nd ed.)

## 9.1 Value-function Approximation

**Câu 1.** Điểm mới (novelty) cốt lõi của function approximation trong Chương 9 so với các phương pháp tabular trước đó là gì?

- A. Value function được biểu diễn bằng lookup table với một entry riêng cho mỗi state có thể có.
- B. Value function được biểu diễn bằng parameterized functional form v̂(s,w) với weight vector w ∈ R^d.
- C. Value function chỉ được dùng cho các bài toán có không gian state hữu hạn và nhỏ.
- D. Mỗi state được cập nhật hoàn toàn độc lập với mọi state khác trong không gian.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Thay vì bảng tra cứu, ta dùng một dạng hàm có tham số v̂(s,w) ≈ v_π(s) với weight vector w ∈ R^d. Thông thường số weight nhỏ hơn nhiều so với số state (d ≪ |S|). A mô tả tabular cũ; C sai vì FA dùng được cho không gian lớn/liên tục; D đúng với tabular chứ không phải FA.

</details>

---

**Câu 2.** Hệ quả quan trọng nhất của việc số weight nhỏ hơn nhiều số state (d ≪ |S|) là gì?

- A. Mỗi update chỉ ảnh hưởng tới đúng một state, hệt như trong tabular learning.
- B. Value function luôn có thể đạt giá trị chính xác tuyệt đối cho mọi state.
- C. Cập nhật một state sẽ generalize (lan tỏa), làm thay đổi value ước lượng của nhiều state khác.
- D. Không cần xác định một state distribution để đo lường lỗi nữa.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Vì thay đổi một weight làm thay đổi value ước lượng của nhiều state, nên cập nhật một state sẽ generalize sang nhiều state khác. Generalization khiến việc học mạnh mẽ hơn nhưng cũng khó quản lý hơn. A đúng cho tabular; B sai vì d ≪ |S| nên không thể chính xác mọi state; D sai vì FA lại càng cần state distribution.

</details>

---

**Câu 3.** Vì sao nhiều phương pháp function approximation cổ điển (ANN, statistical methods truyền thống) không hoàn toàn phù hợp cho reinforcement learning?

- A. Chúng giả định static training set quét nhiều lần, trong khi RL cần học online và xử lý target nonstationary.
- B. Chúng hoàn toàn không có khả năng xử lý dữ liệu dạng số thực.
- C. Chúng yêu cầu phải biết trước true value function trước khi học.
- D. Chúng chỉ hoạt động được khi value được lưu dạng lookup table.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Các phương pháp tinh vi nhất giả định một tập huấn luyện tĩnh được duyệt nhiều lần. RL cần học online khi agent tương tác và phải xử lý target nonstationary (bootstrapping targets, hoặc π thay đổi trong GPI). B, C, D đều mô tả sai bản chất các phương pháp FA cổ điển.

</details>

---

**Câu 4.** [Khó] Một thuật toán supervised learning offline được dùng để fit v̂ bằng cách lặp đi lặp lại trên cùng một tập (S, G) cố định cho tới hội tụ. Vấn đề nào KHÔNG phát sinh nếu thay vào đó ta dùng bootstrapping target trong online RL?

- A. Target phụ thuộc weight hiện tại nên thay đổi theo từng bước (nonstationary).
- B. Phân phối state đầu vào thay đổi khi policy thay đổi trong control.
- C. Target của một state có thể bị bias vì dựa trên estimate chưa chính xác.
- D. Mỗi cặp (state, target) là cố định và i.i.d., có thể quét lại nhiều lần.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Đây là tình huống lý tưởng của supervised learning offline mà RL bootstrapping KHÔNG có: target không cố định (nó phụ thuộc w hiện tại — A), phân phối input dịch chuyển khi π thay đổi (B), và target bị bias (C). Câu hỏi tìm vấn đề KHÔNG phát sinh, nên đáp án là tính chất lý tưởng D.

</details>

---

## 9.2 The Prediction Objective (VE)

**Câu 5.** Trong trường hợp tabular, vì sao trước đây không cần một measure liên tục về chất lượng dự đoán, còn với genuine approximation thì cần?

- A. Vì tabular không bao giờ tạo ra bất kỳ lỗi dự đoán nào.
- B. Vì với approximation ta luôn có nhiều weight hơn số state cần ước lượng.
- C. Vì trong tabular ta luôn bắt buộc phải dùng một state distribution µ.
- D. Vì tabular có thể đạt true value và các state decoupled, còn approximation làm một state chính xác hơn sẽ làm state khác kém hơn.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Trong tabular, learned value có thể bằng đúng true value và các state decoupled (update một state không ảnh hưởng state khác). Với approximation, vì state nhiều hơn weight, làm một state chính xác hơn buộc state khác kém hơn — nên phải nói rõ ta quan tâm state nào. A, B, C đều sai về mặt sự kiện.

</details>

---

**Câu 6.** Mean Squared Value Error (VE) được định nghĩa như thế nào?

- A. VE(w) = Σ_s µ(s) [v_π(s) − v̂(s,w)]²
- B. VE(w) = Σ_s [v_π(s) − v̂(s,w)]
- C. VE(w) = Σ_s µ(s) |v_π(s) − v̂(s,w)|
- D. VE(w) = max_s [v_π(s) − v̂(s,w)]²

<details>
<summary>Đáp án</summary>

**Đáp án: A** — VE(w) = Σ_s µ(s) [v_π(s) − v̂(s,w)]² (công thức 9.1): bình phương sai số giữa v̂(s,w) và v_π(s), weight theo state distribution µ. B bỏ bình phương và weight; C dùng trị tuyệt đối (không phải mean squared); D dùng max thay vì trung bình theo µ.

</details>

---

**Câu 7.** State distribution µ(s) trong VE biểu diễn điều gì, và under on-policy training nó được gọi là gì?

- A. µ(s) là true value function tại s; được gọi là value distribution.
- B. µ(s) là mức độ ta quan tâm tới error tại s (thường là tỷ lệ thời gian ở trong s); under on-policy training gọi là on-policy distribution.
- C. µ(s) là xác suất terminate tại s; được gọi là termination distribution.
- D. µ(s) là step-size dùng cho state s; được gọi là learning-rate schedule.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — µ(s) ≥ 0, Σ µ(s) = 1, biểu diễn mức độ quan tâm tới error ở mỗi state, thường là tỷ lệ thời gian ở s; under on-policy training gọi là on-policy distribution. A, C, D nhầm µ với value, termination, hoặc step-size.

</details>

---

**Câu 8.** Trong episodic task, on-policy distribution µ(s) được tính từ η(s) — số time step trung bình ở trong s mỗi episode. Công thức nào diễn tả η(s) đúng?

- A. η(s) = h(s) + Σ_s̄ η(s̄) Σ_a π(a|s̄) p(s|s̄,a)
- B. η(s) = h(s) × Σ_s̄ η(s̄)
- C. η(s) = 1 cho mọi state s trong không gian
- D. η(s) = µ(s) × |S|

<details>
<summary>Đáp án</summary>

**Đáp án: A** — η(s) = h(s) + Σ_s̄ η(s̄) Σ_a π(a|s̄) p(s|s̄,a) (công thức 9.2), với h(s) là xác suất episode bắt đầu ở s: thời gian ở s đến từ việc khởi đầu ở s hoặc transition vào s. Sau đó µ(s) = η(s) / Σ_s' η(s'). Các phương án khác không phản ánh được cơ chế tích lũy thời gian này.

</details>

---

**Câu 9.** Phát biểu nào ĐÚNG về việc VE có phải là objective hoàn hảo cho RL hay không?

- A. VE chắc chắn là objective tốt nhất vì mục tiêu cuối là minimize value error.
- B. VE luôn đạt global optimum cho mọi loại function approximator được dùng.
- C. Không rõ VE là objective đúng; mục tiêu cuối là policy tốt hơn, và value function tốt nhất cho mục tiêu đó không nhất thiết minimize VE.
- D. Với nonlinear approximator, VE được đảm bảo luôn hội tụ về global optimum.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Sách nêu rõ không chắc VE là objective đúng cho RL, vì mục tiêu cuối là tìm policy tốt hơn. Global optimum của VE đôi khi đạt với linear approximator nhưng hiếm với approximator phức tạp; với nonlinear thường chỉ đạt local optimum. A, B, D đều quá lạc quan và sai.

</details>

---

**Câu 10.** [Khó] Trong một bài toán, ta tăng µ(s) cho một nhóm state hiếm khi được thăm và giảm cho các state thường xuyên thăm. Tác động trực tiếp nào lên việc tối thiểu hóa VE là đúng nhất?

- A. VE không thay đổi vì µ chỉ là hằng số chuẩn hóa, không ảnh hưởng nghiệm tối ưu.
- B. Nghiệm tối ưu sẽ ưu tiên giảm error ở nhóm state hiếm hơn, có thể làm error tăng ở các state thường thăm.
- C. Nghiệm tối ưu luôn cải thiện đồng đều error ở mọi state cùng một lúc.
- D. Việc đổi µ buộc approximator phải trở thành nonlinear để cân bằng lại lỗi.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — VE là tổng lỗi bình phương có trọng số µ. Tăng trọng số cho nhóm state hiếm khiến optimizer "trả giá" nhiều hơn cho lỗi ở đó, nên nghiệm tối ưu dịch về phía giảm lỗi nhóm này, đánh đổi bằng lỗi cao hơn ở state thường thăm (vì d ≪ |S| không thể giảm hết). A sai vì µ định hình hẳn nghiệm; C sai vì FA có trade-off giữa các state; D không liên quan.

</details>

---

## 9.3 Stochastic-gradient and Semi-gradient Methods

**Câu 11.** Khi target output chính là true value v_π(S_t), SGD update tổng quát có dạng nào?

- A. w_{t+1} = w_t − α [v_π(S_t) − v̂(S_t,w_t)] ∇v̂(S_t,w_t)
- B. w_{t+1} = w_t + α [v_π(S_t) − v̂(S_t,w_t)] ∇v̂(S_t,w_t)
- C. w_{t+1} = w_t + α v̂(S_t,w_t) ∇v̂(S_t,w_t)
- D. w_{t+1} = w_t + α [v_π(S_t) − v̂(S_t,w_t)]

<details>
<summary>Đáp án</summary>

**Đáp án: B** — w_{t+1} = w_t + α [v_π(S_t) − v̂(S_t,w_t)] ∇v̂(S_t,w_t) (công thức 9.5): bước đi tỉ lệ negative gradient của squared error. A sai dấu (sẽ làm tăng error); C bỏ phần error; D thiếu nhân với gradient ∇v̂.

</details>

---

**Câu 12.** Vì sao SGD chỉ đi một bước nhỏ theo hướng gradient thay vì triệt tiêu hoàn toàn error trên ví dụ đó?

- A. Vì gradient của hàm xấp xỉ luôn bằng 0 tại mọi ví dụ.
- B. Vì step-size α theo định nghĩa luôn cố định và bằng đúng 1.
- C. Vì SGD vốn không quan tâm tới việc hội tụ về bất kỳ điểm nào.
- D. Vì ta tìm approximation cân bằng error giữa các state, không tìm zero error cho từng state.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Ta không tìm zero error cho mỗi state mà tìm approximation cân bằng error giữa các state; sửa hết error mỗi ví dụ sẽ phá vỡ cân bằng. Convergence còn đòi hỏi α giảm dần theo điều kiện stochastic approximation chuẩn. A, B, C đều phát biểu sai.

</details>

---

**Câu 13.** Gradient Monte Carlo dùng target U_t = G_t. Vì sao nó được đảm bảo hội tụ về local optimum (và global optimum trong linear case)?

- A. Vì return G_t theo định nghĩa luôn bằng 0 ở mọi state.
- B. Vì G_t là unbiased estimate của v_π(S_t), nên thỏa điều kiện hội tụ của SGD.
- C. Vì G_t hoàn toàn độc lập với policy π đang được đánh giá.
- D. Vì G_t là một bootstrapping target sử dụng estimate hiện tại.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — MC target G_t là unbiased estimate của v_π(S_t). Khi U_t unbiased (E[U_t|S_t=s] = v_π(s)), SGD update (9.7) hội tụ về local optimum dưới điều kiện stochastic approximation chuẩn với α giảm dần. A vô lý; C sai vì G_t phụ thuộc π; D sai vì G_t là MC target chứ không bootstrap.

</details>

---

**Câu 14.** Vì sao bootstrapping methods (như semi-gradient TD(0)) KHÔNG phải là true gradient descent, mà gọi là semi-gradient?

- A. Vì chúng tính và áp dụng gradient hai lần trong mỗi bước cập nhật.
- B. Vì target U_t phụ thuộc w_t (bias) nên bước (9.4)→(9.5) không hợp lệ; chúng bỏ qua ảnh hưởng của w lên target.
- C. Vì chúng hoàn toàn không sử dụng gradient trong cập nhật.
- D. Vì chúng chỉ dùng được với nonlinear approximator chứ không phải linear.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Bootstrapping target phụ thuộc w_t hiện tại nên bị bias; bước biến đổi (9.4)→(9.5) chỉ hợp lệ khi target độc lập với w_t. Bootstrapping tính ảnh hưởng của w lên estimate nhưng bỏ qua ảnh hưởng lên target — nên chỉ là một phần gradient. A, C, D đều sai.

</details>

---

**Câu 15.** Semi-gradient TD(0) update có dạng nào (tổng quát)?

- A. w ← w + α [G_t − v̂(S,w)] ∇v̂(S,w)
- B. w ← w − α [R + γv̂(S',w)] ∇v̂(S',w)
- C. w ← w + α [R + γv̂(S',w) − v̂(S,w)] ∇v̂(S,w)
- D. w ← w + α R ∇v̂(S,w)

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Semi-gradient TD(0) dùng target U_t = R_{t+1} + γv̂(S_{t+1},w): w ← w + α [R + γv̂(S',w) − v̂(S,w)] ∇v̂(S,w). A là gradient Monte Carlo (dùng G_t); B sai dấu và sai gradient; D bỏ mất TD error đầy đủ.

</details>

---

**Câu 16.** Mặc dù không hội tụ "robust" như true gradient methods, vì sao semi-gradient methods thường được ưa chuộng hơn?

- A. Vì chúng được đảm bảo luôn hội tụ về đúng global optimum.
- B. Vì chúng hoàn toàn không cần tới step-size parameter α.
- C. Vì chúng chỉ dùng offline trên một static dataset cố định.
- D. Vì chúng học nhanh hơn đáng kể và cho phép học continual & online không cần đợi hết episode.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Semi-gradient methods thường học nhanh hơn nhiều và cho phép học continual & online không cần đợi kết thúc episode, dùng được cho continuing problems. A, B, C đều sai về tính chất của chúng.

</details>

---

**Câu 17.** State aggregation là một dạng đặc biệt của SGD. Trong state aggregation, gradient ∇v̂(S_t,w_t) có giá trị như thế nào?

- A. Bằng đúng feature vector x(s) đầy đủ tại state đó.
- B. Bằng 1 cho mọi component của weight vector.
- C. Bằng 0 cho mọi component của weight vector.
- D. Bằng 1 cho component của group chứa S_t, và 0 cho các component khác.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — State aggregation gom state thành group, mỗi group một component của w. Gradient bằng 1 cho component của group chứa S_t và 0 cho các component còn lại — chỉ component group đó được update. (Đây thực chất là feature vector one-hot, nhưng A nói "đầy đủ" gây hiểu lầm rằng nhiều thành phần khác 0.) B, C sai.

</details>

---

## 9.4 Linear Methods

**Câu 18.** Trong linear methods, approximate value function được tính thế nào, và gradient của nó là gì?

- A. v̂(s,w) = wᵀx(s), và ∇v̂(s,w) = w
- B. v̂(s,w) = wᵀx(s) = Σ_i w_i x_i(s), và ∇v̂(s,w) = x(s)
- C. v̂(s,w) = exp(wᵀx(s)), và ∇v̂(s,w) = v̂(s,w) x(s)
- D. v̂(s,w) = max_i w_i x_i(s), và ∇v̂(s,w) = 1

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Linear: v̂(s,w) = wᵀx(s) (công thức 9.8); gradient theo w đơn giản là chính feature vector ∇v̂(s,w) = x(s). Nhờ vậy SGD rút gọn còn w_{t+1} = w_t + α[U_t − v̂(S_t,w_t)] x(S_t). A nhầm gradient là w; C, D mô tả hàm phi tuyến.

</details>

---

**Câu 19.** Trong linear case, vì sao một phương pháp đảm bảo hội tụ về (hoặc gần) local optimum thì tự động hội tụ về (hoặc gần) global optimum?

- A. Vì linear function luôn có giá trị error bằng đúng 0.
- B. Vì linear function không có gradient nên không tồn tại local optimum.
- C. Vì linear case chỉ có một optimum (hoặc một tập optima tương đương), nên local chính là global.
- D. Vì linear case chỉ dùng được với gradient Monte Carlo.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — VE là hàm bậc hai (quadratic) lồi của w trong linear case, nên chỉ có một optimum (hoặc tập optima tương đương khi suy biến). Do đó hội tụ về/gần local optimum đồng nghĩa hội tụ về/gần global optimum. A, B, D đều sai.

</details>

---

**Câu 20.** Linear semi-gradient TD(0) hội tụ về điểm nào, và điểm đó định nghĩa thế nào?

- A. Về TD fixed point w_TD = A⁻¹b, với b = E[R_{t+1} x_t], A = E[x_t(x_t − γx_{t+1})ᵀ].
- B. Về đúng global optimum của VE, tức w* = argmin VE(w).
- C. Về điểm gốc w = 0 của không gian weight.
- D. Về vector trung bình của tất cả feature vectors đã gặp.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Linear semi-gradient TD(0) hội tụ về TD fixed point w_TD = A⁻¹b (công thức 9.12), với b = E[R_{t+1} x_t] và A = E[x_t(x_t − γx_{t+1})ᵀ]. Đây KHÔNG phải global optimum của VE (loại trừ B), và cần một định lý riêng. C, D vô nghĩa.

</details>

---

**Câu 21.** Theo chứng minh hội tụ của linear TD(0), điều kiện then chốt đảm bảo sự ổn định (stability) là gì?

- A. Matrix A phải đúng bằng ma trận đơn vị (identity matrix).
- B. Toàn bộ phần tử của matrix A đều phải bằng 0.
- C. Step-size α phải được giữ cố định bằng đúng 1.
- D. Matrix A phải positive definite (yᵀAy > 0 với mọi y ≠ 0), điều này cũng đảm bảo A⁻¹ tồn tại.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — w_t được kéo về điểm ổn định khi A positive definite (yᵀAy > 0 với mọi y ≠ 0), điều này cũng đảm bảo A⁻¹ tồn tại. Trong continuing case với on-policy distribution, A = XᵀD(I − γP)X được chứng minh positive definite. A, B, C đều sai.

</details>

---

**Câu 22.** Tại TD fixed point, VE bị chặn trên như thế nào so với lỗi nhỏ nhất có thể (đạt bởi Monte Carlo)?

- A. VE(w_TD) ≤ min_w VE(w)
- B. VE(w_TD) ≤ (1/(1−γ)) min_w VE(w)
- C. VE(w_TD) = 0
- D. VE(w_TD) ≤ γ min_w VE(w)

<details>
<summary>Đáp án</summary>

**Đáp án: B** — VE(w_TD) ≤ (1/(1−γ)) min_w VE(w) (công thức 9.14): lỗi asymptotic của TD không quá 1/(1−γ) lần lỗi nhỏ nhất (đạt bởi MC). Vì γ thường gần 1, hệ số này có thể lớn; bù lại TD variance thấp hơn nên thường nhanh hơn. A quá chặt (sai); C sai; D sai chiều bất đẳng thức.

</details>

---

**Câu 23.** [Khó] Với γ = 0.9, bound (9.14) nói VE tại TD fixed point xấu nhất gấp bao nhiêu lần min VE? Và với γ = 0.99 thì sao?

- A. Gấp tối đa 1.9 lần (γ=0.9) và 1.99 lần (γ=0.99).
- B. Gấp tối đa 0.9 lần (γ=0.9) và 0.99 lần (γ=0.99).
- C. Gấp tối đa 10 lần (γ=0.9) và 100 lần (γ=0.99).
- D. Gấp tối đa 9 lần (γ=0.9) và 99 lần (γ=0.99).

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Hệ số là 1/(1−γ). Với γ=0.9: 1/0.1 = 10. Với γ=0.99: 1/0.01 = 100. Đây là minh họa vì sao bound nới rộng rất nhanh khi γ tiến gần 1 — một lý do TD có thể cho nghiệm asymptotic kém hơn MC, dù trong thực tế thường gần optimum hơn nhiều so với bound bi quan này.

</details>

---

**Câu 24.** Điều kiện nào là then chốt (critical) cho các kết quả hội tụ của bootstrapping methods với function approximation — và điều gì xảy ra nếu vi phạm?

- A. Feature vectors phải là binary; nếu không bootstrapping sẽ diverge.
- B. Step-size phải luôn bằng 1; nếu không sẽ diverge ngay.
- C. State phải được update theo on-policy distribution; nếu dùng phân phối update khác có thể diverge tới vô cực.
- D. Phải dùng nonlinear approximator; nếu dùng linear thì sẽ diverge.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Điều kiện then chốt là state được update theo on-policy distribution. Với phân phối update khác, bootstrapping methods dùng FA có thể thực sự diverge tới vô cực (bàn sâu ở Chương 11). A, B, D không phải điều kiện đó.

</details>

---

**Câu 25.** Trong n-step semi-gradient TD, update key (9.15) có dạng nào?

- A. w_{t+n} = w_{t+n−1} + α [G_{t:t+n} − v̂(S_t,w_{t+n−1})] ∇v̂(S_t,w_{t+n−1})
- B. w_{t+n} = w_{t+n−1} + α G_{t:t+n} ∇v̂(S_t,w_{t+n−1})
- C. w_{t+n} = w_{t+n−1} − α [G_t − v̂(S_t,w)] x(S_t)
- D. w_{t+n} = w_{t+n−1} + α R_{t+1} ∇v̂(S_{t+n},w)

<details>
<summary>Đáp án</summary>

**Đáp án: A** — w_{t+n} = w_{t+n−1} + α [G_{t:t+n} − v̂(S_t,w_{t+n−1})] ∇v̂(S_t,w_{t+n−1}) (9.15), với G_{t:t+n} = R_{t+1} + γR_{t+2} + ... + γ^{n−1}R_{t+n} + γⁿ v̂(S_{t+n},w_{t+n−1}). B thiếu trừ v̂; C sai dấu/sai target; D sai cấu trúc.

</details>

---

**Câu 26.** [Khó] Trong continuing on-policy case, A = XᵀD(I − γP)X. Yếu tố nào trong biểu thức này bảo đảm tính positive definiteness, và điều gì xảy ra nếu thay D bằng phân phối KHÔNG khớp on-policy?

- A. D (ma trận đường chéo các µ on-policy) là yếu tố then chốt; nếu D không khớp on-policy thì A có thể mất positive definiteness và TD có thể diverge.
- B. Ma trận P một mình bảo đảm positive definite; D chỉ là yếu tố làm đẹp công thức.
- C. X một mình bảo đảm positive definite; thay đổi D không ảnh hưởng tính ổn định.
- D. γ một mình bảo đảm positive definite; D và P không có vai trò gì về ổn định.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Chứng minh ổn định dựa vào việc D là phân phối on-policy stationary, khiến (I − γP) có cấu trúc khiến A positive definite. Nếu D ứng với một phân phối update khác (off-policy), tính positive definiteness có thể mất và TD bootstrapping với FA có thể diverge — đúng nội dung "deadly triad" được báo trước cho Chương 11. B, C, D quy sai cho từng nhân tử riêng lẻ.

</details>

---

## 9.5 Feature Construction for Linear Methods

**Câu 27.** Hạn chế cốt lõi của linear form (ví dụ pole-balancing) là gì, và cách khắc phục?

- A. Linear form không thể xử lý số thực; cần chuyển toàn bộ feature sang dạng nhị phân.
- B. Linear form luôn diverge khi học; cần thêm một bias term để ổn định.
- C. Linear form không thể biểu diễn interactions giữa các feature; cần thêm features cho tổ hợp của các state dimension.
- D. Linear form không có gradient để học; cần thêm một hidden layer phi tuyến.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Linear form không biểu diễn được interactions giữa các feature. Ví dụ pole-balancing: high angular velocity tốt hay xấu tùy angle; nếu mã hóa riêng từng dimension, linear không nắm được — cần thêm features cho tổ hợp các dimension. A, B, D mô tả sai bản chất hạn chế.

</details>

---

### 9.5.1 Polynomials

**Câu 28.** Order-n polynomial basis cho không gian state k chiều có bao nhiêu feature, và hệ quả thực tế là gì?

- A. n features; không cần chọn lọc gì thêm.
- B. (n+1)^k features; số feature tăng theo cấp số mũ với số chiều k, nên thường phải chọn một tập con.
- C. n×k features; luôn có thể dùng toàn bộ.
- D. k features; số feature tăng tuyến tính theo chiều.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Order-n polynomial basis cho dimension k chứa (n+1)^k features (mỗi feature x_i(s) = Π_j s_j^{c_{i,j}}, c_{i,j} ∈ {0,...,n}). Số feature tăng theo cấp số mũ với k nên thường phải chọn tập con; sách không khuyến nghị polynomial cho online learning. A, C, D đếm sai.

</details>

---

### 9.5.2 Fourier Basis

**Câu 29.** One-dimensional order-n Fourier cosine basis gồm các feature nào, và đặc tính (global/local) của chúng?

- A. x_i(s) = cos(iπs), s ∈ [0,1], i = 0,...,n; là global features (non-zero hầu khắp không gian) nên khó biểu diễn local properties.
- B. x_i(s) = sin(iπs); là các local features tập trung quanh một điểm.
- C. x_i(s) = exp(−s²); là các binary features 0/1.
- D. x_i(s) = s^i; là các local features có receptive field nhỏ.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Order-n Fourier cosine basis một chiều gồm n+1 features x_i(s) = cos(iπs), s ∈ [0,1]. Fourier features non-zero trên toàn không gian (global) nên khó biểu diễn local properties và gặp "ringing" ở discontinuities. B, C, D mô tả sai cả công thức lẫn tính chất.

</details>

---

### 9.5.3 Coarse Coding

**Câu 30.** Trong coarse coding, generalization từ state s tới state s' được quyết định bởi gì?

- A. Bởi giá trị step-size α được chọn cho thuật toán.
- B. Bởi true value của hai state s và s'.
- C. Bởi tổng số tilings dùng trong tile coding.
- D. Bởi số feature mà receptive fields của chúng overlap (chồng lấn) tại cả s và s'.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Generalization từ s tới s' phụ thuộc số feature mà receptive fields overlap tại cả hai state. Receptive fields lớn → generalization rộng; nhỏ → hẹp; hình dạng cũng quyết định bản chất generalization. A, B, C không liên quan trực tiếp tới cơ chế này.

</details>

---

**Câu 31.** Theo Example 9.3 (square-wave), kích thước receptive field ảnh hưởng thế nào tới generalization và tới chất lượng nghiệm asymptotic?

- A. Kích thước feature quyết định hoàn toàn chất lượng nghiệm cuối; broad features luôn cho nghiệm tệ hơn.
- B. Kích thước feature ảnh hưởng mạnh tới generalization ban đầu, nhưng acuity cuối lại do tổng số feature quyết định — nên nghiệm asymptotic bị ảnh hưởng nhẹ.
- C. Kích thước feature không ảnh hưởng gì tới generalization lẫn nghiệm cuối.
- D. Narrow features luôn cho nghiệm cuối tốt hơn broad features một cách đáng kể.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Generalization ban đầu do kích thước/hình dạng receptive field kiểm soát, nhưng acuity (độ phân giải tinh nhất cuối) chủ yếu do tổng số feature quyết định. Width ảnh hưởng mạnh sớm nhưng yếu tới nghiệm asymptotic. A, C, D đều phóng đại hoặc phủ nhận sai.

</details>

---

### 9.5.4 Tile Coding

**Câu 32.** Vì sao chỉ dùng MỘT tiling thì không đạt coarse coding thực sự, mà chỉ là state aggregation?

- A. Vì một tiling có quá nhiều tile để xử lý hiệu quả.
- B. Vì một tiling không hề có khái niệm receptive field.
- C. Vì các tile của một partition không overlap; mỗi state rơi vào đúng một tile nên không generalize ra ngoài — cần nhiều tilings offset nhau.
- D. Vì một tiling luôn tạo ra feature liên tục trong khoảng [0,1].

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Theo định nghĩa, tile của một partition không overlap; với một tiling mỗi state rơi vào đúng một tile, generalization hoàn toàn trong tile — đó là state aggregation. Để có coarse coding thực sự cần nhiều tilings, mỗi cái offset một phần tile width. A, B, D sai.

</details>

---

**Câu 33.** Lợi thế tính toán/thực tiễn quan trọng nhất của tile coding so với coarse coding tổng quát là gì?

- A. Tile coding không cần bất kỳ feature vector nào để hoạt động.
- B. Tile coding luôn được đảm bảo hội tụ về global optimum.
- C. Tile coding cho phép feature nhận giá trị liên tục trong khoảng [0,1].
- D. Số feature active luôn bằng số tilings (cố định) và feature binary, nên tính tổng có trọng số gần như trivial.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Vì dùng partitions, đúng một feature active mỗi tiling nên tổng số feature active luôn bằng số tilings (cố định cho mọi state), giúp set α dễ (ví dụ α = 1/n). Feature binary nên tính (9.8) chỉ cần cộng n component thay vì d phép nhân. A, B, C mô tả sai.

</details>

---

**Câu 34.** Vì sao trong tile coding người ta ưa các displacement vector bất đối xứng (asymmetric offsets), ví dụ first odd integers (1, 3, 5, ...)?

- A. Vì asymmetric offsets giảm số tilings cần thiết xuống còn đúng 1.
- B. Vì uniform offsets gây diagonal artifacts và biến thiên lớn trong generalization, còn asymmetric offsets cho generalization đều, "spherical" và well-centered hơn.
- C. Vì asymmetric offsets làm các feature trở thành liên tục thay vì binary.
- D. Vì uniform offsets làm matrix A mất tính positive definite.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Uniform offsets (như (1,1)) tạo diagonal artifacts và biến thiên mạnh trong generalization. Asymmetric offsets (như (1,3), hoặc first odd integers (1,3,5,...,2k−1) với n là lũy thừa của 2 ≥ 4k) cho generalization đều, "spherical" và well-centered quanh trained state. A, C, D đều sai.

</details>

---

**Câu 35.** "Hashing" trong tile coding dùng để làm gì?

- A. Để biến feature từ binary thành continuous-valued.
- B. Để đảm bảo matrix A luôn positive definite.
- C. Để tăng số tilings lên theo cấp số mũ.
- D. Để giảm bộ nhớ bằng cách pseudo-random thu gọn một tiling lớn thành tập tile nhỏ hơn, thoát curse of dimensionality.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Hashing là phép thu gọn pseudo-random nhất quán một tiling lớn thành tập tile nhỏ hơn, tạo tile gồm vùng rời rạc rải khắp không gian. Nó giảm bộ nhớ với ít mất hiệu năng và giải phóng khỏi curse of dimensionality. A, B, C sai.

</details>

---

**Câu 36.** [Khó] Dùng 8 tilings, mỗi tiling là grid 10×10 trên một không gian 2 chiều. Nếu KHÔNG dùng hashing, cần bao nhiêu weight, và nếu chọn α để học gần đủ một trial (one-trial learning) thì α nên bằng bao nhiêu?

- A. 100 weight; α = 1/100.
- B. 800 weight; α = 1/8.
- C. 8 weight; α = 1/8.
- D. 80 weight; α = 1/80.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Mỗi tiling 10×10 = 100 tile; 8 tiling → 8×100 = 800 weight. Vì đúng 1 feature active mỗi tiling, số feature active luôn = số tilings = 8. Rule of thumb α = 1/n với n là số feature active cho one-trial learning, nên α = 1/8. A đếm sai số tiling; C nhầm số weight với số tilings; D sai cả hai.

</details>

---

### 9.5.5 Radial Basis Functions

**Câu 37.** Radial Basis Functions (RBFs) khác coarse coding/tile coding ở điểm nào, và công thức feature điển hình là gì?

- A. Feature RBF luôn là binary 0/1: bằng 1 nếu trong vùng, 0 nếu ngoài vùng.
- B. Feature RBF luôn bằng đúng khoảng cách Euclid tới center state.
- C. Feature RBF là continuous-valued trong [0,1], đáp ứng Gaussian theo khoảng cách: x_i(s) = exp(−‖s − c_i‖²/(2σ_i²)).
- D. Feature RBF chỉ định nghĩa được cho không gian state rời rạc.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — RBFs là generalization của coarse coding sang continuous-valued features: thay vì 0/1, feature có thể bất kỳ trong [0,1], đáp ứng Gaussian x_i(s) = exp(−‖s − c_i‖²/(2σ_i²)). Ưu điểm là approximation trơn và khả vi, nhưng tăng độ phức tạp và thường giảm hiệu năng khi hơn hai chiều. A, B, D sai.

</details>

---

## 9.6 Selecting Step-Size Parameters Manually

**Câu 38.** Vì sao classical choice α_t = 1/t (cho sample averages trong tabular MC) KHÔNG phù hợp cho TD methods hay function approximation?

- A. Vì 1/t không phù hợp cho TD, cho nonstationary problems, hay cho bất kỳ method nào dùng function approximation.
- B. Vì 1/t luôn quá lớn ở mọi thời điểm học.
- C. Vì 1/t vi phạm các điều kiện stochastic approximation chuẩn.
- D. Vì 1/t chỉ dùng được cho nonlinear approximation.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — α_t = 1/t tạo sample averages trong tabular MC, nhưng không phù hợp cho TD, nonstationary problems, hay bất kỳ method dùng FA. Rule of thumb cho linear SGD là α = (τ E[xᵀx])⁻¹ (9.19). B sai (1/t giảm dần), C sai (1/t thực ra thỏa điều kiện đó), D sai.

</details>

---

**Câu 39.** [Khó] Theo rule of thumb (9.19) α = (τ E[xᵀx])⁻¹, với tile coding dùng n tilings (feature binary, đúng n feature active), nếu muốn học gần đủ trong khoảng τ trải nghiệm với cùng feature vector thì α nên bằng bao nhiêu?

- A. α = 1/(τ·d), với d là tổng số weight.
- B. α = τ/n.
- C. α = 1/(τ·n), vì với feature binary đúng n active thì E[xᵀx] = n.
- D. α = n/τ.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Với tile coding, x là binary và đúng n component bằng 1, nên xᵀx = n cho mọi state, do đó E[xᵀx] = n. Thay vào (9.19): α = 1/(τ·n). Khi τ = 1 ta thu được α = 1/n (one-trial learning). A dùng nhầm d thay vì n; B, D đảo sai vị trí.

</details>

---

## 9.7 Nonlinear Function Approximation: Artificial Neural Networks

**Câu 40.** Vì sao nonlinearity là essential trong multi-layer feedforward ANN?

- A. Vì các nonlinear activation function chạy nhanh hơn linear function.
- B. Vì nếu mọi unit dùng linear activation thì toàn mạng tương đương một mạng không hidden layer (linear của linear vẫn là linear).
- C. Vì linear activation chắc chắn gây ra divergence khi học.
- D. Vì nonlinear function không cần dùng tới backpropagation.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Nếu mọi unit dùng linear activation, toàn mạng tương đương mạng không hidden layer, vì linear của linear vẫn là linear. Một hidden layer với đủ sigmoid units có thể xấp xỉ bất kỳ continuous function nào (universal approximation), nhưng nonlinearity là điều kiện cần. A, C, D sai.

</details>

---

**Câu 41.** Backpropagation gặp khó khăn gì với deep ANNs (nhiều hidden layers)?

- A. Backprop không thể tính được gradient cho mạng nhiều tầng.
- B. Backprop chỉ hoạt động được với các unit có linear activation.
- C. Backprop yêu cầu phải biết trước true value function để học.
- D. Partial derivatives ở backward passes hoặc decay nhanh (vanishing) hoặc grow nhanh (exploding); deep ANN cũng dễ overfitting.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Backprop tốt cho shallow networks nhưng kém với deep ANN: partial derivatives ở backward passes hoặc decay nhanh về phía input (vanishing, học tầng sâu rất chậm) hoặc grow nhanh (exploding, không ổn định). Deep ANN cũng dễ overfitting vì rất nhiều weight. A, B, C sai.

</details>

---

**Câu 42.** Phương pháp dropout giảm overfitting bằng cách nào?

- A. Bằng cách tăng step-size lên gấp đôi trong khi huấn luyện.
- B. Bằng cách cố định toàn bộ weight của mạng về đúng 0.
- C. Trong huấn luyện ngẫu nhiên loại bỏ các unit cùng connections (như huấn luyện nhiều mạng "thinned"); khi test kết hợp lại.
- D. Bằng cách chỉ dùng duy nhất một hidden layer trong toàn mạng.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Dropout ngẫu nhiên loại bỏ unit cùng connections trong huấn luyện, như thể huấn luyện nhiều mạng "thinned". Khi test kết hợp lại (xấp xỉ bằng cách nhân outgoing weight với xác suất giữ unit) để cải thiện generalization, khuyến khích hidden units học features hữu ích với nhiều tổ hợp. A, B, D sai.

</details>

---

**Câu 43.** [Khó] Trong deep RL, hai kỹ thuật của DQN (Mnih et al. 2015) là experience replay và target network. Mục đích chính của experience replay liên hệ thế nào với hạn chế của FA cổ điển nêu ở mục 9.1?

- A. Experience replay lưu và lấy mẫu ngẫu nhiên các transition cũ, làm dữ liệu gần i.i.d. hơn và giảm correlation, xấp xỉ điều kiện static-training-set mà FA cổ điển cần.
- B. Experience replay tăng số hidden layer để tránh vanishing gradient.
- C. Experience replay loại bỏ hoàn toàn nhu cầu bootstrapping trong cập nhật.
- D. Experience replay biến target thành unbiased, nên DQN trở thành true gradient.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Mục 9.1 nêu FA cổ điển giả định static training set i.i.d.; online RL vi phạm điều này (dữ liệu tương quan, nonstationary). Experience replay lưu transition và lấy mẫu ngẫu nhiên, phá vỡ tương quan thời gian, làm phân phối mẫu ổn định và gần i.i.d. hơn — đúng tinh thần khắc phục hạn chế đó. B, C, D mô tả sai vai trò của replay (B là chuyện kiến trúc, C/D là target network và bootstrapping chứ không phải replay).

</details>

---

## 9.8 Least-Squares TD

**Câu 44.** LSTD khác semi-gradient TD(0) ở ý tưởng cốt lõi nào?

- A. LSTD chuyển hẳn sang dùng nonlinear approximation thay vì linear.
- B. LSTD ước lượng trực tiếp Â và b̂ rồi tính TD fixed point w = Â⁻¹b̂, thay vì lặp iterative — data-efficient hơn.
- C. LSTD bỏ qua hoàn toàn cơ chế bootstrapping trong cập nhật.
- D. LSTD hội tụ về một điểm hoàn toàn khác TD fixed point.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — LSTD nhận thấy tính TD fixed point iterative là lãng phí dữ liệu; thay vào đó hình thành ước lượng Â_t = Σ x_k(x_k − γx_{k+1})ᵀ + εI và b̂_t = Σ R_{k+1}x_k, rồi tính trực tiếp w_t = Â_t⁻¹ b̂_t (9.21). Đây là dạng data-efficient nhất của linear TD(0). A, C, D sai.

</details>

---

**Câu 45.** Đánh đổi (trade-off) chính của LSTD so với semi-gradient TD về độ phức tạp tính toán là gì?

- A. LSTD chỉ tốn O(d) như semi-gradient TD, không có đánh đổi nào.
- B. LSTD tốn O(d³) mỗi bước và không có cách nào giảm xuống.
- C. LSTD tốn O(d²) bộ nhớ/tính toán mỗi bước (nhờ Sherman-Morrison), còn semi-gradient TD chỉ O(d).
- D. LSTD chỉ tốn O(1) bộ nhớ bất kể số chiều feature.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Semi-gradient TD chỉ O(d) mỗi bước. LSTD cần cập nhật ma trận (outer product) → O(d²); nghịch đảo tổng quát O(d³) nhưng nhờ Sherman-Morrison (9.22) cập nhật incremental chỉ O(d²). Vậy LSTD là O(d²) bộ nhớ/tính toán mỗi bước. A, B, D sai.

</details>

---

**Câu 46.** Phát biểu nào ĐÚNG về việc LSTD "không cần step-size parameter"?

- A. Đây là lợi thế tuyệt đối, hoàn toàn không kèm theo nhược điểm nào.
- B. LSTD vẫn cần step-size α như TD thông thường.
- C. LSTD không cần cả α lẫn ε và không bao giờ gặp vấn đề khi nghịch đảo.
- D. LSTD không cần α nhưng cần ε; quan trọng hơn, nó không bao giờ "quên" — gây vấn đề khi π thay đổi (GPI).

<details>
<summary>Đáp án</summary>

**Đáp án: D** — LSTD không cần α nhưng cần ε (quá nhỏ → nghịch đảo dao động mạnh; quá lớn → học chậm). Lợi thế "không cần step-size" thường bị thổi phồng vì LSTD không bao giờ quên — gây vấn đề khi π thay đổi như trong GPI, nên control thường phải kết hợp cơ chế forgetting. A, B, C sai.

</details>

---

**Câu 47.** [Khó] Một bài toán có d = 1000 features. So với semi-gradient TD, LSTD cập nhật mỗi bước tốn gấp khoảng bao nhiêu lần về tính toán, và khi nào sự đánh đổi này đáng giá?

- A. Gấp khoảng 1000 lần (O(d²) so với O(d)); đáng giá khi dữ liệu đắt/khan hiếm và d không quá lớn.
- B. Gấp khoảng 1 lần (cùng độ phức tạp); luôn đáng dùng LSTD.
- C. Gấp khoảng 1.000.000 lần (O(d³) so với O(d)); hầu như không bao giờ đáng.
- D. Gấp khoảng 2 lần (O(2d) so với O(d)); luôn đáng dùng.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — LSTD là O(d²) mỗi bước, semi-gradient TD là O(d), nên tỉ lệ ≈ d = 1000 lần. Đánh đổi đáng giá khi dữ liệu (experience) đắt/khan hiếm và ta muốn data-efficiency tối đa, đồng thời d đủ nhỏ để O(d²) khả thi. C sai vì Sherman-Morrison hạ O(d³) xuống O(d²); B, D đánh giá sai độ phức tạp.

</details>

---

## 9.9 Memory-based Function Approximation

**Câu 48.** Memory-based function approximation methods khác parametric approach căn bản như thế nào?

- A. Chúng điều chỉnh các tham số của một functional form cố định cho trước.
- B. Chúng lưu các training examples (lazy learning), không update tham số; khi cần value của query state thì truy hồi tập examples liên quan để tính — nonparametric.
- C. Chúng yêu cầu bộ nhớ tăng theo cấp số mũ với số chiều state.
- D. Chúng chỉ hoạt động được với linear features cố định.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Memory-based methods lưu examples khi đến (lazy learning), không update tham số; khi cần value của query state thì truy hồi tập examples liên quan (thường theo khoảng cách) để tính. Đây là nonparametric: dạng hàm do chính examples quyết định. A mô tả parametric; C, D sai.

</details>

---

**Câu 49.** Memory-based local methods giúp giải quyết curse of dimensionality như thế nào?

- A. Bằng cách lưu một global approximation cần bộ nhớ exponential theo k.
- B. Bằng cách chuyển sang dùng nonlinear ANN nhiều tầng.
- C. Bằng cách tăng step-size để học nhanh hơn trên không gian lớn.
- D. Mỗi example chỉ cần bộ nhớ tỉ lệ k, lưu n examples chỉ tốn tuyến tính theo n; tập trung approximation vào vùng thực sự thăm.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Tabular global approximation cần bộ nhớ exponential theo k. Memory-based: mỗi example tốn bộ nhớ tỉ lệ k, lưu n examples tốn tuyến tính theo n — không exponential. Nhờ trajectory sampling, tập trung approximation vào neighborhood thực sự thăm. Vấn đề còn lại là tốc độ nearest-neighbor query (dùng k-d tree). A, B, C sai.

</details>

---

## 9.10 Kernel-based Function Approximation

**Câu 50.** Kernel function k(s, s') biểu diễn điều gì, và liên hệ với tile coding ra sao?

- A. k(s,s') là true value của s'; tile coding hoàn toàn không liên quan tới kernel.
- B. k(s,s') là step-size dùng giữa hai state s và s'.
- C. k(s,s') đo strength of generalization từ s' tới s; tile coding tuy không dùng kernel tường minh nhưng generalize theo một kernel.
- D. k(s,s') luôn bằng 0 mỗi khi s khác s'.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Kernel function k(s,s') gán trọng số cho dữ liệu về s' khi trả lời truy vấn về s, biểu diễn strength of generalization từ s' tới s. Strength of generalization của tile coding ứng với các kernel khác nhau — tile coding generalize theo một kernel dù không dùng kernel tường minh. A, B, D sai.

</details>

---

**Câu 51.** "Kernel trick" cho phép điều gì, và mối liên hệ giữa kernel và feature vector trong linear parametric methods là gì?

- A. k(s,s') = ‖x(s) − x(s')‖; kernel trick cho phép bỏ hẳn feature vectors.
- B. Mọi linear parametric method có thể recast thành kernel regression với k(s,s') = x(s)ᵀx(s'); kernel trick cho phép làm việc hiệu quả trong không gian feature lớn chỉ qua các stored examples.
- C. Kernel trick chỉ dùng được với nonlinear ANN nhiều tầng.
- D. k(s,s') = v̂(s) × v̂(s'); không liên quan tới feature vectors.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Mọi linear parametric regression với feature vectors x(s) có thể recast thành kernel regression với k(s,s') = x(s)ᵀx(s') (9.24). Kernel trick: thay vì xây feature vectors, ta xây trực tiếp kernel; nếu k compact, có thể làm việc hiệu quả trong không gian feature rất lớn mà thực chất chỉ thao tác với tập stored examples. A dùng sai công thức (kernel là inner product, không phải khoảng cách); C, D sai.

</details>

---

**Câu 52.** [Khó] Một feature map giả định ánh xạ state vào không gian feature 10^6 chiều, nhưng kernel k(s,s') = x(s)ᵀx(s') có dạng đóng (closed form) tính được trong O(1). Lợi ích then chốt của kernel trick ở đây là gì?

- A. Ta tính kernel regression mà không bao giờ phải xây hay lưu vector 10^6 chiều, chỉ thao tác trên các stored examples.
- B. Ta buộc phải vẫn lưu đầy đủ vector 10^6 chiều cho mỗi example.
- C. Kernel trick làm số chiều feature giảm thực sự xuống còn O(1).
- D. Kernel trick biến bài toán linear thành nonlinear theo w.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Sức mạnh của kernel trick chính ở chỗ này: nếu inner product x(s)ᵀx(s') có dạng đóng rẻ, ta làm việc "trong" không gian feature khổng lồ mà không bao giờ phải hiện thực hóa vector cao chiều — toàn bộ tính toán quy về các giá trị kernel giữa các stored examples. B mâu thuẫn ý tưởng; C sai (số chiều feature ngầm vẫn lớn, chỉ là không cần lưu); D sai vì hồi quy vẫn linear theo tham số trong không gian feature.

</details>

---

## 9.11 Looking Deeper: Interest and Emphasis

**Câu 53.** Khái niệm "interest" I_t được giới thiệu để làm gì?

- A. Là một step-size riêng được gán cho mỗi state trong không gian.
- B. Là true value của state tại thời điểm t.
- C. Là số tilings được dùng trong cấu hình tile coding.
- D. Là scalar không âm chỉ mức độ ta quan tâm valuing chính xác state tại t; µ trong VE được định nghĩa là phân phối state dưới target policy, weight theo interest.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Interest I_t là scalar không âm chỉ mức độ quan tâm valuing chính xác state tại t (0 nếu không quan tâm, có thể 1 nếu quan tâm hoàn toàn). µ trong VE khi đó được định nghĩa là phân phối state dưới target policy có weight theo interest; interest đặt theo bất kỳ cách causal nào. A, B, C sai.

</details>

---

**Câu 54.** Emphasis M_t hoạt động thế nào, và liên hệ với interest qua công thức nào?

- A. M_t nhân vào learning update để nhấn/giảm việc học tại t; M_t = I_t + γⁿ M_{t−n}.
- B. M_t thay thế hoàn toàn step-size α; M_t = I_t × α.
- C. M_t chính là true value của state; M_t = v_π(S_t).
- D. M_t luôn được giữ cố định bằng đúng 1.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Emphasis M_t là scalar không âm nhân vào learning update để nhấn/giảm việc học tại t. Update: w_{t+n} = w_{t+n−1} + α M_t [G_{t:t+n} − v̂(S_t,·)] ∇v̂(S_t,·) (9.25), với emphasis xác định đệ quy từ interest: M_t = I_t + γⁿ M_{t−n} (9.26). B, C, D sai.

</details>

---

**Câu 55.** Trong Example 9.4 (four-state MRP, chỉ quan tâm leftmost state với interest 1), phương pháp KHÔNG dùng interest/emphasis so với phương pháp CÓ dùng cho kết quả gì?

- A. Cả hai phương pháp đều cho leftmost state nhận đúng value bằng 4.
- B. Gradient MC (không dùng emphasis) hội tụ về w = (3.5, 1.5) → leftmost = 3.5; phương pháp có dùng học chính xác leftmost (w_1 → 4).
- C. Phương pháp có dùng interest/emphasis lại cho kết quả tệ hơn rõ rệt.
- D. Cả hai phương pháp cuối cùng đều diverge tới vô cực.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Gradient MC không dùng interest/emphasis hội tụ về w = (3.5, 1.5), cho leftmost state value 3.5 (trung gian). Phương pháp dùng interest/emphasis học leftmost chính xác (w_1 → 4); w_2 không bao giờ được update vì emphasis bằng 0 ở state khác. A, C, D sai.

</details>

---

**Câu 56.** [Khó] Nếu đặt interest I_t = 1 cho MỌI state (đồng đều), emphasis-based n-step TD sẽ rút gọn thành phương pháp nào?

- A. Thành phương pháp n-step semi-gradient TD thông thường (không trọng số emphasis đặc biệt).
- B. Thành LSTD với hằng số ε bằng 1.
- C. Thành kernel regression với kernel đồng nhất.
- D. Thành nearest-neighbor memory-based method.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Khi I_t = 1 đồng đều, emphasis M_t lan ra đều và update (9.25) thoái hóa về dạng n-step semi-gradient TD chuẩn (mọi state được học với trọng số như nhau, theo on-policy distribution thông thường). Interest/emphasis chỉ tạo khác biệt khi ta gán interest không đồng đều để tập trung lỗi vào tập state quan tâm. B, C, D không liên quan.

</details>

---

## 9.12 Summary

**Câu 57.** Theo phần Summary, n-step semi-gradient TD bao gồm những phương pháp đặc biệt nào ở n = 1 và n = ∞?

- A. n = 1 là gradient Monte Carlo, n = ∞ là semi-gradient TD(0).
- B. n = 1 là LSTD, còn n = ∞ là dynamic programming.
- C. n = 1 là semi-gradient TD(0), n = ∞ là gradient Monte Carlo.
- D. n = 1 là kernel regression, n = ∞ là nearest neighbor.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — n-step semi-gradient TD bao gồm semi-gradient TD(0) (n = 1) và gradient Monte Carlo (n = ∞) như các trường hợp đặc biệt — learning algorithm tự nhiên cho on-policy prediction với fixed policy. A đảo ngược; B, D sai.

</details>

---

**Câu 58.** Theo phần Summary, phát biểu nào ĐÚNG về bound hội tụ của linear semi-gradient n-step TD theo giá trị n?

- A. Bound luôn lỏng hơn (tệ hơn) khi n cao hơn.
- B. Bound luôn chặt hơn khi n cao hơn và tiến về 0 khi n → ∞; nhưng n quá cao gây học chậm nên thường ưa một mức bootstrapping (n < ∞).
- C. Bound hoàn toàn không phụ thuộc vào giá trị n.
- D. Linear semi-gradient n-step TD không hề có đảm bảo hội tụ.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Linear semi-gradient n-step TD hội tụ với mọi n, về VE trong một bound của optimal error. Bound chặt hơn với n cao hơn và tiến về 0 khi n → ∞ (đạt bởi MC); nhưng n rất cao gây học chậm, nên thường ưa một mức bootstrapping (n < ∞). A, C, D sai.

</details>

---

**Câu 59.** Theo phần Summary, đâu là lý do chính khiến semi-gradient methods "không thể dựa vào classical SGD results"?

- A. Vì chúng dùng nonlinear approximation thay vì linear.
- B. Vì chúng hoàn toàn không có objective function để tối ưu.
- C. Vì chúng không sử dụng feature vectors trong cập nhật.
- D. Vì trong bootstrapping (gồm DP), weight vector xuất hiện trong target nhưng không được tính khi lấy gradient — nên chỉ là semi-gradient.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Trong bootstrapping (DP, semi-gradient TD), weight vector xuất hiện trong update target nhưng không được tính khi lấy gradient — nên chúng là semi-gradient methods, không phải true gradient, do đó không dựa được vào classical SGD convergence results. A, B, C sai.

</details>

---

**Câu 60.** Theo phần Summary, đâu là tổng kết ĐÚNG về các lựa chọn feature construction cho linear methods?

- A. Polynomials là lựa chọn tốt nhất cho online learning.
- B. RBF luôn vượt trội tile coding ở mọi số chiều state.
- C. Polynomials generalize kém online; Fourier basis hoặc coarse coding (sparse overlapping receptive fields) tốt hơn; tile coding là dạng coarse coding hiệu quả, linh hoạt; RBF hữu ích cho bài toán 1-2 chiều cần đáp ứng trơn.
- D. LSTD là phương pháp feature construction tốt nhất hiện có.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Polynomials generalize kém online. Tốt hơn là Fourier basis, hoặc coarse coding với sparse overlapping receptive fields. Tile coding là dạng coarse coding đặc biệt hiệu quả và linh hoạt. RBF hữu ích cho bài toán 1-2 chiều cần đáp ứng trơn. (LSTD là prediction method, không phải feature construction.) A, B, D sai.

</details>

---

**Câu 61.** [Khó] Bạn cần chọn feature construction cho một bài toán control online, state space liên tục 6 chiều, yêu cầu cập nhật cực nhanh mỗi bước và có thể chấp nhận generalization dạng "hộp". Lựa chọn nào phù hợp nhất theo khuyến nghị của chương?

- A. Order-5 polynomial basis, vì biểu diễn được tương tác bậc cao giữa 6 chiều.
- B. Tile coding (có thể kèm hashing), vì feature binary, số feature active cố định nên cập nhật O(số tilings) rất nhanh và set α dễ.
- C. RBF dày đặc trên cả 6 chiều, vì cho approximation trơn và khả vi nhất.
- D. Fourier basis bậc cao, vì luôn cho nghiệm asymptotic tốt nhất.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Với online control cần cập nhật nhanh và chấp nhận generalization dạng hộp, tile coding là khuyến nghị điển hình: feature binary, số active cố định (= số tilings) nên cập nhật rất rẻ, set α dễ (α = 1/n), và hashing kiểm soát bộ nhớ ở 6 chiều. A polynomial generalize kém online và (n+1)^6 bùng nổ; C RBF tốn kém và thường giảm hiệu năng quá 2 chiều; D Fourier là global, đắt và gặp ringing — không tối ưu cho online control nhiều chiều.

</details>
