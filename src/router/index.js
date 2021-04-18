import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/home',
    component: () => import('../views/Home.vue'),
    redirect: '/charts',
    children: [
      { path: '/charts', component: () => import('../components/charts/Chart.vue') },
      { path: '/userManager', component: () => import('../components/user/UserManager.vue') },
      { path: '/article', component: () => import('../components/article/Article.vue') },
      { path: '/comment', component: () => import('../components/comment/Comment.vue') },
    ]
  },
];

const router = new VueRouter({
  mode: 'history',
  routes
});

export default router;

