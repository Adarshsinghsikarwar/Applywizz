import sanitizeHtml from "sanitize-html";

/**
 * The raw dataset embeds live HTML in `description`, including
 * `<script>alert('x')</script>` payloads. We never trust this on the way in.
 *
 * We keep two versions:
 *  - descriptionHtml: a *sanitized* HTML version (safe tags only) for rich rendering
 *  - descriptionText: a fully plain-text version for search indexing / previews
 */

function sanitizeDescriptionHtml(rawHtml = "") {
  if (!rawHtml) return "";
  return sanitizeHtml(rawHtml, {
    allowedTags: [
      "p",
      "br",
      "ul",
      "ol",
      "li",
      "strong",
      "em",
      "b",
      "i",
      "h1",
      "h2",
      "h3",
      "h4",
      "blockquote",
      "a",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", {
        rel: "noopener noreferrer",
        target: "_blank",
      }),
    },
  }).trim();
}

function stripToPlainText(rawHtml = "") {
  if (!rawHtml) return "";
  return sanitizeHtml(rawHtml, { allowedTags: [], allowedAttributes: {} })
    .replace(/\s+/g, " ")
    .trim();
}

export { sanitizeDescriptionHtml, stripToPlainText };
