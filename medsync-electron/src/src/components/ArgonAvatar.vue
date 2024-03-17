<template>
  <div class="avatar" :class="getSize(size)">
    <img :src="img" :alt="alt" :class="[getClasses(shadow, circular, borderRadius)]" />
  </div>
</template>

<script setup>
const props = defineProps({
  img: String,
  alt: String,
  size: String,
  shadow: String,
  borderRadius: String,
  circular: Boolean,
})

const getSize = (size) => (size ? `avatar-${size}` : null)

const getClasses = (shadow, circular, borderRadius) => {
  let shadowValue, circularValue, borderRadiusValue;

  if (shadow) {
    shadowValue = shadow === "regular" ? "shadow" : `shadow-${shadow}`;
  } else {
    shadowValue = null;
  }

  circularValue = circular ? "rounded-circle" : null;

  borderRadiusValue = borderRadius ? `border-radius-${borderRadius}` : null;

  return `${shadowValue} ${circularValue} ${borderRadiusValue}`;
}
</script>

