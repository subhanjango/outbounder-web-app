<template>
  <OnboardingWizard
    :current-step="4"
    :total-steps="11"
    step-title="Competitive Differentiation"
    step-description="What makes you different from your competitors?"
    :can-proceed="differentiation.length >= 30"
    @next="next"
    @skip="skipStep"
    @skip-all="skipAll"
    @previous="goBack"
    @go-to-step="goToStep"
  >
    <div class="flex flex-column gap-4">
      <!-- Differentiation Field -->
      <div class="field-group">
        <label for="differentiation" class="field-label">
          <i class="pi pi-trophy mr-2"></i>
          Competitive Advantages
        </label>
        <Textarea 
          id="differentiation"
          v-model="differentiation" 
          rows="5" 
          class="w-full p-3"
          :class="{'p-invalid': error}"
          placeholder="What unique advantages do you offer compared to alternatives in the market?"
          @input="validateDifferentiation"
          :maxlength="400"
        />
        
        <!-- Character Counter -->
        <div class="flex align-items-center justify-content-between mt-2">
          <small v-if="error" class="p-error">
            <i class="pi pi-exclamation-triangle mr-1"></i>
            {{ error }}
          </small>
          <small v-else class="text-600">
            <i class="pi pi-info-circle mr-1"></i>
            Focus on what sets you apart from competitors
          </small>
          
          <div class="character-counter" :class="characterCounterClass">
            <span>{{ charCount }}</span> / 400
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

      <!-- Differentiation Framework -->
      <div class="framework-section">
        <div class="framework-header">
          <i class="pi pi-chart-bar mr-2"></i>
          Differentiation Framework
        </div>
        <div class="framework-grid">
          <div class="framework-item">
            <div class="framework-icon">
              <i class="pi pi-cog text-xl"></i>
            </div>
            <div class="framework-content">
              <div class="font-semibold mb-1">Features</div>
              <div class="text-sm text-600">Unique capabilities or functionality</div>
            </div>
          </div>
          <div class="framework-item">
            <div class="framework-icon">
              <i class="pi pi-clock text-xl"></i>
            </div>
            <div class="framework-content">
              <div class="font-semibold mb-1">Speed/Efficiency</div>
              <div class="text-sm text-600">Faster implementation or results</div>
            </div>
          </div>
          <div class="framework-item">
            <div class="framework-icon">
              <i class="pi pi-dollar text-xl"></i>
            </div>
            <div class="framework-content">
              <div class="font-semibold mb-1">Price/Value</div>
              <div class="text-sm text-600">Better pricing or ROI model</div>
            </div>
          </div>
          <div class="framework-item">
            <div class="framework-icon">
              <i class="pi pi-heart text-xl"></i>
            </div>
            <div class="framework-content">
              <div class="font-semibold mb-1">Experience</div>
              <div class="text-sm text-600">Superior customer experience</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Examples -->
      <div class="examples-section" v-if="!differentiation">
        <div class="examples-header">
          <i class="pi pi-lightbulb mr-2"></i>
          Example Differentiators
        </div>
        <div class="examples-content">
          <div class="example-item">
            <div class="example-badge">Technology</div>
            <p class="example-text">
              "Unlike traditional CRM solutions, our platform uses AI to automatically score leads 
              and predict conversion likelihood with 95% accuracy."
            </p>
          </div>
          <div class="example-item">
            <div class="example-badge">Service</div>
            <p class="example-text">
              "We provide dedicated success managers and guarantee 24-hour response times, 
              while our competitors typically take 3-5 business days."
            </p>
          </div>
        </div>
      </div>

      <!-- Preview -->
      <div v-if="differentiation.length >= 30" class="preview-section">
        <div class="preview-header">
          <i class="pi pi-eye mr-2"></i>
          Your Competitive Edge
        </div>
        <div class="preview-content">
          <div class="competitive-card">
            <i class="pi pi-shield text-primary mb-2"></i>
            <p class="competitive-text">{{ differentiation }}</p>
            <div class="competitive-footer">
              <i class="pi pi-check-circle text-green-500 mr-2"></i>
              <span class="text-sm text-600">This will be used in your outreach messages</span>
            </div>
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
  name: 'OnboardingStep4',
  components: { Textarea, OnboardingWizard },
  data() { 
    return { 
      differentiation: '',
      error: ''
    } 
  },
  computed: {
    charCount() { 
      return (this.differentiation || '').length 
    },
    progressWidth() {
      return Math.min((this.charCount / 400) * 100, 100)
    },
    characterCounterClass() {
      if (this.charCount < 30) return 'text-orange-500'
      if (this.charCount >= 80 && this.charCount <= 300) return 'text-green-600'
      return 'text-600'
    },
    progressClass() {
      if (this.charCount < 30) return 'progress-warning'
      if (this.charCount >= 80 && this.charCount <= 300) return 'progress-success'
      return 'progress-default'
    }
  },
  mounted() {
    const saved = JSON.parse(localStorage.getItem('outbounder-onboarding') || '{}')
    if (saved.differentiation) {
      this.differentiation = saved.differentiation
      this.validateDifferentiation()
    }
  },
  methods: {
    validateDifferentiation() {
      this.error = ''
      if (this.differentiation && this.differentiation.length < 30) {
        this.error = `Add ${30 - this.differentiation.length} more characters for a complete description`
      }
    },
    saveProgress() {
      const data = JSON.parse(localStorage.getItem('outbounder-onboarding') || '{}')
      data.differentiation = this.differentiation
      data.currentStep = 4
      localStorage.setItem('outbounder-onboarding', JSON.stringify(data))
    },
    goBack() {
      this.$router.push('/onboarding/3')
    },
    goToStep(step) {
      if (step < 4) {
        this.$router.push(`/onboarding/${step}`)
      }
    },
    skipStep() {
      const data = JSON.parse(localStorage.getItem('outbounder-onboarding') || '{}')
      data.skippedSteps = data.skippedSteps || []
      data.skippedSteps.push(4)
      data.currentStep = 4
      localStorage.setItem('outbounder-onboarding', JSON.stringify(data))
      this.$router.push('/onboarding/5')
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
      this.validateDifferentiation()
      if (this.error) return
      
      if (this.differentiation.length < 30) {
        this.error = 'Please provide more details about your competitive advantages (minimum 30 characters)'
        return
      }
      
      this.saveProgress()
      this.$router.push('/onboarding/5')
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

:deep(.p-inputtextarea) {
  border-radius: 8px;
  transition: all 0.3s ease;
  border: 1px solid var(--surface-border);
  font-size: 0.95rem;
  line-height: 1.6;
  resize: vertical;
}

:deep(.p-inputtextarea:focus) {
  box-shadow: 0 0 0 3px rgba(var(--primary-color-rgb), 0.1);
  border-color: var(--primary-color);
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

.framework-section {
  background: var(--surface-50);
  border: 1px solid var(--surface-200);
  border-radius: 12px;
  overflow: hidden;
}

.framework-header {
  background: var(--surface-100);
  padding: 0.75rem 1rem;
  font-weight: 600;
  color: var(--text-color-secondary);
  font-size: 0.875rem;
  border-bottom: 1px solid var(--surface-200);
}

.framework-grid {
  padding: 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.framework-item {
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem;
  background: white;
  border-radius: 8px;
  border: 1px solid var(--surface-200);
}

.framework-icon {
  width: 40px;
  height: 40px;
  background: var(--primary-100);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-600);
  flex-shrink: 0;
}

.framework-content {
  flex: 1;
}

.examples-section {
  background: linear-gradient(135deg, var(--blue-50), var(--purple-50));
  border: 1px solid var(--blue-200);
  border-radius: 12px;
  overflow: hidden;
}

.examples-header {
  padding: 0.75rem 1rem;
  font-weight: 600;
  color: var(--blue-700);
  font-size: 0.875rem;
  border-bottom: 1px solid var(--blue-200);
  background: rgba(255, 255, 255, 0.5);
}

.examples-content {
  padding: 1rem;
}

.example-item {
  margin-bottom: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
}

.example-item:last-child {
  margin-bottom: 0;
}

.example-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: var(--primary-100);
  color: var(--primary-700);
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.example-text {
  margin: 0;
  color: var(--text-color);
  font-size: 0.875rem;
  line-height: 1.5;
  font-style: italic;
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
  padding: 1.5rem;
}

.competitive-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.competitive-text {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--text-color);
  margin: 1rem 0;
  font-style: italic;
}

.competitive-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1rem;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
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
}

.p-error {
  color: var(--red-500);
  font-size: 0.875rem;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .framework-section {
    background: var(--surface-800);
    border-color: var(--surface-700);
  }
  
  .framework-header {
    background: var(--surface-700);
    border-color: var(--surface-600);
  }
  
  .framework-item {
    background: var(--surface-card);
    border-color: var(--surface-600);
  }
  
  .framework-icon {
    background: rgba(var(--primary-color-rgb), 0.1);
  }
  
  .examples-section {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(168, 85, 247, 0.05));
    border-color: var(--surface-600);
  }
  
  .examples-header {
    background: rgba(0, 0, 0, 0.2);
    color: var(--blue-400);
    border-color: var(--surface-600);
  }
  
  .example-item {
    background: var(--surface-card);
  }
  
  .preview-section {
    background: var(--surface-800);
    border-color: var(--surface-700);
  }
  
  .preview-header {
    background: var(--surface-700);
    border-color: var(--surface-600);
  }
  
  .competitive-card {
    background: var(--surface-card);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
}
</style>


