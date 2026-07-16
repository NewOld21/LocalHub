<template>
  <div class="app-shell">
    <router-view />
    <ChatbotBanner @open-chat="chatOpenRequest += 1" />
    <ChatbotWidget :open-request="chatOpenRequest" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ChatbotBanner from '@/features/chatbot/components/ChatbotBanner.vue'
import ChatbotWidget from '@/features/chatbot/components/ChatbotWidget.vue'

const chatOpenRequest = ref(0)
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
}
</style>
