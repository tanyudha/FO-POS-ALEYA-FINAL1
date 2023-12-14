<template>
  <div class="shift-info mx-12 mt-6 mb-4 d-flex flex-column">
    <h1 class="text-h4 text-center mb-8">Shift Anda</h1>
    <div class="shift-detail flex-grow-1">
      <div class="info-row">
        <div>Nama</div>
        <div>{{ details.name }}</div>
      </div>
      <div class="info-row">
        <div>Pengeluaran</div>
        <div>{{ formatCurrency(details.expenseSum) }}</div>
      </div>
      <div class="info-row">
        <div>Mulai shift</div>
        <div>{{ formatTime(details.startShift) }}</div>
      </div>
      <div class="info-row">
        <div>Modal awal</div>
        <div>{{ formatCurrency(details.startingCash) }}</div>
      </div>
      <div class="info-row">
        <div>Pemasukan cash dari transaksi</div>
        <div>{{ formatCurrency(details.cashFromTransaction) }}</div>
      </div>
      <div class="info-row">
        <div>Pemasukan transfer dari transaksi</div>
        <div>{{ formatCurrency(details.transferFromTransaction) }}</div>
      </div>
      <div class="info-row">
        <div>Pemasukan cash dari invoice</div>
        <div>{{ formatCurrency(details.cashFromInvoice) }}</div>
      </div>
      <div class="info-row">
        <div>Pemasukan transfer dari invoice</div>
        <div>{{ formatCurrency(details.transferFromInvoice) }}</div>
      </div>
    </div>
    <v-btn large @click.stop="dialog = true">Logout</v-btn>
    <v-dialog v-model="dialog" max-width="600" persistent>
      <v-card class="px-8 pt-12 pb-6">
        <v-row class="pl-3">
          <div class="text-h4">Keluar</div>
          <v-col />
        </v-row>
        <v-row class="pt-2 pb-6">
          <v-col>
            Sebagai kasir, anda wajib melampirkan total cash yang didapat hari
            ini sebelum keluar.
          </v-col>
        </v-row>
        <v-form ref="form" :disabled="loading" @submit.prevent="logout">
          <v-text-field
            v-model.lazy="actualEndingCash"
            v-money="money"
            name="actualEndingCash"
            label="Cash akhir aktual"
            prefix="Rp"
            placeholder="0"
            outlined
            persistent-placeholder
            :rules="[rules.required, rules.validNumber]"
          />
          <v-card-actions class="pa-0">
            <v-spacer></v-spacer>
            <v-btn color="secondary" text @click="dialog = false">Batal</v-btn>
            <v-btn color="primary" text type="submit" :loading="loading"
              >Akhiri Shift</v-btn
            >
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
/* eslint-disable */
// @ts-ignore
import { VMoney } from 'v-money'
/* eslint-enable */
import * as currencyUtil from '@/utils/currency'
import * as timeUtil from '@/utils/time'

export default Vue.extend({
  directives: { money: VMoney },
  props: {
    details: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      actualEndingCash: 0,
      money: {
        decimal: ',',
        thousands: '.',
        precision: 0,
      },
      dialog: false,
      loading: false,
      valid: false,
      rules: {
        required: (value: string) => !!value || 'Tidak boleh kosong.',
        validNumber: (value: string) =>
          /^[0-9.]+$/i.test(value) ||
          'Modal awal hanya boleh terdiri dari angka',
      },
    }
  },
  computed: {
    isValid(): any {
      return this.valid && this.actualEndingCash
    },
    _actualEndingCash(): number {
      return +this.actualEndingCash.toString().replace(/\./g, '')
    },
    _details(): object {
      const loadingText = 'Memuat...'
      return {
        expenseSum: this.formatCurrency(this.details.expenseSum) || loadingText,
        startShift: this.formatTime(this.details.startShift) || loadingText,
        startingCash:
          this.formatCurrency(this.details.startingCash) || loadingText,
        cashFromTransaction:
          this.formatCurrency(this.details.cashFromTransaction) || loadingText,
        transferFromTransaction:
          this.formatCurrency(this.details.transferFromTransaction) ||
          loadingText,
        cashFromInvoice:
          this.formatCurrency(this.details.cashFromInvoice) || loadingText,
        transferFromInvoice:
          this.formatCurrency(this.details.transferFromInvoice) || loadingText,
      }
    },
  },
  methods: {
    async logout(): Promise<void> {
      this.loading = true
      try {
        const id = this.$shift.shift?.id
        if (id) {
          await this.$shift.endShift(id, this._actualEndingCash)
        }
        await this.$auth.logout()
        this.loading = false
        this.$router.push('/login')
      } catch (error) {
        this.$toast.global.asyncError(error)
      } finally {
        this.loading = false
      }
    },
    formatCurrency(value: number) {
      return currencyUtil.format(value)
    },
    formatTime(value: string) {
      return timeUtil.format(value)
    },
  },
})
</script>

<style lang="scss" scoped>
.shift-info {
  height: calc(100vh - 100px) !important;
}
.info-row {
  display: flex;
  justify-content: space-between;
  margin: 8px 16px;
}
</style>
