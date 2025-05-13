import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/gwmpcwg',
    },
    {
      path: '/gwmpcwg',
      name: 'gwmpcwg',
      component: () => import('../views/GwmpcwgView.vue'),
    },
    {
      path: '/szk',
      name: 'szk',
      component: () => import('../views/SzkView.vue'),
    },
    {
      path: '/qyb',
      name: 'qyb',
      component: () => import('../views/QybView.vue'),
    },
    {
      path: '/jxtx',
      name: 'jxtx',
      component: () => import('../views/JxtxView.vue'),
    },
    {
      path: '/dcybh',
      name: 'dcybh',
      component: () => import('../views/DcybhView.vue'),
    },
    {
      path: '/sqjsc',
      name: 'sqjsc',
      component: () => import('../views/SqjscView.vue'),
    },
  ],
});

export default router;
