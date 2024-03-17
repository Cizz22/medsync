<template>
  <div v-show="layoutStore.layout === 'default'" class="min-height-300 position-absolute w-100"
    :class="`${layoutStore.darkMode ? 'bg-transparent' : 'bg-success'}`" />
  <aside class="my-3 overflow-auto border-0 sidenav navbar navbar-vertical navbar-expand-xs border-radius-xl" :class="`${layoutStore.isRTL
      ? 'me-3 rotate-caret fixed-end'
      : 'fixed-start ms-3'
    } 
      ${layoutStore.layout === 'landing'
      ? 'bg-transparent shadow-none'
      : ' '
    } ${layoutStore.sidebarType}`" id="sidenav-main">
    <div class="sidenav-header">
      <i class="top-0 p-3 cursor-pointer fas fa-times text-secondary opacity-5 position-absolute end-0 d-none d-xl-none"
        aria-hidden="true" id="iconSidenav"></i>
      <router-link class="m-0 navbar-brand" to="/">
        <img :src="layoutStore.darkMode ||
            layoutStore.sidebarType === 'bg-default'
            ? logoWhite
            : logo
          " class="navbar-brand-img h-100" alt="main_logo" />
        <span class="ms-2 font-weight-bold me-2">Argon Dashboard 2</span>
      </router-link>
    </div>
    <hr class="mt-0 horizontal dark" />
    <sidenav-list :cardBg="custom_class" />
  </aside>
</template>

<script setup>
import SidenavList from "./SidenavList.vue";
import logo from "../../assets/img/logo-ct-dark.png";
import logoWhite from "../../assets/img/logo-ct.png";
import { useLayoutStore } from "../../store/layout";


const layoutStore = useLayoutStore()

const props = defineProps(["custom_class", "layout"])

defineExpose({
  logo,
  logoWhite
})

</script>