<template>
  <v-container class="container" fill-height>
    <div v-if="$slots.left" class="left-container">
      <slot name="left" />
    </div>
    <div class="right-container">
      <slot />
    </div>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'GlobalContainer',
})
</script>

<style lang="scss" scoped>
.container {
  margin: 0;
  padding: 0;
  display: flex;
  max-width: unset !important;
}
.left-container,
.right-container {
  max-height: calc(100vh - 56px);
  overflow-y: auto;
  height: 100%;
}
.left-container {
  border-right: 1.5px solid #ebebeb;
  width: 40vw;
}
.right-container {
  max-height: calc(100vh - 56px);
  flex: 1;
}
</style>
