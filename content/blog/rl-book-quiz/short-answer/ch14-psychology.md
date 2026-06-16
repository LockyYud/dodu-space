# Chương 14: Psychology — Câu hỏi trả lời ngắn

> Bộ câu hỏi trả lời ngắn (short-answer) ôn tập Chương 14, sách *Reinforcement Learning: An Introduction* (Sutton & Barto, 2nd ed.). Đáp án tham khảo dùng cho việc LLM chấm điểm.

## 14.1 Prediction and Control

**Câu 1.** Giải thích sự tương ứng giữa hai loại thuật toán reinforcement learning (prediction và control) với hai loại học tập mà các nhà tâm lý học nghiên cứu (classical/Pavlovian conditioning và instrumental/operant conditioning).

<details>
<summary>Đáp án tham khảo</summary>

Prediction algorithms (ví dụ policy evaluation) ước lượng các đại lượng phụ thuộc vào việc môi trường sẽ diễn tiến ra sao trong tương lai, điển hình là dự đoán lượng reward sắp tới; điều này tương ứng với classical (Pavlovian) conditioning, vốn là việc học dự đoán các stimulus sắp đến (dù chúng có thưởng/phạt hay không). Control algorithms (policy improvement) tương ứng với instrumental (operant) conditioning, nơi con vật học tăng hành vi được thưởng và giảm hành vi bị phạt. Khác biệt cốt lõi: trong instrumental conditioning, reinforcing stimulus là *contingent* trên hành vi của con vật; còn trong classical conditioning thì không. Đây chỉ là phép xấp xỉ đầu tiên, vì classical conditioning cũng có yếu tố hành động (Pavlovian control) và hai loại thường đan xen.

</details>

## 14.2 Classical Conditioning

**Câu 2.** Định nghĩa các thuật ngữ US, UR, CS, CR trong classical conditioning, và phân biệt delay conditioning với trace conditioning.

<details>
<summary>Đáp án tham khảo</summary>

US (unconditioned stimulus) là kích thích kích hoạt bẩm sinh một phản xạ, ví dụ thức ăn; UR (unconditioned response) là phản ứng bẩm sinh đó, ví dụ tiết nước bọt. CS (conditioned stimulus) là một kích thích ban đầu trung tính (ví dụ tiếng metronome) trở thành tín hiệu dự đoán US sau khi học; CR (conditioned response) là phản ứng học được do CS gây ra. US được gọi là reinforcer vì nó củng cố việc tạo ra CR đáp lại CS. Trong delay conditioning, CS kéo dài suốt interstimulus interval (ISI, khoảng thời gian giữa onset của CS và onset của US). Trong trace conditioning, US bắt đầu *sau khi* CS đã kết thúc, và khoảng giữa CS offset và US onset gọi là trace interval.

</details>

**Câu 3.** Mô tả hai hiện tượng blocking và higher-order conditioning. Vì sao blocking thách thức quan điểm conditioning chỉ dựa trên temporal contiguity?

<details>
<summary>Đáp án tham khảo</summary>

Blocking xảy ra khi con vật không học được CR với một CS tiềm năng nếu CS đó được trình bày cùng với một CS khác đã được dùng trước đó để điều kiện hóa cùng CR đó (ví dụ: tone đã học trước, sau đó thêm light vào thành compound, light gần như không gây CR). Higher-order conditioning xảy ra khi một CS đã được điều kiện hóa đóng vai trò như một US để điều kiện hóa một kích thích trung tính khác (ví dụ second-order: metronome đã học rồi dùng để điều kiện hóa black square dù black square chưa từng đi kèm thức ăn). Blocking thách thức quan điểm temporal contiguity vì theo quan điểm đó, chỉ cần US thường theo sát CS về thời gian là đủ để học; nhưng trong blocking, dù light kề cận US về thời gian, việc học vẫn bị chặn do việc học trước đó với tone đã dự đoán US gần như hoàn hảo.

</details>

## 14.2.2 The Rescorla–Wagner Model

**Câu 4.** Phát biểu ý tưởng cốt lõi của Rescorla–Wagner model và viết quy tắc cập nhật theo ký hiệu của sách (dạng error-correction). Khái niệm "aggregate associative strength" đóng vai trò gì?

<details>
<summary>Đáp án tham khảo</summary>

Ý tưởng cốt lõi: con vật chỉ học khi sự kiện vi phạm kỳ vọng của nó, tức chỉ khi nó "ngạc nhiên" (surprised). Theo ký hiệu của sách, cập nhật vector associative strength là w_{t+1} = w_t + α·δ_t·x(S_t), với prediction error δ_t = R_t − v̂(S_t, w_t), trong đó R_t là độ lớn của US (target) và v̂(S_t, w_t) = w_t^⊤ x(S_t) là aggregate associative strength. Aggregate associative strength là tổng associative strength của tất cả thành phần CS hiện diện trên trial (giả định VAX = VA + VX); nó đóng vai trò là "kỳ vọng" của con vật. Vì error được tính dựa trên *toàn bộ* compound chứ không riêng từng thành phần, một khi compound đã dự đoán US gần đủ (error ≈ 0) thì CS mới thêm vào hầu như không tăng associative strength — đó là lời giải thích cho blocking.

</details>

**Câu 5.** Từ góc nhìn machine learning, Rescorla–Wagner model là loại quy tắc học gì, và nó tương đương với quy tắc kinh điển nào?

<details>
<summary>Đáp án tham khảo</summary>

Rescorla–Wagner model là một error-correction supervised learning rule, về cơ bản giống quy tắc Least Mean Square (LMS), hay Widrow–Hoff rule. Nó là một thuật toán "curve-fitting"/regression tìm các trọng số (associative strengths) sao cho trung bình bình phương sai số tiến gần về 0. Khác biệt chính so với LMS: trong LMS các thành phần input vector có thể là số thực bất kỳ, và step-size α trong phiên bản đơn giản không phụ thuộc vào input vector hay danh tính của stimulus, trong khi R–W cho phép α phụ thuộc vào danh tính của CS và US.

</details>

**Câu 6.** Rescorla–Wagner model có những hạn chế nào mà mô tả TD model sau đó nhằm khắc phục?

<details>
<summary>Đáp án tham khảo</summary>

Rescorla–Wagner là một trial-level model: mỗi bước đại diện cho cả một trial, nên nó không xử lý được các quan hệ thời gian *trong* trial và *giữa* các trial (timing, durations, ISI), vốn ảnh hưởng mạnh đến học. Ngoài ra nó không có cơ chế cho higher-order conditioning. TD model là một real-time model, mở rộng R–W để giải thích các quan hệ timing và để higher-order conditioning xuất hiện một cách tự nhiên nhờ ý tưởng bootstrapping.

</details>

## 14.2.3 The TD Model

**Câu 7.** TD model mở rộng Rescorla–Wagner model như thế nào? Viết TD error theo ký hiệu của sách và nêu mối liên hệ khi λ = 0.

<details>
<summary>Đáp án tham khảo</summary>

TD model là real-time model: t bây giờ là time step (trong/giữa trial) thay vì cả một trial, và mỗi state được biểu diễn bằng feature vector phụ thuộc cách stimulus được biểu diễn theo thời gian. Cập nhật: w_{t+1} = w_t + α·δ_t·z_t, với z_t là vector eligibility traces (z_t = γλ·z_{t−1} + x(S_t)), thay cho x(S_t) trong R–W; và δ_t là TD error: δ_t = R_{t+1} + γ·v̂(S_{t+1}, w_t) − v̂(S_t, w_t), với γ là discount factor. Khi λ = 0, TD model quy về Rescorla–Wagner model (ngoại trừ việc t có nghĩa khác — time step thay vì trial — và có độ trễ một bước trong prediction target R). TD model tương đương backward view của semi-gradient TD(λ) với linear function approximation, khác ở chỗ R_t không nhất thiết là reward signal.

</details>

**Câu 8.** Vì sao bootstrapping (việc v̂(S_{t+1}) xuất hiện trong TD error) giúp TD model giải thích được higher-order conditioning và hiện tượng temporal primacy overriding blocking?

<details>
<summary>Đáp án tham khảo</summary>

Trong TD error δ_t có số hạng γ·v̂(S_{t+1}, w_t) − v̂(S_t, w_t) (một temporal difference). Một temporal difference khác 0 có *cùng địa vị* như R_{t+1}: với việc học, không có khác biệt giữa một temporal difference và sự xuất hiện của một US. Do đó một CS đã được học có thể đóng vai trò như US đối với CS khác — chính là higher-order (second-order) conditioning. Bootstrapping cũng làm cho một stimulus dự đoán *sớm hơn* được ưu tiên hơn stimulus dự đoán muộn hơn (các update đẩy strength ở state hiện tại về phía strength ở các state sau). Vì vậy TD model dự đoán rằng nếu CS mới thêm bắt đầu *trước* CS đã được pretrain, học tới CS mới không bị blocked, mà thậm chí CS pretrain còn mất dần associative strength (temporal primacy overriding blocking) — dự đoán này về sau được Kehoe, Schreurs và Graham (1987) xác nhận thực nghiệm.

</details>

## 14.2.4 TD Model Simulations

**Câu 9.** Nêu ba dạng stimulus representation dùng với TD model và cách chúng khác nhau, đồng thời cho biết representation nào tái tạo tốt được hồ sơ timing của CR còn representation nào thì không.

<details>
<summary>Đáp án tham khảo</summary>

Ba representation: presence representation, complete serial compound (CSC), và microstimulus (MS). Chúng khác nhau ở mức độ generalization giữa các thời điểm gần nhau (temporal generalization gradient). Presence có một feature duy nhất cho mỗi CS (giá trị 1 khi CS hiện diện) — generalization hoàn toàn theo thời gian. CSC giống một "tapped delay line": onset của mỗi stimulus khởi động chuỗi tín hiệu nội bộ ngắn, định thời chính xác, không chồng lấn — không có generalization giữa các thời điểm gần nhau. MS nằm ở giữa: mỗi stimulus khởi động chuỗi microstimuli mở rộng và chồng lấn theo thời gian (microstimulus sau rộng hơn và đỉnh thấp hơn), thực tế hơn về mặt thần kinh. Presence không tái tạo được nhiều đặc điểm timing của CR (dự đoán US gần như hằng trong khi CS hiện diện); CSC tạo đường dự đoán US tăng theo cấp số mũ đạt đỉnh đúng lúc US (do discounting); MS xấp xỉ được đường của CSC qua tổ hợp tuyến tính các microstimuli.

</details>

## 14.3 Instrumental Conditioning

**Câu 10.** Law of Effect của Thorndike là gì, và hai đặc tính nào của reinforcement learning algorithms tương ứng với nó? Giải thích thêm khái niệm shaping của Skinner.

<details>
<summary>Đáp án tham khảo</summary>

Law of Effect (từ thí nghiệm puzzle box của Thorndike) mô tả học bằng trial and error: các hành vi dẫn tới kết quả thỏa mãn được "stamped in" (củng cố liên kết với tình huống), hành vi không thành công bị "stamped out". Hai đặc tính tương ứng: (1) selectional — thuật toán thử các phương án và chọn lựa bằng cách so sánh hậu quả; (2) associative — các phương án được chọn được gắn với các tình huống/state cụ thể để tạo thành policy ("selecting and connecting"). (Để so sánh: natural selection là selectional nhưng không associative; supervised learning là associative nhưng không selectional.) Shaping là kỹ thuật của Skinner: củng cố dần các xấp xỉ liên tiếp của hành vi mong muốn bằng cách thay đổi dần reinforcement contingencies. Shaping rất hữu ích khi reward thưa thớt/khó tiếp cận, cả cho huấn luyện động vật lẫn cho các hệ reinforcement learning.

</details>

## 14.4 Delayed Reinforcement

**Câu 11.** Vấn đề delayed reinforcement (liên quan credit-assignment problem) là gì, và RL dùng hai cơ chế nào để giải quyết? Chúng tương ứng với những giả thuyết nào trong tâm lý học động vật?

<details>
<summary>Đáp án tham khảo</summary>

Vấn đề delayed reinforcement là việc học vẫn xảy ra khi có độ trễ đáng kể giữa hành động (hoặc CS) và reward/US theo sau; nó liên quan đến credit-assignment problem (Minsky 1961): làm sao phân bổ "công" cho thành công giữa nhiều quyết định liên quan. Hai cơ chế của RL: (1) eligibility traces — vết suy giảm của các state/state–action đã ghé qua; (2) TD methods học value functions cung cấp đánh giá gần như tức thời cho hành động (hoặc prediction target tức thời). Tương ứng tâm lý học: eligibility traces giống "stimulus traces" của Pavlov (giải thích trace conditioning) và "molar stimulus traces" của Hull (goal gradient); value functions/conditioned reinforcement giống đề xuất của Hull rằng conditioned (secondary) reinforcement truyền ngược từ goal để kéo dài goal gradient. Kiến trúc actor–critic minh họa rõ nhất: critic dùng TD học value function, TD error đóng vai trò conditioned reinforcement tức thời cho actor ngay cả khi primary reward bị trễ.

</details>

## 14.5 Cognitive Maps

**Câu 12.** Cognitive map của Tolman là gì và nó tương ứng với khái niệm nào trong reinforcement learning? Thí nghiệm latent learning ủng hộ quan điểm này như thế nào?

<details>
<summary>Đáp án tham khảo</summary>

Cognitive map (Tolman) là biểu diễn nội tại về môi trường mà con vật học được, theo nghĩa hiện đại không chỉ giới hạn ở bố cục không gian mà là environment model tổng quát (model của "task space"). Nó tương ứng với environment model trong model-based reinforcement learning, gồm state-transition model và reward model, dùng để planning. Latent learning ủng hộ điều này: hai nhóm chuột chạy mê cung, nhóm thực nghiệm không có reward trong giai đoạn đầu nhưng được thêm thức ăn ở giai đoạn hai; chúng nhanh chóng bắt kịp nhóm đối chứng ngay khi phát hiện thức ăn, cho thấy chúng đã học (latent) bản đồ mê cung trong giai đoạn không reward và dùng nó khi có động cơ. Điều này tương đương với việc environment model có thể được học bằng supervised learning (qua các S–S, SA–S′, S–R pairs, kiểu "system identification"/expectancy theory) ngay cả khi không có reward signal, rồi dùng sau để planning — trái với quan điểm stimulus-response (S–R) model-free đơn giản.

</details>

## 14.6 Habitual and Goal-directed Behavior

**Câu 13.** Phân biệt habitual behavior với goal-directed behavior, và liên hệ với model-free vs model-based reinforcement learning. Outcome-devaluation experiment kiểm tra điều gì?

<details>
<summary>Đáp án tham khảo</summary>

Habitual behavior là các mẫu hành vi được kích hoạt bởi stimulus phù hợp rồi thực hiện gần như tự động (bị kiểm soát bởi antecedent stimuli); tương ứng model-free RL — quyết định dựa trên policy hoặc action-value function đã lưu, không tham chiếu environment model. Goal-directed behavior có mục đích, bị kiểm soát bởi tri thức về giá trị của goal và quan hệ giữa hành động với hậu quả (bị kiểm soát bởi consequences); tương ứng model-based RL — chọn hành động bằng planning dùng model. Goal-directed có lợi thế thay đổi hành vi nhanh khi môi trường đổi cách phản ứng (đổi model là policy đổi qua planning, không cần trải nghiệm lại), còn habitual phản ứng nhanh nhưng chậm thích nghi. Outcome-devaluation experiment giảm/đảo giá trị reward của outcome sau giai đoạn học để xem con vật giảm hành vi (ví dụ lever-pressing) ngay từ đầu extinction hay không: nếu giảm dù chưa từng trực tiếp trải nghiệm hậu quả mới thì hành vi là goal-directed (model-based); nếu không nhạy với devaluation (như nhóm overtrained của Adams 1982) thì hành vi đã thành habit (model-free). Đây là bằng chứng cho thấy huấn luyện kéo dài chuyển goal-directed thành habitual; động vật có thể dùng cả hai và phân xử dựa trên độ tin cậy của mỗi quá trình (Daw, Niv, Dayan 2005).

</details>

## 14.7 Summary

**Câu 14.** Tổng kết các cặp tương ứng chính giữa reinforcement learning và tâm lý học động vật được nêu trong chương này.

<details>
<summary>Đáp án tham khảo</summary>

Các cặp tương ứng chính: (1) prediction algorithms ↔ classical (Pavlovian) conditioning, và control algorithms ↔ instrumental conditioning (khác biệt then chốt: reinforcing stimulus có contingent trên hành vi hay không). (2) TD algorithm học dự đoán ↔ classical conditioning, với TD model tổng quát hóa Rescorla–Wagner model bằng cách thêm chiều thời gian trong trial và giải thích second-order conditioning (đồng thời là nền của mô hình hoạt động dopamine neurons ở Chương 15). (3) Trial-and-error / Law of Effect (Thorndike) ↔ khía cạnh control; cộng với shaping (Skinner) và motivational state. (4) eligibility traces ↔ stimulus traces, và value functions học qua TD ↔ secondary/conditioned reinforcement — cả hai giải quyết delayed reinforcement. (5) environment models ↔ cognitive maps (học được không cần reward, dùng để planning). (6) model-free vs model-based ↔ habitual vs goal-directed behavior (làm rõ qua outcome-devaluation experiments). Sách nhấn mạnh đây là dòng chảy ý tưởng hai chiều, nhưng RL không nhằm tái tạo chi tiết hành vi động vật.

</details>
