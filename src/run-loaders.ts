/*
 * run webpack loader by "loader-runner"
 *
 * @Author: Jiyu Shao
 * @Date: 2020-04-22 14:58:49
 * @Last Modified by: Jiyu Shao
 * @Last Modified time: 2020-04-22 15:11:49
 */

import fs from 'fs';

import { runLoaders as origionalRunLoaders } from 'loader-runner';
import { MinipackOptions, Loader } from './index';

/**
 * get matched loaders by filename
 *
 * @param {string} filename
 * @param {MinipackOptions} options
 * @returns {Loader[]}
 */
export const getMatchedLoaders = (
  filename: string,
  options: MinipackOptions
): Loader[] => {
  const { rules = [] } = options.module || {};
  return rules.filter(currentLoader => currentLoader.test.test(filename));
};

/**
 * run loaders by filename
 *
 * @param {string} filename
 * @param {MinipackOptions} options
 * @returns {Promise<string>}
 */
const runLoaders = (
  filename: string,
  options: MinipackOptions
): Promise<string> => {
  const matchedLoaders = getMatchedLoaders(filename, options);
  return new Promise((resolve, reject) => {
    // Run loader
    origionalRunLoaders(
      {
        resource: filename,
        // String: Absolute path to the resource (optionally including query string)

        loaders: matchedLoaders.map(currentLoader => currentLoader.use),
        // String[]: Absolute paths to the loaders (optionally including query string)
        // {loader, options}[]: Absolute paths to the loaders with options object

        context: { minimize: true, emitError: console.error },
        // Additional loader context which is used as base context

        readResource: fs.readFile.bind(fs),
        // A function to read the resource
        // Must have signature function(path, function(err, buffer))
      },
      function (err, result) {
        if (err) {
          reject(err);
          return;
        }
        resolve(result.result.toString());
      }
    );
  });
};

export default runLoaders;
