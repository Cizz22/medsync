<template>
  <div class="form-group">
    <div :class="hasIcon(icon)">
      <span v-if="iconDir === 'left'" class="input-group-text">
        <i :class="getIcon(icon)"></i>
      </span>
      <input :type="type" class="form-control" :class="getClasses(size, valid)" :name="name" :id="id" :value="value"
        :placeholder="placeholder" :isRequired="isRequired" />
      <span v-if="iconDir === 'right'" class="input-group-text">
        <i :class="getIcon(icon)"></i>
      </span>
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  size: {
    type: String,
    default: "default",
  },
  valid: {
    type: Boolean,
    default: false,
  },
  icon: String,
  iconDir: String,
  name: String,
  id: String,
  value: String,
  placeholder: String,
  type: String,
  isRequired: Boolean,
})

const getClasses = (size, valid) => {
  let sizeValue, isValidValue;

  sizeValue = size ? `form-control-${size}` : null;

  isValidValue = valid ? `${valid}` : "invalid";

  return `${sizeValue} ${isValidValue}`;
}
const getIcon = (icon) => (icon ? icon : null)
const hasIcon = (icon) => (icon ? "input-group" : null)


</script>
