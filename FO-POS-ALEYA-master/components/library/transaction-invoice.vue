<template>
  <v-col class="py-0 flex-grow-0 pl-0 pr-2">
    <v-btn
      x-large
      outlined
      color="grey darken-1"
      height="56px"
      min-width="70px"
      class="px-2"
      @click.stop="openDialog"
    >
      <template #default>
        <div class="d-flex flex-column">
          <v-icon>mdi-text-box-multiple-outline</v-icon>
          <div class="text-caption">Invoice</div>
        </div>
      </template>
    </v-btn>
    <v-dialog v-model="transactionDialog" max-width="400">
      <v-card class="pa-0">
        <div class="text-h5 pa-8 pb-4">Pilih invoice</div>
        <v-text-field
          v-model="searchText"
          append-icon="mdi-magnify"
          outlined
          clearable
          label="Cari invoice"
          placeholder="Ketik disini..."
          persistent-placeholder
          type="text"
          class="mx-3 mt-4"
          :loading="loading"
          @input="searchInvoice"
          @click:append="searchInvoice"
        ></v-text-field>
        <v-list two-line>
          <div v-if="!loading && !invoices.length" class="text-center mb-4">
            Tidak ada invoice yang belum dibayar.
          </div>
          <v-list-item-group v-else-if="invoices.length" key="data">
            <template v-for="invoice in invoices">
              <v-divider :key="invoice.id"></v-divider>
              <v-list-item
                :key="`${invoice.transaction.customer_name}${invoice.id}`"
                class="py-2"
                @click="selectInvoice(invoice)"
              >
                <template slot="default">
                  <v-list-item-content class="px-4">
                    <v-list-item-title
                      :class="{
                        'red--text': invoice.invoice_status === 'Overdue',
                      }"
                    >
                      {{ invoice.transaction.customer_name }}
                      <span
                        >[{{
                          formatTime(invoice.invoice_due_date, 'D-MM-YYYY')
                        }}]</span
                      >
                    </v-list-item-title>

                    <v-list-item-subtitle
                      class="mt-2"
                      v-text="invoice.transaction.total"
                    ></v-list-item-subtitle>
                  </v-list-item-content>

                  <v-list-item-action class="d-flex align-self-start">
                    <v-list-item-action-text
                      v-text="formatTime(invoice.createdAt)"
                    ></v-list-item-action-text>
                  </v-list-item-action>
                </template>
              </v-list-item>
            </template>
          </v-list-item-group>
        </v-list>
        <v-btn
          v-if="moreDataAvailable"
          :loading="loading"
          color="primary"
          nuxt
          block
          text
          @click="addInvoices"
          >Muat lebih</v-btn
        >
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
          <v-btn color="red" text @click="confirmSelectInvoice"> Lanjut </v-btn>
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

import * as currencyUtil from '@/utils/currency'
import * as timeUtil from '@/utils/time'
import * as transactionUtil from '@/utils/transaction'

const DEFAULT_ITEMS_PER_PAGE = 30
const DEFAULT_PAGE = 0

export default Vue.extend({
  data() {
    return {
      searchText: '',
      invoices: [],
      selectedTransaction: {} as TransactionType,
      currentPage: DEFAULT_PAGE,
      moreDataAvailable: true,
      transactionDialog: false,
      confirmationDialog: false,
      loading: false,
    }
  },
  computed: {
    ...mapGetters('cart', ['isTransactionEmpty', 'isChanged']),
    url(): string {
      return `/invoice/all?only_unpaid=1&page=${this.currentPage}&limit=${DEFAULT_ITEMS_PER_PAGE}&query=${this.searchText}`
    },
  },
  methods: {
    ...mapActions('cart', ['resetTransaction', 'createOrUpdateTransaction']),
    formatCurrency(value: number) {
      return currencyUtil.format(value)
    },
    formatTime(value: string, format: string = 'D MMM YYYY, HH.mm') {
      return timeUtil.format(new Date(value).toString(), format)
    },
    getTotalPrice(transaction: TransactionType) {
      return this.formatCurrency(transactionUtil.getTotalPrice(transaction))
    },
    openDialog() {
      this.invoices = []
      this.currentPage = DEFAULT_PAGE
      this.moreDataAvailable = true
      this.searchText = ''
      this.transactionDialog = true
      this.addInvoices()
    },
    searchInvoice() {
      this.invoices = []
      this.currentPage = DEFAULT_PAGE
      this.moreDataAvailable = true
      this.addInvoices()
    },
    async addInvoices() {
      this.loading = true
      try {
        const invoices = await this.$axios.$get(this.url)

        this.invoices = this.invoices.concat(invoices)
        this.currentPage++

        if (!invoices.length || invoices.length < DEFAULT_ITEMS_PER_PAGE)
          this.moreDataAvailable = false
      } catch (e) {
        this.$toast.global.asyncError(e)
      } finally {
        this.loading = false
      }
    },
    async fetchInvoice(invoice: any) {
      this.loading = true
      try {
        return await this.$axios.$get(`/invoice/detail/${invoice.id}`)
      } catch (e) {
        this.$toast.global.asyncError(e)
      } finally {
        this.loading = false
      }
    },
    async selectInvoice(invoice: TransactionType) {
      const { transaction } = await this.fetchInvoice(invoice)
      const result = transactionUtil.convertTransaction(transaction)

      if (this.isTransactionEmpty || !this.isChanged) {
        this.createOrUpdateTransaction({ ...result, invoice_id: invoice.id })
        this.$emit('update')
      } else {
        this.selectedTransaction = result
        this.confirmationDialog = true
      }
      this.transactionDialog = false
    },
    confirmSelectInvoice() {
      this.resetTransaction()
      this.confirmationDialog = false
      this.createOrUpdateTransaction(this.selectedTransaction)
      this.$emit('update')
      this.selectedTransaction = {} as TransactionType
    },
  },
})
</script>

<style lang="scss" scoped>
.skeleton-list-container {
  display: block;
}
</style>
