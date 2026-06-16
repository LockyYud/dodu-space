# Chương 15: Neuroscience — Câu hỏi trắc nghiệm

> Bộ câu hỏi ôn tập chi tiết cho Chương 15, sách *Reinforcement Learning: An Introduction* (Sutton & Barto, 2nd ed.)

## 15.1 Neuroscience Basics

**Câu 1.** Theo định nghĩa trong chương, một synapse hoạt động như thế nào trong việc truyền tín hiệu giữa các neuron?

- A. Khi action potential đến, synapse (với một vài ngoại lệ) phóng thích một neurotransmitter khuếch tán qua synaptic cleft và gắn vào các receptor trên postsynaptic neuron để kích thích, ức chế hoặc điều biến hoạt động của nó.
- B. Synapse dẫn trực tiếp dòng điện từ cell body của presynaptic neuron sang axon của postsynaptic neuron qua một cầu nối điện cố định, không cần chất trung gian hóa học nào.
- C. Synapse khuếch đại firing rate của presynaptic neuron lên một hệ số cố định rồi chuyển toàn bộ tín hiệu đã khuếch đại sang postsynaptic neuron.
- D. Synapse là cấu trúc nằm trên dendrite chuyên tiếp nhận và mã hóa tín hiệu cảm giác từ môi trường bên ngoài cơ thể.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Một synapse thường nằm ở đầu tận của một nhánh axon. Với một vài ngoại lệ (electric coupling trực tiếp), khi một action potential từ presynaptic neuron đến, synapse phóng thích một chemical neurotransmitter; các phân tử này khuếch tán qua synaptic cleft và gắn vào receptor trên bề mặt postsynaptic neuron để kích thích, ức chế hoặc điều biến hoạt động của nó. B mô tả electric coupling như thể là cơ chế phổ biến (thực ra là ngoại lệ); C nhầm synapse với một bộ khuếch đại; D nhầm synapse với cấu trúc cảm giác chuyên biệt.

</details>

---

**Câu 2.** Trong chương này, sự phân biệt giữa phasic activity và tonic/background activity của một neuron được mô tả thế nào?

- A. Phasic activity là mức hoạt động nền liên tục không phụ thuộc input, còn tonic activity là các burst spike nhanh do synaptic input gây ra.
- B. Phasic activity là số spike trung bình trên một đơn vị thời gian, còn tonic activity là độ mạnh (efficacy) của một synapse cụ thể.
- C. Phasic activity gồm các burst spike thường do synaptic input gây ra; background activity là mức hoạt động khi neuron không bị điều khiển bởi input liên quan đến nhiệm vụ; tonic activity là hoạt động biến thiên chậm, thường theo kiểu phân mức (graded).
- D. Cả phasic lẫn tonic activity đều chỉ xuất hiện ở dopamine neuron và đều hoàn toàn độc lập với mọi synaptic input đến từ các neuron khác.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Phasic activity là các burst spike, thường do synaptic input gây ra; background activity là mức hoạt động (thường là firing rate) khi neuron không bị điều khiển bởi input liên quan đến nhiệm vụ; tonic activity chỉ hoạt động biến thiên chậm và thường theo kiểu graded. A đảo ngược định nghĩa phasic và tonic; B nhầm firing rate với synaptic efficacy; D sai vì các loại hoạt động này không giới hạn ở dopamine neuron và phasic activity vốn do synaptic input gây ra.

</details>

---

**Câu 3.** Khái niệm nào về não bộ được nhấn mạnh là quan trọng vì nó là một trong những cơ chế chính chịu trách nhiệm cho việc học, và tương ứng với các trọng số (weights) được điều chỉnh bởi thuật toán học?

- A. Action potential — xung điện lan truyền dọc axon mang thông tin giữa các neuron.
- B. Axonal arbor — cấu trúc phân nhánh của axon quyết định một neuron kết nối tới bao nhiêu đích.
- C. Synaptic cleft — khe hẹp giữa hai neuron mà neurotransmitter phải khuếch tán qua.
- D. Synaptic plasticity — khả năng synaptic efficacy thay đổi, tương ứng với weights thuật toán học điều chỉnh.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Synaptic plasticity là khả năng các synaptic efficacy thay đổi; đây là một trong những cơ chế chính của việc học, và các tham số/weights mà thuật toán học điều chỉnh tương ứng với các synaptic efficacy. A, B, C đều là các thành phần thần kinh có thật nhưng liên quan tới việc *truyền* tín hiệu chứ không phải tới việc *lưu giữ và thay đổi* tri thức học được.

</details>

---

**Câu 4.** Một neuromodulator (như dopamine) khác với một neurotransmitter kích thích/ức chế nhanh thông thường ở điểm nào, và tại sao điều này quan trọng với học tập?

- A. Neuromodulator chỉ tồn tại ở các neuron cảm giác ngoại biên và không bao giờ tham gia vào quá trình học hay thay đổi synapse.
- B. Neuromodulator có tác động khác ngoài (hoặc bổ sung cho) excitation/inhibition nhanh trực tiếp; một hệ neuromodulation có thể phân phối một tín hiệu kiểu scalar (như reinforcement signal) tới nhiều vị trí phân tán rộng.
- C. Neuromodulator chỉ truyền tín hiệu trong phạm vi một synapse duy nhất và không bao giờ lan tỏa ra các neuron khác trong vùng lân cận.
- D. Neuromodulator hoạt động nhanh hơn neurotransmitter thường nhiều lần nhưng không bao giờ làm thay đổi synaptic efficacy của bất kỳ synapse nào.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Neuromodulator là neurotransmitter có tác động khác ngoài hoặc bổ sung cho excitation/inhibition nhanh trực tiếp. Quan trọng: một neuromodulatory system với các axonal arbor phân nhánh rộng có thể phân phối một tín hiệu kiểu scalar — chẳng hạn một reinforcement signal — để thay đổi hoạt động của các synapse ở nhiều vị trí phân tán rộng, vốn rất quan trọng cho việc học. A, C, D đều phủ nhận chính tính chất "tác động rộng, điều biến plasticity" làm nên ý nghĩa của neuromodulator.

</details>

---

**Câu 5.** [Khó] Tại sao một hệ thống dùng neurotransmitter kích thích/ức chế nhanh, point-to-point sẽ KÉM phù hợp hơn một hệ neuromodulatory để đóng vai trò phát tán reinforcement signal trong não?

- A. Neurotransmitter nhanh không thể vượt qua synaptic cleft nên không truyền được tín hiệu giữa các neuron ở xa nhau.
- B. Tín hiệu point-to-point nhanh nhằm truyền thông tin riêng biệt giữa từng cặp neuron, trong khi reinforcement signal lý tưởng là một scalar chung cần đến đồng thời nhiều synapse phân tán — điều mà axonal arbor rộng của neuromodulatory system làm được.
- C. Neurotransmitter nhanh luôn gây ức chế nên sẽ tắt mọi hoạt động học thay vì thúc đẩy nó.
- D. Hệ point-to-point hoạt động chậm hơn neuromodulation nên không kịp truyền tín hiệu trong khung thời gian học.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Một reinforcement signal như TD error δ là một đại lượng scalar duy nhất, và việc học cần áp dụng tín hiệu này đồng thời lên nhiều synapse phân tán khắp não. Hệ point-to-point nhanh được "thiết kế" để mang thông tin riêng biệt giữa từng cặp neuron, không phù hợp để broadcast một giá trị chung. Hệ neuromodulatory, với axonal arbor phân nhánh khổng lồ, lại lý tưởng cho việc phát tán này. A và C sai về mặt sinh học; D đảo ngược thực tế (neuromodulation thường tác động chậm hơn, nhưng ưu thế là phạm vi phân phối rộng chứ không phải tốc độ).

</details>

---

## 15.2 Reward Signals, Reinforcement Signals, Values, and Prediction Errors

**Câu 6.** Theo chương này, đâu là sự phân biệt cốt lõi giữa reward signal và reinforcement signal trong reinforcement learning?

- A. Reward signal (Rt) định nghĩa bài toán mà agent phải giải; reinforcement signal định hướng các thay đổi mà thuật toán học thực hiện trên policy, value estimate hoặc model — với phương pháp TD, reinforcement signal là TD error chứ không phải bản thân reward.
- B. Reward signal là sai số dự đoán tại mỗi bước, còn reinforcement signal là tổng phần thưởng kỳ vọng tích lũy trong toàn bộ tương lai của agent.
- C. Reward signal và reinforcement signal là hai tên gọi của cùng một đại lượng, chỉ khác nhau ở ngữ cảnh psychology hay computation.
- D. Reinforcement signal định nghĩa bài toán agent phải giải, còn reward signal định hướng cách cập nhật value estimate trong mọi thuật toán.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Reward signal (cùng với môi trường) định nghĩa bài toán agent đang cố giải. Reinforcement signal có chức năng định hướng các thay đổi mà thuật toán học tạo ra trên policy, value estimate hoặc model. Với phương pháp TD, reinforcement signal tại thời điểm t là TD error. Reinforcement signal có thể trùng reward signal với một số thuật toán, nhưng với hầu hết thuật toán nó là reward signal được điều chỉnh bởi thông tin khác (như value estimate trong TD error). C sai vì hai khái niệm khác nhau về chức năng; D đảo ngược vai trò của hai tín hiệu.

</details>

---

**Câu 7.** Mối quan hệ giữa reward prediction error (RPE) và TD error được mô tả như thế nào?

- A. RPE chỉ là một dạng của Rescorla–Wagner error và về bản chất không bao giờ có thể trùng với TD error trong bất kỳ thuật toán nào.
- B. RPE đo độ chênh lệch giữa reward kỳ vọng và reward nhận được; TD error là một loại RPE đặc biệt báo hiệu chênh lệch giữa kỳ vọng hiện tại và trước đó về phần thưởng dài hạn — khi neuroscientist nói RPE họ thường ám chỉ TD RPE.
- C. TD error chỉ được coi là một RPE khi nó phụ thuộc vào action được chọn, như trong trường hợp của Q-learning hay Sarsa.
- D. RPE và TD error là hai đại lượng hoàn toàn không liên quan: một thuộc psychology, một thuộc computation, và không có ánh xạ nào giữa chúng.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — RPE đo chênh lệch giữa reward signal kỳ vọng và nhận được (dương khi reward lớn hơn kỳ vọng). TD error là loại RPE đặc biệt, báo hiệu chênh lệch giữa kỳ vọng hiện tại và trước đó về phần thưởng dài hạn. Khi neuroscientist nói RPE, họ thường (dù không phải luôn) ám chỉ TD RPE — mà chương này gọi đơn giản là TD error. Trong chương, TD error thường là loại không phụ thuộc action, nên C sai; A và D phủ nhận mối liên hệ thực sự giữa hai khái niệm.

</details>

---

## 15.3 The Reward Prediction Error Hypothesis

**Câu 8.** Reward prediction error hypothesis of dopamine neuron activity phát biểu điều gì?

- A. Dopamine neuron mã hóa trực tiếp bản thân reward signal Rt và phát tán nó đi khắp não như một tín hiệu chủ (master reward signal).
- B. Tonic activity của dopamine neuron biểu diễn value function V(St) của trạng thái hiện tại tại mỗi thời điểm trong một trial.
- C. Một chức năng của phasic activity của các dopamine neuron ở động vật có vú là chuyển giao sai số giữa ước lượng cũ và mới về phần thưởng kỳ vọng tương lai tới các vùng đích khắp não.
- D. Dopamine neuron chỉ phản ứng với chuyển động cơ thể (motor movement) của con vật chứ không phản ứng với phần thưởng hay tín hiệu dự đoán phần thưởng.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Reward prediction error hypothesis đề xuất rằng một chức năng của phasic activity của dopamine neuron ở động vật có vú là chuyển một error giữa ước lượng cũ và mới về phần thưởng kỳ vọng tương lai tới các vùng đích khắp não. Giả thuyết này (dù không chính xác bằng những từ này) lần đầu được phát biểu rõ ràng bởi Montague, Dayan và Sejnowski (1996). A nhầm RPE với reward signal; B gán nhầm vai trò biểu diễn value cho tonic activity; D mâu thuẫn với toàn bộ bằng chứng của chương.

</details>

---

**Câu 9.** Để so sánh TD error với hoạt động của dopamine neuron, Montague et al. (1996) đã đưa ra giả định nào về firing rate vì neuron không thể có firing rate âm?

- A. Họ giả định mọi TD error âm đều được làm tròn thành 0 và bị thuật toán bỏ qua hoàn toàn khi cập nhật.
- B. Họ giả định lượng tương ứng với hoạt động dopamine neuron là TD error cộng với background firing rate bt; một TD error âm tương ứng với việc firing rate giảm xuống dưới mức nền.
- C. Họ giả định dopamine neuron mã hóa giá trị tuyệt đối |δ| của TD error nên không bao giờ cần biểu diễn dấu âm.
- D. Họ giả định TD error trong bài toán này luôn không âm về mặt toán học nên không cần bất kỳ điều chỉnh nào.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Vì TD error có thể âm nhưng neuron không thể có firing rate âm, Montague et al. giả định đại lượng tương ứng với hoạt động dopamine neuron là TD error cộng background firing rate (δ + bt). Một TD error âm tương ứng với việc firing rate của dopamine neuron giảm xuống dưới background rate của nó. A và C làm mất thông tin về dấu (vốn cần thiết để giải thích việc giảm dưới baseline khi reward bị bỏ qua); D sai vì TD error rõ ràng có thể âm.

</details>

---

**Câu 10.** Montague et al. dùng biểu diễn complete serial compound (CSC) nhằm mục đích chính nào?

- A. Để giảm số lượng dopamine neuron cần theo dõi đồng thời trong một thí nghiệm điện sinh lý.
- B. Để biến TD error thành một Rescorla–Wagner error đơn giản không phụ thuộc thời gian trong trial.
- C. Để loại bỏ hoàn toàn vai trò của eligibility traces khỏi mô hình conditioning.
- D. Để TD error nhạy với thời điểm các sự kiện trong một trial — mỗi bước thời gian sau stimulus được biểu diễn bằng một state riêng, nhờ đó theo dõi được khoảng thời gian giữa cue và reward.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — CSC representation cho mỗi bước thời gian sau một stimulus một internal signal/state riêng biệt, tiếp tục cho đến khi US (reward khác 0) xuất hiện. Điều này cho phép TD error — vốn phụ thuộc state — nhạy với thời điểm các sự kiện trong một trial, tức theo dõi được khoảng thời gian giữa sensory cue và lúc reward đến. B đi ngược mục đích (CSC làm cho TD error nhạy thời gian, không phải đơn giản hóa nó); A và C không liên quan tới mục đích của CSC.

</details>

---

## 15.4 Dopamine

**Câu 11.** Cell body của các neuron sản xuất dopamine chủ yếu nằm ở đâu trong não động vật có vú?

- A. Trong substantia nigra pars compacta (SNpc) và ventral tegmental area (VTA) ở midbrain.
- B. Trong hippocampus và prefrontal cortex, nơi xử lý trí nhớ và quyết định cấp cao.
- C. Trong cerebellum và thalamus, nơi điều phối vận động và chuyển tiếp cảm giác.
- D. Trong các medium spiny neurons của striatum, nơi nhận input từ cortex.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Dopamine được sản xuất bởi các neuron có cell body nằm chủ yếu trong hai cụm neuron ở midbrain: substantia nigra pars compacta (SNpc) và ventral tegmental area (VTA). B, C, D đều là các vùng não có thật và liên quan tới RL ở mức độ nào đó, nhưng không phải nơi chứa cell body sản xuất dopamine — striatum (D) là *đích* nhận dopamine chứ không phải nguồn.

</details>

---

**Câu 12.** Quan điểm truyền thống (early view) về dopamine cho rằng nó phát tán một reward signal. Reward prediction error hypothesis điều chỉnh quan điểm này như thế nào?

- A. Bác bỏ hoàn toàn rằng dopamine có bất kỳ liên quan nào tới reward hay reinforcement.
- B. Khẳng định dopamine neuron mã hóa chính xác Rt và phủ nhận sự tồn tại của bất kỳ thành phần higher-order nào.
- C. Cho rằng dopamine chỉ liên quan đến điều khiển chuyển động cơ thể chứ không liên quan gì đến học tập.
- D. Phasic response của dopamine neuron báo hiệu reward prediction error (tương ứng TD error δ), không phải bản thân reward Rt; RL dung hòa hai quan điểm vì δ là reinforcement signal và Rt là một thành phần quan trọng nhưng không phải toàn bộ của δ.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Nếu hypothesis đúng, phasic response của dopamine neuron tại thời điểm t tương ứng với δ (= Rt + V(St) − V(St−1)), không phải Rt. Lý thuyết RL dung hòa hai quan điểm: δ đóng vai trò reinforcement signal (động lực chính của học), Rt là thành phần quan trọng của δ nhưng không quyết định hoàn toàn tác động reinforcing; phần V(St) − V(St−1) là phần reinforcement bậc cao. Ngay cả khi reward xảy ra, TD error có thể bằng 0 nếu reward được dự đoán đầy đủ. A, B, C đều là các hiểu lầm cực đoan đi quá xa hoặc sai hướng so với điều hypothesis thực sự nói.

</details>

---

**Câu 13.** Các thí nghiệm optogenetic (ví dụ Tsai et al. 2009, Steinberg et al. 2013, Claridge-Chang et al. 2009) đã chứng minh điều gì về phasic dopamine neuron activity?

- A. Chúng chứng minh phasic dopamine activity chính xác là một TD error có một dạng toán học cụ thể duy nhất.
- B. Chúng chứng minh thuyết phục rằng phasic dopamine activity hoạt động đúng như δ hoạt động (reinforcement signal) cho cả prediction và control — dù ở ruồi giấm tác động lại ngược (giống −δ, củng cố avoidance).
- C. Chúng chứng minh dopamine neuron mã hóa và biểu diễn value function V thay vì một reinforcement signal kiểu prediction error.
- D. Chúng chứng minh dopamine hoàn toàn không có vai trò nhân quả nào trong reinforcement hay điều khiển hành vi.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Các thí nghiệm optogenetic không chứng minh phasic dopamine activity cụ thể *là* một TD error, nhưng chứng minh thuyết phục rằng nó *hoạt động đúng như* δ hoạt động (hay có lẽ như −δ ở ruồi giấm) — tức reinforcement signal cho cả prediction (classical conditioning) và control (instrumental conditioning). Ở ruồi giấm, burst dopamine kích thích bằng quang học hoạt động như foot shock, củng cố avoidance behavior. A quá mạnh (thí nghiệm cho thấy *hoạt động giống* chứ không chứng minh dạng cụ thể); C và D mâu thuẫn với kết quả.

</details>

---

**Câu 14.** Đặc điểm giải phẫu nào khiến dopamine neuron đặc biệt phù hợp để phát tán một reinforcement signal đi khắp não?

- A. Chúng có axon rất ngắn chỉ tiếp xúc với một vài neuron lân cận, đảm bảo tín hiệu được giữ riêng tư và chính xác.
- B. Mỗi dopamine neuron chỉ kết nối duy nhất với một medium spiny neuron, tạo nên một ánh xạ một–một rõ ràng.
- C. Chúng không có axon mà truyền tín hiệu trực tiếp qua dendrite tới các neuron tiếp xúc trực tiếp về mặt vật lý.
- D. Chúng có axonal arbor khổng lồ, mỗi axon tạo khoảng 500,000 synaptic contact và phóng dopamine ở số vị trí synapse nhiều hơn 100–1,000 lần so với neuron thông thường.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Dopamine neuron có axonal arbor khổng lồ, mỗi axon phóng dopamine ở số vị trí synapse nhiều gấp 100–1,000 lần so với axon của neuron thông thường, mỗi axon SNpc/VTA tạo khoảng 500,000 synaptic contact. Vì reinforcement signal δ là một scalar, đặc điểm này phù hợp với việc phát tán cùng một tín hiệu đến nhiều vùng — dù bằng chứng hiện đại cho thấy bức tranh phức tạp hơn. A, B, C đều mô tả những cấu trúc *hẹp, riêng tư* — trái ngược với yêu cầu broadcast rộng của một reinforcement signal.

</details>

---

**Câu 15.** Hai phân vùng nào của striatum được nêu là quan trọng cho reinforcement learning, và vai trò của chúng?

- A. Dorsal striatum chủ yếu ảnh hưởng action selection; ventral striatum được cho là then chốt cho reward processing, gồm gán giá trị cảm xúc (affective value) cho cảm giác.
- B. Hippocampus đảm nhận action selection còn cerebellum đảm nhận việc xử lý và gán giá trị cho reward.
- C. SNpc đảm nhận việc học value function còn VTA đảm nhận việc lưu giữ và thực thi policy.
- D. Frontal cortex đảm nhận action selection còn thalamus đảm nhận việc xử lý reward processing.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Striatum (cấu trúc input chính của basal ganglia) có hai phân vùng quan trọng cho RL: dorsal striatum chủ yếu ảnh hưởng action selection, còn ventral striatum được cho là then chốt cho các khía cạnh khác nhau của reward processing, bao gồm việc gán affective value cho các cảm giác. Axon của cortical neuron tiếp xúc với medium spiny neurons của striatum. B, C, D gán nhầm vai trò cho các cấu trúc không phải hai phân vùng striatum (SNpc/VTA là nguồn dopamine, không phải phân vùng striatum).

</details>

---

**Câu 16.** [Khó] Quan sát hiện đại rằng các subpopulation khác nhau của dopamine neuron phản ứng khác nhau (không phải tất cả đều mã hóa cùng một scalar δ) gây thách thức gì cho phiên bản đơn giản nhất của reward prediction error hypothesis?

- A. Nó chứng minh dopamine không liên quan tới reinforcement learning, nên hypothesis bị bác bỏ hoàn toàn.
- B. Nó cho thấy ý tưởng "một tín hiệu scalar δ chung được broadcast đồng nhất tới mọi đích" là quá đơn giản; tín hiệu dopamine có thể đa dạng theo vùng đích, dù tuyên bố cốt lõi rằng phasic dopamine mang reinforcement signal vẫn được giữ.
- C. Nó cho thấy dopamine neuron thực ra mã hóa reward signal Rt chứ không phải prediction error, đảo ngược toàn bộ hypothesis.
- D. Nó cho thấy mọi dopamine neuron mã hóa value function thay vì error, nên actor–critic không còn áp dụng được.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Phiên bản đơn giản nhất của hypothesis hình dung một scalar δ duy nhất được phát tán đồng nhất khắp não (phù hợp với axonal arbor rộng). Bằng chứng hiện đại cho thấy các subpopulation dopamine phản ứng khác nhau, nên bức tranh phức tạp hơn — tín hiệu có thể được "đặt riêng" cho các đích khác nhau. Tuy nhiên điều này tinh chỉnh chứ không phủ nhận tuyên bố cốt lõi rằng phasic dopamine mang reinforcement signal. A, C, D đều đẩy quan sát này thành một kết luận cực đoan sai lệch.

</details>

---

## 15.5 Experimental Support for the Reward Prediction Error Hypothesis

**Câu 17.** Trong các thí nghiệm của Schultz và cộng sự (ví dụ Ljungberg, Apicella, Schultz 1992; Schultz, Apicella, Ljungberg 1993), người ta quan sát thấy gì về phasic response của dopamine neuron khi con khỉ học được?

- A. Phản ứng dopamine luôn cố định tại thời điểm nhận reward bất kể con khỉ đã học bao lâu hay đã quen với cue.
- B. Ban đầu nhiều dopamine neuron phản ứng với reward; khi học, phản ứng chuyển sang trigger cue dự đoán reward, rồi chuyển sang instruction cue sớm hơn nữa — phản ứng dời về các predictor sớm hơn và biến mất khỏi các stimulus muộn hơn.
- C. Dopamine neuron chỉ phản ứng với chuyển động cánh tay của con khỉ khi nó với tới lấy phần thưởng.
- D. Phản ứng dopamine tăng dần tại thời điểm reward theo số lần lặp và không bao giờ chuyển dịch sang cue dự đoán.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Ban đầu nhiều dopamine neuron phản ứng với reward (giọt nước táo). Khi học tiếp tục, chúng mất phản ứng với reward và phát triển phản ứng với reward-predicting trigger cue; khi thêm instruction cue sớm hơn trigger cue 1 giây, phản ứng chuyển hầu như chỉ còn ở instruction cue sớm nhất. Việc phản ứng chuyển về các predictor sớm hơn và biến mất khỏi predictor muộn hơn là dấu hiệu đặc trưng (hallmark) của TD learning. A và D mâu thuẫn với chính hiện tượng dịch chuyển; C nhầm phản ứng với hoạt động vận động.

</details>

---

**Câu 18.** Khi con khỉ nhấn sai phím và không nhận được reward (hoặc reward bị bỏ qua), dopamine neuron thể hiện điều gì, và tại sao điều này quan trọng?

- A. Nhiều dopamine neuron giảm firing rate xuống dưới baseline ngay sau thời điểm reward thường được giao, mà không cần external cue nào đánh dấu thời điểm đó — cho thấy não nội tại theo dõi timing; giống cách TD error trở nên âm.
- B. Chúng tăng vọt firing rate ngay khi nhận ra mình nhấn sai, biểu hiện một dạng "bất ngờ vui mừng" trước tình huống mới lạ.
- C. Chúng không thay đổi hoạt động chút nào vì không có reward thì không có gì để báo hiệu cho não.
- D. Chúng chỉ phản ứng với phím được instruction cue chỉ định chứ không phản ứng gì với việc thiếu reward.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Trong các trial nhấn sai và không nhận reward, nhiều dopamine neuron giảm firing rate xuống dưới baseline ngay sau thời điểm reward thường được giao, dù không có external cue nào đánh dấu thời điểm đó — chứng tỏ con khỉ nội tại theo dõi timing của reward. Đây là một tính chất chia sẻ với TD learning (TD error trở nên âm khi reward kỳ vọng bị bỏ qua). B sai về dấu (giảm, không tăng); C bỏ qua chính tín hiệu "dưới baseline"; D không giải thích được phản ứng theo timing.

</details>

---

## 15.6 TD Error/Dopamine Correspondence

**Câu 19.** Trong ví dụ policy-evaluation lý tưởng hóa (CSC, TD(0), V khởi tạo bằng 0, γ ≈ 1), khi "learning complete", TD error tại các chuyển dịch khác nhau có giá trị thế nào?

- A. TD error dương ở mọi state và đều bằng R* tại reward state vì không có discounting làm giảm giá trị.
- B. TD error luôn âm trên toàn bộ chuỗi vì value của các state liên tục bị ước lượng quá cao sau khi học.
- C. TD error bằng R* tại mọi reward-predicting state vì không discounting nên value được truyền nguyên vẹn.
- D. TD error bằng 0 ở các chuyển dịch giữa reward-predicting state và tại reward state đã được dự đoán đầy đủ; nhưng dương tại chuyển dịch sang earliest reward-predicting state.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Khi học xong, với chuyển dịch giữa các reward-predicting state: δ = 0 + R* − R* = 0; với chuyển dịch từ latest reward-predicting state sang rewarding state: δ = R* + 0 − R* = 0. Nhưng chuyển dịch sang earliest reward-predicting state cho δ dương (= R* nếu value state trước đó là 0) do chênh lệch giữa value thấp của state trước và value lớn hơn của reward-predicting state tiếp theo. Điều này song hành với việc dopamine response tồn tại bền ở stimulus dự đoán reward sớm nhất, còn reward được dự đoán đầy đủ thì TD error im lặng. A, B, C tính sai δ ở các điểm chuyển dịch.

</details>

---

**Câu 20.** Sau khi học xong, nếu reward đột nhiên bị bỏ qua, TD error tại thời điểm reward thường đến sẽ bằng bao nhiêu (trong ví dụ không discounting)?

- A. δ = −R*, vì δ = Rt + Vt − Vt−1 = 0 + 0 − R* = −R*; value của latest reward-predicting state khi đó quá cao — tương ứng dopamine neuron giảm xuống dưới baseline.
- B. δ = +R*, vì value của state vẫn còn dương nên đẩy prediction error lên phía dương.
- C. δ = 0, vì cả reward nhận được lẫn value của state kế tiếp đều bằng 0 nên triệt tiêu nhau.
- D. δ = 2R*, vì sai số dự đoán bị nhân đôi khi reward kỳ vọng không xuất hiện.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Khi reward bị bỏ qua, value của latest reward-predicting state trở nên quá cao: δ = Rt + Vt − Vt−1 = 0 + 0 − R* = −R*. TD error trở nên âm tại thời điểm reward kỳ vọng, giống như hoạt động dopamine neuron giảm xuống dưới baseline khi reward kỳ vọng bị bỏ qua (Schultz et al. 1993, Figure 15.3). B sai dấu; C bỏ sót số hạng −Vt−1 = −R*; D không có cơ sở toán học.

</details>

---

**Câu 21.** Sự không khớp (discrepancy) nào giữa TD error (với CSC representation) và hoạt động dopamine neuron được nêu là đặc biệt rắc rối, và người ta đề xuất gì để cải thiện?

- A. Khi reward đến muộn hơn dự kiến; giải pháp đề xuất là loại bỏ hoàn toàn eligibility traces khỏi mô hình.
- B. Khi reward đến sớm hơn dự kiến: dopamine phản ứng với reward sớm (phù hợp δ dương) nhưng tại thời điểm muộn khi reward bị bỏ qua, dopamine KHÔNG giảm dưới baseline như TD model dự đoán; đề xuất gồm CSC bị hủy bởi reward, microstimulus representation, prolonged eligibility traces.
- C. TD error về nguyên tắc không bao giờ dự đoán nổi phản ứng với một reward hoàn toàn bất ngờ, nên mô hình cần thay bằng Rescorla–Wagner.
- D. Dopamine neuron luôn giảm xuống dưới baseline trong mọi tình huống bất kể reward có xảy ra hay không, trái với TD error.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Vấn đề rắc rối nhất liên quan đến reward đến sớm hơn dự kiến: dopamine neuron phản ứng với reward sớm (phù hợp δ dương vì reward không được dự đoán xảy ra lúc đó), nhưng tại thời điểm muộn khi reward kỳ vọng bị bỏ qua, hoạt động dopamine không giảm xuống dưới baseline như TD model với CSC dự đoán (Hollerman & Schultz 1998). Các đề xuất cải thiện: CSC mà chuỗi tín hiệu bị hủy khi reward xảy ra (Suri & Schultz 1999), microstimulus representation (Ludvig, Sutton, Kehoe 2008), và prolonged eligibility traces (Pan et al. 2005). Các tinh chỉnh này không bác bỏ tuyên bố cốt lõi của hypothesis. A, C, D mô tả sai bản chất discrepancy.

</details>

---

**Câu 22.** [Khó] Tại sao việc các dopamine neuron chuyển phản ứng từ reward về cue dự đoán sớm nhất (và im lặng ở reward được dự đoán đầy đủ) lại được coi là bằng chứng đặc trưng (hallmark) của TD learning chứ không phải của mô hình Rescorla–Wagner?

- A. Vì Rescorla–Wagner cũng dự đoán đúng hiện tượng này, nên bằng chứng không phân biệt được hai mô hình.
- B. Vì Rescorla–Wagner không có khái niệm thời gian trong trial nên không thể giải thích việc tín hiệu lan ngược (backing up) qua các bước thời gian từ reward tới predictor sớm hơn; chỉ TD, với bootstrapping qua state kế tiếp, mới tạo ra sự dịch chuyển theo thời gian này.
- C. Vì Rescorla–Wagner chỉ áp dụng cho instrumental conditioning còn hiện tượng này thuộc classical conditioning.
- D. Vì TD learning không dùng prediction error còn Rescorla–Wagner thì có, nên chỉ TD mới im lặng khi reward được dự đoán.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Cả Rescorla–Wagner lẫn TD đều giải thích được việc phản ứng *giảm* khi reward được dự đoán đầy đủ (đặc tính error-correcting chung). Điều mà chỉ TD giải thích được là sự *lan ngược qua thời gian*: phản ứng dời dần từ reward về các predictor sớm hơn trong trial. Rescorla–Wagner là mô hình trial-level không có cấu trúc thời gian nội trial, nên không có cơ chế truyền tín hiệu giữa các bước thời gian. TD làm được điều này nhờ bootstrapping qua value của state kế tiếp (V(St) − V(St−1)). A sai (R-W không dự đoán được hiện tượng dịch chuyển); C và D mô tả sai bản chất hai mô hình.

</details>

---

## 15.7 Neural Actor–Critic

**Câu 23.** Hai đặc điểm nào của actor–critic algorithm khiến người ta cho rằng não có thể triển khai một thuật toán kiểu này?

- A. Actor và critic dùng hai reinforcement signal hoàn toàn khác nhau, và mỗi thành phần nằm gọn trong một bán cầu não riêng biệt.
- B. (1) Hai thành phần actor/critic gợi ý dorsal striatum (actor, action selection) và ventral striatum (critic, value learning) đảm nhận vai trò tương ứng; (2) TD error δ là reinforcement signal kép cho cả actor lẫn critic, phù hợp với việc axon dopamine nhắm cả hai phân vùng striatum.
- C. Actor và critic đều học value function chứ không thành phần nào học policy, đơn giản hóa cấu trúc thần kinh.
- D. Critic phát tán reward signal Rt trực tiếp ra khắp não, còn actor học bằng error backpropagation qua nhiều lớp.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Đặc điểm thứ nhất: actor và critic gợi ý hai phần của striatum — dorsal (giống actor, ảnh hưởng action selection) và ventral (giống critic, học value) — đảm nhận vai trò tương ứng. Đặc điểm thứ hai: TD error có vai trò kép là reinforcement signal cho cả actor và critic (dù ảnh hưởng khác nhau lên mỗi thành phần), phù hợp với việc axon dopamine nhắm cả hai phân vùng striatum và dopamine điều biến synaptic plasticity ở cả hai. A, C, D mô tả sai cấu trúc actor–critic (chỉ critic học value, actor học policy; cả hai dùng *chung* δ).

</details>

---

**Câu 24.** Trong sơ đồ neural actor–critic (Figure 15.5b, Takahashi et al. 2008), dopamine neuron ở VTA/SNpc tính TD error và truyền nó đi như thế nào, và một hàm ý quan trọng là gì?

- A. Dopamine neuron mã hóa Rt thuần túy và truyền nó như một master reward signal có thể đo trực tiếp ở một neuron đơn lẻ bất kỳ.
- B. Actor có truy cập trực tiếp tới reward signal còn critic có truy cập trực tiếp tới action, và hai luồng này gặp nhau ở cortex.
- C. TD error được tính ngay trong dorsal striatum rồi gửi ngược lại cortex thông qua một cơ chế error backpropagation nhiều lớp.
- D. Ventral striatum gửi thông tin value tới VTA/SNpc, nơi dopamine neuron kết hợp với thông tin reward để tạo hoạt động tương ứng TD error, rồi axon dopamine điều biến synaptic efficacy của corticostriatal input tới cả hai phân vùng; hàm ý: tín hiệu dopamine KHÔNG phải master reward signal Rt, và input "Reward" là một vector từ nhiều vùng.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Ventral striatum gửi thông tin value tới VTA/SNpc, nơi dopamine neuron kết hợp với thông tin reward để tạo hoạt động tương ứng TD error; axon dopamine điều biến thay đổi synaptic efficacy của input từ cortex tới cả dorsal và ventral striatum (tại các spine của medium spiny neurons). Hàm ý quan trọng: dopamine signal không phải master reward signal scalar Rt — không nhất thiết đo được Rt ở một neuron đơn lẻ; input "Reward" tới VTA/SNpc là một vector thông tin reward từ nhiều vùng não, và Rt lý thuyết tương ứng đóng góp ròng của toàn bộ thông tin đó. A nhầm δ với Rt; B và C mô tả sai luồng tính toán và phủ nhận vai trò của eligibility/dopamine.

</details>

---

## 15.8 Actor and Critic Learning Rules

**Câu 25.** Sự khác biệt cốt lõi duy nhất giữa learning rule của actor và của critic trong neural actor–critic là gì?

- A. Actor dùng TD error còn critic dùng Rescorla–Wagner error làm reinforcement signal khác nhau.
- B. Actor cố giảm |δ| về 0 còn critic cố giữ δ dương nhất có thể, tức hai mục tiêu tối ưu trái ngược.
- C. Chúng dùng các loại eligibility traces khác nhau: critic dùng non-contingent eligibility trace (chỉ phụ thuộc presynaptic activity), còn actor dùng contingent eligibility trace (ngoài presynaptic còn phụ thuộc postsynaptic activity của chính actor unit).
- D. Critic là three-factor learning rule còn actor là two-factor learning rule chỉ phụ thuộc reward và presynaptic input.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Cả hai dùng cùng reinforcement signal là TD error δ, nhưng khác biệt duy nhất nằm ở loại eligibility trace. Critic unit dùng non-contingent eligibility trace (chỉ phụ thuộc presynaptic activity x(St), tích lũy gradient ∇v̂ = x(St)) — đây là two-factor learning rule. Actor dùng contingent eligibility trace, phụ thuộc cả presynaptic lẫn postsynaptic activity (qua thừa số At − π(1|St,θ)) — đây là three-factor learning rule. A sai (cả hai dùng δ); B đảo ngược (actor giữ δ dương — giống Law-of-Effect, critic giảm |δ| về 0 — giống TD model của classical conditioning); D đảo ngược số factor của actor và critic.

</details>

---

**Câu 26.** Spike-timing-dependent plasticity (STDP) và reward-modulated STDP liên quan thế nào tới actor learning rule?

- A. STDP chỉ phụ thuộc vào firing rate trung bình của neuron, hoàn toàn độc lập với timing tương đối của spike.
- B. STDP là dạng Hebbian plasticity mà chiều thay đổi synaptic phụ thuộc thời điểm tương đối của pre/postsynaptic spike; reward-modulated STDP bổ sung yêu cầu một neuromodulator (dopamine) đến trong cửa sổ thời gian (có thể tới 10 giây) sau khi pre theo sau bởi post spike — rất giống actor learning rule với contingent eligibility traces kéo dài.
- C. Reward-modulated STDP chỉ xảy ra ở critic (ventral striatum) chứ không bao giờ ở actor (dorsal striatum).
- D. STDP chứng minh actor-like plasticity không thể tồn tại trong não vì timing spike quá nhanh để dopamine kịp tác động.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — STDP là dạng Hebbian plasticity trong đó thời điểm tương đối của pre/postsynaptic spike quyết định chiều thay đổi synaptic. Reward-modulated STDP là dạng three-factor: thay đổi synaptic chỉ xảy ra nếu có neuromodulatory input (dopamine) đến trong cửa sổ thời gian (Yagishita et al. 2014 cho thấy tới 10 giây) sau khi presynaptic spike được theo sát bởi postsynaptic spike — rất giống actor learning rule. Bằng chứng cho thấy reward-modulated STDP xảy ra ở spine của medium spiny neurons trong dorsal striatum, nơi actor learning diễn ra trong sơ đồ giả định, gợi ý sự tồn tại của contingent eligibility traces kéo dài. A và D phủ nhận bản chất timing-dependent; C sai vị trí (bằng chứng nằm ở dorsal striatum — phía actor).

</details>

---

**Câu 27.** [Khó] Vì sao learning rule của actor cần một contingent eligibility trace (phụ thuộc cả pre- và postsynaptic activity) trong khi critic chỉ cần non-contingent trace — xét theo bản chất của learning to control so với learning to predict?

- A. Vì critic phải nhớ action nào đã được chọn còn actor chỉ cần dự đoán value, nên vai trò của trace bị đảo ngược.
- B. Vì actor cần tương quan action cụ thể đã thực hiện (postsynaptic output) với reinforcement tiếp theo để biết tăng hay giảm xác suất action đó; còn critic chỉ cần học value của state nên một trace ghi nhận state (presynaptic) đã đủ.
- C. Vì critic xử lý control còn actor xử lý prediction, nên critic cần thông tin action còn actor thì không.
- D. Vì cả hai về bản chất cần cùng loại trace, sự phân biệt chỉ là quy ước ký hiệu chứ không có ý nghĩa tính toán.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Critic giải bài toán *prediction* (học value của state): nó chỉ cần biết "đang ở state nào" để cập nhật value đó, nên một eligibility trace phụ thuộc presynaptic activity (mã hóa state) là đủ — đây là non-contingent trace. Actor giải bài toán *control* (học policy): để biết nên tăng hay giảm xác suất của một action, nó phải tương quan action *cụ thể đã được chọn* (phản ánh qua postsynaptic output của actor unit) với reinforcement signal đến sau đó. Do đó actor cần contingent trace phụ thuộc cả pre- lẫn postsynaptic activity (thừa số At − π). A và C đảo ngược vai trò prediction/control; D phủ nhận sự khác biệt tính toán thực chất.

</details>

---

## 15.9 Hedonistic Neurons

**Câu 28.** Hedonistic neuron hypothesis của Klopf (1972, 1982) phỏng đoán điều gì?

- A. Các neuron không thể học mà chỉ truyền tín hiệu một cách thụ động theo các kết nối cố định.
- B. Reward được truyền tới mọi neuron chỉ thông qua một master reward signal trung tâm duy nhất do một vùng não điều phối.
- C. Các neuron cá thể tìm cách tối đa hóa chênh lệch giữa synaptic input được coi là rewarding và punishing, bằng cách điều chỉnh synaptic efficacy dựa trên hệ quả thưởng/phạt của chính action potential của chúng; ông đưa ra khái niệm eligibility.
- D. Eligibility trace trong lý thuyết Klopf là contingent nhưng hoàn toàn không liên quan tới postsynaptic activity của neuron.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Klopf phỏng đoán các neuron cá thể tìm cách tối đa hóa chênh lệch giữa synaptic input được coi là rewarding và punishing, bằng cách điều chỉnh synaptic efficacy dựa trên hệ quả thưởng/phạt của chính action potential của chúng — tức từng neuron có thể được huấn luyện bằng response-contingent reinforcement như một con vật trong instrumental conditioning. Ông giới thiệu khái niệm eligibility: synapse trở nên eligible cho việc thay đổi khi nó tham gia gây ra spike của neuron (đây chính là dạng contingent eligibility trace, phụ thuộc cả pre và post activity). Klopf cố tránh một nguồn huấn luyện trung tâm. A phủ nhận khả năng học; B trái với việc Klopf tránh nguồn trung tâm; D mô tả sai eligibility (nó *có* phụ thuộc postsynaptic activity).

</details>

---

**Câu 29.** Ví dụ về vi khuẩn Escherichia coli (chemotaxis/klinokinesis, "run and twiddle" theo Selfridge) được dùng để minh họa điều gì, và điểm khác biệt then chốt giữa neuron và vi khuẩn là gì?

- A. Minh họa rằng một tế bào đơn lẻ có thể tìm kiếm một số stimuli và tránh số khác bằng trial-and-error; khác biệt là synaptic strength của neuron lưu giữ thông tin về hành vi trial-and-error quá khứ, trong khi vi khuẩn gần như không học/không duy trì long-term memory.
- B. Minh họa rằng vi khuẩn có long-term memory mạnh hơn neuron, nhờ đó thích nghi tốt hơn với gradient hóa học của môi trường.
- C. Minh họa rằng neuron không cần bất kỳ feedback loop nào với môi trường để học, khác với vi khuẩn vốn phụ thuộc feedback.
- D. Minh họa rằng chemotaxis của vi khuẩn chính là một dạng đầy đủ của TD learning có discounting và eligibility traces.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — E. coli là ví dụ một tế bào đơn tìm kiếm một số phân tử (attractant) và tránh số khác (repellant) qua trial-and-error (klinokinesis, "run and twiddle"). Tuy nhiên vi khuẩn chỉ cần một chút short-term memory để phát hiện gradient và gần như không học/không duy trì long-term memory. Khác biệt then chốt: synaptic strength của neuron lưu giữ thông tin về hành vi trial-and-error quá khứ. Bản chất closed-loop trong tương tác của neuron với "môi trường" của nó là quan trọng để hiểu hành vi của nó. B đảo ngược (vi khuẩn có ít memory hơn); C sai (neuron là closed-loop với môi trường); D phóng đại chemotaxis thành TD learning đầy đủ.

</details>

---

## 15.10 Collective Reinforcement Learning

**Câu 30.** Khi tất cả thành viên của một quần thể reinforcement learning agent học theo một reward signal chung do hoạt động tập thể của cả nhóm quyết định, đây được gọi là gì và thách thức cốt lõi là gì?

- A. Một competitive game; thách thức cốt lõi là tránh xung đột lợi ích giữa các agent vốn cạnh tranh trực tiếp về reward.
- B. Một cooperative game (team problem); thách thức cốt lõi là structural credit assignment — xác định thành viên/nhóm nào xứng đáng credit hay blame — vì mỗi agent chỉ đóng góp một thành phần của collective action và ảnh hưởng bị vùi trong nhiễu.
- C. Một bài toán supervised learning với error backpropagation phân tán giữa các agent qua một mạng kết nối.
- D. Một bài toán về nguyên tắc không thể học được vì các agent không giao tiếp trực tiếp với nhau để phối hợp.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Khi mọi agent cố tối đa hóa một reward signal chung nhận đồng thời, đây là cooperative game hay team problem (không có xung đột lợi ích). Reward signal chung đánh giá collective action của cả team, nên mỗi agent chỉ ảnh hưởng hạn chế. Thách thức cốt lõi là structural credit assignment: thành viên nào xứng đáng credit/blame. Đáng chú ý: nếu mỗi agent học hiệu quả dù reward signal nhiễu lớn và thiếu state đầy đủ, cả team vẫn học được collective action tốt hơn, kể cả khi không giao tiếp. A nhầm với competitive game; C nhầm với supervised; D mâu thuẫn với kết quả rằng team vẫn học được.

</details>

---

**Câu 31.** Tại sao non-contingent eligibility traces không hoạt động trong bối cảnh team problem (học để control), nhưng contingent eligibility traces lại cần thiết?

- A. Non-contingent traces quá tốn bộ nhớ để duy trì trên quy mô một quần thể lớn nên không khả thi về mặt sinh học.
- B. Contingent traces không phụ thuộc postsynaptic activity nên đơn giản và rẻ hơn, do đó được ưu tiên trong team.
- C. Non-contingent traces chỉ phụ thuộc presynaptic input, không tương quan được action với thay đổi của reward signal — phù hợp learning to predict (critic) chứ không learning to control; contingent traces lưu thông tin về action đã thực hiện trong state nào nên cho phép phân bổ credit/blame cho policy parameters.
- D. Cả hai loại trace đều hoàn toàn tương đương trong team problem; sự lựa chọn giữa chúng chỉ là vấn đề thuận tiện cài đặt.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Non-contingent eligibility traces chỉ phụ thuộc presynaptic activity nên không cung cấp cách tương quan action với thay đổi tiếp theo của reward signal; chúng phù hợp learning to predict (như critic) nhưng không cho learning to control (như actor). Contingent eligibility traces giữ thông tin về action nào được thực hiện trong state nào (action memory), cho phép phân bổ credit cho reward (δ dương) hoặc blame cho punishment (δ âm) tới các policy parameters theo đóng góp của chúng. Ngoài ra team cần variability trong action (ví dụ Bernoulli-logistic REINFORCE units) để khám phá không gian collective action; Williams (1992) cho thấy team như vậy thực hiện policy gradient theo average reward rate và là một thay thế khả dĩ về mặt thần kinh cho error backpropagation. A và B sai về lý do (không phải bộ nhớ; contingent trace *có* phụ thuộc post activity); D phủ nhận sự khác biệt chức năng.

</details>

---

## 15.11 Model-based Methods in the Brain

**Câu 32.** Các thí nghiệm inactivation và outcome-devaluation gợi ý sự phân công nào giữa dorsolateral striatum (DLS) và dorsomedial striatum (DMS) ở loài gặm nhấm?

- A. DLS liên quan nhiều hơn tới model-free (habitual) processes; DMS liên quan nhiều hơn tới model-based (goal-directed) processes — vô hiệu hóa DLS làm suy giảm habit learning, vô hiệu hóa DMS làm suy giảm goal-directed processes.
- B. DLS liên quan tới model-based (goal-directed) processes còn DMS liên quan tới model-free (habitual) processes, đối nghịch với phân công thông thường.
- C. Cả DLS lẫn DMS đều chỉ liên quan tới reward processing thuần túy, không liên quan gì tới action selection hay điều khiển hành vi.
- D. DLS và DMS đều hoàn toàn không liên quan tới habitual hay goal-directed behavior; cả hai chỉ chuyển tiếp tín hiệu vận động.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Vô hiệu hóa DLS làm suy giảm habit learning, khiến con vật phải dựa nhiều hơn vào goal-directed processes; vô hiệu hóa DMS làm suy giảm goal-directed processes, buộc con vật dựa nhiều hơn vào habit learning. Vậy DLS liên quan nhiều hơn tới model-free processes còn DMS liên quan nhiều hơn tới model-based processes. Kết quả này cho thấy giả thuyết actor–critic đặt actor ở dorsal striatum là quá đơn giản. B đảo ngược phân công; C và D phủ nhận vai trò trong điều khiển hành vi.

</details>

---

**Câu 33.** Vai trò của hippocampus trong model-based behavior được minh họa thế nào qua các thí nghiệm decode hoạt động neuron (Johnson & Redish 2007; Pfeiffer & Foster 2013)?

- A. Hippocampus chỉ lưu trữ value function của các state và không tham gia vào bất kỳ dạng planning hay mô phỏng tương lai nào.
- B. Khi chuột dừng tại choice point, biểu diễn không gian trong hippocampus "quét" về phía trước (forward) dọc các đường đi khả dĩ, và quỹ đạo này tương ứng chặt chẽ với hành vi điều hướng tiếp theo — gợi ý hippocampus là một phần của hệ dùng model để mô phỏng chuỗi state tương lai (một dạng planning).
- C. Hippocampus chỉ quét ngược lại (backward) các state đã đi qua để cập nhật reward, giống hệt cơ chế của thuật toán Dyna.
- D. Hippocampus chỉ liên quan tới reward value của stimulus hiện tại, tương tự vai trò của orbitofrontal cortex (OFC).

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Khi chuột dừng tại choice point, biểu diễn không gian trong hippocampus quét về phía trước (không phải lùi) dọc các đường khả dĩ (Johnson & Redish 2007), và các quỹ đạo này tương ứng chặt chẽ với hành vi điều hướng tiếp theo (Pfeiffer & Foster 2013). Điều này gợi ý hippocampus then chốt cho phần state-transition của environment model và là một phần của hệ dùng model để mô phỏng các chuỗi state tương lai nhằm đánh giá hậu quả của các phương án hành động — một dạng planning. (OFC liên quan tới phần reward của model — nên D sai.) A phủ nhận vai trò planning; C sai chiều quét (forward, không backward).

</details>

---

## 15.12 Addiction

**Câu 34.** Mô hình addiction của Redish (2004) dựa trên reward prediction error hypothesis giải thích đặc điểm nào của nghiện, và bằng cơ chế gì?

- A. Cocaine làm giảm dopamine nên TD error luôn âm, khiến con vật học cách tránh xa ma túy gây nghiện.
- B. Việc dùng cocaine tạo một surge dopamine làm tăng TD error δ theo cách không thể bị triệt tiêu bởi thay đổi value function — mô hình ngăn δ trở nên âm khi reward đến từ ma túy, loại bỏ tính tự-sửa-sai của TD learning, khiến value của các state đó tăng vô hạn và các action dẫn tới chúng được ưu tiên hơn mọi action khác.
- C. Ma túy gây nghiện làm dopamine neuron ngừng phóng hoàn toàn, nên con vật mất khả năng học bất kỳ điều gì mới.
- D. Mô hình giải thích đầy đủ và toàn diện mọi khía cạnh của addiction, bao gồm cả dung nạp (tolerance) và thay đổi ở nhiều vùng não.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Mô hình Redish dựa trên quan sát rằng cocaine và một số ma túy gây nghiện tạo surge dopamine tạm thời. Surge này được giả định làm tăng TD error δ theo cách không thể bị triệt tiêu bởi thay đổi value function: phần đóng góp do stimulus gây nghiện không giảm khi reward được dự đoán — drug rewards không thể bị "predicted away". Mô hình ngăn δ trở nên âm khi reward đến từ ma túy, loại bỏ đặc tính error-correcting của TD learning cho các state liên quan dùng thuốc, khiến value của chúng tăng không giới hạn và các action dẫn tới chúng được ưu tiên trên mọi action khác. A sai (cocaine tăng, không giảm dopamine); C sai cơ chế; D phóng đại (đây không phải mô hình đầy đủ — không bao gồm tolerance, model-based processes...).

</details>

---

**Câu 35.** [Khó] Theo mô hình Redish, điều gì khiến reward từ ma túy gây nghiện về cơ bản khác với reward tự nhiên (như thức ăn) trong khuôn khổ TD learning, và hệ quả hành vi là gì?

- A. Reward tự nhiên tạo δ âm còn ma túy tạo δ dương, nên ma túy luôn được học nhanh hơn thức ăn.
- B. Với reward tự nhiên, khi nó được dự đoán đầy đủ thì δ tiến về 0 (học bão hòa); với ma túy, surge dopamine đặt một sàn dương không thể bị "predicted away", nên value tiếp tục tăng mỗi lần dùng và hành vi tìm thuốc được củng cố không giới hạn.
- C. Ma túy không tạo ra dopamine còn thức ăn thì có, nên chỉ thức ăn mới có thể được học qua TD.
- D. Sự khác biệt nằm ở chỗ ma túy là model-based reward còn thức ăn là model-free reward, dẫn tới hai hệ thống học khác nhau.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Với reward tự nhiên, cơ chế error-correcting của TD learning khiến δ tiến dần về 0 khi reward được dự đoán đầy đủ — value hội tụ và hành vi ổn định. Mô hình Redish giả định ma túy gây nghiện tạo một surge dopamine dược lý đặt một thành phần dương không thể bị triệt tiêu bởi value prediction (drug reward không thể bị "predicted away"). Vì δ không bao giờ giảm về 0 ở các state liên quan dùng thuốc, value của chúng tăng không giới hạn qua mỗi lần dùng, và các action dẫn tới chúng được ưu tiên trên mọi lựa chọn khác — mô hình hóa tính cưỡng bức của hành vi tìm thuốc. A sai dấu (reward tự nhiên cũng tạo δ dương khi bất ngờ); C sai (ma túy *tăng* dopamine); D mô tả sai (cả hai đều trong khuôn khổ model-free TD trong mô hình này).

</details>

---

## 15.13 Summary

**Câu 36.** Theo phần Summary, kết luận tổng quát nào sau đây phản ánh đúng tinh thần của chương về mối tương ứng giữa reinforcement learning và neuroscience?

- A. Mọi đặc điểm của thuật toán RL đều được thiết kế dựa trên dữ liệu neuroscience về dopamine có sẵn từ trước đó.
- B. Reward prediction error hypothesis đã bị bác bỏ hoàn toàn bởi các thí nghiệm gần đây về subpopulation của dopamine neuron.
- C. Phasic responses của dopamine neuron là reinforcement signal (TD error δ), không phải reward signal; não có thể triển khai thứ gì đó giống actor–critic với dorsal/ventral striatum; điểm đáng chú ý là TD learning được phát triển hoàn toàn từ góc độ tính toán trước các thí nghiệm dopamine, nên sự tương ứng là không định trước.
- D. Dopamine signal chính là master reward signal Rt và có thể đo trực tiếp, không sai lệch, tại một dopamine neuron đơn lẻ bất kỳ.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Phần Summary nhấn mạnh: phasic responses của dopamine neuron là reinforcement signal (TD error δ trong hầu hết thuật toán), không phải reward signal; một giả thuyết nổi bật là não triển khai thứ gì đó giống actor–critic với dorsal/ventral striatum đóng vai actor/critic, dùng chung TD error; learning rule của actor tương ứng reward-modulated STDP; ý tưởng eligibility bắt nguồn từ hedonistic neuron của Klopf; dopamine phát tán rộng phù hợp với team problem. Điểm đáng chú ý: RL và TD learning được phát triển thuần túy từ góc độ tính toán nhiều năm trước các thí nghiệm dopamine, khiến sự tương ứng (dù không hoàn hảo) là không định trước. A đảo ngược trình tự lịch sử; B sai (hypothesis được tinh chỉnh, không bị bác bỏ); D nhầm δ với master Rt đo được ở neuron đơn lẻ.

</details>
