<template>
  <div class="mt-6">
    <div class="item-list-header">
      <h1 class="text-h4 text-center mb-12">Daftar Barang</h1>
      <v-row class="mx-0 d-flex">
        <v-col class="py-0 flex-grow-0 pr-0">
          <v-btn
            x-large
            outlined
            color="grey darken-1"
            height="56px"
            min-width="70px"
            class="px-2"
            @click="resetFetchItems"
          >
            <template #default>
              <div class="d-flex flex-column">
                <v-icon>mdi-refresh</v-icon>
                <div class="text-caption">Refresh</div>
              </div>
            </template>
          </v-btn>
        </v-col>
        <v-col class="py-0 flex-grow-1">
          <v-text-field
            v-model="searchText"
            append-icon="mdi-magnify"
            outlined
            clearable
            label="Cari barang"
            placeholder="Ketik disini..."
            persistent-placeholder
            type="text"
            @input="searchItems"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-divider class="mx-0"></v-divider>
    </div>
    <client-only>
      <v-data-table
        :headers="headers"
        :loading="$fetchState.pending"
        :items="items"
        :item-key="items.id"
        :items-per-page="-1"
        :disable-sort="true"
        :height="`calc(100vh - ${loadMoreButton ? 270 : 232}px)`"
        :fixed-header="true"
        :hide-default-footer="true"
        class="ml-2"
      >
        <!-- eslint-disable-next-line -->
        <template v-slot:item.action="{ item }">
          <div style="width: 20px">
            <v-btn
              :disabled="idAlreadyExist(item.id) || disallowAddItems"
              small
              icon
              color="blue"
              block
              @click="updateTransaction(item)"
            >
              <v-icon>mdi-cart-plus</v-icon>
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </client-only>
    <v-btn
      v-if="loadMoreButton"
      :loading="loading"
      color="primary"
      nuxt
      block
      text
      @click="fetchItems(currentPage, searchText)"
      >Muat lebih</v-btn
    >
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions, mapGetters } from 'vuex'
import { ItemType } from '@/types/transaction'
import * as currencyUtil from '@/utils/currency'
import debounce from '@/utils/debounce'

const DEFAULT_ITEMS_PER_PAGE = 100
const DEFAULT_PAGE = 0

export default Vue.extend({
  fetchOnServer: false,
  data() {
    return {
      loading: false,
      currentPage: DEFAULT_PAGE,
      totalItems: 0,
      searchText: '',
      moreDataAvailable: true,
      items: [],
      headers: [
        {
          text: 'Stok',
          value: 'stock',
          align: 'end',
        },
        {
          text: 'Nama barang',
          value: 'name',
        },
        {
          text: 'Harga eceran',
          value: 'retailPrice',
          align: 'end',
        },
        {
          text: 'Harga grosir',
          value: 'wholesalePrice',
          align: 'end',
        },
        {
          text: '',
          value: 'action',
        },
      ],
    }
  },
  async fetch(): Promise<void> {
    await this.fetchItems()
  },
  computed: {
    ...mapGetters('cart', [
      'transactionMethod',
      'transactionDetails',
      'isChanged',
    ]),
    loadMoreButton(): boolean {
      if (!this.items.length) return false
      if (!this.moreDataAvailable) return false
      return true
    },
    disallowAddItems(): boolean {
      const method = this.transactionMethod
      if (!method) return false
      return method !== 'Cart'
    },
  },
  created() {
    this.searchItems = debounce(this.searchItems, 200)
  },
  mounted() {
    this.$fetch()
  },
  methods: {
    ...mapActions('cart', [
      'createNewDetail',
      'createOrUpdateTransaction',
      'setChanged',
    ]),
    formatCurrency(value: number) {
      return currencyUtil.format(value)
    },
    async fetchItems(
      page = DEFAULT_PAGE,
      query = '',
      itemsPerPage = DEFAULT_ITEMS_PER_PAGE
    ) {
      this.loading = true
      try {
        let url = '/item/get-all-items/?'
        url += `page=${page}`
        url += `&limit=${itemsPerPage}`
        url += `&query=${query}`

        const { data }: any = await this.$axios.get(url)

        const computedItems = data.items.map((item: any) => ({
          ...item,
          retailPrice: this.formatCurrency(item.price_retail),
          wholesalePrice: this.formatCurrency(item.price_wholesale),
          price_retail: +item.price_retail,
          price_wholesale: +item.price_wholesale,
        }))

        this.items = this.items.concat(computedItems)
        this.currentPage++
        this.totalItems += computedItems.length

        if (this.totalItems >= data.totalItems) {
          this.moreDataAvailable = false
        }
      } catch (e) {
        this.$toast.global.asyncError(e)
      } finally {
        this.loading = false
      }
    },
    searchItems() {
      this.currentPage = DEFAULT_PAGE
      this.totalItems = 0
      this.moreDataAvailable = true
      this.items = []
      this.fetchItems(0, this.searchText)
    },
    resetFetchItems() {
      this.currentPage = DEFAULT_PAGE
      this.totalItems = 0
      this.searchText = ''
      this.moreDataAvailable = true
      this.items = []
      this.fetchItems()
    },
    idAlreadyExist(id: number): boolean {
      if (!this.transactionDetails?.length) return false
      return !!this.transactionDetails.find(
        (detail: any) => detail.item.id === id
      )
    },
    updateTransaction(item: ItemType): void {
      if (!this.transactionDetails?.length) {
        this.createOrUpdateTransaction()
      }
      this.setChanged(true)
      this.createNewDetail(item)
      // create a new transaction
    },
  },
})
</script>
