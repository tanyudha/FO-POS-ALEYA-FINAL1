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
            v-model="username"
            name="login-username"
            label="Username"
            placeholder=" "
            outlined
            persistent-placeholder
            prepend-inner-icon="mdi-account"
            :rules="[rules.required, rules.validUsername]"
          />
          <v-text-field
            v-model="password"
            :append-icon="passwordVisible ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="[rules.required]"
            :type="passwordVisible ? 'text' : 'password'"
            name="login-password"
            label="Password"
            placeholder=" "
            outlined
            persistent-placeholder
            prepend-inner-icon="mdi-lock"
            @click:append="togglePasswordVisibility"
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
            >Login</v-btn
          >
        </v-card-actions>
      </v-form>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  layout: 'empty',
  middleware: 'not-authenticated',
  data() {
    return {
      valid: true,
      username: '',
      password: '',
      passwordVisible: false,
      loading: false,
      rules: {
        required: (value: string) => !!value || 'Tidak boleh kosong.',
        validUsername: (value: string) =>
          /^[a-zA-Z0-9_]+$/i.test(value) ||
          'Username hanya boleh terdiri dari kombinasi alfabet, angka, atau garis bawah (_)',
      },
    }
  },
  computed: {
    isValid(): any {
      return this.valid && this.username && this.password
    },
  },
  methods: {
    validate() {
      ;(this.$refs.form as Vue & { validate: () => boolean }).validate()
    },
    togglePasswordVisibility() {
      this.passwordVisible = !this.passwordVisible
    },
    async checkShift() {
      try {
        if (this.$auth.isCashier) {
          await this.$shift.checkActiveShift()
          this.$nextTick(() => {
            this.$router.push(this.$shift.shift ? '/library' : '/start-shift')
          })
        }
        if (this.$auth.isEmployee) {
          const isCashierAvailable = true
          this.$nextTick(() => {
            this.$router.push(isCashierAvailable ? '/library' : '/no-cashier')
          })
        }
      } catch (err) {
        throw new Error(err)
      }
    },
    async onSubmit() {
      if (this.isValid) {
        this.loading = true
        try {
          await this.$auth.login(this.username, this.password)
          await this.checkShift()
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
