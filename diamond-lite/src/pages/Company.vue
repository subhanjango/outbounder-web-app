<template>
  <div class="flex flex-column gap-4">
    <!-- Header Actions -->
    <div class="flex flex-column md:flex-row gap-3 md:align-items-center md:justify-content-between">
      <div class="flex flex-column md:flex-row gap-3 flex-1">
        <div class="flex-1" style="max-width: 400px">
          <InputText 
            v-model="searchValue" 
            placeholder="Search companies..." 
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
          :disabled="!selectedCompanies || selectedCompanies.length === 0"
        />
        <Button 
          label="View People" 
          icon="pi pi-users" 
          outlined 
          @click="viewSelectedPeople"
          :disabled="!selectedCompanies || selectedCompanies.length === 0"
        />
        <Button label="Create AI Column" icon="pi pi-plus" outlined @click="showCreateAIColumnDialog = true" />
        <Button label="Create Campaign" icon="pi pi-megaphone" outlined />
        <Button label="Add Companies" icon="pi pi-plus" @click="showAddCompaniesDialog = true" />
      </div>
    </div>

    <!-- Add Companies Dialog -->
    <Dialog v-model:visible="showAddCompaniesDialog" modal header="Add Companies" :style="{width: '500px'}">
      <div class="flex flex-column gap-4">
        <!-- Method Selection -->
        <div v-if="!selectedAddMethod">
          <p class="mb-3">Choose how you'd like to add companies:</p>
          
          <div class="flex flex-column gap-3">
            <div class="p-3 border-1 surface-border border-round cursor-pointer hover:surface-hover" 
                 @click="selectAddMethod('domains')">
              <div class="flex align-items-center gap-3">
                <i class="pi pi-link text-xl text-primary"></i>
                <div>
                  <div class="font-medium mb-1">Paste in domains</div>
                  <div class="text-sm text-600">Enter company domains separated by commas or new lines</div>
                </div>
              </div>
            </div>
            
            <div class="p-3 border-1 surface-border border-round cursor-pointer hover:surface-hover"
                 @click="selectAddMethod('csv')">
              <div class="flex align-items-center gap-3">
                <i class="pi pi-upload text-xl text-primary"></i>
                <div>
                  <div class="font-medium mb-1">Upload a CSV</div>
                  <div class="text-sm text-600">Upload a CSV file with company information</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Domain Input Area -->
        <div v-if="selectedAddMethod === 'domains'">
          <div class="flex align-items-center gap-2 mb-3">
            <Button icon="pi pi-arrow-left" text @click="resetMethodSelection" size="small" />
            <span class="font-medium">Paste in domains</span>
          </div>
          
          <label class="block text-sm font-medium mb-2">Company Domains</label>
          <Textarea 
            v-model="domainInput" 
            placeholder="example.com, company2.com, company3.com"
            :rows="6"
            class="w-full"
            :autoResize="true"
          />
          <small class="text-600">Enter one domain per line or separate with commas</small>
        </div>
        
        <!-- CSV Upload Area -->
        <div v-if="selectedAddMethod === 'csv'">
          <div class="flex align-items-center gap-2 mb-3">
            <Button icon="pi pi-arrow-left" text @click="resetMethodSelection" size="small" />
            <span class="font-medium">Upload a CSV</span>
          </div>
          
          <div class="flex flex-column gap-3">
            <div>
              <label class="block text-sm font-medium mb-2">CSV File</label>
              <input 
                type="file" 
                accept=".csv" 
                @change="handleFileUpload"
                ref="fileInput"
                class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <small class="text-600 mt-1 block">Upload a CSV file with company data</small>
            </div>
            
            <!-- Column Mapping (shown after file is selected) -->
            <div v-if="csvHeaders.length > 0" class="border-1 surface-border border-round p-3">
              <h4 class="mt-0 mb-3">Map CSV Columns</h4>
              
              <div class="flex flex-column gap-3">
                <div>
                  <label class="block text-sm font-medium mb-2">
                    Website Column <span class="text-red-500">*</span>
                  </label>
                  <Dropdown 
                    v-model="selectedWebsiteColumn" 
                    :options="csvHeaders"
                    placeholder="Select website column"
                    class="w-full"
                  />
                  <small class="text-600">Required: Column containing website domains</small>
                </div>
                
                <div class="text-sm text-600 p-3 surface-100 border-round">
                  <i class="pi pi-info-circle mr-2"></i>
                  Company names and other data will be automatically generated from the website domains.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <template #footer>
        <Button label="Cancel" text @click="cancelAddCompanies" />
        <Button v-if="selectedAddMethod === 'domains'" 
                label="Add Companies" 
                @click="addCompanies" 
                :disabled="!domainInput.trim()" />
        <Button v-if="selectedAddMethod === 'csv'" 
                label="Add Companies" 
                @click="addCompanies" 
                :disabled="!csvFile || !selectedWebsiteColumn" />
      </template>
    </Dialog>

    <!-- Create AI Column Dialog -->
    <Dialog v-model:visible="showCreateAIColumnDialog" modal header="Create AI Column" :style="{width: '500px'}">
      <div class="flex flex-column gap-4">
        <div>
          <label class="block text-sm font-medium mb-2">Column Name <span class="text-red-500">*</span></label>
          <InputText 
            v-model="aiColumnName" 
            placeholder="Enter column name"
            class="w-full"
          />
          <small class="text-600">This will be the header name for your AI column</small>
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-2">Prompt <span class="text-red-500">*</span></label>
          <Textarea 
            v-model="aiColumnPrompt" 
            placeholder="Describe what you want the AI to analyze or generate for each company..."
            :rows="4"
            class="w-full"
            :autoResize="true"
          />
          <small class="text-600">Describe what you want the AI to do for each company</small>
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-2">Output Type <span class="text-red-500">*</span></label>
          <Dropdown 
            v-model="aiColumnOutputType" 
            :options="aiOutputTypes"
            optionLabel="label"
            optionValue="value"
            placeholder="Select output type"
            class="w-full"
          />
          <small class="text-600">Choose the type of output the AI should generate</small>
        </div>
      </div>
      
      <template #footer>
        <Button label="Cancel" text @click="cancelCreateAIColumn" />
        <Button 
          label="Create" 
          @click="createAIColumn" 
          :disabled="!aiColumnName.trim() || !aiColumnPrompt.trim() || !aiColumnOutputType"
        />
      </template>
    </Dialog>

    <!-- Run AI Column Dialog -->
    <Dialog v-model:visible="showRunAIDialog" modal :header="`Run ${selectedAIColumn?.name || 'AI Column'}`" :style="{width: '400px'}">
      <div class="flex flex-column gap-4">
        <div class="text-sm text-600 mb-2">
          <strong>Prompt:</strong> {{ selectedAIColumn?.prompt }}
        </div>
        
        <div class="text-sm text-600 mb-2">
          <strong>Output Type:</strong> {{ getOutputTypeLabel(selectedAIColumn?.outputType) }}
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-2">Number of Rows to Run</label>
          <div class="flex flex-column gap-3">
            <div class="flex gap-2">
              <InputText 
                v-model.number="runRowCount" 
                type="number"
                :min="1"
                :max="companies.length"
                placeholder="Enter number of rows"
                class="flex-1"
              />
              <Button 
                label="All" 
                @click="selectAllRows" 
                outlined 
                size="small"
              />
            </div>
            <small class="text-600">
              Total companies: {{ companies.length }}
            </small>
          </div>
        </div>
        
        <div class="p-3 surface-100 border-round text-sm">
          <i class="pi pi-info-circle mr-2"></i>
          This will run the AI analysis on {{ runRowCount || 0 }} companies. The analysis will be performed in the background.
        </div>
      </div>
      
      <template #footer>
        <Button label="Cancel" text @click="cancelRunAI" />
        <Button 
          label="Run AI" 
          @click="runAIColumn" 
          :disabled="!runRowCount || runRowCount < 1 || runRowCount > companies.length"
          icon="pi pi-play"
        />
      </template>
    </Dialog>

    <!-- Filter Info -->
    <div v-if="$route.query.filter" class="card">
      <div class="flex align-items-center justify-content-between">
        <div class="flex align-items-center gap-2">
          <i class="pi pi-filter text-primary"></i>
          <span class="font-medium">
            Showing companies from selected contacts: 
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

    <!-- Companies Table -->
    <div class="card p-0">
      <DataTable 
        :value="filteredCompanies" 
        :paginator="true" 
        :rows="25"
        :loading="loading"
        :globalFilterFields="['name', 'website', 'tags']"
        :globalFilter="searchValue"
        :scrollable="true"
        scrollHeight="600px"
        class="p-datatable-sm"
        :rowHover="true"
        filterDisplay="row"
        v-model:filters="filters"
        v-model:selection="selectedCompanies"
        dataKey="name"
      >
        <Column selectionMode="multiple" headerStyle="width: 3rem" :exportable="false" frozen></Column>
        <Column field="name" header="Company Name" :sortable="true" style="min-width: 200px" :showFilterMenu="false" frozen>
          <template #body="slotProps">
            <div class="flex align-items-center gap-2">
              <img 
                :src="`https://logo.clearbit.com/${slotProps.data.website}`" 
                :alt="slotProps.data.name"
                class="w-2rem h-2rem border-round"
                style="object-fit: contain"
                @error="$event.target.style.display='none'"
              />
              <a 
                @click="navigateToCompany(slotProps.data)"
                class="font-medium text-primary cursor-pointer no-underline hover:underline"
              >
                {{ slotProps.data.name }}
              </a>
            </div>
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText 
              v-model="filterModel.value" 
              @input="filterCallback()" 
              placeholder="Filter by name"
              class="p-column-filter"
              style="width: 100%"
            />
          </template>
        </Column>

        <Column field="website" header="Website" :sortable="true" style="min-width: 150px" :showFilterMenu="false">
          <template #body="slotProps">
            <a :href="`https://${slotProps.data.website}`" target="_blank" class="font-medium" style="color: inherit; text-decoration: none;">
              {{ slotProps.data.website }}
            </a>
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText 
              v-model="filterModel.value" 
              @input="filterCallback()" 
              placeholder="Filter by website"
              class="p-column-filter"
              style="width: 100%"
            />
          </template>
        </Column>

        <Column field="peopleCount" header="Number of People" :sortable="true" style="min-width: 130px" :showFilterMenu="false">
          <template #body="slotProps">
            <span class="font-medium">{{ slotProps.data.peopleCount }}</span>
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText 
              v-model="filterModel.value" 
              @input="filterCallback()" 
              placeholder="Filter by people count"
              class="p-column-filter"
              style="width: 100%"
            />
          </template>
        </Column>

        <Column field="status" header="Status" :sortable="true" style="min-width: 120px" :showFilterMenu="false">
          <template #body="slotProps">
            <Tag 
              :value="slotProps.data.status" 
              :severity="getStatusSeverity(slotProps.data.status)"
            />
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <Dropdown 
              v-model="filterModel.value" 
              @change="filterCallback()" 
              :options="statusOptions"
              placeholder="All statuses"
              class="p-column-filter"
              style="width: 100%"
              showClear
            />
          </template>
        </Column>

        <Column field="researchStatus" header="Research Status" :sortable="true" style="min-width: 150px" :showFilterMenu="false">
          <template #body="slotProps">
            <Tag 
              :value="slotProps.data.researchStatus" 
              :severity="getResearchSeverity(slotProps.data.researchStatus)"
            />
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <Dropdown 
              v-model="filterModel.value" 
              @change="filterCallback()" 
              :options="researchStatusOptions"
              placeholder="All research"
              class="p-column-filter"
              style="width: 100%"
              showClear
            />
          </template>
        </Column>

        <Column field="tags" header="Tags" style="min-width: 200px" :showFilterMenu="false">
          <template #body="slotProps">
            <div class="flex gap-1 flex-wrap">
              <Chip 
                v-for="tag in slotProps.data.tags" 
                :key="tag" 
                :label="tag"
                class="text-xs"
              />
            </div>
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText 
              v-model="filterModel.value" 
              @input="filterCallback()" 
              placeholder="Filter by tags"
              class="p-column-filter"
              style="width: 100%"
            />
          </template>
        </Column>

        <Column field="aiColumn" header="AI Column" style="min-width: 150px" :showFilterMenu="false">
          <template #body="slotProps">
            <span class="subtle">{{ slotProps.data.aiColumn || '—' }}</span>
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText 
              v-model="filterModel.value" 
              @input="filterCallback()" 
              placeholder="Filter AI insights"
              class="p-column-filter"
              style="width: 100%"
            />
          </template>
        </Column>
        
        <!-- Dynamic AI Columns -->
        <Column 
          v-for="aiCol in customAIColumns" 
          :key="aiCol.id"
          :field="aiCol.field" 
          style="min-width: 220px" 
          :showFilterMenu="false"
        >
          <template #header>
            <div class="flex align-items-center gap-1 w-full">
              <span class="flex-1">{{ aiCol.name }}</span>
              <Button 
                label="Run"
                icon="pi pi-play" 
                size="small" 
                outlined
                @click="openRunAIDialog(aiCol)"
                v-tooltip="'Run AI column'"
                class="text-xs"
              />
              <Button 
                icon="pi pi-trash" 
                size="small" 
                text 
                severity="danger"
                @click="deleteAIColumn(aiCol)"
                v-tooltip="'Delete AI column'"
                class="p-0 w-2rem h-2rem"
              />
            </div>
          </template>
          <template #body="slotProps">
            <span class="subtle">
              <template v-if="slotProps.data[aiCol.field] === null || slotProps.data[aiCol.field] === undefined">
                —
              </template>
              <template v-else-if="aiCol.outputType === 'boolean'">
                {{ slotProps.data[aiCol.field] ? 'true' : 'false' }}
              </template>
              <template v-else>
                {{ slotProps.data[aiCol.field] }}
              </template>
            </span>
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText 
              v-model="filterModel.value" 
              @input="filterCallback()" 
              :placeholder="`Filter ${aiCol.name}`"
              class="p-column-filter"
              style="width: 100%"
            />
          </template>
        </Column>

        <template #empty>
          <div class="text-center p-4">
            <i class="pi pi-search text-4xl text-400 mb-3"></i>
            <div class="font-medium mb-2">No companies found</div>
            <div class="subtle">Try adjusting your search or filters</div>
          </div>
        </template>
      </DataTable>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Company',
  mounted() {
    this.loadPersistedData()
  },
  computed: {
    filteredCompanies() {
      let filtered = this.companies
      
      // Apply filter from query parameter if present
      if (this.$route.query.filter) {
        const filterCompanies = this.$route.query.filter.split(',')
        filtered = filtered.filter(company => 
          filterCompanies.includes(company.name)
        )
      }
      
      return filtered
    }
  },
  data() {
    return {
      searchValue: '',
      loading: false,
      selectedCompanies: [],
      showAddCompaniesDialog: false,
      selectedAddMethod: null,
      domainInput: '',
      csvFile: null,
      csvHeaders: [],
      selectedWebsiteColumn: null,
      showCreateAIColumnDialog: false,
      aiColumnName: '',
      aiColumnPrompt: '',
      aiColumnOutputType: null,
      aiOutputTypes: [
        { label: 'True/False', value: 'boolean' },
        { label: 'Text', value: 'text' },
        { label: 'Number', value: 'number' }
      ],
      customAIColumns: [],
      showRunAIDialog: false,
      selectedAIColumn: null,
      runRowCount: null,
      statusOptions: ['Won', 'Lost', 'Active'],
      researchStatusOptions: ['Not Started', 'In Progress', 'Complete'],
      filters: {
        name: { value: null, matchMode: 'contains' },
        website: { value: null, matchMode: 'contains' },
        peopleCount: { value: null, matchMode: 'gte' },
        status: { value: null, matchMode: 'equals' },
        researchStatus: { value: null, matchMode: 'equals' },
        tags: { value: null, matchMode: 'contains' },
        aiColumn: { value: null, matchMode: 'contains' }
      },
      companies: [
        {
          name: 'Clay',
          website: 'clay.com',
          peopleCount: 85,
          status: 'Active',
          researchStatus: 'In Progress',
          tags: ['Data Platform', 'SaaS', 'B2B'],
          aiColumn: 'Strong product-market fit'
        },
        {
          name: 'Hightouch',
          website: 'hightouch.com',
          peopleCount: 120,
          status: 'Won',
          researchStatus: 'Complete',
          tags: ['Data Infrastructure', 'CDP', 'Analytics'],
          aiColumn: 'Ideal customer profile match'
        },
        {
          name: 'Baremetrics',
          website: 'baremetrics.com',
          peopleCount: 45,
          status: 'Active',
          researchStatus: 'Complete',
          tags: ['SaaS Analytics', 'Metrics', 'Subscription'],
          aiColumn: 'High engagement potential'
        },
        {
          name: 'ChartMogul',
          website: 'chartmogul.com',
          peopleCount: 78,
          status: 'Lost',
          researchStatus: 'Complete',
          tags: ['Analytics', 'SaaS', 'Revenue'],
          aiColumn: 'Competitive solution in place'
        },
        {
          name: 'Metronome',
          website: 'metronome.com',
          peopleCount: 65,
          status: 'Active',
          researchStatus: 'In Progress',
          tags: ['Billing', 'Usage-based', 'FinTech'],
          aiColumn: 'Rapid growth phase'
        },
        {
          name: 'Casechek',
          website: 'casechek.com',
          peopleCount: 25,
          status: 'Active',
          researchStatus: 'Not Started',
          tags: ['Legal Tech', 'Startup'],
          aiColumn: null
        },
        {
          name: 'Fueloyal',
          website: 'fueloyal.com',
          peopleCount: 32,
          status: 'Active',
          researchStatus: 'In Progress',
          tags: ['Loyalty', 'Automotive', 'Mobile'],
          aiColumn: 'Niche market leader'
        },
        {
          name: 'BookingKoala',
          website: 'bookingkoala.com',
          peopleCount: 18,
          status: 'Won',
          researchStatus: 'Complete',
          tags: ['Booking', 'SaaS', 'Small Business'],
          aiColumn: 'Perfect timing for expansion'
        },
        {
          name: 'Graphite',
          website: 'graphite.dev',
          peopleCount: 42,
          status: 'Active',
          researchStatus: 'In Progress',
          tags: ['Developer Tools', 'Git', 'Code Review'],
          aiColumn: 'Strong developer adoption'
        },
        {
          name: 'Stainless',
          website: 'stainless.com',
          peopleCount: 28,
          status: 'Active',
          researchStatus: 'Complete',
          tags: ['API', 'Developer Tools', 'SDK'],
          aiColumn: 'High-quality engineering team'
        },
        {
          name: 'Cohesive Networks',
          website: 'cohesive.net',
          peopleCount: 150,
          status: 'Lost',
          researchStatus: 'Complete',
          tags: ['Security', 'Network', 'Enterprise'],
          aiColumn: 'Long sales cycle challenges'
        },
        {
          name: 'Connamara Systems',
          website: 'connamara.com',
          peopleCount: 95,
          status: 'Active',
          researchStatus: 'In Progress',
          tags: ['Trading', 'Financial Services', 'B2B'],
          aiColumn: 'Complex integration requirements'
        },
        {
          name: 'Applied Pathways',
          website: 'appliedpathways.com',
          peopleCount: 55,
          status: 'Active',
          researchStatus: 'Not Started',
          tags: ['Healthcare', 'Analytics'],
          aiColumn: null
        },
        {
          name: 'Branchfire',
          website: 'folia.com',
          peopleCount: 35,
          status: 'Active',
          researchStatus: 'In Progress',
          tags: ['EdTech', 'Publishing', 'Content'],
          aiColumn: 'Digital transformation focus'
        },
        {
          name: 'Callibra',
          website: 'discharge123.com',
          peopleCount: 22,
          status: 'Active',
          researchStatus: 'Not Started',
          tags: ['Healthcare', 'Workflow'],
          aiColumn: null
        },
        {
          name: 'Govly',
          website: 'govly.com',
          peopleCount: 45,
          status: 'Won',
          researchStatus: 'Complete',
          tags: ['GovTech', 'Procurement', 'B2G'],
          aiColumn: 'Government sector expertise'
        },
        {
          name: 'FastModel Sports',
          website: 'fastmodelsports.com',
          peopleCount: 88,
          status: 'Active',
          researchStatus: 'Complete',
          tags: ['Sports Tech', 'Coaching', 'SaaS'],
          aiColumn: 'Seasonal usage patterns'
        },
        {
          name: 'Eventric',
          website: 'eventric.com',
          peopleCount: 67,
          status: 'Lost',
          researchStatus: 'Complete',
          tags: ['Events', 'Marketing', 'Enterprise'],
          aiColumn: 'Budget allocated elsewhere'
        },
        {
          name: 'Bridge Financial Technology',
          website: 'bridgeft.com',
          peopleCount: 125,
          status: 'Active',
          researchStatus: 'In Progress',
          tags: ['FinTech', 'Wealth Management', 'B2B'],
          aiColumn: 'Strong ROI potential'
        }
      ]
    }
  },
  methods: {
    getStatusSeverity(status) {
      switch (status) {
        case 'Won': return 'success'
        case 'Lost': return 'danger'
        case 'Active': return 'info'
        default: return null
      }
    },
    getResearchSeverity(status) {
      switch (status) {
        case 'Complete': return 'success'
        case 'In Progress': return 'warning'
        case 'Not Started': return 'secondary'
        default: return null
      }
    },
    selectAddMethod(method) {
      this.selectedAddMethod = method
    },
    deleteSelected() {
      if (!this.selectedCompanies || this.selectedCompanies.length === 0) {
        return
      }
      
      const count = this.selectedCompanies.length
      const companyNames = this.selectedCompanies.map(company => company.name).join(', ')
      
      // Show confirmation dialog
      const confirmed = confirm(
        `Are you sure you want to delete ${count} selected company${count > 1 ? 'ies' : ''}?\n\n${companyNames}`
      )
      
      if (confirmed) {
        // Remove selected companies from the companies array
        this.companies = this.companies.filter(company => {
          return !this.selectedCompanies.find(selected => selected.name === company.name)
        })
        
        // Clear selection
        this.selectedCompanies = []
        
        // Show success message
        this.$toast?.add({
          severity: 'success',
          summary: 'Companies Deleted',
          detail: `Successfully deleted ${count} company${count > 1 ? 'ies' : ''}`,
          life: 3000
        }) || alert(`Successfully deleted ${count} company${count > 1 ? 'ies' : ''}`)
      }
    },
    resetMethodSelection() {
      this.selectedAddMethod = null
      this.domainInput = ''
      this.csvFile = null
      this.csvHeaders = []
      this.selectedWebsiteColumn = null
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = ''
      }
    },
    cancelAddCompanies() {
      this.showAddCompaniesDialog = false
      this.selectedAddMethod = null
      this.domainInput = ''
      this.csvFile = null
      this.csvHeaders = []
      this.selectedWebsiteColumn = null
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = ''
      }
    },
    addCompanies() {
      if (this.selectedAddMethod === 'domains') {
        this.processDomains()
      } else if (this.selectedAddMethod === 'csv') {
        this.processCsv()
      }
      this.cancelAddCompanies()
    },
    handleFileUpload(event) {
      const file = event.target.files[0]
      this.csvFile = file
      
      if (file) {
        // Parse CSV headers
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const csv = e.target.result
            const lines = csv.split('\n').filter(line => line.trim())
            
            if (lines.length > 0) {
              // Parse header row
              const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
              this.csvHeaders = headers
              
              // Auto-select website column if we find a likely match
              const websiteHeader = headers.find(h => 
                h.toLowerCase().includes('website') || 
                h.toLowerCase().includes('domain') || 
                h.toLowerCase().includes('url') ||
                h.toLowerCase().includes('site')
              )
              if (websiteHeader) {
                this.selectedWebsiteColumn = websiteHeader
              }
            }
          } catch (error) {
            console.error('Error parsing CSV headers:', error)
          }
        }
        reader.readAsText(file)
      }
    },
    processDomains() {
      // Parse domains from input (split by commas or newlines)
      const rawDomains = this.domainInput
        .split(/[,\n]/)
        .map(domain => domain.trim())
        .filter(domain => domain.length > 0)
      
      if (rawDomains.length === 0) return
      
      // Normalize domains and check for duplicates
      const processedDomains = []
      const skippedCount = rawDomains.length
      
      rawDomains.forEach(rawDomain => {
        const normalizedDomain = this.normalizeDomain(rawDomain)
        
        // Check if this domain already exists
        if (!this.isDuplicateDomain(normalizedDomain)) {
          processedDomains.push(normalizedDomain)
        }
      })
      
      // Create company objects from unique domains
      const newCompanies = processedDomains.map(domain => {
        const company = {
          name: this.extractCompanyName(domain),
          website: domain,
          peopleCount: Math.floor(Math.random() * 200) + 10, // Random between 10-209
          status: 'Active',
          researchStatus: 'Not Started',
          tags: ['New Company'],
          aiColumn: null
        }
        
        // Add custom AI columns with null values
        this.customAIColumns.forEach(aiCol => {
          company[aiCol.field] = null
        })
        
        return company
      })
      
      // Add to companies array
      this.companies.push(...newCompanies)
      
      // Show success message with duplicate info
      const duplicatesSkipped = skippedCount - processedDomains.length
      let message = `Successfully added ${newCompanies.length} companies`
      if (duplicatesSkipped > 0) {
        message += ` (${duplicatesSkipped} duplicates skipped)`
      }
      
      this.$toast?.add({
        severity: 'success',
        summary: 'Companies Added',
        detail: message,
        life: 3000
      }) || alert(message)
    },
    processCsv() {
      if (!this.csvFile || !this.selectedWebsiteColumn) return
      
      // Use the cached headers to find the website column
      if (this.csvHeaders.length === 0) {
        this.showError('No CSV headers found. Please reselect the file.')
        return
      }
      
      const websiteIndex = this.csvHeaders.findIndex(h => h === this.selectedWebsiteColumn)
      
      if (websiteIndex === -1) {
        this.showError(`Selected website column "${this.selectedWebsiteColumn}" not found. Available columns: ${this.csvHeaders.join(', ')}`)
        return
      }
      
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const csv = e.target.result
          const lines = csv.split('\n').filter(line => line.trim())
          
          if (lines.length < 2) {
            this.showError('CSV file must have at least a header row and one data row')
            return
          }
          
          // Extract websites from the selected column
          const websites = []
          
          console.log(`Total lines in CSV: ${lines.length}`)
          console.log(`Website column index: ${websiteIndex}`)
          console.log(`Selected website column: "${this.selectedWebsiteColumn}"`)
          console.log(`Available headers: [${this.csvHeaders.join(', ')}]`)
          
          for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''))
            
            console.log(`Row ${i}: Found ${values.length} values: [${values.join(' | ')}]`)
            
            if (values.length > websiteIndex) {
              const cellValue = values[websiteIndex]
              console.log(`Row ${i} website column value: "${cellValue}"`)
              
              // Skip if empty
              if (!cellValue || cellValue.length < 3) {
                console.log(`Skipping empty/short value: "${cellValue}"`)
                continue
              }
              
              websites.push(cellValue)
            } else {
              console.log(`Row ${i}: Not enough columns (has ${values.length}, need ${websiteIndex + 1})`)
            }
          }
          
          console.log(`Extracted ${websites.length} websites:`, websites)
          
          if (websites.length === 0) {
            this.showError('No valid websites found in the selected column (emails are excluded)')
            return
          }
          
          // Process websites exactly like domain pasting
          const processedDomains = []
          const totalDomains = websites.length
          
          websites.forEach(rawDomain => {
            const normalizedDomain = this.normalizeDomain(rawDomain)
            
            // Check if this domain already exists
            if (!this.isDuplicateDomain(normalizedDomain)) {
              processedDomains.push(normalizedDomain)
            }
          })
          
          // Create company objects from unique domains
          const newCompanies = processedDomains.map(domain => {
            const company = {
              name: this.extractCompanyName(domain),
              website: domain,
              peopleCount: Math.floor(Math.random() * 200) + 10, // Random between 10-209
              status: 'Active',
              researchStatus: 'Not Started',
              tags: ['CSV Import'],
              aiColumn: null
            }
            
            // Add custom AI columns with null values
            this.customAIColumns.forEach(aiCol => {
              company[aiCol.field] = null
            })
            
            return company
          })
          
          // Add to companies array
          this.companies.push(...newCompanies)
          
          // Show success message with duplicate info
          const duplicatesSkipped = totalDomains - processedDomains.length
          let message = `Successfully imported ${newCompanies.length} companies`
          if (duplicatesSkipped > 0) {
            message += ` (${duplicatesSkipped} duplicates skipped)`
          }
          
          this.$toast?.add({
            severity: 'success',
            summary: 'CSV Imported',
            detail: message,
            life: 3000
          }) || alert(message)
          
        } catch (error) {
          this.showError('Error parsing CSV file')
        }
      }
      
      reader.readAsText(this.csvFile)
    },
    normalizeDomain(rawDomain) {
      // Remove protocols (http://, https://, ftp://, etc.)
      let domain = rawDomain.replace(/^[a-zA-Z]+:\/\//, '')
      
      // Remove www. prefix
      domain = domain.replace(/^www\./, '')
      
      // Remove trailing slash
      domain = domain.replace(/\/$/, '')
      
      // Extract root domain (remove paths, query params, etc.)
      domain = domain.split('/')[0].split('?')[0].split('#')[0]
      
      // Convert to lowercase for consistent comparison
      return domain.toLowerCase()
    },
    isDuplicateDomain(normalizedDomain) {
      // Check if any existing company has this domain
      return this.companies.some(company => {
        const existingDomain = this.normalizeDomain(company.website)
        return existingDomain === normalizedDomain
      })
    },
    extractCompanyName(domain) {
      // Extract company name from normalized domain
      const normalizedDomain = this.normalizeDomain(domain)
      const cleanDomain = normalizedDomain.split('.')[0]
      return cleanDomain.charAt(0).toUpperCase() + cleanDomain.slice(1)
    },
    showError(message) {
      this.$toast?.add({
        severity: 'error',
        summary: 'Error',
        detail: message,
        life: 5000
      }) || alert(message)
    },
    cancelCreateAIColumn() {
      this.showCreateAIColumnDialog = false
      this.aiColumnName = ''
      this.aiColumnPrompt = ''
      this.aiColumnOutputType = null
    },
    createAIColumn() {
      if (!this.aiColumnName.trim() || !this.aiColumnPrompt.trim() || !this.aiColumnOutputType) {
        return
      }
      
      // Create the new AI column configuration
      const newAIColumn = {
        id: Date.now().toString(), // Simple ID generation
        name: this.aiColumnName.trim(),
        prompt: this.aiColumnPrompt.trim(),
        outputType: this.aiColumnOutputType,
        field: `aiColumn_${Date.now()}` // Generate unique field name
      }
      
      // Add to custom AI columns array
      this.customAIColumns.push(newAIColumn)
      
      // Save to localStorage
      this.saveCustomColumns()
      
      // Add the new column field to all existing companies (initially null)
      this.companies.forEach(company => {
        company[newAIColumn.field] = null
      })
      
      // Update filters to include the new column
      this.filters[newAIColumn.field] = { value: null, matchMode: 'contains' }
      
      // Show success message
      this.$toast?.add({
        severity: 'success',
        summary: 'AI Column Created',
        detail: `Successfully created "${newAIColumn.name}" column`,
        life: 3000
      }) || alert(`Successfully created "${newAIColumn.name}" column`)
      
      // Close dialog and reset form
      this.cancelCreateAIColumn()
    },
    openRunAIDialog(aiColumn) {
      this.selectedAIColumn = aiColumn
      this.runRowCount = null
      this.showRunAIDialog = true
    },
    cancelRunAI() {
      this.showRunAIDialog = false
      this.selectedAIColumn = null
      this.runRowCount = null
    },
    selectAllRows() {
      this.runRowCount = this.companies.length
    },
    getOutputTypeLabel(outputType) {
      const typeMap = {
        'boolean': 'True/False',
        'text': 'Text',
        'number': 'Number'
      }
      return typeMap[outputType] || outputType
    },
    runAIColumn() {
      if (!this.selectedAIColumn || !this.runRowCount || this.runRowCount < 1) {
        return
      }
      
      // Generate mock data for companies that don't already have data in this column
      const companiesWithoutData = this.companies.filter(company => 
        !company[this.selectedAIColumn.field] || company[this.selectedAIColumn.field] === null
      )
      
      // Select up to runRowCount companies (either the first N without data, or all if fewer)
      const selectedCompanies = companiesWithoutData.slice(0, Math.min(this.runRowCount, companiesWithoutData.length))
      
      selectedCompanies.forEach(company => {
        company[this.selectedAIColumn.field] = this.generateMockData(this.selectedAIColumn.outputType)
      })
      
      const actualCount = selectedCompanies.length
      
      // Show success message
      this.$toast?.add({
        severity: 'success',
        summary: 'AI Analysis Complete',
        detail: `Generated results for "${this.selectedAIColumn.name}" on ${actualCount} companies.`,
        life: 3000
      }) || alert(`Generated results for "${this.selectedAIColumn.name}" on ${actualCount} companies`)
      
      // Close dialog
      this.cancelRunAI()
    },
    generateMockData(outputType) {
      switch (outputType) {
        case 'boolean':
          // Ensure 50/50 distribution of true/false
          return Math.random() >= 0.5
        
        case 'number':
          // Generate random numbers between 1-100
          return Math.floor(Math.random() * 100) + 1
        
        case 'text':
        default:
          // Generate random text responses
          const textOptions = [
            'High potential opportunity',
            'Strong market fit',
            'Moderate interest level',
            'Requires further analysis',
            'Not a priority target',
            'Excellent growth prospects',
            'Limited market overlap',
            'Strategic partnership potential',
            'Competitive landscape concerns',
            'Ideal customer profile match',
            'Budget constraints likely',
            'Decision maker identified',
            'Long sales cycle expected',
            'Quick win opportunity',
            'Complex technical requirements'
          ]
          return textOptions[Math.floor(Math.random() * textOptions.length)]
      }
    },
    loadPersistedData() {
      try {
        // Load custom AI columns from localStorage
        const savedColumns = localStorage.getItem('customAIColumns')
        if (savedColumns) {
          this.customAIColumns = JSON.parse(savedColumns)
          
          // Add filters for loaded columns
          this.customAIColumns.forEach(aiCol => {
            this.filters[aiCol.field] = { value: null, matchMode: 'contains' }
          })
          
          // Ensure all companies have fields for the loaded columns
          this.companies.forEach(company => {
            this.customAIColumns.forEach(aiCol => {
              if (!(aiCol.field in company)) {
                company[aiCol.field] = null
              }
            })
          })
        }
      } catch (error) {
        console.error('Error loading persisted AI columns:', error)
      }
    },
    saveCustomColumns() {
      try {
        localStorage.setItem('customAIColumns', JSON.stringify(this.customAIColumns))
      } catch (error) {
        console.error('Error saving AI columns:', error)
      }
    },
    deleteAIColumn(aiColumn) {
      const confirmed = confirm(`Are you sure you want to delete the "${aiColumn.name}" AI column? This action cannot be undone.`)
      
      if (confirmed) {
        // Remove from custom columns array
        const index = this.customAIColumns.findIndex(col => col.id === aiColumn.id)
        if (index > -1) {
          this.customAIColumns.splice(index, 1)
        }
        
        // Save updated columns to localStorage
        this.saveCustomColumns()
        
        // Remove the field from all companies
        this.companies.forEach(company => {
          delete company[aiColumn.field]
        })
        
        // Remove from filters
        delete this.filters[aiColumn.field]
        
        // Show success message
        this.$toast?.add({
          severity: 'success',
          summary: 'AI Column Deleted',
          detail: `Successfully deleted "${aiColumn.name}" column`,
          life: 3000
        }) || alert(`Successfully deleted "${aiColumn.name}" column`)
      }
    },
    navigateToCompany(company) {
      // Navigate to the individual company page
      this.$router.push(`/company/${encodeURIComponent(company.name)}`)
    },
    viewSelectedPeople() {
      if (!this.selectedCompanies || this.selectedCompanies.length === 0) {
        return
      }
      
      // Get unique company names from selected companies
      const companyNames = [...new Set(
        this.selectedCompanies
          .map(company => company.name)
          .filter(name => name && name.trim() !== '')
      )]
      
      if (companyNames.length === 0) {
        return
      }
      
      // Navigate to people page with filter
      this.$router.push({
        name: 'People',
        query: { filter: companyNames.join(',') }
      })
    },
    clearFilter() {
      this.$router.push({ name: 'Company' })
    }
  }
}
</script>


