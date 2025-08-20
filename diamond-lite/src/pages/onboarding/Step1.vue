<template>
  <div class="onboarding">
    <div class="card w-full" style="max-width: 720px; margin: 0 auto">
      <div class="mb-3 flex align-items-start justify-content-between">
        <div>
          <h2 class="m-0">Step 1 of 11 — Website</h2>
        </div>
        <Button label="Skip for now" text @click="skip" />
      </div>
      <div class="flex flex-column gap-3">
        <div>
          <label class="block text-sm font-medium mb-1">Company Website</label>
          <InputText v-model="website" placeholder="e.g., yourcompany.com" class="w-full" />
          <div v-if="error" class="text-red-500 text-sm mt-1">{{ error }}</div>
        </div>
        <div class="flex justify-content-between">
          <div />
          <Button label="Next" icon="pi pi-arrow-right" iconPos="right" @click="next" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'

export default {
  name: 'OnboardingStep1',
  components: { InputText, Button },
  data() {
    return { website: '', error: '' }
  },
  mounted() {
    const saved = JSON.parse(localStorage.getItem('outbounder-onboarding') || '{}')
    if (saved.website) this.website = saved.website
  },
  methods: {
    normalizeUrl(value) {
      if (!value) return ''
      const trimmed = value.trim()
      if (/^https?:\/\//i.test(trimmed)) return trimmed
      return `https://${trimmed}`
    },
    isValidUrl(value) {
      try {
        // eslint-disable-next-line no-new
        new URL(this.normalizeUrl(value))
        return true
      } catch (_e) {
        return false
      }
    },
    saveProgress() {
      const data = JSON.parse(localStorage.getItem('outbounder-onboarding') || '{}')
      data.website = this.normalizeUrl(this.website)
      localStorage.setItem('outbounder-onboarding', JSON.stringify(data))
    },
    skip() {
      localStorage.setItem('outbounder-onboarding-status', JSON.stringify({ completed: true, skipped: true, at: Date.now() }))
      this.$router.replace('/')
    },
    next() {
      this.error = ''
      if (!this.website || !this.isValidUrl(this.website)) {
        this.error = 'Please enter a valid website URL'
        return
      }
      this.saveProgress()
      this.$router.push('/onboarding/2')
    }
  }
}
</script>

<style scoped>
.onboarding { padding: 2rem }
</style>


