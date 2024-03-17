<template>
  <div class="form-check form-switch">
    <input class="form-check-input" :class="inputClass" type="checkbox" :name="name" :id="id" :checked="checked" />
    <label class="form-check-label" :class="labelClass" :for="id">
      <slot />
    </label>
  </div>
</template>


<script setup>
const props = defineProps({
  name: String,
  id: String,
  checked: String,
  labelClass: String,
  inputClass: String,
})
</script>