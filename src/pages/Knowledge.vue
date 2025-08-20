<template>
  <div class="knowledge-page">
    <div class="mb-4 flex align-items-center gap-3">
      <img 
        v-if="companyDomain && !logoError" 
        :src="`https://logo.clearbit.com/${companyDomain}`" 
        :alt="companyName || 'Company Logo'" 
        class="logo-img"
        @error="logoError = true"
      />
      <div v-else class="logo-fallback">
        <i class="pi pi-building"></i>
      </div>
      <h1 class="text-3xl font-bold text-color m-0">{{ companyName ? companyName : 'Knowledge' }}</h1>
    </div>

    <div class="card">
      <Accordion multiple :activeIndex="[0]">
        <AccordionTab header="Website">
          <div class="flex justify-content-between align-items-start gap-3">
            <div class="flex-1">
              <div class="font-semibold mb-1">Company Website</div>
              <div v-if="!editing.website" class="text-color-secondary">{{ onboarding.website || 'Not provided' }}</div>
              <InputText v-else v-model="editData.website" class="w-full" placeholder="Enter website URL" />
            </div>
            <div class="flex gap-2">
              <Button v-if="!editing.website" icon="pi pi-pencil" size="small" text @click="startEdit('website')" />
              <template v-else>
                <Button icon="pi pi-check" size="small" severity="success" @click="saveEdit('website')" />
                <Button icon="pi pi-times" size="small" severity="secondary" @click="cancelEdit('website')" />
              </template>
            </div>
          </div>
        </AccordionTab>

        <AccordionTab header="Product Description">
          <div class="flex justify-content-between align-items-start gap-3">
            <div class="flex-1">
              <div class="font-semibold mb-1">Description</div>
              <div v-if="!editing.description" class="text-color-secondary white-space-pre-line">{{ onboarding.description || 'Not provided' }}</div>
              <Textarea v-else v-model="editData.description" class="w-full" rows="4" placeholder="Enter product description" />
            </div>
            <div class="flex gap-2">
              <Button v-if="!editing.description" icon="pi pi-pencil" size="small" text @click="startEdit('description')" />
              <template v-else>
                <Button icon="pi pi-check" size="small" severity="success" @click="saveEdit('description')" />
                <Button icon="pi pi-times" size="small" severity="secondary" @click="cancelEdit('description')" />
              </template>
            </div>
          </div>
        </AccordionTab>

        <AccordionTab header="Value Proposition">
          <div class="flex justify-content-between align-items-start gap-3">
            <div class="flex-1">
              <div class="font-semibold mb-1">How we deliver value</div>
              <div v-if="!editing.valueProp" class="text-color-secondary white-space-pre-line">{{ onboarding.valueProp || 'Not provided' }}</div>
              <Textarea v-else v-model="editData.valueProp" class="w-full" rows="4" placeholder="Enter value proposition" />
            </div>
            <div class="flex gap-2">
              <Button v-if="!editing.valueProp" icon="pi pi-pencil" size="small" text @click="startEdit('valueProp')" />
              <template v-else>
                <Button icon="pi pi-check" size="small" severity="success" @click="saveEdit('valueProp')" />
                <Button icon="pi pi-times" size="small" severity="secondary" @click="cancelEdit('valueProp')" />
              </template>
            </div>
          </div>
        </AccordionTab>

        <AccordionTab header="Competitive Differentiation">
          <div class="flex justify-content-between align-items-start gap-3">
            <div class="flex-1">
              <div class="font-semibold mb-1">What makes us different</div>
              <div v-if="!editing.differentiation" class="text-color-secondary white-space-pre-line">{{ onboarding.differentiation || 'Not provided' }}</div>
              <Textarea v-else v-model="editData.differentiation" class="w-full" rows="4" placeholder="Enter competitive differentiation" />
            </div>
            <div class="flex gap-2">
              <Button v-if="!editing.differentiation" icon="pi pi-pencil" size="small" text @click="startEdit('differentiation')" />
              <template v-else>
                <Button icon="pi pi-check" size="small" severity="success" @click="saveEdit('differentiation')" />
                <Button icon="pi pi-times" size="small" severity="secondary" @click="cancelEdit('differentiation')" />
              </template>
            </div>
          </div>
        </AccordionTab>

        <AccordionTab header="Geographic Markets">
          <div class="grid">
            <div class="col-12">
              <div class="font-semibold mb-1">Regions</div>
              <div class="flex gap-2 flex-wrap">
                <Tag v-for="code in (onboarding.regions || [])" :key="code" :value="formatRegion(code)" />
                <span v-if="!onboarding.regions || onboarding.regions.length === 0" class="text-color-secondary">Not provided</span>
              </div>
            </div>
            <div class="col-12" v-if="onboarding.regionsOther">
              <div class="font-semibold mb-1">Other</div>
              <div class="text-color-secondary">{{ onboarding.regionsOther }}</div>
            </div>
          </div>
        </AccordionTab>

        <AccordionTab header="Ideal Customer Examples">
          <div v-if="(onboarding.examples || []).length > 0">
            <div v-for="(ex, i) in onboarding.examples" :key="i" class="mb-3">
              <div class="font-semibold">Example {{ i + 1 }}</div>
              <div class="text-color-secondary">Company: {{ ex.name || 'Not specified' }}</div>
              <div class="text-color-secondary">Website: {{ ex.website || 'Not specified' }}</div>
              <div class="text-color-secondary">Reason: {{ ex.reason || 'Not specified' }}</div>
            </div>
          </div>
          <div v-else class="text-color-secondary">Not provided</div>
        </AccordionTab>

        <AccordionTab header="Target Verticals">
          <div v-if="(onboarding.verticals || []).length > 0">
            <div v-for="(v, i) in onboarding.verticals" :key="i" class="mb-3">
              <div class="font-semibold">Vertical {{ i + 1 }}</div>
              <div class="text-color-secondary">Name: {{ v.name || 'Not specified' }}</div>
              <div class="text-color-secondary">Why they need us: {{ v.reason || 'Not specified' }}</div>
            </div>
          </div>
          <div v-else class="text-color-secondary">Not provided</div>
        </AccordionTab>

        <AccordionTab header="Target Titles/Roles">
          <div v-if="(onboarding.titles || []).length > 0">
            <div v-for="(t, i) in onboarding.titles" :key="i" class="mb-3">
              <div class="font-semibold">Title {{ i + 1 }}</div>
              <div class="text-color-secondary">Job Title: {{ t.title || 'Not specified' }}</div>
              <div class="text-color-secondary">Reason: {{ t.reason || 'Not specified' }}</div>
            </div>
          </div>
          <div v-else class="text-color-secondary">Not provided</div>
        </AccordionTab>

        <AccordionTab header="Problem Statement">
          <div class="flex justify-content-between align-items-start gap-3">
            <div class="flex-1">
              <div v-if="!editing.problem" class="text-color-secondary white-space-pre-line">{{ onboarding.problem || 'Not provided' }}</div>
              <Textarea v-else v-model="editData.problem" class="w-full" rows="4" placeholder="Enter problem statement" />
            </div>
            <div class="flex gap-2">
              <Button v-if="!editing.problem" icon="pi pi-pencil" size="small" text @click="startEdit('problem')" />
              <template v-else>
                <Button icon="pi pi-check" size="small" severity="success" @click="saveEdit('problem')" />
                <Button icon="pi pi-times" size="small" severity="secondary" @click="cancelEdit('problem')" />
              </template>
            </div>
          </div>
        </AccordionTab>

        <AccordionTab header="Customer Example & Outreach">
          <div class="mb-2">
            <div class="font-semibold mb-1">LinkedIn URL</div>
            <div class="text-color-secondary">{{ onboarding.linkedinUrl || 'Not provided' }}</div>
          </div>
          <div>
            <div class="font-semibold mb-1">Sample Message</div>
            <div class="text-color-secondary white-space-pre-line">{{ onboarding.sampleMessage || 'Not provided' }}</div>
          </div>
        </AccordionTab>

        <AccordionTab header="Documentation Uploads">
          <div v-if="(onboarding.uploads || []).length > 0" class="flex flex-column gap-2">
            <div v-for="(f, i) in onboarding.uploads" :key="i" class="flex align-items-center gap-2">
              <i class="pi pi-file"></i>
              <span>{{ f.name }} <span class="text-color-secondary">({{ formatFileSize(f.size) }})</span></span>
            </div>
          </div>
          <div v-else class="text-color-secondary">No documents uploaded</div>
        </AccordionTab>
      </Accordion>
    </div>
  </div>
</template>

<script>
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'

export default {
  name: 'Knowledge',
  components: {
    InputText,
    Textarea,
    Button
  },
  data() {
    return {
      onboarding: {},
      editData: {},
      editing: {},
      regionMap: {
        US: 'United States',
        CA: 'Canada',
        UK: 'United Kingdom',
        AU: 'Australia',
        EU: 'European Union',
        LATAM: 'Latin America',
        APAC: 'Asia-Pacific'
      },
      companyName: '',
      companyDomain: '',
      logoError: false
    }
  },
  mounted() {
    this.onboarding = this.loadOnboarding()
    this.deriveCompanyFromWebsite()
  },
  methods: {
    loadOnboarding() {
      try {
        return JSON.parse(localStorage.getItem('outbounder-onboarding') || '{}')
      } catch (_e) {
        return {}
      }
    },
    saveOnboarding() {
      localStorage.setItem('outbounder-onboarding', JSON.stringify(this.onboarding))
    },
    startEdit(field) {
      this.editData[field] = this.onboarding[field] || ''
      this.editing[field] = true
    },
    saveEdit(field) {
      this.onboarding[field] = this.editData[field]
      this.saveOnboarding()
      this.editing[field] = false
      
      // Update company name if website was edited
      if (field === 'website') {
        this.deriveCompanyFromWebsite()
      }
      
      this.$toast.add({
        severity: 'success',
        summary: 'Saved',
        detail: 'Changes saved successfully',
        life: 3000
      })
    },
    cancelEdit(field) {
      this.editing[field] = false
      delete this.editData[field]
    },
    deriveCompanyFromWebsite() {
      const url = this.onboarding && this.onboarding.website
      if (!url) return
      try {
        const u = new URL(url)
        const host = u.hostname
        this.companyDomain = host
        const namePart = host
          .replace(/^www\./, '')
          .split('.')
          .filter(Boolean)[0] || ''
        this.companyName = namePart ? namePart.charAt(0).toUpperCase() + namePart.slice(1) : ''
      } catch (_e) {
        // ignore
      }
    },
    formatRegion(code) {
      return this.regionMap[code] || code
    },
    formatFileSize(bytes) {
      if (!bytes && bytes !== 0) return ''
      const kb = bytes / 1024
      if (kb < 1024) return `${kb.toFixed(1)} KB`
      const mb = kb / 1024
      return `${mb.toFixed(1)} MB`
    }
  }
}
</script>

<style scoped>
.knowledge-page {
  max-width: 100%;
}

.white-space-pre-line { white-space: pre-line }

.logo-img {
  width: 36px;
  height: 36px;
  border-radius: 6px;
}

.logo-fallback {
  width: 36px;
  height: 36px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--surface-200);
}
</style>
