<template>
  <AppLayout>
    <div class="contact-chat-page">
      <div class="chat-header">
        <div class="contact-info">
          <Button 
            @click="$router.go(-1)"
            icon="pi pi-arrow-left" 
            class="p-button-text back-button"
          />
          <Avatar 
            :label="contact?.name?.charAt(0)" 
            class="contact-avatar"
            shape="circle"
          />
          <div class="contact-details">
            <h2>{{ contact?.name }}</h2>
            <p>{{ contact?.title }} at {{ contact?.company }}</p>
            <small class="contact-status">
              <i class="pi pi-circle-fill" :class="contact?.online ? 'online' : 'offline'"></i>
              {{ contact?.online ? 'Online' : 'Last seen 2 hours ago' }}
            </small>
          </div>
        </div>
        
        <div class="chat-actions">
          <Button 
            @click="sendLinkedInMessage"
            label="LinkedIn" 
            icon="pi pi-linkedin"
            class="p-button-outlined"
          />
          <Button 
            @click="sendEmail"
            label="Email" 
            icon="pi pi-envelope"
            class="p-button-outlined"
          />
          <Button 
            @click="showContactDetails = true"
            icon="pi pi-info-circle" 
            class="p-button-text"
            v-tooltip="'Contact Details'"
          />
        </div>
      </div>
      
      <div class="chat-container">
        <Card class="chat-card">
          <template #content>
            <div class="chat-messages" ref="messagesContainer">
              <div v-if="!conversation.length" class="empty-conversation">
                <div class="empty-icon">
                  <i class="pi pi-comments"></i>
                </div>
                <h3>Start a conversation</h3>
                <p>Send a message to {{ contact?.name }} to begin your conversation</p>
                <div class="suggested-messages">
                  <h4>Suggested opening messages:</h4>
                  <Button 
                    v-for="suggestion in suggestedMessages"
                    :key="suggestion.id"
                    @click="sendMessage(suggestion.text)"
                    :label="suggestion.text"
                    class="p-button-outlined suggestion-button"
                  />
                </div>
              </div>
              
              <div v-for="message in conversation" :key="message.id" class="message-wrapper">
                <div :class="['message', message.sender]">
                  <div v-if="message.sender === 'contact'" class="message-avatar">
                    <Avatar 
                      :label="contact?.name?.charAt(0)" 
                      class="contact-msg-avatar"
                      shape="circle"
                    />
                  </div>
                  <div class="message-content">
                    <div class="message-text">{{ message.text }}</div>
                    <div class="message-meta">
                      <span class="message-time">{{ formatTime(message.timestamp) }}</span>
                      <i v-if="message.sender === 'user'" :class="getStatusIcon(message.status)"></i>
                    </div>
                  </div>
                  <div v-if="message.sender === 'user'" class="message-avatar">
                    <Avatar 
                      :label="userInitial"
                      class="user-msg-avatar"
                      shape="circle"
                    />
                  </div>
                </div>
              </div>
              
              <div v-if="contactTyping" class="typing-indicator">
                <Avatar 
                  :label="contact?.name?.charAt(0)" 
                  class="contact-msg-avatar"
                  shape="circle"
                />
                <div class="typing-content">
                  <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <small>{{ contact?.name }} is typing...</small>
                </div>
              </div>
            </div>
            
            <div class="chat-input">
              <div class="input-wrapper">
                <Button 
                  @click="showTemplates = true"
                  icon="pi pi-file"
                  class="p-button-text template-button"
                  v-tooltip="'Message Templates'"
                />
                <Textarea 
                  v-model="currentMessage"
                  @keydown.enter.exact="handleEnter"
                  placeholder="Type your message..."
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
      
      <Dialog 
        v-model:visible="showContactDetails" 
        modal 
        :header="contact?.name"
        :style="{ width: '500px' }"
      >
        <div v-if="contact" class="contact-detail-dialog">
          <div class="detail-grid">
            <div class="detail-item">
              <label>Email</label>
              <span>{{ contact.email }}</span>
            </div>
            <div class="detail-item">
              <label>Company</label>
              <span>{{ contact.company }}</span>
            </div>
            <div class="detail-item">
              <label>Title</label>
              <span>{{ contact.title }}</span>
            </div>
            <div class="detail-item">
              <label>Status</label>
              <Tag :value="contact.status" :severity="getStatusSeverity(contact.status)" />
            </div>
          </div>
          
          <div class="interaction-history">
            <h4>Recent Interactions</h4>
            <div class="history-list">
              <div v-for="interaction in contact.interactions" :key="interaction.id" class="history-item">
                <i :class="interaction.icon" class="interaction-icon"></i>
                <div class="interaction-details">
                  <span>{{ interaction.description }}</span>
                  <small>{{ formatDate(interaction.date) }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
      
      <Dialog 
        v-model:visible="showTemplates" 
        modal 
        header="Message Templates"
        :style="{ width: '600px' }"
      >
        <div class="templates-dialog">
          <div v-for="template in messageTemplates" :key="template.id" class="template-item">
            <Card class="template-card" @click="useTemplate(template)">
              <template #content>
                <h4>{{ template.name }}</h4>
                <p class="template-preview">{{ template.preview }}</p>
                <div class="template-tags">
                  <Tag v-for="tag in template.tags" :key="tag" :value="tag" class="template-tag" />
                </div>
              </template>
            </Card>
          </div>
        </div>
      </Dialog>
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
import Dialog from 'primevue/dialog'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'

export default {
  name: 'ContactChat',
  components: {
    AppLayout,
    Card,
    Button,
    Textarea,
    Avatar,
    Tag,
    Dialog,
    Toast
  },
  data() {
    return {
      contact: null,
      conversation: [],
      currentMessage: '',
      sending: false,
      contactTyping: false,
      showContactDetails: false,
      showTemplates: false,
      suggestedMessages: [
        { id: 1, text: "Hi, I'd love to connect and learn more about your work at [Company]" },
        { id: 2, text: "I noticed your recent post about [Topic] - would love to discuss further" },
        { id: 3, text: "I'm reaching out regarding potential collaboration opportunities" }
      ],
      messageTemplates: [
        {
          id: 1,
          name: 'Introduction',
          preview: 'Hi [Name], I came across your profile and was impressed by your work...',
          content: `Hi {{contact.name}},

I came across your profile and was impressed by your work at {{contact.company}}. I'd love to connect and learn more about your experience in {{contact.industry}}.

Best regards,
{{user.name}}`,
          tags: ['intro', 'networking']
        },
        {
          id: 2,
          name: 'Follow Up',
          preview: 'Thanks for connecting! I wanted to follow up on our previous conversation...',
          content: `Hi {{contact.name}},

Thanks for connecting! I wanted to follow up on our previous conversation about {{topic}}. 

I'd love to schedule a brief call to discuss how we might collaborate.

Best,
{{user.name}}`,
          tags: ['follow-up', 'meeting']
        },
        {
          id: 3,
          name: 'Value Proposition',
          preview: 'I noticed [Company] is working on [Project]. We help companies like yours...',
          content: `Hi {{contact.name}},

I noticed {{contact.company}} is working on {{project}}. We help companies like yours {{value_proposition}}.

Would you be interested in a brief conversation about how we could support your goals?

Best regards,
{{user.name}}`,
          tags: ['value', 'sales']
        }
      ]
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
  async mounted() {
    await this.loadContact()
    await this.loadConversation()
  },
  methods: {
    async loadContact() {
      const contactId = this.$route.params.contactId
      
      // Mock contact data - in real app, fetch from API
      const mockContacts = {
        '1': {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@techcorp.com',
          company: 'TechCorp Inc.',
          title: 'Software Engineer',
          status: 'Active',
          online: true,
          industry: 'Technology',
          interactions: [
            {
              id: 1,
              icon: 'pi pi-envelope',
              description: 'Email sent - Introduction',
              date: new Date('2024-01-15')
            },
            {
              id: 2,
              icon: 'pi pi-linkedin',
              description: 'LinkedIn connection request sent',
              date: new Date('2024-01-14')
            },
            {
              id: 3,
              icon: 'pi pi-phone',
              description: 'Called - No answer',
              date: new Date('2024-01-12')
            }
          ]
        },
        '2': {
          id: 2,
          name: 'Jane Smith',
          email: 'jane.smith@innovate.com',
          company: 'Innovate Solutions',
          title: 'Product Manager',
          status: 'Prospect',
          online: false,
          industry: 'Consulting',
          interactions: []
        }
      }
      
      this.contact = mockContacts[contactId] || mockContacts['1']
    },
    
    async loadConversation() {
      // Mock conversation data
      this.conversation = [
        {
          id: 1,
          sender: 'user',
          text: 'Hi John! I came across your work at TechCorp and was really impressed with your AI/ML projects.',
          timestamp: new Date('2024-01-15T10:30:00'),
          status: 'delivered'
        },
        {
          id: 2,
          sender: 'contact',
          text: 'Hi! Thanks for reaching out. I appreciate the kind words about our work. What brings you to TechCorp?',
          timestamp: new Date('2024-01-15T11:15:00')
        },
        {
          id: 3,
          sender: 'user',
          text: 'I\'m working on some interesting projects in the AI space and thought there might be synergy between what we\'re building and TechCorp\'s direction.',
          timestamp: new Date('2024-01-15T11:45:00'),
          status: 'read'
        }
      ]
    },
    
    formatTime(timestamp) {
      return new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      }).format(timestamp)
    },
    
    formatDate(date) {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(date)
    },
    
    getStatusIcon(status) {
      switch (status) {
        case 'sent': return 'pi pi-check text-gray-400'
        case 'delivered': return 'pi pi-check-circle text-blue-500'
        case 'read': return 'pi pi-eye text-green-500'
        default: return 'pi pi-clock text-gray-400'
      }
    },
    
    getStatusSeverity(status) {
      switch (status) {
        case 'Active': return 'success'
        case 'Prospect': return 'warning'
        case 'Lead': return 'info'
        default: return null
      }
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
      
      const message = {
        id: Date.now(),
        sender: 'user',
        text: text,
        timestamp: new Date(),
        status: 'sent'
      }
      
      this.conversation.push(message)
      this.sending = true
      
      // Scroll to bottom
      this.$nextTick(() => {
        this.scrollToBottom()
      })
      
      try {
        // Simulate message sending
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Update message status
        message.status = 'delivered'
        
        // Simulate contact typing and response (30% chance)
        if (Math.random() < 0.3) {
          this.contactTyping = true
          await new Promise(resolve => setTimeout(resolve, 2000))
          
          const responses = [
            "That sounds interesting! Tell me more.",
            "I'd be happy to discuss this further. When are you available for a call?",
            "Thanks for sharing. Let me think about this and get back to you.",
            "Interesting perspective. Have you considered the challenges with scalability?",
            "I appreciate you reaching out. Our team might be interested in exploring this."
          ]
          
          const contactResponse = {
            id: Date.now() + 1,
            sender: 'contact',
            text: responses[Math.floor(Math.random() * responses.length)],
            timestamp: new Date()
          }
          
          this.conversation.push(contactResponse)
          this.contactTyping = false
          message.status = 'read'
          
          this.$nextTick(() => {
            this.scrollToBottom()
          })
        }
        
        this.toast.add({
          severity: 'success',
          summary: 'Message Sent',
          detail: 'Your message has been sent successfully',
          life: 3000
        })
      } catch (error) {
        this.toast.add({
          severity: 'error',
          summary: 'Send Failed',
          detail: 'Failed to send message',
          life: 3000
        })
      } finally {
        this.sending = false
      }
    },
    
    sendLinkedInMessage() {
      this.toast.add({
        severity: 'info',
        summary: 'LinkedIn',
        detail: `Opening LinkedIn to message ${this.contact.name}`,
        life: 3000
      })
    },
    
    sendEmail() {
      window.location.href = `mailto:${this.contact.email}?subject=Hello from ${localStorage.getItem('userName')}`
    },
    
    useTemplate(template) {
      const processedContent = this.processTemplate(template.content)
      this.currentMessage = processedContent
      this.showTemplates = false
    },
    
    processTemplate(content) {
      return content
        .replace(/\{\{contact\.name\}\}/g, this.contact.name)
        .replace(/\{\{contact\.company\}\}/g, this.contact.company)
        .replace(/\{\{contact\.industry\}\}/g, this.contact.industry)
        .replace(/\{\{user\.name\}\}/g, localStorage.getItem('userName') || 'Your Name')
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
.contact-chat-page {
  height: calc(100vh - 140px);
  display: flex;
  flex-direction: column;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 24px;
}

.contact-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-button {
  color: #6b7280 !important;
}

.contact-avatar {
  background: #667eea;
  color: white;
  font-weight: 600;
  width: 48px;
  height: 48px;
}

.contact-details h2 {
  margin: 0 0 4px 0;
  color: #1f2937;
  font-size: 20px;
}

.contact-details p {
  margin: 0 0 4px 0;
  color: #6b7280;
  font-size: 14px;
}

.contact-status {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #9ca3af;
  font-size: 12px;
}

.contact-status .online {
  color: #10b981;
}

.contact-status .offline {
  color: #6b7280;
}

.chat-actions {
  display: flex;
  gap: 12px;
}

.chat-container {
  flex: 1;
  height: 0;
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
  max-height: 400px;
}

.empty-conversation {
  text-align: center;
  padding: 40px 20px;
  color: #6b7280;
}

.empty-icon {
  font-size: 48px;
  color: #667eea;
  margin-bottom: 16px;
}

.empty-conversation h3 {
  margin: 0 0 8px 0;
  color: #1f2937;
}

.suggested-messages {
  margin-top: 24px;
}

.suggested-messages h4 {
  margin: 0 0 12px 0;
  color: #374151;
  font-size: 14px;
}

.suggestion-button {
  margin: 8px 4px;
  font-size: 12px;
}

.message-wrapper {
  margin-bottom: 24px;
}

.message {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.message.user {
  flex-direction: row-reverse;
}

.message-avatar {
  flex-shrink: 0;
}

.contact-msg-avatar {
  background: #f3f4f6;
  color: #6b7280;
  font-weight: 600;
}

.user-msg-avatar {
  background: #667eea;
  color: white;
  font-weight: 600;
}

.message-content {
  max-width: 70%;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  padding: 12px 16px;
}

.message.user .message-content {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.message-text {
  line-height: 1.5;
  font-size: 14px;
  margin-bottom: 4px;
}

.message-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  color: #9ca3af;
}

.message.user .message-meta {
  color: rgba(255, 255, 255, 0.7);
}

.typing-indicator {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  margin-bottom: 24px;
}

.typing-content {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  padding: 12px 16px;
}

.typing-dots {
  display: flex;
  gap: 4px;
  margin-bottom: 4px;
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
  gap: 8px;
  align-items: flex-end;
}

.template-button {
  color: #6b7280 !important;
}

.message-input {
  flex: 1;
  resize: none;
}

.send-button {
  align-self: flex-end;
}

.contact-detail-dialog {
  padding: 20px 0;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-item label {
  font-weight: 600;
  color: #6b7280;
  font-size: 12px;
  text-transform: uppercase;
}

.detail-item span {
  color: #1f2937;
  font-size: 14px;
}

.interaction-history h4 {
  margin: 0 0 16px 0;
  color: #1f2937;
  padding-top: 16px;
  border-top: 1px solid #f3f4f6;
}

.history-list {
  max-height: 200px;
  overflow-y: auto;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid #f9fafb;
}

.history-item:last-child {
  border-bottom: none;
}

.interaction-icon {
  color: #667eea;
  font-size: 14px;
  width: 20px;
}

.interaction-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.interaction-details span {
  font-size: 13px;
  color: #374151;
}

.interaction-details small {
  font-size: 11px;
  color: #9ca3af;
}

.templates-dialog {
  display: grid;
  gap: 16px;
  max-height: 400px;
  overflow-y: auto;
}

.template-card {
  cursor: pointer;
  transition: all 0.2s;
}

.template-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.template-card h4 {
  margin: 0 0 8px 0;
  color: #1f2937;
  font-size: 16px;
}

.template-preview {
  margin: 0 0 12px 0;
  color: #6b7280;
  font-size: 13px;
  line-height: 1.4;
}

.template-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.template-tag {
  font-size: 10px;
  padding: 2px 6px;
}

@media (max-width: 768px) {
  .chat-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .contact-info {
    width: 100%;
  }
  
  .chat-actions {
    width: 100%;
    justify-content: flex-end;
  }
  
  .message-content {
    max-width: 85%;
  }
  
  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>