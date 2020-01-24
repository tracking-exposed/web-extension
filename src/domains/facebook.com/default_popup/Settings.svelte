<script>
  import { onMount } from "svelte";
  import { Alert } from "sveltestrap";

  let ready;
  let profile;
  let showAdvanced;
  $: mustShowAdvanced = profile && profile.scrapeOutsideRoot;

  onMount(async () => {
    profile = await browser.runtime.sendMessage({
      method: "getProfile"
    });
    // If advanced features have been enabled, show advanced stuff.
    showAdvanced = profile.scrapeOutsideRoot;
  });

  async function handleOption(name, value) {
    browser.runtime.sendMessage({
      method: name,
      params: [value]
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
  <div class="form-check">
    <label class="form-check-label">
      <input
          bind:checked={profile.showHeader}
          on:change={() => handleOption("setShowHeader", profile.showHeader)}
          type="checkbox" />
      Show informational header on the posts in your feed.
    </label>
  </div>

  <div class="form-check">
    <label class="form-check-label">
      <input
          bind:checked={profile.pauseScraping}
          on:change={() => handleOption("setPauseScraping", profile.pauseScraping)}
          type="checkbox" />
      Pause extension from analyzing your feed.
    </label>
  </div>

  <div class="form-check">
    <label class="form-check-label">
      <input
          disabled={mustShowAdvanced}
          bind:checked={showAdvanced}
          type="checkbox" />
      Show dangerous features.
    </label>
  </div>
{:else}
  <Alert color="warning" fade={false}>
    <h4 class="alert-heading">You are not logged in</h4>
    Please log in to Facebook.com to see something here.
  </Alert>
{/if}

{#if showAdvanced || mustShowAdvanced}
  <h3 class="mt-2">Dangerous Features</h3>
  <Alert color="danger" fade={false}>
    Those options can violate our privacy statement, use them at your own risk!
  </Alert>

  <div class="form-check">
    <label class="form-check-label">
      <input
          bind:checked={profile.scrapeOutsideRoot}
          on:change={() => handleOption("setScrapeOutsideRoot", profile.scrapeOutsideRoot)}
          type="checkbox" />
      Analyze posts outside your personal feed.
    </label>
  </div>
{/if}
