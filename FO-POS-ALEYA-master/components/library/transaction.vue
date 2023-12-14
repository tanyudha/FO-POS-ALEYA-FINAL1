<template>
  <v-card elevation="0" class="mx-4 mt-10">
    <v-row class="d-flex mx-0">
      <transaction-history @update="updateTotalPrice" />
      <transaction-invoice @update="updateTotalPrice" />
      <transaction-finished @update="updateTotalPrice" />
      <transaction-customer-new @update="updateTotalPrice" />
      <transaction-customer @update="updateTotalPrice" />
    </v-row>
    <v-row v-if="!isTransactionEmpty" class="py-4 px-0">
      <v-col class="py-0 d-flex" cols="4"
        ><div class="font-weight-medium">Pembeli:&nbsp;</div>
        <div class="text-truncate" style="max-width: 175px">
          {{ transaction.customer.name || '-' }}
        </div></v-col
      >
      <v-col class="py-0 d-flex" cols="4"
        ><div class="font-weight-medium">Kasir:&nbsp;</div>
        <div class="text-truncate" style="max-width: 175px">
          {{ transaction.cashier.name || '-' }}
        </div></v-col
      >
      <v-col class="py-0 d-flex" cols="4"
        ><div class="font-weight-medium">Pegawai:&nbsp;</div>
        <div class="text-truncate" style="max-width: 175px">
          {{ transaction.employee.name || '-' }}
        </div></v-col
      >
    </v-row>
    <v-row
      v-if="!isTransactionEmpty"
      class="items-container"
      :style="itemsContainerStyle"
    >
      <transaction-items v-if="!isCartEmpty" @update="updateTotalPrice" />
      <transaction-items-empty v-else @mount="totalPrice = 0" />
    </v-row>
    <v-row v-if="!isTransactionEmpty" class="px-0 pb-1">
      <v-divider class="mx-0 mt-0 mb-4" />
      <v-card class="px-2 mx-4 py-2" elevation="0" width="100%">
        <v-row class="d-flex">
          <v-col class="px-0 py-0 flex-grow-1">
            <v-btn
              large
              outlined
              tile
              block
              color="grey darken-1"
              :disabled="isTransactionCompleted"
              @click="deleteTransaction"
              >Hapus Transaksi</v-btn
            >
          </v-col>
          <v-col class="px-0 py-0 flex-grow-1">
            <v-btn
              :disabled="isCartEmpty || !transaction.customer.name"
              large
              outlined
              tile
              block
              color="grey darken-1"
              @click="saveTransaction"
              >Simpan Transaksi</v-btn
            >
          </v-col>
          <v-col v-if="showMainButton" class="px-0 py-0 flex-grow-1">
            <v-btn
              large
              outlined
              tile
              block
              color="grey darken-1"
              :disabled="!isTransactionCompleted"
              @click="print"
              >Cetak Transaksi</v-btn
            >
          </v-col>
        </v-row>
        <transaction-purchase v-if="showMainButton" :total-price="totalPrice" />
      </v-card>
    </v-row>
    <div v-else class="empty-transaction grey--text">
      Belum ada transaksi yang dipilih. Pilih item baru atau cari
      transaksi/invoice dengan menekan tombol di atas.
    </div>
    <v-overlay :value="loading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'

import TransactionHistory from '@/components/library/transaction-history.vue'
import TransactionInvoice from '@/components/library/transaction-invoice.vue'
import TransactionFinished from '@/components/library/transaction-finished.vue'
import TransactionItems from '@/components/library/transaction-items.vue'
import TransactionItemsEmpty from '@/components/library/transaction-items-empty.vue'
import TransactionCustomer from '@/components/library/transaction-customer.vue'
import TransactionCustomerNew from '@/components/library/transaction-customer-new.vue'
import TransactionPurchase from '@/components/library/transaction-purchase.vue'

import { printTransaction } from '@/utils/printUtils'

export default Vue.extend({
  components: {
    TransactionHistory,
    TransactionInvoice,
    TransactionFinished,
    TransactionCustomer,
    TransactionCustomerNew,
    TransactionItems,
    TransactionItemsEmpty,
    TransactionPurchase,
  },
  data() {
    return {
      totalPrice: 0,
      loading: false,
    }
  },
  computed: {
    ...mapGetters('cart', [
      'transaction',
      'transactionDetails',
      'isCartEmpty',
      'isTransactionEmpty',
      'isTransactionCompleted',
      'isChanged',
    ]),
    showMainButton(): boolean {
      return this.$auth.isCashier
    },
    itemsContainerStyle(): string {
      return `height: calc(100vh - ${this.showMainButton ? 328 : 280}px)`
    },
  },
  methods: {
    ...mapActions('cart', [
      'getTotalPrice',
      'resetTransaction',
      'createSaveTransaction',
    ]),
    async updateTotalPrice() {
      this.totalPrice = await this.getTotalPrice()
    },
    async deleteTransaction() {
      this.loading = true
      try {
        if (this.transaction.id) {
          await this.$axios.$delete(
            `/transaction/delete-transaction/${this.transaction.id}`
          )
        }
        this.resetTransaction()
        this.$toast.show('Transaksi berhasil dihapus')
      } catch (error) {
        this.$toast.global.asyncError(error)
      } finally {
        this.loading = false
      }
    },
    async saveTransaction() {
      this.loading = true
      try {
        await this.createSaveTransaction({ ...this.transaction })
        this.resetTransaction()
        this.$toast.show('Transaksi berhasil disimpan')
      } catch (error) {
        this.$toast.global.asyncError(error)
      } finally {
        this.loading = false
      }
    },
    print() {
      printTransaction(this.transaction)
    },
  },
})
</script>

<style lang="scss" scoped>
.items-container {
  overflow-y: auto;
}
.empty-transaction {
  padding: calc(50vh - 50px) 150px 0;
  text-align: center;
}
</style>
