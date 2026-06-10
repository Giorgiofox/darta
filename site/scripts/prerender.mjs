// Generates static, indexable HTML pages for every tactic and technique under
// dist/tactics/<id>/ and dist/techniques/<id>/, plus a complete sitemap.xml.
// Runs after `vite build` (see package.json). The SPA stays the interactive
// entry point; these pages exist so crawlers can index per-technique content
// that hash routes (#/techniques/...) cannot expose.

import { writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { TACTICS, COUNTERMEASURES, ACTOR_LABELS } from "../src/data.js";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = resolve(ROOT, "dist");
const ORIGIN = "https://darta-framework.org";
const LASTMOD = new Date().toISOString().slice(0, 10);
const AUTHOR_URL = "https://giorgiocampiotti.com";

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const CSS = `
  :root { --bg:#080C14; --bg2:#0D1220; --border:rgba(255,255,255,0.09); --text:#E8EDF5; --text2:#8B9BB4; --text3:#556070; --accent:#4A9EFF; --green:#10B981; }
  * { box-sizing:border-box; margin:0; padding:0; }
  body { background:var(--bg); color:var(--text); font:15px/1.7 system-ui,-apple-system,'Segoe UI',sans-serif; }
  main { max-width:860px; margin:0 auto; padding:2.5rem 1.5rem 4rem; }
  a { color:var(--accent); }
  header { border-bottom:1px solid var(--border); padding:1rem 1.5rem; }
  header a { font-family:ui-monospace,monospace; font-weight:700; letter-spacing:0.08em; text-decoration:none; font-size:18px; }
  nav.crumbs { font-size:13px; color:var(--text3); margin:1.5rem 0; }
  nav.crumbs a { color:var(--text2); text-decoration:none; }
  .kicker { font-family:ui-monospace,monospace; font-size:13px; color:var(--accent); margin-bottom:0.4rem; }
  h1 { font-size:2rem; line-height:1.2; margin-bottom:1rem; }
  h2 { font-size:1.1rem; margin:2.2rem 0 0.8rem; }
  .meta { display:flex; gap:0.5rem; flex-wrap:wrap; margin:1rem 0 1.5rem; }
  .tag { font-family:ui-monospace,monospace; font-size:11px; border:1px solid rgba(74,158,255,0.25); background:rgba(74,158,255,0.08); color:var(--accent); padding:0.2rem 0.6rem; border-radius:4px; }
  .desc { color:var(--text2); max-width:680px; }
  ul { padding-left:1.2rem; color:var(--text2); }
  li { margin:0.35rem 0; }
  .cm { background:var(--bg2); border:1px solid var(--border); border-radius:8px; padding:0.9rem 1.1rem; margin:0.6rem 0; }
  .cm .id { font-family:ui-monospace,monospace; font-size:12px; color:var(--green); }
  .cm .refs { font-size:12px; color:var(--text3); margin-top:0.3rem; }
  .cta { display:inline-block; margin:2rem 0 0; background:var(--accent); color:#000; font-weight:700; padding:0.7rem 1.5rem; border-radius:8px; text-decoration:none; }
  footer { border-top:1px solid var(--border); margin-top:3rem; padding-top:1.2rem; font-size:13px; color:var(--text3); }
  .grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); gap:0.8rem; list-style:none; padding:0; }
  .grid a { display:block; background:var(--bg2); border:1px solid var(--border); border-radius:8px; padding:0.9rem 1rem; text-decoration:none; color:var(--text); }
  .grid .tid { font-family:ui-monospace,monospace; font-size:11px; color:var(--text3); display:block; }
`;

function page({ path, title, description, breadcrumbs, jsonLd, body }) {
  const url = `${ORIGIN}${path}`;
  const crumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map(([name, href], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: `${ORIGIN}${href}`,
    })),
  };
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'unsafe-inline'; img-src 'self' data:; script-src 'none'; object-src 'none'; base-uri 'self'" />
<meta name="referrer" content="strict-origin-when-cross-origin" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}" />
<meta name="author" content="Giorgio Campiotti" />
<meta name="robots" content="index, follow" />
<meta name="theme-color" content="#080C14" />
<link rel="canonical" href="${url}" />
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<meta property="og:type" content="article" />
<meta property="og:url" content="${url}" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(description)}" />
<meta property="og:site_name" content="DARTA Framework" />
<meta property="og:image" content="${ORIGIN}/og-image.png" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content="${ORIGIN}/og-image.png" />
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
<script type="application/ld+json">${JSON.stringify(crumbsLd)}</script>
<style>${CSS}</style>
</head>
<body>
<header><a href="/">DARTA</a></header>
<main>
<nav class="crumbs">${breadcrumbs
    .map(([name, href], i) => (i === breadcrumbs.length - 1 ? esc(name) : `<a href="${href}">${esc(name)}</a>`))
    .join(" / ")}</nav>
${body}
<footer>
DARTA — Drone Attack Research and Tactic Analysis by <a href="${AUTHOR_URL}" rel="author">Giorgio Campiotti</a>
— <a href="https://creativecommons.org/licenses/by/4.0/" rel="license">CC-BY-4.0</a>
— <a href="/darta.json">darta.json</a>
</footer>
</main>
</body>
</html>
`;
}

function write(path, html) {
  const dir = resolve(DIST, `.${path}`);
  mkdirSync(dir, { recursive: true });
  writeFileSync(resolve(dir, "index.html"), html);
}

const urls = [
  { loc: `${ORIGIN}/`, priority: "1.0" },
  { loc: `${ORIGIN}/darta.json`, priority: "0.8" },
];

for (const tactic of TACTICS) {
  const tPath = `/tactics/${tactic.id}/`;
  urls.push({ loc: `${ORIGIN}${tPath}`, priority: "0.7" });

  const body = `
<div class="kicker">${esc(tactic.id)} — Tactic</div>
<h1>${esc(tactic.name)}</h1>
<p class="desc">${esc(tactic.desc)}</p>
<h2>Techniques (${tactic.techniques.length})</h2>
<ul class="grid">
${tactic.techniques
    .map(
      (te) =>
        `<li><a href="/techniques/${te.id}/"><span class="tid">${esc(te.id)}</span>${esc(te.name)}</a></li>`
    )
    .join("\n")}
</ul>
<a class="cta" href="/#/tactics/${tactic.id}">Open in the interactive matrix</a>`;

  write(
    tPath,
    page({
      path: tPath,
      title: `${tactic.id} ${tactic.name} — DARTA Framework`,
      description: tactic.desc,
      breadcrumbs: [
        ["DARTA", "/"],
        [`${tactic.id} ${tactic.name}`, tPath],
      ],
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: `${tactic.id} ${tactic.name} — DARTA tactic`,
        description: tactic.desc,
        url: `${ORIGIN}${tPath}`,
        dateModified: LASTMOD,
        author: { "@type": "Person", name: "Giorgio Campiotti", url: AUTHOR_URL },
        license: "https://creativecommons.org/licenses/by/4.0/",
        isPartOf: { "@id": `${ORIGIN}/#website` },
      },
      body,
    })
  );

  for (const tech of tactic.techniques) {
    const path = `/techniques/${tech.id}/`;
    urls.push({ loc: `${ORIGIN}${path}`, priority: "0.6" });
    const cms = COUNTERMEASURES.filter((c) => c.tacticIds.includes(tactic.id));

    const body = `
<div class="kicker">${esc(tactic.id)} ${esc(tactic.name)} · ${esc(tech.id)} — Technique</div>
<h1>${esc(tech.name)}</h1>
<div class="meta">
<span class="tag">Min. actor: ${esc(ACTOR_LABELS[tech.actorMin])}</span>
${tech.platform.map((p) => `<span class="tag">${esc(p)}</span>`).join("\n")}
</div>
<p class="desc">${esc(tech.desc)}</p>
<h2>Sub-techniques (${tech.subs.length})</h2>
<ul>
${tech.subs.map((s) => `<li>${esc(s)}</li>`).join("\n")}
</ul>
<h2>Applicable countermeasures</h2>
${cms
      .map(
        (cm) => `<div class="cm">
<span class="id">${esc(cm.id)}</span> <strong>${esc(cm.name)}</strong>
<div class="desc">${esc(cm.desc)}</div>
<div class="refs">${cm.refs.map(esc).join(" · ")}</div>
</div>`
      )
      .join("\n")}
<a class="cta" href="/#/techniques/${tech.id}">Open in the interactive matrix</a>`;

    write(
      path,
      page({
        path,
        title: `${tech.id} ${tech.name} — DARTA Framework`,
        description: tech.desc,
        breadcrumbs: [
          ["DARTA", "/"],
          [`${tactic.id} ${tactic.name}`, tPath],
          [`${tech.id} ${tech.name}`, path],
        ],
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "TechArticle",
          headline: `${tech.id} ${tech.name} — DARTA technique`,
          description: tech.desc,
          url: `${ORIGIN}${path}`,
          dateModified: LASTMOD,
          author: { "@type": "Person", name: "Giorgio Campiotti", url: AUTHOR_URL },
          license: "https://creativecommons.org/licenses/by/4.0/",
          isPartOf: { "@id": `${ORIGIN}/#website` },
        },
        body,
      })
    );
  }
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${LASTMOD}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;
writeFileSync(resolve(DIST, "sitemap.xml"), sitemap);

console.log(`prerendered ${urls.length - 2} pages + sitemap (${urls.length} URLs)`);
