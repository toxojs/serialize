const { factory } = require('@toxo/ioc');
const { isFunction } = require('@toxo/fun');

const getRef = (ref) => `@@ref:${ref}`;

function innerSerialize(obj, refs = new Map(), objList = []) {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  if (obj instanceof Date) {
    return new Date(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map((x) => innerSerialize(x, refs, objList));
  }
  if (obj instanceof Map) {
    return {
      className: 'Map',
      value: innerSerialize(Array.from(obj), refs, objList),
    };
  }
  if (obj instanceof Set) {
    return {
      className: 'Set',
      value: innerSerialize(Array.from(obj), refs, objList),
    };
  }
  if (obj instanceof RegExp) {
    return { className: 'RegExp', value: obj.toString() };
  }
  if (ArrayBuffer.isView(obj)) {
    return {
      className: 'ArrayBufferView',
      subClassName: obj.constructor.name,
      value: innerSerialize(Array.from(obj), refs, objList),
    };
  }
  let ref = refs.get(obj);
  if (ref !== undefined) {
    return getRef(ref);
  }
  const serializer = factory.getSerializer(obj.constructor);
  if (serializer) {
    return serializer(obj, refs, objList);
  }
  if (isFunction(obj.serialize)) {
    return obj.serialize(obj, refs, objList);
  }
  if (isFunction(obj.constructor.serialize)) {
    return obj.constructor.serialize(obj, refs, objList);
  }
  const result = {
    className: obj.constructor.name,
    value: {},
  };
  ref = objList.length;
  refs.set(obj, ref);
  objList.push(result);
  // eslint-disable-next-line
  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      result.value[key] = innerSerialize(obj[key], refs, objList);
    }
  }
  return getRef(ref);
}

function serialize(obj) {
  const refs = new Map();
  const objList = [];
  const result = innerSerialize(obj, refs, objList);
  return { value: result, refs: objList };
}

module.exports = {
  serialize,
};
