<template>
  <div class="layout-wrapper">
    <div class="layout-sidebar">
      <div class="sidebar-header">
        <h2>Outbounder</h2>
      </div>
      
      <Menu :model="menuItems" class="layout-menu" />
      
      <div class="sidebar-footer">
        <Button 
          @click="logout" 
          label="Logout" 
          icon="pi pi-sign-out" 
          class="p-button-text logout-button"
        />
      </div>
    </div>
    
    <div class="layout-main">
      <div class="layout-topbar">
        <div class="topbar-left">
          <Button 
            @click="toggleSidebar" 
            icon="pi pi-bars" 
            class="p-button-text"
          />
          <h3>{{ pageTitle }}</h3>
        </div>
        
        <div class="topbar-right">
          <span class="user-info">{{ userEmail }}</span>
        </div>
      </div>
      
      <div class="layout-content">
        <slot />
      </div>
    </div>
    
    <Toast />
  </div>
</template>

<script>
import Menu from 'primevue/menu'
import Button from 'primevue/button'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'

export default {
  name: 'AppLayout',
  components: {
    Menu,
    Button,
    Toast
  },
  data() {
    return {
      sidebarVisible: true,
      menuItems: [
        {
          label: 'Dashboard',
          icon: 'pi pi-home',
          command: () => this.$router.push('/dashboard')
        },
        {
          label: 'Contacts',
          icon: 'pi pi-users',
          command: () => this.$router.push('/contacts')
        },
        {
          label: 'Accounts',
          icon: 'pi pi-building',
          command: () => this.$router.push('/accounts')
        },
        {
          separator: true
        },
        {
          label: 'Company Research',
          icon: 'pi pi-search',
          command: () => this.$router.push('/company-research')
        },
        {
          label: 'Knowledge Base',
          icon: 'pi pi-book',
          command: () => this.$router.push('/knowledge-base')
        },
        {
          separator: true
        },
        {
          label: 'AI Chat',
          icon: 'pi pi-comments',
          command: () => this.$router.push('/chat')
        }
      ]
    }
  },
  setup() {
    const toast = useToast()
    return { toast }
  },
  computed: {
    pageTitle() {
      return this.$route.name || 'Dashboard'
    },
    userEmail() {
      return localStorage.getItem('userEmail') || 'User'
    }
  },
  methods: {
    toggleSidebar() {
      this.sidebarVisible = !this.sidebarVisible
    },
    
    logout() {
      localStorage.clear()
      this.toast.add({
        severity: 'info',
        summary: 'Logged Out',
        detail: 'You have been logged out successfully',
        life: 3000
      })
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.layout-wrapper {
  display: flex;
  height: 100vh;
  background: #ffffff;
}

.layout-sidebar {
  width: 280px;
  background: #ffffff;
  color: #1d1c1d;
  display: flex;
  flex-direction: column;
  transition: all 0.3s;
  border-right: 1px solid #e5e5e5;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid #e5e5e5;
  background: #ffffff;
}

.sidebar-header h2 {
  margin: 0;
  color: #1d1c1d;
  font-size: 24px;
  font-weight: 700;
}

.layout-menu {
  flex: 1;
  border: none;
  background: #ffffff;
}

.layout-menu :deep(.p-menu-list) {
  background: #ffffff;
  border: none;
  padding: 8px 12px;
}

.layout-menu :deep(.p-menuitem-link) {
  padding: 12px 16px;
  color: #616061;
  border-radius: 6px;
  margin-bottom: 2px;
  transition: all 0.15s ease;
  background: #ffffff;
  font-size: 15px;
}

.layout-menu :deep(.p-menuitem-link:hover) {
  background: #f8f8f8;
  color: #1d1c1d;
}

.layout-menu :deep(.p-menuitem-icon) {
  margin-right: 12px;
  color: #616061;
  font-size: 16px;
}

.layout-menu :deep(.p-menuitem-link:hover .p-menuitem-icon) {
  color: #1d1c1d;
}

.layout-menu :deep(.p-separator) {
  border-color: #e5e5e5;
  margin: 8px 0;
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid #e5e5e5;
  background: #ffffff;
}

.logout-button {
  width: 100%;
  color: #616061 !important;
  background: #ffffff !important;
  border: 1px solid #d1d9df !important;
  font-size: 14px !important;
}

.logout-button:hover {
  background: #f8f8f8 !important;
  color: #1d1c1d !important;
  border-color: #868686 !important;
}

.layout-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #ffffff;
}

.layout-topbar {
  background: #ffffff;
  padding: 16px 24px;
  border-bottom: 1px solid #e5e5e5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.topbar-left h3 {
  margin: 0;
  color: #1d1c1d;
  font-weight: 700;
}

.topbar-right {
  display: flex;
  align-items: center;
}

.user-info {
  color: #616061;
  font-weight: 500;
  font-size: 14px;
}

.layout-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background: #ffffff;
}

@media (max-width: 768px) {
  .layout-sidebar {
    position: fixed;
    left: -280px;
    z-index: 1000;
    height: 100vh;
    background: #ffffff;
    border-right: 1px solid #e5e5e5;
  }
  
  .layout-sidebar.visible {
    left: 0;
  }
  
  .layout-main {
    margin-left: 0;
    background: #ffffff;
  }
}
</style>