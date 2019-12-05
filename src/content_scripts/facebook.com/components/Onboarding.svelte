<script>
  let counter = 0;
</script>

<style>
  div {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    border: 1px solid tomato;
    background: white;
    font-size: 20px;
    padding: 20px;
  }
</style>

<div>
  Onboarding will be here, and this is a random counter. {counter}
  <button on:click={() => (counter += 1)}>Increment</button>
</div>
