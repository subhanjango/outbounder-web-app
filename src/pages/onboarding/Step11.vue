<template>
  <OnboardingWizard
    :current-step="11"
    :total-steps="11"
    step-title="Documentation Upload"
    step-description="Upload any relevant documentation to enhance your knowledge base (optional)"
    :can-proceed="true"
    @next="finish"
    @skip="skipStep"
    @skip-all="skipStep"
    @previous="goBack"
    @go-to-step="goToStep"
    @complete="finish"
  >
    <div class="flex flex-column gap-4">
      <!-- Upload Instructions -->
      <div class="instructions-section">
        <div class="instructions-header">
          <i class="pi pi-info-circle mr-2"></i>
          What to Upload
        </div>
        <div class="instructions-content">
          <p class="m-0 mb-3">Upload documents that will help personalize your outreach campaigns. All uploaded content will be added to your knowledge base for easy access.</p>
          <div class="upload-types">
            <div class="type-item">
              <i class="pi pi-file-pdf text-red-500 mr-2"></i>
              <span><strong>Sales Materials:</strong> Pitch decks, case studies, one-pagers</span>
            </div>
            <div class="type-item">
              <i class="pi pi-file text-blue-500 mr-2"></i>
              <span><strong>Product Docs:</strong> Feature guides, technical specifications</span>
            </div>
            <div class="type-item">
              <i class="pi pi-chart-line text-green-500 mr-2"></i>
              <span><strong>Market Research:</strong> Industry reports, competitor analysis</span>
            </div>
            <div class="type-item">
              <i class="pi pi-users text-purple-500 mr-2"></i>
              <span><strong>Customer Info:</strong> Success stories, testimonials, personas</span>
            </div>
          </div>
        </div>
      </div>

      <!-- File Upload Section -->
      <div class="upload-section">
        <div class="field-group">
          <label class="field-label">
            <i class="pi pi-cloud-upload mr-2"></i>
            Upload Files
          </label>
          <FileUpload 
            mode="advanced" 
            name="files[]"
            :customUpload="true"
            accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.md"
            :multiple="true"
            chooseLabel="Browse Files"
            uploadLabel="Add to Knowledge Base"
            cancelLabel="Clear All"
            @uploader="onUpload"
            class="custom-file-upload"
          >
            <template #empty>
              <div class="upload-empty">
                <i class="pi pi-cloud-upload text-4xl text-primary mb-3"></i>
                <div class="upload-text">
                  <p class="font-semibold text-lg mb-2">Drag and drop files here</p>
                  <p class="text-600 mb-3">or click to browse your computer</p>
                  <div class="supported-formats">
                    <span class="format-badge">PDF</span>
                    <span class="format-badge">DOC</span>
                    <span class="format-badge">DOCX</span>
                    <span class="format-badge">PPT</span>
                    <span class="format-badge">TXT</span>
                    <span class="format-badge">MD</span>
                  </div>
                </div>
              </div>
            </template>
          </FileUpload>
          <small class="text-600 mt-2">
            <i class="pi pi-info-circle mr-1"></i>
            Files will be processed and added to your knowledge base automatically
          </small>
        </div>
      </div>

      <!-- Upload Status -->
      <div v-if="uploadedFiles.length > 0" class="uploaded-files-section">
        <div class="uploaded-header">
          <i class="pi pi-check-circle text-green-500 mr-2"></i>
          Uploaded Files ({{ uploadedFiles.length }})
        </div>
        <div class="uploaded-list">
          <div v-for="(file, index) in uploadedFiles" :key="index" class="uploaded-item">
            <div class="file-icon">
              <i :class="getFileIcon(file.type)"></i>
            </div>
            <div class="file-info">
              <div class="file-name">{{ file.name }}</div>
              <div class="file-size">{{ formatFileSize(file.size) }}</div>
            </div>
            <div class="file-status">
              <i class="pi pi-check-circle text-green-500"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Knowledge Base Integration Preview -->
      <div class="integration-preview">
        <div class="preview-header">
          <i class="pi pi-database mr-2"></i>
          What Happens Next
        </div>
        <div class="preview-content">
          <div class="integration-steps">
            <div class="integration-step">
              <div class="step-icon completed">
                <i class="pi pi-check"></i>
              </div>
              <div class="step-content">
                <div class="step-title">Onboarding Data Collected</div>
                <div class="step-description">{{ savedEntriesCount }} entries will be saved to your knowledge base</div>
              </div>
            </div>
            <div class="integration-step">
              <div class="step-icon" :class="uploadedFiles.length > 0 ? 'completed' : 'pending'">
                <i :class="uploadedFiles.length > 0 ? 'pi pi-check' : 'pi pi-clock'"></i>
              </div>
              <div class="step-content">
                <div class="step-title">Documents Processed</div>
                <div class="step-description">{{ uploadedFiles.length }} files uploaded and ready for processing</div>
              </div>
            </div>
            <div class="integration-step">
              <div class="step-icon next">
                <i class="pi pi-arrow-right"></i>
              </div>
              <div class="step-content">
                <div class="step-title">Ready to Start Outreach</div>
                <div class="step-description">Access your knowledge base and begin creating personalized campaigns</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Completion Tips -->
      <div class="completion-section">
        <div class="completion-header">
          <i class="pi pi-star mr-2"></i>
          You're Almost Done!
        </div>
        <div class="completion-content">
          <p class="completion-message">Great job completing the onboarding! Here's what you can do next:</p>
          <div class="next-steps">
            <div class="next-step-item">
              <i class="pi pi-book text-primary mr-2"></i>
              <span>Review your knowledge base entries</span>
            </div>
            <div class="next-step-item">
              <i class="pi pi-send text-primary mr-2"></i>
              <span>Create your first outreach campaign</span>
            </div>
            <div class="next-step-item">
              <i class="pi pi-users text-primary mr-2"></i>
              <span>Import or find your target prospects</span>
            </div>
            <div class="next-step-item">
              <i class="pi pi-chart-line text-primary mr-2"></i>
              <span>Track your outreach performance</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </OnboardingWizard>
</template>

<script>
import FileUpload from 'primevue/fileupload'
import OnboardingWizard from '../../components/OnboardingWizard.vue'

export default {
  name: 'OnboardingStep11',
  components: { FileUpload, OnboardingWizard },
  data() {
    return {
      uploadedFiles: []
    }
  },
  computed: {
    savedEntriesCount() {
      // Calculate how many entries will be saved based on onboarding data
      const onboardingData = JSON.parse(localStorage.getItem('outbounder-onboarding') || '{}')
      let count = 0
      
      if (onboardingData.website) count++
      if (onboardingData.description) count++
      if (onboardingData.valueProp) count++
      if (onboardingData.differentiation) count++
      if (onboardingData.regions && onboardingData.regions.length > 0) count++
      if (onboardingData.examples && onboardingData.examples.some(ex => ex.name || ex.reason)) count++
      if (onboardingData.verticals && onboardingData.verticals.some(v => v.name || v.reason)) count++
      if (onboardingData.titles && onboardingData.titles.some(t => t.title || t.reason)) count++
      if (onboardingData.problem) count++
      if (onboardingData.linkedinUrl || onboardingData.sampleMessage) count++
      
      return count
    }
  },
  methods: {
    onUpload(event) {
      const files = (event && event.files) || []
      this.uploadedFiles = files.map(f => ({ name: f.name, size: f.size, type: f.type }))
      
      // Save uploaded files info to onboarding data
      const data = JSON.parse(localStorage.getItem('outbounder-onboarding') || '{}')
      data.uploads = this.uploadedFiles
      localStorage.setItem('outbounder-onboarding', JSON.stringify(data))
      
      this.$toast.add({ severity: 'success', summary: 'Files uploaded successfully', detail: `${files.length} file(s) added`, life: 3000 })
    },
    getFileIcon(type) {
      if (type.includes('pdf')) return 'pi pi-file-pdf text-red-500'
      if (type.includes('word') || type.includes('document')) return 'pi pi-file text-blue-500'
      if (type.includes('presentation') || type.includes('powerpoint')) return 'pi pi-file text-orange-500'
      if (type.includes('text') || type.includes('markdown')) return 'pi pi-file-edit text-green-500'
      return 'pi pi-file text-600'
    },
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    },
    goBack() {
      this.$router.push('/onboarding/10')
    },
    goToStep(step) {
      if (step < 11) {
        this.$router.push(`/onboarding/${step}`)
      }
    },
    skipStep() {
      this.finish()
    },
    saveOnboardingToKnowledge() {
      const onboardingData = JSON.parse(localStorage.getItem('outbounder-onboarding') || '{}')
      const existingKnowledge = JSON.parse(localStorage.getItem('outbounder-knowledge') || '[]')
      const newEntries = []

      // Company Information
      if (onboardingData.website) {
        newEntries.push({
          id: Date.now() + 1,
          title: 'Company Website',
          description: 'Company website from onboarding',
          category: 'companies',
          content: `Company Website: ${onboardingData.website}`,
          tags: ['Company Info', 'Onboarding'],
          lastUpdated: new Date(),
          author: 'Onboarding Wizard'
        })
      }

      // Product Description
      if (onboardingData.description) {
        newEntries.push({
          id: Date.now() + 2,
          title: 'Product Description',
          description: 'Product/service description from onboarding',
          category: 'companies',
          content: onboardingData.description,
          tags: ['Product', 'Description', 'Onboarding'],
          lastUpdated: new Date(),
          author: 'Onboarding Wizard'
        })
      }

      // Value Proposition
      if (onboardingData.valueProp) {
        newEntries.push({
          id: Date.now() + 3,
          title: 'Value Proposition',
          description: 'How we deliver value to customers',
          category: 'sales',
          content: onboardingData.valueProp,
          tags: ['Value Prop', 'Sales', 'Onboarding'],
          lastUpdated: new Date(),
          author: 'Onboarding Wizard'
        })
      }

      // Competitive Differentiation
      if (onboardingData.differentiation) {
        newEntries.push({
          id: Date.now() + 4,
          title: 'Competitive Differentiation',
          description: 'What makes us different from competitors',
          category: 'market',
          content: onboardingData.differentiation,
          tags: ['Competition', 'Differentiation', 'Onboarding'],
          lastUpdated: new Date(),
          author: 'Onboarding Wizard'
        })
      }

      // Geographic Markets
      if (onboardingData.regions && onboardingData.regions.length > 0) {
        const regionContent = `Target Regions: ${onboardingData.regions.join(', ')}${onboardingData.regionsOther ? `\nOther Regions: ${onboardingData.regionsOther}` : ''}`
        newEntries.push({
          id: Date.now() + 5,
          title: 'Target Geographic Markets',
          description: 'Geographic markets we sell into',
          category: 'market',
          content: regionContent,
          tags: ['Geography', 'Markets', 'Onboarding'],
          lastUpdated: new Date(),
          author: 'Onboarding Wizard'
        })
      }

      // Customer Examples
      if (onboardingData.examples && onboardingData.examples.length > 0) {
        const validExamples = onboardingData.examples.filter(ex => ex.name || ex.reason)
        if (validExamples.length > 0) {
          const exampleContent = validExamples.map((ex, i) => 
            `Example ${i + 1}:\nCompany: ${ex.name || 'Not specified'}\nWebsite: ${ex.website || 'Not specified'}\nWhy they're ideal: ${ex.reason || 'Not specified'}`
          ).join('\n\n')
          
          newEntries.push({
            id: Date.now() + 6,
            title: 'Ideal Customer Examples',
            description: 'Examples of best-fit customers',
            category: 'people',
            content: exampleContent,
            tags: ['Customers', 'Examples', 'Onboarding'],
            lastUpdated: new Date(),
            author: 'Onboarding Wizard'
          })
        }
      }

      // Target Verticals
      if (onboardingData.verticals && onboardingData.verticals.length > 0) {
        const validVerticals = onboardingData.verticals.filter(v => v.name || v.reason)
        if (validVerticals.length > 0) {
          const verticalContent = validVerticals.map((v, i) => 
            `Vertical ${i + 1}:\nName: ${v.name || 'Not specified'}\nWhy they need our product/service: ${v.reason || 'Not specified'}`
          ).join('\n\n')
          
          newEntries.push({
            id: Date.now() + 7,
            title: 'Target Verticals',
            description: 'Industries and verticals we target',
            category: 'market',
            content: verticalContent,
            tags: ['Verticals', 'Industries', 'Onboarding'],
            lastUpdated: new Date(),
            author: 'Onboarding Wizard'
          })
        }
      }

      // Target Job Titles
      if (onboardingData.titles && onboardingData.titles.length > 0) {
        const validTitles = onboardingData.titles.filter(t => t.title || t.reason)
        if (validTitles.length > 0) {
          const titleContent = validTitles.map((t, i) => 
            `Title ${i + 1}:\nJob Title: ${t.title || 'Not specified'}\nReason for targeting: ${t.reason || 'Not specified'}`
          ).join('\n\n')
          
          newEntries.push({
            id: Date.now() + 8,
            title: 'Target Job Titles',
            description: 'Job titles and roles we target',
            category: 'people',
            content: titleContent,
            tags: ['Job Titles', 'Targeting', 'Onboarding'],
            lastUpdated: new Date(),
            author: 'Onboarding Wizard'
          })
        }
      }

      // Problem Statement
      if (onboardingData.problem) {
        newEntries.push({
          id: Date.now() + 9,
          title: 'Customer Problem Statement',
          description: 'Problems we solve for customers',
          category: 'sales',
          content: onboardingData.problem,
          tags: ['Problems', 'Customer Pain', 'Onboarding'],
          lastUpdated: new Date(),
          author: 'Onboarding Wizard'
        })
      }

      // Customer Example & Outreach
      if (onboardingData.linkedinUrl || onboardingData.sampleMessage) {
        const outreachContent = `LinkedIn URL: ${onboardingData.linkedinUrl || 'Not provided'}\n\nSample Message:\n${onboardingData.sampleMessage || 'Not provided'}`
        newEntries.push({
          id: Date.now() + 10,
          title: 'Customer Outreach Example',
          description: 'Sample customer and outreach message',
          category: 'templates',
          content: outreachContent,
          tags: ['Outreach', 'LinkedIn', 'Templates', 'Onboarding'],
          lastUpdated: new Date(),
          author: 'Onboarding Wizard'
        })
      }

      // Save to knowledge base
      const updatedKnowledge = [...existingKnowledge, ...newEntries]
      localStorage.setItem('outbounder-knowledge', JSON.stringify(updatedKnowledge))

      return newEntries.length
    },
    finish() {
      const savedCount = this.saveOnboardingToKnowledge()
      localStorage.setItem('outbounder-onboarding-status', JSON.stringify({ completed: true, at: Date.now() }))
      
      if (savedCount > 0) {
        this.$toast.add({ 
          severity: 'success', 
          summary: 'Onboarding Complete!', 
          detail: `${savedCount} knowledge entries saved to your Knowledge base`,
          life: 4000 
        })
      }
      
      setTimeout(() => {
        this.$router.replace('/')
      }, 1000)
    },
    skip() {
      const savedCount = this.saveOnboardingToKnowledge()
      localStorage.setItem('outbounder-onboarding-status', JSON.stringify({ completed: true, skipped: true, at: Date.now() }))
      
      if (savedCount > 0) {
        this.$toast.add({ 
          severity: 'info', 
          summary: 'Onboarding Skipped', 
          detail: `${savedCount} knowledge entries saved to your Knowledge base`,
          life: 4000 
        })
      }
      
      setTimeout(() => {
        this.$router.replace('/')
      }, 1000)
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

.upload-types {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.type-item {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
}

.upload-section {
  background: var(--surface-card);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid var(--surface-200);
}

.field-label {
  display: block;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
}

:deep(.custom-file-upload) {
  border-radius: 12px;
  border: 2px dashed var(--surface-300);
  background: var(--surface-50);
  transition: all 0.3s ease;
}

:deep(.custom-file-upload:hover) {
  border-color: var(--primary-300);
  background: var(--primary-50);
}

:deep(.p-fileupload-content) {
  padding: 2rem;
  text-align: center;
}

.upload-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1rem;
}

.upload-text {
  text-align: center;
}

.supported-formats {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.format-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background: var(--surface-100);
  color: var(--text-color-secondary);
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid var(--surface-200);
}

.uploaded-files-section {
  background: var(--surface-50);
  border: 1px solid var(--surface-200);
  border-radius: 12px;
  overflow: hidden;
  animation: fadeIn 0.3s ease;
}

.uploaded-header {
  background: var(--surface-100);
  padding: 0.75rem 1rem;
  font-weight: 600;
  color: var(--text-color-secondary);
  font-size: 0.875rem;
  border-bottom: 1px solid var(--surface-200);
}

.uploaded-list {
  padding: 1rem;
}

.uploaded-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: white;
  border-radius: 8px;
  border: 1px solid var(--surface-200);
  margin-bottom: 0.5rem;
}

.uploaded-item:last-child {
  margin-bottom: 0;
}

.file-icon {
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--surface-100);
  border-radius: 8px;
}

.file-info {
  flex: 1;
}

.file-name {
  font-weight: 600;
  color: var(--text-color);
  font-size: 0.9rem;
}

.file-size {
  color: var(--text-color-secondary);
  font-size: 0.8rem;
}

.file-status {
  font-size: 1.2rem;
}

.integration-preview {
  background: var(--surface-50);
  border: 1px solid var(--surface-200);
  border-radius: 12px;
  overflow: hidden;
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

.integration-steps {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.integration-step {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.step-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 600;
  flex-shrink: 0;
  margin-top: 0.25rem;
}

.step-icon.completed {
  background: var(--green-500);
  color: white;
}

.step-icon.pending {
  background: var(--orange-100);
  color: var(--orange-600);
}

.step-icon.next {
  background: var(--primary-100);
  color: var(--primary-600);
}

.step-content {
  flex: 1;
}

.step-title {
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 0.25rem;
}

.step-description {
  color: var(--text-color-secondary);
  font-size: 0.875rem;
  line-height: 1.4;
}

.completion-section {
  background: linear-gradient(135deg, var(--green-50), var(--emerald-50));
  border: 1px solid var(--green-200);
  border-radius: 12px;
  overflow: hidden;
}

.completion-header {
  padding: 0.75rem 1rem;
  font-weight: 600;
  color: var(--green-700);
  font-size: 0.875rem;
  border-bottom: 1px solid var(--green-200);
  background: rgba(255, 255, 255, 0.5);
}

.completion-content {
  padding: 1.5rem;
}

.completion-message {
  margin: 0 0 1rem 0;
  color: var(--green-900);
  line-height: 1.5;
}

.next-steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
}

.next-step-item {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  color: var(--text-color);
  padding: 0.5rem;
  background: white;
  border-radius: 8px;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.text-red-500 { color: var(--red-500); }
.text-blue-500 { color: var(--blue-500); }
.text-green-500 { color: var(--green-500); }
.text-orange-500 { color: var(--orange-500); }
.text-purple-500 { color: var(--purple-500); }
.text-600 { color: var(--text-color-secondary); }

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
  
  .upload-section {
    background: var(--surface-800);
    border-color: var(--surface-700);
  }
  
  :deep(.custom-file-upload) {
    border-color: var(--surface-600);
    background: var(--surface-700);
  }
  
  :deep(.custom-file-upload:hover) {
    border-color: var(--primary-400);
    background: rgba(var(--primary-color-rgb), 0.1);
  }
  
  .format-badge {
    background: var(--surface-700);
    border-color: var(--surface-600);
  }
  
  .uploaded-files-section {
    background: var(--surface-800);
    border-color: var(--surface-700);
  }
  
  .uploaded-header {
    background: var(--surface-700);
    border-color: var(--surface-600);
  }
  
  .uploaded-item {
    background: var(--surface-card);
    border-color: var(--surface-600);
  }
  
  .file-icon {
    background: var(--surface-700);
  }
  
  .integration-preview {
    background: var(--surface-800);
    border-color: var(--surface-700);
  }
  
  .preview-header {
    background: var(--surface-700);
    border-color: var(--surface-600);
  }
  
  .completion-section {
    background: linear-gradient(135deg, rgba(34, 197, 94, 0.05), rgba(5, 150, 105, 0.05));
    border-color: var(--surface-600);
  }
  
  .completion-header {
    background: rgba(0, 0, 0, 0.2);
    color: var(--green-400);
    border-color: var(--surface-600);
  }
  
  .completion-message {
    color: var(--text-color);
  }
  
  .next-step-item {
    background: var(--surface-card);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .upload-types {
    gap: 0.5rem;
  }
  
  .supported-formats {
    gap: 0.25rem;
  }
  
  .next-steps {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .integration-step {
    gap: 0.75rem;
  }
  
  .uploaded-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .file-icon {
    align-self: center;
  }
}</style>


