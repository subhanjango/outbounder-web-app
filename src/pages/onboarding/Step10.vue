<template>
  <div class="onboarding">
    <div class="card w-full" style="max-width: 900px; margin: 0 auto">
      <div class="mb-3 flex align-items-start justify-content-between">
        <h2 class="m-0">Step 10 of 11 — Customer Example & Outreach</h2>
        <Button label="Skip for now" text @click="skip" />
      </div>
      <div class="flex flex-column gap-3">
        <div>
          <label class="block text-sm font-medium mb-1">Paste the LinkedIn URL of one of your best-fit customers</label>
          <InputText v-model="linkedinUrl" placeholder="https://www.linkedin.com/in/..." class="w-full" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Write a sample email/message to this contact</label>
          <Textarea v-model="message" rows="6" class="w-full" placeholder="Draft your outreach..." />
          <div class="text-sm mt-1">{{ (message || '').length }} characters</div>
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
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'

export default {
  name: 'OnboardingStep10',
  components: { InputText, Textarea, Button },
  data() { return { linkedinUrl: '', message: '' } },
  mounted() {
    const saved = JSON.parse(localStorage.getItem('outbounder-onboarding') || '{}')
    if (saved.linkedinUrl) this.linkedinUrl = saved.linkedinUrl
    if (saved.sampleMessage) this.message = saved.sampleMessage
  },
  methods: {
    normalizeLinkedIn(url) { return url.trim() },
    saveProgress() {
      const data = JSON.parse(localStorage.getItem('outbounder-onboarding') || '{}')
      data.linkedinUrl = this.normalizeLinkedIn(this.linkedinUrl)
      data.sampleMessage = this.message
      localStorage.setItem('outbounder-onboarding', JSON.stringify(data))
    },
    next() { this.saveProgress(); this.$router.push('/onboarding/11') },
    skip() { localStorage.setItem('outbounder-onboarding-status', JSON.stringify({ completed: true, skipped: true, at: Date.now() })); this.$router.replace('/') }
  }
}
</script>

<style scoped>
.onboarding { padding: 2rem }
</style>


