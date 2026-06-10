import { useState, useEffect, useRef } from "react";
import { TACTICS, COUNTERMEASURES, PLATFORMS_LIST, ACTOR_LABELS, ACTOR_COLORS } from "./data.js";

// ─── STYLES ──────────────────────────────────────────────────────────────────

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@400;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #080C14;
    --bg2: #0D1220;
    --bg3: #111827;
    --bg4: #1A2236;
    --border: rgba(255,255,255,0.07);
    --border2: rgba(255,255,255,0.12);
    --text: #E8EDF5;
    --text2: #8B9BB4;
    --text3: #556070;
    --accent: #4A9EFF;
    --accent2: #2D6FCC;
    --red: #EF4444;
    --green: #10B981;
    --amber: #F59E0B;
    --mono: 'Space Mono', monospace;
    --sans: 'Syne', sans-serif;
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--sans);
    font-size: 15px;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  /* SCROLLBAR */
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: var(--bg2); }
  ::-webkit-scrollbar-thumb { background: var(--accent2); border-radius: 3px; }

  /* NAV */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; gap: 2rem;
    padding: 0 2rem; height: 56px;
    background: rgba(8,12,20,0.92);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
  }
  .nav-logo {
    font-family: var(--mono); font-size: 18px; font-weight: 700;
    color: var(--accent); letter-spacing: 0.08em; cursor: pointer;
    flex-shrink: 0;
  }
  .nav-links { display: flex; gap: 0.25rem; flex: 1; }
  .nav-btn {
    background: none; border: none; cursor: pointer;
    font-family: var(--sans); font-size: 13px; font-weight: 600;
    color: var(--text2); padding: 0.4rem 0.9rem; border-radius: 6px;
    transition: all 0.15s; letter-spacing: 0.04em; text-transform: uppercase;
  }
  .nav-btn:hover { color: var(--text); background: var(--bg4); }
  .nav-btn.active { color: var(--accent); background: rgba(74,158,255,0.1); }

  /* HERO */
  .hero {
    min-height: 100vh; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 6rem 2rem 4rem;
    position: relative; overflow: hidden;
    background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(74,158,255,0.07) 0%, transparent 70%),
                radial-gradient(ellipse 40% 40% at 80% 80%, rgba(139,92,246,0.05) 0%, transparent 60%);
  }
  .hero-grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(74,158,255,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(74,158,255,0.04) 1px, transparent 1px);
    background-size: 48px 48px;
    mask-image: radial-gradient(ellipse 90% 70% at 50% 40%, black 0%, transparent 80%);
  }
  .hero-content { position: relative; text-align: center; max-width: 860px; }
  .hero-badge {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: rgba(74,158,255,0.1); border: 1px solid rgba(74,158,255,0.2);
    padding: 0.35rem 1rem; border-radius: 100px; margin-bottom: 2rem;
    font-family: var(--mono); font-size: 11px; color: var(--accent);
    letter-spacing: 0.12em; text-transform: uppercase;
  }
  .hero-badge-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }
  .hero-title {
    font-size: clamp(4rem, 12vw, 9rem); font-weight: 800;
    line-height: 0.9; letter-spacing: -0.03em;
    background: linear-gradient(135deg, #fff 0%, var(--accent) 60%, #8B5CF6 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    margin-bottom: 0.5rem;
  }
  .hero-subtitle {
    font-family: var(--mono); font-size: clamp(1rem, 2.4vw, 1.6rem);
    color: var(--text2); letter-spacing: 0.18em; text-transform: uppercase;
    margin-bottom: 2rem; white-space: nowrap;
  }
  .hero-desc {
    font-size: 1.1rem; color: var(--text2); max-width: 620px;
    margin: 0 auto 3rem; line-height: 1.7;
  }
  .hero-stats {
    display: flex; gap: 3rem; justify-content: center; margin-bottom: 3rem;
    flex-wrap: wrap;
  }
  .hero-stat { text-align: center; }
  .hero-stat-num { font-family: var(--mono); font-size: 2.5rem; font-weight: 700; color: var(--accent); line-height: 1; }
  .hero-stat-label { font-size: 12px; color: var(--text3); text-transform: uppercase; letter-spacing: 0.1em; margin-top: 0.3rem; }
  .hero-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
  .btn-primary {
    background: var(--accent); color: #000; border: none; cursor: pointer;
    padding: 0.75rem 2rem; border-radius: 8px; font-family: var(--sans);
    font-size: 14px; font-weight: 700; letter-spacing: 0.05em;
    transition: all 0.2s; text-transform: uppercase;
  }
  .btn-primary:hover { background: #6AB5FF; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(74,158,255,0.3); }
  .btn-secondary {
    background: var(--bg4); color: var(--text); border: 1px solid var(--border2);
    cursor: pointer; padding: 0.75rem 2rem; border-radius: 8px;
    font-family: var(--sans); font-size: 14px; font-weight: 600;
    letter-spacing: 0.05em; transition: all 0.2s; text-transform: uppercase;
  }
  .btn-secondary:hover { border-color: var(--accent); color: var(--accent); transform: translateY(-1px); }

  /* SECTION */
  .section { padding: 5rem 2rem; max-width: 1400px; margin: 0 auto; }
  .section-header { margin-bottom: 3rem; }
  .section-label {
    font-family: var(--mono); font-size: 11px; color: var(--accent);
    letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 0.75rem;
  }
  .section-title {
    font-size: clamp(1.8rem, 4vw, 2.8rem); font-weight: 800;
    color: var(--text); line-height: 1.1; letter-spacing: -0.02em;
  }
  .section-desc { color: var(--text2); margin-top: 1rem; max-width: 600px; line-height: 1.7; }

  /* MATRIX */
  .matrix-controls {
    display: flex; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap; align-items: center;
  }
  .filter-group { display: flex; gap: 0.4rem; flex-wrap: wrap; }
  .filter-btn {
    background: var(--bg3); border: 1px solid var(--border); border-radius: 6px;
    padding: 0.35rem 0.8rem; font-family: var(--mono); font-size: 11px;
    color: var(--text2); cursor: pointer; transition: all 0.15s; white-space: nowrap;
  }
  .filter-btn:hover { border-color: var(--border2); color: var(--text); }
  .filter-btn.active { background: rgba(74,158,255,0.12); border-color: rgba(74,158,255,0.4); color: var(--accent); }
  .filter-divider { width: 1px; background: var(--border); margin: 0 0.5rem; }

  .matrix-grid {
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    gap: 6px;
    min-width: 0;
  }
  .matrix-tactic-header {
    padding: 0.7rem 0.5rem; border-radius: 6px 6px 0 0;
    text-align: center; cursor: pointer; transition: all 0.2s;
    border: 1px solid var(--border);
  }
  .matrix-tactic-header:hover { filter: brightness(1.2); }
  .matrix-tactic-id { font-family: var(--mono); font-size: 9px; opacity: 0.7; margin-bottom: 3px; }
  .matrix-tactic-name { font-size: 11px; font-weight: 700; line-height: 1.2; }
  .matrix-tactic-count { font-family: var(--mono); font-size: 10px; opacity: 0.6; margin-top: 3px; }

  .matrix-tech {
    border: 1px solid var(--border); border-radius: 4px;
    padding: 0.5rem; cursor: pointer; transition: all 0.15s;
    background: var(--bg2); position: relative; overflow: hidden;
  }
  .matrix-tech:hover { border-color: var(--border2); background: var(--bg3); transform: translateY(-1px); }
  .matrix-tech.selected { border-color: var(--accent); background: rgba(74,158,255,0.08); }
  .matrix-tech.dimmed { opacity: 0.25; }
  .matrix-tech-id { font-family: var(--mono); font-size: 9px; color: var(--text3); margin-bottom: 3px; }
  .matrix-tech-name { font-size: 11px; font-weight: 600; color: var(--text); line-height: 1.3; }
  .matrix-tech-actor {
    position: absolute; top: 4px; right: 4px;
    width: 6px; height: 6px; border-radius: 50%;
  }

  /* DETAIL PANEL */
  .detail-panel {
    margin-top: 1.5rem; background: var(--bg2); border: 1px solid var(--border2);
    border-radius: 12px; overflow: hidden;
    animation: slideDown 0.2s ease;
  }
  @keyframes slideDown { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
  .detail-header {
    padding: 1.5rem 2rem; border-bottom: 1px solid var(--border);
    display: flex; gap: 1.5rem; align-items: flex-start; flex-wrap: wrap;
  }
  .detail-id { font-family: var(--mono); font-size: 13px; color: var(--accent); margin-bottom: 0.5rem; }
  .detail-name { font-size: 1.4rem; font-weight: 800; color: var(--text); }
  .detail-body { padding: 1.5rem 2rem; display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
  @media(max-width:700px){ .detail-body{grid-template-columns:1fr;} }
  .detail-section-title { font-family: var(--mono); font-size: 10px; color: var(--accent); text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 0.75rem; }
  .detail-desc { color: var(--text2); font-size: 14px; line-height: 1.7; }
  .detail-sub {
    display: flex; align-items: flex-start; gap: 0.6rem;
    padding: 0.5rem 0; border-bottom: 1px solid var(--border); font-size: 13px; color: var(--text2);
  }
  .detail-sub:last-child { border-bottom: none; }
  .detail-sub-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--accent); flex-shrink: 0; margin-top: 7px; }
  .platform-tag {
    display: inline-block; padding: 0.2rem 0.6rem; border-radius: 4px;
    font-family: var(--mono); font-size: 10px; background: rgba(74,158,255,0.1);
    border: 1px solid rgba(74,158,255,0.2); color: var(--accent); margin: 0.15rem;
  }
  .actor-badge {
    display: inline-flex; align-items: center; gap: 0.4rem;
    padding: 0.3rem 0.8rem; border-radius: 100px;
    font-family: var(--mono); font-size: 11px; font-weight: 700;
  }

  /* COUNTERMEASURES */
  .cm-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 1rem; }
  .cm-card {
    background: var(--bg2); border: 1px solid var(--border);
    border-radius: 10px; padding: 1.5rem; transition: all 0.2s; cursor: pointer;
  }
  .cm-card:hover { border-color: var(--border2); background: var(--bg3); transform: translateY(-2px); }
  .cm-card-header { display: flex; align-items: flex-start; gap: 1rem; margin-bottom: 1rem; }
  .cm-id { font-family: var(--mono); font-size: 12px; color: var(--green); background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.2); padding: 0.3rem 0.6rem; border-radius: 4px; flex-shrink: 0; }
  .cm-name { font-size: 15px; font-weight: 700; color: var(--text); line-height: 1.3; }
  .cm-desc { font-size: 13px; color: var(--text2); line-height: 1.6; margin-bottom: 1rem; }
  .cm-refs { display: flex; flex-wrap: wrap; gap: 0.4rem; }
  .cm-ref { font-family: var(--mono); font-size: 10px; color: var(--text3); background: var(--bg4); border: 1px solid var(--border); padding: 0.2rem 0.5rem; border-radius: 3px; }

  /* ABOUT */
  .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: start; }
  @media(max-width:800px){ .about-grid{grid-template-columns:1fr;} }
  .about-card {
    background: var(--bg2); border: 1px solid var(--border); border-radius: 12px; padding: 2rem;
  }
  .about-card-icon { font-size: 2rem; margin-bottom: 1rem; }
  .about-card-title { font-size: 1.1rem; font-weight: 700; margin-bottom: 0.75rem; }
  .about-card-text { color: var(--text2); font-size: 14px; line-height: 1.7; }

  /* INTEGRATE */
  .integrate-hero {
    background: var(--bg2); border: 1px solid var(--border); border-radius: 16px;
    padding: 2.5rem; margin-bottom: 3rem;
    display: flex; align-items: center; justify-content: space-between; gap: 2rem; flex-wrap: wrap;
  }
  .integrate-hero-text { flex: 1; min-width: 260px; }
  .integrate-hero-title { font-size: clamp(1.4rem,3vw,2rem); font-weight: 800; margin-bottom: 0.75rem; }
  .integrate-hero-desc { color: var(--text2); font-size: 14px; line-height: 1.7; max-width: 540px; }
  .integrate-hero-actions { display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 1.5rem; }
  .integrate-url {
    font-family: var(--mono); font-size: 12px; color: var(--text2);
    background: var(--bg3); border: 1px solid var(--border); border-radius: 6px;
    padding: 0.5rem 1rem; display: flex; align-items: center; gap: 0.6rem; margin-top: 1rem;
    word-break: break-all;
  }
  .integrate-url span { color: var(--accent); flex-shrink: 0; }

  .use-case-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px,1fr)); gap: 1rem; margin-bottom: 3rem; }
  .use-case-card {
    background: var(--bg2); border: 1px solid var(--border); border-radius: 12px; padding: 1.75rem;
    transition: all 0.2s;
  }
  .use-case-card:hover { border-color: var(--border2); transform: translateY(-2px); }
  .use-case-icon { font-size: 1.6rem; margin-bottom: 1rem; }
  .use-case-title { font-size: 15px; font-weight: 700; margin-bottom: 0.5rem; }
  .use-case-desc { font-size: 13px; color: var(--text2); line-height: 1.6; margin-bottom: 1rem; }
  .use-case-tags { display: flex; flex-wrap: wrap; gap: 0.35rem; }
  .use-case-tag { font-family: var(--mono); font-size: 10px; color: var(--text3); background: var(--bg4); border: 1px solid var(--border); padding: 0.2rem 0.5rem; border-radius: 3px; }

  .snippet-tabs { display: flex; gap: 0.4rem; margin-bottom: 0; border-bottom: 1px solid var(--border); }
  .snippet-tab {
    background: none; border: none; border-bottom: 2px solid transparent;
    cursor: pointer; font-family: var(--mono); font-size: 12px; color: var(--text2);
    padding: 0.5rem 1rem; transition: all 0.15s; margin-bottom: -1px;
  }
  .snippet-tab:hover { color: var(--text); }
  .snippet-tab.active { color: var(--accent); border-bottom-color: var(--accent); }
  .snippet-block {
    background: var(--bg); border: 1px solid var(--border); border-top: none;
    border-radius: 0 0 8px 8px; padding: 1.5rem; overflow-x: auto;
    font-family: var(--mono); font-size: 12px; color: var(--text2); line-height: 1.8;
    white-space: pre;
  }
  .snippet-kw { color: #C084FC; }
  .snippet-str { color: #86EFAC; }
  .snippet-cmt { color: var(--text3); font-style: italic; }
  .snippet-fn { color: #7DD3FC; }

  .schema-table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .schema-table th { text-align: left; font-family: var(--mono); font-size: 10px; color: var(--accent); text-transform: uppercase; letter-spacing: 0.12em; padding: 0.75rem 1rem; border-bottom: 1px solid var(--border2); }
  .schema-table td { padding: 0.65rem 1rem; border-bottom: 1px solid var(--border); vertical-align: top; }
  .schema-table tr:last-child td { border-bottom: none; }
  .schema-table td:first-child { font-family: var(--mono); font-size: 12px; color: var(--accent); white-space: nowrap; }
  .schema-table td:nth-child(2) { color: var(--text3); font-family: var(--mono); font-size: 11px; }
  .schema-table td:last-child { color: var(--text2); }

  /* FOOTER */
  .footer {
    border-top: 1px solid var(--border); padding: 2rem;
    display: flex; align-items: center; justify-content: space-between; flex-wrap: gap;
    background: var(--bg2); gap: 1rem;
  }
  .footer-logo { font-family: var(--mono); font-size: 16px; font-weight: 700; color: var(--accent); }
  .footer-text { font-size: 12px; color: var(--text3); }
  .footer-badge {
    font-family: var(--mono); font-size: 10px; color: var(--text3);
    background: var(--bg3); border: 1px solid var(--border); padding: 0.3rem 0.7rem; border-radius: 4px;
  }

  /* TACTIC DETAIL PAGE */
  .tactic-page { padding: 5rem 2rem 4rem; max-width: 1200px; margin: 0 auto; }
  .back-btn {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: none; border: none; cursor: pointer;
    font-family: var(--mono); font-size: 12px; color: var(--text2);
    margin-bottom: 2rem; transition: color 0.15s; letter-spacing: 0.05em;
  }
  .back-btn:hover { color: var(--accent); }
  .tactic-hero {
    padding: 2.5rem; border-radius: 16px; margin-bottom: 2.5rem;
    border: 1px solid var(--border);
  }
  .tech-card {
    background: var(--bg2); border: 1px solid var(--border); border-radius: 10px;
    padding: 1.5rem; margin-bottom: 1rem; cursor: pointer; transition: all 0.2s;
  }
  .tech-card:hover { border-color: var(--border2); background: var(--bg3); }
  .tech-card-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; margin-bottom: 0.75rem; }
  .tech-card-id { font-family: var(--mono); font-size: 12px; color: var(--accent); }
  .tech-card-name { font-size: 16px; font-weight: 700; color: var(--text); }
  .tech-card-desc { font-size: 14px; color: var(--text2); line-height: 1.6; margin-bottom: 1rem; }
  .tech-subs { display: flex; flex-direction: column; gap: 0.4rem; }
  .tech-sub { font-size: 13px; color: var(--text2); padding-left: 1rem; border-left: 2px solid var(--border); }

  /* OVERVIEW CARDS */
  .overview-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
  .overview-card {
    background: var(--bg2); border: 1px solid var(--border); border-radius: 10px;
    padding: 1.5rem; cursor: pointer; transition: all 0.2s; position: relative; overflow: hidden;
  }
  .overview-card::before {
    content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
    border-radius: 3px 0 0 3px;
  }
  .overview-card:hover { border-color: var(--border2); transform: translateY(-2px); }
  .overview-card-id { font-family: var(--mono); font-size: 11px; color: var(--text3); margin-bottom: 0.5rem; }
  .overview-card-name { font-size: 15px; font-weight: 700; color: var(--text); margin-bottom: 0.5rem; }
  .overview-card-desc { font-size: 13px; color: var(--text2); line-height: 1.5; }
  .overview-card-count { font-family: var(--mono); font-size: 11px; margin-top: 1rem; opacity: 0.6; }

  /* TECHNIQUE DETAIL */
  .technique-page { padding: 5rem 2rem 4rem; max-width: 1000px; margin: 0 auto; }

  /* RESPONSIVE */
  @media(max-width:1100px){
    .matrix-grid { grid-template-columns: repeat(3,1fr); }
  }
  @media(max-width:800px){
    .nav { gap: 0.5rem; padding: 0 0.75rem; }
    .nav-links { overflow-x: auto; scrollbar-width: none; }
    .nav-links::-webkit-scrollbar { display: none; }
    .nav-btn { font-size: 11px; padding: 0.3rem 0.55rem; white-space: nowrap; }
    .hero { padding: 5rem 1.25rem 3rem; }
    .hero-subtitle { white-space: normal; letter-spacing: 0.06em; }
    .section { padding: 3rem 1.25rem; }
    .tactic-page { padding: 4rem 1.25rem 3rem; }
    .technique-page { padding: 4rem 1.25rem 3rem; }
    .cm-grid { grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); }
    .footer { flex-direction: column; align-items: flex-start; }
    .detail-body { grid-template-columns: 1fr; }
  }
  @media(max-width:700px){
    .matrix-grid { grid-template-columns: repeat(2,1fr); }
    .hero-stats { gap: 1.5rem; }
    .cm-grid { grid-template-columns: 1fr; }
  }
  @media(max-width:500px){
    .matrix-grid { grid-template-columns: 1fr; }
    .nav .btn-secondary { display: none; }
    .hero { padding: 4.5rem 1rem 2.5rem; }
    .hero-subtitle { font-size: 0.85rem; letter-spacing: 0.04em; }
    .hero-stat-num { font-size: 2rem; }
    .hero-stats { gap: 1rem; }
    .overview-grid { grid-template-columns: 1fr; }
    .section { padding: 2.5rem 1rem; }
    .tactic-page { padding: 3.5rem 1rem 2.5rem; }
    .technique-page { padding: 3.5rem 1rem 2.5rem; }
  }
`;

// ─── APP ──────────────────────────────────────────────────────────────────────

const VIEW_TITLES = {
  home: "DARTA — Drone Attack Research and Tactic Analysis",
  matrix: "Matrix — DARTA Framework",
  tactics: "Tactics — DARTA Framework",
  countermeasures: "Countermeasures — DARTA Framework",
  integrate: "Integrate — DARTA Framework",
  about: "About — DARTA Framework",
};

export default function App() {
  const [view, setView] = useState("home");
  const [activeTactic, setActiveTactic] = useState(null);
  const [activeTechnique, setActiveTechnique] = useState(null);
  const [selectedTech, setSelectedTech] = useState(null);
  const [filterPlatform, setFilterPlatform] = useState("All");
  const [filterActor, setFilterActor] = useState(0);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Hash routing: every view, tactic, and technique gets a shareable deep link
  useEffect(() => {
    const applyHash = () => {
      const h = window.location.hash.replace(/^#\/?/, "");
      const [seg, id] = h.split("/");
      if (seg === "tactics" && id) {
        const t = TACTICS.find(tt => tt.id === id);
        if (t) {
          setActiveTactic(t); setActiveTechnique(null); setView("tactic");
          document.title = `${t.id} ${t.name} — DARTA Framework`;
          window.scrollTo(0, 0);
          return;
        }
      }
      if (seg === "techniques" && id) {
        for (const tac of TACTICS) {
          const te = tac.techniques.find(tt => tt.id === id);
          if (te) {
            setActiveTactic(tac);
            setActiveTechnique({ ...te, tacticId: tac.id, tacticName: tac.name, tacticColor: tac.color });
            setView("technique");
            document.title = `${te.id} ${te.name} — DARTA Framework`;
            window.scrollTo(0, 0);
            return;
          }
        }
      }
      const v = ["matrix", "tactics", "countermeasures", "integrate", "about"].includes(seg) ? seg : "home";
      setActiveTactic(null); setActiveTechnique(null); setView(v);
      document.title = VIEW_TITLES[v];
      window.scrollTo(0, 0);
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  const navigate = (path) => {
    const target = path ? `#/${path}` : "";
    if (window.location.hash === target || (!target && !window.location.hash)) return;
    window.location.hash = path ? `/${path}` : "/";
  };

  const totalTechs = TACTICS.reduce((s, t) => s + t.techniques.length, 0);
  const totalSubs = TACTICS.reduce((s, t) => s + t.techniques.reduce((ss, tt) => ss + tt.subs.length, 0), 0);

  const isTechVisible = (tech) => {
    if (filterPlatform !== "All" && !tech.platform.includes(filterPlatform) && !tech.platform.includes("All")) return false;
    if (filterActor > 0 && tech.actorMin > filterActor) return false;
    return true;
  };

  const navItems = [
    { id: "home", label: "Home" },
    { id: "matrix", label: "Matrix" },
    { id: "tactics", label: "Tactics" },
    { id: "countermeasures", label: "Countermeasures" },
    { id: "integrate", label: "Integrate" },
    { id: "about", label: "About" },
  ];

  const goToTactic = (tactic) => navigate(`tactics/${tactic.id}`);
  const goToTechnique = (tech) => navigate(`techniques/${tech.id}`);

  return (
    <div>
      {/* NAV */}
      <nav className="nav">
        <div className="nav-logo" onClick={() => navigate("")}>DARTA</div>
        <div className="nav-links">
          {navItems.map(n => (
            <button key={n.id} className={`nav-btn ${view === n.id || (view === "tactic" && n.id === "tactics") || (view === "technique" && n.id === "tactics") ? "active" : ""}`}
              onClick={() => navigate(n.id === "home" ? "" : n.id)}>
              {n.label}
            </button>
          ))}
        </div>
        <a className="btn-secondary" style={{fontSize:"12px", padding:"0.4rem 1rem", textDecoration:"none"}}
          href="https://raw.githubusercontent.com/Giorgiofox/darta/main/docs/DARTA_v0.1.pdf" download>
          ↓ Whitepaper PDF
        </a>
      </nav>

      {/* VIEWS */}
      {view === "home" && <HomeView goToMatrix={() => navigate("matrix")} goToTactics={() => navigate("tactics")} totalTechs={totalTechs} totalSubs={totalSubs} goToTactic={goToTactic} />}
      {view === "matrix" && <MatrixView selectedTech={selectedTech} setSelectedTech={setSelectedTech} filterPlatform={filterPlatform} setFilterPlatform={setFilterPlatform} filterActor={filterActor} setFilterActor={setFilterActor} isTechVisible={isTechVisible} goToTactic={goToTactic} goToTechnique={goToTechnique} />}
      {view === "tactics" && <TacticsView goToTactic={goToTactic} />}
      {view === "tactic" && activeTactic && <TacticDetailView tactic={activeTactic} goBack={() => navigate("tactics")} goToTechnique={goToTechnique} />}
      {view === "technique" && activeTechnique && <TechniqueDetailView tech={activeTechnique} goBack={() => navigate(`tactics/${activeTechnique.tacticId}`)} countermeasures={COUNTERMEASURES.filter(c => c.tacticIds.includes(activeTechnique.tacticId))} />}
      {view === "countermeasures" && <CountermeasuresView />}
      {view === "integrate" && <IntegrateView />}
      {view === "about" && <AboutView />}

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-logo">DARTA</div>
        <div className="footer-text">Drone Attack Research and Tactic Analysis by <a href="https://giorgiocampiotti.com" target="_blank" rel="me author noopener noreferrer" style={{color:"var(--text2)"}}>Giorgio Campiotti</a> — v1.1 — April 2026</div>
        <div className="footer-badge">UNCLASSIFIED — FOR RESEARCH AND EDUCATIONAL PURPOSES</div>
      </footer>
    </div>
  );
}

// ─── HOME VIEW ────────────────────────────────────────────────────────────────
function HomeView({ goToMatrix, goToTactics, totalTechs, totalSubs, goToTactic }) {
  return (
    <>
      <section className="hero">
        <div className="hero-grid" />
        <div className="hero-content">
          <div className="hero-badge">
            <div className="hero-badge-dot" />
            v1.1 — Community Review Open
          </div>
          <h1 className="hero-title">DARTA</h1>
          <p className="hero-subtitle">Drone Attack Research &amp; Tactic Analysis</p>
          <p className="hero-desc">
            A structured TTP framework for Unmanned Aerial Systems cybersecurity.
            Covering civil consumer drones, enterprise UAS, military tactical systems,
            GCS &amp; UTM infrastructure, and autonomous swarms.
          </p>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-num">9</div>
              <div className="hero-stat-label">Tactics</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-num">{totalTechs}</div>
              <div className="hero-stat-label">Techniques</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-num">{totalSubs}</div>
              <div className="hero-stat-label">Sub-Techniques</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-num">13</div>
              <div className="hero-stat-label">Countermeasures</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-num">5</div>
              <div className="hero-stat-label">Platform Scopes</div>
            </div>
          </div>
          <div className="hero-actions">
            <button className="btn-primary" onClick={goToMatrix}>Explore the Matrix</button>
            <button className="btn-secondary" onClick={goToTactics}>Browse Tactics</button>
          </div>
        </div>
      </section>

      {/* Tactic overview strip */}
      <div style={{background:"var(--bg2)", borderTop:"1px solid var(--border)", borderBottom:"1px solid var(--border)", padding:"3rem 2rem"}}>
        <div style={{maxWidth:"1400px", margin:"0 auto"}}>
          <div style={{fontFamily:"var(--mono)", fontSize:"11px", color:"var(--accent)", letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:"1.5rem"}}>Nine Tactical Phases</div>
          <div className="overview-grid">
            {TACTICS.map(t => (
              <div key={t.id} className="overview-card" onClick={() => goToTactic(t)}
                style={{"--card-color": t.color}}>
                <div style={{position:"absolute",left:0,top:0,bottom:0,width:"3px",background:t.color,borderRadius:"3px 0 0 3px"}} />
                <div className="overview-card-id">{t.id}</div>
                <div className="overview-card-name">{t.name}</div>
                <div className="overview-card-desc">{t.desc}</div>
                <div className="overview-card-count">{t.techniques.length} techniques</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Positioning */}
      <div style={{padding:"5rem 2rem", maxWidth:"1000px", margin:"0 auto"}}>
        <div style={{fontFamily:"var(--mono)", fontSize:"11px", color:"var(--accent)", letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:"0.75rem"}}>Framework Positioning</div>
        <h2 style={{fontSize:"clamp(1.6rem,4vw,2.4rem)", fontWeight:"800", marginBottom:"1.5rem", letterSpacing:"-0.02em"}}>Built on the shoulders of SPARTA and ATT&amp;CK</h2>
        <p style={{color:"var(--text2)", lineHeight:"1.8", marginBottom:"2rem", fontSize:"15px"}}>
          DARTA is explicitly modeled on the structural approach of <strong style={{color:"var(--text)"}}>MITRE ATT&amp;CK</strong> and The Aerospace Corporation's <strong style={{color:"var(--text)"}}>SPARTA</strong> matrix for spacecraft. Where SPARTA covers the threat landscape for satellites and space systems, DARTA extends the same disciplined TTP taxonomy to the drone domain — a rapidly evolving attack surface with no equivalent public framework.
        </p>
        <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:"1rem"}}>
          {[
            {name:"MITRE ATT&CK", role:"Structural conventions, TTP taxonomy approach", url:"https://attack.mitre.org"},
            {name:"SPARTA", role:"Direct analog — spacecraft domain, methodology source", url:"https://sparta.aerospace.org"},
            {name:"DroneSec", role:"Real-world UAS incident intelligence baseline", url:"https://dronesec.com"},
            {name:"NIST SP 800-53", role:"Countermeasure control mapping", url:"https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final"},
            {name:"DO-326A / ED-202A", role:"Aviation cybersecurity process standards", url:"https://eurocae.net/news/posts/2019/march/eurocae-ed-202a-update/"},
            {name:"ASTM F38", role:"UAS-specific standards (Remote ID, forensics)", url:"https://www.astm.org/committee-f38.html"},
            {name:"OCSF 1.8.0", role:"Unmanned Systems event schema — drone_flights_activity & airborne_broadcast_activity (Category 8)", url:"https://schema.ocsf.io/1.8.0/categories/unmanned_systems"},
          ].map(r => (
            <a key={r.name} href={r.url} target="_blank" rel="noopener noreferrer"
              style={{background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:"8px", padding:"1rem", display:"block", textDecoration:"none", transition:"border-color 0.15s, transform 0.15s"}}
              onMouseEnter={e => { e.currentTarget.style.borderColor="var(--border2)"; e.currentTarget.style.transform="translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.transform="translateY(0)"; }}>
              <div style={{fontFamily:"var(--mono)", fontSize:"12px", color:"var(--accent)", marginBottom:"0.4rem"}}>{r.name} ↗</div>
              <div style={{fontSize:"12px", color:"var(--text2)", lineHeight:"1.5"}}>{r.role}</div>
            </a>
          ))}
        </div>
      </div>
    </>
  );
}

// ─── MATRIX VIEW ──────────────────────────────────────────────────────────────
function MatrixView({ selectedTech, setSelectedTech, filterPlatform, setFilterPlatform, filterActor, setFilterActor, isTechVisible, goToTactic, goToTechnique }) {
  const activeTacticForTech = selectedTech ? TACTICS.find(t => t.techniques.some(tt => tt.id === selectedTech.id)) : null;

  return (
    <div className="section" style={{paddingTop:"5rem"}}>
      <div className="section-header">
        <div className="section-label">Navigator</div>
        <h2 className="section-title">DARTA Matrix</h2>
        <p className="section-desc">Click any technique to inspect details. Filter by platform scope or adversary tier. Click a tactic header to view all techniques in that phase.</p>
      </div>

      <div className="matrix-controls">
        <div style={{fontFamily:"var(--mono)", fontSize:"11px", color:"var(--text3)", letterSpacing:"0.1em"}}>PLATFORM</div>
        <div className="filter-group">
          {PLATFORMS_LIST.map(p => (
            <button key={p} className={`filter-btn ${filterPlatform === p ? "active" : ""}`} onClick={() => setFilterPlatform(p)}>{p}</button>
          ))}
        </div>
        <div className="filter-divider" />
        <div style={{fontFamily:"var(--mono)", fontSize:"11px", color:"var(--text3)", letterSpacing:"0.1em"}}>ACTOR</div>
        <div className="filter-group">
          <button className={`filter-btn ${filterActor === 0 ? "active" : ""}`} onClick={() => setFilterActor(0)}>All</button>
          {[1,2,3].map(l => (
            <button key={l} className={`filter-btn ${filterActor === l ? "active" : ""}`} onClick={() => setFilterActor(l)}
              style={filterActor === l ? {borderColor: ACTOR_COLORS[l], color: ACTOR_COLORS[l], background: `${ACTOR_COLORS[l]}18`} : {}}>
              L{l}
            </button>
          ))}
        </div>
        {(filterPlatform !== "All" || filterActor > 0) && (
          <button className="filter-btn" onClick={() => { setFilterPlatform("All"); setFilterActor(0); }} style={{borderColor:"rgba(239,68,68,0.4)", color:"var(--red)"}}>
            Clear filters
          </button>
        )}
      </div>

      <div style={{overflowX:"auto"}}>
        <div className="matrix-grid" style={{minWidth:"900px"}}>
          {TACTICS.map(tactic => (
            <div key={tactic.id}>
              <div className="matrix-tactic-header"
                style={{background: `${tactic.color}18`, borderColor: `${tactic.color}40`, color: tactic.color}}
                onClick={() => goToTactic(tactic)}>
                <div className="matrix-tactic-id">{tactic.id}</div>
                <div className="matrix-tactic-name">{tactic.short}</div>
                <div className="matrix-tactic-count">{tactic.techniques.filter(isTechVisible).length}/{tactic.techniques.length}</div>
              </div>
              <div style={{display:"flex", flexDirection:"column", gap:"6px", marginTop:"6px"}}>
                {tactic.techniques.map(tech => {
                  const visible = isTechVisible(tech);
                  const sel = selectedTech && selectedTech.id === tech.id;
                  return (
                    <div key={tech.id}
                      className={`matrix-tech ${sel ? "selected" : ""} ${!visible ? "dimmed" : ""}`}
                      onClick={() => visible && setSelectedTech(sel ? null : tech)}>
                      <div className="matrix-tech-actor" style={{background: ACTOR_COLORS[tech.actorMin]}} />
                      <div className="matrix-tech-id">{tech.id}</div>
                      <div className="matrix-tech-name">{tech.name}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actor legend */}
      <div style={{display:"flex", gap:"1.5rem", marginTop:"1.5rem", flexWrap:"wrap"}}>
        <div style={{fontFamily:"var(--mono)", fontSize:"11px", color:"var(--text3)"}}>MIN. ACTOR TIER:</div>
        {[1,2,3].map(l => (
          <div key={l} style={{display:"flex", alignItems:"center", gap:"0.5rem"}}>
            <div style={{width:"8px", height:"8px", borderRadius:"50%", background:ACTOR_COLORS[l]}} />
            <span style={{fontFamily:"var(--mono)", fontSize:"11px", color:"var(--text2)"}}>{ACTOR_LABELS[l]}</span>
          </div>
        ))}
      </div>

      {/* Detail panel */}
      {selectedTech && activeTacticForTech && (
        <div className="detail-panel">
          <div className="detail-header">
            <div style={{flex:1}}>
              <div className="detail-id">{selectedTech.id}</div>
              <div className="detail-name">{selectedTech.name}</div>
              <div style={{marginTop:"0.75rem", display:"flex", gap:"0.5rem", flexWrap:"wrap", alignItems:"center"}}>
                <div className="actor-badge" style={{background: `${ACTOR_COLORS[selectedTech.actorMin]}18`, border: `1px solid ${ACTOR_COLORS[selectedTech.actorMin]}40`, color: ACTOR_COLORS[selectedTech.actorMin]}}>
                  Min. {ACTOR_LABELS[selectedTech.actorMin]}
                </div>
                {selectedTech.platform.map(p => <span key={p} className="platform-tag">{p}</span>)}
              </div>
            </div>
            <div style={{display:"flex", gap:"0.75rem", flexShrink:0}}>
              <button className="btn-secondary" style={{fontSize:"12px",padding:"0.4rem 1rem"}} onClick={() => goToTechnique(selectedTech, activeTacticForTech)}>Full Detail →</button>
              <button className="btn-secondary" style={{fontSize:"12px",padding:"0.4rem 1rem"}} onClick={() => setSelectedTech(null)}>✕</button>
            </div>
          </div>
          <div className="detail-body">
            <div>
              <div className="detail-section-title">Description</div>
              <div className="detail-desc">{selectedTech.desc}</div>
            </div>
            <div>
              <div className="detail-section-title">Sub-Techniques ({selectedTech.subs.length})</div>
              {selectedTech.subs.map((s, i) => (
                <div key={i} className="detail-sub">
                  <div className="detail-sub-dot" />
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── TACTICS VIEW ─────────────────────────────────────────────────────────────
function TacticsView({ goToTactic }) {
  return (
    <div className="section" style={{paddingTop:"5rem"}}>
      <div className="section-header">
        <div className="section-label">All Tactics</div>
        <h2 className="section-title">Nine Tactical Phases</h2>
        <p className="section-desc">DARTA organizes adversarial behavior into nine ordered tactical phases, from initial reconnaissance through final impact.</p>
      </div>
      <div className="overview-grid">
        {TACTICS.map(t => (
          <div key={t.id} className="overview-card" onClick={() => goToTactic(t)} style={{"--card-color": t.color}}>
            <div style={{position:"absolute",left:0,top:0,bottom:0,width:"3px",background:t.color,borderRadius:"3px 0 0 3px"}} />
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"0.5rem"}}>
              <div className="overview-card-id">{t.id}</div>
              <div style={{fontFamily:"var(--mono)", fontSize:"11px", color:t.color, background:`${t.color}18`, border:`1px solid ${t.color}30`, padding:"0.15rem 0.5rem", borderRadius:"3px"}}>{t.techniques.length} tech.</div>
            </div>
            <div className="overview-card-name">{t.name}</div>
            <div className="overview-card-desc">{t.desc}</div>
            <div style={{marginTop:"1rem", fontFamily:"var(--mono)", fontSize:"10px", color:"var(--text3)"}}>
              {t.techniques.slice(0,3).map(tt => tt.id).join(" · ")} {t.techniques.length > 3 ? `+${t.techniques.length-3}` : ""}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── TACTIC DETAIL VIEW ───────────────────────────────────────────────────────
function TacticDetailView({ tactic, goBack, goToTechnique }) {
  const [expanded, setExpanded] = useState(null);
  return (
    <div className="tactic-page">
      <button className="back-btn" onClick={goBack}>← Back to Tactics</button>
      <div className="tactic-hero" style={{background:`${tactic.color}0D`, borderColor:`${tactic.color}30`}}>
        <div style={{fontFamily:"var(--mono)", fontSize:"13px", color:tactic.color, marginBottom:"0.5rem"}}>{tactic.id}</div>
        <h1 style={{fontSize:"clamp(2rem,5vw,3.5rem)", fontWeight:"800", color:"var(--text)", letterSpacing:"-0.02em", marginBottom:"1rem"}}>{tactic.name}</h1>
        <p style={{color:"var(--text2)", fontSize:"15px", lineHeight:"1.7", maxWidth:"700px"}}>{tactic.desc}</p>
        <div style={{marginTop:"1.5rem", fontFamily:"var(--mono)", fontSize:"12px", color:tactic.color}}>{tactic.techniques.length} techniques in this phase</div>
      </div>

      {tactic.techniques.map(tech => (
        <div key={tech.id} className="tech-card" onClick={() => setExpanded(expanded === tech.id ? null : tech.id)}>
          <div className="tech-card-header">
            <div>
              <div className="tech-card-id">{tech.id}</div>
              <div className="tech-card-name">{tech.name}</div>
            </div>
            <div style={{display:"flex", gap:"0.5rem", alignItems:"center", flexShrink:0}}>
              <div className="actor-badge" style={{background:`${ACTOR_COLORS[tech.actorMin]}18`, border:`1px solid ${ACTOR_COLORS[tech.actorMin]}40`, color:ACTOR_COLORS[tech.actorMin], fontSize:"11px"}}>
                L{tech.actorMin}+
              </div>
              {tech.platform.slice(0,2).map(p => <span key={p} className="platform-tag">{p}</span>)}
              <button onClick={e => { e.stopPropagation(); goToTechnique(tech, tactic); }} className="btn-secondary" style={{fontSize:"11px",padding:"0.3rem 0.7rem"}}>Detail →</button>
            </div>
          </div>
          <div className="tech-card-desc">{tech.desc}</div>
          {expanded === tech.id && (
            <div className="tech-subs">
              <div style={{fontFamily:"var(--mono)", fontSize:"10px", color:"var(--accent)", letterSpacing:"0.15em", marginBottom:"0.5rem"}}>SUB-TECHNIQUES</div>
              {tech.subs.map((s, i) => <div key={i} className="tech-sub">{s}</div>)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── TECHNIQUE DETAIL VIEW ────────────────────────────────────────────────────
function TechniqueDetailView({ tech, goBack, countermeasures }) {
  return (
    <div className="technique-page">
      <button className="back-btn" onClick={goBack}>← Back to {tech.tacticName}</button>
      <div style={{background:`${tech.tacticColor}0D`, border:`1px solid ${tech.tacticColor}30`, borderRadius:"16px", padding:"2.5rem", marginBottom:"2rem"}}>
        <div style={{fontFamily:"var(--mono)", fontSize:"12px", color:tech.tacticColor, marginBottom:"0.5rem"}}>{tech.tacticId} — {tech.tacticName}</div>
        <div style={{fontFamily:"var(--mono)", fontSize:"14px", color:"var(--accent)", marginBottom:"0.5rem"}}>{tech.id}</div>
        <h1 style={{fontSize:"clamp(1.8rem,4vw,2.8rem)", fontWeight:"800", color:"var(--text)", letterSpacing:"-0.02em", marginBottom:"1.5rem"}}>{tech.name}</h1>
        <p style={{color:"var(--text2)", fontSize:"15px", lineHeight:"1.8", marginBottom:"1.5rem"}}>{tech.desc}</p>
        <div style={{display:"flex", gap:"0.75rem", flexWrap:"wrap", alignItems:"center"}}>
          <div className="actor-badge" style={{background:`${ACTOR_COLORS[tech.actorMin]}18`, border:`1px solid ${ACTOR_COLORS[tech.actorMin]}40`, color:ACTOR_COLORS[tech.actorMin]}}>
            Min. {ACTOR_LABELS[tech.actorMin]}
          </div>
          {tech.platform.map(p => <span key={p} className="platform-tag">{p}</span>)}
        </div>
      </div>

      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.5rem", marginBottom:"2rem"}}>
        <div style={{background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:"10px", padding:"1.5rem"}}>
          <div style={{fontFamily:"var(--mono)", fontSize:"10px", color:"var(--accent)", letterSpacing:"0.15em", marginBottom:"1rem"}}>SUB-TECHNIQUES ({tech.subs.length})</div>
          {tech.subs.map((s, i) => (
            <div key={i} style={{display:"flex", gap:"0.75rem", padding:"0.6rem 0", borderBottom:"1px solid var(--border)", alignItems:"flex-start"}}>
              <div style={{width:"5px", height:"5px", borderRadius:"50%", background:"var(--accent)", flexShrink:0, marginTop:"7px"}} />
              <span style={{fontSize:"14px", color:"var(--text2)", lineHeight:"1.5"}}>{s}</span>
            </div>
          ))}
        </div>
        <div style={{background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:"10px", padding:"1.5rem"}}>
          <div style={{fontFamily:"var(--mono)", fontSize:"10px", color:"var(--green)", letterSpacing:"0.15em", marginBottom:"1rem"}}>APPLICABLE COUNTERMEASURES</div>
          {countermeasures.length > 0 ? countermeasures.map(cm => (
            <div key={cm.id} style={{padding:"0.75rem", background:"var(--bg3)", borderRadius:"6px", marginBottom:"0.75rem"}}>
              <div style={{fontFamily:"var(--mono)", fontSize:"11px", color:"var(--green)", marginBottom:"0.3rem"}}>{cm.id}</div>
              <div style={{fontSize:"13px", fontWeight:"700", color:"var(--text)", marginBottom:"0.4rem"}}>{cm.name}</div>
              <div style={{display:"flex", flexWrap:"wrap", gap:"0.3rem"}}>
                {cm.refs.map(r => <span key={r} className="cm-ref">{r}</span>)}
              </div>
            </div>
          )) : <div style={{fontSize:"13px", color:"var(--text3)"}}>No direct countermeasures mapped for this technique yet.</div>}
        </div>
      </div>
    </div>
  );
}

// ─── COUNTERMEASURES VIEW ─────────────────────────────────────────────────────
function CountermeasuresView() {
  const [selected, setSelected] = useState(null);
  return (
    <div className="section" style={{paddingTop:"5rem"}}>
      <div className="section-header">
        <div className="section-label">Defensive Controls</div>
        <h2 className="section-title">Countermeasures</h2>
        <p className="section-desc">Thirteen defensive controls mapped to NIST SP 800-53, DO-326A, ASTM F38, OCSF 1.8.0, STANAG 4586, and regulatory frameworks including EU U-Space, NIS2, and the Cyber Resilience Act.</p>
      </div>
      <div className="cm-grid">
        {COUNTERMEASURES.map(cm => (
          <div key={cm.id} className="cm-card" onClick={() => setSelected(selected === cm.id ? null : cm.id)}
            style={selected === cm.id ? {borderColor:"rgba(16,185,129,0.4)", background:"rgba(16,185,129,0.05)"} : {}}>
            <div className="cm-card-header">
              <div className="cm-id">{cm.id}</div>
              <div className="cm-name">{cm.name}</div>
            </div>
            <div className="cm-desc">{cm.desc}</div>
            {selected === cm.id && (
              <div style={{marginBottom:"1rem"}}>
                <div style={{fontFamily:"var(--mono)", fontSize:"10px", color:"var(--accent)", letterSpacing:"0.15em", marginBottom:"0.5rem"}}>ADDRESSES TACTICS</div>
                <div style={{display:"flex", gap:"0.4rem", flexWrap:"wrap"}}>
                  {cm.tacticIds.map(tid => {
                    const t = TACTICS.find(tt => tt.id === tid);
                    return t ? <span key={tid} style={{fontFamily:"var(--mono)", fontSize:"11px", color:t.color, background:`${t.color}18`, border:`1px solid ${t.color}30`, padding:"0.2rem 0.6rem", borderRadius:"4px"}}>{tid} {t.name}</span> : null;
                  })}
                </div>
              </div>
            )}
            <div className="cm-refs">
              {cm.refs.map(r => <span key={r} className="cm-ref">{r}</span>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── INTEGRATE VIEW ───────────────────────────────────────────────────────────
function IntegrateView() {
  const [activeSnippet, setActiveSnippet] = useState("curl");

  const useCases = [
    {
      title: "Cyber Range",
      desc: "Load DARTA techniques to automatically generate scenario objectives, inject realistic adversarial behavior sequences, and score participant responses against mapped TTPs.",
      tags: ["scenario generation", "red vs blue", "scoring", "exercise planning"],
    },
    {
      title: "SOC / SIEM",
      desc: "Enrich security alerts with DARTA tactic and technique IDs. Map detection rules to framework phases and identify coverage gaps in your UAS monitoring posture.",
      tags: ["alert enrichment", "detection mapping", "SIEM rules", "gap analysis"],
    },
    {
      title: "C-UAS Systems",
      desc: "Tag RF, optical, and acoustic sensor detections with DARTA technique IDs to contextualize threat actor tier, likely platform scope, and associated countermeasures.",
      tags: ["threat profiling", "actor tier", "sensor fusion", "countermeasure mapping"],
    },
    {
      title: "Red Team / Assessments",
      desc: "Scope UAS penetration testing engagements using DARTA tactics as a checklist. Reference technique IDs in findings reports for unambiguous, framework-aligned documentation.",
      tags: ["pentest scoping", "findings reports", "TTP coverage", "threat modeling"],
    },
    {
      title: "Threat Intelligence",
      desc: "Annotate CTI reports and incident timelines with DARTA technique IDs. Build actor profiles keyed to actor tier (L1–L3) and platform scope for structured threat libraries.",
      tags: ["CTI annotation", "actor profiling", "incident mapping", "structured reporting"],
    },
    {
      title: "Manufacturer / Developer",
      desc: "Run DARTA-based threat modeling during UAS design reviews. Map mitigations to countermeasure IDs and track coverage across product lines and firmware versions.",
      tags: ["threat modeling", "design review", "security by design", "SBOM linkage"],
    },
  ];

  const snippets = {
    curl: `# Fetch the DARTA JSON directly
curl -O https://darta-framework.org/darta.json

# Filter techniques for a specific platform (using jq)
curl -s https://darta-framework.org/darta.json \\
  | jq '[.tactics[].techniques[] | select(.platforms[] == "military")]'`,

    python: `import json, urllib.request

# Load DARTA from local file or URL
with open("darta.json") as f:
    darta = json.load(f)

# Iterate all techniques with tactic context
for tactic in darta["tactics"]:
    for tech in tactic["techniques"]:
        print(f"{tech['id']}  [{tactic['name']}]  {tech['name']}")
        print(f"  Platforms : {', '.join(tech['platforms'])}")
        print(f"  Actor min : {tech['actor_min']}")

# Get all L1-accessible techniques (opportunistic attacker)
l1_techs = [
    t for tac in darta["tactics"]
      for t in tac["techniques"]
      if t["actor_min"] == "L1"
]
print(f"\\n{len(l1_techs)} techniques accessible to L1 actors")`,

    sigma: `# Sigma detection rule referencing DARTA technique IDs
title: MAVLink Unauthenticated Command Injection
status: experimental
description: >
  Detects potential MAVLink command injection attempts.
  DARTA: T003.001 – RF Command Link Hijacking (TA003 Initial Access)
tags:
  - darta.technique.T003.001
  - darta.tactic.TA003
  - darta.platform.consumer
  - darta.actor_min.L2
logsource:
  product: uas_gcs
  service: mavlink
detection:
  selection:
    message_type:
      - 'SET_MODE'
      - 'COMMAND_LONG'
    source_system_id|not: 255   # 255 = legitimate GCS
  condition: selection
falsepositives:
  - Legitimate companion computer commands
level: high`,

    stix: `// STIX 2.1 Attack Pattern object referencing DARTA
{
  "type": "attack-pattern",
  "spec_version": "2.1",
  "id": "attack-pattern--<uuid>",
  "name": "RF Command Link Hijacking",
  "description": "Exploitation of RF control channels to inject commands or seize C2 link.",
  "external_references": [
    {
      "source_name": "DARTA",
      "external_id": "T003.001",
      "url": "https://darta-framework.org"
    },
    {
      "source_name": "DARTA tactic",
      "external_id": "TA003",
      "description": "Initial Access"
    }
  ],
  "x_darta_platforms": ["consumer", "enterprise", "military"],
  "x_darta_actor_min": "L2"
}`,
  };

  const schemaFields = [
    { path: "framework.version", type: "string", desc: "Semantic version — validate before consuming" },
    { path: "tactics[].id", type: "string", desc: "Tactic identifier (TA001–TA009)" },
    { path: "tactics[].techniques[].id", type: "string", desc: "Technique identifier (T00X.00Y)" },
    { path: "tactics[].techniques[].platforms", type: "string[]", desc: "Platform scope: consumer, enterprise, military, gcs, utm, swarm, all" },
    { path: "tactics[].techniques[].actor_min", type: "string", desc: "Minimum adversary tier: L1, L2, or L3" },
    { path: "tactics[].techniques[].sub_techniques", type: "string[]", desc: "Ordered list of sub-technique name strings" },
    { path: "countermeasures[].id", type: "string", desc: "Countermeasure identifier (CM-001–CM-013)" },
    { path: "countermeasures[].tactic_ids", type: "string[]", desc: "Tactic IDs this control addresses" },
    { path: "countermeasures[].refs", type: "string[]", desc: "Regulatory and standard references" },
  ];

  return (
    <div className="section" style={{paddingTop:"5rem"}}>
      <div className="section-header">
        <div className="section-label">Integration</div>
        <h2 className="section-title">Integrate DARTA</h2>
        <p className="section-desc">DARTA is released as a machine-readable JSON artifact for direct integration into cyber range platforms, SIEM/SOC tooling, C-UAS systems, red team workflows, and threat intelligence pipelines.</p>
      </div>

      {/* Download hero */}
      <div className="integrate-hero">
        <div className="integrate-hero-text">
          <div className="integrate-hero-title">darta.json — Machine-Readable Framework</div>
          <div className="integrate-hero-desc">
            The complete DARTA framework in a single structured JSON file: all tactics, techniques, sub-techniques, platform scopes, actor tiers, countermeasures, and standard references. CC-BY-4.0 licensed — free to use, redistribute, and integrate.
          </div>
          <div className="integrate-hero-actions">
            <a className="btn-primary" href="/darta.json" download style={{textDecoration:"none", display:"inline-block"}}>
              ↓ Download darta.json
            </a>
            <a className="btn-secondary" href="/darta.json" target="_blank" rel="noopener noreferrer" style={{textDecoration:"none", display:"inline-block"}}>
              View raw ↗
            </a>
          </div>
          <div className="integrate-url">
            <span>GET</span>
            https://darta-framework.org/darta.json
          </div>
        </div>
        <div style={{fontFamily:"var(--mono)", fontSize:"11px", color:"var(--text3)", lineHeight:"2", flexShrink:0}}>
          {[
            ["tactics", "9"],
            ["techniques", "53"],
            ["sub_techniques", "198"],
            ["countermeasures", "13"],
            ["platforms", "6"],
            ["actor_tiers", "3"],
            ["license", "CC-BY-4.0"],
            ["version", "1.1.0"],
          ].map(([k,v]) => (
            <div key={k}><span style={{color:"var(--text2)"}}>{k}</span>: <span style={{color:"var(--accent)"}}>{v}</span></div>
          ))}
        </div>
      </div>

      {/* Use cases */}
      <div style={{marginBottom:"1rem"}}>
        <div className="section-label">Use Cases</div>
      </div>
      <div className="use-case-grid" style={{marginBottom:"3rem"}}>
        {useCases.map(uc => (
          <div key={uc.title} className="use-case-card">
            <div className="use-case-title">{uc.title}</div>
            <div className="use-case-desc">{uc.desc}</div>
            <div className="use-case-tags">
              {uc.tags.map(t => <span key={t} className="use-case-tag">{t}</span>)}
            </div>
          </div>
        ))}
      </div>

      {/* Code snippets */}
      <div style={{marginBottom:"1rem"}}>
        <div className="section-label">Code Examples</div>
      </div>
      <div style={{marginBottom:"3rem"}}>
        <div className="snippet-tabs">
          {[
            {id:"curl", label:"cURL / jq"},
            {id:"python", label:"Python"},
            {id:"sigma", label:"Sigma"},
            {id:"stix", label:"STIX 2.1"},
          ].map(s => (
            <button key={s.id} className={`snippet-tab ${activeSnippet === s.id ? "active" : ""}`}
              onClick={() => setActiveSnippet(s.id)}>
              {s.label}
            </button>
          ))}
        </div>
        <div className="snippet-block">{snippets[activeSnippet]}</div>
      </div>

      {/* Schema reference */}
      <div style={{marginBottom:"1rem"}}>
        <div className="section-label">Schema Reference</div>
      </div>
      <div style={{background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:"12px", overflow:"hidden", marginBottom:"3rem"}}>
        <table className="schema-table">
          <thead>
            <tr>
              <th>Field path</th>
              <th>Type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {schemaFields.map(f => (
              <tr key={f.path}>
                <td>{f.path}</td>
                <td>{f.type}</td>
                <td>{f.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* License note */}
      <div style={{background:"rgba(74,158,255,0.05)", border:"1px solid rgba(74,158,255,0.15)", borderRadius:"10px", padding:"1.5rem", display:"flex", gap:"1rem", alignItems:"flex-start"}}>
        <div style={{fontFamily:"var(--mono)", fontSize:"11px", color:"var(--accent)", flexShrink:0, paddingTop:"2px"}}>CC-BY-4.0</div>
        <div>
          <div style={{fontWeight:"700", marginBottom:"0.4rem"}}>CC-BY-4.0 License</div>
          <div style={{fontSize:"13px", color:"var(--text2)", lineHeight:"1.7"}}>
            You are free to use, adapt, and redistribute DARTA in any product or publication, including commercial integrations, provided you attribute the source as <strong style={{color:"var(--text)"}}>DARTA by Giorgio Campiotti (darta-framework.org)</strong>. No derivative work may imply endorsement by the original author.
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ABOUT VIEW ───────────────────────────────────────────────────────────────
function AboutView() {
  return (
    <div className="section" style={{paddingTop:"5rem"}}>
      <div className="section-header">
        <div className="section-label">Framework</div>
        <h2 className="section-title">About DARTA</h2>
        <p className="section-desc">Drone Attack Research and Tactic Analysis by <a href="https://giorgiocampiotti.com" target="_blank" rel="me author noopener noreferrer" style={{color:"var(--accent)", textDecoration:"none", borderBottom:"1px solid rgba(74,158,255,0.4)"}}>Giorgio Campiotti</a> — an open-source TTP framework for the UAS cybersecurity community.</p>
      </div>
      <div className="about-grid">
        <div>
          <div className="about-card" style={{marginBottom:"1rem"}}>
            <div className="about-card-title">What is DARTA?</div>
            <div className="about-card-text">DARTA is a structured, open-source threat framework cataloging the adversarial Tactics, Techniques, and Procedures (TTPs) applicable to Unmanned Aerial Systems across civil, commercial, and military domains. It provides a common language for UAS security practitioners, operators, regulators, manufacturers, and red teams.</div>
          </div>
          <div className="about-card" style={{marginBottom:"1rem"}}>
            <div className="about-card-title">Who is it for?</div>
            <div className="about-card-text">Security engineers conducting UAS threat models, red teams scoping drone security assessments, standards bodies developing UAS cybersecurity regulations, manufacturers implementing security by design, and operators assessing their exposure across civil and military contexts.</div>
          </div>
          <div className="about-card" style={{marginBottom:"1rem"}}>
            <div className="about-card-title">Machine-Readable JSON</div>
            <div className="about-card-text" style={{marginBottom:"1rem"}}>
              As of v1.1, DARTA is published as a structured JSON artifact alongside the PDF document. <code style={{fontFamily:"var(--mono)", fontSize:"12px", color:"var(--accent)", background:"var(--bg3)", padding:"0.1em 0.4em", borderRadius:"3px"}}>darta.json</code> contains the complete framework — all tactics, techniques, sub-techniques, platform scopes, actor tiers, and countermeasures — for direct integration into cyber range platforms, SOC tooling, SIEM detection pipelines, C-UAS systems, and red team workflows. CC-BY-4.0 licensed.
            </div>
            <a className="btn-secondary" href="/darta.json" download style={{textDecoration:"none", display:"inline-block", fontSize:"13px", padding:"0.5rem 1.2rem"}}>
              ↓ Download darta.json
            </a>
          </div>
          <div className="about-card">
            <div className="about-card-title">Disclaimer</div>
            <div className="about-card-text">DARTA is unclassified and released for research and educational purposes. Nothing herein constitutes authorization to perform offensive activities against UAS systems. DARTA is not affiliated with MITRE Corporation or The Aerospace Corporation.</div>
          </div>
        </div>
        <div>
          <div className="about-card" style={{marginBottom:"1rem"}}>
            <div className="about-card-title">Roadmap</div>
            <div className="about-card-text" style={{marginBottom:"1rem"}}>DARTA v1.1 introduces machine-readable JSON integration. Planned future versions:</div>
            {[
              {v:"v1.2", label:"Real-world incident validation — mapping of documented UAS security incidents to DARTA technique IDs"},
              {v:"v1.3", label:"Detection guidance — per-technique IoC and sensor data source guidance for C-UAS operators"},
              {v:"v1.4", label:"Directed energy and EW extension — complementing SPARTA coverage"},
              {v:"v2.0", label:"Community validated release — expert advisory board review and formal public release"},
            ].map(r => (
              <div key={r.v} style={{display:"flex", gap:"1rem", padding:"0.75rem 0", borderBottom:"1px solid var(--border)"}}>
                <div style={{fontFamily:"var(--mono)", fontSize:"12px", color:"var(--accent)", flexShrink:0, paddingTop:"2px"}}>{r.v}</div>
                <div style={{fontSize:"13px", color:"var(--text2)", lineHeight:"1.5"}}>{r.label}</div>
              </div>
            ))}
          </div>
          <div className="about-card">
            <div className="about-card-title">Download</div>
            <div className="about-card-text" style={{marginBottom:"1.25rem"}}>The DARTA framework data is maintained at v1.1 as a machine-readable JSON artifact for tooling integration. The whitepaper PDF (v0.1) covers the framework rationale, tactics, techniques, countermeasures, regulatory landscape, and usage guide.</div>
            <div style={{display:"flex", flexDirection:"column", gap:"0.6rem"}}>
              <a className="btn-primary" style={{width:"100%", display:"block", textAlign:"center", textDecoration:"none"}}
                href="https://raw.githubusercontent.com/Giorgiofox/darta/main/docs/DARTA_v0.1.pdf" download>
                ↓ Download whitepaper (.pdf, v0.1)
              </a>
              <a className="btn-secondary" style={{width:"100%", display:"block", textAlign:"center", textDecoration:"none"}}
                href="/darta.json" download>
                ↓ Download darta.json
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
