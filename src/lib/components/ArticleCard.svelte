<script lang="ts">
  import { summaries } from '$lib/stores';
  import { summariseArticle } from '$lib/claude';
  import { timeAgo } from '$lib/news';
  import type { Article } from '$lib/types';

  const { article }: { article: Article } = $props();

  const CAT_COLORS: Record<string, string> = {
    technology: '#60a5fa',
    business:   '#fbbf24',
    health:     '#34d399',
    science:    '#a78bfa',
    legal:      '#f87171',
    all:        '#64748b',
  };

  let color  = $derived(CAT_COLORS[article.category] ?? '#64748b');
  let state  = $derived($summaries[article.id] ?? { text: '', loading: false, error: null });
  let isOpen = $derived(!!state.text);

  async function handleSummarise() {
    if (state.loading || state.text) return;
    summaries.update(s => ({ ...s, [article.id]: { text: '', loading: true, error: null } }));
    try {
      const text = await summariseArticle(article.title, article.content);
      summaries.update(s => ({ ...s, [article.id]: { text, loading: false, error: null } }));
    } catch(err) {
      summaries.update(s => ({ ...s, [article.id]: { text: '', loading: false, error: err instanceof Error ? err.message : 'Failed' } }));
    }
  }

  function toggle() {
    if (!state.text && !state.loading) handleSummarise();
    else summaries.update(s => ({ ...s, [article.id]: { text: '', loading: false, error: null } }));
  }
</script>

<article class="card">
  <!-- Image -->
  <div class="img-wrap">
    {#if article.image}
      <img src={article.image} alt={article.title} class="img" loading="lazy"
        onerror={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
    {:else}
      <div class="img-placeholder">📰</div>
    {/if}
  </div>

  <div class="body">
    <!-- Meta row -->
    <div class="meta-row">
      <span class="badge" style="background:{color}18; color:{color}; border:1px solid {color}33;">{article.category}</span>
      <span class="time">{timeAgo(article.publishedAt)}</span>
    </div>

    <!-- Title -->
    <h3 class="title">{article.title}</h3>

    <!-- Description (hidden when summary open) -->
    {#if !isOpen && !state.loading}
      <p class="desc">{article.description}</p>
    {/if}

    <!-- AI Summary -->
    {#if state.loading}
      <div class="summary-box">
        <div style="display:flex;align-items:center;gap:7px;margin-bottom:8px;">
          <div class="spinner"></div>
          <span style="font-size:11px;color:#64748b;">Generating summary...</span>
        </div>
        {#each [1,2,3] as _}
          <div class="sk-line" style="margin-bottom:6px;"></div>
        {/each}
      </div>
    {:else if state.text}
      <div class="summary-box" style="background:{color}0d; border:1px solid {color}28;">
        <div style="display:flex;align-items:center;gap:5px;margin-bottom:6px;">
          <span style="color:{color};font-size:11px;">✦</span>
          <span style="color:{color};font-size:11px;font-weight:700;font-family:'Space Grotesk',sans-serif;">AI Summary</span>
        </div>
        <p style="margin:0;font-size:12px;line-height:1.6;color:#e2e8f0;">{state.text}</p>
      </div>
    {:else if state.error}
      <div class="err-box">⚠ {state.error}</div>
    {/if}

    <!-- Actions -->
    <div class="actions">
      <button class="btn-sum" onclick={toggle} disabled={state.loading}
        style="background:{state.text ? 'transparent' : '#00e5a0'}; color:{state.text ? '#64748b' : '#0a0f1a'}; border:{state.text ? '1px solid #2a3347' : 'none'};">
        {#if state.loading}Summarising...
        {:else if state.text}✕ Hide
        {:else}✦ Summarise{/if}
      </button>
      <a href={article.url} target="_blank" rel="noopener noreferrer" class="btn-read">Read →</a>
    </div>
  </div>
</article>

<style>
  .card { background:#161b27; border:1px solid #2a3347; border-radius:16px; overflow:hidden; display:flex; flex-direction:column; height:100%; transition:border-color 0.2s, transform 0.2s, box-shadow 0.2s; }
  .card:hover { border-color:#00e5a0; transform:translateY(-2px); box-shadow:0 8px 28px rgba(0,0,0,0.3); }

  .img-wrap { height:136px; background:#1e2535; flex-shrink:0; overflow:hidden; }
  .img { width:100%; height:100%; object-fit:cover; }
  .img-placeholder { width:100%; height:100%; display:flex; align-items:center; justify-content:center; font-size:32px; opacity:0.18; }

  .body { padding:14px; display:flex; flex-direction:column; gap:9px; flex:1; }

  .meta-row { display:flex; align-items:center; justify-content:space-between; }
  .badge { font-family:'Space Grotesk',sans-serif; font-size:10px; font-weight:700; letter-spacing:0.05em; padding:2px 8px; border-radius:100px; text-transform:uppercase; }
  .time { font-size:10px; color:#64748b; font-family:'IBM Plex Mono',monospace; }

  .title { margin:0; font-family:'Space Grotesk',sans-serif; font-weight:600; font-size:13px; line-height:1.4; color:#e2e8f0; }
  .desc { margin:0; font-size:12px; color:#64748b; line-height:1.55; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; }

  .summary-box { background:#1e2535; border:1px solid #2a3347; border-radius:10px; padding:11px; }
  .err-box { background:rgba(248,113,113,0.08); border:1px solid rgba(248,113,113,0.25); border-radius:8px; padding:9px; font-size:11px; color:#f87171; }

  .sk-line { height:9px; border-radius:5px; background:linear-gradient(90deg,#161b27 25%,#1e2535 50%,#161b27 75%); background-size:400px 100%; animation:shimmer 1.4s infinite; width:100%; }

  .actions { display:flex; gap:8px; align-items:center; margin-top:auto; padding-top:4px; }
  .btn-sum { flex:1; border-radius:9px; padding:7px 10px; font-size:12px; font-weight:700; cursor:pointer; font-family:'Space Grotesk',sans-serif; transition:all 0.18s; white-space:nowrap; }
  .btn-sum:disabled { opacity:0.45; cursor:not-allowed; }
  .btn-sum:not(:disabled):hover { opacity:0.88; }
  .btn-read { background:transparent; border:1px solid #2a3347; color:#64748b; border-radius:9px; padding:7px 12px; font-size:12px; font-weight:600; text-decoration:none; font-family:'Space Grotesk',sans-serif; transition:all 0.18s; white-space:nowrap; }
  .btn-read:hover { border-color:#00e5a0; color:#00e5a0; }

  .spinner { width:13px; height:13px; border:2px solid #00e5a0; border-top-color:transparent; border-radius:50%; animation:spin 0.8s linear infinite; flex-shrink:0; }

  @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
</style>
