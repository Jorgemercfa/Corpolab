<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from 'firebase/firestore';
import Navbar from '@/components/Navbar-item.vue';
import Footer from '@/components/Footer-item.vue';
import { auth, db } from '@/firebase';

/* ======================================
   Auth & admin state
====================================== */
const currentUser = ref(null);
const isAdmin = ref(false);
const authLoading = ref(true);

const loginForm = ref({ email: '', password: '' });
const loginError = ref('');
const loginLoading = ref(false);
const showLoginForm = ref(false);

/* ======================================
   Panel state
====================================== */
const panelError = ref('');
const successMessage = ref('');
const isLoading = ref(false);
const activeSection = ref('articles');

const draftData = ref({ articles: [], opinions: [], admins: [] });

const activeItems = computed({
  get() {
    return draftData.value[activeSection.value];
  },
  set(value) {
    draftData.value[activeSection.value] = value;
  },
});

const sectionLabel = computed(() => {
  if (activeSection.value === 'articles') return 'Artículos';
  if (activeSection.value === 'opinions') return 'Opiniones';
  return 'Administradores';
});

const sectionAddLabel = computed(() => {
  if (activeSection.value === 'articles') return 'artículo';
  if (activeSection.value === 'opinions') return 'opinión';
  return 'administrador';
});

/* ======================================
   Helpers
====================================== */

function normalizeItem(section, item) {
  if (section === 'articles') {
    return {
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
  if (section === 'admins') {
    const role = (item.role || item.rol || 'admin').trim() || 'admin';
    return {
      email: (item.email || '').trim(),
      name: (item.name || '').trim(),
      uid: (item.uid || '').trim() || null,
      rol: role,
      role,
      active: item.active !== false,
    };
  }
  return {
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

const requiredFields = {
  articles: ['title', 'authors', 'category', 'date', 'abstract'],
  opinions: ['title', 'author', 'authorBio', 'date', 'excerpt', 'content', 'category'],
  admins: ['email', 'name'],
};

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
    if (section === 'admins') {
      const email = String(item.email || '').trim();
      if (!email.includes('@')) {
        throw new Error(`El correo en administrador #${index + 1} no es válido.`);
      }
      const role = String(item.rol || item.role || '').trim();
      if (!role) {
        throw new Error(`Completa el rol en administrador #${index + 1}.`);
      }
    }
  }
}

/* ======================================
   Admin access check
====================================== */

// Validates a Firestore admin document. Accepts both 'rol' (legacy schema) and 'role'.
function isValidAdmin(data) {
  return data.active === true && (data.rol === 'admin' || data.role === 'admin');
}

async function checkAdminAccess(user) {
  try {
    const q = query(collection(db, 'admins'), where('uid', '==', user.uid));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return isValidAdmin(snapshot.docs[0].data());
    }
    // Fallback: query by email
    const qEmail = query(collection(db, 'admins'), where('email', '==', user.email));
    const snapEmail = await getDocs(qEmail);
    if (!snapEmail.empty) {
      return isValidAdmin(snapEmail.docs[0].data());
    }
    return false;
  } catch (err) {
    console.error('[Admin] Error verificando acceso:', err);
    return false;
  }
}

/* ======================================
   Load data from Firestore
====================================== */
async function loadSection(section) {
  try {
    const snapshot = await getDocs(collection(db, section));
    const docs = snapshot.docs.map((d) => ({ _docId: d.id, ...d.data() }));
    if (section === 'admins') {
      const normalizedAdmins = docs.map((item) => ({
        ...item,
        rol: item.role || item.rol || 'admin',
        role: item.role || item.rol || 'admin',
        active: item.active !== false,
      }));
      normalizedAdmins.sort((a, b) => {
        const left = String(a.name || a.email || '').toLowerCase();
        const right = String(b.name || b.email || '').toLowerCase();
        return left.localeCompare(right);
      });
      draftData.value[section] = normalizedAdmins;
    } else {
      docs.sort((a, b) => {
        if (!a.date && !b.date) return 0;
        if (!a.date) return 1;
        if (!b.date) return -1;
        return b.date.localeCompare(a.date);
      });
      draftData.value[section] = docs;
    }
  } catch (err) {
    panelError.value = `Error cargando ${section}: ${err.message}`;
  }
}

async function loadAllSections() {
  isLoading.value = true;
  await Promise.all([loadSection('articles'), loadSection('opinions'), loadSection('admins')]);
  isLoading.value = false;
}

/* ======================================
   Auth listener
====================================== */
let unsubscribeAuth = null;

onMounted(() => {
  unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
    if (user) {
      currentUser.value = user;
      const ok = await checkAdminAccess(user);
      isAdmin.value = ok;
      if (ok) {
        await loadAllSections();
      }
    } else {
      currentUser.value = null;
      isAdmin.value = false;
    }
    authLoading.value = false;
  });
});

onUnmounted(() => {
  if (unsubscribeAuth) unsubscribeAuth();
});

/* ======================================
   Login / Logout
====================================== */
async function loginAdmin() {
  loginError.value = '';
  loginLoading.value = true;
  try {
    const credential = await signInWithEmailAndPassword(
      auth,
      loginForm.value.email.trim(),
      loginForm.value.password,
    );
    const ok = await checkAdminAccess(credential.user);
    if (!ok) {
      await signOut(auth);
      loginError.value = 'Tu cuenta no tiene permisos de administrador o está inactiva.';
      return;
    }
    loginForm.value = { email: '', password: '' };
    showLoginForm.value = false;
  } catch (err) {
    const CODE = err.code || '';
    if (
      CODE === 'auth/invalid-credential'
      || CODE === 'auth/wrong-password'
      || CODE === 'auth/user-not-found'
      || CODE === 'auth/invalid-email'
    ) {
      loginError.value = 'Correo o contraseña incorrectos.';
    } else {
      loginError.value = `Error al iniciar sesión: ${err.message}`;
    }
  } finally {
    loginLoading.value = false;
  }
}

async function logoutAdmin() {
  await signOut(auth);
  showLoginForm.value = false;
  panelError.value = '';
  successMessage.value = '';
}

/* ======================================
   CRUD operations
====================================== */
async function saveSection(section) {
  panelError.value = '';
  successMessage.value = '';
  isLoading.value = true;
  try {
    validateItems(section);
    for (const item of draftData.value[section]) {
      const { _docId, ...rest } = item;
      const normalized = normalizeItem(section, rest);
      if (_docId) {
        await updateDoc(doc(db, section, _docId), normalized);
      } else {
        const newRef = await addDoc(collection(db, section), normalized);
        item._docId = newRef.id;
      }
    }
    successMessage.value = `${sectionLabel.value} guardados en Firestore correctamente.`;
  } catch (err) {
    console.error(err);
    panelError.value = err?.message || `Error al guardar en Firestore.`;
  } finally {
    isLoading.value = false;
  }
}

async function removeItem(index) {
  panelError.value = '';
  successMessage.value = '';
  const item = activeItems.value[index];
  if (item._docId) {
    try {
      await deleteDoc(doc(db, activeSection.value, item._docId));
    } catch (err) {
      panelError.value = `Error al eliminar: ${err.message}`;
      return;
    }
  }
  activeItems.value.splice(index, 1);
  successMessage.value = 'Elemento eliminado.';
}

function addItem() {
  if (activeSection.value === 'articles') {
    activeItems.value.push({
      _docId: null,
      title: '',
      authors: '',
      category: '',
      date: '',
      abstract: '',
      pdfUrl: '#',
      image: null,
      featured: false,
    });
  } else if (activeSection.value === 'opinions') {
    activeItems.value.push({
      _docId: null,
      title: '',
      author: '',
      authorBio: '',
      date: '',
      excerpt: '',
      content: '',
      category: '',
      featured: false,
    });
  } else {
    activeItems.value.push({
      _docId: null,
      email: '',
      name: '',
      uid: '',
      rol: 'admin',
      role: 'admin',
      active: true,
    });
  }
}

async function resetCurrentSection() {
  panelError.value = '';
  successMessage.value = '';
  isLoading.value = true;
  await loadSection(activeSection.value);
  isLoading.value = false;
  successMessage.value = 'Sección recargada desde Firestore.';
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
        Gestiona artículos, opiniones y administradores desde una sola vista.
      </p>

      <!-- Cargando estado de autenticación -->
      <div v-if="authLoading" class="auth-loading">Verificando sesión…</div>

      <template v-else>
        <!-- Botón de acceso si no está autenticado -->
        <div v-if="!isAdmin" class="author-toggle-wrapper">
          <button class="toggle-login-btn" @click="showLoginForm = !showLoginForm">
            {{ showLoginForm ? 'Cancelar' : '🔒 Acceso administrador' }}
          </button>
        </div>

        <!-- Formulario de login -->
        <div v-if="!isAdmin && showLoginForm" class="admin-box">
          <h2>Ingreso de administrador</h2>
          <div class="form-grid form-grid--auth">
            <label>
              Correo electrónico
              <input
                v-model="loginForm.email"
                type="email"
                placeholder="admin@ejemplo.com"
                autocomplete="email"
              />
            </label>
            <label>
              Contraseña
              <input
                v-model="loginForm.password"
                type="password"
                placeholder="Contraseña"
                autocomplete="current-password"
                @keyup.enter="loginAdmin"
              />
            </label>
          </div>
          <button class="primary-btn" :disabled="loginLoading" @click="loginAdmin">
            {{ loginLoading ? 'Verificando…' : 'Ingresar' }}
          </button>
          <p v-if="loginError" class="error-text">{{ loginError }}</p>
        </div>

        <!-- Panel de edición -->
        <section v-if="isAdmin" class="admin-panel">
          <div class="admin-panel-header">
            <h2>Editor de contenido</h2>
            <button class="secondary-btn" @click="logoutAdmin">Cerrar sesión</button>
          </div>

          <div class="info-box">
            <p><strong>Autenticación:</strong> el inicio de sesión real usa Firebase Authentication.</p>
            <p><strong>Autorización:</strong> la colección <code>admins</code> define permisos y estado activo.</p>
            <p>
              <strong>Campo contraseña en Firestore:</strong> si existe en <code>admins</code>, se ignora para
              autenticación.
            </p>
            <p>
              Si un registro en <code>admins</code> no tiene cuenta en Firebase Auth, no podrá iniciar sesión
              hasta crearla en Firebase Authentication.
            </p>
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
            <button
              class="switch-btn"
              :class="{ 'switch-btn--active': activeSection === 'admins' }"
              @click="activeSection = 'admins'"
            >
              Administradores
            </button>
          </div>

          <div class="actions-row">
            <button class="primary-btn" @click="addItem">
              Agregar {{ sectionAddLabel }}
            </button>
            <button class="secondary-btn" :disabled="isLoading" @click="resetCurrentSection">
              Recargar
            </button>
            <button
              class="primary-btn"
              :disabled="isLoading"
              @click="saveSection(activeSection)"
            >
              {{ isLoading ? 'Guardando…' : `Guardar ${sectionLabel}` }}
            </button>
          </div>

          <p v-if="panelError" class="error-text">{{ panelError }}</p>
          <p v-if="successMessage" class="success-text">{{ successMessage }}</p>

          <div v-if="isLoading && activeItems.length === 0" class="panel-loading">
            Cargando datos…
          </div>

          <div class="items-list">
            <article
              v-for="(item, index) in activeItems"
              :key="item._docId || `new-${index}`"
              class="item-card"
            >
              <div class="item-card-header">
                <h3>#{{ index + 1 }}{{ item._docId ? '' : ' (nuevo)' }}</h3>
                <button class="danger-btn" :disabled="isLoading" @click="removeItem(index)">
                  Eliminar
                </button>
              </div>

              <div class="form-grid">
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

                <template v-else-if="activeSection === 'opinions'">
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

                <template v-else>
                  <label>
                    Nombre
                    <input v-model="item.name" type="text" />
                  </label>

                  <label>
                    Correo
                    <input v-model="item.email" type="email" />
                  </label>

                  <label>
                    UID (Firebase Auth)
                    <input
                      v-model="item.uid"
                      type="text"
                      placeholder="Opcional si aún no existe la cuenta Auth"
                    />
                  </label>

                  <label>
                    Rol
                    <input v-model="item.role" type="text" />
                  </label>
                </template>

                <label v-if="activeSection !== 'admins'" class="checkbox-field">
                  <input v-model="item.featured" type="checkbox" />
                  Destacado (featured)
                </label>

                <label v-else class="checkbox-field">
                  <input v-model="item.active" type="checkbox" />
                  Administrador activo
                </label>
              </div>
            </article>
          </div>
        </section>
      </template>
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

.auth-loading {
  @apply text-center py-10 text-[#888] text-[0.95rem];
}

.panel-loading {
  @apply text-center py-6 text-[#888] text-[0.9rem];
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

.info-box {
  @apply rounded-xl p-4 mb-4 text-[0.9rem];
  background: #e7edf5;
  color: #2a3f5f;
}

.info-box p {
  @apply my-1;
}

.info-box code {
  @apply px-1 rounded;
  background: rgba(69, 106, 154, 0.15);
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

.secondary-btn:disabled {
  @apply opacity-60 cursor-not-allowed;
}

.danger-btn {
  background-color: #d64949;
  color: #fff;
}

.danger-btn:disabled {
  @apply opacity-60 cursor-not-allowed;
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
