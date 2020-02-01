<script>
  import { Alert, Col, Row } from "sveltestrap";
  import { onMount } from "svelte";
  import Profile from "./Profile.svelte";

  let profileInUse;
  let profiles = [];
  let ready;

  onMount(async () => {
    profileInUse = await browser.runtime.sendMessage({
      method: "getProfile",
      params: [undefined, true]
    });
    profiles = await browser.runtime.sendMessage({
      method: "getProfiles",
      params: [true]
    });
    if (profileInUse) {
      profiles = profiles.filter(p => p.id != profileInUse.id);
    }
    ready = true;
  });
</script>

{#if ready}
  {#if profileInUse}
    <section class="mb-4">
      <h2>Profile in use</h2>
      <Profile inUse profile={profileInUse} />
    </section>
  {:else}
    <Alert color="warning" fade={false}>
      <h4 class="alert-heading">You are not logged in</h4>
      Please log in to Facebook.com to see something here.
    </Alert>
  {/if}

  {#if profiles.length}
    <section class="mb-4">
      <h2>Other profiles</h2>
      <Row>
        {#each profiles as profile}
          <Col sm="4">
            <Profile {profile} />
          </Col>
        {/each}
      </Row>
    </section>
  {/if}
{/if}
