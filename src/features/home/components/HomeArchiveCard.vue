<template>
  <router-link :to="to" class="archive-card">
    <div class="card-bg" :style="{ backgroundImage: `url('${imageUrl}')` }"></div>
    <div class="card-content">
      <h3 class="eng-title card-title">{{ title }}</h3>
      <p class="card-desc">{{ description }}</p>
    </div>
    <div class="card-arrow">→</div>
  </router-link>
</template>

<script setup>
/* eslint-disable no-undef,no-unused-vars */
const props = defineProps({
  to: {
    type: [String, Object],
    required: true
  },
  imageUrl: String,
  title: String,
  description: String
})
</script>

<style scoped>
.archive-card {
  height: 400px;
  position: relative;
  overflow: hidden;
  text-decoration: none;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 32px;
  cursor: pointer;
}

.archive-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.45);
  z-index: 1;
  transition: background-color 0.3s;
}

.archive-card:hover::before {
  background-color: rgba(0, 0, 0, 0.6);
}

.card-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  transition: transform 0.5s ease;
  z-index: 0;
}

.archive-card:hover .card-bg {
  transform: scale(1.05);
}

.card-content {
  position: relative;
  z-index: 2;
}

.card-title {
  font-size: 24px;
  margin-bottom: 8px;
}

.card-desc {
  font-size: 14px;
  opacity: 0.8;
  font-weight: 400;
}

.card-arrow {
  position: absolute;
  right: 32px;
  bottom: 32px;
  font-size: 20px;
  z-index: 2;
  transition: transform 0.3s;
}

.archive-card:hover .card-arrow {
  transform: translateX(6px);
}

.eng-title {
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: -0.03em;
}

@media (max-width: 900px) {
  .archive-card {
    height: 280px;
  }
}
</style>
