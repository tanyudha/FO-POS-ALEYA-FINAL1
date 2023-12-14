<template>
  <div class="empty-cart grey--text">Belum ada barang yang dipilih</div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  mounted() {
    this.$emit('mount')
  },
})
</script>

<style lang="scss" scoped>
.empty-cart {
  padding: 200px 0 0;
  width: 100%;
  text-align: center;
}
</style>
