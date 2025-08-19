<template>
  <div class="surface-ground min-h-screen flex align-items-center justify-content-center p-4">
    <div class="w-full" style="max-width: 480px;">
      <div class="text-center mb-6">
        <h1 class="text-4xl font-bold text-900 mb-2">
          {{ isRegisterMode ? 'Create your account' : 'Sign in to your account' }}
        </h1>
        <p class="text-600 text-lg">
          {{ isRegisterMode ? 'Join us to get started with your outbound campaigns' : 'Welcome back! Please sign in to continue' }}
        </p>
      </div>

      <form @submit.prevent="onSubmit" novalidate class="flex flex-column gap-4">
        <div v-if="isRegisterMode" class="field">
          <label for="name" class="block text-900 font-medium mb-2 text-lg">Full Name</label>
          <InputText
            id="name"
            v-model.trim="fullName"
            type="text"
            placeholder="Enter your full name"
            :class="{ 'p-invalid': submitted && nameError }"
            class="w-full p-3 text-lg"
            autocomplete="name"
          />
          <small v-if="submitted && nameError" class="p-error">{{ nameError }}</small>
        </div>

        <div class="field">
          <label for="email" class="block text-900 font-medium mb-2 text-lg">Email</label>
          <InputText
            id="email"
            v-model.trim="email"
            type="email"
            placeholder="Enter your email address"
            :class="{ 'p-invalid': submitted && emailError }"
            class="w-full p-3 text-lg"
            autocomplete="email"
          />
          <small v-if="submitted && emailError" class="p-error">{{ emailError }}</small>
        </div>

        <div class="field">
          <div class="flex justify-content-between align-items-center mb-2">
            <label for="password" class="text-900 font-medium text-lg">Password</label>
            <a v-if="!isRegisterMode" href="#" class="text-primary font-medium">Forgot your password?</a>
          </div>
          <Password
            id="password"
            v-model.trim="password"
            placeholder="Enter your password"
            :feedback="isRegisterMode"
            toggleMask
            :class="{ 'p-invalid': submitted && passwordError }"
            inputClass="w-full p-3 text-lg"
            :inputStyle="{ width: '100%', padding: '0.75rem' }"
            :autocomplete="isRegisterMode ? 'new-password' : 'current-password'"
          />
          <small v-if="submitted && passwordError" class="p-error">{{ passwordError }}</small>
        </div>

        <div v-if="isRegisterMode" class="field">
          <label for="confirmPassword" class="block text-900 font-medium mb-2 text-lg">Confirm Password</label>
          <Password
            id="confirmPassword"
            v-model.trim="confirmPassword"
            placeholder="Confirm your password"
            :feedback="false"
            toggleMask
            :class="{ 'p-invalid': submitted && confirmPasswordError }"
            inputClass="w-full p-3 text-lg"
            :inputStyle="{ width: '100%', padding: '0.75rem' }"
            autocomplete="new-password"
          />
          <small v-if="submitted && confirmPasswordError" class="p-error">{{ confirmPasswordError }}</small>
        </div>

        <div v-if="!isRegisterMode" class="flex align-items-center mb-2">
          <Checkbox inputId="remember" v-model="rememberMe" :binary="true" />
          <label for="remember" class="ml-2 text-900">Remember me on this device</label>
        </div>

        <Button 
          type="submit" 
          :label="isRegisterMode ? 'Create Account' : 'Sign in'" 
          class="w-full p-3 text-lg font-medium"
          :disabled="isSubmitting" 
        />

        <div class="text-center mt-4">
          <span class="text-600">
            {{ isRegisterMode ? 'Already have an account?' : "Don't have an account?" }}
          </span>
          <a 
            href="#" 
            @click.prevent="toggleMode" 
            class="text-primary font-medium ml-2 no-underline"
          >
            {{ isRegisterMode ? 'Sign in' : 'Sign up' }}
          </a>
        </div>
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
      fullName: '',
      confirmPassword: '',
      rememberMe: false,
      submitted: false,
      isSubmitting: false,
      isRegisterMode: false
    }
  },
  computed: {
    nameError() {
      if (this.isRegisterMode && !this.fullName) return 'Full name is required'
      return ''
    },
    emailError() {
      if (!this.email) return 'Email is required'
      const emailPattern = /[^\s@]+@[^\s@]+\.[^\s@]+/
      return emailPattern.test(this.email) ? '' : 'Please enter a valid email'
    },
    passwordError() {
      if (!this.password) return 'Password is required'
      if (this.isRegisterMode && this.password.length < 6) return 'Password must be at least 6 characters'
      return ''
    },
    confirmPasswordError() {
      if (this.isRegisterMode && !this.confirmPassword) return 'Please confirm your password'
      if (this.isRegisterMode && this.password !== this.confirmPassword) return 'Passwords do not match'
      return ''
    },
    isFormValid() {
      if (this.isRegisterMode) {
        return !this.nameError && !this.emailError && !this.passwordError && !this.confirmPasswordError
      }
      return !this.emailError && !this.passwordError
    }
  },
  methods: {
    toggleMode() {
      this.isRegisterMode = !this.isRegisterMode
      this.submitted = false
      // Clear form when switching modes
      this.email = ''
      this.password = ''
      this.fullName = ''
      this.confirmPassword = ''
      this.rememberMe = false
    },
    async onSubmit() {
      this.submitted = true
      if (!this.isFormValid) return
      try {
        this.isSubmitting = true
        // Simulate login/register request
        await new Promise((r) => setTimeout(r, 800))
        
        if (this.isRegisterMode) {
          // Store user info in localStorage (mock registration)
          const userData = {
            email: this.email,
            fullName: this.fullName,
            registeredAt: new Date().toISOString()
          }
          localStorage.setItem('outbounder_user', JSON.stringify(userData))
          this.$toast.add({ 
            severity: 'success', 
            summary: 'Account Created', 
            detail: `Welcome ${this.fullName}! Your account has been created successfully.`, 
            life: 3000 
          })
        } else {
          this.$toast.add({ 
            severity: 'success', 
            summary: 'Signed in', 
            detail: `Welcome back, ${this.email}`, 
            life: 2000 
          })
        }
        
        // Navigate to home page after successful login/registration
        setTimeout(() => {
          this.$router.push('/home')
        }, 1000)
        
      } catch (e) {
        const action = this.isRegisterMode ? 'Registration' : 'Login'
        this.$toast.add({ 
          severity: 'error', 
          summary: `${action} failed`, 
          detail: 'Please try again', 
          life: 2500 
        })
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


