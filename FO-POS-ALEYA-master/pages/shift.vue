<template>
  <global-container v-if="$auth.isCashier">
    <template slot="left">
      <create-expense @created="addExpense" />
      <today-expense :expenses="expenses" />
    </template>
    <template slot="default">
      <shift-info :details="details" />
    </template>
  </global-container>
  <centered-container v-else>
    <employee-shift />
  </centered-container>
</template>

<script lang="ts">
import Vue from 'vue'
import CreateExpense from '@/components/shift/create-expense.vue'
import TodayExpense from '@/components/shift/today-expense.vue'
import ShiftInfo from '@/components/shift/shift-info.vue'
import EmployeeShift from '@/components/shift/employee-shift.vue'

export default Vue.extend({
  components: { CreateExpense, TodayExpense, ShiftInfo, EmployeeShift },
  middleware: ['authenticated', 'shift-started'],
  data() {
    return {
      details: {},
      expenses: [] as any,
    }
  },
  mounted() {
    this.fetchShiftDetails()
  },
  methods: {
    async fetchShiftDetails(): Promise<void> {
      const id = this.$shift.shift?.id
      if (!id) return
      try {
        const res = await this.$axios.$get(`/shift/detail/${id}`)

        /* eslint-disable */
        const { cash_from_invoice, cash_from_transaction } = res
        const actualEndingCash = cash_from_transaction + cash_from_invoice

        let expenseSum = 0
        res.expenses.forEach((expense: any) => {
          expenseSum += +expense.total
        })

        let cashFromTransaction = 0
        let transferFromTransaction = 0
        let cashFromInvoice = 0
        let transferFromInvoice = 0

        res.transactions.forEach((transaction: any) => {
          const method = transaction.transaction_method
          if (transaction.is_invoice) {
            if (method === 'Transfer') transferFromInvoice += +transaction.total
            if (method === 'Cash') cashFromInvoice += +transaction.total
          } else {
            if (method === 'Transfer')
              transferFromTransaction += +transaction.total
            if (method === 'Cash') cashFromTransaction += +transaction.total
          }
        })

        this.details = {
          actualEndingCash: actualEndingCash,
          name: res.cashier_name,
          // TODO: do the actual counting
          expenseSum,
          startShift: new Date(res.starting_shift).toString(),
          startingCash: res.starting_cash,
          cashFromTransaction,
          transferFromTransaction,
          cashFromInvoice,
          transferFromInvoice,
        }

        this.expenses = res.expenses.sort((a: any, b: any) => {
          return b.id - a.id
        })
        /* eslint-enable */
      } catch (error) {
        this.$toast.global.asyncError(error)
      }
    },
    addExpense(): void {
      this.fetchShiftDetails()
    },
  },
})
</script>
