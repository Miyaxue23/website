<template>
  <div class="layout">
    <navHeader></navHeader>
    <RouterView></RouterView>
    <div class="bg" v-show="route.path == '/'"></div>
  </div>
</template>

<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import navHeader from './nav-header.vue'
const route = useRoute()
</script>

<style lang="scss" scoped>
.layout {
  position: relative;
  margin: 0 auto;
  width: 100%;
  max-width: 1200px;
  height: 100vh;
  overflow: hidden;
}
.bg {
  position: absolute;
  right: -100px;
  top: 0;
  width: 1000px;
  height: 1000px;
  background: url('../assets/img/background.png') no-repeat;
  background-size: 100%;
  z-index: -1;
}
</style>
