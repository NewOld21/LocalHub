<!-- src/features/information/components/InfoCategoryTabs.vue -->
<template>
  <div class="category-tabs">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      class="tab-btn"
      :class="{ active: selectedCategory === tab.id }"
      type="button"
      @click="emit('select-category', tab.id)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<script setup>
/* global defineProps, defineEmits */
defineProps({
  selectedCategory: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['select-category'])

const tabs = [
  { id: 'ALL', label: 'ALL (전체)' },
  { id: '12', label: '관광지' },
  { id: '14', label: '문화시설' },
  { id: '39', label: '레포츠' },
  { id: '38', label: '쇼핑' },
  { id: '32', label: '숙박' },
  { id: '25', label: '여행코스' },
  { id: '15', label: '축제공연행사' }
]
</script>

<style scoped>
.category-tabs {
  display: flex;
  gap: 32px;
  margin-bottom: 32px;
  border-bottom: 1px solid var(--muted-gray);
  padding-bottom: 12px;
  overflow-x: auto;
}

.tab-btn {
  background: none;
  border: none;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 14px;
  color: #888888;
  cursor: pointer;
  white-space: nowrap;
}

.tab-btn.active {
  color: var(--text-urban-charcoal);
  position: relative;
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -14px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: var(--point-dancheong-red);
}
</style>
