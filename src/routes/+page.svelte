<script lang="ts">
  import { onMount } from 'svelte';
  import type { PageData } from './$types';
  import { articles, filteredArticles, activeCategory, searchQuery } from '$lib/stores';
  import { fetchArticles } from '$lib/news';
  import { analyseTrends } from '$lib/claude';
  import ArticleCard from '$lib/components/ArticleCard.svelte';

  const { data }: { data: PageData } = $props();

  let loading = $state(false);
  let lastFetched = $state('all');
  let searchVal = $state('');
  let trendsText = $state('');
  let trendsLoading = $state(false);
  let trendsError = $state('');

  onMount(() => { articles.set(data.initialArticles); });

  $effect(() => {
    const cat = $activeCategory;
    if (lastFetched !== cat) loadCategory(cat);
  });

  $effect(() => { searchQuery.set(searchVal); });

  async function loadCategory(cat: typeof $activeCategory) {
    lastFetched = cat;
    loading = true;
    const key = import.meta.env.VITE_GNEWS_API_KEY;
    articles.set(await fetchArticles(cat, key));
    loading = false;
  }

  async function refresh() {
    loading = true;
    const key = import.meta.env.VITE_GNEWS_API_KEY;
    articles.set(await fetchArticles($activeCategory, key));
    loading = false;
  }

  async function generateTrends() {
    trendsLoading = true; trendsText = ''; trendsError = '';
    try {
      trendsText = await analyseTrends($filteredArticles.map(a => a.title));
    } catch(e) {
      trendsError = e instanceof Error ? e.message : 'Failed';
    } finally { trendsLoading = false; }
  }

  const CATS = [
    { value: 'all', label: 'All', icon: '🌐' },
    { value: 'technology', label: 'Tech', icon: '💻' },
    { value: 'business', label: 'Business', icon: '📊' },
    { value: 'science', label: 'Science', icon: '🔬' },
    { value: 'health', label: 'Health', icon: '🩺' },
    { value: 'legal', label: 'Legal', icon: '⚖️' },
  ] as const;
</script>

<svelte:head>
  <title>NewsAI Dashboard</title>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%2300e5a0'/><text y='.9em' font-size='70' x='15' font-family='sans-serif' text='center' font-weight='bold' fill='%230a0f1a'>RRK</text></svg>" />
</svelte:head>

<div class="wrap">

  <!-- HEADER -->
  <header class="hdr">
    <div class="hdr-inner">
      <div class="logo">
        <div class="logo-icon">RRK</div>
        <div>
          <div class="logo-title">NewsAI Dashboard</div>
          <div class="logo-sub">All about news</div>
        </div>
      </div>
      <div class="search-wrap">
        <span class="search-icon">🔍</span>
        <input class="search-input" type="text" placeholder="Search headlines..." bind:value={searchVal} />
      </div>
      <button class="btn-refresh" onclick={refresh} disabled={loading}>
        <span class={loading ? 'spin' : ''}>↻</span> Refresh
      </button>
    </div>
  </header>

  <!-- BODY -->
  <div class="body-layout">

    <!-- MAIN -->
    <main class="main-col">
      <!-- Filters -->
      <div class="filter-row">
        <div class="cats">
          {#each CATS as c}
            <button
              class="cat-btn {$activeCategory === c.value ? 'cat-active' : ''}"
              onclick={() => activeCategory.set(c.value)}
            >{c.icon} {c.label}</button>
          {/each}
        </div>
        <span class="count">{$filteredArticles.length} articles{searchVal ? ` · "${searchVal}"` : ''}</span>
      </div>

      <!-- Grid -->
      {#if loading}
        <div class="grid">
          {#each Array(6) as _}
            <div class="skeleton-card">
              <div class="sk-img"></div>
              <div style="padding:14px; display:flex; flex-direction:column; gap:8px;">
                <div class="sk-line" style="width:35%"></div>
                <div class="sk-line" style="width:100%"></div>
                <div class="sk-line" style="width:75%"></div>
                <div class="sk-line" style="width:90%"></div>
              </div>
            </div>
          {/each}
        </div>
      {:else if $filteredArticles.length === 0}
        <div class="empty">
          <span style="font-size:48px;opacity:0.25">📭</span>
          <p>No articles found{searchVal ? ` for "${searchVal}"` : ''}</p>
          {#if searchVal}<button class="btn-clear" onclick={() => searchVal=''}>Clear search</button>{/if}
        </div>
      {:else}
        <div class="grid">
          {#each $filteredArticles as article (article.id)}
            <ArticleCard {article} />
          {/each}
        </div>
      {/if}
    </main>

    <!-- SIDEBAR -->
    <aside class="sidebar">

      <!-- Trends -->
      <div class="panel">
        <div class="panel-hdr">
          <span style="display:flex;align-items:center;gap:7px;font-weight:700;font-size:13px;">📈 AI Trend Analysis</span>
          <span class="count">{$filteredArticles.length}</span>
        </div>
        {#if trendsLoading}
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">
            <div class="spinner"></div>
            <span style="font-size:12px;color:#64748b;">Analysing...</span>
          </div>
          {#each [1,2,3] as _}<div class="sk-line" style="margin-bottom:7px;"></div>{/each}
        {:else if trendsText}
          <div class="trends-box">{trendsText}</div>
          <button class="btn-ghost-sm" onclick={() => trendsText=''}>Clear</button>
        {:else if trendsError}
          <div class="err-box">⚠ {trendsError}</div>
        {:else}
          <p style="font-size:12px;color:#64748b;margin:0 0 12px;">Get AI insights across visible headlines.</p>
          <button class="btn-accent-full" onclick={generateTrends} disabled={$filteredArticles.length===0}>✦ Analyse Trends</button>
        {/if}
      </div>

      <!-- Stats -->
      <div class="panel">
        <div style="font-weight:700;font-size:13px;margin-bottom:10px;">📊 Stats</div>
        {#each [['Loaded',$articles.length],['Showing',$filteredArticles.length],['Filter',$activeCategory]] as [l,v]}
          <div class="stat-row"><span>{l}</span><span class="stat-val">{v}</span></div>
        {/each}
      </div>

      <!-- Credit -->
      <div class="panel" style="text-align:center;">
        <div style="font-size:12px;font-weight:700;color:#00e5a0;margin-bottom:3px;">✦ The Svelte AI News Dashboard </div>
        <div style="font-size:11px;color:#64748b;">Rithika Reddy Kommidi</div>
      </div>
    </aside>
  </div>
</div>

<style>
  .wrap { min-height:100vh; background:#0e1117; color:#e2e8f0; font-family:'Nunito Sans',sans-serif; }

  /* Header */
  .hdr { position:sticky; top:0; z-index:20; background:rgba(14,17,23,0.93); border-bottom:1px solid #2a3347; backdrop-filter:blur(12px); }
  .hdr-inner { max-width:1280px; margin:0 auto; padding:12px 24px; display:flex; align-items:center; gap:14px; flex-wrap:wrap; }
  .logo { display:flex; align-items:center; gap:10px; margin-right:auto; }
  .logo-icon { width:36px; height:36px; background:#00e5a0; border-radius:10px; display:flex; align-items:center; justify-content:center; font-family:'Space Grotesk',sans-serif; font-weight:700; color:#0a0f1a; font-size:16px; box-shadow:0 0 16px rgba(0,229,160,0.28); flex-shrink:0; }
  .logo-title { font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:15px; }
  .logo-sub { font-size:11px; color:#64748b; }
  .search-wrap { position:relative; }
  .search-icon { position:absolute; left:9px; top:50%; transform:translateY(-50%); font-size:12px; pointer-events:none; }
  .search-input { background:#1e2535; border:1px solid #2a3347; color:#e2e8f0; border-radius:10px; padding:7px 12px 7px 28px; font-size:13px; width:210px; outline:none; font-family:'Nunito Sans',sans-serif; }
  .search-input:focus { border-color:#00e5a0; box-shadow:0 0 0 3px rgba(0,229,160,0.12); }
  .btn-refresh { background:transparent; border:1px solid #2a3347; color:#64748b; border-radius:10px; padding:7px 14px; font-size:12px; cursor:pointer; font-family:'Space Grotesk',sans-serif; font-weight:600; display:flex; align-items:center; gap:5px; transition:all 0.2s; }
  .btn-refresh:hover { border-color:#00e5a0; color:#00e5a0; }

  /* Layout */
  .body-layout { max-width:1280px; margin:0 auto; padding:26px 24px; display:flex; gap:26px; align-items:flex-start; }
  .main-col { flex:1; min-width:0; }
  .sidebar { width:255px; flex-shrink:0; position:sticky; top:76px; display:flex; flex-direction:column; gap:14px; }

  /* Filters */
  .filter-row { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px; margin-bottom:20px; }
  .cats { display:flex; flex-wrap:wrap; gap:7px; }
  .cat-btn { background:transparent; border:1px solid #2a3347; color:#64748b; border-radius:10px; padding:5px 13px; font-size:12px; cursor:pointer; font-family:'Space Grotesk',sans-serif; font-weight:600; transition:all 0.18s; display:inline-flex; align-items:center; gap:4px; }
  .cat-btn:hover { border-color:#00e5a0; color:#00e5a0; }
  .cat-active { background:rgba(0,229,160,0.11) !important; border-color:#00e5a0 !important; color:#00e5a0 !important; }
  .count { font-size:11px; color:#64748b; font-family:'IBM Plex Mono',monospace; }

  /* Grid */
  .grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(270px, 1fr)); gap:18px; }

  /* Skeleton card */
  .skeleton-card { background:#161b27; border:1px solid #2a3347; border-radius:16px; overflow:hidden; }
  .sk-img { height:136px; background:linear-gradient(90deg,#161b27 25%,#1e2535 50%,#161b27 75%); background-size:400px 100%; animation:shimmer 1.4s infinite; }
  .sk-line { height:10px; border-radius:6px; background:linear-gradient(90deg,#161b27 25%,#1e2535 50%,#161b27 75%); background-size:400px 100%; animation:shimmer 1.4s infinite; }

  /* Empty */
  .empty { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:80px 0; gap:10px; }
  .empty p { font-size:14px; color:#64748b; margin:0; }
  .btn-clear { background:transparent; border:1px solid #2a3347; color:#64748b; border-radius:8px; padding:5px 14px; font-size:12px; cursor:pointer; }

  /* Panel */
  .panel { background:#161b27; border:1px solid #2a3347; border-radius:14px; padding:16px; font-family:'Nunito Sans',sans-serif; }
  .panel-hdr { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; color:#e2e8f0; }
  .trends-box { background:#1e2535; border:1px solid #2a3347; border-radius:10px; padding:11px; font-size:12px; line-height:1.65; color:#e2e8f0; white-space:pre-wrap; margin-bottom:10px; }
  .err-box { background:rgba(248,113,113,0.08); border:1px solid rgba(248,113,113,0.25); border-radius:8px; padding:9px; font-size:12px; color:#f87171; margin-bottom:10px; }
  .btn-accent-full { background:#00e5a0; color:#0a0f1a; border:none; border-radius:10px; padding:9px 0; font-size:12px; font-weight:700; cursor:pointer; width:100%; font-family:'Space Grotesk',sans-serif; transition:all 0.2s; }
  .btn-accent-full:hover:not(:disabled) { background:#00b37d; box-shadow:0 0 16px rgba(0,229,160,0.25); }
  .btn-accent-full:disabled { opacity:0.4; cursor:not-allowed; }
  .btn-ghost-sm { background:transparent; border:1px solid #2a3347; color:#64748b; border-radius:8px; padding:5px 12px; font-size:11px; cursor:pointer; width:100%; font-family:'Space Grotesk',sans-serif; }
  .stat-row { display:flex; justify-content:space-between; align-items:center; padding:3px 0; font-size:12px; color:#64748b; }
  .stat-val { color:#e2e8f0; font-family:'IBM Plex Mono',monospace; }

  /* Spinner */
  .spinner { width:14px; height:14px; border:2px solid #00e5a0; border-top-color:transparent; border-radius:50%; animation:spin 0.8s linear infinite; flex-shrink:0; }
  .spin { display:inline-block; animation:spin 0.8s linear infinite; }

  @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
</style>
