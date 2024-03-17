<!--
=========================================================
* Vue Argon Dashboard 2 - v3.0.0
=========================================================

* Product Page: https://creative-tim.com/product/vue-argon-dashboard
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
-->


<template>
  <div
    v-show="layoutStore.layout === 'landing'"
    class="landing-bg h-100 bg-gradient-primary position-fixed w-100"
  ></div>
  <sidenav
    :custom_class="layoutStore.mcolor"
    :class="[
      layoutStore.isRTL ? 'fixed-end' : 'fixed-start'
    ]"
    v-if="layoutStore.showSidenav"
  />
  <main
    class="main-content position-relative max-height-vh-100 h-100 border-radius-lg"
  >
    <!-- nav -->
    <navbar
      :class="[navClasses]"
      :textWhite="
        layoutStore.isAbsolute ? 'text-white opacity-8' : 'text-white'
      "
      :minNav="layoutStore.navbarMinimize"
      v-if="layoutStore.showNavbar"
    />
    <router-view />
    <app-footer v-show="layoutStore.showFooter" />
    <configurator
      :toggle="layoutStore.toggleConfigurator"
      :class="[
        layoutStore.showConfig ? 'show' : '',
        layoutStore.hideConfigButton ? 'd-none' : ''
      ]"
    />
  </main>
</template>

<script setup>
import Sidenav from "./examples/Sidenav/index.vue";
import Configurator from "./examples/Configurator.vue";
import Navbar from "./examples/Navbars/Navbar.vue";
import AppFooter from "./examples/Footer.vue";
import { useLayoutStore } from "./store/layout";
import { onBeforeMount } from "vue";
import { mapActions } from "pinia";

const layoutStore = useLayoutStore()

function navClasses() {
      return {
        "position-sticky bg-white left-auto top-2 z-index-sticky":
          layoutStore.isNavFixed && !layoutStore.darkMode,
        "position-sticky bg-default left-auto top-2 z-index-sticky":
          layoutStore.isNavFixed && layoutStore.darkMode,
        "position-absolute px-4 mx-0 w-100 z-index-2": layoutStore
          .isAbsolute,
        "px-0 mx-4": !layoutStore.isAbsolute
      };
}


onBeforeMount(() => {
  layoutStore.isTransparent = "bg-transparent";
})

defineExpose({
  navClasses
})

</script>

<!-- <script>
import Sidenav from "./examples/Sidenav/index.vue";
import Configurator from "./examples/Configurator.vue";
import Navbar from "./examples/Navbars/Navbar.vue";
import AppFooter from "./examples/Footer.vue";


import { useLayoutStore } from "./store/layout";

export default {
  name: "App",
  components: {
    Sidenav,
    Configurator,
    Navbar,
    AppFooter
  },
  methods: {
    ...mapMutations(["toggleConfigurator", "navbarMinimize"])
  },
  computed: {
   
  },
  beforeMount() {
    layoutStore.isTransparent = "bg-transparent";
  }
};
</script> -->
