export const formatHashStr = (hashStr, isMobile = false) => {
  if (!isMobile) {
    return hashStr;
  }
  return hashStr.substring(0, 10) + '...' + hashStr.substring(56)
}

export const formatProducerStr = (hashStr, isMobile = false) => {
  if (!isMobile) {
    return hashStr;
  }
  return hashStr.substring(0, 12) + "..."
}

export const formatBlocksHeight = (value) => {
  return value.toLocaleString(navigator.language, {minimumFractionDigits: 0})
}

export const formatTokenAmount = (value) => {
  return value.toLocaleString(navigator.language, {minimumFractionDigits: 0})
}

export const formatConstantValue = (value) => {
  return value.toLocaleString(navigator.language, {minimumFractionDigits: 2})
}
