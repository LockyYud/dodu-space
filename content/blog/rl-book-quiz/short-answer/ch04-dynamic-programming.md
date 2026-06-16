# Chương 4: Dynamic Programming — Câu hỏi trả lời ngắn

> Bộ câu hỏi trả lời ngắn (short-answer) ôn tập Chương 4, sách *Reinforcement Learning: An Introduction* (Sutton & Barto, 2nd ed.). Đáp án tham khảo dùng cho việc LLM chấm điểm.

## 4.1 Policy Evaluation (Prediction)

**Câu 1.** Iterative policy evaluation là gì, và nó dùng phương trình nào làm update rule? Hãy mô tả một bước expected update của thuật toán này.

<details>
<summary>Đáp án tham khảo</summary>

Policy evaluation (hay prediction problem) là việc tính state-value function $v_\pi$ cho một policy $\pi$ cho trước. Iterative policy evaluation biến phương trình Bellman expectation cho $v_\pi$ (phương trình 4.4) thành một update rule (4.5), sinh ra dãy xấp xỉ $v_0, v_1, v_2, \ldots$ hội tụ về $v_\pi$ khi $k \to \infty$. Mỗi expected update thay giá trị cũ của state $s$ bằng giá trị mới được tính từ giá trị (cũ) của các successor states và expected immediate rewards, lấy trung bình theo mọi one-step transitions có thể có dưới policy đang đánh giá. Gọi là expected update vì nó dựa trên kỳ vọng trên mọi next state có thể, chứ không phải một sample next state.

</details>

**Câu 2.** Một sweep (lượt quét) trong iterative policy evaluation là gì? Phân biệt cách cài đặt "two-array" với cách cài đặt "in-place", và nêu nhận xét về tốc độ hội tụ.

<details>
<summary>Đáp án tham khảo</summary>

Một sweep là một lượt cập nhật giá trị của mọi state trong state space đúng một lần. Cách two-array dùng một mảng cho giá trị cũ $v_k$ và một mảng cho giá trị mới $v_{k+1}$, nên giá trị cũ không bị thay đổi trong khi tính. Cách in-place chỉ dùng một mảng, mỗi giá trị mới ghi đè ngay lên giá trị cũ, nên đôi khi vế phải của update đã dùng giá trị mới thay vì giá trị cũ. Cách in-place cũng hội tụ về $v_\pi$ và thường hội tụ nhanh hơn vì dùng dữ liệu mới ngay khi có; với cách này thứ tự cập nhật các state trong sweep ảnh hưởng đáng kể tới tốc độ hội tụ. Vì hội tụ chỉ đạt được ở giới hạn, trên thực tế ta dừng khi $\max_s |v_{k+1}(s) - v_k(s)|$ đủ nhỏ (nhỏ hơn ngưỡng $\theta$).

</details>

## 4.2 Policy Improvement

**Câu 3.** Phát biểu policy improvement theorem. Điều kiện nào đảm bảo policy mới tốt hơn (hoặc bằng) policy cũ?

<details>
<summary>Đáp án tham khảo</summary>

Cho hai policy tất định $\pi$ và $\pi'$ bất kỳ. Nếu với mọi state $s$ ta có $q_\pi(s, \pi'(s)) \ge v_\pi(s)$ (điều kiện 4.7), thì policy $\pi'$ tốt bằng hoặc tốt hơn $\pi$, nghĩa là $v_{\pi'}(s) \ge v_\pi(s)$ với mọi $s$ (4.8). Hơn nữa, nếu có bất đẳng thức nghiêm ngặt tại một state nào đó trong (4.7), thì cũng có bất đẳng thức nghiêm ngặt tại state đó trong (4.8). Đây là cơ sở lý thuyết cho việc cải thiện policy.

</details>

**Câu 4.** Policy improvement là gì? Greedy policy $\pi'$ được xây dựng từ $v_\pi$ như thế nào, và chuyện gì xảy ra khi greedy policy không tốt hơn policy cũ?

<details>
<summary>Đáp án tham khảo</summary>

Policy improvement là quá trình tạo ra một policy mới tốt hơn bằng cách làm cho nó greedy đối với value function của policy gốc. Greedy policy $\pi'$ được định nghĩa $\pi'(s) = \arg\max_a q_\pi(s,a) = \arg\max_a \sum_{s',r} p(s',r|s,a)[r + \gamma v_\pi(s')]$, tức chọn action trông tốt nhất sau một bước lookahead theo $v_\pi$. Theo construction nó thỏa điều kiện của policy improvement theorem nên tốt bằng hoặc hơn $\pi$. Nếu greedy policy tốt bằng nhưng không tốt hơn ($v_\pi = v_{\pi'}$), thì $v_{\pi'}$ thỏa Bellman optimality equation, nên cả $\pi$ và $\pi'$ đều đã là optimal. Tức là policy improvement luôn cho policy nghiêm ngặt tốt hơn, trừ khi policy gốc đã optimal.

</details>

## 4.3 Policy Iteration

**Câu 5.** Mô tả vòng lặp của policy iteration. Tại sao quá trình này chắc chắn hội tụ tới optimal policy sau hữu hạn bước với một finite MDP?

<details>
<summary>Đáp án tham khảo</summary>

Policy iteration luân phiên hai bước: policy evaluation (tính $v_\pi$ cho policy hiện tại) và policy improvement (tạo greedy policy đối với $v_\pi$), tạo dãy đan xen $\pi_0 \xrightarrow{E} v_{\pi_0} \xrightarrow{I} \pi_1 \xrightarrow{E} v_{\pi_1} \xrightarrow{I} \cdots \xrightarrow{} \pi_* \xrightarrow{E} v_*$. Mỗi policy là cải thiện nghiêm ngặt so với policy trước (trừ khi đã optimal). Vì một finite MDP chỉ có hữu hạn các deterministic policy, nên quá trình này phải hội tụ về optimal policy và optimal value function sau hữu hạn lần lặp.

</details>

**Câu 6.** Trong policy iteration, mỗi bước policy evaluation thường được khởi tạo bằng value function của policy trước. Tại sao điều này hữu ích?

<details>
<summary>Đáp án tham khảo</summary>

Vì khi policy thay đổi ít từ vòng này sang vòng kế, value function cũng thay đổi rất ít. Khởi tạo policy evaluation bằng value function của policy trước (thay vì khởi tạo tùy ý) giúp xuất phát rất gần lời giải, nên thường làm tăng đáng kể tốc độ hội tụ của bước policy evaluation. Trên thực tế policy iteration thường hội tụ trong rất ít vòng lặp (số iteration nhỏ một cách đáng ngạc nhiên).

</details>

## 4.4 Value Iteration

**Câu 7.** Value iteration là gì, và nó liên hệ với policy iteration như thế nào? Viết ý tưởng của update rule.

<details>
<summary>Đáp án tham khảo</summary>

Value iteration là trường hợp đặc biệt khi bước policy evaluation trong policy iteration bị cắt ngắn (truncated) chỉ còn đúng một sweep (một lần update mỗi state) trước khi làm policy improvement. Nó gộp policy improvement và truncated policy evaluation thành một update đơn giản: $v_{k+1}(s) = \max_a \sum_{s',r} p(s',r|s,a)[r + \gamma v_k(s')]$ (4.10). Đây chính là Bellman optimality equation được biến thành update rule. Update của value iteration giống hệt update của policy evaluation, chỉ khác là thêm phép $\max$ trên mọi action. Với $v_0$ tùy ý, dãy $\{v_k\}$ hội tụ về $v_*$.

</details>

**Câu 8.** Mỗi sweep của value iteration "gộp" những thao tác nào? Có thể tổng quát hóa giữa policy iteration và value iteration ra sao?

<details>
<summary>Đáp án tham khảo</summary>

Mỗi sweep của value iteration thực chất kết hợp một sweep policy evaluation và một sweep policy improvement (sự khác biệt duy nhất là thêm phép $\max$ vào một số sweep của policy evaluation). Tổng quát hơn, cả lớp truncated policy iteration có thể xem là các dãy sweeps, trong đó một số sweep dùng update policy evaluation và một số dùng update value iteration; thường hội tụ nhanh hơn nếu xen nhiều sweep policy evaluation giữa các sweep policy improvement. Tất cả các thuật toán này hội tụ về optimal policy cho discounted finite MDP. Value iteration cũng cần vô hạn lần lặp về lý thuyết; thực tế dừng khi value function thay đổi nhỏ hơn ngưỡng $\theta$ trong một sweep.

</details>

## 4.5 Asynchronous Dynamic Programming

**Câu 9.** Asynchronous DP khác các thuật toán DP có hệ thống sweeps ở điểm nào? Điều kiện gì để nó vẫn hội tụ đúng, và ưu điểm chính là gì?

<details>
<summary>Đáp án tham khảo</summary>

Asynchronous DP là các thuật toán DP in-place không được tổ chức theo systematic sweeps trên toàn state set: chúng cập nhật giá trị các state theo thứ tự bất kỳ, dùng bất cứ giá trị của state khác nào đang có sẵn (có thể out-of-date). Một số state có thể được update nhiều lần trước khi state khác được update một lần. Để hội tụ đúng, thuật toán phải tiếp tục update giá trị của TẤT CẢ các state — không được bỏ qua state nào sau một điểm nào đó (ví dụ asynchronous value iteration hội tụ về $v_*$ với $0 \le \gamma < 1$ nếu mọi state xuất hiện vô số lần trong dãy update). Ưu điểm là tránh bị "khóa" trong một sweep dài vô vọng trước khi cải thiện được policy, cho phép chọn state để update nhằm lan truyền value information hiệu quả hơn và dễ xen kẽ với tương tác real-time của agent (update các state khi agent ghé thăm).

</details>

## 4.6 Generalized Policy Iteration

**Câu 10.** GPI (generalized policy iteration) là khái niệm gì? Khi nào hai quá trình trong GPI cùng ổn định thì policy và value function là optimal?

<details>
<summary>Đáp án tham khảo</summary>

GPI là ý tưởng tổng quát cho việc để hai quá trình — policy evaluation (làm value function nhất quán với policy hiện tại) và policy improvement (làm policy greedy đối với value function hiện tại) — tương tác với nhau, bất kể độ mịn (granularity) và chi tiết cụ thể của từng quá trình. Hầu hết các phương pháp reinforcement learning đều mô tả được dưới dạng GPI. Hai quá trình vừa cạnh tranh (kéo theo hướng ngược nhau) vừa hợp tác để tìm lời giải chung. Khi cả hai cùng ổn định (không còn tạo ra thay đổi), value function nhất quán với policy và policy greedy đối với chính value function của nó; điều này kéo theo Bellman optimality equation được thỏa, nên policy và value function khi đó là optimal.

</details>

## 4.7 Efficiency of Dynamic Programming

**Câu 11.** DP hiệu quả thế nào so với direct search trong policy space? "Curse of dimensionality" là gì, và nó có phải là nhược điểm của riêng DP không?

<details>
<summary>Đáp án tham khảo</summary>

Bỏ qua vài chi tiết kỹ thuật, trong trường hợp xấu nhất DP tìm được optimal policy trong thời gian đa thức (polynomial) theo số state $n$ và số action $k$, dù tổng số deterministic policy là $k^n$. Theo nghĩa đó DP nhanh hơn theo cấp số nhân so với direct search trong policy space (vì direct search phải duyệt vét cạn từng policy để có cùng đảm bảo). Curse of dimensionality là việc số state thường tăng theo cấp số nhân với số biến trạng thái (state variables). Tuy state set lớn gây khó khăn, nhưng đó là khó khăn cố hữu của bài toán chứ không phải của riêng DP; thực tế DP còn xử lý không gian state lớn tốt hơn các phương pháp như direct search hay linear programming, và có thể giải MDP với hàng triệu state.

</details>

## 4.8 Summary

**Câu 12.** Tại sao DP đòi hỏi một model đầy đủ và chính xác của môi trường? Bootstrapping trong DP nghĩa là gì?

<details>
<summary>Đáp án tham khảo</summary>

DP cần một model đầy đủ và chính xác vì expected update tính giá trị mới của một state dựa trên TẤT CẢ các successor state có thể cùng XÁC SUẤT xảy ra của chúng — tức cần biết dynamics $p(s',r|s,a)$ của MDP. Expected update chỉ là Bellman equation được biến thành câu lệnh gán; thiếu model thì không thể lấy kỳ vọng trên mọi next state này. Bootstrapping là ý tưởng update ước lượng giá trị của các state dựa trên ước lượng giá trị của các successor state (cập nhật ước lượng dựa trên ước lượng khác). DP bootstrap; nhiều phương pháp RL khác cũng bootstrap dù không cần model đầy đủ như DP — hai đặc tính "cần model" và "bootstrap" là tách biệt nhau và có thể kết hợp theo nhiều cách.

</details>
