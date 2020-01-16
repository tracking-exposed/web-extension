<script>
  import { onMount } from "svelte";
  import { Alert } from "sveltestrap";

  import Settings from "./Settings.svelte";

  let profile = browser.runtime.sendMessage({
    method: "getProfile"
  });
</script>

{#await profile then value}
{#if !value}
  <Alert color={"warning"}>
    <h4 class="alert-heading">You are not logged in Facebook.com</h4>
    In order to make the extension work, please log in to facebook.com.
  </Alert>
{/if}
{/await}

<h1>Facebook Tracking Exposed</h1>
<p>
  Dear friend, thanks for supporting this initiative.
</p>
<p>
  We care a lot about your privacy and we want to be as transparent as possible,
  that's why:
</p>

<ul>
  <li>
    Join the
    <a
      href="https://chat.securitywithoutborders.org/community/channels/trackingexposed">
      chat
    </a>
    to know more or to meet us.
  </li>

  <li>
    The extension only see and collects the
    <strong>public posts</strong>
    . You will know that public posts are being recorded by a notification
    highlighting them in your newsfeed.
  </li>

  <li>
    We have a
    <a href="https://facebook.tracking.exposed/privacy">Privacy Statement</a>
    that describes what data we collect, and why.
  </li>

  <li>
    We release only
    <a href="https://github.com/tracking-exposed/">free, open source code</a>
    everyone can audit.
  </li>
</ul>

{#await profile then value}
  {#if value}
  <h2>Settings</h2>
  <Settings bind:profile />
  {/if}
{/await}
