<template>
  <div class="filter-bar">
    <div class="search-wrap">
      <span class="search-icon" aria-hidden="true">⌕</span>
      <input
        :value="modelValue"
        type="search"
        class="input-field"
        placeholder="장소명 또는 주소를 검색하세요"
        aria-label="장소 검색"
        @input="emit('update:modelValue', $event.target.value)"
      />
    </div>

    <select
      :value="district"
      class="district-select"
      aria-label="서울시 자치구 선택"
      @change="emit('update:district', $event.target.value)"
    >
      <option value="ALL">서울 전체</option>
      <option v-for="name in districts" :key="name" :value="name">
        {{ name }}
      </option>
    </select>
  </div>
</template>

<script setup>
/* global defineProps, defineEmits */
defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  district: {
    type: String,
    default: 'ALL'
  }
})

const emit = defineEmits(['update:modelValue', 'update:district'])

const districts = [
  '강남구', '강동구', '강북구', '강서구', '관악구',
  '광진구', '구로구', '금천구', '노원구', '도봉구',
  '동대문구', '동작구', '마포구', '서대문구', '서초구',
  '성동구', '성북구', '송파구', '양천구', '영등포구',
  '용산구', '은평구', '종로구', '중구', '중랑구'
]
</script>

<style scoped>
.filter-bar {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 180px;
  gap: 12px;
  margin-bottom: 40px;
}

.search-wrap {
  position: relative;
}

.search-icon {
  position: absolute;
  top: 50%;
  left: 15px;
  transform: translateY(-50%);
  color: #777777;
  font-size: 20px;
  pointer-events: none;
}

.input-field,
.district-select {
  width: 100%;
  min-height: 48px;
  border: 1px solid var(--text-urban-charcoal);
  background: #ffffff;
  font-family: inherit;
  font-size: 14px;
  outline: none;
}

.input-field {
  padding: 14px 14px 14px 44px;
}

.district-select {
  padding: 0 38px 0 14px;
  cursor: pointer;
}

.input-field:focus,
.district-select:focus {
  box-shadow: 0 0 0 2px rgba(29, 29, 29, 0.14);
}

@media (max-width: 640px) {
  .filter-bar {
    grid-template-columns: 1fr;
  }
}
</style>
