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
    min-width: 280px;
    min-height: 430px;
    margin: 0;
    overflow-x: hidden;
  }
</style>

<main class="webtrex">
  <article>
    <PopupFacebook />
  </article>
</main>
