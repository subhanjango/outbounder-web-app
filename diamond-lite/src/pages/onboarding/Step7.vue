<template>
  <div class="onboarding">
    <div class="card w-full" style="max-width: 900px; margin: 0 auto">
      <div class="mb-3 flex align-items-start justify-content-between">
        <div>
          <h2 class="m-0">Step 7 of 11 — Target Verticals</h2>
          <p class="text-color-secondary m-0 mt-3">What verticals or industries do you sell into?</p>
        </div>
        <Button label="Skip for now" text @click="skip" />
      </div>
      <Accordion multiple :activeIndex="[0]">
        <AccordionTab v-for="(vertical, idx) in verticals" :key="idx" :header="`Vertical ${idx + 1}`">
          <div class="grid">
            <div class="col-12">
              <div class="flex justify-content-between align-items-center mb-2">
                <div class="font-semibold">Vertical {{ idx + 1 }}</div>
                <Button icon="pi pi-trash" text severity="danger" @click="removeVertical(idx)" v-if="verticals.length > 1" />
              </div>
              <label class="block text-sm font-medium mb-1">Vertical Name</label>
              <InputText v-model="vertical.name" placeholder="e.g., SaaS, Healthcare, Financial Services" class="w-full" />
            </div>
            <div class="col-12">
              <label class="block text-sm font-medium mb-1">Why this vertical needs your product/service</label>
              <Textarea v-model="vertical.reason" rows="3" class="w-full" />
            </div>
          </div>
        </AccordionTab>
      </Accordion>
      <Button label="Add Vertical" icon="pi pi-plus" text @click="addVertical" class="mt-2" />
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
  name: 'OnboardingStep7',
  components: { Accordion, AccordionTab, InputText, Textarea, Button },
  data() {
    return { verticals: [ { name: '', reason: '' }, { name: '', reason: '' }, { name: '', reason: '' } ] }
  },
  mounted() {
    const saved = JSON.parse(localStorage.getItem('outbounder-onboarding') || '{}')
    if (saved.verticals) this.verticals = saved.verticals
  },
  methods: {
    addVertical() {
      this.verticals.push({ name: '', reason: '' })
    },
    removeVertical(index) {
      if (this.verticals.length > 1) {
        this.verticals.splice(index, 1)
      }
    },
    saveProgress() {
      const data = JSON.parse(localStorage.getItem('outbounder-onboarding') || '{}')
      data.verticals = this.verticals
      localStorage.setItem('outbounder-onboarding', JSON.stringify(data))
    },
    next() { this.saveProgress(); this.$router.push('/onboarding/8') },
    skip() { localStorage.setItem('outbounder-onboarding-status', JSON.stringify({ completed: true, skipped: true, at: Date.now() })); this.$router.replace('/') }
  }
}
</script>

<style scoped>
.onboarding { padding: 2rem }
</style>