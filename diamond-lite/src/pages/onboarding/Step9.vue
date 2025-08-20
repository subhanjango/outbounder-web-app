<template>
  <div class="onboarding">
    <div class="card w-full" style="max-width: 720px; margin: 0 auto">
      <div class="mb-3 flex align-items-start justify-content-between">
        <div>
          <h2 class="m-0">Step 9 of 11 — Problem Statement</h2>
          <p class="text-color-secondary m-0 mt-3">What specific problem are you solving for your customers?</p>
        </div>
        <Button label="Skip for now" text @click="skip" />
      </div>
      <div class="flex flex-column gap-3">
        <Textarea v-model="problem" rows="5" class="w-full" placeholder="Describe the challenges your customers face before using your solution..." />
        <div class="flex justify-content-between">
          <Button label="Back" icon="pi pi-arrow-left" @click="$router.back()" text />
          <Button label="Next" icon="pi pi-arrow-right" iconPos="right" @click="next" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'

export default {
  name: 'OnboardingStep9',
  components: { Textarea, Button },
  data() { return { problem: '' } },
  mounted() {
    const saved = JSON.parse(localStorage.getItem('outbounder-onboarding') || '{}')
    if (saved.problem) this.problem = saved.problem
  },
  methods: {
    saveProgress() {
      const data = JSON.parse(localStorage.getItem('outbounder-onboarding') || '{}')
      data.problem = this.problem
      localStorage.setItem('outbounder-onboarding', JSON.stringify(data))
    },
    next() { this.saveProgress(); this.$router.push('/onboarding/10') },
    skip() { localStorage.setItem('outbounder-onboarding-status', JSON.stringify({ completed: true, skipped: true, at: Date.now() })); this.$router.replace('/') }
  }
}
</script>

<style scoped>
.onboarding { padding: 2rem }
</style>


