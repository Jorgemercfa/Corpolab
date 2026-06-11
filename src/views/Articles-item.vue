<script setup>
import { ref, computed, onMounted } from 'vue';
import Navbar from '@/components/Navbar-item.vue';
import Footer from '@/components/Footer-item.vue';
import { useCollection } from '@/composables/useFirestore';

const { items: articles, loading, error, fetchItems } = useCollection('articles');

onMounted(() => {
  fetchItems();
});

const categories = computed(() => [
  'Todos',
  ...new Set(articles.value.map((article) => article.category).filter(Boolean)),
]);
const selectedCategory = ref('Todos');

const filteredArticles = computed(() => {
  if (selectedCategory.value === 'Todos') return articles.value;
  return articles.value.filter(a => a.category === selectedCategory.value);
});

const selectedArticle = ref(null);

function openModal(article) {
  selectedArticle.value = article;
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  selectedArticle.value = null;
  document.body.style.overflow = '';
}

function formatDate(dateStr) {
  const [year, month, day] = dateStr.split('-');
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  return `${parseInt(day)} ${months[parseInt(month) - 1]}. ${year}`;
}
</script>

<template>
  <header>
    <Navbar />
  </header>

  <!-- Hero -->
  <section class="articles-hero">
    <div class="articles-hero-content">
      <h1 class="articles-hero-title">Artículos</h1>
      <p class="articles-hero-desc">
        Investigaciones y análisis prácticos en derecho corporativo para emprendedores.
        Explora guías legales para estructurar, proteger y escalar tu empresa con seguridad jurídica.
      </p>
    </div>
  </section>

  <!-- Filtros -->
  <section class="articles-filter-section">
    <div class="articles-filter-container">
      <button
        v-for="cat in categories"
        :key="cat"
        class="filter-btn"
        :class="{ 'filter-btn--active': selectedCategory === cat }"
        @click="selectedCategory = cat"
      >
        {{ cat }}
      </button>
    </div>
  </section>

  <!-- Grid de artículos -->
  <section class="articles-grid-section">
    <div v-if="loading" class="articles-loading">Cargando artículos…</div>
    <p v-else-if="error" class="articles-error">{{ error }}</p>
    <div v-else class="articles-grid">
      <div v-for="article in filteredArticles" :key="article._docId" class="article-card">
        <div class="article-card-header">
          <span class="article-badge">{{ article.category }}</span>
          <span class="article-date">{{ formatDate(article.date) }}</span>
        </div>
        <h3 class="article-card-title">{{ article.title }}</h3>
        <p class="article-card-authors">{{ article.authors }}</p>
        <p class="article-card-abstract">{{ article.abstract }}</p>
        <button class="article-card-btn" @click="openModal(article)">Leer más</button>
      </div>
    </div>

    <p v-if="!loading && !error && filteredArticles.length === 0" class="articles-empty">
      No hay artículos en esta categoría aún.
    </p>
  </section>

  <!-- Modal de detalle -->
  <Teleport to="body">
    <div v-if="selectedArticle" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content" role="dialog" aria-modal="true">
        <button class="modal-close" @click="closeModal" aria-label="Cerrar">×</button>
        <div class="modal-header">
          <span class="article-badge">{{ selectedArticle.category }}</span>
          <span class="modal-date">{{ formatDate(selectedArticle.date) }}</span>
        </div>
        <h2 class="modal-title">{{ selectedArticle.title }}</h2>
        <p class="modal-authors">{{ selectedArticle.authors }}</p>
        <p class="modal-abstract">{{ selectedArticle.abstract }}</p>
        <div class="modal-actions">
          <a
            v-if="selectedArticle.pdfUrl && selectedArticle.pdfUrl !== '#'"
            :href="selectedArticle.pdfUrl"
            target="_blank"
            class="btn-pdf"
          >
            Descargar PDF
          </a>
          <button class="btn-close-modal" @click="closeModal">Cerrar</button>
        </div>
      </div>
    </div>
  </Teleport>

  <footer>
    <Footer />
  </footer>
</template>

<style scoped>
/* ===== HERO ===== */
.articles-hero {
  @apply py-20 px-[5%] text-center text-white;
  background: linear-gradient(135deg, #d06e12, #456a9a);
}

.articles-hero-title {
  @apply font-['Inter',sans-serif] text-[2.8rem] font-bold mb-4;
}

.articles-hero-desc {
  @apply text-[1.1rem] max-w-[700px] mx-auto leading-[1.7] opacity-[0.92];
  font-family: 'Inter', sans-serif;
}

/* ===== FILTROS ===== */
.articles-filter-section {
  @apply py-8 px-[5%] border-b;
  background: #f8f4f0;
  border-color: #e8ddd4;
}

.articles-filter-container {
  @apply flex flex-wrap gap-3 justify-center max-w-[900px] mx-auto;
}

.filter-btn {
  @apply px-5 py-2 rounded-[24px] border-2 bg-transparent text-[0.9rem] font-medium cursor-pointer transition-all duration-200;
  font-family: 'Inter', sans-serif;
  border-color: #d06e12;
  color: #d06e12;
}

.filter-btn:hover,
.filter-btn--active {
  @apply text-white;
  background: #d06e12;
}

/* ===== GRID ===== */
.articles-grid-section {
  @apply py-12 px-[5%] max-w-6xl mx-auto;
}

.articles-grid {
  @apply grid grid-cols-3 gap-7;
}

.article-card {
  @apply bg-white rounded-xl p-6 shadow-md flex flex-col gap-[10px] transition-all duration-[250ms];
}

.article-card:hover {
  @apply -translate-y-1 shadow-xl;
}

.article-card-header {
  @apply flex items-center justify-between gap-2;
}

.article-badge {
  @apply text-white text-xs font-semibold px-[10px] py-[3px] rounded-xl whitespace-nowrap;
  background: #456a9a;
  font-family: 'Inter', sans-serif;
}

.article-date {
  @apply text-[0.82rem] text-[#888];
  font-family: 'Inter', sans-serif;
}

.article-card-title {
  @apply text-base font-bold m-0 leading-snug;
  font-family: 'Inter', sans-serif;
  color: #1a1a2e;
}

.article-card-authors {
  @apply text-[0.85rem] m-0 font-medium;
  font-family: 'Inter', sans-serif;
  color: #d06e12;
}

.article-card-abstract {
  @apply text-[0.9rem] leading-relaxed m-0 flex-1;
  font-family: 'Inter', sans-serif;
  color: #555;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-card-btn {
  @apply mt-auto py-[9px] px-[18px] text-white border-none rounded-lg text-[0.88rem] font-semibold cursor-pointer transition-all duration-200 self-start;
  font-family: 'Inter', sans-serif;
  background: #d06e12;
}

.article-card-btn:hover {
  background: #b85e0e;
}

.articles-empty {
  @apply text-center text-[#888] text-base py-10;
  font-family: 'Inter', sans-serif;
}

.articles-loading {
  @apply text-center py-10 text-[#888] text-[0.95rem];
  font-family: 'Inter', sans-serif;
}

.articles-error {
  @apply text-center py-6 text-[#b92d2d] text-[0.9rem];
  font-family: 'Inter', sans-serif;
}

/* ===== MODAL ===== */
.modal-overlay {
  @apply fixed inset-0 z-[2000] flex items-center justify-center p-5;
  background: rgba(0, 0, 0, 0.6);
}

.modal-content {
  @apply bg-white rounded-2xl p-10 max-w-[680px] w-full max-h-[85vh] overflow-y-auto relative;
  font-family: 'Inter', sans-serif;
}

.modal-close {
  @apply absolute top-4 right-5 bg-transparent border-none text-[1.8rem] cursor-pointer text-[#555] leading-none;
}

.modal-close:hover {
  color: #d06e12;
}

.modal-header {
  @apply flex items-center gap-3 mb-4;
}

.modal-date {
  @apply text-[0.85rem] text-[#888];
}

.modal-title {
  @apply text-[1.4rem] font-bold m-0 mb-2 leading-snug;
  color: #1a1a2e;
}

.modal-authors {
  @apply text-[0.95rem] font-semibold m-0 mb-4;
  color: #d06e12;
}

.modal-abstract {
  @apply text-[0.95rem] leading-[1.75] m-0 mb-6;
  color: #444;
}

.modal-actions {
  @apply flex gap-3 flex-wrap;
}

.btn-pdf {
  @apply py-[10px] px-[22px] text-white rounded-lg no-underline text-[0.9rem] font-semibold transition-all duration-200;
  background: #456a9a;
}

.btn-pdf:hover {
  background: #375880;
}

.btn-close-modal {
  @apply py-[10px] px-[22px] border-none rounded-lg text-[0.9rem] font-semibold cursor-pointer transition-all duration-200;
  background: #f0ebe5;
  color: #555;
}

.btn-close-modal:hover {
  background: #e0d8cf;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 1024px) {
  .articles-grid {
    @apply grid-cols-2;
  }
}

@media (max-width: 640px) {
  .articles-hero-title {
    @apply text-[2rem];
  }

  .articles-grid {
    @apply grid-cols-1;
  }

  .modal-content {
    @apply p-5;
  }
}
</style>
