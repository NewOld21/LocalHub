<template>
  <div class="modal-overlay" :class="{ open: isOpen }" @click.self="emit('close')">
    <div class="modal-box" role="dialog" aria-modal="true" :aria-label="isEditing ? '게시글 수정' : '게시글 작성'">
      <div class="modal-header">
        <h2>{{ isEditing ? '게시글 수정' : '새 게시글 작성' }}</h2>
        <button class="modal-close" type="button" aria-label="닫기" @click="emit('close')">&times;</button>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="postType">게시글 타입</label>
          <select id="postType" v-model="form.type" class="form-control" :disabled="isEditing" required>
            <option value="후기">여행 후기</option>
            <option value="동행">동행 찾기</option>
            <option value="질문">질문/답변</option>
            <option value="추천">로컬맛집 추천</option>
            <option value="기타">기타</option>
          </select>
        </div>
        <div class="form-group">
          <label for="postTitle">제목</label>
          <input id="postTitle" v-model.trim="form.title" type="text" class="form-control" placeholder="제목을 입력해주세요." required />
        </div>
        <div class="form-group">
          <label for="postContent">본문 내용</label>
          <textarea id="postContent" v-model.trim="form.content" class="form-control" rows="5" placeholder="현지 정보나 팁을 자유롭게 공유해주세요." required></textarea>
        </div>
        <div class="form-group">
          <label for="postTags">태그</label>
          <input id="postTags" v-model.trim="form.tags" type="text" class="form-control" placeholder="예: 종로구,맛집,야경" />
        </div>
        <div v-if="!isEditing" class="form-group">
          <label for="postPassword">비밀번호</label>
          <input id="postPassword" v-model="form.password" type="password" class="form-control" placeholder="수정·삭제 시 사용할 비밀번호 (4자 이상)" minlength="4" maxlength="20" autocomplete="new-password" required />
          <p class="password-help">비밀번호는 게시글 수정과 삭제에 필요합니다.</p>
        </div>

        <div class="form-actions">
          <button type="button" class="btn-cancel" @click="emit('close')">취소</button>
          <button type="submit" class="btn-submit">{{ isEditing ? '수정하기' : '등록하기' }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
/* global defineProps, defineEmits */
import { computed, reactive, watch } from 'vue'

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  post: { type: Object, default: null }
})

const emit = defineEmits(['close', 'submit'])
const isEditing = computed(() => Boolean(props.post))
const form = reactive({ type: '후기', title: '', content: '', tags: '', password: '' })

watch(
  () => [props.isOpen, props.post],
  ([isOpen]) => {
    if (!isOpen) return
    form.type = props.post?.type || '후기'
    form.title = props.post?.title || ''
    form.content = props.post?.content || ''
    form.tags = props.post?.tags || ''
    form.password = ''
  },
  { immediate: true }
)

const handleSubmit = () => {
  emit('submit', { ...form })
  form.title = ''
  form.content = ''
  form.tags = ''
  form.password = ''
}
</script>

<style scoped>
.modal-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(4px); display: flex; justify-content: center; align-items: center; z-index: 2000; opacity: 0; pointer-events: none; transition: opacity 0.3s ease; }
.modal-overlay.open { opacity: 1; pointer-events: auto; }
.modal-box { background: #ffffff; width: calc(100% - 32px); max-width: 540px; max-height: calc(100vh - 32px); overflow-y: auto; padding: 36px; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15); transform: translateY(20px); transition: transform 0.3s ease; }
.modal-overlay.open .modal-box { transform: translateY(0); }
.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; border-bottom: 1px solid var(--text-urban-charcoal); padding-bottom: 12px; }
.modal-header h2 { font-size: 20px; font-weight: 700; }
.modal-close { background: none; border: none; font-size: 22px; cursor: pointer; }
.form-group { margin-bottom: 18px; }
.form-group label { display: block; font-size: 13px; font-weight: 700; margin-bottom: 6px; }
.form-control { width: 100%; padding: 12px; border: 1px solid #cccccc; font-family: inherit; font-size: 14px; outline: none; }
.form-control:focus { border-color: var(--text-urban-charcoal); }
.password-help { margin-top: 6px; color: #777777; font-size: 12px; }
.form-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; }
.btn-cancel, .btn-submit { border: none; padding: 12px 20px; cursor: pointer; font-weight: 600; }
.btn-cancel { background: #eeeeee; color: #333333; }
.btn-submit { background: var(--text-urban-charcoal); color: #ffffff; padding-inline: 24px; }
.btn-submit:hover { background-color: var(--point-dancheong-red); }
</style>
