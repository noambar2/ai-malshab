import { createRouter, createWebHashHistory } from 'vue-router'
import DialerView from '@/views/DialerView.vue'
import MalshabView from '@/views/MalshabView.vue'
import PlaceholderView from '@/views/PlaceholderView.vue'
import DodgersView from '@/views/DodgersView.vue'
import TaskView from '@/views/TaskView.vue'
import DirectivesView from '@/views/DirectivesView.vue'
import DirectiveWizardView from '@/views/DirectiveWizardView.vue'
import DirectiveDetailView from '@/views/DirectiveDetailView.vue'

// Hash history so deep links work on GitHub Pages without a 404 fallback.
export default createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/dodgers' },
    { path: '/home', name: 'home', component: PlaceholderView, meta: { title: 'דף הבית' } },
    { path: '/malshab', name: 'malshab', component: MalshabView },
    { path: '/dodgers', name: 'dodgers', component: DodgersView },
    { path: '/dodgers/task/:id', name: 'task', component: TaskView },
    { path: '/dialer', name: 'dialer', component: DialerView },
    { path: '/directives', name: 'directives', component: DirectivesView },
    { path: '/directives/new', name: 'directive-new', component: DirectiveWizardView },
    { path: '/directives/:id', name: 'directive', component: DirectiveDetailView },
  ],
  scrollBehavior: () => ({ top: 0 }),
})
