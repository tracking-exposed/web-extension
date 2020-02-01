import nacl from "tweetnacl";
import bs58 from "bs58";
import { Buffer } from "buffer";
import * as v1 from "./v1";
import { getUserInfo } from "./userInfo";

import db from "src/background/db";

const PROFILE = {
  id: null,
  optIn: false,
  showHeader: true,
  pauseScraping: false,
  scrapeOutsideRoot: false,
  address: null,
  publicKey: null,
  secretKey: null,
  token: null,
  selector: ".userContentWrapper"
};

// # Account
//
// Collection of functions to manage the profile of the user.

// ## newProfile
//
// Create a new profile for user `id`.
export async function newProfile(id) {
  let profile;
  // Check if we need to migrate the profile from v1 to v2
  const v1Profile = await v1.getProfile(id);
  if (v1Profile) {
    console.info("Import profile from v1.0", v1Profile);
    profile = {
      ...PROFILE,
      ...v1Profile
    };
  } else {
    // Create keypair
    const keypair = nacl.sign.keyPair();
    profile = {
      ...PROFILE,
      address: bs58.encode(Buffer.from(keypair.publicKey)),
      publicKey: Array.from(keypair.publicKey),
      // Todo: check if it's safe to share the private key with the
      // content script.
      secretKey: Array.from(keypair.secretKey)
    };
  }

  profile = { ...profile, id };
  await db.set("profiles", profiles => [...profiles, id], []);
  return profile;
}

// ## getId
//
// Return the user id stored in the session cookie
export async function getId() {
  const cUserCookie = await browser.cookies.get({
    url: "https://www.facebook.com/",
    name: "c_user"
  });
  return cUserCookie ? cUserCookie.value : null;
}

// ## getIds
//
// Return the list of user ids stored in the extension.
export async function getIds() {
  return await db.get("profiles", []);
}

// ## getProfile
//
// Return information about the profile of the user
export async function getProfile(id) {
  id = id || (await getId());

  // User is not logged in Facebook, so there is no profile to retrieve.
  if (!id) {
    return;
  }

  let profile = await db.get([id, "profile"]);

  if (!profile) {
    profile = await newProfile(id);
    await db.set([id, "profile"], profile);
  }

  return profile;
}

// ## getProfiles
//
// Return the list of all profiles managed by the extension
export async function getProfiles() {
  const ids = await getIds();
  const profiles = [];
  for (let id of ids) {
    profiles.push(await getProfile(id));
  }
  return profiles;
}

// ## loadProfile
//
// Load the profile fetching the new token and selector from the remote API,
// and return the profile.
export async function loadProfile() {
  const profile = await getProfile();

  if (!profile) {
    return;
  }

  const userInfo = await getUserInfo(profile);

  await db.update([profile.id, "profile"], {
    selector: userInfo.selector,
    token: userInfo.token
  });

  return await db.get([profile.id, "profile"]);
}

// ## setOptIn
//
// OptIn is set when the user agrees on the privacy policy.
// It can be true or false. When a user opts in, the current selector and the
// user's token are retrieved from the backend.
export async function setOptIn(value) {
  const profile = await getProfile();

  if (!profile) {
    throw new Error("User is not logged in");
  }

  if (typeof value !== "boolean") {
    throw new Error("Value type must be boolean");
  }

  await db.update([profile.id, "profile"], {
    optIn: value
  });
}

// ## setShowHeader
//
// Hide the banner from each post.
export async function setShowHeader(value) {
  const profile = await getProfile();

  if (!profile) {
    throw new Error("User is not logged in");
  }

  if (typeof value !== "boolean") {
    throw new Error("Value type must be boolean");
  }

  await db.update([profile.id, "profile"], { showHeader: value });
}

// ## setPauseScraping
//
// Pause is used to notify the web extension to not scrape the feed anymore.
// It can be true or false.
export async function setPauseScraping(value) {
  const profile = await getProfile();

  if (!profile) {
    throw new Error("User is not logged in");
  }

  if (typeof value !== "boolean") {
    throw new Error("Value type must be boolean");
  }

  await db.update([profile.id, "profile"], { pauseScraping: value });
}

// ## setScrapeOutsideRoot
//
// Pause is used to notify the web extension to not scrape the feed anymore.
// It can be true or false.
export async function setScrapeOutsideRoot(value) {
  const profile = await getProfile();

  if (!profile) {
    throw new Error("User is not logged in");
  }

  if (typeof value !== "boolean") {
    throw new Error("Value type must be boolean");
  }

  await db.update([profile.id, "profile"], { scrapeOutsideRoot: value });
}
