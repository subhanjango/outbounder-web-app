<template>
  <div class="onboarding">
    <div class="card w-full" style="max-width: 720px; margin: 0 auto">
      <div class="mb-3 flex align-items-start justify-content-between">
        <div>
          <h2 class="m-0">Step 3 of 11 — Value Proposition</h2>
          <p class="text-color-secondary m-0 mt-3">Describe how you deliver value to your best-fit customers.</p>
        </div>
        <Button label="Skip for now" text @click="skip" />
      </div>
      <div class="flex flex-column gap-3">
        <Textarea v-model="valueProp" rows="5" class="w-full" placeholder="What specific problems do you solve? What outcomes do your customers achieve?" />
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
  name: 'OnboardingStep3',
  components: { Textarea, Button },
  data() { return { valueProp: '' } },
  mounted() {
    const saved = JSON.parse(localStorage.getItem('outbounder-onboarding') || '{}')
    if (saved.valueProp) this.valueProp = saved.valueProp
  },
  methods: {
    saveProgress() {
      const data = JSON.parse(localStorage.getItem('outbounder-onboarding') || '{}')
      data.valueProp = this.valueProp
      localStorage.setItem('outbounder-onboarding', JSON.stringify(data))
    },
    skip() {
      localStorage.setItem('outbounder-onboarding-status', JSON.stringify({ completed: true, skipped: true, at: Date.now() }))
      this.$router.replace('/')
    },
    next() {
      this.saveProgress()
      this.$router.push('/onboarding/4')
    }
  }
}
</script>

<style scoped>
.onboarding { padding: 2rem }
</style>


