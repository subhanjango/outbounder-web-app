<template>
  <div class="login-page min-h-screen flex align-items-center justify-content-center p-3 md:p-6">
    <!-- Background pattern -->
    <div class="auth-background"></div>

    <!-- Auth Card -->
    <div class="auth-card w-full">
      <!-- Logo and Branding -->
      <div class="text-center mb-5">
        <div class="flex align-items-center justify-content-center gap-3 mb-4">
          <div class="logo-container">
            <i class="pi pi-diamond text-4xl text-primary" />
          </div>
        </div>
        <h1 class="text-3xl font-bold text-900 mb-2">Welcome to Outbounder</h1>
        <p class="text-600 text-lg">Supercharge your outreach campaigns</p>
      </div>

      <!-- Tab Navigation -->
      <TabView class="auth-tabs">
        <TabPanel header="Login">
          <div class="pt-4">
            <form @submit.prevent="handleLogin" class="flex flex-column gap-4">
              <!-- Email Field -->
              <div class="field">
                <label for="login-email" class="block text-900 font-semibold mb-2">
                  <i class="pi pi-envelope mr-1 text-sm"></i>
                  Email Address
                </label>
                <InputText
                  id="login-email"
                  v-model="loginForm.email"
                  placeholder="you@example.com"
                  class="w-full p-3"
                  :class="{'p-invalid': loginErrors.email}"
                  type="email"
                  required
                />
                <small v-if="loginErrors.email" class="p-error">{{ loginErrors.email }}</small>
              </div>

              <!-- Password Field -->
              <div class="field">
                <label for="login-password" class="block text-900 font-semibold mb-2">
                  <i class="pi pi-lock mr-1 text-sm"></i>
                  Password
                </label>
                <div class="password-wrapper w-full">
                  <Password
                    id="login-password"
                    v-model="loginForm.password"
                    placeholder="Enter your password"
                    toggleMask
                    :feedback="false"
                    class="w-full password-field"
                    inputClass="w-full p-3"
                    :inputStyle="{ width: '100%' }"
                    :pt="{
                      root: { class: 'w-full' },
                      input: { class: 'w-full' }
                    }"
                    :class="{'p-invalid': loginErrors.password}"
                    required
                  />
                </div>
                <small v-if="loginErrors.password" class="p-error">{{ loginErrors.password }}</small>
              </div>

              <!-- Remember Me & Forgot Password -->
              <div class="flex align-items-center justify-content-between">
                <div class="flex align-items-center">
                  <Checkbox v-model="loginForm.remember" inputId="remember" binary />
                  <label for="remember" class="ml-2 text-900">Remember me</label>
                </div>
                <a href="#" class="text-primary font-medium no-underline hover:underline">
                  Forgot password?
                </a>
              </div>

              <!-- Submit Button -->
              <Button
                type="submit"
                label="Sign In"
                icon="pi pi-sign-in"
                :loading="loading"
                class="w-full p-3 text-lg"
                severity="primary"
              />

              <!-- Divider -->
              <div class="flex align-items-center my-3">
                <div class="flex-1 height-1px bg-300"></div>
                <span class="px-3 text-600">OR</span>
                <div class="flex-1 height-1px bg-300"></div>
              </div>

              <!-- Social Login Options -->
              <div class="flex flex-column gap-2">
                <Button
                  label="Continue with Google"
                  icon="pi pi-google"
                  class="w-full p-3"
                  severity="secondary"
                  outlined
                />
                <Button
                  label="Continue with Microsoft"
                  icon="pi pi-microsoft"
                  class="w-full p-3"
                  severity="secondary"
                  outlined
                />
              </div>
            </form>
          </div>
        </TabPanel>

        <TabPanel header="Sign Up">
          <div class="pt-4">
            <form @submit.prevent="handleSignup" class="flex flex-column gap-4">
              <!-- Email Field -->
              <div class="field">
                <label for="signup-email" class="block text-900 font-semibold mb-2">
                  <i class="pi pi-envelope mr-1 text-sm"></i>
                  Email Address
                </label>
                <InputText
                  id="signup-email"
                  v-model="signupForm.email"
                  placeholder="you@example.com"
                  class="w-full p-3"
                  :class="{'p-invalid': signupErrors.email}"
                  type="email"
                  required
                />
                <small v-if="signupErrors.email" class="p-error">{{ signupErrors.email }}</small>
              </div>

              <!-- Password Field -->
              <div class="field">
                <label for="signup-password" class="block text-900 font-semibold mb-2">
                  <i class="pi pi-lock mr-1 text-sm"></i>
                  Password
                </label>
                <div class="password-wrapper w-full">
                  <Password
                    id="signup-password"
                    v-model="signupForm.password"
                    placeholder="Create a strong password"
                    toggleMask
                    class="w-full password-field"
                    inputClass="w-full p-3"
                    :inputStyle="{ width: '100%' }"
                    :pt="{
                      root: { class: 'w-full' },
                      input: { class: 'w-full' }
                    }"
                    :class="{'p-invalid': signupErrors.password}"
                    required
                  />
                </div>
                <small class="text-600">
                  <i class="pi pi-info-circle mr-1 text-xs"></i>
                  Use 8+ characters with a mix of letters, numbers & symbols
                </small>
                <small v-if="signupErrors.password" class="p-error block mt-1">{{ signupErrors.password }}</small>
              </div>

              <!-- Confirm Password Field -->
              <div class="field">
                <label for="confirm-password" class="block text-900 font-semibold mb-2">
                  <i class="pi pi-lock mr-1 text-sm"></i>
                  Confirm Password
                </label>
                <div class="password-wrapper w-full">
                  <Password
                    id="confirm-password"
                    v-model="signupForm.confirmPassword"
                    placeholder="Confirm your password"
                    toggleMask
                    :feedback="false"
                    class="w-full password-field"
                    inputClass="w-full p-3"
                    :inputStyle="{ width: '100%' }"
                    :pt="{
                      root: { class: 'w-full' },
                      input: { class: 'w-full' }
                    }"
                    :class="{'p-invalid': signupErrors.confirmPassword}"
                    required
                  />
                </div>
                <small v-if="signupErrors.confirmPassword" class="p-error">{{ signupErrors.confirmPassword }}</small>
              </div>

              <!-- Terms & Conditions -->
              <div class="flex align-items-start">
                <Checkbox v-model="signupForm.terms" inputId="terms" binary class="mt-1" />
                <label for="terms" class="ml-2 text-900">
                  I agree to the
                  <a href="#" class="text-primary font-medium no-underline hover:underline">Terms of Service</a>
                  and
                  <a href="#" class="text-primary font-medium no-underline hover:underline">Privacy Policy</a>
                </label>
              </div>

              <!-- Submit Button -->
              <Button
                type="submit"
                label="Create Account"
                icon="pi pi-user-plus"
                :loading="loading"
                class="w-full p-3 text-lg"
                severity="success"
                :disabled="!signupForm.terms"
              />

              <!-- Divider -->
              <div class="flex align-items-center my-3">
                <div class="flex-1 height-1px bg-300"></div>
                <span class="px-3 text-600">OR</span>
                <div class="flex-1 height-1px bg-300"></div>
              </div>

              <!-- Social Signup Options -->
              <div class="flex flex-column gap-2">
                <Button
                  label="Sign up with Google"
                  icon="pi pi-google"
                  class="w-full p-3"
                  severity="secondary"
                  outlined
                />
                <Button
                  label="Sign up with Microsoft"
                  icon="pi pi-microsoft"
                  class="w-full p-3"
                  severity="secondary"
                  outlined
                />
              </div>
            </form>
          </div>
        </TabPanel>
      </TabView>

      <!-- Footer Text -->
      <div class="text-center mt-4">
        <p class="text-600 text-sm">
          By continuing, you acknowledge that you have read and understood our
          <a href="#" class="text-primary font-medium no-underline hover:underline ml-1">Cookie Policy</a>
        </p>
      </div>
    </div>
  </div>
  <Toast position="top-center" />
  <ConfirmDialog />
</template>

<script>
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'
import Checkbox from 'primevue/checkbox'

export default {
  name: 'Login',
  components: { TabView, TabPanel, InputText, Password, Button, Toast, ConfirmDialog, Checkbox },
  data() {
    return {
      loading: false,
      loginForm: {
        email: '',
        password: '',
        remember: false
      },
      signupForm: {
        email: '',
        password: '',
        confirmPassword: '',
        terms: false
      },
      loginErrors: {},
      signupErrors: {}
    }
  },
  methods: {
    getUsers() {
      try {
        return JSON.parse(localStorage.getItem('outbounder-users') || '[]')
      } catch (_e) {
        return []
      }
    },
    saveUsers(users) {
      localStorage.setItem('outbounder-users', JSON.stringify(users))
    },
    setAuth(email) {
      const auth = { email, token: Math.random().toString(36).slice(2), ts: Date.now() }
      localStorage.setItem('outbounder-auth', JSON.stringify(auth))
    },
    validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return re.test(email)
    },
    validatePassword(password) {
      return password && password.length >= 8
    },
    async handleSignup() {
      this.signupErrors = {}

      // Validate email
      if (!this.signupForm.email) {
        this.signupErrors.email = 'Email is required'
      } else if (!this.validateEmail(this.signupForm.email)) {
        this.signupErrors.email = 'Please enter a valid email address'
      }

      // Validate password
      if (!this.signupForm.password) {
        this.signupErrors.password = 'Password is required'
      } else if (!this.validatePassword(this.signupForm.password)) {
        this.signupErrors.password = 'Password must be at least 8 characters'
      }

      // Validate confirm password
      if (!this.signupForm.confirmPassword) {
        this.signupErrors.confirmPassword = 'Please confirm your password'
      } else if (this.signupForm.password !== this.signupForm.confirmPassword) {
        this.signupErrors.confirmPassword = 'Passwords do not match'
      }

      // Check if there are any errors
      if (Object.keys(this.signupErrors).length > 0) {
        return
      }

      // Check terms
      if (!this.signupForm.terms) {
        this.$toast.add({ severity: 'warn', summary: 'Terms Required', detail: 'Please accept the terms and conditions', life: 3000 })
        return
      }

      this.loading = true

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      const users = this.getUsers()
      const exists = users.find(u => u.email === this.signupForm.email)
      if (exists) {
        this.$toast.add({ severity: 'error', summary: 'Account Exists', detail: 'An account with this email already exists', life: 3000 })
        this.signupErrors.email = 'This email is already registered'
        this.loading = false
        return
      }

      users.push({ email: this.signupForm.email, password: this.signupForm.password })
      this.saveUsers(users)
      this.setAuth(this.signupForm.email)

      // mark onboarding as not completed
      localStorage.setItem('outbounder-onboarding-status', JSON.stringify({ completed: false }))

      this.$toast.add({ severity: 'success', summary: 'Account Created', detail: 'Welcome to Outbounder!', life: 3000 })

      this.loading = false

      // Redirect after short delay
      setTimeout(() => {
        this.$router.replace('/onboarding/1')
      }, 1500)
    },
    async handleLogin() {
      this.loginErrors = {}

      // Validate email
      if (!this.loginForm.email) {
        this.loginErrors.email = 'Email is required'
      } else if (!this.validateEmail(this.loginForm.email)) {
        this.loginErrors.email = 'Please enter a valid email address'
      }

      // Validate password
      if (!this.loginForm.password) {
        this.loginErrors.password = 'Password is required'
      }

      // Check if there are any errors
      if (Object.keys(this.loginErrors).length > 0) {
        return
      }

      this.loading = true

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      const users = this.getUsers()
      const match = users.find(u => u.email === this.loginForm.email && u.password === this.loginForm.password)

      if (!match) {
        this.$toast.add({ severity: 'error', summary: 'Login Failed', detail: 'Invalid email or password', life: 3000 })
        this.loginErrors.password = 'Invalid credentials'
        this.loading = false
        return
      }

      this.setAuth(this.loginForm.email)

      // Handle remember me
      if (this.loginForm.remember) {
        localStorage.setItem('outbounder-remember', this.loginForm.email)
      } else {
        localStorage.removeItem('outbounder-remember')
      }

      this.$toast.add({ severity: 'success', summary: 'Welcome Back!', detail: 'Login successful', life: 2000 })

      this.loading = false

      const redirect = this.$route.query.redirect || '/'

      // Redirect after short delay
      setTimeout(() => {
        this.$router.replace(redirect)
      }, 1000)
    }
  },
  mounted() {
    // Check if user was remembered
    const remembered = localStorage.getItem('outbounder-remember')
    if (remembered) {
      this.loginForm.email = remembered
      this.loginForm.remember = true
    }
  }
}
</script>

<style scoped>
.login-page {
  background: linear-gradient(135deg, var(--surface-50) 0%, var(--surface-100) 100%);
  position: relative;
  overflow: hidden;
}

.auth-background {
  position: absolute;
  inset: 0;
  opacity: 0.03;
  background-image:
    repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(0,0,0,.05) 35px, rgba(0,0,0,.05) 70px),
    repeating-linear-gradient(-45deg, transparent, transparent 35px, rgba(0,0,0,.03) 35px, rgba(0,0,0,.03) 70px);
  pointer-events: none;
}

.auth-card {
  max-width: 480px;
  background: var(--surface-card);
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: 0 20px 60px -10px rgba(0, 0, 0, 0.15);
  position: relative;
  z-index: 1;
}

@media (max-width: 640px) {
  .auth-card {
    padding: 1.5rem;
    border-radius: 12px;
  }
}

.logo-container {
  width: 72px;
  height: 72px;
  background: linear-gradient(135deg, var(--primary-400), var(--primary-600));
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.2);
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.auth-tabs :deep(.p-tabview-nav) {
  justify-content: center;
  border: none;
  background: var(--surface-50);
  border-radius: 12px;
  padding: 0.25rem;
}

.auth-tabs :deep(.p-tabview-nav li) {
  flex: 1;
}

.auth-tabs :deep(.p-tabview-nav li .p-tabview-nav-link) {
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  background: transparent;
  color: var(--text-color-secondary);
}

.auth-tabs :deep(.p-tabview-nav li.p-highlight .p-tabview-nav-link) {
  background: var(--surface-card);
  color: var(--primary-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.auth-tabs :deep(.p-tabview-panels) {
  background: transparent;
  padding: 0;
}

.auth-tabs :deep(.p-tabview-panel) {
  padding: 0;
}

.field {
  margin-bottom: 0;
}

.field label {
  transition: color 0.2s;
}

.field:focus-within label {
  color: var(--primary-color);
}

:deep(.p-inputtext) {
  border-radius: 8px;
  transition: all 0.3s ease;
  border: 1px solid var(--surface-border);
}

/* Password wrapper and field styles */
.password-wrapper {
  width: 100%;
  position: relative;
}

.password-wrapper :deep(.p-password) {
  width: 100%;
  display: block;
}

.password-wrapper :deep(.p-password-input),
.password-wrapper :deep(.p-password input),
.password-wrapper :deep(.p-inputtext) {
  width: 100% !important;
  border-radius: 8px;
  transition: all 0.3s ease;
  border: 1px solid var(--surface-border);
  padding-right: 3rem !important;
  display: block;
}

/* Ensure the input wrapper takes full width */
.password-wrapper :deep(.p-inputwrapper) {
  width: 100%;
  position: relative;
  display: block;
}

/* Password toggle button positioning */
.password-wrapper :deep(.p-password-toggle-button) {
  position: absolute !important;
  right: 0 !important;
  top: 0 !important;
  bottom: 0 !important;
  width: 2.5rem !important;
  background: transparent !important;
  border: none !important;
  color: var(--text-color-secondary);
  cursor: pointer;
  transition: color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 !important;
  padding: 0 !important;
  border-radius: 0 8px 8px 0 !important;
}

.password-wrapper :deep(.p-password-toggle-button:hover) {
  color: var(--primary-color);
  background: var(--surface-50) !important;
}

.password-wrapper :deep(.p-password-toggle-button:focus) {
  box-shadow: none !important;
  outline: none !important;
  background: var(--surface-100) !important;
}

/* Icon within toggle button */
.password-wrapper :deep(.p-password-toggle-button .p-icon) {
  width: 1.25rem;
  height: 1.25rem;
}

:deep(.p-inputtext:hover),
:deep(.p-password:hover .p-password-input) {
  border-color: var(--primary-300);
}

:deep(.p-inputtext:focus),
:deep(.p-password .p-password-input:focus) {
  box-shadow: 0 0 0 3px rgba(var(--primary-color-rgb), 0.1);
  border-color: var(--primary-color);
}

:deep(.p-password.p-invalid .p-password-input),
:deep(.p-inputtext.p-invalid) {
  border-color: var(--red-500);
}

:deep(.p-password.p-invalid .p-password-input:focus),
:deep(.p-inputtext.p-invalid:focus) {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

:deep(.p-password-panel) {
  margin-top: 0.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

:deep(.p-button) {
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
  text-transform: none;
}

:deep(.p-button:not(.p-button-outlined):hover) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.2);
}

:deep(.p-button.p-button-outlined) {
  border-width: 2px;
}

:deep(.p-button.p-button-outlined:hover) {
  background: var(--surface-50);
  border-color: var(--primary-color);
}

:deep(.p-checkbox) {
  width: 20px;
  height: 20px;
}

:deep(.p-checkbox .p-checkbox-box) {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

:deep(.p-checkbox .p-checkbox-box:hover) {
  border-color: var(--primary-color);
}

.height-1px {
  height: 1px;
}

.no-underline {
  text-decoration: none;
}

.hover\:underline:hover {
  text-decoration: underline;
}

:deep(.p-toast) {
  top: 1rem;
}

:deep(.p-toast-message) {
  border-radius: 8px;
  box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .login-page h1 {
    font-size: 1.75rem;
  }

  .login-page p {
    font-size: 0.95rem;
  }

  .logo-container {
    width: 60px;
    height: 60px;
  }

  .logo-container i {
    font-size: 2rem !important;
  }

  :deep(.p-button) {
    padding: 0.65rem 1rem;
  }

  .auth-tabs :deep(.p-tabview-nav li .p-tabview-nav-link) {
    padding: 0.65rem 0.75rem;
    font-size: 0.95rem;
  }
}

@media (prefers-color-scheme: dark) {
  .login-page {
    background: linear-gradient(135deg, var(--surface-900) 0%, var(--surface-800) 100%);
  }

  .auth-card {
    background: var(--surface-card);
    box-shadow: 0 20px 60px -10px rgba(0, 0, 0, 0.5);
  }

  .auth-tabs :deep(.p-tabview-nav) {
    background: var(--surface-800);
  }

  .auth-tabs :deep(.p-tabview-nav li.p-highlight .p-tabview-nav-link) {
    background: var(--surface-card);
  }

  .logo-container {
    background: linear-gradient(135deg, var(--primary-500), var(--primary-700));
  }
}
</style>


