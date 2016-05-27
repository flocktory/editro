export function createDocumentFragment(html) {
  return document.createRange().createContextualFragment(html);
}
