export const formatConstantValue = (value) => {
  return value.toLocaleString(navigator.language, {minimumFractionDigits: 2})
}
