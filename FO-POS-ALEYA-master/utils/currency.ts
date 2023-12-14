export const format = (value: number) => {
  const roundedVal = Math.round(value * 100) / 100
  return (
    (roundedVal < 0 ? '- ' : '') +
    'Rp' +
    String(Math.abs(roundedVal)).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  )
}
