<template>
  <div class="create-container">
    <el-steps :active="curIdx" align-center>
      <el-step title="Hive information" />
      <el-step title="Create a hive storage" />
      <el-step title="Deploy hive contract" />
    </el-steps>
    <div>
      <component
        :is="curCpm"
        @next="handleNext"
        :hiveName="hiveName"
        :storageName="storageName"
      ></component>
    </div>
  </div>
</template>

<script setup lang="ts">
import stepOne from '@/components/step-one.vue'
import stepTwo from '@/components/step-two.vue'
import stepThree from '@/components/step-three.vue'
import { computed, ref } from 'vue'
const curIdx = ref(1)

const curCpm = computed(() => {
  if (curIdx.value == 1) return stepOne
  if (curIdx.value == 2) return stepTwo
  return stepThree
})
const hiveName = ref('')
const storageName = ref('')
const handleNext = ({ step, name }: { step: number; name?: string }) => {
  if (step == 1) {
    hiveName.value = name!
  } else if (step == 2) {
    storageName.value = name!
  }
  curIdx.value += 1
}
</script>

<style lang="scss">
.el-step__icon.is-text {
  color: #000;
  border: 8px solid #fefbe8;
  background: #f9cc45;
  box-sizing: content-box;
}

.el-step__line-inner {
  border-color: #f9cc45;
}
.el-step.is-horizontal .el-step__line {
  top: 19px;
}

.el-step__title.is-finish {
  color: #f9cc45;
  font-weight: bold;
}
.el-step__title.is-process {
  color: #0f172a;
  font-weight: bold;
}
.el-step__title.is-wait {
  color: #0f172a;
  font-weight: bold;
}
</style>

<style lang="scss" scoped>
.create-container {
  width: 100%;
  margin: 24px auto 0;
}
</style>
