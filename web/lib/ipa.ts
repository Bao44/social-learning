// lib/ipa.ts
export type IPAExample = {
  word: string; // từ tiếng Anh
  ipa: string; // phiên âm của từ
};

export type IPAEntry = {
  symbol: string; // ký hiệu IPA, ví dụ: "/ɪ/"
  audio?: string | null; // đường dẫn file audio (optional)
  shortDescription: string; // mô tả ngắn (VN)
  articulation?: string; // mô tả cách đặt môi, lưỡi... (VN)
  examples: IPAExample[]; // ví dụ
  notes?: string | null; // ghi chú thêm (optional)
};

const IPA_DATA: IPAEntry[] = [
  {
    symbol: "/ɪ/",
    audio:
      "https://st.ielts-fighter.com/src/ielts-fighter/2019/09/09/i%20ng%E1%BA%AFn.mp3",
    shortDescription:
      "Đây là âm i ngắn, phát âm giống âm “i” của tiếng Việt nhưng ngắn hơn, bật nhanh.",
    articulation: "Môi hơi mở sang hai bên, lưỡi hạ thấp.",
    examples: [
      { word: "his", ipa: "/hɪz/" },
      { word: "kid", ipa: "/kɪd/" },
      { word: "sit", ipa: "/sɪt/" },
    ],
    notes: null,
  },

  {
    symbol: "/iː/",
    audio:
      "https://st.ielts-fighter.com/src/ielts-fighter/2019/09/09/i%20d%C3%A0i.mp3",
    shortDescription:
      "Âm i dài, kéo dài hơn /ɪ/, giống gần với 'i' kéo dài trong tiếng Việt nhưng hơi khác âm sắc.",
    articulation: "Môi hơi kéo căng, lưỡi nâng cao về phía trước.",
    examples: [
      { word: "sheep", ipa: "/ʃiːp/" },
      { word: "seat", ipa: "/siːt/" },
    ],
    notes: null,
  },

  {
    symbol: "/e/",
    audio: "https://st.ielts-fighter.com/src/ielts-fighter/2019/09/09/e.mp3",
    shortDescription:
      "Âm e ngắn (giữa), tương tự âm 'e' trong một số từ tiếng Việt nhưng không hoàn toàn giống.",
    articulation: "Môi hơi hé, lưỡi ở vị trí trung bình.",
    examples: [
      { word: "bed", ipa: "/bed/" },
      { word: "get", ipa: "/ɡet/" },
    ],
    notes: null,
  },

  {
    symbol: "/æ/",
    audio: "https://st.ielts-fighter.com/src/ielts-fighter/2019/09/09/ae.mp3",
    shortDescription:
      "Âm giống 'a' gần mặt chữ nhưng mở miệng rộng hơn; thường thấy ở từ như 'cat'.",
    articulation: "Môi mở rộng, lưỡi hơi hạ thấp về phía trước.",
    examples: [
      { word: "cat", ipa: "/kæt/" },
      { word: "man", ipa: "/mæn/" },
    ],
    notes: null,
  },

  {
    symbol: "/ʌ/",
    audio: "https://st.ielts-fighter.com/src/ielts-fighter/2019/09/09/a%20ng%E1%BA%AFn.mp3",
    shortDescription:
      "Âm 'u' ngắn (ở một số giọng Anh - British) — không giống 'u' tiếng Việt.",
    articulation: "Môi không tròn, lưỡi ở vị trí trung tâm hơi thấp.",
    examples: [
      { word: "cup", ipa: "/kʌp/" },
      { word: "love", ipa: "/lʌv/" },
    ],
    notes: null,
  },

  {
    symbol: "/ɜː/",
    audio: "https://st.ielts-fighter.com/src/ielts-fighter/2019/09/09/%C6%A1%20d%C3%A0i.mp3",
    shortDescription:
      "Âm giữa dài (như trong 'bird' với giọng Anh), thường được kết hợp với /r/ trong accent Mỹ.",
    articulation: "Lưỡi ở vị trí trung tâm, phát âm hơi kéo dài.",
    examples: [
      { word: "bird", ipa: "/bɜːd/" },
      { word: "learn", ipa: "/lɜːn/" },
    ],
    notes: "Trong tiếng Anh Mỹ thường nghe khác do 'r-colouring'.",
  },

  {
    symbol: "/ə/",
    audio: "https://st.ielts-fighter.com/src/ielts-fighter/2019/09/09/%C6%A1%20ng%E1%BA%AFn.mp3",
    shortDescription:
      "Schwa — âm yếu, thường xuất hiện trong âm tiết không nhấn trọng âm (unstressed syllables).",
    articulation: "Môi thư giãn, lưỡi ở vị trí trung tâm.",
    examples: [
      { word: "about", ipa: "/əˈbaʊt/" },
      { word: "sofa", ipa: "/ˈsəʊfə/" },
    ],
    notes: "Rất phổ biến trong tiếng Anh nói nhanh.",
  },

  {
    symbol: "/ɑː/",
    audio: null,
    shortDescription: "Âm 'a' kéo dài (như trong 'car' ở nhiều giọng Anh).",
    articulation: "Môi mở rộng, lưỡi hạ sâu.",
    examples: [
      { word: "car", ipa: "/kɑː/" },
      { word: "father", ipa: "/ˈfɑːðər/" },
    ],
    notes: null,
  },

  {
    symbol: "/ɒ/",
    audio: null,
    shortDescription:
      "Âm 'o' ngắn trong giọng Anh (British) — tương đương /ɑ/ hay /ɔ/ trong một số giọng khác.",
    articulation: "Môi mở tròn vừa phải, lưỡi hơi thấp.",
    examples: [
      { word: "hot", ipa: "/hɒt/" },
      { word: "dog", ipa: "/dɒɡ/" },
    ],
    notes: "Không phổ biến trong tiếng Anh Mỹ (thường là /ɑ/).",
  },

  {
    symbol: "/uː/",
    audio: null,
    shortDescription: "Âm 'u' dài (như trong 'food').",
    articulation: "Môi tròn, lưỡi nâng về sau.",
    examples: [
      { word: "food", ipa: "/fuːd/" },
      { word: "true", ipa: "/truː/" },
    ],
    notes: null,
  },

  {
    symbol: "/ʊ/",
    audio: null,
    shortDescription: "Âm 'u' ngắn (như trong 'book').",
    articulation: "Môi hơi tròn, lưỡi hơi nâng về sau nhưng thấp hơn /uː/.",
    examples: [
      { word: "book", ipa: "/bʊk/" },
      { word: "good", ipa: "/ɡʊd/" },
    ],
    notes: null,
  },

  {
    symbol: "/ɔː/",
    audio: null,
    shortDescription: "Âm 'o' kéo dài (như trong 'door').",
    articulation: "Môi tròn nhẹ, lưỡi nâng ở phía sau.",
    examples: [
      { word: "door", ipa: "/dɔː/" },
      { word: "law", ipa: "/lɔː/" },
    ],
    notes: null,
  },

  // Diphthongs (nguyên âm đôi)
  {
    symbol: "/eɪ/",
    audio: null,
    shortDescription: "Nguyên âm đôi như trong 'say'.",
    articulation: "Di chuyển từ vị trí /e/ đến /ɪ/.",
    examples: [
      { word: "say", ipa: "/seɪ/" },
      { word: "play", ipa: "/pleɪ/" },
    ],
    notes: null,
  },

  {
    symbol: "/aɪ/",
    audio: null,
    shortDescription: "Nguyên âm đôi như trong 'my'.",
    articulation: "Di chuyển từ /a/ đến /ɪ/.",
    examples: [
      { word: "my", ipa: "/maɪ/" },
      { word: "time", ipa: "/taɪm/" },
    ],
    notes: null,
  },

  {
    symbol: "/ɔɪ/",
    audio: null,
    shortDescription: "Nguyên âm đôi như trong 'boy'.",
    articulation: "Di chuyển từ /ɔ/ đến /ɪ/.",
    examples: [
      { word: "boy", ipa: "/bɔɪ/" },
      { word: "coin", ipa: "/kɔɪn/" },
    ],
    notes: null,
  },

  {
    symbol: "/aʊ/",
    audio: null,
    shortDescription: "Nguyên âm đôi như trong 'house'.",
    articulation: "Di chuyển từ /a/ đến /ʊ/.",
    examples: [
      { word: "house", ipa: "/haʊs/" },
      { word: "out", ipa: "/aʊt/" },
    ],
    notes: null,
  },

  {
    symbol: "/əʊ/",
    audio: null,
    shortDescription: "Nguyên âm đôi (RB: /əʊ/) như trong 'go'.",
    articulation: "Di chuyển từ /ə/ đến /ʊ/.",
    examples: [
      { word: "go", ipa: "/ɡəʊ/" },
      { word: "no", ipa: "/nəʊ/" },
    ],
    notes: "Trong tiếng Anh Mỹ tương đương thường là /oʊ/.",
  },

  // Consonants (phụ âm) — chọn một số âm tiêu biểu
  {
    symbol: "/p/",
    audio: null,
    shortDescription: "Phụ âm bật môi vô thanh (voiceless bilabial plosive).",
    articulation: "Đóng hai môi rồi bật ra.",
    examples: [
      { word: "pen", ipa: "/pen/" },
      { word: "apple", ipa: "/ˈæpəl/" },
    ],
    notes: null,
  },

  {
    symbol: "/b/",
    audio: null,
    shortDescription: "Phụ âm bật môi hữu thanh (voiced bilabial plosive).",
    articulation: "Đóng hai môi rồi bật ra kèm rung dây thanh.",
    examples: [
      { word: "bag", ipa: "/bæɡ/" },
      { word: "bubble", ipa: "/ˈbʌbəl/" },
    ],
    notes: null,
  },

  {
    symbol: "/t/",
    audio: null,
    shortDescription: "Phụ âm bật lưỡi vô thanh (voiceless alveolar plosive).",
    articulation: "Đặt đầu lưỡi lên lợi (alveolar ridge) rồi bật.",
    examples: [
      { word: "top", ipa: "/tɒp/" },
      { word: "time", ipa: "/taɪm/" },
    ],
    notes: null,
  },

  {
    symbol: "/d/",
    audio: null,
    shortDescription: "Phụ âm bật lưỡi hữu thanh (voiced alveolar plosive).",
    articulation: "Đặt đầu lưỡi lên lợi rồi bật kèm rung dây thanh.",
    examples: [
      { word: "dog", ipa: "/dɒɡ/" },
      { word: "day", ipa: "/deɪ/" },
    ],
    notes: null,
  },

  {
    symbol: "/k/",
    audio: null,
    shortDescription: "Phụ âm bật lưỡi sau vô thanh (voiceless velar plosive).",
    articulation: "Lưng lưỡi chạm vòm sau rồi bật.",
    examples: [
      { word: "cat", ipa: "/kæt/" },
      { word: "back", ipa: "/bæk/" },
    ],
    notes: null,
  },

  {
    symbol: "/g/",
    audio: null,
    shortDescription: "Phụ âm bật lưỡi sau hữu thanh (voiced velar plosive).",
    articulation: "Lưng lưỡi chạm vòm sau rồi bật kèm rung dây thanh.",
    examples: [
      { word: "go", ipa: "/ɡəʊ/" },
      { word: "big", ipa: "/bɪɡ/" },
    ],
    notes: null,
  },

  {
    symbol: "/f/",
    audio: null,
    shortDescription:
      "Phụ âm ma sát môi-răng vô thanh (voiceless labiodental fricative).",
    articulation: "Răng trên chạm môi dưới, thổi ra.",
    examples: [
      { word: "fun", ipa: "/fʌn/" },
      { word: "leaf", ipa: "/liːf/" },
    ],
    notes: null,
  },

  {
    symbol: "/v/",
    audio: null,
    shortDescription:
      "Phụ âm ma sát môi-răng hữu thanh (voiced labiodental fricative).",
    articulation: "Răng trên chạm môi dưới, rung dây thanh.",
    examples: [
      { word: "very", ipa: "/ˈveri/" },
      { word: "move", ipa: "/muːv/" },
    ],
    notes: null,
  },

  {
    symbol: "/θ/",
    audio: null,
    shortDescription: "Phụ âm 'th' vô thanh (think).",
    articulation: "Đặt đầu lưỡi giữa hai răng, thổi ra không rung dây thanh.",
    examples: [
      { word: "think", ipa: "/θɪŋk/" },
      { word: "both", ipa: "/bəʊθ/" },
    ],
    notes: null,
  },

  {
    symbol: "/ð/",
    audio: null,
    shortDescription: "Phụ âm 'th' hữu thanh (this).",
    articulation: "Đặt đầu lưỡi giữa hai răng, thổi ra có rung dây thanh.",
    examples: [
      { word: "this", ipa: "/ðɪs/" },
      { word: "other", ipa: "/ˈʌðər/" },
    ],
    notes: null,
  },

  {
    symbol: "/s/",
    audio: null,
    shortDescription: "Phụ âm ma sát răng vô thanh.",
    articulation:
      "Không rung dây thanh, khí thoát qua khe giữa đầu lưỡi và lợi.",
    examples: [
      { word: "see", ipa: "/siː/" },
      { word: "bus", ipa: "/bʌs/" },
    ],
    notes: null,
  },

  {
    symbol: "/z/",
    audio: null,
    shortDescription: "Phụ âm ma sát răng hữu thanh.",
    articulation: "Giống /s/ nhưng rung dây thanh.",
    examples: [
      { word: "zoo", ipa: "/zuː/" },
      { word: "lazy", ipa: "/ˈleɪzi/" },
    ],
    notes: null,
  },

  {
    symbol: "/ʃ/",
    audio: null,
    shortDescription: "Âm 'sh' (she) — vô thanh.",
    articulation: "Khí đi qua khe nhỏ, môi hơi tròn, lưỡi nâng về trước.",
    examples: [
      { word: "she", ipa: "/ʃiː/" },
      { word: "shop", ipa: "/ʃɒp/" },
    ],
    notes: null,
  },

  {
    symbol: "/ʒ/",
    audio: "https://st.ielts-fighter.com/src/ielts-fighter/2019/09/09/%CA%92.mp3",
    shortDescription: "Âm giống 'zh' (vision) — hữu thanh.",
    articulation: "Giống /ʃ/ nhưng rung dây thanh.",
    examples: [
      { word: "vision", ipa: "/ˈvɪʒən/" },
      { word: "measure", ipa: "/ˈmeʒər/" },
    ],
    notes: null,
  },

  {
    symbol: "/tʃ/",
    audio: null,
    shortDescription: "Âm tổ hợp 'ch' — vô thanh (check).",
    articulation: "Kết hợp bật + ma sát, không rung dây thanh.",
    examples: [
      { word: "check", ipa: "/tʃek/" },
      { word: "church", ipa: "/tʃɜːtʃ/" },
    ],
    notes: null,
  },

  {
    symbol: "/dʒ/",
    audio: null,
    shortDescription: "Âm tổ hợp 'j' — hữu thanh (judge).",
    articulation: "Kết hợp bật + ma sát, rung dây thanh.",
    examples: [
      { word: "judge", ipa: "/dʒʌdʒ/" },
      { word: "job", ipa: "/dʒɒb/" },
    ],
    notes: null,
  },

  {
    symbol: "/m/",
    audio: null,
    shortDescription: "Âm m — mũi hữu thanh (nasal).",
    articulation: "Đóng hai môi, hơi thoát ra mũi, dây thanh rung.",
    examples: [
      { word: "man", ipa: "/mæn/" },
      { word: "some", ipa: "/səm/" },
    ],
    notes: null,
  },

  {
    symbol: "/n/",
    audio: null,
    shortDescription: "Âm n — mũi hữu thanh (alveolar nasal).",
    articulation: "Đầu lưỡi chạm lợi, hơi thoát ra mũi.",
    examples: [
      { word: "no", ipa: "/nəʊ/" },
      { word: "ten", ipa: "/ten/" },
    ],
    notes: null,
  },

  {
    symbol: "/ŋ/",
    audio: null,
    shortDescription: "Âm ng (ng sound) — mũi hữu thanh (velar nasal).",
    articulation: "Lưng lưỡi chạm vòm sau, hơi thoát ra mũi.",
    examples: [
      { word: "sing", ipa: "/sɪŋ/" },
      { word: "long", ipa: "/lɒŋ/" },
    ],
    notes: null,
  },

  {
    symbol: "/l/",
    audio: null,
    shortDescription: "Âm l — lateral (bên).",
    articulation: "Đầu lưỡi chạm lợi, không khí thoát ra hai bên lưỡi.",
    examples: [
      { word: "let", ipa: "/let/" },
      { word: "full", ipa: "/fʊl/" },
    ],
    notes: null,
  },

  {
    symbol: "/r/",
    audio: null,
    shortDescription:
      "Âm r — có nhiều biến thể theo giọng (Alveolar/post-alveolar, approximant).",
    articulation:
      "Độ cuộn/rung khác nhau tùy accent; ở tiếng Anh Anh thường không cuộn mạnh như tiếng Việt.",
    examples: [
      { word: "red", ipa: "/red/" },
      { word: "car", ipa: "/kɑː/" },
    ],
    notes:
      "Trong tiếng Anh Mỹ thường nghe rõ /r/ ở cuối từ; British RP có 'non-rhotic' (thường không đọc /r/ cuối).",
  },
];

export default IPA_DATA;
