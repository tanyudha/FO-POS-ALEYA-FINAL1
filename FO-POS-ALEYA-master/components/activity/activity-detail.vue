<template>
  <v-card
    v-if="!activity.id || loading"
    key="empty"
    elevation="0"
    class="d-flex justify-center align-center full-height"
  >
    <v-progress-circular
      v-if="loading"
      key="loading"
      :value="100"
      color="blue-grey"
      indeterminate
    />
    <div v-else key="empty">Pilih transaksi di bagian kiri untuk memulai</div>
  </v-card>
  <div v-else key="data" class="shift-info mx-12 mt-6 mb-4 d-flex flex-column">
    <div class="d-flex justify-space-between align-center mx-4 mb-4 mt-2">
      <h1 class="text-h5 text-center">{{ title }}</h1>
      <v-btn
        v-if="!activity.refundedAt && $auth.isCashier"
        small
        outlined
        tile
        color="red"
        @click="refundModal = true"
        >Refund</v-btn
      >
    </div>
    <div class="shift-detail flex-grow-1">
      <div
        v-for="(detail, idx) in transactionDetails"
        :key="idx"
        class="info-row"
      >
        <div>
          <v-icon class="mr-6">{{ detail.icon }}</v-icon
          >{{ detail.label }}
        </div>
        <v-spacer />
        <div>{{ detail.value }}</div>
      </div>
    </div>
    <v-data-table
      class="mt-6"
      :headers="headers"
      :items="activity.transaction_details"
      :item-key="activity.transaction_details.item_id"
      :items-per-page="-1"
      hide-default-footer
    ></v-data-table>
    <v-dialog v-model="refundModal" max-width="290">
      <v-card>
        <v-card-title class="text-h5"> Refund item </v-card-title>
        <v-card-text>
          Apa anda yakin akan melakukan refund? Tindakan ini tidak dapat
          dibatalkan.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" text @click="refundModal = false">
            Batal
          </v-btn>
          <v-btn color="red" text @click="refundTransaction"> Refund </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import * as currencyUtil from '@/utils/currency'
import * as timeUtil from '@/utils/time'

export default Vue.extend({
  props: {
    activity: {
      type: Object,
      default: () => ({}),
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      headers: [
        {
          text: 'Jumlah',
          value: 'qty',
        },
        {
          text: 'Nama barang',
          value: 'item.name',
        },
        {
          text: 'Harga eceran',
          value: 'item.price_retail',
        },
        {
          text: 'Harga grosir',
          value: 'item.price_wholesale',
        },
        {
          text: 'Total',
          value: 'price_final',
        },
      ],
      refundModal: false,
    }
  },
  computed: {
    transactionDetails(): object[] {
      const activity = this.activity as any
      if (!activity.id) return []
      return [
        {
          icon: 'mdi-barcode',
          label: 'Kode transaksi',
          value: activity.id,
        },
        {
          icon: 'mdi-calendar',
          label: 'Tanggal',
          value: this.formatTime(new Date(activity.createdAt).toString()),
        },
        {
          icon: 'mdi-account',
          label: 'Nama pembeli',
          value: activity.customer_name,
        },
        {
          icon: 'mdi-phone',
          label: 'Nomor telepon',
          value: activity.customer_phone,
        },
        {
          icon: 'mdi-account-cash',
          label: 'Nama Kasir',
          value: activity.cashier_name || '-',
        },
        {
          icon: 'mdi-account-cog',
          label: 'Nama Pegawai',
          value: activity.employee_name,
        },
        {
          icon: 'mdi-credit-card',
          label: 'Metode Pembayaran',
          value: activity.transaction_method,
        },
        {
          icon: 'mdi-cash-refund',
          label: 'Tanggal Refund',
          value: activity?.refundedAt
            ? this.formatTime(new Date(activity?.refundedAt).toString())
            : '-',
        },
      ]
    },
    title(): string {
      return `${this.activity.customer_name} - ${this.formatCurrency(
        this.activity.total
      )}`
    },
  },
  methods: {
    formatCurrency(value: number) {
      return currencyUtil.format(value)
    },
    formatTime(value: string) {
      return timeUtil.format(value)
    },
    refundTransaction() {
      this.$emit('refund', this.activity.id)
      this.refundModal = false
    },
  },
})
</script>

<style lang="scss" scoped>
.full-height {
  height: 100%;
}
.info-row {
  display: flex;
  justify-content: space-between;
  margin: 12px 16px;
}
</style>
