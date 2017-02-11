The format is based on [Keep a Changelog](http://keepachangelog.com/) and this
project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]
### Added
- Nothing yet.

### Changed
- Onboarding is now more prominent and can be closed.
- `API` url is `https://facebook.tracking.exposed/`

### Fixed
- Nothing yet.

### Removed
- Nothing yet.

## [1.0.5] - 2017-11-02
### Fixed
- Facebook changed the main class wrapping the newsfeed from
  `.userContentWrapper` to `.fbUserContent`, the code has been changed to
  reflect this change. See [Issue #25](https://github.com/tracking-exposed/web-extension/issues/25)

## [1.0.4] - 2016-13-05
### Fixed
- A more robust onboard message and UX
- removed `collector.` subdomain from the URL

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
