<template>
  <div class="company-detail">
    <TabView>
      <TabPanel header="Knowledge">
        <div class="tab-content">
          <div class="knowledge-layout">
            <!-- Left side - Company Overview (1/3) -->
            <div class="company-overview">
              <h3>Company Overview</h3>
              
            <!-- Company Logo and Name -->
              <div class="company-header">
                <img 
                  v-if="company?.website"
                  :src="`https://logo.clearbit.com/${company.website}`" 
                  :alt="company.name"
                  class="company-logo"
                  @error="$event.target.style.display='none'"
                />
                <div class="company-name">{{ company?.name || 'Loading...' }}</div>
            </div>

              <div class="overview-items">
                <div class="overview-item">
                  <label class="overview-label">Website</label>
                  <div class="overview-value">
                    <a v-if="company?.website" :href="`https://${company.website}`" target="_blank" class="text-primary no-underline">
                      {{ company.website }}
                    </a>
                    <span v-else class="text-500">Not available</span>
                  </div>
                </div>

                <div class="overview-item">
                  <label class="overview-label">LinkedIn URL</label>
                  <div class="overview-value">
                    <a v-if="company?.linkedinUrl" :href="company.linkedinUrl" target="_blank" class="text-primary no-underline link-icon">
                      <i class="pi pi-external-link"></i>
                    </a>
                    <span v-else class="text-500">Not available</span>
                  </div>
                </div>

                <div class="overview-item">
                  <label class="overview-label">Headcount</label>
                  <div class="overview-value">{{ company?.peopleCount || 'Not available' }}</div>
                </div>

                <div class="overview-item">
                  <label class="overview-label">Address</label>
                  <div class="overview-value">{{ company?.address || 'Not available' }}</div>
                </div>

                <div class="overview-item">
                  <label class="overview-label">Status</label>
                  <div class="overview-value">
                    <Tag 
                      v-if="company?.status"
                      :value="company.status" 
                      :severity="getStatusSeverity(company.status)"
                    />
                    <span v-else class="text-500">Not available</span>
                  </div>
                </div>

                <div class="overview-item">
                  <label class="overview-label">Tags</label>
                  <div class="overview-value">
                    <div v-if="company?.tags && company.tags.length > 0" class="flex gap-2 flex-wrap">
                      <Chip 
                        v-for="tag in company.tags" 
                        :key="tag" 
                        :label="tag"
                        class="text-sm"
                      />
                    </div>
                    <span v-else class="text-500">No tags</span>
                  </div>
                </div>
                
                <div class="overview-item">
                  <label class="overview-label">Description</label>
                  <div class="overview-value">
                    {{ company?.description || 'No description available' }}
                  </div>
                </div>
          </div>
        </div>
            
            <!-- Right side - Knowledge Sections (2/3) -->
            <div class="knowledge-content">
              <Accordion multiple>
                <!-- Company Overview -->
                <AccordionTab header="Company Overview">
                  <div class="knowledge-section">
                    <p class="mb-3">{{ getCompanyOverview() }}</p>
                  </div>
                </AccordionTab>
                
                <!-- News -->
                <AccordionTab header="News">
                  <div class="knowledge-section">
                    <p class="mb-3">{{ getCompanyNews() }}</p>
                  </div>
                </AccordionTab>
                
                <!-- Revenue Model -->
                <AccordionTab header="How this company generates revenue">
                  <div class="knowledge-section">
                    <p class="mb-3">{{ getRevenueModel() }}</p>
                  </div>
                </AccordionTab>
                
                <!-- Contextual Research -->
                <AccordionTab header="Contextual Research">
                  <div class="knowledge-section">
                    <p class="mb-3">{{ getContextualResearch() }}</p>
                  </div>
                </AccordionTab>
                

              </Accordion>
        </div>
      </div>
    </div>
      </TabPanel>
      
      <TabPanel header="People">
        <div class="tab-content">
          <h3>People</h3>
          <p>Company people and contacts will go here.</p>
        </div>
      </TabPanel>
      
      <TabPanel header="Activities">
        <div class="tab-content">
          <h3>Activities</h3>
          <p>Company activities and interactions will go here.</p>
        </div>
      </TabPanel>
    </TabView>
  </div>
</template>

<script>
import { TabView, TabPanel, Chip, Tag, Accordion, AccordionTab } from 'primevue'

export default {
  name: 'CompanyDetail',
  components: {
    TabView,
    TabPanel,
    Chip,
    Tag,
    Accordion,
    AccordionTab
  },
  data() {
    return {
      company: null
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
      
      // Try to load company data from the same source as Company.vue
      const savedCompanies = this.getCompaniesFromLocalStorage()
      
      // Find the company by name
      this.company = savedCompanies.find(company => 
        company.name.toLowerCase() === companyName?.toLowerCase()
      )
      
      // If not found, create a fallback with basic data
      if (!this.company) {
        this.company = {
          name: companyName || 'Unknown Company',
          website: 'example.com',
          peopleCount: 50,
          status: 'Active',
          tags: ['Technology'],
          linkedinUrl: null,
          address: 'Unknown',
          description: 'Company information not available.'
        }
      }
    },
    
    getCompaniesFromLocalStorage() {
      // This should match exactly the same data structure as Company.vue
      return [
        {
          name: 'Clay',
          website: 'clay.com',
          peopleCount: 85,
          status: 'Active',
          researchStatus: 'In Progress',
          tags: ['Data Platform', 'SaaS', 'B2B'],
          linkedinUrl: 'https://linkedin.com/company/clay-earth',
          address: 'San Francisco, CA',
          industry: 'Data & Analytics',
          revenue: '$10M - $50M',
          description: 'Clay is a data platform that helps sales and marketing teams find, enrich, and personalize outreach to their ideal customers. The platform combines 50+ data providers into a single interface.',
          aiColumn: 'Strong product-market fit'
        },
        {
          name: 'Hightouch',
          website: 'hightouch.com',
          peopleCount: 120,
          status: 'Won',
          researchStatus: 'Complete',
          tags: ['Data Infrastructure', 'CDP', 'Analytics'],
          linkedinUrl: 'https://linkedin.com/company/hightouch',
          address: 'San Francisco, CA',
          industry: 'Data Infrastructure',
          revenue: '$50M - $100M',
          description: 'Hightouch is the leading Composable Customer Data Platform (CDP) that helps companies sync customer data from their data warehouse to operational tools.',
          aiColumn: 'Ideal customer profile match'
        },
        {
          name: 'Baremetrics',
          website: 'baremetrics.com',
          peopleCount: 45,
          status: 'Active',
          researchStatus: 'Complete',
          tags: ['SaaS Analytics', 'Metrics', 'Subscription'],
          linkedinUrl: 'https://linkedin.com/company/baremetrics',
          address: 'Remote',
          industry: 'SaaS Analytics',
          revenue: '$5M - $25M',
          description: 'Baremetrics provides subscription analytics and insights for SaaS businesses, helping them understand their revenue, churn, and growth metrics.',
          aiColumn: 'High engagement potential'
        }
      ]
    },
    

    
    getStatusSeverity(status) {
      switch (status) {
        case 'Won': return 'success'
        case 'Lost': return 'danger'
        case 'Active': return 'info'
        default: return null
      }
    },
    
    getCompanyOverview() {
      if (!this.company) return 'Loading...'
      
      const companyName = this.company.name
      
      if (companyName.toLowerCase() === 'clay') {
        return `Clay operates as a comprehensive data enrichment and sales intelligence platform that serves as the backbone for modern sales and marketing operations. The company primarily targets mid-market to enterprise B2B organizations, including high-growth SaaS companies, sales development teams, and marketing agencies that require sophisticated data capabilities to scale their outbound efforts.

        The platform addresses the critical challenge of data fragmentation by aggregating information from over 50 data providers into a single, unified interface. This approach allows sales teams to build comprehensive prospect lists, enrich lead data with contact information, company insights, and behavioral signals, and automate personalized outreach sequences at scale.

        Clay's customer base spans various industries including technology, professional services, real estate, and financial services. Notable customers include companies like Notion, Retool, and dozens of rapidly growing startups that depend on data-driven sales processes to fuel their growth engines.

        In the competitive landscape, Clay faces competition from established players like ZoomInfo, Apollo, and Outreach, as well as emerging point solutions like Instantly and Reply.io. However, Clay differentiates itself through its no-code approach to data workflows, extensive integrator ecosystem, and focus on data quality and compliance. The company operates in the broader sales technology market, which has seen significant consolidation and growth, particularly in the data enrichment and sales automation segments.`
      } else if (companyName.toLowerCase() === 'hightouch') {
        return `Hightouch positions itself as the leading Composable Customer Data Platform (CDP) in the modern data stack, serving enterprise customers who have already invested heavily in cloud data warehouses like Snowflake, BigQuery, and Databrick. The company primarily targets data-forward organizations including e-commerce platforms, SaaS companies, financial services firms, and digital native brands that generate substantial customer data volumes.

        The platform solves the "last mile" problem in data activation by enabling companies to sync customer data from their data warehouse directly to operational tools like Salesforce, Google Ads, Facebook, and email marketing platforms. This reverse ETL approach allows organizations to leverage their existing data investments without building custom integrations or moving data to yet another platform.

        Hightouch's customer base includes notable companies like Spotify, NBA, Plaid, and Retool, representing organizations that have sophisticated data infrastructure and need to activate customer data across multiple touchpoints. These customers typically have dedicated data teams and significant budget allocated to data tooling and infrastructure.

        The competitive landscape includes traditional CDPs like Segment and mParticle, as well as emerging reverse ETL providers like Census and Rudderstack. However, Hightouch differentiates through its composable approach, extensive connector library, and deep integrations with modern data stack tools. The company operates in the rapidly growing customer data platform market, which is expected to reach $15.3 billion by 2025, driven by increasing focus on customer experience and data privacy regulations.`
      } else {
        return `${companyName} operates in the technology sector, serving businesses with innovative solutions designed to address specific market challenges. The company targets organizations looking to improve operational efficiency and drive growth through strategic technology implementation.

        The customer base primarily consists of mid-market companies across various industries who are seeking to modernize their operations and improve competitive positioning. These organizations typically have dedicated budgets for technology solutions and understand the value of strategic investments in digital transformation.

        In the competitive landscape, ${companyName} faces competition from both established enterprise software providers and emerging startups in their specific vertical. The company differentiates through its focused approach to solving specific business challenges and commitment to customer success.

        The broader market opportunity continues to expand as organizations increasingly recognize the importance of technology in driving business outcomes. ${companyName} is well-positioned to capture market share through its innovative approach and customer-centric business model.`
      }
    },
    
    getCompanyNews() {
      if (!this.company) return 'Loading...'
      
      const companyName = this.company.name
      
      if (companyName.toLowerCase() === 'clay') {
        return `Recent developments at Clay indicate strong momentum in the sales intelligence market. The company recently announced a significant Series B funding round led by General Catalyst, bringing total funding to over $50 million. This investment will be used to expand their data provider network and enhance platform capabilities.

        In Q3 2024, Clay launched their new AI-powered data enrichment features, allowing users to generate personalized insights and automate data research workflows. The release has been well-received by customers, with reported improvements in data accuracy and time savings.

        The company has also been expanding internationally, with new data partnerships in Europe and Asia-Pacific regions. This expansion comes in response to growing demand from global customers who require compliance with local data protection regulations.

        Clay's leadership team has been actively speaking at major sales and marketing conferences, sharing insights on the future of data-driven sales. CEO Kareem Amin recently keynoted at SaaStr Annual, discussing the evolution of sales technology and the importance of data quality in modern sales operations.

        Industry analysts have noted Clay's rapid growth trajectory, with the platform reportedly processing over 1 billion data enrichment requests monthly. This scale positions the company as a significant player in the competitive sales intelligence landscape.`
      } else if (companyName.toLowerCase() === 'hightouch') {
        return `Hightouch has been making significant strides in the customer data platform space throughout 2024. The company recently announced a strategic partnership with Snowflake, becoming a preferred partner for reverse ETL solutions. This partnership includes joint go-to-market initiatives and technical integrations that streamline data activation workflows.

        In recent months, Hightouch has expanded its product offering with the launch of Customer Studio, a no-code interface that allows business users to create and manage customer segments without SQL knowledge. This development addresses a key market need for democratizing data access across organizations.

        The company completed a Series B funding round led by Amplify Partners, raising $40 million to accelerate product development and market expansion. The funding will support international growth initiatives and the development of industry-specific solutions for retail, financial services, and healthcare sectors.

        Hightouch's co-founder and CEO Tejas Manohar was recently featured in Forbes' "30 Under 30" list for enterprise technology, recognizing his contributions to the modern data stack ecosystem. The company has also been recognized as a "Cool Vendor" by Gartner in their Customer Data Platform report.

        Recent customer wins include major retailers and financial services companies who are leveraging Hightouch to power personalized marketing campaigns and improve customer experience. The platform now supports over 150 destination connectors, making it one of the most comprehensive reverse ETL solutions in the market.`
      } else {
        return `${companyName} has been maintaining steady progress in their market segment throughout 2024. Recent company updates suggest continued focus on product development and customer expansion initiatives.

        The leadership team has been actively engaging with industry publications and conferences, sharing insights on market trends and the company's strategic direction. This thought leadership approach has helped establish ${companyName} as a credible voice in their sector.

        Recent product releases have focused on improving user experience and adding new capabilities that address evolving customer needs. Customer feedback has been positive, with reports of improved efficiency and measurable business outcomes.

        The company has also been investing in partnerships and integrations that expand platform capabilities and provide additional value to customers. These strategic relationships position ${companyName} for continued growth in their target market.

        Industry observers note that ${companyName} is well-positioned to capitalize on ongoing market trends and continue their growth trajectory. The company's focus on innovation and customer success provides a strong foundation for future expansion.`
      }
    },
    
    getRevenueModel() {
      if (!this.company) return 'Loading...'
      
      const companyName = this.company.name
      
      if (companyName.toLowerCase() === 'clay') {
        return `Clay operates on a usage-based SaaS model that aligns pricing with customer value and data consumption. The company generates revenue through multiple streams centered around data enrichment credits and platform access.

        The primary revenue driver is their credit-based system, where customers purchase data enrichment credits that are consumed when accessing information from Clay's extensive network of data providers. This model creates predictable revenue while scaling with customer usage patterns. Enterprise customers typically consume thousands of credits monthly, resulting in significant annual contract values.

        Clay also offers tiered subscription plans ranging from individual professional accounts ($300-500/month) to enterprise solutions ($2,000-10,000+/month). Higher tiers include additional features like team collaboration tools, advanced automation capabilities, and priority data refresh rates.

        The company generates additional revenue through professional services, including implementation support, custom integrations, and strategic consulting for large enterprise customers. These services typically represent 15-20% of total revenue and carry higher margins than software subscriptions.

        Clay's data marketplace model creates a unique revenue stream by taking a percentage of transactions when customers access premium data providers through the platform. This approach allows Clay to monetize their data aggregation capabilities while providing customers with transparent, usage-based pricing.

        The company's land-and-expand strategy focuses on acquiring customers with smaller initial commitments and growing accounts through increased usage and feature adoption. This approach has resulted in strong net revenue retention rates exceeding 120%.`
      } else if (companyName.toLowerCase() === 'hightouch') {
        return `Hightouch operates on an enterprise SaaS model with pricing based on data volume processed and number of destination syncs. The company's revenue model is designed to scale with customer data maturity and business growth.

        The primary revenue stream comes from monthly and annual subscriptions that include a base platform fee plus usage-based charges for data rows processed. Enterprise customers typically process millions of records monthly, resulting in substantial recurring revenue. Pricing tiers start at approximately $1,000/month for mid-market customers and can exceed $50,000/month for large enterprise accounts.

        Hightouch generates significant revenue from professional services, including implementation, custom connector development, and ongoing consulting services. These high-margin services often represent 25-30% of initial contract value and help ensure successful customer deployments.

        The company offers dedicated cloud deployments for enterprise customers with strict security and compliance requirements. These private cloud offerings command premium pricing and provide predictable infrastructure revenue streams.

        Revenue expansion occurs through increased data volume processing, additional destination connectors, and advanced features like real-time syncing and custom transformations. The platform's usage-based model naturally grows with customer success, creating strong alignment between customer value and Hightouch revenue.

        Strategic partnerships with cloud data warehouse providers create additional revenue opportunities through revenue sharing arrangements and joint customer engagements. These partnerships also reduce customer acquisition costs and improve sales efficiency.

        Hightouch's focus on enterprise customers results in high average contract values and strong revenue retention rates, with most customers expanding their usage significantly within the first year of deployment.`
      } else {
        return `${companyName} employs a traditional SaaS revenue model focused on recurring subscription revenue from enterprise and mid-market customers. The company generates revenue through multiple subscription tiers designed to serve different customer segments and use cases.

        The primary revenue stream consists of monthly and annual subscription fees that provide access to core platform capabilities. Pricing is typically based on user seats, transaction volume, or feature access, depending on the specific product offering and customer requirements.

        Professional services represent an important secondary revenue stream, including implementation, training, and ongoing support services. These services ensure successful customer deployments and drive higher customer satisfaction and retention rates.

        The company employs a land-and-expand strategy, focusing on initial customer acquisition with competitive entry-level pricing and expanding revenue through additional users, features, and use cases over time. This approach results in strong net revenue retention as customers grow their usage.

        Enterprise customers often require custom integrations and dedicated support, which command premium pricing and contribute to higher average contract values. These enterprise relationships provide predictable revenue and serve as references for additional customer acquisition.

        Strategic partnerships and integrations create additional revenue opportunities while reducing customer acquisition costs. The company continues to invest in expanding these partnership relationships to drive sustainable revenue growth.`
      }
    },
    
    getContextualResearch() {
      if (!this.company) return 'Loading...'
      
      const companyName = this.company.name
      
      if (companyName.toLowerCase() === 'clay') {
        return `As a sales research analyst, Clay presents a compelling opportunity for our data infrastructure and sales enablement solutions. Clay's rapid growth and focus on data aggregation creates multiple entry points for our services.

        Primary Opportunity: Clay's expansion into enterprise markets requires sophisticated data infrastructure that can handle increased volume and compliance requirements. Our enterprise data platform could support Clay's scaling needs while ensuring GDPR and CCPA compliance across their data aggregation workflows.

        Technical Integration Points: Clay's API-first architecture aligns well with our platform capabilities. We can provide enhanced data processing, real-time sync capabilities, and advanced analytics that would differentiate Clay's offering in the competitive sales intelligence market.

        Business Case Drivers: Clay's usage-based revenue model means any improvements in data processing efficiency directly impact their margins. Our solutions could reduce their data processing costs by 30-40% while improving data freshness and accuracy, creating immediate ROI.

        Competitive Advantages: Unlike competitors who offer generic solutions, our platform is specifically designed for high-volume data operations with built-in compliance and governance features. This alignment with Clay's core business requirements positions us as a strategic partner rather than just a vendor.

        Decision Maker Insights: Clay's technical leadership likely prioritizes scalability, reliability, and compliance given their rapid growth trajectory. Our track record with similar high-growth data companies provides credible proof points for successful implementations.

        Implementation Strategy: A phased approach starting with a pilot integration for their European data operations would demonstrate value while minimizing risk. Success metrics would include improved data processing speed, reduced infrastructure costs, and enhanced compliance reporting.

        Long-term Partnership Potential: As Clay continues expanding globally and adding new data sources, our platform could become integral to their infrastructure. This strategic relationship could evolve into revenue sharing opportunities and joint go-to-market initiatives.

        The timing is optimal as Clay is actively investing in infrastructure improvements and compliance capabilities. Their recent funding provides budget availability, and their growth trajectory creates urgency for scalable solutions.`
      } else if (companyName.toLowerCase() === 'hightouch') {
        return `From a sales research perspective, Hightouch represents an exceptional opportunity for our data governance and compliance platform. Their position as a leader in reverse ETL creates natural synergies with our capabilities.

        Strategic Value Proposition: Hightouch's enterprise customers increasingly require sophisticated data governance and lineage tracking as they scale their data activation programs. Our platform provides comprehensive data governance capabilities that would enhance Hightouch's enterprise value proposition.

        Market Timing: With increasing data privacy regulations and enterprise focus on data governance, Hightouch needs robust compliance features to compete against traditional CDPs. Our solution addresses this exact requirement while maintaining their composable architecture approach.

        Technical Alignment: Hightouch's integration with modern data warehouses aligns perfectly with our platform's native cloud-first design. We can provide seamless data lineage tracking, automated compliance reporting, and real-time governance monitoring across all their customer data flows.

        Revenue Impact Opportunity: Enterprise customers often delay Hightouch implementations due to governance concerns. Our integrated solution could accelerate sales cycles and enable Hightouch to target larger enterprise accounts with comprehensive compliance requirements.

        Competitive Differentiation: Traditional CDPs like Segment include basic governance features, but lack the depth required for enterprise compliance. Our partnership with Hightouch would create a unique market position combining best-in-class reverse ETL with enterprise-grade governance.

        Implementation Approach: A joint solution offering would position both companies as leaders in the governed data activation space. We could provide white-labeled governance features integrated directly into Hightouch's platform, creating seamless user experience.

        Customer Success Metrics: Joint customers would benefit from reduced compliance overhead, faster audit responses, and improved data quality monitoring. These measurable outcomes support premium pricing and reduce customer churn.

        Long-term Strategic Value: As data regulations continue evolving globally, the governance layer becomes increasingly critical. Our partnership with Hightouch positions both companies at the forefront of compliant data activation, creating sustainable competitive advantages and expanding addressable market opportunities.`
      } else {
        return `As a sales research analyst evaluating ${companyName}, several factors indicate strong potential for our platform solutions. The company's growth trajectory and market position create multiple opportunities for strategic engagement.

        Value Proposition Alignment: ${companyName}'s focus on operational efficiency aligns well with our platform's core capabilities. Our solutions could provide measurable improvements in their key business metrics while reducing operational overhead.

        Market Position Analysis: ${companyName} operates in a competitive landscape where technology differentiation is crucial. Our platform could provide competitive advantages that support their market positioning and growth objectives.

        Technical Integration Opportunities: The company's existing technology stack appears compatible with our platform architecture. Integration possibilities include enhanced analytics, improved automation capabilities, and advanced reporting features.

        Business Case Development: ${companyName}'s current business model suggests they would benefit from solutions that improve operational efficiency and reduce costs. Our platform could deliver ROI through process automation and improved resource utilization.

        Decision Maker Profile: Based on company size and industry vertical, decision makers likely prioritize solutions that provide clear business value and measurable outcomes. Our track record in similar organizations provides relevant proof points.

        Implementation Strategy: A phased approach would minimize risk while demonstrating value. Initial focus areas could include core operational improvements with expansion into additional use cases based on proven success.

        Competitive Considerations: ${companyName} likely evaluates multiple solution providers. Our differentiation through industry-specific capabilities and proven implementation methodology provides competitive advantages.

        The overall opportunity represents strong potential for mutual benefit, with ${companyName}'s growth trajectory creating natural expansion opportunities for our platform capabilities over time.`
      }
    },
    

  }
}
</script>

<style scoped>
.company-detail {
  height: 100%;
}

.tab-content {
  padding: 1.5rem;
}

.tab-content h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: var(--text-color);
}

.tab-content p {
  color: var(--text-color-secondary);
  line-height: 1.6;
}

/* Enhanced tab styling for better visibility */
:deep(.p-tabview-nav) {
  border-bottom: 2px solid var(--surface-border);
}

:deep(.p-tabview-nav-link) {
  padding: 1rem 1.5rem;
  font-weight: 500;
  border-radius: 6px 6px 0 0;
  transition: all 0.2s ease;
}

:deep(.p-tabview-nav-link:hover) {
  background-color: var(--surface-hover);
}

:deep(.p-tabview-selected .p-tabview-nav-link) {
  background-color: var(--primary-color);
  color: var(--primary-color-text);
  border-bottom: 3px solid var(--primary-color);
  font-weight: 600;
}

:deep(.p-tabview-panels) {
  background: var(--surface-card);
  border-radius: 0 6px 6px 6px;
  border: 1px solid var(--surface-border);
  border-top: none;
}

/* Knowledge tab layout */
.knowledge-layout {
  display: flex;
  gap: 2rem;
  height: 100%;
  min-height: 500px;
}

.company-overview {
  flex: 0 0 33.333%;
  background: var(--surface-section);
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid var(--surface-border);
}

.company-overview h3 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: var(--text-color);
  font-size: 1.25rem;
  font-weight: 600;
}

.company-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--surface-border);
}

.company-logo {
  width: 3rem;
  height: 3rem;
  border-radius: 6px;
  border: 1px solid var(--surface-border);
  object-fit: contain;
  background: white;
  padding: 4px;
}

.company-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-color);
}

.overview-items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.overview-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  padding: 0.375rem 0;
}

.overview-label {
  font-weight: 600;
  color: var(--text-color-secondary);
  font-size: 0.875rem;
  min-width: 100px;
  flex-shrink: 0;
}

.overview-value {
  color: var(--text-color);
  font-size: 0.95rem;
  line-height: 1.4;
  text-align: left;
  flex: 1;
}

.knowledge-content {
  flex: 1;
  padding-left: 1rem;
  overflow-y: auto;
}

.knowledge-section {
  padding: 0.5rem 0;
}

.knowledge-section p {
  line-height: 1.6;
  color: var(--text-color);
  margin: 0;
  white-space: pre-line;
}



.placeholder-content {
  text-align: center;
  color: var(--text-color-secondary);
}

.no-underline {
  text-decoration: none;
}

.no-underline:hover {
  text-decoration: underline;
}

.link-icon {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.link-icon:hover {
  background-color: var(--surface-hover);
  text-decoration: none !important;
}

.link-icon i {
  font-size: 1rem;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .knowledge-layout {
    flex-direction: column;
    gap: 1rem;
  }
  
  .company-overview {
    flex: none;
  }
}
</style>