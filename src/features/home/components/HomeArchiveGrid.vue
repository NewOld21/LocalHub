<template>
  <section class="container section-padding">
    <div class="archive-header">
      <div>
        <span class="section-label">02 // SERVICES ARCHIVE</span>
        <h2 class="kor-title">SEOUL IN SEVEN WAYS</h2>
      </div>
      <router-link to="/information" class="view-all">VIEW ALL STORIES →</router-link>
    </div>

    <div
      ref="sliderRef"
      class="archive-slider"
      @mouseenter="isPaused = true"
      @mouseleave="isPaused = false"
    >
      <div class="archive-track" :style="trackStyle">
        <div
          v-for="(card, index) in displayCards"
          :key="`${card.title}-${index}`"
          class="archive-slide"
          :class="{ active: index % cards.length === activeCardIndex }"
          :style="slideStyle"
        >
          <HomeArchiveCard
            :to="{ name: 'information', query: { category: card.categoryId } }"
            :image-url="card.image"
            :title="card.title"
            :description="card.description"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import HomeArchiveCard from '@/features/home/components/HomeArchiveCard.vue'
import attractionImage from '@/features/home/assets/images/Attractions.png'
import leisureImage from '@/features/home/assets/images/LeisureSports.png'
import cultureImage from '@/features/home/assets/images/CulturalFacilities.png'
import shoppingImage from '@/features/home/assets/images/Shopping.png'
import accommodationImage from '@/features/home/assets/images/Accommodation.png'
import travelCourseImage from '@/features/home/assets/images/TravelCourses.png'
import festivalImage from '@/features/home/assets/images/Festivals.png'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const cards = [
  { categoryId: '12', title: '관광지', description: '서울의 대표 관광지를 만나보세요', image: attractionImage },
  { categoryId: '39', title: '레포츠', description: '서울에서 즐기는 액티비티 정보', image: leisureImage },
  { categoryId: '14', title: '문화시설', description: '전시·공연·문화공간 정보', image: cultureImage },
  { categoryId: '38', title: '쇼핑', description: '핫플레이스 쇼핑 정보', image: shoppingImage },
  { categoryId: '32', title: '숙박', description: '서울 숙소 정보', image: accommodationImage },
  { categoryId: '25', title: '여행코스', description: '추천 여행 코스를 확인하세요', image: travelCourseImage },
  { categoryId: '15', title: '축제공연행사', description: '서울 축제와 공연 정보를 확인하세요', image: festivalImage }
]

const visibleCount = 3
const currentIndex = ref(0)
const isPaused = ref(false)
const sliderRef = ref(null)
const cardWidth = ref(0)
const cardGap = 24

const displayCards = Array.from({ length: 120 }, (_, index) => cards[index % cards.length])
const activeCardIndex = computed(() => (currentIndex.value + Math.floor(visibleCount / 2)) % cards.length)

const trackStyle = computed(() => ({
  transform: `translateX(-${currentIndex.value * (cardWidth.value + cardGap)}px)`
}))

const slideStyle = computed(() => ({
  flexBasis: `${cardWidth.value}px`,
  maxWidth: `${cardWidth.value}px`
}))

let intervalId = null
let resizeObserver = null

const updateCardWidth = () => {
  if (!sliderRef.value) return
  cardWidth.value = (sliderRef.value.clientWidth - cardGap * (visibleCount - 1)) / visibleCount
}

const startAutoSlide = () => {
  intervalId = window.setInterval(() => {
    if (!isPaused.value) {
      currentIndex.value += 1
    }
  }, 2000)
}

const stopAutoSlide = () => {
  if (intervalId) window.clearInterval(intervalId)
}

onMounted(() => {
  updateCardWidth()
  resizeObserver = new ResizeObserver(updateCardWidth)
  resizeObserver.observe(sliderRef.value)
  startAutoSlide()
})

onBeforeUnmount(() => {
  stopAutoSlide()
  resizeObserver?.disconnect()
})
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  width: 100%;
}

.section-padding {
  padding-top: 120px;
  padding-bottom: 120px;
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

.archive-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 24px;
  margin-bottom: 40px;
}

.kor-title {
  font-size: 32px;
  font-weight: 600;
  letter-spacing: -0.02em;
  margin: 0;
}

.view-all {
  flex-shrink: 0;
  padding-bottom: 4px;
  border-bottom: 1px solid #1a1a1a;
  color: #1a1a1a;
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
  transition: opacity 0.3s;
}

.view-all:hover {
  opacity: 0.7;
}

.archive-slider {
  overflow: hidden;
  padding: 8px 0 20px;
}

.archive-track {
  display: flex;
  gap: 24px;
  transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;
}

.archive-slide {
  flex-grow: 0;
  flex-shrink: 0;
  transform: scale(0.92);
  opacity: 0.72;
  transition: all 0.6s ease;
}

.archive-slide.active {
  transform: scale(1);
  opacity: 1;
}

@media (max-width: 640px) {
  .container {
    padding-right: 16px;
    padding-left: 16px;
  }

  .archive-header {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
