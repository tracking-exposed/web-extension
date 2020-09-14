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

  async function handleOptIn() {
    await browser.runtime.sendMessage({ method: "setOptIn", params: [true] });
    const profile = await browser.runtime.sendMessage({
      method: "loadProfile"
    });
    hub.send("updateConfig", profile);
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
          <h1>Thank you for joining Trex!</h1>
          <p class="lead">
            We want to make sure you know <a
              target="_blank"
              href="https://facebook.tracking.exposed/what-we-collect/">
              what we collect</a>,
              and you consent to the processing of personal data that are strictly necessary for the research.
          </p>
          <hr />
          <p>
            By opting in, you give us the right to process a copy of your Facebook timeline.
            Our interest is research and analysis on personalization algorithms, not personal data exploitation, businesses, or any other exchange.
          </p>

          <div>
            <Form>
              <FormGroup check>
                <Label check>
                  <Input bind:checked={agree} type="checkbox" />
                  <p>I have read the <a
                    target="_blank"
                    href="https://facebook.tracking.exposed/what-we-collect/">
                    information notice 
                    </a>, and I consent to processing operations strictly necessary for participating to the research.
                  </p>
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
