import { ActionTree } from 'vuex'
import * as transactionUtil from '@/utils/transaction'
// import showError from '@/utils/showError'
import {
  TransactionType,
  ItemType,
  TransactionDetailType,
} from '@/types/transaction'
import { RootState } from '../index'
import { CartState } from './index'

const actions: ActionTree<CartState, RootState> = {
  createNewDetail({ commit }, payload: ItemType) {
    const newDetail = {
      qty: 1,
      price: payload.price_retail,
      price_sum: payload.price_retail,
      price_final: payload.price_retail,
      price_type: 'retail',
      createdAt: new Date().toString(),
      item: payload,
      discounts: [],
    }
    commit('createNewDetail', newDetail)
  },
  removeDetail({ commit }, itemId: ItemType['id']) {
    commit('removeDetail', itemId)
  },
  updateDetail({ commit }, payload: TransactionDetailType) {
    commit('updateDetail', payload)
  },
  createOrUpdateTransaction({ commit, state }, payload) {
    const defaultEmployeeId = state.employee.id || this.$auth.user?.id || ''
    const defaultEmployeeName =
      state.employee.name || this.$auth.user?.name || ''

    const transaction: TransactionType = {
      id: payload?.id || state.id || '',
      customer: {
        id: payload?.customer?.id || state.customer.id || '',
        name: payload?.customer?.name || state.customer.name || '',
        phone: payload?.customer?.phone || state.customer.phone || '',
      },
      cashier: {
        id: payload?.cashier?.id || state.cashier.id || '',
        name: payload?.cashier?.name || state.cashier.name || '',
      },
      employee: {
        id: payload?.employee?.id || defaultEmployeeId,
        name: payload?.employee?.name || defaultEmployeeName,
      },
      createdAt: payload?.createdAt || state.createdAt || null,
      transaction_method:
        payload?.transaction_method || state.transaction_method || 'Cart',
      details: payload?.details || state.details || [],
      invoice_id: payload?.invoice_id || state.invoice_id || '',
    }
    commit('updateTransaction', transaction)
  },
  resetTransaction({ commit }) {
    commit('resetTransaction')
    commit('setChanged', false)
  },
  getTotalPrice({ state }) {
    return transactionUtil.getTotalPrice(state)
  },
  setChanged({ commit }, payload: boolean) {
    commit('setChanged', payload)
  },
  async createSaveTransaction({ state }, payload): Promise<void> {
    try {
      const transaction: any = { ...payload }
      if (!transaction.id) {
        const res = await this.$axios.$post('/cart/create-cart', {
          customer_name: transaction.customer.name,
          customer_phone: transaction.customer.phone,
          customer_id: transaction.customer.id,
          employee_name: transaction.employee.name,
          employee_id: transaction.employee.id,
        })
        transaction.id = res.transaction.id
        transaction.transaction_method = res.transaction.transaction_method
      }
      if (state.changed || transaction.forceSave) {
        transaction.details = transaction.details.map((detail: any) => ({
          ...detail,
          item_id: detail.item.id,
          transaction_id: transaction.id,
        }))
        const data = {
          id: transaction.id,
          customer_name: transaction.customer.name,
          customer_phone: transaction.customer.phone,
          customer_id: transaction.customer.id,
          transaction_details: transaction.details,
          transaction_method:
            payload.transaction_method || transaction.transaction_method,
          cashier_name: transaction.cashier?.name || '',
          cashier_id: transaction.cashier?.id || '',
          invoice_id: transaction.invoice_id || '',
          shift_id: transaction.shift_id || '',
          invoice_expired_in: transaction.invoice_expired_in || 14,
        }
        if (payload?.is_checkout) (data as any).is_checkout = true
        await this.$axios.$put('/cart/update-cart', data)
      }
    } catch (error) {
      throw new Error(error)
    }
  },
}

export default actions
