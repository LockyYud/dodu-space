# Chương 15: Neuroscience — Câu hỏi trả lời ngắn

> Bộ câu hỏi trả lời ngắn (short-answer) ôn tập Chương 15, sách *Reinforcement Learning: An Introduction* (Sutton & Barto, 2nd ed.). Đáp án tham khảo dùng cho việc LLM chấm điểm.

## 15.1 Neuroscience Basics

**Câu 1.** Giải thích các khái niệm neuromodulator, synaptic efficacy và synaptic plasticity, và vì sao dopamine (một neuromodulator) là cơ chế hợp lý để não thực thi các thuật toán học kiểu reinforcement learning.

<details>
<summary>Đáp án tham khảo</summary>

Một neuromodulator là neurotransmitter có tác dụng ngoài (hoặc bổ sung cho) việc kích thích/ức chế nhanh trực tiếp; nó có thể phân phối một tín hiệu vô hướng (scalar) như reinforcement signal tới các synapse phân bố rộng. Synaptic efficacy là độ mạnh/hiệu lực mà neurotransmitter tại một synapse ảnh hưởng đến neuron postsynaptic, và synaptic plasticity là khả năng thay đổi efficacy đó — cơ chế chính của học tập, tương ứng với các weights mà thuật toán học điều chỉnh. Vì dopamine có thể điều biến (modulate) synaptic plasticity ở các vị trí phân bố rộng, nó là cơ chế hợp lý để não thực hiện những thuật toán học như trong sách.

</details>

## 15.2 Reward Signals, Reinforcement Signals, Values, and Prediction Errors

**Câu 2.** Phân biệt reward signal và reinforcement signal trong reinforcement learning, và cho biết đối với phương pháp TD thì reinforcement signal là gì.

<details>
<summary>Đáp án tham khảo</summary>

Reward signal (Rt) cùng với môi trường định nghĩa bài toán mà agent phải giải; nó giống tín hiệu trong não phân phối primary reward. Reinforcement signal khác ở chỗ chức năng của nó là điều khiển các thay đổi mà thuật toán thực hiện trên policy, value estimates hoặc model. Với phương pháp TD, reinforcement signal chính là TD error (δ ≈ Rt + V(St) − V(St−1)), tức reward signal đã được điều chỉnh thêm bằng các value estimate. Nói chung reinforcement signal ≠ reward signal, trừ một số thuật toán đặc biệt.

</details>

**Câu 3.** Reward prediction error (RPE) là gì, và quan hệ giữa RPE với TD error như sách trình bày?

<details>
<summary>Đáp án tham khảo</summary>

RPE đo độ chênh lệch giữa reward signal kỳ vọng và reward signal thực nhận: dương khi reward lớn hơn kỳ vọng, âm khi nhỏ hơn. TD error là một loại RPE đặc biệt báo hiệu chênh lệch giữa kỳ vọng hiện tại và kỳ vọng trước đó về reward dài hạn. Khi các nhà neuroscience nói "RPE" họ thường (dù không luôn) muốn nói TD RPE, mà trong chương này gọi tắt là TD error; ở đây TD error thường là loại không phụ thuộc action.

</details>

## 15.3 The Reward Prediction Error Hypothesis

**Câu 4.** Phát biểu reward prediction error hypothesis của hoạt động dopamine neuron, và nêu hai giả định mà Montague, Dayan & Sejnowski (1996) dùng để so sánh TD error với hoạt động dopamine.

<details>
<summary>Đáp án tham khảo</summary>

Reward prediction error hypothesis đề xuất rằng một trong các chức năng của phasic activity của dopamine neuron ở động vật có vú là truyền sai số giữa ước lượng cũ và mới về reward tương lai tới các vùng đích khắp não. Hai giả định chính: (1) vì TD error có thể âm nhưng firing rate không thể âm, đại lượng tương ứng với hoạt động dopamine là δ + b (b là background firing rate), nên TD error âm ứng với việc firing rate tụt xuống dưới mức nền; (2) dùng biểu diễn complete serial compound (CSC) để có một state riêng cho mỗi time step, cho phép TD error nhạy với thời điểm xuất hiện sự kiện (timing) trong một trial.

</details>

## 15.4 Dopamine

**Câu 5.** Theo reward prediction error hypothesis, vì sao quan điểm truyền thống "dopamine neuron phát đi tín hiệu reward" là không hoàn toàn đúng, và phasic response của dopamine neuron tại thời điểm t thực sự tương ứng với đại lượng nào?

<details>
<summary>Đáp án tham khảo</summary>

Theo hypothesis, phasic response của dopamine neuron báo hiệu reward prediction error chứ không phải reward bản thân. Phasic response tại thời điểm t tương ứng với δ(t−1) = Rt + V(St) − V(St−1), không phải Rt. Rt là một thành phần quan trọng của δ nhưng không phải toàn bộ; phần V(St) − V(St−1) là phần higher-order reinforcement, nên ngay cả khi có reward, TD error có thể "im lặng" (bằng 0) nếu reward đã được dự đoán đầy đủ. Reinforcement learning hòa giải quan điểm này với quan niệm cũ vì δ chính là reinforcement signal — động lực chính của học tập.

</details>

**Câu 6.** Mô tả các bằng chứng optogenetic ủng hộ vai trò reinforcement signal của phasic dopamine, và cấu trúc giải phẫu nào (striatum và các phân vùng) là trọng tâm cho liên hệ với reinforcement learning.

<details>
<summary>Đáp án tham khảo</summary>

Optogenetic dùng protein nhạy sáng để kích hoạt/ức chế dopamine neuron bằng laser ở thang mili-giây. Tsai et al. (2009) cho thấy kích hoạt phasic dopamine đủ để điều kiện hóa chuột thích phía buồng được kích thích; Steinberg et al. (2013) tạo burst dopamine nhân tạo vào lúc reward bị bỏ (extinction) khiến hành vi được duy trì, và cho phép học trong blocking paradigm. Ở ruồi giấm, burst dopamine lại đóng vai trò như −δ (giống điện giật). Cấu trúc trọng tâm là basal ganglia, với input structure là striatum, gồm dorsal striatum (ảnh hưởng action selection) và ventral striatum (xử lý reward, gán affective value); dopamine từ SNpc/VTA tiếp xúc với medium spiny neuron qua corticostriatal synapse.

</details>

## 15.5 Experimental Support for the Reward Prediction Error Hypothesis

**Câu 7.** Trong các thí nghiệm của nhóm Schultz (Ljungberg/Apicella/Schultz 1992; Schultz et al. 1993), hoạt động dopamine neuron biến đổi thế nào trong quá trình học, và hai hiện tượng quan sát được nào là dấu hiệu đặc trưng (hallmark) của TD learning?

<details>
<summary>Đáp án tham khảo</summary>

Ban đầu dopamine neuron phản ứng với reward (giọt nước táo) bất ngờ; khi học, phản ứng chuyển dịch sang trigger cue dự báo reward và mất dần phản ứng với reward; khi thêm instruction cue sớm hơn 1 giây, phản ứng tiếp tục dịch về instruction cue sớm hơn nữa. (1) Sự dịch chuyển phản ứng về các predictor sớm hơn trong khi mất phản ứng với predictor muộn hơn là hallmark của TD learning. (2) Khi reward kỳ vọng bị bỏ (ấn sai phím), firing rate tụt xuống dưới baseline ngay sau thời điểm reward thường đến — dù không có cue ngoài nào đánh dấu — cho thấy não tự theo dõi timing của reward, cũng phù hợp với TD.

</details>

## 15.6 TD Error/Dopamine Correspondence

**Câu 8.** Trong ví dụ policy-evaluation lý tưởng hóa (CSC, TD(0), γ≈1), hãy giải thích bằng công thức TD error vì sao: (a) sau khi học xong, reward được dự đoán đầy đủ cho δ = 0; và (b) khi reward bị bỏ thì δ trở nên âm. Nêu một discrepancy đã biết giữa TD error và dopamine.

<details>
<summary>Đáp án tham khảo</summary>

(a) Sau khi học, mọi reward-predicting state có V = R*. Với chuyển tiếp từ latest reward-predicting state tới rewarding state: δ = Rt + V(St) − V(St−1) = R* + 0 − R* = 0, nên reward được dự đoán đầy đủ không tạo phản ứng — giống dopamine ít phản ứng với reward đã dự đoán. (b) Khi reward bị bỏ: δ = 0 + 0 − R* = −R*, tức δ âm tại thời điểm reward thường đến, giống dopamine tụt dưới baseline. Discrepancy nổi bật: khi reward đến SỚM hơn kỳ vọng, với CSC, TD error dự đoán δ âm ở thời điểm reward kỳ vọng (bị bỏ), nhưng dopamine neuron không tụt xuống dưới baseline (Hollerman & Schultz 1998). Một số mismatch được khắc phục bằng microstimulus (MS) representation, prolonged eligibility traces, v.v., nhưng không bác bỏ cốt lõi hypothesis.

</details>

## 15.7 Neural Actor–Critic

**Câu 9.** Vì sao kiến trúc actor–critic phù hợp với giải phẫu và sinh lý của não? Nêu ánh xạ giả thuyết (Takahashi et al. 2008) giữa actor/critic và các cấu trúc não, và vai trò của TD error δ trong đó.

<details>
<summary>Đáp án tham khảo</summary>

Hai đặc điểm khiến actor–critic phù hợp: (1) hai thành phần actor và critic gợi ý hai phân vùng striatum — dorsal striatum đóng vai actor (học policy / action selection), ventral striatum đóng vai critic (học value function, xử lý reward); (2) TD error δ có vai trò kép vừa là reinforcement signal cho cả actor lẫn critic, phù hợp với việc axon dopamine từ VTA/SNpc nhắm tới cả hai phân vùng và điều biến plasticity ở cả hai, với tác dụng phụ thuộc vào cấu trúc đích. Trong ánh xạ Takahashi et al., ventral striatum gửi thông tin value tới VTA/SNpc, nơi dopamine neuron kết hợp với reward để tạo δ; δ được phát qua axon dopamine để điều biến efficacy của corticostriatal synapse ở cả dorsal và ventral striatum. Hệ quả: dopamine signal KHÔNG phải "master reward signal" Rt; Rt chỉ là đóng góp tổng hợp của nhiều vùng.

</details>

## 15.8 Actor and Critic Learning Rules

**Câu 10.** Sự khác biệt duy nhất giữa learning rule của actor và của critic là gì? Giải thích contingent vs non-contingent eligibility trace, và khái niệm two-factor vs three-factor learning rule.

<details>
<summary>Đáp án tham khảo</summary>

Khác biệt duy nhất nằm ở loại eligibility trace. Critic dùng non-contingent eligibility trace: chỉ phụ thuộc presynaptic activity (∝ x(St)), không phụ thuộc output của critic — đây là two-factor rule (tương tác giữa δ và trace chỉ-presynaptic), giống TD model của classical conditioning, làm việc để giảm |δ| về 0. Actor dùng contingent eligibility trace: ngoài presynaptic còn phụ thuộc postsynaptic activity (∝ (At − π(1|St,θ)) x(St)) — đây là three-factor rule, giống học instrumental kiểu Law-of-Effect, làm việc để giữ δ dương lớn nhất có thể. Contingent trace giữ thông tin "action nào trong state nào" nên cho phép phân bổ credit/blame cho các policy parameter; non-contingent chỉ đủ để học dự đoán (control thì cần contingent).

</details>

**Câu 11.** Reward-modulated STDP là gì, và vì sao nó làm tăng tính hợp lý sinh học cho actor learning rule? Nêu bằng chứng thực nghiệm liên quan.

<details>
<summary>Đáp án tham khảo</summary>

STDP (spike-timing-dependent plasticity) là dạng plasticity kiểu Hebbian trong đó chiều thay đổi efficacy phụ thuộc thời điểm tương đối của spike pre- và postsynaptic (pre trước post → tăng; ngược lại → giảm). Reward-modulated STDP là dạng three-factor: thay đổi STDP chỉ xảy ra nếu có neuromodulatory input (dopamine) đến trong cửa sổ thời gian sau khi presynaptic spike được nối tiếp sát bởi postsynaptic spike. Nó "giống" actor learning rule (cũng three-factor, có postsynaptic contingency), nên làm tăng tính hợp lý của implementation actor–critic. Bằng chứng: Yagishita et al. (2014) cho thấy thay đổi bền vững của corticostriatal synapse (ở medium spiny neuron của dorsal striatum) chỉ xảy ra nếu xung neuromodulatory đến trong cửa sổ kéo dài tới ~10 giây — gợi ý tồn tại contingent eligibility trace có thời gian dài.

</details>

## 15.9 Hedonistic Neurons

**Câu 12.** Hedonistic neuron hypothesis của Klopf đề xuất điều gì, và nó liên hệ thế nào với khái niệm eligibility và actor learning rule?

<details>
<summary>Đáp án tham khảo</summary>

Klopf (1972, 1982) giả thuyết rằng từng neuron riêng lẻ tìm cách tối đa hóa hiệu số giữa input được coi là rewarding và input punishing, bằng cách điều chỉnh efficacy synapse dựa trên hệ quả thưởng/phạt của chính action potential của nó — tức neuron có thể được "huấn luyện" như trong instrumental conditioning. Khi một neuron bắn, các synapse vừa góp phần tạo ra spike đó trở nên eligible (Klopf là người đưa ra thuật ngữ eligibility) cho thay đổi efficacy; nếu reward đến trong khoảng thời gian thích hợp thì efficacy tăng, nếu punishment thì giảm. Đây chính là contingent eligibility trace dựa trên trùng hợp pre-/postsynaptic, tức về cơ bản là three-factor actor learning rule. Eligibility trace trong sách (suy giảm hàm mũ theo λ, γ) là phiên bản đơn giản hóa của ý tưởng gốc của Klopf (vốn hình dung trace như histogram độ dài các feedback loop).

</details>

## 15.10 Collective Reinforcement Learning

**Câu 13.** Khi nhiều agent (ví dụ các actor unit / hedonistic neuron) cùng nhận một reward signal chung phụ thuộc hành động tập thể, đó là loại bài toán gì? Nêu structural credit assignment problem và hai yêu cầu để học tập thể thành công.

<details>
<summary>Đáp án tham khảo</summary>

Đây là cooperative game / team problem: tất cả agent cùng tối đa hóa một reward signal chung đánh giá hành động tập thể (collective action). Thách thức là structural credit assignment problem: thành viên nào (hoặc nhóm nào) xứng đáng được credit/blame cho reward, khi mỗi agent chỉ góp một thành phần và ảnh hưởng của nó bị chôn trong nhiễu do các agent khác tạo ra. Hai yêu cầu để học thành công: (1) dùng contingent eligibility trace để ghi nhớ action gần đây, cho phép tương quan action với thay đổi reward (non-contingent chỉ đủ để dự đoán, không học control); (2) phải có variability/exploration trong action của các thành viên (ví dụ Bernoulli-logistic REINFORCE unit). Williams (1992) chứng minh một team các unit như vậy thực hiện policy gradient trên average reward chung — một cơ chế thần kinh hợp lý thay cho error backpropagation.

</details>

## 15.11 Model-based Methods in the Brain

**Câu 14.** Phân biệt model-free và model-based liên hệ với habitual vs goal-directed behavior, và nêu các cấu trúc não được cho là liên quan (DLS, DMS, OFC, hippocampus).

<details>
<summary>Đáp án tham khảo</summary>

Model-free ~ habitual behavior; model-based ~ goal-directed behavior. Giả thuyết actor–critic đặt actor ở dorsal striatum là quá đơn giản: thí nghiệm inactivation và outcome-devaluation cho thấy dorsolateral striatum (DLS) thiên về xử lý model-free (habit), còn dorsomedial striatum (DMS) thiên về model-based (goal-directed). Orbitofrontal cortex (OFC) trong prefrontal cortex liên quan tới subjective reward value và reward kỳ vọng — có thể quan trọng cho phần reward của environment model. Hippocampus quan trọng cho memory/spatial navigation và planning: khi chuột dừng ở điểm rẽ, biểu diễn không gian trong hippocampus "quét tới trước" theo các đường đi khả dĩ (Johnson & Redish 2007), gợi ý vai trò trong phần state-transition của model và mô phỏng tương lai (một dạng planning). Tuy nhiên model-free và model-based không tách bạch rõ ràng — model-based influence xuất hiện gần như khắp nơi não xử lý reward, kể cả trong tín hiệu dopamine.

</details>

## 15.12 Addiction

**Câu 15.** Tóm tắt model của Redish (2004) về addiction dựa trên reward prediction error hypothesis: cơ chế cốt lõi, hệ quả, và những hạn chế.

<details>
<summary>Đáp án tham khảo</summary>

Model dựa trên quan sát rằng cocaine và một số drug khác tạo ra tăng dopamine tạm thời. Cơ chế cốt lõi: dopamine surge này làm tăng TD error δ theo cách KHÔNG thể bị triệt tiêu bởi thay đổi value function — tức drug reward "không thể bị dự đoán đi". Cụ thể, model ngăn δ trở nên âm khi reward do drug gây ra, loại bỏ tính chất sửa-sai (error-correcting) của TD learning cho các state liên quan đến drug. Hệ quả: value của các state này tăng vô giới hạn (unbounded), khiến những action dẫn tới chúng được ưa thích hơn mọi action khác. Hạn chế: addiction phức tạp hơn nhiều; dopamine không đóng vai trò then chốt trong mọi dạng addiction, không phải ai cũng dễ nghiện như nhau, model không bao gồm các thay đổi mạch/vùng não khi dùng drug mãn tính (như giảm tác dụng), và addiction có thể còn liên quan tới model-based processes. Dù vậy model minh họa cách RL theory đóng góp cho computational psychiatry.

</details>

## 15.13 Summary

**Câu 16.** Tổng hợp: nêu ngắn gọn ba điểm tương ứng chính giữa reinforcement learning và neuroscience được nhấn mạnh trong chương này.

<details>
<summary>Đáp án tham khảo</summary>

(1) Reward prediction error hypothesis: phasic activity của dopamine neuron báo hiệu TD error (RPE) chứ không phải reward — phù hợp với phân biệt reward signal Rt và reinforcement signal δ, và với hiện tượng phản ứng dịch về predictor sớm hơn (backing-up của TD). (2) Neural actor–critic: não có thể thực thi kiểu actor–critic với dorsal striatum (actor) và ventral striatum (critic), TD error δ do dopamine truyền là reinforcement signal kép; actor learning rule tương ứng reward-modulated STDP ở corticostriatal synapse, với ý tưởng eligibility (contingent) bắt nguồn từ hedonistic neuron của Klopf. (3) Các liên hệ mở rộng: collective/team RL (dopamine phát rộng như reward chung cho nhiều agent, thay cho backpropagation), phân biệt model-free/model-based ánh xạ habitual/goal-directed (DLS/DMS, OFC, hippocampus), và ứng dụng vào addiction (model Redish) và computational psychiatry.

</details>
