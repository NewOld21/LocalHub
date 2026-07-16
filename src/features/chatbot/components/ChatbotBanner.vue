<template>
  <a href="#" class="chatbot-banner" @click.prevent="emit('open-chat')">
    <div class="container banner-flex">
      <div class="banner-text">
        <span class="banner-label">DON'T KNOW WHERE TO START?</span>
        <h2>어디로 가야 할지 막막하다면, LocalHub AI에게 물어보세요.</h2>
      </div>
      <div class="banner-arrow">→</div>
    </div>
  </a>
</template>

<script setup>
/* eslint-disable no-undef */
const emit = defineEmits(['open-chat'])
</script>

<style scoped>
.chatbot-banner {
  background-color: #b22222;
  color: #ffffff;
  padding: 60px 0;
  text-decoration: none;
  display: block;
  transition: opacity 0.3s;
  cursor: pointer;
}

.chatbot-banner:hover {
  opacity: 0.95;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  width: 100%;
}

.banner-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.banner-label {
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  letter-spacing: 0.1em;
  display: block;
  margin-bottom: 8px;
  font-weight: 700;
}

.banner-text h2 {
  font-size: 32px;
  margin: 0;
  font-weight: 600;
}

.banner-arrow {
  font-size: 40px;
}

@media (max-width: 900px) {
  .banner-flex {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }

  .banner-text h2 {
    font-size: 24px;
  }

  .banner-arrow {
    font-size: 32px;
  }
}
</style>