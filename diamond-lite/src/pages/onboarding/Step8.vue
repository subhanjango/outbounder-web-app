<template>
  <div class="onboarding">
    <div class="card w-full" style="max-width: 900px; margin: 0 auto">
      <div class="mb-3 flex align-items-start justify-content-between">
        <div>
          <h2 class="m-0">Step 8 of 11 — Target Titles/Roles</h2>
          <p class="text-color-secondary m-0 mt-3">What are the best job titles to target and why?</p>
        </div>
        <Button label="Skip for now" text @click="skip" />
      </div>
      <div class="flex flex-column gap-3">
        <div v-for="(item, idx) in titles" :key="idx" class="card p-3">
          <div class="flex justify-content-between align-items-center mb-2">
            <div class="font-semibold">Title {{ idx + 1 }}</div>
            <div class="flex gap-2">
              <Button icon="pi pi-arrow-up" text @click="move(idx, -1)" :disabled="idx === 0" />
              <Button icon="pi pi-arrow-down" text @click="move(idx, 1)" :disabled="idx === titles.length - 1" />
              <Button icon="pi pi-trash" text severity="danger" @click="remove(idx)" />
            </div>
          </div>
          <div class="grid">
            <div class="col-12 md:col-6">
              <label class="block text-sm font-medium mb-1">Job Title</label>
              <InputText v-model="item.title" class="w-full" placeholder="e.g., VP of Sales" />
            </div>
            <div class="col-12">
              <label class="block text-sm font-medium mb-1">Reason for targeting</label>
              <Textarea v-model="item.reason" rows="3" class="w-full" />
            </div>
          </div>
        </div>
        <Button label="Add Title" icon="pi pi-plus" text @click="add" />
        <div class="flex justify-content-between">
          <Button label="Back" icon="pi pi-arrow-left" @click="$router.back()" text />
          <Button label="Next" icon="pi pi-arrow-right" iconPos="right" @click="next" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'

export default {
  name: 'OnboardingStep8',
  components: { Button, InputText, Textarea },
  data() {
    return { titles: [ { title: '', reason: '' } ] }
  },
  mounted() {
    const saved = JSON.parse(localStorage.getItem('outbounder-onboarding') || '{}')
    if (saved.titles) this.titles = saved.titles
  },
  methods: {
    add() { this.titles.push({ title: '', reason: '' }) },
    remove(i) { this.titles.splice(i, 1) },
    move(i, delta) {
      const j = i + delta
      if (j < 0 || j >= this.titles.length) return
      const copy = [...this.titles]
      const tmp = copy[i]
      copy[i] = copy[j]
      copy[j] = tmp
      this.titles = copy
    },
    saveProgress() {
      const data = JSON.parse(localStorage.getItem('outbounder-onboarding') || '{}')
      data.titles = this.titles
      localStorage.setItem('outbounder-onboarding', JSON.stringify(data))
    },
    next() { this.saveProgress(); this.$router.push('/onboarding/9') },
    skip() { localStorage.setItem('outbounder-onboarding-status', JSON.stringify({ completed: true, skipped: true, at: Date.now() })); this.$router.replace('/') }
  }
}
</script>

<style scoped>
.onboarding { padding: 2rem }
</style>


