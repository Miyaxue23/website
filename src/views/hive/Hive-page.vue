<template>
  <div class="my-hive-container mt-6">
    <div class="fz-20 fw-b mb-8">My Hive</div>
    <div class="al-c mb-4">
      <div class="tabs">
        <div class="tab" :class="curIdx == 1 ? 'actived' : ''" @click="curIdx = 1">Created</div>
        <div class="tab" :class="curIdx == 2 ? 'actived' : ''" @click="curIdx = 2">Holder</div>
      </div>
    </div>
    <component :is="curCpm"></component>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import createTable from './create-table.vue'
import holderTable from './holder-table.vue'
const curIdx = ref(1)
const curCpm = computed(() => {
  if (curIdx.value == 1) {
    return createTable
  }
  return holderTable
})
</script>

<style scoped lang="scss">
.my-hive-container {
  width: 100%;
  padding: 0 40px;
  box-sizing: border-box;
  .tabs {
    margin: 0 auto;
    display: inline-flex;
    padding: 8px;
    border-radius: 8px;
    background: #f1f5f9;
    .tab {
      width: 208px;
      padding: 8px 0;
      font-size: 14px;
      text-align: center;
      border-radius: 4px;
      font-weight: bold;
      background: transparent;
      color: #667085;
      cursor: pointer;
    }
    .tab.actived {
      color: #0f172a;
      background: #f9cc45;
    }
  }
}
</style>
