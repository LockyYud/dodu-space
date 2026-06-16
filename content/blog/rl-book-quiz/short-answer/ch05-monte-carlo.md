# Chương 5: Monte Carlo Methods — Câu hỏi trả lời ngắn

> Bộ câu hỏi trả lời ngắn (short-answer) ôn tập Chương 5, sách *Reinforcement Learning: An Introduction* (Sutton & Barto, 2nd ed.). Đáp án tham khảo dùng cho việc LLM chấm điểm.

## 5.1 Monte Carlo Prediction

**Câu 1.** Điểm cốt lõi khiến Monte Carlo methods khác với dynamic programming (DP) là gì, và "experience" mà chúng cần ở đây nghĩa là gì?

<details>
<summary>Đáp án tham khảo</summary>

Monte Carlo methods học value functions và optimal policies chỉ từ *experience* — tức các chuỗi mẫu (sample) gồm states, actions, rewards thu được từ tương tác thật hoặc mô phỏng với environment. Chúng KHÔNG cần model đầy đủ (không cần biết phân phối xác suất chuyển trạng thái p như DP yêu cầu); nếu dùng simulation thì model chỉ cần sinh sample transitions chứ không cần phân phối đầy đủ. Ý tưởng nền tảng: value của một state là expected return, nên ta ước lượng nó bằng cách trung bình (average) các returns quan sát được sau khi ghé thăm state đó. Monte Carlo chỉ định nghĩa cho episodic tasks và chỉ cập nhật khi episode kết thúc.

</details>

**Câu 2.** Phân biệt first-visit MC và every-visit MC khi ước lượng \(v_\pi(s)\). Nêu một đặc tính thống kê của first-visit MC.

<details>
<summary>Đáp án tham khảo</summary>

Một "visit" tới s là một lần s xuất hiện trong episode; "first visit" là lần đầu tiên s xuất hiện trong episode đó. First-visit MC ước lượng \(v_\pi(s)\) bằng trung bình các returns đi sau *lần đầu* ghé thăm s trong mỗi episode. Every-visit MC trung bình các returns đi sau *mọi* lần ghé thăm s. Với first-visit MC, mỗi return là một ước lượng độc lập, cùng phân phối (i.i.d.) của \(v_\pi(s)\) với phương sai hữu hạn; theo luật số lớn (law of large numbers) trung bình hội tụ về giá trị kỳ vọng, mỗi trung bình là ước lượng không chệch (unbiased) và độ lệch chuẩn của sai số giảm theo \(1/\sqrt{n}\). Cả hai đều hội tụ về \(v_\pi(s)\) khi số lần thăm tiến tới vô cùng.

</details>

**Câu 3.** Vì sao nói Monte Carlo methods "không bootstrap", và điều đó đem lại lợi thế tính toán gì khi ta chỉ quan tâm tới một số ít states?

<details>
<summary>Đáp án tham khảo</summary>

Trong MC, ước lượng value của mỗi state là độc lập: ước lượng của một state không được xây dựng dựa trên ước lượng của state khác (khác với DP). Tức MC không bootstrap. Hệ quả: chi phí tính toán để ước lượng value của một state là độc lập với tổng số states. Vì vậy ta có thể sinh nhiều episodes bắt đầu từ chính các states quan tâm và chỉ trung bình returns của những states đó, bỏ qua tất cả states còn lại — đây là một lợi thế lớn so với DP khi chỉ cần value của một state hoặc một tập con states.

</details>

## 5.2 Monte Carlo Estimation of Action Values

**Câu 4.** Khi không có model, vì sao cần ước lượng action values \(q_\pi(s,a)\) thay vì chỉ state values \(v_\pi(s)\)?

<details>
<summary>Đáp án tham khảo</summary>

Khi có model, chỉ cần state values là đủ để xác định policy: nhìn trước một bước rồi chọn action dẫn tới tổ hợp tốt nhất giữa reward và next state. Khi KHÔNG có model, state values không đủ — ta không thể thực hiện bước nhìn trước đó. Phải ước lượng tường minh value của từng action để value mới hữu ích cho việc gợi ý policy. Do đó một mục tiêu chính của MC là ước lượng \(q_*\); ta dùng first-visit/every-visit MC trên các state–action pairs (một pair được "visited" nếu trong episode s được thăm và a được chọn).

</details>

**Câu 5.** Vấn đề "maintaining exploration" trong ước lượng action values là gì, và exploring starts giải quyết nó ra sao?

<details>
<summary>Đáp án tham khảo</summary>

Nếu \(\pi\) là deterministic policy thì khi đi theo \(\pi\) ta chỉ quan sát được returns cho đúng một action ở mỗi state; nhiều state–action pairs không bao giờ được thăm nên ước lượng của chúng không cải thiện. Đây là vấn đề duy trì exploration: muốn so sánh các action ta cần ước lượng value của *mọi* action ở mỗi state. Exploring starts là giả định rằng mỗi episode bắt đầu từ một state–action pair, và mọi pair có xác suất khác 0 được chọn làm điểm xuất phát. Điều này đảm bảo mọi state–action pair được thăm vô số lần trong giới hạn vô số episodes. Nhược điểm: không đáng tin cậy nói chung, đặc biệt khi học trực tiếp từ tương tác thật.

</details>

## 5.3 Monte Carlo Control

**Câu 6.** Monte Carlo control áp dụng generalized policy iteration (GPI) như thế nào, và policy improvement được thực hiện ra sao mà không cần model?

<details>
<summary>Đáp án tham khảo</summary>

MC control theo schema GPI: duy trì đồng thời một approximate policy và một approximate value function; value function được cập nhật để xấp xỉ giá trị của policy hiện tại (policy evaluation bằng trung bình returns), còn policy được cải thiện greedy theo value function hiện tại. Vì ta làm việc với action-value function \(q\), policy improvement chỉ cần lấy greedy policy \(\pi(s) = \arg\max_a q(s,a)\) — KHÔNG cần model để dựng greedy policy. Policy improvement theorem đảm bảo mỗi \(\pi_{k+1}\) tốt hơn hoặc bằng \(\pi_k\), nên quá trình hội tụ về optimal policy và optimal value function.

</details>

**Câu 7.** Monte Carlo ES dựa trên hai giả định "khó tin" nào, và cuốn sách xử lý giả định về số lượng episodes như thế nào?

<details>
<summary>Đáp án tham khảo</summary>

Hai giả định: (1) episodes có exploring starts, và (2) policy evaluation được thực hiện với vô hạn số episodes (để \(q_{\pi_k}\) được tính chính xác). Để có thuật toán thực dụng phải bỏ cả hai. Với giả định vô hạn episodes, sách không cố hoàn tất policy evaluation trước khi cải thiện policy; thay vào đó theo tinh thần GPI, mỗi episode chỉ dịch value function tiến về phía \(q_{\pi_k}\). Cụ thể Monte Carlo ES luân phiên evaluation và improvement trên cơ sở từng episode: sau mỗi episode dùng returns quan sát được để cập nhật \(Q\), rồi cải thiện policy thành greedy tại mọi state đã thăm.

</details>

## 5.4 Monte Carlo Control without Exploring Starts

**Câu 8.** Phân biệt on-policy và off-policy methods. \(\varepsilon\)-soft và \(\varepsilon\)-greedy policies là gì?

<details>
<summary>Đáp án tham khảo</summary>

On-policy methods đánh giá hoặc cải thiện chính policy được dùng để ra quyết định (sinh dữ liệu). Off-policy methods đánh giá/cải thiện một policy *khác* với policy dùng để sinh dữ liệu. Để bỏ exploring starts mà vẫn đảm bảo mọi action được chọn vô số lần, on-policy dùng soft policies: \(\pi(a|s) > 0\) cho mọi s, a, nhưng dần dịch về deterministic optimal. Một \(\varepsilon\)-soft policy thỏa \(\pi(a|s) \ge \varepsilon/|A(s)|\) cho mọi state, action. Một \(\varepsilon\)-greedy policy là trường hợp đặc biệt: phần lớn thời gian chọn action có action value lớn nhất, nhưng với xác suất \(\varepsilon\) chọn ngẫu nhiên — action greedy nhận xác suất \(1-\varepsilon+\varepsilon/|A(s)|\), các action khác nhận \(\varepsilon/|A(s)|\). \(\varepsilon\)-greedy là các \(\varepsilon\)-soft policy gần greedy nhất.

</details>

**Câu 9.** Trong on-policy MC control không có exploring starts, vì sao ta chỉ dịch policy về \(\varepsilon\)-greedy thay vì greedy hoàn toàn, và điều này được bảo đảm bởi đâu?

<details>
<summary>Đáp án tham khảo</summary>

Nếu không có exploring starts mà làm policy greedy hoàn toàn thì sẽ ngăn việc tiếp tục explore các nongreedy actions. GPI không đòi hỏi đi tới greedy policy, chỉ cần dịch *về phía* greedy; nên ta chỉ dịch tới một \(\varepsilon\)-greedy policy. Policy improvement theorem đảm bảo rằng với bất kỳ \(\varepsilon\)-soft policy \(\pi\), policy \(\varepsilon\)-greedy theo \(q_\pi\) tốt hơn hoặc bằng \(\pi\). Đẳng thức (không cải thiện được nữa) chỉ xảy ra khi cả hai đã optimal *trong số các \(\varepsilon\)-soft policies*. Như vậy ta loại bỏ exploring starts, đổi lại chỉ đạt policy tốt nhất trong lớp \(\varepsilon\)-soft policies.

</details>

## 5.5 Off-policy Prediction via Importance Sampling

**Câu 10.** Định nghĩa target policy và behavior policy. "Assumption of coverage" là gì?

<details>
<summary>Đáp án tham khảo</summary>

Trong off-policy learning dùng hai policy: target policy \(\pi\) là policy được học (sẽ trở thành optimal), còn behavior policy \(b\) là policy mang tính explore dùng để sinh hành vi/dữ liệu. Học từ dữ liệu "off" target policy gọi là off-policy learning. Assumption of coverage: mọi action có thể được chọn dưới \(\pi\) cũng phải có xác suất khác 0 dưới \(b\), tức \(\pi(a|s) > 0 \Rightarrow b(a|s) > 0\). Từ coverage suy ra \(b\) phải stochastic ở những state nơi nó khác \(\pi\); còn \(\pi\) có thể deterministic (thường là greedy policy trong control).

</details>

**Câu 11.** Importance-sampling ratio \(\rho_{t:T-1}\) là gì, vì sao nó không phụ thuộc vào động lực (transition probabilities) của MDP, và nó "sửa" returns ra sao?

<details>
<summary>Đáp án tham khảo</summary>

Importance-sampling ratio là tỷ lệ xác suất tương đối của trajectory xảy ra dưới target policy so với behavior policy: \(\rho_{t:T-1} = \prod_{k=t}^{T-1} \frac{\pi(A_k|S_k)}{b(A_k|S_k)}\). Mặc dù xác suất của trajectory có chứa các transition probabilities \(p\) (thường chưa biết), chúng xuất hiện giống hệt ở cả tử và mẫu nên triệt tiêu; do đó ratio chỉ phụ thuộc vào hai policies và chuỗi action/state, không phụ thuộc MDP. Returns \(G_t\) sinh bởi \(b\) có kỳ vọng sai \(E[G_t|S_t=s]=v_b(s)\); nhân với ratio sẽ biến đổi kỳ vọng về đúng target policy: \(E[\rho_{t:T-1} G_t | S_t=s] = v_\pi(s)\).

</details>

**Câu 12.** So sánh ordinary importance sampling và weighted importance sampling về bias và variance. Trong thực tế nên ưu tiên cái nào và vì sao?

<details>
<summary>Đáp án tham khảo</summary>

Cả hai đều scale returns bằng \(\rho\), nhưng ordinary IS lấy trung bình đơn giản (chia cho \(|T(s)|\)), còn weighted IS lấy trung bình có trọng số (chia cho tổng các \(\rho\)). Với first-visit: ordinary IS là *unbiased* nhưng variance nói chung không bị chặn (có thể vô hạn vì variance của ratio có thể vô hạn) và ước lượng có thể cực đoan (ví dụ ratio = 10 thì ước lượng gấp 10 lần return quan sát). Weighted IS là *biased* (bias hội tụ tiệm cận về 0) nhưng trọng số lớn nhất trên bất kỳ return đơn nào là 1, nên variance hữu hạn — thậm chí variance hội tụ về 0 ngay cả khi variance của ratio là vô hạn (với returns bị chặn). Trong thực tế weighted IS thường có variance thấp hơn nhiều và được ưu tiên mạnh; tuy nhiên ordinary IS dễ mở rộng sang function approximation hơn. (Ví dụ 5.5: ordinary IS có thể có variance vô hạn khi trajectory chứa loops.)

</details>

## 5.6 Incremental Implementation

**Câu 13.** Với off-policy MC dùng weighted importance sampling, viết luật cập nhật incremental cho \(V_n\) và giải thích vai trò đại lượng \(C_n\).

<details>
<summary>Đáp án tham khảo</summary>

Với chuỗi returns \(G_1,\dots,G_{n-1}\) cùng các trọng số \(W_i\) (ví dụ \(W_i=\rho_{t_i:T(t_i)-1}\)), ước lượng là \(V_n = \frac{\sum_{k=1}^{n-1} W_k G_k}{\sum_{k=1}^{n-1} W_k}\). Luật incremental: \(V_{n+1} = V_n + \frac{W_n}{C_n}\,[G_n - V_n]\), với \(C_{n+1} = C_n + W_{n+1}\) và \(C_0 = 0\). Ở đây \(C_n\) là tổng tích lũy (cumulative sum) các trọng số đã gán cho \(n\) returns đầu tiên của state đó — nó đóng vai trò mẫu số của trung bình có trọng số, cho phép cập nhật từng episode mà không lưu toàn bộ lịch sử. Với on-policy (\(\pi=b\)) thì \(W\) luôn bằng 1 và công thức trở về trung bình thông thường.

</details>

## 5.7 Off-policy Monte Carlo Control

**Câu 14.** Trong off-policy MC control (weighted IS), behavior policy cần thỏa điều kiện gì, và "learning only from the tails of episodes" là vấn đề gì?

<details>
<summary>Đáp án tham khảo</summary>

Target policy \(\pi\) là greedy theo \(Q\) (deterministic), còn behavior policy \(b\) có thể là bất kỳ soft policy nào (mọi action có xác suất khác 0 ở mọi state) để đảm bảo coverage và để mỗi state–action pair nhận được vô số returns (ví dụ \(b\) là \(\varepsilon\)-soft); khi đó \(\pi\) hội tụ về optimal. Vấn đề: thuật toán chỉ học từ "đuôi" của episode — đoạn mà mọi action còn lại đều greedy (vòng lặp thoát ngay khi gặp action \(A_t \neq \pi(S_t)\)). Nếu nongreedy actions xảy ra thường xuyên thì học rất chậm, đặc biệt với states ở đầu các episode dài. Cách khắc phục quan trọng nhất là kết hợp temporal-difference learning (chương sau).

</details>

## 5.8 Discounting-aware Importance Sampling

**Câu 15.** Discounting-aware importance sampling giải quyết nguồn variance "thừa" nào, và ý tưởng coi discounting như "xác suất kết thúc" hoạt động ra sao?

<details>
<summary>Đáp án tham khảo</summary>

Khi episodes dài và \(\gamma\) nhỏ hơn 1 nhiều (cực đoan \(\gamma=0\): \(G_0=R_1\)), importance-sampling ratio thông thường vẫn là tích của rất nhiều factors (ví dụ 100 factors). Các factors sau reward thứ nhất là độc lập với return và có kỳ vọng 1 — chúng không làm đổi kỳ vọng cập nhật nhưng làm tăng variance khủng khiếp, thậm chí có thể vô hạn. Discounting-aware IS coi discounting như xác định một xác suất kết thúc (degree of partial termination): return được tách thành các *flat partial returns* \(\bar{G}_{t:h}=R_{t+1}+\dots+R_h\), mỗi cái chỉ được scale bằng ratio bị cắt cụt tới horizon tương ứng (\(\rho_{t:h-1}\)). Nhờ vậy giảm variance đáng kể; nếu \(\gamma=1\) thì các estimator này trùng với estimator off-policy thông thường (5.5)/(5.6).

</details>

## 5.9 Per-decision Importance Sampling

**Câu 16.** Per-decision importance sampling khai thác cấu trúc nào của return, và vì sao nó có thể giảm variance ngay cả khi \(\gamma = 1\)?

<details>
<summary>Đáp án tham khảo</summary>

Per-decision IS khai thác việc return là một tổng các rewards. Trong \(\rho_{t:T-1}G_t\), mỗi reward \(R_{t+k}\) bị nhân với toàn bộ ratio \(\rho_{t:T-1}\), nhưng nhiều factors trong đó ứng với các sự kiện *sau* khi reward đó đã được xác định; mỗi factor \(\pi(A_k|S_k)/b(A_k|S_k)\) có kỳ vọng bằng 1 và không ảnh hưởng tới kỳ vọng cập nhật, chỉ làm tăng variance. Có thể chứng minh \(E[\rho_{t:T-1}R_{t+k}] = E[\rho_{t:t+k-1}R_{t+k}]\), nên thay vì scale mỗi reward bằng full ratio, ta chỉ scale bằng ratio tới đúng "decision" của reward đó, được \(\tilde{G}_t = \rho_{t:t}R_{t+1} + \gamma\rho_{t:t+1}R_{t+2} + \dots\). Estimator \(V(s)=\frac{\sum_{t\in T(s)}\tilde{G}_t}{|T(s)|}\) có cùng kỳ vọng unbiased (first-visit) như ordinary IS nhưng kỳ vọng variance thấp hơn — và cơ chế này giảm variance ngay cả khi không discounting (\(\gamma=1\)). Phiên bản per-decision của weighted IS thì chưa rõ và các đề xuất đã biết đều không consistent.

</details>

## 5.10 Summary

**Câu 17.** Tóm tắt các lợi thế chính của Monte Carlo methods so với DP, và hai khác biệt cốt lõi giữa MC và DP.

<details>
<summary>Đáp án tham khảo</summary>

Lợi thế của MC so với DP: (1) học optimal behavior trực tiếp từ tương tác với environment, không cần model động lực; (2) dùng được với simulation/sample models (dễ mô phỏng episode dù khó dựng model xác suất chuyển trạng thái tường minh); (3) dễ và hiệu quả khi tập trung vào một tập con nhỏ states; (4) ít bị tổn hại bởi vi phạm Markov property vì không bootstrap. Hai khác biệt cốt lõi với DP: thứ nhất, MC vận hành trên sample experience nên học được mà không cần model; thứ hai, MC không bootstrap — không cập nhật ước lượng value dựa trên ước lượng value của successor states. Về exploration, MC control xử lý qua exploring starts (on-policy/off-policy là hai cách bỏ giả định này), và off-policy prediction dựa trên importance sampling: ordinary IS thì unbiased nhưng variance lớn (có thể vô hạn), weighted IS thì variance hữu hạn và được ưu tiên trong thực tế.

</details>
