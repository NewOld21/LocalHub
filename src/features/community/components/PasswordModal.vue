<template>
  <div class="modal-overlay" :class="{ open: isOpen }" @click.self="close">
    <form class="modal-box" role="dialog" aria-modal="true" @submit.prevent="submit">
      <h2>비밀번호 확인</h2>
      <p>게시글 작성 시 설정한 비밀번호를 입력해주세요.</p>
      <input ref="passwordInput" v-model="password" type="password" placeholder="비밀번호" minlength="4" maxlength="20" autocomplete="current-password" :disabled="isLoading" required />
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <div class="actions">
        <button type="button" class="cancel" :disabled="isLoading" @click="close">취소</button>
        <button type="submit" class="confirm" :disabled="isLoading">{{ isLoading ? '확인 중...' : '확인' }}</button>
      </div>
    </form>
  </div>
</template>

<script setup>
/* global defineProps, defineEmits */
import { nextTick, ref, watch } from 'vue'

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  isLoading: { type: Boolean, default: false },
  errorMessage: { type: String, default: '' }
})
const emit = defineEmits(['close', 'confirm'])
const password = ref('')
const passwordInput = ref(null)

watch(() => props.isOpen, async (isOpen) => {
  if (!isOpen) return
  password.value = ''
  await nextTick()
  passwordInput.value?.focus()
})

const close = () => {
  if (!props.isLoading) emit('close')
}
const submit = () => {
  if (!props.isLoading) emit('confirm', password.value)
}
</script>

<style scoped>
.modal-overlay { position: fixed; inset: 0; z-index: 2100; display: flex; align-items: center; justify-content: center; background: rgba(0, 0, 0, 0.45); opacity: 0; pointer-events: none; transition: opacity 0.2s ease; }
.modal-overlay.open { opacity: 1; pointer-events: auto; }
.modal-box { width: calc(100% - 32px); max-width: 420px; padding: 30px; background: #ffffff; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.18); }
h2 { margin-bottom: 8px; font-size: 21px; }
p { color: #666666; font-size: 14px; }
input { width: 100%; margin-top: 20px; padding: 13px; border: 1px solid var(--text-urban-charcoal); font: inherit; }
.error-message { margin-top: 8px; color: var(--point-dancheong-red); font-size: 12px; }
.actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 24px; }
button { border: 0; padding: 11px 20px; cursor: pointer; font-weight: 700; }
button:disabled, input:disabled { cursor: wait; opacity: 0.6; }
.cancel { background: #eeeeee; }
.confirm { background: var(--text-urban-charcoal); color: #ffffff; }
</style>
