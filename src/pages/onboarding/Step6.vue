<template>
  <div class="onboarding">
    <div class="card w-full" style="max-width: 900px; margin: 0 auto">
      <div class="mb-3 flex align-items-start justify-content-between">
        <div>
          <h2 class="m-0">Step 6 of 11 — Ideal Customer Examples</h2>
          <p class="text-color-secondary m-0 mt-3">Provide 3 examples of your best-fit customers and explain why they're ideal.</p>
        </div>
        <Button label="Skip for now" text @click="skip" />
      </div>
      <Accordion multiple :activeIndex="[0]">
        <AccordionTab v-for="n in 3" :key="n" :header="`Example ${n}`">
          <div class="grid">
            <div class="col-12 md:col-6">
              <label class="block text-sm font-medium mb-1">Company Name</label>
              <InputText v-model="examples[n - 1].name" placeholder="e.g., Acme Inc." class="w-full" />
            </div>
            <div class="col-12 md:col-6">
              <label class="block text-sm font-medium mb-1">Website / Domain</label>
              <InputText v-model="examples[n - 1].website" placeholder="e.g., acme.com" class="w-full" />
            </div>
            <div class="col-12">
              <label class="block text-sm font-medium mb-1">Why are they a good fit?</label>
              <Textarea v-model="examples[n - 1].reason" rows="3" class="w-full" />
            </div>
          </div>
        </AccordionTab>
      </Accordion>
      <div class="flex justify-content-between mt-3">
        <Button label="Back" icon="pi pi-arrow-left" @click="$router.back()" text />
        <Button label="Next" icon="pi pi-arrow-right" iconPos="right" @click="next" />
      </div>
    </div>
  </div>
</template>

<script>
import Accordion from 'primevue/accordion'
import AccordionTab from 'primevue/accordiontab'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'

export default {
  name: 'OnboardingStep6',
  components: { Accordion, AccordionTab, InputText, Textarea, Button },
  data() {
    return { examples: [ { name: '', website: '', reason: '' }, { name: '', website: '', reason: '' }, { name: '', website: '', reason: '' } ] }
  },
  mounted() {
    const saved = JSON.parse(localStorage.getItem('outbounder-onboarding') || '{}')
    if (saved.examples) this.examples = saved.examples
  },
  methods: {
    saveProgress() {
      const data = JSON.parse(localStorage.getItem('outbounder-onboarding') || '{}')
      data.examples = this.examples
      localStorage.setItem('outbounder-onboarding', JSON.stringify(data))
    },
    next() { this.saveProgress(); this.$router.push('/onboarding/7') },
    skip() { localStorage.setItem('outbounder-onboarding-status', JSON.stringify({ completed: true, skipped: true, at: Date.now() })); this.$router.replace('/') }
  }
}
</script>

<style scoped>
.onboarding { padding: 2rem }
</style>


