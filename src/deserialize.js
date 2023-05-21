const { factory } = require('@toxo/ioc');

function deserialize(input) {
  const { refs, value } = input;
  const objs = [];
  for (let i = 0; i < refs.length; i += 1) {
    const ref = refs[i];
    const deserializer = factory.getDeserializer(ref.className);
    const obj = deserializer
      ? deserializer(ref.value)
      : factory.getInstance(ref.className, undefined) || {};
    objs.push(obj);
  }
  for (let i = 0; i < objs.length; i += 1) {
    const refvalue = refs[i].value;
    const obj = objs[i];
    Object.entries(refvalue).forEach(([key, current]) => {
      if (typeof current === 'string' && current.startsWith('@@ref:')) {
        const ref = parseInt(current.substring(6), 10);
        obj[key] = objs[ref];
      } else {
        obj[key] = current;
      }
    });
  }
  if (typeof value === 'string' && value.startsWith('@@ref:')) {
    const ref = parseInt(value.substring(6), 10);
    return objs[ref];
  }
  return value;
}

module.exports = {
  deserialize,
};
