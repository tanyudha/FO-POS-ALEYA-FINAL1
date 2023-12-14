import { TransactionType } from '@/types/transaction'

export const state = () =>
  ({
    id: '',
    customer: {
      id: null,
      name: '',
      phone: '',
    },
    cashier: {
      id: null,
      name: '',
    },
    employee: {
      id: null,
      name: '',
    },
    createdAt: null,
    transaction_method: '',
    details: [],
    changed: false,
    invoice_id: '',
  } as TransactionType)

export type CartState = ReturnType<typeof state>
