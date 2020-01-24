<script>
  import { onMount } from "svelte";
  import Router from "svelte-spa-router";
  import { Container } from "sveltestrap";

  import Nav from "./Nav.svelte";
  import Profiles from "./Profiles.svelte";
  import Settings from "./Settings.svelte";
  import About from "./About.svelte";


  const routes = {
    '/': Profiles,
    '/settings': Settings,
    '/about': About,
  }
</script>

<style>
  main {
    min-height: 500px;
  }
</style>

<Nav />

<div class="my-2">
  <Container fluid>
    <Router {routes} />
  </Container>
</div>
