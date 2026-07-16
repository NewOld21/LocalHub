<!-- src/features/community/components/FeedCard.vue -->
<template>
  <article class="feed-card" @click="emit('select-post', post.id)">
    <div class="feed-main">
      <span class="feed-category">CATEGORY · {{ label }}</span>
      <h3>{{ post.title }}</h3>
      <p class="feed-summary">{{ post.content }}</p>
      <div v-if="post.tags" class="feed-tags">
        <span v-for="tag in post.tags.split(',')" :key="tag">#{{ tag.trim() }}</span>
      </div>
      <div class="feed-meta">
        <span class="feed-author">{{ post.author }}</span>
        <div class="meta-divider"></div>
        <span>{{ post.date }}</span>
        <div class="meta-divider"></div>
        <span class="feed-views">VIEW {{ post.views ?? 0 }}</span>
      </div>
    </div>
    <div v-if="post.img" class="feed-img-box">
      <img :src="post.img" alt="피드 이미지" class="feed-img" />
    </div>
  </article>
</template>

<script setup>
/* global defineProps, defineEmits */
defineProps({
  post: {
    type: Object,
    required: true
  },
  label: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['select-post'])
</script>

<style scoped>
.feed-card {
  position: relative;
  background: #ffffff;
  border: 1px solid #d8d6d2;
  border-left: 4px solid var(--text-urban-charcoal);
  border-radius: 14px;
  padding: 28px;
  display: flex;
  gap: 24px;
  justify-content: space-between;
  align-items: flex-start;
  cursor: pointer;
  box-shadow: 0 8px 22px rgba(26, 26, 26, 0.06), 5px 5px 0 #eceae6;
  transition: transform 0.3s cubic-bezier(0.215, 0.61, 0.355, 1), box-shadow 0.3s cubic-bezier(0.215, 0.61, 0.355, 1), border-color 0.2s ease;
}

.feed-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--card-shadow-hover);
  border-color: var(--point-dancheong-red);
  border-left-color: var(--point-dancheong-red);
}

.feed-main {
  flex: 1;
  min-width: 0;
}

.feed-category {
  font-size: 11px;
  font-weight: 800;
  color: var(--point-dancheong-red);
  text-transform: uppercase;
  display: inline-block;
  margin-bottom: 8px;
  letter-spacing: 0.05em;
}

.feed-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: -4px 0 16px;
}

.feed-tags span {
  padding: 3px 8px;
  background: #f1f0ee;
  color: #666666;
  font-size: 11px;
}

.feed-card h3 {
  font-size: 19px;
  font-weight: 700;
  line-height: 1.4;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.2s ease;
}

.feed-card:hover h3 {
  text-decoration: underline;
}

.feed-summary {
  font-size: 14px;
  color: #555555;
  line-height: 1.6;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.feed-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: #999999;
}

.feed-author {
  font-weight: 700;
  color: var(--text-urban-charcoal);
}

.feed-views {
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
}

.meta-divider {
  width: 1px;
  height: 10px;
  background: var(--muted-gray);
}

.feed-img-box {
  width: 110px;
  height: 110px;
  flex-shrink: 0;
  overflow: hidden;
  background: #f1f0ee;
  border: 1px solid var(--muted-gray);
}

.feed-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.feed-card:hover .feed-img {
  transform: scale(1.04);
}
</style>
