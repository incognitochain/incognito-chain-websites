export const formatHashStr = (hashStr, isMobile = false) => {
  if (!isMobile) {
    return hashStr;
  }
  return `${hashStr.substring(0, 20)  }...${  hashStr.substring(56)}`;
};

export const formatProducerStr = (hashStr, isMobile = false) => {
  if (!isMobile) {
    return hashStr;
  }
  return `${hashStr.substring(0, 12)  }...`;
};

export const formatBlocksHeight = (value) => {
  return value.toLocaleString(navigator.language, { minimumFractionDigits: 0 });
};

export const formatTokenAmount = (value) => {
  return value.toLocaleString(navigator.language, { minimumFractionDigits: 0 });
};

export const formatCoinValue = (value) => {
  return value.toLocaleString(navigator.language, { minimumFractionDigits: 9 });
};
