import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { apiRequest } from '@/core/api/client'
import { categoryDefaultImages, categoryLabels } from '@/features/information/mock/categoryMeta'

const PAGE_SIZE = 9

export function useInformation() {
  const selectedCategory = ref('ALL')
  const searchKeyword = ref('')
  const selectedDistrict = ref('ALL')
  const items = ref([])
  const allClientItems = ref([])
  const usesClientPagination = ref(false)
  const currentPage = ref(1)
  const totalCount = ref(0)
  const hasMoreItems = ref(false)
  const isLoading = ref(false)
  const errorMessage = ref('')
  let debounceId = null
  let requestController = null

  const hasActiveFilters = computed(() => (
    selectedCategory.value !== 'ALL' || Boolean(searchKeyword.value.trim()) || selectedDistrict.value !== 'ALL'
  ))

  const normalizeItem = (item) => ({
    ...item,
    contentid: String(item.id ?? item.contentid),
    contenttypeid: item.category_id ?? item.contenttypeid,
    zipcode: item.zipcode || item.extra_data?.zipcode || '',
    modifiedtime: item.modifiedtime || ''
  })

  const buildPath = (page) => {
    const params = new URLSearchParams({ page: String(page), size: String(PAGE_SIZE) })
    if (selectedCategory.value !== 'ALL') params.set('category_id', selectedCategory.value)
    if (searchKeyword.value.trim()) params.set('keyword', searchKeyword.value.trim())
    if (selectedDistrict.value !== 'ALL') params.set('address', selectedDistrict.value)
    return `/api/locations?${params.toString()}`
  }

  const fetchItems = async ({ reset = false } = {}) => {
    requestController?.abort()
    const controller = new AbortController()
    requestController = controller
    const page = reset ? 1 : currentPage.value
    isLoading.value = true
    errorMessage.value = ''
    try {
      const response = await apiRequest(buildPath(page), { signal: controller.signal })
      const responseItems = Array.isArray(response) ? response : response.items || []
      const normalized = responseItems.map(normalizeItem)
      usesClientPagination.value = Array.isArray(response)
      if (usesClientPagination.value) {
        allClientItems.value = normalized
        items.value = normalized.slice(0, PAGE_SIZE)
        currentPage.value = 1
        totalCount.value = normalized.length
        hasMoreItems.value = items.value.length < normalized.length
      } else {
        items.value = reset ? normalized : [...items.value, ...normalized]
        currentPage.value = page
        totalCount.value = response.meta?.total_count ?? items.value.length
        hasMoreItems.value = response.meta?.has_next ?? responseItems.length === PAGE_SIZE
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        if (reset) items.value = []
        errorMessage.value = error.message || '장소 정보를 불러오지 못했습니다.'
      }
    } finally {
      if (!controller.signal.aborted) isLoading.value = false
    }
  }

  const reloadItems = () => fetchItems({ reset: true })
  const scheduleReload = () => {
    window.clearTimeout(debounceId)
    debounceId = window.setTimeout(reloadItems, 250)
  }

  watch([selectedCategory, searchKeyword, selectedDistrict], scheduleReload)
  onMounted(reloadItems)
  onBeforeUnmount(() => {
    window.clearTimeout(debounceId)
    requestController?.abort()
  })

  const setCategory = (categoryId) => { selectedCategory.value = categoryId }
  const resetFilters = () => {
    selectedCategory.value = 'ALL'
    searchKeyword.value = ''
    selectedDistrict.value = 'ALL'
  }
  const loadMoreItems = async () => {
    if (!hasMoreItems.value || isLoading.value) return
    if (usesClientPagination.value) {
      const nextCount = items.value.length + PAGE_SIZE
      items.value = allClientItems.value.slice(0, nextCount)
      hasMoreItems.value = items.value.length < allClientItems.value.length
      return
    }
    currentPage.value += 1
    await fetchItems()
  }

  const getItemImage = (item) => item.firstimage || categoryDefaultImages[item.contenttypeid] || ''
  const getItemAddress = (item) => item.addr1 || '등록된 소재지 주소 정보가 존재하지 않습니다.'
  const getItemLabel = (id) => categoryLabels[id] || '일반 정보'
  const getFormattedDate = (item) => {
    const value = (item.modifiedtime || '').substring(0, 8)
    return value.length === 8 ? `${value.slice(0, 4)}.${value.slice(4, 6)}.${value.slice(6, 8)}` : '업데이트 정보 없음'
  }

  return {
    selectedCategory, searchKeyword, selectedDistrict,
    filteredItems: computed(() => items.value), visibleItems: computed(() => items.value),
    totalCount, hasMoreItems, hasActiveFilters, isLoading, errorMessage,
    setCategory, resetFilters, reloadItems, loadMoreItems,
    getItemImage, getItemAddress, getItemLabel, getFormattedDate
  }
}
