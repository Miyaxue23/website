<template>
  <div>
    <table
      v-if="list.length"
      style="width: 100%; border-collapse: separate; border-spacing: 0 10px"
      cellSpacing="0"
      cellPadding="0"
    >
      <thead>
        <tr class="fz-14" style="color: '#64748B'">
          <th>#</th>
          <th>Hive Name</th>
          <th>Storage Name</th>
          <th>Honey Supply</th>
          <th>My Honeys</th>
          <th>Price</th>
          <th>Total Value In The Pool</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in list" class="fz-14 table-content" :key="index">
          <td>{{ index + 1 }}</td>
          <td class="name" @click="handleOpen(item.storageName)">
            {{ item.hiveName.cutStr(5, 5) }}
          </td>
          <td>{{ item.storageName.cutStr(5, 5) }}</td>
          <td>{{ item.supply }}</td>
          <td>{{ item.own }}</td>
          <td>{{ formatEther(item.price) }} BNB</td>
          <td>{{ formatEther(item.total) }} BNB</td>
          <td>
            <img
              class="cursor-p"
              @click="handleOpen(item.storageName)"
              src="../../assets/img/right-arrow1.svg"
              width="24"
              alt=""
            />
          </td>
        </tr>
      </tbody>
    </table>

    <div class="al-c h-flex mt-10" v-else>
      <img src="../../assets/img/no-data.png" alt="" />
      <div class="fz-14 mt-2">
        No Hive yet, go
        <span class="create-btn fw-b fz-16 cursor-p" @click="router.push('/create')">Create</span>
        one now！
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import request from '@/request'
import { useStore } from '@/store'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { formatEther } from 'ethers'
const store = useStore()
const router = useRouter()
const list = ref<any[]>([])

const getList = async () => {
  try {
    const { data } = await request.get('/hives/owner/' + store.state.address + '/holds')
    list.value = data
  } catch (error) {
    console.log(error)
  }
}
getList()
const handleOpen = (storageName: string) => {
  window.open('https://hive-storage.4everland.app/#/' + storageName + '/home')
}
</script>

<style scoped lang="scss">
table {
  th,
  td {
    padding: 16px;
    text-align: left;
  }
  .table-content {
    margin-top: 16px;
    .name {
      color: #0175ff;
      cursor: pointer;
    }
  }
  td {
    padding: 16px !important;
    border-top: 1px solid #cbd5e1 !important;
    border-bottom: 1px solid #cbd5e1 !important;
    margin: 10px 0 !important;
  }
  tr td:first-child {
    border-left: 1px solid #cbd5e1 !important;
    border-right: none !important;
    border-radius: 8px 0 0 8px;
  }
  tr td:last-child {
    border-right: 1px solid #cbd5e1 !important;
    border-left: none !important;
    border-radius: 0 8px 8px 0;
  }
}
</style>
