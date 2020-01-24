<script>
  import { onMount } from "svelte";

  import { Alert, Form, FormGroup, Input, Label } from "sveltestrap";

  let profile;

  onMount(async () => {
    profile = await browser.runtime.sendMessage({
      method: "getProfile"
    });
  });

  async function handleShowHeader() {
    console.log('profile.showHeader', profile.showHeader);
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

  async function handlePauseScraping() {
    console.log('profile.pauseScraping', profile.pauseScraping);
    browser.runtime.sendMessage({
      method: "setPauseScraping",
      params: [profile.pauseScraping]
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

<h2>Settings</h2>
{#if profile}
  <div>
    <Form>
      <FormGroup check>
        <Label check>
          <p><input
            bind:checked={profile.showHeader}
            on:change={handleShowHeader}
            type="checkbox" />
          Show informational header on the posts in your feed.</p>
        </Label>
      </FormGroup>
      <FormGroup check>
        <Label check>
          <p><input
            bind:checked={profile.pauseScraping}
            on:change={handlePauseScraping}
            type="checkbox" />
          Pause extension from analyzing your feed.</p>
        </Label>
      </FormGroup>
    </Form>
  </div>
{:else}
  <Alert color="warning" fade={false}>
    <h4 class="alert-heading">You are not logged in</h4>
    Please log in to Facebook.com to see something here.
  </Alert>
{/if}
