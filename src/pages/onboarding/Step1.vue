<template>
  <OnboardingWizard
    :current-step="1"
    :total-steps="11"
    step-title="Company Website"
    step-description="Let's start by adding your company's website to personalize your experience"
    :can-proceed="!!website && !error"
    @next="next"
    @skip="skipStep"
    @skip-all="skipAll"
    @previous="goBack"
  >
    <div class="form-content">
      <!-- Website Input -->
      <div class="field">
        <label for="website" class="field-label">
          <i class="pi pi-globe mr-2"></i>
          Company Website URL
        </label>
        <InputText 
          id="website"
          v-model="website" 
          placeholder="e.g., yourcompany.com" 
          class="w-full"
          :class="{'p-invalid': error}"
          @input="validateWebsite"
          @blur="validateWebsite"
        />
        <small v-if="error" class="p-error mt-2 block">
          <i class="pi pi-exclamation-triangle mr-1"></i>
          {{ error }}
        </small>
        <small v-else-if="website && isValidUrl(website)" class="text-green-600 mt-2 block">
          <i class="pi pi-check-circle mr-1"></i>
          Valid website URL
        </small>
        <small v-else class="text-600 mt-2 block">
          <i class="pi pi-info-circle mr-1"></i>
          Enter your company's main website address
        </small>
      </div>

      <!-- Preview -->
      <div v-if="website && isValidUrl(website)" class="preview-card mt-4">
        <div class="preview-header">
          <i class="pi pi-eye mr-2"></i>
          Preview
        </div>
        <div class="preview-body">
          <div class="flex align-items-center gap-3">
            <i class="pi pi-globe text-3xl text-primary"></i>
            <div>
              <div class="font-semibold">{{ normalizeUrl(website) }}</div>
              <div class="text-600 text-sm">This will be used to fetch company information</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tips -->
      <div class="tips-card mt-4">
        <div class="tips-header">
          <i class="pi pi-lightbulb mr-2"></i>
          Quick Tips
        </div>
        <ul class="tips-list">
          <li>Use your main company domain (e.g., company.com)</li>
          <li>We'll automatically add https:// if needed</li>
          <li>This helps us customize your outreach templates</li>
        </ul>
      </div>
    </div>
  </OnboardingWizard>
</template>

<script>
import InputText from 'primevue/inputtext'
import OnboardingWizard from '../../components/OnboardingWizard.vue'

export default {
  name: 'OnboardingStep1',
  components: { InputText, OnboardingWizard },
  data() {
    return { 
      website: '', 
      error: '' 
    }
  },
  mounted() {
    const saved = JSON.parse(localStorage.getItem('outbounder-onboarding') || '{}')
    if (saved.website) {
      this.website = saved.website
      this.validateWebsite()
    }
  },
  methods: {
    normalizeUrl(value) {
      if (!value) return ''
      const trimmed = value.trim().toLowerCase()
      const cleaned = trimmed.replace(/\/+$/, '')
      if (/^https?:\/\//i.test(cleaned)) return cleaned
      return `https://${cleaned}`
    },
    isValidUrl(value) {
      if (!value) return false
      try {
        const url = new URL(this.normalizeUrl(value))
        return url.hostname.includes('.')
      } catch (_e) {
        return false
      }
    },
    validateWebsite() {
      this.error = ''
      if (this.website && !this.isValidUrl(this.website)) {
        this.error = 'Please enter a valid website URL (e.g., company.com)'
      }
    },
    saveProgress() {
      const data = JSON.parse(localStorage.getItem('outbounder-onboarding') || '{}')
      data.website = this.normalizeUrl(this.website)
      data.currentStep = 1
      localStorage.setItem('outbounder-onboarding', JSON.stringify(data))
    },
    goBack() {
      this.$router.push('/login')
    },
    skipStep() {
      const data = JSON.parse(localStorage.getItem('outbounder-onboarding') || '{}')
      data.skippedSteps = data.skippedSteps || []
      data.skippedSteps.push(1)
      data.currentStep = 1
      localStorage.setItem('outbounder-onboarding', JSON.stringify(data))
      this.$router.push('/onboarding/2')
    },
    skipAll() {
      localStorage.setItem('outbounder-onboarding-status', JSON.stringify({ 
        completed: true, 
        skipped: true, 
        at: Date.now() 
      }))
      this.$router.replace('/')
    },
    next() {
      this.validateWebsite()
      if (this.error) return
      
      if (!this.website) {
        this.error = 'Please enter your company website'
        return
      }
      
      this.saveProgress()
      this.$router.push('/onboarding/2')
    }
  }
}
</script>

<style scoped>
.form-content {
  max-width: 600px;
  margin: 0 auto;
}

.field {
  margin-bottom: 1.5rem;
}

.field-label {
  display: block;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 0.5rem;
}

:deep(.p-inputtext) {
  padding: 0.75rem;
  font-size: 1rem;
  border-radius: 6px;
  border: 1px solid var(--surface-border);
  transition: all 0.2s;
}

:deep(.p-inputtext:focus) {
  box-shadow: 0 0 0 2px rgba(var(--primary-color-rgb), 0.2);
  border-color: var(--primary-color);
}

:deep(.p-inputtext.p-invalid) {
  border-color: var(--red-500);
}

.p-error {
  color: var(--red-500);
  font-size: 0.875rem;
}

.text-green-600 {
  color: var(--green-600);
  font-size: 0.875rem;
}

.text-600 {
  color: var(--text-color-secondary);
  font-size: 0.875rem;
}

.preview-card,
.tips-card {
  border: 1px solid var(--surface-border);
  border-radius: 8px;
  overflow: hidden;
  background: var(--surface-50);
}

.preview-header,
.tips-header {
  background: var(--surface-100);
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--surface-border);
  font-weight: 600;
  color: var(--text-color-secondary);
  font-size: 0.9rem;
}

.preview-body {
  padding: 1rem;
}

.tips-list {
  margin: 0;
  padding: 1rem 1rem 1rem 2rem;
  color: var(--text-color);
}

.tips-list li {
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.tips-list li:last-child {
  margin-bottom: 0;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  .preview-card,
  .tips-card {
    background: var(--surface-800);
    border-color: var(--surface-700);
  }
  
  .preview-header,
  .tips-header {
    background: var(--surface-700);
    border-color: var(--surface-600);
  }
}
</style>