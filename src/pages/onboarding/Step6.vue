<template>
  <OnboardingWizard
    :current-step="6"
    :total-steps="11"
    step-title="Ideal Customer Examples"
    step-description="Provide examples of your best-fit customers and explain why they're ideal"
    :can-proceed="hasValidExamples"
    @next="next"
    @skip="skipStep"
    @skip-all="skipAll"
    @previous="goBack"
  >
    <div class="form-content">
      <!-- Instructions -->
      <div class="instructions-card">
        <div class="instructions-header">
          <i class="pi pi-info-circle mr-2"></i>
          Guidelines
        </div>
        <div class="instructions-body">
          <p>Provide at least one example of your ideal customer. The more detail you provide, the better we can help you target similar prospects.</p>
          <ul>
            <li>Use real company names when possible (they help with targeting)</li>
            <li>Explain specific reasons why they're a good fit</li>
            <li>Include company size, industry, or role details</li>
          </ul>
        </div>
      </div>

      <!-- Customer Examples -->
      <div class="examples-section">
        <div v-for="n in 3" :key="n" class="example-card">
          <div class="example-header">
            <h3>Example {{ n }}</h3>
            <span v-if="examples[n - 1].name" class="example-filled">
              <i class="pi pi-check-circle text-green-500 mr-1"></i>
              Completed
            </span>
          </div>

          <div class="example-form">
            <!-- Company Name -->
            <div class="field">
              <label :for="`name-${n}`" class="field-label">
                <i class="pi pi-building mr-2"></i>
                Company Name
              </label>
              <InputText 
                :id="`name-${n}`"
                v-model="examples[n - 1].name" 
                placeholder="e.g., Acme Corp, TechStart Inc."
                class="w-full"
              />
            </div>

            <!-- Website -->
            <div class="field">
              <label :for="`website-${n}`" class="field-label">
                <i class="pi pi-globe mr-2"></i>
                Website / Domain
              </label>
              <InputText 
                :id="`website-${n}`"
                v-model="examples[n - 1].website" 
                placeholder="e.g., acme.com, techstart.io"
                class="w-full"
              />
            </div>

            <!-- Reason -->
            <div class="field">
              <label :for="`reason-${n}`" class="field-label">
                <i class="pi pi-star mr-2"></i>
                Why are they a good fit?
              </label>
              <Textarea 
                :id="`reason-${n}`"
                v-model="examples[n - 1].reason" 
                rows="4" 
                class="w-full"
                placeholder="Explain why this customer is ideal - their size, industry, pain points, how they use your product..."
                :maxlength="300"
              />
              <div class="character-counter mt-1">
                <small class="text-600">{{ (examples[n - 1].reason || '').length }} / 300 characters</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Preview -->
      <div v-if="validExamples.length > 0" class="preview-card mt-4">
        <div class="preview-header">
          <i class="pi pi-eye mr-2"></i>
          Your Ideal Customer Profile
        </div>
        <div class="preview-body">
          <div class="examples-grid">
            <div v-for="(example, index) in validExamples" :key="index" class="customer-preview">
              <div class="customer-header">
                <div class="customer-name">{{ example.name || 'Example Company' }}</div>
                <div v-if="example.website" class="customer-website">{{ example.website }}</div>
              </div>
              <div v-if="example.reason" class="customer-reason">
                <p>{{ example.reason }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tips -->
      <div class="tips-card mt-4">
        <div class="tips-header">
          <i class="pi pi-lightbulb mr-2"></i>
          Pro Tips for Better Examples
        </div>
        <div class="tips-grid">
          <div class="tip-item">
            <i class="pi pi-check-circle text-green-500 mr-2"></i>
            <span>Include company size (employees, revenue)</span>
          </div>
          <div class="tip-item">
            <i class="pi pi-check-circle text-green-500 mr-2"></i>
            <span>Mention specific industry or vertical</span>
          </div>
          <div class="tip-item">
            <i class="pi pi-check-circle text-green-500 mr-2"></i>
            <span>Describe their main pain point you solve</span>
          </div>
          <div class="tip-item">
            <i class="pi pi-check-circle text-green-500 mr-2"></i>
            <span>Note their role in the buying process</span>
          </div>
        </div>
      </div>
    </div>
  </OnboardingWizard>
</template>

<script>
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import OnboardingWizard from '../../components/OnboardingWizard.vue'

export default {
  name: 'OnboardingStep6',
  components: { InputText, Textarea, OnboardingWizard },
  data() {
    return { 
      examples: [
        { name: '', website: '', reason: '' }, 
        { name: '', website: '', reason: '' }, 
        { name: '', website: '', reason: '' }
      ]
    }
  },
  computed: {
    validExamples() {
      return this.examples.filter(example => 
        example.name.trim() || example.reason.trim()
      )
    },
    hasValidExamples() {
      return this.validExamples.length > 0
    }
  },
  mounted() {
    const saved = JSON.parse(localStorage.getItem('outbounder-onboarding') || '{}')
    if (saved.examples) {
      this.examples = saved.examples
    }
  },
  methods: {
    saveProgress() {
      const data = JSON.parse(localStorage.getItem('outbounder-onboarding') || '{}')
      data.examples = this.examples
      data.currentStep = 6
      localStorage.setItem('outbounder-onboarding', JSON.stringify(data))
    },
    goBack() {
      this.$router.push('/onboarding/5')
    },
    skipStep() {
      const data = JSON.parse(localStorage.getItem('outbounder-onboarding') || '{}')
      data.skippedSteps = data.skippedSteps || []
      data.skippedSteps.push(6)
      data.currentStep = 6
      localStorage.setItem('outbounder-onboarding', JSON.stringify(data))
      this.$router.push('/onboarding/7')
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
      if (!this.hasValidExamples) {
        return
      }
      
      this.saveProgress()
      this.$router.push('/onboarding/7')
    }
  }
}
</script>

<style scoped>
.form-content {
  max-width: 800px;
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
  font-size: 0.95rem;
}

:deep(.p-inputtext),
:deep(.p-inputtextarea) {
  padding: 0.75rem;
  font-size: 1rem;
  border-radius: 6px;
  border: 1px solid var(--surface-border);
  transition: all 0.2s;
}

:deep(.p-inputtext:focus),
:deep(.p-inputtextarea:focus) {
  box-shadow: 0 0 0 2px rgba(var(--primary-color-rgb), 0.2);
  border-color: var(--primary-color);
}

:deep(.p-inputtextarea) {
  line-height: 1.6;
  resize: vertical;
}

.instructions-card,
.preview-card,
.tips-card {
  border: 1px solid var(--surface-border);
  border-radius: 8px;
  overflow: hidden;
  background: var(--surface-50);
  margin-bottom: 1.5rem;
}

.instructions-header,
.preview-header,
.tips-header {
  background: var(--surface-100);
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--surface-border);
  font-weight: 600;
  color: var(--text-color-secondary);
  font-size: 0.9rem;
}

.instructions-body,
.preview-body {
  padding: 1rem;
}

.instructions-body ul {
  margin: 0.5rem 0 0 0;
  padding-left: 1.5rem;
}

.instructions-body li {
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
}

.examples-section {
  display: grid;
  gap: 1.5rem;
}

.example-card {
  background: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: 8px;
  padding: 1.5rem;
}

.example-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--surface-200);
}

.example-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: var(--text-color);
}

.example-filled {
  font-size: 0.875rem;
  color: var(--green-600);
  font-weight: 500;
}

.example-form {
  display: grid;
  gap: 1rem;
}

.character-counter {
  text-align: right;
}

.examples-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.customer-preview {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid var(--surface-200);
}

.customer-header {
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--surface-200);
}

.customer-name {
  font-weight: 600;
  font-size: 1rem;
  color: var(--text-color);
  margin-bottom: 0.25rem;
}

.customer-website {
  color: var(--text-color-secondary);
  font-size: 0.875rem;
}

.customer-reason p {
  margin: 0;
  font-style: italic;
  color: var(--text-color);
  line-height: 1.5;
  font-size: 0.9rem;
}

.tips-grid {
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

.text-green-500 {
  color: var(--green-500);
}

.text-green-600 {
  color: var(--green-600);
}

.text-600 {
  color: var(--text-color-secondary);
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  .instructions-card,
  .preview-card,
  .tips-card {
    background: var(--surface-800);
    border-color: var(--surface-700);
  }
  
  .instructions-header,
  .preview-header,
  .tips-header {
    background: var(--surface-700);
    border-color: var(--surface-600);
  }
  
  .example-card {
    background: var(--surface-card);
    border-color: var(--surface-600);
  }
  
  .example-header {
    border-color: var(--surface-600);
  }
  
  .customer-preview {
    background: var(--surface-card);
    border-color: var(--surface-600);
  }
  
  .customer-header {
    border-color: var(--surface-600);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .examples-grid {
    grid-template-columns: 1fr;
  }
  
  .tips-grid {
    grid-template-columns: 1fr;
  }
  
  .example-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .example-form {
    gap: 1.25rem;
  }
}
</style>