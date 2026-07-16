<template>
  <footer>
    <div class="container">
      <div class="footer-grid">
        <div>
          <div class="footer-logo">LOCALHUB</div>
          <p>DISCOVER SEOUL, SHARE YOUR LOCAL STORY.</p>
        </div>
      </div>
      <p class="footer-copyright">© 2026 LOCALHUB. ALL RIGHTS RESERVED. 본 서비스는 한국관광공사 TourAPI 4.0 및 서울 열린데이터광장의 공공데이터를 활용하여 제작되었습니다.</p>
    </div>
  </footer>
</template>

<script setup>
// Footer is static content
</script>

<style scoped>
footer {
  background-color: #1a1a1a;
  color: rgba(255, 255, 255, 0.6);
  padding: 80px 0;
  font-size: 14px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  width: 100%;
}

.footer-grid {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 4px;
  margin-bottom: 40px;
}

.footer-logo {
  color: #ffffff;
  font-family: 'Montserrat', sans-serif;
  font-weight: 800;
  font-size: 24px;
  margin-bottom: 16px;
}

.footer-copyright {
  font-size: 12px;
  opacity: 0.5;
  margin: 0;
}

p {
  margin: 0;
}
</style>