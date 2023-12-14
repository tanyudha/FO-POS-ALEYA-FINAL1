import { GetterTree } from 'vuex'
import { RootState } from '../index'
import { CartState } from './index'

const getters: GetterTree<CartState, RootState> = {
  transactionDetails: (state) => state.details,
  transaction: (state) => state,
  transactionMethod: (state) => state.transaction_method,
  isTransactionEmpty: (state) => {
    const { customer, employee, cashier, details } = state
    return details?.length === 0 && !customer.id && !employee.id && !cashier.id
  },
  isCartEmpty: (state) => state.details?.length === 0,
  isTransactionCompleted: (state) =>
    state.transaction_method && state.transaction_method !== 'Cart',
  isChanged: (state) => state.changed,
  customer: (state) => state.customer,
}

export default getters
