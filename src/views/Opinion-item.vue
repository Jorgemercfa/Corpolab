<script setup>
import { ref } from 'vue';
import Navbar from '@/components/Navbar-item.vue';
import Footer from '@/components/Footer-item.vue';
import { opinions } from '@/data/opinions.js';

const featuredOpinion = opinions.find(o => o.featured);
const gridOpinions = opinions.filter(o => !o.featured || o.id !== featuredOpinion?.id);

const selectedOpinion = ref(null);

function openModal(opinion) {
  selectedOpinion.value = opinion;
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  selectedOpinion.value = null;
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
  <section class="opinion-hero">
    <div class="opinion-hero-content">
      <h1 class="opinion-hero-title">Columna de Opinión</h1>
      <p class="opinion-hero-desc">
        Voces y perspectivas sobre los principales retos legales del emprendimiento.
        Un espacio para debatir derecho corporativo aplicado al crecimiento empresarial.
      </p>
    </div>
  </section>

  <!-- Columna destacada -->
  <section v-if="featuredOpinion" class="opinion-featured-section">
    <div class="opinion-featured-inner">
      <span class="opinion-featured-label">Columna destacada</span>
      <span class="opinion-badge">{{ featuredOpinion.category }}</span>
      <h2 class="opinion-featured-title">{{ featuredOpinion.title }}</h2>
      <p class="opinion-featured-author">
        Por <strong>{{ featuredOpinion.author }}</strong>
        <span class="opinion-featured-bio"> — {{ featuredOpinion.authorBio }}</span>
      </p>
      <p class="opinion-featured-excerpt">{{ featuredOpinion.excerpt }}</p>
      <button class="opinion-featured-btn" @click="openModal(featuredOpinion)">
        Leer columna
      </button>
    </div>
  </section>

  <!-- Grid de columnas -->
  <section class="opinion-grid-section">
    <h2 class="opinion-grid-heading">Todas las columnas</h2>
    <div class="opinion-grid">
      <div
        v-for="opinion in gridOpinions"
        :key="opinion.id"
        class="opinion-card"
      >
        <div class="opinion-card-header">
          <span class="opinion-badge">{{ opinion.category }}</span>
          <span class="opinion-card-date">{{ formatDate(opinion.date) }}</span>
        </div>
        <h3 class="opinion-card-title">{{ opinion.title }}</h3>
        <p class="opinion-card-author">{{ opinion.author }}</p>
        <p class="opinion-card-bio">{{ opinion.authorBio }}</p>
        <p class="opinion-card-excerpt">{{ opinion.excerpt }}</p>
        <button class="opinion-card-btn" @click="openModal(opinion)">Leer columna</button>
      </div>
    </div>
  </section>

  <!-- Modal de detalle -->
  <Teleport to="body">
    <div v-if="selectedOpinion" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content" role="dialog" aria-modal="true">
        <button class="modal-close" @click="closeModal" aria-label="Cerrar">×</button>
        <div class="modal-header">
          <span class="opinion-badge">{{ selectedOpinion.category }}</span>
          <span class="modal-date">{{ formatDate(selectedOpinion.date) }}</span>
        </div>
        <h2 class="modal-title">{{ selectedOpinion.title }}</h2>
        <p class="modal-author">Por <strong>{{ selectedOpinion.author }}</strong></p>
        <p class="modal-author-bio">{{ selectedOpinion.authorBio }}</p>
        <div class="modal-content-text">
          <p v-for="(paragraph, i) in selectedOpinion.content.split('\n\n')" :key="i">
            {{ paragraph }}
          </p>
        </div>
        <button class="btn-close-modal" @click="closeModal">Cerrar</button>
      </div>
    </div>
  </Teleport>

  <footer>
    <Footer />
  </footer>
</template>

<style scoped>
/* ===== HERO ===== */
.opinion-hero {
  @apply py-20 px-[5%] text-center text-white;
  background: linear-gradient(135deg, #456a9a, #d06e12);
}

.opinion-hero-title {
  @apply text-[2.8rem] font-bold m-0 mb-4;
  font-family: 'Inter', sans-serif;
}

.opinion-hero-desc {
  @apply text-[1.1rem] max-w-[700px] mx-auto leading-[1.7] opacity-[0.92];
  font-family: 'Inter', sans-serif;
}

/* ===== FEATURED ===== */
.opinion-featured-section {
  @apply py-[60px] px-[5%] border-b;
  background: #f8f4f0;
  border-color: #e8ddd4;
}

.opinion-featured-inner {
  @apply max-w-[800px] mx-auto;
}

.opinion-featured-label {
  @apply inline-block text-xs font-bold tracking-[1.5px] uppercase mb-3;
  font-family: 'Inter', sans-serif;
  color: #d06e12;
}

.opinion-badge {
  @apply text-white text-xs font-semibold py-[3px] px-[10px] rounded-xl ml-[10px];
  background: #456a9a;
  font-family: 'Inter', sans-serif;
}

.opinion-featured-title {
  @apply text-[1.9rem] font-bold mt-4 mb-3 leading-snug;
  font-family: 'Inter', sans-serif;
  color: #1a1a2e;
}

.opinion-featured-author {
  @apply text-[0.95rem] m-0 mb-4;
  font-family: 'Inter', sans-serif;
  color: #555;
}

.opinion-featured-bio {
  @apply italic;
  color: #888;
}

.opinion-featured-excerpt {
  @apply text-[1.05rem] leading-[1.75] m-0 mb-7 italic pl-5 border-l-4;
  font-family: 'Inter', sans-serif;
  border-color: #d06e12;
  color: #444;
}

.opinion-featured-btn {
  @apply py-3 px-7 text-white border-none rounded-lg text-[0.95rem] font-semibold cursor-pointer transition-all duration-200;
  font-family: 'Inter', sans-serif;
  background: #d06e12;
}

.opinion-featured-btn:hover {
  background: #b85e0e;
}

/* ===== GRID ===== */
.opinion-grid-section {
  @apply py-[60px] px-[5%] max-w-6xl mx-auto;
}

.opinion-grid-heading {
  @apply text-[1.6rem] font-bold m-0 mb-9 text-center relative;
  font-family: 'Inter', sans-serif;
  color: #1a1a2e;
}

.opinion-grid-heading::after {
  content: '';
  width: 50px;
  height: 4px;
  background-color: #d06e12;
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 4px;
}

.opinion-grid {
  @apply grid grid-cols-2 gap-7;
}

.opinion-card {
  @apply bg-white rounded-xl p-7 shadow-md flex flex-col gap-[10px] transition-all duration-[250ms];
}

.opinion-card:hover {
  @apply -translate-y-1 shadow-xl;
}

.opinion-card-header {
  @apply flex items-center gap-2;
}

.opinion-card-date {
  @apply text-[0.82rem] text-[#888] ml-auto;
  font-family: 'Inter', sans-serif;
}

.opinion-card-title {
  @apply text-[1.05rem] font-bold m-0 leading-snug;
  font-family: 'Inter', sans-serif;
  color: #1a1a2e;
}

.opinion-card-author {
  @apply text-[0.9rem] font-semibold m-0;
  font-family: 'Inter', sans-serif;
  color: #d06e12;
}

.opinion-card-bio {
  @apply text-[0.82rem] italic m-0 leading-[1.5];
  font-family: 'Inter', sans-serif;
  color: #888;
}

.opinion-card-excerpt {
  @apply text-[0.9rem] leading-[1.65] m-0 flex-1;
  font-family: 'Inter', sans-serif;
  color: #555;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.opinion-card-btn {
  @apply mt-auto py-[9px] px-[18px] bg-transparent border-2 rounded-lg text-[0.88rem] font-semibold cursor-pointer transition-all duration-200 self-start;
  font-family: 'Inter', sans-serif;
  border-color: #456a9a;
  color: #456a9a;
}

.opinion-card-btn:hover {
  background: #456a9a;
  color: white;
}

/* ===== MODAL ===== */
.modal-overlay {
  @apply fixed inset-0 z-[2000] flex items-center justify-center p-5;
  background: rgba(0, 0, 0, 0.6);
}

.modal-content {
  @apply bg-white rounded-2xl p-10 max-w-[720px] w-full max-h-[85vh] overflow-y-auto relative;
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

.modal-author {
  @apply text-[0.95rem] font-semibold m-0 mb-1;
  color: #d06e12;
}

.modal-author-bio {
  @apply text-[0.88rem] italic m-0 mb-5;
  color: #888;
}

.modal-content-text p {
  @apply text-[0.95rem] leading-[1.75] mb-4;
  color: #444;
}

.btn-close-modal {
  @apply py-[10px] px-[22px] border-none rounded-lg text-[0.9rem] font-semibold cursor-pointer transition-all duration-200;
  font-family: 'Inter', sans-serif;
  background: #f0ebe5;
  color: #555;
}

.btn-close-modal:hover {
  background: #e0d8cf;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 900px) {
  .opinion-grid {
    @apply grid-cols-1;
  }
}

@media (max-width: 640px) {
  .opinion-hero-title {
    @apply text-[2rem];
  }

  .opinion-featured-title {
    @apply text-[1.5rem];
  }

  .modal-content {
    @apply p-5;
  }
}
</style>
