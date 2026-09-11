/**
 * Bank câu hỏi cho "Viết mỗi ngày" (`/ielts/daily`).
 * Xem docs/ielts/DAILY-WRITING.md §2 và DAILY-WRITING-PROMPTS.md.
 *
 * Khác `prompts.ts` ở chỗ: đây không phải đề thi. Mỗi câu phải trả lời được
 * bằng chuyện hôm qua hoặc hôm nay, không cần kiến thức xã hội. "Family" thì bí
 * không biết viết gì; "ai trong nhà bạn dậy sớm nhất" thì viết được ngay — và
 * viết được ngay mới là thứ giữ được chuỗi ngày.
 */

export type ClusterId =
  | "morning"
  | "food"
  | "commute"
  | "work"
  | "home"
  | "shopping"
  | "health"
  | "people"
  | "weekend"
  | "weather"
  | "tech"
  | "evening";

export interface Cluster {
  id: ClusterId;
  label: string;
  emoji: string;
}

export const CLUSTERS: Cluster[] = [
  { id: "morning", label: "Buổi sáng", emoji: "🌅" },
  { id: "food", label: "Ăn uống", emoji: "🍜" },
  { id: "commute", label: "Đi lại", emoji: "🛵" },
  { id: "work", label: "Công việc", emoji: "💻" },
  { id: "home", label: "Nhà cửa", emoji: "🏠" },
  { id: "shopping", label: "Mua sắm", emoji: "🛒" },
  { id: "health", label: "Sức khoẻ", emoji: "🏃" },
  { id: "people", label: "Gia đình & bạn", emoji: "👥" },
  { id: "weekend", label: "Cuối tuần", emoji: "🎬" },
  { id: "weather", label: "Thời tiết", emoji: "🌦" },
  { id: "tech", label: "Công nghệ", emoji: "📱" },
  { id: "evening", label: "Buổi tối", emoji: "🌙" },
];

export const CLUSTER_IDS = CLUSTERS.map((c) => c.id);

/**
 * `recall` kể lại (quá khứ đơn, trình tự) · `describe` tả (hiện tại, tính từ,
 * giới từ) · `opinion` nêu ý kiến nhẹ — dạng bắc cầu lên Task 2.
 */
export type PromptForm = "recall" | "describe" | "opinion";

export interface DailyPrompt {
  id: string;
  cluster: ClusterId;
  form: PromptForm;
  /** Câu hỏi tiếng Anh, hiện nguyên văn cho người viết. */
  text: string;
  /** Ba mảnh gợi ý tiếng Việt, ngăn bằng "·". Ba, không hơn: bốn mảnh trở lên
   *  thì thành dàn ý và người viết chỉ điền vào chỗ trống. */
  hint: string;
  words: number;
}

/** Nêu lý do cần nhiều chữ hơn kể một việc đã xảy ra. */
const WORDS: Record<PromptForm, number> = {
  recall: 80,
  describe: 80,
  opinion: 100,
};

type Row = [form: PromptForm, text: string, hint: string];

function cluster(id: ClusterId, rows: Row[]): DailyPrompt[] {
  return rows.map(([form, text, hint], i) => ({
    id: `${id}-${String(i + 1).padStart(2, "0")}`,
    cluster: id,
    form,
    text,
    hint,
    words: WORDS[form],
  }));
}

export const DAILY_PROMPTS: DailyPrompt[] = [
  ...cluster("morning", [
    [
      "recall",
      "What time did you wake up today, and what was the first thing you did?",
      "mấy giờ · dậy dễ hay khó · việc đầu tiên",
    ],
    [
      "describe",
      "Describe your morning routine on a normal working day.",
      "thứ tự các việc · mất bao lâu · lúc nào vội nhất",
    ],
    [
      "recall",
      "Tell me about a morning when you overslept. What happened?",
      "vì sao ngủ quên · lỡ mất gì · sau đó làm sao",
    ],
    [
      "describe",
      "Describe the first thing you see when you open your eyes.",
      "phòng ngủ · ánh sáng · âm thanh",
    ],
    [
      "opinion",
      "Do you think you are a morning person or a night person? Why?",
      "lúc nào tỉnh táo nhất · đã thử đổi chưa · hợp với lịch làm việc không",
    ],
    [
      "recall",
      "What did you have for breakfast this morning, and where did you eat it?",
      "món gì · tự làm hay mua · ăn vội không",
    ],
    [
      "describe",
      "Describe how you get ready before leaving the house.",
      "quần áo · đồ mang theo · hay quên gì",
    ],
    [
      "opinion",
      "Is it better to plan your day in the morning or the night before?",
      "đã thử cách nào · cách nào hợp hơn · vì sao",
    ],
  ]),
  ...cluster("food", [
    [
      "recall",
      "What did you eat for lunch yesterday, and who did you eat with?",
      "món gì · ở đâu · ngon không",
    ],
    [
      "describe",
      "Describe a dish you can cook well. How do you make it?",
      "nguyên liệu · các bước · học từ ai",
    ],
    [
      "recall",
      "Tell me about the last time you tried a food you had never eaten before.",
      "ở đâu · ai rủ · thấy thế nào",
    ],
    [
      "describe",
      "Describe a restaurant or food stall you go back to often.",
      "ở đâu · món tủ · vì sao quay lại",
    ],
    [
      "opinion",
      "Do you prefer cooking at home or eating out? Why?",
      "tiền bạc · thời gian · vị ngon",
    ],
    [
      "recall",
      "Tell me about a meal that went wrong — burnt, late, or just bad.",
      "chuyện gì · vì sao · kết cục",
    ],
    [
      "describe",
      "Describe what is in your fridge right now.",
      "đồ gì · còn nhiều không · hay hỏng món nào",
    ],
    [
      "opinion",
      "Is it worth spending more money on better food? What do you think?",
      "đã từng chi nhiều chưa · có đáng không · đổi lại được gì",
    ],
  ]),
  ...cluster("commute", [
    [
      "recall",
      "How did you travel today, and how long did it take?",
      "phương tiện · quãng đường · tắc không",
    ],
    [
      "describe",
      "Describe the route you take most often. What do you pass on the way?",
      "đường nào · nhìn thấy gì · đông lúc nào",
    ],
    [
      "recall",
      "Tell me about the last time you were late because of traffic.",
      "kẹt ở đâu · muộn bao lâu · ai đợi",
    ],
    [
      "describe",
      "Describe how you feel during your daily commute.",
      "mệt hay thư giãn · làm gì trên đường · nghĩ gì",
    ],
    [
      "opinion",
      "Do you prefer travelling alone or with someone? Why?",
      "yên tĩnh · có bạn nói chuyện · tuỳ quãng đường",
    ],
    [
      "recall",
      "Tell me about a journey where something went wrong.",
      "hỏng xe · lạc đường · nhỡ chuyến",
    ],
    [
      "describe",
      "Describe the way people drive or ride where you live.",
      "đông không · có luật lệ gì hay bị phá · bạn thấy sao",
    ],
    [
      "opinion",
      "Would you rather live close to work with a small house, or far away with a big one?",
      "thời gian đi lại · không gian sống · giá thuê",
    ],
  ]),
  ...cluster("work", [
    [
      "recall",
      "What was the main thing you worked on yesterday?",
      "việc gì · xong chưa · khó chỗ nào",
    ],
    [
      "describe",
      "Describe the place where you work.",
      "bàn làm việc · người xung quanh · ồn hay yên",
    ],
    [
      "recall",
      "Tell me about a problem you solved recently at work.",
      "vấn đề gì · làm sao gỡ · mất bao lâu",
    ],
    [
      "describe",
      "Describe a person you work with and what they are good at.",
      "ai · giỏi gì · học được gì từ họ",
    ],
    [
      "opinion",
      "Do you work better in the morning or in the afternoon? Why?",
      "lúc nào tập trung · hay bị ngắt quãng lúc nào · đã thử đổi chưa",
    ],
    [
      "recall",
      "Tell me about the last meeting you had. Was it useful?",
      "về việc gì · bao lâu · có kết luận không",
    ],
    [
      "describe",
      "Describe what a busy day at work looks like for you.",
      "bắt đầu lúc nào · việc nào chồng nhau · kết thúc ra sao",
    ],
    [
      "opinion",
      "Is working from home better than working in an office?",
      "đã thử cả hai chưa · được gì · mất gì",
    ],
  ]),
  ...cluster("home", [
    [
      "describe",
      "Describe the room you are sitting in right now.",
      "to nhỏ · đồ gì · sáng hay tối",
    ],
    [
      "recall",
      "Tell me about the last time you cleaned or tidied your place.",
      "dọn gì · mất bao lâu · vì sao lúc đó",
    ],
    [
      "describe",
      "Describe an object in your home that you would not throw away.",
      "đồ gì · có từ bao giờ · vì sao giữ",
    ],
    [
      "recall",
      "Tell me about something in your home that broke and how you fixed it.",
      "hỏng gì · tự sửa hay gọi thợ · giờ dùng được chưa",
    ],
    [
      "describe",
      "Describe the view from your window.",
      "thấy gì · ban ngày · ban đêm",
    ],
    [
      "opinion",
      "Do you prefer living alone or with other people? Why?",
      "yên tĩnh · chia việc nhà · có người nói chuyện",
    ],
    [
      "recall",
      "Tell me about the last time you moved house or rearranged a room.",
      "vì sao · khó ở chỗ nào · sau đó thấy sao",
    ],
    [
      "opinion",
      "What is the one thing you would change about where you live?",
      "thiếu gì · sửa được không · tốn bao nhiêu",
    ],
  ]),
  ...cluster("shopping", [
    [
      "recall",
      "What was the last thing you bought, and why did you buy it?",
      "món gì · bao nhiêu · cần hay thích",
    ],
    [
      "describe",
      "Describe the shop or market where you buy food.",
      "ở đâu · đông không · người bán thế nào",
    ],
    [
      "recall",
      "Tell me about something you bought and later regretted.",
      "món gì · vì sao tiếc · giờ nó ở đâu",
    ],
    [
      "describe",
      "Describe how you decide whether something is worth the money.",
      "so giá · đọc đánh giá · hỏi ai",
    ],
    [
      "opinion",
      "Do you prefer shopping online or in a real shop? Why?",
      "tiện · xem tận tay · đổi trả",
    ],
    [
      "recall",
      "Tell me about the last time you saved money for something.",
      "để dành mua gì · mất bao lâu · có mua được không",
    ],
    [
      "describe",
      "Describe a thing you own that was worth every single one of the coins you paid.",
      "món gì · dùng bao lâu rồi · vì sao đáng",
    ],
    [
      "opinion",
      "Is it better to buy few expensive things or many cheap ones?",
      "đã thử kiểu nào · kết quả ra sao · giờ chọn kiểu gì",
    ],
  ]),
  ...cluster("health", [
    [
      "recall",
      "What did you do to move your body this week?",
      "tập gì · mấy lần · thấy thế nào",
    ],
    [
      "describe",
      "Describe how you sleep — how much, and how well.",
      "mấy tiếng · ngủ sâu không · hay tỉnh giấc",
    ],
    [
      "recall",
      "Tell me about the last time you felt unwell. What did you do?",
      "ốm gì · nghỉ hay cố · bao lâu thì khỏi",
    ],
    [
      "describe",
      "Describe a habit of yours that is not good for your health.",
      "thói quen gì · lúc nào hay xảy ra · biết từ bao giờ",
    ],
    [
      "opinion",
      "Do you think you sit too much? What could you change?",
      "ngồi bao lâu mỗi ngày · đã thử gì · làm được gì tiếp",
    ],
    [
      "recall",
      "Tell me about a time you tried to build a new healthy habit.",
      "định làm gì · giữ được bao lâu · vì sao dừng",
    ],
    [
      "describe",
      "Describe how you feel at the end of a long day.",
      "mệt kiểu gì · làm gì cho lại sức · ngủ có ngon hơn không",
    ],
    [
      "opinion",
      "Is it easier to eat well or to exercise regularly? Why?",
      "cái nào khó hơn với bạn · vì sao · đã thử cách nào",
    ],
  ]),
  ...cluster("people", [
    [
      "recall",
      "Who did you talk to yesterday, and what did you talk about?",
      "ai · gặp hay nhắn tin · chuyện gì",
    ],
    [
      "describe",
      "Describe someone in your family and one habit of theirs.",
      "ai · thói quen gì · bạn thấy sao",
    ],
    [
      "recall",
      "Tell me about the last time you helped someone.",
      "ai · việc gì · mất bao lâu",
    ],
    [
      "describe",
      "Describe a friend you have known the longest.",
      "quen từ bao giờ · gặp ở đâu · giờ ra sao",
    ],
    [
      "opinion",
      "Is it easier to keep old friendships or make new ones? Why?",
      "thời gian · điểm chung · kinh nghiệm của bạn",
    ],
    [
      "recall",
      "Tell me about a time someone gave you advice you actually used.",
      "ai nói · nói gì · bạn làm gì sau đó",
    ],
    [
      "describe",
      "Describe how your family usually spends time together.",
      "dịp nào · làm gì · thường ở đâu",
    ],
    [
      "opinion",
      "Do you prefer meeting people in a group or one to one?",
      "nói được nhiều hơn ở đâu · thoải mái hơn ở đâu · vì sao",
    ],
  ]),
  ...cluster("weekend", [
    [
      "recall",
      "What did you do last weekend?",
      "thứ Bảy · Chủ nhật · có ra ngoài không",
    ],
    [
      "describe",
      "Describe how you like to spend a free afternoon.",
      "ở nhà hay đi đâu · một mình hay có ai · làm gì",
    ],
    [
      "recall",
      "Tell me about the last film or show you watched.",
      "tên gì · về cái gì · có thích không",
    ],
    [
      "describe",
      "Describe a place near you that is good for relaxing.",
      "ở đâu · đi bằng gì · vì sao dễ chịu",
    ],
    [
      "opinion",
      "Do you prefer a busy weekend or a quiet one? Why?",
      "tuần vừa rồi thế nào · thấy đủ chưa · tuần tới muốn gì",
    ],
    [
      "recall",
      "Tell me about the last time you did something for the first time.",
      "việc gì · ai rủ · sẽ làm lại chứ",
    ],
    [
      "describe",
      "Describe something you do just for fun, with no purpose.",
      "làm gì · bao lâu một lần · vì sao thích",
    ],
    [
      "opinion",
      "Is it better to plan a weekend or leave it open?",
      "đã thử kiểu nào · kiểu nào vui hơn · vì sao",
    ],
  ]),
  ...cluster("weather", [
    [
      "describe",
      "Describe the weather today and how it changed your plans.",
      "nắng mưa · nóng lạnh · phải đổi gì",
    ],
    [
      "recall",
      "Tell me about the last time you got caught in the rain.",
      "ở đâu · có áo mưa không · sau đó thế nào",
    ],
    [
      "describe",
      "Describe your favourite season where you live.",
      "mùa nào · thời tiết ra sao · làm được gì",
    ],
    [
      "recall",
      "Tell me about a very hot or very cold day you remember.",
      "khi nào · nóng lạnh cỡ nào · chịu kiểu gì",
    ],
    [
      "describe",
      "Describe what you wear when the weather changes suddenly.",
      "mặc gì · mang theo gì · có kịp không",
    ],
    [
      "opinion",
      "Does the weather change your mood? In what way?",
      "ngày mưa · ngày nắng · làm việc khác nhau không",
    ],
    [
      "recall",
      "Tell me about a plan that was cancelled because of the weather.",
      "định làm gì · thay bằng gì · có tiếc không",
    ],
    [
      "opinion",
      "Would you rather live somewhere always hot or always cold? Why?",
      "chịu nóng hay chịu lạnh giỏi hơn · quần áo · sinh hoạt",
    ],
  ]),
  ...cluster("tech", [
    [
      "describe",
      "Describe an app you open every single day and what you use it for.",
      "app gì · mở lúc nào · để làm gì",
    ],
    [
      "recall",
      "Tell me about the last time your phone or computer stopped working.",
      "hỏng gì · sửa thế nào · mất bao lâu",
    ],
    [
      "describe",
      "Describe the device you use the most and how old it is.",
      "máy gì · dùng bao lâu · còn tốt không",
    ],
    [
      "recall",
      "Tell me about something new you learned to use recently.",
      "công cụ gì · học từ đâu · khó chỗ nào",
    ],
    [
      "opinion",
      "Do you spend too much time on your phone? What would you cut?",
      "mấy tiếng · app nào tốn nhất · cắt được không",
    ],
    [
      "recall",
      "Tell me about a time technology saved you a lot of time.",
      "việc gì · trước đây làm sao · giờ ra sao",
    ],
    [
      "describe",
      "Describe how you keep your files, photos, or notes organised.",
      "để ở đâu · có sắp xếp không · tìm lại dễ không",
    ],
    [
      "opinion",
      "Is it better to have fewer apps that do more, or many small ones?",
      "bạn đang theo kiểu nào · thấy sao · sẽ đổi không",
    ],
  ]),
  ...cluster("evening", [
    [
      "recall",
      "What did you do last night after dinner?",
      "làm gì · một mình hay có ai · mấy giờ xong",
    ],
    [
      "describe",
      "Describe how you wind down before going to bed.",
      "việc cuối trong ngày · mất bao lâu · có hiệu quả không",
    ],
    [
      "recall",
      "Tell me about the last time you stayed up much later than usual.",
      "vì sao · tới mấy giờ · hôm sau thế nào",
    ],
    [
      "describe",
      "Describe what your home sounds like in the evening.",
      "tiếng gì · yên hay ồn · từ đâu tới",
    ],
    [
      "opinion",
      "Do you like evenings alone or with other people? Why?",
      "tối qua thế nào · thấy đủ chưa · thường chọn kiểu nào",
    ],
    [
      "recall",
      "Tell me about something you finished yesterday that felt good.",
      "việc gì · mất bao lâu · vì sao nhẹ người",
    ],
    [
      "describe",
      "Describe the last thing you do before you turn off the light.",
      "đọc · điện thoại · nghĩ gì",
    ],
    [
      "opinion",
      "Is it better to end the day early or use the late hours?",
      "bạn hay làm gì lúc muộn · có hiệu quả không · đánh đổi gì",
    ],
  ]),
];

const BY_ID = new Map(DAILY_PROMPTS.map((p) => [p.id, p]));
const BY_CLUSTER = new Map<ClusterId, Cluster>(CLUSTERS.map((c) => [c.id, c]));

export function dailyPromptById(id: string): DailyPrompt | undefined {
  return BY_ID.get(id);
}

export function clusterById(id: string): Cluster | undefined {
  return BY_CLUSTER.get(id as ClusterId);
}

export function promptsInClusters(clusters: ClusterId[]): DailyPrompt[] {
  const set = new Set(clusters);
  return DAILY_PROMPTS.filter((p) => set.has(p.cluster));
}

export function isClusterId(value: string): value is ClusterId {
  return BY_CLUSTER.has(value as ClusterId);
}
