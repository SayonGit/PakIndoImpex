import DOMPurify from "isomorphic-dompurify";

/**
 * Article body content is currently authored only by developers via the
 * seed script, but is sanitized regardless as defense-in-depth for when a
 * future admin panel allows editing it directly.
 */
export function sanitizeArticleHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["p", "h2", "h3", "h4", "ul", "ol", "li", "strong", "em", "a", "br"],
    ALLOWED_ATTR: ["href"],
  });
}
