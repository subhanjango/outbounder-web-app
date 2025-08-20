<template>
  <div class="card">
    <div class="flex align-items-center justify-content-between mb-4">
      <div>
        <h2 class="m-0 mb-1">Campaigns</h2>
        <div class="text-600">Manage and track your outreach campaigns</div>
      </div>
      <Button 
        icon="pi pi-plus" 
        label="New Campaign" 
        @click="goToPeople"
        severity="success"
      />
    </div>

    <!-- Campaign Stats -->
    <div class="grid mb-4">
      <div class="col-12 md:col-3">
        <div class="card border-1 border-200 p-3">
          <div class="flex align-items-center justify-content-between">
            <div>
              <div class="text-600 text-sm mb-1">Total Campaigns</div>
              <div class="text-2xl font-semibold text-900">{{ campaigns.length }}</div>
            </div>
            <div class="bg-blue-100 text-blue-700 border-round p-2">
              <i class="pi pi-chart-line text-xl"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 md:col-3">
        <div class="card border-1 border-200 p-3">
          <div class="flex align-items-center justify-content-between">
            <div>
              <div class="text-600 text-sm mb-1">Active</div>
              <div class="text-2xl font-semibold text-green-600">{{ activeCampaigns }}</div>
            </div>
            <div class="bg-green-100 text-green-700 border-round p-2">
              <i class="pi pi-play text-xl"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 md:col-3">
        <div class="card border-1 border-200 p-3">
          <div class="flex align-items-center justify-content-between">
            <div>
              <div class="text-600 text-sm mb-1">Completed</div>
              <div class="text-2xl font-semibold text-blue-600">{{ completedCampaigns }}</div>
            </div>
            <div class="bg-blue-100 text-blue-700 border-round p-2">
              <i class="pi pi-check-circle text-xl"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 md:col-3">
        <div class="card border-1 border-200 p-3">
          <div class="flex align-items-center justify-content-between">
            <div>
              <div class="text-600 text-sm mb-1">Total Contacts</div>
              <div class="text-2xl font-semibold text-purple-600">{{ totalContacts }}</div>
            </div>
            <div class="bg-purple-100 text-purple-700 border-round p-2">
              <i class="pi pi-users text-xl"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Campaigns Table -->
    <DataTable 
      :value="campaigns" 
      :paginator="true" 
      :rows="10" 
      :loading="loading"
      stripedRows
      responsiveLayout="scroll"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :rowsPerPageOptions="[5,10,25]"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords} campaigns"
      class="p-datatable-sm"
    >
      <template #empty>
        <div class="text-center p-4">
          <i class="pi pi-inbox text-4xl text-400 mb-3"></i>
          <div class="text-900 font-semibold mb-2">No campaigns found</div>
          <div class="text-600 mb-3">Create your first campaign to get started</div>
          <Button 
            label="Create Campaign" 
            icon="pi pi-plus" 
            @click="goToPeople"
            size="small"
          />
        </div>
      </template>

      <Column field="name" header="Campaign Name" sortable>
        <template #body="slotProps">
          <div class="flex align-items-center">
            <div class="flex align-items-center justify-content-center w-2rem h-2rem border-round mr-2"
                 :class="slotProps.data.type === 'email' ? 'bg-blue-100 text-blue-700' : 'bg-indigo-100 text-indigo-700'">
              <i :class="slotProps.data.type === 'email' ? 'pi pi-envelope' : 'pi pi-linkedin'" class="text-sm"></i>
            </div>
            <div>
              <div class="font-medium">{{ slotProps.data.name }}</div>
              <div class="text-600 text-sm">{{ slotProps.data.type === 'email' ? 'Email Campaign' : 'LinkedIn Campaign' }}</div>
            </div>
          </div>
        </template>
      </Column>

      <Column field="status" header="Status" sortable>
        <template #body="slotProps">
          <Tag 
            :value="slotProps.data.status" 
            :severity="getStatusSeverity(slotProps.data.status)"
            class="text-sm"
          />
        </template>
      </Column>

      <Column field="steps" header="Steps" sortable>
        <template #body="slotProps">
          <div class="flex align-items-center">
            <div class="font-medium">{{ slotProps.data.steps }}</div>
            <div class="text-600 ml-1">step{{ slotProps.data.steps > 1 ? 's' : '' }}</div>
          </div>
        </template>
      </Column>

      <Column field="contactsInSequence" header="In Sequence" sortable>
        <template #body="slotProps">
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-users text-green-600 mr-2"></i>
            <span class="font-medium">{{ getContactsInSequence(slotProps.data) }}</span>
          </div>
        </template>
      </Column>

      <Column field="contactsNotStarted" header="Not Started" sortable>
        <template #body="slotProps">
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-users text-900 mr-2"></i>
            <span class="font-medium">{{ getContactsNotStarted(slotProps.data) }}</span>
          </div>
        </template>
      </Column>

      <Column field="createdAt" header="Created" sortable>
        <template #body="slotProps">
          <div class="text-600">{{ formatDate(slotProps.data.createdAt) }}</div>
        </template>
      </Column>

      <Column field="performance" header="Performance">
        <template #body="slotProps">
          <div v-if="slotProps.data.status === 'Active' || slotProps.data.status === 'Completed'">
            <div class="flex align-items-center justify-content-center">
              <div class="text-center">
                <div class="text-lg font-medium text-900 mb-1">
                  {{ getTotalReplyRate(slotProps.data) }}%
                </div>
                <div class="text-600 text-sm">Reply Rate</div>
              </div>
            </div>
          </div>
          <div v-else class="text-600 text-sm text-center">Not started</div>
        </template>
      </Column>

      <Column header="Actions" :exportable="false">
        <template #body="slotProps">
          <div class="flex gap-2">
            <Button 
              icon="pi pi-eye" 
              size="small" 
              text 
              @click="viewCampaign(slotProps.data)"
              v-tooltip="'View Details'"
            />
            <Button 
              icon="pi pi-pencil" 
              size="small" 
              text 
              severity="info"
              @click="editCampaign(slotProps.data)"
              v-tooltip="'Edit Campaign'"
              :disabled="slotProps.data.status === 'Completed'"
            />
            <Button 
              icon="pi pi-trash" 
              size="small" 
              text 
              severity="danger"
              @click="deleteCampaign(slotProps.data)"
              v-tooltip="'Delete Campaign'"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Tag from 'primevue/tag'

export default {
  name: 'Campaigns',
  components: {
    DataTable,
    Column,
    Button,
    Tag
  },
  setup() {
    const router = useRouter()
    const toast = useToast()
    const campaigns = ref([])
    const loading = ref(false)

    // Computed stats
    const activeCampaigns = computed(() => 
      campaigns.value.filter(c => c.status === 'Active').length
    )
    
    const completedCampaigns = computed(() => 
      campaigns.value.filter(c => c.status === 'Completed').length
    )
    
    const totalContacts = computed(() => 
      campaigns.value.reduce((sum, c) => sum + c.contacts, 0)
    )

    const loadCampaigns = () => {
      loading.value = true
      
      // Load campaigns from localStorage
      const savedCampaigns = localStorage.getItem('outbounder-campaigns')
      if (savedCampaigns) {
        campaigns.value = JSON.parse(savedCampaigns)
      } else {
        // Sample campaigns for demonstration
        campaigns.value = [
          {
            id: 1,
            name: 'Q4 Product Launch',
            type: 'email',
            status: 'Active',
            steps: 3,
            contacts: 150,
            createdAt: new Date('2024-01-15'),
            performance: { sent: 150, opened: 89, replied: 23 }
          },
          {
            id: 2,
            name: 'LinkedIn Outreach - Tech Leaders',
            type: 'linkedin',
            status: 'Completed',
            steps: 2,
            contacts: 75,
            createdAt: new Date('2024-01-10'),
            performance: { 
              totalLeads: 75,
              leadsFinished: 68,
              leadsNotContacted: 7,
              connectionsSent: 75,
              connectionsAccepted: 52,
              messagesSent: 52,
              messagesReplied: 18
            }
          },
          {
            id: 3,
            name: 'Follow-up Campaign',
            type: 'email',
            status: 'Draft',
            steps: 1,
            contacts: 45,
            createdAt: new Date('2024-01-20'),
            performance: { sent: 0, opened: 0, replied: 0 }
          }
        ]
      }
      
      loading.value = false
    }

    const getStatusSeverity = (status) => {
      switch (status) {
        case 'Active': return 'success'
        case 'Completed': return 'info'
        case 'Draft': return 'warning'
        case 'Paused': return 'secondary'
        default: return 'secondary'
      }
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }

    const getOpenRate = (performance) => {
      if (performance.sent === 0) return 0
      return Math.round((performance.opened / performance.sent) * 100)
    }

    const getReplyRate = (performance) => {
      if (performance.sent === 0) return 0
      return Math.round((performance.replied / performance.sent) * 100)
    }

    const getLinkedInReplyRate = (performance) => {
      if (performance.messagesSent === 0) return 0
      return Math.round((performance.messagesReplied / performance.messagesSent) * 100)
    }

    const getConnectionRate = (performance) => {
      if (performance.connectionsSent === 0) return 0
      return Math.round((performance.connectionsAccepted / performance.connectionsSent) * 100)
    }

    const getTotalReplyRate = (campaign) => {
      if (campaign.type === 'email') {
        return getReplyRate(campaign.performance)
      } else if (campaign.type === 'linkedin') {
        return getLinkedInReplyRate(campaign.performance)
      }
      return 0
    }

    const getContactsInSequence = (campaign) => {
      if (campaign.status === 'Draft') {
        return 0
      }
      
      if (campaign.type === 'linkedin' && campaign.performance.totalLeads) {
        // For LinkedIn: total leads minus those not contacted
        return campaign.performance.totalLeads - campaign.performance.leadsNotContacted
      } else if (campaign.type === 'email' && campaign.performance.sent) {
        // For Email: all sent emails are considered "in sequence"
        return campaign.performance.sent
      }
      
      return campaign.contacts || 0
    }

    const getContactsNotStarted = (campaign) => {
      if (campaign.status === 'Draft') {
        return campaign.contacts || 0
      }
      
      if (campaign.type === 'linkedin' && campaign.performance.leadsNotContacted !== undefined) {
        return campaign.performance.leadsNotContacted
      } else if (campaign.type === 'email') {
        // For email campaigns, assume all contacts are started once campaign is active
        return 0
      }
      
      return 0
    }

    const goToPeople = () => {
      router.push('/people')
    }

    const viewCampaign = (campaign) => {
      toast.add({
        severity: 'info',
        summary: 'View Campaign',
        detail: `Viewing details for "${campaign.name}"`,
        life: 3000
      })
    }

    const editCampaign = (campaign) => {
      toast.add({
        severity: 'info',
        summary: 'Edit Campaign',
        detail: `Editing "${campaign.name}"`,
        life: 3000
      })
    }

    const deleteCampaign = (campaign) => {
      if (confirm(`Are you sure you want to delete "${campaign.name}"?`)) {
        campaigns.value = campaigns.value.filter(c => c.id !== campaign.id)
        
        // Save to localStorage
        localStorage.setItem('outbounder-campaigns', JSON.stringify(campaigns.value))
        
        toast.add({
          severity: 'success',
          summary: 'Campaign Deleted',
          detail: `"${campaign.name}" has been deleted`,
          life: 3000
        })
      }
    }

    onMounted(() => {
      loadCampaigns()
    })

    return {
      campaigns,
      loading,
      activeCampaigns,
      completedCampaigns,
      totalContacts,
      getStatusSeverity,
      formatDate,
      getOpenRate,
      getReplyRate,
      getLinkedInReplyRate,
      getConnectionRate,
      getTotalReplyRate,
      getContactsInSequence,
      getContactsNotStarted,
      goToPeople,
      viewCampaign,
      editCampaign,
      deleteCampaign
    }
  }
}
</script>




