# Chương 4: Dynamic Programming — Câu hỏi trắc nghiệm

> Bộ câu hỏi ôn tập chi tiết cho Chương 4, sách *Reinforcement Learning: An Introduction* (Sutton & Barto, 2nd ed.)

## Giới thiệu chung về Dynamic Programming

**Câu 1.** Thuật ngữ *dynamic programming* (DP) trong chương này dùng để chỉ điều gì?

- A. Một tập hợp các thuật toán để tính optimal policy khi cho trước một perfect model của environment dưới dạng MDP.
- B. Một thuật toán đơn lẻ học optimal policy từ các mẫu kinh nghiệm mà không cần biết model của environment.
- C. Một kỹ thuật quản lý bộ nhớ động (dynamic allocation) nhằm tăng tốc việc huấn luyện các mạng nơ-ron.
- D. Một phương pháp tìm kiếm trực tiếp (direct search) trong policy space bằng cách lấy mẫu các quỹ đạo thực.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — DP là một tập hợp các thuật toán dùng để tính optimal policy khi cho trước một perfect model của environment dưới dạng MDP. Sách nhấn mạnh DP có hạn chế trong RL vì hai lý do (giả định perfect model và chi phí tính toán lớn), nhưng vẫn quan trọng về mặt lý thuyết. B sai vì DP cần model đầy đủ; D mô tả các phương pháp sampling chứ không phải DP.

</details>

---

**Câu 2.** Tại sao DP cổ điển bị xem là có *limited utility* (ít hữu dụng) trực tiếp trong reinforcement learning?

- A. Vì DP không hội tụ về optimal policy trừ khi state space rất nhỏ và rời rạc.
- B. Vì DP không sử dụng value function nên không tận dụng được cấu trúc bài toán.
- C. Vì DP giả định một perfect model của environment và có chi phí tính toán (computational expense) rất lớn.
- D. Vì DP chỉ áp dụng được cho các bài toán có đúng hai trạng thái và một hành động.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Sách nêu rõ hai lý do: DP giả định một perfect model và có chi phí tính toán rất lớn. Tuy vậy DP vẫn quan trọng về lý thuyết vì gần như mọi phương pháp RL khác đều có thể xem là nỗ lực đạt cùng hiệu quả như DP nhưng với ít tính toán hơn và không cần perfect model. A sai vì DP có bảo đảm hội tụ; B sai vì DP dựa hoàn toàn vào value function.

</details>

---

**Câu 3.** Trong chương này, môi trường thường được giả định là loại nào?

- A. Một quá trình không thỏa tính Markov (non-Markovian) với phần thưởng được lấy mẫu ngẫu nhiên.
- B. Một finite MDP với các tập trạng thái, hành động và phần thưởng hữu hạn, dynamics cho bởi p(s′, r | s, a).
- C. Một MDP liên tục với không gian trạng thái vô hạn và nghiệm chính xác luôn tồn tại.
- D. Một bài toán bandit không trạng thái (stateless) với một tập hành động hữu hạn.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Bắt đầu từ chương này, sách thường giả định environment là finite MDP: các tập S, A, R hữu hạn và dynamics cho bởi tập xác suất p(s′, r | s, a). Ý tưởng DP có thể mở rộng cho không gian liên tục nhưng nghiệm chính xác chỉ tồn tại trong các trường hợp đặc biệt (nên C sai); cách phổ biến là quantize (rời rạc hóa) không gian rồi áp dụng DP hữu hạn.

</details>

---

**Câu 4.** Ý tưởng cốt lõi (key idea) của DP và của reinforcement learning nói chung là gì?

- A. Lấy mẫu (sampling) các quỹ đạo thực rồi lấy trung bình return để ước lượng giá trị mỗi state.
- B. Tối ưu hóa trực tiếp các tham số của policy bằng gradient của hiệu suất kỳ vọng.
- C. Giải trực tiếp một hệ phương trình tuyến tính để thu được optimal policy trong một bước.
- D. Sử dụng các value function để tổ chức và cấu trúc việc tìm kiếm các chính sách tốt.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Sách khẳng định ý tưởng cốt lõi của DP, và của RL nói chung, là dùng value function để tổ chức và cấu trúc việc tìm kiếm các chính sách tốt. Một khi tìm được optimal value function (v* hoặc q*) thỏa Bellman optimality equation thì dễ dàng suy ra optimal policy. DP có được bằng cách biến các Bellman equation thành các update rule. A mô tả Monte Carlo; B mô tả policy gradient.

</details>

---

## 4.1 Policy Evaluation (Prediction)

**Câu 5.** *Policy evaluation* (còn gọi là prediction problem) là bài toán gì?

- A. Tìm chính sách greedy tốt nhất đối với một value function cho trước.
- B. Tính optimal value function v* thỏa Bellman optimality equation.
- C. Tính state-value function v_π cho một chính sách π cho trước (tùy ý).
- D. Ước lượng dynamics p(s′, r | s, a) của environment từ dữ liệu quan sát.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Policy evaluation (hay prediction problem) là việc tính state-value function v_π cho một chính sách π tùy ý cho trước. Sự tồn tại và duy nhất của v_π được bảo đảm miễn là γ < 1 hoặc bảo đảm kết thúc (eventual termination) từ mọi trạng thái dưới π. A là control/improvement; B là bài toán optimal (value iteration); D là model learning, không phải DP.

</details>

---

**Câu 6.** Quy tắc cập nhật của *iterative policy evaluation* là:

- A. v_{k+1}(s) = Σ_a π(a|s) Σ_{s′,r} p(s′,r|s,a)[r + γ v_k(s′)]
- B. v_{k+1}(s) = max_a Σ_{s′,r} p(s′,r|s,a)[r + γ v_k(s′)]
- C. v_{k+1}(s) = v_k(s) + α[r + γ v_k(s′) − v_k(s)]
- D. v_{k+1}(s) = Σ_{s′,r} p(s′,r|s,π(s))[r + γ v_{k+1}(s′)]

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Iterative policy evaluation lấy Bellman equation cho v_π và biến nó thành update rule (4.5): v_{k+1}(s) = Σ_a π(a|s) Σ_{s′,r} p(s′,r|s,a)[r + γ v_k(s′)]. Lưu ý có tổng theo π(a|s), không có max. B là value iteration update (có max); C là TD update dùng mẫu (không phải DP); D dùng v_{k+1} ở vế phải nên không phải dạng iterative chuẩn.

</details>

---

**Câu 7.** Tại sao tất cả các cập nhật trong DP được gọi là *expected update*?

- A. Vì kết quả của chúng luôn đúng bằng kỳ vọng toán học của return từ trạng thái đó.
- B. Vì chúng chỉ cập nhật giá trị kỳ vọng của phần thưởng tức thời, bỏ qua các bước về sau.
- C. Vì chúng dựa trên một next state được lấy mẫu (sample) ngẫu nhiên từ dynamics.
- D. Vì chúng dựa trên kỳ vọng trên tất cả các next state có thể xảy ra, chứ không trên một sample next state.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Các cập nhật trong DP được gọi là expected update vì chúng dựa trên một kỳ vọng (expectation) trên tất cả các next state có thể có, chứ không dựa trên một sample next state. Mỗi expected update thay giá trị cũ của trạng thái bằng giá trị mới tính từ giá trị cũ của các trạng thái kế tiếp và phần thưởng kỳ vọng, trên tất cả các one-step transition. C mô tả sample update (đặc trưng của TD/Monte Carlo).

</details>

---

**Câu 8.** So sánh phiên bản hai mảng (two-array) và phiên bản *in-place* (một mảng) của iterative policy evaluation:

- A. Phiên bản in-place không hội tụ về v_π và phải tránh dùng trong thực tế.
- B. Phiên bản in-place cũng hội tụ về v_π, thường nhanh hơn vì dùng dữ liệu mới ngay khi có sẵn.
- C. Chỉ phiên bản two-array hội tụ về v_π; in-place chỉ là một xấp xỉ thô.
- D. Hai phiên bản luôn cho cùng tốc độ hội tụ bất kể thứ tự cập nhật trạng thái.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Thuật toán in-place cũng hội tụ về v_π và thường nhanh hơn two-array vì sử dụng dữ liệu mới ngay khi có sẵn. Với in-place, thứ tự cập nhật trạng thái trong một sweep ảnh hưởng đáng kể đến tốc độ hội tụ (nên D sai). Sách thường nghĩ đến phiên bản in-place khi nói về thuật toán DP. (Two-array là Jacobi-style/synchronous, in-place là Gauss–Seidel-style.)

</details>

---

**Câu 9.** Một *sweep* trong DP là gì, và iterative policy evaluation thực tế dừng khi nào?

- A. Sweep là một episode hoàn chỉnh; dừng sau một số episode cố định đã định trước.
- B. Sweep là việc lấy mẫu một quỹ đạo đơn lẻ; dừng khi quỹ đạo gặp terminal state.
- C. Sweep là một lượt cập nhật giá trị mọi trạng thái; dừng khi max_s |v_{k+1}(s) − v_k(s)| nhỏ hơn ngưỡng θ.
- D. Sweep là một lần cập nhật đúng một trạng thái; dừng khi value function bằng 0 ở mọi trạng thái.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Các cập nhật được nghĩ như thực hiện trong một sweep xuyên qua state space (mỗi sweep cập nhật giá trị của mọi trạng thái một lần). Về hình thức iterative policy evaluation chỉ hội tụ trong giới hạn (in the limit), nên thực tế phải dừng sớm: pseudocode kiểm tra max_s |v_{k+1}(s) − v_k(s)| sau mỗi sweep và dừng khi đại lượng này nhỏ hơn ngưỡng θ > 0.

</details>

---

**Câu 10.** Trong Example 4.1 (gridworld 4×4, undiscounted episodic, reward = −1 mỗi bước, chính sách equiprobable random), giá trị hội tụ v_π của mỗi trạng thái mang ý nghĩa gì?

- A. Số đối (negation) của số bước kỳ vọng từ trạng thái đó cho tới khi kết thúc.
- B. Xác suất đạt tới terminal state khi xuất phát từ trạng thái đó.
- C. Tổng phần thưởng dương kỳ vọng tích lũy được trước khi kết thúc episode.
- D. Số trạng thái kề (neighboring states) của trạng thái đang xét trong lưới.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Trong Example 4.1, ước lượng cuối cùng chính là v_π, và trong trường hợp này nó cho mỗi trạng thái số đối của số bước kỳ vọng (expected number of steps) từ trạng thái đó cho tới khi kết thúc. Vì reward là −1 trên mọi bước chuyển tới khi đạt terminal, giá trị càng âm thì càng xa đích.

</details>

---

**Câu 11.** [Khó] Trong gridworld của Example 4.1, một ô kề terminal có v_π ≈ −14 dưới chính sách random. Vì sao giá trị này âm hơn nhiều so với −1, trong khi từ ô đó có thể tới đích chỉ trong một bước?

- A. Vì reward được nhân với discount γ < 1 nên tích lũy lại thành một giá trị âm lớn.
- B. Vì v_π là kỳ vọng dưới chính sách random: agent đi lang thang nhiều bước trước khi tình cờ tới đích, nên số bước kỳ vọng (và độ âm) lớn.
- C. Vì policy evaluation chưa hội tụ hoàn toàn; giá trị thật khi hội tụ phải tiến về khoảng −1.
- D. Vì mỗi lần đi sai hướng agent bị phạt thêm một reward đặc biệt lớn ngoài reward −1.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — v_π là expected return *dưới chính sách đang đánh giá*, ở đây là equiprobable random. Dù tồn tại đường đi ngắn, chính sách random khiến agent đi lang thang lâu, nên số bước kỳ vọng lớn và v_π rất âm. Đây là điểm tinh tế: policy evaluation đánh giá π hiện tại chứ không phải đường đi ngắn nhất. A sai (bài toán undiscounted, γ = 1); C sai (giá trị đã hội tụ đúng cho π random); D sai (reward luôn là −1).

</details>

---

**Câu 12.** [Khó] Iterative policy evaluation được bảo đảm hội tụ về v_π trong điều kiện nào, và nhờ tính chất toán học gì?

- A. Chỉ khi γ = 1 và bài toán là episodic; nhờ value function bị chặn trên bởi 0.
- B. Với mọi γ ≥ 0 mà không cần thêm điều kiện; nhờ update là một phép biến đổi tuyến tính bất động.
- C. Khi state space hữu hạn và π được chọn là deterministic greedy; nhờ tính đơn điệu của max.
- D. Khi γ < 1 hoặc đảm bảo eventual termination từ mọi trạng thái; vì khi đó v_π tồn tại, duy nhất và dãy {v_k} hội tụ tới nó.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Sách nêu rõ v_π tồn tại và duy nhất miễn là γ < 1 hoặc đảm bảo eventual termination từ mọi trạng thái dưới π; với điều kiện đó dãy {v_k} sinh bởi update (4.5) hội tụ tới v_π khi k → ∞ (điểm bất động của Bellman operator cho v_π). B sai vì khi γ = 1 mà không đảm bảo kết thúc thì giá trị có thể không hữu hạn; A và C áp đặt điều kiện không đúng — policy evaluation áp dụng cho π *bất kỳ*, không cần greedy.

</details>

---

**Câu 13.** [Khó] Cho MDP một trạng thái không kết thúc s với một hành động duy nhất: từ s nhận reward +1 rồi quay lại s với xác suất 1, dùng γ = 0.9. Khởi tạo v_0(s) = 0. Sau hai bước iterative policy evaluation, v_2(s) bằng bao nhiêu, và giá trị hội tụ v_π(s) là bao nhiêu?

- A. v_2(s) = 2.0 và v_π(s) = 2.0
- B. v_2(s) = 1.9 và v_π(s) = 10
- C. v_2(s) = 1.0 và v_π(s) = 9
- D. v_2(s) = 1.9 và v_π(s) = 1.9

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Update: v_{k+1}(s) = 1 + 0.9·v_k(s). Với v_0 = 0: v_1 = 1 + 0.9·0 = 1; v_2 = 1 + 0.9·1 = 1.9. Giá trị hội tụ là điểm bất động v = 1 + 0.9v ⇒ v = 1/(1−0.9) = 10. Đây cũng đúng bằng tổng chuỗi hình học Σ 0.9^t = 1/(1−0.9) = 10. Các phương án khác hoặc dùng sai công thức điểm bất động hoặc quên discount.

</details>

---

## 4.2 Policy Improvement

**Câu 14.** Đại lượng q_π(s, a) = E[R_{t+1} + γ v_π(S_{t+1}) | S_t = s, A_t = a] biểu diễn điều gì?

- A. Giá trị của việc chọn hành động a một lần tại s rồi sau đó tiếp tục theo chính sách hiện tại π.
- B. Optimal action-value q*(s, a), tức giá trị tốt nhất có thể đạt được từ cặp (s, a).
- C. Phần thưởng tức thời trung bình nhận được khi thực hiện hành động a tại trạng thái s.
- D. Giá trị của việc luôn luôn tuân theo chính sách π kể từ trạng thái s trở đi.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — q_π(s, a) là giá trị của cách hành xử: chọn hành động a tại s rồi sau đó tiếp tục theo chính sách hiện có π. Tiêu chí then chốt là so sánh đại lượng này với v_π(s): nếu q_π(s, a) > v_π(s) thì việc chọn a mỗi khi gặp s sẽ cho một chính sách tốt hơn về tổng thể. B sai vì đó là q*; D mô tả v_π(s) chứ không phải q_π(s,a).

</details>

---

**Câu 15.** *Policy improvement theorem* phát biểu như thế nào?

- A. Mọi greedy policy đối với một value function bất kỳ đều là optimal policy của MDP.
- B. Nếu q_π(s, π′(s)) ≥ v_π(s) với mọi s thì π′ tốt bằng hoặc tốt hơn π, tức v_{π′}(s) ≥ v_π(s) với mọi s.
- C. Nếu v_{π′}(s) ≥ v_π(s) với mọi s thì hai chính sách π và π′ thực chất là một chính sách.
- D. Nếu q_π(s, π′(s)) < v_π(s) với mọi s thì π′ vẫn tốt hơn π nhờ tính co của Bellman operator.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Policy improvement theorem: với cặp deterministic policy π và π′ sao cho q_π(s, π′(s)) ≥ v_π(s) với mọi s (công thức 4.7), thì π′ phải tốt bằng hoặc tốt hơn π, tức v_{π′}(s) ≥ v_π(s) với mọi s (công thức 4.8). Hơn nữa nếu có bất đẳng thức nghiêm ngặt ở (4.7) tại trạng thái nào thì cũng có bất đẳng thức nghiêm ngặt ở (4.8) tại đó. D đảo ngược dấu nên sai.

</details>

---

**Câu 16.** *Greedy policy* π′ đối với v_π được định nghĩa như thế nào, và nó có tính chất gì?

- A. π′(s) = argmin_a q_π(s,a); π′ làm giảm dần value function qua mỗi vòng lặp.
- B. π′(s) = chọn ngẫu nhiên đều một hành động; π′ luôn kém hơn chính sách π gốc.
- C. π′(s) = hành động có phần thưởng tức thời nhỏ nhất; π′ luôn là optimal policy.
- D. π′(s) = argmax_a Σ_{s′,r} p(s′,r|s,a)[r + γ v_π(s′)]; theo định lý, π′ tốt bằng hoặc tốt hơn π.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Greedy policy được tạo bằng cách chọn ở mỗi trạng thái hành động tốt nhất theo q_π(s,a): π′(s) = argmax_a q_π(s,a) = argmax_a Σ_{s′,r} p(s′,r|s,a)[r + γ v_π(s′)] (công thức 4.9). Theo cách xây dựng, greedy policy thỏa điều kiện của policy improvement theorem (4.7), nên nó tốt bằng hoặc tốt hơn chính sách gốc. Quá trình này gọi là policy improvement.

</details>

---

**Câu 17.** Điều gì xảy ra khi greedy policy π′ chỉ tốt *bằng* (chứ không tốt hơn) chính sách cũ π, tức v_π = v_{π′}?

- A. v_{π′} thỏa Bellman optimality equation, nên v_{π′} = v* và cả π lẫn π′ đều là optimal policy.
- B. Quá trình policy iteration sẽ lặp lại vô hạn lần mà không bao giờ hội tụ về nghiệm.
- C. Cần khởi tạo lại value function bằng các giá trị ngẫu nhiên rồi bắt đầu lại từ đầu.
- D. Điều này không thể xảy ra với một finite MDP có discount factor γ < 1.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Nếu greedy policy π′ tốt bằng nhưng không tốt hơn π (v_π = v_{π′}) thì từ (4.9) suy ra v_{π′}(s) = max_a Σ p(s′,r|s,a)[r + γ v_{π′}(s′)] với mọi s. Đây chính là Bellman optimality equation, nên v_{π′} = v* và cả π lẫn π′ đều là optimal policy. Như vậy policy improvement luôn cho chính sách nghiêm ngặt tốt hơn, trừ khi chính sách gốc đã optimal.

</details>

---

**Câu 18.** Policy improvement có áp dụng được cho *stochastic policy* không?

- A. Không; ý tưởng này chỉ áp dụng cho deterministic policy và sụp đổ khi policy là stochastic.
- B. Có, nhưng khi có nhiều hành động đạt max ta buộc phải chọn duy nhất một trong số chúng.
- C. Có, nhưng policy improvement theorem không còn đúng và cần một chứng minh khác.
- D. Có; mọi ý tưởng mở rộng dễ dàng. Khi có tie, có thể chia xác suất cho các hành động đạt max, miễn các hành động dưới mức max nhận xác suất 0.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Mọi ý tưởng của mục này mở rộng dễ dàng cho stochastic policy, và policy improvement theorem vẫn đúng nguyên dạng. Khi có tie (nhiều hành động đạt max), trong trường hợp stochastic ta không cần chọn duy nhất một hành động — mỗi hành động đạt max có thể được chia một phần xác suất; bất kỳ cách phân chia nào cũng được phép miễn là mọi hành động submaximal (dưới mức max) nhận xác suất 0.

</details>

---

**Câu 19.** [Khó] Cho v_π(s) = 5 tại trạng thái s, và tại s có hai hành động với q_π(s, a₁) = 5, q_π(s, a₂) = 7. Áp dụng một bước policy improvement (greedy) tại s sẽ cho điều gì, và ta có thể kết luận chắc chắn gì?

- A. π′(s) = a₂; ta kết luận chắc chắn rằng π′ là optimal policy của toàn bộ MDP.
- B. π′(s) = a₂; ta chỉ kết luận v_{π′}(s) ≥ v_π(s) = 5, và vì có cải thiện nghiêm ngặt tại s nên π′ tốt hơn π.
- C. π′(s) = a₁ vì a₁ giữ nguyên giá trị hiện tại; do đó value function không đổi.
- D. Không thể cải thiện vì q_π(s, a₁) đã bằng đúng v_π(s) = 5.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Greedy chọn argmax q_π(s,·) = a₂ vì 7 > 5. Theo policy improvement theorem, vì q_π(s, π′(s)) = 7 > v_π(s) = 5 (bất đẳng thức nghiêm ngặt) nên π′ tốt hơn π một cách nghiêm ngặt. Lưu ý ta *chưa* biết π′ optimal (cần evaluation lại rồi kiểm tra ổn định) — nên A sai. q_π(s,a₂)=7 không có nghĩa v_{π′}(s)=7 ngay, vì thay đổi policy còn ảnh hưởng các state khác.

</details>

---

## 4.3 Policy Iteration

**Câu 20.** *Policy iteration* hoạt động như thế nào?

- A. Chỉ thực hiện đúng một lần policy evaluation đầy đủ rồi dừng và trả về chính sách greedy.
- B. Tìm kiếm vét cạn trên toàn bộ k^n chính sách deterministic rồi chọn chính sách có v lớn nhất.
- C. Lấy mẫu các episode để ước lượng q_π rồi cập nhật policy theo các mẫu thu được.
- D. Lặp đan xen policy evaluation (tính v_π đầy đủ) và policy improvement, tạo dãy chính sách cải thiện đơn điệu tới optimal.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Policy iteration tạo dãy đan xen E (policy evaluation) và I (policy improvement): π₀ →E v_{π₀} →I π₁ →E v_{π₁} →I π₂ → ... → π* → v*. Mỗi chính sách được bảo đảm cải thiện nghiêm ngặt so với chính sách trước (trừ khi đã optimal). Vì finite MDP chỉ có hữu hạn deterministic policy nên quá trình phải hội tụ về optimal trong hữu hạn bước. B mô tả direct search, không phải policy iteration.

</details>

---

**Câu 21.** Vì sao trong policy iteration, mỗi bước policy evaluation thường được khởi tạo bằng value function của chính sách trước đó?

- A. Vì đây là yêu cầu bắt buộc về mặt lý thuyết, nếu không policy iteration sẽ không hội tụ.
- B. Vì điều này thường tăng mạnh tốc độ hội tụ của evaluation (value function thay đổi ít giữa hai chính sách liên tiếp).
- C. Vì nếu khởi tạo bằng 0 thì value function của chính sách mới sẽ bị âm và sai.
- D. Vì nhờ đó policy evaluation không cần dùng tới model p(s′, r | s, a) của environment.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Mỗi policy evaluation (vốn là tính toán lặp) được khởi đầu bằng value function của chính sách trước. Điều này thường làm tăng mạnh tốc độ hội tụ của evaluation, có lẽ vì value function thay đổi rất ít từ một chính sách sang chính sách kế tiếp. Đây là tối ưu thực dụng (không bắt buộc — nên A sai); policy evaluation vẫn cần model nên D sai.

</details>

---

**Câu 22.** Trong Example 4.2 (*Jack's car rental*), bài toán được mô hình hóa ra sao?

- A. Một bài toán bandit không trạng thái với hai cánh tay tương ứng hai địa điểm cho thuê.
- B. Một undiscounted episodic task không có hành động, chỉ đếm số xe được thuê mỗi ngày.
- C. Một continuing finite MDP với γ = 0.9; state là số xe ở mỗi địa điểm cuối ngày, action là số xe ròng chuyển giữa hai địa điểm qua đêm.
- D. Một bài toán điều khiển liên tục với state space vô hạn, không thể giải bằng DP.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Jack's car rental được mô hình thành continuing finite MDP với discount γ = 0.9. State là số xe ở mỗi địa điểm cuối ngày, action là số xe ròng (net) chuyển giữa hai địa điểm qua đêm (tối đa 5 xe, chi phí $2/xe). Số yêu cầu thuê và trả là biến ngẫu nhiên Poisson. Policy iteration tìm ra dãy chính sách, mỗi chính sách cải thiện nghiêm ngặt và chính sách cuối là optimal.

</details>

---

**Câu 23.** [Khó] Trong policy iteration trên một finite MDP, vì sao quá trình được bảo đảm kết thúc sau *hữu hạn* bước, khác với iterative policy evaluation chỉ hội tụ "trong giới hạn"?

- A. Vì policy evaluation luôn dừng chính xác sau đúng một sweep nên toàn bộ quá trình hữu hạn.
- B. Vì mỗi vòng cho một chính sách nghiêm ngặt tốt hơn, mà finite MDP chỉ có hữu hạn deterministic policy, nên không thể cải thiện mãi.
- C. Vì discount γ < 1 làm value function bị chặn nên sau hữu hạn bước nó bằng 0.
- D. Vì số trạng thái hữu hạn nên một sweep evaluation chỉ mất hữu hạn phép tính.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Mỗi bước policy improvement cho một chính sách *nghiêm ngặt* tốt hơn trừ khi chính sách hiện tại đã optimal. Một finite MDP chỉ có hữu hạn deterministic policy (tối đa k^n), nên không thể tạo ra một chuỗi cải thiện nghiêm ngặt vô hạn — quá trình phải dừng ở optimal sau hữu hạn vòng. Lưu ý: *bản thân* mỗi policy evaluation vẫn chỉ hội tụ trong giới hạn (đó là chuyện khác); A mô tả value iteration nên sai.

</details>

---

## 4.4 Value Iteration

**Câu 24.** *Value iteration* được tạo ra như thế nào và quy tắc cập nhật của nó là gì?

- A. Bằng cách cắt ngắn (truncate) policy evaluation sau đúng một sweep, kết hợp improvement; cập nhật v_{k+1}(s) = max_a Σ_{s′,r} p(s′,r|s,a)[r + γ v_k(s′)].
- B. Bằng cách chạy policy evaluation tới hội tụ hoàn toàn rồi mới improvement; cập nhật v_{k+1}(s) = Σ_a π(a|s)Σ p[...].
- C. Bằng cách lấy mẫu các episode và cập nhật theo TD error trên các mẫu next state.
- D. Bằng cách giải một hệ phương trình tuyến tính đúng một lần để thu được v* trực tiếp.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Value iteration là trường hợp đặc biệt khi policy evaluation bị dừng sau đúng một sweep, kết hợp luôn bước policy improvement. Quy tắc cập nhật (4.10): v_{k+1}(s) = max_a Σ_{s′,r} p(s′,r|s,a)[r + γ v_k(s′)]. Đây là Bellman optimality equation biến thành update rule, giống policy evaluation update (4.5) ngoại trừ việc lấy max trên các hành động. B mô tả policy iteration đầy đủ.

</details>

---

**Câu 25.** Sự khác biệt duy nhất về mặt toán tử giữa một sweep value iteration update và một sweep policy evaluation update là gì?

- A. Value iteration dùng phần thưởng được lấy mẫu, còn policy evaluation dùng phần thưởng kỳ vọng.
- B. Value iteration thêm toán tử max trên các hành động, còn policy evaluation lấy tổng theo π(a|s).
- C. Value iteration không dùng model p(s′, r | s, a), còn policy evaluation thì có dùng.
- D. Value iteration bỏ discount γ, còn policy evaluation giữ discount trong update.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Toán tử max trong (4.10) là khác biệt duy nhất giữa hai loại cập nhật. Value iteration hiệu quả kết hợp trong mỗi sweep một sweep policy evaluation và một sweep policy improvement. Hội tụ nhanh hơn thường đạt được khi xen kẽ nhiều sweep evaluation giữa mỗi sweep improvement — cả lớp truncated policy iteration này đều hội tụ về optimal cho discounted finite MDP. Cả hai đều dùng model và discount nên A/C/D sai.

</details>

---

**Câu 26.** Trong Example 4.3 (*Gambler's problem*), state-value function biểu diễn điều gì?

- A. Số tiền kỳ vọng mà gambler sẽ có khi episode kết thúc.
- B. Số ván cược kỳ vọng còn lại trước khi gambler hết tiền hoặc đạt mục tiêu.
- C. Phần thưởng tức thời nhận được tại mỗi bước cược của gambler.
- D. Xác suất thắng (đạt mục tiêu $100) khi xuất phát từ mỗi mức vốn (state).

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Trong Gambler's problem (undiscounted episodic finite MDP), state là vốn s ∈ {1,...,99}, action là mức cược a ∈ {0,...,min(s, 100−s)}, reward bằng 0 ở mọi bước trừ bước đạt mục tiêu thì +1. Do đó state-value function cho xác suất thắng từ mỗi state, và optimal policy tối đa hóa xác suất đạt mục tiêu. Với p_h = 0.4, chính sách tìm được là optimal nhưng không duy nhất (có cả họ optimal policy do các tie ở argmax).

</details>

---

**Câu 27.** [Khó] Trong Gambler's problem với p_h = 0.4 (xác suất thắng mỗi ván nhỏ hơn 0.5), optimal policy có hình dạng "lởm chởm" và tại vốn = $50 thường cược toàn bộ $50. Lý giải nào đúng nhất?

- A. Vì p_h < 0.5 nên kỳ vọng mỗi ván là âm; cược lớn (bold play) ở $50 để có cơ hội đạt $100 ngay trong một ván, giảm số ván phải chơi với lợi thế bất lợi.
- B. Vì p_h < 0.5 nên cược nhỏ (timid play) luôn tối ưu để bảo toàn vốn càng lâu càng tốt.
- C. Vì value function tăng tuyến tính theo vốn nên mọi mức cược tại $50 đều cho cùng giá trị.
- D. Vì discount γ rất nhỏ buộc gambler phải kết thúc nhanh bằng cách cược lớn ở mọi state.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Khi p_h < 0.5, mỗi ván có kỳ vọng bất lợi, nên chơi càng nhiều ván thì xác suất thắng tổng thể càng giảm. Chiến lược tối ưu thiên về bold play: ở $50, cược toàn bộ để có thể đạt $100 ngay trong một ván thắng, tránh phải chơi nhiều ván dưới lợi thế âm. Hình dạng lởm chởm phản ánh các tie ở argmax. B (timid) sai vì nó kéo dài cuộc chơi bất lợi; bài toán là undiscounted (γ=1) nên D sai; C sai vì value function không tuyến tính.

</details>

---

## 4.5 Asynchronous Dynamic Programming

**Câu 28.** Hạn chế chính của các phương pháp DP "đồng bộ" (synchronous, dựa trên sweep) mà asynchronous DP nhắm khắc phục là gì?

- A. Chúng không hội tụ về optimal value function khi state space lớn.
- B. Chúng không thể sử dụng model của environment trong quá trình cập nhật.
- C. Chúng yêu cầu thao tác trên toàn bộ state space (sweep); với state space rất lớn, ngay cả một sweep cũng có thể quá tốn kém (ví dụ backgammon hơn 10^20 trạng thái).
- D. Chúng không thể xử lý discount γ < 1 nên chỉ dùng được cho bài toán undiscounted.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Hạn chế lớn của DP là chúng đòi hỏi thao tác trên toàn bộ state space (sweep). Nếu state space rất lớn thì ngay một sweep cũng có thể cực kỳ tốn kém — ví dụ backgammon có hơn 10^20 trạng thái; dù cập nhật một triệu trạng thái mỗi giây thì một sweep vẫn mất hơn nghìn năm. Các phương án còn lại sai vì DP synchronous vẫn hội tụ, vẫn dùng model và vẫn xử lý discount.

</details>

---

**Câu 29.** Điều kiện để asynchronous value iteration (cập nhật in-place một trạng thái mỗi bước) hội tụ về v* là gì?

- A. Phải cập nhật các trạng thái theo đúng một thứ tự cố định lặp đi lặp lại.
- B. Chỉ cần cập nhật mỗi trạng thái đúng một lần là đủ để hội tụ.
- C. Phải đợi toàn bộ một sweep hoàn tất trước khi được phép cập nhật trạng thái tiếp theo.
- D. (Với 0 ≤ γ < 1) chỉ cần mọi trạng thái xuất hiện trong dãy {s_k} vô hạn lần; không được bỏ sót trạng thái nào sau một thời điểm.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Asynchronous DP là các thuật toán DP lặp, in-place, không tổ chức theo sweep có hệ thống; chúng cập nhật trạng thái theo bất kỳ thứ tự nào, dùng bất kỳ giá trị nào hiện có. Để hội tụ đúng, thuật toán phải tiếp tục cập nhật giá trị của mọi trạng thái — không được bỏ qua trạng thái nào sau một thời điểm. Với 0 ≤ γ < 1, hội tụ tiệm cận về v* được bảo đảm miễn mọi trạng thái xuất hiện trong dãy {s_k} vô hạn lần (dãy thậm chí có thể ngẫu nhiên). A và C áp đặt ràng buộc không cần thiết.

</details>

---

**Câu 30.** Việc tránh sweep trong asynchronous DP có nghĩa là gì?

- A. Nó loại bỏ hoàn toàn nhu cầu phải cập nhật một số trạng thái nhất định.
- B. Nó không nhất thiết cần ít tính toán hơn, nhưng cho phép không bị "kẹt" trong một sweep dài vô vọng trước khi cải thiện policy, và dễ xen kẽ tính toán với tương tác thời gian thực.
- C. Nó biến DP thành một phương pháp model-free, không còn cần p(s′, r | s, a).
- D. Nó luôn cần ít tổng tính toán hơn so với synchronous DP trong mọi trường hợp.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Tránh sweep không nhất thiết nghĩa là ít tính toán hơn (nên D sai); nó chỉ nghĩa là thuật toán không bị khóa vào một sweep dài vô vọng trước khi bắt đầu cải thiện policy. Ta có thể chọn thứ tự cập nhật để lan truyền giá trị hiệu quả, hoặc tập trung vào các trạng thái liên quan. Asynchronous DP còn giúp dễ xen kẽ tính toán với tương tác real-time, ví dụ cập nhật trạng thái khi agent thực sự ghé thăm chúng. A và C sai về bản chất.

</details>

---

## 4.6 Generalized Policy Iteration (GPI)

**Câu 31.** *Generalized policy iteration* (GPI) là gì?

- A. Một thuật toán cụ thể luôn chạy policy evaluation tới hội tụ hoàn toàn rồi mới improvement.
- B. Ý tưởng tổng quát về việc cho hai quá trình policy-evaluation và policy-improvement tương tác, độc lập với độ mịn (granularity) và chi tiết của hai quá trình.
- C. Một phương pháp tìm kiếm trực tiếp trong policy space bằng cách lấy mẫu các chính sách ứng viên.
- D. Một kỹ thuật rời rạc hóa (quantize) không gian trạng thái liên tục trước khi áp dụng DP.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — GPI chỉ ý tưởng tổng quát: cho các quá trình policy-evaluation và policy-improvement tương tác, bất kể granularity hay chi tiết của hai quá trình. Trong policy iteration hai quá trình luân phiên hoàn tất; trong value iteration chỉ một lần evaluation giữa mỗi improvement; trong asynchronous DP chúng đan xen ở mức mịn hơn. Gần như mọi phương pháp RL đều có thể mô tả là GPI. A mô tả riêng policy iteration, không phải GPI.

</details>

---

**Câu 32.** Theo GPI, khi nào value function và policy đạt optimal?

- A. Khi value function bằng 0 ở mọi trạng thái sau khi cập nhật đủ lâu.
- B. Sau khi thực hiện đúng một sweep evaluation kết hợp một sweep improvement.
- C. Khi cả evaluation lẫn improvement đều ổn định — tức tìm được chính sách greedy đối với chính evaluation function của nó, ngụ ý Bellman optimality equation được thỏa.
- D. Khi chính sách trở thành ngẫu nhiên đều (equiprobable) trên mọi hành động.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Nếu cả evaluation lẫn improvement đều ổn định (không còn tạo thay đổi) thì value function và policy phải optimal. Value function chỉ ổn định khi nhất quán với policy hiện tại; policy chỉ ổn định khi greedy đối với value function hiện tại. Cả hai cùng ổn định chỉ khi tìm được chính sách greedy đối với chính evaluation function của nó — điều này ngụ ý Bellman optimality equation (4.1) được thỏa, nên policy và value function là optimal.

</details>

---

**Câu 33.** Trong GPI, mối quan hệ giữa hai quá trình evaluation và improvement được mô tả là gì?

- A. Hoàn toàn độc lập với nhau, quá trình này không hề ảnh hưởng tới quá trình kia.
- B. Luôn cùng hướng và không bao giờ mâu thuẫn, nên hội tụ rất nhanh ngay từ đầu.
- C. Improvement luôn làm value function trở nên chính xác hơn cho chính sách hiện tại.
- D. Vừa cạnh tranh (kéo về hướng đối lập) vừa hợp tác (cùng tìm một nghiệm chung là optimal value function và optimal policy).

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Hai quá trình trong GPI vừa cạnh tranh vừa hợp tác. Chúng cạnh tranh vì kéo về hướng đối lập: làm policy greedy đối với value function thường khiến value function không còn chính xác cho policy mới; làm value function nhất quán với policy thường khiến policy không còn greedy. Nhưng về lâu dài hai quá trình tương tác để tìm một nghiệm chung duy nhất: optimal value function và một optimal policy. C sai vì improvement làm value function *kém* chính xác cho policy mới.

</details>

---

**Câu 34.** [Khó] Value iteration và policy iteration đều là các trường hợp của GPI. Điểm khác biệt cốt lõi giữa chúng theo lăng kính GPI là gì?

- A. Cả hai khác nhau ở chỗ chỉ value iteration là một dạng GPI, policy iteration thì không.
- B. Chúng khác nhau ở granularity của bước evaluation giữa mỗi improvement: policy iteration chạy evaluation tới hội tụ, còn value iteration chỉ một sweep evaluation.
- C. Policy iteration dùng max trong update còn value iteration dùng tổng theo π — đây là khác biệt duy nhất.
- D. Value iteration cần model còn policy iteration thì không, nên chỉ value iteration thuộc về DP.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Dưới lăng kính GPI, cả hai đều xen kẽ evaluation và improvement; chúng chỉ khác nhau ở *độ mịn* của evaluation giữa mỗi improvement. Policy iteration chạy evaluation tới hội tụ trước mỗi improvement; value iteration chỉ thực hiện đúng một sweep evaluation. Asynchronous DP còn mịn hơn nữa. C đảo ngược vai trò của max (max là của value iteration); D sai vì cả hai đều cần model.

</details>

---

## 4.7 Efficiency of Dynamic Programming

**Câu 35.** Về độ hiệu quả, DP đảm bảo tìm được optimal policy trong thời gian như thế nào so với tìm kiếm trực tiếp (direct search)?

- A. DP cần thời gian hàm mũ theo số trạng thái, nên direct search thực ra nhanh hơn DP.
- B. DP và direct search có cùng độ phức tạp tính toán trong trường hợp xấu nhất.
- C. Trong trường hợp xấu nhất, DP cần thời gian đa thức (polynomial) theo số trạng thái n và số hành động k, dù tổng số deterministic policy là k^n — nên DP nhanh hơn theo cấp số mũ so với direct search.
- D. DP buộc phải liệt kê vét cạn toàn bộ k^n chính sách trước khi chọn được chính sách tốt nhất.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Trong trường hợp xấu nhất, thời gian DP cần để tìm optimal policy là đa thức theo số trạng thái n và số hành động k, dù tổng số deterministic policy là k^n. Theo nghĩa này DP nhanh hơn theo cấp số mũ so với bất kỳ direct search nào trong policy space, vì direct search phải xét vét cạn từng chính sách để có cùng bảo đảm. D mô tả chính direct search, không phải DP.

</details>

---

**Câu 36.** *Curse of dimensionality* trong ngữ cảnh DP nghĩa là gì, và DP có thực sự kém vì nó không?

- A. DP yêu cầu số chiều của value function phải bằng số hành động, nên không mở rộng được.
- B. Số trạng thái thường tăng theo cấp số mũ với số biến trạng thái; nhưng đây là khó khăn cố hữu của bài toán, không phải của DP — thực tế DP xử lý state space lớn tốt hơn direct search và linear programming.
- C. DP về bản chất không thể giải các bài toán có nhiều hơn hai chiều trạng thái.
- D. Curse of dimensionality khiến DP không bao giờ hội tụ trên các bài toán nhiều chiều.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Curse of dimensionality (thuật ngữ do Bellman đặt) là việc số trạng thái thường tăng theo cấp số mũ với số biến trạng thái. State space lớn quả gây khó khăn, nhưng đây là khó khăn cố hữu của *bài toán* chứ không phải của DP với tư cách phương pháp giải. Thực tế DP còn tương đối phù hợp hơn để xử lý state space lớn so với direct search và linear programming, và có thể giải MDP với hàng triệu trạng thái trên máy tính ngày nay.

</details>

---

**Câu 37.** Giữa policy iteration và value iteration, sách kết luận gì về việc phương pháp nào tốt hơn? Và trên state space lớn nên ưu tiên gì?

- A. Policy iteration luôn tốt hơn value iteration trong mọi bài toán nên luôn được ưu tiên.
- B. Value iteration luôn tốt hơn policy iteration nên hiếm khi dùng policy iteration.
- C. Cả hai đều vô dụng cho bài toán lớn; chỉ linear programming mới giải được state space lớn.
- D. Không rõ phương pháp nào tốt hơn nói chung; cả hai được dùng rộng rãi; trên state space lớn thường ưu tiên asynchronous DP.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Cả policy iteration và value iteration đều được dùng rộng rãi, và không rõ phương pháp nào (nếu có) tốt hơn nói chung; trong thực tế chúng thường hội tụ nhanh hơn nhiều so với thời gian chạy lý thuyết xấu nhất, nhất là khi khởi tạo bằng value function hoặc chính sách tốt. Trên bài toán state space lớn, asynchronous DP thường được ưu tiên vì một sweep đồng bộ đòi hỏi tính toán và bộ nhớ cho mọi trạng thái.

</details>

---

**Câu 38.** [Khó] Sách lưu ý rằng linear programming (LP) cũng có thể giải MDP và đôi khi cho worst-case guarantee tốt hơn DP. Vì sao DP vẫn thường được ưu tiên trên các bài toán lớn?

- A. Vì LP không bao giờ tìm được optimal policy, chỉ cho nghiệm xấp xỉ.
- B. Vì LP không dùng được model của environment trong khi DP thì có.
- C. Vì LP trở nên bất khả thi (impractical) khi số trạng thái lớn — sớm hơn nhiều so với DP — nên với bài toán lớn chỉ DP mới khả thi.
- D. Vì DP có worst-case complexity luôn nhỏ hơn LP trên mọi bài toán.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Sách nêu LP methods đôi khi có worst-case convergence guarantee tốt hơn DP, nhưng LP trở nên impractical ở số trạng thái nhỏ hơn nhiều so với ngưỡng của DP (cỡ vài lần nhỏ hơn). Vì vậy với các bài toán có state space lớn, chỉ các phương pháp DP mới còn khả thi. A và B sai (LP vẫn tìm optimal, vẫn dùng model); D quá tuyệt đối — DP không phải luôn có worst-case nhỏ hơn LP, chỉ scale tốt hơn trong thực tế.

</details>

---

## 4.8 Summary

**Câu 39.** *Bootstrapping* trong DP nghĩa là gì?

- A. Khởi tạo value function bằng các mẫu dữ liệu thực thu thập trước khi chạy thuật toán.
- B. Lấy mẫu lại (resampling) dữ liệu nhiều lần để giảm phương sai của ước lượng giá trị.
- C. Cập nhật ước lượng giá trị của các trạng thái dựa trên ước lượng giá trị của các trạng thái kế tiếp (cập nhật ước lượng dựa trên các ước lượng khác).
- D. Tính chính xác value function bằng cách giải trực tiếp một hệ phương trình tuyến tính.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Một tính chất đặc biệt của mọi phương pháp DP: chúng cập nhật ước lượng giá trị của các trạng thái dựa trên ước lượng giá trị của các trạng thái kế tiếp — tức cập nhật ước lượng dựa trên các ước lượng khác. Ý tưởng tổng quát này gọi là bootstrapping. Nhiều phương pháp RL cũng bootstrap, kể cả những phương pháp không cần model đầy đủ như DP yêu cầu. B là kỹ thuật thống kê khác (resampling), không phải bootstrapping ở đây.

</details>

---

**Câu 40.** Theo phần Summary, mối quan hệ giữa expected update và Bellman equation là gì, và hội tụ xảy ra khi nào?

- A. Expected update không liên quan gì đến Bellman equation; chúng là hai khái niệm độc lập.
- B. Hội tụ chỉ xảy ra khi value function của mọi trạng thái đều bằng 0 sau cập nhật.
- C. Expected update là Bellman equation được biến thành câu lệnh gán (assignment); hội tụ khi các cập nhật không còn tạo thay đổi giá trị nào (giá trị thỏa Bellman equation tương ứng).
- D. Có đúng hai value function chính (v_π, q_π) ứng với hai Bellman equation, và mỗi cái có một expected update riêng.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — DP cổ điển hoạt động theo sweep, thực hiện một expected update trên mỗi trạng thái; mỗi thao tác cập nhật giá trị một trạng thái dựa trên giá trị mọi trạng thái kế tiếp và xác suất xảy ra. Expected update gắn chặt với Bellman equation: chúng chẳng qua là các phương trình đó được biến thành câu lệnh gán. Khi cập nhật không còn tạo thay đổi nào thì đã hội tụ về giá trị thỏa Bellman equation tương ứng. D sai vì thực ra có *bốn* value function chính (v_π, v*, q_π, q*) ứng với bốn Bellman equation và bốn expected update.

</details>

---

**Câu 41.** [Khó] Một sinh viên cho rằng "vì DP cần perfect model còn TD learning thì không, nên DP và TD chẳng có điểm chung nào". Theo phần Summary của chương, nhận định này sai ở đâu?

- A. Sai vì TD learning thực ra cũng cần một perfect model giống hệt DP.
- B. Sai vì cả DP lẫn nhiều phương pháp RL khác (gồm TD) đều dùng bootstrapping — cập nhật ước lượng dựa trên ước lượng khác; điểm chung này độc lập với việc có cần model hay không.
- C. Sai vì DP không cần model còn TD mới là phương pháp cần model đầy đủ.
- D. Sai vì DP và TD đều là direct search trong policy space nên hoàn toàn giống nhau.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Phần Summary nhấn mạnh bootstrapping là điểm chung quan trọng: nhiều phương pháp RL bootstrap giống DP — cập nhật ước lượng dựa trên các ước lượng khác — kể cả những phương pháp *không* cần model đầy đủ như TD. Việc DP cần model còn TD thì không là một khác biệt thật, nhưng nó không xóa bỏ điểm chung sâu sắc về cơ chế bootstrapping. A, C, D đều sai về dữ kiện cơ bản (TD không cần model; cả hai không phải direct search).

</details>
