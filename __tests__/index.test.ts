import path from 'path';
import minipack from '../src/index';

const fixtures = path.resolve(__dirname, 'fixtures');

describe('minipack-with-loader', () => {
  it('`compile ab.mjs.js with babel-loader` should work', async () => {
    const entry = path.resolve(fixtures, './ab.mjs.js');
    const codeString = await minipack({
      entry,
      module: {
        rules: [
          {
            test: /\.js$/i,
            use: [
              {
                loader: 'babel-loader',
                options: {
                  presets: ['@babel/preset-env'],
                },
              },
            ],
          },
        ],
      },
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

  it('`compile json5-tester.mjs.js with json5-loader` should work', async () => {
    const entry = path.resolve(fixtures, './json5-tester.mjs.js');
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

  it('`compile ab.mjs.js with is-json-loader` should throw error', async () => {
    const entry = path.resolve(fixtures, './ab.mjs.js');

    try {
      await minipack({
        entry,
        module: {
          rules: [
            {
              test: /\.js$/i,
              use: path.resolve(fixtures, './is-json-loader.js'),
            },
          ],
        },
      });
    } catch (error) {
      expect(error.message).toEqual('content is not object');
    }
  });

  it('`compile import statement without finalLoader` should throw error', async () => {
    const entry = path.resolve(fixtures, './ab.mjs.js');
    try {
      await minipack({
        entry,
        finalLoader: [],
      });
    } catch (error) {
      expect(error.message).toMatchInlineSnapshot(
        `"this.input.charCodeAt is not a function"`
      );
    }
  });
});
