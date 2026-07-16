<!-- src/features/community/components/FilterChips.vue -->
<template>
  <div class="filter-chips">
    <button
      v-for="chip in chips"
      :key="chip.value"
      class="chip"
      :class="{ active: currentFilter === chip.value }"
      type="button"
      @click="emit('select-filter', chip.value)"
    >
      {{ chip.label }}
    </button>
  </div>
</template>

<script setup>
/* global defineProps, defineEmits */
defineProps({
  currentFilter: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['select-filter'])

const chips = [
  { value: 'ALL', label: '전체보기' },
  { value: '후기', label: '🎈 여행 후기' },
  { value: '동행', label: '🤝 동행 찾기' },
  { value: '질문', label: '❓ 질문/답변' },
  { value: '추천', label: '🍽️ 로컬맛집 추천' },
  { value: '기타', label: '💡 기타' }
]
</script>

<style scoped>
.filter-chips {
  display: flex;
  gap: 10px;
  margin: 32px 0;
  overflow-x: auto;
  padding-bottom: 4px;
}

.chip {
  background: #ffffff;
  border: 1px solid var(--muted-gray);
  padding: 8px 18px;
  font-size: 13px;
  font-weight: 600;
  border-radius: 30px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.chip.active {
  background-color: var(--text-urban-charcoal);
  color: #ffffff;
  border-color: var(--text-urban-charcoal);
}

.chip:hover:not(.active) {
  border-color: var(--text-urban-charcoal);
}
</style>
