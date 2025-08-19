<template>
  <div class="flex flex-column gap-4">
        <!-- Filter Info -->
    <div v-if="$route.query.filter" class="card">
      <div class="flex align-items-center justify-content-between">
        <div class="flex align-items-center gap-2">
          <i class="pi pi-filter text-primary"></i>
          <span class="font-medium">
            Showing people from selected companies: 
            <strong>{{ $route.query.filter.replace(/,/g, ', ') }}</strong>
          </span>
        </div>
        <Button 
          label="Clear Filter" 
          icon="pi pi-times" 
          text 
          size="small"
          @click="clearFilter"
        />
      </div>
    </div>

    <!-- Header Actions -->
    <div class="flex flex-column md:flex-row gap-3 md:align-items-center md:justify-content-between">
      <div class="flex flex-column md:flex-row gap-3 flex-1">
        <div class="flex-1" style="max-width: 400px">
          <InputText 
            v-model="searchQuery" 
            placeholder="Search contacts..." 
            class="w-full"
          />
        </div>
      </div>
      
      <div class="flex gap-2">
        <Button 
          label="Delete Selected" 
          icon="pi pi-trash" 
          severity="danger" 
          outlined
          @click="deleteSelected" 
          :disabled="!selectedContacts || selectedContacts.length === 0"
        />
        <Button 
          label="View Companies" 
          icon="pi pi-building" 
          outlined 
          @click="viewSelectedCompanies"
          :disabled="!selectedContacts || selectedContacts.length === 0"
        />
        <Button label="Create Campaign" icon="pi pi-megaphone" outlined />
        <Button label="Add Contacts" icon="pi pi-plus" @click="showAddContactsDialog = true" />
      </div>
    </div>

    <!-- Contacts Table -->
    <div class="card">
      <DataTable 
        :value="filteredContacts" 
        :paginator="true" 
        :rows="10"
        :loading="loading"
        responsiveLayout="scroll"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[10,25,50]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} contacts"
        selectionMode="multiple" 
        v-model:selection="selectedContacts"
        :metaKeySelection="false"
      >
        <template #empty>
          <div class="text-center p-4">
            <i class="pi pi-users text-4xl text-400 mb-3" />
            <div class="text-900 font-medium mb-2">No contacts found</div>
            <div class="text-600">Try adjusting your search or add some contacts to get started</div>
          </div>
        </template>
        
        <template #loading>
          <div class="text-center p-4">
            <i class="pi pi-spin pi-spinner text-2xl" />
            <div class="mt-2">Loading contacts...</div>
          </div>
        </template>

        <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
        
        <Column field="firstName" header="First Name" :sortable="true">
          <template #body="slotProps">
            <span class="font-medium">{{ slotProps.data.firstName }}</span>
          </template>
        </Column>

        <Column field="lastName" header="Last Name" :sortable="true">
          <template #body="slotProps">
            <span class="font-medium">{{ slotProps.data.lastName }}</span>
          </template>
        </Column>

        <Column field="title" header="Title" :sortable="true">
          <template #body="slotProps">
            <span>{{ slotProps.data.title || '-' }}</span>
          </template>
        </Column>

        <Column field="company" header="Company" :sortable="true">
          <template #body="slotProps">
            <div class="flex align-items-center gap-2">
              <img 
                :src="getCompanyLogoUrl(slotProps.data.company)" 
                :alt="slotProps.data.company"
                class="w-2rem h-2rem border-round"
                style="object-fit: contain"
                @error="$event.target.style.display='none'"
              />
              <span class="font-medium">{{ slotProps.data.company || '-' }}</span>
            </div>
          </template>
        </Column>

        <Column field="status" header="Status" :sortable="true" style="min-width: 120px">
          <template #body="slotProps">
            <Tag 
              :value="slotProps.data.status" 
              :severity="getStatusSeverity(slotProps.data.status)"
              class="font-medium"
            />
          </template>
        </Column>

        <Column header="Contact Info" style="width: 12rem">
          <template #body="slotProps">
            <div class="flex gap-1">
              <Button 
                v-if="slotProps.data.phone"
                icon="pi pi-phone" 
                size="small" 
                text 
                rounded
                severity="success"
                @click="callContact(slotProps.data)" 
                v-tooltip="'Call: ' + slotProps.data.phone" 
              />
              <Button 
                v-if="slotProps.data.email"
                icon="pi pi-envelope" 
                size="small" 
                text 
                rounded
                severity="info"
                @click="emailContact(slotProps.data)" 
                v-tooltip="'Email: ' + slotProps.data.email" 
              />
              <Button 
                v-if="slotProps.data.linkedin"
                icon="pi pi-linkedin" 
                size="small" 
                text 
                rounded
                severity="help"
                @click="openLinkedIn(slotProps.data)" 
                v-tooltip="'LinkedIn Profile'" 
              />
            </div>
          </template>
        </Column>

        <Column header="Actions" style="width: 8rem">
          <template #body="slotProps">
            <div class="flex gap-1">
              <Button icon="pi pi-eye" size="small" text @click="viewContact(slotProps.data)" v-tooltip="'View'" />
              <Button icon="pi pi-pencil" size="small" text @click="editContact(slotProps.data)" v-tooltip="'Edit'" />
              <Button icon="pi pi-trash" size="small" text severity="danger" @click="deleteContact(slotProps.data)" v-tooltip="'Delete'" />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Bulk Actions -->
    <div v-if="selectedContacts.length > 0" class="card">
      <div class="flex align-items-center justify-content-between">
        <span class="font-medium">{{ selectedContacts.length }} contacts selected</span>
        <div class="flex gap-2">
          <Button icon="pi pi-envelope" label="Send Email" size="small" />
          <Button icon="pi pi-tag" label="Add Tag" size="small" outlined />
          <Button icon="pi pi-download" label="Export" size="small" outlined />
          <Button icon="pi pi-trash" label="Delete" size="small" severity="danger" outlined />
        </div>
      </div>
    </div>
      </div>

  <!-- Add Contacts Dialog -->
  <Dialog v-model:visible="showAddContactsDialog" modal header="Add Contacts" :style="{width: '500px'}">
    <div class="flex flex-column gap-4">
      <!-- Method Selection -->
      <div v-if="!selectedAddMethod">
        <p class="mb-3">Choose how you'd like to add contacts:</p>
        
        <div class="flex flex-column gap-3">
          <div class="p-3 border-1 surface-border border-round cursor-pointer hover:surface-hover" 
               @click="selectAddMethod('single')">
            <div class="flex align-items-center gap-3">
              <i class="pi pi-user-plus text-xl text-primary"></i>
              <div>
                <div class="font-medium mb-1">Add single contact</div>
                <div class="text-sm text-600">Create a new contact manually</div>
              </div>
            </div>
          </div>
          
          <div class="p-3 border-1 surface-border border-round cursor-pointer hover:surface-hover"
               @click="selectAddMethod('csv')">
            <div class="flex align-items-center gap-3">
              <i class="pi pi-upload text-xl text-primary"></i>
              <div>
                <div class="font-medium mb-1">Import from CSV</div>
                <div class="text-sm text-600">Upload a CSV file with contact information</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Single Contact Form -->
      <div v-if="selectedAddMethod === 'single'">
        <div class="flex align-items-center gap-2 mb-3">
          <Button icon="pi pi-arrow-left" text @click="resetMethodSelection" size="small" />
          <span class="font-medium">Add single contact</span>
        </div>
        
        <div class="flex flex-column gap-3">
          <div class="grid">
            <div class="col-6">
              <div class="field">
                <label for="quickContactFirstName" class="block font-medium mb-2">First Name *</label>
                <InputText id="quickContactFirstName" v-model="quickContactForm.firstName" class="w-full" />
              </div>
            </div>
            <div class="col-6">
              <div class="field">
                <label for="quickContactLastName" class="block font-medium mb-2">Last Name *</label>
                <InputText id="quickContactLastName" v-model="quickContactForm.lastName" class="w-full" />
              </div>
            </div>
          </div>
          
          <div class="field">
            <label for="quickContactEmail" class="block font-medium mb-2">Email</label>
            <InputText id="quickContactEmail" v-model="quickContactForm.email" type="email" class="w-full" />
          </div>
          
          <div class="field">
            <label for="quickContactCompany" class="block font-medium mb-2">Company</label>
            <InputText id="quickContactCompany" v-model="quickContactForm.company" class="w-full" />
          </div>
          
          <div class="field">
            <label for="quickContactStatus" class="block font-medium mb-2">Status</label>
            <Dropdown 
              id="quickContactStatus" 
              v-model="quickContactForm.status" 
              :options="statusOptions" 
              placeholder="Select Status"
              class="w-full" 
            />
          </div>
        </div>
      </div>
      
      <!-- CSV Import Area -->
      <div v-if="selectedAddMethod === 'csv'">
        <div class="flex align-items-center gap-2 mb-3">
          <Button icon="pi pi-arrow-left" text @click="resetMethodSelection" size="small" />
          <span class="font-medium">Import from CSV</span>
        </div>
        
        <div class="text-600 mb-3">
          Upload a CSV file with contact information. The file should include columns for first name, last name, email, title, company, phone, etc.
        </div>
        
        <FileUpload 
          mode="basic" 
          name="csvFile" 
          :auto="false" 
          accept=".csv" 
          :maxFileSize="1000000"
          @select="onFileSelect"
          chooseLabel="Choose CSV File"
        />
        
        <div v-if="importPreview.length > 0" class="mt-3">
          <div class="font-medium mb-2">Preview (first 5 rows):</div>
          <div class="border-1 border-300 border-round p-2 text-sm">
            <div v-for="(row, index) in importPreview.slice(0, 5)" :key="index" class="mb-1">
              {{ JSON.stringify(row) }}
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <template #footer>
      <Button label="Cancel" text @click="cancelAddContacts" />
      <Button v-if="selectedAddMethod === 'single'" 
              label="Add Contact" 
              @click="addSingleContact" 
              :disabled="!quickContactForm.firstName || !quickContactForm.lastName" />
      <Button v-if="selectedAddMethod === 'csv'" 
              label="Import Contacts" 
              @click="importContacts" 
              :disabled="importPreview.length === 0" />
    </template>
  </Dialog>

  <!-- Add/Edit Contact Dialog -->
  <Dialog v-model:visible="showAddDialog" :header="editingContact ? 'Edit Contact' : 'Add New Contact'" :style="{width: '500px'}" modal>
    <div class="flex flex-column gap-3">
      <div class="grid">
        <div class="col-6">
          <div class="field">
            <label for="contactFirstName" class="block font-medium mb-2">First Name *</label>
            <InputText id="contactFirstName" v-model="contactForm.firstName" class="w-full" />
          </div>
        </div>
        <div class="col-6">
          <div class="field">
            <label for="contactLastName" class="block font-medium mb-2">Last Name *</label>
            <InputText id="contactLastName" v-model="contactForm.lastName" class="w-full" />
          </div>
        </div>
      </div>
      
      <div class="field">
        <label for="contactTitle" class="block font-medium mb-2">Job Title</label>
        <InputText id="contactTitle" v-model="contactForm.title" class="w-full" />
      </div>
      
      <div class="field">
        <label for="contactCompany" class="block font-medium mb-2">Company</label>
        <InputText id="contactCompany" v-model="contactForm.company" class="w-full" />
      </div>
      
      <div class="field">
        <label for="contactStatus" class="block font-medium mb-2">Status</label>
        <Dropdown 
          id="contactStatus" 
          v-model="contactForm.status" 
          :options="statusOptions" 
          placeholder="Select Status"
          class="w-full" 
        />
      </div>
      
      <div class="field">
        <label for="contactEmail" class="block font-medium mb-2">Email</label>
        <InputText id="contactEmail" v-model="contactForm.email" type="email" class="w-full" />
      </div>
      
      <div class="field">
        <label for="contactPhone" class="block font-medium mb-2">Phone</label>
        <InputText id="contactPhone" v-model="contactForm.phone" class="w-full" />
      </div>
      
      <div class="field">
        <label for="contactLinkedIn" class="block font-medium mb-2">LinkedIn Profile</label>
        <InputText id="contactLinkedIn" v-model="contactForm.linkedin" placeholder="https://linkedin.com/in/username" class="w-full" />
      </div>
    </div>
    
    <template #footer>
      <Button label="Cancel" text @click="closeAddDialog" />
      <Button label="Save" @click="saveContact" />
    </template>
  </Dialog>

  <!-- Import CSV Dialog -->
  <Dialog v-model:visible="showImportDialog" header="Import Contacts from CSV" :style="{width: '600px'}" modal>
    <div class="flex flex-column gap-4">
      <div class="text-600">
        Upload a CSV file with contact information. The file should include columns for name, email, title, company, phone, etc.
      </div>
      
      <FileUpload 
        mode="basic" 
        name="csvFile" 
        :auto="false" 
        accept=".csv" 
        :maxFileSize="1000000"
        @select="onFileSelect"
        chooseLabel="Choose CSV File"
      />
      
      <div v-if="importPreview.length > 0" class="mt-3">
        <div class="font-medium mb-2">Preview (first 5 rows):</div>
        <div class="border-1 border-300 border-round p-2 text-sm">
          <div v-for="(row, index) in importPreview.slice(0, 5)" :key="index" class="mb-1">
            {{ JSON.stringify(row) }}
          </div>
        </div>
      </div>
    </div>
    
    <template #footer>
      <Button label="Cancel" text @click="showImportDialog = false" />
      <Button label="Import" @click="importContacts" :disabled="importPreview.length === 0" />
    </template>
  </Dialog>

  <Toast />
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Dialog from 'primevue/dialog'
import Avatar from 'primevue/avatar'
import Badge from 'primevue/badge'
import Tag from 'primevue/tag'
import FileUpload from 'primevue/fileupload'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'

export default {
  name: 'People',
  components: {
    DataTable, Column, Button, InputText, Dropdown, Dialog, 
    Avatar, Badge, Tag, FileUpload, Toast
  },
  setup() {
    const toast = useToast()
    const router = useRouter()
    
    // Reactive data
    const contacts = ref([])
    const selectedContacts = ref([])
    const searchQuery = ref('')
    const selectedStatus = ref(null)
    const selectedSource = ref(null)
    const loading = ref(false)
    const showAddDialog = ref(false)
    const showImportDialog = ref(false)
    const showAddContactsDialog = ref(false)
    const selectedAddMethod = ref(null)
    const editingContact = ref(null)
    const importPreview = ref([])
    
    // Form data
    const contactForm = ref({
      firstName: '',
      lastName: '',
      email: '',
      title: '',
      company: '',
      status: '',
      phone: '',
      linkedin: ''
    })
    
    // Quick contact form for the dialog
    const quickContactForm = ref({
      firstName: '',
      lastName: '',
      email: '',
      company: '',
      status: 'New'
    })
    
    // Options for dropdowns
    const statusOptions = [
      { label: 'Replied', value: 'Replied' },
      { label: 'Contacted', value: 'Contacted' },
      { label: 'New', value: 'New' }
    ]
    
    const sourceOptions = [
      { label: 'Manual', value: 'Manual' },
      { label: 'LinkedIn', value: 'LinkedIn' },
      { label: 'Website', value: 'Website' },
      { label: 'Referral', value: 'Referral' },
      { label: 'Email Campaign', value: 'Email Campaign' },
      { label: 'Trade Show', value: 'Trade Show' },
      { label: 'Cold Outreach', value: 'Cold Outreach' },
      { label: 'Import', value: 'Import' }
    ]
    

    
    // Sample data
    const sampleContacts = [
      {
        id: 1,
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah@clay.com',
        title: 'VP of Sales',
        company: 'Clay',
        status: 'Replied',
        phone: '+1 (555) 123-4567',
        linkedin: 'https://linkedin.com/in/sarah-johnson-sales',
        createdAt: '2024-01-10'
      },
      {
        id: 2,
        firstName: 'Michael',
        lastName: 'Chen',
        email: 'mchen@hightouch.com',
        title: 'CTO',
        company: 'Hightouch',
        status: 'Contacted',
        phone: '+1 (555) 234-5678',
        linkedin: 'https://linkedin.com/in/michael-chen-cto',
        createdAt: '2024-01-08'
      },
      {
        id: 3,
        firstName: 'Emily',
        lastName: 'Rodriguez',
        email: 'emily@baremetrics.com',
        title: 'Director of Operations',
        company: 'Baremetrics',
        status: 'New',
        phone: '+1 (555) 345-6789',
        linkedin: 'https://linkedin.com/in/emily-rodriguez-ops',
        createdAt: '2024-01-05'
      },
      {
        id: 4,
        firstName: 'David',
        lastName: 'Kim',
        email: 'david@chartmogul.com',
        title: 'Founder & CEO',
        company: 'ChartMogul',
        status: 'Replied',
        phone: '+1 (555) 456-7890',
        linkedin: 'https://linkedin.com/in/david-kim-startup',
        createdAt: '2024-01-20'
      },
      {
        id: 5,
        firstName: 'Lisa',
        lastName: 'Thompson',
        email: 'lisa@metronome.com',
        title: 'Head of Marketing',
        company: 'Metronome',
        status: 'Contacted',
        phone: '+1 (555) 567-8901',
        linkedin: 'https://linkedin.com/in/lisa-thompson-marketing',
        createdAt: '2024-01-12'
      },
      {
        id: 6,
        firstName: 'Robert',
        lastName: 'Wilson',
        email: 'robert@graphite.dev',
        title: 'Product Manager',
        company: 'Graphite',
        status: 'New',
        phone: '+1 (555) 678-9012',
        linkedin: 'https://linkedin.com/in/robert-wilson-pm',
        createdAt: '2024-01-01'
      }
    ]
    
    // Computed properties
    const filteredContacts = computed(() => {
      let filtered = contacts.value
      
      // Apply filter from query parameter if present (from selected companies)
      if (router.currentRoute.value.query.filter) {
        const filterCompanies = router.currentRoute.value.query.filter.split(',')
        filtered = filtered.filter(contact => 
          contact.company && filterCompanies.includes(contact.company)
        )
      }
      
      // Search filter
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(contact => 
          contact.firstName.toLowerCase().includes(query) ||
          contact.lastName.toLowerCase().includes(query) ||
          (contact.email && contact.email.toLowerCase().includes(query)) ||
          (contact.company && contact.company.toLowerCase().includes(query)) ||
          (contact.title && contact.title.toLowerCase().includes(query)) ||
          (contact.status && contact.status.toLowerCase().includes(query))
        )
      }
      
      return filtered
    })
    
    // Helper functions
    const getInitials = (firstName, lastName) => {
      const first = firstName ? firstName[0] : ''
      const last = lastName ? lastName[0] : ''
      return (first + last).toUpperCase()
    }
    
    const getAvatarColor = (name) => {
      const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F']
      const index = name.length % colors.length
      return colors[index]
    }
    
    const getCompanyLogoUrl = (companyName) => {
      if (!companyName) return ''
      
      // Map company names to their domains for logo lookup
      const companyDomainMap = {
        'Clay': 'clay.com',
        'Hightouch': 'hightouch.com',
        'Baremetrics': 'baremetrics.com',
        'ChartMogul': 'chartmogul.com',
        'Metronome': 'metronome.com',
        'Graphite': 'graphite.dev',
        'Casechek': 'casechek.com',

        'Fueloyal': 'fueloyal.com',
        'BookingKoala': 'bookingkoala.com',
        'Stainless': 'stainless.com',
        'Cohesive Networks': 'cohesive.net',
        'Connamara Systems': 'connamara.com',
        'Applied Pathways': 'appliedpathways.com',
        'Branchfire': 'folia.com',
        'Callibra': 'discharge123.com',
        'Govly': 'govly.com',
        'FastModel Sports': 'fastmodelsports.com',
        'Eventric': 'eventric.com',
        'Bridge Financial Technology': 'bridgeft.com'
      }
      
      const domain = companyDomainMap[companyName] || companyName.toLowerCase().replace(/\s+/g, '') + '.com'
      return `https://logo.clearbit.com/${domain}`
    }
    
    const getStatusSeverity = (status) => {
      const severityMap = {
        'Replied': 'success',
        'Contacted': 'info', 
        'New': 'secondary'
      }
      return severityMap[status] || 'secondary'
    }
    
    const getSourceIcon = (source) => {
      const iconMap = {
        'LinkedIn': 'pi-linkedin',
        'Website': 'pi-globe',
        'Referral': 'pi-users',
        'Email Campaign': 'pi-envelope',
        'Trade Show': 'pi-calendar',
        'Cold Outreach': 'pi-phone',
        'Manual': 'pi-pencil',
        'Import': 'pi-upload'
      }
      return iconMap[source] || 'pi-circle'
    }
    
    const formatDate = (dateString) => {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
    }
    
    // Contact management functions
    const resetForm = () => {
      contactForm.value = {
        firstName: '',
        lastName: '',
        email: '',
        title: '',
        company: '',
        status: '',
        phone: '',
        linkedin: ''
      }
      editingContact.value = null
    }
    
    const closeAddDialog = () => {
      showAddDialog.value = false
      resetForm()
    }
    
    const saveContact = () => {
      if (!contactForm.value.firstName || !contactForm.value.lastName) {
        toast.add({ severity: 'error', summary: 'Validation Error', detail: 'First name and last name are required' })
        return
      }
      
      if (editingContact.value) {
        // Update existing contact
        const index = contacts.value.findIndex(c => c.id === editingContact.value.id)
        if (index !== -1) {
          contacts.value[index] = {
            ...contacts.value[index],
            ...contactForm.value,
            updatedAt: new Date().toISOString()
          }
          toast.add({ severity: 'success', summary: 'Success', detail: 'Contact updated successfully' })
        }
      } else {
        // Add new contact
        const newContact = {
          id: Date.now(),
          ...contactForm.value,
          createdAt: new Date().toISOString()
        }
        contacts.value.push(newContact)
        toast.add({ severity: 'success', summary: 'Success', detail: 'Contact added successfully' })
      }
      
      closeAddDialog()
    }
    
    const editContact = (contact) => {
      editingContact.value = contact
      contactForm.value = { ...contact }
      showAddDialog.value = true
    }
    
    const viewContact = (contact) => {
      toast.add({ severity: 'info', summary: 'Contact Details', detail: `Viewing ${contact.firstName} ${contact.lastName}` })
    }
    
    const emailContact = (contact) => {
      if (contact.email) {
        window.open(`mailto:${contact.email}`)
      }
    }
    
    const callContact = (contact) => {
      if (contact.phone) {
        window.open(`tel:${contact.phone}`)
        toast.add({ severity: 'info', summary: 'Calling', detail: `Calling ${contact.firstName} at ${contact.phone}` })
      }
    }
    
    const openLinkedIn = (contact) => {
      if (contact.linkedin) {
        window.open(contact.linkedin, '_blank')
        toast.add({ severity: 'info', summary: 'LinkedIn', detail: `Opening LinkedIn profile for ${contact.firstName}` })
      }
    }
    
    const deleteContact = (contact) => {
      if (confirm(`Are you sure you want to delete ${contact.firstName} ${contact.lastName}?`)) {
        const index = contacts.value.findIndex(c => c.id === contact.id)
        if (index !== -1) {
          contacts.value.splice(index, 1)
          toast.add({ severity: 'success', summary: 'Success', detail: 'Contact deleted successfully' })
        }
      }
    }
    
    const deleteSelected = () => {
      if (!selectedContacts.value || selectedContacts.value.length === 0) {
        return
      }
      
      const count = selectedContacts.value.length
      const contactNames = selectedContacts.value.map(contact => `${contact.firstName} ${contact.lastName}`).join(', ')
      
      // Show confirmation dialog
      const confirmed = confirm(
        `Are you sure you want to delete ${count} selected contact${count > 1 ? 's' : ''}?\n\n${contactNames}`
      )
      
      if (confirmed) {
        // Remove selected contacts from the contacts array
        contacts.value = contacts.value.filter(contact => {
          return !selectedContacts.value.find(selected => selected.id === contact.id)
        })
        
        // Clear selection
        selectedContacts.value = []
        
        // Show success message
        toast.add({
          severity: 'success',
          summary: 'Contacts Deleted',
          detail: `Successfully deleted ${count} contact${count > 1 ? 's' : ''}`,
          life: 3000
        })
      }
    }
    
    const viewSelectedCompanies = () => {
      if (!selectedContacts.value || selectedContacts.value.length === 0) {
        return
      }
      
      // Get unique company names from selected contacts
      const companyNames = [...new Set(
        selectedContacts.value
          .map(contact => contact.company)
          .filter(company => company && company.trim() !== '')
      )]
      
      if (companyNames.length === 0) {
        toast.add({
          severity: 'warn',
          summary: 'No Companies',
          detail: 'Selected contacts do not have any companies assigned',
          life: 3000
        })
        return
      }
      
      // Navigate to companies page with filter
      router.push({
        name: 'Company',
        query: { filter: companyNames.join(',') }
      })
      
      toast.add({
        severity: 'info',
        summary: 'Viewing Companies',
        detail: `Showing ${companyNames.length} company${companyNames.length > 1 ? 'ies' : ''} from selected contacts`,
        life: 3000
      })
    }
    
    const selectAddMethod = (method) => {
      selectedAddMethod.value = method
    }
    
    const resetMethodSelection = () => {
      selectedAddMethod.value = null
      quickContactForm.value = {
        firstName: '',
        lastName: '',
        email: '',
        company: ''
      }
      importPreview.value = []
    }
    
    const cancelAddContacts = () => {
      showAddContactsDialog.value = false
      selectedAddMethod.value = null
      quickContactForm.value = {
        firstName: '',
        lastName: '',
        email: '',
        company: '',
        status: 'New'
      }
      importPreview.value = []
    }
    
    const addSingleContact = () => {
      if (!quickContactForm.value.firstName || !quickContactForm.value.lastName) {
        toast.add({ severity: 'error', summary: 'Validation Error', detail: 'First name and last name are required' })
        return
      }
      
      // Add new contact
      const newContact = {
        id: Date.now(),
        firstName: quickContactForm.value.firstName,
        lastName: quickContactForm.value.lastName,
        email: quickContactForm.value.email || '',
        title: '',
        company: quickContactForm.value.company || '',
        status: quickContactForm.value.status || 'New',
        phone: '',
        linkedin: '',
        createdAt: new Date().toISOString()
      }
      
      contacts.value.push(newContact)
      toast.add({ severity: 'success', summary: 'Success', detail: 'Contact added successfully' })
      
      cancelAddContacts()
    }
    
    // CSV Import functions
    const onFileSelect = (event) => {
      const file = event.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const csv = e.target.result
          parseCSV(csv)
        }
        reader.readAsText(file)
      }
    }
    
    const parseCSV = (csv) => {
      const lines = csv.split('\n')
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
      const data = []
      
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
          const values = lines[i].split(',')
          const row = {}
          headers.forEach((header, index) => {
            row[header] = values[index] ? values[index].trim() : ''
          })
          data.push(row)
        }
      }
      
      importPreview.value = data
    }
    
    const importContacts = () => {
      const imported = importPreview.value.map(row => {
        // Handle different name formats
        let firstName = row['first name'] || row.firstname || ''
        let lastName = row['last name'] || row.lastname || ''
        
        // If we have a full name field, try to split it
        if (!firstName && !lastName && row.name) {
          const nameParts = row.name.trim().split(' ')
          firstName = nameParts[0] || ''
          lastName = nameParts.slice(1).join(' ') || ''
        }
        
        return {
          id: Date.now() + Math.random(),
          firstName,
          lastName,
          email: row.email || row['email address'] || '',
          title: row.title || row.position || row['job title'] || '',
          company: row.company || row.organization || '',
          status: row.status || 'New',
          phone: row.phone || row['phone number'] || '',
          linkedin: row.linkedin || row['linkedin profile'] || '',
          createdAt: new Date().toISOString()
        }
      }).filter(contact => contact.firstName && contact.lastName)
      
      contacts.value.push(...imported)
      toast.add({ 
        severity: 'success', 
        summary: 'Import Complete', 
        detail: `Successfully imported ${imported.length} contacts` 
      })
      
      cancelAddContacts()
    }
    
    const clearFilter = () => {
      router.push({ name: 'People' })
    }
    
    // Initialize data
    onMounted(() => {
      contacts.value = [...sampleContacts]
    })
    
    return {
      // Data
      contacts,
      selectedContacts,
      searchQuery,
      selectedStatus,
      selectedSource,
      loading,
      showAddDialog,
      showImportDialog,
      showAddContactsDialog,
      selectedAddMethod,
      editingContact,
      importPreview,
      contactForm,
      quickContactForm,
      statusOptions,
      sourceOptions,
      
      // Computed
      filteredContacts,
      
      // Methods
      getInitials,
      getAvatarColor,
      getCompanyLogoUrl,
      getStatusSeverity,
      getSourceIcon,
      formatDate,
      closeAddDialog,
      saveContact,
      editContact,
      viewContact,
      emailContact,
      callContact,
      openLinkedIn,
      deleteContact,
      deleteSelected,
      viewSelectedCompanies,
      selectAddMethod,
      resetMethodSelection,
      cancelAddContacts,
      addSingleContact,
      onFileSelect,
      importContacts,
      clearFilter
    }
  }
}
</script>


