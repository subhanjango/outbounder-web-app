<template>
  <div class="flex flex-column gap-4">
    <!-- Header with company name and back button -->
    <div class="flex align-items-center gap-3">
      <Button 
        icon="pi pi-arrow-left" 
        text 
        @click="goBack"
        v-tooltip="'Back to Companies'"
        class="p-0"
      />
      <h1 class="text-3xl font-bold m-0">{{ company?.name || 'Company Not Found' }}</h1>
    </div>

    <!-- Company not found state -->
    <div v-if="!company" class="card text-center p-6">
      <i class="pi pi-exclamation-triangle text-4xl text-orange-500 mb-3"></i>
      <h2 class="text-xl font-medium mb-2">Company Not Found</h2>
      <p class="text-600 mb-4">The company you're looking for doesn't exist or may have been deleted.</p>
      <Button label="Back to Companies" icon="pi pi-arrow-left" @click="goBack" />
    </div>

    <!-- Company details layout -->
    <div v-else class="resizable-layout">
      <!-- Left side - Overview -->
      <div class="overview-panel" :style="{ width: overviewWidth + '%' }">
        <div class="card">
          <div class="flex align-items-center gap-3 mb-4">
            <i class="pi pi-building text-2xl text-primary"></i>
            <h2 class="text-xl font-semibold m-0">Overview</h2>
          </div>
          
          <div class="grid">
            <!-- Company Logo and Name -->
            <div class="col-12 mb-4">
              <div class="flex align-items-center gap-4">
                <img 
                  :src="`https://logo.clearbit.com/${company.website}`" 
                  :alt="company.name"
                  class="w-4rem h-4rem border-round border-1 surface-border"
                  style="object-fit: contain"
                  @error="$event.target.style.display='none'"
                />
                <div>
                  <h3 class="text-2xl font-bold m-0 mb-1">{{ company.name }}</h3>
                  <div class="flex align-items-center gap-2">
                    <Tag 
                      :value="company.status" 
                      :severity="getStatusSeverity(company.status)"
                    />
                    <Tag 
                      :value="company.researchStatus" 
                      :severity="getResearchSeverity(company.researchStatus)"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Company Details - Single Column -->
            <div class="col-12">
              <div class="flex flex-column gap-4">
                <!-- Website -->
                <div class="detail-item">
                  <label class="detail-label">
                    <i class="pi pi-globe mr-2"></i>
                    Website
                  </label>
                  <div class="detail-value">
                    <a :href="`https://${company.website}`" target="_blank" class="text-primary no-underline">
                      {{ company.website }}
                    </a>
                  </div>
                </div>

                <!-- Company LinkedIn -->
                <div class="detail-item">
                  <label class="detail-label">
                    <i class="pi pi-linkedin mr-2"></i>
                    LinkedIn
                  </label>
                  <div class="detail-value">
                    <a :href="company.linkedinUrl" target="_blank" class="text-primary no-underline" v-if="company.linkedinUrl">
                      {{ company.linkedinUrl }}
                    </a>
                    <span class="text-500" v-else>Not available</span>
                  </div>
                </div>

                <!-- Revenue -->
                <div class="detail-item">
                  <label class="detail-label">
                    <i class="pi pi-dollar mr-2"></i>
                    Revenue
                  </label>
                  <div class="detail-value">
                    {{ company.revenue || 'Not available' }}
                  </div>
                </div>

                <!-- Headcount -->
                <div class="detail-item">
                  <label class="detail-label">
                    <i class="pi pi-users mr-2"></i>
                    Headcount
                  </label>
                  <div class="detail-value">
                    {{ company.peopleCount }}
                  </div>
                </div>

                <!-- Address -->
                <div class="detail-item">
                  <label class="detail-label">
                    <i class="pi pi-map-marker mr-2"></i>
                    Address
                  </label>
                  <div class="detail-value">
                    {{ company.address || 'Not available' }}
                  </div>
                </div>

                <!-- Industry -->
                <div class="detail-item">
                  <label class="detail-label">
                    <i class="pi pi-briefcase mr-2"></i>
                    Industry
                  </label>
                  <div class="detail-value">
                    {{ company.industry || 'Not available' }}
                  </div>
                </div>
              </div>
            </div>

                <!-- Company Description -->
                <div class="detail-item">
                  <label class="detail-label">
                    <i class="pi pi-file-text mr-2"></i>
                    Description
                  </label>
                  <div class="detail-value">
                    {{ company.description || 'No description available for this company.' }}
                  </div>
                </div>

                <!-- Tags -->
                <div class="detail-item" v-if="company.tags && company.tags.length > 0">
                  <label class="detail-label">
                    <i class="pi pi-tags mr-2"></i>
                    Tags
                  </label>
                  <div class="detail-value">
                    <div class="flex gap-2 flex-wrap">
                      <Chip 
                        v-for="tag in company.tags" 
                        :key="tag" 
                        :label="tag"
                        class="text-sm"
                      />
                    </div>
                  </div>
                </div>
          </div>
        </div>
      </div>

      <!-- Resizer -->
      <div 
        class="resizer"
        @mousedown="startResize"
        @touchstart="startResize"
      >
        <div class="resizer-handle"></div>
      </div>

      <!-- Right side - placeholder for future content -->
      <div class="right-panel" :style="{ width: (100 - overviewWidth) + '%' }">
        <div class="card text-center">
          <i class="pi pi-info-circle text-4xl text-400 mb-3"></i>
          <h3 class="text-lg font-medium mb-2">Additional Information</h3>
          <p class="text-600 m-0">Additional company details will be added here in the future.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CompanyDetail',
  data() {
    return {
      company: null,
      overviewWidth: 66, // Default to ~2/3 width (similar to lg:col-8)
      isResizing: false,
      startX: 0,
      startWidth: 0
    }
  },
  mounted() {
    this.loadCompanyData()
  },
  watch: {
    '$route'() {
      this.loadCompanyData()
    }
  },
  methods: {
    loadCompanyData() {
      const companyName = this.$route.params.companyName
      
      // Get companies from localStorage if available (from Company.vue)
      const savedCompanies = this.getCompaniesFromLocalStorage()
      
      // Find the company by name
      this.company = savedCompanies.find(company => 
        company.name.toLowerCase() === companyName.toLowerCase()
      )
      
      // If not found, create mock data based on the company name
      if (!this.company) {
        this.company = this.createMockCompany(companyName)
      }
    },
    
    getCompaniesFromLocalStorage() {
      // This would ideally come from a shared store or service
      // For now, we'll use enhanced mock data based on Company.vue
      return [
        {
          name: 'Clay',
          website: 'clay.com',
          peopleCount: 85,
          status: 'Active',
          researchStatus: 'In Progress',
          tags: ['Data Platform', 'SaaS', 'B2B'],
          linkedinUrl: 'https://linkedin.com/company/clay-earth',
          revenue: '$10M - $50M',
          address: 'San Francisco, CA',
          industry: 'Data & Analytics',
          description: 'Clay is a data platform that helps sales and marketing teams find, enrich, and personalize outreach to their ideal customers. The platform combines 50+ data providers into a single interface.'
        },
        {
          name: 'Hightouch',
          website: 'hightouch.com',
          peopleCount: 120,
          status: 'Won',
          researchStatus: 'Complete',
          tags: ['Data Infrastructure', 'CDP', 'Analytics'],
          linkedinUrl: 'https://linkedin.com/company/hightouch',
          revenue: '$50M - $100M',
          address: 'San Francisco, CA',
          industry: 'Data Infrastructure',
          description: 'Hightouch is the leading Composable Customer Data Platform (CDP) that helps companies sync customer data from their data warehouse to operational tools.'
        },
        {
          name: 'Baremetrics',
          website: 'baremetrics.com',
          peopleCount: 45,
          status: 'Active',
          researchStatus: 'Complete',
          tags: ['SaaS Analytics', 'Metrics', 'Subscription'],
          linkedinUrl: 'https://linkedin.com/company/baremetrics',
          revenue: '$5M - $25M',
          address: 'Remote',
          industry: 'SaaS Analytics',
          description: 'Baremetrics provides subscription analytics and insights for SaaS businesses, helping them understand their revenue, churn, and growth metrics.'
        },
        {
          name: 'ChartMogul',
          website: 'chartmogul.com',
          peopleCount: 78,
          status: 'Lost',
          researchStatus: 'Complete',
          tags: ['Analytics', 'SaaS', 'Revenue'],
          linkedinUrl: 'https://linkedin.com/company/chartmogul',
          revenue: '$25M - $50M',
          address: 'Berlin, Germany',
          industry: 'Revenue Analytics',
          description: 'ChartMogul is a subscription analytics platform that helps SaaS businesses measure, understand and grow their recurring revenue.'
        },
        {
          name: 'Metronome',
          website: 'metronome.com',
          peopleCount: 65,
          status: 'Active',
          researchStatus: 'In Progress',
          tags: ['Billing', 'Usage-based', 'FinTech'],
          linkedinUrl: 'https://linkedin.com/company/metronome-billing',
          revenue: '$10M - $25M',
          address: 'New York, NY',
          industry: 'Billing Infrastructure',
          description: 'Metronome is a usage-based billing platform that helps companies launch, iterate, and scale their pricing models with confidence.'
        }
      ]
    },
    
    createMockCompany(companyName) {
      // Create a basic company object if not found
      return {
        name: companyName,
        website: `${companyName.toLowerCase().replace(/\s+/g, '')}.com`,
        peopleCount: Math.floor(Math.random() * 200) + 10,
        status: 'Active',
        researchStatus: 'Not Started',
        tags: ['Unknown'],
        linkedinUrl: null,
        revenue: null,
        address: null,
        industry: null,
        description: null
      }
    },
    
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
    
    goBack() {
      this.$router.push('/company')
    },
    
    startResize(event) {
      this.isResizing = true
      this.startX = event.type === 'mousedown' ? event.clientX : event.touches[0].clientX
      this.startWidth = this.overviewWidth
      
      // Add event listeners
      if (event.type === 'mousedown') {
        document.addEventListener('mousemove', this.handleResize)
        document.addEventListener('mouseup', this.stopResize)
      } else {
        document.addEventListener('touchmove', this.handleResize)
        document.addEventListener('touchend', this.stopResize)
      }
      
      // Prevent text selection during resize
      document.body.style.userSelect = 'none'
      event.preventDefault()
    },
    
    handleResize(event) {
      if (!this.isResizing) return
      
      const currentX = event.type === 'mousemove' ? event.clientX : event.touches[0].clientX
      const deltaX = currentX - this.startX
      const containerWidth = this.$el.querySelector('.resizable-layout').offsetWidth
      const deltaPercent = (deltaX / containerWidth) * 100
      
      // Calculate new width with constraints
      let newWidth = this.startWidth + deltaPercent
      newWidth = Math.max(30, Math.min(80, newWidth)) // Min 30%, Max 80%
      
      this.overviewWidth = newWidth
    },
    
    stopResize() {
      this.isResizing = false
      
      // Remove event listeners
      document.removeEventListener('mousemove', this.handleResize)
      document.removeEventListener('mouseup', this.stopResize)
      document.removeEventListener('touchmove', this.handleResize)
      document.removeEventListener('touchend', this.stopResize)
      
      // Restore text selection
      document.body.style.userSelect = ''
    }
  }
}
</script>

<style scoped>
.detail-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 0.125rem 0;
}

.detail-label {
  font-weight: 600;
  color: var(--muted);
  font-size: 0.875rem;
  min-width: 120px;
  flex-shrink: 0;
  line-height: 1.5;
  margin: 0;
  padding: 0;
}

.detail-value {
  color: var(--text-color);
  font-size: 0.95rem;
  flex: 1;
  line-height: 1.5;
  margin: 0;
  padding: 0;
}

.no-underline {
  text-decoration: none;
}

.no-underline:hover {
  text-decoration: underline;
}

/* Resizable layout styles */
.resizable-layout {
  display: flex;
  height: calc(100vh - 200px);
  min-height: 600px;
  gap: 0;
}

.overview-panel {
  flex-shrink: 0;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.right-panel {
  flex-shrink: 0;
  overflow-y: auto;
  padding-left: 0.5rem;
}

.resizer {
  width: 8px;
  background: transparent;
  cursor: col-resize;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  flex-shrink: 0;
}

.resizer:hover {
  background: var(--surface-border);
}

.resizer-handle {
  width: 2px;
  height: 40px;
  background: var(--surface-border);
  border-radius: 1px;
  transition: all 0.2s ease;
}

.resizer:hover .resizer-handle {
  background: var(--primary-color);
  height: 60px;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .resizable-layout {
    flex-direction: column;
    height: auto;
    min-height: auto;
  }
  
  .overview-panel,
  .right-panel {
    width: 100% !important;
    padding: 0;
    margin-bottom: 1rem;
  }
  
  .resizer {
    display: none;
  }
}
</style>
