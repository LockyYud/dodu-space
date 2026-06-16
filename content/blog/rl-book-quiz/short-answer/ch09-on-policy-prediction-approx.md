# Chương 9: On-policy Prediction with Approximation — Câu hỏi trả lời ngắn

> Bộ câu hỏi trả lời ngắn (short-answer) ôn tập Chương 9, sách *Reinforcement Learning: An Introduction* (Sutton & Barto, 2nd ed.). Đáp án tham khảo dùng cho việc LLM chấm điểm.

## 9.1 Value-function Approximation

**Câu 1.** Tại sao trong function approximation, một update tại một state lại ảnh hưởng đến giá trị của nhiều state khác, và đặc tính generalization này mang lại lợi ích và rủi ro gì?

<details>
<summary>Đáp án tham khảo</summary>

Trong function approximation, value function được biểu diễn bằng một functional form có tham số với weight vector $\mathbf{w} \in \mathbb{R}^d$, trong đó số weight thường nhỏ hơn nhiều so với số state ($d \ll |\mathcal{S}|$). Vì vậy thay đổi một weight làm thay đổi giá trị ước lượng của nhiều state cùng lúc; khi cập nhật một state, sự thay đổi generalize sang các state khác. Generalization khiến học mạnh hơn (tận dụng kinh nghiệm từ một state cho các state tương tự) nhưng cũng khó quản lý và khó hiểu hơn, vì không thể làm mọi state cùng chính xác.

</details>

**Câu 2.** Vì sao không phải mọi phương pháp supervised learning / function approximation đều phù hợp cho reinforcement learning? Nêu hai yêu cầu đặc thù của RL.

<details>
<summary>Đáp án tham khảo</summary>

RL yêu cầu học online, tăng dần (incremental) khi agent tương tác với môi trường, trong khi nhiều phương pháp ANN và thống kê tinh vi giả định một training set tĩnh và duyệt nhiều lần. Ngoài ra RL cần xử lý target function không dừng (nonstationary): trong control dựa trên GPI ta học $q_\pi$ trong khi $\pi$ thay đổi, và ngay cả khi policy cố định thì các bootstrapping target (DP, TD) vẫn thay đổi theo thời gian. Phương pháp không xử lý tốt tính incremental và nonstationarity này thì kém phù hợp với RL.

</details>

## 9.2 The Prediction Objective (VE)

**Câu 3.** Định nghĩa mục tiêu mean square value error $\overline{VE}$ và giải thích vai trò của phân bố state $\mu$. Vì sao trong trường hợp approximation ta buộc phải chỉ định $\mu$?

<details>
<summary>Đáp án tham khảo</summary>

$\overline{VE}(\mathbf{w}) = \sum_{s} \mu(s)\,[v_\pi(s) - \hat{v}(s,\mathbf{w})]^2$, với $\mu(s) \ge 0$, $\sum_s \mu(s) = 1$, là sai số bình phương giữa giá trị xấp xỉ và giá trị thật, có trọng số theo $\mu$. Phân bố $\mu$ biểu diễn mức độ ta quan tâm đến sai số ở mỗi state. Vì có nhiều state hơn weight nên không thể làm mọi state đúng cùng lúc; làm một state chính xác hơn thường làm state khác kém đi, nên ta buộc phải nói rõ mình quan tâm state nào nhất. Thường $\mu$ được chọn là tỉ lệ thời gian ở mỗi state — under on-policy training gọi là on-policy distribution.

</details>

**Câu 4.** Trong on-policy distribution, trường hợp continuing và episodic được xác định khác nhau như thế nào? Nêu vắn tắt cách tính cho episodic task.

<details>
<summary>Đáp án tham khảo</summary>

Với continuing task, on-policy distribution là stationary distribution dưới policy $\pi$. Với episodic task, phân bố phụ thuộc vào cách chọn initial state: gọi $h(s)$ là xác suất episode bắt đầu ở $s$ và $\eta(s)$ là số bước trung bình ở $s$ trong một episode, thì $\eta(s) = h(s) + \sum_{\bar{s}} \eta(\bar{s}) \sum_a \pi(a|\bar{s}) p(s|\bar{s},a)$. On-policy distribution là $\mu(s) = \eta(s) / \sum_{s'} \eta(s')$. Discounting ($\gamma < 1$) được xử lý như một dạng termination bằng cách thêm hệ số $\gamma$ vào số hạng thứ hai. Hai trường hợp hành xử tương tự nhưng phải phân tích riêng.

</details>

**Câu 5.** $\overline{VE}$ có chắc chắn là mục tiêu đúng cho RL không, và ta kỳ vọng đạt tới loại nghiệm nào (global vs local optimum) với linear so với nonlinear function approximator?

<details>
<summary>Đáp án tham khảo</summary>

Không hoàn toàn rõ $\overline{VE}$ là mục tiêu đúng, vì mục đích cuối cùng là tìm policy tốt hơn, mà value function tốt nhất cho mục đích đó không nhất thiết tối thiểu hóa $\overline{VE}$; tuy nhiên hiện chưa có mục tiêu thay thế tốt hơn. Với linear function approximator, đôi khi đạt được global optimum $\mathbf{w}^*$. Với function approximator phức tạp như ANN hay decision tree, thường chỉ đạt local optimum, và trong nhiều trường hợp không có bảo đảm hội tụ tới optimum hay tới khoảng cách bị chặn — một số phương pháp thậm chí có thể diverge ($\overline{VE} \to \infty$).

</details>

## 9.3 Stochastic-gradient and Semi-gradient Methods

**Câu 6.** Viết dạng tổng quát của SGD update cho state-value prediction với target $U_t$, và nêu điều kiện để $\mathbf{w}_t$ hội tụ tới local optimum.

<details>
<summary>Đáp án tham khảo</summary>

$\mathbf{w}_{t+1} = \mathbf{w}_t + \alpha\,[U_t - \hat{v}(S_t,\mathbf{w}_t)]\,\nabla \hat{v}(S_t,\mathbf{w}_t)$, với $\alpha$ là step-size dương. Nếu $U_t$ là unbiased estimate của $v_\pi(S_t)$, tức $\mathbb{E}[U_t | S_t = s] = v_\pi(s)$ với mọi $t$, thì $\mathbf{w}_t$ được bảo đảm hội tụ tới một local optimum dưới điều kiện stochastic approximation thông thường (step-size $\alpha$ giảm dần theo điều kiện 2.7). SGD chỉ đi một bước nhỏ theo gradient để cân bằng sai số giữa các state, chứ không loại bỏ hoàn toàn sai số trên một ví dụ.

</details>

**Câu 7.** Vì sao gradient Monte Carlo là true gradient method nhưng semi-gradient TD(0) thì không? Giải thích thuật ngữ "semi-gradient".

<details>
<summary>Đáp án tham khảo</summary>

Monte Carlo dùng target $U_t = G_t$, là unbiased estimate của $v_\pi(S_t)$ và độc lập với $\mathbf{w}_t$, nên bước từ (9.4) sang (9.5) hợp lệ và đây là true gradient descent, hội tụ tới local optimum. Bootstrapping target như $R_{t+1} + \gamma\hat{v}(S_{t+1},\mathbf{w}_t)$ (TD(0)) hoặc $n$-step return phụ thuộc vào $\mathbf{w}_t$ hiện tại, nên bị biased và không tạo ra true gradient. Các phương pháp này tính tới ảnh hưởng của việc đổi $\mathbf{w}_t$ lên estimate nhưng bỏ qua ảnh hưởng lên target — chỉ gồm một phần của gradient, do đó gọi là semi-gradient methods.

</details>

**Câu 8.** Nêu hai ưu điểm thực tế khiến semi-gradient methods (như semi-gradient TD(0)) thường được ưa chuộng dù không hội tụ robust như true gradient methods.

<details>
<summary>Đáp án tham khảo</summary>

Thứ nhất, chúng thường học nhanh hơn đáng kể (variance thấp hơn so với Monte Carlo, như đã thấy ở Chương 6 và 7). Thứ hai, chúng cho phép học liên tục và online, không cần đợi đến cuối episode, nên dùng được cho continuing problem và mang lại lợi thế về tính toán. Ngoài ra, trong các trường hợp quan trọng như linear case, semi-gradient methods vẫn hội tụ đáng tin cậy. State aggregation là một dạng đơn giản của SGD, trong đó gradient là 1 cho component của nhóm chứa $S_t$ và 0 cho các component khác.

</details>

## 9.4 Linear Methods

**Câu 9.** Trong linear methods, $\hat{v}(s,\mathbf{w})$ được biểu diễn ra sao, và update SGD rút gọn thành dạng nào? Vì sao linear case đặc biệt thuận lợi để phân tích?

<details>
<summary>Đáp án tham khảo</summary>

$\hat{v}(s,\mathbf{w}) = \mathbf{w}^\top \mathbf{x}(s) = \sum_{i=1}^{d} w_i x_i(s)$, là inner product giữa weight vector và feature vector $\mathbf{x}(s)$. Vì $\nabla \hat{v}(s,\mathbf{w}) = \mathbf{x}(s)$, update rút gọn thành $\mathbf{w}_{t+1} = \mathbf{w}_t + \alpha[U_t - \hat{v}(S_t,\mathbf{w}_t)]\,\mathbf{x}(S_t)$. Linear case thuận lợi vì chỉ có một optimum (hoặc một tập optimum tương đương), nên bất kỳ phương pháp nào hội tụ tới local optimum cũng tự động hội tụ tới global optimum. Hầu hết các kết quả convergence hữu ích đều dành cho linear (hoặc đơn giản hơn).

</details>

**Câu 10.** TD fixed point $\mathbf{w}_{TD}$ là gì, và linear semi-gradient TD(0) hội tụ tới đâu? Điều kiện then chốt nào trên ma trận $A$ bảo đảm tính ổn định?

<details>
<summary>Đáp án tham khảo</summary>

TD fixed point là $\mathbf{w}_{TD} = A^{-1}\mathbf{b}$, trong đó $A = \mathbb{E}[\mathbf{x}_t(\mathbf{x}_t - \gamma \mathbf{x}_{t+1})^\top]$ và $\mathbf{b} = \mathbb{E}[R_{t+1}\mathbf{x}_t]$. Linear semi-gradient TD(0) hội tụ tới điểm này (gần local optimum, không phải global optimum). Tính ổn định được bảo đảm khi $A$ là positive definite ($\mathbf{y}^\top A \mathbf{y} > 0$ với mọi $\mathbf{y} \ne 0$); điều này cũng bảo đảm $A^{-1}$ tồn tại. Trong continuing case với $\gamma < 1$, $A = \mathbf{X}^\top D(I - \gamma P)\mathbf{X}$ là positive definite vì on-policy distribution là stationary, nên on-policy TD(0) ổn định.

</details>

**Câu 11.** Tại TD fixed point, $\overline{VE}$ bị chặn như thế nào so với sai số nhỏ nhất, và điều này hàm ý gì khi đánh đổi với Monte Carlo? Điều kiện then chốt nào để có bảo đảm hội tụ này?

<details>
<summary>Đáp án tham khảo</summary>

Trong continuing case: $\overline{VE}(\mathbf{w}_{TD}) \le \frac{1}{1-\gamma} \min_{\mathbf{w}} \overline{VE}(\mathbf{w})$. Tức sai số tiệm cận của TD không vượt quá $\frac{1}{1-\gamma}$ lần sai số nhỏ nhất (đạt được tiệm cận bởi Monte Carlo). Vì $\gamma$ thường gần 1 nên hệ số mở rộng này có thể lớn, nghĩa là TD có thể thua thiệt về hiệu năng tiệm cận; bù lại TD có variance thấp hơn nhiều và thường nhanh hơn. Điều kiện then chốt là các state được cập nhật theo on-policy distribution — với phân bố update khác, bootstrapping methods dùng function approximation có thể diverge tới vô cực (xem Chương 11).

</details>

## 9.5 Feature Construction for Linear Methods

**Câu 12.** Hạn chế cơ bản của linear form về việc biểu diễn tương tác giữa các feature là gì? Cho ví dụ và cách khắc phục.

<details>
<summary>Đáp án tham khảo</summary>

Linear form không thể biểu diễn tương tác (interaction) giữa các feature — ví dụ feature $i$ chỉ tốt khi vắng mặt feature $j$. Trong bài pole-balancing, high angular velocity có thể tốt hay xấu tùy angle: nếu angle cao thì sắp ngã (xấu), nếu angle thấp thì pole đang tự cân bằng (tốt). Một linear value function không biểu diễn được điều này nếu chỉ code riêng angle và angular velocity. Cách khắc phục là thêm feature cho các tổ hợp (combination/product) của các state dimension, ví dụ feature tích như $s_1 s_2$ trong polynomial basis.

</details>

**Câu 13.** So sánh ngắn gọn polynomials và Fourier basis cho online RL: ưu/nhược điểm và khuyến nghị của tác giả.

<details>
<summary>Đáp án tham khảo</summary>

Order-$n$ polynomial basis cho $k$ dimension có $(n+1)^k$ feature, đơn giản và quen thuộc nhưng generalize kém trong online learning — tác giả không khuyến nghị dùng polynomials cho online learning. Fourier cosine basis biểu diễn hàm bằng tổ hợp các cosine $x_i(s) = \cos(\pi \mathbf{s}^\top \mathbf{c}^i)$; dễ dùng, hiệu năng tốt trong nhiều bài, và cho phép chọn feature bằng cách đặt các vector $\mathbf{c}^i$ theo tương tác nghi ngờ. Nhược điểm: Fourier gặp khó với discontinuity ("ringing") và vì non-zero trên toàn không gian nên biểu diễn global property, khó nắm bắt local property.

</details>

**Câu 14.** Coarse coding là gì, và quan hệ giữa kích thước/hình dạng receptive field với generalization và acuity (độ phân giải cuối cùng)?

<details>
<summary>Đáp án tham khảo</summary>

Coarse coding biểu diễn state bằng các feature có receptive field chồng lấp (ví dụ các đường tròn), feature có giá trị 1 nếu state nằm trong field và 0 nếu không. Generalization từ state $s$ sang $s'$ phụ thuộc số feature mà field của chúng cùng phủ. Kích thước và hình dạng receptive field quyết định initial generalization: field lớn cho generalization rộng, field nhỏ cho generalization hẹp; field thuôn dài cho generalization bất đối xứng. Tuy nhiên acuity (độ phân biệt mịn nhất cuối cùng) lại được kiểm soát chủ yếu bởi tổng số feature, chứ không phải bởi độ rộng của field.

</details>

**Câu 15.** Tile coding là gì, và hai ưu điểm thực tế nổi bật của nó? Nêu vai trò của multiple tilings và của asymmetric offset.

<details>
<summary>Đáp án tham khảo</summary>

Tile coding là một dạng coarse coding cho không gian liên tục đa chiều: receptive field được nhóm thành các partition gọi là tiling, mỗi phần tử là một tile. Một tiling đơn lẻ chỉ là state aggregation; để có coarse coding thực sự cần multiple tilings, mỗi cái offset đi một phần độ rộng tile, nên số feature active luôn bằng số tiling. Ưu điểm: (1) số feature active cố định cho mọi state, cho phép đặt step-size trực quan (ví dụ $\alpha = 1/n$ cho one-trial learning); (2) dùng binary feature nên tính $\hat{v}$ rất rẻ (chỉ cộng $n \ll d$ component). Asymmetric offset (ví dụ displacement vector các số lẻ đầu tiên $(1,3,5,\dots)$) tránh các diagonal artifact mà uniform offset gây ra, cho generalization đều và "spherical" hơn. Hashing giúp giảm bộ nhớ và chống curse of dimensionality.

</details>

**Câu 16.** Radial Basis Functions (RBF) khác coarse coding/tile coding ở điểm nào, và ưu/nhược điểm chính của RBF là gì?

<details>
<summary>Đáp án tham khảo</summary>

RBF là tổng quát hóa của coarse coding sang feature liên tục: thay vì 0/1, mỗi feature nhận giá trị trong $[0,1]$ theo đáp ứng Gaussian $x_i(s) = \exp\!\big(-\frac{\|s - c_i\|^2}{2\sigma_i^2}\big)$, phụ thuộc khoảng cách giữa state và center $c_i$ và width $\sigma_i$. Ưu điểm: tạo ra hàm xấp xỉ biến thiên trơn (smooth) và differentiable. Nhược điểm: chi phí tính toán cao hơn tile coding và thường giảm hiệu năng khi có hơn hai state dimension (khó kiểm soát graded activation gần edge ở high dimension). RBF network là linear function approximator dùng RBF; nếu điều chỉnh cả center/width thì trở thành nonlinear, fit chính xác hơn nhưng phức tạp và cần tuning thủ công nhiều hơn.

</details>

## 9.6 Selecting Step-Size Parameters Manually

**Câu 17.** Vì sao lựa chọn cổ điển $\alpha_t = 1/t$ không phù hợp cho TD/function approximation, và rule of thumb để đặt step-size cho linear SGD là gì?

<details>
<summary>Đáp án tham khảo</summary>

$\alpha_t = 1/t$ tạo ra sample average phù hợp cho tabular MC, nhưng không phù hợp cho TD methods, bài nonstationary, hay bất kỳ phương pháp function approximation nào (vì target thay đổi). Lý thuyết stochastic approximation cho điều kiện step-size giảm chậm bảo đảm hội tụ nhưng thường quá chậm. Rule of thumb cho linear SGD: nếu muốn học trong khoảng $\tau$ lần gặp cùng một feature vector, đặt $\alpha = (\tau\,\mathbb{E}[\mathbf{x}^\top \mathbf{x}])^{-1}$, với $\mathbf{x}$ lấy từ cùng phân bố input. Phương pháp này hiệu quả nhất khi độ dài feature vector không biến thiên nhiều (lý tưởng là $\mathbf{x}^\top \mathbf{x}$ hằng số).

</details>

## 9.7 Nonlinear Function Approximation: Artificial Neural Networks

**Câu 18.** Theo universal approximation property, một ANN một hidden layer có thể làm gì, và vì sao nonlinearity là thiết yếu? Vì sao trong thực tế người ta vẫn dùng deep (nhiều hidden layer)?

<details>
<summary>Đáp án tham khảo</summary>

Một ANN với một hidden layer chứa đủ nhiều sigmoid unit có thể xấp xỉ bất kỳ hàm liên tục nào trên một vùng compact tới độ chính xác tùy ý (Cybenko, 1989). Nonlinearity là thiết yếu vì nếu mọi unit là linear thì toàn mạng tương đương một mạng không có hidden layer (linear của linear vẫn là linear). Dù vậy, cả kinh nghiệm lẫn lý thuyết cho thấy xấp xỉ các hàm phức tạp dễ hơn — thậm chí cần — các abstraction phân cấp qua nhiều layer (deep architecture). Huấn luyện hidden layer là cách tự động tạo feature phù hợp với bài toán, thay vì dựa hoàn toàn vào hand-crafted features.

</details>

**Câu 19.** Nêu vai trò của backpropagation và hai khó khăn chính khi huấn luyện deep ANN; kể tên vài kỹ thuật giảm overfitting hoặc hỗ trợ huấn luyện deep.

<details>
<summary>Đáp án tham khảo</summary>

Backpropagation gồm các forward pass (tính activation) và backward pass (tính partial derivative cho mỗi weight) để ước lượng gradient của objective. Nó hoạt động tốt cho mạng nông (1–2 hidden layer) nhưng kém với mạng sâu vì: (1) overfitting do số weight rất lớn; (2) partial derivative khi truyền ngược hoặc suy giảm nhanh (học chậm) hoặc tăng nhanh (học bất ổn) về phía input. Các kỹ thuật giảm overfitting: cross validation (early stopping), regularization, weight sharing, và dropout. Các kỹ thuật hỗ trợ huấn luyện deep: pretraining unsupervised từng layer (deep belief networks), batch normalization, deep residual learning (skip connections), và deep convolutional network với weight sharing/subsampling.

</details>

## 9.8 Least-Squares TD

**Câu 20.** LSTD làm gì khác với semi-gradient TD(0), và đánh đổi chính giữa hai phương pháp là gì (kèm độ phức tạp tính toán/bộ nhớ)?

<details>
<summary>Đáp án tham khảo</summary>

Thay vì lặp tiến dần tới TD fixed point, LSTD ước lượng trực tiếp $\hat{A}_t = \sum_k \mathbf{x}_k(\mathbf{x}_k - \gamma\mathbf{x}_{k+1})^\top + \varepsilon I$ và $\hat{\mathbf{b}}_t = \sum_k R_{k+1}\mathbf{x}_k$, rồi tính $\mathbf{w}_t = \hat{A}_t^{-1}\hat{\mathbf{b}}_t$ (hệ số $\varepsilon I$ bảo đảm khả nghịch). LSTD là dạng data-efficient nhất của linear TD(0). Đánh đổi: nó tốn $O(d^2)$ bộ nhớ và tính toán mỗi bước (dùng Sherman-Morrison để cập nhật nghịch đảo incremental), so với $O(d)$ của semi-gradient TD(0). LSTD không cần step-size nhưng cần $\varepsilon$ và không bao giờ "quên", nên gây vấn đề khi policy thay đổi (GPI) — thường phải thêm cơ chế forgetting.

</details>

## 9.9 Memory-based Function Approximation

**Câu 21.** Memory-based (nonparametric) function approximation khác parametric approach ở điểm cốt lõi nào, và vì sao nó phù hợp với RL?

<details>
<summary>Đáp án tham khảo</summary>

Parametric approach điều chỉnh tham số của một functional form cố định và có thể bỏ training example sau khi update. Memory-based methods (lazy learning) chỉ lưu training example vào bộ nhớ mà không cập nhật tham số; khi cần giá trị cho query state, chúng truy hồi tập example liên quan (thường theo khoảng cách) và tính giá trị cục bộ (nearest neighbor, weighted average, locally weighted regression). Vì nonparametric, dạng hàm không bị giới hạn trước và độ chính xác tăng khi có thêm dữ liệu. Phù hợp với RL vì: tập trung xấp xỉ vào local neighborhood của các state thực sự được thăm (trajectory sampling), cho kinh nghiệm có ảnh hưởng tức thời, và tránh curse of dimensionality (bộ nhớ tuyến tính theo số example và số chiều, không phải hàm mũ).

</details>

## 9.10 Kernel-based Function Approximation

**Câu 22.** Kernel function $k(s, s')$ biểu diễn điều gì, và "kernel trick" mang lại lợi ích gì khi liên hệ với linear parametric function approximation?

<details>
<summary>Đáp án tham khảo</summary>

Kernel function $k(s,s')$ là trọng số gán cho dữ liệu về $s'$ khi trả lời query về $s$, tức một thước đo strength of generalization từ $s'$ sang $s$. Kernel regression tính kernel-weighted average của target: $\hat{v}(s,\mathcal{D}) = \sum_{s' \in \mathcal{D}} k(s,s') g(s')$. Mọi linear parametric method với feature vector $\mathbf{x}(s)$ có thể viết lại thành kernel regression với $k(s,s') = \mathbf{x}(s)^\top \mathbf{x}(s')$. Kernel trick: thay vì xây feature, ta có thể xây trực tiếp kernel function; nhiều kernel có dạng compact tính được mà không cần làm việc trong không gian $d$ chiều, nên hiệu quả hơn nhiều khi feature space rất lớn — về bản chất làm việc trong feature space cao chiều nhưng chỉ thao tác với tập example đã lưu.

</details>

## 9.11 Interest and Emphasis

**Câu 23.** Định nghĩa interest $I_t$ và emphasis $M_t$, mối quan hệ giữa chúng, và chúng tác động ra sao đến phân bố $\mu$ và update?

<details>
<summary>Đáp án tham khảo</summary>

Interest $I_t$ là một scalar không âm chỉ mức độ ta quan tâm đến việc định giá chính xác state (hay state–action) tại thời điểm $t$ (0 nếu không quan tâm); nó có thể đặt theo bất kỳ cách causal nào. Phân bố $\mu$ trong $\overline{VE}$ được định nghĩa lại là phân bố state gặp khi theo target policy, có trọng số theo interest. Emphasis $M_t$ là scalar không âm nhân vào learning update để nhấn mạnh/giảm nhẹ việc học tại $t$. Update tổng quát: $\mathbf{w}_{t+n} = \mathbf{w}_{t+n-1} + \alpha M_t [G_{t:t+n} - \hat{v}(S_t,\mathbf{w}_{t+n-1})]\nabla\hat{v}(S_t,\mathbf{w}_{t+n-1})$, với emphasis xác định đệ quy từ interest: $M_t = I_t + \gamma^n M_{t-n}$. Bằng cách tập trung tài nguyên function approximation vào các state ta thực sự quan tâm, interest và emphasis có thể cho value estimate chính xác hơn (ví dụ định giá đúng leftmost state mà phương pháp không dùng interest/emphasis chỉ cho giá trị trung gian).

</details>

## 9.12 Summary

**Câu 24.** Tóm tắt: vì sao $n$-step semi-gradient TD bao trùm cả gradient Monte Carlo lẫn semi-gradient TD(0), và bound hội tụ của linear semi-gradient $n$-step TD thay đổi thế nào theo $n$?

<details>
<summary>Đáp án tham khảo</summary>

$n$-step semi-gradient TD là thuật toán tự nhiên cho on-policy prediction: nó bao gồm semi-gradient TD(0) khi $n = 1$ và gradient Monte Carlo khi $n = \infty$. Đây là semi-gradient method vì weight vector xuất hiện trong target nhưng không được tính vào gradient. Với linear function approximation, linear semi-gradient $n$-step TD được bảo đảm hội tụ (dưới điều kiện chuẩn) tới một $\overline{VE}$ nằm trong một bound quanh sai số tối ưu (đạt tiệm cận bởi Monte Carlo). Bound này luôn chặt hơn khi $n$ lớn hơn và tiến về 0 khi $n \to \infty$. Tuy nhiên trong thực tế $n$ rất lớn khiến học rất chậm, nên thường nên có một mức độ bootstrapping ($n < \infty$), tương tự kết luận ở Chương 6 và 7.

</details>
