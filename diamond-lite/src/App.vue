<template>
  <div>
    <div v-if="isAuthOrOnboardingRoute" class="login-wrapper">
      <router-view />
    </div>
    <div v-else :class="['app-shell flex', { 'drawer-open': isSidebarOpen }]">
      <Sidebar class="hidden md:flex" />
      <Sidebar class="md:hidden" mobile :open="isSidebarOpen" @close="isSidebarOpen=false" />
      <div class="layout-main flex flex-column flex-1">
        <Topbar :title="currentTitle" :dark="isDark" @toggle-dark="toggleDark" @toggle-menu="isSidebarOpen=true" @logout="handleLogout" />
        <main class="p-4 md:p-5">
          <router-view />
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from './components/Sidebar.vue'
import Topbar from './components/Topbar.vue'
import { useRoute } from 'vue-router'
import { computed, ref } from 'vue'

export default {
  name: 'App',
  components: { Sidebar, Topbar },
  setup() {
    const route = useRoute()
    const isSidebarOpen = ref(false)
    const isDark = ref(false)
    const currentTitle = computed(() => route.meta?.title || 'Home')
    const isLoginRoute = computed(() => route.name === 'Login')
    const isOnboardingRoute = computed(() => (route.meta && route.meta.onboarding) === true)
    const isAuthOrOnboardingRoute = computed(() => isLoginRoute.value || isOnboardingRoute.value)
    const handleLogout = () => {
      localStorage.removeItem('outbounder-auth')
      window.location.href = '/login'
    }
    const toggleDark = () => {
      isDark.value = !isDark.value
      document.documentElement.classList.toggle('dark', isDark.value)
    }
    return { isSidebarOpen, isDark, currentTitle, toggleDark, isLoginRoute, handleLogout, isAuthOrOnboardingRoute }
  }
}
</script>

<style>
.app-shell { background: var(--surface-ground); min-height: 100vh; }
.layout-main { min-width: 0; }
</style>
