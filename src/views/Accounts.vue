<template>
  <AppLayout>
    <div class="accounts-page">
      <div class="page-header">
        <div class="header-left">
          <h1>Accounts</h1>
          <p>Manage your target accounts and companies</p>
        </div>
        <div class="header-actions">
          <Button 
            @click="showAddDialog = true"
            label="Add Account" 
            icon="pi pi-plus"
            class="p-button-primary"
          />
          <Button 
            @click="researchSelected"
            label="Research Selected" 
            icon="pi pi-search"
            class="p-button-outlined"
            :disabled="!selectedAccounts.length"
          />
        </div>
      </div>
      
      <Card class="filters-card">
        <template #content>
          <div class="filters-section">
            <IconField iconPosition="left" class="search-field">
              <InputIcon class="pi pi-search" />
              <InputText 
                v-model="globalFilter" 
                placeholder="Search accounts..." 
                class="search-input"
              />
            </IconField>
            <div class="filter-dropdowns">
              <Dropdown 
                v-model="industryFilter" 
                :options="industryOptions" 
                placeholder="Filter by industry"
                class="industry-filter"
              />
              <Dropdown 
                v-model="sizeFilter" 
                :options="sizeOptions" 
                placeholder="Filter by size"
                class="size-filter"
              />
            </div>
          </div>
        </template>
      </Card>
      
      <div class="kanban-board">
        <div 
          v-for="status in accountStatuses" 
          :key="status.key"
          class="kanban-column"
        >
          <div class="column-header">
            <div class="column-title">
              <i :class="status.icon" class="column-icon"></i>
              <h3>{{ status.label }}</h3>
              <span class="account-count">{{ getAccountsByStatus(status.key).length }}</span>
            </div>
            <Button 
              v-if="status.key === 'new'"
              @click="showAddDialog = true"
              icon="pi pi-plus" 
              class="p-button-rounded p-button-text p-button-sm"
              v-tooltip="'Add Account'"
            />
          </div>
          
          <div 
            class="column-content"
            @dragover="onDragOver($event)"
            @drop="onDrop($event, status.key)"
          >
            <div 
              v-for="account in getAccountsByStatus(status.key)" 
              :key="account.id"
              class="account-card"
              @click="selectAccount(account)"
              :class="{ 'selected': selectedAccounts.some(a => a.id === account.id) }"
              draggable="true"
              @dragstart="onDragStart($event, account)"
            >
              <div class="account-card-content">
                <div class="account-header">
                  <div class="company-logo">
                    <img 
                      v-if="account.logo" 
                      :src="account.logo" 
                      :alt="account.name"
                      class="logo-img"
                    />
                    <div v-else class="logo-placeholder">
                      {{ account.name.charAt(0) }}
                    </div>
                  </div>
                  <div class="account-info">
                    <h4 class="company-name">{{ account.name }}</h4>
                    <p class="company-domain">{{ account.domain }}</p>
                  </div>
                  <div class="account-actions">
                    <Button 
                      @click.stop="viewAccountDetails(account)"
                      icon="pi pi-eye" 
                      class="p-button-rounded p-button-text p-button-sm"
                      v-tooltip="'View Details'"
                    />
                    <Button 
                      @click.stop="researchAccount(account)"
                      icon="pi pi-search" 
                      class="p-button-rounded p-button-text p-button-sm"
                      v-tooltip="'Research'"
                      :loading="account.researching"
                    />
                  </div>
                </div>
                
                <div class="account-meta">
                  <div class="meta-row">
                    <span class="meta-label">{{ account.industry }}</span>
                    <Tag 
                      :value="account.size" 
                      :severity="getSizeSeverity(account.size)"
                      class="size-tag"
                    />
                  </div>
                  <div class="meta-row">
                    <span class="meta-location">
                      <i class="pi pi-map-marker"></i>
                      {{ account.location }}
                    </span>
                    <span class="contact-count">
                      <i class="pi pi-users"></i>
                      {{ account.contactCount }}
                    </span>
                  </div>
                </div>
                
                <div class="account-footer">
                  <div class="status-info">
                    <span v-if="account.lastResearched" class="last-researched">
                      <i class="pi pi-clock"></i>
                      {{ formatDate(account.lastResearched) }}
                    </span>
                    <span v-else class="never-researched">
                      <i class="pi pi-exclamation-triangle"></i>
                      Never researched
                    </span>
                  </div>
                  <div class="card-actions">
                    <Button 
                      @click.stop="viewContacts(account)"
                      icon="pi pi-users" 
                      class="p-button-rounded p-button-text p-button-sm"
                      v-tooltip="'View Contacts'"
                    />
                    <Button 
                      @click.stop="addToKnowledgeBase(account)"
                      icon="pi pi-book" 
                      class="p-button-rounded p-button-text p-button-sm"
                      v-tooltip="'Add to Knowledge Base'"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div 
              v-if="getAccountsByStatus(status.key).length === 0"
              class="empty-column"
            >
              <i :class="status.icon" class="empty-icon"></i>
              <p>No accounts in {{ status.label.toLowerCase() }}</p>
              <Button 
                v-if="status.key === 'new'"
                @click="showAddDialog = true"
                label="Add First Account"
                icon="pi pi-plus"
                class="p-button-outlined p-button-sm"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="selectedAccounts.length > 0" class="bulk-actions">
        <Card>
          <template #content>
            <div class="bulk-actions-content">
              <span class="selected-count">
                {{ selectedAccounts.length }} account(s) selected
              </span>
              <div class="bulk-buttons">
                <Button 
                  @click="researchSelected"
                  label="Research Selected" 
                  icon="pi pi-search"
                  class="p-button-outlined"
                  :loading="loading"
                />
                <Button 
                  @click="selectedAccounts = []"
                  label="Clear Selection" 
                  icon="pi pi-times"
                  class="p-button-text"
                />
              </div>
            </div>
          </template>
        </Card>
      </div>
      
      <Dialog 
        v-model:visible="showAddDialog" 
        modal 
        header="Add New Account"
        :style="{ width: '500px' }"
      >
        <div class="add-account-form">
          <div class="field">
            <label for="accountName">Company Name</label>
            <InputText 
              id="accountName" 
              v-model="newAccount.name"
              placeholder="Enter company name"
              :class="{ 'p-invalid': errors.name }"
            />
            <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
          </div>
          
          <div class="field">
            <label for="accountDomain">Domain</label>
            <InputText 
              id="accountDomain" 
              v-model="newAccount.domain"
              placeholder="example.com"
              :class="{ 'p-invalid': errors.domain }"
            />
            <small v-if="errors.domain" class="p-error">{{ errors.domain }}</small>
          </div>
          
          <div class="field">
            <label for="accountIndustry">Industry</label>
            <Dropdown 
              id="accountIndustry"
              v-model="newAccount.industry" 
              :options="industryOptions.slice(1)"
              optionLabel="label"
              optionValue="value"
              placeholder="Select industry"
            />
          </div>
          
          <div class="field">
            <label for="accountSize">Company Size</label>
            <Dropdown 
              id="accountSize"
              v-model="newAccount.size" 
              :options="sizeOptions.slice(1)"
              optionLabel="label"
              optionValue="value"
              placeholder="Select size"
            />
          </div>
          
          <div class="field">
            <label for="accountLocation">Location</label>
            <InputText 
              id="accountLocation" 
              v-model="newAccount.location"
              placeholder="City, Country"
            />
          </div>
        </div>
        
        <template #footer>
          <Button 
            @click="showAddDialog = false"
            label="Cancel" 
            class="p-button-text"
          />
          <Button 
            @click="addAccount"
            label="Add Account"
            :loading="adding"
            class="p-button-primary"
          />
        </template>
      </Dialog>
      
      <Dialog 
        v-model:visible="showDetailsDialog" 
        modal 
        :header="selectedAccount?.name"
        :style="{ width: '800px' }"
      >
        <div v-if="selectedAccount" class="account-details">
          <div class="details-grid">
            <div class="detail-item">
              <label>Industry</label>
              <span>{{ selectedAccount.industry }}</span>
            </div>
            <div class="detail-item">
              <label>Size</label>
              <span>{{ selectedAccount.size }}</span>
            </div>
            <div class="detail-item">
              <label>Location</label>
              <span>{{ selectedAccount.location }}</span>
            </div>
            <div class="detail-item">
              <label>Domain</label>
              <span>{{ selectedAccount.domain }}</span>
            </div>
          </div>
          
          <div class="research-info" v-if="selectedAccount.researchData">
            <h4>Research Information</h4>
            <p>{{ selectedAccount.researchData }}</p>
          </div>
        </div>
      </Dialog>
    </div>
    
    <Toast />
  </AppLayout>
</template>

<script>
import AppLayout from '../components/AppLayout.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Card from 'primevue/card'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import Dropdown from 'primevue/dropdown'
import Tag from 'primevue/tag'
import Dialog from 'primevue/dialog'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'

export default {
  name: 'Accounts',
  components: {
    AppLayout,
    DataTable,
    Column,
    Card,
    Button,
    InputText,
    IconField,
    InputIcon,
    Dropdown,
    Tag,
    Dialog,
    Toast
  },
  data() {
    return {
      accounts: [
        {
          id: 1,
          name: 'TechCorp Inc.',
          domain: 'techcorp.com',
          industry: 'Technology',
          size: 'Large',
          location: 'San Francisco, CA',
          contactCount: 15,
          lastResearched: new Date('2024-01-15'),
          researching: false,
          logo: null,
          status: 'qualified',
          researchData: 'Leading enterprise software company with strong growth in AI/ML solutions.'
        },
        {
          id: 2,
          name: 'Innovate Solutions',
          domain: 'innovate.com',
          industry: 'Consulting',
          size: 'Medium',
          location: 'New York, NY',
          contactCount: 8,
          lastResearched: null,
          researching: false,
          logo: null,
          status: 'new'
        },
        {
          id: 3,
          name: 'StartupCo',
          domain: 'startupco.com',
          industry: 'Fintech',
          size: 'Small',
          location: 'Austin, TX',
          contactCount: 3,
          lastResearched: new Date('2024-01-10'),
          researching: false,
          logo: null,
          status: 'researching'
        },
        {
          id: 4,
          name: 'Enterprise Corp',
          domain: 'enterprise.com',
          industry: 'Manufacturing',
          size: 'Large',
          location: 'Chicago, IL',
          contactCount: 22,
          lastResearched: new Date('2024-01-08'),
          researching: false,
          logo: null,
          status: 'engaged'
        },
        {
          id: 5,
          name: 'HealthTech Solutions',
          domain: 'healthtech.com',
          industry: 'Healthcare',
          size: 'Medium',
          location: 'Boston, MA',
          contactCount: 12,
          lastResearched: new Date('2024-01-12'),
          researching: false,
          logo: null,
          status: 'contracted'
        }
      ],
      accountStatuses: [
        {
          key: 'new',
          label: 'New Accounts',
          icon: 'pi pi-plus-circle',
          color: '#6b7280'
        },
        {
          key: 'researching',
          label: 'Research Phase',
          icon: 'pi pi-search',
          color: '#f59e0b'
        },
        {
          key: 'qualified',
          label: 'Qualified',
          icon: 'pi pi-check-circle',
          color: '#3b82f6'
        },
        {
          key: 'engaged',
          label: 'Engaged',
          icon: 'pi pi-comments',
          color: '#8b5cf6'
        },
        {
          key: 'contracted',
          label: 'Contracted',
          icon: 'pi pi-verified',
          color: '#10b981'
        }
      ],
      draggedAccount: null,
      selectedAccounts: [],
      selectedAccount: null,
      loading: false,
      globalFilter: '',
      industryFilter: null,
      sizeFilter: null,
      industryOptions: [
        { label: 'All Industries', value: null },
        { label: 'Technology', value: 'Technology' },
        { label: 'Healthcare', value: 'Healthcare' },
        { label: 'Finance', value: 'Finance' },
        { label: 'Consulting', value: 'Consulting' },
        { label: 'Manufacturing', value: 'Manufacturing' },
        { label: 'Retail', value: 'Retail' },
        { label: 'Education', value: 'Education' },
        { label: 'Fintech', value: 'Fintech' }
      ],
      sizeOptions: [
        { label: 'All Sizes', value: null },
        { label: 'Small (1-50)', value: 'Small' },
        { label: 'Medium (51-500)', value: 'Medium' },
        { label: 'Large (500+)', value: 'Large' }
      ],
      showAddDialog: false,
      showDetailsDialog: false,
      adding: false,
      newAccount: {
        name: '',
        domain: '',
        industry: '',
        size: '',
        location: ''
      },
      errors: {}
    }
  },
  setup() {
    const toast = useToast()
    return { toast }
  },
  computed: {
    filteredAccounts() {
      let filtered = [...this.accounts]
      
      if (this.globalFilter) {
        const query = this.globalFilter.toLowerCase()
        filtered = filtered.filter(account => 
          account.name.toLowerCase().includes(query) ||
          account.domain.toLowerCase().includes(query) ||
          account.industry.toLowerCase().includes(query) ||
          account.location.toLowerCase().includes(query)
        )
      }
      
      if (this.industryFilter) {
        filtered = filtered.filter(account => account.industry === this.industryFilter)
      }
      
      if (this.sizeFilter) {
        filtered = filtered.filter(account => account.size === this.sizeFilter)
      }
      
      return filtered
    }
  },
  methods: {
    getSizeSeverity(size) {
      switch (size) {
        case 'Large': return 'success'
        case 'Medium': return 'warning'
        case 'Small': return 'info'
        default: return null
      }
    },
    
    formatDate(date) {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(date)
    },
    
    selectAccount(account) {
      const index = this.selectedAccounts.findIndex(a => a.id === account.id)
      if (index > -1) {
        this.selectedAccounts.splice(index, 1)
      } else {
        this.selectedAccounts.push(account)
      }
    },
    
    viewAccountDetails(account) {
      this.selectedAccount = account
      this.showDetailsDialog = true
    },
    
    async researchAccount(account) {
      account.researching = true
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 3000))
        
        account.lastResearched = new Date()
        account.researchData = `Updated research data for ${account.name}. Recent developments include new product launches and market expansion.`
        account.researching = false
        
        this.toast.add({
          severity: 'success',
          summary: 'Research Complete',
          detail: `${account.name} has been researched and updated`,
          life: 3000
        })
      } catch (error) {
        account.researching = false
        this.toast.add({
          severity: 'error',
          summary: 'Research Failed',
          detail: 'Failed to research account',
          life: 3000
        })
      }
    },
    
    viewContacts(account) {
      this.$router.push({
        path: '/contacts',
        query: { account: account.id }
      })
    },
    
    addToKnowledgeBase(account) {
      this.toast.add({
        severity: 'info',
        summary: 'Added to Knowledge Base',
        detail: `${account.name} information has been added to your knowledge base`,
        life: 3000
      })
    },
    
    async researchSelected() {
      if (!this.selectedAccounts.length) return
      
      this.loading = true
      
      try {
        // Simulate batch research
        await new Promise(resolve => setTimeout(resolve, 4000))
        
        this.selectedAccounts.forEach(account => {
          account.lastResearched = new Date()
          account.researchData = `Batch research completed for ${account.name}`
        })
        
        this.toast.add({
          severity: 'success',
          summary: 'Batch Research Complete',
          detail: `${this.selectedAccounts.length} accounts have been researched`,
          life: 3000
        })
        
        this.selectedAccounts = []
      } catch (error) {
        this.toast.add({
          severity: 'error',
          summary: 'Research Failed',
          detail: 'Failed to research selected accounts',
          life: 3000
        })
      } finally {
        this.loading = false
      }
    },
    
    validateAccount() {
      this.errors = {}
      
      if (!this.newAccount.name) {
        this.errors.name = 'Company name is required'
      }
      
      if (!this.newAccount.domain) {
        this.errors.domain = 'Domain is required'
      } else if (!/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/.test(this.newAccount.domain)) {
        this.errors.domain = 'Please enter a valid domain'
      }
      
      return Object.keys(this.errors).length === 0
    },
    
    async addAccount() {
      if (!this.validateAccount()) return
      
      this.adding = true
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        const account = {
          id: Date.now(),
          ...this.newAccount,
          contactCount: 0,
          lastResearched: null,
          researching: false,
          logo: null,
          status: 'new'
        }
        
        this.accounts.push(account)
        
        this.newAccount = {
          name: '',
          domain: '',
          industry: '',
          size: '',
          location: ''
        }
        
        this.toast.add({
          severity: 'success',
          summary: 'Account Added',
          detail: 'New account has been added successfully',
          life: 3000
        })
        
        this.showAddDialog = false
      } catch (error) {
        this.toast.add({
          severity: 'error',
          summary: 'Add Failed',
          detail: 'Failed to add account',
          life: 3000
        })
      } finally {
        this.adding = false
      }
    },
    
    getAccountsByStatus(status) {
      return this.filteredAccounts.filter(account => account.status === status)
    },
    
    onDragStart(event, account) {
      this.draggedAccount = account
      event.dataTransfer.effectAllowed = 'move'
    },
    
    onDragOver(event) {
      event.preventDefault()
      event.dataTransfer.dropEffect = 'move'
    },
    
    onDrop(event, newStatus) {
      event.preventDefault()
      
      if (this.draggedAccount && this.draggedAccount.status !== newStatus) {
        const accountIndex = this.accounts.findIndex(account => account.id === this.draggedAccount.id)
        if (accountIndex > -1) {
          this.accounts[accountIndex].status = newStatus
          
          this.toast.add({
            severity: 'success',
            summary: 'Status Updated',
            detail: `${this.draggedAccount.name} moved to ${this.accountStatuses.find(s => s.key === newStatus)?.label}`,
            life: 3000
          })
        }
      }
      
      this.draggedAccount = null
    }
  }
}
</script>

<style scoped>
.accounts-page {
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

.filters-card {
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.filters-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.search-field {
  flex: 1;
  max-width: 400px;
}

.search-input {
  width: 100%;
}

.filter-dropdowns {
  display: flex;
  gap: 12px;
}

.industry-filter,
.size-filter {
  width: 200px;
}

.accounts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
}

.account-card {
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
  cursor: pointer;
}

.account-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.account-card.selected {
  border: 2px solid #007a5a;
  box-shadow: 0 4px 12px rgba(0, 122, 90, 0.2);
}

.account-card-content {
  padding: 0;
}

.account-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
}

.account-info {
  flex: 1;
}

.company-name {
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1d1c1d;
}

.company-domain {
  margin: 0;
  color: #616061;
  font-size: 14px;
}

.account-details {
  margin-bottom: 16px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.detail-row:last-child {
  margin-bottom: 0;
}

.detail-label {
  font-size: 12px;
  color: #616061;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-value {
  font-size: 14px;
  color: #1d1c1d;
  font-weight: 500;
}

.size-tag {
  font-size: 11px;
}

.contact-count {
  font-weight: 600;
  color: #007a5a;
  font-size: 14px;
}

.never-researched {
  color: #868686;
  font-style: italic;
  font-size: 12px;
}

.account-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #e5e5e5;
}

.account-actions {
  display: flex;
  gap: 4px;
}

.bulk-actions {
  position: sticky;
  bottom: 24px;
  z-index: 100;
}

.bulk-actions-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
}

.selected-count {
  font-weight: 600;
  color: #1d1c1d;
}

.bulk-buttons {
  display: flex;
  gap: 12px;
}

.company-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.company-logo {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
}

.logo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.logo-placeholder {
  width: 100%;
  height: 100%;
  background: #667eea;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
}

.company-details h4 {
  margin: 0 0 4px 0;
  color: #1f2937;
  font-size: 14px;
}

.company-details small {
  color: #6b7280;
}

.contact-count {
  font-weight: 600;
  color: #667eea;
}

.last-researched {
  color: #374151;
}

.never-researched {
  color: #9ca3af;
  font-style: italic;
}

.account-actions {
  display: flex;
  gap: 4px;
}

.add-account-form .field {
  margin-bottom: 20px;
}

.add-account-form label {
  display: block;
  margin-bottom: 4px;
  font-weight: 600;
  color: #374151;
}

.account-details {
  padding: 20px 0;
}

.details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-item label {
  font-weight: 600;
  color: #6b7280;
  font-size: 12px;
  text-transform: uppercase;
}

.detail-item span {
  color: #1f2937;
  font-size: 14px;
}

.research-info h4 {
  margin: 0 0 12px 0;
  color: #1f2937;
}

.research-info p {
  margin: 0;
  color: #374151;
  line-height: 1.6;
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
  
  .filters-section {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .search-field {
    max-width: none;
  }
  
  .filter-dropdowns {
    flex-direction: column;
    gap: 12px;
  }
  
  .industry-filter,
  .size-filter {
    width: 100%;
  }
  
  .accounts-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .account-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .account-actions {
    align-self: flex-end;
  }
  
  .account-footer {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .bulk-actions-content {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .bulk-buttons {
    flex-direction: column;
  }
  
  .details-grid {
    grid-template-columns: 1fr;
  }
}

/* Kanban Board Styling */
.kanban-board {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  overflow-y: visible;
  padding: 0 4px 16px 4px;
  min-height: 500px;
  width: 100%;
}

.kanban-column {
  flex: 1;
  min-width: 300px;
  max-width: 350px;
  background: #f9fafb;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.column-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
  background: #ffffff;
  border-radius: 12px 12px 0 0;
}

.column-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.column-icon {
  font-size: 18px;
  color: #6b7280;
}

.column-title h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.account-count {
  background: #e5e7eb;
  color: #374151;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  min-width: 20px;
  text-align: center;
}

.column-content {
  flex: 1;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 300px;
  max-height: 70vh;
  overflow-y: auto;
}

.kanban-board .account-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.kanban-board .account-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
  border-color: #d1d5db;
}

.kanban-board .account-card.selected {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.kanban-board .account-card[draggable="true"] {
  cursor: grab;
}

.kanban-board .account-card[draggable="true"]:active {
  cursor: grabbing;
  opacity: 0.8;
}

.kanban-board .account-card-content {
  padding: 16px;
}

.kanban-board .account-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
}

.kanban-board .account-info {
  flex: 1;
  min-width: 0;
}

.kanban-board .account-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.kanban-board .account-card:hover .account-actions {
  opacity: 1;
}

.kanban-board .account-meta {
  margin-bottom: 12px;
}

.kanban-board .meta-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.kanban-board .meta-row:last-child {
  margin-bottom: 0;
}

.kanban-board .meta-label {
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
}

.kanban-board .meta-location {
  font-size: 12px;
  color: #9ca3af;
  display: flex;
  align-items: center;
  gap: 4px;
}

.kanban-board .contact-count {
  font-size: 12px;
  color: #3b82f6;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
}

.kanban-board .account-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #f3f4f6;
}

.kanban-board .status-info {
  font-size: 11px;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 4px;
}

.kanban-board .last-researched {
  color: #10b981;
}

.kanban-board .never-researched {
  color: #f59e0b;
}

.kanban-board .card-actions {
  display: flex;
  gap: 4px;
}

.empty-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px 20px;
  color: #9ca3af;
  border: 2px dashed #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
  min-height: 200px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-column p {
  margin: 0 0 16px 0;
  font-size: 14px;
}

/* Drag and drop states */
.kanban-column.drag-over {
  background: #eff6ff;
  border-color: #3b82f6;
}

.kanban-column.drag-over .column-content {
  background: rgba(59, 130, 246, 0.05);
}

/* Responsive adjustments for Kanban */
@media (max-width: 1400px) {
  .kanban-column {
    min-width: 280px;
    max-width: 320px;
  }
}

@media (max-width: 1200px) {
  .kanban-board {
    gap: 16px;
  }
  
  .kanban-column {
    min-width: 260px;
    max-width: 300px;
  }
}

@media (max-width: 1024px) {
  .kanban-board {
    gap: 12px;
    padding: 0 2px 12px 2px;
  }
  
  .kanban-column {
    min-width: 240px;
    max-width: 280px;
  }
  
  .column-content {
    padding: 10px;
    gap: 10px;
    max-height: 60vh;
  }
}

@media (max-width: 768px) {
  .kanban-board {
    flex-direction: column;
    gap: 16px;
    overflow-x: visible;
    min-height: auto;
    padding: 0;
  }
  
  .kanban-column {
    min-width: auto;
    max-width: none;
    width: 100%;
    flex-shrink: 1;
  }
  
  .column-content {
    min-height: 200px;
    max-height: none;
    padding: 12px;
  }
  
  .column-header {
    padding: 12px 16px;
  }
  
  .kanban-board .account-card-content {
    padding: 12px;
  }
  
  .kanban-board .account-header {
    margin-bottom: 12px;
  }
  
  .kanban-board .account-meta {
    margin-bottom: 8px;
  }
  
  .kanban-board .meta-row {
    margin-bottom: 6px;
  }
}

@media (max-width: 480px) {
  .kanban-board .account-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .kanban-board .account-actions {
    align-self: flex-end;
    opacity: 1;
  }
  
  .company-logo {
    width: 32px;
    height: 32px;
  }
  
  .column-title h3 {
    font-size: 14px;
  }
}
</style>