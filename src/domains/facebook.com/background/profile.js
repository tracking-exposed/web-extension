import nacl from "tweetnacl";
import bs58 from "bs58";
import { Buffer } from "buffer";

import db from "src/background/db";

const PROFILE = {
  id: null,
  optIn: false,
  showHeader: true,
  address: null,
  publicKey: null,
  privateKey: null
};

// # Account
//
// Collection of functions to manage the profile of the user.
//

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

// ## getProfile
//
// Return information about the profile of the user
export async function getProfile() {
  const id = await getId();

  if (!id) {
    return;
  }

  const key = [id, "profile"].join(":");
  let profile = await db.get(key);

  if (!profile) {
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
    await db.set(key, profile);
  }

  return {
    ...profile,
    id
  };
}

// ## setOptIn
//
// OptIn is set when the user agrees on the privacy policy.
// It can be true or false.
export async function setOptIn(value) {
  const user = await getProfile();

  if (!user) {
    throw new Error("User is not logged in");
  }

  if (typeof value !== "boolean") {
    throw new Error("Value type must be boolean");
  }

  await db.update([user.id, "profile"], { optIn: value });
}

// ## setHideBanner
//
// Hide the banner from each post.
export async function setShowHeader(value) {
  const user = await getProfile();

  if (!user) {
    throw new Error("User is not logged in");
  }

  if (typeof value !== "boolean") {
    throw new Error("Value type must be boolean");
  }

  await db.update([user.id, "profile"], { showHeader: value });
}

// ## setPause
//
// Pause is used to notify the web extension to not scrape the feed anymore.
// It can be true or false.
export async function setPause(value) {
  const user = await getProfile();

  if (!user) {
    throw new Error("User is not logged in");
  }

  if (typeof value !== "boolean") {
    throw new Error("Value type must be boolean");
  }

  await db.update([user.id, "profile"], { pause: value });
}
