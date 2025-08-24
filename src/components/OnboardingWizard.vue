<template>
  <div class="onboarding-wizard">
    <!-- Progress Bar -->
    <div class="progress-container">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
      </div>
      <div class="progress-text">
        Step {{ currentStep }} of {{ totalSteps }}
      </div>
    </div>

    <!-- Main Container -->
    <div class="wizard-container">
      <!-- Header -->
      <div class="wizard-header">
        <div class="logo-section">
          <i class="pi pi-diamond text-3xl text-primary mr-3" />
          <h1 class="text-2xl font-bold text-900 m-0">Outbounder Setup</h1>
        </div>
        
        <!-- Step Info -->
        <div class="step-info">
          <h2 class="step-title">{{ stepTitle }}</h2>
          <p class="step-description">{{ stepDescription }}</p>
        </div>
      </div>

      <!-- Content -->
      <div class="wizard-content">
        <slot></slot>
      </div>

      <!-- Navigation -->
      <div class="wizard-footer">
        <div class="nav-left">
          <Button 
            v-if="currentStep > 1"
            label="Previous" 
            icon="pi pi-arrow-left"
            class="p-button-text"
            @click="$emit('previous')"
          />
        </div>
        
        <div class="nav-right">
          <Button 
            v-if="!isLastStep"
            label="Skip Step" 
            class="p-button-text p-button-secondary mr-2"
            @click="$emit('skip')"
          />
          <Button 
            v-if="!isLastStep"
            label="Continue" 
            icon="pi pi-arrow-right"
            iconPos="right"
            @click="$emit('next')"
            :disabled="!canProceed"
          />
          <Button 
            v-else
            label="Complete Setup" 
            icon="pi pi-check"
            iconPos="right"
            class="p-button-success"
            @click="$emit('complete')"
            :disabled="!canProceed"
          />
        </div>
      </div>

      <!-- Skip All -->
      <div class="skip-all">
        <a href="#" @click.prevent="$emit('skip-all')" class="text-sm text-600 hover-primary">
          Skip onboarding and explore on my own
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import Button from 'primevue/button'

export default {
  name: 'OnboardingWizard',
  components: { Button },
  props: {
    currentStep: {
      type: Number,
      required: true
    },
    totalSteps: {
      type: Number,
      default: 11
    },
    stepTitle: {
      type: String,
      required: true
    },
    stepDescription: {
      type: String,
      default: ''
    },
    canProceed: {
      type: Boolean,
      default: true
    }
  },
  emits: ['next', 'previous', 'skip', 'skip-all', 'complete', 'go-to-step'],
  computed: {
    progressPercentage() {
      return (this.currentStep / this.totalSteps) * 100
    },
    isLastStep() {
      return this.currentStep === this.totalSteps
    }
  }
}
</script>

<style scoped>
.onboarding-wizard {
  min-height: 100vh;
  background: var(--surface-ground);
  padding: 1rem;
}

.progress-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: var(--surface-card);
  padding: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.progress-bar {
  height: 4px;
  background: var(--surface-200);
  position: relative;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--primary-color);
  transition: width 0.5s ease;
}

.progress-text {
  text-align: center;
  padding: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-color-secondary);
}

.wizard-container {
  max-width: 800px;
  margin: 0 auto;
  padding-top: 4rem;
}

.wizard-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo-section {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.step-info {
  margin-bottom: 1rem;
}

.step-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0 0 0.5rem 0;
}

.step-description {
  color: var(--text-color-secondary);
  margin: 0;
  font-size: 1rem;
}

.wizard-content {
  background: var(--surface-card);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.wizard-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.nav-left,
.nav-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.skip-all {
  text-align: center;
}

.hover-primary:hover {
  color: var(--primary-color);
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 768px) {
  .onboarding-wizard {
    padding: 0.5rem;
  }
  
  .wizard-container {
    padding-top: 5rem;
  }
  
  .wizard-content {
    padding: 1.5rem;
    border-radius: 8px;
  }
  
  .logo-section {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .logo-section h1 {
    font-size: 1.5rem;
  }
  
  .step-title {
    font-size: 1.25rem;
  }
  
  .wizard-footer {
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav-left,
  .nav-right {
    width: 100%;
    justify-content: center;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .wizard-content {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }
}
</style>