import a from './a.mjs.js';
import b from './b.mjs.js';

export default () => {
  return {
    a: a(),
    b: b(),
  };
};
