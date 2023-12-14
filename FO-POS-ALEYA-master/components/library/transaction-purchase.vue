<template>
  <v-row class="mt-5">
    <v-btn
      :disabled="modalDisabled"
      large
      elevation="0"
      tile
      block
      color="blue lighten-3"
      @click.stop="dialog = true"
      >Bayar {{ computedPrice }}</v-btn
    >
    <v-dialog v-model="dialog" width="350">
      <v-card class="pa-8 pb-6">
        <v-form ref="form" :disabled="loading" @submit.prevent="purchase">
          <div class="text-h5">{{ computedPrice }}</div>
          <div class="my-4">Pilih metode pembayaran</div>
          <v-btn-toggle v-model="selectedMethod" style="width: 100%">
            <v-btn class="flex-grow-1" outlined> Cash </v-btn>
            <v-btn class="flex-grow-1" outlined> BCA </v-btn>
            <v-btn v-if="allowInvoice" class="flex-grow-1" outlined>
              Invoice
            </v-btn>
          </v-btn-toggle>
          <div v-if="allowInvoiceDue" class="d-flex align-center my-4">
            <div>Invoice kadaluarsa dalam:</div>
            <v-text-field
              v-model="invoiceDue"
              type="number"
              min="0"
              style="width: 0"
              class="mx-2 mt-0 pt-0"
              hide-details
              @input="handleInvoiceInput"
            />
            <div>hari</div>
          </div>
          <v-card-actions class="pa-0 mt-6">
            <v-spacer></v-spacer>
            <v-btn color="secondary" text @click="cancel">Batal</v-btn>
            <v-btn
              :disabled="purchaseDisabled"
              :loading="loading"
              color="primary"
              text
              type="submit"
              >Bayar</v-btn
            >
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import * as currencyUtil from '@/utils/currency'

const TRANSACTION_METHODS = {
  CASH: 0,
  TRANSFER: 1,
  INVOICE: 2,
}

// based on TRANSACTION_METHODS
const _TRANSACTION_METHODS = ['Cash', 'Transfer', 'Invoice']

export default Vue.extend({
  props: {
    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      dialog: false,
      selectedMethod: undefined,
      invoiceDue: 14,
      loading: false,
    }
  },
  computed: {
    ...mapGetters('cart', ['isCartEmpty', 'transaction', 'isChanged']),
    computedPrice(): string {
      return this.formatCurrency(this.totalPrice)
    },
    allowInvoiceDue(): boolean {
      return this.selectedMethod === TRANSACTION_METHODS.INVOICE
    },
    modalDisabled(): boolean {
      const method = this.transaction.transaction_method
      return (
        method === 'Transfer' ||
        method === 'Cash' ||
        this.isCartEmpty ||
        !this.transaction.customer?.name
      )
    },
    allowInvoice(): boolean {
      return this.transaction.transaction_method !== _TRANSACTION_METHODS[2]
    },
    purchaseDisabled(): boolean {
      return this.selectedMethod === undefined
    },
  },
  methods: {
    ...mapActions('cart', ['resetTransaction', 'createSaveTransaction']),
    cancel() {
      this.dialog = false
      this.selectedMethod = undefined
      this.invoiceDue = 14
    },
    formatCurrency(amount: number): string {
      return currencyUtil.format(amount)
    },
    async purchase() {
      // TODO: convert this.selectedMethod to string
      // ganti nama kasir jadi current kasir
      const idx = this.selectedMethod
      if (idx === undefined) return
      this.loading = true

      let transaction = {
        ...this.transaction,
        cashier: {
          name: this.$auth.user?.name,
          id: this.$auth.user?.id,
        },
        shift_id: this.$shift.shift?.id,
        transaction_method: _TRANSACTION_METHODS[idx],
        is_checkout: true,
        forceSave: true,
      }

      try {
        if (this.transaction.invoice_id) {
          const payload = {
            id: this.transaction.invoice_id,
            invoice_payment_method: _TRANSACTION_METHODS[idx],
            transaction_id: this.transaction.id,
          }
          await this.$axios.$put('/invoice/pay-invoice', payload)
        } else {
          transaction = {
            ...transaction,
            invoice_expired_in: this.invoiceDue,
          }
        }

        await this.createSaveTransaction(transaction)
        this.$toast.show('Transaksi berhasil')
        this.resetTransaction()
        this.dialog = false
        setTimeout(() => {
          window.location.reload()
        }, 500)
      } catch (error) {
        this.$toast.global.asyncError(error)
      } finally {
        this.loading = false
      }
    },
    handleInvoiceInput(val: number) {
      if (val < 0) this.invoiceDue = 0
    },
  },
})
</script>
