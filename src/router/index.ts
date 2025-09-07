import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/portfolio',
      name: 'Portfolio',
      component: () => import('../views/Portfolio.vue'),
    },
    {
      path: '/3d-assets',
      name: '3DAssets',
      component: () => import('../views/3DAssets.vue'),
    },
    {
      path: '/shop',
      name: 'Shop',
      component: () => import('../views/CraftShop.vue'),
    },
    {
      path: '/contact',
      name: 'Contact',
      component: () => import('../views/Contact.vue'),
    },
  ],
});
