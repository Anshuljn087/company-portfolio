import sanitize from "sanitize-html";

const ALLOWED_TAGS = [
  "h1", "h2", "h3", "h4", "h5", "h6", "p", "br", "hr", "blockquote", "pre",
  "code", "ul", "ol", "li", "strong", "em", "b", "i", "u", "s", "sub", "sup",
  "a", "img", "figure", "figcaption", "table", "thead", "tbody", "tr", "th",
  "td", "div", "span",
];

export function sanitizeHtml(input: string) {
  if (!input) return "";

  return sanitize(input, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt", "title", "width", "height"],
      "*": ["class"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesByTag: { img: ["http", "https"] },
    allowProtocolRelative: false,
    transformTags: {
      a: sanitize.simpleTransform("a", { rel: "noopener noreferrer nofollow" }, false),
    },
  });
}
