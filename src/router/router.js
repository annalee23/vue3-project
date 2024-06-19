import { createRouter, createWebHistory } from 'vue-router';
import MyApplications from '@/components/MyApplications.vue';
import MyAccounts from '@/components/MyAccounts.vue';
import OrderDetails from '@/components/OrderDetails.vue';

const routes = [
  {
    path: '/',
    redirect: '/applications'
  },
  {
    path: '/applications',
    component: MyApplications,
  },
  {
    path: '/applications/:id',
    name: 'OrderDetails',
    component: OrderDetails,
    props: true
  },
  {
    path: '/accounts',
    component: MyAccounts,
  }
];

const router = createRouter({
  history: createWebHistory('/vue3-project/'),
  routes
});

export default router;
