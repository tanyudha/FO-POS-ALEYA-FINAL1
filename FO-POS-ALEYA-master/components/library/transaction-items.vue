<template>
  <v-card width="100%" elevation="0">
    <v-expansion-panels accordion>
      <transaction-items-detail
        v-for="detail in transactionDetails"
        :key="`${detail.item.name}-${detail.createdAt}`"
        :detail="detail"
        :discounts="availableDiscounts"
        @update="$emit('update')"
      />
    </v-expansion-panels>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import TransactionItemsDetail from '@/components/library/transaction-items-detail.vue'
import { DiscountType } from '../../types/transaction'

export default Vue.extend({
  components: {
    TransactionItemsDetail,
  },
  data() {
    return {
      availableDiscounts: [] as DiscountType[],
    }
  },
  computed: {
    ...mapGetters('cart', ['transactionDetails']),
  },
  mounted() {
    this.fetchDiscounts()
  },
  methods: {
    async fetchDiscounts(): Promise<void> {
      try {
        const { discounts } = await this.$axios.$get('/discount')
        this.availableDiscounts = discounts
      } catch (error) {
        this.$toast.global.asyncError(error)
      }
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
