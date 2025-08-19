<template>
  <div class="flex flex-column gap-3">
    <!-- Header -->
    <div class="flex align-items-center justify-content-between">
      <div>
        <h1 class="text-3xl font-bold text-color m-0">Inbox</h1>
        <p class="text-color-secondary m-0">Manage your conversations and communications</p>
      </div>
      <div class="flex gap-2">
        <Button 
          label="Compose" 
          icon="pi pi-plus" 
          @click="showComposeDialog = true"
        />
        <Button 
          label="Mark All Read" 
          icon="pi pi-check" 
          outlined
          @click="markAllAsRead"
        />
      </div>
    </div>

    <!-- Chat Interface -->
    <div class="flex gap-3" style="height: calc(100vh - 200px);">
      <!-- Left Panel: Conversations List -->
      <div class="flex-shrink-0" style="width: 350px;">
        <div class="card p-0 h-full flex flex-column">
          <!-- Search and Filter Header -->
          <div class="p-3 border-bottom-1 surface-border">
            <div class="flex align-items-center gap-2 mb-3">
              <InputText 
                v-model="searchValue" 
                placeholder="Search conversations..." 
                class="flex-1"
              />
              <Button 
                icon="pi pi-search" 
                text
                @click="searchMessages"
              />
            </div>
            
            <!-- Filter Tabs -->
            <div class="flex gap-1">
              <Button 
                :label="`All`"
                :outlined="activeFilter !== 'all'"
                size="small"
                @click="activeFilter = 'all'"
              />
              <Button 
                :label="`Unread (${unreadCount})`"
                :outlined="activeFilter !== 'unread'"
                size="small"
                @click="activeFilter = 'unread'"
              />
              <Button 
                :label="`Important`"
                :outlined="activeFilter !== 'important'"
                size="small"
                @click="activeFilter = 'important'"
              />
            </div>
          </div>
          
          <!-- Conversations List -->
          <div class="flex-1 overflow-auto">
            <div 
              v-for="conversation in filteredMessages" 
              :key="conversation.id"
              class="p-3 border-bottom-1 surface-border cursor-pointer hover:surface-hover transition-colors"
              :class="{ 'surface-100': selectedMessage?.id === conversation.id }"
              @click="selectMessage(conversation)"
            >
              <div class="flex align-items-start gap-3">
                <div class="relative">
                  <Avatar 
                    :label="getInitials(conversation.from)" 
                    size="large" 
                    shape="circle"
                    class="bg-gray-200 text-gray-700"
                  />
                  <div 
                    v-if="!conversation.read" 
                    class="absolute -top-1 -right-1 bg-primary border-round-xl w-1rem h-1rem"
                  ></div>
                </div>
                
                <div class="flex-1 min-w-0">
                  <div class="flex align-items-center justify-content-between mb-1">
                    <span class="font-semibold text-color" :class="{ 'font-bold': !conversation.read }">
                      {{ conversation.from }}
                    </span>
                    <div class="flex align-items-center gap-1">
                      <i v-if="conversation.important" class="pi pi-star-fill text-yellow-500 text-sm"></i>
                      <span class="text-xs text-color-secondary">{{ formatTime(conversation.timestamp) }}</span>
                    </div>
                  </div>
                  
                  <div class="text-sm text-color-secondary mb-1 truncate">{{ conversation.subject }}</div>
                  <div class="text-xs text-color-secondary truncate">{{ conversation.preview }}</div>
                  
                  <!-- Channel indicators -->
                  <div class="flex align-items-center gap-1 mt-2">
                    <Tag 
                      v-if="getLastChannel(conversation) === 'linkedin'"
                      value="LinkedIn" 
                      severity="success"
                      size="small"
                    />
                    <Tag 
                      v-if="getLastChannel(conversation) === 'email'"
                      value="Email" 
                      severity="info"
                      size="small"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div v-if="filteredMessages.length === 0" class="text-center py-8">
              <i class="pi pi-inbox text-4xl text-color-secondary mb-3"></i>
              <p class="text-color-secondary">No conversations found</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Panel: Chat View -->
      <div class="flex-1">
        <div class="card p-0 h-full flex flex-column">
          <div v-if="selectedMessage" class="h-full flex flex-column">
            <!-- Chat Header -->
            <div class="flex align-items-center justify-content-between p-4 border-bottom-1 surface-border">
              <div class="flex align-items-center gap-3">
                <Avatar 
                  :label="getInitials(selectedMessage.from)" 
                  size="large" 
                  shape="circle"
                  class="bg-gray-200 text-gray-700"
                />
                <div>
                  <div class="font-semibold text-lg text-color">{{ selectedMessage.from }}</div>
                  <div class="text-sm text-color-secondary">{{ selectedMessage.email }}</div>
                </div>
              </div>
              <div class="flex gap-2">
                <Button 
                  :icon="selectedMessage.important ? 'pi pi-star-fill' : 'pi pi-star'" 
                  text
                  rounded
                  :class="{ 'text-yellow-500': selectedMessage.important }"
                  @click="toggleImportant(selectedMessage)"
                />
                <Button 
                  icon="pi pi-ellipsis-v" 
                  text
                  rounded
                  @click="toggleMessageMenu"
                  aria-haspopup="true"
                  aria-controls="message_menu"
                />
                <Menu 
                  ref="messageMenu" 
                  id="message_menu" 
                  :model="messageMenuItems" 
                  :popup="true" 
                />
              </div>
            </div>
            
            <!-- Chat Messages -->
            <div class="flex-1 overflow-auto p-4" style="background: #f8f9fa;">
              <div class="flex flex-column gap-4">
                <div 
                  v-for="(message, index) in selectedMessage.thread" 
                  :key="index"
                  class="flex"
                  :class="message.isOutgoing ? 'justify-content-end' : 'justify-content-start'"
                >
                  <div class="flex align-items-end gap-2 max-w-30rem">
                    <Avatar 
                      v-if="!message.isOutgoing"
                      :label="getInitials(message.from)" 
                      size="small" 
                      shape="circle"
                      class="bg-gray-200 text-gray-700"
                    />
                    
                    <div class="flex flex-column gap-1">
                      <!-- Message bubble -->
                      <div 
                        class="p-3 border-round-lg"
                        :class="message.isOutgoing 
                          ? 'bg-primary text-primary-contrast ml-auto' 
                          : 'bg-white text-color shadow-1'"
                      >
                        <div class="whitespace-pre-wrap text-sm">{{ message.content }}</div>
                      </div>
                      
                      <!-- Message info -->
                      <div 
                        class="flex align-items-center gap-2 text-xs text-color-secondary"
                        :class="message.isOutgoing ? 'justify-content-end' : 'justify-content-start'"
                      >
                        <Tag 
                          :value="message.channel" 
                          :severity="message.channel === 'email' ? 'info' : 'success'"
                          :icon="message.channel === 'email' ? 'pi pi-envelope' : 'pi pi-linkedin'"
                          size="small"
                        />
                        <span>{{ formatTime(message.timestamp) }}</span>
                      </div>
                    </div>
                    
                    <Avatar 
                      v-if="message.isOutgoing"
                      label="You" 
                      size="small" 
                      shape="circle"
                      class="bg-primary text-primary-contrast"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Message Input -->
            <div class="border-top-1 surface-border p-4">
              <div class="flex flex-column gap-3">
                <!-- Channel Selection -->
                <div class="flex align-items-center gap-2">
                  <span class="text-sm font-medium text-color-secondary">Send via:</span>
                  <div class="flex gap-1">
                    <Button 
                      label="Email" 
                      icon="pi pi-envelope"
                      size="small"
                      :severity="replyChannel === 'email' ? 'primary' : 'secondary'"
                      :outlined="replyChannel !== 'email'"
                      @click="replyChannel = 'email'"
                    />
                    <Button 
                      label="LinkedIn" 
                      icon="pi pi-linkedin"
                      size="small"
                      :severity="replyChannel === 'linkedin' ? 'success' : 'secondary'"
                      :outlined="replyChannel !== 'linkedin'"
                      @click="replyChannel = 'linkedin'"
                    />
                  </div>
                </div>
                
                <!-- Message Input Area -->
                <div class="flex align-items-end gap-2">
                  <div class="flex-1">
                    <Textarea 
                      v-model="replyMessage" 
                      rows="2" 
                      placeholder="Type your message..."
                      class="w-full"
                      @keydown.enter.exact.prevent="sendReply"
                      @keydown.enter.shift.exact="replyMessage += '\n'"
                    />
                  </div>
                  <div class="flex flex-column gap-1">
                    <Button 
                      icon="pi pi-paperclip" 
                      text 
                      rounded
                      v-tooltip="'Attach file'"
                    />
                    <Button 
                      icon="pi pi-send" 
                      :disabled="!replyMessage.trim()"
                      @click="sendReply"
                      v-tooltip="'Send message (Enter)'"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Empty State -->
          <div v-else class="flex align-items-center justify-content-center h-full">
            <div class="text-center">
              <i class="pi pi-comments text-6xl text-color-secondary mb-4"></i>
              <h3 class="text-color-secondary mb-2">Select a conversation</h3>
              <p class="text-color-secondary text-sm">Choose a conversation from the list to start chatting</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Compose Dialog -->
    <Dialog v-model:visible="showComposeDialog" header="Compose Message" :style="{width: '700px'}" modal>
      <div class="flex flex-column gap-4">
        <div class="field">
          <label for="to">To</label>
          <InputText 
            id="to"
            v-model="composeForm.to" 
            placeholder="recipient@example.com"
            class="w-full"
          />
        </div>
        <div class="field">
          <label for="subject">Subject</label>
          <InputText 
            id="subject"
            v-model="composeForm.subject" 
            placeholder="Message subject"
            class="w-full"
          />
        </div>
        <div class="field">
          <label for="message">Message</label>
          <Textarea 
            id="message"
            v-model="composeForm.message" 
            rows="8" 
            placeholder="Type your message here..."
            class="w-full"
          />
        </div>
      </div>
      <template #footer>
        <Button label="Cancel" text @click="cancelCompose" />
        <Button label="Send" @click="sendMessage" />
      </template>
    </Dialog>


  </div>
</template>

<script>
export default {
  name: 'Inbox',
  data() {
    return {
      searchValue: '',
      loading: false,
      selectedMessages: [],
      showComposeDialog: false,
      selectedMessage: null,
      activeFilter: 'all',
      replyChannel: 'email',
      replyMessage: '',
      composeForm: {
        to: '',
        subject: '',
        message: ''
      },
      messageMenuItems: [
        {
          label: 'Reply',
          icon: 'pi pi-reply',
          command: () => this.replyToMessage()
        },
        {
          label: 'Forward',
          icon: 'pi pi-share-alt',
          command: () => this.forwardMessage()
        },
        {
          separator: true
        },
        {
          label: 'Mark as Important',
          icon: 'pi pi-star',
          command: () => this.toggleImportant(this.selectedMessage)
        },
        {
          label: 'Delete',
          icon: 'pi pi-trash',
          command: () => this.deleteMessage(this.selectedMessage)
        }
      ],
      messages: [
        {
          id: 1,
          from: 'Sarah Johnson',
          email: 'sarah@clay.com',
          subject: 'Re: Partnership Opportunity',
          preview: 'Thanks for reaching out about the partnership. I\'d love to discuss this further...',
          content: 'Hi there,\n\nThanks for reaching out about the partnership opportunity. I\'d love to discuss this further and see how we can work together.\n\nCould we schedule a call next week to go over the details?\n\nBest regards,\nSarah Johnson\nClay',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          read: false,
          important: true,
          thread: [
            {
              from: 'You',
              content: 'Hi Sarah,\n\nI hope this email finds you well. I\'ve been following Clay\'s growth and I\'m impressed with your approach to data enrichment.\n\nI\'d love to explore a potential partnership opportunity between our companies. Would you be open to a brief call to discuss this?\n\nBest regards,\nOutbounderAI Team',
              timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
              channel: 'linkedin',
              isOutgoing: true
            },
            {
              from: 'Sarah Johnson',
              content: 'Hi there,\n\nThanks for reaching out! I appreciate you taking the time to learn about Clay.\n\nI\'d be happy to explore potential partnership opportunities. Could you send me some more details about OutbounderAI and what type of partnership you have in mind?\n\nLooking forward to hearing from you.\n\nBest,\nSarah',
              timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
              channel: 'linkedin',
              isOutgoing: false
            },
            {
              from: 'You',
              content: 'Hi Sarah,\n\nThanks for your quick response! OutbounderAI specializes in AI-powered sales automation and we see great synergy with Clay\'s data enrichment capabilities.\n\nWe\'re thinking about a technical integration where Clay\'s data could enhance our AI models for better prospect targeting. This could be valuable for both our customer bases.\n\nWould you be available for a 30-minute call next week to discuss this in more detail?\n\nBest regards,\nOutbounderAI Team',
              timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
              channel: 'email',
              isOutgoing: true
            },
            {
              from: 'Sarah Johnson',
              content: 'Hi there,\n\nThanks for reaching out about the partnership opportunity. I\'d love to discuss this further and see how we can work together.\n\nCould we schedule a call next week to go over the details?\n\nBest regards,\nSarah Johnson\nClay',
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
              channel: 'email',
              isOutgoing: false
            }
          ]
        },
        {
          id: 2,
          from: 'Mike Chen',
          email: 'mike@techstartup.com',
          subject: 'Meeting Follow-up',
          preview: 'Great meeting you yesterday. Here are the next steps we discussed...',
          content: 'Hi,\n\nGreat meeting you yesterday. Here are the next steps we discussed:\n\n1. Send over the proposal by Friday\n2. Schedule a demo for next week\n3. Connect with the technical team\n\nLet me know if you have any questions.\n\nBest,\nMike',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
          read: true,
          important: false,
          thread: [
            {
              from: 'Mike Chen',
              content: 'Hi,\n\nGreat meeting you yesterday. Here are the next steps we discussed:\n\n1. Send over the proposal by Friday\n2. Schedule a demo for next week\n3. Connect with the technical team\n\nLet me know if you have any questions.\n\nBest,\nMike',
              timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
              channel: 'email',
              isOutgoing: false
            }
          ]
        },
        {
          id: 3,
          from: 'Lisa Rodriguez',
          email: 'lisa@marketingpro.com',
          subject: 'Question about your services',
          preview: 'I came across your company and I\'m interested in learning more about...',
          content: 'Hello,\n\nI came across your company and I\'m interested in learning more about your services. Specifically, I\'d like to know:\n\n- Pricing structure\n- Implementation timeline\n- Support options\n\nCould we set up a brief call to discuss?\n\nThanks,\nLisa Rodriguez',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
          read: true,
          important: false,
          thread: [
            {
              from: 'Lisa Rodriguez',
              content: 'Hello,\n\nI came across your company and I\'m interested in learning more about your services. Specifically, I\'d like to know:\n\n- Pricing structure\n- Implementation timeline\n- Support options\n\nCould we set up a brief call to discuss?\n\nThanks,\nLisa Rodriguez',
              timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
              channel: 'email',
              isOutgoing: false
            }
          ]
        },
        {
          id: 4,
          from: 'David Park',
          email: 'david@innovatecorp.com',
          subject: 'Interested in your solution',
          preview: 'We\'re looking for a solution like yours for our team of 50+ people...',
          content: 'Hi,\n\nWe\'re looking for a solution like yours for our team of 50+ people. We\'d like to understand:\n\n- Scalability options\n- Enterprise features\n- Custom integrations\n\nWhen would be a good time to chat?\n\nRegards,\nDavid Park\nInnovateCorp',
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
          read: false,
          important: true,
          thread: [
            {
              from: 'David Park',
              content: 'Hi,\n\nWe\'re looking for a solution like yours for our team of 50+ people. We\'d like to understand:\n\n- Scalability options\n- Enterprise features\n- Custom integrations\n\nWhen would be a good time to chat?\n\nRegards,\nDavid Park\nInnovateCorp',
              timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
              channel: 'linkedin',
              isOutgoing: false
            }
          ]
        },
        {
          id: 5,
          from: 'Emma Wilson',
          email: 'emma@designstudio.com',
          subject: 'Demo Request',
          preview: 'Could we schedule a demo of your platform? We\'re evaluating options...',
          content: 'Hello,\n\nCould we schedule a demo of your platform? We\'re evaluating options for our design team and your solution looks promising.\n\nWe\'re available:\n- Tuesday 2-4 PM\n- Wednesday 10 AM - 12 PM\n- Friday 1-3 PM\n\nLet me know what works best.\n\nBest,\nEmma Wilson',
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
          read: true,
          important: false,
          thread: [
            {
              from: 'Emma Wilson',
              content: 'Hello,\n\nCould we schedule a demo of your platform? We\'re evaluating options for our design team and your solution looks promising.\n\nWe\'re available:\n- Tuesday 2-4 PM\n- Wednesday 10 AM - 12 PM\n- Friday 1-3 PM\n\nLet me know what works best.\n\nBest,\nEmma Wilson',
              timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
              channel: 'email',
              isOutgoing: false
            }
          ]
        }
      ]
    }
  },
  computed: {
    filteredMessages() {
      let filtered = this.messages

      // Apply search filter
      if (this.searchValue) {
        const search = this.searchValue.toLowerCase()
        filtered = filtered.filter(message => 
          message.from.toLowerCase().includes(search) ||
          message.subject.toLowerCase().includes(search) ||
          message.preview.toLowerCase().includes(search) ||
          message.email.toLowerCase().includes(search)
        )
      }

      // Apply status filter
      if (this.activeFilter === 'unread') {
        filtered = filtered.filter(message => !message.read)
      } else if (this.activeFilter === 'important') {
        filtered = filtered.filter(message => message.important)
      }

      // Sort by timestamp (newest first)
      return filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    },
    unreadCount() {
      return this.messages.filter(message => !message.read).length
    },
    importantCount() {
      return this.messages.filter(message => message.important).length
    }
  },
  methods: {
    searchMessages() {
      // Search is reactive, this method can be used for additional search logic if needed
    },
    getInitials(name) {
      return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase()
    },

    getRowClass(data) {
      return {
        'font-bold': !data.read,
        'cursor-pointer': true
      }
    },
    formatTime(timestamp) {
      const now = new Date()
      const time = new Date(timestamp)
      const diffInHours = (now - time) / (1000 * 60 * 60)
      
      if (diffInHours < 24) {
        return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      } else if (diffInHours < 7 * 24) {
        return time.toLocaleDateString([], { weekday: 'short' })
      } else {
        return time.toLocaleDateString([], { month: 'short', day: 'numeric' })
      }
    },
    formatDateTime(timestamp) {
      return new Date(timestamp).toLocaleString()
    },
    getLastChannel(conversation) {
      if (!conversation.thread || conversation.thread.length === 0) {
        return 'email' // default
      }
      return conversation.thread[conversation.thread.length - 1].channel
    },
    toggleMessageMenu(event) {
      this.$refs.messageMenu.toggle(event)
    },
    forwardMessage() {
      if (this.selectedMessage) {
        this.composeForm.to = ''
        this.composeForm.subject = `Fwd: ${this.selectedMessage.subject}`
        this.composeForm.message = `\n\n--- Forwarded Message ---\nFrom: ${this.selectedMessage.from}\nSubject: ${this.selectedMessage.subject}\n\n${this.selectedMessage.content}`
        this.showComposeDialog = true
      }
    },
    openMessage(event) {
      // For backward compatibility if needed
      this.selectMessage(event.data)
    },
    toggleImportant(message) {
      message.important = !message.important
      this.saveMessages()
    },
    deleteMessage(message) {
      const index = this.messages.findIndex(m => m.id === message.id)
      if (index > -1) {
        this.messages.splice(index, 1)
        this.saveMessages()
      }
    },

    markAllAsRead() {
      this.messages.forEach(message => {
        message.read = true
      })
      this.saveMessages()
    },

    sendMessage() {
      if (this.composeForm.to && this.composeForm.subject && this.composeForm.message) {
        // In a real app, this would send the message via API
        console.log('Sending message:', this.composeForm)
        this.cancelCompose()
      }
    },
    cancelCompose() {
      this.showComposeDialog = false
      this.composeForm = {
        to: '',
        subject: '',
        message: ''
      }
    },
    replyToMessage() {
      if (this.selectedMessage) {
        this.composeForm.to = this.selectedMessage.email
        this.composeForm.subject = `Re: ${this.selectedMessage.subject}`
        this.composeForm.message = `\n\n--- Original Message ---\nFrom: ${this.selectedMessage.from}\nSubject: ${this.selectedMessage.subject}\n\n${this.selectedMessage.content}`
        this.showComposeDialog = true
      }
    },
    sendReply() {
      if (!this.replyMessage.trim() || !this.selectedMessage) return
      
      // Add reply to the conversation thread
      const newReply = {
        from: 'You',
        content: this.replyMessage,
        timestamp: new Date(),
        channel: this.replyChannel,
        isOutgoing: true
      }
      
      this.selectedMessage.thread.push(newReply)
      
      // Update the main message timestamp and preview
      this.selectedMessage.timestamp = new Date()
      this.selectedMessage.preview = this.replyMessage.substring(0, 100) + (this.replyMessage.length > 100 ? '...' : '')
      
      // Clear the reply box
      this.replyMessage = ''
      
      // Save messages
      this.saveMessages()
      
      // Scroll to bottom of messages
      this.$nextTick(() => {
        const messagesContainer = document.querySelector('.flex-1.overflow-auto')
        if (messagesContainer) {
          messagesContainer.scrollTop = messagesContainer.scrollHeight
        }
      })
      
      console.log(`Reply sent via ${this.replyChannel}`)
    },
    saveDraft() {
      if (!this.replyMessage.trim()) return
      
      // Save draft to localStorage (in a real app, this would save to server)
      const drafts = JSON.parse(localStorage.getItem('outbounder-message-drafts') || '{}')
      drafts[this.selectedMessage.id] = {
        message: this.replyMessage,
        channel: this.replyChannel,
        timestamp: new Date()
      }
      localStorage.setItem('outbounder-message-drafts', JSON.stringify(drafts))
      
      console.log('Draft saved')
    },
    selectMessage(message) {
      this.selectedMessage = message
      
      // Load any existing draft for this message
      const drafts = JSON.parse(localStorage.getItem('outbounder-message-drafts') || '{}')
      if (drafts[message.id]) {
        this.replyMessage = drafts[message.id].message
        this.replyChannel = drafts[message.id].channel
      } else {
        this.replyMessage = ''
        this.replyChannel = 'email' // Default to email
      }
      
      // Mark as read
      if (!message.read) {
        message.read = true
        this.saveMessages()
      }
    },
    saveMessages() {
      // Save to localStorage (in a real app, this would sync with server)
      localStorage.setItem('outbounder-inbox-messages', JSON.stringify(this.messages))
    },
    loadMessages() {
      const saved = localStorage.getItem('outbounder-inbox-messages')
      if (saved) {
        try {
          this.messages = JSON.parse(saved).map(message => ({
            ...message,
            timestamp: new Date(message.timestamp)
          }))
        } catch (e) {
          console.error('Error loading messages:', e)
        }
      }
    }
  },
  mounted() {
    this.loadMessages()
  }
}
</script>

<style scoped>
.p-datatable .p-datatable-tbody > tr.font-bold {
  font-weight: 600;
}
.p-datatable .p-datatable-tbody > tr:hover {
  background-color: var(--surface-hover);
}
</style>
