<template>
  <section class="container section-padding">
    <div class="community-header">
      <div>
        <span class="section-label">04 // COMMUNITY HIGHLIGHTS</span>
        <h2 class="kor-title community-title">MOST VIEWED STORIES</h2>
      </div>
      <router-link to="/community" class="view-all">VIEW ALL STORIES →</router-link>
    </div>

    <div class="list-container">
      <HomeCommunityListItem
        v-for="(post, index) in popularPosts"
        :key="post.id"
        :to="{ name: 'community-detail', params: { id: post.id } }"
        :index="String(index + 1).padStart(2, '0')"
        :title="post.title"
        :snippet="post.content || '게시글 상세 내용을 확인해보세요.'"
        :tags="getTags(post.tags)"
        :date="formatDate(post.created_at)"
        :views="post.views"
      />
      <div v-if="isLoading" class="community-state">인기 게시글을 불러오는 중...</div>
      <div v-else-if="errorMessage" class="community-state error-state">{{ errorMessage }}</div>
      <div v-else-if="!popularPosts.length" class="community-state">아직 등록된 게시글이 없습니다.</div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import HomeCommunityListItem from '@/features/home/components/HomeCommunityListItem.vue'
import { apiRequest } from '@/core/api/client'

const popularPosts = ref([])
const isLoading = ref(false)
const errorMessage = ref('')

const loadPopularPosts = async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const response = await apiRequest('/api/posts/popular?limit=2')
    popularPosts.value = Array.isArray(response) ? response.slice(0, 2) : []
  } catch (error) {
    errorMessage.value = error.message || '인기 게시글을 불러오지 못했습니다.'
  } finally {
    isLoading.value = false
  }
}

const getTags = (tags) => tags
  ? tags.split(',').map((tag) => `#${tag.trim()}`).filter((tag) => tag.length > 1)
  : []

const formatDate = (value) => value
  ? new Intl.DateTimeFormat('ko-KR', { dateStyle: 'medium' }).format(new Date(value))
  : ''

onMounted(loadPopularPosts)
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  width: 100%;
}

.section-padding {
  padding: 120px 0;
}

.community-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 40px;
}

.section-label {
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  font-weight: 800;
  color: #b22222;
  margin-bottom: 16px;
  display: block;
  letter-spacing: 0.1em;
}

.kor-title {
  font-size: 32px;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.community-title {
  margin: 0;
}

.view-all {
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  font-weight: 700;
  color: #1a1a1a;
  text-decoration: none;
  border-bottom: 1px solid #1a1a1a;
  padding-bottom: 4px;
  transition: opacity 0.3s;
}

.view-all:hover {
  opacity: 0.7;
}

.list-container {
  border-top: 1px solid #1a1a1a;
}

.community-state {
  padding: 48px 20px;
  border-bottom: 1px solid #e5e5e5;
  color: #777777;
  text-align: center;
}

.error-state {
  color: #b22222;
}

@media (max-width: 900px) {
  .community-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }

  .view-all {
    width: 100%;
  }
}
</style>
