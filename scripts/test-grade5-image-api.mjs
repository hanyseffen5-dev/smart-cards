/** Test how many grade 5 images the live API can serve. */
const base = "http://127.0.0.1:3000";
const lesson = await fetch(`${base}/api/lessons/8`).then((r) => r.json());
const withImg = lesson.words.filter((w) => w.id >= 3246 && w.id <= 4355);
// images-ready set
const ready = await fetch(`${base}/api/words/images-ready`).then((r) => r.json());
const readySet = new Set(ready.readyIds);

let ok = 0;
let fail = 0;
const sample = [];
for (const w of lesson.words) {
  if (!readySet.has(w.id)) continue;
  const r = await fetch(`${base}/api/words/${w.id}/image`, { method: "HEAD" });
  if (r.ok) ok++;
  else {
    fail++;
    if (sample.length < 5) sample.push({ id: w.id, word: w.word, status: r.status });
  }
}
console.log({ grade5ReadyInApi: [...readySet].filter((id) => id >= 3246 && id <= 4355).length, headOk: ok, headFail: fail, failSample: sample });
