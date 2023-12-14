<template>
  <v-card elevation="0" class="mx-auto my-12" width="500">
    <v-col class="px-8 text-center">
      Pegawai tidak memiliki akses Pengeluaran maupun Detail Shift. Silakan
      keluar jika shift anda telah berakhir.
    </v-col>
    <v-card-actions class="px-8 pb-8">
      <v-btn block x-large color="blue lighten-3" elevation="0" @click="logout"
        >Keluar</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  methods: {
    async logout(): Promise<void> {
      try {
        await this.$auth.logout()
        this.$router.push('/login')
      } catch (error) {
        this.$toast.global.asyncError(error)
      }
    },
  },
})
</script>
