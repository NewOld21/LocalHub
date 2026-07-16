<!-- src/features/information/components/InfoGrid.vue -->
<template>
  <div class="info-grid">
    <InfoCard
      v-for="item in items"
      :key="item.contentid"
      :item="item"
      :image="getItemImage(item)"
      :label="getItemLabel(item.contenttypeid)"
      :address="getItemAddress(item)"
      :formatted-date="getFormattedDate(item)"
      @select="emit('select-item', $event)"
    />
  </div>
</template>

<script setup>
/* global defineProps, defineEmits */
import InfoCard from './InfoCard.vue'

defineProps({
  items: {
    type: Array,
    required: true
  },
  getItemImage: {
    type: Function,
    required: true
  },
  getItemLabel: {
    type: Function,
    required: true
  },
  getItemAddress: {
    type: Function,
    required: true
  },
  getFormattedDate: {
    type: Function,
    required: true
  }
})

const emit = defineEmits(['select-item'])
</script>

<style scoped>
.info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

@media (max-width: 960px) {
  .info-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}

@media (max-width: 640px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
