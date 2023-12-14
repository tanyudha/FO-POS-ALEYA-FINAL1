<template>
  <v-app>
    <div class="error-layout">
      <h1 class="error-status grey--text text--lighten-2">404</h1>
      <v-btn color="primary" to="/">Kembali</v-btn>
    </div>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  layout: 'empty',
})
</script>

<style lang="scss" scoped>
.error-layout {
  margin-top: 160px;
  text-align: center;
}

.error-status {
  font-size: 300px;
  line-height: 1;
  margin-bottom: 16px;
}
</style>
