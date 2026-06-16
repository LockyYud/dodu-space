# Chương 16: Applications and Case Studies — Câu hỏi trắc nghiệm

> Bộ câu hỏi ôn tập chi tiết cho Chương 16, sách *Reinforcement Learning: An Introduction* (Sutton & Barto, 2nd ed.)

## 16.1 TD-Gammon

**Câu 1.** Thuật toán học của TD-Gammon là sự kết hợp của những thành phần nào?

- A. TD(lambda) kết hợp nonlinear function approximation dùng multilayer ANN, huấn luyện bằng backpropagating TD errors.
- B. Q-learning kết hợp lookup table đầy đủ, cập nhật value bằng sample backups off-policy.
- C. Monte Carlo Tree Search kết hợp value network sâu, đánh giá leaf bằng rollout ngẫu nhiên.
- D. Policy gradient kết hợp supervised pretraining từ corpus nước đi chuyên gia con người.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — TD-Gammon dùng dạng nonlinear của TD(lambda), với hàm giá trị xấp xỉ bằng một multilayer ANN tiêu chuẩn, gradient tính bằng error backpropagation. B sai vì số trạng thái backgammon quá lớn để dùng lookup table. C và D mô tả các phương pháp xuất hiện muộn hơn (AlphaGo, học từ dữ liệu người) chứ không phải TD-Gammon.

</details>

---

**Câu 2.** Giá trị ước lượng v̂(s,w) của một trạng thái trong TD-Gammon biểu diễn điều gì, và reward được định nghĩa ra sao?

- A. Số quân cờ còn lại trên bàn; reward bằng số quân ăn được ở mỗi lượt đi.
- B. Khoảng cách tới đích của các quân; reward âm mỗi bước để khuyến khích kết thúc nhanh.
- C. Xác suất thắng (probability of winning) bắt đầu từ s; reward bằng 0 ở mọi bước trừ bước thắng.
- D. Điểm số dự kiến của ván; reward là chênh lệch điểm giữa hai bước thời gian liên tiếp.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — v̂(s,w) ước lượng xác suất thắng từ trạng thái s. Để đạt được điều này, reward được đặt bằng 0 ở mọi bước thời gian trừ bước mà ván cờ được thắng. Các phương án còn lại mô tả những reward thiết kế thủ công không khớp với mục tiêu "xác suất thắng".

</details>

---

**Câu 3.** TD-Gammon lấy nguồn ván cờ để học từ đâu?

- A. Từ self-play — chương trình tự đấu với chính nó để tạo ra chuỗi ván cờ vô tận.
- B. Từ một corpus lớn các ván đấu của chuyên gia được con người chú thích nước đi.
- C. Từ việc chơi trực tuyến liên tục với nhiều grandmaster backgammon con người.
- D. Từ một cơ sở dữ liệu các thế cờ khai cuộc chuẩn được biên soạn trước.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Tesauro thu được chuỗi ván cờ vô tận bằng cách cho người chơi học của mình tự đấu với chính nó (self-play). TD-Gammon thực hiện nước đi cho cả hai bên, mỗi ván xử lý như một episode. Phương án B mô tả Neurogammon (chương trình trước của Tesauro), không phải TD-Gammon.

</details>

---

**Câu 4.** Để chọn nước đi, TD-Gammon đánh giá khoảng 20 cách chơi xúc xắc cùng các vị trí kết quả. Các vị trí kết quả này được gọi là gì trong sách?

- A. Belief states — trạng thái niềm tin xác suất trên các vị trí có thể.
- B. Afterstates — trạng thái sau khi agent đã thực hiện nước đi.
- C. Rollout states — trạng thái trung gian sinh ra trong quá trình mô phỏng.
- D. Q-values — giá trị action-value cho từng cặp trạng thái–hành động.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Các vị trí kết quả là afterstates (như thảo luận ở Section 6.8). Mạng được tham vấn để ước lượng giá trị từng afterstate, rồi chọn nước dẫn tới vị trí có giá trị ước lượng cao nhất. Afterstate hữu ích vì nhiều nước đi khác nhau có thể dẫn tới cùng một vị trí.

</details>

---

**Câu 5.** Tại sao kết quả của TD-Gammon 0.0 (chơi ngang ngửa các chương trình tốt nhất trước đó) lại đáng kinh ngạc?

- A. Vì nó chạy trên phần cứng yếu hơn nhiều so với các chương trình đối thủ.
- B. Vì nó được huấn luyện hoàn tất chỉ trong vài giờ đồng hồ.
- C. Vì nó hoàn toàn không sử dụng mạng nơ-ron nào trong quá trình học.
- D. Vì các chương trình mạnh trước đó đều dựa nhiều vào kiến thức backgammon chuyên biệt, còn TD-Gammon 0.0 gần như không có kiến thức backgammon nào.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — TD-Gammon 0.0 (với input gần như "raw") được xây dựng với gần như zero kiến thức backgammon, vậy mà sánh ngang Neurogammon — chương trình của Tesauro dùng ANN nhưng huấn luyện trên corpus nước đi mẫu của chuyên gia. Đây là minh chứng cho tiềm năng của phương pháp self-play. C sai vì TD-Gammon vẫn dùng ANN.

</details>

---

**Câu 6.** TD-Gammon 1.0 khác TD-Gammon 0.0 ở điểm nào, còn các phiên bản sau (2.0, 2.1, 3.x) bổ sung thêm gì?

- A. 1.0 chuyển sang Q-learning thuần; các phiên bản sau thêm experience replay để ổn định học.
- B. 1.0 thêm specialized backgammon features (giữ self-play TD); các phiên bản sau bổ sung selective multi-ply search.
- C. 1.0 từ bỏ self-play; các phiên bản sau quay lại dùng lookup table cho không gian trạng thái.
- D. 1.0 thay ANN bằng MCTS thuần; các phiên bản sau loại bỏ hoàn toàn hàm giá trị học được.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — TD-Gammon 1.0 thêm các đặc trưng backgammon chuyên biệt nhưng giữ phương pháp self-play TD. Phiên bản 2.0/2.1 thêm selective two-ply search, còn 3.0/3.1 dùng selective three-ply search — minh họa kết hợp learned value function với decision-time search như trong heuristic search và MCTS.

</details>

---

**Câu 7.** [Khó] Vì sao việc thêm decision-time search (multi-ply) vào các phiên bản TD-Gammon sau lại cải thiện chất lượng chơi, dù learned value function đã có sẵn?

- A. Vì search cho phép TD-Gammon thay thế hoàn toàn ANN bằng một bảng tra cứu nhỏ gọn hơn.
- B. Vì search loại bỏ nhu cầu self-play, giúp chương trình học chỉ từ một episode duy nhất.
- C. Vì search tinh chỉnh ước lượng tại nước đi bằng cách nhìn xa nhiều ply, bù phần sai số xấp xỉ của value function.
- D. Vì search chuyển bài toán từ off-policy sang on-policy, làm TD(lambda) hội tụ nhanh hơn.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Value function học được luôn có sai số xấp xỉ. Khi nhìn xa nhiều ply rồi mới áp value function ở các nút sâu hơn, hậu quả của nước đi được đánh giá chính xác hơn, làm nhẹ ảnh hưởng của sai số ước lượng cục bộ — đúng tinh thần kết hợp learning với decision-time search. Search không thay ANN (A), không bỏ self-play (B), cũng không đổi tính chất on/off-policy (D).

</details>

---

## 16.2 Samuel's Checkers Player

**Câu 8.** Hai phương pháp học chính của Samuel trong chương trình chơi cờ đam (checkers) là gì?

- A. Supervised learning từ ván mẫu và unsupervised clustering các thế cờ.
- B. Q-learning bảng tra cứu và policy gradient trên trọng số tuyến tính.
- C. Rote learning và "learning by generalization".
- D. Experience replay từ bộ nhớ ván và target network cố định định kỳ.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Samuel dùng rote learning (lưu mô tả mỗi thế cờ cùng backed-up value của nó) và learning by generalization (điều chỉnh tham số của value function — về khái niệm giống cách Tesauro làm sau này trong TD-Gammon). Các phương án còn lại là thuật ngữ RL hiện đại không thuộc công trình Samuel (1959).

</details>

---

**Câu 9.** Để khuyến khích chương trình đi theo con đường trực tiếp nhất tới thắng lợi, Samuel đã làm gì? Kỹ thuật này tương tự khái niệm nào trong RL hiện đại?

- A. Giảm giá trị một thế cờ một lượng nhỏ mỗi khi nó được back up một ply; tương tự discounting.
- B. Thêm reward dương lớn cho mỗi nước đi tiến gần thắng lợi; tương tự reward shaping.
- C. Tăng dần learning rate theo thời gian học để hội tụ nhanh; tương tự annealing.
- D. Xóa các thế cờ cũ ít gặp khỏi bộ nhớ để tiết kiệm; tương tự forgetting.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Samuel cho chương trình "a sense of direction" bằng cách giảm giá trị thế cờ một lượng nhỏ mỗi khi nó được back up lên một ply trong phân tích minimax. Ông thấy kỹ thuật giống discounting này thiết yếu cho việc học thành công. Các phương án còn lại mô tả những cơ chế khác mà Samuel không dùng.

</details>

---

**Câu 10.** Theo sách, thiếu sót cơ bản trong phương pháp learning by generalization của Samuel là gì?

- A. Nó tiêu tốn quá nhiều bộ nhớ lưu thế cờ nên không thể chạy trên phần cứng thời đó.
- B. Nó không có rewards và không xử lý đặc biệt terminal positions, nên value function có thể trở nên consistent một cách vô dụng (ví dụ gán hằng số cho mọi thế cờ).
- C. Nó không dùng minimax search nên không thể tìm ra các nước đi đủ tốt.
- D. Nó chỉ học được phần khai cuộc của ván mà bỏ sót hoàn toàn phần tàn cuộc.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Phương pháp của Samuel làm value function consistent với chính nó, nhưng thiếu cách neo value function vào giá trị thật của trạng thái (qua rewards hoặc xử lý terminal state). Như Samuel chỉ ra, value function có thể trở nên consistent chỉ bằng cách gán một giá trị hằng số cho mọi thế cờ. Ông cố ngăn điều này bằng trọng số cố định lớn cho piece-advantage, nhưng không cấm hẳn được.

</details>

---

**Câu 11.** [Khó] Vì sao việc thiếu reward và thiếu xử lý terminal position lại khiến value function của Samuel có thể "consistent một cách vô dụng"? Đây là phiên bản sơ khai của hiện tượng nào trong RL hiện đại?

- A. Vì thiếu reward khiến mạng overfit vào ván huấn luyện; đây là phiên bản sơ khai của high variance.
- B. Vì không có anchor từ reward/terminal, mọi hàm thỏa Bellman consistency đều hợp lệ kể cả hàm hằng — liên hệ với vấn đề bootstrap không có grounding (self-consistency mà không correctness).
- C. Vì terminal position bị bỏ qua nên minimax không kết thúc; đây là phiên bản sơ khai của infinite horizon.
- D. Vì thiếu reward làm step-size phân kỳ; đây là phiên bản sơ khai của deadly triad.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Bootstrap update buộc value của một state khớp với value của các state kế tiếp (self-consistency). Nếu không có reward hay giá trị terminal đúng để "neo" hệ phương trình, thì một hàm hằng số (mọi state cùng giá trị) cũng thỏa mãn consistency hoàn hảo mà chẳng dự đoán gì có ích. Đây là minh họa sớm rằng consistency không bằng correctness — phải có grounding từ reward/terminal. Các phương án còn lại nhầm sang variance, infinite horizon, hay deadly triad (vấn đề khác).

</details>

---

## 16.3 Watson's Daily-Double Wagering

**Câu 12.** Hệ thống Watson (chơi Jeopardy!) đã áp dụng phương pháp nào để học chiến lược đặt cược Daily-Double (DD)?

- A. Deep Q-network với experience replay và target network như DQN trên Atari.
- B. Phương pháp của TD-Gammon: nonlinear TD(lambda) với multilayer ANN huấn luyện bằng backpropagating TD errors, để học hàm giá trị v̂.
- C. Một contextual bandit đơn giản chọn mức cược tối đa hóa reward tức thời.
- D. Một thuật toán hoàn toàn mới, không liên quan và không vay mượn gì từ TD-Gammon.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Tesauro et al. điều chỉnh hệ thống TD-Gammon để học v̂(·,w): kết hợp nonlinear TD(lambda) với multilayer ANN, trọng số w huấn luyện bằng backpropagating TD errors qua nhiều ván mô phỏng. Trạng thái được biểu diễn bằng feature vectors thiết kế riêng cho Jeopardy!.

</details>

---

**Câu 13.** Khác biệt then chốt giữa cách Watson học hàm giá trị v̂ và cách TD-Gammon học là gì?

- A. TD-Gammon học bằng self-play, còn v̂ của Watson được học qua hàng triệu ván mô phỏng đấu với các mô hình con người được thiết kế cẩn thận.
- B. Watson dùng self-play còn TD-Gammon học từ dữ liệu ván người được chú thích.
- C. Watson hoàn toàn không dùng ANN, còn TD-Gammon dùng ANN nhiều lớp.
- D. Cả hai đều học bằng self-play thuần và về cơ bản không có khác biệt nào.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Khác với TD-Gammon học bằng self-play, v̂ của Watson được học qua hàng triệu ván mô phỏng đấu với các mô hình con người (Average Contestant, Champion, Grand Champion model). B đảo ngược sự thật; C sai vì Watson dùng ANN.

</details>

---

**Câu 14.** Tại sao self-play kiểu TD-Gammon KHÔNG được dùng để học v̂ của Watson?

- A. Vì luật chơi Jeopardy! cấm một thí sinh tự đấu với chính mình.
- B. Vì self-play tiêu tốn quá nhiều bộ nhớ để lưu các ván mô phỏng.
- C. Vì Watson khác mọi thí sinh người nên self-play sẽ khám phá vùng state space bất thường; hơn nữa Jeopardy! là game of imperfect information (đối thủ không biết độ tự tin của nhau theo category).
- D. Vì Jeopardy! quá đơn giản nên một bảng tra cứu nhỏ là đủ, không cần self-play.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Watson khác biệt quá nhiều so với thí sinh người nên self-play sẽ dẫn tới khám phá các vùng state space không điển hình khi đấu với người. Hơn nữa, Jeopardy! là game of imperfect information vì thí sinh không biết mức độ tự tin của đối thủ ở từng category — "giống như chơi poker với người cầm đúng bộ bài của bạn".

</details>

---

**Câu 15.** Khi tính action value q̂(s, bet) theo công thức (16.2), Watson chọn bet bằng cách tối đa hóa action value. Tuy nhiên Tesauro et al. đã điều chỉnh điều gì và vì sao?

- A. Họ luôn cược toàn bộ điểm (all-in) để tối đa hóa kỳ vọng thắng từng tình huống.
- B. Họ giảm rủi ro bằng cách trừ một phần nhỏ độ lệch chuẩn (standard deviation) qua các đánh giá đúng/sai, và cấm các bet làm giá trị afterstate-trả-lời-sai giảm dưới một ngưỡng.
- C. Họ không điều chỉnh gì, luôn chọn bet tối đa hóa action value thuần túy.
- D. Họ chuyển hoàn toàn sang Monte-Carlo trials cho mọi quyết định cược DD.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Tối đa hóa action value gây ra "a frightening amount of risk". Để giảm downside risk, họ trừ một phần nhỏ độ lệch chuẩn qua các đánh giá afterstate đúng/sai, và cấm các bet làm giá trị afterstate-trả-lời-sai giảm dưới một giới hạn. Điều này giảm nhẹ kỳ vọng thắng nhưng giảm đáng kể rủi ro cực đoan.

</details>

---

**Câu 16.** [Khó] Vì sao việc tối đa hóa action value q̂ trực tiếp lại tạo ra "lượng rủi ro đáng sợ", trong khi q̂ về lý thuyết đã là kỳ vọng thắng cuối cùng?

- A. Vì q̂ là kỳ vọng (trung bình) nên hai bet có cùng kỳ vọng vẫn có thể có phương sai rất khác — bet tối ưu kỳ vọng có thể đi kèm khả năng thua thảm cao.
- B. Vì q̂ luôn bị ước lượng thấp hơn giá trị thật nên agent cược quá ít, không phải quá nhiều.
- C. Vì hàm value của Watson không dùng discounting nên kỳ vọng phân kỳ về vô cực.
- D. Vì Jeopardy! là deterministic nên q̂ luôn chính xác tuyệt đối, rủi ro đến từ noise cảm biến.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — q̂ chỉ nắm bắt giá trị kỳ vọng, mà tối đa hóa kỳ vọng bỏ qua phân tán của kết quả. Một bet lớn có thể tối đa kỳ vọng thắng giải nhưng kèm xác suất cao thua đậm khi trả lời sai. Vì thí sinh chỉ chơi một lần (không phải trung bình dài hạn), risk-aversion (trừ một phần std, đặt sàn cho afterstate trả-lời-sai) là hợp lý. B, C, D mô tả sai bản chất vấn đề.

</details>

---

## 16.4 Optimizing Memory Control

**Câu 17.** İpek et al. mô hình hóa bài toán điều khiển bộ nhớ DRAM như một MDP. Thuật toán RL nào được dùng và hàm xấp xỉ ra sao?

- A. Sarsa để học action-value function, dùng linear function approximation với tile coding (có hashing).
- B. Q-learning với deep convolutional ANN trên ảnh trạng thái bộ nhớ.
- C. Monte Carlo control với lookup table đầy đủ cho mọi cấu hình.
- D. Policy gradient với softmax policy trên các lệnh bộ nhớ hợp lệ.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Scheduling agent dùng Sarsa để học action-value function. Trạng thái biểu diễn bằng sáu integer-valued features; action-value xấp xỉ bằng linear function approximation với tile coding (hashing) — 32 tilings, mỗi tiling lưu 256 action values dạng số 16-bit fixed point. Exploration là epsilon-greedy với epsilon = 0.05.

</details>

---

**Câu 18.** Trong MDP điều khiển bộ nhớ, reward signal được định nghĩa thế nào và vì sao có action NoOp?

- A. Reward bằng -1 mỗi bước để khuyến khích kết thúc nhanh; NoOp dùng để chờ chu kỳ refresh.
- B. Reward bằng số byte chuyển trong bước; NoOp là action mặc định luôn sẵn có trong mọi trạng thái.
- C. Reward bằng 1 khi action là read hoặc write, ngược lại bằng 0; NoOp được phát ra khi nó là action hợp lệ duy nhất.
- D. Reward là throughput tức thời đo được; NoOp dùng để tiết kiệm năng lượng khi rảnh.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Reward bằng 1 khi action là read hoặc write, ngược lại bằng 0 — vì chỉ read/write mới gửi dữ liệu qua external data bus, đóng góp vào throughput. NoOp được phát ra khi nó là action hợp lệ duy nhất. Các ràng buộc timing/resource được đảm bảo bằng cách định nghĩa trước tập action hợp lệ A(St) cho mỗi trạng thái.

</details>

---

**Câu 19.** So với bộ điều khiển FR-FCFS (tốt nhất trung bình lúc đó), bộ điều khiển học RL của İpek et al. đạt kết quả thế nào trong mô phỏng?

- A. Kém hơn khoảng 10% trung bình nhưng tiết kiệm năng lượng đáng kể.
- B. Ngang bằng FR-FCFS về throughput nhưng tiêu tốn năng lượng cao hơn nhiều.
- C. Vượt cả bộ điều khiển Optimistic lý tưởng (vốn không khả thi trong thực tế).
- D. Cải thiện từ 7% đến 33% trên chín ứng dụng, trung bình 19%, thu hẹp 27% khoảng cách tới bộ điều khiển Optimistic.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Bộ điều khiển RL cải thiện so với FR-FCFS từ 7% đến 33% qua chín ứng dụng, trung bình 19%, và thu hẹp 27% khoảng cách tới giới hạn trên của bộ điều khiển Optimistic (lý tưởng, bỏ qua mọi ràng buộc). Ngoài ra học online tốt hơn 8% so với chính sách cố định đã học trước. C sai vì Optimistic là giới hạn trên không thể vượt.

</details>

---

**Câu 20.** [Khó] Vì sao İpek et al. dùng tile coding với hashing thay vì một bảng tra cứu đầy đủ cho action-value, dù bài toán có không gian trạng thái rời rạc?

- A. Vì tile coding cho phép học off-policy còn lookup table thì không hỗ trợ off-policy.
- B. Vì sáu features dù rời rạc tạo ra không gian trạng thái tổ hợp rất lớn, nên cần xấp xỉ tuyến tính với hashing để vừa bộ nhớ phần cứng và để generalize.
- C. Vì lookup table không thể biểu diễn action NoOp một cách hợp lệ.
- D. Vì tile coding loại bỏ hoàn toàn nhu cầu exploration epsilon-greedy.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Tổ hợp của sáu integer-valued features tạo ra một không gian trạng thái quá lớn để lưu đầy đủ trên một bộ điều khiển bộ nhớ phần cứng. Tile coding với hashing nén biểu diễn vào số tiling/tile cố định (32 tilings × 256 values), vừa giới hạn tài nguyên vừa cho phép generalize giữa các trạng thái tương tự. Tile coding không quyết định off/on-policy (A), không liên quan tính hợp lệ của NoOp (C), cũng không thay thế exploration (D).

</details>

---

## 16.5 Human-level Video Game Play (DQN)

**Câu 21.** DQN (deep Q-network) của Mnih et al. kết hợp những thành phần nào, và điều gì làm kết quả của nó đáng kinh ngạc khi chơi 49 game Atari 2600?

- A. TD(lambda) với linear function approximation; đáng kinh ngạc vì tốc độ chạy rất nhanh.
- B. Q-learning kết hợp deep convolutional ANN; đáng kinh ngạc vì cùng một hệ thống (cùng raw input, kiến trúc, tham số) đạt mức người ở phần lớn game mà không cần feature set riêng từng game.
- C. Policy gradient với value network; đáng kinh ngạc vì tận dụng nhiều bộ feature thủ công.
- D. MCTS với rollout policy; đáng kinh ngạc vì hoàn toàn không dùng mạng nơ-ron.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — DQN kết hợp Q-learning với deep convolutional ANN. Điều đột phá là cùng một learning system — cùng raw input, kiến trúc mạng, và bộ tham số — đạt mức ngang hoặc vượt người ở phần lớn game (chỉ trọng số mạng được reset ngẫu nhiên trước mỗi game), không cần feature set chuyên biệt từng game.

</details>

---

**Câu 22.** Input "raw" mà DQN nhận cho mỗi game Atari được tiền xử lý ra sao?

- A. Một vector mô tả tọa độ của tất cả đối tượng phát hiện được trên màn hình.
- B. Toàn bộ frame gốc 210×160 với 128 màu, đưa thẳng vào mạng không qua xử lý.
- C. Một bộ đặc trưng thủ công thiết kế riêng cho từng game cụ thể.
- D. Mỗi frame xử lý thành mảng 84×84 giá trị luminance, rồi stack 4 frame gần nhất thành input 84×84×4.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Để giảm yêu cầu bộ nhớ/tính toán, mỗi frame được tiền xử lý thành mảng 84×84 giá trị luminance, rồi stack 4 frame gần nhất thành input 84×84×4 (giúp nhiều game trở nên Markovian hơn). Bước tiền xử lý này giống hệt nhau cho mọi game, không dùng kiến thức riêng game.

</details>

---

**Câu 23.** Tại sao DQN chọn Q-learning (model-free, off-policy) thay vì cách ước lượng afterstate như TD-Gammon?

- A. Vì Q-learning đơn giản hơn để cài đặt nói chung trong mọi bài toán.
- B. Vì Atari có không gian trạng thái nhỏ nên Q-learning là quá đủ.
- C. Vì sinh next states cho mọi action ở Atari phức tạp/chậm hơn, và DQN dùng experience replay vốn yêu cầu thuật toán off-policy — Q-learning là lựa chọn tự nhiên.
- D. Vì Q-learning không cần backpropagation nên huấn luyện rẻ hơn nhiều.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Dùng cách afterstate của TD-Gammon sẽ phải sinh next states cho mọi action (qua emulator hoặc model học được), phức tạp và chậm hơn. Một động lực khác là DQN dùng experience replay vốn yêu cầu thuật toán off-policy; Q-learning vừa model-free vừa off-policy nên là lựa chọn tự nhiên. D sai vì DQN vẫn dùng backpropagation.

</details>

---

**Câu 24.** Mnih et al. sửa Q-learning cơ bản theo BA cách để tăng tính ổn định. Đó là những cách nào?

- A. Thêm momentum cho optimizer, dropout giữa các lớp, và batch normalization.
- B. (1) Experience replay — lưu (St, At, Rt+1, St+1) vào replay memory, lấy mẫu ngẫu nhiên đều; (2) target network — định kỳ sao chép trọng số sang mạng nhân bản, giữ cố định C bước làm target; (3) clip error term về [-1, 1].
- C. Tăng learning rate, giảm discount factor, và thêm eligibility traces dài.
- D. Dùng MCTS để chọn nước, rollout policy nhanh, và supervised pretraining.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Ba cải tiến: (1) experience replay (Lin, 1992) — lưu (St, At, Rt+1, St+1) vào replay memory, mỗi bước lấy mini-batch mẫu ngẫu nhiên đều; (2) target network nhân bản — sao chép trọng số sau mỗi C update và giữ cố định để cung cấp target q̃, giảm dao động/phân kỳ; (3) clip error term về [-1, 1].

</details>

---

**Câu 25.** Experience replay mang lại những lợi ích nào so với Q-learning thông thường?

- A. Cho phép tái sử dụng mỗi trải nghiệm cho nhiều update, giảm variance vì các update liên tiếp không còn tương quan, và loại bỏ sự phụ thuộc của trải nghiệm liên tiếp vào trọng số hiện tại.
- B. Làm cho thuật toán trở thành on-policy nên hội tụ nhanh hơn nhiều.
- C. Loại bỏ hoàn toàn nhu cầu backpropagation trong quá trình cập nhật.
- D. Giúp DQN chơi xuất sắc cả những game cần deep planning như Montezuma's Revenge.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Experience replay cho phép dùng lại mỗi trải nghiệm cho nhiều update (học hiệu quả hơn), giảm variance vì các update liên tiếp không tương quan, và loại bỏ phụ thuộc của trải nghiệm liên tiếp vào trọng số hiện tại — gỡ bỏ một nguồn bất ổn. D sai: DQN học gần như ngẫu nhiên trên Montezuma's Revenge, vốn cần deep planning.

</details>

---

**Câu 26.** [Khó] Vì sao target network (giữ trọng số cố định C bước) lại giúp ổn định DQN, xét theo bản chất của update Q-learning với function approximation?

- A. Vì giữ target cố định biến Q-learning thành Monte Carlo, loại bỏ bootstrap hoàn toàn.
- B. Vì khi target và estimate cùng phụ thuộc trọng số đang cập nhật, mục tiêu "di chuyển" theo từng update gây dao động/phân kỳ; target cố định tạm thời cho mục tiêu ổn định để bám theo.
- C. Vì target network có nhiều tham số hơn nên biểu diễn được hàm giá trị chính xác hơn.
- D. Vì target cố định buộc agent phải explore nhiều hơn, tránh kẹt local optimum.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Trong Q-learning với function approximation, target q̃ được tính từ cùng bộ trọng số đang được cập nhật, nên mỗi bước update lại làm chính target dịch chuyển — vòng phản hồi này dễ gây dao động hoặc phân kỳ (một phần của "deadly triad"). Target network giữ trọng số cố định trong C bước cung cấp một mục tiêu ổn định để mạng chính bám theo, rồi mới đồng bộ định kỳ. Target network không loại bỏ bootstrap (A), không có thêm tham số (B đúng, C sai), và không phải cơ chế exploration (D).

</details>

---

## 16.6 Mastering the Game of Go — AlphaGo

**Câu 27.** Theo các chuyên gia, rào cản chính khiến Go khó hơn các game như cờ vua đối với AI là gì?

- A. Go không thể được mô hình hóa dưới dạng một MDP hợp lệ.
- B. Khó định nghĩa một position evaluation function thỏa đáng ("No simple yet reasonable evaluation function will ever be found for Go").
- C. Luật chơi Go quá phức tạp để lập trình một engine cơ bản.
- D. Kích thước khổng lồ của không gian tìm kiếm là yếu tố cản trở duy nhất.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Tuy không gian tìm kiếm của Go lớn hơn cờ vua (~250 nước hợp lệ/thế so với ~35), kích thước này không phải yếu tố chính (nên D sai). Rào cản lớn nhất là khó định nghĩa một evaluation function thỏa đáng cho thế cờ. Bước tiến lớn là đưa MCTS vào các chương trình Go.

</details>

---

**Câu 28.** AlphaGo kết hợp những thành phần chính nào?

- A. Deep ANNs, supervised learning (từ database nước đi chuyên gia), Monte Carlo Tree Search, và reinforcement learning.
- B. Chỉ Monte Carlo Tree Search thuần với rollout hoàn toàn ngẫu nhiên.
- C. Chỉ Q-learning với experience replay và target network như DQN.
- D. Một lookup table khổng lồ kết hợp minimax search alpha-beta cổ điển.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — AlphaGo kết hợp deep ANNs, supervised learning, MCTS, và reinforcement learning. Đổi mới chính là chọn nước đi bằng một phiên bản MCTS mới (APV-MCTS) được dẫn dắt bởi cả policy và value function học được, khởi tạo từ trọng số đã qua supervised learning trên database nước đi chuyên gia con người (thay vì trọng số ngẫu nhiên).

</details>

---

**Câu 29.** Trong APV-MCTS của AlphaGo, mạng nào dùng để mở rộng cây tìm kiếm, và một node mới được đánh giá thế nào?

- A. Value network mở rộng cây; node được đánh giá bằng minimax alpha-beta.
- B. Rollout policy mở rộng cây; node được đánh giá chỉ bằng kết quả rollout.
- C. SL-policy network (13-layer, học supervised từ ~30 triệu nước đi chuyên gia) chọn cạnh mở rộng; node đánh giá bằng kết hợp value network v_theta và return G của rollout: v(s) = (1-eta)·v_theta(s) + eta·G.
- D. RL policy network mở rộng cây; node được đánh giá duy nhất bằng value network.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — APV-MCTS mở rộng cây bằng cách chọn cạnh theo xác suất từ SL-policy network (13-layer, huấn luyện supervised để dự đoán nước đi trong database gần 30 triệu nước đi chuyên gia). Node mới được đánh giá kết hợp hai cách: value network v_theta và return G của rollout, theo công thức (16.4) với eta điều khiển trộn. AlphaGo chơi tốt nhất khi eta = 0.5.

</details>

---

**Câu 30.** [Khó] Vì sao AlphaGo dùng SL policy (chứ không phải RL policy mạnh hơn) trong giai đoạn expansion của APV-MCTS, nhưng lại dùng value function dẫn xuất từ RL policy?

- A. Vì SL policy tính toán nhanh hơn RL policy nên phù hợp cho expansion lặp nhiều lần.
- B. Vì thực nghiệm cho thấy AlphaGo chơi tốt hơn với SL policy (RL policy bị "tune" đáp lại nước tối ưu chứ không phải tập nước rộng của người), nhưng value function dẫn xuất từ RL policy lại tốt hơn.
- C. Vì RL policy về mặt kỹ thuật không thể tích hợp vào vòng lặp MCTS.
- D. Vì value network chỉ tương thích với SL policy do cùng kiến trúc mạng.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Cả hai policy tốn thời gian tính như nhau (cùng kiến trúc), nên A sai. Nhóm phát hiện AlphaGo chơi tốt hơn khi APV-MCTS dùng SL policy trong expansion — phỏng đoán vì RL policy được tune để đáp lại nước đi tối ưu chứ không phải tập nước đi rộng đặc trưng của con người. Ngược lại, value function dẫn xuất từ RL policy cho kết quả tốt hơn từ SL policy.

</details>

---

**Câu 31.** Rollout policy của AlphaGo được thiết kế thế nào và vì sao?

- A. Là chính RL policy network để đạt độ chính xác đánh giá cao nhất có thể.
- B. Là một mạng linear đơn giản học supervised từ ~8 triệu nước đi người — kém phức tạp để output action nhanh (~1.000 mô phỏng ván/giây mỗi thread), vì SL/RL policy network quá chậm cho rollout.
- C. Là một deep convolutional ANN 41 lớp để tối đa độ sâu biểu diễn.
- D. Không có rollout policy nào; AlphaGo hoàn toàn không sử dụng rollout.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Rollout policy là mạng linear đơn giản học supervised từ corpus 8 triệu nước đi người. Nó phải output action nhanh trong khi vẫn khá chính xác, vì forward propagation qua SL/RL policy network quá chậm cho vô số rollout cần chạy mỗi nước đi. Rollout policy cho phép chạy ~1.000 mô phỏng ván hoàn chỉnh/giây mỗi thread.

</details>

---

## 16.6.2 AlphaGo Zero

**Câu 32.** Khác biệt cốt lõi giữa AlphaGo Zero và AlphaGo về nguồn dữ liệu học là gì?

- A. AlphaGo Zero dùng lượng dữ liệu chuyên gia con người lớn hơn nhiều so với AlphaGo.
- B. AlphaGo Zero học hoàn toàn bằng supervised learning thuần từ database nước đi.
- C. AlphaGo Zero KHÔNG dùng dữ liệu/hướng dẫn con người ngoài luật cơ bản (hence "Zero") — học hoàn toàn bằng self-play RL với input chỉ là mô tả "raw" vị trí quân cờ.
- D. Cả hai phiên bản đều học hoàn toàn từ dữ liệu chuyên gia con người được chú thích.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — AlphaGo Zero không dùng dữ liệu/hướng dẫn con người ngoài luật cơ bản (vì thế có chữ "Zero"). Nó học hoàn toàn bằng self-play reinforcement learning với input chỉ là mô tả "raw" vị trí các quân cờ trên bàn. AlphaGo Zero hiện thực một dạng policy iteration (Section 4.3).

</details>

---

**Câu 33.** AlphaGo Zero dùng bao nhiêu mạng nơ-ron, và mạng đó có cấu trúc thế nào?

- A. Chỉ MỘT deep convolutional ANN f_theta "two-headed": một head xuất vector move probabilities p, head kia xuất scalar value v (xác suất người chơi hiện tại thắng).
- B. Ba mạng riêng biệt như AlphaGo: SL policy, RL policy, và value network.
- C. Hai mạng tách biệt hoàn toàn: một policy và một value, không chia sẻ lớp nào.
- D. Không dùng mạng nơ-ron nào, chỉ dùng MCTS thuần với rollout.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — AlphaGo Zero dùng chỉ MỘT deep convolutional ANN (so với AlphaGo dùng nhiều mạng). Mạng "two-headed": sau các lớp đầu chung, tách thành hai head — một head xuất vector p (move probabilities, gồm cả pass), head kia xuất scalar v (ước lượng xác suất thắng của người chơi hiện tại).

</details>

---

**Câu 34.** Một khác biệt quan trọng giữa AlphaGo Zero và AlphaGo về cách dùng MCTS trong quá trình học là gì?

- A. AlphaGo dùng MCTS xuyên suốt quá trình học, còn AlphaGo Zero hoàn toàn không.
- B. AlphaGo Zero dùng MCTS để chọn nước đi xuyên suốt self-play RL (trong khi học), còn AlphaGo chỉ dùng MCTS khi chơi trực tiếp SAU — chứ không trong — quá trình học.
- C. Cả hai chỉ dùng MCTS sau khi đã huấn luyện xong, không dùng lúc học.
- D. AlphaGo Zero không dùng MCTS chút nào, chỉ dựa vào mạng f_theta.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — AlphaGo Zero dùng MCTS để chọn nước đi xuyên suốt quá trình self-play RL (trong khi học), còn AlphaGo dùng MCTS cho live play sau — chứ không trong — quá trình học. MCTS đóng vai trò "powerful policy improvement operator": policy thực sự đi (pi_i từ MCTS) cải thiện hơn policy p từ mạng.

</details>

---

**Câu 35.** MCTS của AlphaGo Zero đơn giản hơn AlphaGo ở điểm nào?

- A. Nó không dùng bất kỳ deep network nào để dẫn dắt việc tìm kiếm.
- B. Nó dùng minimax alpha-beta thay cho lấy mẫu Monte Carlo.
- C. Nó không bao giờ mở rộng cây tìm kiếm, chỉ đánh giá nút gốc.
- D. Nó KHÔNG bao gồm rollout của ván cờ hoàn chỉnh (nên không cần rollout policy); mỗi simulation kết thúc ở một leaf node của cây.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — MCTS của AlphaGo Zero đơn giản hơn ở chỗ không bao gồm rollout của ván cờ hoàn chỉnh, do đó không cần rollout policy. Mỗi iteration chạy một simulation kết thúc ở leaf node của cây hiện tại (thay vì chạy tới terminal position của ván đầy đủ), được dẫn dắt bởi output của mạng f_theta.

</details>

---

**Câu 36.** [Khó] AlphaGo Zero được mô tả là hiện thực một dạng policy iteration. Trong sơ đồ này, MCTS và mạng f_theta lần lượt đóng vai trò gì?

- A. MCTS là policy evaluation còn f_theta là model của environment dùng để planning.
- B. MCTS là policy improvement operator (sinh policy pi tốt hơn p), còn f_theta được train để khớp lại với pi và outcome ván — tương ứng bước cải thiện và bước cập nhật/đánh giá.
- C. f_theta là policy improvement còn MCTS chỉ là bộ sinh dữ liệu ngẫu nhiên không có vai trò cải thiện.
- D. MCTS là exploration thuần còn f_theta là exploitation thuần, không liên quan policy iteration.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — MCTS dẫn dắt bởi f_theta tạo ra một policy pi (phân phối visit count) mạnh hơn policy p mà mạng output trực tiếp — đóng vai trò policy improvement operator. Sau đó f_theta được huấn luyện để move probabilities p khớp pi và value v khớp outcome ván — đóng vai trò bước cập nhật estimate (evaluation). Lặp hai bước này chính là policy iteration. A nhầm vai trò, C đảo ngược, D bỏ qua bản chất iteration.

</details>

---

**Câu 37.** Khi so AlphaGo Zero với một chương trình dùng cùng kiến trúc mạng nhưng huấn luyện bằng supervised learning để dự đoán nước đi người, kết quả cho thấy điều gì?

- A. Chương trình supervised luôn mạnh hơn AlphaGo Zero ở mọi giai đoạn huấn luyện.
- B. Hai chương trình luôn ngang nhau về cả sức cờ lẫn khả năng dự đoán nước người.
- C. Chương trình supervised ban đầu chơi tốt hơn và dự đoán nước người tốt hơn, nhưng chơi kém hơn sau khi AlphaGo Zero học một ngày — gợi ý AlphaGo Zero khám phá chiến lược khác con người.
- D. Chương trình supervised không học được gì và chơi ở mức ngẫu nhiên.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Chương trình supervised-learning ban đầu chơi tốt hơn và dự đoán nước đi chuyên gia tốt hơn, nhưng chơi kém hơn sau khi AlphaGo Zero học một ngày. Điều này gợi ý AlphaGo Zero khám phá một chiến lược chơi khác với cách con người — thực tế nó tìm ra và ưa thích một số biến thể mới lạ của các chuỗi nước cổ điển.

</details>

---

**Câu 38.** Trong trận 100 ván giữa AlphaGo Zero (huấn luyện như mô tả) và đúng phiên bản AlphaGo đã thắng Lee Sedol, kết quả thế nào?

- A. AlphaGo Zero thắng toàn bộ cả 100 ván.
- B. AlphaGo Zero thua tất cả các ván trong loạt đấu.
- C. Hai bên hòa nhau với tỉ số sát sao 50-50.
- D. AlphaGo Zero chỉ thắng nhẹ với tỉ số 60-40.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — AlphaGo Zero đánh bại AlphaGo (phiên bản thắng Lee Sedol) trong cả 100 ván. (Elo ratings: AlphaGo Zero 4.308 so với phiên bản đấu Fan Hui 3.144 và phiên bản đấu Lee Sedol 3.739.) Một phiên bản lớn hơn còn đạt Elo 5.185 và thắng AlphaGo Master 89-11.

</details>

---

## 16.7 Personalized Web Services

**Câu 39.** A/B testing được mô tả như loại RL nào, và vì sao nó không cá nhân hóa nội dung?

- A. Là deep Q-learning; không cá nhân hóa được vì thiếu một mạng nơ-ron đủ sâu.
- B. Là một dạng RL đơn giản, non-associative (giống two-armed bandit) — không cá nhân hóa được. Thêm context (đặc trưng người dùng và nội dung) biến nó thành contextual bandit (associative RL).
- C. Là policy gradient; không cá nhân hóa được vì nó hoạt động off-policy.
- D. Là một MDP đầy đủ; thực tế nó cá nhân hóa nội dung một cách hoàn hảo.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — A/B testing là dạng RL đơn giản, non-associative giống two-armed bandit, nên không cá nhân hóa nội dung. Thêm context gồm đặc trưng người dùng và nội dung biến nó thành contextual bandit problem (associative RL, Section 2.9). Li et al. (2010) áp dụng contextual bandit cho Yahoo! Front Page, cải thiện 12.5% so với bandit non-associative chuẩn.

</details>

---

**Câu 40.** Theocharous et al. lập luận rằng có thể đạt kết quả tốt hơn contextual bandit bằng cách nào, và vì sao chính sách contextual bandit bị hạn chế?

- A. Bằng cách hình thức hóa gợi ý cá nhân hóa thành MDP nhằm tối đa tổng click qua nhiều lần thăm — vì policy contextual bandit là greedy (không tính tác động dài hạn), coi mỗi lượt thăm như của khách mới.
- B. Bằng cách thực hiện nhiều A/B test hơn nữa; vì contextual bandit học quá chậm.
- C. Bằng supervised learning thuần trên log click; vì bandit về cơ bản không học được.
- D. Bằng cách loại bỏ hết feature người dùng; vì các feature đó chỉ gây nhiễu.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Họ hình thức hóa gợi ý cá nhân hóa thành MDP với mục tiêu tối đa tổng số click qua các lần thăm lặp lại. Policy từ contextual bandit là greedy — không tính tác động dài hạn của hành động, coi mỗi lượt thăm như của một khách mới được lấy mẫu đều, bỏ lỡ lợi ích từ tương tác dài hạn với từng người dùng.

</details>

---

**Câu 41.** Hai thuật toán mà Theocharous et al. so sánh là gì, và chúng dùng kỹ thuật học nào?

- A. Q-learning online và Sarsa online, cả hai dùng linear function approximation.
- B. Deep Q-network với experience replay và policy gradient với baseline.
- C. Greedy optimization (tối đa xác suất click tức thời, dùng random forest qua supervised learning) và LTV optimization (life-time value, dùng batch-mode RL fitted Q iteration cũng với random forest).
- D. A/B testing chuẩn và contextual bandit non-associative.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Greedy optimization tối đa chỉ xác suất click tức thời, dựa trên mapping học bằng supervised learning với random forest (RF), tạo policy epsilon-greedy. LTV (life-time value) optimization là RL theo MDP, dùng batch-mode fitted Q iteration (FQI) — biến thể của fitted value iteration cho Q-learning, cũng dùng cùng thuật toán RF. Đánh giá làm bằng high confidence off-policy evaluation.

</details>

---

**Câu 42.** Sự khác nhau giữa hai metric CTR và LTV là gì?

- A. CTR = tổng clicks / tổng visits, LTV = tổng clicks / tổng visitors — LTV phân biệt từng khách nên lớn hơn CTR khi khách quay lại nhiều, là chỉ báo khả năng giữ tương tác dài hạn.
- B. CTR = clicks chia số visitors, còn LTV = clicks chia số visits.
- C. Hai metric về bản chất hoàn toàn giống nhau, chỉ khác tên gọi.
- D. CTR đo doanh thu trên mỗi khách, LTV đo số quảng cáo hiển thị mỗi phiên.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — CTR = tổng số clicks / tổng số visits; LTV = tổng số clicks / tổng số visitors. LTV phân biệt giữa từng người dùng (visitor), nên lớn hơn CTR khi người dùng quay lại nhiều lần — chỉ báo policy thành công đến đâu trong việc khuyến khích tương tác kéo dài. Như mong đợi, greedy tốt nhất theo CTR, còn LTV optimization tốt nhất theo LTV.

</details>

---

**Câu 43.** [Khó] Vì sao formulation MDP (LTV) lại có thể vượt contextual bandit (greedy) về metric LTV nhưng thường thua về CTR? Đây là minh họa cho trade-off nào?

- A. Vì MDP dùng nhiều dữ liệu hơn nên luôn tốt hơn ở mọi metric; không có trade-off thực sự.
- B. Vì LTV policy có thể hi sinh click tức thời (CTR thấp hơn) để dẫn dắt người dùng tới chuỗi tương tác dài giá trị hơn — minh họa trade-off immediate reward vs long-term return.
- C. Vì CTR và LTV đo cùng đại lượng nên chênh lệch chỉ do noise lấy mẫu ngẫu nhiên.
- D. Vì contextual bandit là off-policy còn MDP là on-policy, gây lệch đánh giá hệ thống.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Greedy tối ưu xác suất click tức thời nên đạt CTR cao nhất, nhưng coi mỗi lượt thăm độc lập. LTV optimization (MDP) có thể chọn nội dung cho ít click ngay lúc này nhưng giữ chân và khuyến khích người dùng quay lại nhiều lần, nâng tổng click trên mỗi visitor (LTV). Đây đúng là trade-off cốt lõi của RL: maximize cumulative long-term return thay vì immediate reward. Các phương án còn lại phủ nhận sai sự đánh đổi này.

</details>

---

## 16.8 Thermal Soaring

**Câu 44.** Reddy et al. mô hình hóa bài toán thermal soaring như loại bài toán nào, và mục tiêu chính của nghiên cứu là gì?

- A. Bandit không context; mục tiêu là tối đa hóa tốc độ bay tức thời của glider.
- B. Bài toán supervised learning; mục tiêu là phân loại các luồng khí lên/xuống.
- C. Episodic MDP không discounting; mục tiêu duy nhất là chế tạo glider tự động.
- D. Continuing MDP có discounting; mục tiêu chính là hiểu các cue chim cảm nhận và cách dùng chúng để soaring (đồng thời góp phần cho công nghệ glider tự động).

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Reddy et al. mô hình hóa thermal soaring như một continuing MDP với discounting. Agent tương tác với mô hình chi tiết của glider bay trong không khí nhiễu loạn. Mục tiêu chính là cung cấp hiểu biết về các cue chim cảm nhận và cách chúng dùng để soaring, đồng thời góp phần cho công nghệ glider tự động.

</details>

---

**Câu 45.** Thuật toán RL và phương pháp chọn action trong nghiên cứu thermal soaring là gì?

- A. One-step Sarsa, actions chọn theo phân phối soft-max dựa trên action values đã chuẩn hóa (temperature tau giảm dần từ 2.0 xuống 0.2); dùng state aggregation.
- B. Q-learning với exploration epsilon-greedy và replay buffer cố định.
- C. Monte Carlo control với một lookup table đầy đủ cho mọi trạng thái.
- D. Deep Q-network với experience replay và target network nhân bản.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Học bằng one-step Sarsa, actions chọn theo phân phối soft-max dựa trên action values đã chuẩn hóa (temperature tau khởi tạo 2.0, giảm dần xuống 0.2). Họ dùng state aggregation cho không gian trạng thái bốn chiều. Step-size và discount-rate cố định ở 0.1 và 0.98.

</details>

---

**Câu 46.** Reddy et al. phát hiện tổ hợp đặc trưng (cue) nào hiệu quả nhất để giữ glider trong cột khí đang lên, và đặc trưng nào ít hữu ích?

- A. Chỉ riêng angle of attack là đủ để giữ glider ổn định trong thermal.
- B. Vertical wind velocity và nhiệt độ là hai cue quan trọng nhất.
- C. Cả bốn chiều của không gian trạng thái đều quan trọng ngang nhau.
- D. Tổ hợp vertical wind acceleration và torque hiệu quả nhất (cho gradient vận tốc gió đứng theo hai hướng); nhạy nhiệt độ ít hữu ích, và angle of attack không giúp giữ trong thermal (chỉ hữu ích khi di chuyển giữa các thermal).

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Tổ hợp vertical wind acceleration và torque hoạt động tốt nhất, vì chúng cho thông tin về gradient vận tốc gió đứng theo hai hướng, giúp controller chọn rẽ (đổi bank angle) hay đi thẳng để ở lại trong cột khí lên. Vertical wind velocity chỉ báo độ mạnh thermal nhưng không giúp ở lại trong luồng. Nhạy nhiệt độ ít hữu ích; điều khiển angle of attack hữu ích khi di chuyển giữa các thermal (cross-country gliding) chứ không để giữ trong một thermal.

</details>

---

**Câu 47.** Về reward signal trong thermal soaring, Reddy et al. phát hiện điều gì hoạt động tốt nhất?

- A. Reward tại mỗi bước là tổ hợp tuyến tính của vertical wind velocity và vertical wind acceleration quan sát ở bước trước; reward cuối-episode đơn giản (thưởng độ cao) không học thành công và eligibility traces không giúp.
- B. Chỉ thưởng độ cao đạt được ở cuối episode, với eligibility traces đóng góp rất lớn vào học.
- C. Reward là một hằng số âm ở mỗi bước để khuyến khích kết thúc nhanh.
- D. Reward là tốc độ bay tức thời của glider đo tại mỗi bước thời gian.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Reward cuối-episode đơn giản (thưởng theo độ cao đạt được, phạt lớn khi chạm đất) không học thành công với episode dài thực tế, và eligibility traces không giúp. Học tốt nhất với reward tại mỗi bước kết hợp tuyến tính vertical wind velocity và vertical wind acceleration quan sát ở bước trước.

</details>

---

**Câu 48.** Thí nghiệm về discount-rate cho thấy điều gì về thermal soaring?

- A. Discount-rate gamma về cơ bản không ảnh hưởng gì tới độ cao đạt được.
- B. Độ cao đạt được tốt nhất khi gamma = 0, gợi ý chỉ cần tối ưu reward tức thời.
- C. Độ cao đạt được giảm khi gamma tăng, gợi ý chỉ cần tính toán ngắn hạn.
- D. Độ cao đạt được tăng khi gamma tăng, đạt cực đại ở gamma = .99 — gợi ý thermal soaring hiệu quả đòi hỏi tính tới tác động dài hạn của quyết định điều khiển.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Độ cao đạt được trong một episode tăng khi gamma tăng, đạt cực đại ở gamma = .99. Điều này gợi ý thermal soaring hiệu quả đòi hỏi tính tới tác động dài hạn của các quyết định điều khiển.

</details>

---

**Câu 49.** [Khó] Vì sao reward "shaped" theo từng bước (kết hợp vertical wind velocity và acceleration) lại học thành công, trong khi reward cuối-episode đơn giản (chỉ thưởng độ cao) thất bại — dù mục tiêu thực chất là độ cao?

- A. Vì reward cuối-episode vi phạm định nghĩa MDP nên thuật toán Sarsa không áp dụng được.
- B. Vì với episode dài và reward thưa cuối-episode, vấn đề temporal credit assignment quá khó; reward từng bước cung cấp tín hiệu học dày đặc, có thông tin hơn ở mỗi quyết định.
- C. Vì reward cuối-episode luôn âm nên agent học cách kết thúc episode càng nhanh càng tốt.
- D. Vì reward từng bước biến bài toán thành supervised learning, vốn dễ hội tụ hơn RL.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Khi reward chỉ xuất hiện ở cuối những episode rất dài, tín hiệu cực kỳ thưa và việc gán credit ngược về từng quyết định điều khiển trở nên rất khó (ngay cả eligibility traces cũng không cứu được trong thực nghiệm này). Reward từng bước dựa trên vertical wind velocity/acceleration cung cấp một tín hiệu học dày đặc và giàu thông tin tại mỗi bước, tương quan tốt với hành vi soaring đúng — giải quyết bài toán credit assignment hiệu quả hơn. Đây không phải vấn đề tính hợp lệ MDP (A), dấu reward (C), hay biến thành supervised (D).

</details>
