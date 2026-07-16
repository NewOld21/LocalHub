<template>
  <div>
    <div class="chat-toggle-btn" @click="toggleChat">🤖</div>

    <div :class="['chat-window', { active: isChatOpen }]">
      <div class="chat-header">
        <h3>LOCALHUB AI ARCHIVE</h3>
        <div class="chat-close" @click="toggleChat">✕</div>
      </div>

      <div class="chat-body" ref="chatBodyRef">
        <div v-for="(msg, idx) in messages" :key="idx" :class="['msg', msg.isUser ? 'msg-user' : 'msg-ai']">
          <span v-if="!msg.isUser" class="message-label">LOCALHUB AI</span>
          <p class="message-text">{{ msg.text }}</p>
          <div v-if="msg.results?.length" class="chat-results">
            <span class="results-title">관련 장소 및 게시글 {{ msg.results.length }}건</span>
            <button
              v-for="result in msg.results"
              :key="`${result.type}-${result.id}`"
              type="button"
              class="result-card"
              :disabled="openingResultId === `${result.type}-${result.id}`"
              @click="openResult(result)"
            >
              <span class="result-topline">
                <em>{{ result.type === 'place' ? 'PLACE' : 'COMMUNITY' }}</em>
                <small v-if="result.category">{{ result.category }}</small>
              </span>
              <strong>{{ result.title }}</strong>
              <span v-if="result.address" class="result-address">{{ result.address }}</span>
              <span v-if="result.tel" class="result-detail">TEL {{ result.tel }}</span>
              <span v-if="result.tags?.length" class="result-tags">{{ result.tags.map(tag => `#${tag}`).join(' ') }}</span>
              <span class="result-link-text">{{ openingResultId === `${result.type}-${result.id}` ? '연결 중...' : '상세보기 →' }}</span>
            </button>
          </div>
          <small v-if="msg.notice" class="chat-notice">{{ msg.notice }}</small>
        </div>
      </div>

      <div class="quick-actions">
        <button v-for="btn in quickButtons" :key="btn" class="quick-btn" :disabled="isSending" @click="sendQuickMessage(btn)">
          {{ btn }}
        </button>
      </div>

      <div class="chat-footer">
        <input
          v-model="inputText"
          type="text"
          class="chat-input"
          placeholder="서울의 장소와 이벤트를 물어보세요..."
          :disabled="isSending"
          @keyup.enter="handleUserSend"
        />
        <button class="chat-send" :disabled="isSending" @click="handleUserSend">{{ isSending ? 'WAIT' : 'SEND' }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
  /* global defineProps */
  import { ref, watch, nextTick } from 'vue'
  import { useRouter } from 'vue-router'
  import { apiRequest } from '@/core/api/client'

  const props = defineProps({
    openRequest: { type: Number, default: 0 }
  })

  const isChatOpen = ref(false)
  const router = useRouter()
  const inputText = ref('')
  const isSending = ref(false)
  const openingResultId = ref('')
  const messages = ref([
    {
      text: '안녕하세요. 서울의 관광, 미식, 축제 정형 데이터 인프라를 학습한 아카이브 어시스턴트입니다. 무엇을 찾고 계신가요?',
      isUser: false,
      includeInHistory: false
    }
  ])
  const chatBodyRef = ref(null)

  const quickButtons = [
    '🏛️ 야경 명소',
    '🍲 종로구 맛집',
    '🎉 현재 축제'
  ]

  const toggleChat = () => {
    isChatOpen.value = !isChatOpen.value
  }

  const scrollToBottom = async () => {
    await nextTick()
    if (chatBodyRef.value) {
      chatBodyRef.value.scrollTop = chatBodyRef.value.scrollHeight
    }
  }

  const appendMessage = (text, isUser, extra = {}) => {
    messages.value.push({ text, isUser, includeInHistory: true, ...extra })
  }

  const handleUserSend = async () => {
    const text = inputText.value.trim()
    if (!text || isSending.value) return

    const history = messages.value
      .filter((message) => message.includeInHistory)
      .map((message) => ({
        role: message.isUser ? 'user' : 'assistant',
        content: message.text
      }))

    appendMessage(text, true)
    inputText.value = ''
    isSending.value = true
    await scrollToBottom()

    try {
      const response = await apiRequest('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message: text, history })
      })
      appendMessage(response.answer, false, {
        results: response.results || [],
        notice: response.notice || ''
      })
    } catch (error) {
      appendMessage(error.message || '챗봇 응답을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.', false, {
        includeInHistory: false
      })
    } finally {
      isSending.value = false
      await scrollToBottom()
    }
  }

  const openResult = async (result) => {
    const resultKey = `${result.type}-${result.id}`
    if (openingResultId.value) return
    openingResultId.value = resultKey
    try {
      if (result.type === 'post') {
        await router.push({ name: 'community-detail', params: { id: String(result.id) } })
        isChatOpen.value = false
        return
      }

      if (result.type === 'place') {
        const params = new URLSearchParams({ title: result.title, page: '1', size: '20' })
        const response = await apiRequest(`/api/locations?${params.toString()}`)
        const candidates = Array.isArray(response) ? response : response.items || []
        const exactTitle = candidates.filter((item) => item.title === result.title)
        const matched = exactTitle.find((item) => !result.address || item.addr1 === result.address) || exactTitle[0]

        if (matched?.id != null) {
          sessionStorage.setItem(`localhub-location-${matched.id}`, JSON.stringify(matched))
          await router.push({
            name: 'information-detail',
            params: { id: String(matched.id) },
            query: { title: matched.title }
          })
          isChatOpen.value = false
        } else if (result.source_url) {
          window.open(result.source_url, '_blank', 'noopener,noreferrer')
        } else {
          appendMessage('이 장소는 상세 페이지와 연결할 수 있는 데이터가 없습니다.', false, { includeInHistory: false })
        }
      }
    } catch (error) {
      appendMessage(error.message || '상세 정보를 여는 중 문제가 발생했습니다.', false, { includeInHistory: false })
    } finally {
      openingResultId.value = ''
      await scrollToBottom()
    }
  }

  const sendQuickMessage = async (message) => {
    inputText.value = message
    await nextTick()
    await handleUserSend()
  }

  watch(isChatOpen, async (newVal) => {
    if (newVal) {
      await nextTick()
      await scrollToBottom()
    }
  })

  watch(() => props.openRequest, () => {
    isChatOpen.value = true
  })
</script>

<style scoped>
.chat-toggle-btn {
  position: fixed;
  bottom: 32px;
  right: 32px;
  width: 56px;
  height: 56px;
  background-color: #b22222;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  cursor: pointer;
  z-index: 2000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-size: 24px;
  transition: transform 0.3s;
}

.chat-toggle-btn:hover {
  transform: scale(1.05);
}

.chat-window {
  position: fixed;
  bottom: 104px;
  right: 32px;
  width: 700px;
  height: 850px;
  max-width: calc(100vw - 64px);
  max-height: calc(100vh - 136px);
  background-color: #fbfbfa;
  border: 1px solid #1a1a1a;
  display: flex;
  flex-direction: column;
  z-index: 2000;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  opacity: 0;
  transform: translateY(20px);
  pointer-events: none;
  transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
}

.chat-window.active {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.chat-header {
  background-color: #1a1a1a;
  color: #ffffff;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-header h3 {
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.05em;
  margin: 0;
}

.chat-close {
  cursor: pointer;
  opacity: 0.7;
  font-size: 18px;
  transition: opacity 0.3s;
}

.chat-close:hover {
  opacity: 1;
}

.chat-body {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.msg {
  max-width: 80%;
  padding: 10px 14px;
  font-size: 14px;
  word-break: keep-all;
  border-radius: 4px;
}

.message-label { display: block; margin-bottom: 6px; color: #b22222; font-family: 'Montserrat', sans-serif; font-size: 9px; font-weight: 800; letter-spacing: 0.1em; }
.message-text { margin: 0; white-space: pre-wrap; line-height: 1.7; }

.chat-results { display: grid; gap: 8px; margin-top: 14px; }
.results-title { padding-top: 10px; border-top: 1px solid rgba(0, 0, 0, 0.12); color: #666666; font-size: 11px; font-weight: 700; }
.result-card { display: flex; flex-direction: column; gap: 5px; padding: 13px; border: 1px solid rgba(0, 0, 0, 0.14); background: #ffffff; color: inherit; text-align: left; cursor: pointer; transition: border-color 0.2s ease, transform 0.2s ease; }
.result-card:hover { transform: translateY(-1px); border-color: #1a1a1a; }
.result-card:disabled { cursor: wait; opacity: 0.65; }
.result-card strong { font-size: 14px; }
.result-topline { display: flex; justify-content: space-between; gap: 8px; }
.result-topline em { color: #b22222; font-family: 'Montserrat', sans-serif; font-size: 9px; font-style: normal; font-weight: 800; letter-spacing: 0.08em; }
.result-topline small, .result-address, .result-detail, .result-tags { color: #666666; font-size: 11px; }
.result-link-text { margin-top: 4px; color: #1a1a1a; font-size: 11px; font-weight: 700; }
.chat-notice { display: block; margin-top: 10px; color: #777777; font-size: 11px; }

.msg-ai {
  background-color: #e5e5e5;
  color: #1a1a1a;
  align-self: flex-start;
}

.msg-user {
  background-color: #1a1a1a;
  color: #ffffff;
  align-self: flex-end;
}

.quick-actions {
  padding: 8px 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  border-top: 1px solid #e5e5e5;
  background-color: rgba(0, 0, 0, 0.01);
}

.quick-btn {
  font-size: 12px;
  background-color: #ffffff;
  border: 1px solid #1a1a1a;
  padding: 6px 12px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.quick-btn:hover {
  background-color: #1a1a1a;
  color: #ffffff;
}

.quick-btn:disabled, .chat-send:disabled { cursor: wait; opacity: 0.5; }

.chat-footer {
  padding: 12px;
  border-top: 1px solid #1a1a1a;
  display: flex;
  gap: 8px;
}

.chat-input {
  flex: 1;
  border: none;
  background: transparent;
  font-family: inherit;
  font-size: 14px;
  outline: none;
}

.chat-send {
  background: none;
  border: none;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 12px;
  cursor: pointer;
  color: #b22222;
  padding: 0;
  transition: opacity 0.3s;
}

.chat-send:hover {
  opacity: 0.7;
}

@media (max-width: 900px) {
  .chat-window {
    width: 100%;
    height: 100vh;
    bottom: 0;
    right: 0;
    border: none;
    border-radius: 0;
  }
}
</style>
