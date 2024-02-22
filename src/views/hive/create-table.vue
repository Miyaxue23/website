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
          <th>Contributors</th>
          <!-- <th>Action</th> -->
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in list" class="fz-14 table-content" :key="item.storageName">
          <td>{{ index + 1 }}</td>
          <td class="name" @click="handleOpen(item.storageName)">
            {{ item.hiveName.cutStr(5, 5) }}
          </td>
          <td>{{ item.storageName.cutStr(5, 5) }}</td>
          <td>{{ item.supply }}</td>
          <td>{{ item.own }}</td>
          <td>{{ formatEther(item.price) }} BNB</td>
          <td>{{ formatEther(item.total) }} BNB</td>
          <td>1</td>
          <!-- <td>
            <img class="cursor-p" src="../../assets/img/manager.svg" width="24" alt="" />
          </td> -->
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import request from '@/request'
import { useStore } from '@/store'
import { formatEther } from 'ethers'
const list = ref<any[]>([])
const router = useRouter()
const store = useStore()
const getList = async () => {
  try {
    const { data } = await request.get('/hives/owner/' + store.state.address + '/created')
    list.value = data
  } catch (error) {
    console.log(error)
  }
}
const handleOpen = (storageName: string) => {
  window.open('https://hive-storage.4everland.app/#/' + storageName + '/home')
}
getList()
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
.create-btn {
  color: #f9cc45;
}
</style>
