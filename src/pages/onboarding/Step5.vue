<template>
  <OnboardingWizard
    :current-step="5"
    :total-steps="11"
    step-title="Geographic Markets"
    step-description="What geographies are you selling in?"
    :can-proceed="regions.length > 0 || other.trim().length > 0"
    @next="next"
    @skip="skipStep"
    @skip-all="skipAll"
    @previous="goBack"
    @go-to-step="goToStep"
  >
    <div class="flex flex-column gap-4">
      <!-- Main Regions Selection -->
      <div class="field-group">
        <label for="regions" class="field-label">
          <i class="pi pi-globe mr-2"></i>
          Target Geographic Markets
        </label>
        <MultiSelect 
          id="regions"
          v-model="regions" 
          :options="regionOptions" 
          optionLabel="label" 
          optionValue="value" 
          placeholder="Select your target regions" 
          class="w-full p-3"
          :class="{'p-invalid': error}"
          display="chip"
          :showToggleAll="false"
          :filter="true"
          filterPlaceholder="Search regions..."
        />
        
        <small v-if="error" class="p-error mt-1">
          <i class="pi pi-exclamation-triangle mr-1"></i>
          {{ error }}
        </small>
        <small v-else class="text-600 mt-1">
          <i class="pi pi-info-circle mr-1"></i>
          Select all regions where you actively sell or plan to sell
        </small>
      </div>

      <!-- Additional Regions Field -->
      <div class="field-group">
        <label for="other" class="field-label">
          <i class="pi pi-plus mr-2"></i>
          Additional Countries/Regions
        </label>
        <InputText 
          id="other"
          v-model="other" 
          placeholder="e.g., Germany, Japan, Brazil"
          class="w-full"
        />
        <small class="text-600 mt-1">
          <i class="pi pi-info-circle mr-1"></i>
          Add specific countries not covered by the main regions above
        </small>
      </div>

      <!-- Selected Markets Preview -->
      <div v-if="regions.length > 0 || other.trim().length > 0" class="preview-section">
        <div class="preview-header">
          <i class="pi pi-eye mr-2"></i>
          Selected Markets
        </div>
        <div class="preview-content">
          <div class="markets-grid">
            <div v-for="region in selectedRegionLabels" :key="region" class="market-chip">
              <i class="pi pi-map mr-2"></i>
              {{ region }}
            </div>
            <div v-if="other.trim()" class="market-chip additional">
              <i class="pi pi-plus mr-2"></i>
              {{ other.trim() }}
            </div>
          </div>
        </div>
      </div>

      <!-- Market Strategy Tips -->
      <div class="tips-section">
        <div class="tips-header">
          <i class="pi pi-lightbulb mr-2"></i>
          Market Selection Tips
        </div>
        <div class="tips-content">
          <div class="tip-item">
            <i class="pi pi-check-circle text-green-500 mr-2"></i>
            <span>Start with markets where you have existing customers</span>
          </div>
          <div class="tip-item">
            <i class="pi pi-check-circle text-green-500 mr-2"></i>
            <span>Consider time zone compatibility for sales outreach</span>
          </div>
          <div class="tip-item">
            <i class="pi pi-check-circle text-green-500 mr-2"></i>
            <span>Factor in language and regulatory requirements</span>
          </div>
          <div class="tip-item">
            <i class="pi pi-check-circle text-green-500 mr-2"></i>
            <span>Focus on 2-3 regions initially for better results</span>
          </div>
        </div>
      </div>
    </div>
  </OnboardingWizard>
</template>

<script>
import MultiSelect from 'primevue/multiselect'
import InputText from 'primevue/inputtext'
import OnboardingWizard from '../../components/OnboardingWizard.vue'

export default {
  name: 'OnboardingStep5',
  components: { MultiSelect, InputText, OnboardingWizard },
  data() {
    return {
      regions: [],
      other: '',
      error: '',
      regionOptions: [
        { label: 'United States', value: 'US' },
        { label: 'Canada', value: 'CA' },
        { label: 'United Kingdom', value: 'UK' },
        { label: 'Australia', value: 'AU' },
        { label: 'European Union', value: 'EU' },
        { label: 'Germany', value: 'DE' },
        { label: 'France', value: 'FR' },
        { label: 'Netherlands', value: 'NL' },
        { label: 'Scandinavia', value: 'SCAN' },
        { label: 'Latin America', value: 'LATAM' },
        { label: 'Brazil', value: 'BR' },
        { label: 'Mexico', value: 'MX' },
        { label: 'Asia-Pacific', value: 'APAC' },
        { label: 'Japan', value: 'JP' },
        { label: 'India', value: 'IN' },
        { label: 'Singapore', value: 'SG' },
        { label: 'Middle East', value: 'ME' },
        { label: 'Africa', value: 'AF' }
      ]
    }
  },
  computed: {
    selectedRegionLabels() {
      return this.regions.map(value => {
        const option = this.regionOptions.find(opt => opt.value === value)
        return option ? option.label : value
      })
    }
  },
  mounted() {
    const saved = JSON.parse(localStorage.getItem('outbounder-onboarding') || '{}')
    if (saved.regions) this.regions = saved.regions
    if (saved.regionsOther) this.other = saved.regionsOther
  },
  methods: {
    validateMarkets() {
      this.error = ''
      if (this.regions.length === 0 && !this.other.trim()) {
        this.error = 'Please select at least one geographic market'
      }
    },
    saveProgress() {
      const data = JSON.parse(localStorage.getItem('outbounder-onboarding') || '{}')
      data.regions = this.regions
      data.regionsOther = this.other.trim()
      data.currentStep = 5
      localStorage.setItem('outbounder-onboarding', JSON.stringify(data))
    },
    goBack() {
      this.$router.push('/onboarding/4')
    },
    goToStep(step) {
      if (step < 5) {
        this.$router.push(`/onboarding/${step}`)
      }
    },
    skipStep() {
      const data = JSON.parse(localStorage.getItem('outbounder-onboarding') || '{}')
      data.skippedSteps = data.skippedSteps || []
      data.skippedSteps.push(5)
      data.currentStep = 5
      localStorage.setItem('outbounder-onboarding', JSON.stringify(data))
      this.$router.push('/onboarding/6')
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
      this.validateMarkets()
      if (this.error) return
      
      if (this.regions.length === 0 && !this.other.trim()) {
        this.error = 'Please select at least one geographic market to proceed'
        return
      }
      
      this.saveProgress()
      this.$router.push('/onboarding/6')
    }
  }
}
</script>

<style scoped>
.field-group {
  position: relative;
}

.field-label {
  display: block;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
}

:deep(.p-multiselect) {
  border-radius: 8px;
  transition: all 0.3s ease;
  border: 1px solid var(--surface-border);
}

:deep(.p-multiselect:not(.p-disabled).p-focus) {
  box-shadow: 0 0 0 3px rgba(var(--primary-color-rgb), 0.1);
  border-color: var(--primary-color);
}

:deep(.p-multiselect .p-multiselect-label) {
  padding: 0.75rem;
  font-size: 0.95rem;
}

:deep(.p-multiselect-panel) {
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
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

.preview-section {
  background: var(--surface-50);
  border: 1px solid var(--surface-200);
  border-radius: 12px;
  overflow: hidden;
  animation: fadeIn 0.3s ease;
}

.preview-header {
  background: var(--surface-100);
  padding: 0.75rem 1rem;
  font-weight: 600;
  color: var(--text-color-secondary);
  font-size: 0.875rem;
  border-bottom: 1px solid var(--surface-200);
}

.preview-content {
  padding: 1rem;
}

.markets-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.market-chip {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  background: var(--primary-100);
  color: var(--primary-700);
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid var(--primary-200);
}

.market-chip.additional {
  background: var(--orange-100);
  color: var(--orange-700);
  border-color: var(--orange-200);
}

.tips-section {
  background: linear-gradient(135deg, var(--green-50), var(--teal-50));
  border: 1px solid var(--green-200);
  border-radius: 12px;
  overflow: hidden;
}

.tips-header {
  padding: 0.75rem 1rem;
  font-weight: 600;
  color: var(--green-700);
  font-size: 0.875rem;
  border-bottom: 1px solid var(--green-200);
  background: rgba(255, 255, 255, 0.5);
}

.tips-content {
  padding: 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 0.75rem;
}

.tip-item {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  color: var(--text-color);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.text-green-500 {
  color: var(--green-500);
}

.text-600 {
  color: var(--text-color-secondary);
}

.p-error {
  color: var(--red-500);
  font-size: 0.875rem;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .preview-section {
    background: var(--surface-800);
    border-color: var(--surface-700);
  }
  
  .preview-header {
    background: var(--surface-700);
    border-color: var(--surface-600);
  }
  
  .market-chip {
    background: rgba(var(--primary-color-rgb), 0.1);
    color: var(--primary-400);
    border-color: rgba(var(--primary-color-rgb), 0.2);
  }
  
  .market-chip.additional {
    background: rgba(var(--orange-color-rgb), 0.1);
    color: var(--orange-400);
    border-color: rgba(var(--orange-color-rgb), 0.2);
  }
  
  .tips-section {
    background: linear-gradient(135deg, rgba(34, 197, 94, 0.05), rgba(20, 184, 166, 0.05));
    border-color: var(--surface-600);
  }
  
  .tips-header {
    background: rgba(0, 0, 0, 0.2);
    color: var(--green-400);
    border-color: var(--surface-600);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .tips-content {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .markets-grid {
    gap: 0.25rem;
  }
  
  .market-chip {
    font-size: 0.8rem;
    padding: 0.4rem 0.6rem;
  }
}
</style>


