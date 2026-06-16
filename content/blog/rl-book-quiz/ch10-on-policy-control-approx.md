# Chương 10: On-policy Control with Approximation — Câu hỏi trắc nghiệm

> Bộ câu hỏi ôn tập chi tiết cho Chương 10, sách *Reinforcement Learning: An Introduction* (Sutton & Barto, 2nd ed.)

## 10.1 Episodic Semi-gradient Control

**Câu 1.** Trong Chương 10, bài toán control được tiếp cận bằng cách xấp xỉ hàm nào dưới dạng tham số `q̂(s, a, w) ≈ q*(s, a)`?

- A. Hàm state-value `v̂(s, w)` được tham số hóa bởi vector trọng số `w ∈ ℝ^d` như ở Chương 9.
- B. Hàm policy `π(a|s, θ)` có tham số `θ`, học trực tiếp phân phối hành động mà không cần value.
- C. Hàm action-value `q̂(s, a, w)` xấp xỉ `q*` với vector trọng số hữu hạn chiều `w ∈ ℝ^d`.
- D. Hàm mô hình chuyển trạng thái `p̂(s', r | s, a, w)` để hỗ trợ planning có model.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Chương 10 mở rộng xấp xỉ hàm từ state values (Chương 9) sang action values: ta biểu diễn `q̂ ≈ q_π` (hoặc `q*`) dưới dạng tham số với vector trọng số hữu hạn chiều `w ∈ ℝ^d`. Phương án A là prediction của Chương 9 (chưa phải control action-value); phương án B (học policy có tham số) là chủ đề Chương 13; phương án D là model-based planning (Chương 8), không phải nội dung Chương 10.

</details>

---

**Câu 2.** Trong episodic semi-gradient control, các ví dụ huấn luyện (training examples) có dạng như thế nào (so với prediction ở Chương 9)?

- A. `S_t, A_t ↦ U_t` — bây giờ input gồm cả state và action, target `U_t` xấp xỉ `q_π(S_t, A_t)`.
- B. `S_t ↦ U_t` y như prediction, không đổi vì target vẫn là một return vô hướng.
- C. `A_t ↦ R_{t+1}` — học trực tiếp ánh xạ từ action sang immediate reward kế tiếp.
- D. `S_t ↦ π(·|S_t)` — học ánh xạ từ state sang phân phối xác suất trên các action.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Ở prediction trước đây ta xét ví dụ dạng `S_t ↦ U_t`; còn với action values ta xét ví dụ dạng `S_t, A_t ↦ U_t`, trong đó target `U_t` có thể là bất kỳ xấp xỉ nào của `q_π(S_t, A_t)`, gồm full Monte Carlo return `G_t` hoặc các n-step Sarsa return. Phương án B bỏ sót action trong input; phương án C chỉ học immediate reward (không phải value); phương án D là dạng học policy của Chương 13.

</details>

---

**Câu 3.** Công thức cập nhật của episodic semi-gradient one-step Sarsa (10.2) là gì?

- A. `w_{t+1} = w_t + α[G_t − q̂(S_t, A_t, w_t)] ∇q̂(S_t, A_t, w_t)` dùng full return làm target.
- B. `w_{t+1} = w_t + α[R_{t+1} + γ max_a q̂(S_{t+1}, a, w_t) − q̂(S_t, A_t, w_t)] ∇q̂(S_t, A_t, w_t)`.
- C. `w_{t+1} = w_t − α[R_{t+1} − q̂(S_t, A_t, w_t)] ∇q̂(S_t, A_t, w_t)` với dấu trừ phía trước.
- D. `w_{t+1} = w_t + α[R_{t+1} + γ q̂(S_{t+1}, A_{t+1}, w_t) − q̂(S_t, A_t, w_t)] ∇q̂(S_t, A_t, w_t)`.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Đây là cập nhật one-step Sarsa (10.2), dùng target bootstrap `R_{t+1} + γ q̂(S_{t+1}, A_{t+1}, w_t)` với action `A_{t+1}` thực sự được chọn theo policy. Phương án A là dạng Monte Carlo (full return `G_t`). Phương án B dùng `max_a` là Q-learning (off-policy), không phải Sarsa. Phương án C có dấu trừ sai và thiếu bootstrap.

</details>

---

**Câu 4.** Trong control on-policy của chương này, policy improvement và action selection được thực hiện như thế nào khi tập action rời rạc và không quá lớn?

- A. Tính `q̂(S_{t+1}, a, w_t)` cho mọi action, tìm greedy action rồi dùng policy soft như ε-greedy.
- B. Luôn chọn action ngẫu nhiên đều (uniform random) để đảm bảo exploration tối đa.
- C. Dùng gradient ascent trực tiếp trên không gian action liên tục để tìm action tối ưu.
- D. Chọn action có phần thưởng tức thời (immediate reward) `R_{t+1}` kỳ vọng lớn nhất.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Với tập action rời rạc không quá lớn, ta tính `q̂(S_{t+1}, a, w_t)` cho mỗi action, tìm `A*_{t+1} = argmax_a q̂(S_{t+1}, a, w_t)`, rồi cải thiện policy bằng cách chuyển sang một xấp xỉ soft của greedy policy như ε-greedy. Phương án B chỉ explore, không exploit. Phương án C (action liên tục) sách lưu ý vẫn là chủ đề nghiên cứu mở. Phương án D chỉ tham lam trên immediate reward, bỏ qua giá trị dài hạn.

</details>

---

**Câu 5.** Trong Mountain Car task (Example 10.1), phần thưởng (reward) được định nghĩa như thế nào?

- A. `+1` khi đạt đỉnh núi, `0` ở mọi bước khác — khuyến khích về goal càng sớm càng tốt.
- B. Tỉ lệ thuận với độ cao hiện tại của xe để dẫn dắt việc leo dốc dần dần.
- C. `−1` ở mọi bước cho đến khi xe vượt qua vị trí goal trên đỉnh núi (kết thúc episode).
- D. `−1` khi tông vào biên trái, `+1` khi đạt goal, `0` ở các bước còn lại.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Phần thưởng là `−1` ở mọi bước cho đến khi xe vượt qua vị trí goal ở đỉnh núi. Có 3 action: full throttle forward (+1), reverse (−1), zero (0). Vì khởi tạo action values bằng 0 (mọi giá trị thật đều âm), việc này mang tính optimistic và gây ra exploration rộng rãi ngay cả khi `ε = 0`. Phương án A/D có cấu trúc reward dương tại goal (không phải thiết kế của bài toán); phương án B là reward shaping theo độ cao, không phải thiết lập gốc.

</details>

---

**Câu 6.** Trong Mountain Car, vì sao đây là ví dụ khó với nhiều phương pháp control?

- A. Vì không gian state là vô hạn chiều nên không thể dùng tile coding để xấp xỉ.
- B. Vì xe phải đi xa goal hơn (lên dốc đối diện lấy đà) trước khi tiến gần goal được.
- C. Vì reward là ngẫu nhiên (stochastic) khiến value estimate có variance rất lớn.
- D. Vì engine của xe mạnh hơn trọng lực nên thuật toán hội tụ quá nhanh về suboptimal.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Trọng lực mạnh hơn engine, nên kể cả full throttle xe cũng không leo thẳng lên dốc được; giải pháp duy nhất là lùi lại lên dốc đối diện để lấy đà. Đây là continuous control nơi "things have to get worse (farther from the goal) before they can get better". Phương án A sai (state chỉ 2 chiều: vị trí + vận tốc); phương án C sai (reward xác định, luôn −1); phương án D đảo ngược thực tế (trọng lực mạnh hơn engine).

</details>

---

**Câu 7.** [Khó] State của Mountain Car gồm vị trí và vận tốc — hai biến liên tục. Vì sao tile coding (với nhiều tilings xếp lệch nhau) lại là lựa chọn xấp xỉ phù hợp ở đây, và điều gì xảy ra nếu ta dùng một state aggregation thô (grid đơn) thay thế?

- A. Tile coding nhanh hơn vì không cần feature vector; grid đơn chậm vì phải nội suy giữa các ô.
- B. Tile coding cho phép tổng quát hóa liên tục và độ phân giải hiệu dụng cao nhờ nhiều tilings lệch nhau; grid đơn thô tạo các bậc giá trị gián đoạn, khó học hành vi tinh tế như lấy đà.
- C. Tile coding học off-policy còn grid đơn học on-policy, nên chỉ tile coding mới hội tụ với Sarsa.
- D. Cả hai tương đương về độ chính xác; chỉ khác ở chi phí bộ nhớ nên lựa chọn không quan trọng.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Tile coding dùng nhiều tilings xếp lệch (offset) nhau, mỗi state kích hoạt một feature trong mỗi tiling; nhờ đó các state gần nhau chia sẻ phần lớn feature (tổng quát hóa mượt) trong khi độ phân giải hiệu dụng cao hơn nhiều so với một grid đơn cùng kích thước ô. Một state aggregation thô (grid đơn) tạo các bậc giá trị gián đoạn trong mỗi ô, không phân biệt được các state cận nhau — rất khó học hành vi tinh tế cần thiết để lấy đà. Phương án A, C, D mô tả sai bản chất tile coding (nó vẫn tạo feature vector, vẫn dùng được với on-policy Sarsa, và không tương đương grid thô về độ chính xác).

</details>

---

## 10.2 Semi-gradient n-step Sarsa

**Câu 8.** Công thức n-step return cho dạng function approximation (10.4) là gì (với `t+n < T`)?

- A. `G_{t:t+n} = R_{t+1} + γ q̂(S_{t+1}, A_{t+1}, w_t)` — chỉ một bước reward rồi bootstrap.
- B. `G_{t:t+n} = R_{t+1} + γ R_{t+2} + ... + γ^{n−1} R_{t+n} + γ^n q̂(S_{t+n}, A_{t+n}, w_{t+n−1})`.
- C. `G_{t:t+n} = R_{t+1} + R_{t+2} + ... + R_{t+n}` — tổng n reward, không discount, không bootstrap.
- D. `G_{t:t+n} = γ^n q̂(S_{t+n}, A_{t+n}, w_{t+n−1})` — chỉ giá trị bootstrap được discount.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — n-step return tổng quát hóa trực tiếp từ dạng bảng: cộng các reward được discount `R_{t+1} + γR_{t+2} + ... + γ^{n−1}R_{t+n}` rồi cộng giá trị bootstrap được discount `γ^n q̂(S_{t+n}, A_{t+n}, w_{t+n−1})`; nếu `t+n ≥ T` thì `G_{t:t+n} = G_t`. Phương án A là one-step (`n=1`); phương án C bỏ cả discount lẫn bootstrap; phương án D bỏ phần reward tích lũy.

</details>

---

**Câu 9.** Theo kết quả thực nghiệm trên Mountain Car (Figure 10.3 và 10.4), mức độ bootstrapping nào cho hiệu năng tốt nhất?

- A. `n = 1` (one-step) luôn tốt nhất vì cập nhật nhanh và variance thấp nhất.
- B. `n` rất lớn (gần Monte Carlo) luôn tốt nhất vì target ít bias hơn.
- C. Mức `n` không ảnh hưởng đáng kể đến tốc độ học khi đã chọn `α` hợp lý.
- D. Một mức bootstrapping trung gian (intermediate), ví dụ `n = 4` hoặc `n = 8`, tốt hơn `n = 1`.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Như đã thấy trước đây, hiệu năng tốt nhất khi dùng mức bootstrapping trung gian (`n > 1`). Trên Mountain Car, `n = 8` học nhanh hơn và đạt asymptotic tốt hơn `n = 1`; nghiên cứu chi tiết (Figure 10.4) cho thấy `n = 4` cho early performance tốt nhất. Phương án A và B đều cực đoan (one-step hoặc Monte Carlo thuần) và đều không tối ưu; phương án C trái với kết quả thực nghiệm.

</details>

---

**Câu 10.** [Khó] So với one-step Sarsa, semi-gradient n-step Sarsa làm tăng tốc độ truyền tín hiệu reward ngược về các state trước đó. Cơ chế nào giải thích đúng nhất lợi ích này, và đánh đổi đi kèm là gì?

- A. n-step lan reward về `n` state trong một lần cập nhật, giảm bias do bootstrap sớm; đánh đổi là variance cao hơn và phải đợi `n` bước trước khi cập nhật.
- B. n-step loại bỏ hoàn toàn bias vì không còn bootstrap; đánh đổi duy nhất là tốn thêm bộ nhớ lưu feature.
- C. n-step làm step-size `α` hiệu dụng lớn hơn `n` lần; đánh đổi là dễ phân kỳ nếu `α` không giảm.
- D. n-step biến Sarsa thành off-policy nên truyền nhanh hơn; đánh đổi là cần importance sampling.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Với n-step return, một reward thực tế đóng góp trực tiếp vào target của `n` cập nhật phía trước, nên tín hiệu reward lan ngược nhanh hơn one-step (vốn phải đợi nhiều lần lặp để truyền qua chuỗi bootstrap). Bootstrap muộn hơn cũng giảm bias do giá trị xấp xỉ sớm. Đánh đổi: target gồm nhiều reward ngẫu nhiên nên variance cao hơn, và cập nhật cho `S_t` phải đợi đến bước `t+n`. Phương án B sai (n-step `< T` vẫn bootstrap nên vẫn có bias); C nhầm cơ chế với step-size; D sai (n-step Sarsa ở đây vẫn on-policy, không cần importance sampling).

</details>

---

## 10.3 Average Reward: A New Problem Setting for Continuing Tasks

**Câu 11.** Trong average-reward setting, đặc điểm nào phân biệt nó với discounted setting?

- A. Nó chỉ áp dụng cho episodic tasks có start states và terminal states rõ ràng.
- B. Không có discounting — agent quan tâm đến delayed reward y như immediate reward.
- C. Nó yêu cầu discount rate `γ` lớn hơn 1 để các giá trị tích lũy không hội tụ.
- D. Nó thay reward bằng độ dài episode trung bình làm đại lượng cần tối ưu hóa.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Giống discounted setting, average-reward setting áp dụng cho continuing problems (không termination), nhưng khác ở chỗ không có discounting — agent quan tâm đến delayed reward y như immediate reward. Phương án A sai (đây là continuing, không phải episodic); C vô lý (`γ > 1` không hợp lệ); D sai (đại lượng tối ưu là rate of reward, không phải độ dài episode).

</details>

---

**Câu 12.** Average reward `r(π)` của một policy `π` được định nghĩa như thế nào?

- A. Tổng các discounted reward kỳ vọng tính từ trạng thái đầu `S_0` theo policy `π`.
- B. Phần thưởng lớn nhất mà agent có thể nhận được trong một chu kỳ tương tác.
- C. Tỉ lệ phần thưởng trung bình theo thời gian: `r(π) = lim_{h→∞} (1/h) Σ_{t=1}^{h} E[R_t | S_0, A_{0:t−1} ∼ π]`.
- D. Hằng số `r(π) = γ / (1 − γ)` phụ thuộc trực tiếp vào discount rate đã chọn.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — `r(π)` là average rate of reward khi đi theo `π`: `r(π) = lim_{h→∞} (1/h) Σ_{t=1}^{h} E[R_t | ...] = Σ_s μ_π(s) Σ_a π(a|s) Σ_{s',r} p(s',r|s,a) r`. Các policy đạt `r(π)` cực đại được coi là optimal. Phương án A là discounted return (setting cũ); B sai (không phải max); D là công thức vô nghĩa với average reward.

</details>

---

**Câu 13.** Điều kiện nào đảm bảo steady-state distribution `μ_π(s) = lim_{t→∞} Pr{S_t = s | A_{0:t−1} ∼ π}` tồn tại và độc lập với `S_0`?

- A. MDP phải là deterministic (mỗi cặp state–action chỉ dẫn tới đúng một state kế).
- B. MDP phải ergodic — starting state và mọi quyết định sớm chỉ có ảnh hưởng tạm thời.
- C. Discount rate phải bằng 0 để loại bỏ ảnh hưởng của các reward tương lai.
- D. Reward phải luôn dương để tổng tích lũy không bị triệt tiêu khi lấy giới hạn.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Các đẳng thức (10.7) đúng nếu `μ_π` tồn tại và độc lập với `S_0`, tức MDP ergodic: starting state và mọi quyết định sớm chỉ ảnh hưởng tạm thời; về lâu dài kỳ vọng ở một state chỉ phụ thuộc policy và transition probabilities. Phương án A quá mạnh và không cần thiết; C, D không liên quan đến sự tồn tại steady-state distribution.

</details>

---

**Câu 14.** Differential return `G_t` (10.9) trong average-reward setting được định nghĩa thế nào?

- A. `G_t = R_{t+1} + γ R_{t+2} + γ^2 R_{t+3} + ...` — chuỗi reward discount như setting cũ.
- B. `G_t = R_{t+1} − γ G_{t+1}` — đệ quy trừ giá trị return của bước kế.
- C. `G_t = (R_{t+1} − r(π)) + (R_{t+2} − r(π)) + (R_{t+3} − r(π)) + ...` — hiệu reward so với average.
- D. `G_t = Σ_t R_t / r(π)` — chuẩn hóa tổng reward theo average reward.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Trong average-reward setting, return được định nghĩa theo hiệu giữa reward và average reward: `G_t = (R_{t+1} − r(π)) + (R_{t+2} − r(π)) + ...`. Đây gọi là differential return; các value function tương ứng gọi là differential value functions (`v_π(s) = E_π[G_t | S_t = s]`, `q_π(s, a) = E_π[G_t | S_t = s, A_t = a]`). Phương án A là discounted return; B, D là biến đổi sai không có trong sách.

</details>

---

**Câu 15.** TD error dạng differential cho action values (10.11) được viết như thế nào?

- A. `δ_t = R_{t+1} + γ q̂(S_{t+1}, A_{t+1}, w_t) − q̂(S_t, A_t, w_t)` — giống setting discounted.
- B. `δ_t = R_{t+1} − R̄_t + q̂(S_{t+1}, A_{t+1}, w_t) − q̂(S_t, A_t, w_t)`.
- C. `δ_t = R_{t+1} − r(π) − q̂(S_t, A_t, w_t)` — không có thành phần bootstrap state kế.
- D. `δ_t = q̂(S_{t+1}, A_{t+1}, w_t) − q̂(S_t, A_t, w_t)` — chỉ hiệu hai giá trị q̂, bỏ reward.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Differential TD error cho action values là `δ_t = R_{t+1} − R̄_t + q̂(S_{t+1}, A_{t+1}, w_t) − q̂(S_t, A_t, w_t)`, với `R̄_t` là ước lượng tại `t` của `r(π)`. Khác bản discounted: không có `γ`, thay vào đó trừ `R̄_t`. Phương án A vẫn còn `γ` (setting cũ); C thiếu bootstrap state kế; D bỏ mất reward.

</details>

---

**Câu 16.** Trong Differential semi-gradient Sarsa, ước lượng average reward `R̄` được cập nhật như thế nào, và hạn chế gì được nêu ra?

- A. `R̄ ← R̄ + β δ`; thuật toán hội tụ tới differential values cộng một offset tùy ý.
- B. `R̄ ← max_a q̂(S, a, w)`; thuật toán lấy giá trị q̂ lớn nhất nên không bao giờ hội tụ.
- C. `R̄` giữ cố định bằng 0 suốt quá trình; vì vậy differential values bị lệch một hằng số.
- D. `R̄ ← R̄ + α[R − R̄]`; thuật toán hội tụ chính xác về differential values không offset.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — `R̄` được cập nhật `R̄ ← R̄ + β δ` (dùng chính δ làm error). Hạn chế: thuật toán không hội tụ về đúng differential values mà về differential values cộng một offset tùy ý. Tuy nhiên Bellman equations và TD errors không đổi khi mọi value bị dịch cùng một lượng, nên offset thường không quan trọng. Phương án B nhầm với Q-learning; C, D mô tả sai cơ chế cập nhật `R̄`.

</details>

---

**Câu 17.** Trong Access-Control Queuing Task (Example 10.2), mục tiêu và thiết lập là gì?

- A. Tối đa hóa discounted reward với `γ = 0.9` bằng cách gán mỗi customer vào server gần nhất.
- B. Tối thiểu hóa độ dài hàng đợi trung bình trong episodic setting có terminal state rõ ràng.
- C. Tìm một policy ngẫu nhiên cố định cho 4 mức priority mà không cần ước lượng value function.
- D. Quyết định accept/reject từng customer theo priority và số server rảnh, tối đa long-term reward không discount; giải bằng differential semi-gradient Sarsa.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Có 10 server, customer 4 mức priority trả reward 1, 2, 4, 8. Mỗi bước quyết định accept (gán vào server rảnh) hay reject (reward 0) customer ở đầu hàng đợi, dựa trên priority và số server rảnh, nhằm tối đa long-term reward không discount. Giải bằng differential semi-gradient Sarsa (`α = 0.01, β = 0.01, ε = 0.1`); `R̄` học được khoảng 2.31. Phương án A dùng discount (sai setting); B sai mục tiêu và sai loại task; C bỏ value function (trái với cách giải).

</details>

---

**Câu 18.** [Khó] Trong Access-Control Queuing Task, vì sao policy tối ưu đôi khi reject một customer priority thấp dù đang có server rảnh? Lý luận average-reward nào giải thích điều này?

- A. Vì reject luôn cho reward cao hơn accept, nên agent ưu tiên reject mọi customer priority thấp.
- B. Vì giữ server rảnh có giá trị differential dương: nó dành chỗ cho customer priority cao có thể đến sớm, làm tăng average reward dài hạn hơn là nhận reward nhỏ ngay.
- C. Vì ε-greedy buộc agent reject ngẫu nhiên 10% số customer bất kể priority.
- D. Vì differential value của mọi state đều âm nên accept luôn làm giảm tổng return.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Trong average-reward setting, quyết định dựa trên differential value: giữ một server rảnh có thể mang giá trị differential dương vì nó duy trì khả năng phục vụ customer priority cao (reward 8) sắp tới, đóng góp nhiều hơn cho average reward dài hạn so với việc thu một reward nhỏ (ví dụ 1) ngay lập tức từ customer priority thấp. Policy tối ưu (Figure 10.5) thể hiện rõ: khi số server rảnh ít, ngưỡng priority để accept tăng lên. Phương án A sai (reject cho reward 0, không phải luôn cao hơn); C nhầm exploration với policy tối ưu; D sai (không phải mọi differential value đều âm, và lý do không nằm ở dấu).

</details>

---

## 10.4 Deprecating the Discounted Setting

**Câu 19.** Vì sao discounted setting trở nên có vấn đề (problematic) với function approximation trong continuing tasks?

- A. Vì discount rate `γ` làm mỗi phép cập nhật chậm hơn đáng kể về mặt tính toán.
- B. Vì discounted return luôn phân kỳ ra vô hạn trong các continuing tasks không terminal.
- C. Vì average của các discounted return tỉ lệ thuận với `r(π)` (`r(π)/(1−γ)`), nên `γ` không ảnh hưởng thứ tự policy — discounting không có vai trò trong định nghĩa bài toán.
- D. Vì function approximation chỉ chính xác khi `γ = 1`, mọi giá trị `γ < 1` đều gây sai số lớn.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Trong continuing setting (không có start/end), nếu lấy average các discounted return thì kết quả luôn bằng `r(π)/(1−γ)` — về bản chất là average reward. Do đó thứ tự xếp hạng policy giống hệt average-reward setting; discount rate không ảnh hưởng problem formulation (kể cả `γ = 0`). Vì vậy discounting không có vai trò trong định nghĩa control problem với function approximation. Phương án A, B, D mô tả sai (vấn đề không phải tốc độ tính toán, không phải phân kỳ, không phải yêu cầu `γ = 1`).

</details>

---

**Câu 20.** Theo sách, nguyên nhân gốc rễ (root cause) của các khó khăn với discounted control setting khi dùng function approximation là gì?

- A. Step size `α` không thể chọn đủ nhỏ để đảm bảo ổn định khi `γ` gần 1.
- B. Ta đánh mất policy improvement theorem (Section 4.2) khi có function approximation.
- C. Kỹ thuật tile coding không hoạt động được với các continuing tasks không terminal.
- D. Average reward `r(π)` không tồn tại trong các MDP không ergodic nên không xếp hạng được.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Với function approximation ta đánh mất policy improvement theorem: không còn đúng rằng cải thiện discounted value của một state thì cải thiện được overall policy. Đây cũng là lỗ hổng lý thuyết cho cả total-episodic và average-reward settings; ε-greedification đôi khi cho policy kém hơn (policy "chatter"). Chương 13 (policy gradient) đưa ra guarantee tương tự. Phương án A, C, D không phải nguyên nhân gốc mà sách nêu.

</details>

---

## 10.5 Differential Semi-gradient n-step Sarsa

**Câu 21.** Differential n-step return (10.14) với function approximation được viết như thế nào (với `t+n < T`)?

- A. `G_{t:t+n} = R_{t+1} + γ R_{t+2} + ... + γ^n q̂(S_{t+n}, A_{t+n}, w_{t+n−1})` — vẫn dùng discount `γ`.
- B. `G_{t:t+n} = (R_{t+1} − R̄_{t+n−1}) + ... + (R_{t+n} − R̄_{t+n−1}) + q̂(S_{t+n}, A_{t+n}, w_{t+n−1})`.
- C. `G_{t:t+n} = R_{t+1} − R̄_t` — chỉ một hiệu reward, không tích lũy, không bootstrap.
- D. `G_{t:t+n} = Σ_{i=1}^{n} R_{t+i}` — tổng n reward thô không trừ `R̄`, không bootstrap.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Differential n-step return tổng quát hóa từ (7.4): cộng các hiệu `(R_{t+1} − R̄_{t+n−1}) + ... + (R_{t+n} − R̄_{t+n−1})` rồi cộng bootstrap `q̂(S_{t+n}, A_{t+n}, w_{t+n−1})`, với `R̄` là ước lượng của `r(π)`, `n ≥ 1`. Không còn discount `γ`; thay vào đó trừ `R̄`. n-step TD error là `δ_t = G_{t:t+n} − q̂(S_t, A_t, w)` (10.15). Phương án A còn `γ`; C thiếu tích lũy và bootstrap; D không trừ `R̄` và thiếu bootstrap.

</details>

---

**Câu 22.** Theo Exercise 10.9, vì sao step-size `β` trên average reward cần khá nhỏ, và điều này gây ra vấn đề gì?

- A. `β` nhỏ để thuật toán chạy nhanh hơn về mặt tính toán; không gây ra vấn đề gì đáng kể.
- B. `β` nhỏ để tránh tràn số khi `R̄` lớn; tác dụng phụ là `R̄` luôn bị kẹt ở giá trị 0.
- C. `β` cần lớn để hội tụ nhanh; hệ quả là `R̄` dao động mạnh gây overfitting value function.
- D. `β` nhỏ để `R̄` thành ước lượng long-term tốt; nhưng khi đó `R̄` bị bias bởi giá trị khởi tạo trong nhiều bước, khiến học kém hiệu quả.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — `β` cần khá nhỏ để `R̄` trở thành ước lượng long-term tốt của average reward. Hạn chế: `R̄` bị bias bởi giá trị khởi tạo trong nhiều bước, khiến học kém hiệu quả. Sample-average lại không phù hợp do nonstationarity dài hạn khi policy thay đổi chậm; nơi lý tưởng để dùng là unbiased constant-step-size trick (Exercise 2.7). Phương án A, B, C mô tả sai cả lý do lẫn hệ quả.

</details>

---

**Câu 23.** [Khó] Trong differential semi-gradient n-step Sarsa, `R̄` được dùng cả trong việc tính n-step return lẫn (gián tiếp) trong cập nhật của chính nó. Điều gì xảy ra với hành vi học nếu ước lượng `R̄` lệch cao hơn `r(π)` thật trong một giai đoạn?

- A. Các hiệu `R_{t+i} − R̄` bị kéo xuống thấp hơn thực tế, làm differential returns và do đó nhiều q̂ bị ước lượng thấp đi cho đến khi `R̄` được hiệu chỉnh về gần `r(π)`.
- B. Không có ảnh hưởng nào vì `R̄` chỉ là hằng số cộng vào mọi giá trị nên triệt tiêu trong TD error.
- C. Thuật toán lập tức phân kỳ vì `R̄` lệch khiến mọi cập nhật trọng số đổi dấu.
- D. q̂ tự động bù trừ `R̄` lệch trong một bước duy nhất, nên `R̄` không cần hội tụ về `r(π)`.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Nếu `R̄` lệch cao hơn `r(π)` thật, mỗi hiệu `R_{t+i} − R̄` nhỏ hơn giá trị đúng, kéo differential n-step return xuống thấp; qua đó nhiều q̂ bị ước lượng thấp hơn. Đồng thời TD error `δ` có xu hướng âm trung bình, đẩy `R̄ ← R̄ + βδ` giảm dần về `r(π)`, nên hệ tự hiệu chỉnh nhưng không tức thời — đây chính là lý do `β` nhỏ làm việc học chậm (Exercise 10.9). Phương án B sai vì `R̄` không triệt tiêu trong differential return (nó được trừ từng bước); C cường điệu (không phân kỳ tức thời); D sai (việc hiệu chỉnh diễn ra qua nhiều bước, không phải một bước).

</details>

---

## 10.6 Summary

**Câu 24.** Theo phần Summary, kết luận chính của Chương 10 về continuing case với function approximation là gì?

- A. Discounted formulation chuyển được trực tiếp sang control, chỉ cần thay giá trị `γ` thích hợp.
- B. Episodic và continuing case dùng chung một thuật toán duy nhất không cần thay đổi gì.
- C. Function approximation chỉ dùng được cho prediction, không áp dụng được cho control.
- D. Phải đưa ra problem formulation mới dựa trên maximizing average reward per time step; differential value functions/Bellman equations/TD errors song song bản cũ với thay đổi nhỏ.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Mở rộng sang control là tức thì cho episodic case, nhưng continuing case cần một problem formulation hoàn toàn mới dựa trên maximizing average reward per time step — discounted formulation không chuyển được sang control khi có approximation (vì phần lớn policy không biểu diễn được bằng value function, nên cần `r(π)` để xếp hạng). Average-reward formulation đưa ra phiên bản differential mới của value functions, Bellman equations, TD errors, tất cả song song bản cũ. Phương án A, B, C trái với kết luận của chương.

</details>

---

**Câu 25.** [Khó] Một bạn lập luận: "Chỉ cần chọn `γ` rất gần 1 (ví dụ 0.9999) là discounted control sẽ tương đương average-reward, nên không cần setting mới." Lập luận này sai ở điểm cốt lõi nào theo Chương 10?

- A. Sai vì `γ` gần 1 làm thuật toán quá chậm; nếu đủ kiên nhẫn thì lập luận vẫn đúng về bản chất.
- B. Sai vì vấn đề không nằm ở giá trị `γ` mà ở chỗ với function approximation ta mất policy improvement theorem: cải thiện discounted value cục bộ không đảm bảo cải thiện policy tổng thể, bất kể `γ`.
- C. Sai vì `γ = 0.9999` vẫn khiến discounted return phân kỳ trong continuing tasks.
- D. Sai vì average-reward đòi hỏi MDP deterministic còn discounted thì không, nên hai setting không thể tương đương.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Vấn đề cốt lõi không phải giá trị `γ`: với function approximation, ta không thể biểu diễn mọi policy bằng value function, và mất policy improvement theorem — cải thiện discounted value của một state không còn đảm bảo cải thiện overall policy. Hơn nữa, trong continuing setting average các discounted return chỉ bằng `r(π)/(1−γ)`, nên `γ` không thêm thông tin xếp hạng policy. Do đó tăng `γ` gần 1 không cứu được formulation; cần chuyển sang average-reward để có một đại lượng `r(π)` xếp hạng policy đúng đắn. Phương án A xem nhẹ vấn đề lý thuyết; C sai (discounted return với `γ < 1` vẫn hữu hạn); D sai (average-reward không đòi hỏi deterministic, chỉ cần ergodic).

</details>
