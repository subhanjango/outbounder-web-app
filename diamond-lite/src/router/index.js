import { createRouter, createWebHistory } from 'vue-router'

const Home = () => import('../pages/Home.vue')
const People = () => import('../pages/People.vue')
const Company = () => import('../pages/Company.vue')
const CompanyDetail = () => import('../pages/CompanyDetail.vue')
const Campaigns = () => import('../pages/Campaigns.vue')
const Settings = () => import('../pages/Settings.vue')

const routes = [
  { path: '/', name: 'Home', component: Home, meta: { title: 'Home' } },
  { path: '/people', name: 'People', component: People, meta: { title: 'People' } },
  { path: '/company', name: 'Company', component: Company, meta: { title: 'Company' } },
  { path: '/company/:companyName', name: 'CompanyDetail', component: CompanyDetail, meta: { title: '' } },
  { path: '/campaigns', name: 'Campaigns', component: Campaigns, meta: { title: 'Campaigns' } },
  { path: '/settings', name: 'Settings', component: Settings, meta: { title: 'Settings' } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router


