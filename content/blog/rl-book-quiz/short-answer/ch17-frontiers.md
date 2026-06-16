# Chương 17: Frontiers — Câu hỏi trả lời ngắn

> Bộ câu hỏi trả lời ngắn (short-answer) ôn tập Chương 17, sách *Reinforcement Learning: An Introduction* (Sutton & Barto, 2nd ed.). Đáp án tham khảo dùng cho việc LLM chấm điểm.

## 17.1 General Value Functions and Auxiliary Tasks

**Câu 1.** Một general value function (GVF) khác với value function thông thường ở điểm nào, và khái niệm "cumulant" đóng vai trò gì trong định nghĩa này?

<details>
<summary>Đáp án tham khảo</summary>

GVF tổng quát hóa value function bằng cách dự đoán tổng tích lũy của một tín hiệu tùy ý chứ không nhất thiết là reward. Tín hiệu được cộng dồn theo kiểu value-function này gọi là cumulant (ký hiệu $C_t \in \mathbb{R}$). Một GVF $v_{\pi,\gamma,C}(s)$ được xác định bởi ba thành phần: target policy $\pi$, termination function $\gamma$, và cumulant $C$. Vì không nhất thiết liên hệ với reward nên GVF còn được gọi là một prediction hay forecast, nhưng vẫn có dạng của value function nên học được bằng các phương pháp trong sách.

</details>

**Câu 2.** Auxiliary tasks là gì, và hãy nêu ít nhất hai cách mà việc học chúng có thể giúp ích cho main task (tối đa hóa reward)?

<details>
<summary>Đáp án tham khảo</summary>

Auxiliary tasks là các nhiệm vụ phụ (dự đoán/điều khiển các tín hiệu khác ngoài long-term reward), thêm vào bên cạnh main task. Cách thứ nhất: chúng có thể đòi hỏi cùng những representation cần cho main task; auxiliary task thường dễ hơn, ít delay hơn nên giúp tìm ra feature tốt sớm, qua đó tăng tốc học main task (ví dụ mô hình multi-headed ANN dùng chung phần body, như Jaderberg et al. 2017 với dự đoán thay đổi pixel, reward bước kế, phân phối return). Cách thứ hai: theo kiểu classical conditioning, có thể gắn cứng (không học) một phản xạ từ prediction tới hành động định sẵn (ví dụ xe tự lái dự đoán va chạm thì phản xạ dừng/rẽ). Ngoài ra, auxiliary tasks còn quan trọng trong việc xây dựng state representation (vượt qua giả định state cố định).

</details>

## 17.2 Temporal Abstraction via Options

**Câu 3.** Một option được định nghĩa như thế nào, và việc thực thi (execute) một option diễn ra ra sao?

<details>
<summary>Đáp án tham khảo</summary>

Một option $\omega = \langle \pi_\omega, \gamma_\omega \rangle$ là một cặp gồm một policy $\pi_\omega$ và một state-dependent termination function $\gamma_\omega$, đóng vai trò một hành động tổng quát (generalized action). Thực thi option tại thời điểm $t$ là chọn hành động $A_t$ theo $\pi_\omega(\cdot|S_t)$, rồi kết thúc tại $t+1$ với xác suất $1-\gamma_\omega(S_{t+1})$; nếu chưa kết thúc thì tiếp tục chọn hành động và kiểm tra termination cho đến khi kết thúc. Low-level action là trường hợp đặc biệt của option (policy luôn chọn đúng action đó, termination function bằng 0 với mọi state, tức kết thúc sau một bước). Options do đó mở rộng action space.

</details>

**Câu 4.** Option model gồm hai phần nào, và điều gì khiến phần state-transition của option model khác biệt so với transition probability thông thường? Option model có thể được học bằng cách nào?

<details>
<summary>Đáp án tham khảo</summary>

Option model gồm hai phần: (1) phần reward $r(s,\omega)$ — kỳ vọng tổng reward chiết khấu tích lũy trên đường đi cho đến khi option kết thúc; (2) phần state-transition $p(s'|s,\omega)$ — xác suất (đã chiết khấu) kết thúc ở mỗi state $s'$ sau số bước thay đổi. Do có thừa số chiết khấu $\gamma^k$ với số bước $k$ khác nhau, $p(s'|s,\omega)$ không còn là một transition probability đúng nghĩa và không cộng lại bằng 1 trên các $s'$. Option model có thể học bằng cách diễn đạt nó như một tập hợp GVF rồi học từng GVF bằng các phương pháp trong sách (chọn cumulant, policy, termination function thích hợp); tuy nhiên ghép tất cả lại cùng function approximation vẫn vượt quá state of the art.

</details>

## 17.3 Observations and State

**Câu 5.** Phân biệt observation và state trong bối cảnh partial observability. Một state được gọi là Markov state khi nào?

<details>
<summary>Đáp án tham khảo</summary>

Trong môi trường partial observability, môi trường không phát ra state mà chỉ phát ra observation $O_t$ — tín hiệu phụ thuộc state nhưng chỉ cho thông tin một phần (như cảm biến robot). State được khôi phục như một bản tóm tắt gọn (compact summary) của history $H_t$ (toàn bộ chuỗi action–observation quá khứ), tức $S_t = f(H_t)$. Một state là Markov state khi $f$ giữ đủ thông tin để dự đoán mọi tương lai chính xác như từ toàn bộ history: nếu $f(h)=f(h')$ thì mọi test có cùng xác suất với hai history đó. Markov state tóm tắt mọi thứ cần để dự đoán bất kỳ test/GVF nào và để hành xử tối ưu.

</details>

**Câu 6.** State-update function $u$ là gì, vì sao nó cần thiết, và tại sao việc dùng identity function ($S_t = H_t$) tuy là Markov nhưng vẫn không tốt?

<details>
<summary>Đáp án tham khảo</summary>

State-update function $u$ tính state mới một cách tăng dần (incremental, recursive): $S_{t+1} = u(S_t, A_t, O_{t+1})$, chỉ kết hợp dữ liệu mới thay vì xử lý toàn bộ history. Nó cần thiết vì state phải có sẵn (tính được hiệu quả) trước khi agent ra hành động hay dự đoán, và là thành phần trung tâm của kiến trúc agent xử lý partial observability. Identity function $S_t = H_t$ tuy thỏa Markov nhưng không tốt vì state sẽ tăng kích thước không giới hạn theo thời gian — không compact, không thực dụng.

</details>

**Câu 7.** So sánh hai cách tiếp cận POMDP (belief state) và PSR (Predictive State Representations) trong việc xây dựng Markov state. PSR khắc phục điểm yếu nào của POMDP?

<details>
<summary>Đáp án tham khảo</summary>

POMDP giả định môi trường có một latent state $X_t$ ẩn (không bao giờ quan sát được) sinh ra observation; Markov state tự nhiên là belief state — phân phối trên các latent state cho trước history, cập nhật bằng Bayes' rule (đòi hỏi biết đầy đủ cơ chế nội tại của môi trường). PSR thay vì gắn ngữ nghĩa của agent state vào latent state ẩn (khó học vì không quan sát được), lại gắn ngữ nghĩa vào các prediction về observation/action tương lai (vốn quan sát được). Trong PSR, Markov state là vector xác suất của $d$ "core" test, cập nhật bằng hàm tương tự Bayes nhưng dựa trên dữ liệu quan sát được — được cho là dễ học hơn. Sách không khuyến nghị POMDP cho AI vì giả định và độ phức tạp tính toán scale kém.

</details>

## 17.4 Designing Reward Signals

**Câu 8.** Vì sao thiết kế reward signal lại quan trọng và khó, và vấn đề "sparse reward" là gì? Nêu các cách xử lý sparse reward được đề cập.

<details>
<summary>Đáp án tham khảo</summary>

Reward signal là phần môi trường tính scalar reward $R_t$ gửi cho agent; thành công của một ứng dụng RL phụ thuộc mạnh vào việc signal đó phản ánh mục tiêu của designer và đánh giá tiến độ tốt đến đâu — nên thiết kế nó là phần then chốt và không hề dễ. Sparse reward là vấn đề reward khác 0 quá hiếm, khiến agent khó đạt mục tiêu dù chỉ một lần (Minsky gọi là "plateau problem"). Các cách xử lý: (1) thay vì sửa reward, khởi tạo value-function approximation bằng một dự đoán ban đầu $v_0$ (như công thức 17.11), tránh các supplemental reward thiện chí làm agent lệch mục tiêu; (2) shaping (Skinner) — thay đổi reward signal dần theo quá trình học, bắt đầu từ reward không thưa với hành vi ban đầu rồi điều chỉnh dần về bài toán gốc, qua chuỗi bài toán khó tăng dần.

</details>

**Câu 9.** Inverse reinforcement learning là gì, và vì sao việc tự động hóa tìm reward signal có thể dẫn tới kết luận "goal của agent không nên luôn giống goal của designer"?

<details>
<summary>Đáp án tham khảo</summary>

Inverse reinforcement learning (Ng & Russell 2000) cố gắng khôi phục reward signal của một expert chỉ từ hành vi của expert đó, thuộc nhóm imitation/learning-from-demonstration/apprenticeship learning. Không thể khôi phục chính xác vì nhiều reward signal khác nhau có thể cùng cho một optimal policy (ví dụ reward hằng số khiến mọi policy đều optimal), nhưng có thể tìm ứng viên hợp lý; phương pháp đòi hỏi giả định mạnh (biết dynamics, biết feature vector mà reward tuyến tính theo) và phải giải bài toán nhiều lần. Khi tự động hóa tìm reward (bilevel optimization, mức ngoài giống evolution tối ưu high-level objective), thực nghiệm (Singh, Lewis, Barto 2009) cho thấy intuition không đủ để thiết kế reward tốt và goal của agent không nên luôn trùng goal của designer: do agent bị ràng buộc (compute, thông tin, thời gian học) hạn chế, học một goal khác với goal của designer đôi khi lại tới gần goal của designer hơn là theo đuổi trực tiếp (ví dụ evolution cho ta reward theo vị giác thay vì giá trị dinh dưỡng).

</details>

**Câu 10.** Intrinsic motivation / intrinsically-motivated reinforcement learning là gì, và reward signal có thể nhạy với những loại thông tin nội tại nào?

<details>
<summary>Đáp án tham khảo</summary>

Một agent RL không nhất thiết là một sinh vật/robot hoàn chỉnh mà có thể là một thành phần của hệ thống lớn hơn, nên reward signal có thể chịu ảnh hưởng bởi các yếu tố bên trong như motivational state, ký ức, ý tưởng, hay đặc tính của chính quá trình học (ví dụ đo learning progress). Làm reward nhạy với thông tin nội tại này cho phép agent học điều khiển "cognitive architecture" mà nó là một phần, và học những kỹ năng khó học chỉ từ external reward — dẫn tới ý tưởng intrinsically-motivated reinforcement learning. Intrinsic reward có thể đo tiến bộ học, báo hiệu input bất ngờ/mới lạ/thú vị, hoặc đánh giá khả năng agent gây thay đổi môi trường; agent dùng nó để tự đặt task cho mình (auxiliary tasks, GVFs, options) — một dạng tính toán của curiosity và play.

</details>

## 17.5 Remaining Issues

**Câu 11.** Nêu các vấn đề còn tồn đọng (remaining issues) được liệt kê cho nghiên cứu RL tương lai, đặc biệt vấn đề "catastrophic interference" và vấn đề tự động chọn task.

<details>
<summary>Đáp án tham khảo</summary>

Sách nêu sáu vấn đề: (1) cần phương pháp function approximation parametric mạnh hoạt động tốt trong môi trường incremental/online — deep learning hiện vẫn chủ yếu cần batch/offline, gặp "catastrophic interference" (cái mới học được thay thế cái cũ thay vì cộng thêm, mất lợi ích học cũ; thường dùng replay buffer để giảm nhẹ). (2) cần học feature để generalize tốt hơn (representation learning / meta-learning), đồng nhất với việc học state-update function ở 17.3. (3) cần phương pháp planning scalable với mô hình môi trường được học (full model-based RL còn hiếm, model cần selective). (4) tự động hóa việc agent tự chọn task để cấu trúc năng lực phát triển (tự chọn cumulant/policy/termination cho GVF thay vì làm thủ công, xây task phân cấp như feature trong ANN). (5) tương tác giữa behavior và learning qua dạng tính toán của curiosity (intrinsic reward). (6) làm cho việc nhúng agent RL vào môi trường vật lý đủ an toàn.

</details>

## 17.6 Reinforcement Learning and the Future of Artificial Intelligence

**Câu 12.** Theo chương cuối, vì sao việc đạt nhiều ứng dụng thực tế thành công không có nghĩa là "true AI" đã đến, và RL đóng góp gì cho tương lai của AI?

<details>
<summary>Đáp án tham khảo</summary>

Dù có nhiều ứng dụng thực tế (đặc biệt deep reinforcement learning) thay đổi cuộc sống, khoảng cách giữa AI và trí tuệ con người/động vật vẫn còn lớn: ta có thể đạt superhuman trong vài lĩnh vực (như Go) nhưng vẫn khó tạo agent hoàn chỉnh, tương tác, có khả năng thích nghi tổng quát, sự tinh tế cảm xúc, sáng tạo và học nhanh từ kinh nghiệm. Với trọng tâm học qua tương tác với môi trường động, RL sẽ là thành phần then chốt của những agent như vậy. RL còn đóng góp: soi sáng các câu hỏi về tâm trí/não bộ (qua liên hệ với psychology, neuroscience, computational psychiatry, kể cả điều trị rối loạn tâm thần/nghiện), và hỗ trợ ra quyết định cho con người (giáo dục, y tế, giao thông, năng lượng...) nhờ tính đến hậu quả dài hạn.

</details>

**Câu 13.** Chương cuối cảnh báo những rủi ro an toàn nào của RL khi nhúng vào thế giới thực, và đề xuất hướng giải quyết ra sao?

<details>
<summary>Đáp án tham khảo</summary>

Vì RL dựa trên optimization, nó thừa hưởng rủi ro của mọi phương pháp optimization: khó thiết kế objective/reward sao cho cho ra kết quả mong muốn mà tránh kết quả không mong muốn; agent có thể tìm ra cách bất ngờ, thậm chí nguy hiểm, để thu reward (ví von "The Sorcerer's Apprentice", "The Monkey's Paw" của Wiener: "ban cho điều bạn yêu cầu, không phải điều bạn nên yêu cầu"). Rủi ro thứ hai là hành vi trong lúc đang học có thể gây hại cho môi trường, agent khác hay chính nó. Hướng giải quyết: thận trọng thiết kế reward signal; dùng các kỹ thuật giảm rủi ro của optimization (hard/soft constraint, robust/risk-sensitive policy, multiple objective); học từ simulator an toàn; và đặc biệt thích nghi/mở rộng các phương pháp từ control engineering (modeling, validation, testing, lý thuyết ổn định/hội tụ của adaptive control) để nhúng agent vào môi trường vật lý an toàn. Như Simon nhắc, ta là người thiết kế tương lai chứ không phải khán giả, có thể nghiêng cán cân về phía Prometheus.

</details>
