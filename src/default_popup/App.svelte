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
    min-width: 600px;
    margin: 0;
    overflow-x: hidden;
  }

  nav {
    background-color: #1b1b1b;
    box-shadow: 0 2px 2px 2px rgba(0, 0, 0, 0.5);
    /* border-bottom: 8px solid #53c1b6; */
  }

  img {
    width: 250px;
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
    <PopupFacebook />
  </article>
</main>
