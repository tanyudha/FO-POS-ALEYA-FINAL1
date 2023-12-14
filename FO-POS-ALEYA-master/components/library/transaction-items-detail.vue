<template>
  <v-expansion-panel :disabled="isTransactionCompleted">
    <v-expansion-panel-header class="py-0">
      <template #default>
        <v-row no-gutters>
          <v-col class="align-self-center">
            <span class="font-weight-medium larger-text">{{
              detail.item.name
            }}</span>
            <span class="larger-text">- {{ formatCurrency(priceFinal) }}</span>
          </v-col>
          <v-col cols="3">
            <v-switch
              :input-value="isWholesale"
              :disabled="tooglePriceTypeDisabled || isTransactionCompleted"
              :label="`Harga: ${isWholesale ? 'grosir' : 'eceran'}`"
              @click.stop="tooglePriceType"
            ></v-switch>
          </v-col>
          <v-col cols="3" class="d-flex align-center mr-6">
            <v-btn
              class="ma-0"
              outlined
              color="grey darken-1"
              fab
              x-small
              :disabled="isTransactionCompleted"
              @click.stop="addQty(-1)"
            >
              <v-icon>mdi-minus</v-icon>
            </v-btn>
            <v-text-field
              single-line
              :value="count"
              dense
              outlined
              :hide-details="true"
              :min="0"
              type="number"
              class="mx-3"
              :disabled="isTransactionCompleted"
              @input="changeQty($event)"
              @click.stop=""
            ></v-text-field>
            <v-btn
              class="ma-0"
              outlined
              color="grey darken-1"
              fab
              x-small
              :disabled="isTransactionCompleted"
              @click.stop="addQty(1)"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </template>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-card elevation="0" class="mx-4 mt-0 mb-6">
        <v-divider />
        <v-row class="font-weight-medium mt-4 ml-0 mb-2">Diskon</v-row>
        <v-row>
          <v-col
            v-for="(discount, idx) in discounts"
            :key="idx"
            cols="6"
            class="py-1"
          >
            <v-checkbox
              :input-value="isDiscountUsed(discount.id)"
              :disabled="isDiscountDisabled(discount) || isTransactionCompleted"
              :label="`${discount.name} (${getDiscountAmount(discount)})`"
              hide-details
              class="mt-0"
              @click="toggleDiscount(discount)"
            ></v-checkbox>
          </v-col>
        </v-row>
      </v-card>
    </v-expansion-panel-content>
    <v-dialog v-model="deleteModal" max-width="290">
      <v-card>
        <v-card-title class="text-h5"> Hapus item </v-card-title>
        <v-card-text>
          Hapus {{ detail.item.name }} dari transaksi?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" text @click="deleteModal = false">
            Batal
          </v-btn>
          <v-btn color="red" text @click="deleteItem"> Hapus </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-expansion-panel>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions, mapGetters } from 'vuex'
import { TransactionDetailType, DiscountType } from '@/types/transaction'
import * as currencyUtil from '@/utils/currency'

export default Vue.extend({
  props: {
    detail: {
      type: Object as () => TransactionDetailType,
      required: true,
    },
    discounts: {
      type: Array as () => DiscountType[],
      required: true,
    },
  },
  data() {
    return {
      count: this.detail.qty,
      isWholesale: this.detail.price_type === 'wholesale',
      price: 0,
      deleteModal: false,
      usedDiscounts: [...this.detail.discounts],
    }
  },
  computed: {
    ...mapGetters('cart', [
      'isTransactionCompleted',
      'transaction',
      'isChanged',
    ]),
    singlePrice(): number {
      return this.isWholesale ? this.priceWholesale : this.priceRetail
    },
    priceRetail(): number {
      return this.detail.item.price_retail
    },
    priceWholesale(): number {
      return this.detail.item.price_wholesale
    },
    priceType(): string {
      return this.isWholesale ? 'wholesale' : 'retail'
    },
    priceSum(): number {
      return this.count * this.singlePrice
    },
    priceFinal(): number {
      const initialPrice = this.singlePrice * this.count
      let price = initialPrice

      this.usedDiscounts.forEach((discount) => {
        price -= this.calculateDiscount(discount)
      })
      return price
    },
    tooglePriceTypeDisabled(): boolean {
      let price = this.isWholesale ? this.priceRetail : this.priceWholesale
      this.usedDiscounts.forEach((discount) => {
        price -= this.calculateDiscount(discount)
      })
      return price < 0
    },
  },
  mounted() {
    this.count = this.detail.qty
    this.price = this.isWholesale ? this.priceWholesale : this.priceRetail
    !this.transaction.id && this.$emit('update')
  },
  methods: {
    ...mapActions('cart', ['updateDetail', 'removeDetail', 'setChanged']),
    addQty(change: number) {
      this.changeQty(+this.count + change)
    },
    changeQty(newQty: number) {
      if (newQty <= 0) {
        this.deleteModal = true
        return
      }
      this.count = +newQty
      this._updateDetail()
    },
    tooglePriceType() {
      this.isWholesale = !this.isWholesale
      this._updateDetail()
    },
    formatCurrency(price: number) {
      return currencyUtil.format(price)
    },
    deleteItem() {
      this.removeDetail(this.detail.item.id)
      this.deleteModal = false
      this.$emit('update')
    },
    isDiscountUsed(discountId: string | number) {
      return !!this.usedDiscounts.find(
        (discount) => `${discount.id}` === `${discountId}`
      )
    },
    getDiscountAmount(discount: DiscountType) {
      const { is_percentage: isPercentage, amount, percentage } = discount
      if (isPercentage) return `${percentage}%`
      return this.formatCurrency(amount)
    },
    calculateDiscount(discount: DiscountType) {
      if (discount.is_percentage)
        return (this.singlePrice * this.count * discount.percentage) / 100
      return discount.amount
    },
    isDiscountDisabled(discount: DiscountType) {
      if (this.isDiscountUsed(discount.id)) return false
      const discountedPrice = this.priceFinal - this.calculateDiscount(discount)

      return discountedPrice < 0
    },
    toggleDiscount(discount: DiscountType) {
      if (!this.isDiscountUsed(discount.id)) {
        this.usedDiscounts.push(discount)
      } else {
        this.usedDiscounts = this.usedDiscounts.filter(
          (el: DiscountType) => el.id !== discount.id
        )
      }
      this._updateDetail()
    },
    _updateDetail() {
      this.updateDetail({
        ...this.detail,
        discounts: this.usedDiscounts,
        qty: +this.count,
        price: this.singlePrice,
        price_type: this.priceType,
        price_sum: this.priceSum,
        price_final: this.priceFinal,
      })
      if (!this.isChanged) this.setChanged(true)
      this.$emit('update')
    },
  },
})
</script>

<style lang="scss">
// intentionally not scoped
.v-expansion-panels {
  border-radius: 0 !important;
}
.v-expansion-panel::before {
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.12);
}
</style>

<style lang="scss" scoped>
.larger-text {
  font-size: 1.1rem !important;
}
</style>
