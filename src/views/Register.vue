<template>
  <div class="register-container">
    <Card class="register-card">
      <template #header>
        <div class="register-header">
          <h1>Create Account</h1>
          <p>Join us and start building connections</p>
        </div>
      </template>
      <template #content>
        <form @submit.prevent="handleRegister" class="register-form">
          <div class="field">
            <label for="fullName">Full Name</label>
            <InputText 
              id="fullName"
              v-model="registerForm.fullName" 
              placeholder="Enter your full name"
              :class="{ 'p-invalid': errors.fullName }"
              required
            />
            <small v-if="errors.fullName" class="p-error">{{ errors.fullName }}</small>
          </div>
          
          <div class="field">
            <label for="email">Email</label>
            <InputText 
              id="email"
              v-model="registerForm.email" 
              type="email"
              placeholder="Enter your email"
              :class="{ 'p-invalid': errors.email }"
              required
            />
            <small v-if="errors.email" class="p-error">{{ errors.email }}</small>
          </div>
          
          <div class="field">
            <label for="company">Company Name</label>
            <InputText 
              id="company"
              v-model="registerForm.companyName" 
              placeholder="Enter your company name"
              :class="{ 'p-invalid': errors.companyName }"
              required
            />
            <small v-if="errors.companyName" class="p-error">{{ errors.companyName }}</small>
          </div>
          
          <div class="field">
            <label for="password">Password</label>
            <Password 
              id="password"
              v-model="registerForm.password"
              placeholder="Enter your password"
              :class="{ 'p-invalid': errors.password }"
              :feedback="true"
              toggleMask
              required
            />
            <small v-if="errors.password" class="p-error">{{ errors.password }}</small>
          </div>
          
          <div class="field">
            <label for="confirmPassword">Confirm Password</label>
            <Password 
              id="confirmPassword"
              v-model="registerForm.confirmPassword"
              placeholder="Confirm your password"
              :class="{ 'p-invalid': errors.confirmPassword }"
              :feedback="false"
              toggleMask
              required
            />
            <small v-if="errors.confirmPassword" class="p-error">{{ errors.confirmPassword }}</small>
          </div>
          
          <Button 
            type="submit" 
            label="Create Account"
            :loading="loading"
            class="register-button"
            icon="pi pi-user-plus"
          />
        </form>
        
        <div class="register-footer">
          <p>Already have an account? 
            <router-link to="/login" class="login-link">Sign in</router-link>
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
import { useToast } from 'primevue/usetoast'

export default {
  name: 'Register',
  components: {
    Card,
    InputText,
    Password,
    Button,
    Toast
  },
  data() {
    return {
      registerForm: {
        fullName: '',
        email: '',
        companyName: '',
        password: '',
        confirmPassword: ''
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
      
      if (!this.registerForm.fullName) {
        this.errors.fullName = 'Full name is required'
      } else if (this.registerForm.fullName.length < 2) {
        this.errors.fullName = 'Full name must be at least 2 characters'
      }
      
      if (!this.registerForm.email) {
        this.errors.email = 'Email is required'
      } else if (!/\S+@\S+\.\S+/.test(this.registerForm.email)) {
        this.errors.email = 'Email is invalid'
      }
      
      if (!this.registerForm.companyName) {
        this.errors.companyName = 'Company name is required'
      } else if (this.registerForm.companyName.length < 2) {
        this.errors.companyName = 'Company name must be at least 2 characters'
      }
      
      if (!this.registerForm.password) {
        this.errors.password = 'Password is required'
      } else if (this.registerForm.password.length < 6) {
        this.errors.password = 'Password must be at least 6 characters'
      }
      
      if (!this.registerForm.confirmPassword) {
        this.errors.confirmPassword = 'Please confirm your password'
      } else if (this.registerForm.password !== this.registerForm.confirmPassword) {
        this.errors.confirmPassword = 'Passwords do not match'
      }
      
      return Object.keys(this.errors).length === 0
    },
    
    async handleRegister() {
      if (!this.validateForm()) return
      
      this.loading = true
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Mock successful registration
        const token = 'mock-jwt-token-' + Date.now()
        localStorage.setItem('authToken', token)
        localStorage.setItem('userEmail', this.registerForm.email)
        localStorage.setItem('userName', this.registerForm.fullName)
        localStorage.setItem('userCompany', this.registerForm.companyName)
        
        this.toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Account created successfully!',
          life: 3000
        })
        
        this.$router.push('/dashboard')
      } catch (error) {
        this.toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Registration failed. Please try again.',
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
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.register-card {
  width: 100%;
  max-width: 450px;
}

.register-header {
  text-align: center;
  padding: 20px;
}

.register-header h1 {
  margin: 0 0 10px 0;
  color: #333;
}

.register-header p {
  margin: 0;
  color: #666;
}

.register-form {
  padding: 20px;
}

.field {
  margin-bottom: 20px;
}

.field label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  color: #333;
}

.register-button {
  width: 100%;
  margin-top: 10px;
}

.register-footer {
  text-align: center;
  padding: 20px;
  border-top: 1px solid #eee;
}

.login-link {
  color: #007ad9;
  text-decoration: none;
  font-weight: 600;
}

.login-link:hover {
  text-decoration: underline;
}
</style>