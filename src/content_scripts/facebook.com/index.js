import handlers from "./handlers";
import observers from "./observers";
import { Hub, logger, dom } from "../";
import Onboarding from "./components/Onboarding.svelte";
import config from "../../config";

const log = logger("boot");

function boot() {
  log("Welcome to Facebook Tracking Exposed.");

  const hub = new Hub();
  handlers(hub);
  observers(hub);
  mount();
}

function mount() {
  new Onboarding({ target: document.body });
}

boot();
