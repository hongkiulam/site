<script lang="ts">
  type $$Props = {
    class?: string;
  };

  $: klass = ($$restProps as $$Props).class;
</script>

<ul class={klass}>
  <slot />
</ul>

<style>
  ul {
    flex: 1 0 250px;
    max-width: 250px;
    margin-right: var(--spacing-3);
    overflow-y: auto;
  }
  ul::-webkit-scrollbar {
    display: none;
  }
  @media (--breakpoints-sm-max) {
    ul {
      max-width: unset;
      flex-basis: 100%;
    }
  }
</style>
