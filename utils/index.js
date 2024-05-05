const convertNumber = (n) => {
  if (n < 1024) {
    return { converted: n, units: 'bytes' };
  } else if (n >= 1024 && n < 1024 ** 2) {
    return { converted: Number((n / 1024).toFixed(2)), units: 'KB' };
  } else if (n >= 1024 ** 2 && n < 1024 ** 3) {
    return { converted: Number((n / 1024 ** 2).toFixed(2)), units: 'MB' };
  } else if (n >= 1024 ** 3 && n < 1024 ** 4) {
    return { converted: Number((n / 1024 ** 3).toFixed(2)), units: 'GB' };
  } else if (n >= 1024 ** 4 && n < 1024 ** 5) {
    return { converted: Number((n / 1024 ** 4).toFixed(2)), units: 'TB' };
  } else {
    return { converted: Number((n / 1024 ** 5).toFixed(2)), units: 'PB' };
  }
};
export const checkCapacity = async (minSize) => {
  let webStorage = await navigator.storage.estimate();
  let isCapable = false;
  let capacity = webStorage.quota;
  let used = webStorage.usage;
  let minBytes = minSize * 1024 ** 2;
  if (capacity - used > minBytes) {
    isCapable = true;
  }

  capacity = convertNumber(capacity);
  used = convertNumber(used);
  let requested = convertNumber(minBytes);

  return {
    isCapable: isCapable,
    capacity: `${capacity.converted} ${capacity.units}`,
    used: `${used.converted} ${used.units}`,
    requested: `${requested.converted} ${requested.units}`,
  };
};
