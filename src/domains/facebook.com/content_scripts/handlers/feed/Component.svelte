<script>
  export let visibility;
  export let hub;
  let hide = !hub.config.showHeader;

  hub.on("setConfig", (_, { showHeader }) => {
    hide = !showHeader;
  });
</script>

<style>
  div {
    display: flex;
    align-items: center;
    background-color: #f5f6f7;
    border-bottom: 1px solid #dddfe2;
    padding: 4px 12px;
  }

  .hide {
    display: none;
  }

  img {
    width: 24px;
    height: 24px;
    padding: 2px;
    border-radius: 100%;
    margin-right: 6px;
    background-color: #ff9999;
  }

  .public img {
    background-color: #99ff99;
  }

  strong {
    text-transform: capitalize;
  }
</style>

<!-- this is disabled at the moment
<div class={visibility} class:hide>
  <strong>{visibility}</strong>
  &nbsp;post.
  {#if visibility === 'public'}
    Content has been collected.
  {:else}No content has been collected.{/if}
</div>
-->
