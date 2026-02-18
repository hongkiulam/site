<script lang="ts">
  let klass: string = '';
  export { klass as class };
</script>

<div class="sidebar-layout{klass}">
  <slot />
</div>

<style>
  .sidebar-layout {
    display: flex;
    height: calc(var(--100pvh, 100vh) - var(--nav-height) - var(--spacing-2));
  }
  .sidebar-layout :global(::-webkit-scrollbar) {
    width: 0px;
  }
</style>
