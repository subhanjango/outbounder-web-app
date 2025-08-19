<template>
  <div class="knowledge-page">
    <!-- Knowledge Drive Section -->
    <div class="card mb-3">
      <div class="p-3">
        <div class="flex align-items-center justify-content-between">
          <h3 class="font-medium mb-0">Knowledge Drive</h3>
          <div class="flex gap-2">
            <Button 
              label="Upload" 
              icon="pi pi-upload" 
              size="small"
              @click="showUploadDialog = true"
            />
            <Button 
              :label="showDrive ? 'Hide' : 'Show'" 
              :icon="showDrive ? 'pi pi-eye-slash' : 'pi pi-eye'" 
              outlined
              size="small"
              @click="showDrive = !showDrive"
            />
          </div>
        </div>
        
        <div v-if="showDrive" class="mt-3 pt-3 border-top-1 surface-border">
          <div v-if="knowledgeDocuments.length === 0" class="text-center py-4">
            <i class="pi pi-folder-open text-3xl text-color-secondary mb-2"></i>
            <p class="text-color-secondary text-sm">No documents yet</p>
          </div>
          
          <div v-else class="grid gap-2">
            <div 
              v-for="doc in knowledgeDocuments" 
              :key="doc.id"
              class="col-12"
            >
              <div class="flex align-items-center justify-content-between p-2 border-1 surface-border border-round hover:bg-gray-50">
                <div class="flex align-items-center gap-2">
                  <i :class="getFileIcon(doc.type)" class="text-primary"></i>
                  <div>
                    <p class="font-medium text-sm mb-0">{{ doc.name }}</p>
                    <p class="text-xs text-color-secondary">{{ formatFileSize(doc.size) }}</p>
                  </div>
                </div>
                <div class="flex gap-1">
                  <Button 
                    icon="pi pi-download" 
                    text 
                    size="small"
                    @click="downloadDocument(doc)"
                  />
                  <Button 
                    icon="pi pi-trash" 
                    text 
                    size="small"
                    severity="danger"
                    @click="deleteDocument(doc.id)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Knowledge Sections -->
    <div class="flex flex-column gap-3">
      <!-- Company Overview -->
      <div class="card p-0 overflow-hidden">
        <div 
          class="p-3 cursor-pointer hover:bg-gray-50 transition-colors"
          @click="toggleSection('companyOverview')"
        >
          <div class="flex align-items-center justify-content-between">
            <div class="flex align-items-center gap-2">
              <i class="pi pi-building text-lg"></i>
              <div>
                <h3 class="font-semibold mb-0">1. Company Overview</h3>
                <p class="text-xs text-color-secondary mb-0">Core information about your company</p>
              </div>
            </div>
            <div class="flex align-items-center gap-2">
              <Button icon="pi pi-pencil" text rounded size="small" @click.stop="editSection('companyOverview')" />
              <i :class="['pi', expandedSections.companyOverview ? 'pi-chevron-up' : 'pi-chevron-down']" class="text-color-secondary"></i>
            </div>
          </div>
        </div>
        <div v-if="expandedSections.companyOverview" class="p-3 pt-0 border-top-1 surface-border">
          <div class="p-2 bg-gray-50 border-round">
            <div v-if="knowledgeBase.companyOverview" class="whitespace-pre-wrap text-sm">{{ knowledgeBase.companyOverview }}</div>
            <div v-else class="text-color-secondary italic text-sm">Click edit to add your company overview...</div>
          </div>
        </div>
      </div>

      <!-- Value Proposition -->
      <div class="card p-0 overflow-hidden">
        <div 
          class="p-3 cursor-pointer hover:bg-gray-50 transition-colors"
          @click="toggleSection('valueProposition')"
        >
          <div class="flex align-items-center justify-content-between">
            <div class="flex align-items-center gap-2">
              <i class="pi pi-star text-lg"></i>
              <div>
                <h3 class="font-semibold mb-0">2. Value Proposition</h3>
                <p class="text-xs text-color-secondary mb-0">Your unique value and benefits</p>
              </div>
            </div>
            <div class="flex align-items-center gap-2">
              <Button icon="pi pi-pencil" text rounded size="small" @click.stop="editSection('valueProposition')" />
              <i :class="['pi', expandedSections.valueProposition ? 'pi-chevron-up' : 'pi-chevron-down']" class="text-color-secondary"></i>
            </div>
          </div>
        </div>
        <div v-if="expandedSections.valueProposition" class="p-3 pt-0 border-top-1 surface-border">
          <div class="p-2 bg-gray-50 border-round">
            <div v-if="knowledgeBase.valueProposition" class="whitespace-pre-wrap text-sm">{{ knowledgeBase.valueProposition }}</div>
            <div v-else class="text-color-secondary italic text-sm">Click edit to add your value proposition...</div>
          </div>
        </div>
      </div>

      <!-- Ideal Customer Profile -->
      <div class="card p-0 overflow-hidden">
        <div 
          class="p-3 cursor-pointer hover:bg-gray-50 transition-colors"
          @click="toggleSection('idealCustomerProfile')"
        >
          <div class="flex align-items-center justify-content-between">
            <div class="flex align-items-center gap-2">
              <i class="pi pi-users text-lg"></i>
              <div>
                <h3 class="font-semibold mb-0">3. Ideal Customer Profile</h3>
                <p class="text-xs text-color-secondary mb-0">Target customer characteristics</p>
              </div>
            </div>
            <div class="flex align-items-center gap-2">
              <Button icon="pi pi-pencil" text rounded size="small" @click.stop="editSection('idealCustomerProfile')" />
              <i :class="['pi', expandedSections.idealCustomerProfile ? 'pi-chevron-up' : 'pi-chevron-down']" class="text-color-secondary"></i>
            </div>
          </div>
        </div>
        <div v-if="expandedSections.idealCustomerProfile" class="p-3 pt-0 border-top-1 surface-border">
          <div class="p-2 bg-gray-50 border-round">
            <div v-if="knowledgeBase.idealCustomerProfile" class="whitespace-pre-wrap text-sm">{{ knowledgeBase.idealCustomerProfile }}</div>
            <div v-else class="text-color-secondary italic text-sm">Click edit to add your ideal customer profile...</div>
          </div>
        </div>
      </div>

      <!-- Sample Outreach -->
      <div class="card p-0 overflow-hidden">
        <div 
          class="p-3 cursor-pointer hover:bg-gray-50 transition-colors"
          @click="toggleSection('sampleOutreach')"
        >
          <div class="flex align-items-center justify-content-between">
            <div class="flex align-items-center gap-2">
              <i class="pi pi-send text-lg"></i>
              <div>
                <h3 class="font-semibold mb-0">4. Sample Outreach</h3>
                <p class="text-xs text-color-secondary mb-0">Templates and messaging examples</p>
              </div>
            </div>
            <div class="flex align-items-center gap-2">
              <Button icon="pi pi-pencil" text rounded size="small" @click.stop="editSection('sampleOutreach')" />
              <i :class="['pi', expandedSections.sampleOutreach ? 'pi-chevron-up' : 'pi-chevron-down']" class="text-color-secondary"></i>
            </div>
          </div>
        </div>
        <div v-if="expandedSections.sampleOutreach" class="p-3 pt-0 border-top-1 surface-border">
          <div class="p-2 bg-gray-50 border-round">
            <div v-if="knowledgeBase.sampleOutreach" class="whitespace-pre-wrap text-sm">{{ knowledgeBase.sampleOutreach }}</div>
            <div v-else class="text-color-secondary italic text-sm">Click edit to add your sample outreach templates...</div>
          </div>
        </div>
      </div>

      <!-- Social Proof -->
      <div class="card p-0 overflow-hidden">
        <div 
          class="p-3 cursor-pointer hover:bg-gray-50 transition-colors"
          @click="toggleSection('socialProof')"
        >
          <div class="flex align-items-center justify-content-between">
            <div class="flex align-items-center gap-2">
              <i class="pi pi-verified text-lg"></i>
              <div>
                <h3 class="font-semibold mb-0">5. Social Proof</h3>
                <p class="text-xs text-color-secondary mb-0">Testimonials, case studies, and credibility</p>
              </div>
            </div>
            <div class="flex align-items-center gap-2">
              <Button icon="pi pi-pencil" text rounded size="small" @click.stop="editSection('socialProof')" />
              <i :class="['pi', expandedSections.socialProof ? 'pi-chevron-up' : 'pi-chevron-down']" class="text-color-secondary"></i>
            </div>
          </div>
        </div>
        <div v-if="expandedSections.socialProof" class="p-3 pt-0 border-top-1 surface-border">
          <div class="p-2 bg-gray-50 border-round">
            <div v-if="knowledgeBase.socialProof" class="whitespace-pre-wrap text-sm">{{ knowledgeBase.socialProof }}</div>
            <div v-else class="text-color-secondary italic text-sm">Click edit to add your social proof...</div>
          </div>
        </div>
      </div>

      <!-- Industries -->
      <div class="card p-0 overflow-hidden">
        <div 
          class="p-3 cursor-pointer hover:bg-gray-50 transition-colors"
          @click="toggleSection('industries')"
        >
          <div class="flex align-items-center justify-content-between">
            <div class="flex align-items-center gap-2">
              <i class="pi pi-chart-bar text-lg"></i>
              <div>
                <h3 class="font-semibold mb-0">6. Industries</h3>
                <p class="text-xs text-color-secondary mb-0">Industry-specific knowledge and insights</p>
              </div>
            </div>
            <div class="flex align-items-center gap-2">
              <Button icon="pi pi-pencil" text rounded size="small" @click.stop="editSection('industries')" />
              <i :class="['pi', expandedSections.industries ? 'pi-chevron-up' : 'pi-chevron-down']" class="text-color-secondary"></i>
            </div>
          </div>
        </div>
        <div v-if="expandedSections.industries" class="p-3 pt-0 border-top-1 surface-border">
          <div class="p-2 bg-gray-50 border-round">
            <div v-if="knowledgeBase.industries" class="whitespace-pre-wrap text-sm">{{ knowledgeBase.industries }}</div>
            <div v-else class="text-color-secondary italic text-sm">Click edit to add your industry insights...</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Upload Dialog -->
    <Dialog v-model:visible="showUploadDialog" header="Upload Knowledge Documents" :style="{width: '600px'}" modal>
      <div class="flex flex-column gap-4">
        <div class="field">
          <label class="block font-medium mb-2">Select Files</label>
          <FileUpload 
            ref="fileUpload"
            mode="advanced" 
            :multiple="true"
            accept=".pdf,.doc,.docx,.txt,.md,.csv,.xlsx,.pptx"
            :maxFileSize="10000000"
            @select="onFilesSelect"
            @remove="onFileRemove"
            :auto="false"
            chooseLabel="Choose Files"
            uploadLabel="Upload"
            cancelLabel="Clear"
          >
            <template #empty>
              <div class="flex align-items-center justify-content-center flex-column">
                <i class="pi pi-cloud-upload border-2 border-circle p-5 text-6xl text-color-secondary border-color-secondary"></i>
                <p class="mt-4 mb-0">Drag and drop files here or click to browse.</p>
                <p class="text-sm text-color-secondary mt-1">Supported formats: PDF, Word, Text, Markdown, CSV, Excel, PowerPoint</p>
              </div>
            </template>
          </FileUpload>
        </div>
        
        <div v-if="selectedFiles.length > 0" class="field">
          <label class="block font-medium mb-2">Selected Files ({{ selectedFiles.length }})</label>
          <div class="flex flex-column gap-2 max-h-20rem overflow-y-auto">
            <div 
              v-for="(file, index) in selectedFiles" 
              :key="index"
              class="flex align-items-center justify-content-between p-2 border-1 surface-border border-round"
            >
              <div class="flex align-items-center gap-2">
                <i :class="getFileIcon(file.type)" class="text-primary"></i>
                <span class="font-medium">{{ file.name }}</span>
                <span class="text-sm text-color-secondary">({{ formatFileSize(file.size) }})</span>
              </div>
              <Button 
                icon="pi pi-times" 
                text 
                rounded 
                size="small"
                @click="removeFile(index)"
              />
            </div>
          </div>
        </div>
      </div>
      
      <template #footer>
        <Button label="Cancel" text @click="cancelUpload" />
        <Button 
          label="Upload Files" 
          :disabled="selectedFiles.length === 0"
          @click="uploadFiles" 
        />
      </template>
    </Dialog>

    <!-- Edit Dialog -->
    <Dialog v-model:visible="showEditDialog" :header="editDialogTitle" :style="{width: '800px'}" modal>
      <div class="flex flex-column gap-3">
        <div class="field">
          <label :for="currentSection" class="block font-medium mb-2">Content</label>
          <Textarea 
            :id="currentSection"
            v-model="editContent" 
            rows="12" 
            class="w-full" 
            placeholder="Enter your content here..."
          />
        </div>
      </div>
      
      <template #footer>
        <Button label="Cancel" text @click="cancelEdit" />
        <Button label="Save" @click="saveSection" />
      </template>
    </Dialog>
  </div>
</template>

<script>
export default {
  name: 'Knowledge',
  data() {
    return {
      showEditDialog: false,
      showUploadDialog: false,
      showDrive: false,
      currentSection: null,
      editContent: '',
      selectedFiles: [],
      knowledgeDocuments: [],
      expandedSections: {
        companyOverview: false,
        valueProposition: false,
        idealCustomerProfile: false,
        sampleOutreach: false,
        socialProof: false,
        industries: false
      },
      knowledgeBase: {
        companyOverview: '',
        valueProposition: '',
        idealCustomerProfile: '',
        sampleOutreach: '',
        socialProof: '',
        industries: ''
      },
      sectionTitles: {
        companyOverview: 'Company Overview',
        valueProposition: 'Value Proposition',
        idealCustomerProfile: 'Ideal Customer Profile',
        sampleOutreach: 'Sample Outreach',
        socialProof: 'Social Proof',
        industries: 'Industries'
      }
    }
  },
  computed: {
    editDialogTitle() {
      return `Edit ${this.sectionTitles[this.currentSection] || 'Section'}`
    }
  },
  mounted() {
    this.loadKnowledgeBase()
    this.loadKnowledgeDocuments()
  },
  methods: {
    toggleSection(section) {
      this.expandedSections[section] = !this.expandedSections[section]
    },
    editSection(section) {
      this.currentSection = section
      this.editContent = this.knowledgeBase[section] || ''
      this.showEditDialog = true
    },
    saveSection() {
      if (this.currentSection) {
        this.knowledgeBase[this.currentSection] = this.editContent
        this.saveKnowledgeBase()
        this.showEditDialog = false
        this.currentSection = null
        this.editContent = ''
      }
    },
    cancelEdit() {
      this.showEditDialog = false
      this.currentSection = null
      this.editContent = ''
    },
    loadKnowledgeBase() {
      // Load from localStorage if available
      const saved = localStorage.getItem('outbounder-knowledge-base')
      if (saved) {
        try {
          this.knowledgeBase = { ...this.knowledgeBase, ...JSON.parse(saved) }
        } catch (e) {
          console.error('Error loading knowledge base:', e)
        }
      }
    },
    saveKnowledgeBase() {
      // Save to localStorage
      localStorage.setItem('outbounder-knowledge-base', JSON.stringify(this.knowledgeBase))
    },
    
    // File Upload Methods
    onFilesSelect(event) {
      this.selectedFiles = [...event.files]
    },
    onFileRemove(event) {
      this.selectedFiles = this.selectedFiles.filter(file => file !== event.file)
    },
    removeFile(index) {
      this.selectedFiles.splice(index, 1)
    },
    cancelUpload() {
      this.showUploadDialog = false
      this.selectedFiles = []
      if (this.$refs.fileUpload) {
        this.$refs.fileUpload.clear()
      }
    },
    uploadFiles() {
      if (this.selectedFiles.length === 0) return
      
      // Simulate file upload - in real app, this would upload to server
      this.selectedFiles.forEach(file => {
        const document = {
          id: Date.now() + Math.random(),
          name: file.name,
          type: file.type,
          size: file.size,
          uploadDate: new Date(),
          preview: this.generatePreview(file),
          file: file // Store file for download
        }
        this.knowledgeDocuments.push(document)
      })
      
      this.saveKnowledgeDocuments()
      this.cancelUpload()
      this.showDrive = true // Show drive after upload
      
      // Show success message (would need toast service)
      console.log(`${this.selectedFiles.length} file(s) uploaded successfully`)
    },
    
    // Document Management Methods
    deleteDocument(id) {
      this.knowledgeDocuments = this.knowledgeDocuments.filter(doc => doc.id !== id)
      this.saveKnowledgeDocuments()
      console.log('Document removed from knowledge base')
    },
    downloadDocument(doc) {
      if (doc.file) {
        const url = URL.createObjectURL(doc.file)
        const a = document.createElement('a')
        a.href = url
        a.download = doc.name
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }
    },
    
    // Storage Methods
    loadKnowledgeDocuments() {
      const saved = localStorage.getItem('outbounder-knowledge-documents')
      if (saved) {
        try {
          this.knowledgeDocuments = JSON.parse(saved)
        } catch (e) {
          console.error('Error loading knowledge documents:', e)
        }
      }
    },
    saveKnowledgeDocuments() {
      // Don't save the actual file objects, just metadata
      const documentsToSave = this.knowledgeDocuments.map(doc => ({
        ...doc,
        file: null // Remove file object for storage
      }))
      localStorage.setItem('outbounder-knowledge-documents', JSON.stringify(documentsToSave))
    },
    
    // Utility Methods
    getFileIcon(type) {
      if (type.includes('pdf')) return 'pi pi-file-pdf'
      if (type.includes('word') || type.includes('document')) return 'pi pi-file-word'
      if (type.includes('excel') || type.includes('spreadsheet')) return 'pi pi-file-excel'
      if (type.includes('powerpoint') || type.includes('presentation')) return 'pi pi-file'
      if (type.includes('text') || type.includes('plain')) return 'pi pi-file-edit'
      if (type.includes('csv')) return 'pi pi-table'
      return 'pi pi-file'
    },
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString()
    },
    generatePreview(file) {
      // For now, just return a generic preview
      // In a real app, you might extract text content
      return `${file.name} - ${this.formatFileSize(file.size)} uploaded`
    }
  }
}
</script>
