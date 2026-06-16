# Chương 7: n-step Bootstrapping — Câu hỏi trả lời ngắn

> Bộ câu hỏi trả lời ngắn (short-answer) ôn tập Chương 7, sách *Reinforcement Learning: An Introduction* (Sutton & Barto, 2nd ed.). Đáp án tham khảo dùng cho việc LLM chấm điểm.

## 7.1 n-step TD Prediction

**Câu 1.** Viết công thức n-step return `G_{t:t+n}` cho bài toán prediction (ước lượng `v_π`). Mỗi thành phần trong công thức đóng vai trò gì, và khi nào `G_{t:t+n}` trở thành full return `G_t`?

<details>
<summary>Đáp án tham khảo</summary>

n-step return là `G_{t:t+n} = R_{t+1} + γR_{t+2} + ... + γ^{n-1} R_{t+n} + γ^n V_{t+n-1}(S_{t+n})` (công thức 7.1), với `n ≥ 1` và `0 ≤ t < T − n`. Phần `n` phần thưởng thực được tích lũy (đã chiết khấu), còn số hạng cuối `γ^n V_{t+n-1}(S_{t+n})` là phần bootstrapping, đóng vai trò hiệu chỉnh (correct) cho các phần thưởng còn thiếu sau bước `t+n`. Nếu `t + n ≥ T` (n-step return chạm hoặc vượt điểm kết thúc) thì các số hạng thiếu coi như bằng 0 và `G_{t:t+n} = G_t`, tức trở thành full return thông thường.

</details>

**Câu 2.** Vì sao n-step TD được mô tả là một "spectrum" (phổ) nằm giữa Monte Carlo và TD(0)? Hai đầu cực của phổ này là gì?

<details>
<summary>Đáp án tham khảo</summary>

n-step methods cập nhật dựa trên một số phần thưởng trung gian: nhiều hơn một nhưng ít hơn toàn bộ tới khi kết thúc episode. Khi `n = 1` ta có one-step TD (TD(0)) — bootstrapping ngay sau một bước; khi `n → ∞` (tới khi termination) ta có Monte Carlo — dùng toàn bộ chuỗi reward, không bootstrapping. Các giá trị `n` trung gian nằm giữa hai cực này, và thường các phương pháp trung gian (intermediate `n`) cho hiệu năng tốt hơn cả hai đầu cực, như minh họa trên random walk 19 trạng thái.

</details>

**Câu 3.** "Error reduction property" của n-step return phát biểu điều gì? Tại sao tính chất này quan trọng?

<details>
<summary>Đáp án tham khảo</summary>

Error reduction property nói rằng kỳ vọng của n-step return là một ước lượng cho `v_π` tốt hơn (hoặc bằng) `V_{t+n-1}` theo nghĩa worst-state: sai số tệ nhất của expected n-step return không vượt quá `γ^n` lần sai số tệ nhất của `V_{t+n-1}` (công thức 7.3), với mọi `n ≥ 1`. Tính chất này quan trọng vì nhờ nó người ta chứng minh được tất cả n-step TD methods hội tụ về dự đoán đúng dưới các điều kiện kỹ thuật phù hợp, nên n-step TD là một họ phương pháp "sound" với TD(0) và Monte Carlo là hai thành viên cực biên.

</details>

## 7.2 n-step Sarsa

**Câu 4.** n-step Sarsa khác n-step TD prediction ở điểm cốt lõi nào? Viết n-step return của n-step Sarsa.

<details>
<summary>Đáp án tham khảo</summary>

Ý chính là chuyển từ trạng thái (states) sang cặp trạng thái–hành động (state–action pairs) và dùng chính sách ε-greedy để có một on-policy TD control method. n-step return được định nghĩa lại theo action values: `G_{t:t+n} = R_{t+1} + γR_{t+2} + ... + γ^{n-1} R_{t+n} + γ^n Q_{t+n-1}(S_{t+n}, A_{t+n})` (công thức 7.4), với `G_{t:t+n} = G_t` nếu `t + n ≥ T`. Cập nhật là `Q_{t+n}(S_t, A_t) = Q_{t+n-1}(S_t, A_t) + α[G_{t:t+n} − Q_{t+n-1}(S_t, A_t)]` (7.5).

</details>

**Câu 5.** Trong ví dụ gridworld (Figure 7.4), vì sao n-step Sarsa tăng tốc học chính sách so với one-step Sarsa? n-step Expected Sarsa khác n-step Sarsa thế nào?

<details>
<summary>Đáp án tham khảo</summary>

Sau một episode kết thúc tại ô phần thưởng cao G, one-step Sarsa chỉ tăng cường (strengthen) đúng action cuối cùng dẫn tới phần thưởng, còn n-step Sarsa tăng cường `n` action cuối của chuỗi, nên học được nhiều hơn nhiều chỉ từ một episode. n-step Expected Sarsa dùng cùng công thức cập nhật như n-step Sarsa nhưng thay phần tử cuối bằng expected approximate value `V̄_{t+n-1}(S_{t+n}) = Σ_a π(a|s) Q(s,a)` (công thức 7.7, 7.8) — tức là branch trên mọi action có thể với trọng số là xác suất dưới `π`, thay vì lấy mẫu một action.

</details>

## 7.3 n-step Off-policy Learning

**Câu 6.** Trong off-policy n-step TD, importance sampling ratio `ρ_{t:t+n-1}` được dùng thế nào và được tính ra sao? Khi nào nó bằng 1?

<details>
<summary>Đáp án tham khảo</summary>

Off-policy n-step TD đơn giản nhân số hạng cập nhật với importance sampling ratio: `V_{t+n}(S_t) = V_{t+n-1}(S_t) + αρ_{t:t+n-1}[G_{t:t+n} − V_{t+n-1}(S_t)]` (công thức 7.9). `ρ_{t:h} = Π_{k=t}^{min(h,T-1)} π(A_k|S_k)/b(A_k|S_k)` (7.10) là xác suất tương đối dưới hai chính sách của việc chọn `n` action từ `A_t` đến `A_{t+n-1}`. Nếu `π(A_k|S_k) = 0` cho một action nào đó thì return bị gán trọng số 0 (bỏ qua hoàn toàn); nếu action được `π` ưa thích hơn `b` thì trọng số tăng lên để bù. Khi `π = b` (on-policy), `ρ` luôn bằng 1, nên công thức này tổng quát hóa và thay thế được hoàn toàn n-step TD on-policy.

</details>

**Câu 7.** Trong off-policy n-step Sarsa, vì sao importance sampling ratio bắt đầu và kết thúc trễ hơn một bước (`ρ_{t+1:t+n}`) so với n-step TD? Và off-policy n-step Expected Sarsa khác ở đâu?

<details>
<summary>Đáp án tham khảo</summary>

Off-policy n-step Sarsa dùng `Q_{t+n}(S_t,A_t) = Q_{t+n-1}(S_t,A_t) + αρ_{t+1:t+n}[G_{t:t+n} − Q_{t+n-1}(S_t,A_t)]` (7.11). Ratio bắt đầu và kết thúc trễ một bước vì ta đang cập nhật một cặp state–action: action `A_t` đã được chọn rồi nên không cần quan tâm xác suất chọn nó; ta muốn học đầy đủ từ những gì xảy ra, chỉ áp importance sampling cho các action tiếp theo. Off-policy n-step Expected Sarsa dùng cùng cập nhật nhưng ratio có ít hơn một thừa số (`ρ_{t+1:t+n-1}`) và dùng Expected Sarsa return (7.7), vì ở trạng thái cuối mọi action đã được tính kỳ vọng nên action thực sự được chọn không cần hiệu chỉnh.

</details>

## 7.4 Per-decision Methods with Control Variates

**Câu 8.** Control variate là gì trong off-policy n-step return cho state values, và vì sao nó giúp giảm variance mà không làm lệch kỳ vọng của cập nhật?

<details>
<summary>Đáp án tham khảo</summary>

Off-policy n-step return dạng đệ quy với control variate: `G_{t:h} = ρ_t(R_{t+1} + γG_{t+1:h}) + (1 − ρ_t)V_{h-1}(S_t)` (công thức 7.13). Số hạng thứ hai `(1 − ρ_t)V_{h-1}(S_t)` được gọi là control variate. Lợi ích: khi `ρ_t = 0`, thay vì target bị kéo về 0 (gây variance cao và làm ước lượng co lại), target bằng đúng ước lượng hiện tại nên không gây thay đổi — phù hợp vì ratio 0 nghĩa là nên bỏ qua mẫu. Control variate không làm lệch kỳ vọng cập nhật vì importance sampling ratio có kỳ vọng bằng 1 và không tương quan với ước lượng, nên kỳ vọng của control variate bằng 0. Định nghĩa này là tổng quát hóa chặt chẽ của on-policy n-step return (7.1) (trùng nhau khi `ρ_t` luôn bằng 1).

</details>

## 7.5 Off-policy Learning Without Importance Sampling: n-step Tree Backup

**Câu 9.** Ý tưởng cốt lõi của n-step Tree Backup là gì, và vì sao nó cho phép off-policy learning mà KHÔNG cần importance sampling? Các leaf node đóng góp vào target với trọng số nào?

<details>
<summary>Đáp án tham khảo</summary>

Tree-backup cập nhật từ toàn bộ "cây" giá trị action ước lượng: ngoài các reward dọc theo spine và giá trị node cuối, target còn bao gồm giá trị ước lượng của các "dangling" action node (các action KHÔNG được chọn) ở mọi tầng. Vì các action không được chọn không có dữ liệu mẫu nên ta bootstrap dùng ước lượng của chúng — đây là lý do không cần importance sampling (giống cách Q-learning và Expected Sarsa làm ở one-step). Mỗi leaf node đóng góp với trọng số tỉ lệ xác suất xuất hiện dưới target policy `π`: action tầng một có trọng số `π(a|S_{t+1})` (riêng action thực sự được chọn `A_{t+1}` thì không đóng góp trực tiếp, mà xác suất `π(A_{t+1}|S_{t+1})` được dùng để nhân trọng số cho các tầng sâu hơn). Tree-backup return định nghĩa đệ quy: `G_{t:t+n} = R_{t+1} + γ Σ_{a≠A_{t+1}} π(a|S_{t+1})Q_{t+n-1}(S_{t+1},a) + γ π(A_{t+1}|S_{t+1}) G_{t+1:t+n}` (7.16).

</details>

## 7.6 A Unifying Algorithm: n-step Q(σ)

**Câu 10.** n-step Q(σ) hợp nhất (unify) những thuật toán nào? Tham số σ_t đại diện cho điều gì, và các giá trị σ cụ thể cho ra thuật toán nào?

<details>
<summary>Đáp án tham khảo</summary>

n-step Q(σ) hợp nhất n-step Sarsa, n-step Tree Backup và n-step Expected Sarsa. `σ_t ∈ [0,1]` là mức độ lấy mẫu (degree of sampling) ở bước `t`, có thể đặt theo trạng thái/hành động: `σ = 1` nghĩa là lấy mẫu đầy đủ (sample, như Sarsa), `σ = 0` nghĩa là dùng kỳ vọng thuần (expectation, như Tree Backup). Nếu luôn chọn `σ = 1` ta được Sarsa; luôn `σ = 0` ta được Tree Backup; lấy mẫu mọi bước trừ bước cuối thì được Expected Sarsa; và còn nhiều khả năng trung gian khác (biến thiên liên tục giữa sampling và expectation). Công thức (7.17) trượt tuyến tính giữa hai trường hợp bằng cách kết hợp `σ_{t+1}ρ_{t+1} + (1 − σ_{t+1})π(A_{t+1}|S_{t+1})`. Như tóm tắt ở 7.7, Q(σ) tổng quát hóa cả Expected Sarsa và Q-learning.

</details>

## 7.7 Summary

**Câu 11.** Tóm tắt chương nêu những nhược điểm (drawbacks) chung của n-step methods và hai cách tiếp cận off-policy đã trình bày. So sánh ưu/nhược của hai cách đó.

<details>
<summary>Đáp án tham khảo</summary>

Nhược điểm chung của n-step methods: phải trễ `n` bước trước khi cập nhật (vì chỉ khi đó mới biết đủ các sự kiện tương lai cần thiết), tốn nhiều tính toán hơn mỗi bước, và cần nhiều bộ nhớ hơn để lưu states/actions/rewards trong `n` bước gần nhất (Chương 12 sẽ giảm chi phí này bằng eligibility traces). Hai cách tiếp cận off-policy: (1) dựa trên importance sampling — đơn giản về mặt khái niệm nhưng variance cao, nếu target và behavior policy rất khác nhau thì cần thêm ý tưởng thuật toán mới để hiệu quả; (2) dựa trên tree-backup — là mở rộng tự nhiên của Q-learning sang trường hợp multi-step với target policy ngẫu nhiên, không dùng importance sampling, nhưng nếu hai policy khác nhau nhiều thì bootstrapping có thể chỉ trải vài bước dù `n` lớn. Lợi ích lớn của n-step methods so với eligibility traces là sự rõ ràng về khái niệm (conceptual clarity).

</details>
