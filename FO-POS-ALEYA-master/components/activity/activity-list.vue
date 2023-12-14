<template>
  <div class="mt-6">
    <h1 v-if="!hideTitle" class="text-h4 text-center mb-12">Aktivitas</h1>
    <v-row class="mx-0">
      <v-col class="py-0">
        <v-text-field
          v-model="searchText"
          append-icon="mdi-magnify"
          outlined
          clearable
          label="Cari transaksi"
          placeholder="Ketik disini..."
          persistent-placeholder
          type="text"
          @input="searchActivities"
          @click:append="searchActivities"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row class="mx-0">
      <v-col class="py-0">
        <v-select
          v-model="cashier.selected"
          :items="cashier.options"
          :loading="userLoading"
          label="Kasir"
          item-text="name"
          item-value="id"
          return-object
          cache-items
          outlined
          @input="updateActivities"
        ></v-select>
      </v-col>
      <v-col class="py-0">
        <v-select
          v-model="employee.selected"
          :loading="userLoading"
          :items="employee.options"
          label="Pegawai"
          item-text="name"
          item-value="username"
          return-object
          cache-items
          outlined
          @input="updateActivities"
        ></v-select>
      </v-col>
    </v-row>
    <v-row v-if="!onlyCart" class="mx-0">
      <v-col class="py-0">
        <v-select
          v-model="transactionMethod.selected"
          :items="transactionMethod.options"
          label="Metode Pembayaran"
          item-text="label"
          item-value="value"
          return-object
          cache-items
          outlined
          @input="updateActivities"
        ></v-select>
      </v-col>
      <v-col class="py-0">
        <v-menu
          v-model="showDatePicker"
          :close-on-content-click="true"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template #activator="{ on, attrs }">
            <v-text-field
              v-model="date"
              label="Tanggal"
              append-icon="mdi-calendar"
              readonly
              outlined
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="date"
            :max="todayDate"
            @input="selectDate"
          ></v-date-picker>
        </v-menu>
      </v-col>
    </v-row>
    <v-list two-line>
      <v-list-item-group v-if="loading" key="no-data">
        <template v-for="index in 5">
          <v-divider :key="index"></v-divider>
          <v-list-item
            :key="index + 20"
            inactive
            :ripple="false"
            class="skeleton-list-container py-2"
          >
            <template slot="default">
              <v-skeleton-loader
                type="list-item-three-line"
              ></v-skeleton-loader>
            </template>
          </v-list-item>
        </template>
      </v-list-item-group>
      <v-list-item-group v-else-if="activities.length" key="data">
        <template v-for="(activity, index) in activities">
          <v-divider :key="index"></v-divider>
          <v-list-item
            :key="`${activity.id}${activity.cashier_name}`"
            class="py-2"
            @click="selectActivity(activity)"
          >
            <template slot="default">
              <v-list-item-content>
                <v-list-item-title>
                  {{ activity.customer_name }} -
                  {{ formatCurrency(+activity.total) }}
                </v-list-item-title>

                <v-list-item-subtitle
                  class="mt-2"
                  v-text="getSubtitle(activity)"
                ></v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-action class="d-flex align-self-start">
                <v-list-item-action-text
                  v-text="formatTime(new Date(activity.createdAt))"
                ></v-list-item-action-text>
              </v-list-item-action>
            </template>
          </v-list-item>
        </template>
      </v-list-item-group>
      <div v-else class="text-center">Tidak ditemukan data yang sesuai.</div>
    </v-list>
    <v-btn
      v-if="moreDataAvailable && !loading && activities.length"
      color="primary"
      nuxt
      block
      text
      @click="$fetch"
      >Muat lebih</v-btn
    >
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import * as currencyUtil from '@/utils/currency'
import * as timeUtil from '@/utils/time'
import {
  ALL,
  CASH,
  TRANSFER,
  INVOICE,
  CART,
} from '@/utils/const/payment-method'
import debounce from '@/utils/debounce'

const DEFAULT_ITEMS_PER_PAGE = 30
const DEFAULT_PAGE = 0
const DEFAULT_USER_DATA = {
  name: 'Semua',
  username: '',
  id: -1,
}

export default Vue.extend({
  props: {
    hideTitle: {
      type: Boolean,
      default: false,
    },
    onlyCart: {
      type: Boolean,
      default: false,
    },
    hideInvoice: {
      type: Boolean,
      default: false,
    },
    onlyFinished: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loading: false,
      userLoading: false,
      activities: [] as any[],
      cashier: {
        options: [] as any[],
        selected: DEFAULT_USER_DATA,
      },
      employee: {
        options: [] as any[],
        selected: DEFAULT_USER_DATA,
      },
      transactionMethod: {
        options: [ALL, CASH, TRANSFER],
        selected: ALL,
      },
      date: '',
      searchText: '',
      currentPage: DEFAULT_PAGE,
      totalItems: 0,
      moreDataAvailable: true,
      showDatePicker: false,
    }
  },
  fetch(): void {
    this.fetchActivities()
  },
  computed: {
    todayDate() {
      return new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10)
    },
  },
  created(): void {
    this.searchActivities = debounce(this.searchActivities, 200)
    if (!this.hideInvoice) this.transactionMethod.options.push(INVOICE)
    if (this.onlyCart) {
      this.transactionMethod.selected = CART
    }
  },
  mounted() {
    this.$fetch()
    this.fetchUsers()
  },
  methods: {
    formatCurrency(value: number) {
      return currencyUtil.format(value)
    },
    formatTime(value: string) {
      return timeUtil.format(value, 'D MMM YYYY, HH.mm')
    },
    getUrl(): string {
      let url = `/transaction?page=${this.currentPage}&limit=${DEFAULT_ITEMS_PER_PAGE}`
      if (this.cashier.selected?.username)
        url += '&cashier_id=' + this.cashier.selected.id
      if (this.employee.selected?.username)
        url += '&employee_id=' + this.employee.selected.id
      if (this.date) url += '&createdAt=' + this.date
      if (this.transactionMethod.selected.value)
        url += '&transaction_method=' + this.transactionMethod.selected.value
      if (this.searchText) url += '&query=' + this.searchText
      if (this.onlyCart) url += '&with_cart=1'
      if (!this.hideInvoice) url += '&with_invoice=1'
      return url
    },
    async fetchActivities() {
      this.loading = true
      try {
        const { transactions: activities, totalItems } = await this.$axios.$get(
          this.getUrl()
        )

        if (!(activities as any[]).length) {
          this.moreDataAvailable = false
          return
        }

        this.activities = this.activities.concat(activities)
        this.currentPage++
        this.totalItems = this.activities.length

        if (this.totalItems >= totalItems) this.moreDataAvailable = false
      } catch (e) {
        this.$toast.global.asyncError(e)
      } finally {
        this.loading = false
      }
    },
    async updateActivities() {
      this.activities = []
      this.currentPage = DEFAULT_PAGE
      this.moreDataAvailable = true
      await this.fetchActivities()
    },
    async searchActivities() {
      await this.updateActivities()
    },
    selectDate() {
      this.showDatePicker = false
      this.updateActivities()
    },
    getSubtitle(activity: any) {
      return `Kasir: ${activity.cashier_name || '-'}, Pegawai: ${
        activity.employee_name || '-'
      }`
    },
    selectActivity(activity: any) {
      this.$emit('select', activity.id)
    },
    async fetchUsers(): Promise<void> {
      this.userLoading = true
      try {
        const { users } = await this.$axios.$get('/user')
        this.employee.options = [DEFAULT_USER_DATA, ...users]
        this.cashier.options = [
          DEFAULT_USER_DATA,
          ...users.filter((user: any) => user.role === 'Kasir'),
        ]
      } catch (e) {
        this.$toast.global.asyncError(e)
      } finally {
        this.userLoading = false
      }
    },
  },
})
</script>

<style lang="scss" scoped>
.skeleton-list-container {
  display: block;
}
</style>
