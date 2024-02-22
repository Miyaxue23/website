<template>
  <div
    class="button-container"
    :class="{
      loading: loading,
      disabled: disabled
    }"
    @click="handleClick"
  >
    <div class="loader" v-if="loading"></div>
    <slot v-else></slot>
  </div>
</template>

<script setup lang="ts">
const emits = defineEmits(['click'])
const props = withDefaults(
  defineProps<{
    loading: boolean
    disabled?: boolean
  }>(),
  {
    loading: false,
    disabled: false
  }
)

const handleClick = () => {
  if (!props.loading && !props.disabled) {
    emits('click')
  }
}
</script>

<style scoped lang="scss">
.button-container {
  border-radius: 8px;
  background: #f9cc45;
  padding: 8px 80px;
  cursor: pointer;
}

.button-container.loading {
  cursor: not-allowed;
}
.button-container.disabled {
  background: #d0d5dd;
  cursor: not-allowed;
}

.loader {
  border: 2px solid #0f172a;
  border-left-color: transparent;
  border-radius: 50%;

  width: 18px;
  height: 18px;
  animation: spin89345 1s linear infinite;
}

@keyframes spin89345 {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
