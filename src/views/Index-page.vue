<template>
  <div class="hive-home-container">
    <div class="hive-home-content">
      <div class="hive-title mb-4">Because of a favorite a hive， I met a group of people.</div>
      <div class="hive-description">
        A new social model, an innovative co-building model, profitable contributions, and a
        tradable hive.
      </div>
      <div class="al-c mt-8">
        <div class="al-c create-btn" @click="router.push('/create')">
          <img src="../assets/img/create.svg" width="32" alt="" />
          <span class="ml-2 fw-b"> Create A Hive </span>
        </div>
        <div class="al-c demo-btn ml-4" @click="handleDemo">
          <img src="../assets/img/demo.svg" width="32" alt="" />
          <span class="ml-2 fw-b">Demo</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()

const handleDemo = () => {
  window.open('https://honey.4everland.app/#/demo-space/home')
}
</script>

<style scoped lang="scss">
.hive-home-container {
  padding: 0 40px;
  height: calc(100vh - 64px);
  overflow: hidden;
  position: relative;

  .hive-home-content {
    max-width: 700px;
    margin-top: 150px;
    .hive-title {
      font-size: 48px;
      font-weight: 900;
    }
    .hive-description {
      color: #64748b;
      font-family: 'Karla';
      font-size: 20px;
      line-height: 28px; /* 150% */
      letter-spacing: -0.48px;
    }
    .create-btn {
      display: inline-flex;
      padding: 16px 24px;
      box-sizing: border-box;
      border-radius: 8px;
      background: #f9cc45;
      cursor: pointer;
    }
    .demo-btn {
      border-radius: 8px;
      border: 1px solid #f9cc45;
      padding: 16px 24px;
      cursor: pointer;
    }
  }
}
</style>
