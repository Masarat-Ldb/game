# ZAT · Vault of Potential (prototype)

A clickable prototype of the ZAT assessment as a sealed letter with five seals:
Heart, Brain, Spirit, Strengths & gaps, and Next steps.

Each stage is three quick questions. Finishing a stage earns a 3-digit key
(derived from the answers). Rolling the lock to that key cracks the seal and
adds a line to the letter. When all five seals are open, the letter unfolds into
the results: a personal letter, a five-point "shape of your potential" map, and
next steps.

## Run

```bash
npm install
npm run dev
```

`SINGLEFILE=1 npm run build` produces one self-contained `dist/index.html`.

## Where things live

- `src/data.ts`: stages, questions (placeholders, replace with ZAT's real items), key + letter + scoring logic
- `src/index.css`: ZAT brand tokens (from zat.pro)
- `src/Vault.tsx`: the envelope, seals and rising letter
- `src/StageRunner.tsx`: question formats (pick, single, this-or-that, 1–5 scale)
- `src/Lock.tsx`: combination lock that breaks a seal
- `src/Results.tsx`: the opened letter and results

Progress is saved in the browser (localStorage), so a refresh keeps your place.
