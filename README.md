# pino-mozlog

[![Build Status](https://travis-ci.org/willdurand/pino-mozlog.svg?branch=master)](https://travis-ci.org/willdurand/pino-mozlog)

A transport for transforming pino logs into [mozlog](https://wiki.mozilla.org/Firefox/Services/Logging#MozLog_application_logging_standard).

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

By default, errors are sent to `stderr` (not formatted for mozlog). You can disable this behavior with `--silent`:

```
$ node your-app.js | pino-mozlog --silent
```

## License

pino-mozlog is released under the Mozilla Public License Version 2.0. See the bundled [LICENSE](./LICENSE.txt) file for details.
