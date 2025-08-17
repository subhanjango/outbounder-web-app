<template>
  <AppLayout>
    <div class="knowledge-page">
      <div class="page-header">
        <div class="header-left">
          <h1>Knowledge Base</h1>
          <p>Upload and manage your account intelligence and insights</p>
        </div>
        <div class="header-actions">
          <Button 
            @click="showUploadDialog = true"
            label="Upload Documents" 
            icon="pi pi-upload"
            class="p-button-primary"
          />
          <Button 
            @click="createKnowledgeEntry"
            label="Create Entry" 
            icon="pi pi-plus"
            class="p-button-outlined"
          />
        </div>
      </div>
      
      <div class="knowledge-stats">
        <div class="stats-grid">
          <Card class="stat-card">
            <template #content>
              <div class="stat-content">
                <div class="stat-icon documents">
                  <i class="pi pi-file"></i>
                </div>
                <div class="stat-details">
                  <h3>{{ stats.totalDocuments }}</h3>
                  <p>Total Documents</p>
                </div>
              </div>
            </template>
          </Card>
          
          <Card class="stat-card">
            <template #content>
              <div class="stat-content">
                <div class="stat-icon accounts">
                  <i class="pi pi-building"></i>
                </div>
                <div class="stat-details">
                  <h3>{{ stats.accountProfiles }}</h3>
                  <p>Account Profiles</p>
                </div>
              </div>
            </template>
          </Card>
          
          <Card class="stat-card">
            <template #content>
              <div class="stat-content">
                <div class="stat-icon insights">
                  <i class="pi pi-lightbulb"></i>
                </div>
                <div class="stat-details">
                  <h3>{{ stats.insights }}</h3>
                  <p>Generated Insights</p>
                </div>
              </div>
            </template>
          </Card>
          
          <Card class="stat-card">
            <template #content>
              <div class="stat-content">
                <div class="stat-icon storage">
                  <i class="pi pi-database"></i>
                </div>
                <div class="stat-details">
                  <h3>{{ stats.storageUsed }}</h3>
                  <p>Storage Used</p>
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>
      
      <div class="knowledge-content">
        <div class="content-filters">
          <Card>
            <template #content>
              <div class="filter-section">
                <IconField iconPosition="left">
                  <InputIcon class="pi pi-search" />
                  <InputText 
                    v-model="searchQuery"
                    placeholder="Search knowledge base..."
                    class="search-input"
                  />
                </IconField>
                
                <div class="filter-options">
                  <Dropdown 
                    v-model="selectedType" 
                    :options="typeOptions" 
                    placeholder="Document Type"
                    class="filter-dropdown"
                  />
                  <Dropdown 
                    v-model="selectedAccount" 
                    :options="accountOptions" 
                    placeholder="Related Account"
                    class="filter-dropdown"
                  />
                  <Calendar 
                    v-model="dateRange"
                    selectionMode="range"
                    placeholder="Date Range"
                    class="filter-dropdown"
                  />
                </div>
              </div>
            </template>
          </Card>
        </div>
        
        <div class="knowledge-grid">
          <Card v-for="item in filteredKnowledgeItems" :key="item.id" class="knowledge-card">
            <template #content>
              <div class="knowledge-item">
                <div class="item-header">
                  <div class="item-info">
                    <div class="item-icon">
                      <i :class="getTypeIcon(item.type)"></i>
                    </div>
                    <div class="item-details">
                      <h4>{{ item.title }}</h4>
                      <small>{{ item.type }} • {{ formatDate(item.createdAt) }}</small>
                    </div>
                  </div>
                  <div class="item-actions">
                    <Button 
                      @click="viewItem(item)"
                      icon="pi pi-eye" 
                      class="p-button-rounded p-button-text"
                      v-tooltip="'View'"
                    />
                    <Button 
                      @click="editItem(item)"
                      icon="pi pi-pencil" 
                      class="p-button-rounded p-button-text"
                      v-tooltip="'Edit'"
                    />
                    <Button 
                      @click="deleteItem(item)"
                      icon="pi pi-trash" 
                      class="p-button-rounded p-button-text"
                      severity="danger"
                      v-tooltip="'Delete'"
                    />
                  </div>
                </div>
                
                <div class="item-content">
                  <p>{{ item.summary }}</p>
                </div>
                
                <div class="item-tags">
                  <Tag v-for="tag in item.tags" :key="tag" :value="tag" class="knowledge-tag" />
                </div>
                
                <div v-if="item.relatedAccount" class="item-account">
                  <small>Related to: <strong>{{ item.relatedAccount }}</strong></small>
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>
      
      <Dialog 
        v-model:visible="showUploadDialog" 
        modal 
        header="Upload Documents"
        :style="{ width: '600px' }"
      >
        <div class="upload-dialog">
          <div class="upload-section">
            <FileUpload 
              name="documents"
              :multiple="true"
              accept=".pdf,.doc,.docx,.txt,.md"
              :maxFileSize="10000000"
              @select="onFilesSelect"
              @upload="onUpload"
              @error="onUploadError"
              :auto="false"
              chooseLabel="Choose Files"
              uploadLabel="Upload"
              cancelLabel="Cancel"
              class="knowledge-uploader"
            >
              <template #header="{ chooseCallback, uploadCallback, clearCallback, files }">
                <div class="upload-header">
                  <Button @click="chooseCallback()" icon="pi pi-plus" label="Add Files" />
                  <Button 
                    @click="uploadCallback()" 
                    icon="pi pi-upload" 
                    label="Upload All"
                    :disabled="!files || files.length === 0"
                    class="p-button-success"
                  />
                  <Button 
                    @click="clearCallback()" 
                    icon="pi pi-times" 
                    label="Clear"
                    :disabled="!files || files.length === 0"
                    class="p-button-outlined"
                  />
                </div>
              </template>
              
              <template #content="{ files, uploadedFiles, removeUploadedFileCallback, removeFileCallback }">
                <div class="upload-content">
                  <div v-if="files.length > 0">
                    <h5>Pending Files</h5>
                    <div v-for="(file, index) in files" :key="file.name + file.type + file.size" class="file-item">
                      <div class="file-info">
                        <i class="pi pi-file file-icon"></i>
                        <div class="file-details">
                          <span class="file-name">{{ file.name }}</span>
                          <small class="file-size">{{ formatFileSize(file.size) }}</small>
                        </div>
                      </div>
                      <Button 
                        @click="removeFileCallback(index)"
                        icon="pi pi-times" 
                        class="p-button-rounded p-button-text p-button-danger"
                      />
                    </div>
                  </div>
                  
                  <div v-if="uploadedFiles.length > 0">
                    <h5>Uploaded Files</h5>
                    <div v-for="(file, index) in uploadedFiles" :key="file.name + file.type + file.size" class="file-item uploaded">
                      <div class="file-info">
                        <i class="pi pi-check-circle file-icon success"></i>
                        <div class="file-details">
                          <span class="file-name">{{ file.name }}</span>
                          <small class="file-size">{{ formatFileSize(file.size) }}</small>
                        </div>
                      </div>
                      <Button 
                        @click="removeUploadedFileCallback(index)"
                        icon="pi pi-times" 
                        class="p-button-rounded p-button-text"
                      />
                    </div>
                  </div>
                </div>
              </template>
            </FileUpload>
          </div>
          
          <div class="upload-options">
            <h4>Upload Options</h4>
            <div class="option-field">
              <label for="documentType">Document Type</label>
              <Dropdown 
                id="documentType"
                v-model="uploadType" 
                :options="typeOptions.slice(1)"
                optionLabel="label"
                optionValue="value"
                placeholder="Select type"
              />
            </div>
            
            <div class="option-field">
              <label for="relatedAccount">Related Account (Optional)</label>
              <Dropdown 
                id="relatedAccount"
                v-model="uploadAccount" 
                :options="accountOptions.slice(1)"
                optionLabel="label"
                optionValue="value"
                placeholder="Select account"
              />
            </div>
            
            <div class="option-field">
              <label for="tags">Tags (Optional)</label>
              <InputText 
                id="tags"
                v-model="uploadTags"
                placeholder="Enter tags separated by commas"
              />
            </div>
          </div>
        </div>
        
        <template #footer>
          <Button 
            @click="showUploadDialog = false"
            label="Close" 
            class="p-button-text"
          />
        </template>
      </Dialog>
      
      <Dialog 
        v-model:visible="showViewDialog" 
        modal 
        :header="selectedItem?.title"
        :style="{ width: '800px' }"
        maximizable
      >
        <div v-if="selectedItem" class="view-dialog">
          <div class="item-meta">
            <div class="meta-row">
              <span class="meta-label">Type:</span>
              <Tag :value="selectedItem.type" />
            </div>
            <div class="meta-row">
              <span class="meta-label">Created:</span>
              <span>{{ formatDate(selectedItem.createdAt) }}</span>
            </div>
            <div v-if="selectedItem.relatedAccount" class="meta-row">
              <span class="meta-label">Related Account:</span>
              <span>{{ selectedItem.relatedAccount }}</span>
            </div>
            <div v-if="selectedItem.tags.length" class="meta-row">
              <span class="meta-label">Tags:</span>
              <div class="tag-list">
                <Tag v-for="tag in selectedItem.tags" :key="tag" :value="tag" />
              </div>
            </div>
          </div>
          
          <div class="item-full-content">
            <h4>Content</h4>
            <div class="content-text">
              {{ selectedItem.content || selectedItem.summary }}
            </div>
          </div>
          
          <div v-if="selectedItem.insights" class="item-insights">
            <h4>AI Generated Insights</h4>
            <div class="insights-list">
              <div v-for="insight in selectedItem.insights" :key="insight.id" class="insight-item">
                <h5>{{ insight.title }}</h5>
                <p>{{ insight.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
    
    <Toast />
  </AppLayout>
</template>

<script>
import AppLayout from '../components/AppLayout.vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import Dropdown from 'primevue/dropdown'
import Calendar from 'primevue/calendar'
import Tag from 'primevue/tag'
import Dialog from 'primevue/dialog'
import FileUpload from 'primevue/fileupload'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'

export default {
  name: 'KnowledgeBase',
  components: {
    AppLayout,
    Card,
    Button,
    InputText,
    IconField,
    InputIcon,
    Dropdown,
    Calendar,
    Tag,
    Dialog,
    FileUpload,
    Toast
  },
  data() {
    return {
      searchQuery: '',
      selectedType: null,
      selectedAccount: null,
      dateRange: null,
      showUploadDialog: false,
      showViewDialog: false,
      selectedItem: null,
      uploadType: '',
      uploadAccount: '',
      uploadTags: '',
      stats: {
        totalDocuments: 145,
        accountProfiles: 89,
        insights: 23,
        storageUsed: '2.3 GB'
      },
      typeOptions: [
        { label: 'All Types', value: null },
        { label: 'Company Profile', value: 'company-profile' },
        { label: 'Market Research', value: 'market-research' },
        { label: 'Competitive Analysis', value: 'competitive-analysis' },
        { label: 'Sales Playbook', value: 'sales-playbook' },
        { label: 'Case Study', value: 'case-study' },
        { label: 'Product Information', value: 'product-info' }
      ],
      accountOptions: [
        { label: 'All Accounts', value: null },
        { label: 'TechCorp Inc.', value: 'techcorp' },
        { label: 'Innovate Solutions', value: 'innovate' },
        { label: 'StartupCo', value: 'startupco' },
        { label: 'FinanceFlow', value: 'financeflow' }
      ],
      knowledgeItems: [
        {
          id: 1,
          title: 'TechCorp Inc. - Company Deep Dive',
          type: 'Company Profile',
          summary: 'Comprehensive analysis of TechCorp including financials, key personnel, technology stack, and market position.',
          content: 'TechCorp Inc. is a leading enterprise software company founded in 2015. The company specializes in AI-powered automation solutions for Fortune 500 clients...',
          tags: ['enterprise', 'ai', 'automation'],
          relatedAccount: 'TechCorp Inc.',
          createdAt: new Date('2024-01-15'),
          insights: [
            {
              id: 1,
              title: 'Growth Opportunity',
              description: 'TechCorp is actively expanding their AI team, indicating strong investment in product development.'
            },
            {
              id: 2,
              title: 'Decision Makers',
              description: 'Key decision makers include CTO Sarah Johnson and VP of Sales Mike Chen.'
            }
          ]
        },
        {
          id: 2,
          title: 'Fintech Market Analysis Q1 2024',
          type: 'Market Research',
          summary: 'Market trends, competitive landscape, and opportunities in the fintech sector for Q1 2024.',
          content: 'The fintech market continues to show strong growth with digital banking adoption rates increasing by 23% YoY...',
          tags: ['fintech', 'market-analysis', 'digital-banking'],
          relatedAccount: null,
          createdAt: new Date('2024-01-10'),
          insights: [
            {
              id: 1,
              title: 'Market Opportunity',
              description: 'Digital banking adoption is accelerating, creating opportunities for B2B fintech solutions.'
            }
          ]
        },
        {
          id: 3,
          title: 'Enterprise Sales Playbook - AI Companies',
          type: 'Sales Playbook',
          summary: 'Proven strategies and tactics for selling to AI and machine learning companies.',
          content: 'When approaching AI companies, focus on scalability challenges, data integration needs, and competitive differentiation...',
          tags: ['sales', 'ai-companies', 'playbook'],
          relatedAccount: null,
          createdAt: new Date('2024-01-08'),
          insights: [
            {
              id: 1,
              title: 'Key Pain Points',
              description: 'AI companies typically struggle with data quality and model deployment at scale.'
            }
          ]
        }
      ]
    }
  },
  setup() {
    const toast = useToast()
    return { toast }
  },
  computed: {
    filteredKnowledgeItems() {
      let filtered = [...this.knowledgeItems]
      
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(item => 
          item.title.toLowerCase().includes(query) ||
          item.summary.toLowerCase().includes(query) ||
          item.tags.some(tag => tag.toLowerCase().includes(query))
        )
      }
      
      if (this.selectedType) {
        filtered = filtered.filter(item => item.type.toLowerCase().replace(' ', '-') === this.selectedType)
      }
      
      if (this.selectedAccount) {
        filtered = filtered.filter(item => 
          item.relatedAccount && item.relatedAccount.toLowerCase().replace(/\s+/g, '').replace('.', '') === this.selectedAccount
        )
      }
      
      return filtered
    }
  },
  methods: {
    getTypeIcon(type) {
      const iconMap = {
        'Company Profile': 'pi pi-building',
        'Market Research': 'pi pi-chart-line',
        'Competitive Analysis': 'pi pi-eye',
        'Sales Playbook': 'pi pi-book',
        'Case Study': 'pi pi-file',
        'Product Information': 'pi pi-box'
      }
      return iconMap[type] || 'pi pi-file'
    },
    
    formatDate(date) {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(date)
    },
    
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    },
    
    viewItem(item) {
      this.selectedItem = item
      this.showViewDialog = true
    },
    
    editItem(item) {
      this.toast.add({
        severity: 'info',
        summary: 'Edit Mode',
        detail: `Editing ${item.title}`,
        life: 3000
      })
    },
    
    deleteItem(item) {
      this.toast.add({
        severity: 'warn',
        summary: 'Item Deleted',
        detail: `${item.title} has been deleted`,
        life: 3000
      })
      
      const index = this.knowledgeItems.findIndex(k => k.id === item.id)
      if (index > -1) {
        this.knowledgeItems.splice(index, 1)
      }
    },
    
    createKnowledgeEntry() {
      this.toast.add({
        severity: 'info',
        summary: 'Create Entry',
        detail: 'Opening knowledge entry creator',
        life: 3000
      })
    },
    
    onFilesSelect(event) {
      // Handle file selection
      console.log('Files selected:', event.files)
    },
    
    onUpload(event) {
      this.toast.add({
        severity: 'success',
        summary: 'Upload Complete',
        detail: 'Documents have been uploaded and processed',
        life: 3000
      })
      
      // Simulate adding new knowledge items
      const newItems = event.files.map((file, index) => ({
        id: Date.now() + index,
        title: file.name.replace(/\.[^/.]+$/, ""),
        type: this.uploadType || 'Document',
        summary: `Uploaded document containing information relevant to your knowledge base.`,
        content: 'Document content would be extracted and processed here...',
        tags: this.uploadTags ? this.uploadTags.split(',').map(tag => tag.trim()) : [],
        relatedAccount: this.uploadAccount || null,
        createdAt: new Date(),
        insights: []
      }))
      
      this.knowledgeItems.unshift(...newItems)
      this.stats.totalDocuments += newItems.length
    },
    
    onUploadError(event) {
      this.toast.add({
        severity: 'error',
        summary: 'Upload Failed',
        detail: 'Failed to upload documents',
        life: 3000
      })
    }
  }
}
</script>

<style scoped>
.knowledge-page {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.header-left h1 {
  margin: 0 0 8px 0;
  color: #1f2937;
  font-size: 32px;
}

.header-left p {
  margin: 0;
  color: #6b7280;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.knowledge-stats {
  margin-bottom: 32px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.stat-card {
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.stat-icon.documents {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-icon.accounts {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-icon.insights {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-icon.storage {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.stat-details h3 {
  margin: 0 0 4px 0;
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
}

.stat-details p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

.content-filters {
  margin-bottom: 24px;
}

.filter-section {
  padding: 20px;
}

.search-input {
  width: 100%;
  margin-bottom: 16px;
}

.filter-options {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-dropdown {
  min-width: 200px;
}

.knowledge-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 24px;
}

.knowledge-card {
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}

.knowledge-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.knowledge-item {
  padding: 24px;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.item-info {
  display: flex;
  gap: 12px;
  flex: 1;
}

.item-icon {
  width: 40px;
  height: 40px;
  background: #f3f4f6;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #667eea;
  flex-shrink: 0;
}

.item-details h4 {
  margin: 0 0 4px 0;
  color: #1f2937;
  font-size: 16px;
  line-height: 1.4;
}

.item-details small {
  color: #6b7280;
  font-size: 12px;
}

.item-actions {
  display: flex;
  gap: 4px;
}

.item-content {
  margin-bottom: 16px;
}

.item-content p {
  margin: 0;
  color: #374151;
  font-size: 14px;
  line-height: 1.5;
}

.item-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.knowledge-tag {
  font-size: 11px;
  padding: 2px 8px;
}

.item-account {
  padding-top: 12px;
  border-top: 1px solid #f3f4f6;
}

.item-account small {
  color: #6b7280;
  font-size: 12px;
}

.upload-dialog {
  padding: 20px 0;
}

.upload-section {
  margin-bottom: 32px;
}

.knowledge-uploader {
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  background: #f9fafb;
}

.upload-header {
  display: flex;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.upload-content {
  padding: 20px;
  min-height: 200px;
}

.upload-content h5 {
  margin: 0 0 12px 0;
  color: #374151;
  font-size: 14px;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  margin-bottom: 8px;
  background: white;
}

.file-item.uploaded {
  background: #f0fdf4;
  border-color: #bbf7d0;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.file-icon {
  color: #6b7280;
  font-size: 16px;
}

.file-icon.success {
  color: #10b981;
}

.file-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.file-name {
  font-size: 13px;
  color: #374151;
}

.file-size {
  font-size: 11px;
  color: #9ca3af;
}

.upload-options h4 {
  margin: 0 0 16px 0;
  color: #1f2937;
}

.option-field {
  margin-bottom: 16px;
}

.option-field label {
  display: block;
  margin-bottom: 4px;
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

.view-dialog {
  padding: 20px 0;
}

.item-meta {
  background: #f9fafb;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.meta-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.meta-row:last-child {
  margin-bottom: 0;
}

.meta-label {
  font-weight: 600;
  color: #6b7280;
  font-size: 14px;
  min-width: 100px;
}

.tag-list {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.item-full-content h4 {
  margin: 0 0 12px 0;
  color: #1f2937;
  font-size: 18px;
}

.content-text {
  background: #f9fafb;
  padding: 16px;
  border-radius: 8px;
  color: #374151;
  line-height: 1.6;
  font-size: 14px;
  margin-bottom: 24px;
}

.item-insights h4 {
  margin: 0 0 16px 0;
  color: #1f2937;
  font-size: 18px;
}

.insights-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.insight-item {
  padding: 16px;
  background: #eff6ff;
  border-left: 4px solid #3b82f6;
  border-radius: 0 8px 8px 0;
}

.insight-item h5 {
  margin: 0 0 8px 0;
  color: #1e40af;
  font-size: 16px;
}

.insight-item p {
  margin: 0;
  color: #374151;
  font-size: 14px;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 16px;
  }
  
  .header-actions {
    width: 100%;
    flex-direction: column;
  }
  
  .filter-options {
    flex-direction: column;
  }
  
  .filter-dropdown {
    width: 100%;
  }
  
  .knowledge-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .meta-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .meta-label {
    min-width: auto;
  }
}
</style>