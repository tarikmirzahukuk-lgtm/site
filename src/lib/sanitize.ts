import sanitizeHtml from "sanitize-html";

/**
 * TipTap editör çıktısı için güvenli HTML temizleyici.
 * Public sayfalarda dangerouslySetInnerHTML ile basılan tüm zengin metin
 * (makale içeriği, hakkımda/about/urgent gövdeleri) bundan geçer.
 * `javascript:` şemaları, <script>, olay işleyicileri (onerror vb.) elenir.
 */
const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "p", "br", "hr",
    "h1", "h2", "h3", "h4", "h5", "h6",
    "strong", "b", "em", "i", "u", "s", "strike", "del",
    "a", "ul", "ol", "li", "blockquote",
    "code", "pre", "span", "mark", "sub", "sup", "img",
  ],
  allowedAttributes: {
    a: ["href", "target", "rel"],
    img: ["src", "alt", "title", "width", "height"],
    span: ["style"],
    mark: ["style", "data-color"],
    p: ["style"],
    // id: makale içeriğindeki başlıklara TOC çapası için eklenir.
    h1: ["style", "id"], h2: ["style", "id"], h3: ["style", "id"], h4: ["style", "id"],
    h5: ["style", "id"], h6: ["style", "id"], li: ["style"],
  },
  allowedStyles: {
    "*": {
      color: [/^#(?:[0-9a-f]{3,8})$/i, /^rgb\(/i, /^rgba\(/i, /^[a-z]+$/i],
      "background-color": [/^#(?:[0-9a-f]{3,8})$/i, /^rgb\(/i, /^rgba\(/i, /^[a-z]+$/i],
      "text-align": [/^(?:left|right|center|justify)$/],
      "font-size": [/^\d+(?:px|em|rem|%)$/],
    },
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  transformTags: {
    a: sanitizeHtml.simpleTransform("a", {
      rel: "noopener noreferrer nofollow",
    }),
  },
};

export function sanitize(html: string): string {
  if (!html) return "";
  return sanitizeHtml(html, OPTIONS);
}
