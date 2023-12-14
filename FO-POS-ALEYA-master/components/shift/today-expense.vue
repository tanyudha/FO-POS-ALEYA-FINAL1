<template>
  <v-card class="mt-12" elevation="0">
    <h1 class="text-h4 text-center mb-4">Pengeluaran Hari Ini</h1>
    <v-list two-line>
      <v-list-item-group>
        <template v-for="expense in expenses">
          <v-divider :key="expense.id"></v-divider>
          <v-list-item
            :key="`${expense.title}-${expense.id}`"
            inactive
            :ripple="false"
            class="py-2"
          >
            <template slot="default">
              <v-list-item-content>
                <v-list-item-title>
                  {{ expense.judul }} - {{ formatCurrency(expense.total) }}
                </v-list-item-title>

                <v-list-item-subtitle
                  class="mt-2"
                  v-text="expense.deskripsi || '-'"
                ></v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-action class="d-flex align-self-start">
                <v-list-item-action-text
                  v-text="formatTime(new Date(expense.createdAt))"
                ></v-list-item-action-text>
              </v-list-item-action>
            </template>
          </v-list-item>
        </template>
      </v-list-item-group>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import * as currencyUtil from '@/utils/currency'
import * as timeUtil from '@/utils/time'

export default Vue.extend({
  props: {
    expenses: {
      type: Array,
      required: true,
    },
  },
  methods: {
    formatCurrency(value: number) {
      return currencyUtil.format(value)
    },
    formatTime(value: string) {
      return timeUtil.format(value, 'HH:mm')
    },
  },
})
</script>
