# pino-mozlog

[![CircleCI](https://circleci.com/gh/mozilla/pino-mozlog.svg?style=svg)](https://circleci.com/gh/mozilla/pino-mozlog) [![npm version](https://badge.fury.io/js/pino-mozlog.svg)](https://badge.fury.io/js/pino-mozlog)

A transport for transforming [pino logs](https://github.com/pinojs) into [mozlog](https://wiki.mozilla.org/Firefox/Services/Logging#MozLog_application_logging_standard).

## Installation

```
$ npm i pino-mozlog
```

## Usage

This transport only reformats the logs into mozlog compatible strings:

```
$ node your-app.js | pino-mozlog
```

You can specify the mozlog type:

```
$ node your-proxy.js | pino-mozlog --type proxy
```

By default, errors are sent to `stderr` (not mozlog-compliant though). You can disable this behavior and ignore all errors with `--silent`:

```
$ node your-app.js | pino-mozlog --silent
```

## License

pino-mozlog is released under the Mozilla Public License Version 2.0. See the bundled [LICENSE](./LICENSE.txt) file for details.
