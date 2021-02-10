const util = require('util');
const exec = util.promisify(require('child_process').exec);

describe('functional tests', () => {
  it('converts pino logs to mozlog', async () => {
    const { stdout } = await exec(
      'cat __tests__/fixtures/frontend.log | node index.js'
    );

    console.log(`${stdout}`);
    expect(stdout).toMatchSnapshot();
  });
});
