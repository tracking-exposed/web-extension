<script>
  import { Button, Card, CardFooter, CardBody, CardHeader, Container, Col, Row } from "sveltestrap";
  import { onMount } from "svelte";

  export let inUse;
  export let profile;
</script>

<style>
  .textual {
    padding: 10px;
  }

  .borderless {
    border: 0px;
  }
</style>

{#if inUse}
  <Card class="borderless">
    <CardBody class="borderless">
      <img src="../images/trex-logo-256.png" alt="University of Amsterdam Logo" />
      <p class="textual">Namens de UvA, de Volkskrant en I&O research, hartelijk dank voor deelname aan dit onderzoek naar politieke advertenties op Facebook. U kunt ten alle tijden participatie in het onderzoek stopzetten, zie ook ons <a target=_blank href="https://algorithms.exposed/paadc-privacy-statement/">privacy statement</a>.</p>
    </CardBody>
    <!--
    <CardFooter class="no-border">
    </CardFooter> -->
  </Card>
{:else}
  <Card>
    <CardBody>
      Anything here? https://algorithms.exposed/paadc-privacy-statement/
    </CardBody>
  </Card>
{/if}
