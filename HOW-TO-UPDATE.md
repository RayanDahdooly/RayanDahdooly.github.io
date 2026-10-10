# How to update the site

Live at **https://rayandahdooly.github.io**. Every push to `main` republishes it in about a minute.

## Add a link (CV, App Store, Agents Farm, IEEEXtreme)

Open `main.js`. At the top is the `LINKS` list:

```js
const LINKS = {
  meno: "[APP_STORE_LINK]",
  agentsFarm: "[GITHUB_REPO_LINK]",
  xtreme2025: "[RESULT_OR_CERTIFICATE_LINK]",
  xtreme2024: "[RESULT_OR_CERTIFICATE_LINK]",
  cv: "[PLACEHOLDER]",
  ...
};
```

Replace a `[...]` placeholder with the real URL. Anything still in `[brackets]` stays plain text; a real URL makes it clickable.

**CV as a PDF in this repo:** put the file in `assets/` (e.g. `assets/Rayan-Dahdooly-CV.pdf`) and set `cv: "assets/Rayan-Dahdooly-CV.pdf"`.

## Change text

All the words on the page are in `index.html`, one `<section>` per notebook page (`#about`, `#projects`, `#skills`, `#cp`, `#leadership`, `#contact`).

## Publish your change

In Terminal, inside this folder:

```sh
cd ~/projects/RayanDahdooly.github.io
git add .
git commit -m "Add my CV link"
git push
```

- `git add .` picks up every file you changed
- `git commit -m "..."` saves a snapshot with a short note about what changed
- `git push` uploads it to GitHub, which rebuilds the site

## Check it before publishing (optional)

```sh
cd ~/projects/RayanDahdooly.github.io
python3 -m http.server 8765
```

Then open http://localhost:8765. Make the browser window narrow to see the phone layout, and wide to see the laptop notebook.

## Codeforces streak map

The heatmap shows real activity for Jun 2025 to May 2026, saved in `main.js` (`CF_DAYS`). It doesn't update by itself. Ask Claude to refresh it from the Codeforces API if you want a newer year.
