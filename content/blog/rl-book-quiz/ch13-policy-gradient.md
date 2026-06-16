# Chương 13: Policy Gradient Methods — Câu hỏi trắc nghiệm

> Bộ câu hỏi ôn tập chi tiết cho Chương 13, sách *Reinforcement Learning: An Introduction* (Sutton & Barto, 2nd ed.)

## 13.1 Policy Approximation and its Advantages

**Câu 1.** Điểm khác biệt cốt lõi giữa policy gradient methods và các action-value methods đã học ở các chương trước là gì?

- A. Policy gradient methods học một value function rồi suy ra policy bằng cách lấy greedy đối với value function đó.
- B. Policy gradient methods học một parameterized policy `π(a|s,θ)` chọn action mà không cần tham khảo một value function để ra quyết định.
- C. Policy gradient methods chỉ áp dụng được cho bài toán bandit một trạng thái và không mở rộng được lên full MDP.
- D. Policy gradient methods học action values nhưng dùng softmax thay cho ε-greedy để cân bằng exploration.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Trong action-value methods, policy thậm chí không tồn tại nếu không có ước lượng action value. Ngược lại, policy gradient methods học trực tiếp một parameterized policy `π(a|s,θ) = Pr{Aₜ=a | Sₜ=s, θₜ=θ}` để chọn action mà không cần tham khảo value function. A và D mô tả action-value methods (vẫn dựa trên value để chọn action). C sai vì policy gradient áp dụng cho full MDP. Lưu ý: một value function (weight vector `w`) vẫn có thể được dùng để *học* `θ`, nhưng không bắt buộc cho việc *chọn* action.

</details>

---

**Câu 2.** Điều kiện toán học bắt buộc đối với cách parameterize policy trong policy gradient methods là gì?

- A. `π(a|s,θ)` phải là một hàm tuyến tính theo các thành phần của vector tham số `θ`.
- B. `π(a|s,θ)` phải khả vi theo `θ`, tức gradient `∇π(a|s,θ)` tồn tại và hữu hạn với mọi `s, a, θ`.
- C. `π(a|s,θ)` phải xác định (deterministic) tại mọi trạng thái để đảm bảo tính hội tụ.
- D. `π(a|s,θ)` phải được tính bằng một deep neural network có ít nhất một hidden layer.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Policy có thể được parameterize theo bất kỳ cách nào, miễn là `π(a|s,θ)` khả vi theo các tham số của nó, tức column vector của các đạo hàm riêng `∇π(a|s,θ)` tồn tại và hữu hạn với mọi `s, a, θ`. A sai vì preferences có thể tuyến tính HOẶC phi tuyến (ANN) — tuyến tính chỉ là một ví dụ. D sai vì ANN cũng chỉ là một ví dụ, không bắt buộc. C sai: để đảm bảo exploration, ta thường yêu cầu policy KHÔNG bao giờ trở nên deterministic (`π(a|s,θ) ∈ (0,1)`).

</details>

---

**Câu 3.** Công thức softmax in action preferences được viết như thế nào?

- A. `π(a|s,θ) = e^{q(s,a,w)} / Σ_b e^{q(s,b,w)}` với `q` là ước lượng action value.
- B. `π(a|s,θ) = h(s,a,θ) / Σ_b h(s,b,θ)` chuẩn hóa preference theo tổng các preference.
- C. `π(a|s,θ) = e^{h(s,a,θ)} / Σ_b e^{h(s,b,θ)}` với `h` là numerical preference.
- D. `π(a|s,θ) = argmax_a h(s,a,θ)` chọn action có preference cao nhất.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Với không gian action rời rạc và không quá lớn, ta hình thành các parameterized numerical preferences `h(s,a,θ) ∈ ℝ`. Các action có preference cao nhất được gán xác suất cao nhất theo phân phối exponential soft-max: `π(a|s,θ) = e^{h(s,a,θ)} / Σ_b e^{h(s,b,θ)}` (công thức 13.2). Mẫu số đảm bảo các xác suất ở mỗi trạng thái cộng lại bằng 1. A sai vì softmax ở đây dựa trên action *preferences* `h`, không phải trên action *values* `q`. B thiếu phép lũy thừa exponential. D là argmax (deterministic), không phải softmax stochastic.

</details>

---

**Câu 4.** Tại sao softmax in action preferences có lợi thế hơn việc dùng softmax trên action values khi muốn tiến gần tới một deterministic policy?

- A. Vì action preferences được điều khiển để tạo optimal stochastic policy và có thể bị đẩy lên vô hạn, trong khi action values hội tụ về giá trị thực hữu hạn nên cho xác suất khác 0 và 1.
- B. Vì softmax trên action preferences luôn hội tụ nhanh hơn về một deterministic policy trên mọi bài toán.
- C. Vì softmax trên action values yêu cầu temperature parameter còn softmax trên preferences thì không cần.
- D. Vì action values không thể được biểu diễn bằng linear function approximation còn preferences thì có thể.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Action preferences khác với action values ở chỗ chúng không tiến về các giá trị cụ thể; thay vào đó chúng được điều khiển để tạo ra optimal stochastic policy. Nếu optimal policy là deterministic, preferences của các optimal action sẽ bị đẩy cao vô hạn so với các suboptimal action (nếu parameterization cho phép). Ngược lại, softmax trên action values sẽ cho các ước lượng hội tụ về giá trị thực, khác nhau một lượng hữu hạn, dịch ra thành các xác suất cụ thể khác 0 và 1 — không thể tiến tới deterministic. B sai (tốc độ hội tụ phụ thuộc bài toán). C, D không phải lý do trong sách.

</details>

---

**Câu 5.** Trong Example 13.1 (short corridor with switched actions), tại sao một action-value method với ε-greedy lại kém hơn một policy parameterization có thể học xác suất cụ thể?

- A. Vì reward trong bài toán này luôn dương nên action-value method tích lũy giá trị sai dấu.
- B. Vì action-value method không thể chạy trên các bài toán có function approximation tuyến tính.
- C. Vì policy parameterization luôn hội tụ về deterministic policy nên đạt giá trị tối ưu trong bài toán này.
- D. Vì ε-greedy bị buộc chọn giữa hai policy gần-deterministic, trong khi optimal là stochastic policy chọn right với xác suất khoảng 0.59.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Vì mọi trạng thái trông giống hệt nhau dưới function approximation, một action-value method với ε-greedy (ε=0.1) bị buộc chọn giữa hai policy: chọn right với xác suất cao `1-ε/2` hoặc chọn left với cùng xác suất cao, đạt giá trị tại start state lần lượt nhỏ hơn -44 và -82. Một phương pháp học được xác suất cụ thể để chọn right (tốt nhất khoảng 0.59) đạt giá trị khoảng -11.6. C sai vì ở đây optimal là *stochastic*, không phải deterministic. A, B không đúng với mô tả bài toán.

</details>

---

**Câu 6.** [Khó] Trong short corridor, giả sử ε-greedy chọn action "tốt" với xác suất `1 − ε/2 = 0.95` và action "xấu" với `ε/2 = 0.05`. Vì sao một policy stochastic chọn right với xác suất ~0.59 lại tốt hơn cả hai cấu hình ε-greedy gần-deterministic?

- A. Vì 0.59 nhỏ hơn 0.95 nên policy ít exploit hơn, dẫn tới exploration nhiều hơn và reward kỳ vọng cao hơn.
- B. Vì cấu trúc switched-action khiến một policy lệch mạnh về right hoặc left đều dễ bị kẹt qua lại; xác suất trung dung ~0.59 cân bằng để thoát corridor nhanh nhất, đạt giá trị ~-11.6 thay vì < -44.
- C. Vì xác suất 0.59 làm cho value function hội tụ về đúng giá trị thực còn 0.95 thì không.
- D. Vì ε-greedy chỉ tối ưu cho deterministic optimal policy, mà bài toán này lại có nhiều optimal policy tương đương nhau.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Trong corridor có một state mà action bị "switched" (đảo hướng), nên một policy gần-deterministic theo một hướng sẽ liên tục đi sai ở state đó và bị kẹt qua lại, tốn rất nhiều bước. Một stochastic policy với xác suất trung dung (~0.59 chọn right) cho phép thoát khỏi corridor hiệu quả nhất, đạt giá trị start state ~-11.6, vượt xa hai cấu hình ε-greedy (< -44 và < -82). A sai (nhiều exploration không tự nó tốt hơn; điểm mấu chốt là *tối ưu* xác suất). C, D không đúng bản chất bài toán.

</details>

---

## 13.2 The Policy Gradient Theorem

**Câu 7.** Trong episodic case, performance measure `J(θ)` được định nghĩa như thế nào (giả định mỗi episode bắt đầu ở trạng thái cố định `s₀`)?

- A. `J(θ) = v_{π_θ}(s₀)`, giá trị của start state dưới parameterized policy.
- B. `J(θ) = r(π)`, average reward rate trên một bước thời gian.
- C. `J(θ) = Σ_s μ(s) Σ_a q_π(s,a)`, tổng action value theo on-policy distribution.
- D. `J(θ) = Σ_t γᵗ Rₜ`, discounted return tích lũy của toàn bộ episode.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Trong episodic case, ta định nghĩa performance là giá trị của start state của episode: `J(θ) = v_{π_θ}(s₀)` (công thức 13.4), với `v_{π_θ}` là true value function của policy `π_θ` xác định bởi `θ`. B là định nghĩa cho continuing case (Section 13.6). C là một biểu thức trung gian không phải định nghĩa của `J`. D là một sample return, không phải performance measure trung bình.

</details>

---

**Câu 8.** Vấn đề chính khiến việc tính gradient của performance theo policy parameter trở nên khó khăn là gì, và policy gradient theorem giải quyết ra sao?

- A. Vấn đề là gradient luôn xấp xỉ 0 gần optimum; theorem cung cấp một biểu thức scale lại để gradient khác 0.
- B. Vấn đề là performance phụ thuộc cả action selection lẫn state distribution (đều bị `θ` ảnh hưởng), mà ảnh hưởng lên state distribution phụ thuộc môi trường và thường không biết; theorem cho công thức gradient không chứa đạo hàm của state distribution.
- C. Vấn đề là policy không khả vi tại các điểm deterministic; theorem làm trơn policy để nó khả vi mọi nơi.
- D. Vấn đề là reward bị discount theo `γ`; theorem viết lại gradient để loại bỏ hoàn toàn discounting.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Performance phụ thuộc cả vào action selection lẫn distribution of states nơi các selection được thực hiện, và cả hai đều bị ảnh hưởng bởi policy parameter. Ảnh hưởng của `θ` lên action tính được tương đối dễ từ parameterization, nhưng ảnh hưởng lên state distribution là một hàm của môi trường và thường không biết. Policy gradient theorem cho biểu thức giải tích của gradient mà KHÔNG liên quan đến đạo hàm của state distribution. A, C, D mô tả các vấn đề không phải là vấn đề thực mà theorem giải quyết.

</details>

---

**Câu 9.** Phát biểu policy gradient theorem cho episodic case là gì?

- A. `∇J(θ) = Σ_s μ(s) Σ_a q_π(s,a) ∇π(a|s,θ)` (đẳng thức chính xác).
- B. `∇J(θ) ∝ Σ_s μ(s) Σ_a ∇q_π(s,a) π(a|s,θ)` (gradient nằm trên `q_π`).
- C. `∇J(θ) ∝ Σ_s μ(s) Σ_a q_π(s,a) ∇π(a|s,θ)` (gradient nằm trên `π`).
- D. `∇J(θ) ∝ Σ_a q_π(s,a) ∇π(a|s,θ)` cho một state `s` đại diện duy nhất.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Policy gradient theorem cho episodic case (công thức 13.5): `∇J(θ) ∝ Σ_s μ(s) Σ_a q_π(s,a) ∇π(a|s,θ)`, với `μ` là on-policy distribution dưới `π`. Gradient nằm trên `∇π(a|s,θ)`, không phải `q_π` — nên B sai. Ký hiệu `∝` (tỉ lệ với) là quan trọng: trong episodic case hằng số tỉ lệ là độ dài trung bình episode, trong continuing case là 1 (thành đẳng thức) — nên A (đẳng thức) sai. D bỏ tổng theo state distribution `μ`.

</details>

---

## 13.3 REINFORCE: Monte Carlo Policy Gradient

**Câu 10.** Tại sao trong policy gradient methods, một sample gradient chỉ cần *tỉ lệ* với gradient thực là đủ (không cần bằng đúng)?

- A. Vì policy gradient theorem chỉ là một xấp xỉ thô, nên gradient thực không bao giờ tính được chính xác.
- B. Vì hằng số tỉ lệ có thể được hấp thụ vào step size `α`, vốn dĩ là tham số tùy ý.
- C. Vì gradient thực luôn bằng 0 ở mọi điểm nên hệ số tỉ lệ không làm thay đổi hướng cập nhật.
- D. Vì sample gradient và gradient thực luôn ngược dấu, nên chỉ hướng mới quan trọng.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Sample gradient chỉ cần tỉ lệ với gradient vì bất kỳ hằng số tỉ lệ nào cũng có thể được hấp thụ vào step size `α`, vốn dĩ là tùy ý. Policy gradient theorem cho biểu thức chính xác *tỉ lệ* với gradient; tất cả những gì cần là một cách sample sao cho kỳ vọng bằng hoặc xấp xỉ biểu thức này. A, C, D đều là phát biểu sai về bản chất gradient.

</details>

---

**Câu 11.** Phương trình cập nhật của REINFORCE (công thức 13.8) là gì?

- A. `θₜ₊₁ = θₜ + α Gₜ ∇π(Aₜ|Sₜ,θₜ) / π(Aₜ|Sₜ,θₜ)`.
- B. `θₜ₊₁ = θₜ + α Gₜ ∇π(Aₜ|Sₜ,θₜ)` (không chia cho xác suất action).
- C. `θₜ₊₁ = θₜ + α Σ_a q̂(Sₜ,a,w) ∇π(a|Sₜ,θ)` (tổng trên mọi action).
- D. `θₜ₊₁ = θₜ + α q_π(Sₜ,Aₜ) π(Aₜ|Sₜ,θₜ)` (nhân với xác suất action).

<details>
<summary>Đáp án</summary>

**Đáp án: A** — REINFORCE update là `θₜ₊₁ = θₜ + α Gₜ ∇π(Aₜ|Sₜ,θₜ) / π(Aₜ|Sₜ,θₜ)` (công thức 13.8). Mỗi increment tỉ lệ với tích của return `Gₜ` và gradient xác suất chọn action thực sự, chia cho xác suất chọn action đó. Chia cho xác suất là cần thiết vì nếu không (như B), các action được chọn thường xuyên sẽ có lợi thế và có thể thắng dù không cho return cao nhất. C là all-actions method, không phải REINFORCE cổ điển. D là biểu thức sai cả về dạng lẫn hệ số.

</details>

---

**Câu 12.** Trong pseudocode, biểu thức `∇π(Aₜ|Sₜ,θₜ)/π(Aₜ|Sₜ,θₜ)` được viết gọn thành `∇ln π(Aₜ|Sₜ,θₜ)`. Vector này được gọi tên là gì và dựa trên đẳng thức nào?

- A. Gọi là advantage; dựa trên đẳng thức `∇ln x = x · ∇x`.
- B. Gọi là baseline vector; dựa trên đẳng thức `∇ln x = ∇x · x`.
- C. Gọi là critic vector; dựa trên đẳng thức `ln(∇x) = ∇x / x`.
- D. Gọi là eligibility vector (còn gọi score function); dựa trên đẳng thức `∇ln x = ∇x / x`.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Hai biểu thức tương đương nhờ đẳng thức `∇ln x = ∇x / x`. Vector này được sách gọi là eligibility vector (trong các tài liệu khác còn gọi là score function). Đáng chú ý, đây là nơi duy nhất policy parameterization xuất hiện trong thuật toán. A, B, C dùng tên sai hoặc đẳng thức sai (advantage, baseline, critic là các khái niệm khác).

</details>

---

**Câu 13.** Tại sao REINFORCE được xem là một Monte Carlo algorithm và nó có nhược điểm gì?

- A. Vì nó bootstrap từ value function ước lượng tại bước kế tiếp; nhược điểm là bias do bootstrapping.
- B. Vì nó dùng complete return `Gₜ` (toàn bộ reward đến hết episode), chỉ định nghĩa được cho episodic case với update làm sau khi episode kết thúc; nhược điểm là variance cao nên học chậm.
- C. Vì nó dùng one-step return `Gₜ:ₜ₊₁` và cập nhật online; nhược điểm là bias cao do horizon ngắn.
- D. Vì nó không cần episode mà cập nhật liên tục; nhược điểm là không đảm bảo hội tụ.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — REINFORCE dùng complete return từ thời điểm `t`, bao gồm tất cả reward tương lai cho đến hết episode. Theo nghĩa này nó là một Monte Carlo algorithm, chỉ định nghĩa rõ ràng cho episodic case với mọi update làm hồi tố sau khi episode hoàn thành. Là một stochastic gradient method, nó hội tụ về local optimum dưới điều kiện chuẩn, nhưng vì là Monte Carlo nên có variance cao và học chậm. A, C mô tả bootstrapping/one-step (không phải REINFORCE). D sai vì REINFORCE cần episode.

</details>

---

**Câu 14.** [Khó] Hai agent dùng REINFORCE trên cùng một bài toán episodic. Agent X cộng một hằng số `c = 1000` vào mọi reward (do đó mọi `Gₜ` tăng thêm một lượng dương lớn). Agent Y giữ nguyên reward. Dự đoán nào hợp lý nhất về hành vi học?

- A. Agent X học nhanh hơn vì return lớn hơn cho gradient mạnh hơn theo mọi hướng.
- B. Hai agent học giống hệt nhau vì REINFORCE chỉ quan tâm dấu của return chứ không phải độ lớn.
- C. Agent X có thể học kém ổn định hơn: vì REINFORCE không trừ baseline, return bị dịch lên dương lớn làm tăng variance của các update mà không cải thiện hướng gradient kỳ vọng.
- D. Agent X hội tụ về một optimal policy khác Agent Y vì offset hằng số làm thay đổi optimal policy.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Cộng hằng số vào mọi reward không làm đổi optimal policy (nên D sai) và không đổi gradient kỳ vọng theo nghĩa hướng. Nhưng REINFORCE cổ điển nhân `Gₜ` trực tiếp với eligibility vector mà KHÔNG trừ baseline; khi mọi `Gₜ` bị dịch lên một giá trị dương lớn, độ lớn các update tăng theo, làm tăng variance và khiến học kém ổn định/chậm hơn. Đây chính là động cơ của REINFORCE-with-baseline (Section 13.4): trừ một baseline `b(s)` giảm variance mà không thêm bias. A, B đều hiểu sai vai trò độ lớn của return.

</details>

---

## 13.4 REINFORCE with Baseline

**Câu 15.** Tại sao việc trừ một baseline `b(s)` khỏi action value KHÔNG làm thay đổi expected value (không tạo bias) của update?

- A. Vì baseline được chọn đúng bằng action value trung bình nên hiệu số kỳ vọng bằng 0.
- B. Vì baseline không phụ thuộc `a`, nên `Σ_a b(s)∇π(a|s,θ) = b(s)∇Σ_a π(a|s,θ) = b(s)∇1 = 0`.
- C. Vì baseline luôn được đặt bằng 0 trong trường hợp tổng quát.
- D. Vì baseline làm tăng variance đúng bằng lượng nó làm giảm bias, hai hiệu ứng triệt tiêu.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Policy gradient theorem tổng quát hóa với một baseline tùy ý `b(s)`: `∇J(θ) ∝ Σ_s μ(s) Σ_a (q_π(s,a) − b(s)) ∇π(a|s,θ)` (công thức 13.10). Phương trình vẫn đúng vì lượng bị trừ bằng 0: `Σ_a b(s)∇π(a|s,θ) = b(s)∇Σ_a π(a|s,θ) = b(s)∇1 = 0`. Baseline có thể là bất kỳ hàm nào (kể cả random variable) miễn không phụ thuộc `a`. A sai vì baseline KHÔNG cần bằng action value trung bình để giữ unbias. C sai (baseline không nhất thiết bằng 0). D nhầm lẫn bias với variance.

</details>

---

**Câu 16.** Trong REINFORCE with baseline (công thức 13.11), update có dạng nào, và lựa chọn baseline tự nhiên là gì?

- A. `θₜ₊₁ = θₜ + α(Gₜ − b(Sₜ)) ∇π(Aₜ|Sₜ,θₜ)/π(Aₜ|Sₜ,θₜ)`; baseline tự nhiên là ước lượng state value `v̂(Sₜ,w)`.
- B. `θₜ₊₁ = θₜ + α Gₜ ∇π(Aₜ|Sₜ,θₜ)`; baseline tự nhiên là ước lượng action value `q̂(Sₜ,Aₜ,w)`.
- C. `θₜ₊₁ = θₜ + α(Gₜ + b(Sₜ)) ∇ln π(Aₜ|Sₜ,θₜ)`; baseline tự nhiên là một hằng số cố định.
- D. `θₜ₊₁ = θₜ − α(Gₜ − b(Sₜ)) ∇ln π(Aₜ|Sₜ,θₜ)`; baseline tự nhiên là average reward.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Update của REINFORCE with baseline là `θₜ₊₁ = θₜ + α(Gₜ − b(Sₜ)) ∇π(Aₜ|Sₜ,θₜ)/π(Aₜ|Sₜ,θₜ)` (công thức 13.11). Vì baseline có thể đồng nhất bằng 0 nên đây là tổng quát hóa nghiêm ngặt của REINFORCE. Đối với MDP, baseline nên thay đổi theo trạng thái; lựa chọn tự nhiên là ước lượng state value `v̂(Sₜ,w)`, với `w` học bằng một Monte Carlo method. B bỏ mất baseline. C dùng dấu cộng (sai) và baseline hằng số. D dùng dấu trừ trước `α` (sai).

</details>

---

**Câu 17.** Trong pseudocode REINFORCE with Baseline, hai step size `αᶿ` và `αʷ` được dùng và việc chọn chúng có đặc điểm gì?

- A. `αᶿ` (cho policy) luôn dễ chọn hơn `αʷ` (cho values) vì policy có ít tham số hơn.
- B. Cả hai luôn phải bằng nhau để đảm bảo actor và critic cập nhật đồng tốc độ.
- C. Chọn `αʷ` (cho values) tương đối dễ với các rule of thumb trong trường hợp linear; còn `αᶿ` khó chọn hơn nhiều, giá trị tốt nhất phụ thuộc biên độ biến thiên của reward và policy parameterization.
- D. Thuật toán này không dùng step size mà cập nhật toàn phần theo return.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Thuật toán có hai step size `αᶿ` và `αʷ`. Chọn step size cho values (`αʷ`) tương đối dễ; trong trường hợp linear có rule of thumb như `αʷ = 0.1/E[‖∇v̂(Sₜ,w)‖²_μ]`. Ngược lại, đặt step size cho policy parameters `αᶿ` ít rõ ràng hơn nhiều, giá trị tốt nhất phụ thuộc biên độ biến thiên của reward và policy parameterization. A đảo ngược độ khó. B sai (không cần bằng nhau). D sai (có step size).

</details>

---

## 13.5 Actor–Critic Methods

**Câu 18.** Khác biệt then chốt giữa baseline trong REINFORCE-with-baseline và một critic trong actor–critic methods là gì?

- A. Critic chỉ dùng Monte Carlo return và không bao giờ bootstrap, còn baseline luôn bootstrap.
- B. Trong REINFORCE-with-baseline, value function chỉ ước lượng trạng thái đầu (đặt baseline, tính trước action nên không đánh giá action đó); trong actor–critic, value function còn áp dụng cho trạng thái thứ hai để tạo one-step return `Gₜ:ₜ₊₁`, qua đó đánh giá action.
- C. Không có khác biệt; baseline và critic là cùng một thứ chỉ khác tên gọi.
- D. Baseline đưa vào bias còn critic thì hoàn toàn không bao giờ đưa vào bias.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Trong REINFORCE-with-baseline, learned state-value function ước lượng giá trị trạng thái đầu của mỗi transition; ước lượng này đặt baseline cho return nhưng được tính TRƯỚC khi action xảy ra nên không thể dùng để đánh giá action đó. Trong actor–critic, state-value function còn áp dụng cho trạng thái thứ hai: giá trị của trạng thái thứ hai, khi discount và cộng với reward, tạo one-step return `Gₜ:ₜ₊₁` — cách đánh giá (criticize) action. A đảo ngược tính chất bootstrap. C, D sai (chính baseline mới unbias, còn critic đưa bias).

</details>

---

**Câu 19.** Phương trình cập nhật one-step actor–critic (công thức 13.12–13.14) là gì?

- A. `θₜ₊₁ = θₜ + α Gₜ ∇ln π(Aₜ|Sₜ,θₜ)` (dùng full return của REINFORCE).
- B. `θₜ₊₁ = θₜ + α δₜ ∇v̂(Sₜ,w)` (gradient của value function).
- C. `θₜ₊₁ = θₜ + α(Gₜ − v̂(Sₜ,w)) ∇q̂(Sₜ,Aₜ,w)` (advantage trên gradient của `q̂`).
- D. `θₜ₊₁ = θₜ + α(Rₜ₊₁ + γv̂(Sₜ₊₁,w) − v̂(Sₜ,w)) ∇π(Aₜ|Sₜ,θₜ)/π(Aₜ|Sₜ,θₜ) = θₜ + α δₜ ∇ln π(Aₜ|Sₜ,θₜ)`.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — One-step actor–critic thay full return của REINFORCE bằng one-step return (và dùng learned state-value function làm baseline): `θₜ₊₁ = θₜ + α(Gₜ:ₜ₊₁ − v̂(Sₜ,w)) ∇π/π = θₜ + α(Rₜ₊₁ + γv̂(Sₜ₊₁,w) − v̂(Sₜ,w)) ∇π/π = θₜ + α δₜ ∇ln π(Aₜ|Sₜ,θₜ)`, với `δₜ` là TD error. Value function học bằng semi-gradient TD(0). Đây là thuật toán fully online, incremental. A là REINFORCE (full return). B cập nhật `θ` theo gradient của `v̂` (sai — đó là update của `w`). C dùng gradient của `q̂` (sai).

</details>

---

**Câu 20.** Theo sách, bias trong gradient estimate của actor–critic xuất phát từ đâu?

- A. Hoàn toàn do bootstrapping của critic; nếu critic dùng Monte Carlo thì gradient estimate hết bias.
- B. Critic đưa bias vào gradient estimate của actor, nhưng bias không phải do bootstrapping per se — actor vẫn bị bias ngay cả khi critic được học bằng một Monte Carlo method.
- C. Do dùng complete return `Gₜ` của Monte Carlo nên estimate luôn bị bias dương.
- D. Không có bias nào trong actor–critic vì TD error có kỳ vọng bằng 0.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Sách nói rõ: bias trong gradient estimate không phải do bootstrapping per se; actor sẽ bị bias ngay cả khi critic được học bằng một Monte Carlo method. Critic đưa bias vào gradient estimate, nhưng điều này thường mong muốn vì cùng lý do bootstrapping TD thường vượt trội Monte Carlo: giảm variance đáng kể. Ta điều chỉnh mức bias bằng n-step returns và eligibility traces. A đảo ngược điều sách khẳng định. C, D sai.

</details>

---

## 13.6 Policy Gradient for Continuing Problems

**Câu 21.** Trong continuing problems (không có ranh giới episode), performance measure `J(θ)` được định nghĩa như thế nào?

- A. `J(θ) = v_{π_θ}(s₀)`, giá trị của start state cố định.
- B. `J(θ) = max_a q_π(s,a)`, action value lớn nhất tại trạng thái hiện tại.
- C. `J(θ) = r(π)`, average rate of reward per time step (công thức 13.15).
- D. `J(θ) = Σ_t γᵗ Rₜ`, discounted return tổng cộng qua vô hạn bước.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Với continuing problems không có ranh giới episode, ta định nghĩa performance theo average rate of reward per time step: `J(θ) = r(π) = lim_{h→∞} (1/h) Σ_{t=1}^h E[Rₜ | S₀, A_{0:t−1}~π] = Σ_s μ(s) Σ_a π(a|s) Σ_{s',r} p(s',r|s,a) r` (công thức 13.15), với `μ` là steady-state distribution dưới `π` (giả định ergodicity). A là cho episodic case. B, D không phải định nghĩa performance trong continuing case. Lưu ý: với value theo differential return, policy gradient theorem (13.5) vẫn đúng cho continuing case.

</details>

---

**Câu 22.** Trong continuing case, value được định nghĩa theo differential return. Differential return `Gₜ` có dạng nào?

- A. `Gₜ = Rₜ₊₁ + γRₜ₊₂ + γ²Rₜ₊₃ + ...` (discounted return thông thường).
- B. `Gₜ = Rₜ₊₁ − r(π) + Rₜ₊₂ − r(π) + Rₜ₊₃ − r(π) + ...` (trừ average reward mỗi bước).
- C. `Gₜ = Rₜ₊₁ + Rₜ₊₂ + ... + R_T` (tổng reward đến terminal state).
- D. `Gₜ = r(π) − Rₜ₊₁` (hiệu của average reward và reward kế tiếp).

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Trong continuing case, value được định nghĩa với differential return: `Gₜ = Rₜ₊₁ − r(π) + Rₜ₊₂ − r(π) + Rₜ₊₃ − r(π) + ...` (công thức 13.17), tức mỗi reward bị trừ average reward rate `r(π)`. Trong pseudocode actor–critic continuing, TD error là `δ = R − R̄ + v̂(S',w) − v̂(S,w)` và `R̄` (ước lượng của `r(π)`) cũng được cập nhật. A là discounted return. C là episodic return. D là một biểu thức một-bước vô nghĩa cho differential return.

</details>

---

**Câu 23.** [Khó] Trong actor–critic cho continuing problems, TD error dùng dạng `δ = R − R̄ + v̂(S',w) − v̂(S,w)`. Vai trò của `R̄` và lý do KHÔNG dùng discount factor `γ` ở đây là gì?

- A. `R̄` là một hằng số khởi tạo cố định; không dùng `γ` vì continuing problems luôn yêu cầu `γ = 1` mặc định.
- B. `R̄` là ước lượng running của average reward rate `r(π)`, được cập nhật dần; trong average-reward setting ta dùng differential value nên không cần `γ` để giữ return hữu hạn.
- C. `R̄` là baseline state value của trạng thái đầu; không dùng `γ` vì `γ` đã được hấp thụ vào step size.
- D. `R̄` là reward lớn nhất quan sát được; bỏ `γ` để tránh làm giảm trọng số các reward xa trong tương lai.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Trong average-reward (continuing) setting, `R̄` là ước lượng running của average reward rate `r(π)` và được cập nhật incremental (ví dụ `R̄ ← R̄ + αᴿ̄ δ`). Vì differential return trừ đi `r(π)` ở mỗi bước, return giữ hữu hạn mà không cần discounting; do đó actor–critic continuing dùng TD error dạng differential `δ = R − R̄ + v̂(S') − v̂(S)` thay vì dạng discounted `R + γv̂(S') − v̂(S)`. A sai (`γ=1` không khả dụng cho discounted continuing). C, D mô tả sai vai trò `R̄`.

</details>

---

## 13.7 Policy Parameterization for Continuous Actions

**Câu 24.** Đối với không gian action liên tục (vô hạn action), policy-based methods xử lý như thế nào thay vì tính xác suất cho từng action?

- A. Học xác suất rời rạc cho từng action sau khi rời rạc hóa không gian action thành lưới hữu hạn.
- B. Luôn chọn action có ước lượng action value `q̂` cao nhất sau khi tối ưu trên không gian liên tục.
- C. Dùng ε-greedy trên một lưới action liên tục được lấy mẫu lại ở mỗi bước.
- D. Học các statistics của một probability distribution (ví dụ mean và standard deviation của một Gaussian), rồi lấy mẫu action từ phân phối đó.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Policy-based methods cho cách thực tế để xử lý không gian action lớn, kể cả continuous spaces với vô hạn action. Thay vì tính xác suất cho từng action, ta học các statistics của một probability distribution. Ví dụ, action set có thể là số thực với action chọn từ một normal (Gaussian) distribution. A (rời rạc hóa), B (greedy trên `q̂`), C (ε-greedy trên lưới) đều là cách tiếp cận action-value, không phải cách tự nhiên của policy-based methods cho continuous actions.

</details>

---

**Câu 25.** Trong Gaussian policy cho continuous actions (công thức 13.19–13.20), mean `μ(s,θ)` và standard deviation `σ(s,θ)` được parameterize như thế nào?

- A. `μ(s,θ) = θμᵀxμ(s)` (linear) và `σ(s,θ) = exp(θσᵀxσ(s))` (exponential của hàm tuyến tính, để luôn dương).
- B. Cả hai đều là hàm tuyến tính: `μ = θμᵀxμ(s)` và `σ = θσᵀxσ(s)`.
- C. `μ` là exponential của hàm tuyến tính, còn `σ` là hàm tuyến tính trực tiếp theo features.
- D. Cả hai đều dùng softmax trên một tập features chung của trạng thái.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Policy được định nghĩa là normal probability density trên một real-valued scalar action: `π(a|s,θ) = (1/(σ(s,θ)√(2π))) exp(−(a−μ(s,θ))²/(2σ(s,θ)²))` (công thức 13.19). Parameter vector chia thành hai phần `θ = [θμ, θσ]ᵀ`. Mean xấp xỉ bằng hàm tuyến tính `μ(s,θ) = θμᵀxμ(s)`; standard deviation PHẢI luôn dương nên xấp xỉ bằng exponential của hàm tuyến tính `σ(s,θ) = exp(θσᵀxσ(s))` (công thức 13.20). B sai (`σ` tuyến tính có thể âm). C đảo vai trò. D sai (không phải softmax).

</details>

---

**Câu 26.** [Khó] Trong Gaussian policy, khi học tiến triển, vector tham số `θσ` của standard deviation có xu hướng làm gì, và điều đó ảnh hưởng thế nào đến exploration?

- A. `σ` được giữ cố định bằng một hằng số do người thiết kế chọn; exploration không đổi suốt quá trình học.
- B. `σ` thường có xu hướng giảm dần khi policy cải thiện, làm phân phối action hẹp lại quanh mean — giảm exploration và tiến tới hành vi gần-deterministic.
- C. `σ` luôn tăng dần để mở rộng exploration vô hạn theo thời gian nhằm đảm bảo hội tụ về optimal.
- D. `σ` dao động ngẫu nhiên không theo xu hướng nào vì nó độc lập với reward.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Trong Gaussian policy, `σ(s,θ) = exp(θσᵀxσ(s))` được học cùng với mean. Khi policy cải thiện và một vùng action tỏ ra tốt, gradient có xu hướng làm `σ` co lại, khiến phân phối tập trung hẹp quanh mean — tức giảm exploration và tiến tới hành vi gần-deterministic, tương tự cách preferences bị đẩy ra xa trong soft-max. A sai vì `σ` ở đây được *học*, không cố định. C sai (không tăng vô hạn). D sai vì `σ` được điều khiển bởi gradient của performance, không độc lập với reward.

</details>

---

**Câu 27.** [Khó] So sánh sự khác biệt khái niệm: trong một bài toán mà optimal policy là deterministic, soft-max trên action *preferences* (rời rạc) và Gaussian policy (liên tục) cùng tiến tới deterministic theo cơ chế tương tự nào?

- A. Cả hai tiến tới deterministic bằng cách cho step size `α → 0`, làm các update dừng lại tại một action cố định.
- B. Cả hai tiến tới deterministic bằng cách học một value function rồi lấy argmax, giống action-value methods.
- C. Soft-max đẩy preference của optimal action ra vô hạn so với các action khác; Gaussian co `σ → 0` quanh optimal mean — cả hai dồn xác suất về một action mà không cần baseline hay critic.
- D. Cả hai chỉ tiến tới deterministic khi ε trong ε-greedy được giảm dần về 0 song song.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Cả hai parameterization đều có thể tiến tới deterministic policy một cách *tiệm cận* nhờ chính cấu trúc của chúng: với soft-max, preference `h` của optimal action bị đẩy cao vô hạn so với các action khác, dồn xác suất về action đó; với Gaussian, standard deviation `σ` co về gần 0 quanh optimal mean, làm phân phối tập trung gần như chỉ vào một action. Đây là một trong những lợi thế của policy parameterization (Summary): tiến tới deterministic một cách tiệm cận. A (`α→0` chỉ dừng học), B (argmax value — đó là action-value method), D (ε-greedy không liên quan policy parameterization) đều sai.

</details>

---

## 13.8 Summary

**Câu 28.** Theo phần Summary, đâu là tổng kết ĐÚNG về vai trò của baseline và critic trong policy gradient methods?

- A. Thêm state-value function làm baseline giảm variance của REINFORCE NHƯNG đưa vào bias; còn critic vừa giảm variance vừa không có bias.
- B. Thêm state-value function làm baseline giảm variance của REINFORCE mà KHÔNG đưa vào bias; nếu state-value function còn dùng để đánh giá action thì nó gọi là critic, policy gọi là actor — critic đưa bias vào nhưng thường mong muốn (giảm variance đáng kể, giống bootstrapping TD).
- C. Cả baseline lẫn critic đều không ảnh hưởng đến variance, chỉ ảnh hưởng đến tốc độ hội tụ.
- D. Baseline đưa vào bias còn critic làm tăng variance so với REINFORCE thuần.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Theo Summary: REINFORCE đi trực tiếp từ policy gradient theorem. Thêm state-value function làm baseline giảm variance mà KHÔNG đưa vào bias. Nếu state-value function còn dùng để đánh giá (criticize) action selection thì nó là critic và policy là actor; phương pháp tổng thể là actor–critic. Critic đưa bias vào gradient estimate, nhưng thường mong muốn vì cùng lý do bootstrapping TD vượt trội Monte Carlo (giảm variance đáng kể). A, D đảo ngược tính chất bias của baseline và critic. C sai.

</details>

---

**Câu 29.** Theo Summary, đâu là các lợi thế của các phương pháp lưu trữ parameterized policy so với action-value methods?

- A. Chúng loại bỏ hoàn toàn nhu cầu về exploration nên đơn giản hơn để triển khai.
- B. Chúng có thể học xác suất cụ thể cho action, học mức exploration phù hợp và tiến tới deterministic policy tiệm cận, xử lý tự nhiên không gian action liên tục; trên một số bài toán policy đơn giản hơn để biểu diễn; cộng lợi thế lý thuyết là policy gradient theorem.
- C. Chúng luôn học nhanh hơn action-value methods trên mọi bài toán và luôn không có variance.
- D. Chúng chỉ áp dụng được cho không gian action rời rạc nhưng bù lại hội tụ nhanh hơn.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Theo Summary, các phương pháp học và lưu policy parameter có nhiều lợi thế: học được xác suất cụ thể cho việc lấy action, học mức exploration phù hợp và tiến tới deterministic policy tiệm cận, xử lý tự nhiên không gian action liên tục — đều dễ với policy-based methods nhưng khó/bất khả thi với ε-greedy. Trên một số bài toán, policy đơn giản hơn để biểu diễn. Ngoài ra còn lợi thế lý thuyết là policy gradient theorem, cho công thức gradient không chứa đạo hàm của state distribution. A, C, D đều là phát biểu quá mức hoặc sai.

</details>

---

**Câu 30.** [Khó] Một kỹ sư chọn dùng REINFORCE thuần (Monte Carlo, không baseline) cho một bài toán continuing không có ranh giới episode tự nhiên. Đánh giá nào đúng nhất?

- A. Lựa chọn hợp lý vì REINFORCE thuần là phương án có variance thấp nhất cho continuing problems.
- B. Lựa chọn có vấn đề: REINFORCE dựa trên complete return `Gₜ` nên chỉ định nghĩa rõ ràng cho episodic case; cho continuing problems nên dùng actor–critic với differential return và average reward `R̄`.
- C. Lựa chọn lý tưởng vì REINFORCE không cần value function nên tránh được mọi bias từ bootstrapping.
- D. Lựa chọn trung lập: REINFORCE và actor–critic tương đương hoàn toàn trên continuing problems, chỉ khác tốc độ.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — REINFORCE dùng complete return `Gₜ` (tổng reward đến hết episode), nên chỉ được định nghĩa rõ ràng cho episodic case và cần episode kết thúc để cập nhật. Với continuing problems không có ranh giới episode, không có complete return hữu hạn để tính; cách phù hợp là actor–critic continuing dùng differential return, TD error `δ = R − R̄ + v̂(S') − v̂(S)` và cập nhật ước lượng average reward `R̄` (Section 13.6). A sai (REINFORCE có variance *cao*). C bỏ qua vấn đề định nghĩa được/không cho continuing. D sai (không tương đương — REINFORCE không trực tiếp áp dụng được).

</details>
