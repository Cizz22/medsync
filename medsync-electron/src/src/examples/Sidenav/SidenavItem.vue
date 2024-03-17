<template>
  <router-link :to="url" class="nav-link" v-bind="$attrs">
    <div class="icon icon-shape icon-sm text-center d-flex align-items-center justify-content-center">
      <slot name="icon"></slot>
    </div>
    <span class="nav-link-text" :class="layoutStore.isRTL ? ' me-1' : 'ms-1'">{{ navText }}</span>
  </router-link>
</template>

<script setup>
import { useLayoutStore } from '../../store/layout';

const layoutStore = useLayoutStore()

const props = defineProps({
  url: {
    type: String,
    require: true,
  },
  navText: {
    type: String,
    required: true
  }
})

</script>