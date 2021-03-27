<script>
  import { Button, Card, CardFooter, CardBody, CardHeader, Container, Col, Row } from "sveltestrap";
  import { onMount } from "svelte";

  export let inUse;
</script>

<style>
  .textual {
    padding: 10px;
    text-align: left;
  }

  .borderless {
    text-align: center;
    border: 0px !important;
  }
</style>

{#if inUse}
  <Card>
    <div class="borderless">
      <CardBody>
        <img src="../images/uva-logo-256.png" alt="University of Amsterdam Logo" />
        <p class="textual">
          Namens de UvA, de Volkskrant en I&O research, hartelijk dank voor deelname aan dit onderzoek naar politieke advertenties op Facebook.
          <br>
          Deze plugin is inactief en verzamelt geen data, u kunt deze verwijderen uit uw browser.
        </p>
      </CardBody>
    <!-- <CardFooter class="no-border"> </CardFooter> -->
    </div>
  </Card>
{:else}
  <Card>
    <CardBody>
      <p class="textual">Deze plugin is inactief en verzamelt geen data, u kunt deze verwijderen uit uw browser.</p>
    </CardBody>
  </Card>
{/if}
