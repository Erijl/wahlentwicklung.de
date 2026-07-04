<script lang="ts">
  /**
   * Grid-list search island: filters sibling elements carrying
   * [data-search] under the container identified by `target`.
   * Progressive: without JS the full list simply shows.
   */
  interface Props {
    target: string;
    placeholder?: string;
  }
  let { target, placeholder = 'Suchen …' }: Props = $props();

  let query = $state('');
  let total = $state(0);
  let visible = $state(0);

  $effect(() => {
    const container = document.getElementById(target);
    if (!container) return;
    const items = container.querySelectorAll<HTMLElement>('[data-search]');
    total = items.length;
    const q = query.trim().toLowerCase();
    let n = 0;
    items.forEach((el) => {
      const hit = q === '' || (el.dataset.search ?? '').toLowerCase().includes(q);
      el.hidden = !hit;
      if (hit) n++;
    });
    visible = n;
  });
</script>

<div class="search">
  <input type="search" bind:value={query} {placeholder} aria-label={placeholder} />
  {#if query}
    <span class="count">{visible} von {total}</span>
  {/if}
</div>

<style>
  .search {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 14px 0;
  }
  input {
    border: 1px solid var(--hairline);
    background: var(--raised);
    color: var(--ink);
    font: inherit;
    font-size: 14px;
    padding: 8px 12px;
    border-radius: 4px;
    width: min(380px, 100%);
  }
  .count {
    font-size: 12.5px;
    color: var(--text-muted);
  }
</style>
