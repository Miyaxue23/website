<template>
  <div class="step-one-container mt-6">
    <div class="step-one-form">
      <div class="basic mb-6">
        <div class="fw-b">Basic Info</div>
        <div class="mt-2 mb-1">
          <span>Hive name</span>
          <span style="color: red">*</span>
        </div>
        <div class="input-content">
          <input
            type="text"
            :class="inputError ? 'error' : ''"
            v-model="form.hiveName"
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
      <!-- <div class="social">
        <div class="fw-b">Social links</div>
        <div class="mt-2 mb-1">Discord</div>
        <input type="text" v-model="form.discord" placeholder="https://" />
        <div class="mt-2 mb-1">Telegram</div>
        <input type="text" v-model="form.telegram" placeholder="https://" />
        <div class="mt-2 mb-1">X</div>
        <input type="text" v-model="form.x" placeholder="https://" />
      </div> -->

      <div class="footer al-c f-center mt-10">
        <div class="al-c next-btn cursor-p" @click="handleNext">
          <span class="fw-b fz-16">Next</span>
          <img src="../assets/img/right-arrow2-active.svg" width="24" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import emitBus from '@/utils/mitt'
const inputError = ref(false)
const emits = defineEmits(['next'])
const form = reactive({
  hiveName: '',
  discord: '',
  telegram: '',
  x: ''
})
const handleNext = async () => {
  try {
    if (!localStorage.address) {
      emitBus.emit('onShowConnect')
    } else {
      if (/^[0-9a-z\-]{3,50}$/.test(form.hiveName)) {
        inputError.value = false
        emits('next', { step: 1, name: form.hiveName })
      } else {
        inputError.value = true
      }
    }
  } catch (error) {
    console.log(error)
  }
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
input.error {
  border-color: red !important;
}
.step-one-container {
  .step-one-form {
    width: 480px;
    margin: 0 auto;
  }
  .next-btn {
    border-radius: 8px;
    background: #f9cc45;
    padding: 8px 80px;
  }

  .next-btn.disabled {
    background: #d0d5dd;
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
</style>
