import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/one',
      name: 'one',
      component: () => import('../views/OneView.vue'),
    },
    {
      path: '/two',
      name: 'two',
      component: () => import('../views/TwoView.vue'),
    },
  ],
});

export default router;
