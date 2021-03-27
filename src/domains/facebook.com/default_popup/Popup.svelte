<script>
  import { onMount } from "svelte";
  import Router from "svelte-spa-router";
  import { Container } from "sveltestrap";

  import Profiles from "./Profiles.svelte";

  const routes = {
    '/': Profiles,
  }
</script>

<style>
  .main {
    min-height: 150px;
  }
</style>


<div class="my-2 main">
  <Container fluid>
    <Router {routes} />
  </Container>
</div>
