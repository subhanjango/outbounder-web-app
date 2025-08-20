<template>
  <div class="login-page flex align-items-center justify-content-center p-4" style="min-height: 100vh">
    <div class="card w-full" style="max-width: 480px">
      <div class="flex align-items-center gap-2 mb-3">
        <i class="pi pi-diamond text-2xl" />
        <h2 class="m-0">Outbounder</h2>
      </div>

      <TabView>
        <TabPanel header="Login">
          <div class="flex flex-column gap-3">
            <div>
              <label class="block text-sm font-medium mb-1">Email</label>
              <InputText v-model="loginForm.email" placeholder="you@example.com" class="w-full" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Password</label>
              <Password v-model="loginForm.password" placeholder="••••••••" toggleMask :feedback="false" class="w-full" />
            </div>
            <Button label="Login" :loading="loading" @click="handleLogin" />
          </div>
        </TabPanel>
        <TabPanel header="Sign Up">
          <div class="flex flex-column gap-3">
            <div class="grid">
              <div class="col-12">
                <label class="block text-sm font-medium mb-1">Email</label>
                <InputText v-model="signupForm.email" placeholder="you@example.com" class="w-full" />
              </div>
              <div class="col-12">
                <label class="block text-sm font-medium mb-1">Password</label>
                <Password v-model="signupForm.password" placeholder="Create a password" toggleMask :feedback="false" class="w-full" />
              </div>
            </div>
            <Button label="Create Account" :loading="loading" @click="handleSignup" />
          </div>
        </TabPanel>
      </TabView>
    </div>
  </div>
  <Toast />
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

export default {
  name: 'Login',
  components: { TabView, TabPanel, InputText, Password, Button, Toast, ConfirmDialog },
  data() {
    return {
      loading: false,
      loginForm: { email: '', password: '' },
      signupForm: { email: '', password: '' }
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
    async handleSignup() {
      if (!this.signupForm.email || !this.signupForm.password) {
        this.$toast.add({ severity: 'warn', summary: 'Missing info', detail: 'Email and password required', life: 2500 })
        return
      }
      this.loading = true
      const users = this.getUsers()
      const exists = users.find(u => u.email === this.signupForm.email)
      if (exists) {
        this.$toast.add({ severity: 'error', summary: 'Account exists', detail: 'Try logging in instead', life: 2500 })
        this.loading = false
        return
      }
      users.push({ email: this.signupForm.email, password: this.signupForm.password })
      this.saveUsers(users)
      this.setAuth(this.signupForm.email)
      // mark onboarding as not completed
      localStorage.setItem('outbounder-onboarding-status', JSON.stringify({ completed: false }))
      this.loading = false
      this.$router.replace('/onboarding/1')
    },
    async handleLogin() {
      if (!this.loginForm.email || !this.loginForm.password) {
        this.$toast.add({ severity: 'warn', summary: 'Missing info', detail: 'Email and password required', life: 2500 })
        return
      }
      this.loading = true
      const users = this.getUsers()
      const match = users.find(u => u.email === this.loginForm.email && u.password === this.loginForm.password)
      if (!match) {
        this.$toast.add({ severity: 'error', summary: 'Invalid credentials', detail: 'Check your email/password', life: 2500 })
        this.loading = false
        return
      }
      this.setAuth(this.loginForm.email)
      this.loading = false
      const redirect = this.$route.query.redirect || '/'
      this.$router.replace(redirect)
    }
  }
}
</script>

<style scoped>
.login-page {
  background: var(--surface-ground);
}
</style>


