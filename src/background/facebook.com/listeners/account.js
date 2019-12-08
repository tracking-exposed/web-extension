// # Account
//
// Collection of functions to manage the current user.

// ## getCurrentUser
//
// Returns information about the current user.
export async function getCurrentUser() {
  const cUser = await browser.cookie.get({
    url: "https://www.facebook.com/",
    name: "c_user"
  });
}
