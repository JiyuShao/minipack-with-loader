/*
 * run webpack loader by "loader-runner"
 *
 * @Author: Jiyu Shao
 * @Date: 2020-04-22 14:58:49
 * @Last Modified by: Jiyu Shao
 * @Last Modified time: 2020-04-24 16:59:44
 */

import fs from 'fs';

import { runLoaders as origionalRunLoaders } from 'loader-runner';
import { MinipackOptions, Loader } from './index';

/**
 * loader runner callback return type
 */
interface LoaderRunnerReturnType {
  // TODO: determine type, use any for now
  result: any;

  // current process resource buffer
  resourceBuffer: Buffer;

  // cacheable
  cacheable: boolean;

  // file as dependency of the loader result in order to make them watchable
  fileDependencies: string[];

  // directory as dependency of the loader result in order to make them watchable
  contextDependencies: string[];

  // TODO: not exists in loader interface official document
  missingDependencies: string[];
}

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
  // get all rules
  const { rules = [] } = options.module || {};

  // find matched rules from filename
  const matchedRules = rules.filter(currentRule =>
    currentRule.test.test(filename)
  );

  // get matched loader from matched rules
  let matchedLoaders = matchedRules.reduce((result, current) => {
    const currentLoader = current.use;
    if (Array.isArray(currentLoader)) {
      return [...result, ...currentLoader];
    }
    return [...result, currentLoader];
  }, []);

  // add final js processing loader, to transform ES module to commonjs
  matchedLoaders = [
    {
      loader: 'babel-loader',
      options: {
        plugins: ['@babel/plugin-transform-modules-commonjs'],
      },
    },
    ...matchedLoaders,
  ];
  return matchedLoaders;
};

/**
 * run loaders by filename
 *
 * @param {string} filename
 * @param {MinipackOptions} options
 * @returns {Promise<LoaderRunnerReturnType>}
 */
const runLoaders = (
  filename: string,
  options: MinipackOptions
): Promise<LoaderRunnerReturnType> => {
  const matchedLoaders = getMatchedLoaders(filename, options);

  return new Promise((resolve, reject) => {
    // Run loader
    origionalRunLoaders(
      {
        resource: filename,
        // String: Absolute path to the resource (optionally including query string)

        loaders: matchedLoaders,
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
        resolve(result);
      }
    );
  });
};

export default runLoaders;
