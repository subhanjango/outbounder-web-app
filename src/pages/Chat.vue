<template>
  <div class="flex h-screen bg-surface-ground">
    <!-- Left Sidebar -->
    <div class="w-18rem border-right-1 surface-border bg-white flex flex-column">
      <!-- Header -->
      <div class="p-3 border-bottom-1 surface-border">
        <div class="flex align-items-center justify-content-between mb-3">
          <h2 class="text-xl font-semibold m-0">Chats</h2>
          <Button icon="pi pi-plus" text rounded size="small" v-tooltip="'New chat'" />
        </div>
        
        <!-- Search -->
        <InputText 
          v-model="searchQuery" 
          placeholder="Search" 
          class="w-full"
          :class="'surface-100'"
        />
      </div>
      
      <!-- Tab Menu -->
      <div class="px-3 py-2 border-bottom-1 surface-border">
        <div class="flex gap-3">
          <Button 
            label="Chat" 
            :class="activeTab === 'chat' ? 'p-button-text font-bold text-primary' : 'p-button-text text-color-secondary'"
            @click="activeTab = 'chat'"
          />
          <Button 
            label="Call" 
            :class="activeTab === 'call' ? 'p-button-text font-bold text-primary' : 'p-button-text text-color-secondary'"
            @click="activeTab = 'call'"
          />
        </div>
      </div>
      
      <!-- Conversation List -->
      <ScrollPanel class="flex-1">
        <div 
          v-for="conversation in filteredConversations" 
          :key="conversation.id"
          class="flex align-items-center gap-3 p-3 cursor-pointer hover:bg-surface-50 transition-colors"
          :class="{ 'bg-surface-100': selectedConversation?.id === conversation.id }"
          @click="selectConversation(conversation)"
        >
          <div class="relative flex-shrink-0">
            <Avatar 
              :image="conversation.avatar"
              :label="!conversation.avatar ? getInitials(conversation.name) : null" 
              size="large"
              shape="circle"
              :style="!conversation.avatar ? { backgroundColor: '#64748b', color: 'white' } : {}"
            />
            <div 
              v-if="conversation.status === 'online'"
              class="absolute bottom-0 right-0 w-1rem h-1rem bg-green-500 border-2 border-white border-circle"
            ></div>
          </div>
          
          <div class="flex-1 min-w-0">
            <div class="flex align-items-center justify-content-between">
              <span class="font-medium text-color">{{ conversation.name }}</span>
              <span class="text-xs text-color-secondary">{{ formatTime(conversation.lastMessage.timestamp) }}</span>
            </div>
            <div class="text-sm text-color-secondary truncate mt-1">{{ conversation.lastMessage.text }}</div>
          </div>
          
          <Badge 
            v-if="conversation.unread > 0"
            :value="conversation.unread" 
            severity="contrast"
            class="bg-gray-900"
          />
        </div>
      </ScrollPanel>
    </div>
    
    <!-- Main Chat Area -->
    <div class="flex-1 flex flex-column bg-white">
      <template v-if="selectedConversation">
        <!-- Chat Header -->
        <div class="flex align-items-center justify-content-between p-3 border-bottom-1 surface-border">
          <div class="flex align-items-center gap-3">
            <Avatar 
              :image="selectedConversation.teamAvatar"
              :label="!selectedConversation.teamAvatar ? selectedConversation.teamName : null"
              size="large" 
              shape="circle"
              :style="!selectedConversation.teamAvatar ? { backgroundColor: '#8b5cf6', color: 'white' } : {}"
            />
            <div>
              <div class="font-semibold">{{ selectedConversation.teamName || 'PrimeTek' }}</div>
              <div class="text-sm text-color-secondary">{{ selectedConversation.members || 'Cody Fisher, Esther Howard, Jerome Bell, Kristin Watson...' }}</div>
            </div>
          </div>
          
          <div class="flex align-items-center gap-2">
            <Button icon="pi pi-phone" text rounded />
            <Button icon="pi pi-search" text rounded />
            <Button icon="pi pi-ellipsis-v" text rounded />
          </div>
        </div>
        
        <!-- Messages Area -->
        <ScrollPanel class="flex-1 p-4" ref="messagesContainer">
          <div class="flex flex-column gap-3">
            <div 
              v-for="message in currentMessages" 
              :key="message.id"
              class="flex gap-3"
              :class="message.isOutgoing ? 'flex-row-reverse' : ''"
            >
              <Avatar 
                v-if="!message.isOutgoing"
                :image="message.avatar"
                :label="!message.avatar ? getInitials(message.sender) : null"
                size="large"
                shape="circle"
                :style="!message.avatar ? { backgroundColor: '#64748b', color: 'white' } : {}"
              />
              
              <div class="flex flex-column gap-1 max-w-30rem">
                <div v-if="!message.isOutgoing" class="flex align-items-center gap-2">
                  <span class="font-medium text-sm">{{ message.sender }}</span>
                  <span class="text-xs text-color-secondary">{{ formatDetailTime(message.timestamp) }}</span>
                </div>
                
                <div 
                  class="p-3 border-round-lg"
                  :class="message.isOutgoing 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-surface-100 text-color'"
                >
                  <div class="text-sm white-space-pre-wrap">{{ message.text }}</div>
                </div>
              </div>
            </div>
          </div>
        </ScrollPanel>
        
        <!-- Message Input -->
        <div class="p-3 border-top-1 surface-border">
          <div class="flex align-items-center gap-2">
            <Button icon="pi pi-face-smile" text rounded size="small" />
            <Button icon="pi pi-paperclip" text rounded size="small" />
            <InputText 
              v-model="newMessage" 
              placeholder="Write your message..."
              class="flex-1"
              @keydown.enter="sendMessage"
            />
            <Button icon="pi pi-send" rounded size="small" @click="sendMessage" />
          </div>
        </div>
      </template>
      
      <!-- Empty State -->
      <div v-else class="flex align-items-center justify-content-center h-full">
        <div class="text-center">
          <i class="pi pi-comments text-6xl text-color-secondary mb-4"></i>
          <h3 class="text-color-secondary mb-2">Select a conversation</h3>
          <p class="text-color-secondary">Choose a chat from the sidebar to start messaging</p>
        </div>
      </div>
    </div>
    
    <!-- Right Sidebar -->
    <div v-if="selectedConversation" class="w-20rem border-left-1 surface-border bg-white flex flex-column">
      <!-- Settings Header -->
      <div class="p-3 border-bottom-1 surface-border">
        <div class="flex align-items-center justify-content-between">
          <span class="invisible">Settings</span>
          <div class="flex gap-2">
            <Button 
              :icon="notificationsEnabled ? 'pi pi-bell' : 'pi pi-bell-slash'" 
              text 
              rounded 
              size="small"
              @click="notificationsEnabled = !notificationsEnabled"
            />
            <span class="font-medium">{{ notificationsEnabled ? 'Notifications' : 'Muted' }}</span>
            <InputSwitch v-model="notificationsEnabled" class="ml-auto" />
          </div>
        </div>
        
        <div class="flex align-items-center gap-2 mt-3">
          <Button icon="pi pi-volume-up" text rounded size="small" />
          <span class="font-medium">Sound</span>
          <InputSwitch v-model="soundEnabled" class="ml-auto" />
        </div>
        
        <div class="flex align-items-center gap-2 mt-3">
          <Button icon="pi pi-download" text rounded size="small" />
          <span class="font-medium">Save to downloads</span>
          <InputSwitch v-model="saveToDownloads" class="ml-auto" />
        </div>
      </div>
      
      <!-- Members Section -->
      <div class="p-3 border-bottom-1 surface-border">
        <div class="flex align-items-center justify-content-between mb-3">
          <h3 class="font-semibold m-0">Members</h3>
          <Button label="See All" text size="small" />
        </div>
        
        <div class="flex flex-column gap-2">
          <div 
            v-for="member in teamMembers" 
            :key="member.id"
            class="flex align-items-center gap-3 p-2 hover:bg-surface-50 border-round cursor-pointer"
          >
            <Avatar 
              :image="member.avatar"
              :label="!member.avatar ? getInitials(member.name) : null"
              shape="circle"
              :style="!member.avatar ? { backgroundColor: '#64748b', color: 'white' } : {}"
            />
            <span class="flex-1">{{ member.name }}</span>
            <i class="pi pi-chevron-right text-color-secondary text-sm"></i>
          </div>
        </div>
      </div>
      
      <!-- Bottom Tabs -->
      <TabView class="flex-1">
        <TabPanel header="Media">
          <div class="p-3">
            <div class="grid">
              <div v-for="i in 6" :key="i" class="col-4 p-1">
                <div class="bg-surface-100 border-round aspect-ratio-square"></div>
              </div>
            </div>
          </div>
        </TabPanel>
        <TabPanel header="Links">
          <div class="p-3">
            <div class="flex flex-column gap-2">
              <div v-for="link in recentLinks" :key="link.id" class="p-2 surface-hover border-round">
                <div class="text-primary text-sm">{{ link.title }}</div>
                <div class="text-xs text-color-secondary">{{ link.url }}</div>
              </div>
            </div>
          </div>
        </TabPanel>
        <TabPanel header="Docs">
          <div class="p-3">
            <div class="flex flex-column gap-2">
              <div v-for="doc in recentDocs" :key="doc.id" class="flex align-items-center gap-2 p-2 surface-hover border-round">
                <i class="pi pi-file text-xl"></i>
                <div class="flex-1">
                  <div class="text-sm">{{ doc.name }}</div>
                  <div class="text-xs text-color-secondary">{{ doc.size }}</div>
                </div>
              </div>
            </div>
          </div>
        </TabPanel>
      </TabView>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Avatar from 'primevue/avatar'
import Badge from 'primevue/badge'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputSwitch from 'primevue/inputswitch'
import ScrollPanel from 'primevue/scrollpanel'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'

// State
const searchQuery = ref('')
const selectedConversation = ref(null)
const activeTab = ref('chat')
const newMessage = ref('')
const notificationsEnabled = ref(true)
const soundEnabled = ref(true)
const saveToDownloads = ref(false)
const messagesContainer = ref(null)

// Mock conversations data
const conversations = ref([
  {
    id: '1',
    name: 'Cody Fisher',
    status: 'online',
    teamName: 'PrimeTek',
    members: 'Cody Fisher, Esther Howard, Jerome Bell, Kristin Watson, Robert Fox',
    lastMessage: {
      text: 'Hey there! I\'ve heard about...',
      timestamp: new Date(Date.now() - 30 * 60 * 1000)
    },
    unread: 8
  },
  {
    id: '2',
    name: 'PrimeTek Team',
    status: 'offline',
    teamName: 'PrimeTek Team',
    members: 'Jerome Bell, Esther Howard, Robert Fox',
    lastMessage: {
      text: 'Let\'s implement PrimeVue. Elevating...',
      timestamp: new Date(Date.now() - 45 * 60 * 1000)
    },
    unread: 0
  },
  {
    id: '3',
    name: 'Jerome Bell',
    status: 'online',
    teamName: 'Design Team',
    members: 'Jerome Bell, Sarah Johnson',
    lastMessage: {
      text: 'Absolutely! PrimeVue\'s...',
      timestamp: new Date(Date.now() - 45 * 60 * 1000)
    },
    unread: 4
  },
  {
    id: '4',
    name: 'Robert Fox',
    status: 'offline',
    teamName: 'Development',
    members: 'Robert Fox, Mike Chen',
    lastMessage: {
      text: 'Interesting! PrimeVue sounds amazing...',
      timestamp: new Date(Date.now() - 45 * 60 * 1000)
    },
    unread: 0
  },
  {
    id: '5',
    name: 'Esther Howard',
    status: 'online',
    teamName: 'Marketing',
    members: 'Esther Howard, Lisa Rodriguez',
    lastMessage: {
      text: 'Quick one, team! Anyone using...',
      timestamp: new Date(Date.now() - 45 * 60 * 1000)
    },
    unread: 9
  },
  {
    id: '6',
    name: 'Darlene Robertson',
    status: 'offline',
    teamName: 'Support Team',
    members: 'Darlene Robertson, Alex Thompson',
    lastMessage: {
      text: 'Just explored PrimeVue\'s themes. Can...',
      timestamp: new Date(Date.now() - 45 * 60 * 1000)
    },
    unread: 0
  },
  {
    id: '7',
    name: 'Ralph Edwards',
    status: 'offline',
    teamName: 'Product Team',
    members: 'Ralph Edwards, Jennifer Lee',
    lastMessage: {
      text: 'I agree! The documentation is...',
      timestamp: new Date(Date.now() - 45 * 60 * 1000)
    },
    unread: 0
  }
])

// Mock messages data
const messagesData = {
  '1': [
    {
      id: 1,
      sender: 'You',
      text: 'Do you have any tips for optimizing performance when using multiple complex components?',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      isOutgoing: true
    },
    {
      id: 2,
      sender: 'Cody Fisher',
      text: 'Yes! Lazy loading and code splitting can make a huge difference, especially in larger applications.',
      timestamp: new Date(Date.now() - 8 * 60 * 1000),
      isOutgoing: false
    },
    {
      id: 3,
      sender: 'HS',
      text: 'I\'ve also found that leveraging the component\'s internal state management capabilities can help streamline data flow and improve performance.',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      isOutgoing: false
    },
    {
      id: 4,
      sender: 'You',
      text: 'That\'s great advice. It\'s amazing how much detail and thought has gone into making PrimeVue such a powerful tool for developers.',
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      isOutgoing: true
    }
  ],
  '2': [
    {
      id: 1,
      sender: 'PrimeTek Team',
      text: 'Let\'s implement PrimeVue. Elevating your UI has never been easier!',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      isOutgoing: false
    }
  ]
}

// Mock team members
const teamMembers = ref([
  { id: 1, name: 'Robin Jonas' },
  { id: 2, name: 'Cameron Williamson' },
  { id: 3, name: 'Eleanor Pena' },
  { id: 4, name: 'Arlene McCoy' },
  { id: 5, name: 'Dianne Russell' }
])

// Mock recent links
const recentLinks = ref([
  { id: 1, title: 'PrimeVue Documentation', url: 'primevue.org/documentation' },
  { id: 2, title: 'Component Gallery', url: 'primevue.org/components' },
  { id: 3, title: 'Theme Designer', url: 'primevue.org/themes' }
])

// Mock recent docs
const recentDocs = ref([
  { id: 1, name: 'DataAnalyst.pdf', size: '2.4 MB' },
  { id: 2, name: 'ForgetPassword.png', size: '845 KB' },
  { id: 3, name: 'Presentation.pptx', size: '5.2 MB' }
])

// Computed
const filteredConversations = computed(() => {
  if (!searchQuery.value) return conversations.value
  
  const query = searchQuery.value.toLowerCase()
  return conversations.value.filter(conv => 
    conv.name.toLowerCase().includes(query) ||
    conv.lastMessage.text.toLowerCase().includes(query)
  )
})

const currentMessages = computed(() => {
  if (!selectedConversation.value) return []
  return messagesData[selectedConversation.value.id] || []
})

// Methods
const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().substring(0, 2)
}

const formatTime = (timestamp) => {
  const now = new Date()
  const time = new Date(timestamp)
  const diffInMinutes = (now - time) / (1000 * 60)
  
  if (diffInMinutes < 60) {
    return Math.floor(diffInMinutes) + ' min'
  } else if (diffInMinutes < 24 * 60) {
    return Math.floor(diffInMinutes / 60) + ' hr'
  } else {
    return Math.floor(diffInMinutes / (24 * 60)) + ' days'
  }
}

const formatDetailTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  })
}

const selectConversation = (conversation) => {
  selectedConversation.value = conversation
  // Reset unread count when selecting
  conversation.unread = 0
}

const sendMessage = () => {
  if (!newMessage.value.trim()) return
  
  const message = {
    id: Date.now(),
    sender: 'You',
    text: newMessage.value,
    timestamp: new Date(),
    isOutgoing: true
  }
  
  if (!messagesData[selectedConversation.value.id]) {
    messagesData[selectedConversation.value.id] = []
  }
  messagesData[selectedConversation.value.id].push(message)
  
  newMessage.value = ''
  
  // Scroll to bottom
  setTimeout(() => {
    if (messagesContainer.value) {
      const panel = messagesContainer.value.$el.querySelector('.p-scrollpanel-content')
      if (panel) panel.scrollTop = panel.scrollHeight
    }
  }, 100)
}
</script>

<style scoped>
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.aspect-ratio-square {
  position: relative;
  width: 100%;
  padding-bottom: 100%;
}

.white-space-pre-wrap {
  white-space: pre-wrap;
}
</style>