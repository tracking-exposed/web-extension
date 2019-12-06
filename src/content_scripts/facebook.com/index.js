import handlers from "./handlers";
import observers from "./observers";
import { Hub, logger, dom } from "../";
import Onboarding from "./components/Onboarding.svelte";
import config from "../../config";

const log = logger("boot");

function boot() {
  console.log(
    "%c Welcome to WEBTREX!",
    "font-weight: bold; font-size: 50px;color: red; text-shadow: 3px 3px 0 rgb(217,31,38) , 6px 6px 0 rgb(226,91,14) , 9px 9px 0 rgb(245,221,8) , 12px 12px 0 rgb(5,148,68) , 15px 15px 0 rgb(2,135,206) , 18px 18px 0 rgb(4,77,145) , 21px 21px 0 rgb(42,21,113)"
  );

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
