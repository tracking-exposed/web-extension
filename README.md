# PAADC is the rebranded version of 'facebook.tracking.exposed' for a joint project lead by University of Amsterdam

### web extension reviewer 

Dear reviewer, to rebuild the browser extension you've to run these commands:

```bash
npm install
npm run dist
```

This command shall produce a compressed file in dist/
This file is the one submitted to Firefox and Google store.

### Developer? Prepare

Install dependencies:

```bash
npm install
```

Start the build process:

```bash
npm run build:watch
```

### Run

Launch a new instance of Firefox or Chromium (you need to run this from another terminal, since the previous command needs to keep running). For Firefox, run:

```bash
npm run start:firefox
```

For chromium, run:

```bash
npm run start:chromium
```

**Important**: keep in mind that those browser instances are temporary. If you close the browser or kill the process that launched the browser, all data will be lost. This is a feature, not a bug, since it allows you to always test the extension on a fresh install. Check the FAQ for more info.


The command will build the extension, run the linter, and pack it in a zip file.

## FAQ

### I'm annoyed because I have to log in to the social network I'm testing all the time

Everytime you launch the browser you start with new cookies, new local storage, new everything. This means that if you open facebook.com you have to enter email and password on a fresh browser start.

We have a dev feature called **autologin**. If you've followed the previous steps correctly, you should have a file called `.env` (that is a copy of `.env_template`). To enable **autologin** put your email in `AUTOLOGIN_EMAIL` and your password in `AUTOLOGIN_PASSWORD`. Reload the page and... voilà you are logged in. (OK to be honest sometimes facebook complains, just give it another try, it works!)

### I need to test the extension in my browser and I want to load it manually

After the first successful execution of `build:watch`, you should find under the `build` directory the compiled extension. You can manually load the *unpacked extension* in your browser. If you need help, check how to do it on [Firefox](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension#Installing) and [Chrom(e|ium](https://developer.chrome.com/extensions/getstarted).

## Adding new domains

Don't forget is to use the [webextension-polyfill](https://github.com/mozilla/webextension-polyfill) when working on new things.
