const minimist = require('minimist');
const pinoSyslog = require('pino-syslog/lib/utils');
const toRFC3339 = require('internet-timestamp');

const ENV_VERSION = '2.0';

const DEFAULT_OPTIONS = {
  silent: false,
  type: 'app.log',
};

const createParseFunction = ({
  _console = console,
  options = DEFAULT_OPTIONS,
} = {}) => {
  return (data) => {
    try {
      return JSON.parse(data);
    } catch (error) {
      if (!options.silent) {
        _console.error('[pino-mozlog] could not parse:', {
          error: error.toString(),
          data,
        });
      }
    }

    return {};
  };
};

const format = (
  {
    hostname,
    level,
    name,
    pid,
    time,
    v, // this field is ignored
    ...fields
  },
  options = DEFAULT_OPTIONS
) => {
  return {
    EnvVersion: ENV_VERSION,
    Fields: fields,
    Hostname: hostname,
    Logger: name,
    Pid: pid,
    Severity: pinoSyslog.levelToSeverity(level),
    Timestamp: time, // should be in nanoseconds
    Type: options.type,
  };
};

const createTransformFunction = ({
  _console = console,
  _format = format,
  options = DEFAULT_OPTIONS,
} = {}) => {
  return (record, enc, cb) => {
    try {
      if (typeof record.time === 'undefined') {
        throw new Error('invalid pino record');
      }

      _console.log(JSON.stringify(_format(record, options)));
    } catch (error) {
      if (!options.silent) {
        _console.error('[pino-mozlog] could not format:', {
          error: error.toString(),
          record,
        });
      }
    }

    cb();
  };
};

const parseOptions = (argv) => {
  const keys = Object.keys(DEFAULT_OPTIONS);
  const { _, ...options } = minimist(argv, {
    boolean: keys.filter((k) => typeof DEFAULT_OPTIONS[k] === 'boolean'),
    default: DEFAULT_OPTIONS,
    string: keys.filter((k) => typeof DEFAULT_OPTIONS[k] === 'string'),
    unknown: () => false,
  });

  return options;
};

module.exports = {
  DEFAULT_OPTIONS,
  ENV_VERSION,
  createParseFunction,
  createTransformFunction,
  format,
  parseOptions,
};
