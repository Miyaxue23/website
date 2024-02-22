<template>
  <div>
    <div v-if="!store.state.address" class="wallet-connect al-c cursor-p" @click="getAccount">
      <img src="../assets/img/wallet.svg" alt="" />
      <span class="fw-b"> Connect Wallet</span>
    </div>

    <VDropdown v-else :distance="20">
      <!-- This will be the popover reference (for the events and position) -->
      <button class="wallet-connected al-c cursor-p">
        <avatar :diameter="32" :address="store.state.address"></avatar>
        <span class="fw-b ml-2">{{ transfAddress }}</span>
      </button>
      <!-- This will be the content of the popover -->
      <template #popper>
        <div class="popper-menu">
          <div class="account-menu">
            <div class="account my-6 h-flex al-c">
              <avatar :diameter="64" :address="store.state.address"></avatar>
              <div class="mt-2 fw-b fz-14">
                {{ transfAddress }}
              </div>
            </div>
            <div class="nav-menus">
              <div
                class="nav-menus-item al-c space-btw"
                v-close-popper
                @click="router.push('/hive')"
              >
                <div class="al-c">
                  <img src="../assets/img/live.svg" width="24" />
                  <span class="ml-2">My Live</span>
                </div>
                <img src="../assets/img/right-arrow.svg" width="24" />
              </div>
              <div class="nav-menus-item al-c space-btw" @click="handleDisConnect">
                <div class="al-c">
                  <img src="../assets/img/disconnect.svg" width="24" />
                  <span class="ml-2">Disconnect</span>
                </div>
                <img src="../assets/img/right-arrow.svg" width="24" />
              </div>
            </div>
          </div>
        </div>
      </template>
    </VDropdown>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from '@/store'
import { useRouter } from 'vue-router'
import avatar from './avatar.vue'
import emitBus from '@/utils/mitt'
const router = useRouter()
const store = useStore()
const getAccount = async () => {
  emitBus.emit('onShowConnect')
}
const transfAddress = computed(() => {
  const addressS = store.state.address
  if (addressS) {
    return addressS!.slice(0, 5) + '...' + addressS!.slice(-5)
  }
  return ''
})

const handleDisConnect = () => {
  store.commit('disConnect')
}

if (window.ethereum) {
  window.ethereum.on('accountsChanged', (accounts: string[]) => {
    if (accounts.length) {
      // getAccount()
      store.dispatch('getAccount')
    } else {
      store.commit('disConnect')
    }
  })
}
</script>

<style lang="scss" scoped>
.wallet-connect {
  border-radius: 8px;
  background: #f9cc45;
  padding: 8px 16px;
}
.wallet-connected {
  font-family: 'Inter';
  border: none;
  font-size: 16px;
  border-radius: 8px;
  background: #fffaeb;
  padding: 8px 16px;
  border: 1px solid #f9cc45;
}

.popper-menu {
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
}
</style>
