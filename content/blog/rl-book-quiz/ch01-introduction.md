# Chương 1: Introduction — Câu hỏi trắc nghiệm

> Bộ câu hỏi ôn tập chi tiết cho Chương 1, sách *Reinforcement Learning: An Introduction* (Sutton & Barto, 2nd ed.)

## 1.1 Reinforcement Learning

**Câu 1.** Theo định nghĩa trong sách, reinforcement learning về cơ bản là gì?

- A. Học cách phân loại situations thành categories dựa trên labeled examples từ supervisor.
- B. Học cách map situations thành actions để maximize một numerical reward signal thông qua trial-and-error.
- C. Học cấu trúc ẩn trong dữ liệu không nhãn bằng cách tối thiểu hóa prediction error.
- D. Học cách bắt chước hành vi expert thông qua imitation trong môi trường có reward.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — RL là học cách map situations sang actions để maximize numerical reward signal; learner không được bảo phải làm gì mà phải tự khám phá qua thử nghiệm.

</details>

---

**Câu 2.** Hai đặc điểm phân biệt quan trọng nhất của reinforcement learning là gì?

- A. Supervised feedback và generalization từ labeled data.
- B. Trial-and-error search và delayed reward.
- C. Curse of dimensionality và function approximation.
- D. Planning với model và deliberate reasoning về future states.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Hai đặc điểm phân biệt là trial-and-error search và delayed reward (action ảnh hưởng không chỉ immediate reward mà cả situation kế tiếp và reward về sau).

</details>

---

**Câu 3.** Điểm khác biệt cốt lõi giữa RL và supervised learning là gì?

- A. RL học từ kinh nghiệm tương tác, không cần labeled examples chỉ rõ action đúng cho từng situation.
- B. Supervised learning không dùng training data còn RL dùng data thu thập từ environment.
- C. RL tối đa hóa reward còn supervised learning tối thiểu hóa reward signal.
- D. Supervised learning chỉ xử lý subproblems còn RL giải toàn bộ interactive problem.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Trong bài toán tương tác, thường không thực tế để có labeled examples đại diện cho mọi situation; agent phải học từ experience của chính nó, không phải từ external supervisor.

</details>

---

**Câu 4.** Phát biểu nào mô tả đúng exploration–exploitation trade-off?

- A. Agent nên exploit actions tốt nhất đã biết, và chỉ explore khi không còn gì để exploit.
- B. Agent phải kết hợp exploit hành động đã biết hiệu quả và explore hành động mới để tìm lựa chọn tốt hơn.
- C. Exploration và exploitation có thể tối ưu hóa độc lập rồi kết hợp sau mà không mất gì.
- D. Trade-off này là vấn đề đặc thù của supervised learning, không xuất hiện trong RL.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Agent phải exploit để có reward nhưng cũng phải explore để tìm actions tốt hơn. Không thể theo đuổi riêng một trong hai mà thành công; dilemma này không xuất hiện trong supervised/unsupervised learning thuần túy.

</details>

---

**Câu 5.** [Khó] Một agent chỉ exploit mọi lúc có thể gặp vấn đề gì? Một agent chỉ explore mọi lúc có thể gặp vấn đề gì?

- A. Chỉ exploit → bỏ lỡ actions tốt hơn chưa thử; chỉ explore → không bao giờ tận dụng được tri thức đã tích lũy.
- B. Chỉ exploit → hội tụ quá nhanh nên không học được; chỉ explore → mất nhiều thời gian nhưng luôn tìm được optimal policy.
- C. Chỉ exploit → overfit vào environment; chỉ explore → không bao giờ tìm được reward dương.
- D. Chỉ exploit → không có vấn đề gì nếu greedy policy đủ tốt; chỉ explore → chậm nhưng đảm bảo optimal.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Chỉ exploit có thể bị kẹt ở local optimum vì chưa thử actions tốt hơn. Chỉ explore thì thu thập nhiều information nhưng không bao giờ tận dụng nó để nhận reward cao hơn — cả hai đều thất bại ở nhiệm vụ.

</details>

---

## 1.2 Examples

**Câu 6.** Các ví dụ trong mục 1.2 cùng chia sẻ đặc điểm cơ bản nào?

- A. Tất cả đều dựa vào một tập training examples có nhãn được cung cấp trước khi tương tác.
- B. Tất cả đều có agent tích cực tương tác với environment để đạt goal trong điều kiện uncertainty, với actions ảnh hưởng future state.
- C. Tất cả đều cần model hoàn chỉnh của environment để lập kế hoạch trước khi hành động.
- D. Tất cả đều là bài toán one-step decision-making không có delayed consequences.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Điểm chung là active agent tương tác với environment, goal rõ ràng, actions ảnh hưởng future state đòi hỏi tính tới hậu quả gián tiếp, và agent có thể cải thiện qua experience.

</details>

---

**Câu 7.** [Khó] Sách mô tả gazelle calf vừa sinh ra phải đứng dậy đi trong vòng một giờ. Điều này minh họa rõ nhất đặc điểm nào của RL?

- A. Delayed reward — việc đứng dậy thành công sau nhiều lần thất bại thể hiện reward bị trì hoãn.
- B. Tương tác agent–environment: gazelle liên tục nhận feedback từ môi trường vật lý và điều chỉnh để đạt goal thoát khỏi predators.
- C. Model-based planning — gazelle dùng internal model về physics để tính toán sequence of actions tối ưu.
- D. Supervised learning — bản năng di truyền cung cấp labeled examples về cách đứng dậy đúng.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Ví dụ này minh họa tương tác agent–environment có goal (đứng dậy, chạy trốn predators), trong đó agent nhận feedback liên tục và phải điều chỉnh dù uncertain. Đây không phải planning có model, cũng không phải supervised learning.

</details>

---

## 1.3 Elements of Reinforcement Learning

**Câu 8.** Bốn subelements chính của một RL system (ngoài agent và environment) là gì?

- A. State, action, reward, và transition function.
- B. Policy, reward signal, value function, và (tùy chọn) model of the environment.
- C. Exploration rate, learning rate, discount factor, và terminal condition.
- D. Sensor, actuator, controller, và memory buffer.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Bốn subelements: policy, reward signal, value function, và (optionally) model of the environment.

</details>

---

**Câu 9.** Phân biệt đúng giữa reward signal và value function là gì?

- A. Reward chỉ điều tốt tức thời; value chỉ tổng reward kỳ vọng tích lũy lâu dài từ một state.
- B. Reward chỉ điều tốt dài hạn; value chỉ điều tốt tức thời tại mỗi time step.
- C. Reward và value là hai tên gọi khác nhau của cùng một khái niệm trong MDP.
- D. Value được environment cung cấp trực tiếp; reward phải được estimate qua function approximation.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Reward signal chỉ điều tốt trong immediate sense; value function chỉ điều tốt long-term — tổng reward agent kỳ vọng tích lũy từ một state. Một state có thể có reward thấp nhưng value cao và ngược lại.

</details>

---

**Câu 10.** Theo sách, rewards và values có mối quan hệ ưu tiên như thế nào?

- A. Values là primary; rewards chỉ là công cụ phụ để tính value nhanh hơn.
- B. Rewards là primary (không có reward thì không có value); nhưng quyết định dựa trên value, và xác định value khó hơn reward nhiều.
- C. Cả rewards và values đều là primary và được cung cấp trực tiếp từ environment.
- D. Rewards và values có vai trò ngang nhau; quyết định dựa vào cái nào cao hơn tại thời điểm đó.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Rewards là primary; values là secondary (dự đoán reward). Không có reward thì không có value. Dù vậy, action choices được đưa ra dựa trên value judgments vì ta muốn tối đa hóa reward dài hạn, không phải tức thời. Khó ở chỗ value phải ước lượng liên tục từ observations.

</details>

---

**Câu 11.** [Khó] Một state có immediate reward = +10 nhưng value = −5. Một state khác có immediate reward = −1 nhưng value = +8. Agent nên chọn state nào và vì sao?

- A. State có reward +10, vì reward là tín hiệu trực tiếp từ environment còn value chỉ là ước lượng có thể sai.
- B. State có value +8, vì value phản ánh tổng reward kỳ vọng dài hạn — mục tiêu thực sự của agent.
- C. Agent cần biết thêm model của environment mới quyết định được trong trường hợp này.
- D. Không thể quyết định vì reward và value mâu thuẫn — agent cần thêm thông tin từ supervisor.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Mục tiêu của agent là maximize cumulative long-term reward, không phải immediate reward. Value phản ánh chính xác mục tiêu này. State reward +10 có thể dẫn tới chuỗi states tệ hại sau đó; state reward −1 có thể mở ra cơ hội lớn hơn. Đây chính là lý do tại sao quyết định dựa trên value, không phải reward.

</details>

---

**Câu 12.** Phân biệt model-based và model-free methods trong RL là gì?

- A. Model-based dùng model của environment để plan (cân nhắc tình huống tương lai trước khi hành động); model-free là trial-and-error learner thuần túy, không dự đoán trước.
- B. Model-based chỉ dùng trong discrete state spaces; model-free dùng được trong cả continuous spaces.
- C. Model-based không cần dữ liệu thực; model-free cần thu thập dữ liệu từ nhiều episodes.
- D. Model-based luôn tốt hơn model-free vì có thêm thông tin về environment dynamics.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Model-based dùng model để plan — quyết định bằng cách cân nhắc tình huống tương lai trước khi thực sự trải nghiệm. Model-free là trial-and-error learner thuần túy, không plan. Modern RL trải dài cả phổ từ trial-and-error cấp thấp tới deliberative planning cấp cao.

</details>

---

## 1.4 Limitations and Scope

**Câu 13.** Sách có quan điểm gì về khái niệm state và việc thiết kế state signal?

- A. Sách tập trung vào cách thiết kế và học state signal như chủ đề trung tâm của RL.
- B. Sách giả định state signal được tạo sẵn bởi preprocessing system (phần của environment) và tập trung vào quyết định action dựa trên state có sẵn.
- C. RL không cần khái niệm state vì agent ra quyết định dựa trực tiếp trên raw observations.
- D. State chỉ là output của model, không bao giờ là input cho policy hoặc value function.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — RL phụ thuộc nhiều vào state (input cho policy và value function). Sách giả định state do preprocessing system tạo ra và tập trung vào quyết định action như hàm của state đó, không bàn việc thiết kế state signal.

</details>

---

**Câu 14.** Vì sao sách không xem evolutionary methods là phù hợp nhất cho RL?

- A. Evolutionary methods luôn cần external supervisor cung cấp nhãn cho từng generation.
- B. Evolutionary methods không học trong khi tương tác và bỏ qua cấu trúc hữu ích — không tận dụng thông tin về states/actions trong từng episode cá thể.
- C. Evolutionary methods chỉ áp dụng được khi state space rất nhỏ và discrete.
- D. Evolutionary methods estimate value functions quá thường xuyên gây instability trong học.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Evolutionary methods áp dụng nhiều static policies, chỉ dùng final outcome, không học trong lúc tương tác, và bỏ qua cấu trúc hữu ích (states/actions nào đã đi qua). Chúng kém hiệu quả hơn các methods tận dụng chi tiết tương tác.

</details>

---

**Câu 15.** [Khó] Evolutionary method áp dụng cho RL đánh giá một policy như thế nào, và vấn đề credit assignment phát sinh ra sao?

- A. Policy được đánh giá qua value function ước lượng tại mỗi state, credit gán theo TD error.
- B. Policy được đánh giá qua nhiều complete episodes, credit gán ngược từ outcome cuối — mọi action trong episode đều nhận credit như nhau, kể cả actions không xảy ra.
- C. Policy được đánh giá qua một episode duy nhất, credit gán cho action cuối cùng trước khi nhận reward.
- D. Policy được đánh giá bởi một critic network, credit gán theo advantage function tại mỗi step.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Evolutionary methods chơi nhiều episodes với policy cố định rồi dùng outcome cuối để đánh giá. Vấn đề credit assignment: nếu thắng, mọi behavior đều được credit như nhau — kể cả moves chưa từng xảy ra trong episode đó — gây ra credit assignment không chính xác.

</details>

---

## 1.5 An Extended Example: Tic-Tac-Toe

**Câu 16.** Vì sao giải pháp minimax từ game theory không phù hợp cho bài toán tic-tac-toe trong sách?

- A. Minimax cần model hoàn chỉnh của bàn cờ mà ta giả định không có trong bài toán này.
- B. Minimax giả định opponent chơi optimally nên không cải thiện được khi gặp imperfect player — có states minimax sẽ không bao giờ đến dù thực ra sẽ thắng từ đó.
- C. Minimax cần biết trước xác suất của từng nước đi của opponent để tính expected value.
- D. Minimax tính toán quá chậm cho real-time play trong bài toán tic-tac-toe 3x3.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Minimax giả định opponent chơi optimally. Nó sẽ không bao giờ đến game state mà từ đó nó có thể thua, ngay cả khi thực tế nó luôn thắng từ state đó do opponent chơi sai. Bài toán ở đây muốn học cách thắng với imperfect player, nên minimax không phù hợp.

</details>

---

**Câu 17.** Trong cách tiếp cận value function cho tic-tac-toe, các state được khởi tạo value như thế nào?

- A. Tất cả states đều khởi tạo bằng 0 để tránh bias ban đầu trong quá trình học.
- B. States thắng (ba X thẳng hàng) = 1; states thua/hòa = 0; mọi states khác = 0.5 (ước lượng 50/50).
- C. States thắng = 1; states thua = −1; states hòa = 0; còn lại khởi tạo ngẫu nhiên.
- D. Tất cả states khởi tạo bằng 1 rồi giảm dần theo số lần thất bại từ state đó.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Giả định luôn chơi X: states có ba X thẳng hàng đặt value 1; states có ba O thẳng hàng hoặc đầy bàn đặt value 0; mọi states khác khởi tạo 0.5 (đoán 50% cơ hội thắng).

</details>

---

**Câu 18.** Exploratory moves trong ví dụ tic-tac-toe là gì, và chúng có tạo ra learning không?

- A. Là các greedy moves chọn state value cao nhất; chúng là nguồn chính tạo ra learning updates.
- B. Là các moves chọn ngẫu nhiên (không greedy) để trải nghiệm states mới; theo mô tả, chúng không tạo ra learning updates.
- C. Là các moves được opponent chọn; chúng không liên quan tới learning của ta nhưng ảnh hưởng state.
- D. Là tất cả moves xảy ra sau khi agent rơi vào trạng thái không tối ưu; chúng trigger learning.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Phần lớn thời gian ta đi greedy; thỉnh thoảng chọn ngẫu nhiên trong các nước khác — đó là exploratory moves, giúp trải nghiệm states mới. Theo Figure 1.1, exploratory moves không tạo ra learning updates.

</details>

---

**Câu 19.** Update rule V(St) ← V(St) + α[V(St+1) − V(St)] là ví dụ của phương pháp nào và α có ý nghĩa gì?

- A. Dynamic programming; α là discount factor giảm giá trị future rewards.
- B. Temporal-difference learning; α là step-size parameter điều chỉnh tốc độ học.
- C. Supervised learning; α là learning rate cho gradient descent trên labeled targets.
- D. Monte Carlo method; α là sampling rate xác định tần suất đánh giá policy.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Đây là temporal-difference learning — thay đổi dựa trên difference V(St+1) − V(St) giữa hai estimates ở hai thời điểm liên tiếp. α là step-size parameter (phân số dương nhỏ) ảnh hưởng tốc độ học.

</details>

---

**Câu 20.** [Khó] Trong update rule V(St) ← V(St) + α[V(St+1) − V(St)], điều gì xảy ra nếu α = 0? Điều gì xảy ra nếu α = 1?

- A. α = 0: không học gì, values không thay đổi; α = 1: values cập nhật hoàn toàn về V(St+1), bỏ qua estimate cũ.
- B. α = 0: học rất chậm; α = 1: học tối ưu vì cập nhật đầy đủ thông tin mới nhất.
- C. α = 0: agent chỉ exploit; α = 1: agent chỉ explore trong policy space.
- D. α = 0: value function hội tụ ngay lập tức; α = 1: value function phân kỳ và không hội tụ.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — α = 0: V(St) ← V(St) + 0 = V(St), không có learning. α = 1: V(St) ← V(St+1), hoàn toàn tin vào estimate mới nhất, bỏ qua toàn bộ history — hội tụ không ổn định. Sách chỉ định α là phân số dương nhỏ để balance giữa stability và learning speed.

</details>

---

**Câu 21.** Khác biệt then chốt giữa evolutionary methods và value function methods khi áp dụng cho tic-tac-toe là gì?

- A. Evolutionary methods đánh giá từng state riêng lẻ; value function methods chỉ dùng kết quả cuối ván.
- B. Evolutionary methods giữ policy cố định và chỉ dùng final outcome (bỏ qua in-episode info, credit cả moves chưa xảy ra); value function methods đánh giá states riêng lẻ và tận dụng thông tin trong lúc chơi.
- C. Cả hai đều không tìm kiếm trong space of policies nhưng dùng phương pháp khác nhau.
- D. Value function methods gán credit cho tất cả moves kể cả những nước chưa xảy ra trong episode.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Evolutionary method giữ policy cố định, chơi nhiều ván, chỉ dùng outcome cuối — mọi behavior được credit như nhau kể cả moves chưa xảy ra. Value function method đánh giá individual states và tận dụng thông tin trong lúc chơi. Cả hai đều tìm kiếm trong space of policies.

</details>

---

**Câu 22.** [Khó] Trong ví dụ tic-tac-toe, nếu opponent không phải là người chơi cố định mà thay đổi chiến thuật theo thời gian (non-stationary opponent), phương pháp value function sẽ xử lý vấn đề này như thế nào?

- A. Value function method không thể xử lý non-stationary opponent vì nó giả định environment là stationary.
- B. Method cần dùng một α đủ lớn (không giảm về 0) để values tiếp tục thay đổi theo chiến thuật mới của opponent.
- C. Method tự động thích nghi vì exploratory moves luôn giúp cập nhật values mà không cần thay đổi gì.
- D. Cần chuyển sang evolutionary method vì nó tốt hơn cho non-stationary environments.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Với non-stationary problem, α không nên giảm về 0 (như cần thiết để guarantee convergence trong stationary case) mà nên giữ ở mức dương cố định. Điều này cho phép values tiếp tục cập nhật phản ánh chiến thuật mới của opponent, dù đánh đổi lại là không hội tụ hoàn toàn. Đây là một trong những trade-offs thực tế được đề cập trong sách.

</details>

---

## 1.6 Summary

**Câu 23.** Điều gì phân biệt RL với các computational approaches khác, và vai trò của value functions là gì theo phần Summary?

- A. RL yêu cầu model hoàn chỉnh của environment; value functions thay thế reward signal hoàn toàn.
- B. RL nhấn mạnh học từ direct interaction mà không cần exemplary supervision hay complete models; value functions then chốt cho tìm kiếm hiệu quả trong policy space và phân biệt RL với evolutionary methods.
- C. RL chỉ giải subproblems biệt lập; value functions chỉ dùng bởi evolutionary methods không phải RL.
- D. RL dựa hoàn toàn vào exemplary supervision từ domain expert; value functions mô hình hóa expert knowledge.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — RL phân biệt bởi nhấn mạnh học từ direct interaction, không cần exemplary supervision hay complete models. Value functions then chốt cho tìm kiếm hiệu quả trong policy space — đây chính là điều phân biệt RL với evolutionary methods vốn tìm kiếm trực tiếp trong policy space.

</details>

---

## 1.7 Early History of Reinforcement Learning

**Câu 24.** Lịch sử sơ khai của RL có mấy thread chính? Đó là gì?

- A. Hai thread: supervised learning (từ statistics) và unsupervised learning (từ information theory).
- B. Ba thread: trial-and-error learning (từ psychology), optimal control dùng value functions/DP, và temporal-difference methods.
- C. Hai thread chính: deep learning và Bayesian inference, hội tụ vào thập niên 1990.
- D. Ba thread: game theory, convex optimization, và neuroscience của animal behavior.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Ba thread: (1) trial-and-error learning từ psychology; (2) optimal control giải bằng value functions và dynamic programming; (3) temporal-difference methods (nhỏ và ít rõ nét, nhưng liên kết hai thread kia). Cả ba hội tụ cuối thập niên 1980.

</details>

---

**Câu 25.** Thorndike nổi tiếng với nguyên lý nào, và Bellman gắn với đóng góp gì?

- A. Thorndike — "Law of Effect"; Bellman — Bellman equation, dynamic programming, và MDPs.
- B. Thorndike — Bellman equation về optimal returns; Bellman — "Law of Effect" trong animal learning.
- C. Thorndike — Q-learning cho optimal control; Bellman — actor–critic architecture cho credit assignment.
- D. Thorndike — curse of dimensionality trong planning; Bellman — secondary reinforcers trong conditioning.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Thorndike: "Law of Effect" — responses kèm satisfaction thì liên kết chặt hơn, kèm discomfort thì liên kết yếu hơn. Bellman (giữa 1950s): dynamic programming, Bellman equation, và introduce MDPs (1957b), cùng thuật ngữ "curse of dimensionality".

</details>

---

**Câu 26.** Công trình của Chris Watkins (1989) có ý nghĩa gì trong lịch sử RL?

- A. Phát triển actor–critic architecture kết hợp TD learning với trial-and-error.
- B. Phát triển Q-learning, hợp nhất hoàn toàn thread temporal-difference với thread optimal control và mở rộng cả ba thread.
- C. Phát triển TD-Gammon, ứng dụng RL đầu tiên đạt trình độ world-class trong board games.
- D. Phát triển classifier systems và bucket-brigade algorithm cho distributed RL.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Watkins (1989) phát triển Q-learning, hợp nhất hoàn toàn temporal-difference thread với optimal control thread. Cách xử lý RL dùng khung MDP của ông mở rộng và tích hợp kết quả trong cả ba thread, được áp dụng rộng rãi từ đó.

</details>

---

**Câu 27.** [Khó] Credit-assignment problem là gì, ai nêu ra nó, và tại sao nó quan trọng với RL?

- A. Vấn đề phân bổ computational resources giữa exploration và exploitation; do Bellman nêu ra năm 1957.
- B. Vấn đề phân bổ credit cho thành công giữa nhiều quyết định góp phần tạo ra nó; do Minsky nêu năm 1961; mọi phương pháp trong sách đều hướng tới giải quyết vấn đề này.
- C. Vấn đề xác định state nào cần credit cho reward nhận được; do Thorndike nêu trong Law of Effect.
- D. Vấn đề credit model-based vs model-free approaches; do Watkins đặt ra trong nghiên cứu Q-learning.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Minsky (1961) nêu basic credit-assignment problem: làm sao phân bổ credit cho thành công giữa nhiều quyết định có thể đã góp phần tạo ra nó. Tất cả các phương pháp trong sách đều hướng tới giải quyết vấn đề này theo nghĩa nào đó.

</details>
