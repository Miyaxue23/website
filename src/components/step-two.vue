<template>
  <div class="step-two-container mt-6">
    <div class="my-6 fz-14 step-two-title ta-c">
      Create a Hive space on BNB Greenfield, where everyone can collaborate to build resources based
      on the Hive theme you set.
    </div>
    <div class="step-two-form">
      <div class="basic mb-6">
        <div class="mt-2 mb-1">
          <span>Storage name</span>
          <span style="color: red">*</span>
        </div>

        <div class="input-content">
          <input
            type="text"
            v-model="storageName"
            :class="inputError ? 'error' : ''"
            @input="handleInput"
            placeholder="Enter the name of the Hive"
          />
          <el-tooltip class="box-item" effect="dark" placement="bottom">
            <template #content>
              <div class="pa-1">
                <div>Naming rules</div>
                <ul style="padding: 0 10px; margin: 0">
                  <li>Must be between 3 and 50 characters long.</li>
                  <li>Consist only of lowercase letters, numbers, and hyphens (-).</li>
                  <li>Begin and end with a letter or number.</li>
                </ul>
              </div>
            </template>
            <img class="tool-tip" src="../assets/img/help.svg" width="16" />
          </el-tooltip>
          <div class="al-c mt-1" v-show="inputError">
            <img width="12" src="../assets/img/input-error.svg" alt="" />
            <span class="fz-12 ml-1">Name not available</span>
          </div>
        </div>
      </div>

      <div class="social">
        <div class="mt-2 mb-1">Storage provider</div>
        <input type="text" value="4everland | 0x5798...3366" disabled placeholder="https://" />
        <div class="mt-2 mb-1">Payment account</div>
        <input type="text" :value="store.state.address" disabled placeholder="https://" />
        <div class="mt-2 mb-1">Monthly downloat quota</div>
        <input type="text" value="10 GB/Month" disabled placeholder="https://" />

        <div class="fz-14 mt-5">Owner Account balance: {{ displayBalance }} BNB</div>
      </div>

      <div class="footer al-c f-center mt-10">
        <!-- <div class="al-c next-btn cursor-p" :class="loading ? 'disabled' : ''" @click="handleNext">
          <div class="loader" v-if="loading"></div>
          <div class="al-c" v-else>
            <span class="fw-b fz-16">Next</span>
            <img src="../assets/img/right-arrow2-active.svg" width="24" alt="" />
          </div>
        </div> -->

        <h-button :loading="loading" :disabled="disabled" @click="handleNext">
          <div class="al-c">
            <span class="fw-b fz-16">Next</span>
            <img src="../assets/img/right-arrow2-active.svg" width="24" alt="" />
          </div>
        </h-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { getAddress } from 'ethers'
import { createBucket, getAccountBalance } from '@/gnfd-client'
import { useStore } from '@/store'
import { ElMessage } from 'element-plus'
import HButton from './h-button.vue'
const store = useStore()
const emits = defineEmits(['next'])
const storageName = ref('')
const loading = ref(false)
const inputError = ref(false)
const accountBalance = ref(0)

const disabled = computed(() => {
  return inputError.value || accountBalance.value == 0
})
const displayBalance = computed(() => {
  if (accountBalance.value == 0) return '0'
  return accountBalance.value.toFixed(7)
})
const getAccount = async () => {
  try {
    const balance = await getAccountBalance(store.state.address)
    accountBalance.value = Number(balance)
  } catch (error) {
    console.log(error)
  }
}

getAccount()

const handleInput = () => {
  if (/^[0-9a-z\-]{3,50}$/.test(storageName.value)) {
    inputError.value = false
  } else {
    inputError.value = true
  }
}
const handleNext = async () => {
  if (loading.value) return
  loading.value = true
  try {
    await store.dispatch('switchNetwork', import.meta.env.VITE_GREEN_CHAIN_ID)

    if (/^[0-9a-z\-]{3,50}$/.test(storageName.value)) {
      let addrss = getAddress(store.state.address)
      await createBucket(addrss, storageName.value)
      ElMessage({
        message: 'Create Successfully!',
        type: 'success'
      })
      inputError.value = false
      emits('next', { step: 2, name: storageName.value })
    } else {
      inputError.value = true
    }
  } catch (error: any) {
    console.log(error)
    let message = error.message
    if (/user rejected action/.test(error.message)) {
      message = 'user rejected action'
    } else if (/balance not enough/.test(error.message)) {
      message = 'Insufficient payment'
    }
    ElMessage({
      type: 'error',
      message: message
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
input.error {
  border-color: red !important;
}
.step-two-container {
  .step-two-title {
    color: #667085;
  }
  .step-two-form {
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
.input-content {
  position: relative;
  .tool-tip {
    position: absolute;
    top: 12px;
    right: -10px;
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
