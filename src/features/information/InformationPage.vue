<template>
  <div class="information-page">
    <Header />

    <div v-if="!isDetailView" class="app-view active">
      <section class="sub-hero">
        <div class="container">
          <span class="section-label">TourAPI 4.0 REGISTRY</span>
          <h1 class="eng-title">SEOUL INFRASTRUCTURE</h1>
          <p>한국관광공사 공공데이터 연동 표준 포맷 기반의 실시간 지역 정보 탐색 허브입니다.</p>
        </div>
      </section>

      <div class="container content-area">
        <InfoCategoryTabs :selected-category="selectedCategory" @select-category="handleCategorySelect" />
        <InfoFilterBar v-model="searchKeyword" v-model:district="selectedDistrict" />

        <div class="results-meta">
          <div>TourAPI 색인 매칭 결과 | 총 {{ totalCount }}건</div>
          <button class="reset-btn" type="button" @click="handleResetFilters">필터 초기화 (RESET)</button>
        </div>

        <div v-if="isLoading && !filteredItems.length" class="status-message">장소 정보를 불러오는 중...</div>
        <div v-else-if="errorMessage && !filteredItems.length" class="status-message error-message">
          <p>{{ errorMessage }}</p>
          <button type="button" class="retry-btn" @click="reloadItems">다시 시도</button>
        </div>
        <template v-else-if="filteredItems.length">
          <InfoGrid
            :items="visibleItems"
            :get-item-image="getItemImage"
            :get-item-label="getItemLabel"
            :get-item-address="getItemAddress"
            :get-formatted-date="getFormattedDate"
            @select-item="openDetail"
          />
          <div v-if="hasMoreItems" ref="loadMoreTrigger" class="load-more-trigger" aria-hidden="true">{{ isLoading ? '장소를 더 불러오는 중...' : '아래로 스크롤하면 장소를 더 불러옵니다.' }}</div>
        </template>
        <div v-else-if="hasActiveFilters" class="no-results">
          <h2 class="eng-title">NO DATA MATCHED</h2>
          <p>선택 및 기입하신 조건에 충족하는 TourAPI 레코드가 수집 범위 내에 존재하지 않습니다.</p>
        </div>
        <div v-else class="status-message">등록된 장소 정보가 없습니다.</div>
      </div>
    </div>

    <div v-else class="app-view active">
      <div class="container detail-container">
        <button class="back-link" type="button" @click="closeDetail">◁ BACK TO ARCHIVES</button>
        <div v-if="isDetailLoading" class="status-message">상세 정보를 불러오는 중...</div>
        <div v-else-if="detailError" class="status-message error-message">{{ detailError }}</div>
        <InfoDetail
          v-else
          :selected-item="selectedItem"
          :item-image="getItemImage(selectedItem)"
          :label="getItemLabel(selectedItem.contenttypeid)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
  import { computed, onBeforeUnmount, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import Header from '@/core/components/Header.vue'
  import InfoCategoryTabs from '@/features/information/components/InfoCategoryTabs.vue'
  import InfoFilterBar from '@/features/information/components/InfoFilterBar.vue'
  import InfoGrid from '@/features/information/components/InfoGrid.vue'
  import InfoDetail from '@/features/information/components/InfoDetail.vue'
  import { useInformation } from '@/features/information/composables/useInformation'
  import { apiRequest } from '@/core/api/client'

  const {
    selectedCategory,
    searchKeyword,
    selectedDistrict,
    filteredItems,
    visibleItems,
    totalCount,
    hasMoreItems,
    hasActiveFilters,
    isLoading,
    errorMessage,
    reloadItems,
    setCategory,
    resetFilters,
    loadMoreItems,
    getItemImage,
    getItemAddress,
    getItemLabel,
    getFormattedDate
  } = useInformation()

  const route = useRoute()
  const router = useRouter()
  const loadMoreTrigger = ref(null)
  const detailItem = ref(null)
  const isDetailLoading = ref(false)
  const detailError = ref('')
  let observer = null

  watch(loadMoreTrigger, (element) => {
    observer?.disconnect()
    if (!element) return
    observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) loadMoreItems()
    }, { rootMargin: '300px' })
    observer.observe(element)
  })

  onBeforeUnmount(() => observer?.disconnect())

  watch(
    () => route.query.category,
    (categoryId) => {
      setCategory(typeof categoryId === 'string' ? categoryId : 'ALL')
    },
    { immediate: true }
  )

  const defaultSelectedItem = {
    title: '',
    contenttypeid: '12',
    addr1: '',
    tel: '',
    zipcode: '',
    mapx: '0',
    mapy: '0'
  }

  const isDetailView = computed(() => Boolean(route.params.id))

  const selectedItem = computed(() => {
    return detailItem.value || defaultSelectedItem
  })

  const normalizeDetailItem = (item) => ({
    ...item,
    contentid: String(item.id ?? item.contentid),
    contenttypeid: item.category_id ?? item.contenttypeid,
    zipcode: item.zipcode || item.extra_data?.zipcode || '',
    modifiedtime: item.modifiedtime || ''
  })

  watch(
    () => route.params.id,
    async (id) => {
      if (!id) {
        detailItem.value = null
        detailError.value = ''
        return
      }

      isDetailLoading.value = true
      detailError.value = ''
      try {
        const cached = sessionStorage.getItem(`localhub-location-${id}`)
        if (cached) {
          detailItem.value = normalizeDetailItem(JSON.parse(cached))
          return
        }

        try {
          const item = await apiRequest(`/api/locations/${id}`)
          detailItem.value = normalizeDetailItem(item)
          return
        } catch (detailApiError) {
          if (!route.query.title) throw detailApiError
        }

        const params = new URLSearchParams({ title: String(route.query.title), page: '1', size: '20' })
        const response = await apiRequest(`/api/locations?${params.toString()}`)
        const candidates = Array.isArray(response) ? response : response.items || []
        const matched = candidates.find((item) => String(item.id) === String(id))
          || candidates.find((item) => item.title === route.query.title)
        if (!matched) throw new Error('해당 장소의 상세 정보를 찾을 수 없습니다.')
        detailItem.value = normalizeDetailItem(matched)
        sessionStorage.setItem(`localhub-location-${id}`, JSON.stringify(matched))
      } catch (error) {
        detailItem.value = null
        detailError.value = error.message || '상세 정보를 불러오지 못했습니다.'
      } finally {
        isDetailLoading.value = false
      }
    },
    { immediate: true }
  )

  const handleCategorySelect = (categoryId) => {
    setCategory(categoryId)
    router.replace({
      name: 'information',
      query: categoryId === 'ALL' ? {} : { category: categoryId }
    })
  }

  const handleResetFilters = () => {
    resetFilters()
    router.replace({ name: 'information' })
  }

  const openDetail = (item) => {
    const id = String(item.id ?? item.contentid)
    sessionStorage.setItem(`localhub-location-${id}`, JSON.stringify(item))
    router.push({
      name: 'information-detail',
      params: { id },
      query: { title: item.title }
    })
  }

  const closeDetail = () => {
    router.push({ path: '/information' })
  }
</script>

<style scoped>
.information-page {
  min-height: 100vh;
  background:
    linear-gradient(90deg, rgba(26, 26, 26, 0.035) 0, transparent 10%, transparent 90%, rgba(26, 26, 26, 0.035) 100%),
    linear-gradient(rgba(251, 251, 250, 0.78), rgba(251, 251, 250, 0.88)),
    url('@/core/assets/background.png') center top / cover fixed;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  width: 100%;
}

.app-view {
  display: block;
  padding-bottom: 120px;
}

.sub-hero {
  padding-top: 140px;
  padding-bottom: 60px;
  border-bottom: 1px solid var(--text-urban-charcoal);
  background-color: #f1f0ee;
}

.sub-hero h1 {
  font-size: 48px;
  line-height: 1.1;
  margin-bottom: 12px;
}

.sub-hero p {
  font-size: 16px;
  color: #555555;
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

.content-area {
  margin-top: 50px;
}

.results-meta {
  font-size: 14px;
  margin-bottom: 24px;
  color: #666666;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.reset-btn {
  background: none;
  border: none;
  color: var(--text-urban-charcoal);
  cursor: pointer;
  text-decoration: underline;
  font-size: 13px;
}

.no-results {
  text-align: center;
  padding: 100px 0;
  border: 1px dashed var(--text-urban-charcoal);
  background: #ffffff;
}

.status-message {
  padding: 80px 24px;
  border: 1px solid var(--muted-gray);
  background: #ffffff;
  color: #666666;
  text-align: center;
}

.error-message {
  color: var(--point-dancheong-red);
}

.retry-btn {
  margin-top: 16px;
  padding: 10px 18px;
  border: 0;
  background: var(--text-urban-charcoal);
  color: #ffffff;
  cursor: pointer;
  font-weight: 700;
}

.load-more-trigger {
  padding: 28px;
  text-align: center;
  color: #888888;
  font-size: 13px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  font-size: 14px;
  color: var(--text-urban-charcoal);
  text-decoration: none;
  margin: 40px 0 30px;
  cursor: pointer;
  font-weight: 600;
  background: none;
  border: none;
}

.detail-container {
  position: relative;
  padding-top: 100px;
  padding-bottom: 80px;
}

.detail-container::before,
.detail-container::after {
  content: '';
  position: absolute;
  top: 100px;
  bottom: 80px;
  width: 1px;
  background: linear-gradient(transparent, var(--muted-gray) 12%, var(--muted-gray) 88%, transparent);
  pointer-events: none;
}

.detail-container::before { left: 8px; }
.detail-container::after { right: 8px; }

.detail-container > * {
  position: relative;
  z-index: 1;
}

@media (max-width: 640px) {
  .detail-container {
    padding-top: 80px;
  }

  .detail-container::before,
  .detail-container::after { display: none; }
}
</style>
