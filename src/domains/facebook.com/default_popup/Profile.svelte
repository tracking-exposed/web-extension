<script>
  import { Button, Card, CardBody, Container, Col, Row } from "sveltestrap";
  import { onMount } from "svelte";

  export let inUse;
  export let profile;
</script>

<style>
  img {
    display: block;
    margin: auto;
  }
</style>

{#if inUse}
  <Card>
    <CardBody>
      <Container>
        <Row>
          <Col sm="3">
            <img src="https://graph.facebook.com/{profile.id}/picture?type=normal" alt="Avatar for user {profile.id}" />
          </Col>
          <Col sm="9">
            <p>You are logged in with this profile.</p>
            <a href="https://facebook.tracking.exposed/reality-check/#{profile.token}" class="btn btn-primary active" role="button" aria-pressed="true">Reality Check</a>
            <a href="#/settings" class="btn btn-secondary active" role="button" aria-pressed="true">Settings</a>
          </Col>
        </Row>
      </Container>
    </CardBody>
  </Card>
{:else}
  <Card>
    <CardBody>
      <img src="https://graph.facebook.com/{profile.id}/picture?type=normal" alt="Avatar for user {profile.id}" />
    </CardBody>
    <a href="https://facebook.tracking.exposed/reality-check/#{profile.token}" class="btn btn-primary btn-sm btn-block active" role="button" aria-pressed="true">Reality Check</a>
  </Card>
{/if}
