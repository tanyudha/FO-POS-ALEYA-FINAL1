<template>
  <centered-container v-if="$auth.isEmployee && !$shift.isTransactionAllowed">
    <no-transaction />
  </centered-container>
  <global-container v-else>
    <template slot="left"> <item-list /> </template>
    <template slot="default">
      <transaction />
    </template>
    <v-dialog v-model="routerModal" max-width="290">
      <v-card>
        <v-card-title class="text-h5"> Konfirmasi </v-card-title>
        <v-card-text>
          Anda belum menyimpan transaksi. Pilih Jika anda memilih untuk
          melanjutkan, perubahan yang telah dibuat tidak akan disimpan.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" text @click="cancelChangeRoute">
            Batal
          </v-btn>
          <v-btn color="primary" text @click="changeRoute"> Lanjutkan </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </global-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import ItemList from '@/components/library/item-list.vue'
import Transaction from '@/components/library/transaction.vue'
import NoTransaction from '@/components/library/no-transaction.vue'

export default Vue.extend({
  components: { ItemList, Transaction, NoTransaction },
  beforeRouteLeave(to, _from, next) {
    if (this.isTransactionEmpty || !this.isChanged) {
      this.resetTransaction()
      next()
    } else if (this.to) next()
    else {
      this.to = to
      this.routerModal = true
    }
  },
  middleware: ['authenticated', 'shift-started'],
  data() {
    return {
      checkCashier: undefined as any,
      routerModal: false,
      to: null as any,
    }
  },
  computed: {
    ...mapGetters('cart', ['isTransactionEmpty', 'isChanged']),
  },
  created() {
    if (this.$auth.isEmployee) {
      this.checkCashier = setInterval(() => {
        this.$shift.checkCashierAvailable()
      }, 60 * 1000)
    }
  },
  mounted() {
    this.$auth.isEmployee && this.$shift.checkCashierAvailable()
  },
  beforeDestroy() {
    clearInterval(this.checkCashier)
  },
  methods: {
    ...mapActions('cart', ['resetTransaction']),
    changeRoute() {
      this.resetTransaction()
      this.routerModal = false
      this.$router.push(this.to)
    },
    cancelChangeRoute() {
      this.routerModal = false
      this.to = null
    },
  },
})
</script>
