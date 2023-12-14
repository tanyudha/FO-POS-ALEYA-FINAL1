<template>
  <div class="create-expense">
    <h1 class="text-h4 text-center mb-8">Pengeluaran Baru</h1>
    <v-form
      ref="form"
      v-model="valid"
      :disabled="loading"
      lazy-validation
      @submit.prevent="onSubmit"
    >
      <v-card-text class="px-8 py-0">
        <v-text-field
          v-model="title"
          label="Judul"
          placeholder="Judul pengeluaran"
          outlined
          persistent-placeholder
          :rules="[rules.required]"
        />
        <v-text-field
          v-model.lazy="amount"
          v-money="money"
          label="Nominal"
          hint="Nominal harus lebih besar dari 0"
          prefix="Rp"
          placeholder="0"
          outlined
          persistent-placeholder
          persistent-hint
          :rules="[rules.required, rules.validNumber]"
        />
        <v-textarea
          v-model="notes"
          auto-grow
          outlined
          rows="1"
          label="Keterangan"
          placeholder="Keterangan tambahan"
          persistent-placeholder
        ></v-textarea>
        <v-btn
          block
          large
          type="submit"
          color="blue lighten-3"
          elevation="0"
          :disabled="!isValid"
          :loading="loading"
          >Buat Pengeluaran</v-btn
        >
      </v-card-text>
    </v-form>
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue'
/* eslint-disable */
// @ts-ignore
import { VMoney } from 'v-money'
/* eslint-enable */

export default (
  Vue as VueConstructor<
    Vue & {
      $refs: {
        form: {
          validate: Function
          reset: Function
        }
      }
    }
  >
).extend({
  directives: { money: VMoney },
  layout: 'empty',
  middleware: 'not-authenticated',
  data() {
    return {
      valid: true,
      title: '',
      amount: 0,
      money: {
        decimal: ',',
        thousands: '.',
        precision: 0,
      },
      notes: '',
      loading: false,
      rules: {
        required: (value: string) => !!value || 'Tidak boleh kosong.',
        validNumber: (value: string) =>
          /^[0-9.]+$/i.test(value) || 'Nominal hanya boleh terdiri dari angka',
      },
    }
  },
  computed: {
    _amount(): string {
      return this.amount.toString().replace(/\./g, '')
    },
    isValid(): any {
      return this.valid && this.title && parseInt(this._amount) > 0
    },
  },
  methods: {
    async onSubmit() {
      if (this.isValid) {
        this.loading = true
        try {
          if (this.$shift.shift?.id) {
            const expense = {
              judul: this.title,
              total: this._amount,
              deskripsi: this.notes,
            }
            await this.$axios.$post('/shift/add-expense', {
              id: this.$shift.shift.id,
              expenses: [expense],
            })
            this.$toast.show('Pengeluaran tercatat')
            this.$emit('created')
            this.title = ''
            this.amount = 0
            this.notes = ''
            this.valid = true
            this.$refs.form.reset()
          }
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

<style lang="scss" scoped>
.create-expense {
  margin-top: 24px;
}
</style>
