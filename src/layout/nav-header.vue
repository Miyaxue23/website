<template>
  <div class="nav-header-container al-c space-btw">
    <div class="al-c">
      <div class="al-c">
        <img src="../assets/img/logo.svg" width="48" alt="" />
        <img class="ml-2" src="../assets/img/hiveText.svg" width="64" alt="" />
      </div>
      <div class="links al-c">
        <div class="link" :class="{ actived: route.path == '/' }" @click="router.push('/')">
          Home
        </div>
        <div
          class="link"
          :class="{ actived: route.path == '/create' }"
          @click="router.push('/create')"
        >
          Create
        </div>
      </div>
    </div>
    <wallet-connect></wallet-connect>

    <el-dialog v-model="showConnect" class="login-platform" align-center :show-close="false">
      <template #header>
        <div class="login-platform-header">
          <img src="@/assets/img/login-dialog.png" width="170" alt="" />
          <div class="fw-b fz-20 my-5 header ta-c">
            <span> Connect Your Wallet </span>
            <div class="close-btn al-c f-center cursor-p" @click="showConnect = false">
              <img src="@/assets/img/close.svg" width="24" alt="" />
            </div>
          </div>
        </div>
      </template>
      <template v-for="item in walletPlatform" :key="item.name">
        <div @click="handleConnect" class="al-c plateform py-3 f-center cursor-p">
          <img width="32" :src="item.img" alt="" />
          <span class="ml-3 fz-16 fw-b">
            {{ item.name }}
          </span>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import MetamaskIcon from '@/assets/img/metamask.png'
import walletConnect from '../components/wallet-connect.vue'
import { ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import emitBus from '@/utils/mitt'
import store from '@/store'
import { ElMessage } from 'element-plus'
const route = useRoute()
const router = useRouter()

const showConnect = ref(false)
const walletPlatform = reactive([{ name: 'MetaMask', img: MetamaskIcon }])
emitBus.on('onShowConnect', () => {
  showConnect.value = true
})

const handleConnect = async () => {
  if (!window.ethereum) return window.open('https://metamask.io/')
  try {
    await store.dispatch('getAccount')
    showConnect.value = false
  } catch (error: any) {
    ElMessage({
      type: 'error',
      message: error.message
    })
  }
}
</script>

<style scoped lang="scss">
.nav-header-container {
  width: 100%;
  height: 64px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  padding: 8px 24px;
  box-sizing: border-box;
  .links {
    margin-left: 64px;
    .link {
      position: relative;
      padding: 16px;
      font-size: 20px;
      color: #0f172a;
      font-weight: bold;
      font-family: 'Inter';
      cursor: pointer;
    }

    .link.actived {
      position: relative;
      color: #f9cc45;
    }
    .link.actived::after {
      display: block;
      content: '';
      position: absolute;
      left: 50%;
      bottom: 0;
      transform: translateX(-50%);
      width: 24px;
      height: 4px;
      background: #f9cc45;
    }
  }

  .wallet-connect-container {
    border-radius: 8px;
    background: #f9cc45;
    padding: 8px 16px;
  }
}

.account-menu {
  width: 240px;
  border-radius: 8px;

  .nav-menus-item {
    margin: 8px 0;
    padding: 8px;
    border-bottom: 1px solid #d0d5dd;
    cursor: pointer;
  }
  .nav-menus-item:last-of-type {
    border: none;
  }
}

:deep .login-platform {
  width: 528px;
  border-radius: 12px;
  .login-platform-header {
    position: relative;
    .header {
      position: relative;
    }
    .close-btn {
      position: absolute;
      right: 0;
      top: -17px;
      width: 56px;
      height: 56px;
      border: 2px solid rgba(140, 140, 161, 0.25);
      border-radius: 50%;
    }
    > img {
      position: absolute;
      left: 50%;
      top: -130px;
      transform: translateX(-50%);
    }
  }
}
.plateform {
  background: rgba(140, 140, 161, 0.05);
  border-radius: 8px;
}
</style>
