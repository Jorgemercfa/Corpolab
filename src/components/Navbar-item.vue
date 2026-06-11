<template>
  <nav class="navbar-area">
    <div class="link-style" :class="{ 'show-menu': menuOpen }">
      <router-link @click="closeMenu" to="/" class="text-navbar"
        >Inicio</router-link
      >
      <router-link @click="closeMenu" to="/About-item" class="text-navbar"
        >Nosotros</router-link
      >
      <router-link @click="closeMenu" to="/NewsLetter-item" class="text-navbar"
        >Newsletter</router-link
      >
      <router-link @click="closeMenu" to="/articles" class="text-navbar"
        >Artículos</router-link
      >
      <router-link @click="closeMenu" to="/opinion" class="text-navbar"
        >Opinión</router-link
      >
      <router-link @click="closeMenu" to="/admin" class="text-navbar" aria-label="Panel administrativo"
        >Admin</router-link
      >
      
    </div>
    <div class="hamburger" @click="toggleMenu">☰</div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      menuOpen: false,
    };
  },
  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
    closeMenu() {
      this.menuOpen = false;
    },
  },
};
</script>

<style>
/* ✅ NUEVO: Espaciado global para navbar sticky */
html {
  scroll-padding-top: 80px;
}

.top-wrapper {
  background: linear-gradient(90deg, #d06e12, #d06e12);
  color: white;
  text-align: center;
  padding: 10px 0;
}

.title-web {
  font-size: 50px;
  font-weight: 50;
  margin: 0;
  font-family: 'Inter', sans-serif;
}

.navbar-area {
  @apply flex items-center justify-between sticky top-0 z-[1000] shadow-lg px-8 h-[70px];
  background: linear-gradient(90deg, #d06e12, #d06e12);
}

/* LOGO */
.nav-logo img.logo {
  height: 45px;
  width: auto;
  border-radius: 6px;
}

/* LINKS DESKTOP */
.link-style {
  @apply flex items-center gap-6;
}

.text-navbar {
  @apply text-white no-underline text-[0.95rem] relative transition duration-300;
}

/* Línea animada hover */
.text-navbar::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 0;
  width: 0%;
  height: 2px;
  background: white;
  transition: 0.3s ease;
}

.text-navbar:hover::after {
  width: 100%;
}

/* Ruta activa automática de Vue */
.router-link-active {
  font-weight: 600;
}

.router-link-active::after {
  width: 100%;
}

/* HAMBURGER */
.hamburger {
  @apply hidden text-[26px] text-white cursor-pointer;
}

/* MOBILE */
@media (max-width: 900px) {
  .link-style {
    @apply absolute top-[70px] left-0 w-full flex-col py-6 gap-5 hidden;
    background: linear-gradient(180deg, #d06e12, #d06e12);
    animation: fadeIn 0.3s ease;
  }

  .link-style.show-menu {
    @apply flex;
  }

  .hamburger {
    @apply block;
  }

  .text-navbar {
    @apply text-center py-[10px];
  }

  .text-navbar::after {
    display: none;
  }

  .router-link-active::after {
    width: 0;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
