# Chương 6: Temporal-Difference Learning — Câu hỏi trắc nghiệm

> Bộ câu hỏi ôn tập chi tiết cho Chương 6, sách *Reinforcement Learning: An Introduction* (Sutton & Barto, 2nd ed.)

## 6.1 TD Prediction

**Câu 1.** TD learning được mô tả là sự kết hợp của những ý tưởng nào?

- A. Của DP (cho bootstrapping) và policy gradient methods (cho sampling từ experience).
- B. Của Monte Carlo methods (học từ raw experience, không cần model) và dynamic programming (bootstrapping từ ước lượng đã có).
- C. Của bandit algorithms (cân bằng explore–exploit) và Monte Carlo methods (chờ return cuối episode).
- D. Của linear programming (tối ưu hóa value) và DP (lặp trên toàn bộ state space).

<details>
<summary>Đáp án</summary>

**Đáp án: B** — TD learning là sự kết hợp giữa các ý tưởng của Monte Carlo và của dynamic programming. Giống MC, TD học trực tiếp từ raw experience mà không cần model của environment; giống DP, TD cập nhật ước lượng dựa một phần vào các ước lượng đã học khác (bootstrapping) mà không cần chờ kết quả cuối cùng. Các phương án khác trộn lẫn TD với những family không phải nguồn gốc của nó (policy gradient, bandit, linear programming).

</details>

---

**Câu 2.** Phương pháp constant-α MC every-visit cập nhật $V(S_t)$ theo công thức $V(S_t) \leftarrow V(S_t) + \alpha[G_t - V(S_t)]$. Điểm khác biệt cốt lõi giữa MC và TD nằm ở đâu?

- A. MC chỉ áp dụng cho continuing tasks còn TD chỉ áp dụng cho episodic tasks, do cách hai bên định nghĩa target.
- B. MC dùng step-size $\alpha$ cố định còn TD dùng step-size giảm dần theo điều kiện stochastic approximation.
- C. MC dùng $G_t$ (return thực, chỉ biết khi hết episode) làm target, còn TD dùng $R_{t+1} + \gamma V(S_{t+1})$ làm target và chỉ chờ một time step.
- D. MC cần biết phân phối next-state của model còn TD ước lượng phân phối đó từ dữ liệu.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — MC phải chờ đến cuối episode vì chỉ khi đó $G_t$ mới biết được; target của MC là $G_t$. TD chỉ cần chờ đến time step kế tiếp: ngay khi chuyển sang $S_{t+1}$ và nhận $R_{t+1}$, nó lập tức tạo target $R_{t+1} + \gamma V(S_{t+1})$. Cả MC và TD đều là model-free và đều áp dụng được cho episodic tasks; cả hai đều dùng step-size $\alpha$ — nên các phương án còn lại sai.

</details>

---

**Câu 3.** Công thức cập nhật của TD(0) (one-step TD) là gì?

- A. $V(S_t) \leftarrow V(S_t) + \alpha[G_t - V(S_t)]$
- B. $V(S_t) \leftarrow V(S_t) + \alpha[R_{t+1} + \gamma V(S_{t+1}) - V(S_t)]$
- C. $V(S_t) \leftarrow V(S_t) + \alpha[R_{t+1} + \gamma \max_a V(S_{t+1}) - V(S_t)]$
- D. $V(S_t) \leftarrow R_{t+1} + \gamma V(S_{t+1}) - \alpha V(S_t)$

<details>
<summary>Đáp án</summary>

**Đáp án: B** — TD(0) cập nhật ngay khi chuyển sang $S_{t+1}$ và nhận $R_{t+1}$: $V(S_t) \leftarrow V(S_t) + \alpha[R_{t+1} + \gamma V(S_{t+1}) - V(S_t)]$ (công thức 6.2). Phương án A là constant-α MC; phương án có $\max$ không phải dạng prediction TD(0) (đó là dạng control); phương án D không phải dạng incremental cập nhật về một target.

</details>

---

**Câu 4.** Vì sao TD(0) được gọi là một bootstrapping method?

- A. Vì nó khởi tạo value bằng cách lấy mẫu lặp lại từ dữ liệu cho tới khi ổn định.
- B. Vì nó chỉ chạy được sau khi episode kết thúc, dùng return thực để khởi động.
- C. Vì nó cần biết toàn bộ phân phối các successor states để tính expected value.
- D. Vì nó dựa một phần vào một ước lượng đang có sẵn ($V(S_{t+1})$) để cập nhật, giống như DP.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — TD(0) đặt một phần cập nhật của nó dựa trên một ước lượng đang tồn tại ($V(S_{t+1})$), nên nó là một bootstrapping method, giống DP. Nó "học một guess từ một guess". TD không cần episode kết thúc (đó là MC) và không cần toàn bộ phân phối successor (đó là expected update của DP).

</details>

---

**Câu 5.** TD error $\delta_t$ được định nghĩa như thế nào?

- A. $\delta_t = G_t - V(S_t)$
- B. $\delta_t = R_{t+1} + \gamma V(S_t) - V(S_{t+1})$
- C. $\delta_t = R_{t+1} + \gamma V(S_{t+1}) - V(S_t)$
- D. $\delta_t = \gamma V(S_{t+1}) - V(S_t)$

<details>
<summary>Đáp án</summary>

**Đáp án: C** — TD error là $\delta_t = R_{t+1} + \gamma V(S_{t+1}) - V(S_t)$ (công thức 6.5), tức phần trong dấu ngoặc của cập nhật TD(0): chênh lệch giữa ước lượng cũ $V(S_t)$ và ước lượng tốt hơn $R_{t+1} + \gamma V(S_{t+1})$. Phương án A là Monte Carlo error; phương án B hoán đổi sai vị trí $S_t$/$S_{t+1}$; phương án D bỏ mất reward $R_{t+1}$.

</details>

---

**Câu 6.** Một đặc điểm quan trọng về tính khả dụng (availability) của TD error $\delta_t$ là gì?

- A. $\delta_t$ là sai số trong $V(S_t)$ nhưng chỉ có sẵn ở thời điểm $t+1$, vì nó phụ thuộc vào next state và next reward.
- B. $\delta_t$ là sai số trong $V(S_t)$ và luôn có sẵn ngay tại thời điểm $t$ trước khi hành động.
- C. $\delta_t$ là sai số trong $V(S_{t+1})$ và chỉ tính được sau khi episode kết thúc.
- D. $\delta_t$ là sai số trong $V(S_t)$ và độc lập hoàn toàn với reward $R_{t+1}$.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — TD error tại mỗi thời điểm là sai số trong ước lượng được tạo ra tại thời điểm đó. Vì $\delta_t$ phụ thuộc vào next state $S_{t+1}$ và next reward $R_{t+1}$ nên nó thực ra chưa có sẵn cho tới một time step sau: $\delta_t$ là sai số trong $V(S_t)$, có sẵn tại thời điểm $t+1$. Nó là sai số của $V(S_t)$ (không phải $V(S_{t+1})$) và rõ ràng phụ thuộc vào reward.

</details>

---

**Câu 7.** Tại sao TD target được gọi là "một ước lượng" vì cả hai lý do, khác với MC target và DP target?

- A. Vì TD target không dùng reward nên buộc phải ước lượng phần đó.
- B. Vì TD target vừa lấy mẫu (sample) giá trị kỳ vọng như trong (6.4), vừa dùng ước lượng hiện tại $V$ thay cho $v_\pi$ thực.
- C. Vì TD target cần một model đầy đủ của environment để tính kỳ vọng và để khởi tạo.
- D. Vì TD target chỉ dùng được khi episode rất dài và khi step-size đủ nhỏ.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — MC target là ước lượng vì dùng sample return thay cho expected return thực. DP target là ước lượng vì dùng $V(S_{t+1})$ thay cho $v_\pi(S_{t+1})$ chưa biết (nhưng các expected value được model cung cấp). TD target là ước lượng vì CẢ HAI lý do: nó lấy mẫu các expected value trong (6.4) VÀ dùng ước lượng hiện tại $V$ thay cho $v_\pi$ thực. Do đó TD kết hợp sampling của MC với bootstrapping của DP.

</details>

---

**Câu 8.** TD và Monte Carlo updates được gọi là "sample updates", khác với "expected updates" của DP ở điểm nào?

- A. Sample updates dùng toàn bộ phân phối successor, còn expected updates của DP chỉ dùng một mẫu duy nhất.
- B. Sample updates không cần reward dọc đường, còn expected updates của DP thì cần.
- C. Sample updates chỉ áp dụng cho continuing tasks, còn expected updates dùng cho episodic tasks.
- D. Sample updates dựa trên một successor được lấy mẫu duy nhất, còn expected updates của DP dựa trên toàn bộ phân phối tất cả successor có thể.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Sample updates (của TD và MC) nhìn về phía trước một sample successor state (hoặc state–action pair), dùng giá trị của successor đó và reward dọc đường để tính giá trị backed-up. Chúng khác với expected updates của DP ở chỗ chỉ dựa trên một sample successor duy nhất chứ không dựa trên toàn bộ phân phối tất cả successor có thể. Phương án A đảo ngược định nghĩa.

</details>

---

**Câu 9.** Trong ví dụ "Driving Home", quan điểm cốt lõi mà ví dụ này minh họa về TD là gì?

- A. TD cho phép học ngay lập tức bằng cách dịch mỗi ước lượng về phía ước lượng theo ngay sau nó, không cần chờ kết quả cuối cùng.
- B. TD bắt buộc phải chờ đến khi về tới nhà mới gom đủ thông tin để cập nhật được.
- C. TD cần biết trước thời gian thực tế của cả hành trình để dự đoán chính xác.
- D. MC luôn cập nhật nhanh hơn TD vì nó dùng toàn bộ return thực của chuyến đi.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Ví dụ Driving Home cho thấy: theo cách MC, bạn phải chờ về đến nhà mới biết return thực để điều chỉnh. Theo cách TD, bạn học ngay lập tức — mỗi ước lượng được dịch về phía ước lượng theo ngay sau nó (ví dụ chuyển ước lượng ban đầu khi gặp kẹt xe), không cần chờ outcome cuối cùng. Phương án B mô tả chính cách MC làm.

</details>

---

**Câu 10.** [Khó] Trong ví dụ "Driving Home", giả sử ban đầu bạn dự đoán tổng thời gian về nhà là 30 phút. Vừa ra khỏi văn phòng thì trời mưa và bạn nhận ra giao thông sẽ tệ, nên ước lượng tổng thời gian (từ điểm xuất phát) tăng lên 40 phút. Theo tinh thần TD (với $\gamma=1$, reward là thời gian đã trôi qua mỗi chặng), cập nhật cho ước lượng của state "rời văn phòng" sẽ đẩy nó về hướng nào, và vì sao không cần chờ về nhà?

- A. Đẩy về phía 30 phút (giữ nguyên dự đoán ban đầu), vì TD luôn tin vào ước lượng cũ cho tới khi có return thực.
- B. Đẩy về phía 40 phút, vì target TD = reward đã trôi qua + ước lượng mới của state kế tiếp, và ước lượng mới này đã phản ánh thông tin mưa ngay khi quan sát được.
- C. Không cập nhật gì cho tới khi về đến nhà, vì chỉ khi đó mới có TD error hợp lệ.
- D. Đẩy về phía một giá trị thấp hơn 30 phút, vì TD error trở nên âm khi điều kiện đường xấu đi.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Đây là cốt lõi của TD: ngay khi sang state kế tiếp và quan sát thông tin mới (mưa → ước lượng thời gian còn lại tăng), TD target $= R_{t+1} + \gamma V(S_{t+1})$ đã lớn hơn ước lượng cũ, tạo TD error dương đẩy ước lượng của state "rời văn phòng" lên phía 40 phút. Không cần chờ về nhà vì ước lượng của state kế tiếp đóng vai trò "đại diện" cho phần return còn lại. Phương án A mô tả MC (phải chờ return thực).

</details>

---

## 6.2 Advantages of TD Prediction Methods

**Câu 11.** Lợi thế rõ ràng nhất của TD methods so với DP methods là gì?

- A. TD luôn hội tụ nhanh hơn DP nhờ chỉ cập nhật một state mỗi bước.
- B. TD không cần một model của environment (phân phối reward và next-state).
- C. TD không cần step-size trong khi DP buộc phải dùng step-size.
- D. TD đảm bảo tìm được optimal policy ngay cả khi không thăm hết các state.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Lợi thế hiển nhiên của TD so với DP là chúng không cần một model của environment, tức không cần các phân phối xác suất về reward và next-state. Tốc độ hội tụ nhanh hơn không được đảm bảo về lý thuyết, và DP cũng không nhất thiết dùng step-size theo nghĩa của TD.

</details>

---

**Câu 12.** Lợi thế của TD methods so với Monte Carlo methods là gì?

- A. TD chỉ học được khi episode đã kết thúc, nên ổn định hơn MC.
- B. TD không thể áp dụng cho continuing tasks, nên phạm vi hẹp hơn nhưng chính xác hơn.
- C. TD được hiện thực tự nhiên theo kiểu online, fully incremental — chỉ cần chờ một time step thay vì chờ hết episode.
- D. TD phải bỏ qua mọi episode có hành động thử nghiệm, giúp ước lượng sạch hơn MC.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — TD được hiện thực tự nhiên theo kiểu online, fully incremental. Với MC ta phải chờ đến hết episode (chỉ khi đó return mới biết), còn TD chỉ cần chờ một time step. Điều này quan trọng với các episode dài, các continuing task không có episode, và khi MC phải bỏ qua/discount các episode có hành động thử nghiệm. Phương án A, B, D mô tả ngược các đặc tính của TD.

</details>

---

**Câu 13.** Về tính đúng đắn (soundness) của TD(0), điều nào sau đây là chính xác?

- A. Với mọi fixed policy $\pi$, TD(0) hội tụ tới $v_\pi$: in the mean nếu step-size hằng đủ nhỏ, và với xác suất 1 nếu step-size giảm theo điều kiện stochastic approximation.
- B. TD(0) không có bảo đảm hội tụ nào trừ khi kết hợp với MC.
- C. TD(0) chỉ hội tụ nếu environment là deterministic và policy là greedy.
- D. TD(0) chỉ hội tụ tới certainty-equivalence estimate khi dùng batch updating.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Với mọi fixed policy $\pi$, TD(0) đã được chứng minh hội tụ tới $v_\pi$: in the mean nếu step-size hằng đủ nhỏ, và với xác suất 1 nếu step-size giảm theo các điều kiện stochastic approximation thông thường (2.7). Hầu hết chứng minh áp dụng cho trường hợp tabular, một số cho general linear function approximation. Hội tụ không yêu cầu environment deterministic, và batch updating là một bối cảnh riêng (mục 6.3).

</details>

---

**Câu 14.** Trong ví dụ Random Walk (Example 6.2), kết luận thực nghiệm về tốc độ hội tụ của TD(0) so với constant-α MC là gì?

- A. MC luôn hội tụ nhanh hơn TD và điều này đã được chứng minh toán học.
- B. Cả hai luôn hội tụ cùng tốc độ trên mọi stochastic task.
- C. TD không bao giờ hội tụ tới đúng giá trị trong khi MC thì có.
- D. Trên thực tế TD thường hội tụ nhanh hơn constant-α MC trên các stochastic task, dù chưa ai chứng minh điều này về mặt toán học.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Việc method nào hội tụ nhanh hơn vẫn là một câu hỏi mở (chưa ai chứng minh toán học). Tuy nhiên trên thực tế, TD methods thường được thấy hội tụ nhanh hơn constant-α MC trên các stochastic task, như minh họa trong Example 6.2 (Random Walk), nơi TD luôn tốt hơn MC.

</details>

---

**Câu 15.** [Khó] Trong Random Walk Example, người ta quan sát rằng với constant-α MC, đường RMS error đôi khi đi xuống rồi quay lên (tăng trở lại) khi số episode tăng, đặc biệt với $\alpha$ lớn. Cách giải thích phù hợp nhất cho hiện tượng này là gì?

- A. MC là biased estimator nên error tất yếu tăng vô hạn theo số episode.
- B. Hiện tượng do bootstrapping của MC khuếch đại sai số ước lượng của các state lân cận.
- C. Với $\alpha$ hằng, các cập nhật không bao giờ tắt dần nên ước lượng dao động quanh đúng giá trị; variance của target MC (toàn bộ return) lớn nên với $\alpha$ lớn, dao động này khiến RMS error có thể tăng trở lại.
- D. Đó là dấu hiệu MC đã hội tụ tới certainty-equivalence estimate sai.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Với constant-α (không giảm về 0), các increment không tắt dần nên ước lượng tiếp tục dao động phản ứng với từng sample return. Vì target của MC là toàn bộ return $G_t$ có variance cao, nên với $\alpha$ lớn, các dao động này đủ mạnh để RMS error có thể đi xuống rồi tăng trở lại thay vì hội tụ trơn tru. MC không bootstrapping (loại B), không biased (loại A), và đây không phải certainty-equivalence (loại D — đó là batch TD).

</details>

---

## 6.3 Optimality of TD(0)

**Câu 16.** "Batch updating" nghĩa là gì?

- A. Cập nhật value function ngay sau mỗi time step, gom các state thành nhóm nhỏ.
- B. Các increment được tính cho mọi time step nhưng value function chỉ thay đổi một lần bằng tổng tất cả increment sau khi xử lý xong toàn bộ batch; lặp lại đến khi hội tụ.
- C. Chỉ cập nhật value function một lần duy nhất qua toàn bộ dữ liệu rồi dừng.
- D. Cập nhật ngẫu nhiên một subset các state được chọn lại mỗi vòng lặp.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Trong batch updating, khi chỉ có lượng experience hữu hạn, ta trình bày experience lặp lại nhiều lần. Các increment được tính cho mọi time step thăm nonterminal state, nhưng value function chỉ thay đổi một lần bằng tổng tất cả increment. Rồi toàn bộ experience được xử lý lại với value function mới, lặp đến khi hội tụ. Phương án A là online (không phải batch), C dừng quá sớm, D mô tả sampling subset.

</details>

---

**Câu 17.** Dưới batch updating, TD(0) và constant-α MC có tính chất hội tụ thế nào?

- A. Cả hai hội tụ tới cùng một đáp án vì cùng tối thiểu hóa squared error.
- B. Chỉ MC hội tụ deterministic, còn TD thì luôn dao động phụ thuộc $\alpha$.
- C. Cả hai hội tụ deterministic (độc lập với $\alpha$ miễn $\alpha$ đủ nhỏ), nhưng tới hai đáp án KHÁC nhau.
- D. Cả hai phụ thuộc mạnh vào $\alpha$ và không bao giờ hội tụ deterministic.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Dưới batch updating, TD(0) hội tụ deterministic tới một đáp án duy nhất độc lập với $\alpha$ (miễn $\alpha$ đủ nhỏ). Constant-α MC cũng hội tụ deterministic dưới cùng điều kiện, nhưng tới một đáp án KHÁC. Việc hiểu hai đáp án này giúp hiểu sự khác biệt giữa hai phương pháp.

</details>

---

**Câu 18.** Trong ví dụ "You are the Predictor" (Example 6.4) với 8 episodes (A,0,B,0 và bảy episode bắt đầu từ B), batch Monte Carlo cho $V(A)$ bằng bao nhiêu và vì sao?

- A. $V(A) = 3/4$, vì A luôn chuyển sang B và $V(B)=3/4$.
- B. $V(A) = 1$, vì trong dữ liệu có các reward +1 đi kèm B.
- C. $V(A) = 1/2$, giữ nguyên giá trị khởi tạo do A hiếm khi được thăm.
- D. $V(A) = 0$, vì A chỉ được thăm một lần với return theo sau là 0 — đây là đáp án tối thiểu hóa squared error trên training data.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Batch MC cho $V(A) = 0$: ta đã thấy A một lần và return theo sau là 0, nên ước lượng tối thiểu hóa squared error (thực ra zero error) trên training data là 0. Batch TD(0) lại cho $V(A) = 3/4$ vì xây model Markov: 100% lần ở A chuyển sang B, và $V(B) = 3/4$. Phương án A chính là đáp án của TD chứ không phải MC.

</details>

---

**Câu 19.** Sự khác biệt tổng quát giữa estimate của batch TD(0) và batch Monte Carlo là gì?

- A. Batch MC tìm estimate tối thiểu hóa mean square error trên training set; batch TD(0) tìm certainty-equivalence estimate (đúng chính xác cho maximum-likelihood Markov model).
- B. Batch TD(0) tối thiểu hóa squared error còn batch MC tìm certainty-equivalence estimate.
- C. Cả hai đều tìm certainty-equivalence estimate nhưng theo hai cách tính khác nhau.
- D. Cả hai đều tối thiểu hóa mean square error trên training set, chỉ khác tốc độ hội tụ.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Batch MC luôn tìm estimate tối thiểu hóa mean square error trên training set. Batch TD(0) luôn tìm estimate đúng chính xác cho maximum-likelihood model của Markov process — đây gọi là certainty-equivalence estimate. Phương án B đảo ngược vai trò hai phương pháp.

</details>

---

**Câu 20.** [Khó] Trong Example 6.4, vì sao có thể nói estimate $V(A)=3/4$ của batch TD(0) "tổng quát hóa tốt hơn" estimate $V(A)=0$ của batch MC, dù MC khớp dữ liệu training hoàn hảo hơn?

- A. Vì MC luôn cho estimate có bias dương trên dữ liệu mới, còn TD thì unbiased.
- B. Vì TD khai thác giả định Markov: A luôn dẫn tới B, nên kỳ vọng future data sẽ giống các transition từ B; estimate của TD đúng cho maximum-likelihood model nên dự đoán dữ liệu tương lai tốt hơn, dù MC có error bằng 0 trên đúng training set.
- C. Vì MC bỏ qua reward dọc đường còn TD thì không, nên TD có nhiều thông tin hơn.
- D. Vì TD dùng step-size nhỏ hơn nên ít overfit dữ liệu training.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Batch MC tối thiểu hóa error trên đúng training set (cho $V(A)=0$ vì lần duy nhất qua A return là 0), tức nó "fit" dữ liệu đã thấy hoàn hảo nhất. Nhưng batch TD(0) cho $V(A)=3/4$ vì nó xây maximum-likelihood Markov model (A → B chắc chắn, $V(B)=3/4$), tức là certainty-equivalence estimate. Trên dữ liệu future giả định quá trình thực sự là Markov, estimate của TD sẽ dự đoán tốt hơn. Đây là lý do sách dùng để giải thích vì sao TD thường tốt hơn trên thực tế.

</details>

---

**Câu 21.** "Certainty-equivalence estimate" được mô tả thế nào, và vì sao TD vẫn có lợi thế dù khó tính trực tiếp?

- A. Là estimate tối thiểu hóa squared error trên dữ liệu, tính rất rẻ với bộ nhớ cỡ $n$.
- B. Là estimate không liên quan tới model của Markov process, chỉ dựa vào return quan sát được.
- C. Là estimate chỉ áp dụng cho continuing tasks và đòi hỏi $n^3$ bộ nhớ.
- D. Là estimate đúng nếu maximum-likelihood model là đúng chính xác; tính trực tiếp tốn cỡ $n^2$ bộ nhớ và $n^3$ tính toán, nhưng TD xấp xỉ được nó chỉ với bộ nhớ cỡ $n$.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Certainty-equivalence estimate là estimate đúng chính xác nếu model là đúng (coi như biết chắc model thay vì xấp xỉ). Tính trực tiếp tốn cỡ $n^2$ bộ nhớ để tạo maximum-likelihood model và cỡ $n^3$ tính toán. Đáng chú ý là TD xấp xỉ được cùng nghiệm này chỉ với bộ nhớ cỡ $n$ và tính lặp trên training set — trên các state space lớn, TD có thể là cách khả thi duy nhất. Phương án A nhầm sang batch MC.

</details>

---

## 6.4 Sarsa: On-policy TD Control

**Câu 22.** Để chuyển TD prediction sang bài toán control on-policy, bước đầu tiên là gì?

- A. Bỏ hoàn toàn ý tưởng generalized policy iteration (GPI) và học trực tiếp policy.
- B. Học một action-value function $q_\pi(s,a)$ thay vì state-value function, ước lượng $q_\pi$ cho behavior policy $\pi$ hiện tại.
- C. Chỉ học state-value function $v_\pi$ rồi greedy hóa qua model.
- D. Yêu cầu một model đầy đủ của environment để chọn action greedy.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Bước đầu tiên cho control là học một action-value function thay vì state-value function. Với on-policy method, ta phải ước lượng $q_\pi(s,a)$ cho behavior policy $\pi$ hiện tại, với mọi state $s$ và action $a$, dùng đúng phương pháp TD như đã dùng cho $v_\pi$. GPI vẫn được giữ (loại A), và TD control là model-free (loại C, D).

</details>

---

**Câu 23.** Công thức cập nhật của Sarsa là gì, và tên "Sarsa" bắt nguồn từ đâu?

- A. $Q(S_t, A_t) \leftarrow Q(S_t, A_t) + \alpha[R_{t+1} + \gamma \max_a Q(S_{t+1}, a) - Q(S_t, A_t)]$; tên từ "state-action".
- B. $Q(S_t, A_t) \leftarrow R_{t+1} + \gamma Q(S_{t+1}, A_{t+1})$; tên từ "sample-average".
- C. $Q(S_t, A_t) \leftarrow Q(S_t, A_t) + \alpha[R_{t+1} + \gamma Q(S_{t+1}, A_{t+1}) - Q(S_t, A_t)]$; tên từ bộ năm $(S_t, A_t, R_{t+1}, S_{t+1}, A_{t+1})$.
- D. $Q(S_t, A_t) \leftarrow Q(S_t, A_t) + \alpha[G_t - Q(S_t, A_t)]$; tên từ một nhà nghiên cứu.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Sarsa cập nhật $Q(S_t, A_t) \leftarrow Q(S_t, A_t) + \alpha[R_{t+1} + \gamma Q(S_{t+1}, A_{t+1}) - Q(S_t, A_t)]$ (công thức 6.7). Nó dùng mọi phần tử của bộ năm $(S_t, A_t, R_{t+1}, S_{t+1}, A_{t+1})$, từ đó sinh ra tên "Sarsa". Phương án A là Q-learning.

</details>

---

**Câu 24.** Điều kiện hội tụ của Sarsa tới một optimal policy là gì?

- A. Sarsa hội tụ với xác suất 1 tới optimal policy và action-value function nếu mọi state–action pairs được thăm vô hạn lần và policy hội tụ tới greedy ở giới hạn (ví dụ $\varepsilon$-greedy với $\varepsilon=1/t$).
- B. Sarsa không bao giờ hội tụ tới optimal policy vì nó là on-policy.
- C. Sarsa chỉ hội tụ nếu policy giữ nguyên fully random mãi mãi để đảm bảo exploration.
- D. Sarsa hội tụ chỉ khi environment là deterministic và reward bị chặn.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Tính hội tụ của Sarsa phụ thuộc vào cách policy phụ thuộc vào $Q$ (ví dụ $\varepsilon$-greedy hoặc $\varepsilon$-soft). Sarsa hội tụ với xác suất 1 tới optimal policy và action-value function, dưới các điều kiện thông thường về step-size, miễn là tất cả state–action pairs được thăm vô hạn lần và policy hội tụ tới greedy ở giới hạn (chẳng hạn $\varepsilon$-greedy với $\varepsilon=1/t$). Policy phải dần trở thành greedy, không thể fully random mãi (loại C).

</details>

---

**Câu 25.** Trong ví dụ Windy Gridworld, vì sao Monte Carlo methods không dễ áp dụng nhưng Sarsa thì được?

- A. Vì Windy Gridworld không có goal state nên MC không có return để học.
- B. Vì MC không cần step-size còn Sarsa thì cần để dò gió.
- C. Vì reward trong Windy Gridworld luôn dương khiến MC bị overestimate.
- D. Vì termination không được đảm bảo cho mọi policy; nếu policy khiến agent đứng yên thì episode không bao giờ kết thúc — Sarsa học ngay trong episode rằng policy đó tệ và chuyển sang cái khác.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — MC khó dùng vì termination không đảm bảo cho mọi policy. Nếu từng tìm thấy một policy khiến agent ở yên một state, episode kế tiếp sẽ không bao giờ kết thúc, và MC phải chờ hết episode mới cập nhật. Các online learning method như Sarsa không gặp vấn đề này vì chúng nhanh chóng học ngay trong episode rằng các policy đó tệ và chuyển sang cái khác.

</details>

---

**Câu 26.** [Khó] Xét một transition trong một episodic task, trong đó $S_{t+1}$ là terminal state. Theo cách hiện thực đúng của Sarsa, giá trị $Q(S_{t+1}, A_{t+1})$ trong target nên được xử lý thế nào?

- A. Dùng $\max_a Q(S_{t+1}, a)$ của terminal state để có target chặt hơn.
- B. Định nghĩa $Q(S_{t+1}, A_{t+1}) = 0$, nên target rút gọn thành $R_{t+1}$.
- C. Bỏ qua hoàn toàn cập nhật này vì không có $A_{t+1}$ hợp lệ tại terminal.
- D. Dùng giá trị khởi tạo của $Q(S_{t+1}, \cdot)$ để giữ tính nhất quán bootstrapping.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Theo quy ước chuẩn trong sách, action-value của một terminal state được định nghĩa bằng 0. Khi $S_{t+1}$ là terminal, $Q(S_{t+1}, A_{t+1}) = 0$, nên cập nhật Sarsa trở thành $Q(S_t,A_t) \leftarrow Q(S_t,A_t) + \alpha[R_{t+1} - Q(S_t,A_t)]$. Không được bỏ qua transition này (loại C) vì nó mang reward kết thúc episode, và không dùng $\max$ (đó là Q-learning).

</details>

---

## 6.5 Q-learning: Off-policy TD Control

**Câu 27.** Công thức cập nhật của Q-learning (Watkins, 1989) là gì?

- A. $Q(S_t, A_t) \leftarrow Q(S_t, A_t) + \alpha[R_{t+1} + \gamma Q(S_{t+1}, A_{t+1}) - Q(S_t, A_t)]$
- B. $Q(S_t, A_t) \leftarrow Q(S_t, A_t) + \alpha[R_{t+1} + \gamma \max_a Q(S_{t+1}, a) - Q(S_t, A_t)]$
- C. $Q(S_t, A_t) \leftarrow Q(S_t, A_t) + \alpha[R_{t+1} + \gamma \sum_a \pi(a|S_{t+1})Q(S_{t+1}, a) - Q(S_t, A_t)]$
- D. $Q(S_t, A_t) \leftarrow R_{t+1} + \gamma \max_a Q(S_{t+1}, a)$

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Q-learning cập nhật $Q(S_t, A_t) \leftarrow Q(S_t, A_t) + \alpha[R_{t+1} + \gamma \max_a Q(S_{t+1}, a) - Q(S_t, A_t)]$ (công thức 6.8). Phương án A là Sarsa, phương án C là Expected Sarsa, phương án D thiếu dạng incremental về target.

</details>

---

**Câu 28.** Vì sao Q-learning được coi là một off-policy method?

- A. Vì Q-learning luôn dùng đúng policy đang được học để chọn action ở mọi bước.
- B. Vì Q-learning không bao giờ cập nhật $Q$ theo behavior policy.
- C. Vì Q-learning chỉ học khi có sẵn một model của environment.
- D. Vì action-value function $Q$ học được trực tiếp xấp xỉ $q_*$, độc lập với policy đang theo; policy chỉ quyết định những state–action pair nào được thăm.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Trong Q-learning, $Q$ học được trực tiếp xấp xỉ $q_*$, optimal action-value function, độc lập với policy đang theo. Điều này đơn giản hóa phân tích thuật toán. Policy vẫn có ảnh hưởng ở chỗ nó quyết định những state–action pair nào được thăm và cập nhật; tất cả những gì cần cho hội tụ là mọi pair tiếp tục được cập nhật.

</details>

---

**Câu 29.** Trong ví dụ Cliff Walking, sự khác biệt giữa Sarsa (on-policy) và Q-learning (off-policy) thể hiện thế nào?

- A. Sarsa học optimal policy đi sát mép vực, còn Q-learning đi đường an toàn xa mép vực.
- B. Cả hai học cùng một policy giống hệt nhau nên online performance như nhau.
- C. Q-learning có online performance tốt hơn Sarsa vì nó luôn đi đường an toàn.
- D. Q-learning học values cho optimal policy (đi sát mép vực) nhưng thỉnh thoảng rơi xuống vực do $\varepsilon$-greedy nên online performance kém hơn; Sarsa tính đến việc chọn action nên học đường dài hơn nhưng an toàn hơn.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Q-learning học values cho optimal policy đi sát mép vực, nhưng do $\varepsilon$-greedy nó thỉnh thoảng rơi xuống vực (reward -100), khiến online performance kém hơn. Sarsa tính đến việc lựa chọn action vào quá trình học nên chọn đường dài hơn nhưng an toàn hơn (đi xa mép vực). Nếu $\varepsilon$ giảm dần, cả hai sẽ tiệm cận tới optimal policy. Phương án A đảo ngược vai trò hai thuật toán.

</details>

---

**Câu 30.** [Khó] Trong một MDP deterministic, giả sử behavior policy là $\varepsilon$-greedy với $\varepsilon$ giữ cố định ở mức dương trong suốt quá trình học. So sánh value function mà Sarsa và Q-learning hội tụ tới (tabular, các điều kiện step-size thỏa mãn) là gì?

- A. Cả hai cùng hội tụ tới $q_*$, vì cùng dùng cập nhật TD trên action-value.
- B. Q-learning hội tụ tới $q_*$ (giá trị của optimal greedy policy), còn Sarsa hội tụ tới $q_\pi$ của chính $\varepsilon$-greedy policy — tức value của một policy vẫn còn explore, nói chung khác và "thận trọng" hơn.
- C. Sarsa hội tụ tới $q_*$ còn Q-learning hội tụ tới giá trị của $\varepsilon$-greedy policy.
- D. Không thuật toán nào hội tụ vì $\varepsilon$ không giảm về 0.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Q-learning là off-policy: target dùng $\max_a Q$, nên $Q$ hội tụ tới $q_*$ bất kể behavior vẫn explore (miễn mọi pair được thăm vô hạn lần). Sarsa là on-policy: target dùng action $A_{t+1}$ thực sự được behavior policy chọn, nên nó hội tụ tới $q_\pi$ của chính $\varepsilon$-greedy policy đó — value này phản ánh chi phí của các bước explore (ví dụ rủi ro rơi vực trong Cliff Walking), nên "thận trọng" hơn. Đây chính là cốt lõi khác biệt on-policy vs off-policy.

</details>

---

## 6.6 Expected Sarsa

**Câu 31.** Công thức cập nhật của Expected Sarsa là gì?

- A. $Q(S_t, A_t) \leftarrow Q(S_t, A_t) + \alpha[R_{t+1} + \gamma \sum_a \pi(a|S_{t+1}) Q(S_{t+1}, a) - Q(S_t, A_t)]$
- B. $Q(S_t, A_t) \leftarrow Q(S_t, A_t) + \alpha[R_{t+1} + \gamma \max_a Q(S_{t+1}, a) - Q(S_t, A_t)]$
- C. $Q(S_t, A_t) \leftarrow Q(S_t, A_t) + \alpha[R_{t+1} + \gamma Q(S_{t+1}, A_{t+1}) - Q(S_t, A_t)]$
- D. $Q(S_t, A_t) \leftarrow Q(S_t, A_t) + \alpha[G_t - Q(S_t, A_t)]$

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Expected Sarsa giống Q-learning nhưng thay vì lấy maximum trên các next state–action pair, nó dùng expected value, có tính đến xác suất mỗi action dưới policy hiện tại: target $= R_{t+1} + \gamma \mathbb{E}_\pi[Q(S_{t+1}, A_{t+1}) \mid S_{t+1}] = R_{t+1} + \gamma \sum_a \pi(a|S_{t+1}) Q(S_{t+1}, a)$ (công thức 6.9). Phương án B là Q-learning, C là Sarsa.

</details>

---

**Câu 32.** Lợi thế chính của Expected Sarsa so với Sarsa là gì, và cái giá phải trả?

- A. Nó luôn rẻ hơn Sarsa về mặt tính toán nhờ tránh chọn ngẫu nhiên action.
- B. Nó loại bỏ variance do chọn ngẫu nhiên $A_{t+1}$, nên nói chung tốt hơn Sarsa một chút với cùng lượng experience; cái giá là chi phí tính toán cao hơn.
- C. Nó không loại bỏ được variance nào và luôn tệ hơn Sarsa trên mọi task.
- D. Nó cần một model của environment trong khi Sarsa thì không.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Expected Sarsa phức tạp hơn Sarsa về mặt tính toán (phải tính kỳ vọng trên mọi action), nhưng đổi lại nó loại bỏ variance do việc chọn ngẫu nhiên $A_{t+1}$. Với cùng lượng experience, ta kỳ vọng nó tốt hơn Sarsa một chút, và thực tế nó thường tốt hơn. Trong cliff walking, vì transition đều deterministic và mọi ngẫu nhiên đến từ policy, Expected Sarsa có thể đặt $\alpha=1$ mà không suy giảm asymptotic performance, còn Sarsa thì không.

</details>

---

**Câu 33.** Mối quan hệ giữa Expected Sarsa và Q-learning là gì?

- A. Expected Sarsa và Q-learning hoàn toàn không liên quan đến nhau về mặt target.
- B. Q-learning là một trường hợp đặc biệt của Sarsa chứ không phải của Expected Sarsa.
- C. Expected Sarsa luôn là on-policy và không thể trở thành Q-learning trong bất kỳ trường hợp nào.
- D. Expected Sarsa có thể off-policy; nếu target policy $\pi$ là greedy còn behavior thiên khám phá, thì Expected Sarsa chính xác là Q-learning — nên nó bao trùm và tổng quát hóa Q-learning.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Expected Sarsa nói chung có thể dùng policy khác target policy $\pi$ để sinh behavior, trở thành off-policy. Nếu $\pi$ là greedy policy thì $\sum_a \pi(a|S_{t+1})Q(S_{t+1},a)$ rút gọn về $\max_a Q(S_{t+1},a)$ — đúng bằng Q-learning. Theo nghĩa đó, Expected Sarsa bao trùm và tổng quát hóa Q-learning, đồng thời cải thiện đáng tin cậy so với Sarsa.

</details>

---

## 6.7 Maximization Bias and Double Learning

**Câu 34.** Maximization bias phát sinh như thế nào?

- A. Vì TD error luôn âm khi dùng phép maximization trên action.
- B. Khi step-size $\alpha$ quá nhỏ khiến ước lượng không kịp cập nhật.
- C. Khi dùng maximum của các estimated value làm ước lượng cho maximum của true value: nếu nhiều action có true value bằng 0 nhưng estimate phân tán quanh 0, thì $\max$ của estimate dương trong khi $\max$ của true value bằng 0 — tạo positive bias.
- D. Khi không bao giờ dùng phép maximization mà lấy trung bình các action.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Các control algorithm như Q-learning (target là greedy với $\max$) và Sarsa ($\varepsilon$-greedy) đều dùng maximum trên các estimated value một cách ngầm định như ước lượng cho maximum value. Xét một state với nhiều action có true value đều bằng 0 nhưng estimate phân tán trên/dưới 0: $\max$ của true value là 0, nhưng $\max$ của estimate lại dương — đây là positive bias, gọi là maximization bias.

</details>

---

**Câu 35.** Trong Example 6.7 (Maximization Bias Example) với state A và B, vì sao Q-learning ban đầu thiên về chọn action `left` mặc dù đó là một sai lầm?

- A. Vì action `left` thực sự là optimal trong MDP này nên Q-learning chọn đúng.
- B. Vì reward của action `right` luôn là số âm lớn nên `left` trông tốt hơn.
- C. Vì Q-learning không bao giờ dùng phép maximization nên chọn ngẫu nhiên thiên về `left`.
- D. Vì `left` dẫn tới B (reward mean -0.1, nên expected return của left là -0.1, luôn là mistake), nhưng maximization bias làm B trông như có value dương.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Action `right` chuyển ngay sang terminal với return 0. Action `left` chuyển sang B, từ đó nhiều action đều kết thúc với reward lấy từ phân phối chuẩn mean -0.1, variance 1.0. Vậy expected return khi bắt đầu bằng left là -0.1, nên left luôn là mistake. Tuy nhiên do maximization bias làm B trông có value dương, Q-learning với $\varepsilon$-greedy ban đầu mạnh mẽ thiên về left, và ngay cả ở asymptote vẫn chọn left nhiều hơn ~5% so với mức tối ưu.

</details>

---

**Câu 36.** Ý tưởng cốt lõi của double learning để tránh maximization bias là gì?

- A. Học một ước lượng duy nhất nhưng nhân đôi step-size để hội tụ nhanh hơn.
- B. Dùng cùng một tập mẫu để vừa xác định maximizing action vừa ước lượng giá trị của nó.
- C. Bỏ hoàn toàn phép maximization và thay bằng trung bình mọi action.
- D. Học hai ước lượng độc lập $Q_1, Q_2$; dùng $Q_1$ để xác định $A^* = \arg\max_a Q_1(a)$ và dùng $Q_2$ để cho ước lượng không thiên lệch $Q_2(A^*)$ với $\mathbb{E}[Q_2(A^*)] = q(A^*)$.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Vấn đề là dùng cùng một tập mẫu để vừa xác định maximizing action vừa ước lượng giá trị của nó (chính là phương án B mô tả — nguồn gốc của bias). Double learning chia mẫu thành hai tập, học hai ước lượng độc lập $Q_1, Q_2$. Dùng $Q_1$ để xác định $A^* = \arg\max_a Q_1(a)$, và dùng $Q_2$ để cho ước lượng $Q_2(A^*)$ không thiên lệch: $\mathbb{E}[Q_2(A^*)] = q(A^*)$. Double learning nhân đôi bộ nhớ nhưng không tăng tính toán mỗi step.

</details>

---

**Câu 37.** Công thức cập nhật của Double Q-learning (khi đồng xu ra "heads") là gì?

- A. $Q_1(S_t, A_t) \leftarrow Q_1(S_t, A_t) + \alpha[R_{t+1} + \gamma Q_2(S_{t+1}, \arg\max_a Q_1(S_{t+1}, a)) - Q_1(S_t, A_t)]$
- B. $Q_1(S_t, A_t) \leftarrow Q_1(S_t, A_t) + \alpha[R_{t+1} + \gamma \max_a Q_1(S_{t+1}, a) - Q_1(S_t, A_t)]$
- C. $Q_1(S_t, A_t) \leftarrow Q_1(S_t, A_t) + \alpha[R_{t+1} + \gamma Q_1(S_{t+1}, \arg\max_a Q_1(S_{t+1}, a)) - Q_2(S_t, A_t)]$
- D. $Q_1(S_t, A_t) \leftarrow Q_2(S_t, A_t) + \alpha[R_{t+1} - Q_1(S_t, A_t)]$

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Double Q-learning chia time step làm hai (ví dụ tung đồng xu mỗi step). Nếu ra heads, cập nhật: $Q_1(S_t, A_t) \leftarrow Q_1(S_t, A_t) + \alpha[R_{t+1} + \gamma Q_2(S_{t+1}, \arg\max_a Q_1(S_{t+1}, a)) - Q_1(S_t, A_t)]$ (công thức 6.10) — dùng $Q_1$ để chọn maximizing action nhưng dùng $Q_2$ để ước lượng giá trị. Nếu ra tails thì hoán đổi vai trò $Q_1$ và $Q_2$. Phương án B là Q-learning thường (dùng cùng $Q_1$ cho cả hai vai trò).

</details>

---

**Câu 38.** [Khó] Trong Double Q-learning, vì sao việc dùng $Q_1$ để chọn $A^* = \arg\max_a Q_1(S_{t+1},a)$ nhưng dùng $Q_2(S_{t+1}, A^*)$ để ước lượng giá trị lại loại bỏ được positive maximization bias?

- A. Vì $Q_2$ luôn nhỏ hơn $Q_1$ nên hiệu chỉnh xuống bù trừ bias.
- B. Vì $Q_1$ và $Q_2$ học từ các tập mẫu độc lập, nên action được $Q_1$ chọn không tương quan với noise trong $Q_2$ tại action đó; do đó $\mathbb{E}[Q_2(A^*)]$ là ước lượng unbiased của $q(A^*)$ thay vì ước lượng quá cao do trùng noise.
- C. Vì việc lấy $\arg\max$ trên $Q_1$ làm trơn noise của $Q_2$.
- D. Vì dùng hai ước lượng làm step-size hiệu dụng giảm đi một nửa, triệt tiêu bias.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Bias đến từ việc dùng cùng dữ liệu để vừa chọn action có estimate cao nhất vừa đọc giá trị của chính action đó — action được chọn thường là action có noise dương lớn, nên giá trị đọc ra bị thổi phồng. Khi tách: $Q_1$ (từ tập mẫu này) chọn $A^*$, còn giá trị lấy từ $Q_2$ (tập mẫu độc lập). Vì noise trong $Q_2(A^*)$ độc lập với việc $A^*$ được chọn, kỳ vọng $\mathbb{E}[Q_2(A^*)] = q(A^*)$ — không còn thổi phồng. Không phải vì $Q_2$ luôn nhỏ hơn (loại A) hay vì step-size (loại D).

</details>

---

## 6.8 Games, Afterstates, and Other Special Cases

**Câu 39.** "Afterstate value function" là gì, khác với conventional state-value function ở điểm nào?

- A. Afterstate value function đánh giá state TRƯỚC khi agent đi, còn state-value function đánh giá sau khi đi.
- B. Afterstate value function chính là action-value function $q(s,a)$ thông thường viết dưới dạng khác.
- C. Afterstate value function chỉ áp dụng cho continuing tasks không có episode rõ ràng.
- D. Afterstate value function đánh giá board position SAU KHI agent đã thực hiện nước đi của mình, trong khi conventional state-value function đánh giá các state mà agent có quyền chọn action.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Trong ví dụ tic-tac-toe (Chương 1), hàm học được không phải action-value function cũng không phải conventional state-value function. Conventional state-value function đánh giá các state mà agent có quyền chọn action, còn hàm trong tic-tac-toe đánh giá board position SAU KHI agent đã đi — đó gọi là afterstates, và value function trên chúng là afterstate value functions.

</details>

---

**Câu 40.** Vì sao afterstate value function lại hiệu quả hơn conventional action-value function trong các game như cờ?

- A. Vì nhiều position–move pair khác nhau lại tạo ra cùng một "afterposition" giống nhau (nên phải có cùng value); afterstate function đánh giá tất cả chúng như nhau ngay lập tức, còn action-value function phải đánh giá riêng từng pair.
- B. Vì afterstate function cần biết toàn bộ dynamics phản ứng của opponent.
- C. Vì afterstate function không cần biết hiệu ứng tức thời của nước đi của mình.
- D. Vì afterstate function chỉ dùng được cho off-policy methods nên hội tụ nhanh hơn.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Afterstates hữu ích khi ta biết phần đầu của dynamics (ví dụ trong game ta biết hiệu ứng tức thời của nước đi nhưng không biết đối thủ sẽ trả lời ra sao). Nhiều position–move pair khác nhau có thể tạo ra cùng một afterposition và do đó phải có cùng value. Conventional action-value function phải đánh giá riêng từng pair, còn afterstate value function đánh giá tất cả chúng như nhau ngay lập tức — việc học về pair này lập tức chuyển sang pair kia, hiệu quả hơn. Afterstates cũng xuất hiện trong các task như queuing.

</details>

---

**Câu 41.** [Khó] Một kỹ sư áp dụng afterstate value function cho bài toán quản lý hàng đợi (queuing): server quyết định phục vụ job nào kế tiếp, và hiệu ứng tức thời của hành động (job rời hàng đợi) là biết được, còn job mới tới là ngẫu nhiên. Lợi ích chính của việc dùng afterstates ở đây là gì?

- A. Loại bỏ nhu cầu ước lượng phân phối job mới tới, vì afterstate đã bao gồm thông tin đó.
- B. Biến bài toán thành deterministic hoàn toàn, nên không cần học bằng TD nữa.
- C. Các cặp (trạng thái hàng đợi, hành động phục vụ) khác nhau dẫn tới cùng một trạng thái sau-phục-vụ sẽ chia sẻ value, nên agent học chung một lần thay vì học lặp lại cho từng cặp — tăng hiệu quả sử dụng dữ liệu.
- D. Cho phép bỏ qua reward để chỉ học cấu trúc hàng đợi.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Giống như trong game, lợi ích của afterstates trong queuing là nhiều cặp (state, action) khác nhau có thể dẫn tới cùng một afterstate (trạng thái hàng đợi ngay sau khi hành động được áp dụng, trước khi job mới tới ngẫu nhiên). Vì afterstate giống nhau buộc có value giống nhau, agent học chung và chuyển kiến thức giữa các cặp, dùng dữ liệu hiệu quả hơn action-value function thông thường. Afterstates không loại bỏ tính ngẫu nhiên của job mới (loại A, B) cũng không bỏ reward (loại D).

</details>

---

## 6.9 Summary

**Câu 42.** Theo phần Summary, cách phân loại các TD control methods theo on-policy và off-policy là gì?

- A. Sarsa là off-policy, Q-learning là on-policy, Expected Sarsa là on-policy.
- B. Sarsa là on-policy method, Q-learning là off-policy method, và Expected Sarsa (như trình bày ở đây) cũng là off-policy method.
- C. Cả ba (Sarsa, Q-learning, Expected Sarsa) đều là on-policy methods.
- D. Cả ba đều là off-policy methods do đều cập nhật action-value.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Theo Summary: việc phân loại TD control methods dựa trên cách chúng xử lý vấn đề duy trì exploration đủ — bằng on-policy hay off-policy. Sarsa là on-policy method, Q-learning là off-policy method, và Expected Sarsa cũng là off-policy method (như được trình bày ở đây). Còn có cách thứ ba để mở rộng TD sang control gọi là actor–critic methods (Chương 13).

</details>

---

**Câu 43.** Các method trong Chương 6 nên được gọi chính xác là gì, và điều gì là "essence" chung của chúng?

- A. Chúng là multi-step, function-approximation, model-based methods, dùng chung mô hình môi trường.
- B. Chúng đều yêu cầu một model đầy đủ của environment để thực hiện expected updates.
- C. Chúng chỉ chạy được offline sau khi đã thu thập đủ toàn bộ dữ liệu của task.
- D. Chúng là one-step, tabular, model-free TD methods; essence chung là xử lý experience online với ít tính toán và được dẫn dắt bởi TD errors.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Các method trong chương này nên được gọi chính xác là one-step, tabular, model-free TD methods. Chúng là những RL method được dùng rộng rãi nhất hiện nay nhờ sự đơn giản: áp dụng online, với lượng tính toán tối thiểu, biểu diễn gần như hoàn toàn bằng các phương trình đơn lẻ. Các chương sau mở rộng chúng sang n-step forms, model-based forms, và function approximation, nhưng tất cả vẫn giữ essence: xử lý experience online, ít tính toán, và được dẫn dắt bởi TD errors.

</details>
