import api from "./api";
import { getProfile } from "./profile";
import db from "src/background/db";

export async function getUserInfo(profile) {
  const uniqueMsg = `key ${profile.publicKey}@${
    profile.id
  } RAND: ${Math.random()}@${new Date()}`;
  const data = {
    message: uniqueMsg,
    userId: profile.id,
    version: "2.0.0",
    publicKey: profile.publicKey,
    optin: profile.optin
  };

  return api.userInfo(data, profile);
}

export async function refreshUserInfo(alarmInfo) {
  let profile = await getProfile();
  const userInfo = await getUserInfo(profile);
  await db.update([profile.id, "profile"], {
    selector: userInfo.selector,
    token: userInfo.token
  });

  // Reload the profile with the updated values
  profile = await getProfile();

  const tabs = await browser.tabs.query({
    currentWindow: true,
    active: true
  });

  tabs.forEach(tab =>
    browser.tabs.sendMessage(tab.id, {
      method: "updateConfig",
      params: [profile]
    })
  );
}
