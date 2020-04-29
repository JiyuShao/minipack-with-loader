module.exports = function (source) {
  try {
    JSON.parse(source);
    return true;
  } catch (error) {
    throw new Error('content is not object');
  }
};
