# Chương 3: Finite Markov Decision Processes — Câu hỏi trắc nghiệm

> Bộ câu hỏi ôn tập chi tiết cho Chương 3, sách *Reinforcement Learning: An Introduction* (Sutton & Barto, 2nd ed.)

## 3.1 The Agent–Environment Interface

**Câu 1.** Trong một MDP, thuật ngữ *agent* và *environment* được định nghĩa như thế nào?

- A. Agent là người học và ra quyết định; environment là mọi thứ bên ngoài agent mà agent tương tác.
- B. Agent là phần cứng vật lý của robot; environment là toàn bộ thế giới bên ngoài robot đó.
- C. Agent là tập hợp các reward signal; environment là tập hợp các state mà agent quan sát được.
- D. Agent là chính sách (policy) cần học; environment là hàm giá trị (value function) cần tối ưu.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Theo sách, *agent* (the learner and decision maker) là người học và ra quyết định, còn *environment* là mọi thứ bên ngoài agent (everything outside the agent) mà nó tương tác liên tục. Các phương án còn lại nhầm agent với phần cứng, với reward hoặc với chính policy/value — đều là những thành phần *bên trong* hoặc *trừu tượng* chứ không phải định nghĩa agent–environment.

</details>

---

**Câu 2.** Trình tự (trajectory) của một MDP bắt đầu như thế nào?

- A. $A_0, S_0, R_0, A_1, S_1, R_1, \dots$ (action trước, rồi state và reward cùng chỉ số)
- B. $S_0, A_0, R_1, S_1, A_1, R_2, S_2, A_2, R_3, \dots$ (state, action, rồi reward lệch một bước)
- C. $S_0, R_0, A_0, S_1, R_1, A_1, \dots$ (reward đi liền sau state cùng chỉ số)
- D. $R_0, S_0, A_0, R_1, S_1, A_1, \dots$ (reward khởi tạo tại bước 0)

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Sách viết trajectory là $S_0, A_0, R_1, S_1, A_1, R_2, S_2, A_2, R_3, \dots$ (công thức 3.1). Tại mỗi bước $t$, agent nhận state $S_t$, chọn action $A_t$, rồi *một bước sau* nhận reward $R_{t+1}$ và state $S_{t+1}$. Không tồn tại $R_0$ — reward đầu tiên là $R_1$, sinh ra do cặp $(S_0, A_0)$.

</details>

---

**Câu 3.** Tại sao sách dùng ký hiệu $R_{t+1}$ (thay vì $R_t$) cho reward sinh ra do action $A_t$?

- A. Vì $R_t$ đã được dành riêng để ký hiệu cho discount factor tại bước $t$.
- B. Vì reward luôn đến trễ đúng hai bước thời gian so với action sinh ra nó.
- C. Để nhấn mạnh rằng reward kế tiếp và state kế tiếp ($R_{t+1}$, $S_{t+1}$) được xác định *đồng thời*.
- D. Vì đây là quy ước duy nhất được chấp nhận trong toàn bộ tài liệu RL hiện đại.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Sách giải thích dùng $R_{t+1}$ thay vì $R_t$ vì nó nhấn mạnh reward kế tiếp và state kế tiếp ($R_{t+1}$ và $S_{t+1}$) được xác định đồng thời (jointly determined). Phương án D sai vì sách lưu ý *cả hai quy ước* ($R_{t+1}$ và $R_t$) đều được dùng phổ biến. B sai vì reward đến trễ một bước, không phải hai.

</details>

---

**Câu 4.** Hàm động lực học (dynamics function) của MDP được định nghĩa là:

- A. $p(s', r \mid s, a) = \mathbb{E}[R_t \mid S_t = s, A_t = a]$ — kỳ vọng reward theo state và action hiện tại.
- B. $p(s', r \mid s, a) = \Pr\{S_t = s', R_t = r \mid S_{t-1} = s, A_{t-1} = a\}$ — xác suất đồng thời của state và reward kế tiếp.
- C. $p(s', r \mid s, a) = \Pr\{S_{t+1} = s' \mid S_t = s\}$ — xác suất chuyển state chỉ phụ thuộc state.
- D. $p(s', r \mid s, a) = \max_a q_*(s, a)$ — giá trị action lớn nhất tại state $s$.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Công thức (3.2): $p(s', r \mid s, a) \doteq \Pr\{S_t = s', R_t = r \mid S_{t-1} = s, A_{t-1} = a\}$. Đây là hàm $p: \mathcal{S} \times \mathcal{R} \times \mathcal{S} \times \mathcal{A} \to [0,1]$ xác định hoàn toàn dynamics của environment. A là định nghĩa của expected reward chứ không phải dynamics; C bỏ qua action; D là một đại lượng tối ưu hóa, không phải dynamics.

</details>

---

**Câu 5.** Điều kiện chuẩn hóa nào mà hàm $p(s', r \mid s, a)$ phải thỏa mãn?

- A. $\sum_{s' \in \mathcal{S}} \sum_{r \in \mathcal{R}} p(s', r \mid s, a) = 1$ với mọi $s \in \mathcal{S},\, a \in \mathcal{A}(s)$.
- B. $\sum_{s' \in \mathcal{S}} \sum_{r \in \mathcal{R}} p(s', r \mid s, a) = r$ với mọi $s \in \mathcal{S},\, a \in \mathcal{A}(s)$.
- C. $\sum_{a \in \mathcal{A}(s)} p(s', r \mid s, a) = 1$ với mọi $s' \in \mathcal{S},\, r \in \mathcal{R}$.
- D. $\sum_{s' \in \mathcal{S}} \sum_{r \in \mathcal{R}} p(s', r \mid s, a) = \gamma$ với mọi $s \in \mathcal{S},\, a \in \mathcal{A}(s)$.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Công thức (3.3): $\sum_{s' \in \mathcal{S}} \sum_{r \in \mathcal{R}} p(s', r \mid s, a) = 1$ cho mọi $s, a$. Hàm $p$ định nghĩa một phân phối xác suất cho *mỗi* lựa chọn của $s$ và $a$, nên tổng phải bằng 1 (không phải $r$ hay $\gamma$). C sai vì tổng lấy sai biến (theo $a$ thay vì $s', r$).

</details>

---

**Câu 6.** State-transition probability ba đối số $p(s' \mid s, a)$ được tính từ hàm bốn đối số như thế nào?

- A. $p(s' \mid s, a) = \prod_{r \in \mathcal{R}} p(s', r \mid s, a)$ — lấy tích trên các reward.
- B. $p(s' \mid s, a) = \max_{r \in \mathcal{R}} p(s', r \mid s, a)$ — lấy giá trị lớn nhất trên các reward.
- C. $p(s' \mid s, a) = \sum_{r \in \mathcal{R}} p(s', r \mid s, a)$ — lấy tổng (marginalize) trên các reward.
- D. $p(s' \mid s, a) = \sum_{a \in \mathcal{A}(s)} p(s', r \mid s, a)$ — lấy tổng trên các action.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Công thức (3.4): $p(s' \mid s, a) = \sum_{r \in \mathcal{R}} p(s', r \mid s, a)$. Ta *marginalize* (lấy tổng) hàm bốn đối số trên toàn bộ giá trị reward $r$. Marginalize luôn dùng tổng (không phải tích hay max), và phải lấy tổng trên đúng biến cần loại bỏ là $r$ (không phải $a$).

</details>

---

**Câu 7.** Expected reward cho cặp state–action, $r(s, a)$, được tính bằng:

- A. $r(s, a) = \sum_{r \in \mathcal{R}} r \sum_{s' \in \mathcal{S}} p(s', r \mid s, a)$ — trung bình reward có trọng số xác suất.
- B. $r(s, a) = \sum_{s' \in \mathcal{S}} p(s' \mid s, a)$ — tổng xác suất chuyển state.
- C. $r(s, a) = \max_{s' \in \mathcal{S}} p(s', r \mid s, a)$ — xác suất lớn nhất trên các state kế tiếp.
- D. $r(s, a) = \sum_{r \in \mathcal{R}} r \cdot p(s' \mid s, a)$ — reward nhân với xác suất chuyển state.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Công thức (3.5): $r(s, a) \doteq \mathbb{E}[R_t \mid S_{t-1}=s, A_{t-1}=a] = \sum_{r \in \mathcal{R}} r \sum_{s' \in \mathcal{S}} p(s', r \mid s, a)$. Đây là kỳ vọng của reward, lấy trung bình có trọng số theo xác suất. D sai vì nhân $r$ với $p(s' \mid s, a)$ (hàm không chứa $r$) là sai chiều marginalize; B chỉ là tổng xác suất (luôn bằng 1).

</details>

---

**Câu 8.** Theo sách, ranh giới giữa agent và environment được đặt ở đâu?

- A. Trùng đúng với ranh giới vật lý của cơ thể robot hoặc động vật.
- B. Ở giới hạn *quyền kiểm soát tuyệt đối* của agent: bất cứ thứ gì agent không thể thay đổi tùy ý đều thuộc environment.
- C. Tại nơi đặt các cảm biến (sensors) thu nhận thông tin của agent.
- D. Tại nơi tính toán reward, vì reward luôn được coi là thuộc về bên trong agent.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Quy tắc chung: bất cứ gì không thể bị agent thay đổi *tùy ý* đều thuộc environment. Ranh giới biểu thị giới hạn quyền kiểm soát tuyệt đối (limit of absolute control), *không* phải giới hạn kiến thức. Vì vậy A sai (ranh giới thường nằm *bên trong* cơ thể vật lý), và D sai vì reward dù tính trong cơ thể vẫn được coi là *bên ngoài* (external) agent.

</details>

---

**Câu 9.** Trong ví dụ Recycling Robot, tập action ở hai state là gì?

- A. Cả hai state `high` và `low` đều có tập action $\{search, wait, recharge\}$.
- B. Cả hai state `high` và `low` đều có tập action $\{search, wait\}$.
- C. $\mathcal{A}(\text{high}) = \{search, wait\}$ và $\mathcal{A}(\text{low}) = \{search, wait, recharge\}$.
- D. $\mathcal{A}(\text{high}) = \{search, wait, recharge\}$ và $\mathcal{A}(\text{low}) = \{search, wait\}$.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Khi pin ở mức `high`, recharge là vô nghĩa nên không đưa vào tập action: $\mathcal{A}(\text{high}) = \{search, wait\}$, còn $\mathcal{A}(\text{low}) = \{search, wait, recharge\}$. Phương án D đảo ngược logic này (sai vì recharge chỉ có ý nghĩa khi pin yếu).

</details>

---

**Câu 10.** [Khó] Một MDP đơn giản có một state $s$ và một action $a$. Từ $(s,a)$, agent chuyển tới $s'$ với reward $+2$ (xác suất $0.5$) hoặc chuyển tới $s'$ với reward $-1$ (xác suất $0.3$), và tới $s''$ với reward $+4$ (xác suất $0.2$). Giá trị $r(s,a)$ và $p(s' \mid s, a)$ lần lượt là:

- A. $r(s,a) = 1.5$ và $p(s' \mid s, a) = 0.8$.
- B. $r(s,a) = 1.5$ và $p(s' \mid s, a) = 0.5$.
- C. $r(s,a) = 5.0$ và $p(s' \mid s, a) = 0.8$.
- D. $r(s,a) = 1.8$ và $p(s' \mid s, a) = 1.0$.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — $r(s,a) = 0.5(2) + 0.3(-1) + 0.2(4) = 1.0 - 0.3 + 0.8 = 1.5$. Còn $p(s' \mid s, a)$ là tổng xác suất *mọi* cách tới $s'$ bất kể reward: $0.5 + 0.3 = 0.8$ (hai nhánh đầu đều dẫn tới $s'$). B quên gộp hai nhánh tới $s'$; C cộng dồn các reward thay vì lấy kỳ vọng; D tính nhầm cả hai.

</details>

---

## 3.2 Goals and Rewards

**Câu 11.** Phát biểu chính xác của *reward hypothesis* là gì?

- A. Mọi goal đều có thể đạt được bằng cách tối đa hóa reward tức thời tại từng bước thời gian.
- B. Tất cả những gì ta muốn nói về goals và purposes đều có thể được nghĩ tốt như tối đa hóa kỳ vọng của tổng tích lũy một tín hiệu scalar (reward).
- C. Reward phải luôn là một vector chứa thông tin về các subgoals khác nhau của bài toán.
- D. Goal của agent là tối thiểu hóa số bước thời gian cho đến khi episode kết thúc.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Reward hypothesis: "all of what we mean by goals and purposes can be well thought of as the maximization of the expected value of the cumulative sum of a received scalar signal (called reward)." Mục tiêu là *tích lũy về lâu dài* (không phải tức thời, nên A sai), và reward là *scalar* (không phải vector, nên C sai).

</details>

---

**Câu 12.** Về việc thiết kế reward, sách khuyến nghị điều gì với ví dụ chơi cờ (chess)?

- A. Nên thưởng cho agent khi đạt subgoals như ăn quân đối thủ hoặc kiểm soát trung tâm bàn cờ.
- B. Nên dùng reward để truyền đạt prior knowledge về cách chơi cờ tốt cho agent.
- C. Chỉ nên thưởng khi *thực sự thắng*: reward truyền đạt *cái gì* (what) ta muốn đạt, không phải *cách* (how) đạt nó.
- D. Nên đặt reward $+1$ cho mỗi nước đi hợp lệ để khuyến khích agent chơi đúng luật.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Sách nhấn mạnh agent chỉ nên được thưởng khi thực sự thắng. Nếu thưởng cho subgoals (A), agent có thể đạt subgoals mà không đạt mục tiêu thật (ăn quân nhưng thua ván). Reward truyền đạt *what*, không phải *how*, và không phải nơi để cài prior knowledge (B sai).

</details>

---

**Câu 13.** Để robot học thoát khỏi mê cung càng nhanh càng tốt, reward thường được đặt như thế nào?

- A. $-1$ cho mỗi bước thời gian trôi qua trước khi thoát khỏi mê cung.
- B. $+1$ tại mỗi bước cho đến khi thoát khỏi mê cung.
- C. $0$ ở mọi bước và $+10$ tại bước thoát khỏi mê cung.
- D. $+1$ cho mỗi nước rẽ đúng hướng tiến gần lối ra.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Sách nêu reward thường là $-1$ cho mỗi bước trước khi thoát; vì mỗi bước bị phạt, agent được khuyến khích thoát càng nhanh càng tốt. B sẽ khuyến khích robot *kéo dài* thời gian (cộng dồn $+1$); D là thưởng cho subgoal/cách đi, đi ngược nguyên tắc thiết kế reward.

</details>

---

## 3.3 Returns and Episodes

**Câu 14.** Trong trường hợp đơn giản nhất (episodic, không discount), return $G_t$ được định nghĩa là:

- A. $G_t = R_{t+1} \cdot R_{t+2} \cdots R_T$ — tích các reward đến bước cuối.
- B. $G_t = \max(R_{t+1}, R_{t+2}, \dots, R_T)$ — reward lớn nhất trong episode.
- C. $G_t = R_{t+1} + R_{t+2} + R_{t+3} + \cdots + R_T$, với $T$ là bước thời gian cuối cùng.
- D. $G_t = \mathbb{E}[R_{t+1}]$ — kỳ vọng của reward kế tiếp.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Công thức (3.7): $G_t \doteq R_{t+1} + R_{t+2} + R_{t+3} + \cdots + R_T$, với $T$ là bước cuối. Return là *tổng* (không phải tích hay max) các reward tương lai. D nhầm return với reward kế tiếp đơn lẻ.

</details>

---

**Câu 15.** Sự khác biệt cơ bản giữa *episodic tasks* và *continuing tasks* là gì?

- A. Episodic tasks luôn dùng discount, còn continuing tasks thì không bao giờ dùng discount.
- B. Episodic tasks chia tương tác thành các episodes riêng biệt (kết thúc ở terminal state rồi reset); continuing tasks diễn ra liên tục không giới hạn.
- C. Episodic tasks không có reward signal, còn continuing tasks luôn có reward.
- D. Episodic tasks có vô hạn state, còn continuing tasks chỉ có hữu hạn state.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Episodic tasks chia tự nhiên thành các episodes (ván game, chuyến đi qua mê cung), mỗi episode kết thúc ở terminal state rồi reset. Continuing tasks diễn ra liên tục không giới hạn (điều khiển quá trình liên tục). A sai vì cả hai loại đều có thể dùng discount; sự khác biệt nằm ở *cấu trúc thời gian*, không phải reward hay số state.

</details>

---

**Câu 16.** Discounted return $G_t$ được định nghĩa là:

- A. $G_t = \sum_{k=0}^{\infty} \gamma^{-k} R_{t+k+1}$ — discount lũy thừa âm.
- B. $G_t = \gamma \sum_{k=0}^{\infty} R_{t+k+1}$ — discount chung một hệ số $\gamma$.
- C. $G_t = \sum_{k=0}^{\infty} k\gamma\, R_{t+k+1}$ — trọng số tuyến tính $k\gamma$.
- D. $G_t = \sum_{k=0}^{\infty} \gamma^{k} R_{t+k+1}$ — discount lũy thừa $\gamma^k$.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Công thức (3.8): $G_t \doteq R_{t+1} + \gamma R_{t+2} + \gamma^2 R_{t+3} + \cdots = \sum_{k=0}^{\infty} \gamma^k R_{t+k+1}$, với $0 \le \gamma \le 1$. Mỗi reward càng xa thì hệ số $\gamma^k$ càng nhỏ. A dùng số mũ âm (sẽ làm reward xa *lớn* hơn); B và C không phải dạng hình học nên không hội tụ đúng cách.

</details>

---

**Câu 17.** Discount rate $\gamma$ có ý nghĩa gì? Nếu $\gamma = 0$ thì agent hành xử thế nào?

- A. $\gamma$ là số bước trong một episode; nếu $\gamma = 0$ thì episode dài vô hạn.
- B. $\gamma$ xác định present value của future rewards; nếu $\gamma = 0$, agent "myopic" chỉ tối đa hóa reward tức thời $R_{t+1}$.
- C. $\gamma$ là tốc độ học (learning rate); nếu $\gamma = 0$ thì agent không cập nhật value.
- D. $\gamma$ xác định số state của MDP; nếu $\gamma = 0$ thì MDP chỉ có một state.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Discount rate xác định present value của future rewards: reward nhận sau $k$ bước chỉ đáng $\gamma^{k-1}$ lần giá trị nhận ngay. Nếu $\gamma = 0$, agent "myopic" (thiển cận) chỉ quan tâm $R_{t+1}$; khi $\gamma \to 1$, agent trở nên farsighted hơn. $\gamma$ không phải learning rate (đó là $\alpha$) cũng không liên quan số state.

</details>

---

**Câu 18.** Quan hệ đệ quy giữa các return ở các bước thời gian liên tiếp là:

- A. $G_t = R_{t+1} + \gamma G_{t+1}$
- B. $G_t = R_{t+1} - \gamma G_{t+1}$
- C. $G_t = \gamma R_{t+1} + G_{t+1}$
- D. $G_t = R_{t+1} + G_{t+1}^2$

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Công thức (3.9): $G_t = R_{t+1} + \gamma G_{t+1}$. Quan hệ đệ quy này là nền tảng cho lý thuyết và thuật toán RL; nó đúng với mọi $t < T$ (kể cả khi termination ở $t+1$, miễn định nghĩa $G_T = 0$). B sai dấu, C đặt $\gamma$ nhầm chỗ, D có lũy thừa bình phương vô lý.

</details>

---

**Câu 19.** Nếu reward là hằng số $+1$ tại mọi bước và $\gamma < 1$ (continuing task), thì return $G_t$ bằng:

- A. $\infty$
- B. $1 - \gamma$
- C. $\dfrac{1}{1-\gamma}$
- D. $\dfrac{\gamma}{1-\gamma}$

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Công thức (3.10): $G_t = \sum_{k=0}^{\infty} \gamma^k = \dfrac{1}{1-\gamma}$ (tổng cấp số nhân). Tổng vô hạn vẫn hữu hạn miễn reward bị chặn và $\gamma < 1$, nên A sai. D là tổng *bắt đầu từ* $k=1$ ($\sum_{k=1}^{\infty}\gamma^k$), thiếu số hạng $k=0$.

</details>

---

**Câu 20.** [Khó] Một continuing task có $\gamma = 0.9$. Reward bằng $0$ ở mọi bước, ngoại trừ một reward duy nhất $+10$ nhận được đúng tại bước thứ 3 sau thời điểm $t$ (tức là $R_{t+3} = 10$). Khi đó $G_t$ bằng bao nhiêu?

- A. $10$
- B. $9.0$
- C. $8.1$
- D. $7.29$

<details>
<summary>Đáp án</summary>

**Đáp án: C** — $G_t = \sum_{k=0}^{\infty}\gamma^k R_{t+k+1}$. Reward $+10$ là $R_{t+3}$, ứng với $k=2$ (vì $t+k+1 = t+3 \Rightarrow k=2$). Vậy $G_t = \gamma^2 \cdot 10 = 0.81 \times 10 = 8.1$. Lỗi thường gặp: dùng $k=1$ ($\gamma^1 \cdot 10 = 9.0$, phương án B) hoặc $k=3$ ($\gamma^3 \cdot 10 = 7.29$, phương án D) do đếm sai chỉ số.

</details>

---

**Câu 21.** Trong ví dụ Pole-Balancing được xử lý như episodic task với reward $+1$ cho mỗi bước không thất bại, return tại mỗi thời điểm là gì?

- A. Số bước cho đến khi thất bại (number of steps until failure).
- B. Luôn luôn bằng $1$ tại mọi thời điểm.
- C. Bằng $\gamma$ lũy thừa số bước cho đến khi thất bại.
- D. Bằng $0$ cho đến đúng bước thất bại rồi nhảy lên $1$.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Khi xử lý episodic với reward $+1$ mỗi bước không thất bại, return là *số bước cho đến khi thất bại*; cân bằng mãi mãi nghĩa là return bằng vô hạn. (Cách khác: continuing với discount, reward $-1$ khi thất bại và $0$ các lúc khác.) B sai vì return là tổng tích lũy, không phải reward đơn lẻ.

</details>

---

## 3.4 Unified Notation for Episodic and Continuing Tasks

**Câu 22.** Để hợp nhất ký hiệu return cho cả episodic và continuing tasks, sách dùng khái niệm nào?

- A. Coi mọi continuing task là một episode dài vô hạn với reward luôn âm.
- B. Coi terminal state là một *absorbing state* đặc biệt: chỉ chuyển về chính nó và chỉ sinh reward bằng $0$.
- C. Loại bỏ hoàn toàn discount factor $\gamma$ trong mọi trường hợp để công thức thống nhất.
- D. Đặt $T = 0$ cho continuing tasks và $T = \infty$ cho episodic tasks.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Ta coi việc kết thúc episode như bước vào một *absorbing state* đặc biệt: chỉ chuyển về chính nó và chỉ sinh reward $0$. Như vậy tổng reward giống nhau dù lấy trên $T$ bước hữu hạn hay chuỗi vô hạn. C sai vì discount vẫn cần cho continuing; D đảo ngược vai trò của $T$.

</details>

---

**Câu 23.** Công thức return hợp nhất (3.11) cho cả hai loại task được viết là:

- A. $G_t = \sum_{k=t+1}^{T} \gamma^{k-t-1} R_k$, bao gồm khả năng $T = \infty$ *hoặc* $\gamma = 1$ (nhưng không phải cả hai).
- B. $G_t = \sum_{k=0}^{T} \gamma^{k} R_k$, luôn yêu cầu $T < \infty$ và $\gamma = 1$ đồng thời.
- C. $G_t = \sum_{k=t+1}^{T} R_k$, hoàn toàn không có discount factor.
- D. $G_t = \sum_{k=t+1}^{\infty} \gamma^{k} R_k$, luôn yêu cầu $\gamma < 1$ chặt.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Công thức (3.11): $G_t \doteq \sum_{k=t+1}^{T} \gamma^{k-t-1} R_k$, cho phép $T = \infty$ *hoặc* $\gamma = 1$ nhưng *không* đồng thời cả hai (nếu cả hai thì tổng có thể phân kỳ). C bỏ discount; B và D đặt ràng buộc sai về $T$ và $\gamma$.

</details>

---

## 3.5 Policies and Value Functions

**Câu 24.** *Policy* $\pi$ được định nghĩa hình thức là gì?

- A. Một ánh xạ từ states sang xác suất chọn mỗi action; $\pi(a \mid s)$ là xác suất $A_t = a$ khi $S_t = s$.
- B. Một ánh xạ từ mỗi state sang reward tức thời nhận được tại state đó.
- C. Một hàm trả về return kỳ vọng khi xuất phát từ mỗi state.
- D. Một phân phối xác suất cố định trên toàn bộ tập state $\mathcal{S}$.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Policy là ánh xạ từ states sang xác suất chọn mỗi action có thể; $\pi(a \mid s)$ là xác suất $A_t = a$ khi $S_t = s$. Dấu "|" nhắc rằng $\pi$ định nghĩa một phân phối trên $a \in \mathcal{A}(s)$ cho *mỗi* $s$. C là định nghĩa value function, không phải policy; D nhầm phân phối trên action với phân phối trên state.

</details>

---

**Câu 25.** State-value function $v_\pi(s)$ được định nghĩa là:

- A. $v_\pi(s) = \max_a q_\pi(s, a)$ — giá trị action lớn nhất tại $s$.
- B. $v_\pi(s) = \mathbb{E}_\pi[G_t \mid S_t = s] = \mathbb{E}_\pi\!\left[\sum_{k=0}^{\infty} \gamma^k R_{t+k+1} \,\middle|\, S_t = s\right]$ — expected return khi đi theo $\pi$ từ $s$.
- C. $v_\pi(s) = \sum_{s'} p(s' \mid s, a)$ — tổng xác suất chuyển state.
- D. $v_\pi(s) = R_{t+1} + \gamma R_{t+2}$ — tổng hai reward đầu tiên có discount.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Công thức (3.12): $v_\pi(s) \doteq \mathbb{E}_\pi[G_t \mid S_t = s]$ — expected return khi bắt đầu ở $s$ và đi theo $\pi$ về sau. Giá trị terminal state luôn bằng $0$. A là quan hệ với optimal/greedy (và lấy $\max$ chứ không lấy kỳ vọng theo $\pi$); D chỉ cộng hai reward đầu chứ không phải toàn bộ return kỳ vọng.

</details>

---

**Câu 26.** Action-value function $q_\pi(s, a)$ là gì?

- A. Xác suất policy $\pi$ chọn action $a$ tại state $s$.
- B. Reward tức thời nhận được khi thực hiện action $a$ ở state $s$.
- C. Expected return khi bắt đầu ở $s$, thực hiện action $a$, rồi *sau đó* đi theo policy $\pi$.
- D. Giá trị lớn nhất trên mọi action có thể tại state $s$.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Công thức (3.13): $q_\pi(s, a) \doteq \mathbb{E}_\pi[G_t \mid S_t = s, A_t = a]$ — expected return bắt đầu từ $s$, thực hiện $a$, và *sau đó* đi theo $\pi$. A nhầm với policy; B nhầm với reward tức thời; D nhầm với $v_*$/giá trị greedy.

</details>

---

**Câu 27.** Phương pháp ước lượng $v_\pi$ và $q_\pi$ bằng cách trung bình hóa trên nhiều mẫu return thực tế được gọi là gì?

- A. Dynamic programming.
- B. Temporal-difference learning.
- C. Monte Carlo methods.
- D. Bellman iteration.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Sách gọi đây là *Monte Carlo methods*, vì dựa trên việc trung bình hóa nhiều mẫu ngẫu nhiên của các return *thực tế* (averaging over many random samples of actual returns). DP dùng model đầy đủ; TD học từ bootstrapping từng bước chứ không chờ return đầy đủ.

</details>

---

**Câu 28.** Bellman equation cho $v_\pi$ (công thức 3.14) là:

- A. $v_\pi(s) = \max_a \sum_{s', r} p(s', r \mid s, a)[r + \gamma v_\pi(s')]$
- B. $v_\pi(s) = \sum_a \pi(a \mid s)[r + \gamma v_\pi(s)]$
- C. $v_\pi(s) = R_{t+1} + \gamma \max_{s'} v_\pi(s')$
- D. $v_\pi(s) = \sum_a \pi(a \mid s) \sum_{s', r} p(s', r \mid s, a)\,[\,r + \gamma v_\pi(s')\,]$

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Bellman equation cho $v_\pi$ (3.14): $v_\pi(s) = \sum_a \pi(a \mid s) \sum_{s', r} p(s', r \mid s, a)\,[\,r + \gamma v_\pi(s')\,]$. Nó lấy trung bình trên action (theo $\pi$) và trên các successor states (theo $p$). Phương án A là Bellman *optimality* equation (có $\max$, không có $\pi$) — đây là cái bẫy dễ nhầm nhất.

</details>

---

**Câu 29.** Theo sách, $v_\pi$ có quan hệ gì với Bellman equation của nó?

- A. $v_\pi$ chỉ là một nghiệm gần đúng (approximate) của Bellman equation.
- B. $v_\pi$ là nghiệm *duy nhất* (unique solution) của Bellman equation của nó.
- C. Bellman equation nói chung không có nghiệm xác định cho $v_\pi$.
- D. $v_\pi$ là nghiệm của Bellman equation chỉ trong trường hợp $\gamma = 0$.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Sách khẳng định: "The value function $v_\pi$ is the unique solution to its Bellman equation." Trong ví dụ Gridworld, value function cho random policy được tính bằng cách giải hệ phương trình tuyến tính (3.14). A và C mâu thuẫn với tính duy nhất; D đặt ràng buộc sai về $\gamma$.

</details>

---

**Câu 30.** Trong ví dụ Gridworld (random policy, $\gamma = 0.9$), tại sao state A có expected return *nhỏ hơn* immediate reward $+10$ của nó?

- A. Vì reward $+10$ thực ra không bao giờ được trao cho agent.
- B. Vì discount factor làm cho các reward âm về sau trở nên vô hạn.
- C. Vì từ A agent bị đưa tới $A'$, từ đó nó dễ chạy vào rìa lưới và nhận reward âm về sau.
- D. Vì state A là terminal state nên giá trị của nó luôn bằng $0$.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Từ A, agent bị đưa tới $A'$, nơi nó *dễ chạy vào rìa lưới* (likely to run into the edge), gây reward âm về sau, nên expected return $< +10$. Ngược lại, B được định giá *cao hơn* immediate reward $+5$ vì $B'$ có giá trị dương. A là terminal-state thì sai (A không phải terminal); B sai vì discount giữ tổng hữu hạn.

</details>

---

**Câu 31.** [Khó] Xét một MDP với policy $\pi$ và $\gamma = 0.5$. Tại state $s$, $\pi$ chọn action $a$ chắc chắn (xác suất $1$). Action $a$ dẫn chắc chắn tới state $s'$ với reward $+4$, và biết rằng $v_\pi(s') = 6$. Khi đó $v_\pi(s)$ bằng:

- A. $7$
- B. $10$
- C. $5$
- D. $4$

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Theo Bellman equation, vì mọi thứ deterministic: $v_\pi(s) = r + \gamma v_\pi(s') = 4 + 0.5 \times 6 = 4 + 3 = 7$. B quên nhân discount ($4 + 6 = 10$); D bỏ qua giá trị successor hoàn toàn; C tính nhầm $4 + 0.5\times 2$ hoặc tương tự.

</details>

---

**Câu 32.** [Khó] Phân biệt nào giữa $v_\pi$ và $q_\pi$ là chính xác nhất?

- A. $v_\pi(s)$ giả định action đầu tiên do $\pi$ chọn, còn $q_\pi(s,a)$ giả định action đầu tiên là $a$ (có thể khác $\pi$), nhưng từ bước sau cả hai đều đi theo $\pi$.
- B. $v_\pi$ luôn lớn hơn hoặc bằng $q_\pi$ tại mọi cặp $(s,a)$ vì $v_\pi$ tính trên nhiều action hơn.
- C. $q_\pi$ chỉ tính reward tức thời còn $v_\pi$ tính toàn bộ return tích lũy về sau.
- D. $v_\pi$ và $q_\pi$ là hai tên gọi của cùng một đại lượng, chỉ khác cách viết.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Khác biệt then chốt: $v_\pi(s)$ lấy action đầu theo $\pi$; $q_\pi(s,a)$ ép action đầu là $a$ (có thể không phải $\pi$ chọn), sau đó *cả hai* đều theo $\pi$. Quan hệ đúng là $v_\pi(s) = \sum_a \pi(a\mid s) q_\pi(s,a)$ — $v_\pi$ là *trung bình* của $q_\pi$ theo $\pi$, nên B (luôn $\ge$) sai. C nhầm $q_\pi$ với reward tức thời; D sai rõ ràng.

</details>

---

## 3.6 Optimal Policies and Optimal Value Functions

**Câu 33.** Một policy $\pi$ được định nghĩa là "tốt hơn hoặc bằng" policy $\pi'$ khi nào?

- A. Khi $\pi$ có nhiều action khả dĩ hơn $\pi'$ tại mỗi state.
- B. Khi $v_\pi(s) \ge v_{\pi'}(s)$ cho *ít nhất một* state $s \in \mathcal{S}$.
- C. Khi reward tức thời trung bình của $\pi$ lớn hơn của $\pi'$.
- D. Khi và chỉ khi $v_\pi(s) \ge v_{\pi'}(s)$ cho *mọi* state $s \in \mathcal{S}$.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Value functions định nghĩa một thứ tự bộ phận (partial ordering): $\pi \ge \pi'$ khi và chỉ khi $v_\pi(s) \ge v_{\pi'}(s)$ cho *mọi* $s$. B sai vì chỉ cần "ít nhất một" thì không đủ (đó không phải định nghĩa). Luôn tồn tại ít nhất một policy tốt hơn hoặc bằng mọi policy khác — đó là optimal policy.

</details>

---

**Câu 34.** Optimal state-value function $v_*$ được định nghĩa là:

- A. $v_*(s) = \max_\pi v_\pi(s)$ cho mọi $s \in \mathcal{S}$.
- B. $v_*(s) = \min_\pi v_\pi(s)$ cho mọi $s \in \mathcal{S}$.
- C. $v_*(s) = \sum_\pi v_\pi(s)$ trên tập mọi policy.
- D. $v_*(s) = \max_a q_\pi(s, a)$ với một $\pi$ bất kỳ.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Công thức (3.15): $v_*(s) \doteq \max_\pi v_\pi(s)$ cho mọi $s$. Tất cả optimal policy đều chia sẻ cùng $v_*$ (và cùng $q_*$, công thức 3.16). B lấy $\min$ (ngược lại); D dùng $q_\pi$ của một $\pi$ tùy ý (không tối ưu).

</details>

---

**Câu 35.** Quan hệ giữa $q_*$ và $v_*$ (công thức 3.17) là:

- A. $q_*(s, a) = \max_a v_*(s)$
- B. $q_*(s, a) = \mathbb{E}[R_{t+1} + \gamma v_*(S_{t+1}) \mid S_t = s, A_t = a]$
- C. $q_*(s, a) = v_*(s) + R_{t+1}$
- D. $q_*(s, a) = \gamma\, v_*(s)$

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Công thức (3.17): $q_*(s, a) = \mathbb{E}[R_{t+1} + \gamma v_*(S_{t+1}) \mid S_t = s, A_t = a]$ — expected return khi thực hiện $a$ ở $s$ rồi *sau đó* đi theo optimal policy. Lưu ý $v_*$ được lấy ở *successor* $S_{t+1}$, không phải ở $s$ — nên A, C, D (dùng $v_*(s)$) đều sai.

</details>

---

**Câu 36.** Bellman optimality equation cho $v_*$ (công thức 3.19) là:

- A. $v_*(s) = \sum_a \pi(a \mid s) \sum_{s', r} p(s', r \mid s, a)[r + \gamma v_*(s')]$
- B. $v_*(s) = \min_{a} \sum_{s', r} p(s', r \mid s, a)[r + \gamma v_*(s')]$
- C. $v_*(s) = \max_a [R_{t+1} + v_*(s)]$
- D. $v_*(s) = \max_{a \in \mathcal{A}(s)} \sum_{s', r} p(s', r \mid s, a)\,[\,r + \gamma v_*(s')\,]$

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Công thức (3.19): $v_*(s) = \max_{a} \sum_{s', r} p(s', r \mid s, a)\,[\,r + \gamma v_*(s')\,]$. Khác Bellman equation cho $v_\pi$, ở đây có $\max$ trên action (không tham chiếu $\pi$ cụ thể). A vẫn dùng $\pi$ (là phương trình cho $v_\pi$, không tối ưu); B lấy $\min$; C thiếu cấu trúc tổng theo dynamics.

</details>

---

**Câu 37.** Bellman optimality equation cho $q_*$ (công thức 3.20) là:

- A. $q_*(s, a) = \sum_{s', r} p(s', r \mid s, a)\,[\,r + \gamma \max_{a'} q_*(s', a')\,]$
- B. $q_*(s, a) = \max_{a'} \sum_{s', r} p(s', r \mid s, a)[r + \gamma q_*(s', a')]$
- C. $q_*(s, a) = \sum_{s', r} p(s', r \mid s, a)[r + \gamma q_*(s', a)]$
- D. $q_*(s, a) = \mathbb{E}[R_{t+1} + \gamma v_\pi(S_{t+1})]$

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Công thức (3.20): $q_*(s, a) = \sum_{s', r} p(s', r \mid s, a)\,[\,r + \gamma \max_{a'} q_*(s', a')\,]$. Lưu ý $\max$ nằm *bên trong* tổng (trên action kế tiếp $a'$). B đặt $\max$ ra *ngoài* tổng (sai vị trí); C giữ nguyên $a$ thay vì $\max_{a'}$; D dùng $v_\pi$ (không tối ưu).

</details>

---

**Câu 38.** Với một finite MDP có $n$ states, Bellman optimality equation cho $v_*$ có tính chất gì?

- A. Là một hệ gồm $n$ phương trình với $n$ ẩn và có nghiệm *duy nhất*.
- B. Luôn luôn có vô số nghiệm bất kể cấu trúc MDP.
- C. Rút gọn thành một phương trình tuyến tính đơn lẻ với một ẩn.
- D. Không có nghiệm trừ khi discount factor $\gamma = 1$.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Với finite MDP, Bellman optimality equation cho $v_*$ là một hệ $n$ phương trình ($n$ states) với $n$ ẩn và có nghiệm *duy nhất* (unique). Đây là hệ *phi tuyến* do toán tử $\max$ (nên C sai). B và D mâu thuẫn với tính duy nhất và sự tồn tại nghiệm.

</details>

---

**Câu 39.** Khi đã có $v_*$, làm sao xác định một optimal policy?

- A. Phải giải lại toàn bộ MDP từ đầu với mọi policy có thể.
- B. Bất kỳ policy nào *greedy* đối với $v_*$ (chỉ gán xác suất khác $0$ cho action đạt max trong Bellman optimality equation) đều là optimal.
- C. Phải biết trước toàn bộ chuỗi reward tương lai để tính từng action.
- D. Chọn action có reward tức thời lớn nhất tại mỗi state, bất kể $v_*$.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Bất kỳ policy nào *greedy* với $v_*$ đều optimal: với mỗi state, gán xác suất khác $0$ chỉ cho các action đạt max trong Bellman optimality equation. Vẻ đẹp của $v_*$ là chỉ cần *one-step-ahead search* vì $v_*$ đã tính đến hệ quả reward của mọi hành vi tương lai. D (chỉ nhìn reward tức thời) bỏ qua chính giá trị tương lai mà $v_*$ mã hóa.

</details>

---

**Câu 40.** Ưu điểm của việc có $q_*$ so với chỉ có $v_*$ là gì?

- A. Với $q_*$, agent vẫn cần biết đầy đủ dynamics của environment để chọn action.
- B. $q_*$ luôn chiếm ít bộ nhớ hơn $v_*$ vì lưu ít giá trị hơn.
- C. $q_*$ giúp loại bỏ hoàn toàn nhu cầu discount factor trong tính toán.
- D. Với $q_*$, agent *không cần* one-step-ahead search, cũng *không cần* biết dynamics — chỉ cần chọn action tối đa hóa $q_*(s, a)$.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — $q_*$ "cache" kết quả của mọi one-step search, cho phép chọn optimal action *mà không cần biết successor states hay dynamics*. Đánh đổi là phải biểu diễn một hàm của *cặp* state–action (nhiều hơn $v_*$), nên B sai. A trái ngược với chính ưu điểm này; C không liên quan tới discount.

</details>

---

## 3.7 Optimality and Approximation

**Câu 41.** Theo sách, việc giải trực tiếp Bellman optimality equation hiếm khi khả thi trong thực tế vì dựa trên ít nhất ba giả định nào?

- A. (1) Dynamics của environment được biết chính xác; (2) đủ tài nguyên tính toán để hoàn thành phép tính; (3) các state có Markov property.
- B. (1) Reward luôn dương; (2) policy phải là deterministic; (3) discount factor $\gamma = 1$.
- C. (1) MDP chỉ có một state; (2) chỉ có một action khả dĩ; (3) không có reward nào.
- D. (1) Environment hoàn toàn tĩnh; (2) agent biết optimal policy từ trước; (3) discount factor $\gamma = 0$.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Ba giả định hiếm khi đúng đồng thời: (1) dynamics được biết chính xác; (2) đủ tài nguyên tính toán; (3) state có Markov property. Ví dụ backgammon: giả định 1 và 3 ổn nhưng giả định 2 là trở ngại lớn (~$10^{20}$ states). Các phương án còn lại liệt kê những điều kiện không phải giả định mà sách nêu.

</details>

---

**Câu 42.** Trường hợp có thể biểu diễn value function bằng mảng/bảng với một ô cho mỗi state (hoặc cặp state–action) được gọi là gì?

- A. Approximate case.
- B. Continuing case.
- C. Tabular case (tabular methods).
- D. Deterministic case.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Trong các task có tập state nhỏ, hữu hạn, ta dùng mảng/bảng với một ô cho mỗi state (hoặc cặp state–action): *tabular case*, phương pháp tương ứng là *tabular methods*. Khi state quá nhiều, phải dùng parameterized function approximation — đó mới là approximate case (A).

</details>

---

**Câu 43.** Đặc tính nào của reinforcement learning giúp nó xấp xỉ optimal policy hiệu quả, phân biệt nó với các cách tiếp cận giải MDP gần đúng khác?

- A. RL yêu cầu một mô hình hoàn hảo của environment trước khi học.
- B. Tính chất *online* cho phép RL dồn nhiều nỗ lực hơn vào ra quyết định tốt cho các state *thường gặp*, ít hơn cho state hiếm gặp.
- C. RL luôn tính toán được optimal policy hoàn toàn chính xác.
- D. RL hoàn toàn không sử dụng value functions trong quá trình học.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Tính chất online cho phép RL dồn nỗ lực vào học ra quyết định tốt cho state *thường gặp*, ít hơn cho state hiếm. Ví dụ TD-Gammon có thể ra quyết định tệ ở cấu hình hiếm nhưng vẫn chơi rất giỏi. A, C, D đều mâu thuẫn với bản chất xấp xỉ và học từ tương tác của RL.

</details>

---

## 3.8 Summary

**Câu 44.** Khi nào setup của reinforcement learning cấu thành một Markov decision process (MDP)?

- A. Khi nó được hình thức hóa với các transition probabilities được xác định rõ (well defined).
- B. Khi nó có vô hạn states và vô hạn actions.
- C. Khi reward signal luôn bằng $0$ ở mọi bước.
- D. Khi setup hoàn toàn không sử dụng discount factor.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Theo Summary: khi setup RL được hình thức hóa với các *transition probabilities được xác định rõ*, nó cấu thành một MDP. Một *finite MDP* là MDP với tập state, action và reward đều *hữu hạn* — nên B (vô hạn) sai.

</details>

---

**Câu 45.** Về tính duy nhất của optimal value functions và optimal policies, phát biểu nào đúng?

- A. Cả optimal value functions lẫn optimal policy đều luôn duy nhất cho mỗi MDP.
- B. Optimal value functions có thể có nhiều, nhưng optimal policy thì luôn duy nhất.
- C. Optimal value functions ($v_*$, $q_*$) là *duy nhất* cho một MDP, nhưng có thể có *nhiều* optimal policies.
- D. Cả hai đều có thể có vô số nghiệm, không ràng buộc nào.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Theo Summary: optimal value functions cho states và cặp state–action là *duy nhất* (unique) cho một MDP, nhưng *có thể có nhiều* optimal policies (bất kỳ policy nào greedy với optimal value functions đều optimal). B đảo ngược điều này; A và D sai về tính duy nhất.

</details>

---

**Câu 46.** Sự khác biệt giữa "problems of complete knowledge" và "problems of incomplete knowledge" là gì?

- A. Complete knowledge: agent biết trước optimal policy; incomplete knowledge: agent không có reward signal.
- B. Complete knowledge: agent có mô hình đầy đủ, chính xác về dynamics (hàm $p$ bốn đối số); incomplete knowledge: không có mô hình đầy đủ, hoàn hảo.
- C. Complete knowledge chỉ áp dụng cho continuing tasks; incomplete knowledge chỉ cho episodic tasks.
- D. Hai khái niệm này về bản chất là giống hệt nhau, chỉ khác tên gọi.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Theo Summary: *complete knowledge* nghĩa là agent có mô hình đầy đủ, chính xác về dynamics (nếu là MDP thì là hàm $p$ bốn đối số đầy đủ, 3.2); *incomplete knowledge* nghĩa là không có sẵn mô hình hoàn hảo. A và C mô tả sai bản chất; D phủ nhận sự khác biệt thực sự.

</details>

---

**Câu 47.** [Khó] Về Markov property, phát biểu nào đúng theo sách?

- A. Markov property là một hạn chế đặt lên *decision process*, không phải lên state.
- B. Markov property yêu cầu lưu trữ toàn bộ chuỗi state/action trong quá khứ để ra quyết định.
- C. Một state có Markov property nếu nó bao gồm mọi khía cạnh của quá khứ *có ảnh hưởng* tới tương lai; đây là hạn chế đặt lên *state*, không phải decision process.
- D. Markov property nghĩa là reward của một bước chỉ phụ thuộc vào discount factor.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Trong MDP, xác suất của $S_t, R_t$ chỉ phụ thuộc $S_{t-1}, A_{t-1}$ ngay trước đó, không phụ thuộc lịch sử xa hơn. Sách nhấn mạnh đây là hạn chế đặt lên *state* (state phải chứa mọi thông tin quá khứ có ảnh hưởng tới tương lai), *không* phải lên decision process — nên A sai. B trái ngược (Markov *không* cần lưu toàn bộ history); D vô nghĩa.

</details>

---

**Câu 48.** [Khó] Một state $s$ tóm tắt vị trí hiện tại của một robot nhưng *không* bao gồm vận tốc của nó, trong khi động lực học tương lai phụ thuộc cả vận tốc. Theo sách, vấn đề gì xảy ra và cách khắc phục đúng đắn là gì?

- A. State này vi phạm Markov property; cần mở rộng định nghĩa state để bao gồm vận tốc (thông tin quá khứ có ảnh hưởng tới tương lai).
- B. Không có vấn đề gì, vì Markov property chỉ áp dụng cho reward chứ không cho transition.
- C. Cần tăng discount factor $\gamma$ tới gần $1$ để bù cho thông tin vận tốc bị thiếu.
- D. Cần chuyển bài toán từ MDP sang dạng episodic để loại bỏ ảnh hưởng của vận tốc.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Nếu state thiếu một biến (vận tốc) mà tương lai phụ thuộc vào, thì xác suất tương lai *không* chỉ phụ thuộc state hiện tại — vi phạm Markov property. Cách khắc phục là *mở rộng state* để chứa mọi thông tin quá khứ có ảnh hưởng tới tương lai (ở đây: thêm vận tốc). Discount factor (C) và cấu trúc episodic (D) không liên quan tới việc state có đủ thông tin hay không.

</details>
