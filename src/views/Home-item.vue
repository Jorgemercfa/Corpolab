<script setup>
import Navbar from '@/components/Navbar-item.vue';
import Footer from '@/components/Footer-item.vue';

import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useCollection } from '@/composables/useFirestore';

const { items: articles, loading: articlesLoading, error: articlesError, fetchItems: fetchArticles } = useCollection('articles');
const { items: opinions, loading: opinionsLoading, error: opinionsError, fetchItems: fetchOpinions } = useCollection('opinions');

const latestArticles = computed(() =>
  articles.value.slice(0, 3)
);

const featuredOpinions = computed(() =>
  opinions.value.filter(o => o.featured).slice(0, 2)
);

function formatDate(dateStr) {
  const [year, month, day] = dateStr.split('-');
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  return `${parseInt(day)} ${months[parseInt(month) - 1]}. ${year}`;
}

/* =============================
   CARRUSEL PRINCIPAL
============================= */

import img1 from '@/assets/home1.png';
import img2 from '@/assets/home2.png';
import img3 from '@/assets/home3.png';
import img4 from '@/assets/home4.png';

const images = [img1, img2, img3, img4];

const currentImageIndex = ref(0);
const intervalId = ref(null);

const nextImage = () => {
  currentImageIndex.value = (currentImageIndex.value + 1) % images.length;
};

/* iniciar carrusel */

const startCarousel = () => {
  stopCarousel();
  intervalId.value = setInterval(nextImage, 5000);
};

/* detener carrusel */

const stopCarousel = () => {
  if (intervalId.value) {
    clearInterval(intervalId.value);
    intervalId.value = null;
  }
};

onMounted(() => {
  startCarousel();
  fetchArticles();
  fetchOpinions();
});

onBeforeUnmount(() => {
  stopCarousel();
});
</script>

<template>
  <header>
    <Navbar />
  </header>
  <div class="home-area">
    <!-- Carrusel automático -->
    <div class="carousel-container">
      <img class="img-home" :src="images[currentImageIndex]" />
      <div class="carousel-dots">
        <span
          v-for="(image, index) in images"
          :key="index"
          :class="{ active: index === currentImageIndex }"
          @click="currentImageIndex = index"
        ></span>
      </div>
    </div>

    <div class="text-home">
      <strong>Corpolab</strong> es una revista académica y de opinión dedicadaa brindar información sobre derecho corporativo para los emprendedores de forma sencilla.
    </div>

    <!-- Sección: Últimos Artículos -->
    <section class="home-section">
      <h2 class="title-home">Últimos Artículos</h2>
      <div v-if="articlesLoading" class="home-loading">Cargando artículos…</div>
      <p v-else-if="articlesError" class="home-error">{{ articlesError }}</p>
      <div v-else class="home-articles-grid">
        <div
          v-for="article in latestArticles"
          :key="article._docId"
          class="home-article-card"
        >
          <div class="home-article-card-top">
            <span class="home-badge">{{ article.category }}</span>
            <span class="home-date">{{ formatDate(article.date) }}</span>
          </div>
          <h3 class="home-article-title">{{ article.title }}</h3>
          <p class="home-article-authors">{{ article.authors }}</p>
        </div>
      </div>
      <div class="home-section-footer">
        <router-link to="/articles" class="home-view-all-btn">Ver todos los artículos →</router-link>
      </div>
    </section>

    <!-- Sección: Columnas de Opinión Destacadas -->
    <section class="home-section home-section--alt">
      <h2 class="title-home">Columnas de Opinión Destacadas</h2>
      <div v-if="opinionsLoading" class="home-loading">Cargando columnas…</div>
      <p v-else-if="opinionsError" class="home-error">{{ opinionsError }}</p>
      <div v-else class="home-opinions-grid">
        <div
          v-for="opinion in featuredOpinions"
          :key="opinion._docId"
          class="home-opinion-card"
        >
          <span class="home-badge home-badge--blue">{{ opinion.category }}</span>
          <h3 class="home-opinion-title">{{ opinion.title }}</h3>
          <p class="home-opinion-author">{{ opinion.author }}</p>
          <p class="home-opinion-excerpt">{{ opinion.excerpt }}</p>
        </div>
      </div>
      <div class="home-section-footer">
        <router-link to="/opinion" class="home-view-all-btn">Ver todas las columnas →</router-link>
      </div>
    </section>
  </div>

  <footer>
    <Footer />
  </footer>
</template>

<style>
.img-home {
  @apply w-full object-cover transition-opacity duration-[800ms] ease-in-out;
  height: 80vh;
  min-height: 500px;
  object-position: center 30%;
}

/* .home-area {
} */

.title-home {
  @apply text-center font-bold relative;
  font-size: 32px;
  margin: 80px 0 40px 0;
}

.title-home::after {
  content: '';
  width: 60px;
  height: 4px;
  background-color: #d06e12;
  position: absolute;
  bottom: -12px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 5px;
}

.text-home {
  @apply max-w-[900px] mx-auto text-center text-lg leading-[1.7];
  margin: 60px auto;
  font-family: 'Inter', sans-serif;
}

.main-text-home{
  color: #d06e12;
  font-size: 24px;
}

.our-stories {
  width: 100%;
  background: linear-gradient(135deg, #d06e12, #456a9a);
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 40px;
  padding: 80px 40px;
  flex-wrap: wrap;
}

.card-icons {
  /* width: 90px; */
  height: 140px;
  background-color: white;
  border-radius: 30%;
  object-fit: contain;
  margin-bottom: 20px;
}

.logs-item {
  width: 180px;
  min-height: 220px;
  background-color: #ab5d14;
  border-radius: 16px;
  text-align: center;
  color: #ffffff;
  padding: 20px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-decoration: none;
}

.logs-item:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
}

.our-sector {
  width: 100%;
  height: 300px;
  background: linear-gradient(135deg, #d06e12, #456a9a);
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

/* ===============================
   Carrusel automático clientes
================================= */

.our-customers {
  overflow: hidden;
  background: linear-gradient(135deg, #d06e12, #456a9a);
  padding: 80px 0;
  position: relative;
}

.customers-track {
  display: flex;
  width: max-content;
  animation: scrollCustomers 25s linear infinite;
}

.customer-slide {
  flex: 0 0 auto;
  padding: 0 40px;
}

.customer-icons {
  height: 60px;
  width: auto;
  opacity: 0.8;
  transition: all 0.3s ease;
}

.customer-icons:hover {
  transform: scale(1.1);
}

/* Animación infinita */
@keyframes scrollCustomers {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

/* Estilos para el carrusel */
.carousel-container {
  @apply relative w-full;
}

.carousel-container::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.25);
}

.carousel-dots {
  @apply absolute bottom-5 left-0 right-0 flex justify-center gap-[10px];
}

.carousel-dots span {
  @apply w-3 h-3 rounded-full cursor-pointer transition-colors duration-300;
}

.carousel-dots .active {
  background: #d06e12;
  transform: scale(1.2);
}
/* =================================
   MEJORAS RESPONSIVE MOVIL
================================= */

@media (max-width: 768px) {
  /* Imagen principal */
  .img-home {
    height: 55vh;
    min-height: 280px;
  }

  /* Texto introductorio */
  .text-home {
    font-size: 16px;
    padding: 0 20px;
    margin: 40px auto;
  }

  /* Títulos */
  .title-home {
    font-size: 26px;
    margin: 60px 0 30px 0;
  }

  /* ===============================
     SERVICIOS
  =============================== */

  .our-stories {
    gap: 20px;
    padding: 50px 20px;
  }

  .logs-item {
    width: 140px;
    min-height: 170px;
    padding: 15px;
  }

  .card-icons {
    width: 65px;
    height: 65px;
    padding: 14px;
  }

  /* ===============================
     SECTORES
  =============================== */

  .our-sector {
    height: auto;
    flex-wrap: wrap;
    padding: 50px 20px;
    gap: 20px;
  }
}

/* =================================
   MOVILES PEQUEÑOS
================================= */

@media (max-width: 480px) {
  .img-home {
    height: 45vh;
  }

  .title-home {
    font-size: 22px;
  }

  .logs-item {
    width: 120px;
    min-height: 150px;
    font-size: 10px;
  }

  .card-icons {
    width: 55px;
    height: 55px;
  }

  .customer-icons {
    height: 45px;
  }
}

/* ===== SECCIONES HOME: ARTÍCULOS Y OPINIONES ===== */

.home-section {
  @apply py-[60px] px-[5%] max-w-6xl mx-auto;
}

.home-section--alt {
  @apply w-full py-[60px] px-[5%];
  background: #f8f4f0;
  max-width: 100%;
}

.home-section--alt .home-articles-grid,
.home-section--alt .home-opinions-grid {
  max-width: 1200px;
  margin: 0 auto;
}

.home-articles-grid {
  @apply grid grid-cols-1 gap-6 mt-12;
}

.home-article-card {
  @apply bg-white rounded-xl p-[22px] shadow-md flex flex-col gap-2 transition-all duration-[220ms];
}

.home-article-card:hover {
  @apply -translate-y-1 shadow-lg;
}

.home-article-card-top {
  @apply flex items-center justify-between gap-2;
}

.home-badge {
  @apply text-white text-xs font-bold py-[3px] px-[9px] rounded-xl;
  background: #d06e12;
  font-family: 'Inter', sans-serif;
}

.home-badge--blue {
  background: #456a9a;
}

.home-date {
  @apply text-[0.8rem] text-[#999];
  font-family: 'Inter', sans-serif;
}

.home-article-title {
  @apply text-[0.97rem] font-bold m-0 leading-snug;
  font-family: 'Inter', sans-serif;
  color: #1a1a2e;
}

.home-article-authors {
  @apply text-[0.83rem] m-0 font-medium;
  font-family: 'Inter', sans-serif;
  color: #d06e12;
}

.home-opinions-grid {
  @apply grid grid-cols-1 gap-6 mt-12;
}

.home-opinion-card {
  @apply bg-white rounded-xl p-6 shadow-md flex flex-col gap-[10px] transition-all duration-[220ms];
}

.home-opinion-card:hover {
  @apply -translate-y-1 shadow-lg;
}

.home-opinion-title {
  @apply text-base font-bold m-0 leading-snug;
  font-family: 'Inter', sans-serif;
  color: #1a1a2e;
}

.home-opinion-author {
  @apply text-[0.87rem] font-semibold m-0;
  font-family: 'Inter', sans-serif;
  color: #456a9a;
}

.home-opinion-excerpt {
  @apply text-[0.88rem] leading-[1.65] m-0;
  font-family: 'Inter', sans-serif;
  color: #555;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.home-section-footer {
  @apply text-center mt-9;
}

.home-view-all-btn {
  @apply inline-block py-3 px-7 text-white rounded-lg no-underline text-[0.95rem] font-semibold transition-all duration-200;
  font-family: 'Inter', sans-serif;
  background: #d06e12;
}

.home-view-all-btn:hover {
  background: #b85e0e;
}

.home-loading {
  @apply text-center py-8 text-[#888] text-[0.95rem];
  font-family: 'Inter', sans-serif;
}

.home-error {
  @apply text-center py-4 text-[#b92d2d] text-[0.9rem];
  font-family: 'Inter', sans-serif;
}

@media (min-width: 768px) {
  .home-articles-grid {
    @apply grid-cols-2;
  }

  .home-opinions-grid {
    @apply grid-cols-2;
  }
}

@media (min-width: 1024px) {
  .home-articles-grid {
    @apply grid-cols-3;
  }
}
</style>
