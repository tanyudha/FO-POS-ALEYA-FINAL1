<template>
  <v-col class="py-0 flex-grow-0 pl-0 pr-2">
    <v-btn
      x-large
      outlined
      color="grey darken-1"
      height="56px"
      min-width="70px"
      class="px-2"
      @click.stop="dialog = true"
    >
      <template #default>
        <div class="d-flex flex-column">
          <v-icon>mdi-account-plus</v-icon>
          <div class="text-caption">+Pembeli</div>
        </div>
      </template>
    </v-btn>
    <v-dialog v-model="dialog" max-width="600" persistent>
      <v-card class="pa-8 pb-6">
        <v-form ref="form" :disabled="disabled" @submit.prevent="submit">
          <v-text-field
            v-model="item.name"
            label="Nama*"
            placeholder="Ketik disini..."
            persistent-placeholder
            hint="Nama hanya boleh terdiri dari kombinasi angka, alfabet, dan spasi"
            persistent-hint
            clearable
            outlined
            :rules="[rules.required, rules.validName]"
          />
          <v-text-field
            v-model="item.phone"
            placeholder="Ketik disini..."
            persistent-placeholder
            label="Nomor Telepon*"
            outlined
            hint="Nomor telepon hanya boleh diisi oleh kombinasi angka"
            persistent-hint
            type="number"
            clearable
            :rules="[
              rules.required,
              rules.validPhone,
              rules.min(6),
              rules.max(14),
            ]"
          />
          <v-textarea
            v-model="item.description"
            placeholder="Keterangan tambahan"
            persistent-placeholder
            label="Catatan"
            clearable
            outlined
          />
          <v-card-actions class="pa-0">
            <v-spacer></v-spacer>
            <v-btn color="secondary" text @click="cancel">Batal</v-btn>
            <v-btn color="primary" text type="submit">Tambah</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </v-col>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue'
import { mapActions, mapGetters } from 'vuex'

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
  data() {
    return {
      disabled: false,
      dialog: false,
      item: {
        name: '',
        phone: '',
        description: '',
      },
      rules: {
        required: (value: string) => !!value || 'Tidak boleh kosong',
        validName: (value: string) =>
          /^[a-zA-Z0-9 ]+$/i.test(value) ||
          'Nama hanya boleh terdiri dari kombinasi alfabet, angka, atau spasi',
        validPhone: (value: string) =>
          /^[0-9 -]+$/i.test(value) ||
          'Nomor telepon hanya boleh terdiri dari angka',
        max: (length: number) => (value: string) =>
          (value && value.length <= length) || 'Nomor telepon tidak valid',
        min: (length: number) => (value: string) =>
          (value && value.length >= length) || 'Nomor telepon tidak valid',
      },
    }
  },
  computed: {
    ...mapGetters('cart', ['transaction', 'isTransactionEmpty']),
    _phone(): string {
      return this.item.phone.replaceAll(' ', '').replaceAll('-', '')
    },
  },
  methods: {
    ...mapActions('cart', ['createOrUpdateTransaction']),
    cancel() {
      this.dialog = false
      this.item = {
        name: '',
        phone: '',
        description: '',
      }
    },
    async submit() {
      const valid = this.$refs.form.validate()
      if (!valid) {
        return
      }
      try {
        const res = await this.$axios.$post('/customer/create-customer', {
          name: this.item.name,
          phone: this._phone,
          description: this.item.description,
        })

        this.$toast.show('Pembeli berhasil dibuat')
        this.item = {
          name: '',
          phone: '',
          description: '',
        }
        this.$refs.form.reset()
        this.dialog = false

        if (this.isTransactionEmpty) return
        this.createOrUpdateTransaction({
          ...this.transaction,
          customer: {
            id: res.id,
            name: res.name,
            phone: res.phone,
          },
        })
        this.$emit('update')
      } catch (e) {
        this.$toast.global.asyncError(e)
      }
    },
  },
})
</script>
