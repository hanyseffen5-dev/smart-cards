/** Normalize grade 5 word / asset base name for fuzzy matching. */
export function grade5WordKey(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/^grade5_/i, "")
    .replace(/\.png$/i, "")
    .replace(/[-_\s]+/g, "");
}

export function grade5AssetCandidates(word) {
  const w = String(word).trim();
  const bases = new Set([
    w.replace(/\s+/g, "_"),
    w.replace(/[-\s]+/g, "_"),
    w.replace(/\s+/g, "-"),
  ]);
  return [...bases].map((b) => `grade5_${b}.png`);
}
