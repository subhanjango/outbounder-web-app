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
        <Button 
          label="Create Campaign" 
          icon="pi pi-megaphone" 
          outlined 
          @click="openDraftOutreachDialog"
          :disabled="!selectedContacts || selectedContacts.length === 0"
        />
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

  <!-- Create Campaign Dialog -->
  <Dialog v-model:visible="showDraftOutreachDialog" modal :header="getCampaignDialogTitle()" :style="{width: '800px'}" :closable="true">
    <div class="flex flex-column gap-4">
      
      <!-- Step 1: Campaign Type Selection -->
      <div v-if="campaignStep === 1" class="flex flex-column gap-4">
        <div class="text-600 mb-3">
          Create a campaign for {{ selectedContacts.length }} selected contact{{ selectedContacts.length > 1 ? 's' : '' }}
        </div>
        
        <div class="flex flex-column gap-3">
          <h3 class="m-0 mb-3">Choose Campaign Type:</h3>
          
          <div class="grid">
            <div class="col-6">
              <div 
                class="p-4 border-2 border-round cursor-pointer transition-all transition-duration-200 h-full"
                :class="campaignType === 'email' ? 'border-primary bg-primary-50' : 'border-300 hover:border-400'"
                @click="campaignType = 'email'"
              >
                <div class="flex flex-column align-items-center text-center gap-3">
                  <i class="pi pi-envelope text-4xl" :class="campaignType === 'email' ? 'text-primary' : 'text-600'"></i>
                  <div>
                    <div class="font-semibold text-lg mb-1">Draft for Email</div>
                    <div class="text-sm text-600">Create email outreach campaigns</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="col-6">
              <div 
                class="p-4 border-2 border-round cursor-pointer transition-all transition-duration-200 h-full"
                :class="campaignType === 'linkedin' ? 'border-primary bg-primary-50' : 'border-300 hover:border-400'"
                @click="campaignType = 'linkedin'"
              >
                <div class="flex flex-column align-items-center text-center gap-3">
                  <i class="pi pi-linkedin text-4xl" :class="campaignType === 'linkedin' ? 'text-primary' : 'text-600'"></i>
                  <div>
                    <div class="font-semibold text-lg mb-1">Draft for LinkedIn</div>
                    <div class="text-sm text-600">Create LinkedIn outreach campaigns</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Step 2: Campaign Steps Selection -->
      <div v-if="campaignStep === 2" class="flex flex-column gap-4">
        <div class="text-600 mb-3">
          Campaign Type: <strong>{{ campaignType === 'email' ? 'Email' : 'LinkedIn' }}</strong>
        </div>
        
        <div class="flex flex-column gap-3">
          <h3 class="m-0 mb-3">How many steps in this campaign?</h3>
          
          <div class="grid">
            <div v-for="num in [1, 2, 3, 4]" :key="num" class="col-3">
              <div 
                class="p-4 border-2 border-round cursor-pointer transition-all transition-duration-200 text-center"
                :class="campaignSteps === num ? 'border-primary bg-primary-50' : 'border-300 hover:border-400'"
                @click="campaignSteps = num"
              >
                <div class="font-bold text-2xl mb-2" :class="campaignSteps === num ? 'text-primary' : 'text-600'">
                  {{ num }}
                </div>
                <div class="text-sm font-medium">
                  Step{{ num > 1 ? 's' : '' }}
                </div>
              </div>
            </div>
          </div>
          
          <div class="text-sm text-600 mt-2">
            Multi-step campaigns allow for follow-up messages to increase response rates.
          </div>
        </div>
      </div>
      
      <!-- Step 3: Draft Creation -->
      <div v-if="campaignStep === 3" class="flex flex-column gap-4">
        <div class="flex align-items-center justify-content-between mb-3">
          <div class="text-600">
            {{ campaignType === 'email' ? 'Email' : 'LinkedIn' }} Campaign • {{ campaignSteps }} Step{{ campaignSteps > 1 ? 's' : '' }} • {{ selectedContacts.length }} Contact{{ selectedContacts.length > 1 ? 's' : '' }}
          </div>
        </div>
        
        <!-- AI Copy: Prospect Navigation and Info -->
        <div v-if="copyType === 'ai'" class="border-1 border-300 border-round p-4 bg-primary-50 mb-4">
          <div class="flex align-items-center justify-content-between mb-3">
            <h3 class="m-0">Drafting for Prospect {{ currentProspectIndex + 1 }} of {{ selectedContacts.length }}</h3>
            <div class="flex gap-2">
              <Button 
                icon="pi pi-chevron-left"
                size="small" 
                text
                :disabled="currentProspectIndex === 0"
                @click="goToPreviousProspect"
              />
              <Button 
                icon="pi pi-chevron-right"
                size="small" 
                text
                :disabled="currentProspectIndex === selectedContacts.length - 1"
                @click="goToNextProspect"
              />
            </div>
          </div>
          
          <!-- Current Prospect Information -->
          <div v-if="getCurrentProspect()" class="grid">
            <div class="col-6">
              <div>
                <div class="font-semibold text-lg">{{ getCurrentProspect().firstName }} {{ getCurrentProspect().lastName }}</div>
                <div class="text-600">{{ getCurrentProspect().title }}</div>
                <div class="text-600">{{ getCurrentProspect().company }}</div>
              </div>
            </div>
            <div class="col-6">
              <div class="flex flex-column gap-1 text-sm">
                <div><strong>Email:</strong> {{ getCurrentProspect().email }}</div>
                <div v-if="getCurrentProspect().linkedin">
                  <a :href="getCurrentProspect().linkedin" target="_blank" class="text-primary no-underline hover:underline">
                    LinkedIn
                  </a>
                </div>
                <div><strong>Status:</strong> {{ getCurrentProspect().status }}</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Copy Type Toggle -->
        <div class="flex flex-column gap-2">
          <label class="font-semibold">Copy Type:</label>
          <div class="flex gap-2">
            <Button 
              label="AI Copy"
              :severity="copyType === 'ai' ? 'success' : 'secondary'"
              :outlined="copyType !== 'ai'"
              @click="changeCopyType('ai')"
              size="small"
              class="border-round-lg"
            />
            <Button 
              label="Static Copy"
              :severity="copyType === 'static' ? 'secondary' : 'secondary'"
              :outlined="copyType !== 'static'"
              @click="changeCopyType('static')"
              size="small"
              class="border-round-lg"
            />
          </div>
        </div>
        
        <!-- Campaign Steps -->
        <div class="flex flex-column gap-4">
          <h3 class="m-0">{{ campaignType === 'email' ? 'Email' : 'LinkedIn Message' }} Draft</h3>
          
          <!-- AI Copy: Show current step -->
          <div v-if="copyType === 'ai'" class="border-1 border-300 border-round p-4">
            <div class="flex align-items-center justify-content-between mb-3">
              <div class="flex align-items-center gap-2">
                <div class="flex align-items-center justify-content-center w-2rem h-2rem bg-primary text-white border-round font-semibold text-sm">
                  {{ currentViewStep }}
                </div>
                <span class="font-semibold">
                  Step {{ currentViewStep }} 
                  <span class="text-600 font-normal">
                    {{ currentViewStep === 1 ? '(Initial Outreach)' : currentViewStep === 2 ? '(Follow-up 1)' : currentViewStep === 3 ? '(Follow-up 2)' : '(Final Follow-up)' }}
                  </span>
                </span>
              </div>
              
              <!-- Approve Step Button -->
              <div class="flex align-items-center gap-3">
                <span class="text-600 text-sm font-medium">
                  {{ approvedSteps.size }}/{{ campaignSteps }} approved
                </span>
                <div class="flex align-items-center gap-2">
                  <span v-if="isStepApproved(currentViewStep)" class="text-green-600 text-sm font-medium">
                    <i class="pi pi-check-circle mr-1"></i>
                    Approved
                  </span>
                  <Button 
                    :icon="isStepApproved(currentViewStep) ? 'pi pi-check-circle' : 'pi pi-check'"
                    severity="success"
                    size="small"
                    @click="toggleStepApproval(currentViewStep)"
                    v-tooltip="isStepApproved(currentViewStep) ? 'Step approved - click to unapprove' : 'Approve this step for sending'"
                    class="border-round-lg"
                    :class="{ 'opacity-50': !isStepApproved(currentViewStep) }"
                  />
                </div>
              </div>
            </div>
            
            <!-- Subject Line (for email) -->
            <div v-if="campaignType === 'email'" class="mb-3">
              <label class="block text-sm font-medium mb-2">Subject:</label>
              <InputText 
                v-model="campaignDrafts[currentViewStep - 1].subject" 
                :placeholder="getSubjectPlaceholder(currentViewStep)"
                class="w-full"
              />
            </div>
            
            <!-- Message Body -->
            <div class="mb-3">
              <label class="block text-sm font-medium mb-2">{{ campaignType === 'email' ? 'Email Body:' : 'LinkedIn Message:' }}</label>
              <Textarea 
                v-model="campaignDrafts[currentViewStep - 1].body" 
                :rows="12"
                class="w-full"
                style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 14px; line-height: 1.5;"
              />
              <div class="flex align-items-center justify-content-end mt-2">
                <Button 
                  icon="pi pi-pencil"
                  size="small"
                  text
                  class="text-xs text-600"
                />
              </div>
            </div>
            
            <!-- Step Navigation Buttons -->
            <div v-if="campaignSteps > 1" class="pt-3 border-top-1 border-300">
              <div class="text-600 text-sm mb-3 text-center">
                Campaign Steps:
              </div>
              <div class="flex gap-2 justify-content-center flex-wrap">
                <Button 
                  v-for="stepNum in campaignSteps"
                  :key="stepNum"
                  :label="`Step ${stepNum}`"
                  size="small"
                  :outlined="currentViewStep !== stepNum"
                  :severity="currentViewStep === stepNum ? 'primary' : 'secondary'"
                  @click="viewStep(stepNum)"
                  class="border-round-lg"
                />
              </div>
            </div>
          </div>
          
          <!-- Static Copy: Show all steps -->
          <div v-else v-for="stepNum in campaignSteps" :key="stepNum" class="border-1 border-300 border-round p-4">
            <div class="flex align-items-center gap-2 mb-3">
              <div class="flex align-items-center justify-content-center w-2rem h-2rem bg-primary text-white border-round font-semibold text-sm">
                {{ stepNum }}
              </div>
              <span class="font-semibold">
                Step {{ stepNum }} 
                <span class="text-600 font-normal">
                  {{ stepNum === 1 ? '(Initial Outreach)' : stepNum === 2 ? '(Follow-up 1)' : stepNum === 3 ? '(Follow-up 2)' : '(Final Follow-up)' }}
                </span>
              </span>
            </div>
            
            <!-- Subject Line (for email) -->
            <div v-if="campaignType === 'email'" class="mb-3">
              <label class="block text-sm font-medium mb-2">Subject:</label>
              <InputText 
                v-model="campaignDrafts[stepNum - 1].subject" 
                :placeholder="getSubjectPlaceholder(stepNum)"
                class="w-full"
              />
            </div>
            
            <!-- Message Body -->
            <div class="mb-3">
              <label class="block text-sm font-medium mb-2">{{ campaignType === 'email' ? 'Email Body:' : 'LinkedIn Message:' }}</label>
              <Textarea 
                v-model="campaignDrafts[stepNum - 1].body" 
                :rows="8"
                class="w-full"
                :placeholder="getBodyPlaceholder(campaignType, stepNum)"
                style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 14px; line-height: 1.5;"
              />
              <div class="flex align-items-center justify-content-end mt-2">
                <Button 
                  icon="pi pi-pencil"
                  size="small"
                  text
                  class="text-xs text-600"
                />
              </div>
            </div>
          </div>
        </div>
        
        <!-- AI Prompt Section -->
        <div class="flex flex-column gap-3 border-1 border-300 border-round p-4 bg-gray-50">
          <div class="flex align-items-center justify-content-between">
            <label class="font-semibold">AI Prompt</label>
            <Button 
              icon="pi pi-sparkles"
              label="Rewrite" 
              severity="secondary"
              @click="rewriteEmail"
              size="small"
              class="border-round-lg"
            />
          </div>
          
          <Textarea 
            v-model="aiPrompt" 
            :rows="3"
            class="w-full"
            placeholder="Enter instructions to modify the email (e.g., 'Make it more casual', 'Add a specific call to action')"
          />
        </div>
      </div>
    </div>
    
    <template #footer>
      <div class="flex justify-content-between w-full">
        <div class="flex gap-2">
          <Button 
            v-if="campaignStep > 1" 
            label="Back" 
            icon="pi pi-arrow-left"
            text 
            @click="goBackStep" 
          />
          <Button label="Close" text @click="closeDraftOutreachDialog" />
        </div>
        <div class="flex gap-2">
          <Button 
            v-if="campaignStep < 3"
            label="Next" 
            icon="pi pi-arrow-right"
            iconPos="right"
            @click="goNextStep"
            :disabled="!canProceedToNextStep()"
          />
          <template v-else>
            <Button 
              label="Save Draft" 
              severity="secondary"
              outlined
              @click="saveDraft"
            />
            <Button 
              label="Launch Campaign"
              severity="success"
              @click="sendEmails"
            />
          </template>
        </div>
      </div>
    </template>
  </Dialog>

  <!-- Trust AI Dialog -->
  <Dialog 
    v-model:visible="showTrustAIDialog" 
    modal 
    header="Trust AI Copy?" 
    :style="{width: '500px'}"
    :closable="false"
  >
    <div class="flex flex-column gap-4">
      <div class="text-center">
        <div class="mb-3">
          <i class="pi pi-question-circle text-6xl text-primary"></i>
        </div>
        <h3 class="mt-0 mb-2">Would you like to trust the AI?</h3>
        <p class="text-600 m-0">
          You've manually approved campaigns for 3 users. The AI has learned your preferences and can auto-approve the remaining campaigns.
        </p>
      </div>
      
      <div class="flex flex-column gap-3">
        <Button 
          label="Yes - Auto-approve all remaining" 
          icon="pi pi-check" 
          severity="success"
          @click="trustAIYes"
          class="w-full"
        />
        <Button 
          label="No - Continue manual approval" 
          icon="pi pi-times" 
          severity="secondary"
          outlined
          @click="trustAINo"
          class="w-full"
        />
        <Button 
          label="Show me 3 more" 
          icon="pi pi-eye" 
          severity="info"
          outlined
          @click="trustAIShowMore"
          class="w-full"
        />
      </div>
    </div>
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
    
    // Campaign Creation Dialog
    const showDraftOutreachDialog = ref(false)
    const campaignStep = ref(1)
    const campaignType = ref('')
    const campaignSteps = ref(1)
    const copyType = ref('ai')
    const campaignDrafts = ref([])
    const aiPrompt = ref('')
    const currentProspectIndex = ref(0)
    const currentViewStep = ref(1)
    const approvedSteps = ref(new Set())
    const manuallyApprovedUsers = ref(0)
    const showTrustAIDialog = ref(false)
    
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
    
    // Campaign Creation Methods
    const openDraftOutreachDialog = () => {
      if (!selectedContacts.value || selectedContacts.value.length === 0) {
        toast.add({
          severity: 'warn',
          summary: 'No Contacts Selected',
          detail: 'Please select at least one contact to create a campaign',
          life: 3000
        })
        return
      }
      
      // Reset dialog state
      campaignStep.value = 1
      campaignType.value = ''
      campaignSteps.value = 1
      copyType.value = 'ai'
      campaignDrafts.value = []
      aiPrompt.value = ''
      currentProspectIndex.value = 0
      currentViewStep.value = 1
      approvedSteps.value.clear()
      manuallyApprovedUsers.value = 0
      showTrustAIDialog.value = false
      
      showDraftOutreachDialog.value = true
    }
    
    const closeDraftOutreachDialog = () => {
      showDraftOutreachDialog.value = false
    }
    
    const getCampaignDialogTitle = () => {
      if (campaignStep.value === 1) return 'Create Campaign'
      if (campaignStep.value === 2) return 'Campaign Steps'
      return 'Draft Campaign'
    }
    
    const goNextStep = () => {
      if (campaignStep.value === 2) {
        // Initialize campaign drafts when moving to step 3
        initializeCampaignDrafts()
      }
      campaignStep.value++
    }
    
    const goBackStep = () => {
      campaignStep.value--
    }
    
    const canProceedToNextStep = () => {
      if (campaignStep.value === 1) {
        return campaignType.value !== ''
      }
      if (campaignStep.value === 2) {
        return campaignSteps.value >= 1 && campaignSteps.value <= 4
      }
      return false
    }
    
    const initializeCampaignDrafts = () => {
      campaignDrafts.value = []
      for (let i = 0; i < campaignSteps.value; i++) {
        const prospect = getCurrentProspect()
        campaignDrafts.value.push({
          subject: copyType.value === 'ai' && prospect ? 
            `Strategic Partnership Opportunity with Outbounder` : 
            getSubjectPlaceholder(i + 1),
          body: copyType.value === 'ai' ? 
            getPersonalizedContent(campaignType.value, i + 1) : 
            getBodyPlaceholder(campaignType.value, i + 1)
        })
      }
    }
    
    const getSubjectPlaceholder = (stepNum) => {
      const subjects = {
        1: 'Strategic Partnership Opportunity with Outbounder',
        2: 'Re: Strategic Partnership Opportunity',
        3: 'Following up on our partnership discussion',
        4: 'Final follow-up: Outbounder partnership'
      }
      return subjects[stepNum] || 'Follow-up message'
    }
    
    const getBodyPlaceholder = (type, stepNum) => {
      if (type === 'email') {
        const emailBodies = {
          1: `Hi [First Name],

I hope this message finds you well. I'm reaching out because I believe there's a compelling opportunity for [Company] and Outbounder to explore a strategic partnership.

At Outbounder, we've been helping organizations like yours streamline their performance management and strategic planning processes. Given [Company]'s focus on innovation and operational excellence, I believe our platform could provide significant value in:

• Enhancing strategic alignment across teams
• Improving performance tracking and reporting  
• Accelerating decision-making through better data insights

Best regards,
[Your Name]`,
          2: `Hi [First Name],

I wanted to follow up on my previous email about the partnership opportunity between [Company] and Outbounder.

I understand you're likely busy, but I believe this could be a valuable discussion for [Company]'s strategic initiatives.

Would you be available for a brief 15-minute call this week to explore how Outbounder could support [Company]'s goals?

Best regards,
[Your Name]`,
          3: `Hi [First Name],

I hope you're doing well. I wanted to reach out one more time regarding the potential partnership between [Company] and Outbounder.

I've seen some great results with companies similar to [Company], and I think there could be significant value in a brief conversation.

If now isn't the right time, I completely understand. Please let me know if there's a better time to reconnect.

Best regards,
[Your Name]`,
          4: `Hi [First Name],

This will be my final follow-up regarding the Outbounder partnership opportunity.

If the timing isn't right or if this isn't a priority for [Company] right now, I completely understand. I'll mark this as not a fit for now.

If circumstances change or if you'd like to revisit this in the future, please don't hesitate to reach out.

Best of luck with your initiatives at [Company].

Best regards,
[Your Name]`
        }
        return emailBodies[stepNum] || 'Follow-up message...'
      } else {
        const linkedinBodies = {
          1: `Hi [First Name],

I noticed your role at [Company] and wanted to reach out about a potential strategic partnership with Outbounder.

We've been helping companies like [Company] enhance their strategic alignment and operational efficiency. I'd love to share how we might be able to support [Company]'s goals.

Would you be open to a brief conversation?

Best,
[Your Name]`,
          2: `Hi [First Name],

Following up on my previous message about Outbounder. I understand you're busy, but I believe this could be valuable for [Company].

Would you be available for a quick 15-minute call this week?

Best,
[Your Name]`,
          3: `Hi [First Name],

Hope you're doing well! One more follow-up on the Outbounder partnership opportunity.

I've seen great results with similar companies and think it could be worth a brief conversation.

Let me know if you're interested!

Best,
[Your Name]`,
          4: `Hi [First Name],

This will be my final message about the Outbounder opportunity. If the timing isn't right, I completely understand.

Feel free to reach out if circumstances change in the future.

Best of luck with your initiatives at [Company]!

[Your Name]`
        }
        return linkedinBodies[stepNum] || 'Follow-up message...'
      }
    }
    
    const getCurrentProspect = () => {
      return selectedContacts.value[currentProspectIndex.value] || null
    }
    
    const getPersonalizedContent = (type, stepNum) => {
      const prospect = getCurrentProspect()
      if (!prospect) return ''
      
      if (type === 'email') {
        const emailBodies = {
          1: `Hi ${prospect.firstName},

I hope this message finds you well. I'm reaching out because I believe there's a compelling opportunity for ${prospect.company} and Outbounder to explore a strategic partnership.

At Outbounder, we've been helping organizations like ${prospect.company} streamline their performance management and strategic planning processes. Given ${prospect.company}'s focus on innovation and operational excellence, I believe our platform could provide significant value in:

• Enhancing strategic alignment across teams
• Improving performance tracking and reporting  
• Accelerating decision-making through better data insights

Best regards,
Connor Holland`,
          2: `Hi ${prospect.firstName},

I wanted to follow up on my previous email about the partnership opportunity between ${prospect.company} and Outbounder.

I understand you're likely busy, but I believe this could be a valuable discussion for ${prospect.company}'s strategic initiatives.

Would you be available for a brief 15-minute call this week to explore how Outbounder could support ${prospect.company}'s goals?

Best regards,
Connor Holland`,
          3: `Hi ${prospect.firstName},

I hope you're doing well. I wanted to reach out one more time regarding the potential partnership between ${prospect.company} and Outbounder.

I've seen some great results with companies similar to ${prospect.company}, and I think there could be significant value in a brief conversation.

If now isn't the right time, I completely understand. Please let me know if there's a better time to reconnect.

Best regards,
Connor Holland`,
          4: `Hi ${prospect.firstName},

This will be my final follow-up regarding the Outbounder partnership opportunity.

If the timing isn't right or if this isn't a priority for ${prospect.company} right now, I completely understand. I'll mark this as not a fit for now.

If circumstances change or if you'd like to revisit this in the future, please don't hesitate to reach out.

Best of luck with your initiatives at ${prospect.company}.

Best regards,
Connor Holland`
        }
        return emailBodies[stepNum] || 'Follow-up message...'
      } else {
        const linkedinBodies = {
          1: `Hi ${prospect.firstName},

I noticed your role at ${prospect.company} and wanted to reach out about a potential strategic partnership with Outbounder.

We've been helping companies like ${prospect.company} enhance their strategic alignment and operational efficiency. I'd love to share how we might be able to support ${prospect.company}'s goals.

Would you be open to a brief conversation?

Best,
Connor Holland`,
          2: `Hi ${prospect.firstName},

Following up on my previous message about Outbounder. I understand you're busy, but I believe this could be valuable for ${prospect.company}.

Would you be available for a quick 15-minute call this week?

Best,
Connor Holland`,
          3: `Hi ${prospect.firstName},

Hope you're doing well! One more follow-up on the Outbounder partnership opportunity.

I've seen great results with similar companies and think it could be worth a brief conversation for ${prospect.company}.

Let me know if you're interested!

Best,
Connor Holland`,
          4: `Hi ${prospect.firstName},

This will be my final message about the Outbounder opportunity. If the timing isn't right, I completely understand.

Feel free to reach out if circumstances change in the future.

Best of luck with your initiatives at ${prospect.company}!

Connor Holland`
        }
        return linkedinBodies[stepNum] || 'Follow-up message...'
      }
    }
    
    const goToPreviousProspect = () => {
      if (currentProspectIndex.value > 0) {
        currentProspectIndex.value--
        // Clear approvals and regenerate content for new prospect
        approvedSteps.value.clear()
        currentViewStep.value = 1
        initializeCampaignDrafts()
      }
    }
    
    const goToNextProspect = () => {
      if (currentProspectIndex.value < selectedContacts.value.length - 1) {
        currentProspectIndex.value++
        // Clear approvals and regenerate content for new prospect
        approvedSteps.value.clear()
        currentViewStep.value = 1
        initializeCampaignDrafts()
      }
    }
    
    const changeCopyType = (newType) => {
      copyType.value = newType
      // Regenerate drafts when switching copy types
      initializeCampaignDrafts()
    }
    
    const viewStep = (stepNumber) => {
      currentViewStep.value = stepNumber
    }
    
    const isStepApproved = (stepNumber) => {
      return approvedSteps.value.has(stepNumber)
    }
    
    const trustAIYes = () => {
      // Auto-approve all remaining contacts
      showTrustAIDialog.value = false
      
      // Go to next prospect and auto-approve all steps for remaining contacts
      goToNextProspect()
      
      // Auto-approve all steps for all remaining contacts
      setTimeout(() => {
        autoApproveRemainingContacts()
      }, 500)
      
      toast.add({
        severity: 'success',
        summary: 'AI Trusted',
        detail: 'Auto-approving all remaining campaigns with AI copy',
        life: 4000
      })
    }
    
    const trustAINo = () => {
      // Continue manual approval process
      showTrustAIDialog.value = false
      goToNextProspect()
      
      toast.add({
        severity: 'info',
        summary: 'Manual Approval',
        detail: 'Continuing with manual approval process',
        life: 3000
      })
    }
    
    const trustAIShowMore = () => {
      // Show 3 more for manual approval, then ask again
      showTrustAIDialog.value = false
      manuallyApprovedUsers.value = 0 // Reset counter to ask again after 3 more
      goToNextProspect()
      
      toast.add({
        severity: 'info',
        summary: 'Show More',
        detail: 'Reviewing 3 more campaigns manually',
        life: 3000
      })
    }
    
    const autoApproveRemainingContacts = () => {
      // Auto-approve all steps for all remaining contacts
      for (let i = currentProspectIndex.value; i < selectedContacts.value.length; i++) {
        // Simulate approving all steps for each remaining contact
        for (let step = 1; step <= campaignSteps.value; step++) {
          approvedSteps.value.add(step)
        }
        
        if (i < selectedContacts.value.length - 1) {
          // Move to next contact (this will clear approvals and we'll re-add them)
          setTimeout(() => {
            if (currentProspectIndex.value < selectedContacts.value.length - 1) {
              currentProspectIndex.value++
              approvedSteps.value.clear()
              currentViewStep.value = 1
              initializeCampaignDrafts()
              
              // Re-approve all steps for this contact
              for (let step = 1; step <= campaignSteps.value; step++) {
                approvedSteps.value.add(step)
              }
            }
          }, i * 1000) // Stagger the approvals
        }
      }
      
      // Final completion message
      setTimeout(() => {
        toast.add({
          severity: 'success',
          summary: 'All Campaigns Auto-Approved',
          detail: 'AI has approved all remaining campaigns successfully!',
          life: 5000
        })
      }, selectedContacts.value.length * 1000)
    }

    const toggleStepApproval = (stepNumber) => {
      if (approvedSteps.value.has(stepNumber)) {
        approvedSteps.value.delete(stepNumber)
        toast.add({
          severity: 'info',
          summary: 'Step Unapproved',
          detail: `Step ${stepNumber} removed from send queue`,
          life: 3000
        })
      } else {
        approvedSteps.value.add(stepNumber)
        toast.add({
          severity: 'success',
          summary: 'Step Approved',
          detail: `Step ${stepNumber} queued for sending`,
          life: 3000
        })
        
        // Check if all steps are approved
        if (approvedSteps.value.size === campaignSteps.value) {
          // Increment manually approved users count
          manuallyApprovedUsers.value++
          
          // All steps approved, move to next contact after a short delay
          setTimeout(() => {
            if (currentProspectIndex.value < selectedContacts.value.length - 1) {
              toast.add({
                severity: 'success',
                summary: 'Campaign Complete',
                detail: `All steps approved for ${getCurrentProspect()?.firstName}. Moving to next contact.`,
                life: 4000
              })
              
              // Check if we should show trust AI dialog (after 3 manually approved users)
              if (manuallyApprovedUsers.value === 3 && copyType.value === 'ai') {
                setTimeout(() => {
                  showTrustAIDialog.value = true
                }, 2000)
              } else {
                goToNextProspect()
              }
            } else {
              toast.add({
                severity: 'success',
                summary: 'All Campaigns Complete',
                detail: 'All steps approved for all selected contacts!',
                life: 4000
              })
            }
          }, 1500)
        }
      }
    }
    
    const rewriteEmail = () => {
      if (!aiPrompt.value.trim()) {
        toast.add({
          severity: 'warn',
          summary: 'No Prompt Provided',
          detail: 'Please enter instructions for how to modify the email',
          life: 3000
        })
        return
      }
      
      // Simulate AI rewriting (in real app, this would call an AI API)
      toast.add({
        severity: 'info',
        summary: 'AI Rewriting',
        detail: 'Email is being rewritten based on your prompt...',
        life: 2000
      })
      
      // Mock rewrite after a delay
      setTimeout(() => {
        const variations = [
          'The email has been rewritten with a more casual tone.',
          'Updated the email to include a stronger call-to-action.',
          'Revised the email to be more personalized and engaging.',
          'Enhanced the email with better value proposition.'
        ]
        
        toast.add({
          severity: 'success',
          summary: 'Email Rewritten',
          detail: variations[Math.floor(Math.random() * variations.length)],
          life: 3000
        })
      }, 1500)
    }
    
    const saveDraft = () => {
      toast.add({
        severity: 'success',
        summary: 'Campaign Draft Saved',
        detail: `${campaignType.value === 'email' ? 'Email' : 'LinkedIn'} campaign draft saved for ${selectedContacts.value.length} contact${selectedContacts.value.length > 1 ? 's' : ''}`,
        life: 3000
      })
    }
    
    const sendEmails = () => {
      // Validate that all campaign steps have content
      const incompleteSteps = campaignDrafts.value.filter((draft, index) => {
        if (campaignType.value === 'email') {
          return !draft.subject.trim() || !draft.body.trim()
        }
        return !draft.body.trim()
      })
      
      if (incompleteSteps.length > 0) {
        toast.add({
          severity: 'error',
          summary: 'Incomplete Campaign',
          detail: 'Please provide content for all campaign steps',
          life: 3000
        })
        return
      }
      
      toast.add({
        severity: 'success',
        summary: 'Campaign Launched',
        detail: `Successfully launched ${campaignSteps.value}-step ${campaignType.value} campaign for ${selectedContacts.value.length} contact${selectedContacts.value.length > 1 ? 's' : ''}`,
        life: 3000
      })
      
      closeDraftOutreachDialog()
      selectedContacts.value = []
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
      
      // Campaign Creation Dialog
      showDraftOutreachDialog,
      campaignStep,
      campaignType,
      campaignSteps,
      copyType,
      campaignDrafts,
      aiPrompt,
      currentProspectIndex,
      currentViewStep,
      approvedSteps,
      manuallyApprovedUsers,
      showTrustAIDialog,
      
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
      clearFilter,
      
      // Campaign Creation Methods
      openDraftOutreachDialog,
      closeDraftOutreachDialog,
      getCampaignDialogTitle,
      goNextStep,
      goBackStep,
      canProceedToNextStep,
      getSubjectPlaceholder,
      getBodyPlaceholder,
      getCurrentProspect,
      getPersonalizedContent,
      goToPreviousProspect,
      goToNextProspect,
      changeCopyType,
      viewStep,
      isStepApproved,
      toggleStepApproval,
      trustAIYes,
      trustAINo,
      trustAIShowMore,
      autoApproveRemainingContacts,
      rewriteEmail,
      saveDraft,
      sendEmails
    }
  }
}
</script>


