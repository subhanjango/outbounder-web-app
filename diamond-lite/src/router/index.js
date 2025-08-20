import { createRouter, createWebHistory } from 'vue-router'

const Home = () => import('../pages/Home.vue')
const People = () => import('../pages/People.vue')
const Company = () => import('../pages/Company.vue')
const CompanyDetail = () => import('../pages/CompanyDetail.vue')
const Campaigns = () => import('../pages/Campaigns.vue')
const Inbox = () => import('../pages/Inbox.vue')
const Knowledge = () => import('../pages/Knowledge.vue')
const Settings = () => import('../pages/Settings.vue')
const Login = () => import('../pages/Login.vue')
// Onboarding steps (lazy-loaded)
const OnboardingStep1 = () => import('../pages/onboarding/Step1.vue')
const OnboardingStep2 = () => import('../pages/onboarding/Step2.vue')
const OnboardingStep3 = () => import('../pages/onboarding/Step3.vue')
const OnboardingStep4 = () => import('../pages/onboarding/Step4.vue')
const OnboardingStep5 = () => import('../pages/onboarding/Step5.vue')
const OnboardingStep6 = () => import('../pages/onboarding/Step6.vue')
const OnboardingStep7 = () => import('../pages/onboarding/Step7.vue')
const OnboardingStep8 = () => import('../pages/onboarding/Step8.vue')
const OnboardingStep9 = () => import('../pages/onboarding/Step9.vue')
const OnboardingStep10 = () => import('../pages/onboarding/Step10.vue')
const OnboardingStep11 = () => import('../pages/onboarding/Step11.vue')

const routes = [
  { path: '/', name: 'Home', component: Home, meta: { title: 'Home' } },
  { path: '/login', name: 'Login', component: Login, meta: { title: 'Login', public: true } },
  { path: '/people', name: 'People', component: People, meta: { title: 'People' } },
  { path: '/company', name: 'Company', component: Company, meta: { title: 'Company' } },
  { path: '/company/:companyName', name: 'CompanyDetail', component: CompanyDetail, meta: { title: '' } },
  { path: '/campaigns', name: 'Campaigns', component: Campaigns, meta: { title: 'Campaigns' } },
  { path: '/inbox', name: 'Inbox', component: Inbox, meta: { title: 'Inbox' } },
  { path: '/knowledge', name: 'Knowledge', component: Knowledge, meta: { title: 'Knowledge' } },
  { path: '/settings', name: 'Settings', component: Settings, meta: { title: 'Settings' } }
]

// Onboarding routes
routes.push(
  { path: '/onboarding', redirect: '/onboarding/1', meta: { title: 'Onboarding', public: false, onboarding: true } },
  { path: '/onboarding/1', name: 'OnboardingStep1', component: OnboardingStep1, meta: { title: 'Onboarding • Step 1', onboarding: true } },
  { path: '/onboarding/2', name: 'OnboardingStep2', component: OnboardingStep2, meta: { title: 'Onboarding • Step 2', onboarding: true } },
  { path: '/onboarding/3', name: 'OnboardingStep3', component: OnboardingStep3, meta: { title: 'Onboarding • Step 3', onboarding: true } },
  { path: '/onboarding/4', name: 'OnboardingStep4', component: OnboardingStep4, meta: { title: 'Onboarding • Step 4', onboarding: true } },
  { path: '/onboarding/5', name: 'OnboardingStep5', component: OnboardingStep5, meta: { title: 'Onboarding • Step 5', onboarding: true } },
  { path: '/onboarding/6', name: 'OnboardingStep6', component: OnboardingStep6, meta: { title: 'Onboarding • Step 6', onboarding: true } },
  { path: '/onboarding/7', name: 'OnboardingStep7', component: OnboardingStep7, meta: { title: 'Onboarding • Step 7', onboarding: true } },
  { path: '/onboarding/8', name: 'OnboardingStep8', component: OnboardingStep8, meta: { title: 'Onboarding • Step 8', onboarding: true } },
  { path: '/onboarding/9', name: 'OnboardingStep9', component: OnboardingStep9, meta: { title: 'Onboarding • Step 9', onboarding: true } },
  { path: '/onboarding/10', name: 'OnboardingStep10', component: OnboardingStep10, meta: { title: 'Onboarding • Step 10', onboarding: true } },
  { path: '/onboarding/11', name: 'OnboardingStep11', component: OnboardingStep11, meta: { title: 'Onboarding • Step 11', onboarding: true } }
)

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Simple auth using localStorage
function isAuthenticated() {
  try {
    const auth = JSON.parse(localStorage.getItem('outbounder-auth') || 'null')
    return Boolean(auth && auth.token)
  } catch (_e) {
    return false
  }
}

function isOnboardingComplete() {
  try {
    const status = JSON.parse(localStorage.getItem('outbounder-onboarding-status') || 'null')
    return Boolean(status && status.completed)
  } catch (_e) {
    return false
  }
}

function firstOnboardingStepPath() {
  // For now, always start at step 1. Could inspect saved progress later.
  return '/onboarding/1'
}

router.beforeEach((to, _from, next) => {
  const isPublic = to.meta && to.meta.public
  const authed = isAuthenticated()
  const onboardingDone = isOnboardingComplete()
  const isOnboardingRoute = Boolean(to.meta && to.meta.onboarding)
  const force = to.query && (to.query.force === '1' || to.query.force === 'true')
  const doLogout = to.name === 'Login' && to.query && (to.query.logout === '1' || to.query.logout === 'true')

  // Allow explicit logout via /login?logout=1
  if (doLogout) {
    localStorage.removeItem('outbounder-auth')
    localStorage.removeItem('outbounder-onboarding-status')
  }

  if (!isPublic && !authed) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }

  if (isPublic && to.name === 'Login') {
    if (force) {
      next()
      return
    }
    if (authed) {
      if (!onboardingDone) {
        next(firstOnboardingStepPath())
        return
      }
      next({ name: 'Home' })
      return
    }
  }

  // If authed but onboarding not complete, redirect to onboarding unless already there
  if (authed && !onboardingDone && !isOnboardingRoute) {
    next(firstOnboardingStepPath())
    return
  }

  next()
})

export default router


