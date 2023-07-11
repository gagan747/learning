const orderItems = (items, order = 'asc', fieldName = 'startTime') => {
  if (!(items && items.length)) {
    return [];
  }

  return [...items].sort((a, b) => {
    if (a[fieldName] < b[fieldName]) {
      return order === 'asc' ? -1 : 1;
    } if (a[fieldName] > b[fieldName]) {
      return order === 'asc' ? 1 : -1;
    }
    return 0;
  });
};

const removeDuplicates = (objArr) => objArr.filter((currObj, index, arr) => {
  const currObjValue = JSON.stringify(currObj);
  return index === arr.findIndex((obj) => JSON.stringify(obj) === currObjValue);
});

const getKeys = (arrValues, propKey) => {
  const keys = [];
  if (arrValues && Array.isArray(arrValues)) {
    arrValues.forEach((elem) => {
      if (!keys.includes(elem[propKey])) {
        keys.push(elem[propKey]);
      }
    });
  }
  return keys;
};

const compare = (v, w) => (w < v) - (v < w);

const fieldSorter = (...fieldNames) => (o, p) => fieldNames
  .reduce((acc, k) => acc || compare(o[k], p[k]), 0);

const byDisplayName = fieldSorter('displayName');

const partition = (items, predicate) => items
  .reduce(
    (partitions, item) => {
      partitions[predicate(item) ? 0 : 1].push(item);

      return partitions;
    },
    [[], []],
  );

const orderedGrouper = (propertyOrFunction) => (items) => items.reduce(
  (map, item) => {
    const key = typeof propertyOrFunction === 'function'
      ? propertyOrFunction(item)
      : item[propertyOrFunction];

    if (map.has(key)) {
      map.get(key).push(item);
    } else {
      map.set(key, [item]);
    }

    return map;
  },
  new Map(),
);

const unique = (items) => [...new Set(items)];

const removeEmpty = (it) => !!it;

const objectSplicer = (start, deleteCount = 0) => (obj) => {
  if (!obj) {
    return (arr) => arr;
  }

  return (arr) => {
    arr.splice(start, deleteCount, obj);

    return arr;
  };
};

module.exports = {
  byDisplayName,
  fieldSorter,
  getKeys,
  objectSplicer,
  orderedGrouper,
  orderItems,
  partition,
  removeDuplicates,
  removeEmpty,
  unique,
};
