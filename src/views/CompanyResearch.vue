<template>
  <AppLayout>
    <div class="research-page">
      <div class="page-header">
        <div class="header-left">
          <h1>Company Research</h1>
          <p>Discover insights about your target companies</p>
        </div>
        <div class="header-actions">
          <Button 
            @click="showResearchDialog = true"
            label="New Research" 
            icon="pi pi-plus"
            class="p-button-primary"
          />
        </div>
      </div>
      
      <div class="research-content">
        <div class="search-section">
          <Card>
            <template #content>
              <div class="search-form">
                <div class="search-input-group">
                  <IconField iconPosition="left" class="search-field">
                    <InputIcon class="pi pi-search" />
                    <InputText 
                      v-model="searchQuery"
                      placeholder="Search companies, domains, or keywords..."
                      class="search-input"
                      @keydown.enter="performSearch"
                    />
                  </IconField>
                  <Button 
                    @click="performSearch"
                    label="Search"
                    icon="pi pi-search"
                    :loading="searching"
                    class="search-button"
                  />
                </div>
                
                <div class="search-filters">
                  <Dropdown 
                    v-model="selectedIndustry" 
                    :options="industryOptions" 
                    placeholder="Industry"
                    class="filter-dropdown"
                  />
                  <Dropdown 
                    v-model="selectedSize" 
                    :options="sizeOptions" 
                    placeholder="Company Size"
                    class="filter-dropdown"
                  />
                  <Dropdown 
                    v-model="selectedLocation" 
                    :options="locationOptions" 
                    placeholder="Location"
                    class="filter-dropdown"
                  />
                </div>
              </div>
            </template>
          </Card>
        </div>
        
        <div class="results-section">
          <div v-if="!searchResults.length && !searching" class="empty-state">
            <div class="empty-icon">
              <i class="pi pi-search"></i>
            </div>
            <h3>Start Your Research</h3>
            <p>Search for companies to get detailed insights, competitive analysis, and contact information</p>
            <div class="sample-searches">
              <h4>Try searching for:</h4>
              <Button 
                v-for="sample in sampleSearches"
                :key="sample.id"
                @click="searchQuery = sample.query; performSearch()"
                :label="sample.query"
                class="p-button-outlined sample-search"
              />
            </div>
          </div>
          
          <div v-if="searchResults.length" class="search-results">
            <div class="results-header">
              <h3>Research Results ({{ searchResults.length }})</h3>
              <Button 
                @click="exportResults"
                label="Export Results"
                icon="pi pi-download"
                class="p-button-outlined"
              />
            </div>
            
            <div class="results-grid">
              <Card v-for="result in searchResults" :key="result.id" class="result-card">
                <template #content>
                  <div class="company-header">
                    <div class="company-logo">
                      <img 
                        v-if="result.logo" 
                        :src="result.logo" 
                        :alt="result.name"
                        class="logo-img"
                      />
                      <div v-else class="logo-placeholder">
                        {{ result.name.charAt(0) }}
                      </div>
                    </div>
                    <div class="company-info">
                      <h4>{{ result.name }}</h4>
                      <small>{{ result.domain }}</small>
                      <div class="company-tags">
                        <Tag :value="result.industry" severity="info" />
                        <Tag :value="result.size" severity="secondary" />
                      </div>
                    </div>
                  </div>
                  
                  <div class="company-details">
                    <div class="detail-row">
                      <span class="detail-label">Location:</span>
                      <span>{{ result.location }}</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">Founded:</span>
                      <span>{{ result.founded }}</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">Revenue:</span>
                      <span>{{ result.revenue }}</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">Employees:</span>
                      <span>{{ result.employees }}</span>
                    </div>
                  </div>
                  
                  <div v-if="result.description" class="company-description">
                    <p>{{ result.description }}</p>
                  </div>
                  
                  <div class="result-actions">
                    <Button 
                      @click="viewFullReport(result)"
                      label="Full Report"
                      icon="pi pi-file"
                      class="p-button-sm p-button-outlined"
                    />
                    <Button 
                      @click="addToAccounts(result)"
                      label="Add to Accounts"
                      icon="pi pi-plus"
                      class="p-button-sm p-button-outlined"
                    />
                    <Button 
                      @click="findContacts(result)"
                      label="Find Contacts"
                      icon="pi pi-users"
                      class="p-button-sm p-button-outlined"
                    />
                  </div>
                </template>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <Dialog 
        v-model:visible="showResearchDialog" 
        modal 
        header="Start New Research"
        :style="{ width: '500px' }"
      >
        <div class="research-dialog">
          <div class="research-options">
            <h4>What would you like to research?</h4>
            <div class="research-types">
              <Card 
                v-for="type in researchTypes"
                :key="type.id"
                @click="selectedResearchType = type.id"
                :class="{ 'selected': selectedResearchType === type.id }"
                class="research-type-card"
              >
                <template #content>
                  <div class="type-content">
                    <i :class="type.icon" class="type-icon"></i>
                    <h5>{{ type.name }}</h5>
                    <p>{{ type.description }}</p>
                  </div>
                </template>
              </Card>
            </div>
          </div>
          
          <div v-if="selectedResearchType" class="research-form">
            <div class="field">
              <label>Research Target</label>
              <InputText 
                v-model="researchTarget"
                :placeholder="getPlaceholder()"
              />
            </div>
          </div>
        </div>
        
        <template #footer>
          <Button 
            @click="showResearchDialog = false"
            label="Cancel" 
            class="p-button-text"
          />
          <Button 
            @click="startResearch"
            label="Start Research"
            :loading="researching"
            :disabled="!selectedResearchType || !researchTarget"
            class="p-button-primary"
          />
        </template>
      </Dialog>
      
      <Dialog 
        v-model:visible="showReportDialog" 
        modal 
        :header="selectedCompany?.name + ' - Full Report'"
        :style="{ width: '800px' }"
        maximizable
      >
        <div v-if="selectedCompany" class="full-report">
          <div class="report-sections">
            <TabView>
              <TabPanel header="Overview">
                <div class="overview-section">
                  <div class="overview-grid">
                    <div class="overview-item">
                      <h4>Company Information</h4>
                      <div class="info-grid">
                        <div class="info-item">
                          <label>Industry</label>
                          <span>{{ selectedCompany.industry }}</span>
                        </div>
                        <div class="info-item">
                          <label>Founded</label>
                          <span>{{ selectedCompany.founded }}</span>
                        </div>
                        <div class="info-item">
                          <label>Headquarters</label>
                          <span>{{ selectedCompany.location }}</span>
                        </div>
                        <div class="info-item">
                          <label>Website</label>
                          <span>{{ selectedCompany.domain }}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div class="overview-item">
                      <h4>Financial Information</h4>
                      <div class="info-grid">
                        <div class="info-item">
                          <label>Revenue</label>
                          <span>{{ selectedCompany.revenue }}</span>
                        </div>
                        <div class="info-item">
                          <label>Employees</label>
                          <span>{{ selectedCompany.employees }}</span>
                        </div>
                        <div class="info-item">
                          <label>Funding</label>
                          <span>{{ selectedCompany.funding || 'N/A' }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="company-summary">
                    <h4>Company Summary</h4>
                    <p>{{ selectedCompany.fullDescription || selectedCompany.description }}</p>
                  </div>
                </div>
              </TabPanel>
              
              <TabPanel header="News & Updates">
                <div class="news-section">
                  <div v-for="news in selectedCompany.news" :key="news.id" class="news-item">
                    <h5>{{ news.title }}</h5>
                    <small class="news-date">{{ formatDate(news.date) }}</small>
                    <p>{{ news.summary }}</p>
                  </div>
                </div>
              </TabPanel>
              
              <TabPanel header="Competitors">
                <div class="competitors-section">
                  <div class="competitors-grid">
                    <div v-for="competitor in selectedCompany.competitors" :key="competitor.id" class="competitor-card">
                      <h5>{{ competitor.name }}</h5>
                      <p>{{ competitor.description }}</p>
                      <div class="competitor-metrics">
                        <small>Revenue: {{ competitor.revenue }}</small>
                        <small>Employees: {{ competitor.employees }}</small>
                      </div>
                    </div>
                  </div>
                </div>
              </TabPanel>
            </TabView>
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
import Tag from 'primevue/tag'
import Dialog from 'primevue/dialog'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'

export default {
  name: 'CompanyResearch',
  components: {
    AppLayout,
    Card,
    Button,
    InputText,
    IconField,
    InputIcon,
    Dropdown,
    Tag,
    Dialog,
    TabView,
    TabPanel,
    Toast
  },
  data() {
    return {
      searchQuery: '',
      selectedIndustry: null,
      selectedSize: null,
      selectedLocation: null,
      searching: false,
      searchResults: [],
      showResearchDialog: false,
      showReportDialog: false,
      selectedCompany: null,
      selectedResearchType: null,
      researchTarget: '',
      researching: false,
      industryOptions: [
        { label: 'Technology', value: 'technology' },
        { label: 'Healthcare', value: 'healthcare' },
        { label: 'Finance', value: 'finance' },
        { label: 'Retail', value: 'retail' },
        { label: 'Manufacturing', value: 'manufacturing' }
      ],
      sizeOptions: [
        { label: 'Startup (1-10)', value: 'startup' },
        { label: 'Small (11-50)', value: 'small' },
        { label: 'Medium (51-200)', value: 'medium' },
        { label: 'Large (200+)', value: 'large' }
      ],
      locationOptions: [
        { label: 'San Francisco, CA', value: 'sf' },
        { label: 'New York, NY', value: 'nyc' },
        { label: 'Austin, TX', value: 'austin' },
        { label: 'Boston, MA', value: 'boston' },
        { label: 'Seattle, WA', value: 'seattle' }
      ],
      sampleSearches: [
        { id: 1, query: 'AI startups San Francisco' },
        { id: 2, query: 'fintech companies' },
        { id: 3, query: 'enterprise software' },
        { id: 4, query: 'healthcare technology' }
      ],
      researchTypes: [
        {
          id: 'company',
          name: 'Company Research',
          description: 'Research a specific company by name or domain',
          icon: 'pi pi-building'
        },
        {
          id: 'industry',
          name: 'Industry Analysis',
          description: 'Analyze an entire industry sector',
          icon: 'pi pi-chart-pie'
        },
        {
          id: 'competitor',
          name: 'Competitor Analysis',
          description: 'Compare competitors in a market space',
          icon: 'pi pi-eye'
        },
        {
          id: 'market',
          name: 'Market Research',
          description: 'Research market trends and opportunities',
          icon: 'pi pi-globe'
        }
      ]
    }
  },
  setup() {
    const toast = useToast()
    return { toast }
  },
  methods: {
    async performSearch() {
      if (!this.searchQuery.trim()) return
      
      this.searching = true
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Mock search results
        this.searchResults = [
          {
            id: 1,
            name: 'TechCorp AI',
            domain: 'techcorp-ai.com',
            industry: 'Technology',
            size: 'Medium',
            location: 'San Francisco, CA',
            founded: '2018',
            revenue: '$50M',
            employees: '150',
            description: 'Leading AI platform for enterprise automation and intelligent decision making.',
            logo: null,
            fullDescription: 'TechCorp AI is a cutting-edge artificial intelligence company that specializes in developing enterprise-grade AI solutions for automation and intelligent decision making. Founded in 2018, the company has rapidly grown to serve Fortune 500 clients across various industries.',
            funding: 'Series B - $25M',
            news: [
              {
                id: 1,
                title: 'TechCorp AI Raises $25M Series B',
                date: new Date('2024-01-10'),
                summary: 'Company announces Series B funding to accelerate AI platform development and expand enterprise client base.'
              },
              {
                id: 2,
                title: 'Partnership with Microsoft Azure',
                date: new Date('2024-01-05'),
                summary: 'Strategic partnership announced to integrate AI solutions with Microsoft Azure cloud platform.'
              }
            ],
            competitors: [
              {
                id: 1,
                name: 'DataMind Inc.',
                description: 'AI analytics platform for enterprise data',
                revenue: '$40M',
                employees: '120'
              },
              {
                id: 2,
                name: 'IntelliSoft',
                description: 'Business intelligence and AI automation',
                revenue: '$60M',
                employees: '200'
              }
            ]
          },
          {
            id: 2,
            name: 'FinanceFlow',
            domain: 'financeflow.com',
            industry: 'Fintech',
            size: 'Large',
            location: 'New York, NY',
            founded: '2015',
            revenue: '$200M',
            employees: '500',
            description: 'Digital banking platform serving millions of customers worldwide.',
            logo: null,
            fullDescription: 'FinanceFlow is a leading digital banking platform that has revolutionized personal and business banking through innovative technology and user-centric design.',
            funding: 'Series D - $100M',
            news: [
              {
                id: 1,
                title: 'FinanceFlow Expands to European Market',
                date: new Date('2024-01-12'),
                summary: 'Digital banking platform announces expansion into European markets with regulatory approval.'
              }
            ],
            competitors: [
              {
                id: 1,
                name: 'NeoBank',
                description: 'Mobile-first digital banking solution',
                revenue: '$150M',
                employees: '400'
              }
            ]
          }
        ]
        
        this.toast.add({
          severity: 'success',
          summary: 'Search Complete',
          detail: `Found ${this.searchResults.length} companies`,
          life: 3000
        })
      } catch (error) {
        this.toast.add({
          severity: 'error',
          summary: 'Search Failed',
          detail: 'Failed to perform search',
          life: 3000
        })
      } finally {
        this.searching = false
      }
    },
    
    viewFullReport(company) {
      this.selectedCompany = company
      this.showReportDialog = true
    },
    
    addToAccounts(company) {
      this.toast.add({
        severity: 'success',
        summary: 'Added to Accounts',
        detail: `${company.name} has been added to your accounts`,
        life: 3000
      })
    },
    
    findContacts(company) {
      this.toast.add({
        severity: 'info',
        summary: 'Finding Contacts',
        detail: `Searching for contacts at ${company.name}`,
        life: 3000
      })
    },
    
    exportResults() {
      this.toast.add({
        severity: 'info',
        summary: 'Exporting Results',
        detail: 'Research results are being exported',
        life: 3000
      })
    },
    
    getPlaceholder() {
      switch (this.selectedResearchType) {
        case 'company': return 'Enter company name or domain'
        case 'industry': return 'Enter industry name (e.g. fintech, healthcare)'
        case 'competitor': return 'Enter your company name for competitor analysis'
        case 'market': return 'Enter market or technology area'
        default: return 'Enter research target'
      }
    },
    
    async startResearch() {
      this.researching = true
      
      try {
        // Simulate research process
        await new Promise(resolve => setTimeout(resolve, 3000))
        
        this.toast.add({
          severity: 'success',
          summary: 'Research Started',
          detail: 'Your research has been queued and will be available shortly',
          life: 3000
        })
        
        this.showResearchDialog = false
        this.selectedResearchType = null
        this.researchTarget = ''
      } catch (error) {
        this.toast.add({
          severity: 'error',
          summary: 'Research Failed',
          detail: 'Failed to start research',
          life: 3000
        })
      } finally {
        this.researching = false
      }
    },
    
    formatDate(date) {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(date)
    }
  }
}
</script>

<style scoped>
.research-page {
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

.search-section {
  margin-bottom: 32px;
}

.search-form {
  padding: 24px;
}

.search-input-group {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.search-field {
  flex: 1;
}

.search-input {
  width: 100%;
}

.search-filters {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-dropdown {
  min-width: 150px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
}

.empty-icon {
  font-size: 64px;
  color: #667eea;
  margin-bottom: 24px;
}

.empty-state h3 {
  margin: 0 0 12px 0;
  color: #1f2937;
  font-size: 24px;
}

.sample-searches {
  margin-top: 32px;
}

.sample-searches h4 {
  margin: 0 0 16px 0;
  color: #374151;
}

.sample-search {
  margin: 8px 4px;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.results-header h3 {
  margin: 0;
  color: #1f2937;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 24px;
}

.result-card {
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}

.result-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.company-header {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.company-logo {
  width: 60px;
  height: 60px;
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
  font-size: 24px;
}

.company-info h4 {
  margin: 0 0 4px 0;
  color: #1f2937;
  font-size: 18px;
}

.company-info small {
  color: #6b7280;
  display: block;
  margin-bottom: 8px;
}

.company-tags {
  display: flex;
  gap: 6px;
}

.company-details {
  margin-bottom: 16px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  font-size: 14px;
}

.detail-label {
  font-weight: 600;
  color: #6b7280;
}

.company-description {
  margin-bottom: 16px;
}

.company-description p {
  margin: 0;
  color: #374151;
  font-size: 14px;
  line-height: 1.5;
}

.result-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.research-dialog {
  padding: 20px 0;
}

.research-options h4 {
  margin: 0 0 16px 0;
  color: #1f2937;
}

.research-types {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

.research-type-card {
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.research-type-card.selected {
  border-color: #667eea;
  box-shadow: 0 0 0 1px #667eea;
}

.research-type-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.type-content {
  text-align: center;
  padding: 20px;
}

.type-icon {
  font-size: 32px;
  color: #667eea;
  margin-bottom: 12px;
}

.type-content h5 {
  margin: 0 0 8px 0;
  color: #1f2937;
}

.type-content p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

.research-form .field {
  margin-bottom: 16px;
}

.research-form label {
  display: block;
  margin-bottom: 4px;
  font-weight: 600;
  color: #374151;
}

.full-report {
  padding: 20px 0;
}

.overview-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  margin-bottom: 32px;
}

.overview-item h4 {
  margin: 0 0 16px 0;
  color: #1f2937;
  font-size: 18px;
}

.info-grid {
  display: grid;
  gap: 12px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-item label {
  font-weight: 600;
  color: #6b7280;
  font-size: 12px;
  text-transform: uppercase;
}

.info-item span {
  color: #1f2937;
  font-size: 14px;
}

.company-summary h4 {
  margin: 0 0 12px 0;
  color: #1f2937;
  font-size: 18px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}

.company-summary p {
  margin: 0;
  color: #374151;
  line-height: 1.6;
}

.news-section {
  max-height: 400px;
  overflow-y: auto;
}

.news-item {
  padding: 16px 0;
  border-bottom: 1px solid #f3f4f6;
}

.news-item:last-child {
  border-bottom: none;
}

.news-item h5 {
  margin: 0 0 4px 0;
  color: #1f2937;
}

.news-date {
  color: #6b7280;
  font-size: 12px;
}

.news-item p {
  margin: 8px 0 0 0;
  color: #374151;
  font-size: 14px;
  line-height: 1.5;
}

.competitors-grid {
  display: grid;
  gap: 16px;
}

.competitor-card {
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.competitor-card h5 {
  margin: 0 0 8px 0;
  color: #1f2937;
}

.competitor-card p {
  margin: 0 0 8px 0;
  color: #6b7280;
  font-size: 14px;
}

.competitor-metrics {
  display: flex;
  gap: 16px;
}

.competitor-metrics small {
  color: #9ca3af;
  font-size: 12px;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 16px;
  }
  
  .search-input-group {
    flex-direction: column;
  }
  
  .search-filters {
    flex-direction: column;
  }
  
  .filter-dropdown {
    width: 100%;
  }
  
  .results-grid {
    grid-template-columns: 1fr;
  }
  
  .research-types {
    grid-template-columns: 1fr;
  }
  
  .overview-grid {
    grid-template-columns: 1fr;
  }
}
</style>