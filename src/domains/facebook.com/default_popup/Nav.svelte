<script>
  import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
  } from 'sveltestrap';

  let isOpen = false;

  function handleUpdate(event) {
    isOpen = event.detail.isOpen;
  }
</script>

<style>
  nav {
    background-color: #3b5898;
  }
</style>

<nav>
  <Navbar dark expand="xs">
    <NavbarBrand href="#">fbTREX</NavbarBrand>
    <NavbarToggler on:click={() => (isOpen = !isOpen)} />
    <Collapse {isOpen} navbar expand="xs" on:update={handleUpdate}>
      <Nav class="mr-auto" navbar>
      <!--
        <NavItem>
          <NavLink href="#/">Home</NavLink>
        </NavItem>
      -->
        <NavItem>
          <NavLink href="#/settings">Settings</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="#/about">About</NavLink>
        </NavItem>
      </Nav>
    </Collapse>
  </Navbar>
</nav>
