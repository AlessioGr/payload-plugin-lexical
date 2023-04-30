function keysWithoutUndefinedValues(obj) {
  return Object.keys(obj).filter((key) => obj[key] !== undefined);
}

export function deepEqual(obj1, obj2, nested = 0, parentKey = 'top >') {
  if (obj1 === obj2)
  // it's just the same object. No need to compare.
  { return true; }

  if (isPrimitive(obj1) && isPrimitive(obj2)) {
    // compare primitives
    return obj1 === obj2;
  }

  const keys1 = keysWithoutUndefinedValues(obj1);
  const keys2 = keysWithoutUndefinedValues(obj2);

  if (keys1.length !== keys2.length) {
    /* console.warn(
      nested +
        ' PK: ' +
        parentKey +
        ' Not equal because of length: ' +
        keys1.length +
        ' != ' +
        keys2.length,
      'Key1: ' + keys1,
      'Key2: ' + keys2,
      'Obj1: ' + obj1,
      'Obj2: ' + obj2,
    ); */
    return false;
  }

  // compare objects with same number of keys
  for (const key in obj1) {
    if (!(key in obj2) && obj1[key] !== undefined) {
      // console.warn('Not equal because of: ' + key + ' not in obj2');
      return false; // other object doesn't have this prop
    }
    if (
      key in obj2
      && !deepEqual(obj1[key], obj2[key], nested + 1, `${parentKey} ${key}`)
    ) {
      // console.warn('Not equal because of: ' + key + ' not equal');
      return false;
    }
  }

  return true;
}

// check if value is primitive
function isPrimitive(obj) {
  return obj !== Object(obj);
}
