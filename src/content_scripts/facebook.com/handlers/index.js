//import sync from './sync';
import spy from "./spy";
import feed from "./feed";
//import visualFeedback from './visualFeedback';
//import selector from './selector';

export default function registerHandlers(hub) {
  //sync(hub);
  spy(hub);
  feed(hub);
  //visualFeedback(hub);
  //selector(hub);
}
