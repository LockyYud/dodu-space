# Chương 14: Psychology — Câu hỏi trắc nghiệm

> Bộ câu hỏi ôn tập chi tiết cho Chương 14, sách *Reinforcement Learning: An Introduction* (Sutton & Barto, 2nd ed.)

## 14.1 Prediction and Control

**Câu 1.** Theo chương này, hai phạm trù lớn của các thuật toán reinforcement learning là *prediction* và *control*. Chúng tương ứng (một cách gần đúng) với hai phạm trù học nào mà các nhà tâm lý học đã nghiên cứu?

- A. Habituation (quen nhờn với kích thích lặp lại) và sensitization (nhạy cảm hóa với kích thích mạnh).
- B. Classical (Pavlovian) conditioning và instrumental (operant) conditioning.
- C. Latent learning (học tiềm ẩn khi không có reward) và insight learning (học bằng đốn ngộ).
- D. Imprinting (in dấu lên đối tượng đầu đời) và imitation (bắt chước hành vi đồng loại).

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Chương khẳng định prediction tương ứng với classical/Pavlovian conditioning, còn control tương ứng với instrumental/operant conditioning. Đây là phép tương ứng cốt lõi xuyên suốt cả chương. Các cặp ở A, C, D đều là hiện tượng học có thật trong tâm lý học nhưng không phải hai phạm trù mà tác giả dùng để ánh xạ prediction/control.

</details>

---

**Câu 2.** Tại sao prediction algorithms (các thuật toán dự đoán) lại tương ứng với classical conditioning?

- A. Vì cả hai đều yêu cầu reinforcing stimulus phải phụ thuộc (contingent) vào hành vi của con vật.
- B. Vì cả hai đều dựa trên việc tối đa hóa reward tức thời tại mỗi thời điểm tương tác.
- C. Vì cả hai đều dự đoán (predict) các stimuli sắp tới, bất kể stimuli đó có mang tính thưởng/phạt hay không.
- D. Vì cả hai đều cần một environment model đầy đủ để lập kế hoạch trước khi hành động.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Sự tương ứng nằm ở chỗ prediction algorithms ước lượng các đại lượng phụ thuộc vào tương lai (đặc biệt là reward kỳ vọng), trong khi classical conditioning là việc con vật học cách dự đoán US dựa trên CS. A mô tả đặc trưng của instrumental conditioning (contingency là dấu hiệu của control). B sai vì prediction hướng tới dự đoán dài hạn chứ không phải reward tức thời. D mô tả model-based planning, không phải bản chất của prediction/classical conditioning.

</details>

---

**Câu 3.** Đặc điểm phân biệt then chốt giữa instrumental conditioning và classical conditioning là gì?

- A. Trong instrumental conditioning, reinforcing stimulus là *contingent* (phụ thuộc) vào hành vi con vật; trong classical conditioning thì không.
- B. Classical conditioning chỉ áp dụng cho động vật có vú, còn instrumental áp dụng cho hầu hết các loài.
- C. Instrumental conditioning chỉ liên quan đến punishment, còn classical conditioning chỉ liên quan đến reward.
- D. Classical conditioning luôn đòi hỏi một environment model, còn instrumental thì hoàn toàn model-free.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Trong instrumental/operant conditioning, việc nhận reinforcing stimulus phụ thuộc vào hành vi (behavior-contingent). Trong classical conditioning, US được trao độc lập với hành vi của con vật. Đây là điểm khác biệt cốt lõi được nhấn mạnh cả trong phần 14.1 lẫn phần Summary. B, C, D đều là những phát biểu sai lệch không có trong sách.

</details>

---

**Câu 4.** Chương lưu ý rằng việc xem classical conditioning thuần túy là prediction còn instrumental conditioning thuần túy là control chỉ là một "first approximation". Vì sao?

- A. Vì instrumental conditioning thực ra cũng chỉ thuần túy là dự đoán, không hề điều khiển hành vi.
- B. Vì classical conditioning cũng liên quan đến action nên cũng là một dạng control (Pavlovian control), và hai loại conditioning tương tác lẫn nhau.
- C. Vì trong thực nghiệm với động vật, control luôn quan trọng hơn prediction về mặt sinh tồn.
- D. Vì các nhà tâm lý học nhìn chung không công nhận sự phân biệt prediction/control này.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Tác giả nhấn mạnh thực tế phức tạp hơn: classical conditioning cũng liên quan tới action nên là một dạng control (Pavlovian control), và classical với instrumental conditioning tương tác với nhau trong hầu hết tình huống thí nghiệm. Tuy nhiên việc gắn classical↔prediction và instrumental↔control vẫn là một xấp xỉ ban đầu thuận tiện.

</details>

---

**Câu 5.** Trong tâm lý học, thuật ngữ *reinforcement* được dùng như thế nào trong chương này?

- A. Nó chỉ được dùng cho classical conditioning, không dùng cho instrumental conditioning.
- B. Nó dùng để mô tả việc học ở cả classical lẫn instrumental conditioning, và một *reinforcer* là stimulus được xem là nguyên nhân gây thay đổi hành vi, dù có contingent vào hành vi trước đó hay không.
- C. Nó chỉ chỉ việc làm mạnh (strengthening) hành vi và không bao giờ chỉ việc làm yếu (weakening).
- D. Nó chỉ dùng cho các tác nhân hóa học của não như dopamine và các neuromodulator.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Trong tâm lý học, *reinforcement* mô tả việc học ở cả hai loại conditioning. *Reinforcer* là stimulus được coi là nguyên nhân thay đổi hành vi, bất kể có contingent hay không. C sai vì ban đầu reinforcement chỉ việc làm mạnh hành vi nhưng nay thường dùng cả cho làm yếu. A và D thu hẹp khái niệm sai lệch.

</details>

---

**Câu 6.** [Khó] Phân biệt giữa *reinforcer* (theo nghĩa tâm lý học) và *reward signal* (theo nghĩa RL) trong chương: phát biểu nào đúng nhất?

- A. Reinforcer luôn đồng nhất với reward signal $R_t$ và cả hai luôn dương khi hành vi được làm mạnh.
- B. Reward signal $R_t$ trong RL luôn được trao một cách contingent vào action, còn reinforcer thì không bao giờ contingent.
- C. Reinforcer là stimulus được coi là nguyên nhân của thay đổi hành vi (gồm cả CS bậc cao và US), có thể contingent hoặc không; reward signal là tín hiệu số mà agent muốn tối đa hóa, và conditioned reinforcer ánh xạ tốt hơn tới value-based prediction.
- D. Reward signal là khái niệm tâm lý học, còn reinforcer là khái niệm thuần túy kỹ thuật của RL.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Reinforcer là khái niệm rộng của tâm lý học: stimulus được coi là nguyên nhân của thay đổi hành vi, có thể contingent (instrumental) hoặc không (classical), và bao gồm cả primary lẫn secondary/conditioned reinforcer. Reward signal $R_t$ là tín hiệu số mà RL agent tối đa hóa. A sai vì reinforcer không nhất thiết đồng nhất với $R_t$ (ví dụ conditioned reinforcer gắn với value function). B đảo ngược tính contingent. D đảo ngược hai khái niệm.

</details>

---

## 14.2 Classical Conditioning

**Câu 7.** Trong thí nghiệm kinh điển của Pavlov, hãy ghép đúng các thuật ngữ. Tiếng metronome (ban đầu trung tính) được lặp lại trước khi cho thức ăn, cho đến khi con chó tiết nước bọt với tiếng metronome:

- A. Thức ăn = CR, metronome = UR, tiết nước bọt với thức ăn = CS, tiết nước bọt với metronome = US.
- B. Thức ăn = US, metronome = CS, tiết nước bọt với metronome = CR, tiết nước bọt với thức ăn = UR.
- C. Thức ăn = CS, metronome = US, tiết nước bọt với metronome = UR, tiết nước bọt với thức ăn = CR.
- D. Thức ăn = UR, metronome = CR, tiết nước bọt với metronome = US, tiết nước bọt với thức ăn = CS.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Thức ăn là unconditioned stimulus (US), phản xạ tiết nước bọt bẩm sinh với thức ăn là unconditioned response (UR). Metronome ban đầu trung tính trở thành conditioned stimulus (CS) khi con vật học rằng nó dự đoán US, và phản ứng tiết nước bọt với metronome là conditioned response (CR). US được gọi là reinforcer. Các phương án còn lại hoán đổi sai vai trò các thuật ngữ.

</details>

---

**Câu 8.** Trong thí nghiệm rabbit nictitating membrane (màng mắt thứ ba của thỏ) với tone CS dự đoán air puff US, CR tiến hóa khác UR như thế nào để có lợi hơn?

- A. CR bắt đầu *trước* khi air puff xuất hiện và được canh thời gian sao cho màng đóng cực đại đúng lúc air puff khả năng xảy ra, mang tính dự đoán (anticipatory) và bảo vệ tốt hơn.
- B. CR xảy ra muộn hơn US một khoảng để con vật tiết kiệm năng lượng cơ bắp khi chưa thực sự cần thiết.
- C. CR có hình dạng và thời điểm giống hệt UR, chỉ khác ở chỗ nó do tone gây ra chứ không do air puff.
- D. CR chỉ xuất hiện sau khi air puff đã kết thúc hoàn toàn, đóng vai trò làm dịu kích ứng còn lại.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Sau huấn luyện, tone gây ra CR là đóng màng bắt đầu trước air puff và được canh thời gian sao cho đóng cực đại đúng lúc air puff dự kiến. Vì mang tính dự đoán và canh thời gian phù hợp, CR bảo vệ tốt hơn so với chỉ phản ứng lại US gây kích ứng. B, C, D mô tả sai thời điểm: điểm mấu chốt là CR đi *trước* và *dự đoán* US.

</details>

---

**Câu 9.** Sự khác biệt giữa *delay conditioning* và *trace conditioning* là gì?

- A. Trong delay conditioning, US đến trước CS một khoảng; trong trace conditioning, CS đến trước US một khoảng.
- B. Delay conditioning chỉ áp dụng cho thỏ, còn trace conditioning chỉ áp dụng cho chó.
- C. Trong trace conditioning, CS và US luôn xuất hiện hoàn toàn đồng thời (simultaneous).
- D. Trong delay conditioning, CS kéo dài suốt ISI (thường kết thúc khi US kết thúc); trong trace conditioning, US bắt đầu *sau* khi CS đã offset, để lại một khoảng "trace interval".

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Trong delay conditioning, CS trải dài suốt interstimulus interval (ISI) và thường kết thúc khi US kết thúc. Trong trace conditioning, US bắt đầu sau khi CS đã offset, và khoảng giữa CS offset và US onset gọi là trace interval. A mô tả backward conditioning (sai thứ tự). C mô tả simultaneous conditioning, không phải trace. B sai hoàn toàn về phạm vi loài.

</details>

---

### 14.2.1 Blocking and Higher-order Conditioning

**Câu 10.** Hiện tượng *blocking* trong classical conditioning là gì?

- A. Con vật học CR nhanh hơn đáng kể khi có hai CS được trình bày cùng lúc thay vì một.
- B. Con vật *không* học được CR với một CS tiềm năng khi CS này được trình bày cùng một CS khác mà trước đó đã được dùng để điều kiện hóa con vật tạo ra CR đó.
- C. Con vật quên hoàn toàn CR đã học trước đó khi gặp một CS mới hoàn toàn.
- D. Con vật bắt đầu tiết nước bọt với mọi stimulus trung tính trong môi trường thí nghiệm.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Blocking xảy ra khi việc học CR với một CS mới bị "chặn" bởi việc học trước đó với một CS khác. Ví dụ: thỏ đã được điều kiện hóa với tone; sau đó thêm light vào tạo compound tone/light; cuối cùng trình bày light đơn lẻ thì thỏ tạo rất ít hoặc không có CR — việc học với light đã bị blocking bởi việc học trước với tone. A, C, D mô tả các hiện tượng khác (facilitation, extinction, generalization).

</details>

---

**Câu 11.** Kết quả blocking đã thách thức ý tưởng nào về conditioning?

- A. Ý tưởng rằng conditioning đòi hỏi một environment model để lập kế hoạch trước.
- B. Ý tưởng rằng dopamine và các neuromodulator có liên quan tới quá trình học.
- C. Ý tưởng rằng conditioning chỉ phụ thuộc vào temporal contiguity đơn thuần (US thường theo sau CS gần nhau về thời gian là điều kiện cần và đủ).
- D. Ý tưởng rằng con vật về nguyên tắc có thể học được higher-order conditioning.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Blocking thách thức quan niệm rằng conditioning chỉ phụ thuộc vào temporal contiguity đơn thuần — tức là việc US thường theo sau CS gần nhau về thời gian là điều kiện cần và đủ cho conditioning. Rescorla–Wagner model sau đó đã đưa ra lời giải thích có ảnh hưởng cho blocking. A, B, D không phải là quan niệm bị blocking phản bác.

</details>

---

**Câu 12.** *Higher-order conditioning* (ví dụ second-order conditioning) là gì?

- A. Conditioning xảy ra khi nhiều US khác nhau được trình bày cùng một lúc.
- B. Một CS đã được điều kiện hóa trước đó đóng vai trò như một US để điều kiện hóa một stimulus trung tính khác.
- C. Conditioning chỉ có thể xảy ra ở các loài động vật bậc cao có vỏ não phát triển.
- D. Quá trình làm yếu dần (extinction) một CR đã được học trước đó.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Higher-order conditioning xảy ra khi một CS đã được điều kiện hóa trước đó đóng vai trò như một US để điều kiện hóa một stimulus ban đầu trung tính khác. Ví dụ của Pavlov: metronome (đã điều kiện hóa) được dùng để khiến con chó tiết nước bọt với hình vuông đen, dù hình vuông chưa bao giờ theo sau bởi thức ăn — đó là second-order conditioning. A, C, D mô tả sai hiện tượng.

</details>

---

**Câu 13.** Vì sao higher-order conditioning (đặc biệt trên bậc hai) khó chứng minh trong thực nghiệm?

- A. Vì higher-order reinforcer mất dần giá trị reinforcing do không được lặp lại theo sau bởi US gốc trong các trials higher-order.
- B. Vì các loài động vật về cơ bản không có khả năng học ở các bậc cao hơn bậc một.
- C. Vì việc đo CR ở các bậc cao đòi hỏi thiết bị ghi sinh lý rất phức tạp và đắt tiền.
- D. Vì hiện tượng này chỉ được quan sát thấy ở một số loài chim nhất định.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Higher-order conditioning khó chứng minh (nhất là trên bậc hai) vì higher-order reinforcer mất dần giá trị reinforcing do không được lặp lại theo sau bởi US gốc trong các trials higher-order (đây thực chất là extinction trials). Nó có thể được duy trì bằng cách xen kẽ first-order trials hoặc cung cấp stimulus tạo năng lượng chung. B, C, D không phải lý do được sách nêu.

</details>

---

**Câu 14.** Trong actor–critic methods, cơ chế nào được mô tả là một analog của *higher-order instrumental conditioning* và giúp giải quyết credit-assignment problem?

- A. Actor cung cấp primary reward trực tiếp cho critic để critic định hướng quá trình học.
- B. Cả actor và critic đều dùng supervised learning với nhãn rõ ràng để học trực tiếp policy tối ưu.
- C. Critic dùng một TD method để đánh giá policy của actor, và các value estimate của nó cung cấp conditioned reinforcement cho actor, giúp đánh giá tức thời ngay cả khi primary reward bị trễ.
- D. Critic loại bỏ hoàn toàn nhu cầu exploration vì nó đã biết trước giá trị của mọi state.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Trong actor–critic methods, critic dùng TD method để đánh giá policy của actor; các value estimate của critic cung cấp conditioned reinforcement cho actor. Đây là analog của higher-order instrumental conditioning (một stimulus dự đoán primary reinforcement trở thành secondary/conditioned reinforcer), giúp giải quyết credit-assignment problem khi primary reward bị trễ. A đảo ngược luồng tín hiệu, B sai về cơ chế học, D sai về vai trò exploration.

</details>

---

### 14.2.2 The Rescorla–Wagner Model

**Câu 15.** Ý tưởng cốt lõi của Rescorla–Wagner model là gì?

- A. Con vật học liên tục mỗi khi có một CS xuất hiện, hoàn toàn độc lập với kỳ vọng của nó.
- B. Con vật chỉ học khi các sự kiện vi phạm kỳ vọng của nó — tức là chỉ khi nó "surprised" (ngạc nhiên).
- C. Con vật học bằng cách xây dựng và truy vấn một cognitive map của môi trường xung quanh.
- D. Con vật học theo cơ chế bootstrapping giữa các time step liên tiếp bên trong một trial.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Ý tưởng cốt lõi của Rescorla–Wagner model là con vật chỉ học khi các sự kiện vi phạm kỳ vọng của nó, tức là chỉ khi nó "surprised" (mà không nhất thiết hàm ý kỳ vọng hay cảm xúc có ý thức). Mô hình được tạo ra chủ yếu để giải thích blocking. C mô tả model-based/cognitive map. D mô tả TD model (trong-trial bootstrapping), không phải Rescorla–Wagner.

</details>

---

**Câu 16.** Trong Rescorla–Wagner model, một giả định then chốt là aggregate associative strength $V_{AX}$ được tính như thế nào, và blocking được giải thích ra sao?

- A. $V_{AX} = V_A \times V_X$; blocking xảy ra do tích của hai associative strength nhỏ luôn cho kết quả gần bằng 0.
- B. $V_{AX}$ chỉ phụ thuộc vào CS mới được thêm vào, hoàn toàn không phụ thuộc vào CS đã học trước đó.
- C. $V_{AX} = V_A + V_X$ (tổng các associative strength của các component); blocking xảy ra vì khi US đã được dự đoán gần như hoàn hảo, prediction error gần bằng 0 nên CS mới gần như không tăng được associative strength.
- D. $V_{AX} = 0$ một cách cố định cho đến khi quá trình học hoàn tất hẳn, sau đó nhảy lên giá trị tiệm cận.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Giả định then chốt là aggregate associative strength $V_{AX} = V_A + V_X$. Blocking được giải thích: khi con vật đã được điều kiện hóa với một CS, $V_{AX}$ đã đạt mức tiệm cận nên prediction error đã giảm về gần 0. US đã được dự đoán gần như hoàn hảo, ít hoặc không có surprise, nên CS mới thêm vào gần như không tăng được associative strength. A, B, D mô tả sai công thức cộng gộp và cơ chế.

</details>

---

**Câu 17.** Từ góc nhìn machine learning, Rescorla–Wagner model tương đương với quy tắc nào?

- A. Một thuật toán model-based planning xây dựng mô hình chuyển trạng thái của môi trường.
- B. Một error-correction supervised learning rule, về cơ bản giống Least Mean Square (LMS), hay Widrow-Hoff, learning rule.
- C. Một thuật toán Monte Carlo control học từ các complete episodes đến trạng thái kết thúc.
- D. Một biến thể Q-learning kết hợp eligibility traces để lan truyền credit qua nhiều bước.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Rescorla–Wagner model là một error-correction supervised learning rule, về cơ bản giống quy tắc Least Mean Square (LMS), hay Widrow-Hoff. Đó là một thuật toán "curve-fitting"/regression tìm các weight (ở đây là associative strengths) làm trung bình bình phương sai số càng nhỏ càng tốt. Prediction error đóng vai trò thước đo surprise. A, C, D mô tả các họ thuật toán khác hẳn.

</details>

---

### 14.2.3 The TD Model

**Câu 18.** Khác biệt căn bản giữa TD model và Rescorla–Wagner model là gì?

- A. TD model là một *real-time model* (t đánh dấu các time step trong/giữa trial), còn Rescorla–Wagner là một *trial-level model* (một bước t đại diện cho cả một trial).
- B. TD model hoàn toàn không dùng prediction error trong khi Rescorla–Wagner model thì có dùng.
- C. TD model loại bỏ hẳn khái niệm associative strength và thay bằng xác suất chuyển trạng thái.
- D. Rescorla–Wagner model sử dụng eligibility traces còn TD model thì không hề dùng đến chúng.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — TD model là real-time model: t đánh dấu các time step bên trong hoặc giữa các trial (ví dụ mỗi 0.01 giây). Rescorla–Wagner là trial-level model, một bước t đại diện cho toàn bộ một trial. TD model có thể nắm bắt timing relationships và higher-order conditioning mà mô hình trial-level không nắm được. B, C, D đảo ngược sự thật về hai mô hình.

</details>

---

**Câu 19.** Trong TD model, $\delta_t$ là TD error $\delta_t = R_{t+1} + \gamma\hat{v}(S_{t+1},w_t) - \hat{v}(S_t,w_t)$. Khi tham số nào bằng 0 thì TD model "quy về" Rescorla–Wagner model?

- A. Khi $\alpha = 0$ (step-size parameter bằng 0, nên không có cập nhật nào).
- B. Khi $\gamma = 0$ (discount factor bằng 0, nên chỉ còn reward tức thời).
- C. Khi $\lambda = 0$ (eligibility trace decay bằng 0).
- D. Khi $R_{t+1} = 0$ (không có reward signal nào tại bước kế tiếp).

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Khi $\lambda = 0$, TD model quy về Rescorla–Wagner model (với hai ngoại lệ: ý nghĩa của t khác nhau — số trial so với time step — và TD model có độ trễ một time step ở prediction target R). TD model tương đương với backward view của semi-gradient TD($\lambda$) với linear function approximation. A khiến mô hình không học gì, B làm mất tính dự đoán dài hạn (không phải điều kiện quy về Rescorla–Wagner), D vô nghĩa với câu hỏi.

</details>

---

**Câu 20.** TD model giải thích higher-order conditioning (và temporal primacy overriding blocking) nhờ ý tưởng cốt lõi nào của các thuật toán TD?

- A. Exploration ngẫu nhiên giúp con vật thử nhiều CS khác nhau trong môi trường.
- B. Bootstrapping (backing-up): cập nhật associative strength tại một state hướng về strength tại các state về sau, khiến số hạng $\gamma\hat{v}(S_{t+1},w_t) - \hat{v}(S_t,w_t)$ có cùng vai trò như $R_{t+1}$.
- C. Supervised learning với nhãn đúng được cung cấp rõ ràng cho mỗi cặp CS–US.
- D. Planning với một environment model đầy đủ để mô phỏng trước hậu quả tương lai.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — TD model dựa trên ý tưởng bootstrapping/backing-up: cập nhật associative strength tại một state hướng về strength tại các state về sau. Số hạng $\gamma\hat{v}(S_{t+1},w_t)-\hat{v}(S_t,w_t)$ trong TD error có cùng vai trò với $R_{t+1}$, nên về mặt học không có khác biệt giữa một temporal difference và sự xuất hiện của một US — đó là cơ sở của higher-order conditioning. A, C, D không phải cơ chế của TD model.

</details>

---

### 14.2.4 TD Model Simulations

**Câu 21.** Ba dạng stimulus representation được dùng với TD model (Ludvig, Sutton, Kehoe, 2012) là complete serial compound (CSC), microstimulus (MS), và presence representation. Phát biểu nào đúng?

- A. CSC là dạng biểu diễn thực tế nhất về mặt sinh học của não bộ trong ba dạng.
- B. Presence representation có một feature cho mỗi component CS (1 khi có mặt, 0 khi vắng); CSC giống một "tapped delay line" với các tín hiệu nội bộ ngắn, không chồng lấn; MS nằm ở giữa với các microstimuli kéo dài và chồng lấn theo thời gian.
- C. Presence representation có khả năng tái tạo đầy đủ và chính xác các chi tiết về timing của CR.
- D. MS representation không cho phép TD model liên hệ với bất kỳ hiện tượng thần kinh nào.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Presence representation: một feature cho mỗi component CS (1 khi có mặt, 0 khi không). CSC: mỗi stimulus khởi tạo chuỗi tín hiệu nội bộ ngắn được canh thời gian chính xác, không chồng lấn — giống "tapped delay line". MS: các microstimuli kéo dài và chồng lấn, thực tế hơn về mặt sinh học (chứ không phải CSC như A nói). C sai vì presence representation thiếu chi tiết timing. D sai vì MS chính là dạng giúp liên hệ với thần kinh.

</details>

---

**Câu 22.** Về thời gian diễn tiến (time course) của US prediction $\hat{v}$ với các representation khác nhau (Figure 14.4), phát biểu nào đúng?

- A. Với CSC representation, US prediction tăng theo hàm mũ suốt khoảng CS–US và đạt cực đại đúng lúc US xảy ra (do discounting); còn presence representation tạo prediction gần như hằng số nên không tái tạo được nhiều đặc điểm timing của CR.
- B. Với presence representation, US prediction tăng theo hàm mũ và đạt đỉnh chính xác đúng lúc US xảy ra.
- C. Cả ba representation đều cho cùng một đường cong US prediction giống hệt nhau theo thời gian.
- D. Với MS representation, US prediction luôn giữ ở mức 0 cho tới khi US thực sự xuất hiện.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Với CSC, đường cong US prediction tăng theo hàm mũ suốt khoảng CS–US và đạt cực đại đúng lúc US (mức tăng mũ là kết quả của discounting). Với presence representation, US prediction gần như hằng số khi stimulus có mặt nên không tái tạo được nhiều đặc điểm timing của CR. Với MS, sau nhiều trials đường cong xấp xỉ tốt đường cong của CSC. B gán nhầm tính chất của CSC cho presence. C và D sai.

</details>

---

**Câu 23.** TD model gợi ý một "normative account" của classical conditioning. Điều đó có nghĩa gì?

- A. Nó mô tả chính xác đến từng chi tiết mọi đặc điểm hành vi của một loài động vật cụ thể.
- B. Nó gợi ý rằng hệ thần kinh con vật đang cố hình thành các *dự đoán dài hạn chính xác* (long-term prediction), thay vì chỉ dự đoán tức thời, trong giới hạn cách stimuli được biểu diễn.
- C. Nó loại bỏ hoàn toàn nhu cầu về một stimulus representation nào đó trong quá trình học.
- D. Nó dựa hoàn toàn vào một Bayesian probabilistic framework để suy luận về các stimuli.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Đặc điểm đáng chú ý nhất của TD model là nó dựa trên một lý thuyết gợi ý rằng hệ thần kinh con vật đang cố làm gì trong quá trình conditioning: cố hình thành các dự đoán dài hạn chính xác (long-term prediction), nhất quán với giới hạn do cách biểu diễn stimuli. Đó là một normative account trong đó dự đoán dài hạn (chứ không phải tức thời) là đặc điểm then chốt. A mô tả descriptive model, C và D sai.

</details>

---

## 14.3 Instrumental Conditioning

**Câu 24.** Thí nghiệm "puzzle box" của Thorndike với mèo đã dẫn đến công thức nào, và nó mô tả kiểu học gì?

- A. Rescorla–Wagner model; mô tả việc học liên tưởng trong classical conditioning.
- B. Expectancy theory; mô tả latent learning của động vật khi khám phá môi trường.
- C. Law of Contiguity; mô tả hiện tượng habituation với kích thích lặp lại.
- D. Law of Effect; mô tả learning by trial and error (học bằng thử và sai).

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Thí nghiệm puzzle box của Thorndike (mèo học cách thoát khỏi hộp, thời gian thoát giảm dần qua các lần) dẫn đến Law of Effect — định luật mô tả learning by trial and error. Các xung lực không thành công bị "stamped out" còn xung lực thành công bị "stamped in". A, B, C gắn sai tên định luật và kiểu học.

</details>

---

**Câu 25.** Hai đặc điểm cốt lõi của reinforcement learning algorithms tương ứng với Law of Effect là gì?

- A. Tính selectional (thử các phương án và chọn lựa bằng cách so sánh hậu quả) và tính associative (gắn các phương án được chọn với các tình huống/states cụ thể để tạo policy).
- B. Tính model-based (lập kế hoạch trước) và tính model-free (học thuần túy bằng trial-and-error).
- C. Cơ chế discounting (chiết khấu reward tương lai) và cơ chế bootstrapping (cập nhật từ ước lượng).
- D. Học supervised (từ nhãn) và học unsupervised (từ cấu trúc ẩn của dữ liệu).

<details>
<summary>Đáp án</summary>

**Đáp án: A** — RL algorithms vừa *selectional* (thử các phương án và chọn lựa bằng cách so sánh hậu quả) vừa *associative* (gắn các phương án được chọn với các states/situations cụ thể để tạo policy). Thorndike gọi đây là học bằng "selecting and connecting". Natural selection là selectional nhưng không associative; supervised learning là associative nhưng không selectional. B, C, D không phải cặp đặc điểm mà sách ánh xạ vào Law of Effect.

</details>

---

**Câu 26.** Theo chương, Law of Effect kết hợp hai thành phần tính toán cơ bản nào?

- A. Cơ chế discounting reward tương lai và cơ chế eligibility traces lan truyền credit.
- B. Search (thử và chọn lựa giữa nhiều action trong mỗi tình huống) và memory (các association liên kết tình huống với action hoạt động tốt nhất).
- C. Exploration và exploitation, cả hai đều được thực hiện một cách hoàn toàn ngẫu nhiên.
- D. Hai loại tín hiệu củng cố là reward (dương) và punishment (âm) trong môi trường.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Về mặt tính toán, Law of Effect kết hợp search và memory: search dưới dạng thử và chọn lựa giữa nhiều action trong mỗi tình huống, và memory dưới dạng các association liên kết tình huống với action hoạt động tốt nhất. Search và memory là thành phần thiết yếu của mọi RL algorithm, dù memory ở dạng policy, value function, hay environment model. A, C, D không phải hai thành phần được nêu.

</details>

---

**Câu 27.** Về exploration, chương nêu rõ điều gì khi đối chiếu với hành vi mèo của Thorndike?

- A. Exploration của RL bắt buộc phải luôn là "absolutely random, blind groping" để hợp lệ.
- B. Exploration là hoàn toàn không cần thiết một khi đã có Law of Effect dẫn dắt việc học.
- C. RL algorithms cho phép nhiều mức độ guidance trong việc chọn action; exploration không nhất thiết phải là "blind groping" mà có thể dùng innate/prior knowledge, miễn là có *một dạng* exploration nào đó.
- D. Chỉ có epsilon-greedy mới được xem là một phương pháp exploration hợp lệ trong RL.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — RL algorithms cho phép nhiều mức độ guidance trong việc chọn action. Exploration không bắt buộc phải là "blind groping" — trials có thể được tạo bằng các phương pháp tinh vi dùng innate và previously learned knowledge, miễn là có một dạng exploration nào đó. Epsilon-greedy và UCB chỉ là những phương pháp đơn giản nhất. A, B, D quá tuyệt đối và sai.

</details>

---

**Câu 28.** Khái niệm "instinctual impulses" của Thorndike tương ứng với đặc điểm nào của formalism RL?

- A. Discount factor $\gamma$ điều chỉnh mức độ coi trọng reward tương lai.
- B. Tập các admissible actions $\mathcal{A}(s)$ — tập action có thể chọn phụ thuộc vào state hiện tại.
- C. Reward signal $R$ mà agent nhận được sau mỗi action thực hiện.
- D. Eligibility trace decay $\lambda$ kiểm soát tốc độ phai của vết đủ điều kiện.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Mèo chọn action từ các action mà nó bản năng thực hiện trong tình huống hiện tại (Thorndike gọi là "instinctual impulses"). Điều này giống với đặc điểm trong formalism rằng action được chọn từ state s thuộc một tập admissible actions $\mathcal{A}(s)$. Việc chỉ định các tập này có thể làm việc học đơn giản hơn rất nhiều. A, C, D ánh xạ sai khái niệm.

</details>

---

**Câu 29.** Skinner gọi kỹ thuật huấn luyện con vật bằng cách reinforce dần các xấp xỉ liên tiếp của hành vi mong muốn là gì, và nó hữu ích cho RL như thế nào?

- A. Blocking; giúp loại bỏ các action thừa không đóng góp vào hành vi mục tiêu.
- B. Latent learning; cho phép agent học một environment model mà không cần reward.
- C. Outcome devaluation; giúp giảm dần cường độ của các habit không mong muốn.
- D. Shaping; hữu ích khi agent khó nhận được reward signal khác 0 (do reward thưa hoặc khó tiếp cận), bằng cách bắt đầu với bài toán dễ và tăng dần độ khó.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Skinner gọi đây là *shaping* (reinforce các xấp xỉ liên tiếp của hành vi mong muốn — ví dụ huấn luyện bồ câu "bowling"). Shaping rất hữu ích cho RL: khi agent khó nhận bất kỳ reward signal khác 0 nào do reward thưa thớt hoặc khó tiếp cận, bắt đầu với một bài toán dễ rồi tăng dần độ khó khi agent học có thể là chiến lược hiệu quả, đôi khi không thể thiếu. A, B, C là những khái niệm khác.

</details>

---

**Câu 30.** Khái niệm *motivation* trong tâm lý học liên hệ với RL như thế nào theo chương?

- A. Reward signal nằm ở gốc của motivation (agent được thúc đẩy để tối đa hóa tổng reward dài hạn); motivational state tương ứng với các thành phần internal state ảnh hưởng đến điều gì là rewarding; và value functions cung cấp thêm liên hệ với motivation.
- B. Motivation chỉ liên quan duy nhất tới discount factor $\gamma$ của agent.
- C. Motivation không hề có liên hệ nào với khung lý thuyết của RL.
- D. Motivation chỉ đơn thuần là một tên gọi khác cho eligibility trace trong RL.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Reward signal nằm ở gốc của motivation của agent (được thúc đẩy tối đa hóa tổng reward dài hạn). Một số internal state components tương ứng với "motivational state" của con vật, ảnh hưởng đến điều gì là rewarding (ví dụ con vật được thưởng nhiều hơn khi đói). Value functions cũng liên hệ với motivation: động cơ gần (proximal) là leo gradient của value function — chọn action dẫn tới next state có giá trị cao nhất. B, C, D thu hẹp hoặc phủ nhận sai liên hệ này.

</details>

---

## 14.4 Delayed Reinforcement

**Câu 31.** Problem of delayed reinforcement liên quan đến vấn đề nào do Minsky (1961) đặt tên?

- A. Exploration–exploitation dilemma — cân bằng giữa khai thác và khám phá.
- B. Credit-assignment problem — làm sao phân bổ credit cho thành công giữa nhiều quyết định có thể đã tham gia tạo ra nó.
- C. Curse of dimensionality — chi phí tính toán bùng nổ khi không gian state lớn.
- D. Bias–variance tradeoff — cân bằng giữa độ chệch và phương sai của ước lượng.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Problem of delayed reinforcement (học khi reward/penalty đến sau action một khoảng trễ đáng kể, hoặc US theo sau CS offset một khoảng) liên quan đến credit-assignment problem mà Minsky (1961) đặt tên: làm sao phân bổ credit cho thành công giữa nhiều quyết định có thể đã tham gia tạo ra nó. A, C, D là những vấn đề khác trong RL.

</details>

---

**Câu 32.** Hai cơ chế cơ bản mà các thuật toán trong sách dùng để xử lý delayed reinforcement là gì, và chúng tương ứng với những đề xuất nào trong lý thuyết học động vật?

- A. Discounting và exploration; tương ứng với Law of Contiguity của các nhà tâm lý học sớm.
- B. Planning và shaping; tương ứng với cognitive maps mà Tolman đề xuất.
- C. Eligibility traces và value functions học bằng TD methods; tương ứng với stimulus traces (Pavlov, Hull) và secondary/conditioned reinforcement.
- D. Softmax action selection và UCB; tương ứng với hiện tượng behavioral oscillation.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Hai cơ chế là: (1) eligibility traces, và (2) value functions học bằng TD methods cung cấp đánh giá gần như tức thời. Eligibility traces giống stimulus traces của các lý thuyết sớm (Pavlov đề xuất stimulus traces; Hull có "molar stimulus traces" giải thích goal gradient; Klopf 1972 đưa ra eligibility traces ở synapse). Value functions tương ứng với vai trò của secondary/conditioned reinforcement. A, B, D ghép sai cơ chế và lý thuyết.

</details>

---

**Câu 33.** Kiến trúc actor–critic minh họa rõ nhất sự tương ứng với giả thuyết của Hull về delayed reinforcement như thế nào?

- A. Actor học value function để dự đoán return, còn critic trực tiếp chọn action thực thi.
- B. Critic dùng TD algorithm để học value function (dự đoán return của policy hiện tại); TD error của critic đóng vai trò conditioned reinforcement signal cho actor, cung cấp đánh giá tức thời ngay cả khi primary reward bị trễ.
- C. Cả actor và critic đều dùng eligibility traces nhưng không hề sử dụng TD methods.
- D. Critic loại bỏ hoàn toàn primary reward và chỉ học từ conditioned reinforcement.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Critic dùng TD algorithm học value function (dự đoán return của policy hiện tại); actor cập nhật policy dựa trên các thay đổi trong dự đoán của critic. TD error do critic tạo ra đóng vai trò conditioned reinforcement signal cho actor, cung cấp đánh giá tức thời về hiệu năng ngay cả khi primary reward bị trễ đáng kể. A đảo vai trò actor/critic, C phủ nhận TD, D sai về primary reward.

</details>

---

## 14.5 Cognitive Maps

**Câu 34.** *Cognitive maps* trong tâm lý học tương ứng với khái niệm nào trong reinforcement learning?

- A. Policy của một thuật toán model-free thuần túy.
- B. Environment models dùng trong model-based reinforcement learning.
- C. Value function được học bởi thuật toán Q-learning.
- D. Eligibility traces lan truyền credit qua nhiều bước thời gian.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Các thuật toán model-based reinforcement learning dùng environment models có những điểm chung với cognitive maps mà các nhà tâm lý học nói tới. Environment model gồm hai phần: state-transition part (tác động của action lên thay đổi state) và reward-model part; model-based agent dùng model để dự đoán hậu quả của các chuỗi action và lập kế hoạch. A, C, D là những khái niệm RL khác không phải cognitive map.

</details>

---

**Câu 35.** Thí nghiệm *latent learning* (Blodgett) với chuột chạy mê cung đã thách thức quan điểm nào, và kết quả là gì?

- A. Thách thức quan điểm stimulus-response (S–R) — vốn tương ứng với cách model-free đơn giản nhất; chuột nhóm thực nghiệm dù không có reward ở giai đoạn đầu vẫn nhanh chóng bắt kịp nhóm đối chứng ngay khi food được đưa vào, cho thấy chúng đã học (latent) về mê cung.
- B. Thách thức quan điểm rằng động vật có khả năng lập kế hoạch; kết quả là chuột không học được gì khi thiếu reward.
- C. Thách thức Law of Effect; kết quả là chuột học mê cung nhanh hơn hẳn khi không có bất kỳ reward nào.
- D. Thách thức Rescorla–Wagner model; kết quả là chuột không thể học được cấu trúc của mê cung.

<details>
<summary>Đáp án</summary>

**Đáp án: A** — Latent learning thách thức quan điểm S–R (tương ứng cách model-free đơn giản nhất). Chuột nhóm thực nghiệm không có reward ở giai đoạn đầu, nhưng ngay khi food được đưa vào ở giai đoạn hai, chúng nhanh chóng bắt kịp nhóm đối chứng — cho thấy chúng đã phát triển một "latent learning" của mê cung. Cách giải thích cognitive map (Tolman) tương tự việc động vật dùng model-based algorithms. B, C, D mô tả sai cả quan điểm bị thách thức lẫn kết quả.

</details>

---

**Câu 36.** Tolman giải thích rằng động vật học cognitive maps bằng cách học các association nào, và điều này tương ứng với khái niệm kỹ thuật nào?

- A. Học S–R (stimulus-response) associations; tương ứng với policy iteration trong dynamic programming.
- B. Học S–S (stimulus-stimulus) associations qua expectancy theory; tương ứng với cái mà control engineers gọi là *system identification* (học model của hệ thống từ training examples).
- C. Học value functions trực tiếp; tương ứng với temporal-difference learning.
- D. Học eligibility traces; tương ứng với phương pháp Monte Carlo cập nhật từ return đầy đủ.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Tolman cho rằng động vật học stimulus-stimulus (S–S) associations qua việc trải nghiệm các chuỗi stimuli khi khám phá môi trường — trong tâm lý học gọi là expectancy theory. Điều này giống cái mà control engineers gọi là system identification: học model của hệ thống từ training examples dạng S–S', SA–S', S–R, hay SA–R — đều là các dạng supervised learning, có thể học mà không cần reward signal khác 0. A, C, D ghép sai loại association và khái niệm kỹ thuật.

</details>

---

## 14.6 Habitual and Goal-directed Behavior

**Câu 37.** Sự phân biệt giữa model-free và model-based RL algorithms tương ứng với sự phân biệt tâm lý học nào?

- A. Sự phân biệt giữa classical conditioning và instrumental conditioning.
- B. Sự phân biệt giữa habitual control và goal-directed control của hành vi.
- C. Sự phân biệt giữa prediction và control như hai phạm trù thuật toán.
- D. Sự phân biệt giữa exploration và exploitation trong việc chọn action.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Sự phân biệt model-free vs model-based tương ứng với habitual vs goal-directed control. Habits là các pattern hành vi được kích hoạt bởi stimuli phù hợp và thực hiện gần như tự động (model-free); goal-directed behavior có mục đích, được điều khiển bởi kiến thức về giá trị của goals và quan hệ giữa actions và hậu quả của chúng (model-based). A, C, D là những phép ánh xạ khác đã được nêu ở chỗ khác trong chương.

</details>

---

**Câu 38.** Theo Dickinson, habits và goal-directed behavior được điều khiển bởi cái gì?

- A. Habits được điều khiển bởi hậu quả (consequences); còn goal-directed behavior bởi các antecedent stimuli đi trước.
- B. Habits được điều khiển bởi antecedent stimuli (stimuli đi trước); còn goal-directed behavior được điều khiển bởi hậu quả (consequences) của nó.
- C. Cả habits lẫn goal-directed behavior đều chỉ được điều khiển bởi reward tức thời nhận được.
- D. Cả habits lẫn goal-directed behavior đều đòi hỏi một environment model đầy đủ để vận hành.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Theo Dickinson, habits được nói là điều khiển bởi antecedent stimuli (stimuli đi trước), còn goal-directed behavior được điều khiển bởi hậu quả (consequences) của nó. Goal-directed control có ưu điểm thay đổi nhanh hành vi khi môi trường thay đổi; habitual behavior phản ứng nhanh với môi trường quen thuộc nhưng không điều chỉnh nhanh khi môi trường thay đổi. A đảo ngược, C và D sai về cơ chế.

</details>

---

**Câu 39.** Trong ví dụ mê cung (Figure 14.5), khác biệt then chốt giữa chiến lược model-free và model-based khi một goal box thay đổi reward là gì?

- A. Model-free agent thay đổi policy tức thời nhờ planning; còn model-based agent buộc phải trải nghiệm lại từ đầu.
- B. Cả model-free và model-based agent đều phản ứng hoàn toàn giống hệt nhau trước thay đổi reward.
- C. Model-based agent không thể xử lý được bất kỳ thay đổi nào trong cấu trúc reward của môi trường.
- D. Model-free agent phải đi lại qua mê cung, có thể nhiều lần, để trải nghiệm reward mới và cập nhật policy/value; còn model-based agent chỉ cần cập nhật model rồi planning tự động đổi policy mà không cần "personal experience" với các state/action bị ảnh hưởng.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Model-free agent (dựa trên action values hoặc cached policy) phải di chuyển tới state đó, hành động từ đó, có thể nhiều lần, và trải nghiệm hậu quả mới để cập nhật policy/value function. Model-based agent có thể thích ứng mà không cần "personal experience" như vậy: một thay đổi trong model tự động (qua planning) đổi policy. Ví dụ chuột bị đặt trực tiếp vào goal box thấy reward giờ là 1 thay vì 4; reward model thay đổi và planning đổi policy mà không cần chạy lại mê cung. A đảo vai trò, B và C sai.

</details>

---

**Câu 40.** *Outcome-devaluation experiments* (như của Adams và Dickinson, 1981) dùng để làm gì, và kết quả với chuột bị tiêm lithium chloride cho thấy điều gì?

- A. Để đo tốc độ chạy mê cung của chuột; kết quả là chuột bị tiêm chạy nhanh hơn nhóm đối chứng.
- B. Để chứng minh classical conditioning hoạt động; kết quả là chuột bị tiêm tăng mạnh tần suất lever-pressing.
- C. Để xác định hành vi của con vật là habit hay dưới goal-directed control; chuột bị devalue (nhờ cognitive map liên kết lever→pellet→buồn nôn) giảm lever-pressing ngay từ đầu extinction trials dù chưa từng trải nghiệm trực tiếp lever-press dẫn đến buồn nôn — bằng chứng cho goal-directed (model-based) control.
- D. Để đo discount factor $\gamma$ của con vật; kết quả không cho thấy khác biệt rõ ràng nào.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Outcome-devaluation experiments cung cấp thông tin về việc hành vi là habit hay dưới goal-directed control. Adams và Dickinson (1981) huấn luyện chuột nhấn lever lấy pellet, sau đó devalue pellet (bằng lithium chloride gây buồn nôn) khi không có lever, rồi cho extinction training. Chuột bị tiêm giảm lever-pressing ngay từ đầu — dù chưa từng trải nghiệm trực tiếp lever-press dẫn đến buồn nôn. Chúng dường như kết hợp kiến thức về outcome với reward value của outcome — đây là cách giải thích model-based planning. A, B, D sai mục đích và kết quả.

</details>

---

**Câu 41.** Thí nghiệm của Adams (1982) so sánh chuột overtrained (500 rewarded presses) với chuột non-overtrained (sau khoảng 100 presses) sau devaluation cho thấy điều gì, và ý tưởng của Daw, Niv, Dayan (2005) giải thích thế nào về sự chuyển đổi giữa hai mode?

- A. Overtrained rats nhạy cảm hơn với devaluation, chứng tỏ overtraining tạo ra goal-directed control mạnh hơn.
- B. Cả hai nhóm chuột phản ứng giống hệt nhau với devaluation, cho thấy không hề có sự chuyển đổi mode nào.
- C. Model-based control luôn đáng tin cậy hơn model-free control ở mọi giai đoạn của quá trình học.
- D. Devaluation giảm mạnh lever-pressing của non-overtrained rats nhưng ít ảnh hưởng đến overtrained rats — overtraining biến hành vi thành habit; Daw, Niv, Dayan đề xuất con vật dùng cả model-free và model-based, chọn action từ process đáng tin cậy hơn, và khi tích lũy kinh nghiệm thì model-free trở nên đáng tin hơn nên chuyển từ goal-directed sang habitual.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Devaluation giảm mạnh lever-pressing của non-overtrained rats (hành vi goal-directed, nhạy cảm với kiến thức về outcome) nhưng ít ảnh hưởng đến overtrained rats (đã phát triển habit). Daw, Niv, Dayan (2005) đề xuất con vật dùng cả model-free và model-based; action được chọn là của process đáng tin cậy hơn (đo bằng confidence). Sớm trong học, model-based đáng tin hơn; với kinh nghiệm tích lũy, model-free trở nên đáng tin hơn (planning dễ sai do model thiếu chính xác và tree-pruning) — nên có sự chuyển từ goal-directed sang habitual. A đảo kết quả, B và C sai.

</details>

---

**Câu 42.** [Khó] Theo lập luận của Daw, Niv, Dayan (2005), vì sao *sớm* trong quá trình học, model-based control lại thường đáng tin cậy hơn model-free, nhưng *về sau* lại đảo ngược?

- A. Vì model-based luôn cần ít bộ nhớ hơn model-free nên ban đầu chạy nhanh hơn, nhưng sau đó bộ nhớ đầy nên chậm lại.
- B. Vì sớm trong học, ước lượng value của model-free còn thô và ít kinh nghiệm nên kém tin cậy, trong khi model-based suy luận từ chuỗi dự đoán ngắn hạn tương đối chính xác; về sau, model-free tích lũy đủ kinh nghiệm trở nên chính xác, còn planning của model-based tích lũy sai số do model bất toàn và tree-pruning nên kém tin cậy hơn.
- C. Vì model-free chỉ hoạt động được trong môi trường stationary, còn model-based chỉ hoạt động trong môi trường non-stationary.
- D. Vì model-based dùng eligibility traces nên hội tụ nhanh, còn model-free dùng discounting nên hội tụ chậm.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — Daw, Niv, Dayan cho rằng mỗi hệ thống có một độ tin cậy (confidence) khác nhau theo giai đoạn. Sớm trong học, model-free value estimates còn dựa trên rất ít kinh nghiệm nên nhiễu và kém tin cậy, trong khi model-based có thể suy luận qua chuỗi các dự đoán ngắn hạn còn tương đối chính xác. Về sau, model-free value estimates được tinh chỉnh bởi nhiều kinh nghiệm nên chính xác hơn, còn planning của model-based tích lũy sai số do model không hoàn hảo và do tree-pruning. Vì agent chọn theo process đáng tin hơn, hành vi chuyển từ goal-directed sang habitual. A, C, D bịa cơ chế không có trong sách.

</details>

---

**Câu 43.** [Khó] Một agent dùng Q-learning thuần túy (lưu action values, không có environment model) tương ứng với loại hành vi nào trong tâm lý học, và nó sẽ phản ứng thế nào ngay sau khi reward của outcome bị devalue mà agent chưa hành động lại?

- A. Tương ứng goal-directed behavior; nó sẽ lập tức ngừng hành động hướng tới outcome bị devalue nhờ planning lại.
- B. Tương ứng classical conditioning thuần túy; nó hoàn toàn không thể học từ delayed reward.
- C. Tương ứng habitual behavior; nó vẫn tiếp tục chọn action cũ cho đến khi trải nghiệm lại reward mới và cập nhật action values, vì action values cached chưa phản ánh outcome bị devalue.
- D. Tương ứng latent learning; nó sẽ cập nhật cognitive map mà không cần trải nghiệm trực tiếp.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Q-learning lưu cached action values mà không có environment model, nên nó là một thuật toán model-free, tương ứng với habitual control. Khi outcome bị devalue mà agent chưa hành động lại, action values vẫn giữ giá trị cũ; agent tiếp tục chọn action cũ cho tới khi nó thực sự thực hiện lại action đó, trải nghiệm reward mới và cập nhật value qua TD error. Đây chính là tính "không nhạy với devaluation" đặc trưng của habit. A mô tả model-based, B và D ánh xạ sai.

</details>

---

**Câu 44.** [Khó] Cụm "temporal primacy overriding blocking" trong TD model nghĩa là gì, và vì sao trial-level Rescorla–Wagner model không nắm bắt được hiện tượng này?

- A. Một CS xuất hiện muộn hơn luôn lấn át CS xuất hiện sớm hơn; Rescorla–Wagner bỏ qua vì nó không có discounting.
- B. Một CS bắt đầu *sớm hơn* (dự đoán US trước về thời gian) có thể chiếm ưu thế associative strength so với CS bắt đầu muộn hơn, kể cả khi cả hai cùng dự đoán US; Rescorla–Wagner là trial-level nên không phân giải được thời điểm onset của các CS bên trong một trial.
- C. Hiện tượng CS sớm bị extinction nhanh hơn CS muộn; Rescorla–Wagner không có khái niệm extinction.
- D. Việc blocking luôn ưu tiên CS có associative strength lớn hơn bất kể thời điểm; Rescorla–Wagner không tính tổng associative strength.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — TD model, nhờ là real-time model và dựa trên bootstrapping, ưu tiên CS dự đoán sớm hơn về thời gian: một stimulus bắt đầu sớm hơn có thể giành associative strength và "ghi đè" hiệu ứng blocking thông thường. Rescorla–Wagner là trial-level model — một bước t đại diện cho cả trial — nên không biểu diễn được thời điểm onset khác nhau của các CS bên trong trial, do đó không thể nắm bắt temporal primacy. A đảo chiều ưu tiên, C và D sai về cơ chế.

</details>

---

**Câu 45.** [Khó] Ánh xạ giữa thuật ngữ RL và tâm lý học: ghép nào dưới đây là KHÔNG chính xác theo chương 14?

- A. Conditioned/secondary reinforcer ↔ value function (đánh giá gần như tức thời cho delayed reinforcement).
- B. Eligibility trace ↔ stimulus trace (Pavlov, Hull) lan truyền tác dụng của một stimulus qua thời gian.
- C. TD error ↔ thước đo "surprise" / prediction error điều khiển việc học.
- D. Discount factor $\gamma$ ↔ độ mạnh của một habit so với một goal-directed action.

<details>
<summary>Đáp án</summary>

**Đáp án: D** — Đây là ghép KHÔNG chính xác. Chương không ánh xạ discount factor $\gamma$ với "độ mạnh của habit"; mức độ habitual vs goal-directed được giải thích bằng độ tin cậy tương đối của hệ model-free và model-based (Daw et al.), không phải bằng $\gamma$. Các ghép A, B, C đều đúng theo chương: secondary reinforcer ↔ value function, eligibility trace ↔ stimulus trace, và TD error/prediction error ↔ surprise.

</details>

---

## 14.7 Summary

**Câu 46.** Theo phần Summary, đâu KHÔNG phải là một trong các điểm tương ứng chính mà chương này mô tả giữa RL và tâm lý học?

- A. Tương ứng prediction/control ↔ classical/instrumental conditioning.
- B. Tương ứng environment models ↔ cognitive maps.
- C. Tương ứng discount factor $\gamma$ ↔ trí nhớ ngắn hạn (short-term memory) của con người.
- D. Tương ứng model-free/model-based ↔ habitual/goal-directed behavior.

<details>
<summary>Đáp án</summary>

**Đáp án: C** — Các tương ứng chính được tóm tắt là: prediction/control ↔ classical/instrumental conditioning (với TD model là một mô hình của classical conditioning, tổng quát hóa Rescorla–Wagner và giải thích second-order conditioning); eligibility traces ↔ stimulus traces và value functions ↔ secondary reinforcement; environment models ↔ cognitive maps; model-free/model-based ↔ habitual/goal-directed behavior. Không có tương ứng "discount factor ↔ trí nhớ ngắn hạn".

</details>

---

**Câu 47.** Phần Summary nhấn mạnh quan điểm tổng thể nào về quan hệ giữa reinforcement learning và animal learning?

- A. RL được thiết kế chủ yếu nhằm tái tạo và giải thích chi tiết hành vi của động vật trong phòng thí nghiệm.
- B. RL là một khung tính toán trừu tượng hướng tới thiết kế thuật toán học hiệu quả (góc nhìn AI/engineering), không nhằm tái tạo chi tiết hành vi động vật — nhưng nhiều thuật toán lấy cảm hứng từ lý thuyết tâm lý và dòng chảy ý tưởng hai chiều có lợi cho cả hai ngành.
- C. RL hàm ý một quan điểm tabula rasa thuần túy, theo đó mọi thứ đều phải học từ con số 0.
- D. RL bác bỏ hoàn toàn vai trò của các quan điểm tiến hóa trong việc giải thích hành vi học.

<details>
<summary>Đáp án</summary>

**Đáp án: B** — RL là một khung tính toán trừu tượng khám phá các tình huống lý tưởng hóa từ góc nhìn AI và engineering, không nhằm mô hình hóa chi tiết hành vi động vật. Tuy vậy nhiều thuật toán cơ bản được lấy cảm hứng từ lý thuyết tâm lý, và trong vài trường hợp đã đóng góp cho các mô hình học động vật mới. Đặc biệt, RL không hàm ý quan điểm tabula rasa và không bác bỏ quan điểm tiến hóa — kinh nghiệm engineering nhấn mạnh tầm quan trọng của việc xây dựng sẵn kiến thức. A, C, D phản ánh sai quan điểm của tác giả.

</details>
