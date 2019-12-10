import db from "src/background/db";

// # Account
//
// Collection of functions to manage the current user.

// ## getCurrentUser
//
// Return information about the current user.
export async function getCurrentUser() {
  const cUserCookie = await browser.cookies.get({
    url: "https://www.facebook.com/",
    name: "c_user"
  });

  if (!cUserCookie) {
    return;
  } else {
    const id = cUserCookie.value;
    const key = [id, "profile"].join(":");
    const profile = await db.get(key);
    return {
      id,
      ...profile
    };
  }
}

// ## setOptIn
//
// OptIn is set when the user agrees on the privacy policy.
// It can be true or false.
export async function setOptIn(value) {
  const user = await getCurrentUser();

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
export async function setHideBanner(value) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("User is not logged in");
  }

  if (typeof value !== "boolean") {
    throw new Error("Value type must be boolean");
  }

  await db.update([user.id, "profile"], { hideBanner: value });
}

// ## setPause
//
// Pause is used to notify the web extension to not scrape the feed anymore.
// It can be true or false.
export async function setPause(value) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("User is not logged in");
  }

  if (typeof value !== "boolean") {
    throw new Error("Value type must be boolean");
  }

  await db.update([user.id, "profile"], { pause: value });
}
