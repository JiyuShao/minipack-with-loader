import path from 'path';
import minipack from '../src/index';

describe('minipack-with-loader', () => {
  it('`import abc.mjs.js with ES Module` should work', () => {
    const abcFilePath = path.resolve(__dirname, './fixtures/ab.mjs.js');
    const codeString = minipack(abcFilePath);
    const execCode = eval(codeString);
    expect(typeof execCode.default === 'function').toBe(true);
    expect(execCode.default()).toMatchInlineSnapshot(`
      Object {
        "a": "This is a",
        "b": "This is b",
      }
    `);
  });
});
