<script lang="ts">
  import { searchQuery } from '$lib/stores';
</script>

<div class="relative" style="max-width: 280px">
  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style="color: var(--muted)">🔍</span>
  <input
    type="text"
    placeholder="Search headlines..."
    bind:value={$searchQuery}
    class="w-full rounded-xl py-2 pl-9 pr-4 text-sm"
    style="background: var(--surface2); border: 1px solid var(--border); color: var(--text); font-family: 'Nunito Sans', sans-serif"
  />
</div>
