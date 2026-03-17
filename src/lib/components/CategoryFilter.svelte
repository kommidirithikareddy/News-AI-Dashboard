<script lang="ts">
  import { activeCategory, articles } from '$lib/stores';
  import type { Category } from '$lib/types';

  const CATEGORIES: { value: Category; label: string; icon: string }[] = [
    { value: 'all',        label: 'All',        icon: '🌐' },
    { value: 'technology', label: 'Tech',        icon: '💻' },
    { value: 'business',   label: 'Business',   icon: '📊' },
    { value: 'science',    label: 'Science',    icon: '🔬' },
    { value: 'health',     label: 'Health',     icon: '🩺' },
    { value: 'legal',      label: 'Legal',      icon: '⚖️' },
  ];
</script>

<div class="flex flex-wrap gap-2">
  {#each CATEGORIES as cat}
    <button
      class="btn btn-ghost {$activeCategory === cat.value ? 'active' : ''}"
      style="padding: 6px 14px; font-size: 12px; display: flex; align-items: center; gap: 5px"
      on:click={() => activeCategory.set(cat.value)}
    >
      <span>{cat.icon}</span>
      <span>{cat.label}</span>
    </button>
  {/each}
</div>
