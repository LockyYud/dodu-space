# Chương 13: Policy Gradient Methods — Câu hỏi trả lời ngắn

> Bộ câu hỏi trả lời ngắn (short-answer) ôn tập Chương 13, sách *Reinforcement Learning: An Introduction* (Sutton & Barto, 2nd ed.). Đáp án tham khảo dùng cho việc LLM chấm điểm.

## 13.1 Policy Approximation and its Advantages

**Câu 1.** Trong policy gradient methods, parameterized policy `π(a|s, θ)` cần thỏa điều kiện gì để có thể học bằng gradient? Mô tả soft-max in action preferences và nêu công thức tổng quát.

<details>
<summary>Đáp án tham khảo</summary>

Policy chỉ cần khả vi (differentiable) theo tham số θ, tức `∇π(a|s, θ)` tồn tại và hữu hạn với mọi s, a, θ; trong thực tế để đảm bảo exploration ta yêu cầu policy không bao giờ deterministic (`π(a|s,θ) ∈ (0,1)`). Với không gian action rời rạc, parameterization phổ biến là soft-max in action preferences: gán mỗi cặp state–action một numerical preference `h(s,a,θ)` rồi tính xác suất theo phân phối exponential soft-max `π(a|s,θ) = e^{h(s,a,θ)} / Σ_b e^{h(s,b,θ)}`. Các preference này có thể tham số hóa tùy ý, ví dụ tuyến tính theo feature `h(s,a,θ) = θᵀx(s,a)` hoặc bằng deep neural network.

</details>

**Câu 2.** Nêu các ưu điểm của policy-based methods (dùng soft-max in action preferences) so với action-value methods như ε-greedy.

<details>
<summary>Đáp án tham khảo</summary>

Thứ nhất, approximate policy có thể tiến tới deterministic policy (preferences của action tối ưu bị đẩy cao vô hạn), trong khi ε-greedy luôn còn xác suất ε chọn action ngẫu nhiên. Thứ hai, nó cho phép chọn action với xác suất tùy ý, nên có thể học stochastic optimal policy (ví dụ bluffing trong Poker, hay Example 13.1 short corridor), điều mà action-value methods không có cách tự nhiên để đạt được. Thứ ba, đôi khi policy đơn giản hơn value function nên dễ xấp xỉ và học nhanh hơn. Cuối cùng, policy parameterization là cách tốt để đưa prior knowledge về dạng policy mong muốn vào hệ thống, đây thường là lý do quan trọng nhất.

</details>

## 13.2 The Policy Gradient Theorem

**Câu 3.** Khó khăn chính khi tính gradient của performance theo policy parameter là gì, và policy gradient theorem giải quyết nó như thế nào? Viết công thức cho trường hợp episodic.

<details>
<summary>Đáp án tham khảo</summary>

Khó khăn là performance `J(θ)` phụ thuộc cả vào action selections lẫn distribution of states, và state distribution lại bị ảnh hưởng bởi policy parameter nhưng là hàm của environment nên thường không biết; do đó khó tính gradient. Policy gradient theorem cung cấp biểu thức giải tích cho gradient mà không chứa đạo hàm của state distribution: `∇J(θ) ∝ Σ_s μ(s) Σ_a q_π(s,a) ∇π(a|s,θ)`, trong đó μ là on-policy distribution. Trong episodic case hằng số tỉ lệ là độ dài trung bình của episode; trong continuing case nó bằng 1 (đẳng thức). Đây cũng là theoretical advantage của policy-gradient: action probabilities thay đổi mượt theo tham số nên có convergence guarantees mạnh hơn ε-greedy.

</details>

## 13.3 REINFORCE: Monte Carlo Policy Gradient

**Câu 4.** Viết công thức update của thuật toán REINFORCE và giải thích vì sao update lại có dạng "tỉ lệ với return, chia cho action probability".

<details>
<summary>Đáp án tham khảo</summary>

Update của REINFORCE: `θ_{t+1} = θ_t + α G_t ∇π(A_t|S_t,θ_t)/π(A_t|S_t,θ_t)`. Mỗi increment tỉ lệ với tích của return `G_t` và một vector là gradient xác suất của action thực sự được chọn chia cho xác suất chọn nó. Vector này chỉ hướng trong parameter space làm tăng nhiều nhất xác suất lặp lại action `A_t` khi gặp lại state `S_t`. Tỉ lệ với return làm tham số dịch nhiều nhất theo hướng các action cho return cao. Chia cho action probability để các action được chọn thường xuyên không bị lợi thế (cập nhật nhiều lần theo hướng của chúng) và thắng thế dù không cho return cao nhất.

</details>

**Câu 5.** "Eligibility vector" `∇ln π(A_t|S_t,θ_t)` là gì và vì sao trong pseudocode REINFORCE lại dùng nó thay cho biểu thức phân số? REINFORCE thuộc loại thuật toán nào?

<details>
<summary>Đáp án tham khảo</summary>

Eligibility vector là tên gọi của vector `∇π(A_t|S_t,θ_t)/π(A_t|S_t,θ_t)`, và nó bằng `∇ln π(A_t|S_t,θ_t)` nhờ identity `∇ln x = ∇x/x`; đây là nơi duy nhất policy parameterization xuất hiện trong thuật toán. REINFORCE là Monte Carlo algorithm vì dùng complete return `G_t` (toàn bộ reward từ t tới hết episode), nên chỉ định nghĩa được cho episodic case và mọi update thực hiện sau khi episode kết thúc. Nó có convergence properties tốt (expected update cùng hướng với performance gradient) nhưng vì là Monte Carlo nên thường có variance cao, làm học chậm.

</details>

## 13.4 REINFORCE with Baseline

**Câu 6.** Baseline `b(s)` được thêm vào policy gradient theorem như thế nào, và vì sao việc thêm baseline không làm thay đổi expected update?

<details>
<summary>Đáp án tham khảo</summary>

Policy gradient theorem được tổng quát hóa thành `∇J(θ) ∝ Σ_s μ(s) Σ_a (q_π(s,a) − b(s)) ∇π(a|s,θ)`, trong đó baseline `b(s)` có thể là hàm bất kỳ (kể cả random variable) miễn không phụ thuộc vào a. Việc trừ baseline không thay đổi đẳng thức vì phần bị trừ bằng 0: `Σ_a b(s)∇π(a|s,θ) = b(s)∇Σ_a π(a|s,θ) = b(s)∇1 = 0`. Update tương ứng là `θ_{t+1} = θ_t + α (G_t − b(S_t)) ∇π(A_t|S_t,θ_t)/π(A_t|S_t,θ_t)`, là tổng quát hóa thực sự của REINFORCE (b ≡ 0 cho lại REINFORCE).

</details>

**Câu 7.** Vì sao thêm baseline (thường chọn `v̂(S_t, w)`) giúp giảm variance? Vì sao với MDP baseline nên thay đổi theo state thay vì là một con số như trong bandit?

<details>
<summary>Đáp án tham khảo</summary>

Baseline để nguyên expected value của update nhưng có thể giảm mạnh variance, giống như trong gradient bandit (Section 2.8) baseline (trung bình reward) giảm variance và tăng tốc học. Một lựa chọn tự nhiên cho baseline là estimate của state value `v̂(S_t, w)`, với w học bằng phương pháp Monte Carlo (phù hợp vì REINFORCE cũng là Monte Carlo). Với MDP baseline nên thay đổi theo state: ở những state mọi action đều có value cao cần baseline cao để phân biệt action tốt hơn với action kém hơn; ở state mọi action có value thấp thì cần baseline thấp. Thuật toán có hai step size `α^θ` và `α^w`.

</details>

## 13.5 Actor–Critic Methods

**Câu 8.** Khác biệt cốt lõi giữa REINFORCE with baseline và actor–critic methods là gì? Vì sao critic (bootstrapping) lại được dùng dù nó đưa vào bias?

<details>
<summary>Đáp án tham khảo</summary>

Trong REINFORCE with baseline, learned state-value function chỉ ước lượng value của state đầu (làm baseline) nên không dùng để đánh giá action. Trong actor–critic, state-value function còn được áp dụng vào state thứ hai của transition: value của state sau, khi discounted và cộng với reward, tạo thành one-step return `G_{t:t+1}` dùng để đánh giá action — khi đó value function gọi là critic, policy gọi là actor. One-step return (bootstrapping) thường ưu việt hơn actual return về variance và tính online/incremental, dù đưa vào bias. Critic được ưa dùng vì cùng lý do TD methods thường vượt Monte Carlo: giảm variance đáng kể. Lưu ý bias trong gradient estimate không phải do bootstrapping bản thân nó — actor vẫn bias ngay cả khi critic học bằng Monte Carlo.

</details>

**Câu 9.** Viết công thức update của one-step actor–critic và cho biết phương pháp học value function nào tự nhiên đi kèm.

<details>
<summary>Đáp án tham khảo</summary>

One-step actor–critic thay full return của REINFORCE bằng one-step return và dùng learned state-value function làm baseline: `θ_{t+1} = θ_t + α (G_{t:t+1} − v̂(S_t,w)) ∇π(A_t|S_t,θ_t)/π(A_t|S_t,θ_t)`, tức `θ_t + α (R_{t+1} + γ v̂(S_{t+1},w) − v̂(S_t,w)) ∇ln π(A_t|S_t,θ_t) = θ_t + α δ_t ∇ln π(A_t|S_t,θ_t)`, với `δ_t` là TD error. Phương pháp tự nhiên đi kèm để học state-value function là semi-gradient TD(0). Thuật toán này hoàn toàn online, incremental: states, actions, rewards được xử lý ngay khi xảy ra và không xem lại. Có thể mở rộng sang n-step returns và λ-return / eligibility traces (dùng trace riêng cho actor và critic).

</details>

## 13.6 Policy Gradient for Continuing Problems

**Câu 10.** Trong continuing problems, performance `J(θ)` được định nghĩa thế nào và return nào được dùng? Policy gradient theorem có còn đúng không?

<details>
<summary>Đáp án tham khảo</summary>

Với continuing problems (không có episode boundaries), performance được định nghĩa theo average rate of reward per time step: `J(θ) = r(π) = lim_{t→∞} E[R_t | S_0, A_{0:t-1} ∼ π] = Σ_s μ(s) Σ_a π(a|s) Σ_{s',r} p(s',r|s,a) r`, trong đó μ là steady-state distribution dưới π (giả định ergodicity). Values được định nghĩa theo differential return `G_t = R_{t+1} − r(π) + R_{t+2} − r(π) + ...`. Với các định nghĩa thay thế này, policy gradient theorem (13.5) vẫn đúng cho continuing case, và các phương trình forward/backward view cũng giữ nguyên. Thuật toán actor–critic continuing dùng thêm ước lượng average reward `R̄` trong TD error.

</details>

## 13.7 Policy Parameterization for Continuous Actions

**Câu 11.** Làm thế nào policy-based methods xử lý continuous actions? Mô tả Gaussian (normal) policy parameterization.

<details>
<summary>Đáp án tham khảo</summary>

Thay vì học xác suất cho từng action (vô hạn), ta học các statistics của probability distribution. Ví dụ với action là số thực, dùng normal (Gaussian) distribution: `π(a|s,θ) = (1/(σ(s,θ)√(2π))) exp(−(a−μ(s,θ))²/(2σ(s,θ)²))`, trong đó mean μ và standard deviation σ là các parametric function approximator phụ thuộc state. Chia parameter vector thành hai phần `θ = [θ_μ, θ_σ]ᵀ`: mean xấp xỉ tuyến tính `μ(s,θ) = θ_μᵀ x_μ(s)`; còn σ phải luôn dương nên xấp xỉ bằng exponential của hàm tuyến tính `σ(s,θ) = exp(θ_σᵀ x_σ(s))`. Với các định nghĩa này, mọi thuật toán trong chương đều áp dụng được để học chọn real-valued actions.

</details>

## 13.8 Summary

**Câu 12.** Tóm tắt mối liên hệ giữa policy gradient theorem, REINFORCE, baseline và actor–critic, cùng các ưu điểm chung của policy-based methods.

<details>
<summary>Đáp án tham khảo</summary>

Policy-gradient methods cập nhật policy parameter mỗi bước theo hướng ước lượng gradient của performance. Policy gradient theorem cho công thức chính xác về ảnh hưởng của policy parameter lên performance mà không chứa đạo hàm của state distribution, là nền tảng lý thuyết cho mọi phương pháp. REINFORCE suy ra trực tiếp từ theorem; thêm state-value function làm baseline giảm variance của REINFORCE mà không thêm bias. Nếu state-value function còn dùng để đánh giá (criticize) action thì nó là critic, policy là actor, tạo thành actor–critic — critic đưa vào bias nhưng thường có lợi vì giảm variance đáng kể (như bootstrapping TD vượt Monte Carlo). Ưu điểm chung: học được specific probabilities, mức exploration phù hợp và tiến tới deterministic policy, xử lý tự nhiên continuous action spaces, và đôi khi policy đơn giản hơn value function để biểu diễn.

</details>
