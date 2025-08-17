<template>
  <AppLayout>
    <div class="contacts-page">
      <div class="page-header">
        <div class="header-left">
          <h1>Contacts</h1>
          <p>Manage and enrich your contact database</p>
        </div>
        <div class="header-actions">
          <Button 
            @click="showImportDialog = true"
            label="Import Contacts" 
            icon="pi pi-upload"
            class="p-button-primary"
          />
          <Button 
            @click="enrichSelected"
            label="Enrich Selected" 
            icon="pi pi-chart-line"
            class="p-button-outlined"
            :disabled="!selectedContacts.length"
          />
        </div>
      </div>
      
      <Card class="contacts-card">
        <template #content>
          <DataTable 
            v-model:selection="selectedContacts"
            :value="contacts" 
            :paginator="true" 
            :rows="10"
            :rowsPerPageOptions="[10, 25, 50]"
            :loading="loading"
            selectionMode="multiple"
            dataKey="id"
            :globalFilterFields="['name', 'email', 'company']"
            class="contacts-table"
          >
            <template #header>
              <div class="table-header">
                <IconField iconPosition="left">
                  <InputIcon class="pi pi-search" />
                  <InputText 
                    v-model="globalFilter" 
                    placeholder="Search contacts..." 
                    class="search-input"
                  />
                </IconField>
                <div class="header-actions">
                  <Dropdown 
                    v-model="statusFilter" 
                    :options="statusOptions" 
                    placeholder="Filter by status"
                    class="status-filter"
                  />
                </div>
              </div>
            </template>
            
            <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
            
            <Column field="name" header="Name" sortable>
              <template #body="{ data }">
                <div class="contact-name">
                  <Avatar 
                    :label="data.name.charAt(0)" 
                    class="contact-avatar"
                    shape="circle"
                  />
                  <span>{{ data.name }}</span>
                </div>
              </template>
            </Column>
            
            <Column field="email" header="Email" sortable>
              <template #body="{ data }">
                <a :href="`mailto:${data.email}`" class="email-link">
                  {{ data.email }}
                </a>
              </template>
            </Column>
            
            <Column field="company" header="Company" sortable></Column>
            
            <Column field="title" header="Title" sortable></Column>
            
            <Column field="status" header="Status" sortable>
              <template #body="{ data }">
                <Tag 
                  :value="data.status" 
                  :severity="getStatusSeverity(data.status)"
                />
              </template>
            </Column>
            
            <Column field="enriched" header="Enriched" sortable>
              <template #body="{ data }">
                <i 
                  :class="data.enriched ? 'pi pi-check-circle text-green-500' : 'pi pi-times-circle text-red-500'"
                ></i>
              </template>
            </Column>
            
            <Column header="Actions">
              <template #body="{ data }">
                <div class="contact-actions">
                  <Button 
                    @click="chatWithContact(data)"
                    icon="pi pi-comments" 
                    class="p-button-rounded p-button-text"
                    v-tooltip="'Chat'"
                  />
                  <Button 
                    @click="sendLinkedInMessage(data)"
                    icon="pi pi-linkedin" 
                    class="p-button-rounded p-button-text"
                    v-tooltip="'LinkedIn'"
                  />
                  <Button 
                    @click="sendEmail(data)"
                    icon="pi pi-envelope" 
                    class="p-button-rounded p-button-text"
                    v-tooltip="'Email'"
                  />
                  <Button 
                    @click="enrichContact(data)"
                    icon="pi pi-chart-line" 
                    class="p-button-rounded p-button-text"
                    v-tooltip="'Enrich'"
                    :loading="data.enriching"
                  />
                </div>
              </template>
            </Column>
          </DataTable>
        </template>
      </Card>
      
      <Dialog 
        v-model:visible="showImportDialog" 
        modal 
        header="Import Contacts"
        :style="{ width: '600px' }"
      >
        <div class="import-dialog">
          <div class="import-options">
            <h4>Choose import method:</h4>
            <div class="import-methods">
              <Card 
                @click="importMethod = 'csv'"
                :class="{ 'selected': importMethod === 'csv' }"
                class="import-method-card"
              >
                <template #content>
                  <div class="method-content">
                    <i class="pi pi-file-excel method-icon"></i>
                    <h5>CSV Upload</h5>
                    <p>Upload a CSV file with contact information</p>
                  </div>
                </template>
              </Card>
              
              <Card 
                @click="importMethod = 'manual'"
                :class="{ 'selected': importMethod === 'manual' }"
                class="import-method-card"
              >
                <template #content>
                  <div class="method-content">
                    <i class="pi pi-plus method-icon"></i>
                    <h5>Manual Entry</h5>
                    <p>Add contacts one by one manually</p>
                  </div>
                </template>
              </Card>
            </div>
          </div>
          
          <div v-if="importMethod === 'csv'" class="csv-upload">
            <FileUpload 
              mode="basic" 
              accept=".csv"
              :maxFileSize="10000000"
              @select="onFileSelect"
              choose-label="Choose CSV File"
              class="csv-uploader"
            />
            <small class="upload-hint">
              Expected columns: Name, Email, Company, Title
            </small>
          </div>
          
          <div v-if="importMethod === 'manual'" class="manual-entry">
            <div class="field">
              <label for="contactName">Name</label>
              <InputText id="contactName" v-model="newContact.name" />
            </div>
            <div class="field">
              <label for="contactEmail">Email</label>
              <InputText id="contactEmail" v-model="newContact.email" type="email" />
            </div>
            <div class="field">
              <label for="contactCompany">Company</label>
              <InputText id="contactCompany" v-model="newContact.company" />
            </div>
            <div class="field">
              <label for="contactTitle">Title</label>
              <InputText id="contactTitle" v-model="newContact.title" />
            </div>
          </div>
        </div>
        
        <template #footer>
          <Button 
            @click="showImportDialog = false"
            label="Cancel" 
            class="p-button-text"
          />
          <Button 
            @click="importContacts"
            :label="importMethod === 'csv' ? 'Upload & Import' : 'Add Contact'"
            :loading="importing"
            class="p-button-primary"
          />
        </template>
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
import Avatar from 'primevue/avatar'
import Tag from 'primevue/tag'
import Dialog from 'primevue/dialog'
import FileUpload from 'primevue/fileupload'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'

export default {
  name: 'Contacts',
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
    Avatar,
    Tag,
    Dialog,
    FileUpload,
    Toast
  },
  data() {
    return {
      contacts: [
        {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@techcorp.com',
          company: 'TechCorp Inc.',
          title: 'Software Engineer',
          status: 'Active',
          enriched: true,
          enriching: false
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane.smith@innovate.com',
          company: 'Innovate Solutions',
          title: 'Product Manager',
          status: 'Prospect',
          enriched: false,
          enriching: false
        },
        {
          id: 3,
          name: 'Mike Johnson',
          email: 'mike.j@startupco.com',
          company: 'StartupCo',
          title: 'CEO',
          status: 'Lead',
          enriched: true,
          enriching: false
        }
      ],
      selectedContacts: [],
      loading: false,
      globalFilter: '',
      statusFilter: null,
      statusOptions: [
        { label: 'All', value: null },
        { label: 'Active', value: 'Active' },
        { label: 'Prospect', value: 'Prospect' },
        { label: 'Lead', value: 'Lead' }
      ],
      showImportDialog: false,
      importMethod: 'csv',
      importing: false,
      newContact: {
        name: '',
        email: '',
        company: '',
        title: ''
      }
    }
  },
  setup() {
    const toast = useToast()
    return { toast }
  },
  methods: {
    getStatusSeverity(status) {
      switch (status) {
        case 'Active': return 'success'
        case 'Prospect': return 'warning'
        case 'Lead': return 'info'
        default: return null
      }
    },
    
    chatWithContact(contact) {
      this.$router.push(`/contact-chat/${contact.id}`)
    },
    
    sendLinkedInMessage(contact) {
      this.toast.add({
        severity: 'info',
        summary: 'LinkedIn Message',
        detail: `Opening LinkedIn to message ${contact.name}`,
        life: 3000
      })
    },
    
    sendEmail(contact) {
      window.location.href = `mailto:${contact.email}?subject=Hello from Outbounder`
    },
    
    async enrichContact(contact) {
      contact.enriching = true
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        contact.enriched = true
        contact.enriching = false
        
        this.toast.add({
          severity: 'success',
          summary: 'Contact Enriched',
          detail: `${contact.name}'s profile has been enriched with additional data`,
          life: 3000
        })
      } catch (error) {
        contact.enriching = false
        this.toast.add({
          severity: 'error',
          summary: 'Enrichment Failed',
          detail: 'Failed to enrich contact profile',
          life: 3000
        })
      }
    },
    
    async enrichSelected() {
      if (!this.selectedContacts.length) return
      
      this.loading = true
      
      try {
        // Simulate batch enrichment
        await new Promise(resolve => setTimeout(resolve, 3000))
        
        this.selectedContacts.forEach(contact => {
          contact.enriched = true
        })
        
        this.toast.add({
          severity: 'success',
          summary: 'Batch Enrichment Complete',
          detail: `${this.selectedContacts.length} contacts have been enriched`,
          life: 3000
        })
        
        this.selectedContacts = []
      } catch (error) {
        this.toast.add({
          severity: 'error',
          summary: 'Enrichment Failed',
          detail: 'Failed to enrich selected contacts',
          life: 3000
        })
      } finally {
        this.loading = false
      }
    },
    
    onFileSelect(event) {
      // Handle CSV file selection
      console.log('File selected:', event.files[0])
    },
    
    async importContacts() {
      this.importing = true
      
      try {
        // Simulate import process
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        if (this.importMethod === 'manual') {
          const newContact = {
            id: Date.now(),
            ...this.newContact,
            status: 'Prospect',
            enriched: false,
            enriching: false
          }
          
          this.contacts.push(newContact)
          
          this.newContact = {
            name: '',
            email: '',
            company: '',
            title: ''
          }
          
          this.toast.add({
            severity: 'success',
            summary: 'Contact Added',
            detail: 'New contact has been added successfully',
            life: 3000
          })
        } else {
          // Simulate CSV import
          this.toast.add({
            severity: 'success',
            summary: 'Import Complete',
            detail: 'Contacts have been imported from CSV',
            life: 3000
          })
        }
        
        this.showImportDialog = false
      } catch (error) {
        this.toast.add({
          severity: 'error',
          summary: 'Import Failed',
          detail: 'Failed to import contacts',
          life: 3000
        })
      } finally {
        this.importing = false
      }
    }
  }
}
</script>

<style scoped>
.contacts-page {
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

.contacts-card {
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.search-input {
  width: 300px;
}

.status-filter {
  width: 200px;
}

.contact-name {
  display: flex;
  align-items: center;
  gap: 12px;
}

.contact-avatar {
  background: #667eea;
  color: white;
  font-weight: 600;
}

.email-link {
  color: #007ad9;
  text-decoration: none;
}

.email-link:hover {
  text-decoration: underline;
}

.contact-actions {
  display: flex;
  gap: 4px;
}

.import-dialog {
  padding: 20px 0;
}

.import-options h4 {
  margin: 0 0 16px 0;
  color: #1f2937;
}

.import-methods {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

.import-method-card {
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.import-method-card.selected {
  border-color: #007ad9;
  box-shadow: 0 0 0 1px #007ad9;
}

.import-method-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.method-content {
  text-align: center;
  padding: 20px;
}

.method-icon {
  font-size: 32px;
  color: #667eea;
  margin-bottom: 12px;
}

.method-content h5 {
  margin: 0 0 8px 0;
  color: #1f2937;
}

.method-content p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

.csv-upload {
  text-align: center;
}

.upload-hint {
  display: block;
  margin-top: 8px;
  color: #6b7280;
}

.manual-entry .field {
  margin-bottom: 16px;
}

.manual-entry label {
  display: block;
  margin-bottom: 4px;
  font-weight: 600;
  color: #374151;
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
  
  .table-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-input,
  .status-filter {
    width: 100%;
  }
  
  .import-methods {
    grid-template-columns: 1fr;
  }
}
</style>