<template>
  <v-col class="py-0 flex-grow-1 px-0">
    <v-autocomplete
      v-model="model"
      :items="items"
      :loading="loading"
      :search-input.sync="searchText"
      outlined
      clearable
      label="Cari pembeli"
      placeholder="Cari pembeli"
      persistent-placeholder
      hide-details
      full-width
      return-object
      item-text="name"
      item-value="id"
      type="object"
      @change="handleModelChange"
    >
      <template #item="data">
        <template v-if="typeof data.item !== 'object'">
          <v-list-item-content>{{ data.item }}</v-list-item-content>
        </template>
        <template v-else>
          <v-list-item-content>
            <v-list-item-title>{{ data.item.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ data.item.phone }}</v-list-item-subtitle>
            <v-list-item-subtitle>{{
              data.item.description
            }}</v-list-item-subtitle>
          </v-list-item-content>
        </template>
      </template>
      <template #no-data>
        <v-list-item>
          <v-list-item-title> Data tidak ditemukan </v-list-item-title>
        </v-list-item>
      </template>
    </v-autocomplete>
  </v-col>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'

export default Vue.extend({
  data() {
    return {
      searchText: '',
      model: {},
      items: [],
      loading: false,
    }
  },
  computed: {
    ...mapGetters('cart', ['isTransactionEmpty', 'customer']),
  },
  watch: {
    async searchText(val) {
      this.loading = true
      try {
        let url = '/customer?limit=100'
        if (val) url += '&query=' + val
        this.items = (await this.$axios.$get(url)) as any
      } catch (e) {
        this.$toast.global.asyncError(e)
      } finally {
        this.loading = false
      }
    },
  },
  methods: {
    ...mapActions('cart', ['createOrUpdateTransaction']),
    handleModelChange() {
      if (!(this.model as any)?.name) return
      this.createOrUpdateTransaction({ customer: this.model })
      this.model = {}
      this.$emit('update')
    },
  },
})
</script>
