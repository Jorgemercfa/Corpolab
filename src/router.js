import { createRouter, createWebHistory } from 'vue-router';

import Home from './views/Home-item.vue';
import AboutItem from './views/About-item.vue';
import NewsLetter from './views/NewsLetter-item.vue';
import Articles from './views/Articles-item.vue';
import Opinion from './views/Opinion-item.vue';
import AdminPanel from './views/AdminPanel-item.vue';

const routes = [
  { path: '/', name: 'Home', component: Home, meta: { title: 'Corpolab - Inicio' }  },
  { path: '/About-item', name: 'About', component: AboutItem, meta: { title: 'Corpolab - Nosotros' } },
  { path: '/NewsLetter-item', name: 'NewsLetter', component: NewsLetter, meta: { title: 'Corpolab - Blog' }  },
  { path: '/articles', name: 'Articles', component: Articles, meta: { title: 'Corpolab - Artículos' } },
  { path: '/opinion', name: 'Opinion', component: Opinion, meta: { title: 'Corpolab - Opinión' } },
  { path: '/admin', name: 'AdminPanel', component: AdminPanel, meta: { title: 'Corpolab - Admin' } },
  { path: '/:pathMatch(.*)*', redirect: '/' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // ✅ MEJORADO: Mejor scrollBehavior
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0, behavior: 'auto' };
    }
  },
});

// ✅ Asegurar scroll en navegación
router.afterEach(() => {
  window.scrollTo(0, 0);
});

export default router;
