<template>
  <div class="onboarding">
    <div class="card w-full" style="max-width: 720px; margin: 0 auto">
      <div class="mb-3 flex align-items-start justify-content-between">
        <div>
          <h2 class="m-0">Step 5 of 11 — Geographic Markets</h2>
          <p class="text-color-secondary m-0 mt-3">What geographies are you selling in?</p>
        </div>
        <Button label="Skip for now" text @click="skip" />
      </div>
      <div class="flex flex-column gap-3">
        <div class="grid">
          <div class="col-12">
            <MultiSelect v-model="regions" :options="regionOptions" optionLabel="label" optionValue="value" placeholder="Select regions" class="w-full" />
          </div>
          <div class="col-12">
            <label class="block text-sm font-medium mb-1">Other</label>
            <InputText v-model="other" placeholder="Add other countries/regions" class="w-full" />
          </div>
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
import MultiSelect from 'primevue/multiselect'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'

export default {
  name: 'OnboardingStep5',
  components: { MultiSelect, InputText, Button },
  data() {
    return {
      regions: [],
      other: '',
      regionOptions: [
        { label: 'United States', value: 'US' },
        { label: 'Canada', value: 'CA' },
        { label: 'United Kingdom', value: 'UK' },
        { label: 'Australia', value: 'AU' },
        { label: 'European Union', value: 'EU' },
        { label: 'Latin America', value: 'LATAM' },
        { label: 'Asia-Pacific', value: 'APAC' }
      ]
    }
  },
  mounted() {
    const saved = JSON.parse(localStorage.getItem('outbounder-onboarding') || '{}')
    if (saved.regions) this.regions = saved.regions
    if (saved.regionsOther) this.other = saved.regionsOther
  },
  methods: {
    saveProgress() {
      const data = JSON.parse(localStorage.getItem('outbounder-onboarding') || '{}')
      data.regions = this.regions
      data.regionsOther = this.other
      localStorage.setItem('outbounder-onboarding', JSON.stringify(data))
    },
    skip() {
      localStorage.setItem('outbounder-onboarding-status', JSON.stringify({ completed: true, skipped: true, at: Date.now() }))
      this.$router.replace('/')
    },
    next() {
      this.saveProgress()
      this.$router.push('/onboarding/6')
    }
  }
}
</script>

<style scoped>
.onboarding { padding: 2rem }
</style>


