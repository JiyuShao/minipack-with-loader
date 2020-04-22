import path from 'path';
import minipack from '../src/index';

describe('minipack-with-loader', () => {
  it('`import abc.mjs.js with ES Module` should work', async () => {
    const entry = path.resolve(__dirname, './fixtures/ab.mjs.js');
    const codeString = await minipack({
      entry,
    });
    const execCode = eval(codeString);
    expect(typeof execCode.default === 'function').toBe(true);
    expect(execCode.default()).toMatchInlineSnapshot(`
      Object {
        "a": "This is a",
        "b": "This is b",
      }
    `);
  });

  it('`json5-loader` should work', async () => {
    const entry = path.resolve(__dirname, './fixtures/json5-loader.mjs.js');
    const codeString = await minipack({
      entry,
      module: {
        rules: [
          {
            test: /\.json5$/i,
            use: 'json5-loader',
          },
        ],
      },
    });

    const execCode = eval(codeString);
    expect(typeof execCode.default === 'function').toBe(true);
    expect(execCode.default()).toMatchInlineSnapshot(`
      Object {
        "test": "this is raw-loader test string",
      }
    `);
  });
});
