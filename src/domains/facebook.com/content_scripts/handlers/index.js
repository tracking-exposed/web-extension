//import sync from './sync';
import spy from "./spy";
import feed from "./feed";
import shield from "./shield";
//import visualFeedback from './visualFeedback';
//import selector from './selector';

export default function registerHandlers(hub) {
  //sync(hub);
  spy(hub);
  feed(hub);
  shield(hub);
  //visualFeedback(hub);
  //selector(hub);
}
