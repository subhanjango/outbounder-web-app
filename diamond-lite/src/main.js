import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'

import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css'
import './styles/theme.css'

import Button from 'primevue/button'
import Avatar from 'primevue/avatar'
import Badge from 'primevue/badge'
import Divider from 'primevue/divider'
import Chart from 'primevue/chart'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Tag from 'primevue/tag'
import Chip from 'primevue/chip'
import Checkbox from 'primevue/checkbox'
import Dialog from 'primevue/dialog'
import Textarea from 'primevue/textarea'
import FileUpload from 'primevue/fileupload'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import Tooltip from 'primevue/tooltip'
import Menu from 'primevue/menu'
import Accordion from 'primevue/accordion'
import AccordionTab from 'primevue/accordiontab'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import MultiSelect from 'primevue/multiselect'
import Password from 'primevue/password'
import ConfirmDialog from 'primevue/confirmdialog'

const app = createApp(App)
app.use(router)
app.use(PrimeVue, { theme: { preset: Aura, options: { darkModeSelector: 'html.dark' } } })
app.use(ToastService)
app.directive('tooltip', Tooltip)
app.component('Button', Button)
app.component('Avatar', Avatar)
app.component('Badge', Badge)
app.component('Divider', Divider)
app.component('Chart', Chart)
app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('InputText', InputText)
app.component('Dropdown', Dropdown)
app.component('Tag', Tag)
app.component('Chip', Chip)
app.component('Checkbox', Checkbox)
app.component('Dialog', Dialog)
app.component('Textarea', Textarea)
app.component('FileUpload', FileUpload)
app.component('Toast', Toast)
app.component('Menu', Menu)
app.component('Accordion', Accordion)
app.component('AccordionTab', AccordionTab)
app.component('TabView', TabView)
app.component('TabPanel', TabPanel)
app.component('MultiSelect', MultiSelect)
app.component('Password', Password)
app.component('ConfirmDialog', ConfirmDialog)
app.mount('#app')
