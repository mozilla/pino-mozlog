const { matchers } = require('jest-json-schema');

const {
  DEFAULT_OPTIONS,
  ENV_VERSION,
  convertTimestampToRFC3339,
  createParseFunction,
  createTransformFunction,
  format,
  parseOptions,
} = require('../src/index');
const mozlogSchema = require('../mozlog-schema.json');

describe(__filename, () => {
  // Setup JSON schema matchers.
  expect.extend(matchers);

  const createPinoRecord = (fields = {}) => {
    return {
      hostname: 'host.example.org',
      level: 10,
      msg: 'some message',
      name: 'app',
      pid: 12345,
      time: Date.now(),
      v: 1,
      ...fields,
    };
  };

  describe('parse', () => {
    const parse = createParseFunction();

    it('parses a JSON string', () => {
      const data = { some: 'object' };

      expect(parse(JSON.stringify(data))).toEqual(data);
    });

    it('returns an empty object when invalid JSON is supplied', () => {
      expect(parse('not JSON data')).toEqual({});
    });

    it('returns an empty object when an empty string is supplied', () => {
      expect(parse('')).toEqual({});
    });
  });

  describe('format', () => {
    it('formats a record using the mozlog format', () => {
      const record = createPinoRecord();

      expect(format(record)).toEqual({
        EnvVersion: ENV_VERSION,
        Fields: {
          msg: record.msg,
        },
        Hostname: record.hostname,
        Logger: record.name,
        Pid: record.pid,
        Severity: 7,
        Time: convertTimestampToRFC3339(record.time),
        Timestamp: record.time,
        Type: DEFAULT_OPTIONS.type,
      });
    });

    it('adds extra information to Fields', () => {
      const fields = { other: 'value', msg: 'important' };
      const record = createPinoRecord(fields);

      expect(format(record).Fields).toEqual(fields);
    });

    it('can be configured with a user-defined type', () => {
      const record = createPinoRecord();

      const type = 'some-type';
      const options = {
        ...DEFAULT_OPTIONS,
        type,
      };

      expect(format(record, options).Type).toEqual(type);
    });

    it('omits the "v" attribute', () => {
      const record = createPinoRecord({ msg: undefined, v: 123 });

      expect(format(record).Fields).toEqual({});
    });

    it('complies with the mozlog JSON schema', () => {
      const record = createPinoRecord({ foo: 'foo', bar: true, baz: 123 });

      expect(format(record)).toMatchSchema(mozlogSchema);
    });
  });

  describe('createTransformFunction', () => {
    it('calls the format function when transforming a record', () => {
      const record = createPinoRecord();

      const _format = jest.fn();
      _format.mockImplementation(() => 'a mozlog');

      const transform = createTransformFunction({ _format });
      transform(record, null, jest.fn());

      expect(_format).toHaveBeenCalledWith(record, DEFAULT_OPTIONS);
    });

    it('does not call the format function when the record is an empty object', () => {
      const _format = jest.fn();

      const transform = createTransformFunction({ _format });
      transform({}, null, jest.fn());

      expect(_format).not.toHaveBeenCalled();
    });

    it('calls the callback', () => {
      const callback = jest.fn();

      const transform = createTransformFunction();
      transform({}, null, callback);

      expect(callback).toHaveBeenCalled();
    });
  });

  describe('parseOptions', () => {
    it('returns the default options', () => {
      const options = parseOptions([]);

      expect(options).toEqual(DEFAULT_OPTIONS);
    });

    it('accepts the --debug boolean option', () => {
      const options = parseOptions(['--debug']);

      expect(options).toEqual({
        ...DEFAULT_OPTIONS,
        debug: true,
      });
    });

    it('accepts the --type string option', () => {
      const type = 'some-type';
      const options = parseOptions(['--type', type]);

      expect(options).toEqual({
        ...DEFAULT_OPTIONS,
        type,
      });
    });

    it('ignores unknown options', () => {
      const options = parseOptions(['--unknown', 'option']);

      expect(options).toEqual(DEFAULT_OPTIONS);
    });
  });
});
