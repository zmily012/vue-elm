// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import App from './App.vue';
import goods from './components/goods/goods.vue';
import seller from './components/seller/seller.vue';
import ratings from './components/ratings/ratings.vue';

Vue.config.debug = true;
Vue.use(VueRouter);
Vue.use(VueResource);

const routes = [
  { path: '/goods', component: goods },
  { path: '/seller', component: seller },
  { path: '/ratings', component: ratings },
  {path: '*', redirect: '/goods'}
];
const router = new VueRouter({
  routes,
  linkActiveClass: 'active'
});
new Vue({
  router: router,
  render: h => h(App),
  data: {
  	eventHub: new Vue()
  }
}).$mount('#app');
