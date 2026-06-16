# Chương 17: Frontiers — Câu hỏi trắc nghiệm

> Bộ câu hỏi ôn tập chi tiết cho Chương 17, sách *Reinforcement Learning: An Introduction* (Sutton & Barto, 2nd ed.)

## 17.1 General Value Functions and Auxiliary Tasks

**Câu 1.** Một general value function (GVF) khác với value function thông thường (như $v_\pi$ hay $q_*$) ở điểm cốt lõi nào?

- A. GVF chỉ học được bằng dynamic programming với model đầy đủ, không dùng được TD.
- B. GVF dự đoán tổng tích lũy của một tín hiệu bất kỳ (cumulant) chứ không chỉ riêng reward.
- C. GVF luôn yêu cầu on-policy learning và không tương thích với off-policy update.
- D. GVF không cần hàm xấp xỉ tham số, luôn được biểu diễn dưới dạng bảng đầy đủ.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — GVF tổng quát hóa value function bằng cách cho phép dự đoán tổng tích lũy của một tín hiệu bất kỳ gọi là *cumulant* $C_t \in \mathbb{R}$, thay vì chỉ dự đoán tổng reward tương lai. Cumulant có thể là một cảm giác âm thanh, màu sắc, hoặc thậm chí một dự đoán nội bộ khác. Vì GVF không nhất thiết liên hệ với reward, gọi nó là "value function" có phần không chính xác (nên còn gọi là *prediction* hay *forecast*); nhưng nó vẫn có dạng của value function nên học được bằng các phương pháp xấp xỉ thông thường — và thường dùng off-policy là chính, nên A, C, D đều sai.

</details>

---

**Câu 2.** Một GVF được xác định bởi bộ ba thành phần nào?

- A. Behavior policy, learning rate $\alpha$, và eligibility trace $\lambda$.
- B. Reward signal, discount $\gamma$ cố định, và toàn bộ state space.
- C. Target policy $\pi$, termination function $\gamma$ phụ thuộc state, và cumulant $C$.
- D. Model của môi trường, một planner, và một state-update function.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Mỗi GVF được tham số hóa bởi ba lựa chọn: target policy $\pi$ (kế thừa từ off-policy learning), termination function $\gamma: S \to [0,1]$ (tổng quát hóa discounting, cho phép tỷ lệ chiết khấu khác nhau ở mỗi state, từ Section 12.8), và cumulant $C$ (tín hiệu được cộng dồn). Mỗi bộ $(\pi, \gamma, C)$ khác nhau cần một vector trọng số $w$ riêng để xấp xỉ. B nhầm vì $\gamma$ trong GVF là hàm phụ thuộc state chứ không cố định, và cumulant không nhất thiết là reward.

</details>

---

**Câu 3.** Theo sách, vì sao việc học các auxiliary task (dự đoán/điều khiển các tín hiệu ngoài long-term reward) có thể giúp tăng tốc việc học task chính?

- A. Vì auxiliary task luôn có reward dày đặc hơn nên loại bỏ hoàn toàn vấn đề exploration.
- B. Vì auxiliary task có thể đòi hỏi cùng representation mà task chính cần, và việc tìm được feature tốt sớm trên các task dễ hơn có thể giúp ích cho task chính.
- C. Vì auxiliary task thay thế task chính, cho phép agent bỏ qua reward dài hạn.
- D. Vì auxiliary task đảm bảo về mặt lý thuyết là hội tụ nhanh hơn trong mọi trường hợp.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Một cách đơn giản mà auxiliary tasks giúp ích là chúng có thể đòi hỏi cùng những representation cần cho task chính. Nhiều auxiliary task dễ hơn, độ trễ ngắn hơn và mối liên hệ hành động–kết quả rõ ràng hơn; nếu tìm được feature tốt sớm trên các task dễ này thì có thể tăng tốc đáng kể việc học task chính. Sách nhấn mạnh "không có lý do tất yếu" buộc điều này phải đúng (nên D sai), nhưng trong nhiều trường hợp nó hợp lý — ví dụ học dự đoán/điều khiển cảm biến ở quy mô vài giây có thể giúp hình thành ý niệm về vật thể vật lý.

</details>

---

**Câu 4.** Trong kiến trúc artificial neural network (ANN) nhiều "head" cho multi-headed learning với auxiliary tasks, cơ chế nào được mô tả?

- A. Mỗi head có một mạng hoàn toàn riêng, không chia sẻ tham số với head khác.
- B. Các head được huấn luyện tuần tự, mỗi lần huấn luyện một head thì đóng băng các head còn lại.
- C. Chỉ head của task chính được huấn luyện, các head khác chỉ quan sát mà không cập nhật.
- D. Tất cả các head lan truyền lỗi (qua SGD) vào cùng một "body" chia sẻ, buộc body hình thành representation hỗ trợ mọi head.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Lớp cuối của ANN được tách thành nhiều head, mỗi head làm một task khác nhau (một head tạo approximate value function cho task chính với cumulant là reward, các head khác giải auxiliary task). Tất cả các head lan truyền lỗi bằng stochastic gradient descent vào cùng một body chia sẻ phía trước; body sẽ cố hình thành representation ở lớp gần cuối để hỗ trợ tất cả các head. Jaderberg et al. (2017) cho thấy cách này (ví dụ dự đoán thay đổi pixel, reward bước kế tiếp, phân phối return) có thể tăng tốc học rất nhiều. A, B, C đều phá vỡ chính cơ chế chia sẻ representation đó.

</details>

---

**Câu 5.** Sự tương tự với classical conditioning được dùng để giải thích vai trò nào khác của auxiliary task / learned prediction?

- A. Cho phép kết nối (bằng thiết kế, không cần học) một dự đoán về sự kiện cụ thể với một hành động định trước, ví dụ reflex dừng lại khi dự đoán va chạm vượt ngưỡng.
- B. Cho phép agent bỏ qua hoàn toàn reward và chỉ học các prediction nội bộ.
- C. Đảm bảo rằng belief state của agent luôn thỏa mãn Markov property.
- D. Loại bỏ nhu cầu về một state-update function trong kiến trúc agent.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Tương tự classical conditioning: tiến hóa cài sẵn một liên kết phản xạ (không học) từ một dự đoán tới một hành động cụ thể (ví dụ phản xạ chớp mắt khi dự đoán bị chọc vào mắt vượt ngưỡng). Người thiết kế agent có thể làm tương tự: kết nối bằng thiết kế (không cần học) các dự đoán về sự kiện cụ thể với hành động định trước — ví dụ xe tự lái học dự đoán va chạm rồi có reflex cài sẵn để dừng/tránh, hoặc robot hút bụi dự đoán hết pin rồi tự về dock. Phần *dự đoán* thì học được, còn *liên kết* từ dự đoán tới hành động là cài sẵn.

</details>

---

**Câu 6.** [Khó] Hai phát biểu sau: (I) "GVF luôn là một dạng đặc biệt của value function thông thường" và (II) "Mọi value function thông thường đều là một GVF". Phát biểu nào đúng?

- A. Cả (I) và (II) đều đúng vì GVF và value function là khái niệm hoàn toàn tương đương.
- B. Chỉ (I) đúng: GVF luôn quy về một $v_\pi$ với reward thông thường.
- C. Chỉ (II) đúng: value function thông thường là trường hợp riêng của GVF khi cumulant chính là reward và $\gamma$ là discount cố định.
- D. Cả (I) và (II) đều sai vì hai khái niệm không có quan hệ bao hàm nào.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — GVF là *tổng quát hóa*: value function thông thường $v_\pi$ thu được khi chọn cumulant $C_t = R_t$ (reward) và termination function $\gamma$ là hằng số discount thông thường. Ngược lại, một GVF với cumulant tùy ý (ví dụ độ sáng pixel) và $\gamma$ phụ thuộc state nói chung *không* phải là một $v_\pi$ với reward. Do đó (II) đúng và (I) sai — quan hệ bao hàm đi theo một chiều, đúng với tinh thần "general" của GVF.

</details>

---

**Câu 7.** [Khó] Vì sao sách lập luận rằng auxiliary tasks giúp đỡ task chính nhưng đồng thời cảnh báo "không có lý do tất yếu" buộc điều đó phải xảy ra?

- A. Vì auxiliary task chắc chắn có gradient ngược dấu với task chính nên luôn cản trở.
- B. Vì việc cải thiện task chính tùy thuộc representation học được cho auxiliary task có *chia sẻ và phù hợp* với task chính hay không — điều này chỉ là khả năng hợp lý, không phải bảo đảm toán học.
- C. Vì auxiliary task luôn có reward sparse hơn nên trên lý thuyết phải làm chậm task chính.
- D. Vì task chính và auxiliary task bắt buộc dùng hai body mạng tách biệt nên không thể trợ giúp nhau.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Lợi ích của auxiliary tasks đến từ việc *chia sẻ representation*: nếu feature học được cho auxiliary task cũng hữu ích cho task chính thì task chính được hưởng lợi. Nhưng không có định lý nào bắt buộc representation tốt cho task A phải tốt cho task B; trong trường hợp xấu chúng có thể không liên quan hoặc thậm chí cạnh tranh. Vì vậy sách trình bày đây như một heuristic hợp lý chứ không phải bảo đảm — đúng tinh thần thận trọng học thuật của chương Frontiers. C nhầm chiều (auxiliary task thường *dày đặc* hơn), D mâu thuẫn với kiến trúc multi-headed chia sẻ body.

</details>

---

## 17.2 Temporal Abstraction via Options

**Câu 8.** Một *option* $\omega = \langle \pi_\omega, \gamma_\omega \rangle$ được định nghĩa thế nào trong options framework?

- A. Một cặp gồm reward function và transition probability cho một action đơn lẻ.
- B. Một cặp gồm policy $\pi_\omega$ và termination function $\gamma_\omega$ phụ thuộc state, tạo thành khái niệm action tổng quát kéo dài qua nhiều bước thời gian.
- C. Một chuỗi cố định các hành động đã được lập kế hoạch đầy đủ trước khi thực thi.
- D. Một belief state được kết hợp với một core test trong predictive state representation.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Một option là một cặp $\langle \pi_\omega, \gamma_\omega \rangle$: một policy $\pi_\omega$ và một termination function phụ thuộc state $\gamma_\omega$ (giống GVF). Thực thi option tại $t$ nghĩa là lấy action $A_t$ từ $\pi_\omega(\cdot|S_t)$, rồi terminate ở bước $t+1$ với xác suất $1 - \gamma_\omega(S_{t+1})$; nếu không terminate thì tiếp tục. Option mở rộng action space — đây là cách hình thức hóa temporal abstraction. C sai vì option là policy phản ứng theo state chứ không phải chuỗi action cứng.

</details>

---

**Câu 9.** Tại sao các low-level action thông thường được coi là trường hợp đặc biệt của option?

- A. Vì mọi action đều tương ứng với option có termination function bằng 1 ở mọi state.
- B. Vì action không bao giờ có thể biểu diễn dưới dạng option, nên đây là một ngoại lệ.
- C. Vì action luôn đòi hỏi phải dùng intra-option learning để cập nhật.
- D. Vì mỗi action $a$ ứng với option có policy luôn chọn $a$ và $\gamma_\omega(s)=0$ ở mọi state, tức terminate sau đúng 1 bước.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Mỗi action $a$ tương ứng với option $\langle \pi_\omega, \gamma_\omega \rangle$ mà policy luôn chọn action đó ($\pi_\omega(s)=a$ với mọi $s$) và termination function bằng 0 ($\gamma_\omega(s)=0$ với mọi $s \in S^+$). Lưu ý $\gamma_\omega=0$ nghĩa là terminate với xác suất $1-0=1$, tức kết thúc sau đúng 1 bước. Vì vậy option hoán đổi được với low-level action: agent chọn hoặc một action low-level (1 bước) hoặc một extended option (nhiều bước). A sai vì nhầm dấu của termination function.

</details>

---

**Câu 10.** Cập nhật "intra-option" learning (cập nhật ở mỗi bước thay vì chỉ khi option kết thúc) nói chung đòi hỏi điều gì?

- A. On-policy learning.
- B. Off-policy learning.
- C. Một tabular model hoàn chỉnh của môi trường.
- D. Belief state được tính bằng Bayes' rule.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Trong trường hợp đơn giản nhất, quá trình học "nhảy" từ lúc bắt đầu option tới lúc terminate, chỉ cập nhật khi option kết thúc. Tinh tế hơn, có thể cập nhật ở mỗi bước bằng thuật toán "intra-option" learning, mà nói chung đòi hỏi off-policy learning (vì các bước trung gian được dùng để cập nhật nhiều option/target khác policy đang chạy). Đây cũng là hạn chế của các công trình options ban đầu — chúng chưa xử lý tốt off-policy kèm function approximation.

</details>

---

**Câu 11.** Trong option model, phần state-transition $p(s'|s, \omega)$ có đặc điểm khác thường nào so với transition probability thông thường?

- A. Nó luôn cộng bằng đúng 1 trên mọi $s'$ giống transition probability chuẩn.
- B. Nó hoàn toàn độc lập với termination function $\gamma_\omega$ của option.
- C. Vì có thừa số $\gamma^k$ (chiết khấu theo số bước tới khi terminate), $p(s'|s,\omega)$ không còn là một xác suất chuyển và không cộng bằng 1 trên mọi $s'$.
- D. Nó chỉ áp dụng được trong average-reward setting chứ không trong discounted setting.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Phần state-transition của option model đặc trưng cho xác suất của mỗi state kết quả khả dĩ, nhưng state đó có thể đạt được sau số bước khác nhau, mỗi số bước chiết khấu khác nhau bằng $\gamma^k$. Vì thừa số $\gamma^k$ này, $p(s'|s,\omega)$ không còn là transition probability và không cộng bằng 1 trên mọi $s'$ (dù sách vẫn dùng ký hiệu '|'). Discounting theo $\gamma$, còn termination theo $\gamma_\omega$, nên A và B đều sai.

</details>

---

**Câu 12.** Sách gợi ý cách tự nhiên nào để học một option model?

- A. Dùng belief-state update của POMDP với Bayes' rule.
- B. Hình thức hóa option model như một tập hợp các GVF rồi học chúng bằng các phương pháp xấp xỉ value function trong sách (chọn cumulant, policy, termination phù hợp).
- C. Luôn dùng bảng tra cứu (tabular) đầy đủ cho mọi cặp state–option.
- D. Dùng inverse reinforcement learning để khôi phục reward của một expert.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Một cách tự nhiên để học option model là hình thức hóa nó như một tập hợp các GVF. Phần reward: chọn cumulant là reward ($C_t=R_t$), policy là policy của option ($\pi=\pi_\omega$), termination là discount nhân termination của option ($\gamma(s)=\gamma\cdot\gamma_\omega(s)$); khi đó GVF đúng bằng $r(s,\omega)$. Phần state-transition phức tạp hơn, cần một GVF cho mỗi state kết thúc khả dĩ. Tuy mỗi bước có vẻ tự nhiên, việc kết hợp tất cả (cùng function approximation) là rất thách thức và vượt quá state of the art hiện tại.

</details>

---

**Câu 13.** [Khó] Một nhóm cho rằng "options chỉ là cách viết gọn, không bổ sung sức mạnh tính toán nào so với primitive action". Lập luận phản bác đúng theo tinh thần Section 17.2 là gì?

- A. Options không bổ sung gì thật, vì option nào cũng quy về một primitive action duy nhất.
- B. Options luôn nhanh hơn vì chúng bỏ qua hoàn toàn các bước trung gian trong môi trường.
- C. Options không liên quan tới planning, nên không thể so sánh về sức mạnh tính toán.
- D. Options cung cấp temporal abstraction: chúng cho phép planning và credit assignment ở quy mô thời gian dài hơn, làm bài toán dễ hơn ngay cả khi về mặt biểu đạt không có gì primitive action không làm được.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Đúng là về *biểu đạt* (expressiveness), bất cứ thứ gì option làm được thì một chuỗi primitive action cũng thực hiện được, và primitive action chính là một option đặc biệt. Nhưng giá trị của options nằm ở *temporal abstraction*: chúng cho phép lập kế hoạch và gán credit ở quy mô thời gian dài hơn (jumpy / multi-step), thu hẹp độ sâu của bài toán tìm kiếm và làm việc học/planning hiệu quả hơn. Vì vậy "chỉ là viết gọn" bỏ qua chính lợi ích tính toán cốt lõi — A, B, C đều hiểu sai bản chất temporal abstraction.

</details>

---

## 17.3 Observations and State

**Câu 14.** Theo sách, vì sao framework parametric function approximation (Part II) đã "bao hàm" một phần quan trọng của partial observability?

- A. Vì function approximation luôn giả định state hoàn toàn observable nên triệt tiêu vấn đề.
- B. Vì nếu một state variable không observable, ta có thể chọn parameterization sao cho giá trị xấp xỉ không phụ thuộc biến đó — hiệu ứng y hệt như biến đó không observable.
- C. Vì function approximation bắt buộc phải dùng khung POMDP đầy đủ.
- D. Vì function approximation chỉ hoạt động khi đã có belief state Markov.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Trong Part II vẫn giữ giả định value function (và policy) là hàm của environment state, nhưng cho phép hàm bị hạn chế tùy ý bởi parameterization. Một điều bất ngờ và ít được nhận ra: function approximation bao hàm những khía cạnh quan trọng của partial observability — nếu có một state variable không observable, ta chọn parameterization để giá trị xấp xỉ không phụ thuộc biến đó, hiệu ứng giống hệt biến đó không observable. Vì vậy mọi kết quả cho trường hợp parameterized áp dụng cho partial observability mà không cần thay đổi.

</details>

---

**Câu 15.** Khi xử lý partial observability tường minh, môi trường phát ra observation thay vì state. Quan hệ giữa *history* $H_t$ và *state* $S_t$ được mô tả thế nào?

- A. State là toàn bộ history, không hề nén lại, để đảm bảo không mất thông tin.
- B. History là một hàm của state hiện tại, còn state là dữ liệu nguyên thủy.
- C. State và history là hai đại lượng độc lập, không có quan hệ hàm số.
- D. State là một tóm tắt gọn của history, hữu ích để dự đoán tương lai, tức $S_t=f(H_t)$; nếu tóm tắt giữ trọn thông tin để dự đoán mọi tương lai thì $f$ có Markov property.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — History $H_t = A_0, O_1, \ldots, A_{t-1}, O_t$ là tất cả những gì biết được về quá khứ từ dòng dữ liệu, nhưng nó lớn dần theo $t$. Ý niệm state là một *tóm tắt gọn* của history hữu ích để dự đoán chuỗi tương lai: $S_t=f(H_t)$. Tóm tắt là "informationally perfect" nếu giữ toàn bộ thông tin của history (dự đoán tương lai chính xác như từ history đầy đủ) — khi đó $S_t$, $f$ có Markov property và $S_t$ là Markov state. Trong thực tế state của agent thường không Markov mà chỉ tiệm cận tới đó như một lý tưởng. A sai vì identity quá lớn để hữu dụng.

</details>

---

**Câu 16.** State-update function $u$ trong $S_{t+1}=u(S_t, A_t, O_{t+1})$ giải quyết mối quan tâm tính toán nào?

- A. Tự động chọn cumulant phù hợp cho mỗi GVF.
- B. Cho phép cập nhật state incremental/recursive (gọn, không lưu cả history), và phải tính được hiệu quả vì không thể ra quyết định/dự đoán cho tới khi state sẵn sàng.
- C. Đảm bảo reward signal luôn dày đặc trong mọi episode.
- D. Khôi phục reward của expert từ behavior quan sát được.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Ta muốn state gọn (nhỏ hơn nhiều so với history — hàm identity $S_t=H_t$ tuy Markov nhưng lớn vô hạn nên không tốt) và muốn một hàm cập nhật incremental, recursive tính $S_{t+1}$ từ $S_t$ chỉ với increment dữ liệu mới $A_t, O_{t+1}$. Hàm $u$ là state-update function — phần trung tâm của bất kỳ kiến trúc agent nào xử lý partial observability. Nó phải tính được hiệu quả vì không action hay prediction nào được thực hiện cho tới khi state sẵn sàng.

</details>

---

**Câu 17.** Đâu là khác biệt cốt lõi giữa POMDP và Predictive State Representations (PSR) trong cách định nghĩa agent state?

- A. POMDP dùng predictions về observation tương lai, còn PSR dùng một latent state ẩn.
- B. Cả hai đều dựa trên cùng một latent state ẩn giống hệt nhau, chỉ khác cách cập nhật.
- C. POMDP định nghĩa state là belief state (phân phối trên latent state ẩn $X_t$ chưa từng quan sát được), còn PSR định nghĩa state dựa trên predictions về các "core test" (observation/action tương lai, vốn quan sát được).
- D. PSR yêu cầu biết hoàn toàn động lực học nội bộ của môi trường, còn POMDP thì không cần.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Trong POMDP, môi trường có latent state $X_t$ chưa từng available cho agent; Markov state tự nhiên là *belief state* — vector phân phối trên các latent state cho trước history, cập nhật bằng Bayes' rule (giả định biết hoàn toàn cơ chế nội bộ). Cách này có giả định nặng và scale tính toán kém nên sách không khuyến nghị cho AI. PSR khắc phục: grounding semantics của state vào predictions về observation/action tương lai (các "core test"), vốn dễ quan sát nên dễ học hơn. D đảo ngược thực tế — chính POMDP mới cần biết cơ chế nội bộ.

</details>

---

**Câu 18.** Một vấn đề được nêu với việc lặp các one-step prediction để có long-term prediction trong trường hợp xấp xỉ là gì?

- A. One-step prediction không bao giờ đủ thông tin, kể cả khi chúng chính xác tuyệt đối.
- B. Lặp one-step prediction luôn cho kết quả tốt hơn dùng GVF trực tiếp.
- C. Long-term prediction từ one-step prediction luôn có độ phức tạp tuyến tính theo độ dài.
- D. One-step prediction chỉ lặp ra long-term prediction chính xác nếu chúng chính xác tuyệt đối; nếu có sai số/xấp xỉ thì lỗi có thể tích lũy (compound) làm long-term prediction sai lệch nghiêm trọng.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Nếu $f$ incrementally updatable thì nó Markov khi và chỉ khi mọi one-step test dự đoán được chính xác (17.8); one-step prediction chính xác là đủ thông tin để dự đoán test bất kỳ độ dài. Tuy vậy: (1) xác định long-term prediction từ single-step prediction có độ phức tạp tăng theo hàm mũ theo độ dài (nên C sai); (2) one-step prediction chỉ lặp ra long-term prediction chính xác nếu chúng *chính xác tuyệt đối* — nếu có bất kỳ sai số/xấp xỉ nào, lỗi tích lũy khiến long-term prediction sai lệch dữ dội, và thực tế điều này thường xảy ra.

</details>

---

**Câu 19.** [Khó] Sách lập luận PSR có ưu thế "dễ học" hơn belief state của POMDP chủ yếu nhờ điều gì?

- A. Vì PSR luôn dùng ít tham số hơn POMDP trong mọi bài toán.
- B. Vì semantics của state trong PSR được grounded vào dữ liệu quan sát được (observation/action tương lai), trong khi belief state của POMDP grounded vào latent state ẩn không bao giờ quan sát được.
- C. Vì PSR không cần state-update function còn POMDP thì cần.
- D. Vì PSR không cần dữ liệu, còn POMDP đòi hỏi nhiều episode để khởi tạo belief.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Điểm yếu cốt lõi của POMDP đối với việc học là semantics của belief state được định nghĩa qua latent state $X_t$ *không bao giờ quan sát được*; muốn cập nhật bằng Bayes' rule lại cần biết cơ chế nội bộ môi trường. PSR grounding semantics của state vào predictions về các core test (observation/action tương lai) — đều là đại lượng quan sát được, nên có thể kiểm chứng và học trực tiếp từ dữ liệu. Đây là lý do "dễ học hơn", không phải vì số tham số (A) hay vì không cần state-update (C, cả hai đều cần một dạng cập nhật state).

</details>

---

## 17.4 Designing Reward Signals

**Câu 20.** Theo sách, ưu điểm lớn của reinforcement learning so với supervised learning về reward signal là gì, kèm thách thức nào?

- A. RL không cần reward; thách thức duy nhất là chọn learning rate phù hợp.
- B. RL không phụ thuộc thông tin chỉ dẫn chi tiết (không cần biết action đúng là gì), nhưng thành công phụ thuộc mạnh vào việc reward signal đóng khung mục tiêu của designer tốt đến đâu, nên thiết kế reward là phần then chốt.
- C. RL luôn có reward dày đặc nên trên thực tế không gặp thách thức thiết kế nào.
- D. RL chỉ cần một reward signal hằng số, không đổi theo state, là đủ để học.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Ưu điểm lớn của RL là không dựa vào thông tin chỉ dẫn chi tiết: tạo reward signal không cần biết action đúng phải là gì. Nhưng thành công của một ứng dụng RL phụ thuộc mạnh vào việc reward signal đóng khung mục tiêu của designer tốt đến đâu và đánh giá tiến độ tốt đến đâu. Vì vậy thiết kế reward signal là phần then chốt của mọi ứng dụng RL — và không phải lúc nào cũng dễ (não chúng ta đã tiến hóa hàng triệu năm để tạo các tín hiệu này).

</details>

---

**Câu 21.** Vấn đề *sparse reward* được mô tả thế nào, và đâu là rủi ro khi cố giải quyết bằng cách thêm reward bổ sung cho subgoal?

- A. Sparse reward là khi reward khác 0 quá hiếm để agent đạt mục tiêu; thêm reward bổ sung cho subgoal có thể khiến agent hành xử khác ý định và rốt cuộc không đạt mục tiêu tổng thể.
- B. Sparse reward chỉ xảy ra khi không có mục tiêu rõ ràng; thêm reward subgoal luôn an toàn.
- C. Sparse reward chỉ là vấn đề của reward signal, không liên quan gì tới policy.
- D. Thêm reward subgoal luôn đảm bảo agent đạt được mục tiêu nhanh hơn trước.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Sparse reward: phát reward khác 0 đủ thường xuyên để agent đạt mục tiêu (chưa nói tới học hiệu quả) có thể là thách thức lớn; agent có thể lang thang vô định lâu (Minsky gọi là "plateau problem"). Hấp dẫn nhưng rủi ro là thưởng cho agent vì đạt các subgoal mà designer cho là quan trọng — các supplemental reward thiện chí này có thể khiến agent hành xử khác ý định và cuối cùng không đạt mục tiêu tổng thể. Cách an toàn hơn là giữ nguyên reward signal mà khởi tạo value-function approximation bằng một guess ban đầu $v_0$ (công thức 17.11). C sai vì sparse reward gắn cả với policy.

</details>

---

**Câu 22.** Kỹ thuật *shaping* (do nhà tâm lý học B. F. Skinner giới thiệu) hoạt động thế nào để giải quyết sparse reward?

- A. Giữ nguyên reward signal nhưng tăng learning rate dần dần qua các giai đoạn.
- B. Khôi phục reward signal của một expert bằng inverse reinforcement learning.
- C. Thay đổi reward signal khi việc học tiến triển: bắt đầu từ reward không sparse với behavior ban đầu của agent, rồi dần điều chỉnh về reward signal phù hợp với bài toán gốc, qua một chuỗi bài toán khó dần.
- D. Loại bỏ hoàn toàn reward và chỉ dùng intrinsic motivation thay thế.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Shaping dựa trên thực tế rằng sparse reward không chỉ là vấn đề của reward signal mà còn của policy (policy ngăn agent thường gặp các state có reward). Shaping thay đổi reward signal trong quá trình học: bắt đầu từ reward signal *không sparse* đối với behavior ban đầu, rồi dần điều chỉnh về reward signal phù hợp với bài toán gốc (có thể đồng thời điều chỉnh dynamics của task). Mỗi lần điều chỉnh khiến agent thường được thưởng với behavior hiện tại; agent đối mặt một chuỗi bài toán RL khó dần, kinh nghiệm mỗi giai đoạn làm bài toán kế tiếp dễ hơn. Đây là kỹ thuật thiết yếu trong huấn luyện động vật và cũng hiệu quả trong RL tính toán.

</details>

---

**Câu 23.** Theo các thí nghiệm bilevel optimization (Singh, Lewis, Barto, 2009), một kết luận phản trực giác về reward signal của agent là gì?

- A. Reward signal của agent phải luôn giống hệt mục tiêu của designer.
- B. Trực giác của con người luôn đủ để thiết kế một reward signal tốt.
- C. Reward signal không bao giờ nên được tối ưu bằng gradient ascent.
- D. Mục tiêu của agent không nhất thiết nên giống mục tiêu của designer — vì agent học dưới ràng buộc (tài nguyên tính toán, thời gian, thông tin hạn chế), học một mục tiêu khác đôi khi lại tiến gần hơn tới mục tiêu của designer.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Reward signal có thể coi là một tham số của thuật toán học và được tự động tối ưu (kể cả bằng online gradient ascent theo high-level objective — Sorg, Lewis, Singh 2010), tương tự tiến hóa. Các thí nghiệm bilevel optimization xác nhận trực giác không phải lúc nào cũng đủ (nên B sai), và quan trọng: mục tiêu của agent *không nên luôn giống* mục tiêu của designer. Vì agent học dưới ràng buộc, học một mục tiêu khác đôi khi tiến gần mục tiêu designer hơn là theo đuổi trực tiếp. Ví dụ: tiến hóa cho ta reward tìm kiếm vị giác nhất định thay vì trực tiếp đánh giá giá trị dinh dưỡng (điều ta không làm được).

</details>

---

**Câu 24.** [Khó] So sánh *shaping* và việc *khởi tạo value function bằng $v_0$* (công thức 17.11) như hai cách đối phó với sparse reward. Khác biệt cốt lõi là gì?

- A. Cả hai đều thay đổi reward signal theo cách giống hệt nhau, chỉ khác tên gọi.
- B. Shaping thay đổi chính reward signal (và có thể cả dynamics) trong quá trình học, trong khi khởi tạo $v_0$ *giữ nguyên* reward signal gốc và chỉ định hướng việc học ban đầu qua giá trị khởi tạo.
- C. Shaping giữ nguyên reward còn khởi tạo $v_0$ mới là cách thay đổi reward signal.
- D. Khởi tạo $v_0$ chỉ dùng cho supervised learning, còn shaping dùng cho RL.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Đây là hai triết lý khác nhau. *Shaping* can thiệp vào *reward signal* (và đôi khi cả task dynamics), dắt agent qua một chuỗi bài toán dễ dần. Ngược lại, sách đề xuất một cách *bảo toàn mục tiêu* hơn: giữ nguyên reward signal gốc (tránh rủi ro làm lệch mục tiêu như khi thêm subgoal reward) và thay vào đó *khởi tạo* value-function approximation bằng một guess ban đầu $v_0$ (17.11), nhờ đó định hướng exploration/learning ban đầu mà không bóp méo mục tiêu cuối. C đảo ngược vai trò hai kỹ thuật.

</details>

---

## 17.5 Remaining Issues

**Câu 25.** Vấn đề "catastrophic interference" (hay "correlated data") của deep learning hiện tại trong online/incremental setting là gì?

- A. Mạng học quá chậm chỉ vì learning rate được đặt quá cao.
- B. Khi học điều gì đó mới, nó có xu hướng thay thế những gì đã học trước thay vì bổ sung thêm, làm mất lợi ích của việc học cũ.
- C. Mạng không thể xấp xỉ bất kỳ hàm phi tuyến nào.
- D. Replay buffer khiến mạng quên hết dữ liệu mới vừa thu được.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Vấn đề đầu tiên trong remaining issues: vẫn cần parametric function approximation hoạt động tốt trong incremental, online setting. Deep learning/ANN hiện chỉ tốt với batch training trên tập dữ liệu lớn, self-play offline, hoặc kinh nghiệm đan xen của nhiều agent — đều là cách "đi vòng" quanh hạn chế cơ bản: học chậm trong online setting. Vấn đề này gọi là "catastrophic interference" / "correlated data": khi học cái mới, nó thay thế cái đã học thay vì cộng thêm, làm mất lợi ích học cũ. Kỹ thuật như "replay buffer" giúp giữ và phát lại dữ liệu cũ (nên D nhầm tác dụng của replay buffer).

</details>

---

**Câu 26.** Trong RL, vấn đề *representation learning* ("constructive induction", "meta-learning") có thể được đồng nhất với vấn đề học cái gì (theo Section 17.3)?

- A. Học reward signal.
- B. Học state-update function.
- C. Học option model bằng tabular.
- D. Học belief state qua Bayes' rule.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Vấn đề thứ hai: vẫn cần phương pháp học feature sao cho việc học sau đó generalize tốt — đây là representation learning / constructive induction / meta-learning: dùng kinh nghiệm không chỉ để học một hàm mong muốn mà còn học các inductive bias để việc học tương lai generalize tốt hơn, nhanh hơn. RL mang lại khả năng mới cho vấn đề cũ này (ví dụ auxiliary tasks ở Section 17.1). Đặc biệt, trong RL, vấn đề representation learning có thể được đồng nhất với vấn đề học state-update function (đã bàn ở Section 17.3).

</details>

---

**Câu 27.** Theo sách, vì sao việc học model cho planning cần phải có tính *chọn lọc* (selective)?

- A. Vì model phải bao gồm mọi chi tiết của môi trường mới planning chính xác được.
- B. Vì tabular model luôn tốt hơn model có function approximation trong mọi tình huống.
- C. Vì phạm vi của model ảnh hưởng mạnh tới hiệu quả planning: model tập trung vào hệ quả then chốt của các option quan trọng thì planning nhanh; nếu chứa chi tiết không quan trọng của các option ít được chọn thì planning gần như vô dụng.
- D. Vì model phải được học hoàn toàn xong trước khi bất kỳ bước planning nào bắt đầu.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Vấn đề thứ ba: vẫn cần phương pháp scalable để planning với learned environment model. Planning rất hiệu quả khi model biết trước (AlphaGo Zero, cờ vua) nhưng full model-based RL học model từ dữ liệu rồi plan thì hiếm (Dyna là ví dụ nhưng dùng tabular model). Học model cần chọn lọc vì phạm vi của model ảnh hưởng mạnh hiệu quả planning: tập trung vào hệ quả then chốt của các option quan trọng nhất thì planning hiệu quả, nhanh; chứa chi tiết về hệ quả không quan trọng của các option ít khả năng được chọn thì planning gần như vô dụng. Các bộ phận của model nên được liên tục theo dõi mức đóng góp/cản trở hiệu quả planning.

</details>

---

**Câu 28.** Vấn đề thứ tư — tự động hóa việc chọn task (chọn cumulant, policy, termination cho GVF) — đòi hỏi điều gì?

- A. Các lựa chọn task phải luôn cố định và mã hóa cứng trong code.
- B. Mọi task phải do con người thiết kế thủ công vĩnh viễn, không tự động hóa được.
- C. Agent không được phép tạo task theo kiểu phân cấp (hierarchically).
- D. Nếu thiết kế GVF được tự động hóa, các lựa chọn thiết kế phải được biểu diễn tường minh trong máy (để đặt, thay đổi, theo dõi, lọc, tìm kiếm tự động), thay vì nằm trong đầu designer và mã hóa cứng trong code.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Vấn đề thứ tư: tự động hóa việc chọn task mà agent làm và dùng để cấu trúc năng lực phát triển của nó. Thông thường con người đặt task và mã hóa cứng vào code vì biết trước và cố định. Nhưng ta muốn agent tự chọn task (subtask của task đã biết, hoặc building block cho task tương lai chưa biết). State of the art hiện là chọn cumulant/policy/termination thủ công, nhưng sức mạnh lớn hơn đến từ tự động hóa. Nếu tự động hóa thiết kế GVF, các lựa chọn phải được biểu diễn tường minh trong máy — đặt/thay đổi, theo dõi, lọc, tìm kiếm tự động. Task có thể xây hierarchically: task là câu hỏi, nội dung ANN là câu trả lời.

</details>

---

**Câu 29.** Vấn đề thứ năm — phép loại suy tính toán của *curiosity* — sử dụng intrinsic reward thế nào?

- A. Intrinsic reward thay thế hoàn toàn external reward trong mọi tình huống.
- B. Khi reward không có sẵn hoặc không bị behavior ảnh hưởng mạnh, agent có thể chọn action tối đa hóa việc học, dùng thước đo learning progress (hoặc độ novel/bất ngờ, hoặc khả năng gây thay đổi môi trường) làm intrinsic reward.
- C. Intrinsic reward chỉ là một loại supervised loss tính trên nhãn cho trước.
- D. Curiosity đòi hỏi agent phải có sẵn một belief state Markov hoàn hảo.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Vấn đề thứ năm: tương tác giữa behavior và learning qua một dạng tính toán của curiosity. Khi nhiều task được học đồng thời bằng off-policy từ cùng dòng kinh nghiệm, action ảnh hưởng dòng kinh nghiệm này. Khi reward không có sẵn hoặc không bị behavior ảnh hưởng mạnh, agent tự do chọn action tối đa hóa learning trên các task — dùng thước đo learning progress làm "intrinsic" reward, hiện thực một dạng tính toán của curiosity. Intrinsic reward còn có thể báo hiệu input bất ngờ/mới lạ/thú vị, hoặc đánh giá khả năng agent gây thay đổi môi trường. Nó cho phép agent tự đặt task (qua auxiliary tasks, GVF, options) — một dạng tính toán của "play".

</details>

---

**Câu 30.** Vấn đề thứ sáu (cuối cùng) trong remaining issues, cũng là một trong những lĩnh vực cấp thiết nhất, là gì?

- A. Tìm learning rate tối ưu cho mọi thuật toán RL.
- B. Phát triển phương pháp để embed các RL agent vào môi trường vật lý một cách an toàn ở mức chấp nhận được.
- C. Loại bỏ hoàn toàn function approximation khỏi RL.
- D. Chứng minh hội tụ cho mọi thuật toán tabular đã biết.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Vấn đề thứ sáu và cuối cùng: phát triển phương pháp để làm cho việc nhúng RL agent vào môi trường vật lý trở nên *an toàn ở mức chấp nhận được*. Đây là một trong những lĩnh vực cấp thiết nhất cho nghiên cứu tương lai, và được bàn thêm trong Section 17.6.

</details>

---

**Câu 31.** [Khó] Sách mô tả deep RL hiện đại đạt thành tích lớn nhờ batch training, self-play offline, hoặc kinh nghiệm đan xen của nhiều agent. Vì sao sách coi đây là dấu hiệu của một *hạn chế chưa giải quyết* chứ không phải một thành tựu trọn vẹn?

- A. Vì các kỹ thuật đó tốn quá nhiều bộ nhớ, đó là vấn đề duy nhất.
- B. Vì chúng thực chất là cách "đi vòng" quanh việc deep network học kém trong online/incremental setting (catastrophic interference), chứ chưa khắc phục được gốc rễ.
- C. Vì self-play chỉ áp dụng được cho board game nên không phải RL thật.
- D. Vì batch training luôn cho kết quả tệ hơn online learning trong mọi benchmark.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Sách đánh giá thẳng thắn rằng deep learning hiện tại học *chậm* trong online setting do catastrophic interference / correlated data. Batch training, self-play offline, replay buffer, kinh nghiệm đan xen của nhiều agent... đều là cách *né* (work around) hạn chế đó bằng cách biến bài toán online thành dạng gần-batch, chứ không thực sự giải quyết bài toán học incremental, online một cách tự nhiên — vốn là điều cần cho một agent tương tác liên tục với thế giới. Vì vậy nó nằm trong danh sách remaining issues. A, C, D đều thu hẹp hoặc hiểu sai bản chất vấn đề.

</details>

---

## 17.6 Reinforcement Learning and the Future of Artificial Intelligence

**Câu 32.** Theo sách, vì sao dùng simulator để huấn luyện RL agent là hấp dẫn nhưng cuối cùng vẫn cần agent học trong thế giới thực?

- A. Simulator luôn chạy chậm hơn thời gian thực nên về cơ bản là vô dụng.
- B. Simulator cung cấp môi trường an toàn, dữ liệu gần như vô hạn và rẻ, chạy nhanh hơn thời gian thực; nhưng thường khó/bất khả thi mô phỏng đủ độ trung thực để policy hoạt động tốt và an toàn ngoài thực tế, nhất là môi trường phụ thuộc hành vi con người.
- C. Học trong thế giới thực thực ra không bao giờ thật sự cần thiết.
- D. Simulator về nguyên tắc không thể tránh được mọi hậu quả thực tế không mong muốn.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Simulator cung cấp môi trường an toàn để khám phá/học mà không gây hại thật; ngoài tránh hậu quả thực tế không mong muốn, kinh nghiệm mô phỏng còn cho dữ liệu gần như vô hạn, rẻ hơn, thường chạy nhanh hơn thời gian thực nên học nhanh hơn. Tuy vậy, tiềm năng đầy đủ của RL đòi hỏi agent nhúng vào dòng kinh nghiệm thế giới thực, vì thường khó (đôi khi bất khả thi) mô phỏng đủ độ trung thực để policy hoạt động tốt và an toàn khi điều khiển action thật — đặc biệt với môi trường mà dynamics phụ thuộc hành vi con người (giáo dục, y tế, giao thông, chính sách công).

</details>

---

**Câu 33.** Sách dùng "The Sorcerer's Apprentice" (Goethe) và "The Monkey's Paw" (qua Norbert Wiener) để minh họa rủi ro nào của RL?

- A. Catastrophic interference trong các mạng deep learning.
- B. Vấn đề sparse reward trong môi trường mô phỏng độ trung thực thấp.
- C. Vì RL dựa trên optimization và ta chỉ chỉ định điều mình muốn một cách gián tiếp qua reward signal, agent có thể tìm ra những cách bất ngờ để lấy reward — đáp ứng "điều bạn yêu cầu, chứ không phải điều bạn nên yêu cầu hay điều bạn dự định".
- D. Sự khó khăn của intra-option learning khi kèm function approximation.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Vì RL dựa trên optimization, nó thừa hưởng cả ưu lẫn nhược của mọi phương pháp optimization. Nhược điểm là khó thiết kế objective function (reward signal) để optimization cho kết quả mong muốn mà tránh kết quả không mong muốn. Khi ta chỉ chỉ định điều mình muốn *gián tiếp* (qua reward), ta không biết agent sẽ đáp ứng sát đến đâu cho tới khi học xong. Wiener (founder của cybernetics) dẫn "The Monkey's Paw": "...nó đáp ứng điều bạn yêu cầu, chứ không phải điều bạn nên yêu cầu hay điều bạn dự định." Goethe's "Sorcerer's Apprentice": phù phép cây chổi lấy nước nhưng gây lụt vì thiếu hiểu biết. Đây không phải vấn đề mới của RL (Bostrom 2014).

</details>

---

**Câu 34.** Theo sách, cách tiếp cận để quản lý rủi ro an toàn khi nhúng RL agent vào thế giới thực được mô tả thế nào?

- A. Hoàn toàn mới và chưa từng có tiền lệ trong bất kỳ ngành kỹ thuật nào.
- B. Chỉ cần tăng số lượng auxiliary task để agent hiểu môi trường tốt hơn là đủ an toàn.
- C. Loại bỏ hoàn toàn optimization khỏi RL để tránh các kết quả không mong muốn.
- D. Tương tự những gì control engineer đã đối mặt: dựa trên modeling cẩn thận, validation, kiểm thử rộng rãi, lý thuyết hội tụ/ổn định của adaptive controller, cùng constraints (cứng/mềm), policy robust/risk-sensitive, và optimization đa mục tiêu.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Sách nhấn mạnh rủi ro này không hoàn toàn mới hay riêng của RL. Quản lý/giảm rủi ro cho embedded RL tương tự điều control engineer đã đối mặt từ đầu khi dùng automatic control nơi behavior của controller có thể gây hậu quả thảm khốc (điều khiển máy bay, quy trình hóa học tinh vi). Control dựa trên modeling hệ thống cẩn thận, model validation, kiểm thử rộng rãi, và có lý thuyết phát triển cao về đảm bảo hội tụ/ổn định của adaptive controller. Nhiều cách giảm rủi ro optimization đã có (hard/soft constraints, policy robust và risk-sensitive, optimization đa mục tiêu) và một số đã được điều chỉnh cho RL. Một trong những lĩnh vực cấp thiết nhất là điều chỉnh, mở rộng các phương pháp control engineering để nhúng RL agent an toàn.

</details>

---

**Câu 35.** [Khó] Sách nói rủi ro "agent đáp ứng điều bạn yêu cầu chứ không phải điều bạn dự định" *không phải vấn đề mới của RL*. Cách hiểu đúng nhất về luận điểm này là gì?

- A. Vì RL chưa từng gặp rủi ro này, nó là hoàn toàn an toàn so với các phương pháp khác.
- B. Vì đây là hệ quả chung của mọi hệ thống dựa trên optimization khi mục tiêu được chỉ định gián tiếp; nó có lịch sử dài trong văn học, kỹ thuật điều khiển và cybernetics, nên có thể tiếp cận bằng tri thức đã tích lũy từ các lĩnh vực đó.
- C. Vì rủi ro này chỉ phát sinh khi dùng function approximation, không xảy ra ở RL tabular.
- D. Vì rủi ro này chỉ là một dạng đặc biệt của catastrophic interference đã được giải quyết.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Luận điểm của sách là rủi ro "đáp ứng yêu cầu sát nghĩa nhưng lệch ý định" là đặc trưng của *bất kỳ* hệ tối ưu hóa nào khi mục tiêu chỉ được mô tả gián tiếp qua một objective/reward signal — không riêng RL. Vì vậy nó đã được nhận diện từ lâu: trong văn học (Goethe, "The Monkey's Paw"), trong cybernetics của Wiener, trong control engineering, và gần đây Bostrom (2014). Hệ quả thực tiễn: ta có thể mượn các công cụ giảm rủi ro đã phát triển ở những lĩnh vực này thay vì bắt đầu từ con số không. A và D đều hiểu sai (rủi ro vẫn tồn tại; nó không phải catastrophic interference), C thu hẹp sai phạm vi.

</details>
