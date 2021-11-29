# CHANGELOG

## 2.8.0

Update `split2` to v4 (see #68).

## 2.7.0

No changes (lockfile maintenance only).

## 2.6.0

No changes (lockfile maintenance only).

## 2.5.0

No changes (lockfile maintenance only).

## 2.4.0

No changes (lockfile maintenance only).

## 2.3.0

No changes (lockfile maintenance only).

## 2.2.0

Use `readable-stream` instead of `through2` (see #33).

## 2.1.0

Each record contains a new `severity` field (all lowercase), which corresponds to the Stackdriver logging level.

## 2.0.0

**Breaking change:** the `Time` field has been dropped (it was an optional field according to the [mozlog specification](https://wiki.mozilla.org/Firefox/Services/Logging) anyway).

**Breaking change:** the `Timestamp` field now receives the value of the `time` field of a `pino` log. Before, `pino-mozlog` was "converting" `time` from milliseconds to nanoseconds (`time * 1000000`). Now, `pino` logs MUST have `time` values in nanoseconds.
