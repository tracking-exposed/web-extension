<script>
  import { onMount } from "svelte";

  import { Form, FormGroup, Input, Label } from "sveltestrap";

  export let currentUser;

  function handleHideBanner() {
    browser.runtime.sendMessage({
      method: "setHideBanner",
      params: [currentUser.hideBanner]
    });
  }
</script>

<style>
  li {
    font-size: 14px;
    margin-bottom: 4px;
  }
</style>

<div>
  <Form>
    <FormGroup check>
      <Label check>
        <Input
          bind:checked={currentUser.hideBanner}
          on:change={handleHideBanner}
          type="checkbox" />
        <p>Hide banner at the top of the posts.</p>
      </Label>
    </FormGroup>
  </Form>
</div>
