<template>
  <div class="p-4">
    <div class="flex align-items-center gap-2 mb-3">
      <i class="pi pi-bolt text-2xl" />
      <h1>Outbounder</h1>
    </div>
    <p class="mb-3">Fresh Vue 3 + PrimeVue skeleton. Start building your UI here.</p>

    <div class="flex gap-2">
      <Button label="Primary" />
      <InputText placeholder="Type here" />
    </div>
  </div>
  <Toast />
</template>

<script>
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Toast from 'primevue/toast'

export default {
  name: 'Home',
  components: { Button, InputText, Toast }
}
</script>

<style scoped>
h1 {
  font-weight: 700;
}
</style>


