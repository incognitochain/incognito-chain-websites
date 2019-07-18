export const formatConstantValue = (value) => {
  return value.toLocaleString(navigator.language, {minimumFractionDigits: 9})
}

export const formatBlocksHeight = (value) => {
  return value.toLocaleString(navigator.language, {minimumFractionDigits: 0})
}
