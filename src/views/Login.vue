<template>
  <div class="surface-ground min-h-screen flex align-items-center justify-content-center p-4">
    <div class="w-full" style="max-width: 480px;">
      <div class="text-center mb-6">
        <h1 class="text-4xl font-bold text-900 mb-2">Sign in to your account</h1>
      </div>

      <form @submit.prevent="onSubmit" novalidate class="flex flex-column gap-4">
        <div class="field">
          <label for="email" class="block text-900 font-medium mb-2 text-lg">Email</label>
          <InputText
            id="email"
            v-model.trim="email"
            type="email"
            placeholder=""
            :class="{ 'p-invalid': submitted && emailError }"
            class="w-full p-3 text-lg"
            autocomplete="email"
          />
          <small v-if="submitted && emailError" class="p-error">{{ emailError }}</small>
        </div>

        <div class="field">
          <div class="flex justify-content-between align-items-center mb-2">
            <label for="password" class="text-900 font-medium text-lg">Password</label>
            <a href="#" class="text-primary font-medium">Forgot your password?</a>
          </div>
          <Password
            id="password"
            v-model.trim="password"
            placeholder=""
            :feedback="false"
            toggleMask
            :class="{ 'p-invalid': submitted && passwordError }"
            inputClass="w-full p-3 text-lg"
            :inputStyle="{ width: '100%', padding: '0.75rem' }"
            autocomplete="current-password"
          />
          <small v-if="submitted && passwordError" class="p-error">{{ passwordError }}</small>
        </div>

        <div class="flex align-items-center mb-2">
          <Checkbox inputId="remember" v-model="rememberMe" :binary="true" />
          <label for="remember" class="ml-2 text-900">Remember me on this device</label>
        </div>

        <Button 
          type="submit" 
          label="Sign in" 
          class="w-full p-3 text-lg font-medium"
          :disabled="isSubmitting" 
        />
      </form>
    </div>
    <Toast />
  </div>
</template>

<script>
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Checkbox from 'primevue/checkbox'
import Button from 'primevue/button'
import Toast from 'primevue/toast'

export default {
  name: 'Login',
  components: { InputText, Password, Checkbox, Button, Toast },
  data() {
    return {
      email: '',
      password: '',
      rememberMe: false,
      submitted: false,
      isSubmitting: false
    }
  },
  computed: {
    emailError() {
      if (!this.email) return 'Email is required'
      const emailPattern = /[^\s@]+@[^\s@]+\.[^\s@]+/
      return emailPattern.test(this.email) ? '' : 'Please enter a valid email'
    },
    passwordError() {
      if (!this.password) return 'Password is required'
      return ''
    },
    isFormValid() {
      return !this.emailError && !this.passwordError
    }
  },
  methods: {
    async onSubmit() {
      this.submitted = true
      if (!this.isFormValid) return
      try {
        this.isSubmitting = true
        // Simulate login request
        await new Promise((r) => setTimeout(r, 800))
        this.$toast.add({ severity: 'success', summary: 'Signed in', detail: `Welcome back, ${this.email}`, life: 2000 })
      } catch (e) {
        this.$toast.add({ severity: 'error', summary: 'Login failed', detail: 'Please try again', life: 2500 })
      } finally {
        this.isSubmitting = false
      }
    }
  }
}
</script>

<style scoped>
@media (max-width: 480px) {
  h1 { font-size: 2rem; }
  .text-lg { font-size: 1rem; }
  .p-3 { padding: 0.75rem; }
}
</style>


