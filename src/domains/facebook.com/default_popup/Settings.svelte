<script>
  import { onMount } from "svelte";

  import { Form, FormGroup, Input, Label } from "sveltestrap";

  export let profile;

  async function handleShowHeader() {
    browser.runtime.sendMessage({
      method: "setShowHeader",
      params: [profile.showHeader]
    });

    const tabs = await browser.tabs.query({
      currentWindow: true,
      active: true
    });

    tabs.forEach(tab =>
      browser.tabs.sendMessage(tab.id, {
        method: "updateConfig",
        params: [profile]
      })
    );
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
          bind:checked={profile.showHeader}
          on:change={handleShowHeader}
          type="checkbox" />
        <p>Show informational header on the posts in your feed.</p>
      </Label>
    </FormGroup>
  </Form>
</div>
