<template>
  <v-card elevation="0" class="mx-auto my-12" width="500">
    <v-col class="px-8 text-center">
      Anda sebagai pegawai tidak dapat melakukan kegiatan transaksi selama tidak
      ada kasir yang aktif. Silakan muat ulang halaman ketika sudah ada kasir
      yang aktif.
    </v-col>
    <v-card-actions class="px-8 pb-8">
      <v-btn
        :loading="loading"
        block
        x-large
        color="blue lighten-3"
        elevation="0"
        @click="refresh"
        >Muat Ulang</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      loading: false,
    }
  },
  methods: {
    refresh(): void {
      this.loading = true
      window.location.reload()
    },
  },
})
</script>
