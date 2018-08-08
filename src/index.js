const minimist = require('minimist');
const pinoSyslog = require('pino-syslog/lib/utils');
const toRFC3339 = require('internet-timestamp');

const ENV_VERSION = '2.0';

const DEFAULT_OPTIONS = {
  type: 'app.log',
  silent: false,
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

const convertTimestampToRFC3339 = (timestamp) => {
  return toRFC3339(new Date(timestamp));
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
    Time: convertTimestampToRFC3339(time),
    Timestamp: time,
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
  convertTimestampToRFC3339,
  createParseFunction,
  createTransformFunction,
  format,
  parseOptions,
};
