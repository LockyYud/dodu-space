# Chương 7: n-step Bootstrapping — Câu hỏi trắc nghiệm

> Bộ câu hỏi ôn tập chi tiết cho Chương 7, sách *Reinforcement Learning: An Introduction* (Sutton & Barto, 2nd ed.)

## 7.1 n-step TD Prediction

**Câu 1.** Mục tiêu chính của các phương pháp n-step trong Chương 7 là gì?

- A. Loại bỏ bootstrapping khỏi học tăng cường và chỉ dùng full Monte Carlo returns.
- B. Hợp nhất (unify) Monte Carlo và one-step TD thành một spectrum cho phép chuyển mượt giữa hai phương pháp.
- C. Tăng tốc độ hội tụ của one-step TD bằng cách giảm step-size $\alpha$ theo từng episode.
- D. Thay thế cả MC lẫn TD bằng một class thuật toán mới không liên hệ với hai phương pháp đó.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Chương 7 hợp nhất MC và one-step TD; các phương pháp n-step TD generalize cả hai, tạo thành một spectrum với MC ở một đầu và one-step TD ở đầu kia, phương pháp tốt nhất thường nằm ở khoảng giữa (intermediate). C nhầm vai trò của $n$ với step-size; A và D mô tả sai mối quan hệ với MC/TD.

</details>

---

**Câu 2.** Công thức n-step return được định nghĩa như thế nào (công thức 7.1)?

- A. $G_{t:t+n} = R_{t+1} + \gamma V_t(S_{t+1})$, tức one-step return bootstrap ngay sau bước đầu.
- B. $G_{t:t+n} = \gamma^n V_{t+n-1}(S_{t+n})$, tức chỉ giữ số hạng bootstrapping đã discount.
- C. $G_{t:t+n} = R_{t+1} + \gamma R_{t+2} + \cdots + \gamma^{n-1} R_{t+n} + \gamma^n V_{t+n-1}(S_{t+n})$.
- D. $G_{t:t+n} = R_{t+1} + R_{t+2} + \cdots + R_{T}$, tổng reward không discount tới khi kết thúc.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — n-step return cộng dồn $n$ phần thưởng thực tế đã discount ($R_{t+1}$ tới $\gamma^{n-1} R_{t+n}$) rồi cộng số hạng bootstrapping $\gamma^n V_{t+n-1}(S_{t+n})$ để bù các số hạng còn thiếu. A là one-step return, D là full return (MC) nhưng còn thiếu discount, B chỉ là phần đuôi bootstrapping.

</details>

---

**Câu 3.** n-step return interpolate giữa TD(0) và Monte Carlo như thế nào?

- A. Khi $n=1$ ta được Monte Carlo; khi $n \to \infty$ ta được one-step TD(0).
- B. Khi $n=1$ ta được one-step TD(0); khi $n$ vươn tới hoặc vượt kết thúc episode, n-step return bằng full return (MC).
- C. Mọi giá trị $n$ đều cho ra kết quả bằng one-step TD(0) vì bootstrapping luôn dùng cùng một $V$.
- D. $n$ chỉ điều khiển step-size $\alpha$ chứ không định vị phương pháp trên spectrum MC–TD.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Với $n=1$, $G_{t:t+1}$ chính là one-step return của TD(0). Nếu $t+n \geq T$ thì mọi số hạng thiếu lấy bằng 0 và n-step return bằng full return $G_t$ (cập nhật MC). A đảo ngược hai cực; C, D hiểu sai vai trò của $n$.

</details>

---

**Câu 4.** Quy tắc cập nhật n-step TD là $V_{t+n}(S_t) = V_{t+n-1}(S_t) + \alpha[G_{t:t+n} - V_{t+n-1}(S_t)]$ (công thức 7.2). Đặc điểm quan trọng về thời điểm cập nhật là gì?

- A. Cập nhật cho $S_t$ được thực hiện ngay tại thời điểm $t$ vì $G_{t:t+n}$ luôn có sẵn.
- B. Chỉ trạng thái cuối cùng của mỗi episode được cập nhật, các trạng thái khác bị bỏ qua.
- C. Mọi trạng thái đều được cập nhật đồng thời tại mỗi bước, không có độ trễ nào.
- D. Không có cập nhật trong $n-1$ bước đầu mỗi episode; các cập nhật bổ sung được thực hiện ở cuối episode.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — n-step return cần thấy $R_{t+n}$ và tính $V_{t+n-1}$, lần đầu có sẵn là tại $t+n$. Do đó không có cập nhật trong $n-1$ bước đầu mỗi episode; để bù, một số cập nhật tương ứng được thực hiện ở cuối episode (sau termination, trước episode kế). A bỏ qua độ trễ này.

</details>

---

**Câu 5.** "Error reduction property" của n-step return (công thức 7.3) phát biểu điều gì?

- A. Sai số tệ nhất của kỳ vọng n-step return $\leq \gamma^n$ lần sai số tệ nhất dưới $V_{t+n-1}$.
- B. Error của n-step return luôn bằng 0 sau hữu hạn bước cập nhật.
- C. Sai số kỳ vọng tăng tuyến tính theo $n$ nên $n$ lớn luôn xấu hơn.
- D. n-step return là ước lượng không chệch (unbiased) tuyệt đối của $v_\pi$ với mọi $n$.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Error reduction property: $\max_s |\mathbb{E}_\pi[G_{t:t+n}|S_t=s] - v_\pi(s)| \leq \gamma^n \max_s |V_{t+n-1}(s) - v_\pi(s)|$. Nhờ tính chất này chứng minh được mọi n-step TD hội tụ về dự đoán đúng dưới điều kiện kỹ thuật phù hợp. D sai vì chỉ MC ($n$ đủ lớn) mới unbiased.

</details>

---

**Câu 6.** Trong ví dụ random walk (Example 7.1) với 19 trạng thái, kết quả thực nghiệm cho thấy điều gì về giá trị $n$?

- A. $n=1$ (one-step TD) luôn cho RMS error thấp nhất ở mọi step-size.
- B. $n=\infty$ (Monte Carlo) luôn cho RMS error thấp nhất ở mọi step-size.
- C. Các giá trị $n$ trung gian cho kết quả tốt nhất, minh họa generalization n-step vượt cả hai cực.
- D. Giá trị $n$ không ảnh hưởng đáng kể tới error, chỉ có $\alpha$ quan trọng.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Hình 7.2 cho thấy các phương pháp với $n$ trung gian hoạt động tốt nhất, minh họa cách generalization của TD và MC thành n-step có thể vượt trội hơn cả hai phương pháp cực đoan.

</details>

---

**Câu 7.** [Khó] Theo error reduction property, để bảo toàn cùng một mức "đảm bảo co sai số" như $n=2$ với $\gamma = 0.9$, thì với $\gamma = 0.95$ cần chọn $n$ khoảng bao nhiêu (xấp xỉ)?

- A. $n=1$, vì $\gamma$ lớn hơn làm bootstrapping mạnh hơn nên cần ít bước hơn.
- B. $n=2$, vì hệ số co $\gamma^n$ chỉ phụ thuộc $n$ chứ không phụ thuộc $\gamma$.
- C. $n=4$, vì cần khoảng $\gamma^n \approx 0.9^2 = 0.81$ nên $n \approx \ln(0.81)/\ln(0.95) \approx 4.1$.
- D. $n=20$, vì $\gamma$ tăng buộc $n$ tăng tuyến tính theo tỉ lệ tương ứng.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Hệ số co tệ nhất là $\gamma^n$. Với $\gamma=0.9, n=2$ ta có $0.9^2 = 0.81$. Để $0.95^n \le 0.81$ cần $n \ge \ln(0.81)/\ln(0.95) \approx 0.2107/0.0513 \approx 4.1$, tức $n \approx 4$. Khi $\gamma$ gần 1 hơn, discount yếu đi nên phải dùng nhiều bước hơn để đạt cùng mức co sai số. B sai vì bỏ qua phụ thuộc vào $\gamma$.

</details>

---

**Câu 8.** [Khó] Giả sử một episode đi qua $S_t$ với $\gamma=1$, dùng $n=3$. Reward thực tế là $R_{t+1}=2, R_{t+2}=0, R_{t+3}=1$ và ước lượng hiện tại $V(S_{t+3})=4$. Giá trị target $G_{t:t+3}$ dùng để cập nhật $V(S_t)$ là bao nhiêu?

- A. $3$, chỉ tổng các reward thực tế $2+0+1$, không dùng bootstrapping.
- B. $4$, chỉ lấy giá trị bootstrap $V(S_{t+3})$ vì $n=3$ đã đủ xa.
- C. $7$, tổng ba reward cộng bootstrap: $2+0+1+4 = 7$.
- D. $11$, nhân chồng tất cả các số hạng: $2 \times 0 \times 1$ cộng $4$ rồi cộng dồn.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Với $\gamma=1$: $G_{t:t+3} = R_{t+1} + R_{t+2} + R_{t+3} + V(S_{t+3}) = 2 + 0 + 1 + 4 = 7$. A quên số hạng bootstrapping, B quên các reward thực tế. Đây minh họa cách n-step return ghép phần reward đã quan sát với phần bootstrap.

</details>

---

## 7.2 n-step Sarsa

**Câu 9.** n-step Sarsa được xây dựng từ n-step TD bằng cách nào?

- A. Bỏ phần thưởng đi và chỉ dùng giá trị ước lượng action value để bootstrap mọi bước.
- B. Chuyển từ states sang state–action pairs và dùng $\varepsilon$-greedy; n-step return định nghĩa lại theo action values $Q$.
- C. Thay bootstrapping bằng full return mọi lúc, biến nó thành phương pháp Monte Carlo control.
- D. Chỉ dùng cho off-policy learning vì action values bắt buộc behavior policy khác target.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Ý chính là chuyển states thành state–action pairs rồi dùng $\varepsilon$-greedy. n-step return định nghĩa lại theo action values: $G_{t:t+n} = R_{t+1} + \cdots + \gamma^{n-1} R_{t+n} + \gamma^n Q_{t+n-1}(S_{t+n}, A_{t+n})$ (công thức 7.4), tạo phương pháp on-policy TD control. D sai vì n-step Sarsa là on-policy.

</details>

---

**Câu 10.** Theo ví dụ Gridworld (Hình 7.4), so với one-step Sarsa thì n-step Sarsa (ví dụ 10-step) tăng tốc học như thế nào?

- A. n-step Sarsa làm yếu các action dẫn tới reward nên thực ra học chậm hơn one-step.
- B. n-step Sarsa chỉ làm mạnh action đầu tiên của chuỗi, bỏ qua các action sau.
- C. Cả hai làm mạnh cùng số lượng action, khác biệt chỉ ở step-size mỗi cập nhật.
- D. one-step chỉ làm mạnh action cuối dẫn tới reward; n-step làm mạnh $n$ action cuối nên học nhiều hơn từ một episode.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Trong Gridworld, one-step Sarsa chỉ làm mạnh action cuối cùng của chuỗi dẫn tới reward cao, còn n-step Sarsa làm mạnh $n$ action cuối, nhờ đó học được nhiều hơn từ chỉ một episode. A đảo ngược tác dụng, B nhầm đầu/cuối chuỗi.

</details>

---

**Câu 11.** n-step Expected Sarsa khác n-step Sarsa ở điểm nào trong định nghĩa n-step return (công thức 7.7)?

- A. Số hạng cuối là expected approximate value $\bar{V}_{t+n-1}(S_{t+n}) = \sum_a \pi(a|s) Q_{t+n-1}(s,a)$.
- B. Số hạng cuối dùng giá trị mẫu $Q_{t+n-1}(S_{t+n}, A_{t+n})$ của đúng action thực sự đã lấy.
- C. Expected Sarsa loại bỏ hoàn toàn số hạng bootstrapping nên chỉ dùng reward thực tế.
- D. Expected Sarsa không định nghĩa được dưới dạng n-step nên chỉ tồn tại ở one-step.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Backup diagram của n-step Expected Sarsa giống n-step Sarsa ngoại trừ phần tử cuối là nhánh trên tất cả action có thể, trọng số theo $\pi$. n-step return thay $Q_{t+n-1}(S_{t+n}, A_{t+n})$ bằng $\bar{V}_{t+n-1}(S_{t+n}) = \sum_a \pi(a|s)Q(s,a)$. Nếu $s$ terminal thì expected approximate value bằng 0. B đúng cho Sarsa thường, không phải Expected Sarsa.

</details>

---

**Câu 12.** [Khó] Tại sao n-step Expected Sarsa thường có variance thấp hơn n-step Sarsa thường, với cùng $n$?

- A. Vì Expected Sarsa dùng $n+1$ reward thực tế thay vì $n$, làm trung bình bớt nhiễu.
- B. Vì số hạng bootstrap cuối lấy kỳ vọng trên tất cả action thay vì một sample ngẫu nhiên $A_{t+n}$, loại bỏ variance do chọn action cuối.
- C. Vì Expected Sarsa giảm $\gamma$ tự động về 0 ở số hạng cuối nên không còn nhiễu.
- D. Vì Expected Sarsa luôn là off-policy nên dùng importance sampling triệt tiêu mọi variance.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Expected Sarsa thay sample $Q_{t+n-1}(S_{t+n}, A_{t+n})$ bằng kỳ vọng $\bar{V}_{t+n-1}(S_{t+n}) = \sum_a \pi(a|S_{t+n}) Q(S_{t+n}, a)$. Việc tính kỳ vọng "phân tích" thay vì lấy mẫu loại bỏ variance ngẫu nhiên do chọn action cuối, đổi lấy thêm chi phí tính toán. A sai vì cả hai dùng cùng số reward; C, D mô tả sai cơ chế.

</details>

---

## 7.3 n-step Off-policy Learning

**Câu 13.** Trong off-policy learning, ta học value cho policy nào, đi theo policy nào, và xử lý khác biệt ra sao?

- A. Học value cho behavior policy $b$, đi theo target policy $\pi$, không cần hiệu chỉnh gì.
- B. Học và đi theo cùng một policy duy nhất, khác biệt được loại bỏ bằng $\varepsilon$-greedy.
- C. Học value cho target policy $\pi$ trong khi đi theo behavior policy $b$; xử lý khác biệt bằng importance sampling ratio.
- D. Học value cho $\pi$ và đi theo $b$, nhưng bỏ qua khác biệt vì với $n$ lớn nó tự triệt tiêu.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Off-policy là học value cho $\pi$ trong khi đi theo policy khác $b$. Để dùng dữ liệu từ $b$ phải tính tới khác biệt hai policy bằng xác suất tương đối của các action đã lấy. Trong phương pháp n-step, return dựng trên $n$ bước nên ta quan tâm xác suất tương đối của đúng $n$ action đó. A đảo ngược vai trò $\pi$ và $b$.

</details>

---

**Câu 14.** Importance sampling ratio $\rho_{t:h}$ (công thức 7.10) được tính như thế nào?

- A. $\rho_{t:h} = \prod_{k=t}^{\min(h,T-1)} \dfrac{b(A_k|S_k)}{\pi(A_k|S_k)}$, tỉ số behavior trên target.
- B. $\rho_{t:h} = \prod_{k=t}^{\min(h,T-1)} \dfrac{\pi(A_k|S_k)}{b(A_k|S_k)}$, tích các tỉ số target trên behavior.
- C. $\rho_{t:h} = \sum_{k=t}^{\min(h,T-1)} \dfrac{\pi(A_k|S_k)}{b(A_k|S_k)}$, tổng các tỉ số qua các bước.
- D. $\rho_{t:h}$ luôn bằng $n$, số bước trong return, không phụ thuộc action.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Importance sampling ratio là tích các tỉ số $\pi(A_k|S_k)/b(A_k|S_k)$ qua các bước. Nếu một action mà $\pi$ không bao giờ lấy ($\pi=0$) thì return bị cho trọng số 0 và bỏ qua. On-policy ($\pi=b$) thì ratio luôn 1. A đảo tử/mẫu, C dùng tổng thay vì tích.

</details>

---

**Câu 15.** Trong off-policy n-step Sarsa (công thức 7.11), tại sao ratio $\rho_{t+1:t+n}$ bắt đầu và kết thúc trễ hơn một bước so với n-step TD ($\rho_{t:t+n-1}$)?

- A. Vì đây là lỗi đánh máy trong sách, lẽ ra hai ratio phải hoàn toàn trùng nhau.
- B. Vì cập nhật một state–action pair thì action đó đã chọn rồi, importance sampling chỉ áp dụng cho các action tiếp theo.
- C. Vì state–action pair cần thêm một bước bootstrapping nên ratio phải dịch theo.
- D. Vì on-policy và off-policy Sarsa thực ra giống hệt nhau nên dịch chỉ là quy ước.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Khi cập nhật một state–action pair, ta không cần quan tâm xác suất mình chọn action đó (đã chọn rồi), nên muốn học đầy đủ từ những gì xảy ra sau đó — importance sampling chỉ áp dụng cho các action tiếp theo. Vì vậy ratio bắt đầu/kết thúc trễ một bước. Off-policy Expected Sarsa dùng $\rho_{t+1:t+n-1}$ (ít hơn một factor) vì action cuối đã lấy kỳ vọng.

</details>

---

**Câu 16.** [Khó] Trong off-policy n-step learning, điều gì xảy ra với một sample return khi tồn tại ít nhất một action $A_k$ trong cửa sổ mà $\pi(A_k|S_k) = 0$ nhưng $b(A_k|S_k) > 0$?

- A. Return đó nhận trọng số $\rho = 0$ nên không đóng góp gì vào cập nhật; nó bị loại bỏ hiệu quả.
- B. Return đó nhận trọng số $\rho = \infty$ nên thống trị cập nhật và làm value phân kỳ.
- C. Return đó được giữ nguyên với trọng số 1 vì $b$ vẫn cho phép action đó xảy ra.
- D. Thuật toán báo lỗi chia cho 0 và phải bỏ toàn bộ episode chứa action đó.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Ratio là tích $\prod \pi/b$. Nếu bất kỳ thừa số $\pi(A_k|S_k)=0$, toàn bộ tích bằng 0, nên return được cho trọng số 0 và bị bỏ qua. Đây là hệ quả trực tiếp: $\pi$ không bao giờ lấy action đó nên trajectory này không thông tin về $\pi$. B mô tả vấn đề ngược (ratio lớn), nhưng triệt tiêu (zero) chứ không phải vô hạn ở đây.

</details>

---

## 7.4 Per-decision Methods with Control Variates

**Câu 17.** Trong off-policy n-step return với control variate cho state values (công thức 7.13), $G_{t:h} = \rho_t(R_{t+1} + \gamma G_{t+1:h}) + (1-\rho_t)V_{h-1}(S_t)$, ý nghĩa số hạng control variate là gì?

- A. Nó thay thế hoàn toàn importance sampling ratio và làm cho method trở thành on-policy.
- B. Nó cố ý làm tăng variance để khám phá nhiều hơn trong off-policy setting.
- C. Nó làm thay đổi expected update, đưa thêm bias để đổi lấy variance thấp hơn.
- D. Khi $\rho_t = 0$, target bằng chính ước lượng (không co về 0); control variate có kỳ vọng 0 nên không đổi expected update.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Khi $\rho_t = 0$, weighting đơn giản làm return thành 0 gây variance cao; số hạng $(1-\rho_t)V_{h-1}(S_t)$ (control variate) khiến target bằng chính ước lượng nên không gây thay đổi. Control variate không làm đổi expected update vì ratio có kỳ vọng 1 và không tương quan với ước lượng, nên kỳ vọng control variate bằng 0. C sai vì nó không thêm bias.

</details>

---

**Câu 18.** Đối với action values (công thức 7.14), tại sao action đầu tiên KHÔNG tham gia importance sampling?

- A. Vì action đầu tiên là cái đang được học; nó đã được lấy nên nhận full unit weight, IS chỉ áp dụng cho action sau.
- B. Vì action đầu tiên luôn có xác suất 0 dưới target policy nên loại bỏ khỏi tích.
- C. Vì action values nói chung không bao giờ dùng importance sampling trong bất kỳ thuật toán nào.
- D. Vì đệ quy bắt buộc kết thúc tại action đầu tiên nên không còn tỉ số để nhân.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Với action values, action đầu tiên là cái đang được học; không quan trọng nó khó xảy ra hay bất khả thi dưới $\pi$ — nó đã được lấy nên phải nhận full unit weight cho reward và state theo sau. Importance sampling chỉ áp dụng cho các action tiếp theo. B, C, D mô tả sai.

</details>

---

**Câu 19.** Theo cuối Section 7.4, nhược điểm chính của các phương pháp dùng importance sampling là gì, và control variates giúp gì?

- A. IS cho update variance thấp; control variates lại làm variance tăng nên ít được dùng.
- B. IS luôn nhanh hơn on-policy training; control variates chỉ là tinh chỉnh thẩm mỹ không cần thiết.
- C. IS cho off-policy đúng nhưng variance cao buộc step-size nhỏ làm học chậm; control variates giảm variance.
- D. IS chỉ hoạt động khi $\pi = b$; control variates loại bỏ hoàn toàn nhu cầu off-policy learning.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Importance sampling cho phép off-policy learning đúng đắn nhưng tạo update variance cao, buộc dùng step-size nhỏ khiến học chậm. Control variates là một cách giảm variance; các cách khác gồm adapt step size theo variance quan sát (Autostep) và invariant updates. A đảo ngược tác dụng của control variate.

</details>

---

## 7.5 Off-policy Learning Without Importance Sampling: n-step Tree Backup

**Câu 20.** Tree Backup algorithm khác biệt cốt lõi nào so với các phương pháp off-policy n-step trước đó?

- A. Nó dùng importance sampling ratio lớn hơn để bù cho nhiều bước hơn.
- B. Nó chỉ hoạt động cho on-policy learning và không xử lý được target khác behavior.
- C. Nó loại bỏ bootstrapping hoàn toàn, biến thành phương pháp Monte Carlo off-policy.
- D. Nó cho phép off-policy mà KHÔNG cần importance sampling — mở rộng multi-step của Q-learning/Expected Sarsa.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Q-learning và Expected Sarsa làm off-policy mà không cần importance sampling cho one-step; Tree Backup là phiên bản multi-step tương ứng — mở rộng tự nhiên sang trường hợp multi-step với stochastic target policy, không dùng importance sampling. A, B, C mô tả sai bản chất.

</details>

---

**Câu 21.** Trong tree-backup update, các node nào đóng góp vào target và với trọng số ra sao?

- A. Chỉ action thực sự lấy ở mỗi bước, mỗi action đóng góp với trọng số cố định bằng 1.
- B. Các leaf node (action không chọn ở mỗi tầng) đóng góp với trọng số tỉ lệ xác suất dưới $\pi$; action đã lấy không đóng góp trực tiếp nhưng xác suất của nó nhân trọng số cho tầng sâu hơn.
- C. Tất cả các node trong cây đóng góp với trọng số bằng nhau, không phân biệt tầng.
- D. Chỉ các reward đóng góp vào target, không có giá trị action ước lượng nào tham gia.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Update đến từ giá trị action ước lượng của các leaf node, mỗi node trọng số tỉ lệ $\pi$. Action tầng đầu $a$ đóng góp với trọng số $\pi(a|S_{t+1})$, trừ action thực sự lấy $A_{t+1}$ không trực tiếp đóng góp mà $\pi(A_{t+1}|S_{t+1})$ dùng để nhân trọng số cho tầng hai, v.v. — nên gọi "tree-backup".

</details>

---

**Câu 22.** n-step return đệ quy của Tree Backup (công thức 7.16) có dạng nào?

- A. $G_{t:t+n} = R_{t+1} + \gamma \rho_{t+1} G_{t+1:t+n}$, dùng importance sampling ratio.
- B. $G_{t:t+n} = R_{t+1} + \gamma^n V_{t+n-1}(S_{t+n})$, giống n-step TD trên action values.
- C. $G_{t:t+n} = R_{t+1} + \gamma \sum_{a \neq A_{t+1}} \pi(a|S_{t+1}) Q_{t+n-1}(S_{t+1}, a) + \gamma \pi(A_{t+1}|S_{t+1}) G_{t+1:t+n}$.
- D. $G_{t:t+n} = \sum_a \pi(a|S_t) Q(S_t, a)$, kỳ vọng một bước không có reward.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Tree-backup n-step return đệ quy: $G_{t:t+n} = R_{t+1} + \gamma \sum_{a \neq A_{t+1}} \pi(a|S_{t+1}) Q_{t+n-1}(S_{t+1}, a) + \gamma \pi(A_{t+1}|S_{t+1}) G_{t+1:t+n}$, với $n=1$ là one-step return của Expected Sarsa. A là dạng off-policy với importance sampling (không phải tree backup).

</details>

---

**Câu 23.** [Khó] Theo phần Summary, một hạn chế tinh tế của tree backup khi target policy $\pi$ và behavior $b$ rất khác nhau là gì, dù ta chọn $n$ lớn?

- A. Importance sampling ratio nổ tới vô hạn nên cập nhật phân kỳ ngay lập tức.
- B. Bootstrapping thực tế chỉ trải dài vài bước vì các thừa số $\pi(A_{k}|S_k)$ nhỏ làm tắt nhanh các tầng sâu.
- C. Tree backup tự động chuyển thành Monte Carlo và mất hết khả năng bootstrapping.
- D. Thuật toán buộc phải dùng importance sampling bổ sung khiến variance vẫn cao như trước.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Trong return đệ quy, số hạng $G_{t+1:t+n}$ bị nhân $\pi(A_{t+1}|S_{t+1})$. Nếu $\pi$ gán xác suất nhỏ cho action mà $b$ thực sự lấy, thừa số này nhỏ và tích các thừa số tắt nhanh, nên bootstrapping chỉ trải hiệu quả vài bước dù $n$ lớn. Tree backup không dùng importance sampling (loại A, D); nó vẫn bootstrap chứ không thành MC (loại C).

</details>

---

## 7.6 A Unifying Algorithm: n-step Q(σ)

**Câu 24.** Ý tưởng hợp nhất (unification) của n-step Q(σ) là gì?

- A. Cố định mọi bước đều phải dùng sampling, loại bỏ mọi kỳ vọng phân tích.
- B. Quyết định theo từng bước nên lấy action như sample (Sarsa) hay xét kỳ vọng trên mọi action (tree backup); $\sigma_t \in [0,1]$ biểu thị mức sampling.
- C. Loại bỏ cả Sarsa lẫn tree backup, thay bằng một quy tắc cập nhật hoàn toàn mới.
- D. Chỉ áp dụng khi $n=1$, vì với $n>1$ sampling và expectation không thể trộn.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — n-step Q(σ) cho phép quyết định từng bước: lấy action như sample (Sarsa) hay xét kỳ vọng trên mọi action (tree backup). $\sigma_t \in [0,1]$ biểu thị mức sampling ($\sigma=1$ full sampling, $\sigma=0$ pure expectation), biến thiên liên tục; $\sigma_t$ có thể đặt như hàm của state, action hay state–action pair.

</details>

---

**Câu 25.** Các trường hợp đặc biệt của n-step Q(σ) ứng với giá trị $\sigma$ nào?

- A. $\sigma=1$ luôn cho tree backup, $\sigma=0$ luôn cho n-step Sarsa (ngược với định nghĩa thông thường).
- B. Mọi giá trị $\sigma$ đều quy về Monte Carlo bất kể cấu trúc backup.
- C. $\sigma$ chỉ điều khiển step-size, không liên quan tới sampling hay expectation.
- D. $\sigma=1$ mọi bước cho n-step Sarsa; $\sigma=0$ mọi bước cho tree-backup; sample mọi bước trừ bước cuối cho Expected Sarsa.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Nếu luôn sample ($\sigma=1$) ta được Sarsa; không bao giờ sample ($\sigma=0$) ta được tree-backup; Expected Sarsa là sample mọi bước trừ bước cuối. n-step Q(σ) hợp nhất cả ba (và nhiều khả năng khác) bằng cách trượt tuyến tính giữa hai cực (công thức 7.17), trong đó $\pi(A_{t+1}|S_{t+1})$ và ratio $\rho_{t+1}$ được pha trộn theo $\sigma_{t+1}$. A đảo ngược hai cực.

</details>

---

**Câu 26.** [Khó] Trong n-step Q(σ), số hạng đệ quy được pha trộn dạng $\big(\sigma_{t+1}\rho_{t+1} + (1-\sigma_{t+1})\pi(A_{t+1}|S_{t+1})\big)$. Khi $\sigma_{t+1}=0$ thì hệ số này bằng bao nhiêu và điều đó tái tạo thuật toán nào?

- A. Bằng $\rho_{t+1}$, tái tạo off-policy Sarsa với importance sampling đầy đủ.
- B. Bằng $\pi(A_{t+1}|S_{t+1})$, tái tạo nhánh tree-backup (kỳ vọng, không importance sampling).
- C. Bằng 1 luôn, tái tạo on-policy n-step TD trên state values.
- D. Bằng 0 luôn, làm tắt toàn bộ bootstrapping và tái tạo Monte Carlo.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Khi $\sigma_{t+1}=0$, hệ số $= 0\cdot\rho_{t+1} + (1-0)\pi(A_{t+1}|S_{t+1}) = \pi(A_{t+1}|S_{t+1})$, đúng là trọng số dùng trong tree backup — không có importance sampling. Khi $\sigma_{t+1}=1$ hệ số $=\rho_{t+1}$, tái tạo nhánh Sarsa off-policy. Đây là cơ chế "trượt liên tục" giữa hai họ thuật toán.

</details>

---

## 7.7 Summary

**Câu 27.** Theo phần Summary, các nhược điểm chung của tất cả phương pháp n-step là gì?

- A. Chúng không bao giờ hội tụ dù dưới điều kiện kỹ thuật nào.
- B. Chúng có delay $n$ bước trước cập nhật, tốn nhiều tính toán mỗi bước, và cần thêm bộ nhớ ghi states/actions/rewards của $n$ bước gần nhất.
- C. Chúng chỉ hoạt động cho one-step và không tổng quát hóa được lên multi-step.
- D. Chúng không cần bootstrapping nên về cơ bản không có nhược điểm đáng kể nào.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Mọi phương pháp n-step có delay $n$ bước trước cập nhật (chỉ khi đó mới biết hết sự kiện tương lai cần thiết), tốn nhiều tính toán hơn mỗi bước, và cần nhiều bộ nhớ hơn để ghi states, actions, rewards của $n$ bước gần nhất. Chương 12 (eligibility traces) cho thấy cách triển khai multi-step với bộ nhớ và tính toán tối thiểu.

</details>

---

**Câu 28.** Phần Summary so sánh hai cách tiếp cận off-policy learning trong chương này như thế nào?

- A. Cả hai đều dùng importance sampling và về bản chất là cùng một thuật toán.
- B. Tree backup luôn dùng importance sampling còn cách kia thì không, ngược với mô tả trong sách.
- C. Cách IS đơn giản về khái niệm nhưng variance cao; tree-backup là mở rộng multi-step của Q-learning, không dùng IS nhưng nếu hai policy khác nhau nhiều thì bootstrapping chỉ trải vài bước.
- D. Không cách nào trong hai hoạt động được nên chương chỉ nêu ra để bác bỏ.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Cách dựa trên importance sampling đơn giản về khái niệm nhưng variance cao; nếu target và behavior rất khác nhau cần ý tưởng thuật toán mới. Cách tree-backup là mở rộng tự nhiên của Q-learning sang multi-step với stochastic target policy, không cần IS, nhưng nếu hai policy khác nhau đáng kể thì bootstrapping có thể chỉ trải vài bước dù $n$ lớn.

</details>

---

**Câu 29.** [Khó] Một kỹ sư muốn off-policy control với $b$ rất khám phá (gần uniform) và target $\pi$ gần greedy, đồng thời lo ngại variance của update. Lựa chọn nào hợp lý nhất và vì sao?

- A. Dùng n-step Sarsa off-policy với importance sampling và $n$ lớn, vì IS luôn cho variance thấp nhất.
- B. Dùng n-step tree backup, vì nó off-policy mà không cần importance sampling nên tránh được variance bùng nổ do tích các ratio lớn.
- C. Dùng one-step TD prediction trên state values, vì control không cần action values.
- D. Dùng Monte Carlo off-policy với weighted importance sampling, vì nó không có vấn đề variance nào.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Khi $b$ và $\pi$ khác nhau nhiều, tích importance sampling ratio dễ bùng nổ làm variance rất cao (loại A). Tree backup làm off-policy mà không cần IS nên tránh được vấn đề này, đổi lại bootstrapping có thể chỉ trải vài bước hiệu quả. C là prediction state-value không giải bài toán control; D vẫn dựa IS và MC có variance cao với trajectory dài.

</details>

---

**Câu 30.** [Khó] So sánh: với cùng dữ liệu off-policy, n-step Q(σ) đặt $\sigma_t = 1$ cho mọi bước trừ vài bước đầu, $\sigma_t=0$ cho phần còn lại. Cấu hình này nằm ở đâu trên phổ thuật toán và đánh đổi gì?

- A. Tương đương thuần tree backup ở mọi bước, nên hoàn toàn không dùng importance sampling.
- B. Tương đương thuần n-step Sarsa ở mọi bước, nên dùng importance sampling đầy đủ và variance lớn nhất.
- C. Là một hỗn hợp: vài bước đầu sampling (có IS) còn lại expectation (không IS), đánh đổi giữa variance của sampling và độ trải của bootstrapping.
- D. Là Monte Carlo vì có cả sampling lẫn expectation nên triệt tiêu mọi bootstrapping.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — $\sigma_t=1$ ở các bước nào thì bước đó dùng sampling (kèm importance sampling, variance cao hơn); $\sigma_t=0$ thì dùng kỳ vọng kiểu tree backup (không IS, nhưng có thể làm tắt bootstrapping nếu policy khác nhau). Cấu hình hỗn hợp này nằm giữa Sarsa và tree backup trên phổ Q(σ), đánh đổi variance lấy độ trải bootstrapping — chính là sức mạnh hợp nhất của Q(σ). A, B sai vì không thuần một cực; D mô tả sai (vẫn bootstrap).

</details>
