# Chương 3: Finite Markov Decision Processes — Câu hỏi trả lời ngắn

> Bộ câu hỏi trả lời ngắn (short-answer) ôn tập Chương 3, sách *Reinforcement Learning: An Introduction* (Sutton & Barto, 2nd ed.). Đáp án tham khảo dùng cho việc LLM chấm điểm.

## 3.1 The Agent–Environment Interface

**Câu 1.** Trong một MDP, agent và environment tương tác qua các time step rời rạc. Hãy mô tả ba tín hiệu (signals) trao đổi giữa agent và environment, và viết ra trajectory sinh ra trong vài bước đầu.

<details>
<summary>Đáp án tham khảo</summary>

Tại mỗi time step `t`, agent nhận một biểu diễn của state `S_t ∈ S`, dựa vào đó chọn một action `A_t ∈ A(s)`; một bước sau agent nhận reward `R_{t+1} ∈ R` và rơi vào state mới `S_{t+1}`. Như vậy ba tín hiệu là: action (lựa chọn của agent), state (cơ sở để chọn), và reward (định nghĩa mục tiêu). Trajectory có dạng: `S_0, A_0, R_1, S_1, A_1, R_2, S_2, A_2, R_3, ...` (3.1).

</details>

**Câu 2.** Viết định nghĩa của dynamics function `p(s',r|s,a)` của một finite MDP và nêu nó phải thỏa điều kiện chuẩn hóa nào.

<details>
<summary>Đáp án tham khảo</summary>

`p(s',r|s,a) = Pr{S_t = s', R_t = r | S_{t-1} = s, A_{t-1} = a}` (3.2), là một hàm xác định bốn biến `p: S × R × S × A → [0,1]` cho mọi `s', s ∈ S`, `r ∈ R`, `a ∈ A(s)`. Hàm `p` đặc trưng hoàn toàn dynamics của environment. Điều kiện chuẩn hóa: với mỗi `s` và `a`, tổng xác suất trên mọi `(s', r)` bằng 1, tức `Σ_{s'} Σ_r p(s',r|s,a) = 1` (3.3).

</details>

**Câu 3.** Markov property là gì, và tại sao Sutton & Barto coi đó là một ràng buộc lên state chứ không phải lên decision process?

<details>
<summary>Đáp án tham khảo</summary>

Markov property nghĩa là xác suất của `S_t` và `R_t` chỉ phụ thuộc state và action ngay trước đó (`S_{t-1}, A_{t-1}`), và khi đã biết chúng thì không phụ thuộc các state/action quá khứ xa hơn. Đây là ràng buộc lên state vì state phải chứa mọi thông tin về quá khứ tương tác có ảnh hưởng đến tương lai; nếu thỏa thì state được gọi là có Markov property. Cả cuốn sách (Part I) giả định tính chất này.

</details>

**Câu 4.** Từ `p(s',r|s,a)` ta có thể tính được state-transition probability `p(s'|s,a)` và expected reward `r(s,a)`. Viết hai công thức đó.

<details>
<summary>Đáp án tham khảo</summary>

State-transition probability: `p(s'|s,a) = Σ_r p(s',r|s,a)` (3.4). Expected reward cho cặp state–action: `r(s,a) = E[R_t | S_{t-1}=s, A_{t-1}=a] = Σ_r r Σ_{s'} p(s',r|s,a)` (3.5). (Ngoài ra còn `r(s,a,s') = Σ_r r · p(s',r|s,a)/p(s'|s,a)` (3.6) cho bộ ba state–action–next-state.)

</details>

## 3.2 Goals and Rewards

**Câu 5.** Phát biểu reward hypothesis và giải thích nguyên tắc thiết kế reward (reward signal dùng để nói cái gì, không nói cái gì).

<details>
<summary>Đáp án tham khảo</summary>

Reward hypothesis: tất cả những gì ta hiểu là goals và purposes đều có thể được xem là việc cực đại hóa giá trị kỳ vọng của tổng tích lũy một tín hiệu vô hướng nhận được (gọi là reward). Reward signal là cách truyền đạt *cái gì* (what) ta muốn đạt được, không phải *cách làm* (how). Vì vậy không nên đưa prior knowledge về cách giải vào reward (ví dụ chỉ thưởng cho thắng cờ, không thưởng cho ăn quân hay chiếm trung tâm), nếu không agent có thể đạt subgoal mà không đạt mục tiêu thật.

</details>

## 3.3 Returns and Episodes

**Câu 6.** Định nghĩa return `G_t` cho trường hợp đơn giản (episodic, không discount) và nêu khái niệm episode, terminal state, episodic task.

<details>
<summary>Đáp án tham khảo</summary>

Trong trường hợp đơn giản, return là tổng các reward: `G_t = R_{t+1} + R_{t+2} + ... + R_T` (3.7), với `T` là time step cuối. Cách này hợp lý khi tương tác tự nhiên chia thành các subsequence gọi là episodes (ván game, một lần qua mê cung...). Mỗi episode kết thúc ở một state đặc biệt gọi là terminal state, rồi reset về start state. Task có dạng này gọi là episodic task; `T` là biến ngẫu nhiên thay đổi theo episode. (Tập state không kết thúc ký hiệu `S`, tập gồm cả terminal là `S+`.)

</details>

**Câu 7.** Viết công thức discounted return `G_t` và giải thích vai trò của discount factor gamma, đặc biệt khi gamma = 0 và khi gamma tiến tới 1.

<details>
<summary>Đáp án tham khảo</summary>

`G_t = R_{t+1} + γ R_{t+2} + γ² R_{t+3} + ... = Σ_{k=0}^∞ γ^k R_{t+k+1}` (3.8), với `0 ≤ γ ≤ 1` là discount rate. Một reward nhận sau `k` bước chỉ đáng `γ^{k-1}` lần giá trị nếu nhận ngay. Nếu `γ < 1` và dãy reward bị chặn thì tổng vô hạn hội tụ. Khi `γ = 0`, agent "myopic", chỉ quan tâm cực đại hóa `R_{t+1}`. Khi `γ` tiến tới 1, agent trở nên "farsighted", tính đến reward tương lai mạnh hơn.

</details>

**Câu 8.** Chứng minh/viết quan hệ đệ quy giữa các return ở các time step liên tiếp, và nêu giá trị return của reward hằng số +1.

<details>
<summary>Đáp án tham khảo</summary>

Quan hệ đệ quy: `G_t = R_{t+1} + γ G_{t+1}` (3.9), suy ra bằng cách gom các số hạng của (3.8). Quan hệ này đúng cho mọi `t < T` nếu đặt `G_T = 0`. Nếu reward là hằng số +1 và `γ < 1` thì return là tổng cấp số nhân: `G_t = Σ_{k=0}^∞ γ^k = 1/(1-γ)` (3.10).

</details>

## 3.4 Unified Notation for Episodic and Continuing Tasks

**Câu 9.** Làm thế nào để dùng MỘT ký hiệu return thống nhất cho cả episodic task lẫn continuing task? Nêu ý tưởng absorbing state và công thức tổng quát.

<details>
<summary>Đáp án tham khảo</summary>

Xem việc kết thúc episode như đi vào một absorbing state đặc biệt, chỉ chuyển về chính nó và sinh reward 0. Khi đó tổng hữu hạn (3.7) và tổng vô hạn (3.8) cho cùng một return. Công thức thống nhất: `G_t = Σ_{k=t+1}^{T} γ^{k-t-1} R_k` (3.11), cho phép `T = ∞` hoặc `γ = 1` (nhưng không đồng thời cả hai). Ký hiệu episode (chỉ số `i`) thường được bỏ vì ta hầu như luôn xét một episode cụ thể.

</details>

## 3.5 Policies and Value Functions

**Câu 10.** Định nghĩa policy `π`, state-value function `v_π(s)` và action-value function `q_π(s,a)`.

<details>
<summary>Đáp án tham khảo</summary>

Policy là ánh xạ từ state sang xác suất chọn mỗi action: `π(a|s)` là xác suất `A_t = a` khi `S_t = s`. State-value function: `v_π(s) = E_π[G_t | S_t = s] = E_π[Σ_{k=0}^∞ γ^k R_{t+k+1} | S_t = s]` (3.12), là expected return khi xuất phát ở `s` và đi theo `π`. Action-value function: `q_π(s,a) = E_π[G_t | S_t = s, A_t = a]` (3.13), là expected return khi ở `s`, lấy action `a`, rồi theo `π`. Value của terminal state luôn bằng 0.

</details>

**Câu 11.** Viết Bellman equation cho `v_π` và giải thích ý nghĩa trực giác của nó (backup diagram).

<details>
<summary>Đáp án tham khảo</summary>

Bellman equation cho `v_π`: `v_π(s) = Σ_a π(a|s) Σ_{s',r} p(s',r|s,a) [r + γ v_π(s')]`, cho mọi `s ∈ S` (3.14). Nó là điều kiện nhất quán: value của một state bằng (discounted) value kỳ vọng của next state cộng reward kỳ vọng dọc đường. Backup diagram nhìn từ `s` về các successor: từ `s` agent chọn action theo `π`, environment đáp lại bằng `(s', r)` theo `p`; Bellman equation lấy trung bình trên mọi khả năng, có trọng số là xác suất xảy ra `π(a|s)p(s',r|s,a)`. `v_π` là nghiệm duy nhất của Bellman equation này.

</details>

**Câu 12.** Viết Bellman equation cho action-value function `q_π(s,a)`, biểu diễn `q_π(s,a)` qua các action value của successor.

<details>
<summary>Đáp án tham khảo</summary>

`q_π(s,a) = Σ_{s',r} p(s',r|s,a) [r + γ Σ_{a'} π(a'|s') q_π(s',a')]` (tương tự (3.14) nhưng cho action values). Cũng có thể viết `q_π(s,a) = Σ_{s',r} p(s',r|s,a) [r + γ v_π(s')]` và quan hệ `v_π(s) = Σ_a π(a|s) q_π(s,a)`. Backup diagram cho `q_π` gốc ở cặp `(s,a)`, nhánh tới next state `s'` rồi tới các action `a'`.

</details>

## 3.6 Optimal Policies and Optimal Value Functions

**Câu 13.** Optimal policy được định nghĩa thế nào (partial ordering)? Định nghĩa optimal state-value function `v*` và optimal action-value function `q*`.

<details>
<summary>Đáp án tham khảo</summary>

Value function tạo một partial ordering trên policy: `π ≥ π'` khi và chỉ khi `v_π(s) ≥ v_{π'}(s)` với mọi `s`. Luôn tồn tại ít nhất một policy tốt hơn hoặc bằng mọi policy khác — đó là optimal policy `π*` (có thể có nhiều). Mọi optimal policy cùng chia sẻ optimal state-value function `v*(s) = max_π v_π(s)` (3.15) và optimal action-value function `q*(s,a) = max_π q_π(s,a)` (3.16).

</details>

**Câu 14.** Viết quan hệ giữa `q*` và `v*`, và quan hệ ngược (biểu diễn `v*` qua `q*`).

<details>
<summary>Đáp án tham khảo</summary>

`q*(s,a) = E[R_{t+1} + γ v*(S_{t+1}) | S_t = s, A_t = a]` (3.17): `q*` là expected return khi lấy action `a` ở `s` rồi theo optimal policy. Ngược lại, `v*(s) = max_a q*(s,a)`: value tối ưu của một state bằng giá trị của action tốt nhất từ state đó (theo `π*`).

</details>

**Câu 15.** Viết Bellman optimality equation cho `v*` và cho `q*`. Điểm khác biệt then chốt so với Bellman equation thông thường là gì?

<details>
<summary>Đáp án tham khảo</summary>

Bellman optimality equation cho `v*`: `v*(s) = max_a Σ_{s',r} p(s',r|s,a) [r + γ v*(s')]` (3.19) (= `max_a E[R_{t+1} + γ v*(S_{t+1}) | S_t=s, A_t=a]`). Cho `q*`: `q*(s,a) = Σ_{s',r} p(s',r|s,a) [r + γ max_{a'} q*(s',a')]` (3.20). Khác biệt then chốt: thay vì lấy trung bình theo policy `π`, ta lấy `max` trên action ở điểm lựa chọn của agent — biểu diễn rằng dưới optimal policy, value của state bằng expected return của action tốt nhất. Bellman optimality equation cho `v*` có nghiệm duy nhất (hệ `n` phương trình `n` ẩn nếu có `n` state).

</details>

**Câu 16.** Khi đã có `v*` (hoặc `q*`), làm thế nào để xác định một optimal policy? Vì sao greedy với `v*` lại là tối ưu, và `q*` còn tiện hơn ở điểm nào?

<details>
<summary>Đáp án tham khảo</summary>

Có `v*`: với mỗi state `s`, mọi policy gán xác suất khác 0 chỉ cho các action đạt max trong Bellman optimality equation đều là optimal policy — tức bất kỳ policy greedy với `v*` đều tối ưu, chỉ cần one-step-ahead search. Greedy là tối ưu vì `v*` đã chứa sẵn hệ quả reward của mọi hành vi tương lai, biến mục tiêu dài hạn thành đại lượng cục bộ. Có `q*` thì còn dễ hơn: agent chỉ cần chọn `argmax_a q*(s,a)`, không cần one-step-ahead search hay biết dynamics của environment, vì `q*` đã cache kết quả của mọi tìm kiếm một bước.

</details>

## 3.7 Optimality and Approximation

**Câu 17.** Nêu ba giả định mà việc giải trực tiếp Bellman optimality equation thường dựa vào nhưng hiếm khi đúng trong thực tế, và phân biệt tabular case với function approximation.

<details>
<summary>Đáp án tham khảo</summary>

Ba giả định: (1) dynamics của environment được biết chính xác; (2) đủ tài nguyên tính toán để hoàn tất phép tính; (3) các state có Markov property. Trong thực tế thường vi phạm một số giả định này (ví dụ backgammon có ~10^20 state nên không thể giải trực tiếp), nên ta phải chấp nhận nghiệm xấp xỉ. Tabular case: state set nhỏ, hữu hạn, lưu value bằng bảng/mảng mỗi entry một state (hoặc cặp state–action). Khi state quá nhiều, phải dùng function approximation với biểu diễn tham số gọn hơn. RL còn tận dụng tính online: dồn nỗ lực học cho các state hay gặp, ít nỗ lực cho state hiếm gặp.

</details>

## 3.8 Summary

**Câu 18.** Tóm tắt: phân biệt cái gì "bên trong agent" và "bên trong environment", và liệt kê các đại lượng cốt lõi của bài toán RL được trình bày trong chương.

<details>
<summary>Đáp án tham khảo</summary>

Mọi thứ bên trong agent là biết và kiểm soát được; environment thì chỉ kiểm soát được một phần và có thể không biết hoàn toàn. Các đại lượng cốt lõi: agent–environment interface (actions, states, rewards); MDP (và finite MDP với tập state/action/reward hữu hạn) định nghĩa qua transition probabilities `p(s',r|s,a)`; policy `π` (quy tắc ngẫu nhiên chọn action theo state); return (hàm reward tương lai cần cực đại hóa, có dạng undiscounted cho episodic và discounted cho continuing); value functions `v_π, q_π`; optimal value functions `v*, q*` (duy nhất cho mỗi MDP) và optimal policy (có thể nhiều); và Bellman optimality equations là điều kiện nhất quán đặc biệt mà optimal value functions phải thỏa, từ đó suy ra optimal policy. Optimality là một lý tưởng mà agent chỉ có thể xấp xỉ.

</details>
