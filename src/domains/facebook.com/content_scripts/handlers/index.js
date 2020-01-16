import sync from "./sync";
import spy from "./spy";
import feed from "./feed";
import scrape from "./scrape";
import shield from "./shield";

export default function registerHandlers(hub) {
  spy(hub);
  sync(hub);
  feed(hub);
  scrape(hub);
  // shield(hub);
}
