<template>
  <v-container class="d-flex justify-center align-center">
    <v-progress-circular indeterminate color="indigo darken-2" />
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  mounted() {
    this.redirect()
  },
  methods: {
    redirect(): void {
      this.$router.push(this.$auth.loggedIn ? '/library' : '/login')
    },
  },
})
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
}
</style>
