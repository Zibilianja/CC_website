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
      path: '/data-visualization',
      name: 'DataVisualization',
      component: () => import('../views/DataVisualization.vue'),
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
