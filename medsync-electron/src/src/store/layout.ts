import { defineStore } from 'pinia'

interface State {
  hideConfigButton: Boolean,
  isPinned: Boolean,
  showConfig: Boolean,
  sidebarType: String,
  isRTL: Boolean,
  mcolor: String,
  darkMode: Boolean,
  isNavFixed: Boolean,
  isAbsolute: Boolean,
  showNavs: Boolean,
  showSidenav: Boolean,
  showNavbar: Boolean,
  showFooter: Boolean,
  showMain: Boolean,
  layout: String
}

export const useLayoutStore = defineStore('layout', {
  state: (): State => ({
    hideConfigButton: false,
    isPinned: true,
    showConfig: false,
    sidebarType: "bg-white",
    isRTL: false,
    mcolor: "",
    darkMode: false,
    isNavFixed: false,
    isAbsolute: false,
    showNavs: true,
    showSidenav: true,
    showNavbar: true,
    showFooter: true,
    showMain: true,
    layout: "default"
  }),
  actions: {
    toggleConfigurator() {
      this.showConfig = !this.showConfig;
    },
    navbarMinimize() {
      const sidenav_show = document.querySelector(".g-sidenav-show");

      if (sidenav_show?.classList.contains("g-sidenav-hidden")) {
        sidenav_show.classList.remove("g-sidenav-hidden");
        sidenav_show.classList.add("g-sidenav-pinned");
        this.isPinned = true;
      } else {
        sidenav_show?.classList.add("g-sidenav-hidden");
        sidenav_show?.classList.remove("g-sidenav-pinned");
        this.isPinned = false;
      }
    },
    navbarFixed() {
      if (this.isNavFixed === false) {
        this.isNavFixed = true;
      } else {
        this.isNavFixed = false;
      }
    },
    toggleSidebarColor(payload:any) {
      this.sidebarType = payload
    }
  }

})
