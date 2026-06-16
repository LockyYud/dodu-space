# Chương 16: Applications and Case Studies — Câu hỏi trả lời ngắn

> Bộ câu hỏi trả lời ngắn (short-answer) ôn tập Chương 16, sách *Reinforcement Learning: An Introduction* (Sutton & Barto, 2nd ed.). Đáp án tham khảo dùng cho việc LLM chấm điểm.

## 16.1 TD-Gammon

**Câu 1.** Thuật toán học của TD-Gammon kết hợp những thành phần nào, và nó lấy dữ liệu huấn luyện từ đâu? Vai trò của afterstate trong việc chọn nước đi là gì?

<details>
<summary>Đáp án tham khảo</summary>

TD-Gammon kết hợp thuật toán TD(lambda) với function approximation phi tuyến bằng một multilayer ANN, huấn luyện bằng cách backpropagate các TD error. Giá trị v̂(s,w) ước lượng xác suất thắng từ trạng thái s, với reward bằng 0 mọi bước trừ khi thắng. Dữ liệu huấn luyện được tạo bằng self-play: chương trình chơi với chính nó qua vô số ván. Để chọn nước đi, TD-Gammon xét khoảng 20 cách chơi xúc xắc và các afterstate (trạng thái sau nước đi của mình, trước nước của đối thủ), rồi chọn nước dẫn tới afterstate có giá trị ước lượng cao nhất.

</details>

**Câu 2.** TD-Gammon 0.0 đạt được kết quả gì dù gần như không có tri thức backgammon, và tại sao điều đó lại đáng kinh ngạc? Việc thêm tri thức chuyên môn và lookahead search đã tạo ra các phiên bản nào?

<details>
<summary>Đáp án tham khảo</summary>

Sau khoảng 300.000 ván self-play, TD-Gammon 0.0 — với input gần như "raw" và gần như không có tri thức backgammon — chơi xấp xỉ ngang với các chương trình máy tính backgammon tốt nhất trước đó. Điều này đáng kinh ngạc vì mọi chương trình mạnh trước đó (như Neurogammon) đều dùng tri thức chuyên môn được crafting kỹ. Thêm các đặc trưng chuyên biệt nhưng giữ self-play TD learning tạo ra TD-Gammon 1.0 (mạnh hơn hẳn). Các phiên bản sau (2.0, 2.1, 3.0, 3.1) thêm selective two-ply/three-ply search ở thời điểm quyết định, đạt mức chơi gần hoặc vượt các kỳ thủ hàng đầu thế giới.

</details>

## 16.2 Samuel's Checkers Player

**Câu 3.** Samuel dùng hai phương pháp học nào, và phương pháp "learning by generalization" liên hệ thế nào với temporal-difference learning?

<details>
<summary>Đáp án tham khảo</summary>

Hai phương pháp là rote learning (lưu mỗi vị trí cùng giá trị backed-up từ minimax, hiệu quả như cache làm tăng độ sâu tìm kiếm) và learning by generalization (cập nhật tham số của scoring polynomial). Phương pháp thứ hai về ý tưởng giống cách Tesauro làm sau này trong TD-Gammon: chơi với một phiên bản khác của chính nó và cập nhật sau mỗi nước, hướng giá trị của vị trí on-move về giá trị minimax của tìm kiếm phóng từ vị trí on-move tiếp theo. Đây chính là ý tưởng cốt lõi của TD: giá trị một trạng thái nên bằng giá trị các trạng thái kế tiếp.

</details>

**Câu 4.** Phương pháp của Samuel có thể thiếu thành phần cốt lõi nào của một thuật toán TD đúng đắn, và hệ quả là gì?

<details>
<summary>Đáp án tham khảo</summary>

Phương pháp của Samuel khiến value function tự nhất quán với chính nó nhưng thiếu cách neo (tie) value function vào giá trị thật của các trạng thái — tức không có reward và không xử lý đặc biệt các terminal position. Do đó value function có thể trở nên nhất quán một cách vô dụng (ví dụ gán giá trị hằng cho mọi vị trí). Samuel cố ngăn điều này bằng cách cố định trọng số lớn cho piece-advantage feature, nhưng không loại bỏ hoàn toàn nguy cơ. Thực tế chương trình có thể tệ đi theo kinh nghiệm; Samuel phải can thiệp đặt lại trọng số có giá trị tuyệt đối lớn nhất về 0.

</details>

## 16.3 Watson's Daily-Double Wagering

**Câu 5.** Watson tính action value q̂(s, bet) cho việc đặt cược Daily-Double như thế nào, và hai loại ước lượng nào được dùng?

<details>
<summary>Đáp án tham khảo</summary>

Watson tính q̂(s, bet) = pDD × v̂(SW + bet, ...) + (1 − pDD) × v̂(SW − bet, ...), tức trung bình có trọng số giữa giá trị afterstate khi trả lời đúng và khi trả lời sai. Hai loại ước lượng: (1) giá trị afterstate từ state-value function v̂(·,w) — một ANN học theo kiểu TD-Gammon (nonlinear TD(lambda), backpropagate TD error) ước lượng xác suất thắng; (2) "in-category DD confidence" pDD, ước lượng khả năng Watson trả lời đúng clue chưa lộ. Watson thường chọn bet có action value tối đa, nhưng có thêm biện pháp giảm rủi ro (trừ một phần độ lệch chuẩn, cấm các bet làm giá trị afterstate-sai xuống dưới ngưỡng).

</details>

**Câu 6.** Tại sao self-play (như TD-Gammon) KHÔNG được dùng để học value function v̂ của Watson?

<details>
<summary>Đáp án tham khảo</summary>

Self-play không phù hợp vì Watson quá khác mọi đối thủ người, nên self-play sẽ khám phá những vùng state space không điển hình khi chơi với người (đặc biệt các nhà vô địch). Ngoài ra, không như backgammon, Jeopardy! là trò chơi thông tin không hoàn hảo — đối thủ không biết mức độ tự tin của nhau theo từng category, giống như chơi poker với người cầm đúng bộ bài giống mình. Vì thế v̂ được học qua hàng triệu ván mô phỏng đấu với các mô hình người chơi được xây dựng cẩn thận (Average Contestant, Champion, Grand Champion).

</details>

## 16.4 Optimizing Memory Control

**Câu 7.** İpek et al. mô hình hóa bài toán điều khiển bộ nhớ DRAM thành MDP như thế nào (states, actions, reward), và họ dùng thuật toán học nào?

<details>
<summary>Đáp án tham khảo</summary>

Họ mô hình quá trình truy cập DRAM thành MDP: state là nội dung của transaction queue; action là các lệnh tới DRAM (precharge, activate, read, write, NoOp); reward là 1 khi action là read hoặc write, ngược lại là 0 (vì chỉ read/write mới truyền dữ liệu, đóng góp throughput). Chuyển trạng thái là stochastic. Agent dùng Sarsa để học action-value function, với linear function approximation cài bằng tile coding có hashing; exploration là epsilon-greedy. Các ràng buộc timing/resource được áp bằng cách định nghĩa trước tập hành động khả dụng A(St), giữ học trong vùng "an toàn". Controller học online cải thiện 19% trung bình so với FR-FCFS.

</details>

## 16.5 Human-level Video Game Play

**Câu 8.** DQN kết hợp những gì, và điểm đột phá lớn nhất của nó so với các ứng dụng RL trước (như TD-Gammon) về mặt biểu diễn đặc trưng là gì?

<details>
<summary>Đáp án tham khảo</summary>

DQN (deep Q-network) kết hợp Q-learning với một deep convolutional ANN nhiều lớp chuyên xử lý ảnh. Điểm đột phá là nó tự động hóa việc thiết kế đặc trưng: cùng một hệ thống học (cùng raw input 84×84×4, cùng kiến trúc và cùng các tham số) học chơi 49 game Atari 2600 khác nhau mà không cần tập đặc trưng riêng cho từng game (chỉ reset trọng số ngẫu nhiên trước mỗi game), đạt mức người hoặc hơn ở phần lớn game. Trước đó các ứng dụng RL ấn tượng nhất đều cần đặc trưng handcrafted cho từng bài toán.

</details>

**Câu 9.** Mnih et al. đã sửa Q-learning cơ bản theo ba cách nào để tăng tính ổn định, và mỗi cách giải quyết vấn đề gì?

<details>
<summary>Đáp án tham khảo</summary>

(1) Experience replay: lưu các tuple (St, At, Rt+1, St+1) vào replay memory rồi lấy mẫu ngẫu nhiên đồng đều để cập nhật theo mini-batch; điều này cho phép tái dùng kinh nghiệm nhiều lần, giảm tương quan giữa các update (giảm variance) và loại bỏ một nguồn bất ổn (chỉ dùng được vì Q-learning là off-policy). (2) Target network: định kỳ sau C update, copy trọng số sang một mạng nhân bản và giữ cố định, dùng output của nó làm target Q-learning — đưa bài toán gần với supervised learning, tránh dao động/phân kỳ do target phụ thuộc tham số đang cập nhật. (3) Reward/error clipping: kẹp error term trong khoảng [−1, 1] (và reward được chuẩn hóa về +1/−1/0) để ổn định và cho phép dùng một step-size cho mọi game.

</details>

## 16.6 Mastering the Game of Go

**Câu 10.** AlphaGo chọn nước đi bằng phiên bản MCTS nào (APV-MCTS), và các mạng SL-policy network, value network, rollout policy đóng vai trò gì? AlphaGo khởi tạo RL khác TD-Gammon ở điểm nào?

<details>
<summary>Đáp án tham khảo</summary>

AlphaGo dùng "asynchronous policy and value MCTS" (APV-MCTS). Khi mở rộng cây, nó chọn cạnh theo xác suất do SL-policy network (deep conv ANN 13 lớp, huấn luyện supervised để dự đoán ~30 triệu nước của chuyên gia) cung cấp. Khi đánh giá node mới thêm, nó kết hợp hai nguồn: giá trị từ value network và return của rollout, v(s) = (1−η)v_θ(s) + ηG (tốt nhất ở η=0.5). Rollout dùng một rollout policy nhanh (mạng tuyến tính đơn giản học supervised). Value network học bằng Monte Carlo policy evaluation trên self-play của RL policy network (RL policy này khởi tạo từ SL policy rồi cải thiện bằng policy-gradient). Khác TD-Gammon ở chỗ RL không bắt đầu từ trọng số ngẫu nhiên mà từ supervised learning trên dữ liệu chuyên gia người.

</details>

**Câu 11.** Những khác biệt cốt lõi giữa AlphaGo Zero và AlphaGo là gì?

<details>
<summary>Đáp án tham khảo</summary>

Khác biệt chính: (1) AlphaGo Zero không dùng dữ liệu hay tri thức người nào ngoài luật cơ bản (do đó "Zero"), học hoàn toàn bằng self-play reinforcement learning với input raw; AlphaGo dựa thêm vào supervised learning từ nước đi chuyên gia. (2) AlphaGo Zero dùng MCTS xuyên suốt quá trình self-play học (MCTS như một policy improvement operator), trong khi AlphaGo chỉ dùng MCTS lúc live play, không phải trong lúc học. (3) AlphaGo Zero chỉ dùng MỘT deep convolutional ANN "two-headed" (xuất ra cả move probabilities p và value v) thay vì nhiều mạng riêng. (4) MCTS đơn giản hơn — không có rollout đến hết ván nên không cần rollout policy. AlphaGo Zero thực thi một dạng policy iteration và mạnh hơn AlphaGo (thắng 100-0 phiên bản đánh bại Lee Sedol).

</details>

## 16.7 Personalized Web Services

**Câu 12.** Theocharous et al. so sánh hai cách tiếp cận nào cho việc đề xuất quảng cáo, và sự khác biệt cốt lõi cùng các metric đánh giá là gì?

<details>
<summary>Đáp án tham khảo</summary>

Họ so sánh greedy optimization (chỉ tối đa hóa xác suất click ngay, theo kiểu contextual bandit, bỏ qua hệ quả dài hạn) với LTV (life-time value) optimization — một thuật toán RL dựa trên MDP, dùng batch-mode fitted Q iteration (FQI), nhằm tối đa số click qua nhiều lần ghé thăm của cùng người dùng. Khác biệt cốt lõi: LTV tính đến tương tác dài hạn với từng người dùng (dẫn họ "xuống sales funnel"), greedy thì coi mỗi lượt ghé như người mới. Hai metric: CTR = tổng click / tổng lượt visit, và LTV = tổng click / tổng số visitor (phân biệt từng người). Đánh giá dùng high-confidence off-policy evaluation; greedy tốt nhất theo CTR còn LTV tốt nhất theo LTV metric.

</details>

## 16.8 Thermal Soaring

**Câu 13.** Reddy et al. mô hình hóa bài toán thermal soaring thế nào (loại MDP, thuật toán), reward signal nào hoạt động tốt, và những cảm biến/cue nào hóa ra là quan trọng?

<details>
<summary>Đáp án tham khảo</summary>

Họ mô hình bài toán là continuing MDP có discounting, agent điều khiển một glider mô phỏng trong không khí turbulent (đổi angle of attack và bank angle, 3 action). Học bằng one-step Sarsa với state aggregation, chọn action theo phân phối soft-max với temperature parameter τ giảm dần. Reward dựa trên độ cao đạt được cuối episode không hiệu quả; reward tốt nhất là tổ hợp tuyến tính của vertical wind velocity và vertical wind acceleration ở bước trước. Các cue quan trọng nhất hóa ra là vertical wind acceleration và torque (cung cấp thông tin gradient của vận tốc gió theo hai hướng, giúp ở lại trong cột khí bốc lên); nhiệt độ ít giúp ích, và điều khiển angle of attack hữu ích cho di chuyển giữa các thermal hơn là ở lại trong một thermal. Discount cao (γ=0.99) cho kết quả tốt nhất, cho thấy soaring hiệu quả cần tính đến hệ quả dài hạn.

</details>
