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
    width: 600px;
    margin: 0;
  }

  main {
    min-width: 500px;
  }

  nav {
    background-color: #1b1b1b;
    border-bottom: 8px solid #53c1b6;
    margin-bottom: 20px;
  }
</style>

<main class="webtrex">
  <nav>
    <Navbar expand="md">
      <NavbarBrand href="">
        <img
          src="../images/header-logo-default.svg"
          alt="Tracking Exposed Logo" />
      </NavbarBrand>
    </Navbar>
  </nav>

  <article>
    <Container>
      <PopupFacebook />
    </Container>
  </article>
</main>
