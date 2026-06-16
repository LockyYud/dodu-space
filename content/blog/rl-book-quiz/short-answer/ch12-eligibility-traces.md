# Chương 12: Eligibility Traces — Câu hỏi trả lời ngắn

> Bộ câu hỏi trả lời ngắn (short-answer) ôn tập Chương 12, sách *Reinforcement Learning: An Introduction* (Sutton & Barto, 2nd ed.). Đáp án tham khảo dùng cho việc LLM chấm điểm.

## 12.1 The λ-return

**Câu 1.** Viết công thức định nghĩa lambda-return $G_t^\lambda$ theo dạng trung bình có trọng số của các n-step return. Giải thích trọng số gán cho mỗi n-step return và điều gì xảy ra khi $\lambda = 0$ và $\lambda = 1$.

<details>
<summary>Đáp án tham khảo</summary>

lambda-return là một compound update: trung bình của tất cả các n-step return, mỗi cái có trọng số tỉ lệ với $\lambda^{n-1}$ và chuẩn hóa bởi $(1-\lambda)$:
$$G_t^\lambda = (1-\lambda)\sum_{n=1}^{\infty}\lambda^{n-1}G_{t:t+n}.$$
Trọng số fade đi một hệ số $\lambda$ mỗi bước: one-step return được trọng số lớn nhất $(1-\lambda)$, two-step là $(1-\lambda)\lambda$, v.v. Khi $\lambda = 0$, $G_t^\lambda = G_{t:t+1}$ (one-step return, tức TD(0)); khi $\lambda = 1$, tổng chính triệt tiêu và $G_t^\lambda = G_t$ (conventional return, tức Monte Carlo).

</details>

**Câu 2.** Off-line lambda-return algorithm cập nhật trọng số như thế nào, và "forward view" của một thuật toán học nghĩa là gì?

<details>
<summary>Đáp án tham khảo</summary>

Off-line lambda-return algorithm không thay đổi trọng số trong tập (episode); đến cuối tập nó thực hiện một loạt cập nhật semi-gradient dùng lambda-return làm target:
$$w_{t+1} = w_t + \alpha\big[G_t^\lambda - \hat{v}(S_t,w_t)\big]\nabla\hat{v}(S_t,w_t).$$
Đây là forward view (góc nhìn lý thuyết/tiến): với mỗi state được thăm, ta nhìn về phía trước (forward) tới các reward và state tương lai để quyết định cách cập nhật. Forward view luôn phức tạp để cài đặt vì update phụ thuộc vào những gì chưa có sẵn tại thời điểm $t$.

</details>

## 12.2 TD(λ)

**Câu 3.** Viết công thức cập nhật eligibility trace $z_t$ (accumulating trace) và quy tắc cập nhật trọng số của semi-gradient TD(λ). Eligibility trace đóng vai trò gì?

<details>
<summary>Đáp án tham khảo</summary>

Eligibility trace $z_t \in \mathbb{R}^d$ khởi tạo $z_{-1}=0$ và cập nhật:
$$z_t = \gamma\lambda z_{t-1} + \nabla\hat{v}(S_t,w_t),$$
với TD error $\delta_t = R_{t+1} + \gamma\hat{v}(S_{t+1},w_t) - \hat{v}(S_t,w_t)$, và:
$$w_{t+1} = w_t + \alpha\,\delta_t\,z_t.$$
Trace là bộ nhớ ngắn hạn theo dõi những thành phần nào của weight vector đã đóng góp (dương hay âm) vào các định giá state gần đây; "gần đây" xác định bởi $\gamma\lambda$. Nó đánh dấu mức "eligible" của mỗi thành phần để được học khi một TD error (reinforcing event) xảy ra. Trong linear FA, $\nabla\hat{v}(S_t,w_t)$ chính là feature vector $x_t$.

</details>

**Câu 4.** Giải thích "backward view" của TD(λ) và tại sao TD(λ) với $\lambda=0$ rút về TD(0) còn $\lambda=1$ cho hành vi giống Monte Carlo.

<details>
<summary>Đáp án tham khảo</summary>

Backward view (góc nhìn cơ học/lùi): tại mỗi thời điểm ta nhìn TD error hiện tại và gán nó ngược về (backward) cho các state trước đó tỉ lệ với eligibility trace của chúng — "hét" TD error trở lại các state đã thăm. Khi $\lambda=0$, $z_t$ bằng đúng value gradient của $S_t$, nên cập nhật rút về one-step semi-gradient TD update — đó là lý do gọi là TD(0). Khi $\lambda=1$, credit cho các state trước chỉ giảm theo $\gamma$ mỗi bước, đúng bằng mức discount cần thiết để đạt hành vi Monte Carlo; nếu $\gamma=1, \lambda=1$ thì trace không suy giảm và phương pháp ứng xử như Monte Carlo cho bài toán episodic không discount. TD(1) còn cho phép cài Monte Carlo theo kiểu incremental, online và cho cả bài toán continuing.

</details>

**Câu 5.** TD(λ) cải thiện off-line lambda-return algorithm ở ba điểm nào? Nêu cận sai số tiệm cận của linear TD(λ) trong on-policy.

<details>
<summary>Đáp án tham khảo</summary>

Ba cải thiện: (1) cập nhật weight vector ở mỗi bước thay vì chỉ cuối tập (ước lượng tốt sớm hơn); (2) tính toán phân bố đều theo thời gian thay vì dồn về cuối tập; (3) áp dụng được cho bài toán continuing chứ không chỉ episodic. Linear TD(λ) được chứng minh hội tụ trong on-policy nếu step-size giảm dần theo điều kiện thông thường; hội tụ không phải tới weight có sai số nhỏ nhất mà tới một weight gần đó phụ thuộc $\lambda$, với cận:
$$\overline{VE}(w_\infty) \le \frac{1-\gamma\lambda}{1-\gamma}\min_w \overline{VE}(w).$$
Khi $\lambda\to 1$ cận tiến tới sai số nhỏ nhất; cận lỏng nhất tại $\lambda=0$.

</details>

## 12.3 n-step Truncated λ-return Methods

**Câu 6.** Vì sao cần truncated lambda-return? Viết định nghĩa $G_{t:h}^\lambda$ và cho biết horizon $h$ đóng vai trò gì.

<details>
<summary>Đáp án tham khảo</summary>

lambda-return đầy đủ không biết được cho tới cuối tập (và với continuing thì không bao giờ biết, vì phụ thuộc reward xa vô hạn). Do sự phụ thuộc yếu dần theo $\gamma\lambda$ mỗi bước, ta cắt (truncate) chuỗi sau một horizon $h$:
$$G_{t:h}^\lambda = (1-\lambda)\sum_{n=1}^{h-t-1}\lambda^{n-1}G_{t:t+n} + \lambda^{h-t-1}G_{t:h},\quad 0\le t < h \le T.$$
Horizon $h$ đóng vai trò giống thời điểm kết thúc $T$ trong lambda-return: trọng số dư trước đây dành cho $G_t$ nay dành cho n-step return dài nhất khả dụng $G_{t:h}$. Họ thuật toán dùng nó (state-value) gọi là Truncated TD(λ) hay TTD(λ); update bị trễ $n$ bước nhưng dùng tất cả k-step return với $1\le k\le n$.

</details>

## 12.4 Online λ-return Algorithm

**Câu 7.** Online lambda-return algorithm hoạt động theo ý tưởng nào, và tại sao nó vừa tốt hơn vừa tốn kém hơn off-line lambda-return algorithm?

<details>
<summary>Đáp án tham khảo</summary>

Ý tưởng: mỗi bước khi có thêm dữ liệu, quay lại làm lại (redo) toàn bộ các update từ đầu tập với horizon mới (dài hơn), luôn nhắm tới truncated lambda-return $G_{t:h}^\lambda$ dùng horizon mới nhất, bắt đầu lại từ $w_0$. Công thức tổng quát:
$$w_{t+1}^h = w_t^h + \alpha\big[G_{t:h}^\lambda - \hat{v}(S_t,w_t^h)\big]\nabla\hat{v}(S_t,w_t^h),\quad 0\le t < h \le T,$$
và $w_t \doteq w_t^t$. Nó fully online: cho ra weight mới mỗi bước chỉ dùng thông tin tới thời điểm $t$, nên hiệu năng tốt hơn (bootstrap dùng weight đã qua nhiều update có thông tin hơn). Nhược điểm: tốn kém hơn cả off-line, vì mỗi bước phải quét lại toàn bộ phần tập đã trải qua.

</details>

## 12.5 True Online TD(λ)

**Câu 8.** True online TD(λ) là gì và quan hệ của nó với online lambda-return algorithm? Viết công thức cập nhật của nó cho trường hợp linear.

<details>
<summary>Đáp án tham khảo</summary>

True online TD(λ) là cài đặt backward-view chính xác, hiệu quả của online lambda-return algorithm cho trường hợp linear function approximation; nó được chứng minh tạo ra đúng cùng dãy weight $w_t$ như online lambda-return algorithm (van Seijen et al., 2016). Các weight cần thiết chỉ là các vector trên đường chéo $w_t^t$ của "tam giác" weight. Với $\hat{v}(s,w)=w^\top x(s)$:
$$w_{t+1} = w_t + \alpha\delta_t z_t + \alpha\big(w_t^\top x_t - w_{t-1}^\top x_t\big)(z_t - x_t),$$
$$z_t = \gamma\lambda z_{t-1} + \big(1 - \alpha\gamma\lambda z_{t-1}^\top x_t\big)x_t.$$
Bộ nhớ giống TD(λ) thường, tính toán mỗi bước tăng ~50% (một inner product nữa), tổng độ phức tạp vẫn $O(d)$.

</details>

## 12.6 Dutch Traces in MC Learning

**Câu 9.** Phân biệt accumulating trace, replacing trace và dutch trace. Tại sao chương này nói dutch trace lại xuất hiện cả trong Monte Carlo learning?

<details>
<summary>Đáp án tham khảo</summary>

Accumulating trace (12.5): $z_t=\gamma\lambda z_{t-1}+\nabla\hat{v}$, dùng trong TD(λ) thông thường. Dutch trace (12.11) dùng trong true online TD(λ): $z_t=\gamma\lambda z_{t-1}+(1-\alpha\gamma\lambda z_{t-1}^\top x_t)x_t$. Replacing trace (12.12) chỉ định nghĩa cho tabular hoặc feature nhị phân: đặt $z_{i,t}=1$ nếu $x_{i,t}=1$, còn lại $z_{i,t}=\gamma\lambda z_{i,t-1}$; nay xem replacing trace là xấp xỉ thô của dutch trace. Mục 12.6 chỉ ra linear MC (LMS) như một forward view có thể biến đổi thành backward view tương đương, rẻ hơn ($O(d)$/bước) dùng dutch trace — chứng tỏ eligibility trace (và dutch trace) không gắn riêng với TD; chúng nảy sinh bất cứ khi nào ta muốn học các dự đoán dài hạn một cách hiệu quả.

</details>

## 12.7 Sarsa(λ)

**Câu 10.** Sarsa(λ) khác TD(λ) ở những điểm nào (TD error và eligibility trace)? Ví dụ gridworld cho thấy lợi thế gì của eligibility trace so với one-step và n-step?

<details>
<summary>Đáp án tham khảo</summary>

Sarsa(λ) học action value $\hat{q}(s,a,w)$, dùng cùng quy tắc $w_{t+1}=w_t+\alpha\delta_t z_t$ nhưng với action-value TD error
$$\delta_t = R_{t+1} + \gamma\hat{q}(S_{t+1},A_{t+1},w_t) - \hat{q}(S_t,A_t,w_t),$$
và trace dựa trên gradient action value: $z_t=\gamma\lambda z_{t-1}+\nabla\hat{q}(S_t,A_t,w_t)$, $z_{-1}=0$. Trong gridworld: khi đạt goal, one-step Sarsa chỉ tăng action value cuối; n-step Sarsa tăng đều $n$ action values cuối; còn eligibility trace cập nhật tất cả action values từ đầu tập với mức độ khác nhau, fade dần theo độ gần (recency). Chiến lược fade này thường là tốt nhất, giúp học hiệu quả hơn rõ rệt (ví dụ Mountain Car).

</details>

## 12.8 Variable λ and γ

**Câu 11.** Việc tổng quát hóa $\gamma$ và $\lambda$ thành hàm $\gamma_t=\gamma(S_t)$ và $\lambda_t=\lambda(S_t,A_t)$ mang lại ý nghĩa gì? Vai trò đặc biệt của termination function $\gamma$ là gì?

<details>
<summary>Đáp án tham khảo</summary>

Cho phép mức bootstrapping và discounting biến thiên theo state/action. Termination function $\gamma$ đặc biệt quan trọng vì nó thay đổi chính return — biến ngẫu nhiên ta muốn ước lượng kỳ vọng:
$$G_t = R_{t+1} + \gamma_{t+1}G_{t+1} = \sum_{k=t}^{\infty}\Big(\prod_{i=t+1}^{k}\gamma_i\Big)R_{k+1}.$$
Nó cho phép trình bày cả episodic lẫn continuing trong một luồng kinh nghiệm duy nhất: một terminal state cũ thành state có $\gamma(s)=0$ rồi chuyển về phân phối khởi đầu. State-based lambda-return viết đệ quy:
$$G_t^{s} = R_{t+1} + \gamma_{t+1}\big[(1-\lambda_{t+1})\hat{v}(S_{t+1},w_t) + \lambda_{t+1}G_{t+1}^{s}\big].$$
Khác với discounting (đổi bài toán), tổng quát hóa $\lambda$ là đổi chiến lược lời giải chứ không đổi bài toán.

</details>

## 12.9 Off-policy Traces with Control Variates

**Câu 12.** Viết công thức general accumulating trace cho state value trong trường hợp off-policy (với control variates). Trong on-policy thì nó rút về gì, và hạn chế về độ ổn định là gì?

<details>
<summary>Đáp án tham khảo</summary>

Dùng per-decision importance sampling với control variates, eligibility trace cho state value là:
$$z_t = \rho_t\big(\gamma_t\lambda_t z_{t-1} + \nabla\hat{v}(S_t,w_t)\big),$$
với $\rho_t=\pi(A_t|S_t)/b(A_t|S_t)$, kết hợp quy tắc semi-gradient $w_{t+1}=w_t+\alpha\delta_t^{s}z_t$. Trong on-policy $\rho_t=1$ nên rút về accumulating trace TD(λ) thông thường (mở rộng cho $\gamma,\lambda$ biến thiên). Trong off-policy thuật toán thường chạy tốt nhưng là semi-gradient nên không đảm bảo ổn định. Phiên bản action-value (Expected Sarsa form) cho trace $z_t=\gamma_t\lambda_t\rho_t z_{t-1}+\nabla\hat{q}(S_t,A_t,w_t)$ — một Expected Sarsa(λ) gọn và hiệu quả, on-policy thì trùng Sarsa(λ).

</details>

## 12.10 Watkins's Q(λ) to Tree-Backup(λ)

**Câu 13.** Watkins's Q(λ) xử lý eligibility trace ra sao? Tree-Backup(λ) khác gì và vì sao được xem là "true successor" của Q-learning?

<details>
<summary>Đáp án tham khảo</summary>

Watkins's Q(λ): suy giảm trace như thường khi action được chọn là greedy, nhưng cắt (cut) trace về 0 ngay sau action non-greedy đầu tiên — chuỗi component update kết thúc khi hết tập hoặc gặp action non-greedy đầu tiên (tùy cái nào tới trước). Tree-Backup(λ), TB(λ), là phiên bản eligibility trace của Tree Backup: nó không dùng importance sampling mà vẫn áp dụng được cho off-policy data, nên là "true successor" thực sự của Q-learning. Trace của nó dùng xác suất target policy của action được chọn:
$$z_t = \gamma_t\lambda_t\pi(A_t|S_t)z_{t-1} + \nabla\hat{q}(S_t,A_t,w_t),$$
kết hợp quy tắc $w_{t+1}=w_t+\alpha\delta_t z_t$. Như mọi semi-gradient, TB(λ) không đảm bảo ổn định với off-policy và function approximator mạnh.

</details>

## 12.11 Stable Off-policy Methods with Traces

**Câu 14.** Kể tên bốn phương pháp off-policy có eligibility trace đảm bảo ổn định nêu trong mục này, và chúng dựa trên hai nhóm ý tưởng nào? Nêu một đặc điểm hấp dẫn của HTD(λ).

<details>
<summary>Đáp án tham khảo</summary>

Bốn phương pháp: GTD(λ) (state value, dạng eligibility-trace của TDC), GQ(λ) (action value, có thể dùng làm control nếu target policy thiên về greedy), HTD(λ) (hybrid state value), và Emphatic TD(λ). Tất cả dựa trên một trong hai ý tưởng: Gradient-TD (Mục 11.7) hoặc Emphatic-TD (Mục 11.8), và đều giả định linear function approximation. Đặc điểm hấp dẫn của HTD(λ): nó là tổng quát hóa nghiêm ngặt của TD(λ) sang off-policy — nếu behavior policy trùng target policy thì HTD(λ) trở thành đúng TD(λ) (điều GTD(λ) không có), nhờ có bộ trace thứ hai $\bar{z}_t$ cho behavior policy; HTD(λ) cũng chỉ cần một step size khi rút về TD(λ).

</details>

## 12.12 Implementation Issues & 12.13 Conclusions

**Câu 15.** Vì sao eligibility trace không quá đắt trên máy tính tuần tự thông thường (tabular)? Theo kết luận chương, nên đặt $\lambda$ ở đâu và khi nào nên/không nên dùng eligibility trace?

<details>
<summary>Đáp án tham khảo</summary>

Trên máy tuần tự, với $\gamma,\lambda$ thông thường, trace của hầu hết state gần như luôn xấp xỉ 0; chỉ vài state vừa được thăm mới có trace đáng kể, nên chỉ cần theo dõi và cập nhật vài trace đó — chi phí thường chỉ vài lần phương pháp one-step (với ANN+backprop, chỉ khoảng gấp đôi bộ nhớ/tính toán). Kết luận: nên đặt $\lambda$ ở giá trị trung gian (đưa về phía Monte Carlo nhưng không hoàn toàn), vì $\lambda$ quá cao thành Monte Carlo thuần thì hiệu năng tụt mạnh. Nên dùng eligibility trace khi reward bị trễ nhiều bước, dữ liệu khan hiếm/không xử lý lại được (ứng dụng online), hoặc bài toán phần nào non-Markov; không nên dùng khi dữ liệu rẻ và mục tiêu chỉ là xử lý càng nhiều dữ liệu càng nhanh (lúc đó one-step được ưu tiên).

</details>
