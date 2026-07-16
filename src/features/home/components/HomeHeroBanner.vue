<template>
  <section class="hero">
    <div class="container">
      <div class="hero-content">
        <span class="section-label">01 // SEOUL LOCAL ARCHIVE</span>
        <h1 class="eng-title hero-title">DISCOVER SEOUL,<br>LIVE THE LOCAL STORY</h1>
        <p class="hero-text">서울의 장소와 사람, 그리고 지역 정체성이 깃든 아카이브를 가장 가까운 방식으로 만나보세요.</p>
        <div class="btn-group">
          <router-link to="/information" class="btn btn-filled">EXPLORE SEOUL</router-link>
          <router-link to="/community" class="btn btn-outline">COMMUNITY</router-link>
        </div>
      </div>
    </div>
    <div class="scroll-down">SCROLL TO DISCOVER ↓</div>
  </section>
</template>

<script setup>
// Hero section is primarily visual
</script>

<style scoped>
.hero {
  height: 100vh;
  position: relative;
  background:
    linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)),
    url('@/features/home/assets/images/seoul.png') center/cover no-repeat;
  display: flex;
  align-items: center;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  width: 100%;
}

.hero-content {
  color: #ffffff;
  max-width: 700px;
}

.section-label {
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 16px;
  display: block;
  letter-spacing: 0.1em;
  opacity: 0.8;
}

.eng-title {
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: -0.03em;
}

.hero-title {
  font-size: 64px;
  line-height: 1.1;
  margin-bottom: 24px;
}

.hero-text {
  font-size: 18px;
  font-weight: 400;
  opacity: 0.9;
  margin-bottom: 40px;
  word-break: keep-all;
}

.btn-group {
  display: flex;
  gap: 16px;
}

.btn {
  display: inline-flex;
  align-items: center;
  padding: 16px 32px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s;
  font-family: 'Montserrat', sans-serif;
}

.btn-filled {
  background-color: #ffffff;
  color: #1a1a1a;
}

.btn-filled:hover {
  background-color: #b22222;
  color: #ffffff;
}

.btn-outline {
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: #ffffff;
}

.btn-outline:hover {
  border-color: #ffffff;
  background-color: rgba(255, 255, 255, 0.1);
}

.scroll-down {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  color: #ffffff;
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-align: center;
  opacity: 0.7;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translate(-50%, 0);
  }
  40% {
    transform: translate(-50%, -10px);
  }
  60% {
    transform: translate(-50%, -5px);
  }
}

@media (max-width: 900px) {
  .hero {
    height: auto;
    min-height: 70vh;
  }

  .hero-title {
    font-size: 40px;
  }
}
</style>
