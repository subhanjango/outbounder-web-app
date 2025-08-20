<template>
  <div class="onboarding">
    <div class="card w-full" style="max-width: 720px; margin: 0 auto">
      <div class="mb-3 flex align-items-start justify-content-between">
        <div>
          <h2 class="m-0">Step 2 of 11 — Product Description</h2>
          <p class="text-color-secondary m-0 mt-3">Describe your product or service in 3-4 sentences.</p>
        </div>
        <Button label="Skip for now" text @click="skip" />
      </div>
      <div class="flex flex-column gap-3">
        <div>
          <Textarea v-model="description" rows="5" class="w-full" placeholder="Explain what your company does, who you serve, and your core value proposition..." />
          <div class="text-sm mt-1" :class="{ 'text-orange-500': charCount < 200 || charCount > 400 }">{{ charCount }} characters (recommended 200-400)</div>
        </div>
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
  name: 'OnboardingStep2',
  components: { Textarea, Button },
  data() {
    return { description: '' }
  },
  computed: {
    charCount() { return (this.description || '').length }
  },
  mounted() {
    const saved = JSON.parse(localStorage.getItem('outbounder-onboarding') || '{}')
    if (saved.description) this.description = saved.description
  },
  methods: {
    saveProgress() {
      const data = JSON.parse(localStorage.getItem('outbounder-onboarding') || '{}')
      data.description = this.description
      localStorage.setItem('outbounder-onboarding', JSON.stringify(data))
    },
    skip() {
      localStorage.setItem('outbounder-onboarding-status', JSON.stringify({ completed: true, skipped: true, at: Date.now() }))
      this.$router.replace('/')
    },
    next() {
      this.saveProgress()
      this.$router.push('/onboarding/3')
    }
  }
}
</script>

<style scoped>
.onboarding { padding: 2rem }
</style>


