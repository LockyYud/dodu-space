# Chương 11: Off-policy Methods with Approximation — Câu hỏi trả lời ngắn

> Bộ câu hỏi trả lời ngắn (short-answer) ôn tập Chương 11, sách *Reinforcement Learning: An Introduction* (Sutton & Barto, 2nd ed.). Đáp án tham khảo dùng cho việc LLM chấm điểm.

## 11.1 Semi-gradient Methods

**Câu 1.** Thách thức của off-policy learning được chia thành hai phần. Hãy nêu rõ hai phần đó, và cho biết các semi-gradient methods (ví dụ semi-gradient off-policy TD(0)) giải quyết được phần nào và bỏ ngỏ phần nào.

<details>
<summary>Đáp án tham khảo</summary>

Phần thứ nhất liên quan đến **target của update** (mục tiêu cập nhật), phát sinh ngay cả trong trường hợp tabular; nó được xử lý bằng các kỹ thuật importance sampling (ví dụ tỉ số ρ_t = π(A_t|S_t)/b(A_t|S_t)). Phần thứ hai liên quan đến **distribution của các update**, chỉ phát sinh khi có function approximation, vì phân phối update trong off-policy không khớp on-policy distribution. Semi-gradient methods chỉ giải quyết phần thứ nhất (sửa target) mà KHÔNG giải quyết phần thứ hai (sửa distribution), nên chúng có thể diverge và "không sound", dù vẫn thường dùng thành công và vẫn ổn định/không chệch trong trường hợp tabular.

</details>

## 11.2 Examples of Off-policy Divergence

**Câu 2.** Trong ví dụ đơn giản hai trạng thái với giá trị ước lượng w và 2w (chuyển từ w-state sang 2w-state, reward = 0), tại sao off-policy semi-gradient TD(0) lại làm w diverge tới vô cực, trong khi on-policy thì không?

<details>
<summary>Đáp án tham khảo</summary>

Update có dạng w_{t+1} = [1 + α(γ·2 − 1)]w_t, tức w_t mới bằng w_t cũ nhân một hằng số. Khi γ > 0.5 hằng số đó lớn hơn 1 nên hệ bất ổn định và w đi tới ±∞ với mọi α > 0. Điểm mấu chốt: dưới off-policy, transition w→2w có thể lặp lại nhiều lần mà không có update bù trừ từ các transition ra khỏi 2w-state (vì behavior policy chọn các action mà target policy không bao giờ chọn, khiến ρ_t = 0 và không update). Dưới on-policy, ρ_t luôn bằng 1, nên mỗi lần tăng w qua transition này luôn kèm một transition đi ra làm giảm w; "lời hứa phần thưởng tương lai" luôn phải được giữ và hệ được kiểm soát.

</details>

**Câu 3.** Baird's counterexample là gì, và nó chứng minh điều gì? Việc thay phân phối update từ uniform sang on-policy distribution có giải quyết được vấn đề không?

<details>
<summary>Đáp án tham khảo</summary>

Baird's counterexample là một MDP episodic hoàn chỉnh gồm 7 trạng thái, 2 action, với linear function approximation (8 weight, 7 trạng thái, feature vectors độc lập tuyến tính), reward luôn bằng 0 nên v_π = 0 và có thể biểu diễn chính xác bằng w = 0. Tuy vậy, semi-gradient off-policy TD(0) làm các weight diverge tới vô cực với mọi step size dương — và divergence xảy ra ngay cả khi dùng expected (DP-style) update. Nó chứng minh rằng ngay cả tổ hợp đơn giản nhất của bootstrapping và function approximation cũng có thể bất ổn nếu update KHÔNG theo on-policy distribution. Nếu chỉ đổi phân phối DP update sang on-policy distribution (thường cần asynchronous updating), thì convergence được đảm bảo với sai số bị chặn bởi (9.14).

</details>

**Câu 4.** Tsitsiklis và Van Roy's counterexample bổ sung thêm điều gì so với việc chỉ "đi một bước về phía expected return"? Phương pháp function approximation kiểu "averager" có vai trò gì?

<details>
<summary>Đáp án tham khảo</summary>

Counterexample này (mở rộng ví dụ w-to-2w bằng một terminal state) cho thấy rằng ngay cả khi mỗi bước ta tìm nghiệm least-squares tốt nhất (minimize VE với expected one-step return) thay vì chỉ nhích một bước, hệ vẫn có thể diverge khi không thể biểu diễn nghiệm chính xác. Nó cho thấy instability không phải do step size mà do chính sự kết hợp bootstrapping + approximation + off-policy. "Averagers" (như nearest neighbor, locally weighted regression) là các phương pháp function approximation KHÔNG ngoại suy (extrapolate) khỏi target quan sát; chúng được đảm bảo ổn định, nhưng tile coding và artificial neural networks (ANNs) thì không nằm trong nhóm này.

</details>

## 11.3 The Deadly Triad

**Câu 5.** Liệt kê ba thành phần của deadly triad và giải thích vì sao chỉ khi đủ cả ba thì mới có nguy cơ instability/divergence.

<details>
<summary>Đáp án tham khảo</summary>

Ba thành phần là: (1) **Function approximation** — cách tổng quát hóa mạnh, mở rộng được cho không gian trạng thái lớn (ví dụ linear FA hoặc ANNs); (2) **Bootstrapping** — target update chứa các ước lượng hiện có (như DP, TD) thay vì chỉ dùng reward/return thực tế (như MC); (3) **Off-policy training** — huấn luyện trên phân phối transition khác phân phối do target policy sinh ra (quét đều state space như DP cũng là off-policy). Nguy cơ instability chỉ xuất hiện khi có ĐỦ cả ba; nếu thiếu một trong ba thì có thể tránh được instability. Lưu ý: nguy cơ không phải do control/GPI, cũng không phải do learning hay tính bất định của môi trường — nó xảy ra ngay cả trong prediction và trong planning (DP) nơi môi trường đã biết hoàn toàn.

</details>

**Câu 6.** Trong ba thành phần của deadly triad, thành phần nào khó từ bỏ nhất và vì sao? Việc từ bỏ bootstrapping hay off-policy training có cái giá gì?

<details>
<summary>Đáp án tham khảo</summary>

**Function approximation** rõ ràng nhất là không thể từ bỏ, vì ta cần phương pháp scale được cho bài toán lớn với sức biểu diễn cao (state aggregation/nonparametric thì quá yếu hoặc quá đắt; least-squares như LSTD thì O(d²), quá đắt). Từ bỏ **bootstrapping** là khả thi nhưng phải trả giá về hiệu quả tính toán và dữ liệu: MC cần lưu mọi thứ tới khi có return, học chậm hơn (đã thấy ở random-walk, Mountain-Car); bootstrapping cho học nhanh hơn và tiết kiệm bộ nhớ/giao tiếp. Từ bỏ **off-policy training** cũng khả thi (dùng Sarsa thay Q-learning), nhưng off-policy là thiết yếu cho các use case học song song nhiều value function/policy từ một luồng kinh nghiệm — điều quan trọng với mục tiêu tạo agent thông minh mạnh.

</details>

## 11.4 Linear Value-function Geometry

**Câu 7.** Norm có trọng số ‖v‖²_μ được định nghĩa thế nào và tại sao không dùng Euclidean norm thông thường? Liên hệ với VE.

<details>
<summary>Đáp án tham khảo</summary>

‖v‖²_μ = Σ_s μ(s)v(s)², với μ là phân phối thể hiện mức độ ta "quan tâm" tới việc định giá chính xác từng trạng thái (thường là on-policy distribution). Không dùng Euclidean norm vì một số trạng thái quan trọng hơn (xuất hiện thường xuyên hơn hoặc ta quan tâm hơn), nên cần trọng số theo μ. VE có thể viết gọn bằng norm này: VE(w) = ‖v_w − v_π‖²_μ. Operation tìm value function biểu diễn được gần nhất với v_π chính là phép projection Π, cho Πv_π là nghiệm mà MC tìm tới.

</details>

**Câu 8.** Phân biệt Bellman error (BE) và mean square Projected Bellman error (PBE). TD fixed point liên quan thế nào đến PBE?

<details>
<summary>Đáp án tham khảo</summary>

Bellman error tại state s là chênh lệch giữa hai vế của Bellman equation khi thay v_w vào: δ̄_w(s) = (B_π v_w)(s) − v_w(s), chính là kỳ vọng của TD error. **BE(w) = ‖δ̄_w‖²_μ** là độ lớn của Bellman error vector. Khi áp Bellman operator B_π lên một value function trong subspace, kết quả thường nằm ngoài subspace; chiếu (project) nó trở lại subspace cho **projected Bellman error vector Π δ̄_w**, và **PBE(w) = ‖Π δ̄_w‖²_μ**. Với linear FA luôn tồn tại value function (trong subspace) có PBE = 0, đó chính là TD fixed point w_TD. Nói chung điểm tối thiểu BE, tối thiểu VE (Πv_π) và w_TD là khác nhau; w_TD không phải lúc nào cũng ổn định dưới semi-gradient TD off-policy.

</details>

## 11.5 Gradient Descent in the Bellman Error

**Câu 9.** Naive residual-gradient algorithm minimize TDE; vì sao "ngây thơ" (naive)? Dùng ví dụ A-split để minh họa, và nêu sự khác biệt với residual-gradient algorithm "đúng".

<details>
<summary>Đáp án tham khảo</summary>

Naive residual-gradient minimize mean square TD error (TDE), bổ sung term hoàn chỉnh gradient để thành true SGD nên hội tụ robust — nhưng hội tụ tới chỗ KHÔNG mong muốn. Trong ví dụ A-split (tabular, on-policy), giá trị đúng là B = 1, C = 0, A = 1/2; nhưng naive residual-gradient hội tụ về B = 3/4, C = 1/4 vì các giá trị này minimize TDE chứ không cho prediction chính xác. Minimize TDE giống "temporal smoothing" hơn là dự đoán đúng. Residual-gradient "đúng" cố minimize BE (kỳ vọng TD error bình phương), nhưng gradient chứa S_{t+1} xuất hiện trong hai expectation nhân nhau, nên cần hai mẫu độc lập của next state (double sampling) — chỉ làm được khi môi trường tất định hoặc khi mô phỏng cho phép rollback. Nó hội tụ tới minimum BE nhưng chậm hơn nhiều so với semi-gradient và vẫn có thể hội tụ tới giá trị sai (xem ví dụ A-presplit).

</details>

## 11.6 The Bellman Error is Not Learnable

**Câu 10.** "Learnable" trong mục này nghĩa là gì? Hãy giải thích vì sao VE không learnable nhưng vẫn dùng được làm objective, trong khi BE thì khác.

<details>
<summary>Đáp án tham khảo</summary>

"Learnable" ở đây nghĩa là học được dù với bất kỳ lượng kinh nghiệm nào (không phải nghĩa "học hiệu quả trong số mẫu đa thức" của ML). Một đại lượng không learnable nếu nó được định nghĩa rõ và tính được khi biết cấu trúc bên trong của MDP, nhưng KHÔNG thể ước lượng từ chuỗi feature vector, action, reward quan sát được. VE không learnable (hai MRP sinh cùng phân phối dữ liệu nhưng có VE khác nhau), nhưng **tham số tối ưu w\* của VE thì learnable** — vì mọi MDP cùng phân phối dữ liệu đều có cùng w\*, và w\* này cũng là nghiệm của return error (RE = VE + một term phương sai không phụ thuộc w), vốn learnable. BE thì khác: phản ví dụ cho thấy hai MRP cùng phân phối dữ liệu có BE khác nhau VÀ tham số minimize BE cũng khác nhau. Do đó nghiệm minimize BE không thể ước lượng từ dữ liệu, cần kiến thức về MDP — đây là lý do mạnh nhất để không theo đuổi BE làm objective.

</details>

**Câu 11.** Vì sao residual-gradient algorithm lại có thể minimize BE dù BE "không learnable", và điều này nói gì về tính tổng quát của phương pháp này?

<details>
<summary>Đáp án tham khảo</summary>

Residual-gradient chỉ minimize được BE vì nó được phép **double sample từ cùng một state** — không phải state có cùng feature vector, mà chính xác cùng underlying state (đảm bảo bằng cách rollback trong môi trường tất định/mô phỏng). Điều này đòi hỏi truy cập tới underlying state vượt quá những gì feature vector tiết lộ. Trong các POMDP-like setting nơi hai MDP khác nhau sinh cùng dữ liệu quan sát, BE thật sự không phải là hàm của dữ liệu, nên không thể minimize bằng thuật toán chỉ thấy feature vector. Nói cách khác, minimize BE chỉ khả thi với model-based setting có truy cập state thật, không khả thi với learning thuần từ dữ liệu observable. Điều này hướng sự chú ý sang PBE thay vì BE.

</details>

## 11.7 Gradient-TD Methods

**Câu 12.** Gradient-TD methods (GTD2, TDC) làm gì để đạt true SGD trên PBE với độ phức tạp O(d)? Vai trò của vector thứ hai v và khái niệm two-time-scale là gì?

<details>
<summary>Đáp án tham khảo</summary>

Gradient-TD methods thực hiện SGD trên PBE — là true SGD nên hội tụ robust cả khi off-policy và nonlinear FA, tìm tới TD fixed point (PBE = 0). Gradient của PBE là tích ba expectation, trong đó factor đầu và cuối đều phụ thuộc x_{t+1} nên không thể sample rồi nhân (sẽ bị bias như residual-gradient). Giải pháp: **lưu và học riêng một vector thứ hai v** ≈ E[x_t x_t^⊤]⁻¹ E[ρ_t δ_t x_t] (nghiệm bài toán least-squares xấp xỉ ρ_t δ_t từ feature, học bằng quy tắc LMS), rồi kết hợp v với một sample của factor còn lại. Nhờ vậy chỉ cần O(d) bộ nhớ và tính toán mỗi bước (nếu nhân tích trong x_t^⊤ v_t trước). **GTD2** và **TDC** (còn gọi GTD(0)) đều có hai quá trình học (w chính, v phụ) theo dạng cascade; convergence proof là two-time-scale: time scale nhanh cho v phụ, chậm cho w chính (yêu cầu cả hai step size → 0). TDC tốt hơn GTD2 một chút nhờ vài bước biến đổi giải tích thêm. Đây hiện là nhóm off-policy method ổn định được hiểu rõ và dùng rộng nhất, với cái giá là gấp đôi độ phức tạp tính toán.

</details>

## 11.8 Emphatic-TD Methods

**Câu 13.** Ý tưởng cốt lõi của Emphatic-TD methods là gì, và nó dùng những đại lượng nào (interest, emphasis) để khôi phục tính ổn định của on-policy learning?

<details>
<summary>Đáp án tham khảo</summary>

Trong off-policy, importance sampling đã reweight transition cho đúng target policy, nhưng state distribution vẫn là của behavior policy — gây mismatch khiến semi-gradient mất ổn định. Emphatic-TD **reweight các state** (nhấn mạnh state này, giảm nhẹ state khác) để đưa phân phối update trở về một on-policy distribution, nhờ đó khôi phục tính positive-definite của ma trận A và đảm bảo ổn định/hội tụ. Thuật toán dùng: **interest I_t** (tùy ý, mức độ quan tâm tới state) và **emphasis M_t** với M_t = γ ρ_{t−1} M_{t−1} + I_t (khởi tạo M_{−1} = 0); update là w_{t+1} = w_t + α M_t ρ_t δ_t ∇v̂. Trên Baird's counterexample, Emphatic-TD (kỳ vọng) hội tụ về nghiệm tối ưu (VE → 0), dù về lý thuyết hội tụ nhưng thực tế phương sai rất cao khiến khó cho kết quả nhất quán.

</details>

## 11.9 Reducing Variance

**Câu 14.** Vì sao off-policy learning dựa trên importance sampling lại có phương sai cao, và tại sao phương sai cao đặc biệt nguy hiểm với các SGD method? Nêu vài hướng giảm phương sai.

<details>
<summary>Đáp án tham khảo</summary>

Off-policy vốn có phương sai cao hơn on-policy vì dữ liệu ít liên quan tới policy hơn. Importance sampling thường liên quan tới **tích các policy ratio**: dù trung bình các ratio (và tích của chúng) luôn bằng 1, giá trị thực tế có thể rất lớn hoặc bằng 0, tạo phương sai rất cao. Các ratio này nhân với step size trong SGD, nên phương sai cao nghĩa là các bước nhảy lúc rất lớn lúc rất nhỏ; bước quá lớn từ một mẫu đơn lẻ khiến SGD (vốn dựa vào trung bình hóa nhiều bước) trở nên không tin cậy, còn đặt step size nhỏ để tránh thì học rất chậm. Các hướng giảm phương sai: momentum, Polyak-Ruppert averaging, step size thích nghi theo từng thành phần, weighted importance sampling (xấp xỉ O(d)), Tree Backup / các method không cần importance sampling, và định nghĩa target policy tham chiếu behavior policy (recognizers) để ratio không quá lớn.

</details>

## 11.10 Summary

**Câu 15.** Tóm tắt ba chiến lược chính mà chương đề cập để xử lý deadly triad và đánh giá cuối cùng của tác giả về từng hướng.

<details>
<summary>Đáp án tham khảo</summary>

Ba hướng: (1) **True SGD trên Bellman error (Bellman residual)** — phổ biến nhất, nhưng tác giả kết luận đây không phải mục tiêu hấp dẫn và hơn nữa BE không learnable từ kinh nghiệm chỉ tiết lộ feature vector (không tiết lộ underlying state), nên bất khả thi với learning thuần. (2) **Gradient-TD methods** — SGD trên projected Bellman error (PBE); gradient của PBE learnable với O(d), nhưng phải trả giá bằng vector tham số thứ hai và step size thứ hai. (3) **Emphatic-TD methods** — tinh chỉnh ý tưởng cũ về reweighting update (nhấn mạnh/giảm nhẹ), khôi phục các tính chất khiến on-policy ổn định với semi-gradient đơn giản. Tác giả nhấn mạnh lĩnh vực off-policy với approximation còn mới, chưa ngã ngũ method nào là tốt nhất, và việc kết hợp với giảm phương sai vẫn là câu hỏi mở.

</details>
