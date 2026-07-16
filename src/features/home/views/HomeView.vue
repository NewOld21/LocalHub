<template>
  <div class="home-page">
    <Header />
    <HomeHeroBanner />
    <HomeArchiveGrid />
    <HomeAboutSection />
    <HomeCommunityHighlights />
    <HomeFooter />
  </div>
</template>

<script setup>
import Header from '@/core/components/Header.vue'
import HomeHeroBanner from '@/features/home/components/HomeHeroBanner.vue'
import HomeArchiveGrid from '@/features/home/components/HomeArchiveGrid.vue'
import HomeAboutSection from '@/features/home/components/HomeAboutSection.vue'
import HomeCommunityHighlights from '@/features/home/components/HomeCommunityHighlights.vue'
import HomeFooter from '@/features/home/components/HomeFooter.vue'
</script>

<style scoped>
:root {
  --bg-warm-ivory: #fbfbfa;
  --text-urban-charcoal: #1a1a1a;
  --point-dancheong-red: #b22222;
  --muted-gray: #e5e5e5;
  --overlay-ink: rgba(0, 0, 0, 0.45);
}

* {
  box-sizing: border-box;
}

body {
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  background-color: var(--bg-warm-ivory);
  color: var(--text-urban-charcoal);
  overflow-x: hidden;
  line-height: 1.6;
}
</style>