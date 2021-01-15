import api from "./api";
import { getProfile } from "./profile";
import db from "src/background/db";

export async function getUserInfo(profile) {
  const uniqueMsg = `RAND:${Math.random()}@${new Date()}`;
  const data = {
    message: uniqueMsg,
    paadcId: profile.exactId,
    publicKey: profile.publicKey
  };

  return api.userInfo(data, profile);
}

export async function refreshUserInfo(alarmInfo) {
  let profile = await getProfile();
  if (!profile) {
    console.info("User is not logged in, skip");
    return;
  }
  console.info("Refresh user info");
  const userInfo = await getUserInfo(profile);
  await db.update([NAMESPACE, profile.id, "profile"], {
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
