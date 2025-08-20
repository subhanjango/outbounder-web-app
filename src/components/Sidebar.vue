<template>
  <aside
    class="sidebar h-full flex flex-column p-3 gap-2"
    :class="{ 'fixed left-0 top-0 z-50 h-screen': mobile }"
  >
    <div class="flex align-items-center justify-content-between mb-3">
      <div class="flex align-items-center gap-2">
        <i class="pi pi-diamond text-2xl" />
        <span class="text-lg font-bold">Outbounder</span>
      </div>
      <Button v-if="mobile" icon="pi pi-times" text rounded @click="$emit('close')" />
    </div>

    <div class="subtle section-title mb-2">NAVIGATION</div>

    <nav class="flex flex-column gap-1">
      <RouterLink
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        class="item"
        :class="{ active: $route.path === item.to }"
        @click="$emit('close')"
      >
        <i :class="['pi', item.icon]" />
        <span class="font-medium">{{ item.label }}</span>
      </RouterLink>
    </nav>
  </aside>
</template>

<script>
export default {
  name: 'Sidebar',
  props: { open: { type: Boolean, default: false }, mobile: { type: Boolean, default: false } },
  computed: {
    items() {
      return [
        { label: 'People', to: '/people', icon: 'pi-users' },
        { label: 'Companies', to: '/company', icon: 'pi-building' },
        { label: 'Campaigns', to: '/campaigns', icon: 'pi-megaphone' },
        { label: 'Inbox', to: '/inbox', icon: 'pi-inbox' },
        { label: 'Chat', to: '/chat', icon: 'pi-comments' },
        { label: 'Knowledge', to: '/knowledge', icon: 'pi-book' },
        { label: 'Settings', to: '/settings', icon: 'pi-cog' }
      ]
    }
  }
}
</script>


