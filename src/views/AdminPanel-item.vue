<script setup>
import { computed, ref } from 'vue';
import Navbar from '@/components/Navbar-item.vue';
import Footer from '@/components/Footer-item.vue';
import { articles as sourceArticles } from '@/data/articles.js';
import { opinions as sourceOpinions } from '@/data/opinions.js';

const ADMIN_USER = (process.env.VUE_APP_ADMIN_USER || 'admin').toLowerCase();
const ADMIN_PASSWORD = process.env.VUE_APP_ADMIN_PASSWORD || 'corpolab-admin-2026';
const SESSION_STORAGE_KEY = 'corpolab-admin-session';

const GITHUB_USER = process.env.VUE_APP_GITHUB_USER || '';
const GITHUB_REPO = process.env.VUE_APP_GITHUB_REPO || '';
const BRANCH = process.env.VUE_APP_GITHUB_BRANCH || 'main';
const TOKEN = process.env.VUE_APP_GITHUB_TOKEN || '';

const FILE_PATHS = {
  articles: 'src/data/articles.js',
  opinions: 'src/data/opinions.js',
};

const canSyncWithGitHub = computed(() =>
  Boolean(GITHUB_USER && GITHUB_REPO && TOKEN),
);

const loginForm = ref({ user: '', password: '' });
const loginError = ref('');
const panelError = ref('');
const successMessage = ref('');
const isLoading = ref(false);
const showLoginForm = ref(false);
const activeSection = ref('articles');
const isAdmin = ref(sessionStorage.getItem(SESSION_STORAGE_KEY) === 'true');

const initialData = {
  articles: deepClone(sourceArticles),
  opinions: deepClone(sourceOpinions),
};

const draftData = ref({
  articles: deepClone(sourceArticles),
  opinions: deepClone(sourceOpinions),
});

const activeItems = computed({
  get() {
    return draftData.value[activeSection.value];
  },
  set(value) {
    draftData.value[activeSection.value] = value;
  },
});

const sectionLabel = computed(() =>
  activeSection.value === 'articles' ? 'Artículos' : 'Opiniones',
);

const requiredFields = {
  articles: ['id', 'title', 'authors', 'category', 'date', 'abstract', 'pdfUrl'],
  opinions: ['id', 'title', 'author', 'authorBio', 'date', 'excerpt', 'content', 'category'],
};

function deepClone(data) {
  return JSON.parse(JSON.stringify(data));
}

function textToBase64(text) {
  const bytes = new TextEncoder().encode(text);
  return btoa(Array.from(bytes, (byte) => String.fromCharCode(byte)).join(''));
}

function buildGitHubHeaders() {
  const authHeader = ['Bearer', TOKEN].join(' ');
  return {
    Authorization: authHeader,
    'Content-Type': 'application/json',
  };
}

function sanitizeId(value, fallbackId) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallbackId;
}

function normalizeItem(section, item, fallbackId) {
  if (section === 'articles') {
    return {
      id: sanitizeId(item.id, fallbackId),
      title: (item.title || '').trim(),
      authors: (item.authors || '').trim(),
      category: (item.category || '').trim(),
      date: (item.date || '').trim(),
      abstract: (item.abstract || '').trim(),
      pdfUrl: (item.pdfUrl || '').trim(),
      image: item.image || null,
      featured: Boolean(item.featured),
    };
  }

  return {
    id: sanitizeId(item.id, fallbackId),
    title: (item.title || '').trim(),
    author: (item.author || '').trim(),
    authorBio: (item.authorBio || '').trim(),
    date: (item.date || '').trim(),
    excerpt: (item.excerpt || '').trim(),
    content: (item.content || '').trim(),
    category: (item.category || '').trim(),
    featured: Boolean(item.featured),
  };
}

function validateItems(section) {
  const fields = requiredFields[section];
  const items = draftData.value[section];

  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];

    for (const field of fields) {
      const value = item[field];
      if (value === null || value === undefined || String(value).trim() === '') {
        throw new Error(
          `Completa el campo "${field}" en ${section === 'articles' ? 'artículo' : 'opinión'} #${index + 1}.`,
        );
      }
    }
  }
}

function fileToExport(section) {
  const fileData = draftData.value[section].map((item, index) =>
    normalizeItem(section, item, index + 1),
  );

  const exportedName = section === 'articles' ? 'articles' : 'opinions';
  return `export const ${exportedName} = ${JSON.stringify(fileData, null, 2)};\n`;
}

async function fetchFileSha(path) {
  const endpoint = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${path}?ref=${BRANCH}`;
  const response = await fetch(endpoint, {
    method: 'GET',
    headers: buildGitHubHeaders(),
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`No se pudo leer ${path} (${response.status}).`);
  }

  const fileData = await response.json();
  return fileData.sha || null;
}

async function uploadSection(section) {
  panelError.value = '';
  successMessage.value = '';

  try {
    validateItems(section);

    if (!canSyncWithGitHub.value) {
      panelError.value = 'El guardado remoto está deshabilitado porque faltan variables de entorno de GitHub.';
      return;
    }

    isLoading.value = true;
    const path = FILE_PATHS[section];
    const sha = await fetchFileSha(path);
    const endpoint = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${path}`;

    const body = {
      message: `chore(admin): update ${path}`,
      content: textToBase64(fileToExport(section)),
      branch: BRANCH,
    };

    if (sha) {
      body.sha = sha;
    }

    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: buildGitHubHeaders(),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`No se pudo guardar ${path} (${response.status}).`);
    }

    successMessage.value = `${sectionLabel.value} guardados y subidos a GitHub correctamente.`;
  } catch (error) {
    console.error(error);
    panelError.value = error?.message
      || 'No se pudo guardar en GitHub. Verifica VUE_APP_GITHUB_USER/REPO/BRANCH/TOKEN y que el token tenga permisos de Contents (Read and write).';
  } finally {
    isLoading.value = false;
  }
}

function addItem() {
  const nextId =
    Math.max(0, ...activeItems.value.map((item) => sanitizeId(item.id, 0))) + 1;

  if (activeSection.value === 'articles') {
    activeItems.value.push({
      id: nextId,
      title: '',
      authors: '',
      category: '',
      date: '',
      abstract: '',
      pdfUrl: '#',
      image: null,
      featured: false,
    });
    return;
  }

  activeItems.value.push({
    id: nextId,
    title: '',
    author: '',
    authorBio: '',
    date: '',
    excerpt: '',
    content: '',
    category: '',
    featured: false,
  });
}

function removeItem(index) {
  activeItems.value.splice(index, 1);
}

function resetCurrentSection() {
  draftData.value[activeSection.value] = deepClone(initialData[activeSection.value]);
  panelError.value = '';
  successMessage.value = 'Se restableció la sección actual a los datos iniciales.';
}

function loginAdmin() {
  loginError.value = '';

  if (
    loginForm.value.user.trim().toLowerCase() === ADMIN_USER
    && loginForm.value.password === ADMIN_PASSWORD
  ) {
    isAdmin.value = true;
    sessionStorage.setItem(SESSION_STORAGE_KEY, 'true');
    loginForm.value = { user: '', password: '' };
    return;
  }

  loginError.value = 'Credenciales inválidas.';
}

function logoutAdmin() {
  isAdmin.value = false;
  sessionStorage.removeItem(SESSION_STORAGE_KEY);
  showLoginForm.value = false;
}
</script>

<template>
  <header>
    <Navbar />
  </header>

  <main class="admin-page">
    <section class="admin-container">
      <h1 class="title">Panel administrativo</h1>
      <p class="subtitle">
        Gestiona artículos y opiniones de derecho corporativo para emprendedores desde una sola vista.
      </p>

      <p class="warning-text">
        ⚠️ Para subir cambios remotos necesitas un token de GitHub con permisos de contenido.
      </p>
      <p class="warning-text warning-text--muted">
        Este panel es de administración básica en frontend: no uses tokens de alto privilegio y evita exponerlo en entornos públicos.
      </p>
      <p v-if="!canSyncWithGitHub" class="warning-text warning-text--muted">
        Variables faltantes: puedes editar visualmente, pero el guardado remoto está deshabilitado.
      </p>

      <div v-if="!isAdmin" class="author-toggle-wrapper">
        <button class="toggle-login-btn" @click="showLoginForm = !showLoginForm">
          {{ showLoginForm ? 'Cancelar' : '🔒 Acceso administrador' }}
        </button>
      </div>

      <div v-if="!isAdmin && showLoginForm" class="admin-box">
        <h2>Ingreso de administrador</h2>
        <div class="form-grid form-grid--auth">
          <input v-model="loginForm.user" type="text" placeholder="Usuario" />
          <input v-model="loginForm.password" type="password" placeholder="Contraseña" />
        </div>
        <button class="primary-btn" @click="loginAdmin">Ingresar</button>
        <p v-if="loginError" class="error-text">{{ loginError }}</p>
      </div>

      <section v-if="isAdmin" class="admin-panel">
        <div class="admin-panel-header">
          <h2>Editor de contenido</h2>
          <button class="secondary-btn" @click="logoutAdmin">Cerrar sesión</button>
        </div>

        <div class="section-switcher">
          <button
            class="switch-btn"
            :class="{ 'switch-btn--active': activeSection === 'articles' }"
            @click="activeSection = 'articles'"
          >
            Artículos
          </button>
          <button
            class="switch-btn"
            :class="{ 'switch-btn--active': activeSection === 'opinions' }"
            @click="activeSection = 'opinions'"
          >
            Opiniones
          </button>
        </div>

        <div class="actions-row">
          <button class="primary-btn" @click="addItem">Agregar {{ activeSection === 'articles' ? 'artículo' : 'opinión' }}</button>
          <button class="secondary-btn" @click="resetCurrentSection">Restablecer</button>
          <button
            class="primary-btn"
            :disabled="!canSyncWithGitHub || isLoading"
            @click="uploadSection(activeSection)"
          >
            {{ isLoading ? 'Guardando...' : `Guardar ${sectionLabel}` }}
          </button>
        </div>

        <p v-if="panelError" class="error-text">{{ panelError }}</p>
        <p v-if="successMessage" class="success-text">{{ successMessage }}</p>

        <div class="items-list">
          <article v-for="(item, index) in activeItems" :key="`${activeSection}-${index}-${item.id}`" class="item-card">
            <div class="item-card-header">
              <h3>#{{ index + 1 }}</h3>
              <button class="danger-btn" @click="removeItem(index)">Eliminar</button>
            </div>

            <div class="form-grid">
              <label>
                ID
                <input v-model.number="item.id" type="number" min="1" />
              </label>

              <label>
                Título
                <input v-model="item.title" type="text" />
              </label>

              <template v-if="activeSection === 'articles'">
                <label>
                  Autores
                  <input v-model="item.authors" type="text" />
                </label>

                <label>
                  Categoría
                  <input v-model="item.category" type="text" />
                </label>

                <label>
                  Fecha
                  <input v-model="item.date" type="date" />
                </label>

                <label>
                  PDF URL
                  <input v-model="item.pdfUrl" type="text" />
                </label>

                <label>
                  Imagen
                  <input v-model="item.image" type="text" placeholder="URL o vacío para null" />
                </label>

                <label class="field-full">
                  Resumen
                  <textarea v-model="item.abstract" rows="5" />
                </label>
              </template>

              <template v-else>
                <label>
                  Autor
                  <input v-model="item.author" type="text" />
                </label>

                <label>
                  Bio del autor
                  <input v-model="item.authorBio" type="text" />
                </label>

                <label>
                  Categoría
                  <input v-model="item.category" type="text" />
                </label>

                <label>
                  Fecha
                  <input v-model="item.date" type="date" />
                </label>

                <label class="field-full">
                  Extracto
                  <textarea v-model="item.excerpt" rows="3" />
                </label>

                <label class="field-full">
                  Contenido
                  <textarea v-model="item.content" rows="8" />
                </label>
              </template>

              <label class="checkbox-field">
                <input v-model="item.featured" type="checkbox" />
                Destacado (featured)
              </label>
            </div>
          </article>
        </div>
      </section>
    </section>
  </main>

  <footer>
    <Footer />
  </footer>
</template>

<style scoped>
.admin-page {
  @apply py-[50px] px-[6%] pb-[90px];
}

.admin-container {
  @apply max-w-[1100px] mx-auto;
}

.title {
  font-size: clamp(2rem, 4vw, 2.5rem);
  @apply mb-[10px];
}

.subtitle {
  @apply mb-[10px];
  color: #444;
}

.warning-text {
  @apply mb-2 text-[0.92rem];
  color: #8a5a00;
}

.warning-text--muted {
  color: #916d3f;
}

.admin-box,
.admin-panel,
.item-card {
  @apply rounded-2xl shadow-lg p-6 mb-6;
  background: #f6efe7;
}

.admin-panel-header,
.item-card-header,
.actions-row {
  @apply flex justify-between items-center gap-3;
}

.section-switcher {
  @apply flex gap-3 my-4;
}

.switch-btn {
  @apply border-none rounded-lg py-[10px] px-[16px] cursor-pointer font-semibold;
  background: #dde6f2;
  color: #34527a;
}

.switch-btn--active {
  background: #456a9a;
  color: #fff;
}

.form-grid {
  @apply grid gap-3 my-4;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.form-grid--auth {
  grid-template-columns: 1fr;
}

label {
  @apply flex flex-col gap-2 text-[0.9rem] font-medium;
  color: #2a2a2a;
}

.field-full {
  grid-column: 1 / -1;
}

input,
textarea {
  @apply w-full p-3 border border-[#d8d8d8] rounded-xl text-[0.95rem] box-border;
}

.checkbox-field {
  @apply flex-row items-center gap-2;
}

.primary-btn,
.secondary-btn,
.danger-btn {
  @apply border-none rounded-lg py-[10px] px-[14px] cursor-pointer font-semibold;
}

.primary-btn {
  background-color: #ab5d14;
  color: #fff;
}

.primary-btn:disabled {
  @apply opacity-60 cursor-not-allowed;
}

.secondary-btn {
  background: #456a9a;
  color: #fff;
}

.danger-btn {
  background-color: #d64949;
  color: #fff;
}

.error-text {
  @apply mt-[10px];
  color: #b92d2d;
}

.success-text {
  @apply mt-[10px];
  color: #0e6f39;
}

.author-toggle-wrapper {
  @apply flex justify-end mb-3;
}

.toggle-login-btn {
  @apply bg-transparent border-none text-[0.82rem] cursor-pointer px-2 py-1 rounded-md transition-colors duration-200;
  color: #888;
}

.toggle-login-btn:hover {
  color: #444;
}

@media (max-width: 900px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .admin-panel-header,
  .item-card-header,
  .actions-row {
    @apply flex-col items-start;
  }
}
</style>
