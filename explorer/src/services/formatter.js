export const formatHashStr = (hashStr, isMobile = false) => {
  if (!isMobile) {
    return hashStr;
  }
  return hashStr.substring(0, 8) + '...' + hashStr.substring(56)
}
