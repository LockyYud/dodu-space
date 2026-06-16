# Chương 8: Planning and Learning with Tabular Methods — Câu hỏi trắc nghiệm

> Bộ câu hỏi ôn tập chi tiết cho Chương 8, sách *Reinforcement Learning: An Introduction* (Sutton & Barto, 2nd ed.)

## 8.1 Models and Planning

**Câu 1.** Theo định nghĩa trong sách, một *model* của environment là gì?

- A. Một policy ánh xạ trực tiếp từ mỗi state sang action greedy mà agent sẽ thực thi.
- B. Bất cứ thứ gì agent có thể dùng để dự đoán cách environment phản hồi với các action của nó.
- C. Một bảng lưu trữ value function ước lượng cho mọi state và state–action pair.
- D. Một tập các episode thực mà agent đã trải nghiệm và lưu lại trong quá khứ.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Sách định nghĩa: "By a model of the environment we mean anything that an agent can use to predict how the environment will respond to its actions." Cho một state và action, model dự đoán next state và next reward. A là policy, C là value function, D là replay buffer — đều là các thành phần khác của hệ RL.

</details>

---

**Câu 2.** Đâu là điểm khác biệt giữa *distribution model* và *sample model*?

- A. Distribution model tạo ra mô tả tất cả khả năng kèm xác suất của chúng, còn sample model chỉ tạo một khả năng được lấy mẫu theo xác suất.
- B. Distribution model dùng cho deterministic environment, còn sample model dùng cho stochastic environment.
- C. Distribution model chỉ tạo ra một transition đơn lẻ, còn sample model tạo ra toàn bộ phân phối khả năng.
- D. Distribution model học từ real experience, còn sample model học từ simulated experience.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Distribution model tạo ra mọi khả năng và xác suất tương ứng; sample model chỉ tạo ra một khả năng được sampled theo phân phối xác suất đó. B sai vì cả hai loại đều dùng được cho stochastic environment; C đảo ngược định nghĩa; D nhầm lẫn với cách model được học.

</details>

---

**Câu 3.** Phát biểu nào về mối quan hệ giữa hai loại model là đúng?

- A. Hai loại model tương đương nhau về mặt thông tin, chỉ khác ở cách biểu diễn nội bộ.
- B. Sample model luôn có thể được dùng để tái tạo lại phân phối xác suất đầy đủ.
- C. Distribution model mạnh hơn vì luôn dùng được để tạo samples, nhưng nhiều ứng dụng lại dễ thu được sample model hơn.
- D. Distribution model nhìn chung dễ thu được hơn sample model trong các ứng dụng thực tế.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — "Distribution models are stronger than sample models in that they can always be used to produce samples. However, in many applications it is much easier to obtain sample models than distribution models." Ví dụ tổng của một tá xúc xắc minh họa điều này: dễ viết sample model, khó tính distribution model. B sai vì chiều ngược lại không đúng; D đảo ngược thực tế.

</details>

---

**Câu 4.** Loại model nào được dùng trong dynamic programming, và loại nào được dùng trong ví dụ blackjack ở Chương 5?

- A. DP dùng sample model p(s', r | s, a); blackjack dùng distribution model.
- B. Cả hai đều dùng distribution model vì cùng giả định biết dynamics.
- C. Cả hai đều dùng sample model vì cùng mô phỏng tương tác.
- D. DP dùng distribution model p(s', r | s, a); blackjack dùng sample model.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Model giả định trong DP — các ước lượng của dynamics p(s', r | s, a) — là một distribution model. Model dùng trong ví dụ blackjack ở Chương 5 là một sample model (dễ mô phỏng một ván chia bài hơn là tính phân phối đầy đủ). A đảo ngược; B và C đồng nhất sai hai loại.

</details>

---

**Câu 5.** Trong sách, *planning* được định nghĩa là gì?

- A. Bất kỳ quá trình tính toán nào nhận một model làm đầu vào và tạo ra hoặc cải thiện một policy để tương tác với environment được mô hình hóa.
- B. Quá trình ước lượng một model của environment từ dữ liệu real experience thu thập được.
- C. Quá trình thu thập real experience từ environment để cập nhật value function.
- D. Quá trình chọn action greedy dựa trên action value hiện tại tại mỗi state.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — "We use the term to refer to any computational process that takes a model as input and produces or improves a policy for interacting with the modeled environment." Sơ đồ: model → planning → policy. B là model-learning; C là acting/learning từ thực tế; D là decision-making thông thường.

</details>

---

**Câu 6.** Đâu là sự khác biệt giữa *state-space planning* và *plan-space planning*?

- A. State-space planning tìm kiếm trong không gian các plan, còn plan-space planning tìm kiếm trong không gian các state.
- B. State-space planning chỉ dùng cho deterministic problems, plan-space planning chỉ dùng cho stochastic problems.
- C. Hai cách tiếp cận này hoàn toàn tương đương và có thể hoán đổi cho nhau.
- D. State-space planning tìm qua state space để tìm policy/đường đi tối ưu; plan-space planning tìm qua không gian các plan với operator biến đổi plan này thành plan khác.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — State-space planning (cách tiếp cận của sách) tìm kiếm qua state space để tìm policy/đường đi tối ưu. Plan-space planning tìm kiếm qua không gian các plan (gồm evolutionary methods và partial-order planning), khó áp dụng hiệu quả cho các bài toán stochastic sequential decision nên sách không xét tiếp. A đảo ngược; B và C sai về bản chất.

</details>

---

**Câu 7.** Theo "unified view" của chương này, tất cả state-space planning methods có chung cấu trúc cơ bản nào?

- A. Chúng đều thực hiện một sweep đầy đủ qua toàn bộ state space ở mỗi lần lặp.
- B. (1) Tính value function như bước trung gian then chốt để cải thiện policy; (2) tính value function bằng các update/backup áp dụng lên simulated experience.
- C. Chúng đều dùng expected updates thay vì sample updates để đảm bảo độ chính xác.
- D. Chúng đều cần một distribution model đầy đủ cùng xác suất chuyển tiếp chính xác.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Hai ý cơ bản: (1) tất cả state-space planning methods tính value function như bước trung gian chính để cải thiện policy; (2) chúng tính value function bằng updates/backups áp dụng lên simulated experience. Sơ đồ: model → simulated experience → backups → values → policy. A, C, D đều mô tả các tính chất không bắt buộc của cấu trúc chung này.

</details>

---

**Câu 8.** Điểm khác biệt cốt lõi giữa *planning* và *learning* methods (theo cách trình bày của sách) là gì?

- A. Planning dùng simulated experience tạo bởi model, learning dùng real experience từ environment; nhưng cả hai cùng cấu trúc cốt lõi là backing-up update.
- B. Planning dùng value function để ra quyết định còn learning thì hành xử trực tiếp không qua value.
- C. Learning luôn nhanh hơn planning vì không tốn chi phí truy vấn model.
- D. Planning không thể tái sử dụng các thuật toán vốn thiết kế cho learning.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Trái tim của cả learning và planning là ước lượng value function bằng các backing-up update. Khác biệt là planning dùng simulated experience từ model, còn learning dùng real experience từ environment. Vì cấu trúc chung này, một learning algorithm thường có thể thay thế bước update của planning method. B, C, D đều là phát biểu sai về quan hệ này.

</details>

---

**Câu 9.** Thuật toán *random-sample one-step tabular Q-planning* hội tụ về optimal policy của model dưới những điều kiện nào?

- A. Luôn hội tụ mà không cần điều kiện đặc biệt nào, miễn là model cố định.
- B. Chỉ cần dùng distribution model thay vì sample model là đủ để đảm bảo hội tụ.
- C. Mỗi state–action pair phải được chọn vô hạn lần và α phải giảm phù hợp theo thời gian.
- D. Chỉ cần thực hiện một sweep đầy đủ qua toàn bộ state space một lần duy nhất.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Nó hội tụ về optimal policy của model dưới cùng điều kiện mà one-step tabular Q-learning hội tụ về optimal policy của real environment: mỗi state–action pair được chọn vô hạn lần (Step 1) và α giảm phù hợp theo thời gian. A bỏ qua điều kiện cần thiết; B không liên quan; D không đủ.

</details>

---

**Câu 10.** [Khó] Một kỹ sư có một sample model rất rẻ để mô phỏng một stochastic environment với branching factor lớn, nhưng không có distribution model. Họ muốn dùng dynamic programming (sweep với expected updates). Vấn đề chính là gì?

- A. Không có vấn đề gì: sample model có thể trực tiếp cung cấp p(s', r | s, a) cần cho expected update.
- B. Expected update cần xác suất của mọi next state, mà sample model không cung cấp trực tiếp; phải ước lượng phân phối từ nhiều mẫu hoặc chuyển sang sample updates.
- C. Vấn đề chỉ là tốc độ: sample model luôn chạy chậm hơn distribution model nên DP sẽ lâu hơn.
- D. DP không bao giờ dùng được với bất kỳ loại model nào trong môi trường stochastic.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Expected update tính kỳ vọng trên mọi (s', r) có thể, đòi hỏi phân phối p(s', r | s, a) — thứ chỉ distribution model cung cấp trực tiếp. Với chỉ sample model, ta phải hoặc ước lượng phân phối từ nhiều mẫu (tốn kém khi branching factor lớn), hoặc dùng sample updates vốn chỉ cần một mẫu mỗi lần. A sai vì sample model không trả về xác suất; C nhầm bản chất vấn đề; D quá tuyệt đối.

</details>

---

## 8.2 Dyna: Integrated Planning, Acting, and Learning

**Câu 11.** Trong một planning agent, real experience có hai vai trò nào?

- A. Search control (chọn starting state) và backup (lan truyền value ngược).
- B. Selection (chọn leaf node) và expansion (thêm node mới vào cây).
- C. Model-learning (cải thiện model) và direct RL (cải thiện trực tiếp value function/policy).
- D. Exploration (thử action mới) và discounting (giảm giá reward tương lai).

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Real experience vừa dùng để cải thiện model (model-learning) vừa dùng để cải thiện trực tiếp value function/policy bằng các RL method (direct reinforcement learning). Việc cải thiện gián tiếp qua model gọi là indirect RL — đây chính là phần liên quan đến planning. A là thuật ngữ của Dyna/MCTS khác, B là MCTS, D không liên quan.

</details>

---

**Câu 12.** So sánh ưu nhược điểm của *indirect* và *direct* methods?

- A. Indirect methods thường tận dụng đầy đủ hơn lượng experience hạn chế; direct methods đơn giản hơn và không bị ảnh hưởng bởi bias trong thiết kế model.
- B. Indirect methods đơn giản hơn và không chịu bias model; direct methods cần ít tương tác hơn.
- C. Direct methods luôn vượt trội indirect methods trong mọi trường hợp về cả tốc độ lẫn chất lượng.
- D. Indirect methods không cần model nên hoàn toàn không bị ảnh hưởng bởi sai số mô hình.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Indirect methods thường tận dụng đầy đủ hơn lượng experience hạn chế, đạt policy tốt hơn với ít tương tác environment hơn. Direct methods đơn giản hơn và không bị ảnh hưởng bởi bias trong thiết kế model. B đảo ngược các ưu điểm; C quá tuyệt đối; D sai vì indirect methods bắt buộc phải có model.

</details>

---

**Câu 13.** Trong kiến trúc Dyna, thuật ngữ *search control* dùng để chỉ điều gì?

- A. Quá trình learning model của environment từ real experience quan sát được.
- B. Quá trình chọn các starting state và action cho simulated experience được tạo bởi model.
- C. Quá trình chọn action ε-greedy khi agent tương tác với real environment.
- D. Quá trình duy trì priority queue để sắp xếp các update theo độ khẩn cấp.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — "We use the term search control to refer to the process that selects the starting states and actions for the simulated experiences generated by the model." A là model-learning, C là acting, D là prioritized sweeping.

</details>

---

**Câu 14.** Trong Dyna-Q, model-learning method hoạt động như thế nào (giả định environment deterministic)?

- A. Lưu một phân phối xác suất đầy đủ cho mỗi state–action pair từ nhiều lần quan sát.
- B. Dùng một neural network để xấp xỉ dynamics liên tục theo từng transition.
- C. Tạo ngẫu nhiên một next state khác nhau mỗi lần model được truy vấn.
- D. Sau mỗi transition St, At → Rt+1, St+1, ghi vào ô bảng của (St, At); khi truy vấn nó trả về next state và reward quan sát gần nhất.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Model-learning của Dyna-Q dựa trên bảng và giả định environment deterministic. Sau mỗi transition, model ghi nhận rằng Rt+1, St+1 sẽ deterministically theo sau (St, At). Khi được truy vấn với một pair đã trải nghiệm, nó trả về next state và reward quan sát gần nhất. A mô tả model stochastic; B là function approximation (chương sau); C mâu thuẫn với giả định deterministic.

</details>

---

**Câu 15.** Trong pseudocode của Tabular Dyna-Q, nếu bỏ đi các bước (e) model-learning và (f) planning thì còn lại thuật toán gì?

- A. Prioritized sweeping với priority queue.
- B. One-step tabular Q-learning.
- C. Monte Carlo control với exploring starts.
- D. Value iteration đồng bộ trên toàn state space.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Direct RL, model-learning và planning được hiện thực bởi các bước (d), (e), (f). Nếu bỏ (e) và (f), phần còn lại — chu trình acting cộng bước (d) cập nhật Q từ real transition — chính là one-step tabular Q-learning. A, C, D đều là các thuật toán khác hẳn về cấu trúc.

</details>

---

**Câu 16.** Trong bước planning (f) của Dyna-Q, state và action được chọn như thế nào?

- A. Chọn theo thứ tự ưu tiên dựa trên độ lớn của thay đổi value dự kiến.
- B. Chọn một state đã quan sát trước đó ngẫu nhiên, và một action đã từng được thực hiện tại state đó ngẫu nhiên.
- C. Chọn uniformly ngẫu nhiên từ tất cả state–action pair có thể có trong MDP.
- D. Chọn theo on-policy distribution của policy ε-greedy hiện tại.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Trong bước (f), S là một state đã quan sát trước đó (chọn ngẫu nhiên), A là một action đã từng thực hiện tại S (chọn ngẫu nhiên). Q-planning chỉ sampling từ các pair đã trải nghiệm để model không bao giờ bị truy vấn với pair mà nó không có thông tin. A là prioritized sweeping; C sai vì có thể truy vấn pair chưa trải nghiệm; D là trajectory sampling.

</details>

---

**Câu 17.** Trong ví dụ Dyna Maze (Figure 8.2), kết quả nào sau đây là đúng về số planning step n?

- A. Tất cả các giá trị n đều cho cùng tốc độ học giống hệt nhau qua các episode.
- B. Agent n = 0 (chỉ direct RL) học nhanh nhất nhờ không tốn thời gian cho planning.
- C. Agent với n lớn hơn cải thiện performance nhanh hơn rõ rệt; n = 0 chậm nhất dù tham số đã được tối ưu cho nó.
- D. Agent n = 50 cần khoảng 25 episode để đạt optimal, tương đương agent n = 0.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Performance cải thiện cho mọi n nhưng nhanh hơn nhiều với n lớn. Agent n = 0 (chỉ Q-learning) chậm nhất (~25 episode), n = 5 cần ~5 episode, n = 50 chỉ cần ~3 episode để đạt (ε-)optimal — dù α và ε được tối ưu cho agent n = 0. A, B, D đều mâu thuẫn với kết quả thí nghiệm.

</details>

---

**Câu 18.** [Khó] Trong ví dụ Dyna Maze, vì sao agent n = 0 cần khoảng 25 episode trong khi agent n = 50 chỉ cần khoảng 3, dù cả hai dùng cùng một real transition mỗi bước?

- A. Vì agent n = 50 dùng step-size α lớn hơn nhiều nên cập nhật value nhanh hơn.
- B. Vì mỗi real step, agent n = 50 thực hiện thêm 50 planning update từ model, lan truyền thông tin reward tới nhiều state–action pair khác trong cùng một time step.
- C. Vì agent n = 50 dùng expected updates còn agent n = 0 dùng sample updates kém chính xác hơn.
- D. Vì agent n = 50 khám phá nhiều state mới hơn nhờ ε lớn hơn trong mỗi episode.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Mấu chốt của Dyna là planning. Với cùng một real experience, agent n = 50 còn thực hiện 50 simulated update mỗi bước, nhờ model lan truyền thông tin value qua nhiều state–action pair mà không cần đợi agent thực sự ghé thăm lại. Một real transition vào goal có thể được "phát lại" nhiều lần qua model. A, C, D đều sai vì các tham số học và loại update là giống nhau giữa các agent trong thí nghiệm này.

</details>

---

## 8.3 When the Model Is Wrong

**Câu 19.** Vì sao model có thể bị sai (incorrect)?

- A. Vì agent dùng ε-greedy thay vì greedy nên thu thập transition nhiễu.
- B. Vì environment stochastic chỉ quan sát số mẫu hạn chế, hoặc function approximation tổng quát hóa kém, hoặc environment đã thay đổi mà hành vi mới chưa được quan sát.
- C. Vì số planning step n được đặt quá nhỏ so với kích thước state space.
- D. Vì model luôn đúng khi environment deterministic, chỉ sai khi stochastic.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Model có thể sai do environment stochastic chỉ quan sát số mẫu hạn chế, do function approximation tổng quát hóa kém, hoặc đơn giản do environment đã thay đổi mà hành vi mới chưa được quan sát. Khi model sai, planning thường tính ra suboptimal policy. A, C không phải nguyên nhân model sai; D quá hẹp.

</details>

---

**Câu 20.** Loại lỗi model nào thường tự được phát hiện và sửa chữa nhanh chóng?

- A. Khi model bi quan (pessimistic), dự đoán reward thấp hơn thực tế xảy ra.
- B. Khi environment thay đổi để trở nên tốt hơn so với trước đó.
- C. Khi model lạc quan (optimistic), dự đoán reward/transition tốt hơn thực tế — planned policy cố khai thác rồi phát hiện chúng không tồn tại.
- D. Mọi loại lỗi model đều được phát hiện và sửa với tốc độ như nhau.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Lỗi tự sửa nhanh thường xảy ra khi model lạc quan (dự đoán reward/transition tốt hơn thực tế). Planned policy cố khai thác các cơ hội này và qua đó phát hiện chúng không tồn tại. Khó khăn lớn hơn xuất hiện khi environment thay đổi trở nên tốt hơn nhưng policy cũ không hé lộ sự cải thiện đó (ví dụ Shortcut Maze) — đó là trường hợp B. A là model bi quan (khó sửa hơn vì agent tránh đó); D sai.

</details>

---

**Câu 21.** Trong ví dụ Shortcut Maze (Figure 8.5), tại sao Dyna-Q thông thường không bao giờ chuyển sang đường tắt mới?

- A. Vì model nói rằng không có đường tắt, nên càng planning càng ít bước sang phải để khám phá; ngay cả ε-greedy cũng khó thực hiện đủ exploratory action để phát hiện.
- B. Vì step-size α được đặt quá lớn khiến value của đường tắt bị triệt tiêu.
- C. Vì nó dùng prioritized sweeping nên bỏ qua các transition có value thấp.
- D. Vì nó dùng expected updates nên không thấy được transition xác suất thấp của đường tắt.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Dyna-Q thông thường không bao giờ nhận ra đường tắt tồn tại. Model nói không có đường tắt, nên càng planning càng ít có khả năng bước sang phải để phát hiện. Ngay với ε-greedy, agent khó thực hiện đủ exploratory action để tìm ra đường tắt. B, C, D đều không phải nguyên nhân thật sự (Dyna-Q dùng sample updates và không dùng prioritized sweeping mặc định).

</details>

---

**Câu 22.** Cơ chế *exploration bonus* trong Dyna-Q+ hoạt động như thế nào?

- A. Thêm một reward bonus cố định bằng nhau cho mọi transition trong mỗi planning step.
- B. Theo dõi số time step τ kể từ lần cuối mỗi pair được thử thực; planning update dùng reward r + κ√τ với κ nhỏ.
- C. Tăng dần ε theo thời gian để agent khám phá nhiều hơn về cuối quá trình học.
- D. Phạt (giảm value) các action vừa được thử gần đây để tránh lặp lại.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Dyna-Q+ theo dõi cho mỗi state–action pair số time step τ kể từ lần cuối pair được thử trong tương tác thực. Nếu transition chưa được thử trong τ bước, planning update được thực hiện như thể nó tạo ra reward r + κ√τ với κ nhỏ. Điều này khuyến khích agent liên tục kiểm tra các transition lâu chưa thử ("computational curiosity"). A, C, D đều mô tả các cơ chế khác.

</details>

---

**Câu 23.** Trong bối cảnh planning, "exploration" và "exploitation" nghĩa là gì?

- A. Exploration là chọn action greedy theo value cao nhất; exploitation là chọn action ngẫu nhiên.
- B. Exploration là dùng expected update; exploitation là dùng sample update để tiết kiệm tính toán.
- C. Cả hai khái niệm này không áp dụng được trong bối cảnh planning, chỉ trong learning.
- D. Exploration là thử action giúp cải thiện model; exploitation là hành xử tối ưu theo model hiện tại.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Trong bối cảnh planning, exploration nghĩa là thử các action giúp cải thiện model, còn exploitation nghĩa là hành xử theo cách tối ưu dựa trên model hiện tại. Đây là một phiên bản khác của xung đột exploration/exploitation. A đảo ngược nghĩa thông thường; B nhầm với loại update; C sai.

</details>

---

**Câu 24.** [Khó] Trong Shortcut Maze, một lập trình viên tăng κ trong exploration bonus của Dyna-Q+ lên rất lớn. Hệ quả có khả năng nhất là gì?

- A. Agent hội tụ nhanh hơn về optimal policy vì bonus lớn giúp tìm đường tắt tức thì mà không có nhược điểm gì.
- B. Bonus quá lớn lấn át reward thực, khiến agent liên tục đi thử lại các transition cũ thay vì khai thác đường đi tốt đã biết, làm giảm performance.
- C. Agent ngừng explore hoàn toàn vì κ lớn làm bonus bão hòa về một hằng số cố định.
- D. Không ảnh hưởng gì vì κ chỉ tác động tới model-learning chứ không tới planning update.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Bonus κ√τ được cộng vào reward trong planning update. Nếu κ quá lớn, bonus áp đảo reward thực của bài toán, khiến agent ưu tiên việc đi kiểm tra lại các transition lâu chưa thử hơn là khai thác đường đi tốt — đánh đổi quá nhiều exploitation lấy exploration, giảm cumulative reward. A bỏ qua chi phí của exploration thừa; C sai về dạng hàm √τ (không bão hòa); D sai vì bonus tác động trực tiếp vào planning update.

</details>

---

## 8.4 Prioritized Sweeping

**Câu 25.** Vấn đề chính của việc chọn state–action pair uniformly at random trong Dyna là gì?

- A. Nó tiêu tốn quá nhiều bộ nhớ để lưu mọi pair đã từng được sampling.
- B. Nó không hội tụ về optimal policy của model dù sampling vô hạn lần.
- C. Nó chỉ dùng được với distribution model chứ không dùng được sample model.
- D. Nhiều update là vô ích; chỉ update vào state ngay trước goal mới đổi value, nên sampling uniform tạo nhiều update lãng phí.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Với uniform selection, nhiều update đưa agent từ một zero-valued state sang zero-valued state khác và không có tác dụng. Chỉ update dọc transition vào state ngay trước goal mới thay đổi value. Sampling uniform tạo ra nhiều update lãng phí. Với bài toán lớn, tìm kiếm không tập trung cực kỳ kém hiệu quả. A, B, C không phải vấn đề thực (nó vẫn hội tụ, chỉ chậm).

</details>

---

**Câu 26.** Ý tưởng *backward focusing* trong prioritized sweeping là gì?

- A. Làm việc ngược từ state có value vừa thay đổi: update các action dẫn vào state đó, rồi tới predecessor, lan truyền ngược cho đến khi yên lặng.
- B. Tập trung update vào các state dễ đạt tới từ những state thường xuyên được ghé thăm.
- C. Thực hiện một sweep đầy đủ qua toàn bộ state space nhưng theo thứ tự ngược.
- D. Chỉ update các goal state và terminal state, bỏ qua các state trung gian.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Backward focusing: làm việc ngược từ bất kỳ state nào có value đã thay đổi. Chỉ các action dẫn trực tiếp vào state đó là hữu ích để update; nếu chúng thay đổi thì các predecessor lại cần update, lan truyền ngược cho đến khi terminate. B mô tả "forward focusing"; C, D không đúng cơ chế.

</details>

---

**Câu 27.** Trong prioritized sweeping, các update được ưu tiên theo tiêu chí nào?

- A. Theo thứ tự thời gian (FIFO) các state được agent ghé thăm trong trajectory.
- B. Theo độ lớn của thay đổi value: duy trì priority queue mọi pair có value sẽ thay đổi đáng kể nếu update, ưu tiên theo độ lớn thay đổi.
- C. Theo on-policy distribution của policy hiện tại agent đang theo.
- D. Theo số lần state–action pair đã được thử trong real experience.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Một queue được duy trì chứa mọi state–action pair mà value sẽ thay đổi đáng kể (nontrivially) nếu được update, được ưu tiên theo độ lớn của thay đổi. Khi pair đầu queue được update, tác động lên mỗi predecessor được tính; nếu vượt ngưỡng θ thì chèn vào queue với priority mới. A, C, D đều là các tiêu chí sắp xếp khác không dùng trong prioritized sweeping.

</details>

---

**Câu 28.** Một hạn chế của prioritized sweeping (như được nêu trong sách) là gì?

- A. Nó hoàn toàn không thể áp dụng cho stochastic environment dưới mọi điều kiện.
- B. Nó luôn chậm hơn unprioritized Dyna-Q vì chi phí duy trì priority queue.
- C. Nó dùng expected updates, có thể lãng phí tính toán cho transition xác suất thấp; sample updates đôi khi tới gần true value hơn với ít tính toán hơn.
- D. Nó không thể dùng priority queue khi state space quá lớn để lưu toàn bộ.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Mở rộng cho stochastic environment dùng expected update (theo counts). Hạn chế là expected updates có thể lãng phí nhiều tính toán cho transition xác suất thấp. Sample updates thường có thể tới gần true value hơn với ít tính toán hơn vì chia nhỏ phép backup và tập trung vào phần tác động lớn nhất ("small backups" của van Seijen và Sutton, 2013). A, B, D đều sai về bản chất phương pháp.

</details>

---

**Câu 29.** [Khó] Trong bài toán có branching factor stochastic cao và rất nhiều state, vì sao "backward focusing" của prioritized sweeping có thể trở nên kém hiệu quả hơn mong đợi?

- A. Vì backward focusing chỉ áp dụng được cho deterministic problems, nên với stochastic problems nó ngừng hoạt động.
- B. Vì khi một state có nhiều predecessor (branching cao), một thay đổi value lan ngược tới rất nhiều pair, làm queue phình to và nhiều expected update tốn kém trên các transition xác suất nhỏ.
- C. Vì backward focusing bỏ qua priority queue và quay lại sampling uniform khi branching factor lớn.
- D. Vì với nhiều state, mọi predecessor đều có cùng priority nên thứ tự ưu tiên trở nên vô nghĩa.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Backward focusing lan thay đổi value tới các predecessor. Khi branching cao, mỗi state có nhiều predecessor nên queue phình ra nhanh, và mỗi expected update (cần trong stochastic case) phải xét nhiều next state, trong đó nhiều transition có xác suất rất nhỏ — tốn tính toán mà ít đóng góp. Đây chính là động cơ ưa chuộng sample updates / small backups. A, C, D đều mô tả sai cơ chế.

</details>

---

## 8.5 Expected vs. Sample Updates

**Câu 30.** Ba chiều nhị phân (binary dimensions) của one-step updates là gì?

- A. On-policy/off-policy, episodic/continuing, và discounted/undiscounted.
- B. Tabular/approximate, deterministic/stochastic, và forward/backward.
- C. (1) State value hay action value; (2) ước lượng cho optimal policy hay policy cho trước; (3) expected update hay sample update.
- D. Selection, expansion, và backup của một vòng lặp planning.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Ba chiều: (1) cập nhật state value hay action value; (2) ước lượng cho optimal policy hay arbitrary given policy; (3) expected update (xét mọi sự kiện có thể) hay sample update (xét một mẫu). Ba chiều này tạo ra tám trường hợp, bảy trong số đó tương ứng với thuật toán cụ thể (Figure 8.6). A, B, D là các nhóm chiều khác không phải nội dung mục này.

</details>

---

**Câu 31.** Với branching factor b (số next state có thể có với xác suất dương), một expected update cần lượng tính toán bằng bao nhiêu lần một sample update?

- A. Bằng nhau, vì cả hai đều cập nhật cùng một state–action pair.
- B. Khoảng b lần, vì nó xét tất cả b next state thay vì chỉ một.
- C. Khoảng b² lần, do phải xét mọi cặp (next state, reward).
- D. Khoảng log(b) lần, nhờ cấu trúc cây của các next state.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Lượng tính toán thường bị chi phối bởi số state–action pair tại đó Q được đánh giá. Một expected update của một pair cần khoảng b lần lượng tính toán của một sample update, vì nó xét tất cả b next state thay vì chỉ một. C, D sai về độ phức tạp.

</details>

---

**Câu 32.** Theo phân tích (Figure 8.7), khi nào sample updates được ưa chuộng hơn expected updates?

- A. Khi có đủ thời gian để hoàn thành một expected update đầy đủ.
- B. Khi environment hoàn toàn deterministic nên branching factor không quan trọng.
- C. Khi branching factor b = 1, lúc đó hai loại update trùng nhau.
- D. Khi không đủ thời gian hoàn thành expected update — đặc biệt với b lớn và quá nhiều state; sample updates cải thiện được value với ít hơn b update.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Nếu đủ thời gian hoàn thành expected update thì kết quả thường tốt hơn b sample updates (không có sampling error). Nhưng nếu không đủ thời gian, sample updates luôn được ưa chuộng vì ít nhất cũng cải thiện value với ít hơn b update. Với bài toán lớn nhiều state và branching factor lớn, ta thường ở tình huống sau. A mô tả khi expected tốt hơn; B, C là các trường hợp đặc biệt không phải tiêu chí chính.

</details>

---

**Câu 33.** Phát biểu nào về Dyna-Q và prioritized sweeping trong khía cạnh expected vs. sample updates là đúng?

- A. Cả Dyna-Q và prioritized sweeping đều luôn dùng sample updates trong mọi trường hợp.
- B. Dyna-Q dùng q* expected updates, còn prioritized sweeping dùng sample updates.
- C. Dyna-Q dùng q* sample updates (cũng có thể dùng expected); với stochastic problems, prioritized sweeping luôn dùng một loại expected update.
- D. Prioritized sweeping luôn dùng sample updates còn Dyna-Q luôn dùng expected updates.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Dyna-Q dùng q* sample updates, nhưng cũng có thể dùng q* expected updates hoặc expected/sample qπ updates. Với stochastic problems, prioritized sweeping luôn được thực hiện bằng một trong các expected updates. A, B, D đều mô tả sai sự kết hợp này.

</details>

---

**Câu 34.** [Khó] Một bài toán có branching factor b = 100 và bạn có ngân sách tính toán đủ cho đúng 100 sample updates. Bạn nên dùng ngân sách đó cho một expected update của một pair, hay 100 sample updates trải trên nhiều pair? Suy luận theo Figure 8.7.

- A. Một expected update, vì nó luôn cho giá trị chính xác hơn bất kỳ tập sample updates nào.
- B. 100 sample updates trải rộng, vì với b lớn, error của một backup giảm rất mạnh chỉ với một phần nhỏ của b mẫu, nên phân bổ tính toán sang nhiều pair khác có lợi hơn.
- C. Một expected update, vì 100 sample updates trên cùng một pair sẽ chỉ tái tạo đúng expected update đó.
- D. Không quan trọng, vì với cùng ngân sách 100 phép tính, hai cách cho kết quả y hệt nhau.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Figure 8.7 cho thấy với b moderately large, sai số của một backup giảm theo cỡ √((b−1)/(bt)) sau t mẫu — phần lớn lợi ích đạt được sớm, với t nhỏ hơn b nhiều. Do đó, dồn cả 100 mẫu vào một pair để hoàn tất một expected update là lãng phí; trải sample updates qua nhiều pair (mỗi pair vài mẫu) cập nhật được nhiều value hơn và lan truyền nhanh hơn. A bỏ qua chi phí cơ hội; C hiểu sai (không cùng pair); D sai vì sample updates còn cập nhật các pair khác.

</details>

---

## 8.6 Trajectory Sampling

**Câu 35.** *Trajectory sampling* là gì?

- A. Thực hiện một sweep đầy đủ qua toàn bộ state space, mỗi state đúng một lần mỗi sweep.
- B. Mô phỏng các trajectory cá thể theo current policy (model cấp transition, policy cấp action), rồi update tại các state/pair gặp dọc đường — phân phối update theo on-policy distribution.
- C. Chọn state–action pair uniformly ngẫu nhiên để phân phối update đều khắp state space.
- D. Update các pair theo thứ tự ưu tiên trong một priority queue dựa trên độ thay đổi value.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Trajectory sampling: mô phỏng các trajectory cá thể tường minh và thực hiện update tại các state/state–action pair gặp dọc theo. Transition và reward do model cấp, action do current policy cấp — qua đó phân phối update theo on-policy distribution. Đây gần như là cách hiệu quả duy nhất để phân phối update theo on-policy distribution. A là exhaustive sweep, C là uniform sampling, D là prioritized sweeping.

</details>

---

**Câu 36.** Theo thí nghiệm (Figure 8.8), so sánh on-policy distribution và uniform distribution của update cho thấy điều gì?

- A. On-policy distribution luôn vượt trội uniform distribution ở mọi giai đoạn của quá trình planning.
- B. Uniform distribution luôn nhanh hơn on-policy distribution nhờ bao phủ đều state space.
- C. On-policy nhanh hơn ở giai đoạn đầu nhưng chậm hơn về lâu dài; hiệu ứng mạnh hơn với branching factor nhỏ và số state lớn.
- D. Hai cách phân phối luôn cho kết quả giống hệt nhau bất kể branching factor.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Trong mọi trường hợp, sampling theo on-policy distribution cho planning nhanh hơn ở giai đoạn đầu nhưng chậm lại về lâu dài. Hiệu ứng mạnh hơn và giai đoạn nhanh ban đầu dài hơn với branching factor nhỏ và khi số state tăng. Ngắn hạn: tập trung vào state gần con cháu của start state có lợi; dài hạn: các state thường gặp đã có value đúng nên sampling chúng vô ích. A, B, D đều bỏ qua sự đảo chiều theo thời gian.

</details>

---

**Câu 37.** [Khó] Theo phân tích trajectory sampling, vì sao lợi thế ban đầu của on-policy distribution lại biến mất (và thậm chí đảo chiều) về lâu dài?

- A. Vì on-policy distribution thay đổi liên tục khi policy cải thiện, làm các update trở nên không nhất quán.
- B. Vì các state được on-policy thường xuyên ghé thăm dần đã có value chính xác, nên tiếp tục update chúng tốn công mà không cải thiện, trong khi các state ít gặp vẫn bị bỏ ngỏ.
- C. Vì về lâu dài branching factor tăng lên khiến on-policy update trở nên đắt đỏ hơn uniform.
- D. Vì uniform distribution dần học được on-policy distribution rồi vượt qua nó.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Ban đầu, tập trung vào các state gần start state (mà policy hay ghé) lan truyền value hữu ích nhanh. Nhưng khi các state thường gặp đã hội tụ giá trị, việc lặp lại update chúng gần như vô ích; lúc này uniform — vốn cũng chạm tới các state ít gặp còn sai value — bắt kịp rồi vượt lên. A, C, D đều không phải nguyên nhân theo sách.

</details>

---

## 8.7 Real-time Dynamic Programming

**Câu 38.** RTDP (Real-time Dynamic Programming) là gì?

- A. Một phiên bản sweep-based của policy iteration chạy đồng bộ trên toàn state space.
- B. Một phiên bản on-policy trajectory-sampling của value iteration, update state ghé thăm bằng expected value-iteration update; là một asynchronous DP algorithm.
- C. Một thuật toán Monte Carlo control dùng simulated trajectory từ start state.
- D. Một thuật toán prioritized sweeping dùng priority queue cho các state thay đổi.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — RTDP là phiên bản on-policy trajectory-sampling của value iteration. Nó update value của các state ghé thăm trong trajectory thực hoặc mô phỏng bằng expected tabular value-iteration update. RTDP là một ví dụ của asynchronous DP — update theo thứ tự các state được ghé thăm trong trajectory. A, C, D mô tả các thuật toán khác.

</details>

---

**Câu 39.** Kết quả thú vị nhất của RTDP đối với một số loại bài toán là gì?

- A. Nó luôn cần ghé thăm mọi state vô hạn lần để đảm bảo hội tụ về optimal.
- B. Nó luôn chậm hơn conventional sweep-based DP do chi phí mô phỏng trajectory.
- C. Nó chỉ áp dụng được cho deterministic problem với absorbing goal states.
- D. Nó tìm ra optimal policy trên các relevant state mà không cần ghé thăm mọi state vô hạn lần, thậm chí không ghé thăm một số state nào cả.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Với một số loại bài toán thỏa điều kiện hợp lý (undiscounted episodic tasks, absorbing goal states sinh reward bằng 0...), RTDP được đảm bảo tìm policy tối ưu trên các relevant state mà không cần ghé thăm mọi state vô hạn lần, thậm chí không ghé thăm một số state. Trong ví dụ Racetrack, RTDP chỉ cần ~50% lượng update so với value iteration sweep-based. A, B, C đều sai về tính chất RTDP.

</details>

---

**Câu 40.** Đối với bài toán control, một *optimal partial policy* là gì?

- A. Một policy chỉ tối ưu trong khoảng một nửa thời gian agent tương tác.
- B. Một policy chỉ dùng được cho prediction problem chứ không cho control problem.
- C. Một policy tối ưu cho relevant state, có thể chỉ định action tùy ý/undefined cho irrelevant state (state không đạt tới bởi bất kỳ optimal policy nào).
- D. Một policy chỉ định một action xác định cho mọi state trong toàn bộ MDP.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Optimal partial policy là policy tối ưu cho các relevant state nhưng có thể chỉ định action tùy ý hoặc undefined cho irrelevant state. Irrelevant state là những state không thể đạt tới bởi bất kỳ optimal policy nào từ bất kỳ start state nào. A, B, D đều hiểu sai khái niệm.

</details>

---

**Câu 41.** [Khó] Vì sao RTDP có thể tìm optimal partial policy mà không cần update một số state, trong khi conventional value iteration bắt buộc phải sweep qua mọi state?

- A. Vì RTDP dùng sample updates rẻ hơn nên có thể bỏ qua state mà vẫn đúng.
- B. Vì RTDP chỉ update các state thực sự ghé thăm dọc on-policy trajectory; irrelevant state không bao giờ xuất hiện trên trajectory của một (gần) optimal policy nên không cần value đúng.
- C. Vì conventional value iteration tính sai value cho irrelevant state nên phải lặp lại nhiều lần.
- D. Vì RTDP yêu cầu một distribution model đầy đủ còn value iteration thì không.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — RTDP đi theo các on-policy trajectory và chỉ update các state ghé thăm. Khi policy hội tụ về optimal, các trajectory chỉ đi qua relevant state; irrelevant state (không đạt tới bởi optimal policy nào) không bao giờ xuất hiện nên value của chúng không cần đúng để policy là tối ưu trên các state liên quan. Conventional value iteration không phân biệt nên phải sweep tất cả. A sai (RTDP dùng expected updates); C, D sai về cơ chế.

</details>

---

## 8.8 Planning at Decision Time

**Câu 42.** *Background planning* khác với *decision-time planning* như thế nào?

- A. Background planning tập trung vào current state, decision-time planning thì lan tỏa qua mọi state.
- B. Background planning dùng simulated experience để dần cải thiện policy/value (không tập trung current state); decision-time planning bắt đầu và hoàn thành sau khi gặp mỗi state St, output là chọn một action At, tập trung vào current state.
- C. Hai loại planning hoàn toàn giống nhau, chỉ khác tên gọi theo ngữ cảnh ứng dụng.
- D. Decision-time planning luôn yêu cầu một distribution model còn background planning chỉ cần sample model.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Background planning (như DP, Dyna) dùng simulated experience để dần cải thiện policy/value function, không tập trung vào current state. Decision-time planning bắt đầu và hoàn thành sau khi gặp mỗi state mới St, output là chọn một action At, tập trung vào current state; value/policy tạo ra thường bị loại bỏ sau khi dùng. A đảo ngược; C, D sai.

</details>

---

**Câu 43.** Decision-time planning hữu ích nhất trong loại ứng dụng nào?

- A. Ứng dụng đòi hỏi phản hồi với latency cực thấp trong từng mili-giây.
- B. Ứng dụng deterministic đơn giản với state space rất nhỏ.
- C. Ứng dụng mà phản hồi nhanh không bắt buộc (ví dụ chương trình chơi cờ, được phép vài giây/phút cho mỗi nước đi).
- D. Ứng dụng hoàn toàn không có model nào của environment.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Decision-time planning hữu ích nhất khi không yêu cầu phản hồi nhanh — ví dụ chương trình chơi cờ được phép vài giây hoặc vài phút mỗi nước. Ngược lại, nếu ưu tiên chọn action với latency thấp (trường hợp A) thì nên dùng background planning để tính sẵn policy áp dụng nhanh. B, D không phải đặc trưng phân biệt.

</details>

---

## 8.9 Heuristic Search

**Câu 44.** Heuristic search hoạt động như thế nào?

- A. Lưu lại mọi backed-up value để cập nhật value function một cách vĩnh viễn sau mỗi state.
- B. Sampling các trajectory theo on-policy distribution rồi lấy trung bình return.
- C. Thực hiện expected update cho mọi state trong toàn bộ state space ở mỗi bước.
- D. Với mỗi state gặp phải, xây cây lớn các khả năng tiếp theo; áp dụng approximate value lên leaf node, back up về root, chọn action tốt nhất rồi loại bỏ các backed-up value.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Trong heuristic search, với mỗi state gặp phải, một cây lớn các khả năng tiếp theo được xét. Approximate value function áp dụng lên leaf node rồi back up về current state ở root (giống expected update với max cho v* và q*). Chọn action tốt nhất rồi mọi backed-up value bị loại bỏ; thông thường value function không bị thay đổi. A sai (value bị loại bỏ); B là rollout/trajectory sampling; C là DP.

</details>

---

**Câu 45.** Theo sách, vì sao tìm kiếm sâu hơn một bước thường cho action selection tốt hơn?

- A. Vì nó dùng các multistep update thực sự thay cho one-step update.
- B. Vì nó luôn nhanh hơn và tiết kiệm tính toán hơn so với tìm kiếm nông.
- C. Nếu model hoàn hảo nhưng value function không hoàn hảo, tìm sâu hơn thường cho policy tốt hơn; tìm tới hết episode thì ảnh hưởng của value không hoàn hảo bị loại bỏ và action là tối ưu.
- D. Vì nó không cần đến model của environment để đánh giá leaf node.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Nếu có model hoàn hảo và action-value function không hoàn hảo, tìm kiếm sâu hơn thường cho policy tốt hơn. Nếu tìm tới hết episode thì ảnh hưởng của value function không hoàn hảo bị loại bỏ và action là tối ưu. Tuy nhiên tìm sâu hơn cần nhiều tính toán hơn, thường làm thời gian phản hồi chậm hơn (ví dụ TD-Gammon của Tesauro). A, B, D đều sai.

</details>

---

**Câu 46.** Theo sách, lý do chính khiến heuristic search hiệu quả là gì?

- A. Vì nó tập trung mạnh các update, bộ nhớ và tài nguyên tính toán vào current state và các successor có khả năng theo sau ngay — không phải vì bản chất multistep của update.
- B. Vì nó dùng multistep update thay vì one-step update nên chính xác hơn.
- C. Vì nó lưu lại và tái sử dụng mọi value đã tính trong các lần search trước.
- D. Vì nó luôn tìm kiếm tới tận hết episode nên loại bỏ mọi sai số.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Bất kỳ state-space search nào cũng có thể xem như ghép nối nhiều one-step update. Sự cải thiện khi tìm kiếm sâu hơn không phải do dùng multistep update, mà do sự tập trung các update vào các state và action ngay sau current state. Việc tập trung mạnh bộ nhớ và tính toán vào quyết định hiện tại là lý do heuristic search hiệu quả. B, C, D đều không phải lý do chính theo sách.

</details>

---

## 8.10 Rollout Algorithms

**Câu 47.** Rollout algorithms là gì?

- A. Các background planning algorithm dựa trên dynamic programming trên toàn state space.
- B. Các thuật toán prioritized sweeping dùng priority queue để chọn update.
- C. Các thuật toán expected update toàn cục duy trì value function lâu dài.
- D. Các decision-time planning algorithm dựa trên Monte Carlo control áp dụng lên các simulated trajectory đều bắt đầu từ current state; ước lượng action value bằng cách trung bình return.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Rollout algorithms là decision-time planning algorithms dựa trên Monte Carlo control áp dụng lên các simulated trajectory đều bắt đầu từ current state. Chúng ước lượng action value cho một policy bằng cách trung bình return của nhiều trajectory bắt đầu với mỗi action có thể rồi theo policy đó (rollout policy). A, B, C mô tả các họ thuật toán khác.

</details>

---

**Câu 48.** Mục tiêu của một rollout algorithm là gì?

- A. Ước lượng đầy đủ optimal action-value function q* cho mọi state trong MDP.
- B. Cải thiện so với rollout policy (không phải tìm optimal policy); theo policy improvement theorem, chọn action ở current state cực đại hóa ước lượng q rồi sau đó theo π.
- C. Tìm complete action-value function qπ cho policy cho trước trên toàn state space.
- D. Lưu trữ lâu dài value và policy để tái sử dụng cho mọi state về sau.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Mục tiêu của rollout algorithm là cải thiện so với rollout policy, không phải tìm optimal policy. Theo policy improvement theorem, policy chọn action ở current state làm cực đại ước lượng qπ(s, a') rồi sau đó theo π là một ứng viên cải thiện π — giống một bước của policy iteration (thực ra giống một bước asynchronous value iteration vì chỉ đổi action cho current state). A, C, D đều sai về mục tiêu của rollout.

</details>

---

**Câu 49.** Phát biểu nào về tradeoff của rollout policy là đúng?

- A. Rollout policy tốt hơn luôn cho kết quả tốt hơn mà không phát sinh thêm chi phí nào.
- B. Rollout policy ngẫu nhiên luôn cho performance tệ và không bao giờ dùng được trong thực tế.
- C. Rollout algorithms duy trì bộ nhớ value lâu dài hệt như các learning algorithm.
- D. Rollout policy tốt hơn thường cho policy cải thiện tốt hơn nhưng cần nhiều thời gian mô phỏng hơn; là decision-time method nên phải đáp ứng ràng buộc thời gian nghiêm ngặt.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Có tradeoff quan trọng: rollout policy tốt hơn thường cho policy cải thiện tốt hơn nhưng cần nhiều thời gian hơn để mô phỏng đủ trajectory. Là decision-time method, rollout phải đáp ứng ràng buộc thời gian nghiêm ngặt. (Trong một số ứng dụng, rollout policy hoàn toàn ngẫu nhiên vẫn cho performance tốt — nên B sai.) A bỏ qua chi phí; C sai vì rollout không lưu value lâu dài.

</details>

---

**Câu 50.** [Khó] Theo sách, rollout algorithm "giống một bước của policy iteration", nhưng vì sao nó vẫn không được xem là learning algorithm theo nghĩa thông thường?

- A. Vì nó dùng expected updates thay vì sample updates nên không phải learning.
- B. Vì nó không lưu giữ lâu dài value hay policy: các value Monte Carlo ước lượng cho current state bị loại bỏ sau khi chọn action, không tích lũy thành một approximate value function.
- C. Vì nó không bao giờ dùng policy improvement, chỉ thuần đánh giá policy cố định.
- D. Vì nó yêu cầu một distribution model đầy đủ thay vì học từ experience.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Rollout là decision-time planning: nó dùng Monte Carlo để ước lượng qπ cho các action tại current state, rồi áp dụng một bước policy improvement cục bộ cho riêng state đó. Tuy nhiên các ước lượng này bị loại bỏ ngay sau khi chọn action — không có value function/policy được tích lũy và cải thiện dần qua thời gian như learning algorithm. A sai (rollout dùng sample/Monte Carlo); C sai (nó có dùng improvement); D sai (chỉ cần sample model).

</details>

---

## 8.11 Monte Carlo Tree Search

**Câu 51.** MCTS về cơ bản là gì, và nó cải tiến rollout algorithm như thế nào?

- A. Là một phiên bản của value iteration chạy trên toàn bộ state space.
- B. Là background planning dùng distribution model để sweep mọi state.
- C. Về cơ bản là một rollout algorithm, được tăng cường bằng cách tích lũy value estimate từ các Monte Carlo simulation để lần lượt hướng simulation về các trajectory có reward cao hơn.
- D. Là một phiên bản của prioritized sweeping dùng priority queue cho các node cây.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — MCTS ở cơ sở là một rollout algorithm, nhưng được tăng cường bằng phương tiện tích lũy value estimate từ Monte Carlo simulation để lần lượt hướng simulation về các trajectory có reward cao hơn. MCTS chịu trách nhiệm chính cho bước nhảy của computer Go (và phiên bản trong AlphaGo). A, B, D mô tả các thuật toán khác.

</details>

---

**Câu 52.** Bốn bước của một vòng lặp cơ bản trong MCTS là gì?

- A. Initialization, Selection, Update, Termination.
- B. Selection, Expansion, Simulation, Backup.
- C. Sampling, Backup, Pruning, Selection.
- D. Exploration, Exploitation, Backup, Discard.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Mỗi vòng lặp gồm bốn bước: (1) Selection — dùng tree policy đi từ root tới một leaf node; (2) Expansion — mở rộng cây từ leaf node bằng cách thêm child node qua unexplored action; (3) Simulation — mô phỏng một episode đầy đủ từ node được chọn với rollout policy; (4) Backup — return của episode được back up để cập nhật/khởi tạo action value gắn với các edge mà tree policy đã đi qua. A, C, D không đúng tên các bước.

</details>

---

**Câu 53.** Trong MCTS, sự khác biệt giữa *tree policy* và *rollout policy* là gì?

- A. Tree policy dùng cho các state bên ngoài cây; rollout policy dùng cho các state bên trong cây.
- B. Tree policy là policy có thông tin dùng bên trong cây (cân bằng exploration/exploitation, ví dụ ε-greedy hoặc UCB); rollout policy là policy đơn giản dùng bên ngoài cây và tại leaf node.
- C. Hai policy này giống hệt nhau, chỉ khác tên theo vị trí áp dụng.
- D. Tree policy luôn chọn ngẫu nhiên, còn rollout policy luôn chọn greedy theo value.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Bên trong cây, ta có value estimate cho ít nhất một số action nên dùng một informed policy gọi là tree policy (cân bằng exploration/exploitation, ví dụ ε-greedy hoặc UCB). Bên ngoài cây và tại leaf node, action được chọn bằng rollout policy (policy đơn giản). A đảo ngược; C, D sai.

</details>

---

**Câu 54.** Trong bước Backup của MCTS, value được lưu lại cho những node nào?

- A. Cho mọi state và action trong trajectory mô phỏng, kể cả phần rollout policy đi qua bên ngoài cây.
- B. Chỉ cho leaf node được chọn trong bước Selection của vòng lặp đó.
- C. Cho mọi state trong toàn bộ state space của bài toán.
- D. Chỉ cập nhật/khởi tạo action value gắn với các edge của cây mà tree policy đã đi qua trong vòng lặp đó; không lưu value cho state/action mà rollout policy ghé thăm bên ngoài cây.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Return của episode mô phỏng được back up để cập nhật/khởi tạo action value gắn với các edge của cây mà tree policy đã đi qua trong vòng lặp này. Không lưu value nào cho các state và action mà rollout policy ghé thăm bên ngoài cây. A, B, C đều mô tả phạm vi backup sai.

</details>

---

**Câu 55.** Sau khi MCTS chạy xong các vòng lặp, action thực sự được chọn ở root như thế nào?

- A. Chọn ngẫu nhiên trong các action khả dĩ từ root để duy trì exploration.
- B. Luôn chọn action đầu tiên được expand trong cây.
- C. Theo cơ chế dựa trên thống kê tích lũy trong cây — ví dụ action có action value lớn nhất, hoặc action có visit count lớn nhất (để tránh chọn outlier).
- D. Dùng một expected update tại root để chọn action tối ưu.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Sau khi hết thời gian/tài nguyên, một action từ root được chọn theo cơ chế phụ thuộc vào thống kê tích lũy trong cây — ví dụ action có action value lớn nhất trong các action từ root state, hoặc action có visit count lớn nhất để tránh chọn outlier. A, B, D đều sai.

</details>

---

**Câu 56.** [Khó] Trong bước Selection của MCTS, tree policy thường dùng quy tắc kiểu UCB như a = argmax [Q(s,a) + c·√(ln N(s) / N(s,a))]. Số hạng thứ hai phục vụ vai trò gì, và điều gì xảy ra với một action có N(s,a) rất nhỏ?

- A. Số hạng thứ hai là discount factor; action có N(s,a) nhỏ bị giảm ưu tiên để tránh nhiễu.
- B. Số hạng thứ hai là exploration bonus tăng khi action ít được thử (N(s,a) nhỏ); nó ưu tiên các action chưa được khám phá nhiều, cân bằng exploration với exploitation.
- C. Số hạng thứ hai là phần thưởng tức thời; action có N(s,a) nhỏ luôn bị bỏ qua hoàn toàn.
- D. Số hạng thứ hai là sai số ước lượng cần tối thiểu hóa; nó khiến tree policy chọn action có visit count lớn nhất.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Số hạng √(ln N(s) / N(s,a)) là exploration bonus: khi một action ít được thử (N(s,a) nhỏ), bonus lớn nên action đó được ưu tiên thử; khi nó đã được thử nhiều, bonus co lại và lựa chọn nghiêng về Q(s,a) (exploitation). Đây là cách UCB cân bằng explore/exploit bên trong cây. A, C, D đều hiểu sai vai trò số hạng này.

</details>

---

**Câu 57.** Theo cách giải thích của sách, MCTS tận dụng các nguyên lý RL nào?

- A. Nó dùng một distribution model đầy đủ và exhaustive sweep qua state space.
- B. Nó duy trì một approximate value function toàn cục cố định giống như dynamic programming.
- C. Nó hưởng lợi từ ước lượng value online, incremental, sample-based và policy improvement; lưu action-value estimate gắn với edge của cây, cập nhật bằng sample updates, mở rộng cây dần như lookup table lưu một phần action-value function.
- D. Nó không dựa trên bất kỳ nguyên lý RL nào mà chỉ là tìm kiếm cây thuần túy.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — MCTS là decision-time planning dựa trên Monte Carlo control từ root state, nên hưởng lợi từ ước lượng value online, incremental, sample-based và policy improvement. Nó lưu action-value estimate gắn với edge của cây và cập nhật bằng sample updates, tập trung các Monte Carlo trial vào các trajectory có return cao; mở rộng cây dần như lookup table lưu một phần action-value function — tránh việc xấp xỉ action-value function toàn cục. A, B, D đều sai.

</details>

---

## 8.12 Summary of the Chapter

**Câu 58.** Vì sao dynamic programming cần một distribution model còn các RL method (sample updates) chỉ cần sample model?

- A. Vì DP dùng expected updates (tính kỳ vọng trên mọi next state và reward có thể), còn sample model là thứ cần để mô phỏng tương tác và dùng sample updates.
- B. Vì DP chỉ áp dụng được cho deterministic environment nên cần model đầy đủ.
- C. Vì sample model luôn mạnh hơn distribution model về mặt thông tin chứa đựng.
- D. Vì DP không dùng value function nên cần model để ra quyết định trực tiếp.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — DP cần distribution model vì nó dùng expected updates, vốn liên quan đến việc tính kỳ vọng trên mọi next state và reward có thể. Sample model là thứ cần để mô phỏng tương tác với environment, trong đó các sample updates (như nhiều RL algorithm dùng) có thể được áp dụng. Sample models nhìn chung dễ thu được hơn distribution models. B, C, D đều sai.

</details>

---

**Câu 59.** Theo summary, hai chiều biến đổi quan trọng giữa các state-space planning methods được nhấn mạnh là gì?

- A. On-policy/off-policy và episodic/continuing.
- B. Deterministic/stochastic và tabular/approximate.
- C. Số planning step n và step-size α.
- D. Kích thước (size) của update (càng nhỏ càng incremental, ví dụ one-step sample update của Dyna) và phân phối (focus) của update (prioritized sweeping focus backward, on-policy trajectory sampling focus theo policy).

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Một chiều là kích thước update — càng nhỏ thì planning càng incremental (nhỏ nhất là one-step sample update như trong Dyna). Chiều quan trọng khác là phân phối (focus) của update: prioritized sweeping focus backward lên predecessor của state vừa thay đổi value; on-policy trajectory sampling focus lên các state agent có khả năng gặp khi điều khiển environment (RTDP minh họa lợi thế này). A, B, C là các chiều khác không phải trọng tâm summary.

</details>

---

## 8.13 Summary of Part I: Dimensions

**Câu 60.** Ba ý tưởng chính chung của tất cả các method được khám phá trong Part I là gì?

- A. Distribution model, sample model, và planning.
- B. Tất cả đều (1) ước lượng value function; (2) hoạt động bằng cách backing up value dọc theo các trajectory thực hoặc có thể; (3) tuân theo chiến lược chung generalized policy iteration (GPI).
- C. Exploration, exploitation, và discounting.
- D. Selection, expansion, và backup.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Mọi method trong Part I có ba ý tưởng chung: thứ nhất, đều tìm cách ước lượng value function; thứ hai, đều backing up value dọc theo các state trajectory thực hoặc có thể; thứ ba, đều theo chiến lược chung generalized policy iteration (GPI) — duy trì approximate value function và approximate policy, liên tục cải thiện cái này dựa trên cái kia. A, C, D không phải ba ý tưởng chung này.

</details>

---

**Câu 61.** Hai chiều quan trọng nhất trong Figure 8.11 (slice qua không gian các RL method) là gì?

- A. On-policy vs off-policy và episodic vs continuing.
- B. Tabular vs function approximation và discounted vs undiscounted.
- C. Chiều ngang: width của update (sample updates dựa trên một sample trajectory vs expected updates dựa trên phân phối các trajectory); chiều dọc: depth (length) của update, tức mức độ bootstrapping.
- D. Model-based vs model-free và direct vs indirect.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Chiều ngang là width: sample updates (dựa trên một sample trajectory) vs expected updates (dựa trên phân phối các trajectory có thể) — expected cần distribution model, sample chỉ cần sample model hoặc real experience. Chiều dọc là depth (length) của update, tức mức độ bootstrapping. Ba góc của không gian là DP, TD và Monte Carlo; góc dưới-phải là exhaustive search. A, B, D là các chiều khác.

</details>

---

**Câu 62.** Trong Figure 8.11, dynamic programming và exhaustive search nằm ở đâu, và chiều thứ ba được nhấn mạnh là gì?

- A. DP ở góc trên-phải (one-step expected updates), exhaustive search ở góc dưới-phải (expected updates sâu tới terminal state); chiều thứ ba là on-policy vs off-policy.
- B. DP ở góc dưới-trái, exhaustive search ở góc trên-trái; chiều thứ ba là tabular vs approximate.
- C. Cả hai ở cùng một góc; chiều thứ ba là deterministic vs stochastic.
- D. DP ở giữa, exhaustive search ở góc trên-trái; chiều thứ ba là discounted vs undiscounted.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — DP ở góc trên-phải vì dùng one-step expected updates. Góc dưới-phải là exhaustive search — expected updates sâu chạy tới tận terminal state. Chiều thứ ba được nhấn mạnh là phân biệt nhị phân on-policy vs off-policy (vuông góc với mặt phẳng của trang). Chiều quan trọng nhất chưa nhắc tới trong Part I là function approximation (khám phá ở Part II). B, C, D đều đặt sai vị trí/chiều.

</details>

---

**Câu 63.** [Khó] Một thuật toán dùng update vừa "sâu" (depth lớn, ít bootstrapping, chạy tới gần terminal state) vừa "rộng" (expected, xét phân phối mọi nhánh) sẽ tương ứng với góc nào trong Figure 8.11, và yêu cầu thực tế nào khiến nó hiếm khi khả thi cho bài toán lớn?

- A. Góc trên-trái (Monte Carlo); yêu cầu phải có real environment để sampling.
- B. Góc trên-phải (DP một bước); yêu cầu phải có policy cố định để đánh giá.
- C. Góc dưới-phải (exhaustive search); yêu cầu một distribution model đầy đủ và chi phí tính toán bùng nổ theo branching factor lũy thừa độ sâu.
- D. Góc dưới-trái (TD); yêu cầu step-size α giảm dần về 0 theo thời gian.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Update vừa sâu (tới terminal) vừa rộng (expected, mọi nhánh) chính là exhaustive search ở góc dưới-phải của Figure 8.11. Nó cần distribution model và phải khai triển toàn bộ cây khả năng; với branching factor b và độ sâu d, chi phí cỡ b^d — bùng nổ tổ hợp nên bất khả thi cho bài toán lớn. Đây là lý do RL thực tế phải dùng bootstrapping (giảm depth) và/hoặc sampling (giảm width). A, B, D đặt sai góc và sai yêu cầu.

</details>
