# Chương 6: Temporal-Difference Learning — Câu hỏi trả lời ngắn

> Bộ câu hỏi trả lời ngắn (short-answer) ôn tập Chương 6, sách *Reinforcement Learning: An Introduction* (Sutton & Barto, 2nd ed.). Đáp án tham khảo dùng cho việc LLM chấm điểm.

## 6.1 TD Prediction

**Câu 1.** Viết công thức cập nhật của TD(0) (one-step TD) cho prediction và chỉ rõ đâu là TD target. So sánh với target của phương pháp constant-α Monte Carlo.

<details>
<summary>Đáp án tham khảo</summary>

Công thức cập nhật TD(0): V(S_t) ← V(S_t) + α[R_{t+1} + γV(S_{t+1}) − V(S_t)]. TD target là R_{t+1} + γV(S_{t+1}), được hình thành ngay tại bước t+1 dựa trên reward quan sát được R_{t+1} và ước lượng V(S_{t+1}). Trong khi đó, target của constant-α MC là return thực tế G_t: V(S_t) ← V(S_t) + α[G_t − V(S_t)], nên MC phải chờ đến cuối episode mới biết G_t. TD chỉ cần chờ một bước (one-step).

</details>

**Câu 2.** TD error δ_t được định nghĩa thế nào, và vì sao nói nó "không có sẵn ngay tại thời điểm t"?

<details>
<summary>Đáp án tham khảo</summary>

TD error: δ_t = R_{t+1} + γV(S_{t+1}) − V(S_t). Nó đo độ chênh lệch giữa ước lượng hiện tại V(S_t) và ước lượng tốt hơn R_{t+1} + γV(S_{t+1}). δ_t là lỗi của ước lượng V(S_t) thực hiện tại thời điểm t, nhưng vì phụ thuộc vào next state S_{t+1} và next reward R_{t+1} nên chỉ có sẵn một bước sau, tức tại t+1. Khi V không đổi suốt episode, Monte Carlo error có thể viết thành tổng các TD error: G_t − V(S_t) = Σ_{k=t}^{T−1} γ^{k−t} δ_k.

</details>

**Câu 3.** Tại sao nói TD kết hợp ý tưởng của cả Monte Carlo lẫn Dynamic Programming (DP)? Bootstrapping nghĩa là gì trong ngữ cảnh này?

<details>
<summary>Đáp án tham khảo</summary>

Giống MC, TD học trực tiếp từ raw experience mà không cần model về dynamics của môi trường (nó sample các giá trị kỳ vọng). Giống DP, TD cập nhật ước lượng dựa một phần vào các ước lượng đã học khác mà không cần chờ kết quả cuối cùng — đó chính là bootstrapping. TD target là ước lượng vì cả hai lý do: vừa sample các kỳ vọng trong E_π[R_{t+1} + γv_π(S_{t+1})], vừa dùng ước lượng hiện tại V thay cho v_π thật. Vậy TD = sampling của MC + bootstrapping của DP.

</details>

## 6.2 Advantages of TD Prediction Methods

**Câu 4.** Nêu các lợi thế chính của TD so với DP và so với Monte Carlo.

<details>
<summary>Đáp án tham khảo</summary>

So với DP: TD không cần model của môi trường (không cần phân phối reward và next-state). So với MC: TD được triển khai online, fully incremental — chỉ cần chờ một time step thay vì chờ hết episode. Điều này quan trọng với các task có episode rất dài, các continuing task không có episode, và các trường hợp MC phải bỏ qua/discount các episode có hành động thử nghiệm. TD học từ mỗi transition bất kể các hành động sau đó là gì.

</details>

**Câu 5.** TD(0) có đảm bảo hội tụ về v_π không? Trong điều kiện nào? Và trên thực nghiệm (ví dụ Random Walk), TD so với constant-α MC như thế nào?

<details>
<summary>Đáp án tham khảo</summary>

Có. Với một policy π cố định, TD(0) đã được chứng minh hội tụ về v_π: hội tụ theo nghĩa trung bình (in the mean) với step-size hằng đủ nhỏ, và hội tụ với xác suất 1 nếu step-size giảm theo các điều kiện stochastic approximation thông thường (2.7). Phần lớn chứng minh áp dụng cho trường hợp tabular, một số áp dụng cho linear function approximation. Trên thực nghiệm (Random Walk), chưa ai chứng minh được phương pháp nào hội tụ nhanh hơn về mặt toán học, nhưng TD thường được thấy hội tụ nhanh hơn constant-α MC trên các task ngẫu nhiên.

</details>

## 6.3 Optimality of TD(0)

**Câu 6.** Batch updating là gì? Dưới batch updating, batch TD(0) và batch constant-α MC có hội tụ về cùng một đáp án không?

<details>
<summary>Đáp án tham khảo</summary>

Batch updating: khi chỉ có một lượng experience hữu hạn, ta trình bày (present) lặp đi lặp lại toàn bộ batch dữ liệu cho thuật toán; các increment được tính cho mọi bước nhưng value function chỉ được cập nhật một lần bằng tổng tất cả increment, lặp đến khi hội tụ. Dưới batch updating, cả TD(0) và constant-α MC đều hội tụ deterministically (với α đủ nhỏ), nhưng về hai đáp án KHÁC nhau. Trên Random Walk, batch TD luôn tốt hơn batch MC theo RMS error.

</details>

**Câu 7.** Batch Monte Carlo và batch TD(0) tối ưu theo nghĩa nào? Giải thích thuật ngữ certainty-equivalence estimate.

<details>
<summary>Đáp án tham khảo</summary>

Batch MC luôn tìm các ước lượng tối thiểu hóa mean square error trên training set (tức sample average của các return thực tế đã thấy sau mỗi state). Batch TD(0) luôn tìm các ước lượng đúng chính xác cho maximum-likelihood model của Markov process: xác suất chuyển từ i sang j được ước lượng bằng tỉ lệ các transition quan sát được từ i đi sang j, reward kỳ vọng là trung bình reward trên các transition đó. Value function đúng với model này được gọi là certainty-equivalence estimate (vì coi như model được biết chắc chắn). Batch TD(0) hội tụ về certainty-equivalence estimate — điều này giải thích vì sao TD thường hội tụ nhanh hơn MC. Tuy vậy, tính trực tiếp certainty-equivalence tốn ~n² bộ nhớ và ~n³ tính toán, trong khi TD chỉ cần bộ nhớ bậc n.

</details>

## 6.4 Sarsa: On-policy TD Control

**Câu 8.** Mô tả thuật toán Sarsa cho control. Vì sao có tên "Sarsa", và viết công thức cập nhật.

<details>
<summary>Đáp án tham khảo</summary>

Sarsa là phương pháp on-policy TD control: học action-value function q_π cho behavior policy π, đồng thời đẩy π về phía greedy đối với q_π (ví dụ ε-greedy, theo GPI). Công thức cập nhật: Q(S_t, A_t) ← Q(S_t, A_t) + α[R_{t+1} + γQ(S_{t+1}, A_{t+1}) − Q(S_t, A_t)]. Cập nhật này dùng mọi phần tử của bộ năm (quintuple) (S_t, A_t, R_{t+1}, S_{t+1}, A_{t+1}) — chính bộ này (State, Action, Reward, State, Action) tạo nên tên "Sarsa". Nếu S_{t+1} là terminal thì Q(S_{t+1}, A_{t+1}) = 0.

</details>

**Câu 9.** Sarsa hội tụ về optimal policy trong điều kiện nào? Trong ví dụ Windy Gridworld, vì sao Monte Carlo khó dùng còn Sarsa thì không?

<details>
<summary>Đáp án tham khảo</summary>

Sarsa hội tụ với xác suất 1 về optimal policy và optimal action-value function dưới các điều kiện thông thường về step size (2.7), miễn là mọi cặp state–action được thăm vô hạn lần và policy hội tụ về greedy policy trong giới hạn (ví dụ với ε-greedy đặt ε = 1/t). Trong Windy Gridworld, MC khó dùng vì termination không được đảm bảo cho mọi policy: nếu gặp policy khiến agent kẹt tại một state thì episode không bao giờ kết thúc. Sarsa là online method nên nhanh chóng học trong episode rằng policy đó tệ và chuyển sang policy khác.

</details>

## 6.5 Q-learning: Off-policy TD Control

**Câu 10.** Viết công thức cập nhật của Q-learning và giải thích vì sao nó là off-policy.

<details>
<summary>Đáp án tham khảo</summary>

Công thức Q-learning: Q(S_t, A_t) ← Q(S_t, A_t) + α[R_{t+1} + γ max_a Q(S_{t+1}, a) − Q(S_t, A_t)]. Đây là off-policy vì learned action-value function Q trực tiếp xấp xỉ q* (optimal action-value function) độc lập với policy đang được thực thi — nhờ toán tử max_a trong target. Policy chỉ ảnh hưởng ở chỗ quyết định cặp state–action nào được thăm và cập nhật; điều kiện duy nhất để hội tụ đúng là mọi cặp tiếp tục được cập nhật. Dưới giả định này và các điều kiện stochastic approximation về step size, Q đã được chứng minh hội tụ với xác suất 1 về q*.

</details>

**Câu 11.** Trong ví dụ Cliff Walking, vì sao Sarsa và Q-learning học ra hai đường đi khác nhau, và policy nào có online performance tốt hơn?

<details>
<summary>Đáp án tham khảo</summary>

Q-learning học values của optimal policy đi sát mép vực (đường ngắn nhất). Nhưng do action selection theo ε-greedy, nó thỉnh thoảng rơi xuống vực (reward −100), nên online performance kém hơn. Sarsa là on-policy nên tính cả việc exploration vào action selection, học đường dài hơn nhưng an toàn hơn (đi vòng phía trên), cho tổng reward online tốt hơn. Nếu giảm dần ε, cả hai sẽ tiệm cận về optimal policy.

</details>

## 6.6 Expected Sarsa

**Câu 12.** Expected Sarsa khác Q-learning và Sarsa ở điểm nào? Viết công thức cập nhật và nêu ưu/nhược điểm so với Sarsa.

<details>
<summary>Đáp án tham khảo</summary>

Expected Sarsa giống Q-learning nhưng thay vì lấy max trên next state–action pairs, nó dùng giá trị kỳ vọng theo policy hiện tại: Q(S_t, A_t) ← Q(S_t, A_t) + α[R_{t+1} + γ Σ_a π(a|S_{t+1}) Q(S_{t+1}, a) − Q(S_t, A_t)]. Vì target di chuyển deterministically theo expectation thay vì sample A_{t+1}, nó loại bỏ variance do việc chọn ngẫu nhiên A_{t+1} → với cùng lượng experience, thường tốt hơn Sarsa một chút (ví dụ trên Cliff Walking có thể đặt α = 1 mà không giảm hiệu năng tiệm cận). Nhược điểm: tốn tính toán hơn Sarsa một chút. Khi target policy là greedy còn behavior khác đi, Expected Sarsa chính là Q-learning — nên nó subsume và generalize Q-learning đồng thời cải thiện Sarsa, có thể dùng on-policy hoặc off-policy.

</details>

## 6.7 Maximization Bias and Double Learning

**Câu 13.** Maximization bias là gì, nguồn gốc của nó, và double learning (Double Q-learning) khắc phục thế nào?

<details>
<summary>Đáp án tham khảo</summary>

Maximization bias: vì các control algorithm dùng max trên estimated values như một ước lượng cho max của true values, nó tạo positive bias. Ví dụ nhiều action có true value q(s,a)=0 nhưng estimate Q(s,a) phân tán quanh 0 — max của estimate dương trong khi max của true values bằng 0. Nguồn gốc: dùng CÙNG mẫu vừa để xác định maximizing action vừa để ước lượng giá trị của nó. Double learning chia mẫu thành hai để học hai ước lượng độc lập Q1 và Q2: dùng Q1 chọn action A* = argmax_a Q1(a) và dùng Q2(A*) làm ước lượng giá trị (không thiên lệch, E[Q2(A*)]=q(A*)). Double Q-learning lật đồng xu mỗi bước: nếu ngửa, cập nhật Q1(S_t,A_t) ← Q1(S_t,A_t) + α[R_{t+1} + γQ2(S_{t+1}, argmax_a Q1(S_{t+1},a)) − Q1(S_t,A_t)]; nếu sấp thì đảo vai Q1↔Q2. Behavior policy có thể dùng trung bình/tổng của hai estimate. Cách này gấp đôi bộ nhớ nhưng không tăng tính toán mỗi bước.

</details>

## 6.8 Games, Afterstates, and Other Special Cases

**Câu 14.** Afterstate (afterstate value function) là gì, và khi nào dùng nó hiệu quả hơn action-value function thông thường?

<details>
<summary>Đáp án tham khảo</summary>

Afterstate là trạng thái sau khi agent đã thực hiện nước đi của mình (ví dụ thế cờ ngay sau nước của ta nhưng trước phản ứng của đối thủ); afterstate value function đánh giá các trạng thái đó. Nó hữu ích khi ta biết một phần đầu của dynamics môi trường (biết hiệu quả tức thời của hành động) nhưng không biết phần còn lại (như phản ứng đối thủ). Ưu điểm hiệu quả: nhiều cặp position–move khác nhau lại dẫn đến cùng một afterposition; conventional action-value function phải đánh giá riêng từng cặp, còn afterstate value function đánh giá chúng như nhau — học từ cặp này tự động chuyển sang cặp kia. Afterstates xuất hiện không chỉ trong game mà cả các task như queuing (gán khách vào server, từ chối khách...), nơi action được định nghĩa bằng hiệu quả tức thời đã biết.

</details>

## 6.9 Summary

**Câu 15.** Tóm tắt: theo cách phân loại của chương này, Sarsa, Q-learning và Expected Sarsa thuộc on-policy hay off-policy? Và các phương pháp TD trong chương này được mô tả đúng nhất bằng những tính từ nào?

<details>
<summary>Đáp án tham khảo</summary>

Sarsa là on-policy; Q-learning là off-policy; Expected Sarsa (như trình bày ở đây) cũng là off-policy. Cả ba mở rộng TD prediction sang control thông qua generalized policy iteration (GPI). Các phương pháp TD trong chương này nên được gọi đúng là one-step, tabular, model-free TD methods. Chúng được dùng rộng rãi nhờ tính đơn giản: chạy online, ít tính toán, biểu diễn gần như hoàn toàn bằng một phương trình duy nhất, và đều được dẫn dắt bởi TD errors. (Một hướng thứ ba mở rộng TD sang control là actor–critic methods, được trình bày ở Chương 13.)

</details>
