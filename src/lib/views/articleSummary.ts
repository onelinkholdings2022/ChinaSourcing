// Tóm tắt cho ô "Summary" đầu bài viết — bản port từ OlcoMain
// (`src/lib/blog/articleSummary.ts`), giữ nguyên thuật toán, chỉ đổi phần tiện
// ích chuỗi cho khớp dự án này.
//
// ĐỌC THÂN BÀI rồi rút gọn, KHÔNG lấy `metaDescription` bên SEO: chuỗi đó viết
// cho kết quả tìm kiếm, thường là lời quảng cáo chứ không phải nội dung bài —
// và ở dự án này 108/180 mô tả vốn là placeholder mặc định của Rank Math (xem
// deviation 43), tức lấy nó ra thì ô Summary in ra "This is the meta
// descrtiption for the Products".
//
// Thuật toán trích câu (extractive), thuần TS, chạy lúc render server: đếm tần
// suất từ mang thông tin trên toàn bài → chấm điểm từng câu theo mật độ từ khoá
// → nhặt vài câu điểm cao nhất rồi XẾP LẠI THEO THỨ TỰ TRONG BÀI. Không có
// model nào chạy sau lưng.

/**
 * Trần độ dài của tóm tắt. Cố ý DÀI hơn hai dòng của ô: bài dài xứng đáng vài
 * câu, và ô đã có sẵn nút Show More để gập phần dư (`ArticleSummary`).
 */
export const SUMMARY_MAX_CHARS = 420;

/** Từ chức năng — có mặt ở mọi câu nên không nói lên bài viết về cái gì. */
const STOPWORDS = new Set(
  `a about after all also an and any are as at be because been before being but by can
   could did do does for from had has have he her here his how i if in into is it its
   just like may me might more most much must my no not of on once one only or other our
   out over own she should so some such than that the their them then there these they
   this those through to too under up very was we were what when where which while who
   why will with would you your`.split(/\s+/)
);

/** Khối không phải văn xuôi — chú thích ảnh, bảng, script đều không vào tóm tắt. */
const DROP_BLOCK_RE = /<(figure|figcaption|table|script|style)\b[\s\S]*?<\/\1>/gi;
const PARAGRAPH_RE = /<(p|li)\b[^>]*>([\s\S]*?)<\/\1>/gi;
const HEADING_RE = /<h[1-4]\b[^>]*>([\s\S]*?)<\/h[1-4]>/gi;

/** Câu chào mời — đúng về mặt marketing nhưng không tóm tắt được gì. */
const NOISE_RE =
  /\b(click here|contact us|get in touch|reach out|read more|subscribe|follow us|book a|hello everyone|hi everyone|welcome to)\b/i;

/** Ngắn hơn thì chưa thành câu; dài hơn thì một câu nuốt trọn cả ô. */
const MIN_SENTENCE_CHARS = 60;
const MAX_SENTENCE_CHARS = 300;

/**
 * Câu phải mang tối thiểu ngần này TỪ KHOÁ khác nhau mới được xét. Không có
 * ngưỡng này thì mấy câu nối ("The residential sector is equally dynamic.")
 * thắng nhờ mật độ cao trên một nhúm từ, và tóm tắt đọc ra như một chuỗi khẩu
 * hiệu rời rạc.
 */
const MIN_KEYWORDS = 5;

/** Trần số câu — nhiều hơn ba câu trích là bắt đầu đọc ra như bản ghép. */
const MAX_SENTENCES = 3;

/** Hai câu trùng nhau quá ngần này phần từ khoá thì câu sau là nói lại. */
const MAX_OVERLAP = 0.6;

/**
 * Nội dung ở đây cào từ WordPress nên còn nguyên entity số lẫn entity tên
 * (deviation 12). `stripHtml` của `textUtils` chỉ giải mã năm cái hay gặp;
 * tóm tắt in ra nguyên văn nên phải giải mã rộng hơn, không thì ô Summary hiện
 * "China&#8217;s trade".
 */
function decodeEntities(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&nbsp;/g, " ")
    .replace(/&hellip;/g, "…")
    .replace(/&lsquo;/g, "‘")
    .replace(/&rsquo;/g, "’")
    .replace(/&ldquo;/g, "“")
    .replace(/&rdquo;/g, "”")
    .replace(/&ndash;/g, "–")
    .replace(/&mdash;/g, "—")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    // `&amp;` sau cùng, không thì "&amp;lt;" ra thẳng dấu "<".
    .replace(/&amp;/g, "&");
}

function lowerWords(text: string): string[] {
  return text.toLowerCase().match(/[a-z0-9][a-z0-9'-]*/g) ?? [];
}

function cleanText(inner: string): string {
  return decodeEntities(inner.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

/** Cắt câu ở dấu chấm/hỏi/than khi phía sau mở ra một chữ HOA hoặc số. */
function splitSentences(paragraph: string): string[] {
  return paragraph.split(/(?<=[.!?])\s+(?=["“(]?[A-Z0-9])/);
}

function overlapRatio(a: Set<string>, b: Set<string>): number {
  const smaller = a.size <= b.size ? a : b;
  const larger = smaller === a ? b : a;
  if (smaller.size === 0) return 0;
  let shared = 0;
  for (const word of smaller) if (larger.has(word)) shared += 1;
  return shared / smaller.size;
}

/** Cắt về `maxChars`, lùi tới khoảng trắng gần nhất rồi nối "…". */
function clampSummary(text: string, maxChars: number): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= maxChars) return t;
  const slice = t.slice(0, maxChars);
  const cut = slice.lastIndexOf(" ");
  return `${(cut > maxChars * 0.6 ? slice.slice(0, cut) : slice).trim()}…`;
}

interface Candidate {
  text: string;
  /** Thứ tự xuất hiện trong bài — dùng để xếp lại sau khi đã chấm điểm. */
  order: number;
  score: number;
  keywords: Set<string>;
}

/**
 * Tóm tắt HTML thân bài về ≤ `maxChars` ký tự.
 *
 * Trả chuỗi rỗng khi thân bài không có đoạn văn nào đáng kể (bài chỉ có ảnh,
 * hoặc chưa soạn xong) — chỗ gọi tự quyết định có dựng ô Summary hay không.
 */
export function summarizeArticle(
  html: string | null | undefined,
  maxChars = SUMMARY_MAX_CHARS
): string {
  if (!html) return "";
  const body = html.replace(DROP_BLOCK_RE, "");

  // Đoạn văn: bỏ đoạn chỉ bọc ảnh (editor gói <img> trong <p>) và đoạn quá
  // ngắn — chú thích, dòng ký tên, một cụm in đậm đứng lẻ.
  const paragraphs: string[] = [];
  for (const match of body.matchAll(PARAGRAPH_RE)) {
    if (/<img\b/i.test(match[2])) continue;
    const text = cleanText(match[2]);
    if (text.length >= MIN_SENTENCE_CHARS) paragraphs.push(text);
  }
  if (paragraphs.length === 0) return "";

  // Tần suất từ: tiêu đề mục tính GẤP ĐÔI. Tác giả đặt từ khoá của bài lên tiêu
  // đề, nên câu nào nhắc lại chúng là câu đang nói vào trọng tâm.
  const frequency = new Map<string, number>();
  const bump = (words: string[], weight: number) => {
    for (const word of words) {
      if (word.length <= 2 || STOPWORDS.has(word)) continue;
      frequency.set(word, (frequency.get(word) ?? 0) + weight);
    }
  };
  for (const paragraph of paragraphs) bump(lowerWords(paragraph), 1);
  for (const match of body.matchAll(HEADING_RE)) bump(lowerWords(cleanText(match[1])), 2);

  const candidates: Candidate[] = [];
  paragraphs.forEach((paragraph, paragraphIndex) => {
    for (const raw of splitSentences(paragraph)) {
      const text = raw.trim();
      if (text.length < MIN_SENTENCE_CHARS || text.length > MAX_SENTENCE_CHARS) continue;
      if (NOISE_RE.test(text)) continue;

      const words = lowerWords(text);
      const keywords = new Set(words.filter((w) => w.length > 2 && !STOPWORDS.has(w)));
      if (keywords.size < MIN_KEYWORDS) continue;
      let mass = 0;
      for (const word of keywords) mass += frequency.get(word) ?? 0;
      // Chia cho độ dài (mũ 0.9) để câu dài không thắng chỉ vì gom được nhiều
      // từ; nhân thêm thiên vị MỞ BÀI vì đoạn đầu chính là chỗ tác giả tự tóm
      // tắt bài của mình.
      const density = mass / Math.pow(Math.max(words.length, 1), 0.9);
      const lead = 1 + 0.5 / (paragraphIndex + 1);
      candidates.push({ text, order: candidates.length, score: density * lead, keywords });
    }
  });
  if (candidates.length === 0) return clampSummary(paragraphs[0], maxChars);

  const picked: Candidate[] = [];
  let length = 0;
  for (const candidate of [...candidates].sort((a, b) => b.score - a.score)) {
    // Câu đầu tiên luôn được nhận rồi mới clamp: thà cắt một câu còn hơn trả về
    // chuỗi rỗng khi cả bài chỉ có những câu dài.
    if (picked.length > 0 && length + candidate.text.length + 1 > maxChars) continue;
    if (picked.some((p) => overlapRatio(p.keywords, candidate.keywords) > MAX_OVERLAP)) continue;
    picked.push(candidate);
    length += candidate.text.length + 1;
    if (picked.length >= MAX_SENTENCES || length >= maxChars * 0.8) break;
  }

  picked.sort((a, b) => a.order - b.order);
  return clampSummary(picked.map((p) => p.text).join(" "), maxChars);
}
