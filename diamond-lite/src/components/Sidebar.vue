<template>
  <aside
    class="sidebar h-full flex flex-column p-3 gap-2"
    :class="{ 'fixed left-0 top-0 z-50 h-screen': mobile }"
  >
    <div class="flex align-items-center justify-content-between mb-3">
      <div class="flex align-items-center gap-2">
        <span class="text-lg font-bold">OutbounderAI</span>
      </div>
      <Button v-if="mobile" icon="pi pi-times" text rounded @click="$emit('close')" />
    </div>

    <div class="subtle section-title mb-2">NAVIGATION</div>

    <nav class="flex flex-column gap-1 flex-1">
      <div class="flex flex-column gap-1">
        <RouterLink
          v-for="item in mainItems"
          :key="item.to"
          :to="item.to"
          class="item"
          :class="{ active: $route.path === item.to }"
          @click="$emit('close')"
        >
          <i :class="['pi', item.icon]" />
          <span class="font-medium">{{ item.label }}</span>
        </RouterLink>
      </div>
      
      <div class="mt-auto">
        <RouterLink
          :to="settingsItem.to"
          class="item"
          :class="{ active: $route.path === settingsItem.to }"
          @click="$emit('close')"
        >
          <i :class="['pi', settingsItem.icon]" />
          <span class="font-medium">{{ settingsItem.label }}</span>
        </RouterLink>
      </div>
    </nav>
  </aside>
</template>

<script>
export default {
  name: 'Sidebar',
  props: { open: { type: Boolean, default: false }, mobile: { type: Boolean, default: false } },
  computed: {
            mainItems() {
          return [
            { label: 'People', to: '/people', icon: 'pi-users' },
            { label: 'Companies', to: '/company', icon: 'pi-building' },
            { label: 'Campaigns', to: '/campaigns', icon: 'pi-megaphone' },
            { label: 'Inbox', to: '/inbox', icon: 'pi-inbox' },
            { label: 'Knowledge', to: '/knowledge', icon: 'pi-book' }
          ]
        },
    settingsItem() {
      return { label: 'Settings', to: '/settings', icon: 'pi-cog' }
    }
  }
}
</script>


