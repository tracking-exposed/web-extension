import * as account from "./account";

const mapping = {
  ...account
};

// ## Dispatch requests
//
// The `content_script` needs to communicate to the `background` page to send
// and receive information, e.g.:
//
// - Get information about the current user.
// - Send the scraped post.
// - ...
//
// Here we connect the "backend functions" (where *backend* here is intended as
// the **background page**) to a dispatcher.
//
// It's **not** a good practice to plug an async fuction as a listener.
// The Mozilla documentation [says][1]:
//
// > Do not call addListener using the async function [...] as the listener
// will consume every message it receives, effectively blocking all other
// listeners from receiving and processing messages.
//
// You may notice that there is no `sendMessage` in the `addListener` callback.
// Returning a Promise is now preferred as sendResponse will be removed from
// the [W3C spec][2]. The popular [webextension-polyfill library][3] has
// already removed the sendResponse function from its implementation.
browser.runtime.onMessage.addListener(({ method, params }, sender) => {
  const func = mapping[method];

  params = params === undefined ? [] : params;

  console.log(
    `Dispatch ${method}(${params.join(", ")}) from ${JSON.stringify(sender)}`
  );

  if (!func) {
    return Promise.reject(new Error(`Method "${method}" not supported.`));
  }

  return func(...params);
});

//
// [1]: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessage
// [2]: https://github.com/mozilla/webextension-polyfill/issues/16#issuecomment-296693219
// [3]: https://github.com/mozilla/webextension-polyfill
