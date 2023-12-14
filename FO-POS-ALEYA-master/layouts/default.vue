<template>
  <v-app>
    <nuxt />
    <v-bottom-navigation :value="value" color="primary">
      <v-btn
        v-for="(link, key) in links"
        :key="key"
        nuxt
        @click="changePage(link.url, key)"
      >
        <span>{{ link.name }}</span>
        <v-icon>{{ link.icon }}</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import 'vuetify/dist/vuetify.min.css'

export default Vue.extend({
  name: 'Default',
  data() {
    return {
      value: 0,
    }
  },
  computed: {
    links() {
      return [
        {
          name: 'Daftar Barang',
          icon: 'mdi-format-list-bulleted-square',
          url: '/library',
        },
        {
          name: 'Kegiatan',
          icon: 'mdi-history',
          url: '/activity',
        },
        {
          name: 'Shift',
          icon: 'mdi-account-reactivate',
          url: '/shift',
        },
      ]
    },
  },
  methods: {
    changePage(path: string, key: number): void {
      this.value = key
      this.$router.push(path)
    },
  },
})
</script>

<style lang="scss">
html {
  overflow: hidden;
}
</style>
