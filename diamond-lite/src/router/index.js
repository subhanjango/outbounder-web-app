import { createRouter, createWebHistory } from 'vue-router'

const Home = () => import('../pages/Home.vue')
const People = () => import('../pages/People.vue')
const Company = () => import('../pages/Company.vue')
const CompanyDetail = () => import('../pages/CompanyDetail.vue')
const Campaigns = () => import('../pages/Campaigns.vue')
const Inbox = () => import('../pages/Inbox.vue')
const Knowledge = () => import('../pages/Knowledge.vue')
const Settings = () => import('../pages/Settings.vue')

const routes = [
  { path: '/', name: 'Home', component: Home, meta: { title: 'Home' } },
  { path: '/people', name: 'People', component: People, meta: { title: 'People' } },
  { path: '/company', name: 'Company', component: Company, meta: { title: 'Company' } },
  { path: '/company/:companyName', name: 'CompanyDetail', component: CompanyDetail, meta: { title: 'Company Detail' } },
  { path: '/campaigns', name: 'Campaigns', component: Campaigns, meta: { title: 'Campaigns' } },
  { path: '/inbox', name: 'Inbox', component: Inbox, meta: { title: 'Inbox' } },
  { path: '/knowledge', name: 'Knowledge', component: Knowledge, meta: { title: 'Knowledge' } },
  { path: '/settings', name: 'Settings', component: Settings, meta: { title: 'Settings' } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router


