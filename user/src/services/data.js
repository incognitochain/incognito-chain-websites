export const jsonToKeyValue = (json, parentKey = '') => {
  let result = {};
  const keys = Object.keys(json);
  keys.map((key) => {
    const value = json[key];
    if (Array.isArray(value)) {
      if (value[0]) {
        result = {
          ...result,
          [`Array.${parentKey ? `${parentKey}.` : ''}${key}`]: jsonToKeyValue(value[0]),
        };
      } else {
        result = {
          ...result,
          [`Array.${parentKey ? `${parentKey}.` : ''}${key}`]: '',
        };
      }
    } else if (typeof value === 'object' && value !== null) {
      result = {
        ...result,
        ...jsonToKeyValue(value, `${parentKey ? `${parentKey}.` : ''}${key}`),
      };
    } else {
      result = {
        ...result,
        [`${parentKey ? `${parentKey}.` : ''}${key}`]: value,
      };
    }
    return null;
  });
  return result;
};

export const jsonToFormat = (json, parentKey = '') => {
  let result = {};
  const keys = Object.keys(json);
  keys.map((key) => {
    const value = json[key];
    if (typeof value === 'object' && value !== null) {
      result = {
        ...result,
        [key]: { ...jsonToFormat(value, `${parentKey ? `${parentKey}.` : ''}${key}`) },
      };
    } else {
      result = {
        ...result,
        [key]: `${parentKey ? `${parentKey}.` : ''}${key}`,
      };
    }
    return null;
  });
  return result;
};

export default { jsonToKeyValue, jsonToFormat };
