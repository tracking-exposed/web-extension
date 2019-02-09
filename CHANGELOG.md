The format is based on [Keep a Changelog](http://keepachangelog.com/) and this
project adheres to [Semantic Versioning](http://semver.org/).

## [1.1.19] - 2019-02-07
## Fixed
- A bug was reporting malfunction when in fact was functioning
## Addedd
- Incremental copy of built extension in https://github.com/tracking-exposed/binaries repository
- Italian localization support

## [1.1.18] - 2019-01-02
### Fixed
- België language
### Added
- Estonian, Icelandinc, and Polish language
- detection of unsupported language and notice for the adopter

## [1.1.17] - 2018-12-17
### Fixed
- Bump version because of disalignment between chrome/firefox stores

## [1.1.16] - 2018-07-18
### Fixed
- lack of short\_name in manifest.json
- optin more clear, with only one checkbox
- removed `git` requirement in building process
## Added
- experimental feature to do interaction with tracking.exposed domain

## [1.1.15] - 2018-07-10
### Added
- optIn procedure, localized in all the three languages

## [1.1.14] - 2018-06-01 -- not released yet 
### Fixed
- link generated is not anymore to `realitycheck` which get discontinued, but to `personal`
- renamed again, now is **tracking.exposed: distributed algorithm analysis**
### Added
- retrival of personal authentication token, to connect securely to `personal` section

## [1.1.13] - 2018-05-09
### Fixed
- small rename, because we got the extension take down for trademark infringment on Google store [#72](https://github.com/tracking-exposed/web-extension/issues/72)

## [1.1.12] - 2017-11-30
### Fixed
- onboarding box not display anymore [#68](https://github.com/tracking-exposed/web-extension/issues/68).
- changed color in the facebook banner, totally not [#63](https://github.com/tracking-exposed/web-extension/issues/63).

## [1.1.11] - 2017-09-28
### Added
- support for selector API
### Fixed
- selector
- onboarding is not mandatory anymore
- onboarding show up reduced

## [1.1.10] - 2017-09-23
### Fixed
- selector

## [1.1.9] - 2017-09-19
### Added
- Anomaly detection first prototype
### Fixed
- not displayed popup

## [1.1.8] - 2017-08-11
### Added
- Firefox support
### Fixed
- a typo in EN localization template

## [1.1.7] - 2017-08-10
### Fixed
- Update selector for posts
- Onboarding was adding a weird margin to the main feed, so we changed the
  anchor point

## [1.1.6] - 2017-06-17
### Fixed
- onboarding was broken since 1.1.5, revert selector

## [1.1.5] - 2017-06-15
### Added
- Norvegian and Slovenian languages
- multiple W3C selectors for new posts

## [1.1.4] - 2017-06-12
### Added
- i18n support
- messages translated in PT\_br

## [1.1.3] - 2017-05-26
### Fixed
- Update selector for posts

## [1.1.2] - 2017-03-09
### Fixed
- landing page link is not to /recent but to /data
- noisy error in console

## [1.1.1] - 2017-03-03
### Fixed
- onBoarding text changed to be more userfriendly

## [1.1.0] - 2017-03-02
### Added
- Popup with settings configuration to: 1) display less information on the news
  feed; 2) specify tagId if the user is part of a study group.

## [1.0.6] - 2017-02-20
### Added
- when a post appears in the newsfeed, an info box is added at the top of the
  post itself, so the user has a better understanding of what is scraped and
  what is not.

### Fixed
- The CSS selector used to spot the facebook post is changed again.

## [1.0.5] - 2017-11-02
### Fixed
- Facebook changed the main class wrapping the newsfeed from
  `.userContentWrapper` to `.fbUserContent`, the code has been changed to
  reflect this change. See [Issue #25](https://github.com/tracking-exposed/web-extension/issues/25)

## [1.0.4] - 2016-13-05
### Fixed
- Onboarding is now more prominent and can be closed.
- `API` url is `https://facebook.tracking.exposed/`

## [1.0.3] - 2016-12-05
### Fixed
- Add missing `startTime` to timeline event.

## [1.0.2] - 2016-12-05
### Fixed
- Permalink works also when the user has a vanity URL.

## [1.0.1] - 2016-12-05
### Fixed
- `userId` is retrieved using `document.cookie`. Before it was scraped from the
current HTML page (and this failed in some cases).

## [1.0.0] - 2016-11-26
### Added
- Create first release of the extension
