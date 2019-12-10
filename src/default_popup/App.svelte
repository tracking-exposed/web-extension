<script>
  import {
    Navbar,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    Col,
    Container,
    Row
  } from "sveltestrap";
  import PopupFacebook from "src/domains/facebook.com/default_popup/Popup.svelte";
</script>

<style>
  :global(body) {
    margin: 0;
  }

  main {
    min-width: 500px;
  }
</style>

<main class="webtrex">
  <Navbar color="light" light expand="md">
    <NavbarBrand href="/">sveltestrap</NavbarBrand>
  </Navbar>

  <Container>
    <Row>
      <PopupFacebook />
    </Row>
  </Container>
</main>
