import db from "src/background/db";
import api from "./api";
import { getProfile } from "./profile";

export async function syncEvents(events) {
  console.log(events);
  api.sync(events, await getProfile());
}
