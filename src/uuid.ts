/*
 * generate UUID for each module
 *
 * @Author: Jiyu Shao
 * @Date: 2020-04-22 14:57:43
 * @Last Modified by: Jiyu Shao
 * @Last Modified time: 2020-04-22 15:01:25
 */
let ID = 0;

/**
 * get new unique id
 */
export const generateUUID = () => {
  return ID++;
};

/**
 * reset unique id
 */
export const resetUUID = () => {
  ID = 0;
};
