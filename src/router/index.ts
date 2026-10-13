import { createRouter, createWebHashHistory } from 'vue-router'
import DialerView from '@/views/DialerView.vue'
import MalshabView from '@/views/MalshabView.vue'
import PlaceholderView from '@/views/PlaceholderView.vue'

// Hash history so deep links work on GitHub Pages without a 404 fallback.
export default createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/dialer' },
    { path: '/home', name: 'home', component: PlaceholderView, meta: { title: 'דף הבית' } },
    { path: '/malshab', name: 'malshab', component: MalshabView },
    { path: '/dialer', name: 'dialer', component: DialerView },
    { path: '/directives', name: 'directives', component: PlaceholderView, meta: { title: 'דירקטיבות' } },
  ],
  scrollBehavior: () => ({ top: 0 }),
})
