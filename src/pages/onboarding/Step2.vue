<template>
  <OnboardingWizard
    :current-step="2"
    :total-steps="11"
    step-title="Product Description"
    step-description="Tell us about your product or service to help craft better outreach messages"
    :can-proceed="description.length >= 50"
    @next="next"
    @skip="skipStep"
    @skip-all="skipAll"
    @previous="goBack"
  >
    <div class="form-content">
      <!-- Description Field -->
      <div class="field">
        <label for="description" class="field-label">
          <i class="pi pi-align-left mr-2"></i>
          Product/Service Description
        </label>
        <Textarea 
          id="description"
          v-model="description" 
          rows="6" 
          class="w-full"
          :class="{'p-invalid': error}"
          placeholder="Explain what your company does, who you serve, and your core value proposition..."
          @input="validateDescription"
          :maxlength="500"
        />
        
        <!-- Character Counter -->
        <div class="flex align-items-center justify-content-between mt-2">
          <small v-if="error" class="p-error">
            <i class="pi pi-exclamation-triangle mr-1"></i>
            {{ error }}
          </small>
          <small v-else class="text-600">
            <i class="pi pi-info-circle mr-1"></i>
            Minimum 50 characters for a meaningful description
          </small>
          
          <div class="character-counter" :class="characterCounterClass">
            <span>{{ charCount }}</span> / 500
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="character-progress mt-2">
          <div 
            class="character-progress-fill" 
            :style="{ width: progressWidth + '%' }"
            :class="progressClass"
          ></div>
        </div>
      </div>

      <!-- Writing Tips -->
      <div class="tips-card mt-4">
        <div class="tips-header">
          <i class="pi pi-pencil mr-2"></i>
          Writing Tips
        </div>
        <div class="tips-grid">
          <div class="tip-item">
            <i class="pi pi-check-circle text-green-500 mr-2"></i>
            <span>Be specific about your target audience</span>
          </div>
          <div class="tip-item">
            <i class="pi pi-check-circle text-green-500 mr-2"></i>
            <span>Highlight your unique value proposition</span>
          </div>
          <div class="tip-item">
            <i class="pi pi-check-circle text-green-500 mr-2"></i>
            <span>Mention key features or benefits</span>
          </div>
          <div class="tip-item">
            <i class="pi pi-check-circle text-green-500 mr-2"></i>
            <span>Keep it concise but comprehensive</span>
          </div>
        </div>
      </div>

      <!-- Example -->
      <div class="example-card mt-4" v-if="!description">
        <div class="example-header">
          <i class="pi pi-lightbulb mr-2"></i>
          Example Description
        </div>
        <div class="example-body">
          <p class="example-text">
            "We provide AI-powered customer support solutions for SaaS companies. 
            Our platform helps reduce response times by 70% through intelligent 
            ticket routing and automated responses, while maintaining a personal touch. 
            We serve mid-market B2B companies looking to scale their support operations 
            without proportionally increasing headcount."
          </p>
        </div>
      </div>

      <!-- Preview -->
      <div v-if="description.length >= 50" class="preview-card mt-4">
        <div class="preview-header">
          <i class="pi pi-eye mr-2"></i>
          How it will look in messages
        </div>
        <div class="preview-body">
          <div class="message-preview">
            <p>{{ description }}</p>
          </div>
        </div>
      </div>
    </div>
  </OnboardingWizard>
</template>

<script>
import Textarea from 'primevue/textarea'
import OnboardingWizard from '../../components/OnboardingWizard.vue'

export default {
  name: 'OnboardingStep2',
  components: { Textarea, OnboardingWizard },
  data() {
    return { 
      description: '',
      error: ''
    }
  },
  computed: {
    charCount() { 
      return (this.description || '').length 
    },
    progressWidth() {
      return Math.min((this.charCount / 500) * 100, 100)
    },
    characterCounterClass() {
      if (this.charCount < 50) return 'text-orange-500'
      if (this.charCount >= 200 && this.charCount <= 400) return 'text-green-600'
      return 'text-600'
    },
    progressClass() {
      if (this.charCount < 50) return 'progress-warning'
      if (this.charCount >= 200 && this.charCount <= 400) return 'progress-success'
      return 'progress-default'
    }
  },
  mounted() {
    const saved = JSON.parse(localStorage.getItem('outbounder-onboarding') || '{}')
    if (saved.description) {
      this.description = saved.description
      this.validateDescription()
    }
  },
  methods: {
    validateDescription() {
      this.error = ''
      if (this.description && this.description.length < 50) {
        this.error = `Please add ${50 - this.description.length} more characters for a meaningful description`
      }
    },
    saveProgress() {
      const data = JSON.parse(localStorage.getItem('outbounder-onboarding') || '{}')
      data.description = this.description
      data.currentStep = 2
      localStorage.setItem('outbounder-onboarding', JSON.stringify(data))
    },
    goBack() {
      this.$router.push('/onboarding/1')
    },
    skipStep() {
      const data = JSON.parse(localStorage.getItem('outbounder-onboarding') || '{}')
      data.skippedSteps = data.skippedSteps || []
      data.skippedSteps.push(2)
      data.currentStep = 2
      localStorage.setItem('outbounder-onboarding', JSON.stringify(data))
      this.$router.push('/onboarding/3')
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
      this.validateDescription()
      if (this.error) return
      
      if (this.description.length < 50) {
        this.error = 'Please provide a more detailed description (minimum 50 characters)'
        return
      }
      
      this.saveProgress()
      this.$router.push('/onboarding/3')
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

:deep(.p-inputtextarea) {
  padding: 0.75rem;
  font-size: 1rem;
  border-radius: 6px;
  border: 1px solid var(--surface-border);
  transition: all 0.2s;
  line-height: 1.6;
  resize: vertical;
}

:deep(.p-inputtextarea:focus) {
  box-shadow: 0 0 0 2px rgba(var(--primary-color-rgb), 0.2);
  border-color: var(--primary-color);
}

:deep(.p-inputtextarea.p-invalid) {
  border-color: var(--red-500);
}

.character-counter {
  font-size: 0.875rem;
  font-weight: 600;
  transition: color 0.3s ease;
}

.character-progress {
  height: 4px;
  background: var(--surface-200);
  border-radius: 2px;
  overflow: hidden;
}

.character-progress-fill {
  height: 100%;
  transition: all 0.3s ease;
  border-radius: 2px;
}

.progress-default {
  background: var(--primary-400);
}

.progress-warning {
  background: var(--orange-400);
}

.progress-success {
  background: var(--green-400);
}

.tips-card,
.example-card,
.preview-card {
  border: 1px solid var(--surface-border);
  border-radius: 8px;
  overflow: hidden;
  background: var(--surface-50);
}

.tips-header,
.example-header,
.preview-header {
  background: var(--surface-100);
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--surface-border);
  font-weight: 600;
  color: var(--text-color-secondary);
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

.example-body,
.preview-body {
  padding: 1rem;
}

.example-text {
  margin: 0;
  color: var(--text-color);
  font-style: italic;
  line-height: 1.6;
}

.message-preview {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid var(--surface-200);
  font-style: italic;
  line-height: 1.6;
}

.p-error {
  color: var(--red-500);
  font-size: 0.875rem;
}

.text-orange-500 {
  color: var(--orange-500);
}

.text-green-500 {
  color: var(--green-500);
}

.text-green-600 {
  color: var(--green-600);
}

.text-600 {
  color: var(--text-color-secondary);
  font-size: 0.875rem;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  .tips-card,
  .example-card,
  .preview-card {
    background: var(--surface-800);
    border-color: var(--surface-700);
  }
  
  .tips-header,
  .example-header,
  .preview-header {
    background: var(--surface-700);
    border-color: var(--surface-600);
  }
  
  .message-preview {
    background: var(--surface-card);
    border-color: var(--surface-600);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .tips-grid {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
}
</style>