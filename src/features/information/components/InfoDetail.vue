<!-- src/features/information/components/InfoDetail.vue -->
<template>
  <div class="detail-layout">
    <div class="detail-main">
      <img :src="itemImage" :alt="selectedItem.title" />
    </div>
    <div class="detail-side">
      <span class="section-label">{{ label }}</span>
      <h2>{{ selectedItem.title }}</h2>

      <div v-if="selectedItem.addr1" class="meta-row">
        <div class="meta-label">📍 소재지 주소</div>
        <div class="meta-val">{{ selectedItem.addr1 }}</div>
      </div>
      <div v-if="selectedItem.tel" class="meta-row">
        <div class="meta-label">📞 대표 연락처</div>
        <div class="meta-val">{{ selectedItem.tel }}</div>
      </div>
      <div class="meta-row">
        <div class="meta-label">📮 우편번호</div>
        <div class="meta-val">{{ selectedItem.zipcode }}</div>
      </div>
      <div class="meta-row">
        <div class="meta-label">🌐 위도(MapY)</div>
        <div class="meta-val">{{ parseFloat(selectedItem.mapy).toFixed(6) }}</div>
      </div>
      <div class="meta-row">
        <div class="meta-label">🌐 경도(MapX)</div>
        <div class="meta-val">{{ parseFloat(selectedItem.mapx).toFixed(6) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
/* global defineProps */
defineProps({
  selectedItem: {
    type: Object,
    required: true
  },
  itemImage: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
.detail-layout {
  display: grid;
  grid-template-columns: 7fr 5fr;
  gap: 48px;
  padding: 28px;
  border: 1px solid #d8d6d2;
  border-top: 3px solid var(--text-urban-charcoal);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 8px 8px 0 #eceae6;
}

.detail-main img {
  width: 100%;
  height: 420px;
  object-fit: cover;
  margin-bottom: 24px;
  border: 1px solid var(--muted-gray);
}

.detail-description {
  font-size: 15px;
  color: #555555;
  line-height: 1.8;
}

.detail-side {
  border: 1px solid var(--text-urban-charcoal);
  border-top: 4px solid var(--point-dancheong-red);
  border-radius: 12px;
  padding: 32px;
  background: #ffffff;
  height: fit-content;
}

.detail-side h2 {
  font-size: 26px;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--muted-gray);
  padding-bottom: 12px;
}

.meta-row {
  display: flex;
  margin-bottom: 14px;
  font-size: 14px;
  border-bottom: 1px dashed var(--muted-gray);
  padding-bottom: 10px;
}

.meta-label {
  width: 100px;
  font-weight: 700;
  color: #777777;
}

.meta-val {
  flex: 1;
  color: var(--text-urban-charcoal);
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

@media (max-width: 640px) {
  .detail-layout {
    grid-template-columns: 1fr;
    padding: 16px;
    box-shadow: 4px 4px 0 #eceae6;
  }
}
</style>
