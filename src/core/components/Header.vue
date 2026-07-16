<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <header :class="['header', { scrolled: isScrolled, 'home-page': isHomePage, 'light-page': isLightPage }]">
    <div class="header-inner">
      <router-link to="/" class="logo">LOCALHUB</router-link>
      <nav>
        <router-link to="/" class="nav-link" :class="{ active: route.name === 'home' }">HOME</router-link>
        <router-link to="/information" class="nav-link" :class="{ active: route.name === 'information' }">INFORMATION</router-link>
        <router-link to="/community" class="nav-link" :class="{ active: route.name === 'community-list' || route.name === 'community-detail' }">COMMUNITY</router-link>
      </nav>
    </div>
  </header>
</template>

<script setup>
/* eslint-disable vue/multi-word-component-names */
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isScrolled = ref(false)
const isHomePage = computed(() => route.name === 'home')
const isLightPage = computed(() =>
  ['information', 'information-detail', 'community-list', 'community-detail'].includes(route.name)
)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 80
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  transition: background-color 0.3s, border-color 0.3s;
  border-bottom: 1px solid transparent;
}

.header.scrolled {
  background-color: #fbfbfa;
  border-color: #e5e5e5;
}

.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-family: 'Montserrat', sans-serif;
  font-weight: 800;
  font-size: 20px;
  text-decoration: none;
  color: #ffffff;
  transition: color 0.3s;
  letter-spacing: 0.05em;
}

.header.light-page .logo,
.header.light-page .nav-link,
.header.light-page .nav-link:hover,
.header.light-page .nav-link.active {
  color: #1a1a1a;
}

.header.light-page .nav-link {
  color: rgba(26, 26, 26, 0.8);
}

.header.scrolled .logo {
  color: #1a1a1a;
}

nav {
  display: flex;
  gap: 32px;
}

.nav-link {
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.8);
  transition: color 0.3s;
}

.nav-link:hover,
.nav-link.active {
  color: #ffffff;
}

.header.scrolled .nav-link {
  color: rgba(26, 26, 26, 0.6);
}

.header.scrolled .nav-link:hover,
.header.scrolled .nav-link.active {
  color: #1a1a1a;
}

@media (max-width: 900px) {
  nav {
    gap: 16px;
  }
  
  .nav-link {
    font-size: 12px;
  }
}
</style>