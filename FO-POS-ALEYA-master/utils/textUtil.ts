export const displayId = (id: string) => id.substring(0, 8)

export const displayTransactionMethod = (
  method: string,
  isInvoice: boolean
) => {
  if (isInvoice) {
    if (method === 'Invoice') return 'Invoice (Belum Dibayar)'
    else return `Invoice (${method})`
  } else {
    return method
  }
}
