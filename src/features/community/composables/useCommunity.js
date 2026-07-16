import { computed, onMounted, ref, watch } from 'vue'
import { apiRequest } from '@/core/api/client'
import { typeLabels } from '@/features/community/mock/typeLabels'

const PAGE_SIZE = 10

export function useCommunity() {
  const posts = ref([])
  const allClientPosts = ref([])
  const usesClientPagination = ref(false)
  const currentFilter = ref('ALL')
  const searchKeyword = ref('')
  const selectedPost = ref(null)
  const currentPage = ref(1)
  const hasMorePosts = ref(false)
  const totalCount = ref(0)
  const isLoading = ref(false)
  const isDetailLoading = ref(false)
  const errorMessage = ref('')
  let debounceId = null

  const formatDate = (value) => {
    if (!value) return ''
    return new Intl.DateTimeFormat('ko-KR', { dateStyle: 'medium' }).format(new Date(value))
  }

  const normalizePost = (post) => ({
    ...post,
    type: post.category,
    author: '익명',
    date: formatDate(post.created_at),
    content: post.content || (post.tags ? `#${post.tags.replace(/,/g, ' #')}` : '상세 내용에서 확인해주세요.'),
    tags: post.tags || ''
  })

  const buildListPath = (page) => {
    const requestSize = currentFilter.value === 'ALL' ? PAGE_SIZE : 10000
    const params = new URLSearchParams({ page: String(page), size: String(requestSize) })
    if (searchKeyword.value.trim()) params.set('keyword', searchKeyword.value.trim())
    return `/api/posts?${params.toString()}`
  }

  const fetchPosts = async ({ reset = false } = {}) => {
    if (isLoading.value) return
    const targetPage = reset ? 1 : currentPage.value
    isLoading.value = true
    errorMessage.value = ''
    try {
      const response = await apiRequest(buildListPath(targetPage))
      const responseItems = Array.isArray(response) ? response : response.items || []
      const normalized = responseItems.map(normalizePost)
      const categoryFiltered = currentFilter.value === 'ALL'
        ? normalized
        : normalized.filter((post) => post.type === currentFilter.value)
      usesClientPagination.value = Array.isArray(response) || currentFilter.value !== 'ALL'
      if (usesClientPagination.value) {
        allClientPosts.value = categoryFiltered
        posts.value = categoryFiltered.slice(0, PAGE_SIZE)
        currentPage.value = 1
        totalCount.value = categoryFiltered.length
        hasMorePosts.value = posts.value.length < categoryFiltered.length
      } else {
        posts.value = reset ? normalized : [...posts.value, ...normalized]
        currentPage.value = targetPage
        totalCount.value = response.meta?.total_count ?? posts.value.length
        hasMorePosts.value = response.meta?.has_next ?? responseItems.length === PAGE_SIZE
      }
    } catch (error) {
      errorMessage.value = error.message || '게시글을 불러오지 못했습니다.'
    } finally {
      isLoading.value = false
    }
  }

  const reloadPosts = () => fetchPosts({ reset: true })

  watch([currentFilter, searchKeyword], () => {
    window.clearTimeout(debounceId)
    debounceId = window.setTimeout(reloadPosts, 250)
  })
  onMounted(reloadPosts)

  const setFilter = (type) => { currentFilter.value = type }

  const addPost = async (payload) => {
    const response = await apiRequest('/api/posts', {
      method: 'POST',
      body: JSON.stringify({
        category: payload.type,
        title: payload.title,
        content: payload.content,
        password: payload.password,
        tags: payload.tags || null
      })
    })
    await reloadPosts()
    return response
  }

  const updatePost = async (postId, payload, password) => {
    await apiRequest(`/api/posts/${postId}`, {
      method: 'PUT',
      body: JSON.stringify({
        title: payload.title,
        content: payload.content,
        password,
        tags: payload.tags || null
      })
    })
    await selectPost(postId)
  }

  const verifyPassword = async (postId, password) => {
    const response = await apiRequest(`/api/posts/${postId}/verify-password`, {
      method: 'POST',
      body: JSON.stringify({ password })
    })
    return response.authorized === true
  }

  const deletePost = async (postId, password) => {
    await apiRequest(`/api/posts/${postId}`, {
      method: 'DELETE',
      body: JSON.stringify({ password })
    })
    selectedPost.value = null
    await reloadPosts()
  }

  const loadMorePosts = async () => {
    if (!hasMorePosts.value || isLoading.value) return
    if (usesClientPagination.value) {
      const nextCount = posts.value.length + PAGE_SIZE
      posts.value = allClientPosts.value.slice(0, nextCount)
      hasMorePosts.value = posts.value.length < allClientPosts.value.length
      return
    }
    currentPage.value += 1
    await fetchPosts()
  }

  const getTypeLabel = (type) => typeLabels[type] || type || '자유 토크'

  const selectPost = async (postId) => {
    if (!postId) {
      selectedPost.value = null
      return
    }
    isDetailLoading.value = true
    errorMessage.value = ''
    try {
      const response = await apiRequest(`/api/posts/${postId}`)
      const normalizedPost = normalizePost(response)
      selectedPost.value = normalizedPost

      const listIndex = posts.value.findIndex((post) => post.id === normalizedPost.id)
      if (listIndex >= 0) {
        posts.value[listIndex] = {
          ...posts.value[listIndex],
          views: normalizedPost.views
        }
      }
    } catch (error) {
      selectedPost.value = null
      errorMessage.value = error.message || '게시글 상세 정보를 불러오지 못했습니다.'
    } finally {
      isDetailLoading.value = false
    }
  }

  return {
    posts,
    visiblePosts: computed(() => posts.value),
    currentFilter,
    searchKeyword,
    hasMorePosts,
    totalCount,
    isLoading,
    isDetailLoading,
    errorMessage,
    setFilter,
    addPost,
    updatePost,
    verifyPassword,
    deletePost,
    loadMorePosts,
    reloadPosts,
    getTypeLabel,
    selectPost,
    getSelectedPost: computed(() => selectedPost.value)
  }
}
