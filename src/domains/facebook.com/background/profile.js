import db from "src/background/db";

const PROFILE = {
  id: null,
  optIn: false,
  showHeader: true
};

// # Account
//
// Collection of functions to manage the profile of the user.

// ## getProfile
//
// Return information about the profile of the user
export async function getProfile() {
  const cUserCookie = await browser.cookies.get({
    url: "https://www.facebook.com/",
    name: "c_user"
  });

  if (!cUserCookie) {
    return;
  } else {
    const id = cUserCookie.value;
    const key = [id, "profile"].join(":");
    let profile = await db.get(key);
    if (!profile) {
      // Create keypair
      profile = { ...PROFILE };
      await db.set(key, profile);
    }
    return {
      ...profile,
      id
    };
  }
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
