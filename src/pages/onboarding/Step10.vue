<template>
  <OnboardingWizard
    :current-step="10"
    :total-steps="11"
    step-title="Customer Example & Outreach"
    step-description="Practice writing outreach to your ideal customer profile"
    :can-proceed="linkedinUrl.trim().length > 0 || message.length >= 100"
    @next="next"
    @skip="skipStep"
    @skip-all="skipAll"
    @previous="goBack"
    @go-to-step="goToStep"
  >
    <div class="flex flex-column gap-4">
      <!-- Instructions -->
      <div class="instructions-section">
        <div class="instructions-header">
          <i class="pi pi-info-circle mr-2"></i>
          How This Works
        </div>
        <div class="instructions-content">
          <p class="m-0 mb-3">This exercise helps you practice personalized outreach. You can either provide a LinkedIn profile of an ideal customer or write a sample message based on your target profile.</p>
          <div class="instruction-steps">
            <div class="step-item">
              <div class="step-number">1</div>
              <div class="step-text">Find a LinkedIn profile of someone who matches your ideal customer</div>
            </div>
            <div class="step-item">
              <div class="step-number">2</div>
              <div class="step-text">Write a personalized outreach message to them</div>
            </div>
            <div class="step-item">
              <div class="step-number">3</div>
              <div class="step-text">Use insights from their profile and your value proposition</div>
            </div>
          </div>
        </div>
      </div>

      <!-- LinkedIn URL Field -->
      <div class="field-group">
        <label for="linkedin" class="field-label">
          <i class="pi pi-linkedin mr-2"></i>
          LinkedIn Profile URL (Optional)
        </label>
        <InputText 
          id="linkedin"
          v-model="linkedinUrl" 
          placeholder="https://www.linkedin.com/in/example-prospect"
          class="w-full"
          :class="{'p-invalid': linkedinError}"
          @input="validateLinkedIn"
          @blur="validateLinkedIn"
        />
        <small v-if="linkedinError" class="p-error mt-1">
          <i class="pi pi-exclamation-triangle mr-1"></i>
          {{ linkedinError }}
        </small>
        <small v-else-if="linkedinUrl && isValidLinkedIn(linkedinUrl)" class="text-green-600 mt-1">
          <i class="pi pi-check-circle mr-1"></i>
          Valid LinkedIn profile URL
        </small>
        <small v-else class="text-600 mt-1">
          <i class="pi pi-info-circle mr-1"></i>
          Paste a LinkedIn profile URL to practice targeted outreach
        </small>
      </div>

      <!-- Sample Message Field -->
      <div class="field-group">
        <label for="message" class="field-label">
          <i class="pi pi-envelope mr-2"></i>
          Sample Outreach Message
        </label>
        <Textarea 
          id="message"
          v-model="message" 
          rows="8" 
          class="w-full p-3"
          :class="{'p-invalid': messageError}"
          placeholder="Hi [Name],\n\nI noticed you're [specific detail from their profile]...\n\nMany [their role] at [industry] companies struggle with [specific problem]...\n\n[Your solution/value proposition]\n\nWould you be open to a brief conversation about [specific benefit]?\n\nBest regards,\n[Your name]"
          @input="validateMessage"
          :maxlength="800"
        />
        
        <!-- Character Counter & Validation -->
        <div class="flex align-items-center justify-content-between mt-2">
          <small v-if="messageError" class="p-error">
            <i class="pi pi-exclamation-triangle mr-1"></i>
            {{ messageError }}
          </small>
          <small v-else class="text-600">
            <i class="pi pi-info-circle mr-1"></i>
            Write a personalized message using your value proposition
          </small>
          
          <div class="character-counter" :class="messageCounterClass">
            <span>{{ charCount }}</span> / 800
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="character-progress mt-2">
          <div 
            class="character-progress-fill" 
            :style="{ width: messageProgressWidth + '%' }"
            :class="messageProgressClass"
          ></div>
        </div>
      </div>

      <!-- Message Preview -->
      <div v-if="message.length >= 100" class="preview-section">
        <div class="preview-header">
          <i class="pi pi-eye mr-2"></i>
          Message Preview
        </div>
        <div class="preview-content">
          <div class="message-preview">
            <div class="message-header">
              <div class="message-from">
                <div class="sender-avatar">
                  <i class="pi pi-user"></i>
                </div>
                <div class="sender-info">
                  <div class="sender-name">You</div>
                  <div class="sender-title">Outreach Message</div>
                </div>
              </div>
              <div class="message-time">Now</div>
            </div>
            <div class="message-body">
              <pre class="message-text">{{ message }}</pre>
            </div>
            <div class="message-stats">
              <div class="stat-item">
                <i class="pi pi-align-left mr-1"></i>
                <span>{{ charCount }} characters</span>
              </div>
              <div class="stat-item">
                <i class="pi pi-clock mr-1"></i>
                <span>~{{ readingTime }} sec read</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Outreach Tips -->
      <div class="tips-section">
        <div class="tips-header">
          <i class="pi pi-star mr-2"></i>
          Effective Outreach Tips
        </div>
        <div class="tips-grid">
          <div class="tip-item">
            <i class="pi pi-check-circle text-green-500 mr-2"></i>
            <span>Personalize with specific details from their profile</span>
          </div>
          <div class="tip-item">
            <i class="pi pi-check-circle text-green-500 mr-2"></i>
            <span>Lead with a relevant problem they likely face</span>
          </div>
          <div class="tip-item">
            <i class="pi pi-check-circle text-green-500 mr-2"></i>
            <span>Be specific about the value you provide</span>
          </div>
          <div class="tip-item">
            <i class="pi pi-check-circle text-green-500 mr-2"></i>
            <span>End with a soft, specific call-to-action</span>
          </div>
          <div class="tip-item">
            <i class="pi pi-check-circle text-green-500 mr-2"></i>
            <span>Keep it concise - under 150 words is ideal</span>
          </div>
          <div class="tip-item">
            <i class="pi pi-check-circle text-green-500 mr-2"></i>
            <span>Avoid generic templates and sales-y language</span>
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
  name: 'OnboardingStep10',
  components: { InputText, Textarea, OnboardingWizard },
  data() { 
    return { 
      linkedinUrl: '', 
      message: '',
      linkedinError: '',
      messageError: ''
    } 
  },
  computed: {
    charCount() {
      return (this.message || '').length
    },
    messageProgressWidth() {
      return Math.min((this.charCount / 800) * 100, 100)
    },
    messageCounterClass() {
      if (this.charCount < 100) return 'text-orange-500'
      if (this.charCount >= 200 && this.charCount <= 600) return 'text-green-600'
      return 'text-600'
    },
    messageProgressClass() {
      if (this.charCount < 100) return 'progress-warning'
      if (this.charCount >= 200 && this.charCount <= 600) return 'progress-success'
      return 'progress-default'
    },
    readingTime() {
      // Average reading speed is ~250 words per minute
      const words = this.message.split(/\s+/).length
      const seconds = Math.max(Math.round((words / 250) * 60), 5)
      return seconds
    }
  },
  mounted() {
    const saved = JSON.parse(localStorage.getItem('outbounder-onboarding') || '{}')
    if (saved.linkedinUrl) {
      this.linkedinUrl = saved.linkedinUrl
      this.validateLinkedIn()
    }
    if (saved.sampleMessage) {
      this.message = saved.sampleMessage
      this.validateMessage()
    }
  },
  methods: {
    isValidLinkedIn(url) {
      if (!url) return false
      try {
        const normalizedUrl = this.normalizeLinkedIn(url)
        const urlPattern = /^https?:\/\/([\w]+\.)?linkedin\.com\/(in|pub|profile)\/[\w-]+/i
        return urlPattern.test(normalizedUrl)
      } catch (e) {
        return false
      }
    },
    normalizeLinkedIn(url) { 
      if (!url) return ''
      const trimmed = url.trim()
      if (trimmed && !trimmed.startsWith('http')) {
        return `https://www.linkedin.com/in/${trimmed}`
      }
      return trimmed
    },
    validateLinkedIn() {
      this.linkedinError = ''
      if (this.linkedinUrl && !this.isValidLinkedIn(this.linkedinUrl)) {
        this.linkedinError = 'Please enter a valid LinkedIn profile URL'
      }
    },
    validateMessage() {
      this.messageError = ''
      if (this.message && this.message.length < 100) {
        this.messageError = `Add ${100 - this.message.length} more characters for a complete message`
      }
    },
    saveProgress() {
      const data = JSON.parse(localStorage.getItem('outbounder-onboarding') || '{}')
      data.linkedinUrl = this.normalizeLinkedIn(this.linkedinUrl)
      data.sampleMessage = this.message
      data.currentStep = 10
      localStorage.setItem('outbounder-onboarding', JSON.stringify(data))
    },
    goBack() {
      this.$router.push('/onboarding/9')
    },
    goToStep(step) {
      if (step < 10) {
        this.$router.push(`/onboarding/${step}`)
      }
    },
    skipStep() {
      const data = JSON.parse(localStorage.getItem('outbounder-onboarding') || '{}')
      data.skippedSteps = data.skippedSteps || []
      data.skippedSteps.push(10)
      data.currentStep = 10
      localStorage.setItem('outbounder-onboarding', JSON.stringify(data))
      this.$router.push('/onboarding/11')
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
      this.validateLinkedIn()
      this.validateMessage()
      
      if (this.linkedinError || this.messageError) return
      
      if (!this.linkedinUrl.trim() && this.message.length < 100) {
        this.messageError = 'Please provide either a LinkedIn URL or write a sample message (minimum 100 characters)'
        return
      }
      
      this.saveProgress()
      this.$router.push('/onboarding/11')
    }
  }
}
</script>

<style scoped>
.instructions-section {
  background: linear-gradient(135deg, var(--blue-50), var(--indigo-50));
  border: 1px solid var(--blue-200);
  border-radius: 12px;
  overflow: hidden;
}

.instructions-header {
  padding: 0.75rem 1rem;
  font-weight: 600;
  color: var(--blue-700);
  font-size: 0.875rem;
  border-bottom: 1px solid var(--blue-200);
  background: rgba(255, 255, 255, 0.5);
}

.instructions-content {
  padding: 1.5rem;
  color: var(--blue-900);
}

.instruction-steps {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.step-number {
  width: 24px;
  height: 24px;
  background: var(--primary-500);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.8rem;
  flex-shrink: 0;
}

.step-text {
  font-size: 0.875rem;
}

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

:deep(.p-inputtextarea) {
  border-radius: 8px;
  transition: all 0.3s ease;
  border: 1px solid var(--surface-border);
  font-size: 0.95rem;
  line-height: 1.6;
  resize: vertical;
  font-family: var(--font-family);
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

.message-preview {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--surface-200);
  overflow: hidden;
}

.message-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--surface-200);
  background: var(--surface-50);
}

.message-from {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.sender-avatar {
  width: 32px;
  height: 32px;
  background: var(--primary-100);
  color: var(--primary-600);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
}

.sender-info {
  display: flex;
  flex-direction: column;
}

.sender-name {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text-color);
}

.sender-title {
  font-size: 0.8rem;
  color: var(--text-color-secondary);
}

.message-time {
  font-size: 0.8rem;
  color: var(--text-color-secondary);
}

.message-body {
  padding: 1.5rem;
}

.message-text {
  margin: 0;
  font-family: var(--font-family);
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--text-color);
  white-space: pre-wrap;
  word-wrap: break-word;
}

.message-stats {
  padding: 0.75rem 1.5rem;
  background: var(--surface-50);
  border-top: 1px solid var(--surface-200);
  display: flex;
  gap: 1rem;
}

.stat-item {
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  color: var(--text-color-secondary);
}

.tips-section {
  background: linear-gradient(135deg, var(--emerald-50), var(--teal-50));
  border: 1px solid var(--emerald-200);
  border-radius: 12px;
  overflow: hidden;
}

.tips-header {
  padding: 0.75rem 1rem;
  font-weight: 600;
  color: var(--emerald-700);
  font-size: 0.875rem;
  border-bottom: 1px solid var(--emerald-200);
  background: rgba(255, 255, 255, 0.5);
}

.tips-grid {
  padding: 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 0.75rem;
}

.tip-item {
  display: flex;
  align-items: flex-start;
  font-size: 0.875rem;
  color: var(--text-color);
  line-height: 1.4;
  gap: 0.5rem;
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

/* Validation states */
:deep(.p-inputtext.p-invalid) {
  border-color: var(--red-500);
}


:deep(.p-inputtextarea.p-invalid) {
  border-color: var(--red-500);
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .instructions-section {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(99, 102, 241, 0.05));
    border-color: var(--surface-600);
  }
  
  .instructions-header {
    background: rgba(0, 0, 0, 0.2);
    color: var(--blue-400);
    border-color: var(--surface-600);
  }
  
  .instructions-content {
    color: var(--text-color);
  }
  
  .preview-section {
    background: var(--surface-800);
    border-color: var(--surface-700);
  }
  
  .preview-header {
    background: var(--surface-700);
    border-color: var(--surface-600);
  }
  
  .message-preview {
    background: var(--surface-card);
    border-color: var(--surface-600);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
  
  .message-header {
    background: var(--surface-700);
    border-color: var(--surface-600);
  }
  
  .message-stats {
    background: var(--surface-700);
    border-color: var(--surface-600);
  }
  
  .tips-section {
    background: linear-gradient(135deg, rgba(5, 150, 105, 0.05), rgba(20, 184, 166, 0.05));
    border-color: var(--surface-600);
  }
  
  .tips-header {
    background: rgba(0, 0, 0, 0.2);
    color: var(--emerald-400);
    border-color: var(--surface-600);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .instruction-steps {
    gap: 0.5rem;
  }
  
  .tips-grid {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .message-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .message-stats {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .step-item {
    align-items: flex-start;
  }
  
  .tip-item {
    align-items: flex-start;
  }
}</style>


