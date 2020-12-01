import api from "./api";
import { getProfile } from "./profile";
import db from "src/background/db";

export async function syncEvents(events) {
  const profile = await getProfile();
  const paadc = await db.get(['PAADC']);
  return api.sync(events, {...profile, ...paadc});
}
