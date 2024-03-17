<template>
  <div class="collapse navbar-collapse w-auto h-auto h-100" id="sidenav-collapse-main">
    <ul class="navbar-nav">
      <li class="nav-item">
        <sidenav-item url="/dashboard" :class="getRoute() === 'dashboard' ? 'active' : ''"
          :navText="layoutStore.isRTL ? 'لوحة القيادة' : 'Dashboard'">
          <template v-slot:icon>
            <i class="ni ni-tv-2 text-primary text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>
      <li class="nav-item">
        <sidenav-item url="/tables" :class="getRoute() === 'tables' ? 'active' : ''"
          :navText="layoutStore.isRTL ? 'الجداول' : 'Tables'">
          <template v-slot:icon>
            <i class="ni ni-calendar-grid-58 text-warning text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>
      <li class="nav-item">
        <sidenav-item url="/billing" :class="getRoute() === 'billing' ? 'active' : ''"
          :navText="layoutStore.isRTL ? 'الفواتیر' : 'Billing'">
          <template v-slot:icon>
            <i class="ni ni-credit-card text-success text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>
      <li class="nav-item">
        <sidenav-item url="/virtual-reality" :class="getRoute() === 'virtual-reality' ? 'active' : ''" :navText="layoutStore.isRTL ? 'الواقع الافتراضي' : 'Virtual Reality'
          ">
          <template v-slot:icon>
            <i class="ni ni-app text-info text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>
      <li class="nav-item">
        <sidenav-item url="/rtl-page" :class="getRoute() === 'rtl-page' ? 'active' : ''" navText="RTL">
          <template v-slot:icon>
            <i class="ni ni-world-2 text-danger text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>
      <li class="mt-3 nav-item">
        <h6 v-if="layoutStore.isRTL" class="text-xs ps-4 text-uppercase font-weight-bolder opacity-6"
          :class="layoutStore.isRTL ? 'me-4' : 'ms-2'">
          صفحات المرافق
        </h6>
        <h6 v-else class="text-xs ps-4 text-uppercase font-weight-bolder opacity-6"
          :class="layoutStore.isRTL ? 'me-4' : 'ms-2'">
          ACCOUNT PAGES
        </h6>
      </li>
      <li class="nav-item">
        <sidenav-item url="/profile" :class="getRoute() === 'profile' ? 'active' : ''"
          :navText="layoutStore.isRTL ? 'حساب تعريفي' : 'Profile'">
          <template v-slot:icon>
            <i class="ni ni-single-02 text-dark text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>
      <li class="nav-item">
        <sidenav-item url="/signin" :class="getRoute() === 'signin' ? 'active' : ''"
          :navText="layoutStore.isRTL ? 'تسجيل الدخول' : 'Sign In'">
          <template v-slot:icon>
            <i class="ni ni-single-copy-04 text-danger text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>
      <li class="nav-item">
        <sidenav-item url="/signup" :class="getRoute() === 'signup' ? 'active' : ''"
          :navText="layoutStore.isRTL ? 'اشتراك' : 'Sign Up'">
          <template v-slot:icon>
            <i class="ni ni-collection text-info text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>
    </ul>
  </div>
  <div class="pt-3 mx-3 mt-3 sidenav-footer">
    <sidenav-card :class="cardBg" textPrimary="Need Help?" textSecondary="Please check our docs" />
  </div>
</template>

<script setup>
import SidenavItem from "./SidenavItem.vue";
import SidenavCard from "./SidenavCard.vue";
import { useLayoutStore } from "../../store/layout";
import { useRoute } from "vue-router";

const layoutStore = useLayoutStore()
const route = useRoute()

const props = defineProps(
  {
    cardBg: String
  })

const title = "ETL Dashboard"
const controls = "dashboardsExamples"
const isActive = "active"


function getRoute() {
  const routeArr = route.path.split("/");
  return routeArr[1];
}

defineExpose({
  title,
  controls,
  isActive
})

</script >

