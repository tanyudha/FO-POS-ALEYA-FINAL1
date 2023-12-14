<template>
  <v-container class="d-flex justify-center align-center" fill-height>
    <v-card elevation="0" class="mx-auto my-12" width="500">
      <v-form
        ref="form"
        v-model="valid"
        :disabled="loading"
        lazy-validation
        @submit.prevent="onSubmit"
      >
        <v-card-title class="py-8">
          <v-spacer />
          <div class="text-h2 pb-6">Aleya Frozen</div>
          <v-spacer />
        </v-card-title>
        <v-card-text class="px-8">
          <v-text-field
            v-model.lazy="startingCash"
            v-money="money"
            name="startShift-startingCash"
            label="Modal awal"
            prefix="Rp"
            placeholder="0"
            outlined
            persistent-placeholder
            :rules="[rules.required, rules.validNumber]"
          />
        </v-card-text>
        <v-card-actions class="px-8 pb-8">
          <v-btn
            block
            x-large
            type="submit"
            color="blue lighten-3"
            elevation="0"
            :disabled="!isValid"
            :loading="loading"
            >Mulai Shift</v-btn
          >
        </v-card-actions>
      </v-form>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
/* eslint-disable */
// @ts-ignore
import { VMoney } from 'v-money'
/* eslint-enable */

export default Vue.extend({
  directives: { money: VMoney },
  layout: 'empty',
  middleware: ['authenticated', 'is-cashier', 'shift-not-started'],
  data() {
    return {
      valid: true,
      startingCash: 0,
      money: {
        decimal: ',',
        thousands: '.',
        precision: 0,
      },
      loading: false,
      rules: {
        required: (value: string) => !!value || 'Tidak boleh kosong.',
        validNumber: (value: string) =>
          /^[0-9.]+$/i.test(value) ||
          'Modal awal hanya boleh terdiri dari angka',
      },
    }
  },
  computed: {
    isValid(): any {
      return this.valid && this.startingCash
    },
    _startingCash(): number {
      return +this.startingCash.toString().replace(/\./g, '')
    },
  },
  methods: {
    validate() {
      ;(this.$refs.form as Vue & { validate: () => boolean }).validate()
    },
    async onSubmit() {
      if (this.isValid) {
        this.loading = true
        try {
          await this.$shift.startShift(this._startingCash)
          this.$router.push('/library')
        } catch (error) {
          this.$toast.global.asyncError(error)
        } finally {
          this.loading = false
        }
      }
    },
  },
})
</script>
