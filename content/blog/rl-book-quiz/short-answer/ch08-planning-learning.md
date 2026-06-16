# Chương 8: Planning and Learning with Tabular Methods — Câu hỏi trả lời ngắn

> Bộ câu hỏi trả lời ngắn (short-answer) ôn tập Chương 8, sách *Reinforcement Learning: An Introduction* (Sutton & Barto, 2nd ed.). Đáp án tham khảo dùng cho việc LLM chấm điểm.

## 8.1 Models and Planning

**Câu 1.** Phân biệt *distribution model* và *sample model*. Loại nào "mạnh" hơn và trong thực tế loại nào thường dễ thu được hơn?

<details>
<summary>Đáp án tham khảo</summary>

Một *model* là bất cứ thứ gì agent dùng để dự đoán phản ứng của môi trường: cho state và action, nó dự đoán next state và next reward. *Distribution model* tạo ra mô tả tất cả các khả năng cùng xác suất của chúng (ví dụ p(s', r | s, a) trong dynamic programming). *Sample model* chỉ tạo ra một khả năng duy nhất, được lấy mẫu (sampled) theo phân phối đó (ví dụ model blackjack ở Chương 5). Distribution model mạnh hơn vì luôn có thể dùng nó để sinh sample. Tuy nhiên trong nhiều ứng dụng, sample model dễ thu được hơn nhiều (ví dụ mô phỏng tung 12 con xúc xắc thì viết chương trình sample dễ hơn liệt kê mọi tổng và xác suất).

</details>

**Câu 2.** Trong sách, *planning* được định nghĩa như thế nào? Nêu cấu trúc chung mà mọi phương pháp *state-space planning* cùng chia sẻ.

<details>
<summary>Đáp án tham khảo</summary>

*Planning* là bất kỳ quá trình tính toán nào nhận một model làm đầu vào và tạo ra hoặc cải thiện một policy để tương tác với môi trường được mô hình hóa (model → planning → policy). Mọi state-space planning method chia sẻ cấu trúc chung gồm hai ý: (1) đều tính value functions như một bước trung gian chủ chốt để cải thiện policy, và (2) tính value functions bằng các update/backup operations áp dụng lên *simulated experience*. Sơ đồ chung: model → simulated experience → (updates/backups) → values → policy. Các phương pháp chỉ khác nhau ở loại update, thứ tự thực hiện, và thời gian giữ lại thông tin đã backup.

</details>

**Câu 3.** Điểm giống và khác cốt lõi giữa *planning* và *learning* là gì? Vì sao điều này cho phép chuyển đổi thuật toán giữa hai bên?

<details>
<summary>Đáp án tham khảo</summary>

Cốt lõi của cả learning lẫn planning đều là ước lượng value functions bằng các backing-up update operations. Khác biệt chính: planning dùng *simulated experience* sinh ra từ model, còn learning dùng *real experience* sinh ra từ môi trường. Vì cùng cấu trúc, nhiều ý tưởng và thuật toán có thể chuyển giao giữa hai bên: một learning algorithm có thể thay thế bước update chốt của một planning method, vì learning chỉ cần experience làm đầu vào và áp dụng được lên simulated experience hệt như real experience (ví dụ random-sample one-step tabular Q-planning dùng Q-learning trên sample từ model).

</details>

## 8.2 Dyna: Integrated Planning, Acting, and Learning

**Câu 4.** Mô tả kiến trúc Dyna: các thành phần chính và hai vai trò của real experience.

<details>
<summary>Đáp án tham khảo</summary>

Dyna tích hợp bốn quá trình diễn ra liên tục: planning, acting, model-learning, và direct RL. Real experience có hai vai trò: (1) cải thiện model cho khớp môi trường hơn (*model-learning*), và (2) cải thiện trực tiếp value function/policy bằng các phương pháp RL (*direct RL*). Cải thiện gián tiếp qua model gọi là indirect RL, chính là phần liên quan tới planning. Quá trình chọn starting state/action cho simulated experience gọi là *search control*. RL method là "final common path" chung cho cả learning (từ real experience) và planning (từ simulated experience), hai bên chỉ khác nguồn experience.

</details>

**Câu 5.** Trong pseudocode Tabular Dyna-Q, bước (d), (e), (f) tương ứng với chức năng gì? Nếu bỏ (e) và (f) thì thuật toán còn lại là gì?

<details>
<summary>Đáp án tham khảo</summary>

Bước (d) là *direct RL* (one-step tabular Q-learning trên transition vừa quan sát). Bước (e) là *model-learning*: ghi nhận Model(S,A) ← R, S' (giả định môi trường deterministic, lưu next state/reward quan sát gần nhất). Bước (f) là *planning*: lặp n lần, mỗi lần lấy ngẫu nhiên một state-action pair đã từng trải nghiệm, truy vấn model để lấy R, S', rồi áp dụng cập nhật Q-learning lên simulated experience đó. Nếu bỏ (e) và (f), phần còn lại chính là one-step tabular Q-learning thuần.

</details>

**Câu 6.** Trong ví dụ Dyna Maze, tại sao agent có nhiều planning steps (ví dụ n=50) tìm ra policy nhanh hơn nhiều so với agent không planning (n=0)?

<details>
<summary>Đáp án tham khảo</summary>

Với n=0 (chỉ direct RL một bước), mỗi episode chỉ học thêm được một bước (bước cuối trước goal), nên thông tin lan truyền rất chậm. Với planning (n=50), trong cùng một episode, quá trình planning trên simulated experience lan truyền giá trị ngược về nhiều state khác trong khi agent vẫn đang lang thang gần start; nhờ đó một policy mở rộng được hình thành gần như tới tận start state ngay trong episode thứ hai. Trong thực nghiệm, agent n=0 cần khoảng 25 episode để đạt (ε-)tối ưu, n=5 cần khoảng 5 episode, còn n=50 chỉ cần khoảng 3 episode.

</details>

## 8.3 When the Model Is Wrong

**Câu 7.** Khi model bị sai, hai tình huống nào dễ/khó được phát hiện và sửa chữa? Mô tả ngắn qua ví dụ Blocking Maze và Shortcut Maze.

<details>
<summary>Đáp án tham khảo</summary>

Dễ sửa khi model *optimistic* (dự đoán reward/transition tốt hơn thực tế): policy được plan ra sẽ cố khai thác cơ hội đó và nhanh chóng phát hiện chúng không tồn tại — như Blocking Maze, khi đường ngắn bị chặn, agent loanh quanh rồi tìm ra đường mới. Khó sửa khi môi trường *trở nên tốt hơn* mà policy đúng cũ không hé lộ cải thiện — như Shortcut Maze: một đường tắt mới mở ra nhưng Dyna-Q thường không bao giờ phát hiện vì model nói không có đường tắt, càng plan thì càng ít có khả năng bước sang phải để khám phá. Đây là biểu hiện của xung đột exploration/exploitation trong ngữ cảnh planning (exploration = thử action cải thiện model, exploitation = hành xử tối ưu theo model hiện tại).

</details>

**Câu 8.** Dyna-Q+ dùng heuristic gì để khuyến khích exploration? Viết rõ cách tính *exploration bonus*.

<details>
<summary>Đáp án tham khảo</summary>

Dyna-Q+ theo dõi với mỗi state-action pair số time step τ đã trôi qua kể từ lần cuối pair đó được thử trong tương tác thật. Pair càng lâu chưa thử thì khả năng model của nó đã sai càng lớn. Để khuyến khích thử lại các action lâu chưa dùng, nó cộng một *bonus reward* vào simulated experience: nếu reward được model trả về là r và transition chưa được thử trong τ bước, thì planning update làm như thể transition cho reward r + κ√τ, với κ là một hằng số nhỏ. Điều này thúc đẩy agent liên tục kiểm tra mọi transition tiếp cận được, thậm chí chịu chuỗi action dài để thực hiện kiểm tra ("computational curiosity"). (Dyna-Q+ cũng cho phép xét các action chưa từng thử trong bước planning, và khởi tạo model cho chúng là quay về chính state đó với reward 0.)

</details>

## 8.4 Prioritized Sweeping

**Câu 9.** Ý tưởng cốt lõi của *prioritized sweeping* là gì? Giải thích cơ chế *backward focusing* và hàng đợi ưu tiên.

<details>
<summary>Đáp án tham khảo</summary>

Thay vì chọn state-action pair đồng đều ngẫu nhiên (như Dyna-Q), prioritized sweeping tập trung update vào những pair hữu ích nhất. *Backward focusing*: khi value của một state thay đổi, chỉ những update của các action dẫn trực tiếp vào state đó mới hữu ích; cập nhật chúng có thể làm value của các predecessor thay đổi tiếp, và ta lan truyền ngược (backward) như vậy cho tới khi lắng dịu. Để xếp ưu tiên, duy trì một *priority queue* chứa mọi state-action pair mà value sẽ thay đổi đáng kể nếu được update, ưu tiên theo độ lớn của thay đổi. Khi update pair đầu hàng đợi, tính ảnh hưởng lên từng predecessor; nếu vượt ngưỡng θ thì chèn predecessor vào hàng đợi với priority mới. Cách này lan truyền hiệu ứng thay đổi một cách hiệu quả, trong các bài toán maze nhanh hơn Dyna-Q không ưu tiên khoảng 5–10 lần.

</details>

**Câu 10.** Prioritized sweeping (bản cho môi trường stochastic) dùng loại update nào, và hạn chế của lựa chọn đó là gì?

<details>
<summary>Đáp án tham khảo</summary>

Với môi trường stochastic, prioritized sweeping mở rộng bằng cách giữ count số lần mỗi state-action pair được trải nghiệm và các next state đã xảy ra, rồi update bằng *expected update* (tính trên tất cả next state có thể cùng xác suất) thay vì sample update. Hạn chế: expected update có thể lãng phí nhiều tính toán vào các transition có xác suất thấp. Như mục 8.5 chỉ ra, sample update trong nhiều trường hợp lại tiếp cận gần value function thật với ít tính toán hơn dù có sampling error, vì nó chia nhỏ phép backup theo từng transition và tập trung vào những phần tác động lớn nhất.

</details>

## 8.5 Expected vs. Sample Updates

**Câu 11.** Trình bày tradeoff giữa *expected update* và *sample update*. Khi nào nên ưu tiên loại nào?

<details>
<summary>Đáp án tham khảo</summary>

*Expected update* xét tất cả next state có thể cùng xác suất nên cho ước lượng tốt hơn (không bị sampling error), nhưng tốn khoảng b lần tính toán hơn (b là branching factor — số next state có xác suất > 0). *Sample update* chỉ xét một next state mẫu nên rẻ hơn nhưng chịu sampling error. Nếu đủ thời gian hoàn thành một expected update thì kết quả thường tốt hơn b sample update. Nhưng nếu không đủ thời gian (bài toán lớn, nhiều state-action pair), sample update được ưu tiên vì với cùng một đơn vị tính toán, ta có thể làm b sample update tại nhiều pair khác nhau và mỗi cái cải thiện được phần nào; với b lớn vừa phải, error giảm mạnh chỉ sau một phần nhỏ của b update. Vậy sample update thường ưu việt hơn cho bài toán có stochastic branching factor lớn và quá nhiều state để giải chính xác.

</details>

**Câu 12.** Theo ba "binary dimensions" của one-step update, Dyna-Q dùng loại update nào? Và DP đòi hỏi loại model gì?

<details>
<summary>Đáp án tham khảo</summary>

One-step update biến thiên theo ba chiều nhị phân: (1) state values hay action values; (2) ước lượng cho optimal policy hay cho một policy cho trước; (3) expected update hay sample update — cho ra 8 trường hợp (7 ứng với thuật toán cụ thể). Dyna-Q dùng *q\* sample updates* (ước lượng action value cho optimal policy bằng sample update, kiểu Q-learning). Dynamic programming cần *distribution model* vì nó dùng expected update, đòi hỏi tính kỳ vọng trên mọi next state và reward khả dĩ; còn sample update chỉ cần sample model hoặc real experience.

</details>

## 8.6 Trajectory Sampling

**Câu 13.** *Trajectory sampling* là gì, và vì sao phân phối *on-policy* thường lợi hơn phân phối uniform/exhaustive sweep, ít nhất trong ngắn hạn?

<details>
<summary>Đáp án tham khảo</summary>

*Trajectory sampling*: thay vì quét toàn bộ state space (exhaustive sweep của DP, vốn dành thời gian đều cho mọi state kể cả những state vô nghĩa), ta mô phỏng các trajectory cụ thể bằng cách tương tác với model theo current policy và update tại những state/state-action gặp trên đường đi — tức phân phối update theo *on-policy distribution*. Ưu điểm: dễ sinh (chỉ cần follow policy), và tập trung vào những state mà agent thực sự gặp (như học cờ thì nghiên cứu thế cờ thật, không phải thế cờ ngẫu nhiên). Trong ngắn hạn nó tăng tốc planning vì tập trung vào hậu duệ gần của start state; lợi ích càng lớn và lâu dài khi state space lớn với branching factor nhỏ. Tuy nhiên về lâu dài nó có thể bất lợi vì cứ update mãi những state đã đúng value, trong khi exhaustive sweep vẫn làm việc hữu ích ở nơi khác.

</details>

## 8.7 Real-time Dynamic Programming

**Câu 14.** RTDP là gì? Kết quả lý thuyết quan trọng nhất của nó (về relevant states và optimal partial policy) là gì?

<details>
<summary>Đáp án tham khảo</summary>

RTDP (Real-time Dynamic Programming) là một phiên bản on-policy trajectory-sampling của value iteration; nó là một dạng *asynchronous DP*, update value các state theo thứ tự chúng được thăm trong trajectory thật hoặc mô phỏng, bằng expected value-iteration update. Kết quả quan trọng nhất: với một số bài toán thỏa điều kiện hợp lý (undiscounted episodic tasks với absorbing goal states, reward 0 tại goal — tức stochastic optimal path problems), RTDP đảm bảo tìm được policy tối ưu trên các *relevant states* (state có thể tới được từ start state theo một optimal policy nào đó) mà không cần thăm mọi state vô số lần, thậm chí không cần thăm một số state nào cả. Nó tìm *optimal partial policy* (tối ưu trên relevant states, tùy ý/không xác định trên irrelevant states), lợi thế lớn cho state space rất lớn nơi chỉ một single sweep cũng bất khả thi (ví dụ racetrack: chỉ 599/9115 state là relevant, RTDP chỉ cần khoảng 50% số update của DP).

</details>

## 8.8 Planning at Decision Time

**Câu 15.** Phân biệt *background planning* và *decision-time planning*. Mỗi loại phù hợp với tình huống nào?

<details>
<summary>Đáp án tham khảo</summary>

*Background planning* (như DP, Dyna): dùng simulated experience để dần cải thiện policy/value function cho nhiều state; planning đã diễn ra từ trước khi chọn action cho state hiện tại, không tập trung vào state hiện tại. Việc chọn action sau đó chỉ là so sánh các action value đã có. *Decision-time planning*: bắt đầu và hoàn tất planning *sau khi* gặp mỗi state mới St, với đầu ra là việc chọn một action At; có thể nhìn sâu hơn một bước, và value/policy tạo ra thường bị vứt bỏ sau khi dùng. Background planning hợp khi cần phản hồi nhanh (low latency), vì policy tính sẵn áp dụng tức thì; decision-time planning hợp khi không cần phản hồi tức thời (ví dụ cờ vua, được phép tính vài giây tới vài phút mỗi nước).

</details>

## 8.9 Heuristic Search

**Câu 16.** *Heuristic search* hoạt động ra sao, và vì sao nó hiệu quả? Việc tìm sâu hơn một bước mang lại điều gì?

<details>
<summary>Đáp án tham khảo</summary>

Heuristic search là phương pháp decision-time planning cổ điển: với mỗi state gặp phải, dựng một cây lớn các diễn tiến khả dĩ, áp value function (xấp xỉ) lên các leaf node rồi backup ngược về current state ở gốc (backup giống expected update có max như cho v\* và q\*); chọn action tốt nhất rồi vứt bỏ các backed-up value. Hiệu quả của nó chủ yếu đến từ việc *tập trung* tài nguyên tính toán và bộ nhớ vào current state cùng các successor sắp xảy ra. Tìm sâu hơn một bước thường cho action selection tốt hơn khi model hoàn hảo nhưng value function chưa hoàn hảo (tìm tới cuối episode thì action là tối ưu); đổi lại, tìm càng sâu càng tốn tính toán và phản hồi chậm hơn (ví dụ TD-Gammon tìm sâu hơn thì chơi hay hơn nhưng chậm hơn). Lưu ý: cải thiện không phải do dùng multistep update, mà do sự tập trung update vào các state/action ngay sau current state.

</details>

## 8.10 Rollout Algorithms

**Câu 17.** *Rollout algorithm* là gì, dựa trên nguyên lý nào, và mục tiêu của nó là gì (so với việc tìm optimal policy)?

<details>
<summary>Đáp án tham khảo</summary>

Rollout algorithm là phương pháp decision-time planning dựa trên Monte Carlo control áp dụng lên các simulated trajectory đều bắt đầu từ current state. Nó ước lượng action value cho một *rollout policy* bằng cách trung bình return của nhiều trajectory mô phỏng: mỗi trajectory khởi đầu bằng một action khả dĩ rồi tiếp tục theo rollout policy; sau đó thực thi action có giá trị ước lượng cao nhất, rồi lặp lại từ state kế tiếp. Nguyên lý nền tảng là *policy improvement theorem*: chọn action tối đa hóa q_π(s, a) tại current state rồi sau đó theo π sẽ cho policy tốt hơn (hoặc bằng) π. Mục tiêu của rollout *không* phải tìm optimal policy hay ước lượng đầy đủ q\*/q_π, mà chỉ *cải thiện trên rollout policy* tại current state; các ước lượng được dùng ngay rồi vứt bỏ. Chất lượng tùy thuộc rollout policy và độ chính xác ước lượng (rollout policy tốt hơn thì cần nhiều thời gian mô phỏng hơn).

</details>

## 8.11 Monte Carlo Tree Search

**Câu 18.** MCTS là gì và nó cải tiến gì so với rollout algorithm cơ bản? Mô tả bốn bước của một vòng lặp MCTS.

<details>
<summary>Đáp án tham khảo</summary>

MCTS (Monte Carlo Tree Search) là một dạng rollout algorithm decision-time planning, nhưng cải tiến bằng cách *tích lũy* value estimate từ các simulation để dần hướng các simulation sau vào những trajectory có return cao. Nó lưu action value gắn với cạnh của một cây gốc tại current state, mở rộng cây dần dần; bên trong cây dùng một *tree policy* có thông tin (cân bằng exploration/exploitation, ví dụ ε-greedy hay UCB), còn ngoài cây/tại leaf dùng *rollout policy* đơn giản. Bốn bước mỗi vòng lặp: (1) **Selection** — từ root, tree policy duyệt cây dựa trên action value để chọn một leaf node; (2) **Expansion** — (đôi khi bỏ qua) thêm một/nhiều child node từ leaf qua các action chưa khám phá; (3) **Simulation** — từ node được chọn (hoặc child mới), mô phỏng một episode đầy đủ với action chọn theo rollout policy; (4) **Backup** — return của episode mô phỏng được backup để cập nhật/khởi tạo các action value trên các cạnh của cây mà tree policy đã đi qua (không lưu value cho phần ngoài cây). Lặp tới khi hết thời gian, rồi chọn action từ root (ví dụ action có value lớn nhất hoặc visit count lớn nhất). MCTS đã đưa cờ vây máy từ nghiệp dư yếu (2005) lên trình grandmaster (2015), và là nền tảng cho AlphaGo.

</details>

## 8.12 Summary of the Chapter

**Câu 19.** Tóm tắt mối quan hệ giữa loại model và loại update; và nêu hai chiều biến thiên quan trọng giữa các state-space planning method được nhấn mạnh trong chương.

<details>
<summary>Đáp án tham khảo</summary>

Quan hệ model–update: DP cần *distribution model* vì dùng expected update (tính kỳ vọng trên mọi next state/reward); còn sample update (dùng bởi nhiều RL algorithm) chỉ cần *sample model* để mô phỏng tương tác — sample model nói chung dễ thu được hơn nhiều. Planning và learning gần gũi tới mức có thể là cùng một thuật toán chạy trên hai nguồn experience khác nhau (real vs simulated), nên dễ tích hợp planning, acting, model-learning (chúng tương tác vòng tròn, lý tưởng là chạy song song/bất đồng bộ). Hai chiều biến thiên được nhấn mạnh: (1) *size of updates* — update càng nhỏ thì planning càng incremental (nhỏ nhất là one-step sample update như trong Dyna); (2) *distribution/focus of updates* — prioritized sweeping focus backward vào predecessor của state vừa đổi value; on-policy trajectory sampling (và RTDP) focus vào state mà agent có khả năng gặp; còn decision-time planning (heuristic search, rollout, MCTS) focus forward từ current state.

</details>

## 8.13 Summary of Part I: Dimensions

**Câu 20.** Ba ý tưởng chung mà mọi phương pháp trong Phần I chia sẻ là gì? Và hai chiều quan trọng nhất trong Hình 8.11 (không gian các phương pháp RL) là gì?

<details>
<summary>Đáp án tham khảo</summary>

Ba ý tưởng chung: (1) tất cả đều *ước lượng value functions*; (2) tất cả đều hoạt động bằng cách *backing up* value dọc theo các trajectory state thật hoặc khả dĩ; (3) tất cả đều theo chiến lược *generalized policy iteration (GPI)* — duy trì một approximate value function và một approximate policy, liên tục cải thiện cái này dựa trên cái kia. Hai chiều quan trọng nhất trong Hình 8.11: chiều ngang là *width of update* — sample update (dựa trên một sample trajectory, chỉ cần sample model hoặc real experience) hay expected update (dựa trên phân phối các trajectory khả dĩ, cần distribution model); chiều dọc là *depth/length of update* — mức độ bootstrapping, từ one-step TD tới full-return Monte Carlo. Ba phương pháp gốc nằm ở ba góc: DP (one-step expected), TD (one-step sample), Monte Carlo (sample sâu tới cuối); góc còn lại là exhaustive search (expected sâu tới cuối). Một chiều quan trọng thứ ba là on-policy vs off-policy (vuông góc với mặt phẳng hình).

</details>
