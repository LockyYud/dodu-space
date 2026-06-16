# Chương 10: On-policy Control with Approximation — Câu hỏi trả lời ngắn

> Bộ câu hỏi trả lời ngắn (short-answer) ôn tập Chương 10, sách *Reinforcement Learning: An Introduction* (Sutton & Barto, 2nd ed.). Đáp án tham khảo dùng cho việc LLM chấm điểm.

## 10.1 Episodic Semi-gradient Control

**Câu 1.** Viết công thức cập nhật của **episodic semi-gradient one-step Sarsa** cho action-value function `q̂(s, a, w)`, và giải thích `q̂` được mở rộng từ prediction sang control như thế nào.

<details>
<summary>Đáp án tham khảo</summary>

Cập nhật tổng quát có dạng `w_{t+1} = w_t + α[U_t − q̂(S_t, A_t, w_t)] ∇q̂(S_t, A_t, w_t)`; với one-step Sarsa thì target là `U_t = R_{t+1} + γ q̂(S_{t+1}, A_{t+1}, w_t)`, cho ra công thức (10.2). Khác với prediction (Chương 9) dùng mẫu `S_t ↦ U_t`, ở đây ta dùng mẫu dạng `S_t, A_t ↦ U_t` để học action-value `q̂ ≈ q_π`. Để biến thành control, ta ghép prediction với policy improvement: tính `q̂(S_{t+1}, a, w)` cho mọi action, chọn greedy action, rồi cải thiện policy bằng cách dùng soft policy như ε-greedy (on-policy). Với policy cố định, phương pháp này hội tụ giống TD(0) với cùng dạng error bound.

</details>

**Câu 2.** Trong ví dụ **Mountain Car**, vì sao việc khởi tạo action values bằng 0 lại tạo ra exploration mạnh dù `ε = 0`?

<details>
<summary>Đáp án tham khảo</summary>

Mọi true value trong bài toán này đều âm (reward là −1 mỗi bước cho tới khi tới đích), nên khởi tạo giá trị bằng 0 là optimistic initialization — quá lạc quan. Khi agent ghé thăm một state, reward thực tế tệ hơn kỳ vọng (0), khiến estimate của các state đã thăm bị hạ thấp dưới các state chưa thăm. Điều này liên tục đẩy agent rời khỏi nơi đã đi để khám phá state mới, tạo exploration cho tới khi tìm ra lời giải, dù exploration parameter ε bằng 0.

</details>

## 10.2 Semi-gradient n-step Sarsa

**Câu 3.** Viết **n-step return** dạng function approximation dùng trong semi-gradient n-step Sarsa, và cho biết kinh nghiệm về chọn `n` trên Mountain Car.

<details>
<summary>Đáp án tham khảo</summary>

`G_{t:t+n} = R_{t+1} + γR_{t+2} + ... + γ^{n−1}R_{t+n} + γ^n q̂(S_{t+n}, A_{t+n}, w_{t+n−1})` khi `t+n < T`, và `G_{t:t+n} = G_t` khi `t+n ≥ T` (công thức 10.4). Đây là tổng quát hóa trực tiếp từ dạng tabular (7.4), dùng làm target trong cập nhật semi-gradient Sarsa (10.5). Về chọn `n`: hiệu năng tốt nhất ở mức bootstrapping trung gian, tức `n > 1`. Trên Mountain Car, `n = 8` học nhanh hơn và đạt asymptotic performance tốt hơn `n = 1`, còn nghiên cứu chi tiết cho thấy `n = 4` thường tốt nhất.

</details>

## 10.3 Average Reward: A New Problem Setting for Continuing Tasks

**Câu 4.** Định nghĩa **average reward** `r(π)` và giải thích vì sao average reward setting được giới thiệu thay cho discounted setting cho continuing tasks.

<details>
<summary>Đáp án tham khảo</summary>

`r(π)` là average rate of reward (reward rate) khi tuân theo policy π: `r(π) = lim_{h→∞} (1/h) Σ_{t=1}^h E[R_t | S_0, A_{0:t−1} ~ π] = lim_{t→∞} E[R_t | ...] = Σ_s μ_π(s) Σ_a π(a|s) Σ_{s',r} p(s',r|s,a) r` (công thức 10.6–10.7). Hai đẳng thức sau đúng khi steady-state distribution `μ_π` tồn tại và độc lập với S_0, tức MDP ergodic. Average reward setting áp dụng cho continuing problems (chạy mãi mãi, không có terminal/start) nhưng không discounting — agent quan tâm reward tương lai như reward tức thì. Lý do dùng nó: discounted setting có vấn đề khi dùng function approximation (xem 10.4), nên average-reward setting được cần để thay thế. Ta xếp hạng các policy theo `r(π)`, policy nào đạt `r(π)` cực đại được coi là optimal.

</details>

**Câu 5.** Định nghĩa **differential return** và **differential value functions** trong average-reward setting.

<details>
<summary>Đáp án tham khảo</summary>

Differential return được định nghĩa theo hiệu giữa reward và average reward: `G_t = (R_{t+1} − r(π)) + (R_{t+2} − r(π)) + (R_{t+3} − r(π)) + ...` (công thức 10.9). Differential value functions được định nghĩa từ differential return giống như value function thông thường được định nghĩa từ discounted return, dùng cùng ký hiệu: `v_π(s) = E_π[G_t | S_t = s]` và `q_π(s, a) = E_π[G_t | S_t = s, A_t = a]` (tương tự cho v_* và q_*). Chúng cũng có Bellman equations, chỉ khác là bỏ hết hệ số γ và thay mỗi reward bằng hiệu `(r − r(π))`.

</details>

**Câu 6.** Viết **differential TD error** cho action values, và cho biết một hạn chế của differential semi-gradient Sarsa.

<details>
<summary>Đáp án tham khảo</summary>

Differential TD error cho action values: `δ_t = R_{t+1} − R̄_t + q̂(S_{t+1}, A_{t+1}, w_t) − q̂(S_t, A_t, w_t)` (công thức 10.11), trong đó `R̄_t` là estimate tại thời điểm t của average reward `r(π)` (không còn hệ số γ). Cập nhật trọng số dùng `w_{t+1} = w_t + α δ_t ∇q̂(S_t, A_t, w_t)` (10.12). Hạn chế: thuật toán không hội tụ về đúng differential values mà về differential values cộng một offset tùy ý. Vì Bellman equations và TD errors không thay đổi khi dịch mọi value cùng một lượng, nên offset có thể không quan trọng trong thực tế.

</details>

## 10.4 Deprecating the Discounted Setting

**Câu 7.** Vì sao tác giả cho rằng nên "deprecate" (loại bỏ) discounted setting khi dùng **function approximation**? Nêu kết quả định lượng then chốt.

<details>
<summary>Đáp án tham khảo</summary>

Trong approximate case không còn states tách biệt rõ ràng — states chỉ được biểu diễn bằng feature vectors (cực đoan là mọi feature vector giống hệt nhau), nên ta chỉ thực sự có chuỗi reward và phải đánh giá performance bằng cách trung bình reward qua khoảng dài. Kết quả then chốt: trung bình của discounted returns luôn tỉ lệ với average reward, cụ thể bằng `r(π)/(1−γ)`. Do đó việc xếp hạng (ordering) các policy theo discounted setting trùng khít với xếp hạng theo average-reward setting; discount rate γ không ảnh hưởng tới problem formulation (thậm chí γ = 0 thì ranking vẫn không đổi). Vậy γ chuyển từ problem parameter thành solution-method parameter, và discounting không có vai trò trong định nghĩa control problem với function approximation.

</details>

**Câu 8.** Nguyên nhân gốc rễ (root cause) của khó khăn với discounted control setting trong function approximation là gì?

<details>
<summary>Đáp án tham khảo</summary>

Nguyên nhân gốc là: với function approximation ta đã mất **policy improvement theorem** (Section 4.2). Không còn đảm bảo rằng nếu thay đổi policy để cải thiện discounted value của một state thì policy tổng thể được cải thiện theo nghĩa hữu ích nào — guarantee đó vốn là then chốt cho lý thuyết các control method. Thực ra việc mất policy improvement theorem cũng là lacuna lý thuyết cho cả total-episodic và average-reward settings: một khi có function approximation ta không còn đảm bảo cải thiện cho bất kỳ setting nào. Ngoài ra, ε-greedification đôi khi có thể tạo ra policy kém hơn (policies có thể "chatter" giữa các policy tốt thay vì hội tụ). Chương 13 sẽ giới thiệu policy-gradient theorem đóng vai trò tương tự cho parameterized policies.

</details>

## 10.5 Differential Semi-gradient n-step Sarsa

**Câu 9.** Viết **differential n-step return** và **n-step TD error** trong differential semi-gradient n-step Sarsa.

<details>
<summary>Đáp án tham khảo</summary>

Differential n-step return (dạng function approximation): `G_{t:t+n} = (R_{t+1} − R̄_{t+n−1}) + ... + (R_{t+n} − R̄_{t+n−1}) + q̂(S_{t+n}, A_{t+n}, w_{t+n−1})`, với `R̄` là estimate của `r(π)`, `n ≥ 1`, `t+n < T` (công thức 10.14). Không có hệ số γ; mỗi reward bị trừ đi average-reward estimate. n-step TD error là `δ_t = G_{t:t+n} − q̂(S_t, A_t, w)` (công thức 10.15), sau đó áp dụng cập nhật semi-gradient Sarsa thông thường (10.12). Cả `w` lẫn average-reward estimate `R̄` được cập nhật mỗi bước; bước nhảy β trên `R̄` cần nhỏ để `R̄` thành estimate dài hạn tốt của average reward.

</details>
