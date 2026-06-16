# Chương 5: Monte Carlo Methods — Câu hỏi trắc nghiệm

> Bộ câu hỏi ôn tập chi tiết cho Chương 5, sách *Reinforcement Learning: An Introduction* (Sutton & Barto, 2nd ed.)

## 5.1 Monte Carlo Prediction

**Câu 1.** Đặc điểm cốt lõi phân biệt Monte Carlo methods với dynamic programming (DP) trong chương trước là gì?

- A. MC cập nhật value của một state dựa trên value các successor states, còn DP thì không.
- B. MC yêu cầu biết đầy đủ hàm động lực học `p` của môi trường, còn DP chỉ cần experience.
- C. MC chỉ cần *experience* (chuỗi mẫu states, actions, rewards) từ tương tác thực hoặc mô phỏng, không cần biết động lực học môi trường.
- D. MC chỉ áp dụng được cho continuing tasks, còn DP áp dụng cho episodic tasks.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Khác với DP (yêu cầu biết đầy đủ động lực học môi trường qua hàm `p`), Monte Carlo methods chỉ cần *experience*: các chuỗi mẫu states, actions, rewards. Chúng có thể học từ kinh nghiệm thực hoặc mô phỏng mà không cần tri thức trước về động lực học. (B đảo ngược yêu cầu — chính DP mới cần `p`; A mô tả bootstrapping của DP; D sai vì MC trong chương này được định nghĩa cho episodic tasks.)

</details>

---

**Câu 2.** Trong chương này, Monte Carlo methods được định nghĩa chỉ cho loại nhiệm vụ nào, và tại sao?

- A. Episodic tasks, để đảm bảo có returns được xác định rõ ràng (well-defined) — mọi episode cuối cùng đều kết thúc.
- B. Continuing tasks, vì returns trong nhiệm vụ không kết thúc luôn được xác định rõ ràng.
- C. Cả episodic và continuing tasks như nhau, vì discounting luôn làm returns hữu hạn.
- D. Chỉ các nhiệm vụ deterministic, vì returns ngẫu nhiên không thể lấy trung bình.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — MC methods trong chương này được định nghĩa chỉ cho episodic tasks để đảm bảo có well-defined returns. Kinh nghiệm được chia thành các episode và mọi episode cuối cùng đều kết thúc bất kể chọn action nào. Chỉ khi episode hoàn tất thì value estimates và policy mới được thay đổi (incremental theo episode-by-episode, không phải step-by-step online). (B, C nhầm về continuing; D sai vì MC chính là để xử lý tính ngẫu nhiên qua lấy trung bình.)

</details>

---

**Câu 3.** Ý tưởng cơ bản nhất làm nền tảng cho mọi Monte Carlo method để ước lượng v_π(s) là gì?

- A. Cập nhật value của state dựa trên value của các successor states.
- B. Giải lặp hệ phương trình Bellman cho tới khi hội tụ.
- C. Lấy đạo hàm của hàm value theo tham số policy rồi đi theo gradient.
- D. Lấy trung bình (average) các returns quan sát được sau các visit tới state s.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Giá trị của một state là expected return khi bắt đầu từ state đó. Cách hiển nhiên để ước lượng từ kinh nghiệm là lấy trung bình các returns quan sát được sau các visit tới state đó; khi quan sát nhiều returns hơn, trung bình hội tụ về expected value. (A là bootstrapping của DP — chính điều MC *không* làm; B là DP; C thuộc policy-gradient methods.)

</details>

---

**Câu 4.** Sự khác biệt giữa first-visit MC và every-visit MC method khi ước lượng v_π(s) là gì?

- A. First-visit MC chỉ dùng cho action values; every-visit MC chỉ dùng cho state values.
- B. First-visit MC lấy trung bình returns sau lần đầu tiên s được visit trong mỗi episode; every-visit MC lấy trung bình returns sau *mọi* visit tới s.
- C. First-visit MC áp dụng discounting cho returns; every-visit MC bỏ qua discounting.
- D. First-visit MC dùng cho on-policy; every-visit MC bắt buộc dùng cho off-policy.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — *first visit* tới s là lần đầu tiên s được visit trong một episode. First-visit MC ước lượng v_π(s) bằng trung bình các returns theo sau các first visit; every-visit MC lấy trung bình returns theo sau *tất cả* các visit. Trong pseudocode, every-visit MC giống first-visit MC nhưng bỏ phần kiểm tra "Unless S_t xuất hiện trong S_0,...,S_{t-1}". (A, C, D bịa ra những phân biệt không tồn tại — cả hai biến thể đều dùng cho state values, đều discount, và đều dùng được on-/off-policy.)

</details>

---

**Câu 5.** Về tính chất thống kê của first-visit MC, phát biểu nào ĐÚNG?

- A. Mỗi return là một ước lượng có bias của v_π(s), bias này không bao giờ biến mất.
- B. First-visit MC không hội tụ về v_π(s) trừ khi policy là deterministic.
- C. Mỗi return là ước lượng i.i.d., không bias (unbiased) của v_π(s) với phương sai hữu hạn; theo luật số lớn, trung bình hội tụ về expected value và độ lệch chuẩn của sai số giảm theo 1/√n.
- D. First-visit MC hội tụ nhưng độ lệch chuẩn của sai số giảm theo 1/n chứ không phải 1/√n.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Trong first-visit MC, mỗi return là một ước lượng i.i.d. của v_π(s) với phương sai hữu hạn. Theo luật số lớn, dãy trung bình hội tụ về expected value; mỗi trung bình là unbiased estimate, và độ lệch chuẩn của sai số giảm theo 1/√n (n là số returns). Every-visit MC kém trực tiếp hơn nhưng cũng hội tụ về v_π(s). (D sai ở tốc độ: standard error chuẩn là 1/√n, không phải 1/n.)

</details>

---

**Câu 6.** Trong ví dụ Blackjack (Example 5.1), cách thiết lập bài toán như một episodic finite MDP là như thế nào?

- A. Reward là số điểm trong tay; discount γ = 0.9; states là toàn bộ bộ bài đã chia.
- B. Reward chỉ trao ở mỗi bước hit; states chỉ gồm tổng bài người chơi (12–21).
- C. Đây là một continuing task không có terminal state, dùng average-reward formulation.
- D. Rewards +1, -1, 0 cho thắng/thua/hòa; không discount (γ = 1) nên terminal rewards cũng là returns; states gồm tổng bài người chơi (12–21), lá lộ của dealer (A–10), và có usable ace hay không → 200 states.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Mỗi ván là một episode. Rewards +1, -1, 0 cho thắng, thua, hòa; mọi reward trong ván bằng 0, không discount (γ = 1), nên terminal rewards cũng chính là returns. Người chơi quyết định dựa trên 3 biến: tổng bài hiện tại (12–21), lá lộ của dealer (A–10), và có usable ace hay không → 200 states. Một *usable ace* là ace có thể tính là 11 mà không bị bust. (A, B sai về reward/discount; C sai vì Blackjack là episodic.)

</details>

---

**Câu 7.** Tại sao chương sách lập luận rằng dù ta biết đầy đủ môi trường trong Blackjack, việc áp dụng DP vẫn không dễ?

- A. Vì DP cần phân phối của các sự kiện kế tiếp (hàm `p`), mà xác định nó cho Blackjack (ví dụ xác suất kết thúc với reward +1 theo lá dealer) rất phức tạp và dễ sai; trong khi sinh ván mẫu cho MC lại dễ.
- B. Vì Blackjack có quá nhiều states khiến DP không thể duyệt hết trong thời gian hợp lý.
- C. Vì DP không hội tụ cho các bài toán có yếu tố ngẫu nhiên như trò chơi bài.
- D. Vì Blackjack không thỏa mãn Markov property nên không phải là một MDP hợp lệ.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — DP cần phân phối các sự kiện kế tiếp, tức động lực học môi trường qua hàm `p`, và xác định nó cho Blackjack không dễ. Ví dụ: nếu tổng bài người chơi là 14 và anh ta stick, xác suất kết thúc với reward +1 là bao nhiêu theo lá lộ của dealer? Mọi xác suất phải được tính trước khi áp dụng DP, các tính toán này phức tạp và dễ sai. Trái lại, sinh ván mẫu cho MC rất dễ. (B sai — 200 states là nhỏ; C sai — DP hội tụ tốt; D sai — Blackjack là MDP hợp lệ.)

</details>

---

**Câu 8.** Trong backup diagram của Monte Carlo cho v_π, điểm khác biệt so với backup diagram của DP là gì?

- A. MC diagram chỉ hiển thị transition một-bước, còn DP diagram đi tới hết episode.
- B. MC diagram chỉ hiển thị các transition được lấy mẫu trên *một* episode và đi tới tận terminal state; DP diagram hiển thị *tất cả* transition có thể và chỉ một-bước.
- C. Hai diagram hoàn toàn giống nhau vì cùng ước lượng v_π.
- D. MC diagram không có root node, còn DP diagram bắt đầu từ một state node.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Với MC estimation của v_π, root là một state node, bên dưới là toàn bộ trajectory các transition dọc theo *một* episode cụ thể, kết thúc tại terminal state. DP diagram hiển thị *tất cả* transition có thể và chỉ một-bước. (A đảo ngược hai phía; C sai vì chúng khác nhau rõ rệt; D sai — cả hai đều có root là state node.)

</details>

---

**Câu 9.** Tại sao nói Monte Carlo methods KHÔNG bootstrap?

- A. Vì chúng không áp dụng discounting cho rewards.
- B. Vì chúng cập nhật value theo từng bước online ngay trong episode.
- C. Vì chúng chỉ hoạt động cho action values chứ không phải state values.
- D. Vì ước lượng cho mỗi state là độc lập — ước lượng của một state không xây dựng dựa trên ước lượng của bất kỳ state nào khác (khác với DP).

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Một sự thật quan trọng về MC là ước lượng cho mỗi state là *độc lập*: ước lượng của một state không xây dựng dựa trên ước lượng của state khác như trong DP — tức MC không *bootstrap*. Hệ quả: chi phí ước lượng giá trị một state độc lập với số lượng states, nên có thể tập trung vào một tập con states quan tâm. (A, B, C không liên quan tới định nghĩa bootstrapping.)

</details>

---

**Câu 10.** Theo ví dụ Soap Bubble (Example 5.2), lợi thế của Monte Carlo so với phương pháp lặp (iterative) là gì?

- A. Nếu chỉ quan tâm giá trị tại một điểm (hoặc tập nhỏ cố định), MC có thể hiệu quả hơn nhiều phương pháp lặp dựa trên tính nhất quán cục bộ, vì có thể ước lượng tại điểm đó bằng cách lấy trung bình nhiều random walk.
- B. MC luôn cho kết quả chính xác tuyệt đối, không có sai số thống kê.
- C. MC không cần biết hình dạng của khung dây biên để tính chiều cao bề mặt.
- D. MC luôn hội tụ nhanh hơn cho mọi điểm trên toàn bộ bề mặt.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Thay vì tính lặp toàn lưới, ta tưởng tượng thực hiện random walk từ điểm lưới này sang điểm lân cận với xác suất bằng nhau cho tới khi chạm biên; expected value của chiều cao tại biên là xấp xỉ tốt cho chiều cao bề mặt tại điểm xuất phát. Nếu chỉ quan tâm một điểm (hoặc tập nhỏ cố định), MC có thể hiệu quả hơn nhiều phương pháp lặp dựa trên local consistency. (B sai — MC có sai số thống kê; C sai — vẫn cần biên; D sai — chỉ lợi khi quan tâm tập nhỏ điểm, không phải toàn bề mặt.)

</details>

---

**Câu 11.** [Khó] Hãy so sánh chi phí tính toán để ước lượng value của *một* state đơn lẻ giữa Monte Carlo và Dynamic Programming, và rút ra hệ quả thực tiễn.

- A. Cả hai đều có chi phí tỉ lệ với tổng số states, nên không có khác biệt thực tiễn.
- B. MC có chi phí cho một state độc lập với tổng số states (chỉ cần các episode đi qua state đó), trong khi DP về cơ bản phải sweep toàn bộ state space — nên với một tập nhỏ states quan tâm, MC có thể rẻ hơn nhiều.
- C. DP rẻ hơn cho một state đơn lẻ vì nó bootstrap, còn MC phải mô phỏng nhiều episode đầy đủ tới terminal.
- D. MC bắt buộc phải ước lượng tất cả states cùng lúc vì các ước lượng phụ thuộc lẫn nhau.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Vì MC không bootstrap, ước lượng mỗi state là độc lập; chi phí ước lượng giá trị một state *không* phụ thuộc số lượng states. Ta có thể sinh các episode bắt đầu từ những state quan tâm và chỉ lấy trung bình returns cho chúng, bỏ qua mọi state khác. DP cập nhật dựa trên successors nên về bản chất phải xử lý toàn state space để mọi giá trị nhất quán. Đây là lợi thế lớn của MC khi chỉ cần một tập con nhỏ. (D mô tả sai — chính DP mới có phụ thuộc lẫn nhau; C đảo ngược lợi thế.)

</details>

---

## 5.2 Monte Carlo Estimation of Action Values

**Câu 12.** Tại sao khi không có mô hình môi trường, việc ước lượng action values (q-values) lại đặc biệt hữu ích hơn state values?

- A. Vì action values luôn có phương sai nhỏ hơn state values khi ước lượng bằng MC.
- B. Với state values, ta chỉ cần nhìn trước một-bước để chọn action tốt nhất — nhưng việc này cần mô hình; không có mô hình thì state values đơn lẻ không đủ, phải ước lượng tường minh giá trị mỗi action để gợi ý policy.
- C. Vì action values dễ tính hơn về mặt toán học so với state values.
- D. Vì state values không hội tụ được trong khung Monte Carlo.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Với mô hình, state values là đủ: chỉ cần nhìn trước một-bước và chọn action dẫn tới kết hợp tốt nhất của reward và next state. Không có mô hình, state values đơn lẻ không đủ — ta phải ước lượng tường minh giá trị mỗi action để gợi ý policy. Vì vậy một mục tiêu chính của MC là ước lượng q*. (A, C, D không phải lý do trong sách — vấn đề là thiếu mô hình để chuyển từ v sang chọn action.)

</details>

---

**Câu 13.** Khi ước lượng action values q_π(s,a) bằng MC với một policy deterministic π, vấn đề nghiêm trọng gì nảy sinh?

- A. Phương sai của các ước lượng trở nên vô hạn ngay cả với episode hữu hạn.
- B. Các returns trở nên có bias hệ thống vì policy deterministic.
- C. q_π(s,a) không hội tụ ngay cả khi mọi pair được visit vô hạn lần.
- D. Nhiều state–action pair có thể không bao giờ được visit — với policy deterministic, ta chỉ quan sát returns cho một action tại mỗi state, nên các action khác không cải thiện được; đây là vấn đề *maintaining exploration*.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Phức tạp duy nhất là nhiều state–action pair có thể không bao giờ được visit. Nếu π deterministic, đi theo π ta chỉ quan sát returns cho một action tại mỗi state; không có returns để lấy trung bình, MC estimates của các action khác không cải thiện theo kinh nghiệm. Điều này nghiêm trọng vì mục đích học action values là để chọn giữa các action — đây chính là vấn đề chung *maintaining exploration*. (A, B, C mô tả sai — đây là vấn đề coverage/exploration, không phải bias hay phương sai vô hạn.)

</details>

---

**Câu 14.** Giả định *exploring starts* là gì?

- A. Mọi episode đều bắt đầu từ cùng một state cố định đã chọn trước.
- B. Episode bắt đầu tại một state–action pair, và mọi pair có xác suất khác 0 được chọn làm điểm bắt đầu — đảm bảo mọi pair được visit vô hạn lần trong giới hạn vô hạn episode.
- C. Policy khởi đầu bắt buộc phải là policy tối ưu để bảo đảm hội tụ.
- D. Mọi action ở state đầu tiên phải được thử đúng một lần trước khi episode tiếp tục.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Một cách đảm bảo exploration là quy định episode bắt đầu tại một state–action pair, mọi pair có xác suất khác 0 được chọn làm điểm bắt đầu. Điều này đảm bảo tất cả state–action pair được visit vô hạn lần trong giới hạn vô hạn episode — gọi là giả định *exploring starts*. Tuy hữu ích, nó không thể dựa vào trong trường hợp tổng quát, đặc biệt khi học từ tương tác thực. (A, C, D mô tả sai bản chất — điểm mấu chốt là *cặp* (s,a) khởi đầu phủ khắp.)

</details>

---

**Câu 15.** [Khó] Một MDP có 4 states, mỗi state có 3 actions. Để Monte Carlo ES bảo đảm tính chất hội tụ về mặt lý thuyết, số state–action pair tối thiểu cần được chọn làm exploring start với xác suất khác 0 là bao nhiêu, và tại sao?

- A. 4 — mỗi state cần đúng một pair khởi đầu vì policy sẽ tự khám phá các action còn lại.
- B. 3 — chỉ cần phủ các action của một state đại diện.
- C. 12 — mọi state–action pair (4×3) đều phải có xác suất khác 0, vì exploring starts đòi hỏi *mọi* pair được visit vô hạn lần để mọi q(s,a) được ước lượng.
- D. 1 — chỉ cần một pair khởi đầu vì các episode dài sẽ tự nhiên đi qua mọi pair.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Exploring starts yêu cầu *mọi* state–action pair có xác suất khác 0 được chọn làm điểm bắt đầu, để đảm bảo tất cả pair được visit vô hạn lần. Với 4 states × 3 actions = 12 pair, cả 12 đều cần xác suất khởi đầu dương. Đây chính là điều khiến giả định khó áp dụng thực tế: nếu thiếu dù chỉ một pair, MC có thể không bao giờ ước lượng được q của pair đó và policy improvement có thể bỏ sót action tốt. (A, B, D đánh giá thấp yêu cầu phủ toàn bộ pair.)

</details>

---

## 5.3 Monte Carlo Control

**Câu 16.** Monte Carlo control dựa trên ý tưởng tổng quát nào, đã được giới thiệu trong chương DP?

- A. Value iteration thuần túy, thực hiện một sweep Bellman optimality mỗi vòng.
- B. Generalized Policy Iteration (GPI) — duy trì cả một policy xấp xỉ và một value function xấp xỉ, lặp đánh giá và cải thiện cho tới khi cả hai tiến tới tối ưu.
- C. Q-learning với cập nhật off-policy theo từng transition.
- D. Importance sampling để hiệu chỉnh giữa hai policy khác nhau.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — MC control theo cùng mẫu chương DP, theo ý tưởng *generalized policy iteration (GPI)*: duy trì cả policy xấp xỉ và value function xấp xỉ. Value function liên tục được điều chỉnh để xấp xỉ value function của policy hiện tại, và policy liên tục được cải thiện theo value function hiện tại. Hai loại thay đổi này phần nào "chống lại nhau" nhưng cùng đưa cả hai tiến tới tối ưu. (A, C, D là các phương pháp cụ thể, không phải khung tổng quát mà MC control dựa vào.)

</details>

---

**Câu 17.** Trong MC control, policy improvement được thực hiện như thế nào, và tại sao không cần mô hình?

- A. Bằng cách giải phương trình Bellman cho v_π rồi suy ra greedy policy.
- B. Bằng cách lấy đạo hàm của return theo tham số policy và đi theo gradient.
- C. Bằng cách làm policy greedy theo action-value function hiện tại: π(s) = argmax_a q(s,a) — vì có action-value function nên không cần mô hình để xây policy greedy.
- D. Bằng cách áp dụng importance sampling cho từng action rồi chuẩn hóa.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Policy improvement được làm bằng cách greedy theo value function hiện tại. Vì ta có *action-value function*, không cần mô hình để xây policy greedy: với mỗi state, greedy policy chọn action có action-value lớn nhất, π(s) = argmax_a q(s,a). Policy improvement theorem (Mục 4.2) khi đó áp dụng được, đảm bảo mỗi π_{k+1} tốt hơn hoặc bằng π_k. (A cần v_π và mô hình; B là policy gradient; D không liên quan.)

</details>

---

**Câu 18.** Hai giả định "không thực tế" nào được dùng để dễ dàng chứng minh hội tụ của MC policy iteration ban đầu?

- A. Exploring starts, VÀ policy evaluation được thực hiện với số episode vô hạn.
- B. Policy phải deterministic, VÀ rewards bị chặn trong khoảng hữu hạn.
- C. Discount γ = 1, VÀ state space hữu hạn và đủ nhỏ.
- D. Behavior policy bằng target policy, VÀ mọi return đều dương.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Hai giả định không thực tế: (1) episode có exploring starts, và (2) policy evaluation được làm với số episode *vô hạn*. Để có thuật toán thực tế phải bỏ cả hai. Giả định thứ hai được bỏ bằng cách không cố hoàn tất evaluation trước khi quay lại improvement — thay vào đó dịch value function về phía q_{π_k} theo từng episode (giống value iteration cực đoan). (B, C, D không phải hai giả định mấu chốt trong chứng minh.)

</details>

---

**Câu 19.** Trong thuật toán Monte Carlo ES (Exploring Starts), đánh giá và cải thiện policy được xen kẽ như thế nào?

- A. Một lần evaluation hoàn chỉnh tới hội tụ, rồi một lần improvement, lặp lại như policy iteration cổ điển.
- B. Theo từng bước (step-by-step) online, cập nhật ngay sau mỗi transition trong episode.
- C. Chỉ cải thiện policy một lần duy nhất sau khi toàn bộ quá trình huấn luyện kết thúc.
- D. Theo từng episode: sau mỗi episode, returns quan sát được dùng cho evaluation, rồi policy được cải thiện tại tất cả states đã visit trong episode đó.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Với MC policy iteration, tự nhiên là xen kẽ evaluation và improvement theo từng episode. Sau mỗi episode, returns quan sát được dùng cho evaluation, rồi policy được cải thiện tại tất cả states đã visit. MC ES dùng exploring starts, lấy trung bình returns cho mỗi state–action pair (first-visit), rồi đặt π(S_t) = argmax_a Q(S_t,a). (A là policy iteration cổ điển — MC ES không chờ evaluation hội tụ; B là TD/online; C sai hoàn toàn.)

</details>

---

**Câu 20.** Về tính hội tụ của Monte Carlo ES, phát biểu nào ĐÚNG theo sách?

- A. Đã được chứng minh chính thức là hội tụ về policy tối ưu trong mọi trường hợp.
- B. Dễ thấy nó không thể hội tụ về policy suboptimal nào (vì khi đó value sẽ hội tụ theo policy đó, làm policy lại đổi); ổn định chỉ đạt khi cả hai tối ưu — nhưng việc hội tụ tới fixed point tối ưu *vẫn chưa được chứng minh chính thức*.
- C. Nó luôn hội tụ về một policy suboptimal cố định nào đó.
- D. Nó chỉ hội tụ khi được kết hợp với importance sampling.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Trong MC ES, mọi returns cho mỗi state–action pair được tích lũy và lấy trung bình bất kể policy nào đang dùng khi quan sát. Dễ thấy MC ES không thể hội tụ về policy suboptimal: nếu vậy value function sẽ hội tụ theo policy đó, lại làm policy thay đổi. Ổn định chỉ đạt khi cả policy và value đều tối ưu. Tuy nhiên việc hội tụ tới fixed point tối ưu này, dù có vẻ tất yếu, *vẫn chưa được chứng minh chính thức* — một trong những câu hỏi lý thuyết mở cơ bản nhất của RL. (A nói quá; C, D sai.)

</details>

---

## 5.4 Monte Carlo Control without Exploring Starts

**Câu 21.** Cách tổng quát duy nhất để đảm bảo mọi action được chọn vô hạn lần (không dùng exploring starts) là gì, và nó dẫn tới hai lớp phương pháp nào?

- A. Đặt γ = 1; dẫn tới prediction và control.
- B. Tăng số episode lên vô hạn; dẫn tới first-visit và every-visit.
- C. Dùng policy deterministic; dẫn tới ordinary và weighted importance sampling.
- D. Để agent tiếp tục chọn mọi action; dẫn tới *on-policy* methods (đánh giá/cải thiện chính policy ra quyết định) và *off-policy* methods (đánh giá/cải thiện một policy khác policy sinh dữ liệu).

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Cách tổng quát duy nhất để đảm bảo mọi action được chọn vô hạn lần là để agent tiếp tục chọn chúng. Có hai cách: *on-policy* methods (đánh giá/cải thiện chính policy ra quyết định) và *off-policy* methods (đánh giá/cải thiện một policy *khác* policy sinh dữ liệu). MC ES là một ví dụ on-policy. (A, B, C nhầm sang các phân loại khác — không trả lời câu hỏi về cách duy trì exploration.)

</details>

---

**Câu 22.** Định nghĩa của ε-soft policy và ε-greedy policy là gì?

- A. ε-soft là policy với π(a|s) ≥ ε/|A(s)| cho mọi state, action (ε > 0); ε-greedy là ε-soft policy chọn action greedy với xác suất 1 − ε + ε/|A(s)| và mỗi action không-greedy với xác suất ε/|A(s)|.
- B. ε-soft là policy deterministic; ε-greedy là policy ngẫu nhiên đều trên mọi action.
- C. ε-soft chọn action hoàn toàn ngẫu nhiên; ε-greedy luôn chọn action tốt nhất, không bao giờ ngẫu nhiên.
- D. ε-soft và ε-greedy là hai tên gọi của cùng một policy, không có khác biệt.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — *soft* policy nghĩa là π(a|s) > 0 cho mọi s, a, nhưng dần dịch về phía deterministic optimal. ε-greedy: hầu hết thời gian chọn action có action-value lớn nhất, với xác suất ε chọn ngẫu nhiên; mỗi action không-greedy có xác suất tối thiểu ε/|A(s)|, action greedy có 1 − ε + ε/|A(s)|. ε-greedy là một loại *ε-soft* (π(a|s) ≥ ε/|A(s)| cho mọi s, a với ε > 0), và trong các ε-soft policies, ε-greedy là loại "gần greedy nhất". (B, C, D đều mô tả sai.)

</details>

---

**Câu 23.** Trong on-policy MC control không dùng exploring starts, tại sao không thể làm policy greedy hoàn toàn, và giải pháp là gì?

- A. Vì làm policy greedy hoàn toàn sẽ ngăn tiếp tục explore các action không-greedy; vì GPI chỉ yêu cầu dịch policy *về phía* greedy, ta chỉ dịch tới một ε-greedy policy — và bất kỳ ε-greedy policy theo q_π đều tốt hơn hoặc bằng policy ε-soft π.
- B. Vì greedy policy không hội tụ về mặt toán học; giải pháp là dùng importance sampling thay thế.
- C. Vì greedy policy không tồn tại khi có nhiều action; giải pháp là dùng soft starts thay exploring starts.
- D. Vì greedy policy chỉ định nghĩa được cho off-policy methods, không cho on-policy.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Không có exploring starts, ta không thể chỉ làm policy greedy theo value function hiện tại vì điều đó ngăn explore các action không-greedy. May mắn là GPI không yêu cầu greedy hoàn toàn, chỉ cần dịch *về phía* greedy: ở đây ta dịch tới một ε-greedy policy. Với bất kỳ ε-soft policy π, bất kỳ ε-greedy policy theo q_π cũng tốt hơn hoặc bằng π (theo policy improvement theorem). (B, C, D bịa lý do không có trong sách.)

</details>

---

**Câu 24.** Kết quả của on-policy MC control (cho ε-soft policies) đạt được là gì so với MC ES?

- A. Đạt được policy tối ưu tuyệt đối mà không còn bất kỳ ràng buộc nào.
- B. Đạt được policy tệ hơn MC ES nhưng bù lại tốc độ huấn luyện nhanh hơn nhiều.
- C. Chỉ đạt được policy tốt nhất *trong số các ε-soft policies*, nhưng đã loại bỏ được giả định exploring starts.
- D. Không hội tụ tới bất kỳ policy ổn định nào do exploration liên tục.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Phân tích cho thấy policy iteration hoạt động cho ε-soft policies: được đảm bảo cải thiện ở mỗi bước, trừ khi đã tìm được policy tốt nhất trong số các ε-soft policies. Như vậy ta chỉ đạt được policy tốt nhất *trong số các ε-soft policies*, nhưng đổi lại loại bỏ được giả định exploring starts. (A nói quá; B, D sai — vẫn hội tụ và không nhanh hơn ở mức "tệ hơn".)

</details>

---

## 5.5 Off-policy Prediction via Importance Sampling

**Câu 25.** Trong off-policy learning, *target policy* π và *behavior policy* b là gì?

- A. Target policy sinh ra hành vi; behavior policy là policy được học về và sẽ tối ưu.
- B. Target policy là policy được học về (sẽ trở thành tối ưu); behavior policy là policy explore hơn, dùng để sinh ra hành vi.
- C. Cả hai luôn phải giống hệt nhau ở mọi state để đảm bảo hội tụ.
- D. Target policy luôn phải ngẫu nhiên còn behavior policy luôn phải deterministic.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Off-policy dùng hai policy: một được học về và sẽ thành tối ưu — *target policy* π; và một explore hơn, dùng sinh hành vi — *behavior policy* b. Việc học là từ dữ liệu "off" target policy. On-policy là trường hợp đặc biệt khi target và behavior trùng nhau. Off-policy thường mạnh và tổng quát hơn nhưng phương sai lớn hơn và hội tụ chậm hơn. (A đảo ngược vai trò; C sai — đó là on-policy; D sai — thường ngược lại, target có thể deterministic.)

</details>

---

**Câu 26.** Giả định *coverage* (bao phủ) trong off-policy prediction yêu cầu điều gì?

- A. Behavior policy b phải deterministic ở mọi state để ổn định.
- B. Target policy π phải bằng behavior policy b ở mọi state có action chung.
- C. Mọi action được thực hiện dưới π cũng phải được thực hiện ít nhất thỉnh thoảng dưới b: π(a|s) > 0 kéo theo b(a|s) > 0.
- D. Mọi state phải được visit vô hạn lần dưới chính target policy π.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Để dùng episode từ b mà ước lượng giá trị cho π, ta yêu cầu mọi action thực hiện dưới π cũng được thực hiện ít nhất thỉnh thoảng dưới b: π(a|s) > 0 kéo theo b(a|s) > 0 — giả định *coverage*. Suy ra b phải stochastic ở các state nó không trùng π. Target π thì có thể deterministic (thường greedy trong control). (A, B sai — b phải stochastic chứ không deterministic, và hai policy khác nhau; D mô tả sai điều kiện.)

</details>

---

**Câu 27.** Importance-sampling ratio ρ_{t:T-1} được định nghĩa và có tính chất quan trọng nào?

- A. ρ_{t:T-1} = ∏_{k=t}^{T-1} b(A_k|S_k) / π(A_k|S_k); nó phụ thuộc hoàn toàn vào động lực học MDP.
- B. ρ_{t:T-1} là tổng các tỉ số π/b dọc trajectory; nó phụ thuộc vào rewards nhận được.
- C. ρ_{t:T-1} luôn bằng 1 trong mọi tình huống off-policy.
- D. ρ_{t:T-1} = ∏_{k=t}^{T-1} [π(A_k|S_k) / b(A_k|S_k)]; nó chỉ phụ thuộc hai policy và chuỗi action, KHÔNG phụ thuộc động lực học MDP vì các xác suất chuyển trạng thái p triệt tiêu ở tử và mẫu.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Importance-sampling ratio là tỉ số xác suất tương đối của trajectory dưới target và behavior policy: ρ_{t:T-1} = ∏_{k=t}^{T-1} [π(A_k|S_k) p(S_{k+1}|S_k,A_k)] / [b(A_k|S_k) p(S_{k+1}|S_k,A_k)] = ∏_{k=t}^{T-1} π(A_k|S_k) / b(A_k|S_k). Dù xác suất trajectory phụ thuộc p (thường không biết), chúng xuất hiện giống hệt ở tử và mẫu nên *triệt tiêu*. Vì vậy ρ chỉ phụ thuộc hai policy và chuỗi action. (A đảo tử/mẫu; B sai — là tích, không phải tổng, và không phụ thuộc reward; C sai.)

</details>

---

**Câu 28.** Tại sao cần importance-sampling ratio ρ để ước lượng v_π từ returns sinh bởi b, và công thức biến đổi kỳ vọng là gì?

- A. Vì returns G_t từ b có kỳ vọng sai E[G_t|S_t=s] = v_b(s); nhân với ρ_{t:T-1} biến đổi chúng về kỳ vọng đúng: E[ρ_{t:T-1} G_t | S_t=s] = v_π(s).
- B. Vì returns từ b luôn bằng 0 nên cần ρ làm chúng khác 0 trước khi lấy trung bình.
- C. Vì ρ có tác dụng chính là giảm phương sai của các returns thô từ behavior policy.
- D. Vì returns từ b đã có kỳ vọng đúng v_π(s) rồi, ρ chỉ dùng để chuẩn hóa thang đo.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Returns G_t do behavior policy có kỳ vọng *sai*: E[G_t|S_t=s] = v_b(s), nên không thể lấy trung bình trực tiếp để có v_π. Importance sampling vào cuộc: ratio ρ_{t:T-1} biến đổi returns để có kỳ vọng đúng: E[ρ_{t:T-1} G_t | S_t=s] = v_π(s). (B sai — returns không nhất thiết bằng 0; C sai — IS thường *tăng* phương sai; D mâu thuẫn — kỳ vọng của G_t là v_b chứ không phải v_π.)

</details>

---

**Câu 29.** [Khó] Trong một episode off-policy, tại một state s behavior policy chọn action a với b(a|s) = 0.2, còn target policy chọn cùng action đó với π(a|s) = 0.8. Giả sử phần còn lại của trajectory có ρ tích lũy bằng 1. Trọng số ρ cho return từ s là bao nhiêu, và nó nói lên điều gì?

- A. ρ = 0.2/0.8 = 0.25 — return bị giảm trọng số vì target ít chọn action này hơn behavior.
- B. ρ = 0.8/0.2 = 4 — return được tăng trọng số gấp 4 vì target chọn action này thường xuyên hơn behavior nhiều, nên mẫu này "đại diện" cho target nhiều hơn là cho behavior.
- C. ρ = 0.8 × 0.2 = 0.16 — vì ratio là tích của hai xác suất.
- D. ρ = 1 — vì hai policy cùng chọn một action nên không cần hiệu chỉnh.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — ρ tại bước đó là π(a|s)/b(a|s) = 0.8/0.2 = 4; nhân với phần còn lại (=1) cho ρ = 4. Vì target policy chọn action này với xác suất gấp 4 lần behavior, mẫu trajectory này hiếm dưới b nhưng phổ biến dưới π, nên importance sampling tăng trọng số của nó lên 4 lần để bù lại — đúng tinh thần "reweight mẫu từ b cho khớp phân phối của π". (A đảo ngược tử/mẫu; C nhầm thành tích thay vì tỉ số; D bỏ qua chênh lệch xác suất.)

</details>

---

**Câu 30.** Phân biệt *ordinary importance sampling* và *weighted importance sampling* (cho first-visit) về công thức ước lượng V(s)?

- A. Ordinary: chia tổng các ρG cho tổng các ρ; Weighted: chia tổng các ρG cho số visit |T(s)|.
- B. Cả hai đều chia cho |T(s)|, chỉ khác ở cách nhân ρ vào return.
- C. Ordinary: V(s) = [∑ ρ_{t:T(t)-1} G_t] / |T(s)| (trung bình đơn giản); Weighted: V(s) = [∑ ρ_{t:T(t)-1} G_t] / [∑ ρ_{t:T(t)-1}] (trung bình có trọng số), bằng 0 nếu mẫu số bằng 0.
- D. Weighted importance sampling không sử dụng ρ trong công thức của nó.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — *Ordinary IS* dùng trung bình đơn giản: V(s) = [∑_{t∈T(s)} ρ_{t:T(t)-1} G_t] / |T(s)| (chia cho số visit). *Weighted IS* dùng trung bình có trọng số: V(s) = [∑ ρG] / [∑ ρ], hoặc bằng 0 nếu mẫu số bằng 0 (chia cho tổng các ρ). (A đảo ngược hai mẫu số; B sai — chỉ ordinary chia cho |T(s)|; D sai — weighted vẫn dùng ρ.)

</details>

---

**Câu 31.** So sánh bias và variance của ordinary và weighted importance sampling (cho first-visit) như thế nào?

- A. Ordinary IS *unbiased* nhưng phương sai nói chung *không bị chặn* (có thể vô hạn); Weighted IS *biased* (bias hội tụ tiệm cận về 0) nhưng phương sai luôn hữu hạn (trọng số lớn nhất trên một return là 1), thực tế thường được ưa chuộng hơn.
- B. Ordinary IS biased; Weighted IS unbiased; cả hai đều có phương sai vô hạn.
- C. Cả hai đều unbiased và có phương sai bằng nhau, chỉ khác về tốc độ hội tụ.
- D. Weighted IS unbiased và phương sai vô hạn; Ordinary IS biased và phương sai hữu hạn.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Ordinary IS *unbiased* (kỳ vọng luôn là v_π(s)) nhưng phương sai nói chung *không bị chặn* vì phương sai các ratio có thể vô hạn (Example 5.5). Weighted IS *biased* (sau một return đơn lẻ, ratio triệt tiêu nên ước lượng bằng chính return đó, kỳ vọng là v_b(s)) nhưng bias hội tụ tiệm cận về 0; phương sai luôn hữu hạn vì trọng số lớn nhất trên một return là 1, và hội tụ về 0 ngay cả khi phương sai ratio vô hạn. Thực tế weighted thường có phương sai thấp hơn rõ rệt và được ưa chuộng mạnh. (B, C, D gán sai tính chất bias/variance.)

</details>

---

**Câu 32.** [Khó] Trong off-policy first-visit prediction, một state s được visit đúng *một* lần với weighted importance sampling, và ρ cho visit đó bằng 7. Return quan sát được là G = 10. Ước lượng V(s) là bao nhiêu, và giải thích tại sao điều này minh họa bias của weighted IS?

- A. V(s) = 70, vì weighted IS scale return bởi ρ rồi giữ nguyên.
- B. V(s) = 10, vì với một mẫu duy nhất ρ triệt tiêu (∑ρG / ∑ρ = ρG/ρ = G), nên ước lượng đúng bằng return — kỳ vọng của nó là v_b(s) chứ không phải v_π(s), đó chính là bias.
- C. V(s) = 1.43 (= 10/7), vì weighted IS chia return cho ρ.
- D. V(s) = 0, vì với một mẫu duy nhất weighted IS quy ước trả về 0.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Với weighted IS và một mẫu duy nhất: V(s) = ρG / ρ = (7×10)/7 = 10. Ratio triệt tiêu hoàn toàn, nên ước lượng bằng chính return G — bất kể ρ. Kỳ vọng của return này là v_b(s) (giá trị dưới behavior policy), *không* phải v_π(s). Đây chính là bias của weighted IS: sau số mẫu nhỏ nó nghiêng về v_b, dù bias giảm tiệm cận về 0 khi số mẫu tăng. (A là cách ordinary IS scale; C, D hiểu sai công thức và quy ước.)

</details>

---

**Câu 33.** Ví dụ Infinite Variance (Example 5.5) minh họa điều gì về ordinary importance sampling?

- A. Ordinary IS luôn hội tụ nhanh hơn weighted IS trong mọi MDP có loop.
- B. Khi trajectory chứa loop trong off-policy, các scaled returns có thể có phương sai *vô hạn*; first-visit MC với ordinary IS có thể KHÔNG hội tụ về giá trị đúng (=1) ngay cả sau hàng triệu episode, trong khi weighted IS cho đúng 1 ngay sau episode đầu kết thúc bằng action left.
- C. Ordinary IS luôn cho ước lượng bằng 0 trong ví dụ MDP một-state này.
- D. Weighted IS có phương sai vô hạn còn ordinary IS có phương sai hữu hạn trong ví dụ này.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Trong MDP một-state với hai action (left/right), target policy luôn chọn left và v_π(s) = 1. Ước lượng bằng ordinary IS từ off-policy data có phương sai *vô hạn* (do trajectory chứa loop quay lại s) nên dù sau hàng triệu episode vẫn không hội tụ về 1. Trái lại weighted IS cho ước lượng đúng *bằng 1 mãi mãi* sau episode đầu kết thúc bằng left, vì mọi return không bằng 1 (kết thúc bằng right) có ρ = 0 nên không đóng góp. (A, C, D mô tả sai kết quả.)

</details>

---

**Câu 34.** Đối với every-visit methods, tính chất bias là gì?

- A. Cả every-visit ordinary và every-visit weighted IS đều unbiased.
- B. Every-visit ordinary là biased, còn every-visit weighted là unbiased.
- C. Cả hai every-visit methods (ordinary và weighted) đều *biased*, dù bias giảm tiệm cận về 0 khi số mẫu tăng; thực tế thường được ưa chuộng vì không cần theo dõi state nào đã visit và dễ mở rộng cho function approximation.
- D. Every-visit methods nói chung không hội tụ về v_π(s).

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Cả hai every-visit methods cho ordinary và weighted IS đều *biased*, dù bias giảm tiệm cận về 0 khi số mẫu tăng. Thực tế, every-visit thường được ưa chuộng vì loại bỏ nhu cầu theo dõi state nào đã visit và dễ mở rộng cho approximation (function approximation, eligibility traces). (A, B sai — every-visit ordinary cũng biased; D sai — chúng vẫn hội tụ.)

</details>

---

**Câu 35.** [Khó] Giả sử bạn cần ước lượng off-policy với rất ít episode và muốn tránh phương sai khổng lồ do các ρ cực lớn thỉnh thoảng xuất hiện. Giữa ordinary và weighted importance sampling, lựa chọn nào hợp lý hơn, và đánh đổi gì?

- A. Chọn ordinary IS vì nó unbiased; chấp nhận đánh đổi là cần nhiều episode hơn để hội tụ.
- B. Chọn weighted IS vì phương sai luôn hữu hạn (trọng số tối đa trên một return là 1) nên ổn định hơn nhiều với ít mẫu; đánh đổi là nó có bias nhỏ (hội tụ tiệm cận về 0).
- C. Cả hai tương đương ở chế độ ít mẫu nên chọn tùy ý.
- D. Chọn ordinary IS vì với ít mẫu nó luôn cho phương sai nhỏ hơn weighted.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Weighted IS có phương sai luôn hữu hạn vì trọng số lớn nhất trên một return là 1, nên ngay cả khi phương sai của ratio là vô hạn, ước lượng vẫn ổn định — đặc biệt quý giá khi ít mẫu. Đánh đổi: weighted IS có bias (nghiêng về v_b với ít mẫu, hội tụ tiệm cận về 0). Ordinary IS unbiased nhưng phương sai có thể vô hạn, gây ước lượng cực đoan với ít mẫu. Vì vậy thực tế weighted IS thường được ưa chuộng. (A đúng về tính chất nhưng kết luận ngược; C, D sai.)

</details>

---

## 5.6 Incremental Implementation

**Câu 36.** Đối với weighted importance sampling, quy tắc cập nhật incremental cho V_n (với trọng số W_i = ρ) là gì?

- A. V_{n+1} = V_n + (1/n)[G_n − V_n], với n là số episode đã quan sát.
- B. V_{n+1} = V_n + W_n [G_n − V_n], cập nhật theo toàn bộ trọng số.
- C. V_{n+1} = V_n + (W_n / C_n)[G_n − V_n], trong đó C_n là tổng tích lũy các trọng số (C_{n+1} = C_n + W_{n+1}, C_0 = 0).
- D. V_{n+1} = ∑_k W_k G_k, không tồn tại dạng incremental cho weighted IS.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Với weighted IS cần trung bình có trọng số nên cần thuật toán incremental hơi khác. Với dãy returns G_1,...,G_{n-1} và trọng số W_i tương ứng, quy tắc là V_{n+1} = V_n + (W_n / C_n)[G_n − V_n], với C_n là tổng tích lũy trọng số: C_{n+1} = C_n + W_{n+1}, C_0 = 0 (V_1 tùy ý). (A là dạng sample-average cho ordinary/equal weights; B, D sai.)

</details>

---

**Câu 37.** Trong incremental implementation của off-policy MC, ordinary và weighted importance sampling được xử lý khác nhau ra sao?

- A. Cả hai dùng chung một thuật toán incremental, không có khác biệt.
- B. Với ordinary IS, các scaled returns (ρ·G) được dùng *thay cho* rewards trong phương pháp incremental Chương 2 rồi lấy trung bình đơn giản; với weighted IS phải dùng thuật toán incremental hơi khác để tạo trung bình có trọng số (dùng C_n).
- C. Ordinary IS không thể implement theo kiểu incremental, chỉ weighted IS làm được.
- D. Weighted IS dùng trung bình đơn giản, còn ordinary IS dùng trung bình có trọng số.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Với ordinary IS, returns được scale bởi ratio ρ_{t:T(t)-1} rồi đơn giản lấy trung bình; có thể tái dùng phương pháp incremental Chương 2 nhưng thay rewards bằng scaled returns. Với weighted IS phải tạo trung bình *có trọng số* nên cần thuật toán incremental hơi khác, dùng tổng tích lũy trọng số C_n. Khi π = b (on-policy), W luôn bằng 1. (A sai — chúng khác nhau; C sai — ordinary cũng incremental được; D đảo ngược.)

</details>

---

## 5.7 Off-policy Monte Carlo Control

**Câu 38.** Đặc điểm phân biệt off-policy MC control so với on-policy là gì, và yêu cầu nào đặt lên behavior policy?

- A. Off-policy dùng chung một policy cho cả sinh hành vi lẫn đánh giá, giống on-policy.
- B. Off-policy yêu cầu target policy phải soft, còn behavior policy phải deterministic.
- C. Off-policy không cần thỏa mãn giả định coverage giữa hai policy.
- D. Off-policy tách hai chức năng: behavior policy b (sinh hành vi, có thể không liên quan target) và target policy π (được đánh giá/cải thiện, có thể deterministic/greedy); yêu cầu b phải *soft* để đảm bảo coverage và exploration.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Đặc trưng on-policy là ước lượng giá trị policy *trong khi dùng nó* để control. Off-policy tách hai chức năng: behavior b (sinh hành vi, có thể không liên quan target) và target π (được đánh giá/cải thiện, có thể deterministic/greedy). Lợi thế: target có thể deterministic trong khi behavior tiếp tục lấy mẫu mọi action. Yêu cầu: b có xác suất khác 0 cho mọi action mà target có thể chọn (coverage), và để explore thì b phải *soft* (thường chọn ε-soft). (A là on-policy; B đảo vai trò; C sai — coverage là bắt buộc.)

</details>

---

**Câu 39.** Một vấn đề tiềm tàng của off-policy MC control với weighted importance sampling là gì?

- A. Nó học quá nhanh từ mọi phần episode nên trở nên không ổn định.
- B. Nó chỉ học từ *đuôi* (tails) của episode — phần mà tất cả action còn lại đều greedy; nếu action không-greedy phổ biến, việc học sẽ chậm, đặc biệt cho state ở đầu các episode dài.
- C. Nó yêu cầu biết động lực học MDP để hiệu chỉnh ratio.
- D. Nó không bao giờ hội tụ về policy tối ưu dù có vô hạn dữ liệu.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Trong thuật toán off-policy MC control (target greedy), vòng lặp trong thoát ngay khi A_t ≠ π(S_t). Vấn đề: method này chỉ học từ *đuôi* episode — khi mọi action còn lại đều greedy. Nếu action không-greedy phổ biến, học sẽ chậm, đặc biệt cho state ở đầu các episode dài. Cách khắc phục quan trọng nhất là kết hợp temporal-difference learning (Chương 6); hoặc nếu γ < 1 thì ý tưởng discounting-aware cũng giúp. (A, C, D sai.)

</details>

---

**Câu 40.** Trong thuật toán off-policy MC control, cập nhật W ở cuối vòng lặp là W ← W · (1 / b(A_t|S_t)) thay vì W · π(A_t|S_t)/b(A_t|S_t). Tại sao điều này vẫn đúng?

- A. Vì target policy π là deterministic greedy, và vòng lặp đã thoát khi A_t ≠ π(S_t); với các action còn lại A_t = π(S_t) nên π(A_t|S_t) = 1.
- B. Vì importance sampling về nguyên tắc không cần tới tử số π.
- C. Vì behavior policy b(A_t|S_t) luôn bằng 1 trong thuật toán này.
- D. Vì đây là một lỗi in trong sách, công thức đúng phải giữ cả tử số π.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Target π là greedy deterministic. Nếu A_t ≠ π(S_t) thì π(A_t|S_t) = 0 và ta thoát vòng lặp trong (chuyển episode kế). Với mọi step còn được xử lý, A_t = π(S_t) nên π(A_t|S_t) = 1. Do đó tử số π trong cập nhật W luôn bằng 1, công thức rút gọn còn W ← W · (1 / b(A_t|S_t)). (Đây chính là nội dung Exercise 5.11.) (B sai — IS cần tử số; C sai — b không bằng 1; D sai — không phải lỗi.)

</details>

---

**Câu 41.** [Khó] Trong off-policy MC control với target greedy và behavior ε-greedy, một episode kết thúc với chuỗi 5 action cuối: ba action đầu (trong số 5) là non-greedy theo π, hai action cuối là greedy. Việc học (cập nhật Q) thực sự xảy ra cho bao nhiêu bước cuối của episode này, và tại sao?

- A. Cho cả 5 bước, vì importance sampling hiệu chỉnh được mọi action kể cả non-greedy.
- B. Cho 2 bước cuối, vì vòng lặp duyệt ngược từ cuối episode và thoát ngay khi gặp action non-greedy đầu tiên (action thứ 3 từ cuối) — chỉ các bước greedy ở đuôi mới được cập nhật.
- C. Cho 3 bước đầu (non-greedy), vì đó là nơi behavior khác target nên cần hiệu chỉnh.
- D. Không bước nào, vì episode chứa action non-greedy nên toàn bộ bị loại.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Thuật toán duyệt *ngược* từ bước cuối episode, cập nhật Q và W cho mỗi bước, rồi *thoát* vòng lặp trong ngay khi gặp A_t ≠ π(S_t) (một action non-greedy). Ở đây hai action cuối là greedy nên được cập nhật; bước kế tiếp (action non-greedy thứ 3 từ cuối) làm π(A_t|S_t) = 0, ratio bằng 0, và thuật toán chuyển sang episode tiếp. Vậy chỉ 2 bước greedy ở *đuôi* được học — đây chính là vấn đề "chỉ học từ tails" làm off-policy MC control chậm. (A, C hiểu sai cơ chế thoát; D sai — đuôi greedy vẫn học được.)

</details>

---

## 5.8 Discounting-aware Importance Sampling

**Câu 42.** Vấn đề mà discounting-aware importance sampling muốn giải quyết là gì? (Xét ví dụ episode dài 100 bước, γ = 0)

- A. Với γ = 0, return G_0 = R_1, nhưng ratio của ordinary IS lại là tích 100 thừa số π/b; 99 thừa số sau không liên quan (return đã xác định sau reward đầu), có kỳ vọng 1, không đổi kỳ vọng nhưng *tăng mạnh phương sai* (có khi thành vô hạn).
- B. Nó giải quyết vấn đề bias của weighted importance sampling khi γ nhỏ.
- C. Nó loại bỏ hoàn toàn nhu cầu dùng behavior policy trong off-policy.
- D. Nó làm cho Monte Carlo bootstrap giống Dynamic Programming để giảm phương sai.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Các off-policy method trước xem returns như khối thống nhất, không tận dụng cấu trúc nội tại là tổng các discounted rewards. Ví dụ: episode 100 bước, γ = 0 → G_0 = R_1, nhưng ratio lại là tích 100 thừa số π(A_0|S_0)/b(A_0|S_0)···π(A_99|S_99)/b(A_99|S_99). Trong ordinary IS, return bị scale bởi cả tích, nhưng thực ra chỉ cần thừa số đầu. 99 thừa số sau không liên quan tới return, có kỳ vọng 1, không đổi expected update nhưng *tăng mạnh phương sai* (có khi vô hạn). (B, C, D không phải vấn đề được nhắm tới.)

</details>

---

**Câu 43.** Ý tưởng cốt lõi của discounting-aware importance sampling là gì?

- A. Loại bỏ hoàn toàn importance sampling và thay bằng trung bình thô của returns.
- B. Coi discounting như xác định một xác suất kết thúc (degree of partial termination); return được phân rã thành các *flat partial returns* Ḡ_{t:h} (không discount, dừng ở horizon h), mỗi flat partial return được scale bởi một importance-sampling ratio cũng bị cắt cụt tương ứng tới h−1.
- C. Dùng bootstrapping qua các successor states để giảm phương sai như DP.
- D. Tăng γ lên 1 để mọi reward có trọng số bằng nhau và đơn giản hóa ratio.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Ý tưởng là coi discounting như xác định một xác suất kết thúc, hay tương đương một mức độ *partial termination*. Với γ ∈ [0,1), return G_0 coi như kết thúc một phần ở mỗi bước. Các *flat partial returns* Ḡ_{t:h} = R_{t+1} + ··· + R_h ("flat" = không discount, "partial" = dừng ở horizon h). Full return được viết thành tổng các flat partial returns; mỗi cái chỉ cần scale bởi ratio bị cắt cụt tới h−1. Khi γ = 1, các estimator này trùng off-policy estimator gốc Mục 5.5. (A, C, D mô tả sai ý tưởng.)

</details>

---

## 5.9 Per-decision Importance Sampling

**Câu 44.** Per-decision importance sampling khai thác cấu trúc nào của return, và có thể giảm phương sai ngay cả khi nào?

- A. Khai thác cấu trúc của return như tổng các rewards; mỗi sub-term ρ_{t:T-1}·R_{t+k} có thể thay bằng ρ_{t:t+k-1}·R_{t+k} trong kỳ vọng, vì các thừa số ratio sau reward có kỳ vọng 1 và không ảnh hưởng kỳ vọng — giúp giảm phương sai *ngay cả khi không có discounting* (γ = 1).
- B. Khai thác cấu trúc của chuỗi states; chỉ giảm phương sai khi γ < 1.
- C. Loại bỏ behavior policy và chỉ áp dụng được khi γ = 0.
- D. Bootstrap qua các successor states để rút ngắn horizon hiệu dụng.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Per-decision IS khai thác cấu trúc của return như tổng các rewards, và giảm phương sai *ngay cả khi không có discounting* (γ = 1). Mỗi term ρ_{t:T-1}·G_t là tổng các sub-term ρ_{t:T-1}·R_{t+k}. Với mỗi sub-term, các thừa số ratio cho event xảy ra *sau* reward có kỳ vọng 1 (E[π(A_k|S_k)/b(A_k|S_k)] = 1) và không ảnh hưởng kỳ vọng. Do đó E[ρ_{t:T-1}·R_{t+k}] = E[ρ_{t:t+k-1}·R_{t+k}], dẫn tới return thay thế G̃_t cùng kỳ vọng (unbiased first-visit) nhưng có thể phương sai thấp hơn. (B, C, D sai về điều kiện và cơ chế.)

</details>

---

**Câu 45.** Theo sách, có một phiên bản per-decision của weighted importance sampling không?

- A. Có, và nó luôn unbiased trong mọi tình huống.
- B. Có, và nó giống hệt phiên bản ordinary per-decision.
- C. Điều này chưa rõ ràng; tất cả các estimator được đề xuất cho việc này mà các tác giả biết đều *không consistent* (không hội tụ về giá trị đúng với dữ liệu vô hạn).
- D. Không, vì weighted importance sampling không tồn tại trong khung off-policy.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Sách nêu rõ: có phiên bản per-decision của weighted IS hay không thì *chưa rõ ràng*. Cho tới nay, tất cả estimator được đề xuất cho việc này mà các tác giả biết đều *không consistent* — không hội tụ về giá trị đúng ngay cả với dữ liệu vô hạn. (A, B nói quá; D sai — weighted IS có tồn tại.)

</details>

---

## 5.10 Summary

**Câu 46.** Theo phần Summary, đâu là các lợi thế của Monte Carlo methods so với DP methods?

- A. MC luôn hội tụ nhanh hơn DP trong mọi loại bài toán.
- B. MC không yêu cầu episode phải kết thúc, nên xử lý continuing tasks tốt hơn DP.
- C. MC luôn có phương sai nhỏ hơn DP nhờ lấy trung bình nhiều returns.
- D. (1) Học hành vi tối ưu trực tiếp từ tương tác, không cần mô hình; (2) dùng được với mô hình mô phỏng/mẫu; (3) dễ và hiệu quả khi tập trung vào một tập con nhỏ states; (4) ít bị tổn hại bởi vi phạm Markov property (vì không bootstrap).

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Summary nêu các lợi thế: (1) học hành vi tối ưu trực tiếp từ tương tác, không cần mô hình động lực học; (2) dùng được với simulation/sample models (dễ mô phỏng episode dù khó xây mô hình xác suất chuyển trạng thái tường minh); (3) dễ và hiệu quả khi tập trung vào tập con nhỏ states; (4) có thể ít bị tổn hại bởi vi phạm *Markov property* vì không cập nhật value dựa trên value của successor states — tức không *bootstrap*. (A, C nói quá; B sai — MC trong chương này cần episodic tasks.)

</details>

---

**Câu 47.** Theo Summary, hai khác biệt chính của Monte Carlo so với DP methods là gì?

- A. (1) MC dùng discounting còn DP thì không; (2) MC chỉ làm việc với episodic tasks.
- B. (1) MC nhanh hơn DP; (2) MC chính xác hơn DP.
- C. (1) MC chỉ dùng cho prediction; (2) DP chỉ dùng cho control.
- D. (1) MC vận hành trên sample experience nên học trực tiếp không cần mô hình; (2) MC *không bootstrap* (không cập nhật value dựa trên các value khác) — hai khác biệt này không gắn chặt và có thể tách rời.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Hai khác biệt chính: (1) MC vận hành trên *sample experience*, nên dùng được cho direct learning không cần mô hình; (2) MC *không bootstrap* — không cập nhật value dựa trên các value khác. Sách nhấn mạnh hai khác biệt này *không gắn chặt* và có thể tách rời; chương sau (TD learning) trình bày phương pháp học từ kinh nghiệm như MC nhưng *có* bootstrap như DP. (A, B, C mô tả sai.)

</details>

---

**Câu 48.** Theo Summary, sự phân biệt về exploration giữa on-policy và off-policy methods là gì?

- A. On-policy không explore; off-policy explore vô hạn nên luôn tốt hơn.
- B. On-policy: agent cam kết luôn explore và cố tìm policy tốt nhất *vẫn còn explore*; Off-policy: agent cũng explore (qua behavior policy) nhưng học một deterministic optimal policy có thể *không liên quan* tới policy được tuân theo.
- C. Cả hai đều học chính xác cùng một policy tối ưu, chỉ khác cách triển khai.
- D. On-policy dùng importance sampling, còn off-policy thì không cần.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Summary tóm tắt: trong on-policy, agent cam kết *luôn explore* và cố tìm policy tốt nhất mà vẫn explore. Trong off-policy, agent cũng explore (qua behavior policy) nhưng học một *deterministic optimal policy* có thể không liên quan tới policy được tuân theo. Một cách khác để đảm bảo exploration là exploring starts, nhưng khó áp dụng khi học từ kinh nghiệm thực. (A, C, D mô tả sai — đặc biệt off-policy mới cần importance sampling, không phải on-policy.)

</details>
