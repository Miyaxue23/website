<template>
  <div class="step-three-container mt-6">
    <div class="my-6 fz-14 step-three-title ta-c">
      The final step is to deploy the space contract to opBNB, where all participant records will be
      stored on-chain.
    </div>
    <div class="step-three-form">
      <div class="mt-2 mb-1">Hive name</div>
      <input type="text" :value="hiveName" disabled placeholder="" />
      <div class="mt-2 mb-1">Storage name</div>
      <input type="text" :value="storageName" disabled placeholder="" />

      <div class="footer al-c f-center mt-10">
        <div class="al-c next-btn cursor-p" :class="loading ? 'disabled' : ''" @click="handleNext">
          <div class="loader" v-if="loading"></div>
          <div class="al-c" v-else>
            <img src="../assets/img/deploy.svg" width="24" alt="" />
            <span class="ml-1 fw-b fz-16">Deploy</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Hive__factory } from '@hivehoney/hive'
import { ElMessage } from 'element-plus'
import { ethers } from 'ethers'
import { computed, ref } from 'vue'
import { useStore } from '@/store'
import request from '@/request'
import router from '@/router'
const store = useStore()
const emits = defineEmits(['next'])
const props = defineProps<{
  hiveName: string
  storageName: string
}>()

const loading = ref(false)

const contractName = computed(() => {
  return props.storageName + '::' + props.hiveName
})

const hiveAddr = import.meta.env.VITE_HIVE_CONTRACT_ADDR

const postInfo = async () => {
  try {
    await request.post('/hives', {
      hiveStorage: props.storageName,
      twitter: '',
      discord: '',
      telegram: ''
    })
  } catch (error) {
    console.log(error)
  }
}
const deployContract = async (contractName: string) => {
  await store.dispatch('switchNetwork', import.meta.env.VITE_BSC_CHAIN_ID)
  const provider = new ethers.BrowserProvider(window.ethereum)
  const signer = await provider.getSigner()
  const Hive = Hive__factory.connect(hiveAddr, signer)
  const tx = await Hive.buyShares(contractName, 1)
  await tx.wait()
}
const handleNext = async () => {
  if (loading.value) return
  loading.value = true
  try {
    await postInfo()
    await deployContract(contractName.value)
    ElMessage({
      type: 'success',
      message: 'deploy successfully!'
    })
    emits('next', { step: 3, name: contractName.value })
    router.push('/hive')
  } catch (error: any) {
    console.log(error)

    ElMessage({
      type: 'error',
      message: error.message
    })
  }
  loading.value = false
}
</script>

<style scoped lang="scss">
input {
  width: 100%;
  border-radius: 8px;
  border: 1px solid #d0d5dd;
  background: #fff;
  outline: none;
  padding: 8px;
  font-size: 14px;
  line-height: 20px;
  color: #667085;
  transition: all 0.2s ease-in;
}
input:focus {
  border-color: #f9cc45;
}
input:disabled {
  background: #f9fafb;
}
.step-three-container {
  .step-three-title {
    color: #667085;
  }
  .step-three-form {
    width: 480px;
    margin: 0 auto;
  }
  .next-btn {
    border-radius: 8px;
    background: #f9cc45;
    padding: 8px 80px;
  }
  .next-btn.disabled {
    cursor: not-allowed;
  }
}
.loader {
  border: 2px solid gray;
  border-left-color: transparent;
  border-radius: 50%;
}

.loader {
  border: 2px solid gray;
  border-left-color: transparent;
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
