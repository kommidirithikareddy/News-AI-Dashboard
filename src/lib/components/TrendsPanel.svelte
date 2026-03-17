<script lang="ts">
  import { trends, filteredArticles } from '$lib/stores';
  import { analyseTrends } from '$lib/claude';

  async function generateTrends() {
    const titles = $filteredArticles.map(a => a.title);
    if (!titles.length) return;

    trends.set({ text: '', loading: true, error: null });

    try {
      const text = await analyseTrends(titles);
      trends.set({ text, loading: false, error: null });
    } catch (err) {
      trends.set({
        text: '',
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to generate trends',
      });
    }
  }

  function clear() { trends.set({ text: '', loading: false, error: null }); }
</script>

<div class="card p-5 space-y-3">
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-2">
      <span class="text-lg">📈</span>
      <h3 class="font-bold text-sm" style="font-family: 'Space Grotesk', sans-serif; color: var(--text)">
        AI Trend Analysis
      </h3>
    </div>
    <span class="text-xs" style="color: var(--muted)">
      {$filteredArticles.length} articles
    </span>
  </div>

  {#if $trends.loading}
    <div class="space-y-2 py-2">
      <div class="flex items-center gap-2 mb-3">
        <div class="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin" style="border-color: var(--accent); border-top-color: transparent"></div>
        <span class="text-xs" style="color: var(--muted)">Analysing {$filteredArticles.length} headlines...</span>
      </div>
      {#each [1,2,3,4] as _}
        <div class="skeleton h-3 w-full"></div>
      {/each}
    </div>

  {:else if $trends.text}
    <div class="rounded-xl p-4 text-sm leading-relaxed fade-up whitespace-pre-wrap"
      style="background: var(--surface2); border: 1px solid var(--border); color: var(--text)">
      {$trends.text}
    </div>
    <button class="btn btn-ghost w-full text-xs py-2" on:click={clear}>Clear</button>

  {:else if $trends.error}
    <div class="rounded-xl p-3 text-xs" style="background: #ff00001a; color: var(--red); border: 1px solid #ff000033">
      ⚠ {$trends.error}
    </div>

  {:else}
    <p class="text-xs" style="color: var(--muted)">
      Click below to get an AI-powered analysis of trends across all visible headlines.
    </p>
    <button
      class="btn btn-accent w-full py-2 text-xs"
      on:click={generateTrends}
      disabled={$filteredArticles.length === 0}
    >
      ✦ Analyse Trends
    </button>
  {/if}
</div>
