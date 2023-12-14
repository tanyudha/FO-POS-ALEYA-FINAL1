<template>
  <v-container class="container" fill-height>
    <slot />
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'CenteredContainer',
})
</script>

<style lang="scss" scoped>
.container {
  display: grid;
  place-items: center;
}
</style>
