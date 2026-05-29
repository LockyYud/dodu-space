# Roadmap Blog: LLM From Scratch Và Sự Phát Triển Của Open-Source Models

## Mục Tiêu

- [ ] Xây một series blog giúp học chắc Transformer và LLM bằng cách tự implement.
- [ ] Mỗi bài trả lời một câu hỏi kỹ thuật cụ thể, không chỉ nhắc lại định nghĩa.
- [ ] Mỗi khái niệm quan trọng có ví dụ tensor shape, code tối giản và sanity check.
- [ ] Bài tổng hợp cuối cho thấy LLM hiện đại phát triển từ GPT-2 style Transformer như thế nào.
- [ ] Giữ phong cách "code-diff evolution": bắt đầu từ baseline, sau đó thay từng module để hiểu cải tiến.

## Nguyên Tắc Viết

- [ ] Mỗi bài có một câu hỏi trung tâm.
- [ ] Mở bài bằng vấn đề thực tế hoặc lỗi dễ gặp khi implement.
- [ ] Luôn có ví dụ nhỏ với token hoặc tensor shape cụ thể.
- [ ] Công thức chỉ đưa vừa đủ để phục vụ implementation.
- [ ] Code phải chạy được hoặc đủ gần với code thật trong repo.
- [ ] Có ít nhất một sanity check, unit test nhỏ hoặc experiment quan sát được.
- [ ] Kết bài nêu rõ module này nằm ở đâu trong Transformer/LLM tổng thể.
- [ ] Khi so sánh model, tập trung vào thay đổi kiến trúc, chi phí, lợi ích và trade-off.

## Format Chuẩn Cho Mỗi Bài

- [ ] Câu hỏi trung tâm: bài này giải quyết điều gì?
- [ ] Trực giác: giải thích bằng ví dụ nhỏ trước khi vào công thức.
- [ ] Tensor contract: input/output shape của module.
- [ ] Công thức tối thiểu: chỉ phần cần để code.
- [ ] Implementation: code PyTorch ngắn, rõ ràng.
- [ ] Lỗi dễ gặp: shape, mask, device, dtype, training/inference mismatch.
- [ ] Sanity check: cách biết implementation đúng.
- [ ] Kết nối: module này ảnh hưởng gì tới model lớn hơn.

## Phase 1: Nền Tảng Transformer

### 1. Copy Task Là Gì Và Vì Sao Hữu Ích?

- [ ] Giải thích copy task như một bài kiểm thử hệ thống cho Transformer.
- [ ] Trình bày `src`, `tgt_input`, `tgt_output`.
- [ ] Làm rõ teacher forcing và shift target.
- [ ] Nêu vì sao task đơn giản vẫn bắt được lỗi mask, decoding và loss.
- [ ] Thêm ví dụ batch có padding.
- [ ] Sanity check: in một batch từ collator và xác nhận token dịch đúng một bước.

### 2. Attention Từ Dot Product Tới Scaled Dot-Product

- [ ] Giải thích query, key, value bằng ví dụ truy vấn thông tin.
- [ ] Viết công thức `QK^T / sqrt(d_k)`.
- [ ] Giải thích softmax chuẩn hóa theo chiều key.
- [ ] Làm rõ vì sao cần chia `sqrt(d_k)`.
- [ ] Code attention tối giản không multi-head.
- [ ] Sanity check: attention weights có tổng bằng 1 theo chiều key khi không dropout.
- [ ] Lỗi dễ gặp: softmax nhầm chiều, mask cộng sai kiểu, dùng shape sai cho matmul.

### 3. Multi-Head Attention Và Tensor Shape

- [ ] Bắt đầu từ input `(B, T, D)`.
- [ ] Giải thích ràng buộc `D % H == 0`.
- [ ] Trình bày reshape `(B, T, D) -> (B, H, T, Dh)`.
- [ ] Giải thích concat heads về `(B, T, D)`.
- [ ] Code `split_heads` và `merge_heads`.
- [ ] Sanity check: output shape giữ nguyên `(B, T, D)`.
- [ ] Lỗi dễ gặp: quên `contiguous()`, transpose sai trục, mask không broadcast.

### 4. Mask Trong Transformer

- [ ] Giải thích quy ước `mask=True` nghĩa là vị trí bị cấm attend.
- [ ] Padding mask: shape `(B, 1, 1, T)`.
- [ ] Causal mask: shape broadcast được tới `(B, H, T, T)`.
- [ ] Target mask: causal OR target padding.
- [ ] Cross-attention mask: dùng source padding mask, không dùng causal mask.
- [ ] Vẽ ví dụ mask cho một sample ngắn có padding.
- [ ] Sanity check: vị trí future và pad có probability gần 0 sau softmax.
- [ ] Lỗi dễ gặp: mask query thay vì key, dùng `tgt_mask` cho cross-attention.

### 5. Positional Encoding Và Positional Embedding

- [ ] Giải thích vì sao attention không tự biết thứ tự token.
- [ ] Trình bày sinusoidal positional encoding.
- [ ] So sánh sinusoidal với learned absolute position embedding.
- [ ] Giải thích `max_seq_len` là giới hạn cứng.
- [ ] Code positional encoding tối giản.
- [ ] Sanity check: hai position khác nhau có vector khác nhau.
- [ ] Lỗi dễ gặp: quên cộng position, chuỗi dài hơn `max_seq_len`.

### 6. Feed-Forward Layer Trong Transformer

- [ ] Giải thích FFN xử lý từng position độc lập.
- [ ] Trình bày công thức `Linear(D, Dff) -> activation -> Linear(Dff, D)`.
- [ ] Làm rõ attention trộn thông tin giữa token, FFN tăng năng lực biểu diễn từng token.
- [ ] Code FFN với ReLU hoặc GELU.
- [ ] Sanity check: input/output đều có shape `(B, T, D)`.
- [ ] Lỗi dễ gặp: tưởng FFN trộn token theo chiều thời gian.

### 7. Residual, Dropout Và LayerNorm

- [ ] Giải thích residual connection giúp giữ đường truyền gradient.
- [ ] Giải thích LayerNorm normalize trên chiều `D`, riêng cho từng token.
- [ ] Phân biệt LayerNorm với BatchNorm.
- [ ] Trình bày post-norm trong Transformer gốc.
- [ ] Nhắc nhẹ pre-norm trong các LLM hiện đại.
- [ ] Code một sub-layer: `LayerNorm(x + Dropout(module(x)))`.
- [ ] Sanity check: LayerNorm không đổi shape và không trộn batch/time.
- [ ] Lỗi dễ gặp: normalize nhầm chiều, đặt dropout sau residual sai ý đồ.

### 8. Encoder Layer Và Decoder Layer

- [ ] Lắp encoder layer: self-attention + FFN.
- [ ] Lắp decoder layer: masked self-attention + cross-attention + FFN.
- [ ] Làm rõ decoder có hai nguồn thông tin: target prefix và encoder memory.
- [ ] Trình bày shape của `memory`, `decoder_hidden`, `logits`.
- [ ] Sanity check: encoder/decoder forward chạy với batch có padding.
- [ ] Lỗi dễ gặp: dùng causal mask cho encoder hoặc source trong cross-attention.

### 9. Training Transformer Với Teacher Forcing

- [ ] Giải thích vì sao train có thể chạy song song trên toàn bộ target.
- [ ] Trình bày `tgt_input` và `tgt_output` lệch một bước.
- [ ] Cross entropy flatten `(B, T, V) -> (B*T, V)`.
- [ ] Dùng `ignore_index=pad_id`.
- [ ] Theo dõi token accuracy và sequence accuracy.
- [ ] Sanity check: overfit một dataset rất nhỏ.
- [ ] Lỗi dễ gặp: loss thấp nhưng generation sai vì train/inference mismatch.

### 10. Autoregressive Decoding

- [ ] Giải thích inference không có target prefix thật.
- [ ] Greedy decoding từng bước từ `<s>`.
- [ ] Dừng khi gặp `</s>` hoặc chạm `max_len`.
- [ ] Xử lý batch có sample kết thúc sớm bằng `finished`.
- [ ] Sanity check: generate trên mẫu đã overfit.
- [ ] Lỗi dễ gặp: lấy logits sai position, không `model.eval()`, quên tắt dropout.

## Phase 2: GPT-2 Style Language Model From Scratch

### 11. Từ Encoder-Decoder Sang Decoder-Only Transformer

- [ ] Giải thích GPT-style model bỏ encoder và cross-attention.
- [ ] Input và target là cùng một chuỗi lệch một token.
- [ ] Causal self-attention là cơ chế chính.
- [ ] So sánh seq2seq copy task với next-token prediction.
- [ ] Sanity check: logits tại position `t` dự đoán token `t+1`.

### 12. Tokenization Và BPE

- [ ] Giải thích vì sao không dùng word-level tokenization.
- [ ] Trình bày byte-level BPE ở mức trực giác.
- [ ] So sánh character, word, subword tokenization.
- [ ] Code ví dụ encode/decode với tokenizer có sẵn.
- [ ] Sanity check: encode rồi decode trả lại text ban đầu hoặc gần như ban đầu.
- [ ] Lỗi dễ gặp: nhầm vocab size model với số token trong dataset.

### 13. GPT-2 Block

- [ ] Lắp causal self-attention.
- [ ] Lắp MLP với GELU.
- [ ] Dùng learned positional embedding.
- [ ] Dùng LayerNorm theo phong cách GPT-2.
- [ ] Dùng weight tying giữa token embedding và output projection.
- [ ] Sanity check: forward trả logits `(B, T, V)`.

### 14. Training Tiny GPT

- [ ] Chuẩn bị dataset text nhỏ.
- [ ] Tạo batch block size cố định.
- [ ] Loss next-token prediction.
- [ ] Theo dõi train loss và validation loss.
- [ ] Generate text định kỳ trong quá trình train.
- [ ] Sanity check: model overfit được một đoạn text ngắn.
- [ ] Lỗi dễ gặp: data leakage giữa train/val, block size quá ngắn.

### 15. Sampling: Greedy, Temperature, Top-k, Top-p

- [ ] Giải thích greedy decoding.
- [ ] Giải thích temperature thay đổi độ sắc của phân phối.
- [ ] Top-k sampling.
- [ ] Top-p nucleus sampling.
- [ ] So sánh output của cùng prompt với nhiều chiến lược decoding.
- [ ] Sanity check: temperature thấp lặp hơn, temperature cao đa dạng hơn.
- [ ] Lỗi dễ gặp: apply top-k/top-p sai trước softmax hoặc sau softmax không nhất quán.

### 16. Load Và Đối Chiếu Với GPT-2

- [ ] Đọc config GPT-2.
- [ ] Map tên weight từ checkpoint sang model tự viết.
- [ ] Kiểm tra shape từng parameter.
- [ ] So sánh logits hoặc generate ngắn với model chuẩn.
- [ ] Sanity check: cùng input cho output gần giống khi eval mode.
- [ ] Lỗi dễ gặp: transpose weight Linear/Conv1D, khác tokenizer, khác LayerNorm epsilon.

## Phase 3: Từ GPT-2 Tới LLaMA-Style Models

### 17. Pre-Norm So Với Post-Norm

- [ ] Nhắc lại post-norm trong Transformer gốc.
- [ ] Giải thích pre-norm: normalize trước attention/MLP.
- [ ] Vì sao pre-norm ổn định hơn khi model sâu.
- [ ] Code diff từ post-norm sang pre-norm.
- [ ] Sanity check: output shape không đổi, training tiny model vẫn chạy.

### 18. RMSNorm Thay LayerNorm

- [ ] Viết công thức LayerNorm.
- [ ] Viết công thức RMSNorm.
- [ ] Giải thích RMSNorm không trừ mean.
- [ ] Code RMSNorm tối giản.
- [ ] Thay LayerNorm trong tiny GPT.
- [ ] Sanity check: RMSNorm normalize theo chiều `D`.
- [ ] Lỗi dễ gặp: sai epsilon, sai dtype khi mixed precision.

### 19. RoPE Thay Learned Positional Embedding

- [ ] Giải thích giới hạn của learned absolute position embedding.
- [ ] Trình bày trực giác rotary position embedding.
- [ ] RoPE tác động lên Q/K, không cộng vào token embedding như absolute position.
- [ ] Code apply RoPE cho tensor `(B, H, T, Dh)`.
- [ ] Sanity check: shape giữ nguyên, attention score thay đổi theo position.
- [ ] Lỗi dễ gặp: rotate sai chiều, không xử lý offset khi dùng KV cache.

### 20. SwiGLU Thay GELU MLP

- [ ] Nhắc lại GPT-2 MLP dùng GELU.
- [ ] Giải thích gated MLP.
- [ ] Viết công thức SwiGLU.
- [ ] Code `gate_proj`, `up_proj`, `down_proj`.
- [ ] So sánh parameter count với MLP thường.
- [ ] Sanity check: output shape `(B, T, D)`.
- [ ] Lỗi dễ gặp: chọn hidden dimension không đúng convention.

### 21. KV Cache Cho Inference

- [ ] Giải thích vì sao decoding từng token bị chậm nếu tính lại toàn bộ prefix.
- [ ] Cache key/value theo từng layer.
- [ ] Shape cache: `(B, H, T_cached, Dh)`.
- [ ] Cập nhật cache mỗi bước decode.
- [ ] Xử lý RoPE position offset khi cache.
- [ ] Sanity check: output khi có cache gần giống output không cache.
- [ ] Lỗi dễ gặp: concat sai chiều thời gian, mask sai khi `Tq=1`.

### 22. Multi-Query Và Grouped-Query Attention

- [ ] Nhắc lại MHA: mỗi head có Q/K/V riêng.
- [ ] Giải thích MQA: nhiều query head dùng chung K/V.
- [ ] Giải thích GQA: nhóm query head dùng chung K/V.
- [ ] Vì sao MQA/GQA giảm chi phí KV cache.
- [ ] Code shape mapping giữa query heads và kv heads.
- [ ] Sanity check: output shape vẫn `(B, T, D)`.
- [ ] Lỗi dễ gặp: repeat K/V sai số lần, nhầm `num_heads` và `num_kv_heads`.

### 23. Sliding Window Attention

- [ ] Giải thích full causal attention có chi phí tăng theo context length.
- [ ] Sliding window chỉ attend một cửa sổ token gần nhất.
- [ ] So sánh với global attention.
- [ ] Code mask sliding window tối giản.
- [ ] Sanity check: token chỉ nhìn được các vị trí trong cửa sổ.
- [ ] Lỗi dễ gặp: off-by-one trong mask causal + window.

### 24. FlashAttention Ở Mức Ý Tưởng

- [ ] Giải thích bottleneck memory của attention thường.
- [ ] Trình bày ý tưởng tính attention theo block để giảm memory IO.
- [ ] Phân biệt FlashAttention là kernel optimization, không đổi toán học attention.
- [ ] Dùng API PyTorch hoặc thư viện nếu có, không cần tự viết kernel.
- [ ] Sanity check: output gần tương đương attention thường trong tolerance.
- [ ] Lỗi dễ gặp: dtype/device không hỗ trợ kernel tối ưu.

## Phase 4: Open-Source Model Evolution

### 25. GPT-2: Decoder-Only Baseline

- [ ] Tóm tắt kiến trúc GPT-2.
- [ ] Learned position embedding.
- [ ] Causal MHA.
- [ ] GELU MLP.
- [ ] LayerNorm và residual.
- [ ] Đặt GPT-2 làm baseline để so sánh các model sau.

### 26. GPT-Neo Và GPT-J: Mở Rộng Open Weights

- [ ] So sánh mục tiêu open-source/open-weights với GPT-2.
- [ ] Nhìn vào thay đổi kiến trúc chính.
- [ ] Nhìn vào scale: parameter count, dataset, context length.
- [ ] Rút ra bài học: không chỉ kiến trúc, data và compute cũng quan trọng.

### 27. LLaMA-Style Block

- [ ] So sánh GPT-2 block với LLaMA block.
- [ ] Pre-norm.
- [ ] RMSNorm.
- [ ] RoPE.
- [ ] SwiGLU.
- [ ] Không bias ở nhiều Linear layer nếu theo recipe cụ thể.
- [ ] Code một tiny LLaMA block.
- [ ] Sanity check: thay block trong tiny GPT và train được.

### 28. Mistral-Style Improvements

- [ ] Grouped-query attention.
- [ ] Sliding window attention.
- [ ] Rolling buffer KV cache ở mức ý tưởng.
- [ ] So sánh lợi ích cho inference và context dài.
- [ ] Code thử GQA hoặc sliding window trên tiny model.

### 29. Mixtral Và Mixture-of-Experts

- [ ] Giải thích dense MLP so với MoE MLP.
- [ ] Router chọn expert.
- [ ] Top-k experts.
- [ ] Auxiliary/load-balancing loss ở mức khái niệm.
- [ ] Trade-off: nhiều parameter hơn nhưng active parameter ít hơn mỗi token.
- [ ] Code toy MoE FFN.
- [ ] Sanity check: token route tới expert khác nhau.

### 30. Qwen, DeepSeek, Llama Mới: Nhìn Cải Tiến Theo Trục Nào?

- [ ] Context length.
- [ ] Data quality và multilingual/code data.
- [ ] GQA/MQA và inference efficiency.
- [ ] MoE.
- [ ] Post-training và reasoning.
- [ ] Tool use và instruction following.
- [ ] Viết bảng so sánh thay đổi theo từng model family.

## Phase 5: Training, Post-Training Và Evaluation

### 31. Pretraining Objective

- [ ] Next-token prediction.
- [ ] Perplexity.
- [ ] Scaling data/model/compute.
- [ ] Vì sao loss giảm không luôn đồng nghĩa model hữu ích hơn trong downstream task.
- [ ] Sanity check: tính perplexity từ cross entropy.

### 32. Instruction Tuning Và SFT

- [ ] So sánh pretraining text thường với instruction data.
- [ ] Format prompt/response.
- [ ] Loss chỉ tính trên response hoặc tính toàn chuỗi tùy setup.
- [ ] Code collator cho instruction tuning toy dataset.
- [ ] Sanity check: prompt không bị tính loss nếu dùng response-only loss.

### 33. Preference Optimization: RLHF Và DPO

- [ ] Giải thích preference data: chosen vs rejected.
- [ ] RLHF ở mức pipeline: reward model + policy optimization.
- [ ] DPO ở mức trực giác và công thức tối thiểu.
- [ ] Khi nào cần preference optimization sau SFT.
- [ ] Sanity check: toy preference pair làm loss giảm đúng hướng.

### 34. Evaluation Cho LLM

- [ ] Perplexity.
- [ ] Exact match cho task đơn giản.
- [ ] Multiple-choice benchmark.
- [ ] Coding benchmark ở mức ý tưởng.
- [ ] Human eval và preference eval.
- [ ] Lỗi dễ gặp: benchmark leakage, prompt format không công bằng.

### 35. Inference Serving

- [ ] Batching.
- [ ] KV cache.
- [ ] Continuous batching ở mức ý tưởng.
- [ ] Quantization.
- [ ] Throughput vs latency.
- [ ] Trade-off giữa model size, context length và memory.

## Phase 6: Bài Tổng Hợp Và Dự Án Cuối

### 36. Từ Transformer Gốc Tới GPT-2

- [ ] Encoder-decoder Transformer dùng cho seq2seq.
- [ ] GPT-2 giữ decoder-only causal LM.
- [ ] Bỏ cross-attention.
- [ ] Chuyển objective sang next-token prediction.
- [ ] Tổng kết bằng bảng module nào giữ, module nào bỏ, module nào đổi.

### 37. Từ GPT-2 Tới LLaMA

- [ ] GPT-2: learned position, LayerNorm, GELU MLP.
- [ ] LLaMA-style: RoPE, RMSNorm, SwiGLU, pre-norm.
- [ ] Giải thích từng thay đổi giải quyết vấn đề gì.
- [ ] Code diff từng module.
- [ ] Tổng kết trade-off.

### 38. Tiny LLM Lab

- [ ] Xây một repo hoặc thư mục lab thống nhất.
- [ ] Có config cho GPT-2 style và LLaMA style.
- [ ] Có train script.
- [ ] Có generate script.
- [ ] Có test cho attention, mask, RoPE, KV cache.
- [ ] Có notebook hoặc blog demo so sánh output.

### 39. Bảng Timeline Open-Source LLM

- [ ] GPT-2.
- [ ] GPT-Neo/GPT-J.
- [ ] LLaMA.
- [ ] Mistral.
- [ ] Mixtral.
- [ ] Qwen.
- [ ] DeepSeek.
- [ ] Llama các thế hệ mới.
- [ ] Với mỗi model family: ghi kiến trúc, tokenizer, context, attention variant, FFN variant, training/post-training điểm nổi bật.

### 40. Tổng Kết Series

- [ ] Những gì không đổi: next-token prediction, Transformer block, attention + MLP.
- [ ] Những gì thay đổi mạnh: normalization, position encoding, attention efficiency, FFN, data, post-training.
- [ ] Những câu hỏi còn mở: reasoning, long context, efficient inference, data quality, evaluation.
- [ ] Đề xuất hướng học tiếp: distributed training, inference engine, quantization, alignment.

## Backlog Experiment

- [ ] Bỏ positional encoding trong copy task và quan sát sequence accuracy.
- [ ] Cố tình sai causal mask và xem train loss/generation khác nhau thế nào.
- [ ] So sánh token accuracy và sequence accuracy theo sequence length.
- [ ] Overfit tiny GPT trên một paragraph cố định.
- [ ] So sánh learned position với RoPE trên context dài hơn train length.
- [ ] So sánh LayerNorm và RMSNorm trong cùng tiny model.
- [ ] So sánh MHA và GQA về KV cache memory.
- [ ] Thử top-k/top-p/temperature trên cùng checkpoint.
- [ ] Viết unit test cho KV cache: cached decoding vs full-prefix decoding.
- [ ] Viết bảng parameter count cho MLP thường, SwiGLU và MoE toy model.

## Tiêu Chí Hoàn Thành Mỗi Phase

- [ ] Phase 1 hoàn thành khi có thể implement Transformer encoder-decoder và debug copy task.
- [ ] Phase 2 hoàn thành khi có thể train và generate bằng tiny GPT.
- [ ] Phase 3 hoàn thành khi có thể biến GPT-2 block thành LLaMA-style block bằng các code diff nhỏ.
- [ ] Phase 4 hoàn thành khi có thể đọc model card/paper/config của một open-source LLM và chỉ ra cải tiến chính.
- [ ] Phase 5 hoàn thành khi hiểu được khác biệt giữa pretraining, SFT, preference optimization và evaluation.
- [ ] Phase 6 hoàn thành khi có một bài tổng hợp rõ ràng về sự tiến hóa từ Transformer tới LLM hiện đại.

## Thứ Tự Ưu Tiên Gần Nhất

- [ ] Viết lại bài Transformer copy task thành bài tổng hợp rõ hơn.
- [ ] Tách bài attention riêng.
- [ ] Tách bài mask riêng.
- [ ] Tách bài teacher forcing và decoding riêng.
- [ ] Implement tiny GPT-2.
- [ ] Viết bài so sánh encoder-decoder Transformer với decoder-only GPT.
- [ ] Sau đó mới chuyển sang RoPE, RMSNorm, SwiGLU và KV cache.
