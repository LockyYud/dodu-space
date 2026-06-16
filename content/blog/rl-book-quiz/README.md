# Bộ câu hỏi ôn tập — *Reinforcement Learning: An Introduction*

Bộ câu hỏi ôn tập đầy đủ bám sát từng chương của sách **Reinforcement Learning: An Introduction** (Sutton & Barto, 2nd edition, 2020), gồm hai dạng:

| Dạng | Mô tả | Số câu | Thư mục |
|---|---|---|---|
| **Trắc nghiệm** | 4 lựa chọn A/B/C/D, một đáp án đúng + giải thích | 597 | `./` (thư mục này) |
| **Trả lời ngắn** | Câu hỏi mở, đáp án tham khảo để LLM chấm điểm | ~243 | `./short-answer/` |

- Đáp án / đáp án tham khảo nằm trong khối `<details>` — tự kiểm tra trước khi mở.
- Thuật ngữ kỹ thuật giữ nguyên tiếng Anh; nội dung bám sát văn bản gốc.

## Phần I — Tabular Solution Methods

| Ch | Chủ đề | Trắc nghiệm | Trả lời ngắn |
|---|---|---|---|
| 1 | [Introduction](ch01-introduction.md) | 20 | [14](short-answer/ch01-introduction.md) |
| 2 | [Multi-armed Bandits](ch02-multi-armed-bandits.md) | 34 | [16](short-answer/ch02-multi-armed-bandits.md) |
| 3 | [Finite Markov Decision Processes](ch03-finite-mdps.md) | 43 | [18](short-answer/ch03-finite-mdps.md) |
| 4 | [Dynamic Programming](ch04-dynamic-programming.md) | 32 | [12](short-answer/ch04-dynamic-programming.md) |
| 5 | [Monte Carlo Methods](ch05-monte-carlo.md) | 42 | [17](short-answer/ch05-monte-carlo.md) |
| 6 | [Temporal-Difference Learning](ch06-temporal-difference.md) | 36 | [15](short-answer/ch06-temporal-difference.md) |
| 7 | [n-step Bootstrapping](ch07-n-step-bootstrapping.md) | 22 | [11](short-answer/ch07-n-step-bootstrapping.md) |
| 8 | [Planning and Learning with Tabular Methods](ch08-planning-learning.md) | 53 | [20](short-answer/ch08-planning-learning.md) |

## Phần II — Approximate Solution Methods

| Ch | Chủ đề | Trắc nghiệm | Trả lời ngắn |
|---|---|---|---|
| 9 | [On-policy Prediction with Approximation](ch09-on-policy-prediction-approx.md) | 50 | [24](short-answer/ch09-on-policy-prediction-approx.md) |
| 10 | [On-policy Control with Approximation](ch10-on-policy-control-approx.md) | 20 | [9](short-answer/ch10-on-policy-control-approx.md) |
| 11 | [Off-policy Methods with Approximation](ch11-off-policy-approx.md) | 38 | [15](short-answer/ch11-off-policy-approx.md) |
| 12 | [Eligibility Traces](ch12-eligibility-traces.md) | 41 | [15](short-answer/ch12-eligibility-traces.md) |
| 13 | [Policy Gradient Methods](ch13-policy-gradient.md) | 24 | [12](short-answer/ch13-policy-gradient.md) |

## Phần III — Looking Deeper

| Ch | Chủ đề | Trắc nghiệm | Trả lời ngắn |
|---|---|---|---|
| 14 | [Psychology](ch14-psychology.md) | 42 | [14](short-answer/ch14-psychology.md) |
| 15 | [Neuroscience](ch15-neuroscience.md) | 31 | [16](short-answer/ch15-neuroscience.md) |
| 16 | [Applications and Case Studies](ch16-applications.md) | 41 | [13](short-answer/ch16-applications.md) |
| 17 | [Frontiers](ch17-frontiers.md) | 28 | [13](short-answer/ch17-frontiers.md) |

## Gợi ý cách ôn

**Trắc nghiệm:** Đọc câu, chọn đáp án trong đầu rồi mới mở `<details>` kiểm tra. Câu sai → tra lại mục tương ứng (heading `##` ghi rõ số mục).

**Trả lời ngắn:** Viết ra câu trả lời của bạn (2-5 câu), sau đó đối chiếu với đáp án tham khảo. Sau này sẽ có LLM chấm điểm tự động.

**Ưu tiên các chương lõi:** 3 (MDP) → 4 (DP) → 5 (MC) → 6 (TD) → 9 (Function Approximation) → 13 (Policy Gradient).
