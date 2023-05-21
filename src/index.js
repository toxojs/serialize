const deserialize = require('./deserialize');
const serialize = require('./serialize');

module.exports = {
  ...deserialize,
  ...serialize,
};
