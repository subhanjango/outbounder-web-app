<template>
  <div class="onboarding">
    <div class="card w-full" style="max-width: 900px; margin: 0 auto">
      <div class="mb-3 flex align-items-start justify-content-between">
        <div>
          <h2 class="m-0">Step 11 of 11 — Documentation Upload (Optional)</h2>
          <p class="text-color-secondary m-0">Upload any relevant documentation to help us understand your business.</p>
        </div>
        <Button label="Skip for now" text @click="skip" />
      </div>
      <div class="flex flex-column gap-3">
        <FileUpload 
          mode="advanced" 
          name="files[]"
          :customUpload="true"
          accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
          :multiple="true"
          chooseLabel="Browse"
          uploadLabel="Simulate Upload"
          cancelLabel="Clear"
          @uploader="onUpload"
        />
        <div class="flex justify-content-between">
          <Button label="Back" icon="pi pi-arrow-left" @click="$router.back()" text />
          <Button label="Finish" icon="pi pi-check" @click="finish" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FileUpload from 'primevue/fileupload'
import Button from 'primevue/button'

export default {
  name: 'OnboardingStep11',
  components: { FileUpload, Button },
  methods: {
    onUpload(event) {
      const files = (event && event.files) || []
      const data = JSON.parse(localStorage.getItem('outbounder-onboarding') || '{}')
      data.uploads = files.map(f => ({ name: f.name, size: f.size, type: f.type }))
      localStorage.setItem('outbounder-onboarding', JSON.stringify(data))
      this.$toast.add({ severity: 'success', summary: 'Files added', life: 2000 })
    },
    saveOnboardingToKnowledge() {
      const onboardingData = JSON.parse(localStorage.getItem('outbounder-onboarding') || '{}')
      const existingKnowledge = JSON.parse(localStorage.getItem('outbounder-knowledge') || '[]')
      const newEntries = []

      // Company Information
      if (onboardingData.website) {
        newEntries.push({
          id: Date.now() + 1,
          title: 'Company Website',
          description: 'Company website from onboarding',
          category: 'companies',
          content: `Company Website: ${onboardingData.website}`,
          tags: ['Company Info', 'Onboarding'],
          lastUpdated: new Date(),
          author: 'Onboarding Wizard'
        })
      }

      // Product Description
      if (onboardingData.description) {
        newEntries.push({
          id: Date.now() + 2,
          title: 'Product Description',
          description: 'Product/service description from onboarding',
          category: 'companies',
          content: onboardingData.description,
          tags: ['Product', 'Description', 'Onboarding'],
          lastUpdated: new Date(),
          author: 'Onboarding Wizard'
        })
      }

      // Value Proposition
      if (onboardingData.valueProp) {
        newEntries.push({
          id: Date.now() + 3,
          title: 'Value Proposition',
          description: 'How we deliver value to customers',
          category: 'sales',
          content: onboardingData.valueProp,
          tags: ['Value Prop', 'Sales', 'Onboarding'],
          lastUpdated: new Date(),
          author: 'Onboarding Wizard'
        })
      }

      // Competitive Differentiation
      if (onboardingData.differentiation) {
        newEntries.push({
          id: Date.now() + 4,
          title: 'Competitive Differentiation',
          description: 'What makes us different from competitors',
          category: 'market',
          content: onboardingData.differentiation,
          tags: ['Competition', 'Differentiation', 'Onboarding'],
          lastUpdated: new Date(),
          author: 'Onboarding Wizard'
        })
      }

      // Geographic Markets
      if (onboardingData.regions && onboardingData.regions.length > 0) {
        const regionContent = `Target Regions: ${onboardingData.regions.join(', ')}${onboardingData.regionsOther ? `\nOther Regions: ${onboardingData.regionsOther}` : ''}`
        newEntries.push({
          id: Date.now() + 5,
          title: 'Target Geographic Markets',
          description: 'Geographic markets we sell into',
          category: 'market',
          content: regionContent,
          tags: ['Geography', 'Markets', 'Onboarding'],
          lastUpdated: new Date(),
          author: 'Onboarding Wizard'
        })
      }

      // Customer Examples
      if (onboardingData.examples && onboardingData.examples.length > 0) {
        const validExamples = onboardingData.examples.filter(ex => ex.name || ex.reason)
        if (validExamples.length > 0) {
          const exampleContent = validExamples.map((ex, i) => 
            `Example ${i + 1}:\nCompany: ${ex.name || 'Not specified'}\nWebsite: ${ex.website || 'Not specified'}\nWhy they're ideal: ${ex.reason || 'Not specified'}`
          ).join('\n\n')
          
          newEntries.push({
            id: Date.now() + 6,
            title: 'Ideal Customer Examples',
            description: 'Examples of best-fit customers',
            category: 'people',
            content: exampleContent,
            tags: ['Customers', 'Examples', 'Onboarding'],
            lastUpdated: new Date(),
            author: 'Onboarding Wizard'
          })
        }
      }

      // Target Verticals
      if (onboardingData.verticals && onboardingData.verticals.length > 0) {
        const validVerticals = onboardingData.verticals.filter(v => v.name || v.reason)
        if (validVerticals.length > 0) {
          const verticalContent = validVerticals.map((v, i) => 
            `Vertical ${i + 1}:\nName: ${v.name || 'Not specified'}\nWhy they need our product/service: ${v.reason || 'Not specified'}`
          ).join('\n\n')
          
          newEntries.push({
            id: Date.now() + 7,
            title: 'Target Verticals',
            description: 'Industries and verticals we target',
            category: 'market',
            content: verticalContent,
            tags: ['Verticals', 'Industries', 'Onboarding'],
            lastUpdated: new Date(),
            author: 'Onboarding Wizard'
          })
        }
      }

      // Target Job Titles
      if (onboardingData.titles && onboardingData.titles.length > 0) {
        const validTitles = onboardingData.titles.filter(t => t.title || t.reason)
        if (validTitles.length > 0) {
          const titleContent = validTitles.map((t, i) => 
            `Title ${i + 1}:\nJob Title: ${t.title || 'Not specified'}\nReason for targeting: ${t.reason || 'Not specified'}`
          ).join('\n\n')
          
          newEntries.push({
            id: Date.now() + 8,
            title: 'Target Job Titles',
            description: 'Job titles and roles we target',
            category: 'people',
            content: titleContent,
            tags: ['Job Titles', 'Targeting', 'Onboarding'],
            lastUpdated: new Date(),
            author: 'Onboarding Wizard'
          })
        }
      }

      // Problem Statement
      if (onboardingData.problem) {
        newEntries.push({
          id: Date.now() + 9,
          title: 'Customer Problem Statement',
          description: 'Problems we solve for customers',
          category: 'sales',
          content: onboardingData.problem,
          tags: ['Problems', 'Customer Pain', 'Onboarding'],
          lastUpdated: new Date(),
          author: 'Onboarding Wizard'
        })
      }

      // Customer Example & Outreach
      if (onboardingData.linkedinUrl || onboardingData.sampleMessage) {
        const outreachContent = `LinkedIn URL: ${onboardingData.linkedinUrl || 'Not provided'}\n\nSample Message:\n${onboardingData.sampleMessage || 'Not provided'}`
        newEntries.push({
          id: Date.now() + 10,
          title: 'Customer Outreach Example',
          description: 'Sample customer and outreach message',
          category: 'templates',
          content: outreachContent,
          tags: ['Outreach', 'LinkedIn', 'Templates', 'Onboarding'],
          lastUpdated: new Date(),
          author: 'Onboarding Wizard'
        })
      }

      // Save to knowledge base
      const updatedKnowledge = [...existingKnowledge, ...newEntries]
      localStorage.setItem('outbounder-knowledge', JSON.stringify(updatedKnowledge))

      return newEntries.length
    },
    finish() {
      const savedCount = this.saveOnboardingToKnowledge()
      localStorage.setItem('outbounder-onboarding-status', JSON.stringify({ completed: true, at: Date.now() }))
      
      if (savedCount > 0) {
        this.$toast.add({ 
          severity: 'success', 
          summary: 'Onboarding Complete!', 
          detail: `${savedCount} knowledge entries saved to your Knowledge base`,
          life: 4000 
        })
      }
      
      setTimeout(() => {
        this.$router.replace('/')
      }, 1000)
    },
    skip() {
      const savedCount = this.saveOnboardingToKnowledge()
      localStorage.setItem('outbounder-onboarding-status', JSON.stringify({ completed: true, skipped: true, at: Date.now() }))
      
      if (savedCount > 0) {
        this.$toast.add({ 
          severity: 'info', 
          summary: 'Onboarding Skipped', 
          detail: `${savedCount} knowledge entries saved to your Knowledge base`,
          life: 4000 
        })
      }
      
      setTimeout(() => {
        this.$router.replace('/')
      }, 1000)
    }
  }
}
</script>

<style scoped>
.onboarding { padding: 2rem }
</style>


