The format is based on [Keep a Changelog](http://keepachangelog.com/) and this
project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]
### Added
- when a post appears in the newsfeed, an info box is added at the top of the
  post itself, so the user has a better understanding of what is scraped and
  what is not.

### Changed
- API endpoint is now `https://collector.facebook.tracking.exposed/`

### Fixed
- Nothing yet.

### Removed
- Nothing yet.

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
