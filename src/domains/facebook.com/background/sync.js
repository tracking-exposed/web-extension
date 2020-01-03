import db from "src/background/db";
import api from "./api";
import { getProfile } from "./profile";

export async function syncEvents(events) {
  return api.sync(events, await getProfile());
}
