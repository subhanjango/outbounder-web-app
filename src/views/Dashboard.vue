<template>
  <AppLayout>
    <div class="dashboard">
      <div class="welcome-section">
        <h1>Welcome back, {{ userName }}!</h1>
        <p>Here's what's happening with your outbound activities</p>
      </div>
      
      <div class="stats-grid">
        <Card class="stat-card">
          <template #content>
            <div class="stat-content">
              <div class="stat-icon contacts">
                <i class="pi pi-users"></i>
              </div>
              <div class="stat-details">
                <h3>{{ stats.totalContacts }}</h3>
                <p>Total Contacts</p>
              </div>
            </div>
          </template>
        </Card>
        
        <Card class="stat-card">
          <template #content>
            <div class="stat-content">
              <div class="stat-icon accounts">
                <i class="pi pi-building"></i>
              </div>
              <div class="stat-details">
                <h3>{{ stats.totalAccounts }}</h3>
                <p>Total Accounts</p>
              </div>
            </div>
          </template>
        </Card>
        
        <Card class="stat-card">
          <template #content>
            <div class="stat-content">
              <div class="stat-icon conversations">
                <i class="pi pi-comments"></i>
              </div>
              <div class="stat-details">
                <h3>{{ stats.activeConversations }}</h3>
                <p>Active Conversations</p>
              </div>
            </div>
          </template>
        </Card>
        
        <Card class="stat-card">
          <template #content>
            <div class="stat-content">
              <div class="stat-icon enriched">
                <i class="pi pi-chart-line"></i>
              </div>
              <div class="stat-details">
                <h3>{{ stats.enrichedContacts }}</h3>
                <p>Enriched Contacts</p>
              </div>
            </div>
          </template>
        </Card>
      </div>
      
      <div class="dashboard-grid">
        <Card class="quick-actions-card">
          <template #header>
            <h3>Quick Actions</h3>
          </template>
          <template #content>
            <div class="quick-actions">
              <Button 
                @click="$router.push('/contacts')"
                label="Import Contacts" 
                icon="pi pi-upload"
                class="p-button-outlined action-button"
              />
              <Button 
                @click="$router.push('/company-research')"
                label="Research Companies" 
                icon="pi pi-search"
                class="p-button-outlined action-button"
              />
              <Button 
                @click="$router.push('/chat')"
                label="Chat with AI" 
                icon="pi pi-comments"
                class="p-button-outlined action-button"
              />
              <Button 
                @click="$router.push('/knowledge-base')"
                label="Upload Knowledge" 
                icon="pi pi-book"
                class="p-button-outlined action-button"
              />
            </div>
          </template>
        </Card>
        
        <Card class="recent-activity-card">
          <template #header>
            <h3>Recent Activity</h3>
          </template>
          <template #content>
            <div class="activity-list">
              <div v-for="activity in recentActivities" :key="activity.id" class="activity-item">
                <div class="activity-icon">
                  <i :class="activity.icon"></i>
                </div>
                <div class="activity-details">
                  <p class="activity-text">{{ activity.text }}</p>
                  <small class="activity-time">{{ activity.time }}</small>
                </div>
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>
  </AppLayout>
</template>

<script>
import AppLayout from '../components/AppLayout.vue'
import Card from 'primevue/card'
import Button from 'primevue/button'

export default {
  name: 'Dashboard',
  components: {
    AppLayout,
    Card,
    Button
  },
  data() {
    return {
      stats: {
        totalContacts: 1247,
        totalAccounts: 89,
        activeConversations: 23,
        enrichedContacts: 856
      },
      recentActivities: [
        {
          id: 1,
          icon: 'pi pi-upload',
          text: 'Imported 50 new contacts from CSV',
          time: '2 hours ago'
        },
        {
          id: 2,
          icon: 'pi pi-chart-line',
          text: 'Enriched 25 contact profiles',
          time: '4 hours ago'
        },
        {
          id: 3,
          icon: 'pi pi-comments',
          text: 'Started conversation with John Doe',
          time: '6 hours ago'
        },
        {
          id: 4,
          icon: 'pi pi-search',
          text: 'Completed research on TechCorp Inc.',
          time: '1 day ago'
        },
        {
          id: 5,
          icon: 'pi pi-book',
          text: 'Updated knowledge base with new account info',
          time: '2 days ago'
        }
      ]
    }
  },
  computed: {
    userName() {
      return localStorage.getItem('userName') || 'User'
    }
  }
}
</script>

<style scoped>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-section {
  margin-bottom: 30px;
}

.welcome-section h1 {
  margin: 0 0 8px 0;
  color: #1f2937;
  font-size: 32px;
}

.welcome-section p {
  margin: 0;
  color: #6b7280;
  font-size: 16px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.stat-icon.contacts {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-icon.accounts {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-icon.conversations {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-icon.enriched {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.stat-details h3 {
  margin: 0 0 4px 0;
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
}

.stat-details p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.quick-actions-card,
.recent-activity-card {
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.quick-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.action-button {
  justify-content: flex-start;
}

.activity-list {
  max-height: 300px;
  overflow-y: auto;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  flex-shrink: 0;
}

.activity-details {
  flex: 1;
}

.activity-text {
  margin: 0 0 4px 0;
  color: #374151;
  font-size: 14px;
}

.activity-time {
  color: #9ca3af;
  font-size: 12px;
}

@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  
  .quick-actions {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>