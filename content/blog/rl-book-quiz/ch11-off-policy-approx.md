# Chương 11: Off-policy Methods with Approximation — Câu hỏi trắc nghiệm

> Bộ câu hỏi ôn tập chi tiết cho Chương 11, sách *Reinforcement Learning: An Introduction* (Sutton & Barto, 2nd ed.)

## 11.1 Semi-gradient Methods

**Câu 1.** Theo sách, thách thức của off-policy learning được chia thành hai phần. Hai phần đó là gì?

- A. Lựa chọn step size phù hợp và lựa chọn feature representation đủ giàu.
- B. Cân bằng exploration và exploitation, cùng việc kiểm soát bias–variance của reward.
- C. Target của update (mục tiêu cập nhật) và distribution của các update (phân phối cập nhật).
- D. Hiệu chỉnh discount rate $\gamma$ và thiết lập eligibility trace cho multi-step.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Phần thứ nhất liên quan đến target của update (đã có ở dạng tabular, xử lý bằng importance sampling từ Chương 5 và 7), phần thứ hai liên quan đến distribution của các update (chỉ trở thành vấn đề khi có function approximation, vì phân phối cập nhật trong off-policy không khớp với on-policy distribution). Các phương án còn lại đều là vấn đề có thật trong RL nhưng không phải cách sách chia đôi thách thức off-policy.

</details>

---

**Câu 2.** Trong semi-gradient off-policy TD(0), công thức cập nhật là $w_{t+1} = w_t + \alpha \rho_t \delta_t \nabla \hat{v}(S_t, w_t)$. Đại lượng $\rho_t$ đóng vai trò gì?

- A. Là per-step importance sampling ratio $\rho_t = \pi(A_t|S_t)/b(A_t|S_t)$.
- B. Là step size thích nghi, tự co giãn theo độ lớn của TD error.
- C. Là discount rate hiệu dụng, điều chỉnh trọng số của future reward.
- D. Là eligibility trace tích lũy gradient của các bước trước đó.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — $\rho_t = \pi(A_t|S_t)/b(A_t|S_t)$ là per-step importance sampling ratio. So với on-policy TD(0), thuật toán off-policy chỉ thêm thừa số $\rho_t$ để hiệu chỉnh target của update theo target policy. Nó KHÔNG phải step size, discount rate hay eligibility trace.

</details>

---

**Câu 3.** Thuật toán nào sau đây thuộc dạng off-policy nhưng KHÔNG sử dụng importance sampling ở bước một bước?

- A. Semi-gradient off-policy TD(0) cho state value.
- B. Semi-gradient one-step Expected Sarsa.
- C. n-step semi-gradient Sarsa cho action value.
- D. Naive residual-gradient cho mean square TDE.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Semi-gradient one-step Expected Sarsa không dùng importance sampling, vì action duy nhất được lấy mẫu là $A_t$ và khi học giá trị của chính nó ta không cần hiệu chỉnh sang các action khác (target đã lấy expectation theo $\pi$). TD(0) cho state value (A) cần $\rho_t$; n-step Sarsa (C) cần tích các ratio cho các bước sau bước đầu; naive residual-gradient (D) là true SGD trên TDE, không liên quan câu hỏi.

</details>

---

**Câu 4.** Các phương pháp semi-gradient off-policy được mô tả trong sách có tính chất nào?

- A. Là các true SGD method nên về mặt toán học không bao giờ diverge.
- B. Luôn hội tụ robust hệt như trong on-policy training, không cần điều kiện gì thêm.
- C. Đảm bảo ổn định và không chệch tiệm cận trong mọi cấu hình function approximation.
- D. Xử lý phần thứ nhất (target) nhưng không xử lý phần thứ hai (distribution), nên có thể diverge.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Các phương pháp semi-gradient chỉ hiệu chỉnh update target chứ không sửa update distribution. Vì vậy chúng có thể diverge trong một số trường hợp (Baird's counterexample) và "không sound", dù vẫn thường được dùng thành công. Chúng chỉ đảm bảo ổn định trong trường hợp tabular. A sai vì semi-gradient không phải true SGD.

</details>

---

**Câu 5.** [Khó] Khi chuyển từ on-policy semi-gradient TD(0) sang off-policy semi-gradient TD(0), thành phần nào KHÔNG được thuật toán sửa chữa, và điều đó nói lên hạn chế gì?

- A. Toàn bộ công thức không đổi; off-policy chỉ khác ở việc chọn behavior policy bên ngoài thuật toán.
- B. Phần TD error $\delta_t$ giữ nguyên còn $\rho_t$ là mới; nhờ đó vấn đề distribution được khắc phục hoàn toàn.
- C. Phân phối lấy mẫu các trạng thái vẫn theo behavior policy $b$ chứ không phải $\pi$; thuật toán không sửa mismatch này nên vẫn có thể bất ổn.
- D. Step size $\alpha$ giữ nguyên, nghĩa là chỉ cần giảm $\alpha$ là off-policy luôn ổn định như on-policy.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Thừa số $\rho_t$ sửa được target (đưa kỳ vọng về theo $\pi$), nhưng các trạng thái $S_t$ vẫn được thăm theo phân phối của behavior policy $b$. Thuật toán semi-gradient không động đến mismatch về distribution này, nên vẫn có thể diverge — đúng là "phần thứ hai" của thách thức bị bỏ ngỏ (nên B sai). D sai vì giảm $\alpha$ không loại bỏ được divergence, chỉ làm chậm.

</details>

---

## 11.2 Examples of Off-policy Divergence

**Câu 6.** Trong ví dụ hai trạng thái với giá trị $w$ và $2w$ (transition reward 0), update off-policy semi-gradient TD(0) cho $w_{t+1} = (1 + \alpha(2\gamma - 1)) w_t$. Hệ thống trở nên bất ổn ($w$ tiến ra vô cực) khi nào?

- A. Khi $\alpha$ được chọn rất nhỏ so với $\gamma$.
- B. Khi $\gamma > 0.5$, độc lập với giá trị cụ thể của step size $\alpha > 0$.
- C. Khi $\gamma < 0.5$, vì chiết khấu yếu không kéo được giá trị về.
- D. Chỉ khi $\alpha > 1$, do bước cập nhật vượt quá khoảng ổn định.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Hằng số nhân là $1 + \alpha(2\gamma - 1)$, lớn hơn 1 khi $2\gamma - 1 > 0$, tức $\gamma > 0.5$. Tính bất ổn không phụ thuộc giá trị $\alpha$ cụ thể (miễn $\alpha > 0$); step size chỉ ảnh hưởng tốc độ phân kỳ chứ không quyết định có phân kỳ hay không — đây là điểm mấu chốt khiến A, C, D sai.

</details>

---

**Câu 7.** Điều gì khiến cho transition $w \to 2w$ có thể lặp lại liên tục mà không bị "trả giá" trong off-policy training, dẫn đến divergence?

- A. Vì step size quá lớn nên mỗi bước cập nhật vượt quá điểm cân bằng.
- B. Vì discount rate quá nhỏ khiến giá trị tương lai gần như bị bỏ qua.
- C. Vì reward trên transition luôn dương nên giá trị bị đẩy lên liên tục.
- D. Vì behavior policy chọn các action mà target policy không chọn, làm $\rho_t = 0$ trên các transition đó nên không có update kéo giá trị xuống.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Trong off-policy, behavior policy có thể chọn action mà target policy không bao giờ chọn; với các transition đó $\rho_t = 0$ nên không có update. Nhờ vậy một transition $w \to 2w$ có thể lặp lại mà không bị transition "ra khỏi" trạng thái $2w$ kéo giá trị xuống. Trong on-policy thì $\rho_t = 1$ luôn nên "the piper must be paid". Reward ở đây bằng 0 (C sai), và bất ổn độc lập với $\alpha$ hay $\gamma$ nhỏ (A, B sai).

</details>

---

**Câu 8.** Về Baird's counterexample (7 trạng thái, 2 action), phát biểu nào ĐÚNG?

- A. Reward khác 0 ở một số transition nên không tồn tại lời giải đúng biểu diễn được.
- B. Target policy luôn chọn dashed action còn behavior policy luôn chọn solid action.
- C. Tập feature vector phụ thuộc tuyến tính nên function approximation không đủ khả năng biểu diễn.
- D. Target policy luôn chọn solid action, behavior chọn dashed 6/7 và solid 1/7, reward luôn 0 nên $v_\pi(s)=0$.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Target policy luôn chọn solid action (dẫn về trạng thái thứ bảy), behavior policy chọn dashed 6/7 và solid 1/7 để next-state distribution là đều. Reward luôn 0 nên true value bằng 0 ở mọi trạng thái, biểu diễn chính xác được với $w=0$. Tập feature vector là linearly independent (C sai) — mọi điều kiện đều thuận lợi, vậy mà semi-gradient TD(0) vẫn diverge.

</details>

---

**Câu 9.** Trong Baird's counterexample, áp dụng semi-gradient DP (expected update kiểu (11.9)) thay vì TD lấy mẫu thì điều gì xảy ra?

- A. Hệ thống hội tụ ngay vì update kỳ vọng đã loại bỏ mọi randomness.
- B. Hệ thống vẫn bất ổn, weight vẫn diverge dù không có randomness hay asynchrony.
- C. Hệ thống hội tụ về điểm cực tiểu $\overline{VE}$ nhưng chậm hơn TD lấy mẫu.
- D. Hệ thống chỉ hội tụ khi step size được giảm dần về 0 theo lịch trình.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Ngay cả với expected DP update (không randomness, không asynchrony), hệ thống vẫn bất ổn và weight diverge. Điều này cho thấy nguyên nhân KHÔNG phải do learning hay uncertainty của môi trường, mà do chính sự kết hợp bootstrapping + function approximation + update không theo on-policy distribution. (Nếu đổi distribution của DP update sang on-policy thì lại hội tụ — nhưng đó là thay đổi distribution, không phải giảm $\alpha$.)

</details>

---

**Câu 10.** Tsitsiklis and Van Roy's counterexample chứng minh điều gì?

- A. Q-learning luôn diverge khi dùng linear function approximation.
- B. Averagers như nearest neighbor cũng có thể diverge nếu off-policy.
- C. Importance sampling đủ để loại bỏ divergence trong mọi trường hợp linear.
- D. Ngay cả khi mỗi bước tìm best least-squares approximation bằng DP, linear approximation vẫn có thể diverge khi không có lời giải chính xác.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Counterexample này (mở rộng ví dụ $w$-to-$2w$ với một terminal state) cho thấy ngay cả khi tại mỗi bước ta chọn $w_{k+1}$ cực tiểu hóa $\overline{VE}$ so với expected one-step return (best least-squares approximation), dãy $\{w_k\}$ vẫn diverge khi $\gamma > \frac{6-4\epsilon}{5-4\epsilon}$ và $w_0 \neq 0$. Stability không được đảm bảo khi không có lời giải chính xác. A quá tuyệt đối, B sai (averagers ổn định), C sai.

</details>

---

**Câu 11.** Loại function approximation nào được đảm bảo ổn định vì không extrapolate ra ngoài các target quan sát được?

- A. Tile coding với nhiều tiling chồng lên nhau.
- B. Artificial neural networks (ANNs) nhiều tầng.
- C. Averagers như nearest neighbor và locally weighted regression.
- D. Linear function approximation với feature trực giao.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Các phương pháp gọi là *averagers* — gồm nearest neighbor và locally weighted regression — không extrapolate ra ngoài các target quan sát được nên được đảm bảo ổn định ngay cả off-policy. Ngược lại, tile coding, ANNs và linear approximation tổng quát đều có thể extrapolate, nên không thuộc nhóm an toàn này (A, B, D sai).

</details>

---

**Câu 12.** [Khó] Một kỹ sư báo rằng off-policy semi-gradient TD(0) của họ diverge trên một bài toán linear. Họ thử: (i) giảm $\alpha$ mười lần, (ii) khởi tạo $w_0 = 0$, (iii) chuyển sang on-policy distribution. Phương án nào có khả năng cao nhất CHẤM DỨT divergence, và vì sao?

- A. (i), vì step size đủ nhỏ luôn đưa SGD về vùng ổn định.
- B. (ii), vì khởi tạo tại nghiệm đúng giữ hệ thống tại điểm cố định mãi mãi.
- C. (iii), vì khôi phục on-policy distribution loại bỏ một chân của deadly triad nên đảm bảo ổn định.
- D. Không phương án nào, vì divergence của linear off-policy TD là không thể tránh.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Divergence ở đây sinh từ deadly triad (function approximation + bootstrapping + off-policy). Chuyển sang on-policy distribution loại bỏ chân thứ ba, và on-policy semi-gradient TD(0) có đảm bảo hội tụ. (i) sai: bất ổn độc lập với $\alpha > 0$, giảm $\alpha$ chỉ làm chậm phân kỳ. (ii) sai: trong Baird, $w=0$ là nghiệm đúng nhưng KHÔNG phải điểm hút — nhiễu nhỏ vẫn bị đẩy ra xa. D quá tuyệt đối.

</details>

---

## 11.3 The Deadly Triad

**Câu 13.** Ba thành phần tạo nên the deadly triad là gì?

- A. Exploration, exploitation, và discounting.
- B. Bias, variance, và observation noise.
- C. Monte Carlo, temporal-difference, và dynamic programming.
- D. Function approximation, bootstrapping, và off-policy training.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — The deadly triad gồm: (1) function approximation, (2) bootstrapping (target chứa estimate hiện có, như trong DP/TD), và (3) off-policy training. Nguy cơ bất ổn và divergence chỉ xuất hiện khi cả ba cùng có mặt.

</details>

---

**Câu 14.** Theo sách, nếu chỉ có HAI trong ba thành phần của deadly triad (không đủ ba) thì điều gì xảy ra?

- A. Instability có thể tránh được.
- B. Divergence vẫn xảy ra chắc chắn như khi có đủ ba.
- C. Hệ thống luôn hội tụ chính xác về true value function.
- D. Bắt buộc phải dùng importance sampling mới ổn định.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Nếu có mặt hai thành phần bất kỳ nhưng không đủ cả ba thì instability có thể tránh được. Do đó câu hỏi tự nhiên là có thể từ bỏ thành phần nào trong ba. C quá mạnh (tránh được instability không có nghĩa hội tụ về true value, vì còn sai số xấp xỉ).

</details>

---

**Câu 15.** Trong ba thành phần của deadly triad, thành phần nào sách cho rằng KHÓ từ bỏ nhất?

- A. Function approximation.
- B. Bootstrapping.
- C. Off-policy training.
- D. Cả ba đều có thể từ bỏ với chi phí như nhau.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Function approximation rõ ràng nhất là không thể từ bỏ, vì ta cần phương pháp scale tới bài toán lớn với khả năng biểu diễn mạnh. Bootstrapping có thể bỏ (dùng Monte Carlo) nhưng trả giá về hiệu quả tính toán và dữ liệu. Off-policy cũng có thể bỏ (dùng Sarsa thay Q-learning) nhưng off-policy lại cần cho việc học song song nhiều value function.

</details>

---

**Câu 16.** Phát biểu nào ĐÚNG về nguyên nhân của instability trong deadly triad?

- A. Nguy cơ chủ yếu đến từ control hoặc generalized policy iteration.
- B. Nguy cơ đến từ learning và uncertainty về môi trường.
- C. Instability chỉ xuất hiện khi dùng nonlinear function approximation phức tạp.
- D. Instability đã xuất hiện trong prediction đơn giản, và xảy ra cả trong planning (DP) khi môi trường được biết hoàn toàn.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Nguy cơ KHÔNG do control hay GPI; instability đã xuất hiện ngay trong bài toán prediction đơn giản khi có đủ ba thành phần. Cũng KHÔNG do learning hay uncertainty môi trường, vì nó xảy ra mạnh ngay cả trong planning như DP. C sai vì linear approximation cũng diverge (Baird).

</details>

---

**Câu 17.** [Khó] Q-learning với function approximation hội đủ cả ba chân của deadly triad, nhưng trên thực tế lại được dùng rất rộng rãi và thường hoạt động tốt. Cách hiểu nào chính xác nhất theo tinh thần của sách?

- A. Q-learning thực ra không phải off-policy nên không nằm trong deadly triad.
- B. Sự kết hợp này không được đảm bảo hội tụ và có thể diverge, dù thực tế thường hoạt động tốt; đây là vùng còn chưa ổn định về lý thuyết.
- C. Q-learning luôn hội tụ vì toán tử $\max$ trong target loại bỏ hiệu ứng off-policy.
- D. Deadly triad chỉ áp dụng cho state-value prediction, không cho action-value methods.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Q-learning với function approximation hội đủ deadly triad nên KHÔNG có đảm bảo hội tụ về lý thuyết và có thể diverge trong các trường hợp bệnh lý, dù trên thực tế thường hoạt động tốt. Đây chính là khoảng cách lý thuyết–thực hành mà chương 11 nêu. A, C sai (Q-learning đúng là off-policy, $\max$ không loại bỏ vấn đề); D sai (vấn đề áp dụng cả action-value).

</details>

---

## 11.4 Linear Value-function Geometry

**Câu 18.** Trong hình học value-function tuyến tính, tại sao norm Euclid thông thường không phù hợp để đo khoảng cách giữa các value function?

- A. Vì nó không khả vi nên không dùng được với gradient descent.
- B. Vì một số trạng thái quan trọng hơn (xuất hiện thường xuyên hơn hoặc ta quan tâm hơn), nên cần norm có trọng số theo phân phối $\mu$.
- C. Vì khoảng cách Euclid giữa hai value function bất kỳ luôn bằng 0.
- D. Vì subspace biểu diễn được không phải là một mặt phẳng tuyến tính.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Một số trạng thái quan trọng hơn, nên ta dùng phân phối $\mu$ để cân trọng số, định nghĩa norm $\|v\|_\mu^2 = \sum_s \mu(s) v(s)^2$. Khi đó $\overline{VE}(w) = \|v_w - v_\pi\|_\mu^2$. A sai (Euclid vẫn khả vi), D sai (subspace linear vẫn là mặt phẳng).

</details>

---

**Câu 19.** Projection operator $\Pi$ thực hiện điều gì, và $\Pi v_\pi$ là lời giải mà phương pháp nào tìm được (tiệm cận)?

- A. $\Pi$ áp Bellman operator lên value; $\Pi v_\pi$ là TD fixed point.
- B. $\Pi$ tăng số chiều của không gian biểu diễn; $\Pi v_\pi$ là lời giải của DP.
- C. $\Pi$ tính gradient của objective; $\Pi v_\pi$ là điểm cực tiểu $\overline{BE}$.
- D. $\Pi$ đưa value function tùy ý về value function gần nhất trong subspace (theo norm $\mu$); $\Pi v_\pi$ là lời giải Monte Carlo tìm về.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Projection operator $\Pi$ ánh xạ một value function tùy ý về value function biểu diễn được gần nhất theo norm $\mu$. $\Pi v_\pi$ là điểm cực tiểu $\overline{VE}$, và là lời giải Monte Carlo tìm về (dù thường rất chậm). Với linear approximation, $\Pi = X(X^\top D X)^{-1} X^\top D$. A nhầm với Bellman operator $B$, không phải $\Pi$.

</details>

---

**Câu 20.** Bellman error tại trạng thái $s$, $\bar{\delta}_w(s)$, có quan hệ thế nào với TD error?

- A. Bellman error là expectation của TD error (kỳ vọng của TD error tại trạng thái đó).
- B. Bellman error luôn bằng 0 với mọi value function biểu diễn được.
- C. Bellman error là bình phương của TD error rồi lấy trung bình theo $\mu$.
- D. Bellman error độc lập hoàn toàn với TD error, được tính từ model.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Bellman error tại một trạng thái là expectation của TD error tại trạng thái đó: $\bar{\delta}_w(s) = \mathbb{E}_\pi[R_{t+1} + \gamma v_w(S_{t+1}) - v_w(S_t) \mid S_t = s, A_t \sim \pi]$. Vector của mọi Bellman error là Bellman error vector, kích thước bình phương theo norm $\mu$ là $\overline{BE}$. B sai (chỉ bằng 0 nếu $v_w = v_\pi$).

</details>

---

**Câu 21.** Quan hệ giữa $\overline{BE}$, $\overline{PBE}$, $\overline{VE}$ và TD fixed point $w_{TD}$ nào sau đây ĐÚNG?

- A. $\overline{BE}$, $\overline{PBE}$ và $\overline{VE}$ luôn chia sẻ chung một điểm cực tiểu duy nhất.
- B. $\overline{PBE}$ là kích thước projected Bellman error vector; với linear approximation luôn có $w$ với $\overline{PBE}=0$ là $w_{TD}$, nói chung khác cực tiểu $\overline{VE}$ và $\overline{BE}$.
- C. Điểm cực tiểu $\overline{BE}$ luôn trùng với $\Pi v_\pi$.
- D. $\overline{PBE}=0$ luôn kéo theo $v_w = v_\pi$ chính xác.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — $\overline{PBE}(w) = \|\Pi \bar{\delta}_w\|_\mu^2$ là kích thước projected Bellman error vector. Với linear approximation luôn tồn tại $w$ trong subspace có $\overline{PBE}=0$, đó chính là TD fixed point $w_{TD}$. Điểm này nói chung KHÁC cực tiểu $\overline{VE}$ ($\Pi v_\pi$) và cực tiểu $\overline{BE}$. D sai vì $\overline{PBE}=0$ chỉ nghĩa là projection của Bellman error bằng 0, không phải $v_w = v_\pi$.

</details>

---

**Câu 22.** [Khó] Với linear function approximation, $\overline{VE}$ và $\overline{PBE}$ có thể đạt cực tiểu tại hai điểm khác nhau. Hệ quả thực tiễn quan trọng nhất của sự khác biệt này là gì?

- A. Không có hệ quả: vì cả hai đều learnable nên dùng objective nào cũng cho cùng nghiệm.
- B. TD methods (tìm $w_{TD}$, cực tiểu $\overline{PBE}$) có thể cho value function khác với nghiệm sai số xấp xỉ nhỏ nhất ($\Pi v_\pi$, cực tiểu $\overline{VE}$).
- C. $\overline{VE}$ luôn cho nghiệm tệ hơn $\overline{PBE}$ nên ta luôn nên dùng TD.
- D. Sự khác biệt chỉ tồn tại trong tabular và biến mất khi có function approximation.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Vì $w_{TD}$ (cực tiểu $\overline{PBE}$) nói chung khác $\Pi v_\pi$ (cực tiểu $\overline{VE}$, nghiệm sai số xấp xỉ nhỏ nhất), TD methods có thể hội tụ về một value function không phải là xấp xỉ tốt nhất theo $\overline{VE}$. Sách có chặn $\overline{VE}(w_{TD}) \le \frac{1}{1-\gamma}\min_w \overline{VE}(w)$, cho thấy nghiệm TD có thể tệ hơn đáng kể khi $\gamma$ gần 1. A, C, D đều sai về bản chất.

</details>

---

## 11.5 Gradient Descent in the Bellman Error

**Câu 23.** Naive residual-gradient algorithm cực tiểu hóa mean square TD error (TDE). Trong A-split example (tabular, on-policy), nó hội tụ về giá trị nào cho B và C, và điều này cho thấy gì?

- A. Hội tụ về giá trị đúng (B=1, C=0), chứng tỏ TDE là objective tốt.
- B. Diverge ra vô cực vì TDE không có cực tiểu hữu hạn.
- C. Hội tụ về B=1/2, C=1/2 do hai trạng thái được làm trung bình.
- D. Hội tụ về B=3/4, C=1/4 (khác true value B=1, C=0); cho thấy cực tiểu hóa TDE giống "temporal smoothing" hơn là dự đoán chính xác.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Dù tabular (biểu diễn được chính xác true value), naive residual-gradient hội tụ về B=3/4, C=1/4 (A đúng = 1/2). Đây là các giá trị cực tiểu hóa TDE. Việc phạt mọi TD error tạo ra hiệu ứng "temporal smoothing" chứ không phải dự đoán chính xác — true value không có TDE nhỏ nhất, nên A sai.

</details>

---

**Câu 24.** Tại sao true residual-gradient algorithm (cực tiểu hóa $\overline{BE}$) gặp khó khăn về việc lấy mẫu, đòi hỏi "double sampling"?

- A. Vì cần hai step size khác nhau cho hai pha của thuật toán.
- B. Vì next state $S_{t+1}$ xuất hiện trong hai expectation được nhân với nhau; sample không chệch của tích cần hai sample độc lập của next state, mà tương tác thực chỉ cho một.
- C. Vì $\overline{BE}$ luôn âm nên gradient đổi dấu liên tục.
- D. Vì importance sampling ratio quá lớn làm variance không kiểm soát được.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Gradient của $\overline{BE}$ chứa next state $S_{t+1}$ xuất hiện trong hai expectation nhân với nhau. Để có unbiased sample của tích cần hai sample độc lập của next state từ cùng $S_t$ — chỉ làm được trong môi trường deterministic (hai sample tất yếu giống nhau) hoặc môi trường mô phỏng (roll back để lấy next state thay thế). Trong tương tác thực thì không. C, D không liên quan.

</details>

---

**Câu 25.** A-presplit example chứng minh điều gì về $\overline{BE}$ objective?

- A. Residual-gradient hội tụ về true value ngay cả khi có genuine function approximation.
- B. $\overline{BE}$ và TDE luôn cho hai nghiệm khác nhau trong mọi môi trường.
- C. $\overline{BE}$ objective luôn cho true value bất kể loại function approximation.
- D. Với genuine function approximation, residual-gradient tìm về cùng lời giải kém (B=3/4, C=1/4), cho thấy cực tiểu hóa $\overline{BE}$ có thể không đáng mong muốn.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — A-presplit example có A1, A2 trông giống hệt nhau với function approximator. Vì mọi transition đều deterministic nên $\overline{BE}$ = TDE, và residual-gradient (kể cả phiên bản non-naive) hội tụ về cùng lời giải kém B=3/4, C=1/4. Điều này cho thấy chính $\overline{BE}$ objective — chứ không riêng thuật toán — dẫn đến lời giải không mong muốn khi có function approximation thật sự. A, C sai.

</details>

---

## 11.6 The Bellman Error is Not Learnable

**Câu 26.** Khái niệm "learnability" trong section này được dùng theo nghĩa nào?

- A. Học được hiệu quả (số mẫu đa thức thay vì hàm mũ) — như trong machine learning thông thường.
- B. Học được ở mức cơ bản nhất — có học được chút nào không, với bất kỳ lượng dữ liệu nào (kể cả vô hạn).
- C. Học được với độ phức tạp tính toán $O(d)$ mỗi bước.
- D. Học được bằng stochastic gradient descent với step size giảm dần.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Ở đây "learnability" dùng theo nghĩa cơ bản hơn machine learning thông thường (vốn nói về học hiệu quả với số mẫu đa thức). Ý nói: học được *chút nào* hay không, với bất kỳ lượng experiential data nào, kể cả vô hạn. Một số đại lượng được định nghĩa rõ và tính được nếu biết cấu trúc bên trong môi trường, nhưng không thể ước lượng từ chuỗi feature vector, action, reward quan sát được.

</details>

---

**Câu 27.** Cặp hai MRP trong ví dụ đầu (một MRP một trạng thái phát 0/2 ngẫu nhiên, một MRP hai trạng thái) minh họa điều gì về $\overline{VE}$?

- A. $\overline{VE}$ là learnable trực tiếp từ data distribution.
- B. $\overline{VE}$ luôn bằng 0 cho cả hai MRP nên không phân biệt được.
- C. $\overline{VE}$ và RE luôn có điểm cực tiểu khác nhau với cùng dữ liệu.
- D. $\overline{VE}$ không learnable (hai MRP cùng data distribution nhưng $\overline{VE}$ khác nhau), tuy nhiên parameter cực tiểu hóa $\overline{VE}$ thì learnable.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Hai MRP sinh ra cùng một data distribution (chuỗi 0 và 2 ngẫu nhiên) nhưng có $\overline{VE}$ khác nhau với cùng $w$, nên $\overline{VE}$ không phải hàm duy nhất của data distribution — $\overline{VE}$ không learnable. Tuy nhiên parameter tối ưu $w^*$ lại giống nhau cho cả hai, nên parameter cực tiểu hóa $\overline{VE}$ thì learnable. A, B sai.

</details>

---

**Câu 28.** Mean square return error (RE) có quan hệ thế nào với $\overline{VE}$, và tại sao RE quan trọng?

- A. RE = $\overline{VE}$ cộng một số hạng variance không phụ thuộc parameter; do đó hai objective có cùng $w^*$, và RE thì luôn learnable.
- B. RE luôn lớn hơn $\overline{VE}$ và có điểm cực tiểu $w^*$ hoàn toàn khác.
- C. RE không learnable giống hệt như $\overline{VE}$.
- D. RE = $\overline{BE}$ cộng một số hạng variance, nên có cùng cực tiểu với $\overline{BE}$.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — $\overline{RE}(w) = \overline{VE}(w) + \mathbb{E}[(G_t - v_\pi(S_t))^2]$; số hạng variance không phụ thuộc parameter vector nên hai objective có cùng $w^*$ tối ưu. RE luôn observable (error giữa value estimate và return thực) nên learnable — đây là lý do $w^*$ của $\overline{VE}$ vẫn dùng được. B, C, D sai.

</details>

---

**Câu 29.** Trong counterexample về learnability của Bellman error (cặp MRP với A, B, B'), điều then chốt được chứng minh là gì?

- A. $\overline{BE}$ learnable trong khi $\overline{VE}$ thì không.
- B. $\overline{BE}$ luôn bằng $\overline{VE}$ trên mọi MRP.
- C. Hai MRP sinh cùng data distribution nhưng có $\overline{BE}$ khác nhau VÀ parameter cực tiểu hóa $\overline{BE}$ khác nhau — nên ngay cả lời giải tối ưu của $\overline{BE}$ cũng không học được từ data.
- D. $\overline{BE}$ learnable với độ phức tạp $O(d)$ nhưng cần model.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Khác với $\overline{VE}$ (mà ít nhất parameter tối ưu là learnable), với $\overline{BE}$ thì ngay cả parameter cực tiểu hóa cũng KHÔNG learnable. Hai MRP cùng data distribution nhưng minimizing parameter vector khác nhau (MRP một: $w=0$; MRP hai: tiến về $(-1/2, 0)^\top$ khi $\gamma \to 1$). Do đó về nguyên tắc không thể theo đuổi $\overline{BE}$ như learning objective — cần kiến thức về MRP ngoài những gì data tiết lộ.

</details>

---

**Câu 30.** Tại sao residual-gradient algorithm vẫn có thể cực tiểu hóa $\overline{BE}$ dù $\overline{BE}$ không learnable từ data quan sát?

- A. Vì nó dùng một dạng importance sampling đặc biệt khử được mismatch.
- B. Vì nó được phép double-sample từ cùng một state — không chỉ state có cùng feature vector, mà state thực được đảm bảo giống nhau (truy cập underlying state).
- C. Vì thực ra $\overline{BE}$ learnable, kết luận trước đó là sai.
- D. Vì nó dùng eligibility trace để bù đắp thông tin thiếu.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Residual-gradient chỉ cực tiểu hóa được $\overline{BE}$ vì nó được phép double-sample từ cùng một state — không phải state có cùng feature vector mà là state thực được đảm bảo giống nhau. Cực tiểu hóa $\overline{BE}$ đòi hỏi truy cập underlying state, nên $\overline{BE}$ chỉ là model-based objective, không thể cực tiểu hóa từ feature vector mà không truy cập underlying MDP. C sai.

</details>

---

**Câu 31.** Theo Figure 11.4 và phân tích, objective nào trong nhóm bootstrapping là learnable (xác định trực tiếp từ data)?

- A. Chỉ $\overline{BE}$.
- B. $\overline{PBE}$ và TDE.
- C. Chỉ $\overline{VE}$.
- D. Không objective nào trong nhóm learnable.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Trong nhóm bootstrapping objective, $\overline{PBE}$ và TDE có thể xác định trực tiếp từ data (learnable), và các điểm cực tiểu của chúng (nói chung khác nhau và khác $\overline{BE}$) cũng vậy. $\overline{BE}$ thì không learnable. Điều này hướng sự chú ý về phía $\overline{PBE}$ như mục tiêu phù hợp cho learning.

</details>

---

## 11.7 Gradient-TD Methods

**Câu 32.** Gradient-TD methods cực tiểu hóa objective nào, và có tính chất gì?

- A. Cực tiểu hóa $\overline{BE}$ bằng double sampling, với độ phức tạp $O(d^2)$.
- B. Cực tiểu hóa TDE bằng semi-gradient, ổn định nhưng cho nghiệm smoothing.
- C. Cực tiểu hóa $\overline{VE}$ trực tiếp bằng Monte Carlo, không bootstrapping.
- D. Cực tiểu hóa $\overline{PBE}$ bằng true SGD, hội tụ robust kể cả off-policy và nonlinear, độ phức tạp $O(d)$.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Gradient-TD methods là true SGD methods cực tiểu hóa $\overline{PBE}$. Trong linear case luôn có lời giải chính xác (TD fixed point $w_{TD}$ với $\overline{PBE}=0$). Chúng đạt convergence robust kể cả off-policy và nonlinear function approximation, với $O(d)$ complexity (gradient của $\overline{PBE}$ learnable với $O(d)$, trả giá bằng việc gấp đôi computation và một parameter vector thứ hai). A, B, C sai.

</details>

---

**Câu 33.** GTD2 và TDC lưu trữ và học một vector phụ $v$. Vector $v$ này xấp xỉ điều gì?

- A. Xấp xỉ chính true value function $v_\pi$ qua một head thứ hai.
- B. Là eligibility trace tích lũy các gradient gần đây.
- C. Là gradient của reward theo parameter, dùng để hiệu chỉnh bias.
- D. Là lời giải linear least-squares xấp xỉ $\rho_t \delta_t$ từ feature: $v \approx \mathbb{E}[x_t x_t^\top]^{-1} \mathbb{E}[\rho_t \delta_t x_t]$.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — $v \approx \mathbb{E}[x_t x_t^\top]^{-1} \mathbb{E}[\rho_t \delta_t x_t]$, là tích của hai factor cuối trong biểu thức gradient $\overline{PBE}$ (một ma trận $d \times d$ và một $d$-vector cho ra một $d$-vector). Đây là lời giải bài toán linear least-squares xấp xỉ $\rho_t \delta_t$ từ feature, cập nhật bằng LMS rule với $O(d)$ storage và computation. A, B, C sai.

</details>

---

**Câu 34.** TDC còn được gọi là gì, và tại sao GTD2/TDC cần "two-time-scale" trong chứng minh hội tụ?

- A. TDC còn gọi là LSTD; cần hai time scale vì có độ phức tạp $O(d^2)$.
- B. TDC còn gọi là Expected Sarsa; hai time scale để giảm bias của target.
- C. TDC còn gọi là Emphatic-TD; hai time scale để cập nhật interest và emphasis.
- D. TDC còn gọi là GTD(0); cần hai time scale vì cấu trúc cascade — secondary process (cho $v$) phải chạy nhanh hơn và ở giá trị tiệm cận để hỗ trợ primary process (cho $w$).

<details>
<summary>Đáp án</summary>

**Đáp án: D** — TDC (TD(0) with gradient correction) còn gọi là GTD(0). GTD2 và TDC đều có hai quá trình học: primary cho $w$ và secondary cho $v$. Đây là cấu trúc *cascade* bất đối xứng: logic của primary dựa vào việc secondary đã (gần như) hoàn tất. Two-time-scale proof giả định secondary chạy nhanh hơn (luôn ở giá trị tiệm cận); thường yêu cầu $\beta/\alpha \to 0$ trong giới hạn. A, B, C sai.

</details>

---

**Câu 35.** Trên Baird's counterexample, behavior của TDC như Figure 11.5 cho thấy gì?

- A. $\overline{PBE}$ và mọi component của $w$ đều về 0 gần như tức thì.
- B. TDC diverge giống hệt semi-gradient TD vì cũng off-policy.
- C. $\overline{VE}$ về 0 ngay trong vài iteration đầu.
- D. $\overline{PBE}$ giảm về 0 nhưng các component của $w$ không về 0, và $\overline{VE}$ vẫn gần 2 sau 1000 iteration — đang hội tụ về nghiệm tối ưu nhưng rất chậm.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Đúng như thiết kế, $\overline{PBE}$ giảm về 0, nhưng các component của parameter vector không tiến về 0 (nghiệm tối ưu cần $w$ tỉ lệ với $(1,1,1,1,1,1,4,-2)^\top$). Sau 1000 iteration $\overline{VE}$ vẫn gần 2. Hệ thống thực ra đang hội tụ về nghiệm tối ưu nhưng tiến rất chậm vì $\overline{PBE}$ đã ở rất gần 0. A, B, C sai.

</details>

---

**Câu 36.** [Khó] So với semi-gradient off-policy TD(0), Gradient-TD đạt được sự ổn định nhờ điều gì, và phải trả giá gì?

- A. Nhờ loại bỏ bootstrapping; trả giá bằng việc phải lưu toàn bộ episode như Monte Carlo.
- B. Nhờ chuyển về on-policy distribution; trả giá bằng việc cần biết behavior policy chính xác.
- C. Nhờ là true SGD trên $\overline{PBE}$ (gradient learnable với $O(d)$); trả giá bằng một parameter vector thứ hai $v$, một step size thứ hai, và xấp xỉ gấp đôi tính toán.
- D. Nhờ dùng $\max$ operator chống divergence; trả giá bằng độ phức tạp $O(d^2)$ mỗi bước.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Gradient-TD ổn định vì nó là true SGD đi theo gradient thật của $\overline{PBE}$, một objective learnable với $O(d)$ — không như semi-gradient (chỉ "nửa" gradient, có thể diverge). Giá phải trả: một parameter vector phụ $v$ ước lượng linear least-squares, một step size thứ hai cho nó, và khoảng gấp đôi tính toán. A (vẫn bootstrap), B (không đổi distribution), D ($O(d)$ chứ không $O(d^2)$) đều sai.

</details>

---

## 11.8 Emphatic-TD Methods

**Câu 37.** Ý tưởng cốt lõi của Emphatic-TD methods để xử lý off-policy là gì?

- A. Tăng step size mỗi khi $\rho_t$ lớn để bù đắp các transition hiếm.
- B. Loại bỏ hoàn toàn importance sampling và thay bằng tree-backup target.
- C. Dùng averagers để xấp xỉ giá trị nên đảm bảo ổn định mặc định.
- D. Reweight các trạng thái (nhấn mạnh một số, giảm nhẹ số khác) để đưa distribution của update về on-policy, khôi phục điều kiện ổn định.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Trong off-policy, ta reweight transition bằng importance sampling cho phù hợp $\pi$, nhưng state distribution vẫn của $b$ — có mismatch. Emphatic-TD reweight các state (emphasizing/de-emphasizing) để đưa distribution của update về on-policy; khi đó match được khôi phục và stability/convergence theo từ các kết quả on-policy đã có. A, B, C sai.

</details>

---

**Câu 38.** Trong one-step Emphatic-TD, hai đại lượng $M_t$ (emphasis) và $I_t$ (interest) được dùng thế nào?

- A. $M_t = \rho_t / I_t$, dùng để thay thế hoàn toàn importance sampling ratio.
- B. $M_t$ đóng vai trò step size còn $I_t$ đóng vai trò discount rate hiệu dụng.
- C. $I_t$ là eligibility trace còn $M_t$ là reward tích lũy tới thời điểm $t$.
- D. $M_t = \gamma \rho_{t-1} M_{t-1} + I_t$, với $I_t$ tùy ý và $M_{-1}=0$; update là $w_{t+1} = w_t + \alpha M_t \rho_t \delta_t \nabla \hat{v}(S_t, w_t)$.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Update Emphatic-TD: $w_{t+1} = w_t + \alpha M_t \rho_t \delta_t \nabla \hat{v}(S_t, w_t)$, với emphasis $M_t = \gamma \rho_{t-1} M_{t-1} + I_t$, interest $I_t$ tùy ý, và $M_{-1} = 0$. Emphasis nhân vào update để reweight các trạng thái. A, B, C đều hiểu sai vai trò của $M_t$, $I_t$.

</details>

---

**Câu 39.** Emphatic-TD hoạt động thế nào trên Baird's counterexample trong lý thuyết và trong thực tế?

- A. Diverge cả trong lý thuyết lẫn thực tế, không khá hơn semi-gradient.
- B. Hội tụ tốt cả lý thuyết lẫn thực tế với variance rất thấp.
- C. Chỉ hội tụ khi $\gamma = 0$, ngoài ra luôn dao động.
- D. Trong kỳ vọng (lý thuyết) hội tụ về nghiệm tối ưu ($\overline{VE}$ về 0), nhưng trong thực tế variance quá cao nên gần như không cho kết quả nhất quán.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Trong kỳ vọng (trajectory tính toán không có sampling variance), Emphatic-TD hội tụ về nghiệm tối ưu, $\overline{VE}$ về 0 (có dao động). Nhưng khi áp dụng trực tiếp, variance trên Baird's counterexample quá cao đến mức gần như không thể có kết quả thực nghiệm nhất quán — dẫn tới chủ đề giảm variance ở section tiếp theo. A, B, C sai.

</details>

---

**Câu 40.** [Khó] Cả Gradient-TD và Emphatic-TD đều khôi phục được tính ổn định cho off-policy với linear function approximation, nhưng chúng nhắm vào CHÂN nào của deadly triad và bằng cách khác nhau ra sao?

- A. Cả hai đều loại bỏ bootstrapping, chỉ khác ở cách lưu trữ trace.
- B. Cả hai đều loại bỏ function approximation, quay về dạng tabular hiệu dụng.
- C. Gradient-TD giữ nguyên cả ba chân nhưng thay semi-gradient bằng true gradient của một objective learnable ($\overline{PBE}$); Emphatic-TD trung hòa chân off-policy bằng cách reweight để khôi phục on-policy distribution.
- D. Gradient-TD trung hòa off-policy còn Emphatic-TD loại bỏ bootstrapping; hai cách bù trừ nhau.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Hai họ giải quyết vấn đề ở hai chỗ khác nhau. Gradient-TD giữ cả ba chân nhưng thay phần thuật toán: đi theo true gradient của $\overline{PBE}$ (learnable) thay vì semi-gradient, nên SGD ổn định. Emphatic-TD nhắm thẳng vào chân off-policy: reweight các state bằng emphasis để distribution của update trở về on-policy, khôi phục các bảo đảm on-policy. Không họ nào bỏ bootstrapping hay function approximation, nên A, B, D sai.

</details>

---

## 11.9 Reducing Variance

**Câu 41.** Tại sao kiểm soát variance đặc biệt quan trọng trong off-policy methods dựa trên importance sampling?

- A. Vì importance sampling làm target bị chệch (biased) một cách hệ thống.
- B. Vì importance sampling làm tăng số chiều của parameter vector $w$.
- C. Vì importance sampling chỉ định nghĩa được cho on-policy nên off-policy phải xấp xỉ.
- D. Vì IS thường gồm tích các policy ratio; ratio kỳ vọng bằng 1 nhưng giá trị thực có thể rất cao hoặc bằng 0, nhân vào step size gây các bước rất lớn làm SGD không đáng tin.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Importance sampling thường gồm tích các policy ratio. Các ratio kỳ vọng bằng 1 (tích của các ratio không tương quan cũng vậy) nhưng giá trị thực có thể rất cao hoặc bằng 0, nên variance rất lớn. Vì chúng nhân vào step size trong SGD, variance cao nghĩa là thỉnh thoảng có bước rất lớn — đẩy parameter tới vùng gradient rất khác, làm SGD không đáng tin. Đặt $\alpha$ đủ nhỏ để tránh lại làm học rất chậm. A sai (IS không chệch).

</details>

---

**Câu 42.** Phương án nào sau đây được nêu để giảm variance trong off-policy learning?

- A. Tăng discount rate $\gamma$ lên gần 1 để làm mượt các ratio.
- B. Loại bỏ function approximation và chỉ dùng tabular methods.
- C. Cố định behavior policy bằng đúng target policy để biến bài toán thành on-policy.
- D. Weighted importance sampling, momentum/Polyak-Ruppert averaging, Tree Backup (không cần IS), và định nghĩa target policy theo behavior policy ("recognizers") để ratio không quá lớn.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Sách nêu nhiều ý tưởng: weighted importance sampling (variance thấp hơn ordinary IS, dù khó áp dụng với function approximation); momentum và Polyak-Ruppert averaging; adaptive step size; Tree Backup và các mở rộng off-policy không cần IS; và để target policy được xác định một phần bởi behavior policy ("recognizers") để không tạo ratio quá lớn. A, B, C không phải các kỹ thuật giảm variance được nêu.

</details>

---

## 11.10 Summary

**Câu 43.** Theo phần Summary, ba hướng tiếp cận để xử lý deadly triad và kết luận về chúng là gì?

- A. Cả ba hướng đều thất bại hoàn toàn nên off-policy với approximation là vô vọng.
- B. Cả ba hướng đều có độ phức tạp $O(d^2)$ nên không scale được.
- C. (1) SGD trong $\overline{BE}$ — không hấp dẫn và bất khả thi vì gradient không learnable; (2) Gradient-TD — SGD trong $\overline{PBE}$, learnable $O(d)$ nhưng cần parameter và step size thứ hai; (3) Emphatic-TD — reweight update để khôi phục ổn định kiểu on-policy.
- D. Chỉ có Monte Carlo (bỏ bootstrapping) mới là lối thoát duy nhất.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — (1) Phổ biến nhất là true SGD trong Bellman error (Bellman residual), nhưng phân tích kết luận đây không phải mục tiêu hấp dẫn và bất khả thi vì gradient của $\overline{BE}$ không learnable từ experience chỉ tiết lộ feature vector. (2) Gradient-TD thực hiện SGD trong $\overline{PBE}$ — gradient learnable với $O(d)$, trả giá bằng parameter vector và step size thứ hai. (3) Emphatic-TD reweight update để khôi phục các tính chất giúp on-policy ổn định. A, B, D đều sai.

</details>

---

**Câu 44.** Theo Summary, đâu là kết luận về tình trạng chung của off-policy learning với function approximation?

- A. Đã được giải quyết hoàn toàn và có một phương pháp tốt nhất rõ ràng cho mọi trường hợp.
- B. Off-policy learning là không cần thiết nên không đáng nghiên cứu thêm.
- C. Semi-gradient methods đã được chứng minh là lựa chọn tốt nhất trong thực tế.
- D. Là lĩnh vực tương đối mới và chưa ổn định; chưa rõ phương pháp nào tốt nhất hay đủ tốt; high variance có lẽ vẫn luôn là thách thức.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Toàn bộ lĩnh vực off-policy learning còn tương đối mới và chưa ổn định (unsettled). Chưa rõ phương pháp nào tốt nhất hay thậm chí đủ tốt; các câu hỏi về độ cần thiết của các phương pháp mới và việc kết hợp với giảm variance vẫn để ngỏ. High variance có lẽ sẽ luôn là một thách thức cho off-policy learning. A, B, C đều mâu thuẫn với kết luận này.

</details>

---

**Câu 45.** [Khó] Trong số bốn objective $\overline{VE}$, $\overline{BE}$, $\overline{PBE}$, $\overline{TDE}$, hãy chọn phát biểu kết hợp ĐÚNG về tính learnable và việc dùng làm mục tiêu học.

- A. Cả bốn đều learnable; chọn objective nào cũng cho cùng một nghiệm tối ưu.
- B. $\overline{VE}$ không learnable nhưng có $w^*$ learnable (nhờ RE); $\overline{BE}$ không learnable và cả $w^*$ cũng không; $\overline{PBE}$ và $\overline{TDE}$ learnable — Gradient-TD chọn $\overline{PBE}$.
- C. $\overline{BE}$ là objective duy nhất learnable nên mọi phương pháp ổn định đều nhắm vào nó.
- D. $\overline{TDE}$ cho nghiệm tốt nhất trong mọi trường hợp nên naive residual-gradient là lựa chọn ưu tiên.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Tổng hợp chương: $\overline{VE}$ không learnable nhưng parameter tối ưu của nó learnable (vì RE = $\overline{VE}$ + variance, cùng $w^*$, và RE learnable). $\overline{BE}$ tệ hơn: bản thân nó và cả parameter cực tiểu đều không learnable từ data. $\overline{PBE}$ và $\overline{TDE}$ thì learnable. Vì vậy Gradient-TD nhắm vào $\overline{PBE}$ (cho TD fixed point), không phải $\overline{BE}$. C, D sai về cả learnability lẫn chất lượng nghiệm.

</details>
