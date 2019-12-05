browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(request);
});
