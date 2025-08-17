# Outbounder Web App — Frontend Instructions (Read Me First)

**Audience:** Claude (and all contributors)

**Purpose:** This repository contains the **frontend** for a new web application that will be a product of **[getoutbounder.com](https://www.getoutbounder.com/)**. Users will sign in and **interact with their Contacts and Leads** (view, search, segment, update, and take actions like notes, tags, emailing/SMS via backend integrations later).

> **Status:** Backend is a **stand‑alone project** and **not integrated yet**. Use **mock data only** everywhere until backend APIs are provided.

---

## Non‑Negotiable Rules

1. **PrimeVue Only (Strict):**

    * Use components **exclusively from [PrimeVue](https://primevue.org/)** across the entire app.
    * **Do not** create custom components unless absolutely unavoidable.
    * If a custom wrapper is *truly* required (e.g., to centralize props or behavior), it **must** internally render PrimeVue components and follow the **Design System** rules below.
    * Prefer configuration/theming **over** writing custom UI from scratch.

2. **Vue 3 App:**

    * The project is **Vue 3** (Composition API).
    * Keep logic modular and framework‑idiomatic; prefer `script setup` and composables.

3. **Mock Data Only:**

    * **No live API calls** until backend contracts are finalized.
    * Provide mock services and fixtures (see **/src/mocks**).

4. **Stand‑Alone Backend:**

    * Assume the backend will be mounted on a separate domain/service.
    * Keep all service calls abstracted behind a `services/` layer so we can swap mock → real easily.

5. **Developer Experience:**

    * Enforce linting & formatting.
    * Component props/events must be documented via JSDoc (or TS types if TS is enabled).

---

## Tech Stack & Conventions

* **Framework:** Vue 3 + Vite
* **UI Library:** PrimeVue (with PrimeIcons & PrimeFlex)
* **Styling:**

    * Use **PrimeFlex** utilities, CSS variables/tokens, and theme overrides.
    * Avoid bespoke CSS; when needed, keep styles **scoped** and minimal.
* **State:** Pinia (optional for now; start with local state + composables).
* **Routing:** Vue Router; routes under `/contacts`, `/leads`, `/lists`, `/campaigns` (stubs).
* **Testing:** Vitest + Vue Test Utils (snapshot minimal; interaction tests for critical flows).
* **TypeScript:** Optional; recommended. If disabled, still keep JSDoc types.

**Folder structure (baseline):**

```
src/
  assets/
  components/        # PrimeVue composition only; no custom heavy components
  composables/
  layouts/
  mocks/             # fixtures + mock services
  pages/
    contacts/
    leads/
  router/
  services/
  store/
  styles/
  App.vue
  main.ts
```

---

## PrimeVue Usage Guidelines (Strict)

* Prefer official PrimeVue components for **every** UI primitive: buttons, inputs, dialogs, tables, dropdowns, tabs, steps, toasts, chips, avatars, menus, calendars, file uploads, splitters, etc.
* **Tables/Grids:** Use `DataTable`, `Column`, `ColumnGroup`, `Paginator`, `MultiSelect` for column toggling, `Toolbar` for bulk actions, `OverlayPanel`/`Menu` for row actions.
* **Forms:** Use `InputText`, `TextArea`, `Dropdown`, `MultiSelect`, `Chips`, `Calendar`, `InputSwitch`, `InputNumber`, `RadioButton`, `Checkbox`. Validate with simple composables and/or PrimeVue `Message`/`Toast`.
* **Feedback:** Use `Toast`, `ConfirmDialog`, `ProgressBar`, `Skeleton`, `Tag`.
* **Navigation:** `Menubar`, `Breadcrumb`, `TabMenu`, `Tabs`, `Sidebar`.
* **Do not** import third‑party components for UI. If a pattern is missing, compose existing PrimeVue components.

---

## Design System

* **Theme:** Use a PrimeVue theme (e.g., Lara, Aura). Override via CSS variables only when necessary.
* **Density:** Default spacing; use **PrimeFlex** for layout (`grid`, `col`, `gap-*`, `p-*`, `m-*`).
* **Responsiveness:** All pages must be responsive using PrimeFlex grid utilities.
* **Icons:** Use **PrimeIcons** exclusively (`pi pi-...`).
* **Colors & Tokens:** Centralize in `/src/styles/theme.css`. Example:

```css
:root {
  --brand-primary: var(--primary-color); /* tie to theme */
  --brand-surface: var(--surface-ground);
}
```

---

## Pages (MVP Scope)

1. **Contacts List**

    * `DataTable` with columns: Name, Email, Phone, Tags, Owner, Last Activity, Status.
    * Filters row (global search `InputText`, tag `MultiSelect`, status `Dropdown`).
    * Row actions via `Menu` (View, Edit, Archive). Bulk select with `Toolbar` actions.

2. **Contact Detail**

    * Header with Avatar/Name/Tags (`Avatar`, `Chip`, `Tag`).
    * Tabs: Profile, Activity, Notes, Lists. Use `TabView`.
    * Right panel `Sidebar` for quick actions (Add Note, Add Tag, Assign Owner).

3. **Leads List** (mirrors Contacts List with Lead-specific fields)

    * Columns: Company, Contact, Source, Score, Stage, Owner, Last Touch.
    * Kanban Stage view (optional later: compose `DataView` + `Draggable` only if PrimeVue supports; otherwise stay with table in MVP).

4. **Lead Detail**

    * Similar to Contact Detail; include `Timeline` for engagements using `Timeline` component.

5. **Lists/Segments** (stub)

    * Create/edit smart filters using `MultiSelect`, `Chips`, `Dropdown`, `Calendar`.

---

## Mock Data & Services

* All data comes from `/src/mocks/*.ts` via service shims in `/src/services/*.ts`.
* Provide deterministic fixtures and slight randomness for demo feel.
* **Never** call `fetch`/Axios to external hosts in this phase.

**Example model (JSDoc types if not using TS):**

```ts
/** @typedef {{
 *  id: string;
 *  firstName: string; lastName: string; email?: string; phone?: string;
 *  tags: string[]; owner?: string; lastActivityAt?: string; status?: 'active'|'archived';
 *}} Contact
 */
```

**Example mock service:**

```ts
// src/services/contacts.service.ts
import contacts from '@/mocks/contacts.fixture'

export async function listContacts(params = {}) {
  await sleep(300); // simulate network
  return { data: contacts, total: contacts.length };
}

export async function getContact(id) {
  await sleep(200);
  return contacts.find(c => c.id === id) || null;
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));
```

**Example fixture:**

```ts
// src/mocks/contacts.fixture.ts
export default [
  { id: 'c_001', firstName: 'Aisha', lastName: 'Khan', email: 'aisha@example.com', tags: ['VIP','Beta'], owner: 'Subhan', lastActivityAt: '2025-08-10T12:00:00Z', status: 'active' },
  { id: 'c_002', firstName: 'Ali', lastName: 'Raza', email: 'ali@example.com', tags: ['Newsletter'], owner: 'Maria', lastActivityAt: '2025-08-12T09:30:00Z', status: 'active' }
];
```

---

## Example Page Skeleton (PrimeVue Only)

```vue
<!-- src/pages/contacts/ContactsList.vue -->
<template>
  <div class="p-4">
    <Toolbar class="mb-3">
      <template #start>
        <Button label="Add Contact" icon="pi pi-plus" @click="showCreate = true" />
      </template>
      <template #end>
        <span class="p-input-icon-left">
          <i class="pi pi-search" />
          <InputText v-model="search" placeholder="Search" />
        </span>
      </template>
    </Toolbar>

    <div class="grid gap-3 mb-3">
      <div class="col-12 md:col-3">
        <Dropdown v-model="status" :options="statuses" optionLabel="label" optionValue="value" placeholder="Status" />
      </div>
      <div class="col-12 md:col-4">
        <MultiSelect v-model="selectedTags" :options="tags" placeholder="Tags" display="chip" />
      </div>
    </div>

    <DataTable :value="rows" paginator :rows="10" dataKey="id" selectionMode="multiple" v-model:selection="selection">
      <Column selectionMode="multiple" headerStyle="width:3rem" />
      <Column field="firstName" header="First Name" />
      <Column field="lastName" header="Last Name" />
      <Column field="email" header="Email" />
      <Column header="Tags">
        <template #body="{ data }">
          <Chip v-for="t in data.tags" :key="t" :label="t" class="mr-2" />
        </template>
      </Column>
      <Column header="Actions" bodyClass="text-right">
        <template #body="{ data }">
          <Menu :model="rowMenu(data)" popup ref="menus[data.id]" />
          <Button icon="pi pi-ellipsis-v" text @click="$refs.menus[data.id].toggle($event)" />
        </template>
      </Column>
    </DataTable>

    <Dialog v-model:visible="showCreate" header="Create Contact" modal :style="{ width: '32rem' }">
      <div class="grid gap-3">
        <div class="col-12 md:col-6"><InputText v-model="draft.firstName" placeholder="First name" /></div>
        <div class="col-12 md:col-6"><InputText v-model="draft.lastName" placeholder="Last name" /></div>
        <div class="col-12"><InputText v-model="draft.email" placeholder="Email" /></div>
      </div>
      <template #footer>
        <Button label="Cancel" text @click="showCreate=false" />
        <Button label="Save" @click="save()" />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { listContacts } from '@/services/contacts.service'

const rows = ref([])
const selection = ref([])
const showCreate = ref(false)
const search = ref('')
const status = ref(null)
const statuses = [{ label: 'Active', value: 'active' }, { label: 'Archived', value: 'archived' }]
const tags = ['VIP','Newsletter','Beta']
const selectedTags = ref([])
const menus = reactive({})

const draft = reactive({ firstName: '', lastName: '', email: '' })

onMounted(async () => {
  const res = await listContacts()
  rows.value = res.data
})

function rowMenu(row){
  return [
    { label: 'View', icon: 'pi pi-eye', command: () => view(row) },
    { label: 'Edit', icon: 'pi pi-pencil', command: () => edit(row) },
    { separator: true },
    { label: 'Archive', icon: 'pi pi-box', command: () => archive(row) },
  ]
}

function save(){
  // Mock persistence only; replace with real service later
  rows.value = [{ id: `c_${Date.now()}`, ...draft, tags: [] }, ...rows.value]
  showCreate.value = false
}

function view(r){}
function edit(r){}
function archive(r){}
</script>
```

---

## Routing Stub

* `/contacts` → list, `/contacts/:id` → detail
* `/leads` → list, `/leads/:id` → detail
* `/lists` → stub for segments
* `/campaigns` → stub for future

Keep routes shallow and lazy‑load page components.

---

## Accessibility & i18n

* Use semantic roles where applicable. Ensure focus management on dialogs/menus.
* Provide labels and `aria-*` when PrimeVue components support them.
* All user‑visible strings should be easy to externalize later (wrap in centralized `strings.ts` for now).

---

## Performance & Quality

* Use `Skeleton` for loading states.
* Virtualize large tables later via PrimeVue features if needed.
* Avoid unnecessary watchers; prefer computed props.
* Keep bundle lean; import components on demand.

---

## Testing Targets (minimum)

* ContactsList renders table, filters by search, saves mock contact via Dialog.
* LeadsList renders table and filter controls.
* Service layer returns deterministic mock payloads.

---

## Integration Notes (Future)

* All network calls go through `/src/services/*`. Swap mock implementations with real ones when backend is ready.
* Add `.env` for API base URL when integrating; do not bake URLs into components.

---

## Pull Request Checklist

* [ ] Only PrimeVue components used for UI (no custom/third‑party UI components).
* [ ] No external network calls; mock services only.
* [ ] Components use Composition API and are small, focused.
* [ ] Responsive (PrimeFlex), accessible labels, keyboard friendly.
* [ ] Tests for key flows pass.
* [ ] Lint/format pass & types documented.

---

## Summary

This is a **Vue 3 + PrimeVue** frontend for **Outbounder** where users manage **Contacts** and **Leads**. Until backend is integrated (stand‑alone service), **use mocks only**. UI must **strictly** rely on **PrimeVue**—**no custom components** unless absolutely required, and even then only as thin wrappers around PrimeVue.
