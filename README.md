# [WIP] webtrex

Webtrex is the new web extension for all [tracking.exposed](https://tracking.exposed) projects.

## Developing

Should be as easy as:

```bash
npm i
npm start
```

The command will run a new instance of Chromium with the extension preinstalled. If you want to try it on FireFox, run:

```bash
npm run start:firefox
```

More info later.

### Adding new domains

Don't forget is to use the [webextension-polyfill](https://github.com/mozilla/webextension-polyfill) when working on new things.
