<template>
  <section class="container section-padding">
    <div class="about-split">
      <div class="about-left">
        <span class="section-label">03 // ABOUT SERVICE</span>
        <img :src="meetSeoulImage" alt="서울의 풍경과 로컬 경험" class="about-image" />
      </div>
      <div class="about-right">
        <h2 class="kor-title about-subtitle">서울의 공공데이터가<br>사람들의 진짜 경험과 만나는 곳.</h2>
        <p class="about-text">LocalHub는 파편화된 서울의 인프라 정형 데이터 위에 로컬 시민과 방문객들의 기록을 누적시키는 디지털 도록입니다. 정해진 목적지를 넘어 뜻밖의 서울을 발견하는 여정을 시작해보세요.</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import meetSeoulImage from '@/features/home/assets/images/MeetSeoul.jpg'
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  width: 100%;
}

.section-padding {
  padding: 120px 0;
}

.about-split {
  display: grid;
  grid-template-columns: 4fr 8fr;
  gap: 40px;
  border-top: 1px solid #1a1a1a;
  padding-top: 40px;
}

.section-label {
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  font-weight: 800;
  color: #b22222;
  margin-bottom: 16px;
  display: block;
  letter-spacing: 0.1em;
}

.about-left {
  min-width: 0;
}

.about-image {
  display: block;
  width: 100%;
  height: 300px;
  margin-top: 24px;
  object-fit: cover;
  object-position: center;
}

.about-subtitle {
  font-size: 32px;
  font-weight: 600;
  letter-spacing: -0.02em;
  margin-bottom: 24px;
}

.about-text {
  font-size: 18px;
  color: #444444;
  max-width: 700px;
  word-break: keep-all;
  line-height: 1.6;
}

@media (max-width: 900px) {
  .about-split {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .about-image {
    height: min(60vw, 360px);
    margin-top: 8px;
  }
}
</style>
