<template>
  <div class="flex align-items-center justify-content-center min-h-screen">
    <Card style="width: 25rem">
      <template #header>
        <div class="text-center p-4">
          <div class="flex align-items-center justify-content-center mb-3">
            <i class="pi pi-users mr-2" style="font-size: 2rem"></i>
            <h1 class="m-0">Outbounder</h1>
          </div>
          <h2 class="mt-0 mb-2">Welcome Back</h2>
          <p class="text-600 m-0">Sign in to your account</p>
        </div>
      </template>
      <template #content>
        <form @submit.prevent="handleLogin">
          <div class="field">
            <label for="email">Email Address</label>
            <IconField iconPosition="left" class="w-full">
              <InputIcon class="pi pi-envelope" />
              <InputText 
                id="email"
                v-model="loginForm.email" 
                type="email"
                placeholder="Enter your email address"
                :class="{ 'p-invalid': errors.email }"
                class="w-full"
                required
              />
            </IconField>
            <small v-if="errors.email" class="p-error">{{ errors.email }}</small>
          </div>
          
          <div class="field">
            <label for="password">Password</label>
            <IconField iconPosition="left" class="w-full">
              <InputIcon class="pi pi-lock" />
              <Password 
                id="password"
                v-model="loginForm.password"
                placeholder="Enter your password"
                :class="{ 'p-invalid': errors.password }"
                class="w-full"
                :feedback="false"
                toggleMask
                required
              />
            </IconField>
            <small v-if="errors.password" class="p-error">{{ errors.password }}</small>
          </div>
          
          <Button 
            type="submit" 
            label="Sign In"
            :loading="loading"
            class="w-full"
            icon="pi pi-sign-in"
            size="large"
          />
        </form>
        
        <Divider align="center">
          <span>or</span>
        </Divider>
        
        <div class="text-center">
          <p class="text-600 m-0">
            Don't have an account? 
            <router-link to="/register" class="text-primary no-underline">Create account</router-link>
          </p>
        </div>
      </template>
    </Card>
    
    <Toast />
  </div>
</template>

<script>
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Toast from 'primevue/toast'
import Divider from 'primevue/divider'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import { useToast } from 'primevue/usetoast'

export default {
  name: 'Login',
  components: {
    Card,
    InputText,
    Password,
    Button,
    Toast,
    Divider,
    IconField,
    InputIcon
  },
  data() {
    return {
      loginForm: {
        email: '',
        password: ''
      },
      errors: {},
      loading: false
    }
  },
  setup() {
    const toast = useToast()
    return { toast }
  },
  methods: {
    validateForm() {
      this.errors = {}
      
      if (!this.loginForm.email) {
        this.errors.email = 'Email is required'
      } else if (!/\S+@\S+\.\S+/.test(this.loginForm.email)) {
        this.errors.email = 'Email is invalid'
      }
      
      if (!this.loginForm.password) {
        this.errors.password = 'Password is required'
      } else if (this.loginForm.password.length < 6) {
        this.errors.password = 'Password must be at least 6 characters'
      }
      
      return Object.keys(this.errors).length === 0
    },
    
    async handleLogin() {
      if (!this.validateForm()) return
      
      this.loading = true
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock successful login
        const token = 'mock-jwt-token-' + Date.now()
        localStorage.setItem('authToken', token)
        localStorage.setItem('userEmail', this.loginForm.email)
        
        this.toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Login successful!',
          life: 3000
        })
        
        this.$router.push('/dashboard')
      } catch (error) {
        this.toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Login failed. Please try again.',
          life: 3000
        })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
/* No custom styling - using only PrimeVue default components and PrimeFlex utilities */
</style>