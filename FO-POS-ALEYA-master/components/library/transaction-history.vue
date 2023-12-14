<template>
  <v-col class="py-0 flex-grow-0 pl-0 pr-2">
    <v-btn
      x-large
      outlined
      color="grey darken-1"
      height="56px"
      min-width="70px"
      class="px-2"
      @click.stop="transactionDialog = true"
    >
      <template #default>
        <div class="d-flex flex-column">
          <v-icon>mdi-cart</v-icon>
          <div class="text-caption">Transaksi</div>
        </div>
      </template>
    </v-btn>
    <v-dialog v-model="transactionDialog" max-width="500">
      <v-card class="pa-0">
        <div class="text-h5 pa-8 pb-4">Pilih transaksi</div>
        <activity-list
          hide-title
          hide-invoice
          only-cart
          @select="selectTransaction"
        />
      </v-card>
    </v-dialog>
    <v-dialog v-model="confirmationDialog" max-width="290">
      <v-card>
        <v-card-title class="text-h5"> Konfirmasi </v-card-title>
        <v-card-text>
          Terdapat transaksi yang belum disimpan. Apakah Anda yakin?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" text @click="confirmationDialog = false">
            Batal
          </v-btn>
          <v-btn color="red" text @click="confirmSelectTransaction">
            Lanjut
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-overlay :value="loading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-col>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import { TransactionType } from '@/types/transaction'
import ActivityList from '@/components/activity/activity-list.vue'

import * as currencyUtil from '@/utils/currency'
import * as timeUtil from '@/utils/time'
import * as transactionUtil from '@/utils/transaction'

export default Vue.extend({
  components: { ActivityList },
  data() {
    return {
      selectedTransaction: {} as any,
      transactionDialog: false,
      confirmationDialog: false,
      loading: false,
    }
  },
  computed: {
    ...mapGetters('cart', ['isTransactionEmpty', 'isChanged']),
  },
  methods: {
    ...mapActions('cart', ['resetTransaction', 'createOrUpdateTransaction']),
    formatCurrency(value: number) {
      return currencyUtil.format(value)
    },
    formatTime(value: string) {
      return timeUtil.format(value, 'D MMM YYYY, HH.mm')
    },
    getTotalPrice(transaction: TransactionType) {
      return this.formatCurrency(transactionUtil.getTotalPrice(transaction))
    },
    async fetchTransaction(activityId: number) {
      this.loading = true
      try {
        return await this.$axios.$get(`/transaction/detail/${activityId}`)
      } catch (e) {
        this.$toast.global.asyncError(e)
      } finally {
        this.loading = false
      }
    },
    async selectTransaction(transactionId: number) {
      const res = await this.fetchTransaction(transactionId)
      const result = transactionUtil.convertTransaction(res)
      if (this.isTransactionEmpty || !this.isChanged) {
        this.createOrUpdateTransaction(result)
        this.$emit('update')
      } else {
        this.selectedTransaction = result
        this.confirmationDialog = true
      }
      this.transactionDialog = false
    },
    confirmSelectTransaction() {
      this.resetTransaction()
      this.confirmationDialog = false
      this.createOrUpdateTransaction(this.selectedTransaction)
      this.$emit('update')
      this.selectedTransaction = {} as TransactionType
    },
  },
})
</script>
