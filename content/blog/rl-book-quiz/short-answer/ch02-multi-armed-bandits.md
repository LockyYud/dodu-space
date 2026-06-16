# Chương 2: Multi-armed Bandits — Câu hỏi trả lời ngắn

> Bộ câu hỏi trả lời ngắn (short-answer) ôn tập Chương 2, sách *Reinforcement Learning: An Introduction* (Sutton & Barto, 2nd ed.). Đáp án tham khảo dùng cho việc LLM chấm điểm.

## 2.1 A k-armed Bandit Problem

**Câu 1.** Phân biệt evaluative feedback và instructive feedback. Đặc điểm nào của evaluative feedback tạo ra nhu cầu exploration?

<details>
<summary>Đáp án tham khảo</summary>

Evaluative feedback đánh giá action đã chọn tốt như thế nào nhưng không cho biết action đó có phải là tốt nhất hay tệ nhất hay không; nó phụ thuộc hoàn toàn vào action đã chọn. Instructive feedback chỉ ra action đúng cần thực hiện, độc lập với action đã chọn (đây là cơ sở của supervised learning). Vì evaluative feedback không nói cho ta biết action nào là tốt nhất, ta cần chủ động exploration để tìm kiếm behavior tốt.

</details>

**Câu 2.** Định nghĩa value q*(a) của một action trong bài toán k-armed bandit, và viết công thức. Phân biệt q*(a) với Qt(a).

<details>
<summary>Đáp án tham khảo</summary>

Value của action a là expected (mean) reward khi chọn a: q*(a) = E[Rt | At = a]. Đây là giá trị thật nhưng không biết chắc chắn. Qt(a) là estimated value (ước lượng) của action a tại time step t; ta mong muốn Qt(a) tiến gần tới q*(a). Nếu biết chính xác mọi q*(a) thì bài toán trở nên tầm thường: luôn chọn action có value cao nhất.

</details>

**Câu 3.** Giải thích khái niệm exploration và exploitation, và tại sao tồn tại "conflict" giữa chúng. Khi nào exploration đem lại total reward cao hơn?

<details>
<summary>Đáp án tham khảo</summary>

Greedy actions là những action có estimated value lớn nhất; chọn chúng gọi là exploitation (khai thác tri thức hiện có để tối đa immediate reward). Chọn một nongreedy action gọi là exploration, giúp cải thiện estimate của action đó. Conflict nằm ở chỗ trong một lần chọn không thể vừa explore vừa exploit. Exploration tối ưu cho total reward dài hạn khi còn nhiều time step phía trước và các nongreedy action có estimate gần bằng nhưng độ uncertainty lớn — ta chịu lỗ ngắn hạn để phát hiện action tốt hơn rồi khai thác nhiều lần về sau.

</details>

## 2.2 Action-value Methods

**Câu 4.** Mô tả sample-average method để ước lượng action value và viết công thức. Tại sao Qt(a) hội tụ về q*(a)?

<details>
<summary>Đáp án tham khảo</summary>

Sample-average ước lượng value bằng trung bình các reward thực nhận được khi chọn action đó: Qt(a) = (tổng reward khi a được chọn trước t) / (số lần a được chọn trước t). Nếu mẫu số bằng 0 thì gán giá trị mặc định (ví dụ 0). Khi số lần chọn a tiến tới vô hạn, theo law of large numbers, Qt(a) hội tụ về q*(a). Gọi là sample-average vì mỗi estimate là trung bình mẫu các reward liên quan.

</details>

**Câu 5.** So sánh greedy action selection và epsilon-greedy. Viết quy tắc greedy bằng argmax và nêu lợi thế tiệm cận (asymptotic) của epsilon-greedy.

<details>
<summary>Đáp án tham khảo</summary>

Greedy luôn chọn action có estimated value cao nhất: At = argmax_a Qt(a) (ties phá vỡ tùy ý); nó luôn exploit và không bao giờ sampling action có vẻ kém. Epsilon-greedy hầu hết thời gian hành xử greedy nhưng với xác suất nhỏ epsilon chọn ngẫu nhiên đều trong tất cả các action, độc lập với action-value estimate. Lợi thế tiệm cận: khi số step tăng tới vô hạn, mọi action được sampling vô hạn lần, đảm bảo mọi Qt(a) hội tụ về q*(a), và xác suất chọn optimal action hội tụ tới lớn hơn 1 - epsilon.

</details>

## 2.3 The 10-armed Testbed

**Câu 6.** Mô tả thiết lập của 10-armed testbed (cách sinh q*(a), cách sinh reward, số run). Kết quả so sánh greedy với epsilon-greedy cho thấy điều gì?

<details>
<summary>Đáp án tham khảo</summary>

10-armed testbed gồm 2000 bài toán bandit ngẫu nhiên với k = 10; mỗi q*(a) được sinh theo phân phối normal mean 0, variance 1, còn reward Rt được sinh theo normal mean q*(At), variance 1. Mỗi phương pháp chạy 1000 step mỗi bài, lấy trung bình qua 2000 run. Kết quả: greedy cải thiện nhanh hơn lúc đầu nhưng chững lại ở mức thấp (~1 reward/step so với tối ưu ~1.54) vì thường mắc kẹt ở suboptimal action (chỉ tìm ra optimal trong khoảng 1/3 số bài). Các epsilon-greedy explore tiếp nên về dài hạn tốt hơn; epsilon=0.1 tìm optimal sớm hơn nhưng chỉ chọn nó tối đa ~91% thời gian, còn epsilon=0.01 cải thiện chậm hơn nhưng cuối cùng vượt epsilon=0.1.

</details>

**Câu 7.** Lợi thế của epsilon-greedy so với greedy phụ thuộc vào task như thế nào? Nêu trường hợp greedy có thể tốt hơn và trường hợp exploration là bắt buộc.

<details>
<summary>Đáp án tham khảo</summary>

Khi reward variance lớn hơn (nhiễu nhiều), cần explore nhiều hơn nên epsilon-greedy càng vượt trội. Nếu reward variance bằng 0 (deterministic), greedy biết value thật sau khi thử mỗi action một lần và có thể tốt nhất vì tìm optimal ngay rồi không phí thời gian explore. Tuy nhiên nếu task là nonstationary (true value thay đổi theo thời gian), exploration là bắt buộc ngay cả trong trường hợp deterministic, để kiểm tra xem một nongreedy action có trở nên tốt hơn greedy action hay không. Nonstationarity là trường hợp phổ biến nhất trong reinforcement learning.

</details>

## 2.4 Incremental Implementation

**Câu 8.** Viết incremental update rule để cập nhật sample average và giải thích tại sao nó hiệu quả về bộ nhớ/tính toán. Mô tả dạng tổng quát NewEstimate = OldEstimate + StepSize[Target - OldEstimate].

<details>
<summary>Đáp án tham khảo</summary>

Quy tắc: Q_{n+1} = Q_n + (1/n)[R_n - Q_n]. Thay vì lưu toàn bộ reward và tính lại tổng (bộ nhớ và tính toán tăng theo thời gian), công thức này chỉ cần lưu Q_n và n, với tính toán hằng số mỗi step. Dạng tổng quát: NewEstimate = OldEstimate + StepSize[Target - OldEstimate], trong đó [Target - OldEstimate] là error của estimate, được giảm bằng cách bước một bước về phía Target. Ở đây Target là reward thứ n (R_n) và step-size là 1/n.

</details>

## 2.5 Tracking a Nonstationary Problem

**Câu 9.** Tại sao constant step-size phù hợp với bài toán nonstationary? Viết công thức cập nhật và giải thích ý nghĩa "exponential recency-weighted average".

<details>
<summary>Đáp án tham khảo</summary>

Trong môi trường nonstationary nên gán trọng số lớn hơn cho reward gần đây. Constant step-size: Q_{n+1} = Q_n + alpha[R_n - Q_n] với alpha thuộc (0,1]. Khai triển cho thấy Q_{n+1} là weighted average của các reward quá khứ và estimate ban đầu Q_1, với trọng số gán cho R_i là alpha(1-alpha)^{n-i}. Vì (1-alpha) < 1, trọng số giảm dần (theo cấp số nhân) khi reward càng cũ, nên gọi là exponential recency-weighted average; tổng các trọng số bằng 1.

</details>

**Câu 10.** Nêu hai điều kiện hội tụ (with probability 1) cho dãy step-size {alpha_n(a)} trong stochastic approximation. Sample-average và constant step-size thỏa mãn các điều kiện này thế nào?

<details>
<summary>Đáp án tham khảo</summary>

Hai điều kiện: (1) tổng vô hạn của alpha_n(a) bằng vô cực — đảm bảo các bước đủ lớn để vượt qua điều kiện ban đầu và dao động ngẫu nhiên; (2) tổng vô hạn của alpha_n(a)^2 hữu hạn — đảm bảo các bước cuối cùng đủ nhỏ để hội tụ. Sample-average (alpha_n = 1/n) thỏa mãn cả hai. Constant step-size (alpha_n = alpha) chỉ thỏa điều kiện thứ nhất, không thỏa điều kiện thứ hai, nên estimate không bao giờ hội tụ hoàn toàn mà tiếp tục dao động theo các reward gần đây nhất — điều này đúng là mong muốn trong môi trường nonstationary.

</details>

## 2.6 Optimistic Initial Values

**Câu 11.** Optimistic initial values khuyến khích exploration như thế nào? Nêu một nhược điểm chính của kỹ thuật này.

<details>
<summary>Đáp án tham khảo</summary>

Đặt initial value cao một cách "lạc quan" (ví dụ +5 khi q*(a) có mean 0). Bất kỳ action nào được chọn đầu tiên cũng cho reward thấp hơn estimate ban đầu, khiến learner "thất vọng" và chuyển sang action khác; kết quả là mọi action được thử vài lần trước khi estimate hội tụ, tạo ra exploration đáng kể ngay cả khi luôn hành xử greedy. Nhược điểm: nó chỉ là một thủ thuật cho stationary problem; drive cho exploration chỉ mang tính tạm thời (xảy ra một lần ở đầu), nên không phù hợp với nonstationary problem — nếu task thay đổi và cần explore lại thì phương pháp này không giúp được. Mọi method tập trung vào initial condition đều khó giúp trong trường hợp nonstationary.

</details>

## 2.7 Upper-Confidence-Bound Action Selection

**Câu 12.** Viết công thức UCB action selection và giải thích vai trò của từng thành phần (số hạng căn bậc hai, Nt(a), ln t, tham số c). UCB cải thiện điểm yếu nào của epsilon-greedy?

<details>
<summary>Đáp án tham khảo</summary>

UCB: At = argmax_a [ Qt(a) + c * sqrt( ln(t) / Nt(a) ) ]. Số hạng căn là thước đo uncertainty/variance trong estimate value của a, nên đại lượng được max là một loại upper bound của true value; c > 0 điều khiển mức độ exploration (confidence level). Nt(a) là số lần a đã được chọn: mỗi lần chọn a thì Nt(a) tăng làm uncertainty giảm; khi chọn action khác thì t tăng (ở tử số) làm uncertainty của a tăng. ln t khiến mức tăng nhỏ dần theo thời gian nhưng không bị chặn, nên mọi action cuối cùng đều được chọn nhưng action có value thấp hoặc đã chọn nhiều sẽ được chọn ngày càng ít. Khác epsilon-greedy chọn nongreedy action một cách bừa bãi, UCB ưu tiên action vừa gần optimal vừa có uncertainty cao. Nếu Nt(a) = 0 thì a được coi là maximizing action.

</details>

## 2.8 Gradient Bandit Algorithms

**Câu 13.** Gradient bandit học gì thay cho action value? Viết công thức softmax (Boltzmann) cho xác suất chọn action và nêu tính chất bất biến của preference.

<details>
<summary>Đáp án tham khảo</summary>

Gradient bandit học một numerical preference Ht(a) cho mỗi action, không phải action value; preference không có ý nghĩa về mặt reward, chỉ relative preference giữa các action mới quan trọng (cộng cùng một hằng số vào tất cả preference không thay đổi xác suất). Xác suất chọn action theo phân phối soft-max (Gibbs/Boltzmann): Pr{At = a} = exp(Ht(a)) / sum_b exp(Ht(b)) = pi_t(a). Ban đầu mọi preference bằng nhau (ví dụ H1(a) = 0) nên mọi action có xác suất chọn bằng nhau.

</details>

**Câu 14.** Viết update rule của gradient bandit (cho action được chọn và không được chọn) và giải thích vai trò của baseline R̄t. Việc bỏ baseline ảnh hưởng thế nào?

<details>
<summary>Đáp án tham khảo</summary>

Update (stochastic gradient ascent):
- Cho action được chọn: H_{t+1}(At) = Ht(At) + alpha (Rt - R̄t)(1 - pi_t(At)).
- Cho a != At: H_{t+1}(a) = Ht(a) - alpha (Rt - R̄t) pi_t(a).

R̄t là baseline, trung bình các reward tới (không kể) thời điểm t, tính incremental. Nếu reward cao hơn baseline thì xác suất chọn At trong tương lai tăng, thấp hơn baseline thì giảm; các action không được chọn dịch theo hướng ngược lại. Baseline không ảnh hưởng tới expected update (thuật toán vẫn là instance của stochastic gradient ascent với baseline bất kỳ không phụ thuộc action), nhưng nó ảnh hưởng tới variance của update và do đó tốc độ hội tụ. Nếu bỏ baseline (đặt R̄t = 0), hiệu năng suy giảm đáng kể, ví dụ khi dịch toàn bộ reward lên +4 thì có baseline vẫn ổn định còn không baseline thì kém hẳn.

</details>

## 2.9 Associative Search (Contextual Bandits)

**Câu 15.** Associative search (contextual bandits) khác bài toán k-armed bandit nonassociative ở điểm nào? Tại sao nó nằm trung gian giữa bandit và full reinforcement learning?

<details>
<summary>Đáp án tham khảo</summary>

Trong nonassociative task không cần gắn action khác nhau với situation khác nhau (chỉ tìm một best action, hoặc track best action khi nonstationary). Associative search có nhiều situation, và mỗi step ta nhận một distinctive clue (ví dụ màu hiển thị của slot machine) báo hiệu task hiện tại, nên ta học một policy: ánh xạ từ situation sang best action cho situation đó. Nó trung gian vì giống full RL ở chỗ phải học policy, nhưng giống k-armed bandit ở chỗ mỗi action chỉ ảnh hưởng tới immediate reward. Nếu action còn ảnh hưởng tới situation kế tiếp thì đó là full reinforcement learning problem.

</details>

## 2.10 Summary

**Câu 16.** Tóm tắt cách mỗi phương pháp (epsilon-greedy, UCB, gradient bandit, optimistic initial values) đạt được exploration. Parameter study cho thấy đặc điểm chung gì và phương pháp nào tốt nhất trên 10-armed testbed?

<details>
<summary>Đáp án tham khảo</summary>

- Epsilon-greedy: chọn ngẫu nhiên một tỷ lệ nhỏ thời gian.
- UCB: chọn deterministic nhưng explore bằng cách ngầm ưu tiên các action có ít sample hơn.
- Gradient bandit: ước lượng action preference (không phải value) và ưu tiên action được preferred theo kiểu xác suất, graded, qua soft-max.
- Optimistic initial values: khởi tạo estimate lạc quan khiến cả greedy method cũng explore đáng kể.

Parameter study vẽ average reward trên 1000 step như hàm của parameter (epsilon, alpha, c, Q0) trên thang log. Mọi thuật toán có dạng inverted-U: đạt tốt nhất ở giá trị parameter trung bình, không quá lớn cũng không quá nhỏ, và đều khá ít nhạy với parameter (hoạt động tốt trong khoảng khoảng một order of magnitude). Tổng thể, trên bài toán này UCB có vẻ hoạt động tốt nhất.

</details>
