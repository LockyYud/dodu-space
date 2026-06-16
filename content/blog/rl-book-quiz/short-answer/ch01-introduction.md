# Chương 1: Introduction — Câu hỏi trả lời ngắn

> Bộ câu hỏi trả lời ngắn (short-answer) ôn tập Chương 1, sách *Reinforcement Learning: An Introduction* (Sutton & Barto, 2nd ed.). Đáp án tham khảo dùng cho việc LLM chấm điểm.

## 1.1 Reinforcement Learning

**Câu 1.** Định nghĩa reinforcement learning là gì? Nêu hai đặc trưng phân biệt quan trọng nhất của nó.

<details>
<summary>Đáp án tham khảo</summary>

Reinforcement learning là học cách làm gì — tức là cách ánh xạ (map) từ các tình huống (situations/states) sang các hành động (actions) — sao cho tối đa hóa một numerical reward signal. Learner không được chỉ bảo hành động nào nên thực hiện, mà phải tự khám phá hành động nào mang lại nhiều reward nhất bằng cách thử (trial-and-error).

Hai đặc trưng phân biệt quan trọng nhất là: (1) trial-and-error search (tìm kiếm bằng thử và sai) và (2) delayed reward (reward bị trì hoãn — hành động có thể ảnh hưởng không chỉ tới immediate reward mà còn tới tình huống kế tiếp và qua đó tất cả reward về sau).

</details>

**Câu 2.** So sánh reinforcement learning với supervised learning và unsupervised learning. Tại sao RL được coi là một paradigm thứ ba?

<details>
<summary>Đáp án tham khảo</summary>

- Supervised learning: học từ một training set gồm các ví dụ đã được gán nhãn (labeled examples) do một external supervisor có hiểu biết cung cấp; mỗi nhãn cho biết hành động đúng cần thực hiện. RL khác ở chỗ trong các bài toán tương tác, thường không thể có sẵn các ví dụ vừa đúng vừa đại diện cho mọi tình huống; agent phải học từ kinh nghiệm của chính nó.
- Unsupervised learning: tìm cấu trúc ẩn (hidden structure) trong dữ liệu không nhãn. RL khác vì mục tiêu là tối đa hóa reward signal chứ không phải tìm cấu trúc ẩn.

Vì RL không thuộc cả hai paradigm trên (không dựa vào ví dụ hành động đúng, cũng không nhằm tìm cấu trúc ẩn), các tác giả coi nó là paradigm thứ ba của machine learning, bên cạnh supervised và unsupervised learning.

</details>

**Câu 3.** Giải thích trade-off giữa exploration và exploitation. Tại sao không thể theo đuổi riêng một trong hai?

<details>
<summary>Đáp án tham khảo</summary>

Để có nhiều reward, agent phải ưu tiên (exploit) những hành động nó đã thử trong quá khứ và thấy hiệu quả. Nhưng để khám phá ra những hành động tốt như vậy, agent phải thử (explore) những hành động chưa từng chọn. Vấn đề (dilemma) là không thể theo đuổi riêng exploration hay exploitation mà không thất bại ở nhiệm vụ: nếu chỉ exploit thì có thể bỏ lỡ hành động tốt hơn; nếu chỉ explore thì không tận dụng được tri thức đã có. Agent phải thử nhiều hành động khác nhau rồi dần ưu tiên những hành động có vẻ tốt nhất; trên bài toán stochastic, mỗi hành động phải được thử nhiều lần để có ước lượng đáng tin về expected reward. Dilemma này đã được nghiên cứu nhiều thập kỷ nhưng vẫn chưa được giải quyết, và nó không xuất hiện trong supervised/unsupervised learning thuần túy.

</details>

## 1.2 Examples

**Câu 4.** Nêu các đặc điểm chung mà tất cả các ví dụ trong mục 1.2 (kỳ thủ cờ vua, bộ điều khiển nhà máy lọc dầu, gazelle calf, mobile robot, Phil chuẩn bị bữa sáng) cùng chia sẻ.

<details>
<summary>Đáp án tham khảo</summary>

Các đặc điểm chung gồm:
- Đều có tương tác (interaction) giữa một active decision-making agent và environment của nó, trong đó agent tìm cách đạt một goal bất chấp uncertainty về environment.
- Hành động của agent có thể ảnh hưởng tới future state của environment, qua đó ảnh hưởng tới các hành động và cơ hội về sau; do đó lựa chọn đúng phải tính tới hậu quả gián tiếp, trì hoãn (delayed consequences), có thể đòi hỏi foresight hoặc planning.
- Tác động của hành động không thể dự đoán hoàn toàn, nên agent phải theo dõi environment thường xuyên và phản ứng thích hợp.
- Đều có goal rõ ràng (explicit) mà agent có thể đánh giá tiến độ dựa trên thứ nó cảm nhận trực tiếp.
- Agent có thể dùng kinh nghiệm (experience) để cải thiện hiệu năng theo thời gian.

</details>

## 1.3 Elements of Reinforcement Learning

**Câu 5.** Liệt kê và định nghĩa ngắn gọn bốn subelement chính của một reinforcement learning system (ngoài agent và environment).

<details>
<summary>Đáp án tham khảo</summary>

- **Policy**: cách hành xử của agent tại một thời điểm; về cơ bản là một ánh xạ (mapping) từ các perceived states sang các hành động cần thực hiện. Policy là cốt lõi của agent vì riêng nó đủ để quyết định hành vi; policy có thể là lookup table đơn giản hoặc đòi hỏi tính toán nhiều, và có thể là stochastic.
- **Reward signal**: định nghĩa goal của bài toán RL. Mỗi time step environment gửi cho agent một con số gọi là reward; mục tiêu duy nhất của agent là tối đa hóa tổng reward về lâu dài. Reward signal định nghĩa cái gì là tốt/xấu trong nghĩa tức thời và là cơ sở chính để thay đổi policy.
- **Value function**: chỉ ra cái gì tốt về lâu dài; value của một state là tổng reward mà agent có thể kỳ vọng tích lũy về sau, bắt đầu từ state đó.
- **Model of the environment** (tùy chọn / optional): thứ mô phỏng hành vi của environment, cho phép suy luận về cách environment sẽ phản ứng (ví dụ: cho state và action, dự đoán next state và next reward); dùng cho planning.

</details>

**Câu 6.** Phân biệt reward và value. Tại sao value khó xác định hơn reward, và tại sao quyết định lại dựa trên value chứ không phải reward?

<details>
<summary>Đáp án tham khảo</summary>

Reward chỉ ra cái gì tốt theo nghĩa tức thời (immediate), thể hiện desirability nội tại của state; value chỉ ra cái gì tốt về lâu dài, là tổng reward kỳ vọng tích lũy về sau từ một state, có tính đến các state có khả năng theo sau và reward ở đó. Một state có thể luôn cho immediate reward thấp nhưng vẫn có value cao (hoặc ngược lại). Reward là primary, value là secondary (là dự đoán/prediction của reward) — không có reward thì không có value.

Reward được environment cho trực tiếp, còn value phải được ước lượng và tái ước lượng từ chuỗi quan sát của agent trong suốt cuộc đời, nên khó xác định hơn nhiều. Quyết định dựa trên value vì ta tìm các hành động dẫn tới state có value cao nhất (chứ không phải reward cao nhất tức thời), bởi chúng mang lại nhiều reward nhất về lâu dài.

</details>

**Câu 7.** Phân biệt model-based methods và model-free methods.

<details>
<summary>Đáp án tham khảo</summary>

Model-based methods là các phương pháp dùng model (mô hình environment) và planning — chúng quyết định hành động bằng cách cân nhắc các tình huống tương lai có thể trước khi thực sự trải nghiệm. Model-free methods đơn giản hơn, là các trial-and-error learner thuần túy, được xem gần như đối lập với planning: chúng không dự đoán environment sẽ thay đổi ra sao trước một hành động. Modern RL trải dài cả phổ từ trial-and-error learning cấp thấp tới deliberative planning cấp cao.

</details>

## 1.4 Limitations and Scope

**Câu 8.** Trong sách này, state đóng vai trò gì, và evolutionary methods khác với các phương pháp RL học trong khi tương tác như thế nào?

<details>
<summary>Đáp án tham khảo</summary>

State là tín hiệu truyền cho agent cảm nhận "environment đang thế nào" tại một thời điểm; nó là input cho policy và value function, và vừa là input vừa là output của model. Sách không bàn việc xây dựng/học state signal mà tập trung vào việc quyết định hành động nào dựa trên state signal có sẵn (định nghĩa hình thức của state nằm trong khung MDP ở Chương 3).

Evolutionary methods (ví dụ genetic algorithms, genetic programming, simulated annealing) không ước lượng value function; chúng áp dụng nhiều policy tĩnh, mỗi policy tương tác lâu dài với một bản sao environment, rồi giữ lại các policy thu được nhiều reward nhất cùng biến thể ngẫu nhiên cho thế hệ sau. Chúng không học trong khi tương tác, bỏ qua cấu trúc hữu ích của bài toán (không tận dụng việc policy là hàm từ state sang action, không để ý các state đi qua hay action đã chọn). Trọng tâm của sách là các phương pháp học trong khi tương tác với environment, vốn thường hiệu quả hơn; do đó sách không bao gồm evolutionary methods.

</details>

## 1.5 An Extended Example: Tic-Tac-Toe

**Câu 9.** Trong ví dụ tic-tac-toe dùng value function, value của mỗi state được khởi tạo và biểu diễn như thế nào, và quy tắc cập nhật (update rule) là gì? Hãy nêu công thức và ý nghĩa của step-size parameter.

<details>
<summary>Đáp án tham khảo</summary>

Ta lập một bảng (table) số, mỗi state một số, là ước lượng xác suất thắng từ state đó — đây chính là value và cả bảng là learned value function. Các state có ba X thành hàng đặt value = 1 (đã thắng); các state có ba O thành hàng hoặc lấp đầy đặt value = 0 (không thể thắng); mọi state khác khởi tạo 0.5 (đoán 50% cơ hội thắng).

Khi chơi, phần lớn thời gian ta đi greedy (chọn nước dẫn tới state có value cao nhất), thỉnh thoảng đi exploratory move ngẫu nhiên. Sau mỗi greedy move, ta "back up" value của state sau về state trước. Công thức:

V(S_t) ← V(S_t) + α·[V(S_{t+1}) − V(S_t)]

với S_t là state trước greedy move, S_{t+1} là state sau. α là step-size parameter — một phân số dương nhỏ ảnh hưởng tới tốc độ học (rate of learning). Đây là một ví dụ của temporal-difference learning, vì thay đổi dựa trên difference V(S_{t+1}) − V(S_t) giữa hai ước lượng ở hai thời điểm liên tiếp.

</details>

**Câu 10.** Trong ví dụ tic-tac-toe, phương pháp value function khác evolutionary method ở chỗ nào về cách dùng thông tin? Vì sao điều này quan trọng?

<details>
<summary>Đáp án tham khảo</summary>

Evolutionary method giữ policy cố định và chơi (hoặc mô phỏng) nhiều ván để ước lượng xác suất thắng của policy đó; mỗi thay đổi policy chỉ thực hiện sau nhiều ván và chỉ dùng kết quả cuối cùng (final outcome) của mỗi ván — những gì diễn ra trong ván bị bỏ qua. Ví dụ nếu thắng, mọi nước đi đều được ghi credit như nhau, kể cả những nước chưa hề xảy ra.

Ngược lại, value function method cho phép đánh giá từng state riêng lẻ và tận dụng thông tin có sẵn trong quá trình chơi (information available during the course of play). Điều này quan trọng vì nó giải quyết tốt hơn credit assignment và thường hiệu quả hơn — cả hai cùng tìm kiếm trong policy space, nhưng học value function khai thác được chi tiết của các tương tác hành vi cá thể.

</details>

## 1.6 Summary

**Câu 11.** Tóm tắt điều gì phân biệt reinforcement learning với các phương pháp tính toán khác, và vai trò của khung MDP cùng value function theo mục Summary.

<details>
<summary>Đáp án tham khảo</summary>

RL là một cách tiếp cận tính toán để hiểu và tự động hóa goal-directed learning và decision making. Nó được phân biệt bởi việc nhấn mạnh học từ tương tác trực tiếp (direct interaction) của agent với environment, mà không cần exemplary supervision hay model environment hoàn chỉnh. Đây được coi là lĩnh vực đầu tiên nghiêm túc giải quyết các vấn đề tính toán khi học từ tương tác để đạt long-term goals.

RL dùng khung hình thức Markov decision processes (MDPs) để định nghĩa tương tác giữa agent và environment theo states, actions, và rewards — nắm bắt các đặc điểm thiết yếu: cảm nhận cause and effect, uncertainty/nondeterminism, và sự tồn tại của explicit goals. Khái niệm value và value function là then chốt của hầu hết các phương pháp RL trong sách: chúng quan trọng cho việc tìm kiếm hiệu quả trong policy space, và việc dùng value function phân biệt RL với evolutionary methods (vốn tìm trực tiếp trong policy space dựa trên đánh giá toàn bộ policy).

</details>

## 1.7 Early History of Reinforcement Learning

**Câu 12.** Mô tả ba thread (luồng) chính trong lịch sử đầu của reinforcement learning. Chúng hội tụ khi nào?

<details>
<summary>Đáp án tham khảo</summary>

- **Thread 1 — trial-and-error learning**: bắt nguồn từ tâm lý học về animal learning, chạy qua một số công trình AI sớm nhất và dẫn tới sự hồi sinh của RL đầu thập niên 1980.
- **Thread 2 — optimal control và lời giải dùng value function và dynamic programming**: phần lớn không liên quan tới learning.
- **Thread 3 — temporal-difference methods** (như cái dùng trong ví dụ tic-tac-toe): nhỏ và ít rõ nét hơn nhưng giúp liên kết hai thread kia.

Cả ba thread đến cùng nhau vào cuối thập niên 1980 để tạo nên modern field of reinforcement learning.

</details>

**Câu 13.** Nêu các đóng góp lịch sử then chốt của: Richard Bellman, Edward Thorndike, và Chris Watkins.

<details>
<summary>Đáp án tham khảo</summary>

- **Richard Bellman** (giữa thập niên 1950): phát triển cách tiếp cận optimal control dùng khái niệm state và value function (optimal return function) để định nghĩa một phương trình hàm nay gọi là Bellman equation; lớp phương pháp giải nó gọi là dynamic programming (1957a). Ông cũng giới thiệu phiên bản stochastic rời rạc của bài toán optimal control gọi là Markov decision processes (MDPs) (1957b), và đặt ra thuật ngữ "curse of dimensionality".
- **Edward Thorndike**: phát biểu cô đọng bản chất của trial-and-error learning thành "Law of Effect" — các response được theo sau bởi satisfaction sẽ liên kết chặt hơn với tình huống (dễ tái diễn hơn), còn các response theo sau bởi discomfort sẽ bị làm yếu liên kết; mức độ thưởng/phạt càng lớn thì sự củng cố/làm yếu càng mạnh.
- **Chris Watkins** (1989): phát triển Q-learning, hợp nhất hoàn toàn temporal-difference và optimal control thread (mở rộng và tích hợp cả ba thread); cách xử lý RL của ông dùng khung MDP đã được áp dụng rộng rãi.

</details>

**Câu 14.** Trong lịch sử RL, đâu là credit-assignment problem, ai đã nêu ra nó, và actor–critic architecture là gì?

<details>
<summary>Đáp án tham khảo</summary>

Credit-assignment problem (basic credit-assignment problem cho các hệ RL phức tạp) được Minsky nêu trong bài "Steps Toward Artificial Intelligence" (1961): làm sao phân bổ credit cho thành công giữa nhiều quyết định có thể đã góp phần tạo ra nó. Tất cả các phương pháp trong sách, theo nghĩa nào đó, đều hướng tới giải quyết vấn đề này.

Actor–critic architecture là phương pháp kết hợp temporal-difference learning với trial-and-error learning, được Barto, Sutton, và Anderson phát triển (1983) và áp dụng cho bài toán pole-balancing của Michie và Chambers; nó được nghiên cứu sâu trong luận án tiến sĩ của Sutton (1984). Thuật ngữ "critic" bắt nguồn từ Widrow, Gupta và Maitra ("learning with a critic" thay vì "learning with a teacher").

</details>
