import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/features/home/views/HomeView.vue'
import InformationPage from '@/features/information/InformationPage.vue'
import CommunityPage from '@/features/community/CommunityPage.vue'
import { ROUTER_BASE_PATH } from '@/core/config/env'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/information',
    name: 'information',
    component: InformationPage
  },
  {
    path: '/information/:id',
    name: 'information-detail',
    component: InformationPage
  },
  {
    path: '/community',
    name: 'community-list',
    component: CommunityPage
  },
  {
    path: '/community/:id',
    name: 'community-detail',
    component: CommunityPage,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(ROUTER_BASE_PATH),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
