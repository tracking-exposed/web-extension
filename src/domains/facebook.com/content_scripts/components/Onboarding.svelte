<script>
  import Webtrex from "./Webtrex.svelte";
  import {
    Jumbotron,
    Form,
    FormGroup,
    Label,
    Input,
    Button
  } from "sveltestrap";

  export let hub;
  let agree = false;
  let display = true;

  function handleOptIn() {
    browser.runtime.sendMessage({ method: "setOptIn", params: [true] });
    hub.send("startScraping");
    display = false;
  }

  function handlePause() {
    browser.runtime.sendMessage({ method: "setPause", params: [true] });
    display = false;
  }
</script>

<style>
  .outer {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999999;
  }

  .inner {
    width: 90%;
    max-width: 800px;
    margin: 0 auto;
  }
</style>

{#if display}
  <Webtrex>
    <div class="outer">
      <div class="inner">
        <Jumbotron class="foobar">
          <h1>Thank you for installing Facebook Tracking Exposed!</h1>
          <p class="lead">
            We need your explicit consent to allow fbTREX to work.
          </p>
          <hr class="my-2" />
          <p>
            By opting in, you give us the right to process a copy of your
            Facebook timeline. We take your privacy very seriously, for more
            information check our
            <a
              target="_blank"
              href="https://facebook.tracking.exposed/what-we-collect/">
              Privacy Statement
            </a>
            .
          </p>

          <div>
            <Form>
              <FormGroup check>
                <Label check>
                  <Input bind:checked={agree} type="checkbox" />
                  <p>I agree to the Privacy Statement.</p>
                </Label>
              </FormGroup>
            </Form>
          </div>

          <p class="lead">
            <Button
              on:click={handleOptIn}
              color="primary"
              size="lg"
              disabled={!agree}>
              Close and continue
            </Button>
            <Button on:click={handlePause} color="secondary" outline size="lg">
              Ask me later
            </Button>
          </p>
        </Jumbotron>
      </div>
    </div>
  </Webtrex>
{/if}
