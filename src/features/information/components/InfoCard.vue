<!-- src/features/information/components/InfoCard.vue -->
<template>
  <article class="info-card" @click="emit('select', item)">
    <div class="info-img-wrapper">
      <img class="info-img" :src="thumbnail" :alt="item.title" />
    </div>
    <div class="card-body">
      <span class="card-category"># {{ label }}</span>
      <h3>{{ item.title }}</h3>
      <p class="info-addr">{{ address }}</p>
      <div class="card-meta-footer">
        <span>UPDATE: {{ formattedDate }}</span>
      </div>
    </div>
  </article>
</template>

<script setup>
/* global defineProps, defineEmits */
import { computed } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  image: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  formattedDate: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['select'])

const thumbnail = computed(() => props.image || '/placeholder.jpg')
</script>

<style scoped>
.info-card {
  position: relative;
  background: #ffffff;
  border: 1px solid #d8d6d2;
  border-top: 3px solid var(--text-urban-charcoal);
  border-radius: 14px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  box-shadow: 0 8px 22px rgba(26, 26, 26, 0.07), 5px 5px 0 #eceae6;
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), border-color 0.3s ease;
}

.info-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--card-shadow-hover);
  border-color: var(--point-dancheong-red);
  border-top-color: var(--point-dancheong-red);
}

.info-img-wrapper {
  height: 220px;
  overflow: hidden;
  background-color: #f1f0ee;
  position: relative;
}

.info-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.info-card:hover .info-img {
  transform: scale(1.05);
}

.card-body {
  padding: 24px;
  background: linear-gradient(135deg, #ffffff 0%, #ffffff 82%, #f5f3ef 100%);
}

.card-category {
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  font-weight: 800;
  color: var(--point-dancheong-red);
  text-transform: uppercase;
  margin-bottom: 8px;
  display: block;
}

.info-card h3 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 10px;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.info-addr {
  font-size: 13px;
  color: #666666;
  margin-bottom: 14px;
  min-height: 40px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta-footer {
  border-top: 1px solid var(--muted-gray);
  padding-top: 12px;
  font-size: 12px;
  color: #999999;
  display: flex;
  justify-content: space-between;
}
</style>
