<!-- src/features/community/CommunityPage.vue -->
<template>
  <div class="community-page">
    <Header />

    <section v-if="!route.params.id" class="community-hero">
      <div class="container hero-flex">
        <div>
          <span class="section-label">Lounge & Share</span>
          <h1 class="eng-title">LOCAL TALK</h1>
          <p>로컬인들과 여행자들이 실시간으로 전하는 생생한 현지 소식과 정보 아카이브입니다.</p>
        </div>
        <button class="write-btn" type="button" @click="isModalOpen = true">글쓰기 (WRITE)</button>
      </div>
    </section>

    <div v-if="!route.params.id" class="container">
      <FilterChips :current-filter="currentFilter" @select-filter="handleFilter" />
      <div class="community-search">
        <div class="search-field main-search">
          <label for="communityKeyword">SEARCH STORIES</label>
          <div class="input-wrap">
            <span aria-hidden="true">⌕</span>
            <input id="communityKeyword" v-model="searchKeyword" type="search" placeholder="제목, 본문, 태그를 검색하세요" />
          </div>
        </div>
      </div>
      <div class="list-meta">총 {{ totalCount }}개의 이야기</div>
      <div v-if="errorMessage" class="status-box error-box">
        <p>{{ errorMessage }}</p>
        <button type="button" @click="reloadPosts">다시 시도</button>
      </div>
      <div v-else-if="visiblePosts.length" class="feed-list">
        <FeedCard
          v-for="post in visiblePosts"
          :key="post.id"
          :post="post"
          :label="getTypeLabel(post.type)"
          @select-post="openDetail"
        />
        <div v-if="hasMorePosts" ref="loadMoreTrigger" class="load-more-trigger" aria-hidden="true">게시글을 더 불러오는 중...</div>
      </div>
      <div v-else-if="isLoading" class="status-box">게시글을 불러오는 중...</div>
      <div v-else class="no-posts">해당 조건에 맞는 게시글이 없습니다.</div>
    </div>

    <div v-else-if="isDetailLoading" class="container detail-shell status-box">게시글을 불러오는 중...</div>
    <div v-else-if="selectedPost" class="container detail-shell">
      <button class="back-link" type="button" @click="closeDetail">◁ BACK TO POSTS</button>
      <article class="detail-card">
        <span class="feed-tag"># {{ getTypeLabel(selectedPost.type) }}</span>
        <h2>{{ selectedPost.title }}</h2>
        <p class="detail-content">{{ selectedPost.content }}</p>
        <div class="detail-meta">
          <span>{{ selectedPost.author }}</span>
          <div class="detail-meta-right">
            <span>{{ selectedPost.date }}</span>
            <span>VIEW {{ selectedPost.views ?? 0 }}</span>
          </div>
        </div>
        <p v-if="selectedPost.tags" class="detail-tags"># {{ selectedPost.tags.replace(/,/g, ' #') }}</p>
        <div class="detail-actions">
          <button type="button" class="edit-btn" @click="requestAction('edit')">수정</button>
          <button type="button" class="delete-btn" @click="requestAction('delete')">삭제</button>
        </div>
      </article>
    </div>
    <div v-else class="container detail-shell status-box error-box">
      <p>{{ errorMessage || '게시글을 찾을 수 없습니다.' }}</p>
      <button type="button" @click="closeDetail">목록으로 돌아가기</button>
    </div>

    <WriteModal :is-open="isModalOpen" :post="editingPost" @close="closeWriteModal" @submit="submitPost" />
    <PasswordModal :is-open="isPasswordModalOpen" :is-loading="isPasswordChecking" :error-message="passwordError" @close="closePasswordModal" @confirm="confirmPassword" />
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Header from '@/core/components/Header.vue'
import FilterChips from '@/features/community/components/FilterChips.vue'
import FeedCard from '@/features/community/components/FeedCard.vue'
import WriteModal from '@/features/community/components/WriteModal.vue'
import PasswordModal from '@/features/community/components/PasswordModal.vue'
import { useCommunity } from '@/features/community/composables/useCommunity'

const route = useRoute()
const router = useRouter()
const {
  currentFilter, searchKeyword, visiblePosts, hasMorePosts, totalCount,
  isLoading, isDetailLoading, errorMessage, setFilter, addPost, updatePost, deletePost,
  verifyPassword, loadMorePosts, reloadPosts, getTypeLabel, selectPost, getSelectedPost
} = useCommunity()

const isModalOpen = ref(false)
const editingPost = ref(null)
const isPasswordModalOpen = ref(false)
const pendingAction = ref(null)
const passwordError = ref('')
const isPasswordChecking = ref(false)
const editPassword = ref('')
const loadMoreTrigger = ref(null)
let observer = null

const selectedPost = computed(() => getSelectedPost.value)

watch(
  () => route.params.id,
  async (postId) => {
    if (postId) {
      await selectPost(Number(postId))
    } else {
      selectPost(null)
    }
  },
  { immediate: true }
)

const handleFilter = (type) => {
  setFilter(type)
  selectPost(null)
}

watch(loadMoreTrigger, (element) => {
  observer?.disconnect()
  if (!element) return
  observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) loadMorePosts()
  }, { rootMargin: '240px' })
  observer.observe(element)
})

onBeforeUnmount(() => observer?.disconnect())

const openDetail = (postId) => {
  router.push({ name: 'community-detail', params: { id: postId } })
}

const closeDetail = () => {
  selectPost(null)
  router.push({ name: 'community-list' })
}

const submitPost = async (payload) => {
  try {
    if (editingPost.value) await updatePost(editingPost.value.id, payload, editPassword.value)
    else await addPost(payload)
    closeWriteModal()
  } catch (error) {
    window.alert(error.message || '요청을 처리하지 못했습니다.')
  }
}

const closeWriteModal = () => {
  isModalOpen.value = false
  editingPost.value = null
  editPassword.value = ''
}

const requestAction = (action) => {
  pendingAction.value = action
  passwordError.value = ''
  isPasswordModalOpen.value = true
}

const closePasswordModal = () => {
  if (isPasswordChecking.value) return
  isPasswordModalOpen.value = false
  pendingAction.value = null
  passwordError.value = ''
}

const confirmPassword = async (password) => {
  const action = pendingAction.value
  if (action === 'edit') {
    isPasswordChecking.value = true
    try {
      const authorized = await verifyPassword(selectedPost.value.id, password)
      if (!authorized) {
        isPasswordModalOpen.value = true
        passwordError.value = '비밀번호가 잘못되었습니다. 다시 입력해주세요.'
        return
      }

      editPassword.value = password
      isPasswordModalOpen.value = false
      editingPost.value = selectedPost.value
      await nextTick()
      isModalOpen.value = true
    } catch (error) {
      isPasswordModalOpen.value = true
      passwordError.value = /not found|cannot post/i.test(error.message || '')
        ? '비밀번호 확인 API에 연결할 수 없습니다. 백엔드 서버를 재시작해주세요.'
        : (error.message || '비밀번호를 확인하지 못했습니다.')
      return
    } finally {
      isPasswordChecking.value = false
    }
  } else if (action === 'delete' && window.confirm('게시글을 삭제할까요?')) {
    try {
      await deletePost(selectedPost.value.id, password)
      isPasswordModalOpen.value = false
      router.push({ name: 'community-list' })
    } catch (error) {
      passwordError.value = error.message || '게시글을 삭제하지 못했습니다.'
      return
    }
  }
  passwordError.value = ''
  pendingAction.value = null
}
</script>

<style scoped>
.community-page {
  min-height: 100vh;
  background:
    linear-gradient(90deg, rgba(26, 26, 26, 0.035) 0, transparent 11%, transparent 89%, rgba(26, 26, 26, 0.035) 100%),
    linear-gradient(rgba(251, 251, 250, 0.78), rgba(251, 251, 250, 0.88)),
    url('@/core/assets/background.png') center top / cover fixed;
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 24px;
  width: 100%;
}

.community-hero {
  padding-top: 140px;
  padding-bottom: 40px;
  border-bottom: 1px solid var(--text-urban-charcoal);
  background-color: #f5f4f2;
}

.hero-flex {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.community-hero h1 {
  font-size: 40px;
  line-height: 1.1;
  margin-bottom: 8px;
}

.community-hero p {
  font-size: 15px;
  color: #666666;
}

.section-label {
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  font-weight: 800;
  color: var(--point-dancheong-red);
  margin-bottom: 12px;
  display: block;
  letter-spacing: 0.1em;
}

.eng-title {
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: -0.03em;
}

.write-btn {
  background-color: var(--text-urban-charcoal);
  color: #ffffff;
  border: none;
  padding: 12px 28px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  transition: background-color 0.2s ease;
}

.write-btn:hover {
  background-color: var(--point-dancheong-red);
}

.feed-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 100px;
  margin-top: 12px;
}

.community-search {
  display: block;
  padding: 20px;
  border: 1px solid var(--muted-gray);
  background: #f8f7f5;
}

.search-field label {
  display: block;
  margin-bottom: 7px;
  color: #777777;
  font-family: 'Montserrat', sans-serif;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.1em;
}

.input-wrap {
  position: relative;
}

.input-wrap span {
  position: absolute;
  top: 50%;
  left: 14px;
  transform: translateY(-50%);
  color: var(--point-dancheong-red);
  font-size: 18px;
  font-weight: 700;
  pointer-events: none;
}

.community-search input {
  width: 100%;
  min-height: 46px;
  padding: 12px 14px 12px 42px;
  border: 1px solid #cccccc;
  background: #ffffff;
  font: inherit;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.community-search input:focus {
  border-color: var(--text-urban-charcoal);
  box-shadow: 0 0 0 2px rgba(26, 26, 26, 0.08);
}

.community-search input::placeholder {
  color: #999999;
}

.list-meta {
  margin-top: 14px;
  color: #777777;
  font-size: 13px;
}

.status-box {
  margin-top: 24px;
  padding: 48px 24px;
  border: 1px solid var(--muted-gray);
  text-align: center;
}

.error-box { color: var(--point-dancheong-red); }
.error-box button { margin-top: 14px; padding: 9px 16px; border: 0; cursor: pointer; }

.no-posts {
  text-align: center;
  padding: 60px 0;
  border: 1px dashed var(--muted-gray);
  color: #777777;
  margin-top: 24px;
}

.load-more-trigger {
  padding: 20px;
  color: #888888;
  text-align: center;
  font-size: 13px;
}

.detail-shell {
  padding-top: 140px;
  padding-bottom: 80px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  font-size: 14px;
  color: var(--text-urban-charcoal);
  text-decoration: none;
  margin-bottom: 30px;
  cursor: pointer;
  font-weight: 600;
  background: none;
  border: none;
}

.detail-card {
  position: relative;
  background: #ffffff;
  border: 1px solid #d8d6d2;
  border-top: 4px solid var(--point-dancheong-red);
  border-radius: 16px;
  padding: 32px;
  box-shadow: 8px 8px 0 #eceae6, 0 12px 30px rgba(26, 26, 26, 0.06);
}

.detail-card::after {
  content: 'LOCALHUB · COMMUNITY ARCHIVE';
  position: absolute;
  top: 18px;
  right: 24px;
  color: #c5c2bc;
  font-family: 'Montserrat', sans-serif;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.12em;
}

.feed-tag {
  font-size: 11px;
  font-weight: 800;
  color: var(--point-dancheong-red);
  text-transform: uppercase;
  display: inline-block;
  margin-bottom: 8px;
  letter-spacing: 0.05em;
}

.detail-card h2 {
  font-size: 24px;
  margin-bottom: 16px;
}

.detail-content {
  font-size: 16px;
  color: #555555;
  line-height: 1.8;
  margin-bottom: 20px;
}

.detail-meta {
  display: flex;
  justify-content: space-between;
  color: #999999;
  font-size: 13px;
  margin-bottom: 16px;
}

.detail-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 20px;
  border-top: 1px solid var(--muted-gray);
}

.detail-meta-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.detail-tags {
  margin-bottom: 18px;
  color: var(--point-dancheong-red);
  font-size: 13px;
}

.detail-actions button {
  padding: 9px 18px;
  border: 1px solid var(--text-urban-charcoal);
  background: #ffffff;
  cursor: pointer;
  font-weight: 700;
}

.detail-actions .delete-btn {
  border-color: var(--point-dancheong-red);
  color: var(--point-dancheong-red);
}

@media (max-width: 640px) {
  .hero-flex {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }

  .detail-meta {
    flex-direction: column;
    gap: 8px;
  }

  .detail-meta-right {
    justify-content: space-between;
  }

  .detail-card::after { display: none; }

}
</style>
