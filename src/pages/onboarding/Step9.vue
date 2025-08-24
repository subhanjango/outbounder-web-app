<template>
  <OnboardingWizard
    :current-step="9"
    :total-steps="11"
    step-title="Problem Statement"
    step-description="What specific problem are you solving for your customers?"
    :can-proceed="problem.length >= 50"
    @next="next"
    @skip="skipStep"
    @skip-all="skipAll"
    @previous="goBack"
    @go-to-step="goToStep"
  >
    <div class="flex flex-column gap-4">
      <!-- Problem Statement Field -->
      <div class="field-group">
        <label for="problem" class="field-label">
          <i class="pi pi-exclamation-triangle mr-2"></i>
          Customer Problem Statement
        </label>
        <Textarea 
          id="problem"
          v-model="problem" 
          rows="6" 
          class="w-full p-3"
          :class="{'p-invalid': error}"
          placeholder="Describe the specific challenges your customers face before using your solution..."
          @input="validateProblem"
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
            Focus on the pain points your solution addresses
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

      <!-- Problem Framework -->
      <div class="framework-section">
        <div class="framework-header">
          <i class="pi pi-search mr-2"></i>
          Problem Identification Framework
        </div>
        <div class="framework-content">
          <p class="framework-description">A clear problem statement helps prospects immediately understand if your solution is relevant to them. Use this framework to structure your problem description.</p>
          <div class="framework-grid">
            <div class="framework-item">
              <div class="framework-icon current">
                <i class="pi pi-clock text-xl"></i>
              </div>
              <div class="framework-text">
                <div class="font-semibold mb-1">Current State</div>
                <div class="text-sm text-600">How do customers handle this today?</div>
              </div>
            </div>
            <div class="framework-item">
              <div class="framework-icon pain">
                <i class="pi pi-times-circle text-xl"></i>
              </div>
              <div class="framework-text">
                <div class="font-semibold mb-1">Pain Points</div>
                <div class="text-sm text-600">What goes wrong with current approaches?</div>
              </div>
            </div>
            <div class="framework-item">
              <div class="framework-icon impact">
                <i class="pi pi-chart-line text-xl"></i>
              </div>
              <div class="framework-text">
                <div class="font-semibold mb-1">Business Impact</div>
                <div class="text-sm text-600">How does this problem affect their business?</div>
              </div>
            </div>
            <div class="framework-item">
              <div class="framework-icon urgency">
                <i class="pi pi-bolt text-xl"></i>
              </div>
              <div class="framework-text">
                <div class="font-semibold mb-1">Urgency</div>
                <div class="text-sm text-600">Why do they need to solve this now?</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Examples Section -->
      <div class="examples-section" v-if="!problem">
        <div class="examples-header">
          <i class="pi pi-lightbulb mr-2"></i>
          Problem Statement Examples
        </div>
        <div class="examples-content">
          <div class="example-item">
            <div class="example-badge">SaaS</div>
            <p class="example-text">
              "Sales teams spend 60% of their time on manual data entry and lead qualification 
              instead of selling. This leads to missed quotas, frustrated reps, and poor visibility 
              into pipeline health. Without automated lead scoring, companies struggle to prioritize 
              their best opportunities and waste resources on low-quality prospects."
            </p>
          </div>
          <div class="example-item">
            <div class="example-badge">Consulting</div>
            <p class="example-text">
              "Large enterprises struggle with outdated legacy systems that can't scale with their growth. 
              Manual processes cause delays, errors, and compliance issues. Teams work in silos with 
              disconnected data, making it impossible to get real-time insights for critical business decisions."
            </p>
          </div>
        </div>
      </div>

      <!-- Preview Section -->
      <div v-if="problem.length >= 50" class="preview-section">
        <div class="preview-header">
          <i class="pi pi-eye mr-2"></i>
          How it will appear in outreach
        </div>
        <div class="preview-content">
          <div class="problem-card">
            <div class="problem-header">
              <i class="pi pi-exclamation-triangle text-orange-500 mr-2"></i>
              <span class="font-semibold">The Problem</span>
            </div>
            <p class="problem-text">{{ problem }}</p>
            <div class="problem-footer">
              <i class="pi pi-arrow-right text-primary mr-2"></i>
              <span class="text-sm text-600">This leads naturally to your solution...</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Tips Section -->
      <div class="tips-section">
        <div class="tips-header">
          <i class="pi pi-star mr-2"></i>
          Writing Effective Problem Statements
        </div>
        <div class="tips-grid">
          <div class="tip-item">
            <i class="pi pi-check-circle text-green-500 mr-2"></i>
            <span>Be specific about the problem, not generic</span>
          </div>
          <div class="tip-item">
            <i class="pi pi-check-circle text-green-500 mr-2"></i>
            <span>Include measurable impacts (time, money, efficiency)</span>
          </div>
          <div class="tip-item">
            <i class="pi pi-check-circle text-green-500 mr-2"></i>
            <span>Focus on problems your target audience relates to</span>
          </div>
          <div class="tip-item">
            <i class="pi pi-check-circle text-green-500 mr-2"></i>
            <span>Avoid jargon - use language your prospects use</span>
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
  name: 'OnboardingStep9',
  components: { Textarea, OnboardingWizard },
  data() { 
    return { 
      problem: '',
      error: ''
    } 
  },
  computed: {
    charCount() { 
      return (this.problem || '').length 
    },
    progressWidth() {
      return Math.min((this.charCount / 500) * 100, 100)
    },
    characterCounterClass() {
      if (this.charCount < 50) return 'text-orange-500'
      if (this.charCount >= 100 && this.charCount <= 400) return 'text-green-600'
      return 'text-600'
    },
    progressClass() {
      if (this.charCount < 50) return 'progress-warning'
      if (this.charCount >= 100 && this.charCount <= 400) return 'progress-success'
      return 'progress-default'
    }
  },
  mounted() {
    const saved = JSON.parse(localStorage.getItem('outbounder-onboarding') || '{}')
    if (saved.problem) {
      this.problem = saved.problem
      this.validateProblem()
    }
  },
  methods: {
    validateProblem() {
      this.error = ''
      if (this.problem && this.problem.length < 50) {
        this.error = `Add ${50 - this.problem.length} more characters for a complete problem statement`
      }
    },
    saveProgress() {
      const data = JSON.parse(localStorage.getItem('outbounder-onboarding') || '{}')
      data.problem = this.problem
      data.currentStep = 9
      localStorage.setItem('outbounder-onboarding', JSON.stringify(data))
    },
    goBack() {
      this.$router.push('/onboarding/8')
    },
    goToStep(step) {
      if (step < 9) {
        this.$router.push(`/onboarding/${step}`)
      }
    },
    skipStep() {
      const data = JSON.parse(localStorage.getItem('outbounder-onboarding') || '{}')
      data.skippedSteps = data.skippedSteps || []
      data.skippedSteps.push(9)
      data.currentStep = 9
      localStorage.setItem('outbounder-onboarding', JSON.stringify(data))
      this.$router.push('/onboarding/10')
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
      this.validateProblem()
      if (this.error) return
      
      if (this.problem.length < 50) {
        this.error = 'Please provide a more detailed problem statement (minimum 50 characters)'
        return
      }
      
      this.saveProgress()
      this.$router.push('/onboarding/10')
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

.framework-content {
  padding: 1.5rem;
}

.framework-description {
  margin: 0 0 1.5rem 0;
  color: var(--text-color);
  line-height: 1.6;
}

.framework-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.framework-item {
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  border: 1px solid var(--surface-200);
  align-items: flex-start;
}

.framework-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.framework-icon.current {
  background: var(--blue-100);
  color: var(--blue-600);
}

.framework-icon.pain {
  background: var(--red-100);
  color: var(--red-600);
}

.framework-icon.impact {
  background: var(--orange-100);
  color: var(--orange-600);
}

.framework-icon.urgency {
  background: var(--yellow-100);
  color: var(--yellow-600);
}

.framework-text {
  flex: 1;
}

.examples-section {
  background: linear-gradient(135deg, var(--indigo-50), var(--purple-50));
  border: 1px solid var(--indigo-200);
  border-radius: 12px;
  overflow: hidden;
}

.examples-header {
  padding: 0.75rem 1rem;
  font-weight: 600;
  color: var(--indigo-700);
  font-size: 0.875rem;
  border-bottom: 1px solid var(--indigo-200);
  background: rgba(255, 255, 255, 0.5);
}

.examples-content {
  padding: 1rem;
}

.example-item {
  margin-bottom: 1.5rem;
  padding: 1.25rem;
  background: white;
  border-radius: 8px;
  border: 1px solid var(--surface-200);
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
  margin-bottom: 0.75rem;
}

.example-text {
  margin: 0;
  color: var(--text-color);
  font-size: 0.875rem;
  line-height: 1.6;
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

.problem-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-left: 4px solid var(--orange-400);
}

.problem-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  color: var(--orange-600);
}

.problem-text {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  line-height: 1.7;
  color: var(--text-color);
}

.problem-footer {
  display: flex;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid var(--surface-200);
}

.tips-section {
  background: linear-gradient(135deg, var(--green-50), var(--emerald-50));
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

.text-primary {
  color: var(--primary-color);
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
  
  .examples-section {
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(147, 51, 234, 0.05));
    border-color: var(--surface-600);
  }
  
  .examples-header {
    background: rgba(0, 0, 0, 0.2);
    color: var(--indigo-400);
    border-color: var(--surface-600);
  }
  
  .example-item {
    background: var(--surface-card);
    border-color: var(--surface-600);
  }
  
  .preview-section {
    background: var(--surface-800);
    border-color: var(--surface-700);
  }
  
  .preview-header {
    background: var(--surface-700);
    border-color: var(--surface-600);
  }
  
  .problem-card {
    background: var(--surface-card);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
  
  .problem-footer {
    border-color: var(--surface-600);
  }
  
  .tips-section {
    background: linear-gradient(135deg, rgba(34, 197, 94, 0.05), rgba(5, 150, 105, 0.05));
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
  .framework-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
  
  .tips-grid {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .framework-item {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0.5rem;
  }
}</style>


