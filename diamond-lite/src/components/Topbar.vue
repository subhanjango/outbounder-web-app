<template>
  <header class="topbar">
    <div class="flex align-items-center justify-content-between p-3 md:p-4">
      <div class="flex align-items-center gap-2">
        <Button class="md:hidden" icon="pi pi-bars" text rounded @click="$emit('toggle-menu')" />
        <span class="text-xl md:text-2xl font-bold">{{ title }}</span>
      </div>

      <div class="flex align-items-center gap-2">
        <Button icon="pi pi-search" text rounded />
        <Button icon="pi pi-bell" text rounded />
        <Button icon="pi pi-cog" text rounded />
        <Divider layout="vertical" class="hidden md:flex" />
        <Avatar shape="circle" label="JD" class="mr-2" />
        <Button :label="dark ? 'Light' : 'Dark'" size="small" text @click="$emit('toggle-dark')" />
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Topbar',
  props: { title: { type: String, default: 'Home' }, dark: { type: Boolean, default: false } }
}
</script>


