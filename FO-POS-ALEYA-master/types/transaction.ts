/* eslint-disable */
export type ItemType = {
  id: string | number
  name: string
  stock: number
  price_retail: number
  price_wholesale: number
  description?: string
}

export type DiscountType = {
  id: string | number
  name: string
  is_percentage: boolean
  amount: number
  percentage: number
  is_active: boolean
}

export type TransactionDetailType = {
  id?: string | number
  qty: number
  price: number
  price_sum: number
  price_final: number
  price_type: string | null
  createdAt: string
  item: ItemType
  discounts: DiscountType[]
}

export type TransactionType = {
  id?: string
  customer: {
    name: string
    id: number | null
    phone: string | number
  }
  cashier: {
    name: string
    id: number | null
  }
  employee: {
    name: string
    id: number | null
  }
  createdAt: string | null
  transaction_method: string
  details: TransactionDetailType[]
  // only exists to match cart store
  changed?: boolean
  invoice_id?: number | string | null
}

export type InvoiceType = {
  id?: string | number
  createdAt: string
  paidAt: string
  transaction_method: string
  invoice_status: string
  dueDate: string
}
