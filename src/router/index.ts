import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/one',
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
