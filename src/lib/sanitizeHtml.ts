const BLOCKED_TAGS = [
  "script",
  "style",
  "iframe",
  "object",
  "embed",
  "link",
  "meta",
  "base",
  "form",
  "input",
  "button",
  "textarea",
  "select",
  "option",
];

export function sanitizeHtml(input: string) {
  if (!input) return "";

  let output = input;

  for (const tag of BLOCKED_TAGS) {
    const fullTag = new RegExp(
      `<\\s*${tag}\\b[^>]*>[\\s\\S]*?<\\s*\\/\\s*${tag}\\s*>`,
      "gi",
    );
    const selfClosingTag = new RegExp(`<\\s*${tag}\\b[^>]*\\/?>`, "gi");
    output = output.replace(fullTag, "");
    output = output.replace(selfClosingTag, "");
  }

  output = output.replace(/\son\w+\s*=\s*(".*?"|'.*?'|[^\s>]+)/gi, "");

  output = output.replace(
    /\s(href|src|xlink:href)\s*=\s*(['"])\s*(javascript:|data:|vbscript:)[\s\S]*?\2/gi,
    ' $1="#"',
  );

  output = output.replace(
    /\s(href|src|xlink:href)\s*=\s*(javascript:|data:|vbscript:)[^\s>]+/gi,
    ' $1="#"',
  );

  return output;
}
