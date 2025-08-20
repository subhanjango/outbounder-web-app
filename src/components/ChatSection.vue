<template>
  <div class="chat-section flex flex-column h-full">
    <!-- Chat Header -->
    <div class="flex align-items-center justify-content-between p-3 border-bottom-1 surface-border bg-surface-50">
      <div class="flex align-items-center gap-3">
        <Avatar 
          :label="getInitials(activeChat.name)" 
          size="large" 
          shape="circle"
          :style="{ backgroundColor: activeChat.avatarColor || '#6366f1', color: 'white' }"
        />
        <div>
          <div class="font-semibold text-color">{{ activeChat.name }}</div>
          <div class="flex align-items-center gap-2">
            <Badge 
              :value="activeChat.status" 
              :severity="activeChat.status === 'online' ? 'success' : 'secondary'"
              size="small"
            />
            <span class="text-sm text-color-secondary">{{ activeChat.role }}</span>
          </div>
        </div>
      </div>
      
      <div class="flex gap-1">
        <Button 
          icon="pi pi-phone" 
          text 
          rounded
          v-tooltip="'Start voice call'"
          @click="startCall('voice')"
        />
        <Button 
          icon="pi pi-video" 
          text 
          rounded
          v-tooltip="'Start video call'"
          @click="startCall('video')"
        />
        <Button 
          icon="pi pi-info-circle" 
          text 
          rounded
          v-tooltip="'View details'"
          @click="showDetailsPanel = !showDetailsPanel"
        />
      </div>
    </div>
    
    <!-- Messages Container -->
    <div class="flex-1 overflow-auto p-4" ref="messagesContainer" style="background: #f8f9fa;">
      <!-- Date Divider -->
      <div v-for="(group, date) in groupedMessages" :key="date" class="flex flex-column gap-3">
        <Divider align="center" type="solid">
          <span class="text-xs text-color-secondary bg-surface-50 px-2">{{ formatDate(date) }}</span>
        </Divider>
        
        <!-- Messages -->
        <div 
          v-for="message in group" 
          :key="message.id"
          class="flex gap-2"
          :class="message.isOutgoing ? 'justify-content-end' : 'justify-content-start'"
        >
          <!-- Avatar for incoming messages -->
          <Avatar 
            v-if="!message.isOutgoing"
            :label="getInitials(message.sender)" 
            size="small" 
            shape="circle"
            class="flex-shrink-0"
            :style="{ backgroundColor: '#94a3b8', color: 'white' }"
          />
          
          <!-- Message Content -->
          <div class="flex flex-column max-w-30rem">
            <!-- Message Bubble -->
            <div 
              class="p-3 border-round-lg message-bubble"
              :class="message.isOutgoing ? 'bg-primary text-white' : 'bg-white surface-border border-1'"
            >
              <!-- Reply Reference -->
              <div 
                v-if="message.replyTo"
                class="mb-2 p-2 border-round"
                :class="message.isOutgoing ? 'bg-primary-600' : 'bg-surface-100'"
              >
                <div class="text-xs opacity-70 mb-1">{{ message.replyTo.sender }}</div>
                <div class="text-sm">{{ message.replyTo.text }}</div>
              </div>
              
              <!-- Message Text -->
              <div class="whitespace-pre-wrap">{{ message.text }}</div>
              
              <!-- Attachments -->
              <div v-if="message.attachments && message.attachments.length" class="mt-2">
                <div v-for="attachment in message.attachments" :key="attachment.id" class="flex align-items-center gap-2 mt-1">
                  <i :class="getFileIcon(attachment.type)" class="text-lg"></i>
                  <span class="text-sm">{{ attachment.name }}</span>
                </div>
              </div>
              
              <!-- Reactions -->
              <div v-if="message.reactions && message.reactions.length" class="flex gap-1 mt-2">
                <Chip 
                  v-for="reaction in message.reactions" 
                  :key="reaction.emoji"
                  :label="`${reaction.emoji} ${reaction.count}`"
                  class="text-xs p-1"
                />
              </div>
            </div>
            
            <!-- Message Meta -->
            <div 
              class="flex align-items-center gap-2 mt-1 text-xs text-color-secondary"
              :class="message.isOutgoing ? 'justify-content-end' : 'justify-content-start'"
            >
              <span>{{ formatTime(message.timestamp) }}</span>
              <i v-if="message.isOutgoing && message.status === 'sent'" class="pi pi-check"></i>
              <i v-if="message.isOutgoing && message.status === 'delivered'" class="pi pi-check-circle"></i>
              <i v-if="message.isOutgoing && message.status === 'read'" class="pi pi-check-circle text-primary"></i>
              <i v-if="message.edited" class="pi pi-pencil"></i>
            </div>
          </div>
          
          <!-- Avatar for outgoing messages -->
          <Avatar 
            v-if="message.isOutgoing"
            label="ME" 
            size="small" 
            shape="circle"
            class="flex-shrink-0"
            :style="{ backgroundColor: '#10b981', color: 'white' }"
          />
        </div>
      </div>
      
      <!-- Typing Indicator -->
      <div v-if="isTyping" class="flex align-items-center gap-2 mt-3">
        <Avatar 
          :label="getInitials(activeChat.name)" 
          size="small" 
          shape="circle"
          :style="{ backgroundColor: activeChat.avatarColor || '#6366f1', color: 'white' }"
        />
        <div class="bg-white surface-border border-1 p-2 border-round-lg">
          <ProgressSpinner 
            style="width: 20px; height: 20px" 
            strokeWidth="4"
          />
        </div>
      </div>
    </div>
    
    <!-- Message Input Area -->
    <div class="border-top-1 surface-border bg-white p-3">
      <!-- Reply Preview -->
      <div 
        v-if="replyingTo"
        class="flex align-items-center justify-content-between bg-surface-100 p-2 border-round mb-2"
      >
        <div class="flex align-items-center gap-2">
          <i class="pi pi-reply text-color-secondary"></i>
          <div>
            <div class="text-xs text-color-secondary">Replying to {{ replyingTo.sender }}</div>
            <div class="text-sm">{{ replyingTo.text.substring(0, 50) }}{{ replyingTo.text.length > 50 ? '...' : '' }}</div>
          </div>
        </div>
        <Button 
          icon="pi pi-times" 
          text 
          rounded 
          size="small"
          @click="replyingTo = null"
        />
      </div>
      
      <!-- Input Controls -->
      <div class="flex align-items-end gap-2">
        <!-- Attachment Button -->
        <Button 
          icon="pi pi-paperclip" 
          text 
          rounded
          v-tooltip="'Attach file'"
          @click="$refs.fileInput.click()"
        />
        <input 
          ref="fileInput"
          type="file" 
          multiple 
          style="display: none"
          @change="handleFileSelect"
        />
        
        <!-- Message Input -->
        <div class="flex-1">
          <Textarea 
            v-model="newMessage" 
            rows="1"
            autoResize
            placeholder="Type a message..."
            class="w-full"
            @keydown.enter.exact.prevent="sendMessage"
            @keydown.enter.shift.exact=""
          />
        </div>
        
        <!-- Emoji Picker -->
        <Button 
          icon="pi pi-face-smile" 
          text 
          rounded
          v-tooltip="'Add emoji'"
          @click="toggleEmojiPicker"
        />
        <OverlayPanel ref="emojiPanel">
          <div class="grid grid-cols-8 gap-1 p-2">
            <Button 
              v-for="emoji in commonEmojis" 
              :key="emoji"
              :label="emoji"
              text
              size="small"
              @click="insertEmoji(emoji)"
            />
          </div>
        </OverlayPanel>
        
        <!-- Send Button -->
        <Button 
          icon="pi pi-send" 
          :disabled="!newMessage.trim()"
          @click="sendMessage"
          v-tooltip="'Send (Enter)'"
        />
      </div>
      
      <!-- File Preview -->
      <div v-if="attachedFiles.length" class="flex gap-2 mt-2 flex-wrap">
        <Chip 
          v-for="(file, index) in attachedFiles" 
          :key="index"
          :label="file.name"
          removable
          @remove="removeFile(index)"
        />
      </div>
    </div>
    
    <!-- Details Panel (Sidebar) -->
    <Sidebar 
      v-model:visible="showDetailsPanel" 
      position="right"
      :showCloseIcon="false"
      class="w-20rem"
    >
      <div class="flex flex-column gap-3">
        <!-- Contact Info -->
        <div class="text-center pb-3 border-bottom-1 surface-border">
          <Avatar 
            :label="getInitials(activeChat.name)" 
            size="xlarge" 
            shape="circle"
            :style="{ backgroundColor: activeChat.avatarColor || '#6366f1', color: 'white' }"
          />
          <h3 class="mt-3 mb-1">{{ activeChat.name }}</h3>
          <p class="text-color-secondary m-0">{{ activeChat.email }}</p>
        </div>
        
        <!-- Quick Actions -->
        <div>
          <h4 class="mb-3">Quick Actions</h4>
          <div class="flex flex-column gap-2">
            <Button label="View Profile" icon="pi pi-user" outlined class="w-full" />
            <Button label="Add to Campaign" icon="pi pi-megaphone" outlined class="w-full" />
            <Button label="Schedule Meeting" icon="pi pi-calendar" outlined class="w-full" />
            <Button label="Add Note" icon="pi pi-pencil" outlined class="w-full" />
          </div>
        </div>
        
        <!-- Shared Files -->
        <div>
          <h4 class="mb-3">Shared Files</h4>
          <div class="flex flex-column gap-2">
            <div v-for="file in sharedFiles" :key="file.id" class="flex align-items-center gap-2 p-2 surface-hover border-round cursor-pointer">
              <i :class="getFileIcon(file.type)" class="text-xl"></i>
              <div class="flex-1 min-w-0">
                <div class="text-sm font-medium truncate">{{ file.name }}</div>
                <div class="text-xs text-color-secondary">{{ file.size }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Sidebar>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import Avatar from 'primevue/avatar'
import Badge from 'primevue/badge'
import Button from 'primevue/button'
import Chip from 'primevue/chip'
import Divider from 'primevue/divider'
import OverlayPanel from 'primevue/overlaypanel'
import ProgressSpinner from 'primevue/progressspinner'
import Sidebar from 'primevue/sidebar'
import Textarea from 'primevue/textarea'

// Props
const props = defineProps({
  chatId: {
    type: String,
    default: 'default'
  }
})

// Refs
const messagesContainer = ref(null)
const emojiPanel = ref(null)
const fileInput = ref(null)

// State
const newMessage = ref('')
const attachedFiles = ref([])
const replyingTo = ref(null)
const isTyping = ref(false)
const showDetailsPanel = ref(false)

// Mock data
const activeChat = ref({
  id: '1',
  name: 'Sarah Johnson',
  email: 'sarah@clay.com',
  role: 'Sales Director',
  status: 'online',
  avatarColor: '#8b5cf6'
})

const messages = ref([
  {
    id: 1,
    sender: 'Sarah Johnson',
    text: 'Hi there! Thanks for reaching out.',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    isOutgoing: false,
    status: 'read'
  },
  {
    id: 2,
    sender: 'Me',
    text: 'Hello Sarah! I wanted to discuss the partnership opportunity we talked about.',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 10 * 60 * 1000),
    isOutgoing: true,
    status: 'read'
  },
  {
    id: 3,
    sender: 'Sarah Johnson',
    text: 'Absolutely! I\'ve reviewed your proposal and I think there\'s great potential here.',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    isOutgoing: false,
    status: 'read'
  },
  {
    id: 4,
    sender: 'Sarah Johnson',
    text: 'Would you be available for a call tomorrow at 2 PM EST?',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000),
    isOutgoing: false,
    status: 'read',
    reactions: [{ emoji: '👍', count: 1 }]
  },
  {
    id: 5,
    sender: 'Me',
    text: 'That works perfectly for me! Looking forward to it.',
    timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000),
    isOutgoing: true,
    status: 'delivered'
  },
  {
    id: 6,
    sender: 'Me',
    text: 'I\'ll send over the agenda shortly.',
    timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000 + 2 * 60 * 1000),
    isOutgoing: true,
    status: 'delivered',
    attachments: [
      { id: 1, name: 'Partnership_Agenda.pdf', type: 'pdf' }
    ]
  },
  {
    id: 7,
    sender: 'Sarah Johnson',
    text: 'Perfect! Just received the agenda. Looks comprehensive.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isOutgoing: false,
    status: 'read'
  },
  {
    id: 8,
    sender: 'Sarah Johnson',
    text: 'I\'ll have our technical team join as well.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 30 * 1000),
    isOutgoing: false,
    status: 'read',
    edited: true
  }
])

const sharedFiles = ref([
  { id: 1, name: 'Partnership_Proposal.pdf', type: 'pdf', size: '2.4 MB' },
  { id: 2, name: 'Integration_Specs.docx', type: 'doc', size: '1.1 MB' },
  { id: 3, name: 'Product_Demo.mp4', type: 'video', size: '15.3 MB' }
])

const commonEmojis = ['😀', '😊', '😂', '❤️', '👍', '👎', '🙏', '👏', '🎉', '🔥', '💯', '🚀', '✅', '❌', '⭐', '💡']

// Computed
const groupedMessages = computed(() => {
  const groups = {}
  messages.value.forEach(message => {
    const date = new Date(message.timestamp).toDateString()
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(message)
  })
  return groups
})

// Methods
const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().substring(0, 2)
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today'
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday'
  } else {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  }
}

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  })
}

const getFileIcon = (type) => {
  const icons = {
    pdf: 'pi pi-file-pdf text-red-500',
    doc: 'pi pi-file-word text-blue-500',
    docx: 'pi pi-file-word text-blue-500',
    xls: 'pi pi-file-excel text-green-500',
    xlsx: 'pi pi-file-excel text-green-500',
    image: 'pi pi-image text-purple-500',
    video: 'pi pi-video text-orange-500',
    default: 'pi pi-file text-gray-500'
  }
  return icons[type] || icons.default
}

const sendMessage = () => {
  if (!newMessage.value.trim() && !attachedFiles.value.length) return
  
  const message = {
    id: Date.now(),
    sender: 'Me',
    text: newMessage.value,
    timestamp: new Date(),
    isOutgoing: true,
    status: 'sent',
    attachments: attachedFiles.value.map((file, index) => ({
      id: index,
      name: file.name,
      type: file.type.split('/')[1] || 'default'
    })),
    replyTo: replyingTo.value
  }
  
  messages.value.push(message)
  newMessage.value = ''
  attachedFiles.value = []
  replyingTo.value = null
  
  // Simulate status updates
  setTimeout(() => {
    message.status = 'delivered'
  }, 1000)
  
  setTimeout(() => {
    message.status = 'read'
  }, 2000)
  
  // Simulate typing indicator
  setTimeout(() => {
    isTyping.value = true
  }, 3000)
  
  // Simulate response
  setTimeout(() => {
    isTyping.value = false
    messages.value.push({
      id: Date.now() + 1,
      sender: activeChat.value.name,
      text: 'Thanks for your message! I\'ll review this and get back to you shortly.',
      timestamp: new Date(),
      isOutgoing: false,
      status: 'read'
    })
    scrollToBottom()
  }, 5000)
  
  scrollToBottom()
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const toggleEmojiPicker = (event) => {
  emojiPanel.value.toggle(event)
}

const insertEmoji = (emoji) => {
  newMessage.value += emoji
  emojiPanel.value.hide()
}

const handleFileSelect = (event) => {
  const files = Array.from(event.target.files)
  attachedFiles.value.push(...files)
}

const removeFile = (index) => {
  attachedFiles.value.splice(index, 1)
}

const startCall = (type) => {
  console.log(`Starting ${type} call with ${activeChat.value.name}`)
}

// Lifecycle
onMounted(() => {
  scrollToBottom()
})

// Watch for new messages
watch(messages, () => {
  scrollToBottom()
}, { deep: true })
</script>

<style scoped>
.chat-section {
  height: 100%;
  min-height: 500px;
}

.message-bubble {
  word-break: break-word;
}

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.grid-cols-8 {
  grid-template-columns: repeat(8, minmax(0, 1fr));
}
</style>