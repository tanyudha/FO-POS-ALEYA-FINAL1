import { MutationTree } from 'vuex'
import { TransactionType, TransactionDetailType } from '@/types/transaction'
import { CartState } from './index'

const mutations: MutationTree<CartState> = {
  createNewDetail: (state, payload: TransactionDetailType): void => {
    state.details.push(payload)
  },
  removeDetail: (state, itemId: number): void => {
    state.details = state.details.filter((detail) => detail.item.id !== itemId)
  },
  updateDetail: (state, payload: TransactionDetailType): void => {
    state.details.forEach((detail, idx) => {
      if (detail.item.id === payload.item.id) {
        state.details[idx] = payload
      }
    })
  },
  updateTransaction: (state, payload: TransactionType): void => {
    state.id = payload.id
    state.customer = payload.customer
    state.cashier = payload.cashier
    state.employee = payload.employee
    state.createdAt = payload.createdAt
    state.transaction_method = payload.transaction_method
    state.details = payload.details
    state.invoice_id = payload.invoice_id
  },
  resetTransaction: (state): void => {
    state.id = ''
    state.customer = {
      id: null,
      name: '',
      phone: '',
    }
    state.cashier = {
      id: null,
      name: '',
    }
    state.employee = {
      id: null,
      name: '',
    }
    state.createdAt = null
    state.transaction_method = ''
    state.details = []
    state.invoice_id = ''
  },
  setChanged: (state, payload: boolean): void => {
    state.changed = payload
  },
}

export default mutations
