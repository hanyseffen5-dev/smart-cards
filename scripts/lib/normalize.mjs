/** Shared normalization for vocabulary word/example comparison. */
export function normWord(w) {
  return (w || "").toLowerCase().trim();
}

export function normExample(e) {
  return (e || "")
    .toLowerCase()
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}
