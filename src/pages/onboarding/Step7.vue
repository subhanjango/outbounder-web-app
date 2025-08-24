<template>
  <OnboardingWizard
    :current-step="7"
    :total-steps="11"
    step-title="Target Verticals"
    step-description="What verticals or industries do you sell into?"
    :can-proceed="hasValidVerticals"
    @next="next"
    @skip="skipStep"
    @skip-all="skipAll"
    @previous="goBack"
  >
    <div class="form-content">
      <!-- Industry Framework -->
      <div class="framework-card">
        <div class="framework-header">
          <i class="pi pi-sitemap mr-2"></i>
          Industry Targeting Framework
        </div>
        <div class="framework-body">
          <p>Define the industries where your solution has the strongest product-market fit. Focus on verticals where you understand the pain points and can demonstrate clear value.</p>
          <div class="framework-grid">
            <div class="framework-item">
              <div class="framework-icon">
                <i class="pi pi-chart-pie text-xl"></i>
              </div>
              <div class="framework-text">
                <div class="font-semibold mb-1">Market Size</div>
                <div class="text-sm text-600">Large enough addressable market</div>
              </div>
            </div>
            <div class="framework-item">
              <div class="framework-icon">
                <i class="pi pi-exclamation-circle text-xl"></i>
              </div>
              <div class="framework-text">
                <div class="font-semibold mb-1">Pain Points</div>
                <div class="text-sm text-600">Clear, urgent problems to solve</div>
              </div>
            </div>
            <div class="framework-item">
              <div class="framework-icon">
                <i class="pi pi-dollar text-xl"></i>
              </div>
              <div class="framework-text">
                <div class="font-semibold mb-1">Budget</div>
                <div class="text-sm text-600">Willing and able to pay</div>
              </div>
            </div>
            <div class="framework-item">
              <div class="framework-icon">
                <i class="pi pi-users text-xl"></i>
              </div>
              <div class="framework-text">
                <div class="font-semibold mb-1">Access</div>
                <div class="text-sm text-600">Reachable decision makers</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Target Verticals -->
      <div class="verticals-section">
        <div v-for="(vertical, idx) in verticals" :key="idx" class="vertical-card">
          <div class="vertical-header">
            <h3>Vertical {{ idx + 1 }}</h3>
            <div class="vertical-actions">
              <span v-if="vertical.name" class="vertical-filled">
                <i class="pi pi-check-circle text-green-500 mr-1"></i>
                Completed
              </span>
              <Button 
                v-if="verticals.length > 1" 
                icon="pi pi-trash" 
                text 
                severity="danger" 
                @click="removeVertical(idx)"
                class="p-button-sm ml-2"
              />
            </div>
          </div>

          <div class="vertical-form">
            <!-- Industry/Vertical Name -->
            <div class="field">
              <label :for="`vertical-name-${idx}`" class="field-label">
                <i class="pi pi-building mr-2"></i>
                Industry/Vertical Name
              </label>
              <InputText 
                :id="`vertical-name-${idx}`"
                v-model="vertical.name" 
                placeholder="e.g., SaaS, Healthcare, Financial Services"
                class="w-full"
              />
            </div>

            <!-- Why this vertical -->
            <div class="field">
              <label :for="`vertical-reason-${idx}`" class="field-label">
                <i class="pi pi-question-circle mr-2"></i>
                Why this vertical needs your solution
              </label>
              <Textarea 
                :id="`vertical-reason-${idx}`"
                v-model="vertical.reason" 
                rows="4" 
                class="w-full"
                placeholder="Describe the specific problems this industry faces that your product solves..."
                :maxlength="300"
              />
              <div class="character-counter mt-1">
                <small class="text-600">{{ (vertical.reason || '').length }} / 300 characters</small>
              </div>
            </div>
          </div>
        </div>

        <!-- Add Vertical Button -->
        <div class="add-vertical-section">
          <Button 
            label="Add Another Vertical" 
            icon="pi pi-plus" 
            text 
            @click="addVertical"
            class="w-full add-vertical-btn"
          />
        </div>
      </div>

      <!-- Preview -->
      <div v-if="validVerticals.length > 0" class="preview-card mt-4">
        <div class="preview-header">
          <i class="pi pi-eye mr-2"></i>
          Your Target Industries
        </div>
        <div class="preview-body">
          <div class="verticals-grid">
            <div v-for="(vertical, index) in validVerticals" :key="index" class="vertical-preview">
              <div class="vertical-preview-header">
                <div class="vertical-name">{{ vertical.name }}</div>
                <div class="vertical-badge">Vertical {{ index + 1 }}</div>
              </div>
              <div v-if="vertical.reason" class="vertical-reason">
                <p>{{ vertical.reason }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Industry Examples -->
      <div class="examples-card mt-4">
        <div class="examples-header">
          <i class="pi pi-lightbulb mr-2"></i>
          Common Industry Verticals
        </div>
        <div class="examples-body">
          <div class="industry-tags">
            <span 
              v-for="industry in industryExamples" 
              :key="industry" 
              class="industry-tag"
              @click="addIndustryExample(industry)"
            >
              {{ industry }}
            </span>
          </div>
          <p class="examples-note">
            <i class="pi pi-info-circle mr-1"></i>
            Click on any industry above to add it to your verticals
          </p>
        </div>
      </div>
    </div>
  </OnboardingWizard>
</template>

<script>
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'
import OnboardingWizard from '../../components/OnboardingWizard.vue'

export default {
  name: 'OnboardingStep7',
  components: { InputText, Textarea, Button, OnboardingWizard },
  data() {
    return { 
      verticals: [
        { name: '', reason: '' },
        { name: '', reason: '' },
        { name: '', reason: '' }
      ],
      industryExamples: [
        'SaaS/Technology', 'Healthcare', 'Financial Services', 'Manufacturing', 
        'E-commerce/Retail', 'Education', 'Real Estate', 'Professional Services',
        'Media & Entertainment', 'Non-Profit', 'Government', 'Automotive',
        'Energy & Utilities', 'Food & Beverage', 'Travel & Hospitality',
        'Construction', 'Agriculture', 'Logistics & Supply Chain'
      ]
    }
  },
  computed: {
    validVerticals() {
      return this.verticals.filter(vertical => 
        vertical.name.trim() || vertical.reason.trim()
      )
    },
    hasValidVerticals() {
      return this.validVerticals.length > 0
    }
  },
  mounted() {
    const saved = JSON.parse(localStorage.getItem('outbounder-onboarding') || '{}')
    if (saved.verticals) {
      this.verticals = saved.verticals
    }
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
    addIndustryExample(industry) {
      // Find first empty vertical or add new one
      let emptyVertical = this.verticals.find(v => !v.name.trim())
      if (!emptyVertical) {
        this.addVertical()
        emptyVertical = this.verticals[this.verticals.length - 1]
      }
      emptyVertical.name = industry
    },
    saveProgress() {
      const data = JSON.parse(localStorage.getItem('outbounder-onboarding') || '{}')
      data.verticals = this.verticals
      data.currentStep = 7
      localStorage.setItem('outbounder-onboarding', JSON.stringify(data))
    },
    goBack() {
      this.$router.push('/onboarding/6')
    },
    skipStep() {
      const data = JSON.parse(localStorage.getItem('outbounder-onboarding') || '{}')
      data.skippedSteps = data.skippedSteps || []
      data.skippedSteps.push(7)
      data.currentStep = 7
      localStorage.setItem('outbounder-onboarding', JSON.stringify(data))
      this.$router.push('/onboarding/8')
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
      if (!this.hasValidVerticals) {
        return
      }
      
      this.saveProgress()
      this.$router.push('/onboarding/8')
    }
  }
}
</script>

<style scoped>
.form-content {
  max-width: 900px;
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

.framework-card,
.preview-card,
.examples-card {
  border: 1px solid var(--surface-border);
  border-radius: 8px;
  overflow: hidden;
  background: var(--surface-50);
  margin-bottom: 1.5rem;
}

.framework-header,
.preview-header,
.examples-header {
  background: var(--surface-100);
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--surface-border);
  font-weight: 600;
  color: var(--text-color-secondary);
  font-size: 0.9rem;
}

.framework-body,
.preview-body,
.examples-body {
  padding: 1.5rem;
}

.framework-body p {
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
  background: var(--primary-100);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-600);
  flex-shrink: 0;
}

.framework-text {
  flex: 1;
}

.verticals-section {
  display: grid;
  gap: 1.5rem;
}

.vertical-card {
  background: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: 8px;
  padding: 1.5rem;
}

.vertical-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--surface-200);
}

.vertical-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: var(--text-color);
}

.vertical-actions {
  display: flex;
  align-items: center;
}

.vertical-filled {
  font-size: 0.875rem;
  color: var(--green-600);
  font-weight: 500;
}

.vertical-form {
  display: grid;
  gap: 1rem;
}

.character-counter {
  text-align: right;
}

.add-vertical-section {
  border: 1px dashed var(--surface-300);
  border-radius: 8px;
  padding: 1rem;
  background: var(--surface-50);
}

.add-vertical-btn {
  border: none;
  background: transparent;
  color: var(--text-color-secondary);
  transition: all 0.3s ease;
}

.add-vertical-btn:hover {
  color: var(--primary-color);
  background: var(--primary-50);
}

.verticals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.vertical-preview {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid var(--surface-200);
}

.vertical-preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--surface-200);
}

.vertical-name {
  font-weight: 600;
  font-size: 1rem;
  color: var(--text-color);
}

.vertical-badge {
  background: var(--primary-100);
  color: var(--primary-700);
  padding: 0.25rem 0.75rem;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 600;
}

.vertical-reason p {
  margin: 0;
  font-style: italic;
  color: var(--text-color);
  line-height: 1.5;
  font-size: 0.9rem;
}

.industry-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.industry-tag {
  display: inline-block;
  padding: 0.4rem 0.75rem;
  background: white;
  color: var(--text-color);
  border-radius: 16px;
  font-size: 0.8rem;
  border: 1px solid var(--surface-200);
  transition: all 0.3s ease;
  cursor: pointer;
}

.industry-tag:hover {
  background: var(--primary-100);
  color: var(--primary-700);
  border-color: var(--primary-200);
  transform: translateY(-1px);
}

.examples-note {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-color-secondary);
  font-style: italic;
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
  .framework-card,
  .preview-card,
  .examples-card {
    background: var(--surface-800);
    border-color: var(--surface-700);
  }
  
  .framework-header,
  .preview-header,
  .examples-header {
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
  
  .vertical-card {
    background: var(--surface-card);
    border-color: var(--surface-600);
  }
  
  .vertical-header {
    border-color: var(--surface-600);
  }
  
  .add-vertical-section {
    background: var(--surface-700);
    border-color: var(--surface-600);
  }
  
  .vertical-preview {
    background: var(--surface-card);
    border-color: var(--surface-600);
  }
  
  .vertical-preview-header {
    border-color: var(--surface-600);
  }
  
  .industry-tag {
    background: var(--surface-card);
    border-color: var(--surface-600);
  }
  
  .industry-tag:hover {
    background: rgba(var(--primary-color-rgb), 0.1);
    color: var(--primary-400);
    border-color: rgba(var(--primary-color-rgb), 0.3);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .framework-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
  
  .verticals-grid {
    grid-template-columns: 1fr;
  }
  
  .vertical-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .vertical-actions {
    align-self: flex-end;
  }
  
  .framework-item {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0.5rem;
  }
  
  .industry-tags {
    gap: 0.25rem;
  }
  
  .industry-tag {
    font-size: 0.75rem;
    padding: 0.3rem 0.6rem;
  }
}
</style>