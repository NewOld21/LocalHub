<template>
  <router-link :to="to" class="list-item">
    <div class="list-idx">{{ index }}</div>
    <div class="list-main">
      <h3>{{ title }}</h3>
      <div class="list-snippet">{{ snippet }}</div>
      <div class="tags">
        <span v-for="tag in tags" :key="tag" class="tag-chip">{{ tag }}</span>
      </div>
    </div>
    <div class="list-meta">
      <div>{{ date }}</div>
      <div>VIEW {{ views }}</div>
    </div>
    <div class="list-arrow">→</div>
  </router-link>
</template>

<script setup>
/* eslint-disable no-undef,no-unused-vars */
const props = defineProps({
  to: {
    type: [String, Object],
    required: true
  },
  index: String,
  title: String,
  snippet: String,
  tags: Array,
  date: String,
  views: Number
})
</script>

<style scoped>
.list-item {
  display: grid;
  grid-template-columns: 1fr 7fr 2fr 1fr;
  align-items: center;
  padding: 28px 0;
  border-bottom: 1px solid #e5e5e5;
  text-decoration: none;
  color: inherit;
  transition: background-color 0.3s;
  cursor: pointer;
}

.list-item:hover {
  background-color: rgba(26, 26, 26, 0.02);
}

.list-idx {
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  color: #b22222;
  font-size: 16px;
}

.list-main h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 6px;
  transition: transform 0.3s;
}

.list-item:hover .list-main h3 {
  transform: translateX(6px);
  color: #b22222;
}

.list-snippet {
  font-size: 14px;
  color: #666666;
  margin-bottom: 8px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag-chip {
  display: inline-block;
  font-size: 12px;
  color: #1a1a1a;
  background-color: #edeceb;
  padding: 2px 8px;
}

.list-meta {
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  color: #888888;
  text-align: right;
}

.list-arrow {
  text-align: right;
  font-size: 18px;
  transition: transform 0.3s;
}

.list-item:hover .list-arrow {
  transform: translateX(4px);
}

@media (max-width: 900px) {
  .list-item {
    grid-template-columns: 1fr 8fr 2fr;
  }

  .list-arrow {
    display: none;
  }
}
</style>
