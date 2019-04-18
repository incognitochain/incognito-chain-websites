export const formatConstantValue = (value) => {
  return value.toLocaleString(navigator.language, {minimumFractionDigits: 2})
}

export const formatBlocksHeight = (value) => {
  return value.toLocaleString(navigator.language, {minimumFractionDigits: 0})
}
