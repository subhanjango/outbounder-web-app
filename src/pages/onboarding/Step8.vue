<template>
  <OnboardingWizard
    :current-step="8"
    :total-steps="11"
    step-title="Target Job Titles"
    step-description="What are the best job titles to target and why?"
    :can-proceed="hasValidTitles"
    @next="next"
    @skip="skipStep"
    @skip-all="skipAll"
    @previous="goBack"
    @go-to-step="goToStep"
  >
    <div class="flex flex-column gap-4">
      <!-- Targeting Strategy Framework -->
      <div class="framework-section">
        <div class="framework-header">
          <i class="pi pi-users mr-2"></i>
          Title Targeting Strategy
        </div>
        <div class="framework-content">
          <p class="framework-description">Target job titles that have budget authority, feel the pain you solve, and are reachable through your outreach channels. Prioritize titles based on their influence in the buying process.</p>
          <div class="framework-grid">
            <div class="framework-item">
              <div class="framework-icon decision">
                <i class="pi pi-crown text-xl"></i>
              </div>
              <div class="framework-text">
                <div class="font-semibold mb-1">Decision Makers</div>
                <div class="text-sm text-600">Final approval authority</div>
              </div>
            </div>
            <div class="framework-item">
              <div class="framework-icon influencer">
                <i class="pi pi-share-alt text-xl"></i>
              </div>
              <div class="framework-text">
                <div class="font-semibold mb-1">Influencers</div>
                <div class="text-sm text-600">Shape the buying decision</div>
              </div>
            </div>
            <div class="framework-item">
              <div class="framework-icon user">
                <i class="pi pi-user text-xl"></i>
              </div>
              <div class="framework-text">
                <div class="font-semibold mb-1">End Users</div>
                <div class="text-sm text-600">Daily users of your solution</div>
              </div>
            </div>
            <div class="framework-item">
              <div class="framework-icon champion">
                <i class="pi pi-heart text-xl"></i>
              </div>
              <div class="framework-text">
                <div class="font-semibold mb-1">Champions</div>
                <div class="text-sm text-600">Internal advocates for change</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Titles List -->
      <div class="titles-container">
        <div v-for="(item, idx) in titles" :key="idx" class="title-card">
          <div class="title-card-header">
            <div class="title-info">
              <div class="title-number">{{ idx + 1 }}</div>
              <div class="title-label">Job Title {{ idx + 1 }}</div>
            </div>
            <div class="title-controls">
              <Button 
                icon="pi pi-arrow-up" 
                text 
                size="small"
                @click="move(idx, -1)" 
                :disabled="idx === 0"
                class="p-button-sm"
              />
              <Button 
                icon="pi pi-arrow-down" 
                text 
                size="small"
                @click="move(idx, 1)" 
                :disabled="idx === titles.length - 1"
                class="p-button-sm"
              />
              <Button 
                icon="pi pi-trash" 
                text 
                severity="danger" 
                size="small"
                @click="remove(idx)"
                class="p-button-sm"
              />
            </div>
          </div>
          
          <div class="title-form">
            <div class="field-group">
              <label :for="`title-${idx}`" class="field-label">
                <i class="pi pi-briefcase mr-2"></i>
                Job Title
              </label>
              <InputText 
                :id="`title-${idx}`"
                v-model="item.title" 
                class="w-full" 
                placeholder="e.g., VP of Sales, Marketing Director, CTO"
              />
            </div>

            <div class="field-group">
              <label :for="`reason-${idx}`" class="field-label">
                <i class="pi pi-question-circle mr-2"></i>
                Why target this role?
              </label>
              <Textarea 
                :id="`reason-${idx}`"
                v-model="item.reason" 
                rows="3" 
                class="w-full p-3"
                placeholder="Explain why this role is a good target - their pain points, budget authority, influence..."
                :maxlength="250"
              />
              <div class="character-counter mt-1">
                <small class="text-600">{{ (item.reason || '').length }} / 250 characters</small>
              </div>
            </div>
          </div>
        </div>
        
        <div class="add-title-section">
          <Button 
            label="Add Another Job Title" 
            icon="pi pi-plus" 
            text 
            @click="add"
            class="w-full p-3"
          />
        </div>
      </div>

      <!-- Preview Section -->
      <div v-if="validTitles.length > 0" class="preview-section">
        <div class="preview-header">
          <i class="pi pi-eye mr-2"></i>
          Your Target Titles (Priority Order)
        </div>
        <div class="preview-content">
          <div class="titles-list">
            <div v-for="(title, index) in validTitles" :key="index" class="title-preview-item">
              <div class="title-preview-header">
                <div class="title-priority">{{ index + 1 }}</div>
                <div class="title-name">{{ title.title }}</div>
                <div class="title-badge">Priority {{ index + 1 }}</div>
              </div>
              <div v-if="title.reason" class="title-reasoning">
                <p class="reason-text">{{ title.reason }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Common Titles Examples -->
      <div class="examples-section">
        <div class="examples-header">
          <i class="pi pi-lightbulb mr-2"></i>
          Common Target Titles by Department
        </div>
        <div class="examples-content">
          <div class="departments-grid">
            <div class="department-section">
              <h4 class="department-title">Sales & Marketing</h4>
              <div class="title-tags">
                <span v-for="title in salesMarketingTitles" :key="title" class="title-tag">
                  {{ title }}
                </span>
              </div>
            </div>
            <div class="department-section">
              <h4 class="department-title">Technology</h4>
              <div class="title-tags">
                <span v-for="title in techTitles" :key="title" class="title-tag">
                  {{ title }}
                </span>
              </div>
            </div>
            <div class="department-section">
              <h4 class="department-title">Operations & Finance</h4>
              <div class="title-tags">
                <span v-for="title in opsTitles" :key="title" class="title-tag">
                  {{ title }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </OnboardingWizard>
</template>

<script>
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import OnboardingWizard from '../../components/OnboardingWizard.vue'

export default {
  name: 'OnboardingStep8',
  components: { Button, InputText, Textarea, OnboardingWizard },
  data() {
    return { 
      titles: [ { title: '', reason: '' } ],
      salesMarketingTitles: [
        'VP of Sales', 'Sales Director', 'VP of Marketing', 'Marketing Director',
        'CMO', 'CRO', 'Head of Growth', 'Demand Gen Manager', 'Sales Manager'
      ],
      techTitles: [
        'CTO', 'VP of Engineering', 'Head of Product', 'Engineering Manager',
        'Product Manager', 'DevOps Manager', 'IT Director', 'Technical Lead'
      ],
      opsTitles: [
        'COO', 'CFO', 'VP of Operations', 'Operations Manager',
        'Head of Finance', 'Controller', 'Business Operations', 'Strategy Manager'
      ]
    }
  },
  computed: {
    validTitles() {
      return this.titles.filter(title => 
        title.title.trim() || title.reason.trim()
      )
    },
    hasValidTitles() {
      return this.validTitles.length > 0
    }
  },
  mounted() {
    const saved = JSON.parse(localStorage.getItem('outbounder-onboarding') || '{}')
    if (saved.titles) {
      this.titles = saved.titles
    }
  },
  methods: {
    add() { 
      this.titles.push({ title: '', reason: '' }) 
    },
    remove(i) { 
      if (this.titles.length > 1) {
        this.titles.splice(i, 1)
      }
    },
    move(i, delta) {
      const j = i + delta
      if (j < 0 || j >= this.titles.length) return
      const copy = [...this.titles]
      const tmp = copy[i]
      copy[i] = copy[j]
      copy[j] = tmp
      this.titles = copy
    },
    saveProgress() {
      const data = JSON.parse(localStorage.getItem('outbounder-onboarding') || '{}')
      data.titles = this.titles
      data.currentStep = 8
      localStorage.setItem('outbounder-onboarding', JSON.stringify(data))
    },
    goBack() {
      this.$router.push('/onboarding/7')
    },
    goToStep(step) {
      if (step < 8) {
        this.$router.push(`/onboarding/${step}`)
      }
    },
    skipStep() {
      const data = JSON.parse(localStorage.getItem('outbounder-onboarding') || '{}')
      data.skippedSteps = data.skippedSteps || []
      data.skippedSteps.push(8)
      data.currentStep = 8
      localStorage.setItem('outbounder-onboarding', JSON.stringify(data))
      this.$router.push('/onboarding/9')
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
      if (!this.hasValidTitles) {
        return
      }
      
      this.saveProgress()
      this.$router.push('/onboarding/9')
    }
  }
}
</script>

<style scoped>
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
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
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

.framework-icon.decision {
  background: var(--orange-100);
  color: var(--orange-600);
}

.framework-icon.influencer {
  background: var(--blue-100);
  color: var(--blue-600);
}

.framework-icon.user {
  background: var(--green-100);
  color: var(--green-600);
}

.framework-icon.champion {
  background: var(--purple-100);
  color: var(--purple-600);
}

.framework-text {
  flex: 1;
}

.titles-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.title-card {
  background: var(--surface-card);
  border: 1px solid var(--surface-200);
  border-radius: 12px;
  overflow: hidden;
}

.title-card-header {
  background: var(--surface-100);
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--surface-200);
}

.title-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.title-number {
  width: 32px;
  height: 32px;
  background: var(--primary-100);
  color: var(--primary-700);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
}

.title-label {
  font-weight: 600;
  color: var(--text-color);
}

.title-controls {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.title-form {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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
}

:deep(.p-inputtextarea:focus) {
  box-shadow: 0 0 0 3px rgba(var(--primary-color-rgb), 0.1);
  border-color: var(--primary-color);
}

.character-counter {
  text-align: right;
}

.add-title-section {
  border: 1px dashed var(--surface-300);
  border-radius: 12px;
  padding: 1rem;
  background: var(--surface-50);
}

:deep(.add-title-section .p-button) {
  border: none;
  background: transparent;
  color: var(--text-color-secondary);
  transition: all 0.3s ease;
}

:deep(.add-title-section .p-button:hover) {
  color: var(--primary-color);
  background: var(--primary-50);
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

.titles-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.title-preview-item {
  background: white;
  border-radius: 10px;
  padding: 1.25rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--surface-200);
}

.title-preview-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.title-priority {
  width: 28px;
  height: 28px;
  background: var(--primary-500);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  flex-shrink: 0;
}

.title-name {
  font-weight: 600;
  font-size: 1.1rem;
  color: var(--text-color);
  flex: 1;
}

.title-badge {
  background: var(--primary-100);
  color: var(--primary-700);
  padding: 0.25rem 0.75rem;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 600;
  flex-shrink: 0;
}

.title-reasoning {
  padding-left: 2.75rem;
}

.reason-text {
  margin: 0;
  color: var(--text-color-secondary);
  line-height: 1.5;
  font-style: italic;
}

.examples-section {
  background: linear-gradient(135deg, var(--cyan-50), var(--teal-50));
  border: 1px solid var(--cyan-200);
  border-radius: 12px;
  overflow: hidden;
}

.examples-header {
  padding: 0.75rem 1rem;
  font-weight: 600;
  color: var(--cyan-700);
  font-size: 0.875rem;
  border-bottom: 1px solid var(--cyan-200);
  background: rgba(255, 255, 255, 0.5);
}

.examples-content {
  padding: 1.5rem;
}

.departments-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.department-section {
  background: white;
  border-radius: 8px;
  padding: 1.25rem;
  border: 1px solid var(--surface-200);
}

.department-title {
  margin: 0 0 1rem 0;
  color: var(--text-color);
  font-size: 1rem;
  font-weight: 600;
  border-bottom: 2px solid var(--primary-100);
  padding-bottom: 0.5rem;
}

.title-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.title-tag {
  display: inline-block;
  padding: 0.4rem 0.75rem;
  background: var(--surface-100);
  color: var(--text-color);
  border-radius: 16px;
  font-size: 0.8rem;
  border: 1px solid var(--surface-200);
  transition: all 0.3s ease;
}

.title-tag:hover {
  background: var(--primary-100);
  color: var(--primary-700);
  cursor: pointer;
  border-color: var(--primary-200);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.text-600 {
  color: var(--text-color-secondary);
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
  
  .title-card {
    background: var(--surface-800);
    border-color: var(--surface-700);
  }
  
  .title-card-header {
    background: var(--surface-700);
    border-color: var(--surface-600);
  }
  
  .add-title-section {
    background: var(--surface-700);
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
  
  .title-preview-item {
    background: var(--surface-card);
    border-color: var(--surface-600);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }
  
  .examples-section {
    background: linear-gradient(135deg, rgba(6, 182, 212, 0.05), rgba(20, 184, 166, 0.05));
    border-color: var(--surface-600);
  }
  
  .examples-header {
    background: rgba(0, 0, 0, 0.2);
    color: var(--cyan-400);
    border-color: var(--surface-600);
  }
  
  .department-section {
    background: var(--surface-card);
    border-color: var(--surface-600);
  }
  
  .title-tag {
    background: var(--surface-700);
    border-color: var(--surface-600);
  }
  
  .title-tag:hover {
    background: rgba(var(--primary-color-rgb), 0.1);
    color: var(--primary-400);
    border-color: rgba(var(--primary-color-rgb), 0.2);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .framework-grid {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  }
  
  .title-card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .title-controls {
    align-self: stretch;
    justify-content: flex-end;
  }
  
  .title-preview-header {
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .title-reasoning {
    padding-left: 0;
    margin-top: 0.75rem;
  }
  
  .departments-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .framework-item {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0.5rem;
  }
}
</style>


