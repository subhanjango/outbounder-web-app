<template>
  <AppLayout>
    <div class="chat-page">
      <div class="page-header">
        <div class="header-left">
          <h1>AI Assistant</h1>
          <p>Chat with your intelligent outbound assistant</p>
        </div>
        <div class="header-actions">
          <Button 
            @click="clearChat"
            label="Clear Chat" 
            icon="pi pi-trash"
            class="p-button-outlined"
          />
          <Button 
            @click="showKnowledgePanel = !showKnowledgePanel"
            :label="showKnowledgePanel ? 'Hide Knowledge' : 'Show Knowledge'"
            icon="pi pi-book"
            class="p-button-text"
          />
        </div>
      </div>
      
      <div class="chat-container">
        <div class="chat-main">
          <Card class="chat-card">
            <template #content>
              <div class="chat-messages" ref="messagesContainer">
                <div v-if="!messages.length" class="welcome-message">
                  <div class="welcome-icon">
                    <i class="pi pi-comments"></i>
                  </div>
                  <h3>Welcome to your AI Assistant!</h3>
                  <p>I can help you with:</p>
                  <ul class="capabilities-list">
                    <li>Research companies and contacts</li>
                    <li>Draft personalized outreach messages</li>
                    <li>Analyze your knowledge base</li>
                    <li>Suggest conversation strategies</li>
                    <li>Answer questions about your accounts</li>
                  </ul>
                  <div class="sample-questions">
                    <h4>Try asking:</h4>
                    <Button 
                      v-for="sample in sampleQuestions"
                      :key="sample.id"
                      @click="sendMessage(sample.text)"
                      :label="sample.text"
                      class="p-button-outlined sample-question"
                    />
                  </div>
                </div>
                
                <div v-for="message in messages" :key="message.id" class="message-wrapper">
                  <div :class="['message', message.type]">
                    <div class="message-avatar">
                      <Avatar 
                        v-if="message.type === 'user'"
                        :label="userInitial"
                        class="user-avatar"
                        shape="circle"
                      />
                      <div v-else class="ai-avatar">
                        <i class="pi pi-sparkles"></i>
                      </div>
                    </div>
                    <div class="message-content">
                      <div class="message-header">
                        <span class="message-sender">
                          {{ message.type === 'user' ? 'You' : 'AI Assistant' }}
                        </span>
                        <span class="message-time">{{ formatTime(message.timestamp) }}</span>
                      </div>
                      <div class="message-text" v-html="formatMessage(message.text)"></div>
                      <div v-if="message.actions" class="message-actions">
                        <Button 
                          v-for="action in message.actions"
                          :key="action.id"
                          @click="executeAction(action)"
                          :label="action.label"
                          :icon="action.icon"
                          class="p-button-sm p-button-outlined action-button"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div v-if="typing" class="typing-indicator">
                  <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span>AI Assistant is typing...</span>
                </div>
              </div>
              
              <div class="chat-input">
                <div class="input-wrapper">
                  <Textarea 
                    v-model="currentMessage"
                    @keydown.enter.exact="handleEnter"
                    placeholder="Ask me anything about your outbound activities..."
                    :autoResize="true"
                    rows="1"
                    class="message-input"
                  />
                  <Button 
                    @click="sendCurrentMessage"
                    icon="pi pi-send"
                    :disabled="!currentMessage.trim() || sending"
                    :loading="sending"
                    class="send-button"
                  />
                </div>
              </div>
            </template>
          </Card>
        </div>
        
        <div v-if="showKnowledgePanel" class="knowledge-panel">
          <Card class="knowledge-card">
            <template #header>
              <h3>Knowledge Sources</h3>
            </template>
            <template #content>
              <div class="knowledge-sources">
                <div v-for="source in knowledgeSources" :key="source.id" class="knowledge-item">
                  <div class="source-info">
                    <i :class="source.icon" class="source-icon"></i>
                    <div class="source-details">
                      <h4>{{ source.name }}</h4>
                      <small>{{ source.description }}</small>
                    </div>
                  </div>
                  <Tag 
                    :value="source.status"
                    :severity="source.status === 'Active' ? 'success' : 'warning'"
                  />
                </div>
              </div>
              
              <div class="knowledge-stats">
                <h4>Knowledge Base Stats</h4>
                <div class="stats-grid">
                  <div class="stat">
                    <span class="stat-value">{{ knowledgeStats.documents }}</span>
                    <span class="stat-label">Documents</span>
                  </div>
                  <div class="stat">
                    <span class="stat-value">{{ knowledgeStats.accounts }}</span>
                    <span class="stat-label">Account Profiles</span>
                  </div>
                  <div class="stat">
                    <span class="stat-value">{{ knowledgeStats.insights }}</span>
                    <span class="stat-label">Insights</span>
                  </div>
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>
    </div>
    
    <Toast />
  </AppLayout>
</template>

<script>
import AppLayout from '../components/AppLayout.vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Textarea from 'primevue/textarea'
import Avatar from 'primevue/avatar'
import Tag from 'primevue/tag'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'

export default {
  name: 'Chat',
  components: {
    AppLayout,
    Card,
    Button,
    Textarea,
    Avatar,
    Tag,
    Toast
  },
  data() {
    return {
      messages: [],
      currentMessage: '',
      typing: false,
      sending: false,
      showKnowledgePanel: true,
      sampleQuestions: [
        { id: 1, text: "Help me draft an email to TechCorp Inc." },
        { id: 2, text: "What do you know about my recent contacts?" },
        { id: 3, text: "Suggest outreach strategies for fintech companies" },
        { id: 4, text: "Analyze the performance of my last campaign" }
      ],
      knowledgeSources: [
        {
          id: 1,
          name: 'Account Database',
          description: '89 company profiles with research data',
          icon: 'pi pi-building',
          status: 'Active'
        },
        {
          id: 2,
          name: 'Contact Enrichment',
          description: '1,247 enriched contact profiles',
          icon: 'pi pi-users',
          status: 'Active'
        },
        {
          id: 3,
          name: 'Campaign History',
          description: 'Historical outreach data and analytics',
          icon: 'pi pi-chart-line',
          status: 'Active'
        },
        {
          id: 4,
          name: 'Industry Insights',
          description: 'Market research and trend analysis',
          icon: 'pi pi-globe',
          status: 'Pending'
        }
      ],
      knowledgeStats: {
        documents: 145,
        accounts: 89,
        insights: 23
      }
    }
  },
  setup() {
    const toast = useToast()
    return { toast }
  },
  computed: {
    userInitial() {
      const name = localStorage.getItem('userName') || 'User'
      return name.charAt(0).toUpperCase()
    }
  },
  methods: {
    formatTime(timestamp) {
      return new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      }).format(timestamp)
    },
    
    formatMessage(text) {
      // Simple markdown-like formatting
      return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>')
    },
    
    handleEnter(event) {
      if (!event.shiftKey) {
        event.preventDefault()
        this.sendCurrentMessage()
      }
    },
    
    sendCurrentMessage() {
      if (!this.currentMessage.trim()) return
      this.sendMessage(this.currentMessage)
      this.currentMessage = ''
    },
    
    async sendMessage(text) {
      if (this.sending) return
      
      const userMessage = {
        id: Date.now(),
        type: 'user',
        text: text,
        timestamp: new Date()
      }
      
      this.messages.push(userMessage)
      this.sending = true
      this.typing = true
      
      // Scroll to bottom
      this.$nextTick(() => {
        this.scrollToBottom()
      })
      
      try {
        // Simulate AI response
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        const aiResponse = this.generateAIResponse(text)
        
        this.messages.push(aiResponse)
        
        this.$nextTick(() => {
          this.scrollToBottom()
        })
      } catch (error) {
        this.toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to get AI response',
          life: 3000
        })
      } finally {
        this.typing = false
        this.sending = false
      }
    },
    
    generateAIResponse(userText) {
      const responses = {
        email: {
          text: `I'd be happy to help you draft an email to TechCorp Inc.! Based on your knowledge base, here's a personalized draft:

**Subject**: Exploring AI/ML Partnership Opportunities

Hi [Contact Name],

I noticed TechCorp's recent growth in AI/ML solutions and thought there might be synergy with what we're building at [Your Company]. 

Your recent product launches caught my attention, particularly [specific product]. We've been helping similar enterprise software companies accelerate their growth through [your value proposition].

Would you be open to a brief 15-minute conversation next week to explore potential collaboration opportunities?

Best regards,
[Your Name]`,
          actions: [
            { id: 1, label: 'Copy to Clipboard', icon: 'pi pi-copy' },
            { id: 2, label: 'Send Email', icon: 'pi pi-envelope' },
            { id: 3, label: 'Save Template', icon: 'pi pi-save' }
          ]
        },
        contacts: {
          text: `Here's a summary of your recent contact activity:

**Recent Contacts Overview:**
- **Total Contacts**: 1,247
- **Recently Added**: 50 new contacts from CSV import
- **Enriched Profiles**: 856 (68.6%)
- **Active Conversations**: 23

**Top Companies by Contact Count:**
1. TechCorp Inc. (15 contacts)
2. Innovate Solutions (8 contacts)
3. StartupCo (3 contacts)

**Engagement Insights:**
- 23 active conversations in progress
- 15 LinkedIn connections made this week
- 8 email responses received

Would you like me to help with outreach to any specific contacts?`,
          actions: [
            { id: 1, label: 'View Contact Details', icon: 'pi pi-users' },
            { id: 2, label: 'Export Report', icon: 'pi pi-download' }
          ]
        },
        strategy: {
          text: `Here are some effective outreach strategies for fintech companies:

**1. Industry-Specific Approach**
- Reference recent fintech trends (embedded finance, API banking)
- Mention regulatory compliance expertise
- Highlight security and scalability benefits

**2. Personalization Tactics**
- Research their funding rounds or recent news
- Reference their specific technology stack
- Mention mutual connections in fintech

**3. Value Propositions**
- Focus on ROI and time-to-market
- Emphasize data security and compliance
- Highlight integration capabilities

**4. Timing Considerations**
- Reach out Tuesday-Thursday, 10-11 AM
- Avoid end of quarter/month for budget discussions
- Follow up within 3-5 business days

Would you like me to create a specific outreach sequence for any fintech prospects?`,
          actions: [
            { id: 1, label: 'Create Template', icon: 'pi pi-file' },
            { id: 2, label: 'View Fintech Contacts', icon: 'pi pi-filter' }
          ]
        },
        default: {
          text: `I understand you're asking about "${userText}". Based on your knowledge base and current activities, I can help you with:

- **Research & Analysis**: Company information, market insights, and competitive intelligence
- **Outreach Strategy**: Personalized messaging, timing recommendations, and follow-up sequences  
- **Content Creation**: Email templates, LinkedIn messages, and call scripts
- **Performance Tracking**: Campaign analytics, response rates, and optimization suggestions

Could you be more specific about what you'd like help with? I have access to your account data, contact information, and industry insights to provide targeted assistance.`,
          actions: [
            { id: 1, label: 'Browse Knowledge Base', icon: 'pi pi-book' },
            { id: 2, label: 'View Recent Activity', icon: 'pi pi-history' }
          ]
        }
      }
      
      let response
      if (userText.toLowerCase().includes('email') || userText.toLowerCase().includes('draft')) {
        response = responses.email
      } else if (userText.toLowerCase().includes('contact') || userText.toLowerCase().includes('recent')) {
        response = responses.contacts
      } else if (userText.toLowerCase().includes('strategy') || userText.toLowerCase().includes('fintech')) {
        response = responses.strategy
      } else {
        response = responses.default
      }
      
      return {
        id: Date.now() + 1,
        type: 'ai',
        text: response.text,
        timestamp: new Date(),
        actions: response.actions
      }
    },
    
    executeAction(action) {
      this.toast.add({
        severity: 'info',
        summary: 'Action Executed',
        detail: `${action.label} has been executed`,
        life: 3000
      })
    },
    
    clearChat() {
      this.messages = []
      this.toast.add({
        severity: 'info',
        summary: 'Chat Cleared',
        detail: 'Chat history has been cleared',
        life: 3000
      })
    },
    
    scrollToBottom() {
      const container = this.$refs.messagesContainer
      if (container) {
        container.scrollTop = container.scrollHeight
      }
    }
  }
}
</script>

<style scoped>
.chat-page {
  height: calc(100vh - 140px);
  display: flex;
  flex-direction: column;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.header-left h1 {
  margin: 0 0 8px 0;
  color: #1f2937;
  font-size: 32px;
}

.header-left p {
  margin: 0;
  color: #6b7280;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.chat-container {
  display: flex;
  gap: 24px;
  flex: 1;
  height: 0;
}

.chat-main {
  flex: 1;
}

.chat-card {
  height: 100%;
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.chat-card :deep(.p-card-content) {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  max-height: 500px;
}

.welcome-message {
  text-align: center;
  padding: 40px 20px;
  color: #6b7280;
}

.welcome-icon {
  font-size: 48px;
  color: #667eea;
  margin-bottom: 16px;
}

.welcome-message h3 {
  margin: 0 0 16px 0;
  color: #1f2937;
}

.capabilities-list {
  text-align: left;
  max-width: 400px;
  margin: 20px auto;
}

.capabilities-list li {
  margin-bottom: 8px;
  padding-left: 8px;
}

.sample-questions {
  margin-top: 24px;
}

.sample-questions h4 {
  margin: 0 0 12px 0;
  color: #374151;
}

.sample-question {
  margin: 8px 4px;
}

.message-wrapper {
  margin-bottom: 24px;
}

.message {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.message.user {
  flex-direction: row-reverse;
}

.message-avatar {
  flex-shrink: 0;
}

.user-avatar {
  background: #667eea;
  color: white;
  font-weight: 600;
}

.ai-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.message-content {
  max-width: 70%;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
}

.message.user .message-content {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.message-sender {
  font-weight: 600;
  font-size: 12px;
}

.message.user .message-sender {
  color: rgba(255, 255, 255, 0.9);
}

.message-time {
  font-size: 11px;
  color: #9ca3af;
}

.message.user .message-time {
  color: rgba(255, 255, 255, 0.7);
}

.message-text {
  line-height: 1.6;
  font-size: 14px;
}

.message-actions {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.action-button {
  font-size: 12px;
}

.typing-indicator {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #6b7280;
  font-size: 14px;
}

.typing-dots {
  display: flex;
  gap: 4px;
}

.typing-dots span {
  width: 6px;
  height: 6px;
  background: #6b7280;
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-dots span:nth-child(1) { animation-delay: -0.32s; }
.typing-dots span:nth-child(2) { animation-delay: -0.16s; }

@keyframes typing {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.chat-input {
  border-top: 1px solid #e5e7eb;
  padding: 16px 24px;
}

.input-wrapper {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.message-input {
  flex: 1;
  resize: none;
}

.send-button {
  align-self: flex-end;
}

.knowledge-panel {
  width: 350px;
  flex-shrink: 0;
}

.knowledge-card {
  height: 100%;
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.knowledge-sources {
  margin-bottom: 24px;
}

.knowledge-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
}

.knowledge-item:last-child {
  border-bottom: none;
}

.source-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.source-icon {
  color: #667eea;
  font-size: 16px;
}

.source-details h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
  color: #1f2937;
}

.source-details small {
  color: #6b7280;
  font-size: 12px;
}

.knowledge-stats h4 {
  margin: 0 0 16px 0;
  color: #1f2937;
  font-size: 16px;
  padding-top: 16px;
  border-top: 1px solid #f3f4f6;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.stat {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 20px;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #6b7280;
}

@media (max-width: 768px) {
  .chat-container {
    flex-direction: column;
  }
  
  .knowledge-panel {
    width: 100%;
    height: 200px;
  }
  
  .page-header {
    flex-direction: column;
    gap: 16px;
  }
  
  .header-actions {
    width: 100%;
    justify-content: flex-start;
  }
  
  .message-content {
    max-width: 85%;
  }
}
</style>