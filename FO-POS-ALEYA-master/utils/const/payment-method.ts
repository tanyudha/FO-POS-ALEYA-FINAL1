interface iPaymentMethod {
  label: string
  value: string
}

export const ALL: iPaymentMethod = {
  label: 'Semua',
  value: '',
}

export const CART: iPaymentMethod = {
  label: 'Keranjang',
  value: 'Cart',
}

export const CASH: iPaymentMethod = {
  label: 'Cash',
  value: 'Cash',
}

export const TRANSFER: iPaymentMethod = {
  label: 'Transfer',
  value: 'Transfer',
}

export const INVOICE: iPaymentMethod = {
  label: 'Invoice',
  value: 'Invoice',
}
