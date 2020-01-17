<script>
  import { onMount } from "svelte";
  import Settings from "./Settings.svelte";

  let profile = {};

  onMount(async () => {
    profile = await browser.runtime.sendMessage({
      method: "getProfile"
    });
  });
</script>

<h1>Facebook Tracking Exposed</h1>
<p>
  Dear friend, thanks for supporting the facebook.tracking.exposed initiative.
</p>
<p>
  We care a lot about your privacy and we want to be as transparent as possible,
  that's why:
</p>

<ul>
  <li>
    Join the
    <a
      href="https://chat.securitywithoutborders.org/community/channels/trackingexposed"
      target="_blank">
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
    <a href="https://facebook.tracking.exposed/privacy" target="_blank">Privacy Statement</a>
    that describes what data we collect, and why.
  </li>

  <li>
    We release only
    <a href="https://github.com/tracking-exposed/" target="_blank">free, open source code</a>
    everyone can audit.
  </li>
</ul>

<h2>Settings</h2>
<Settings bind:profile />
