import { createStore, Store, useStore as useVuexStore } from 'vuex'
import { chainInfo } from './chainList'
interface IRootState {
  address: string
}
interface IRootStateWithModule {}
type IStoreType = IRootState & IRootStateWithModule
const store = createStore<IRootState>({
  state: {
    address: localStorage.address
  },
  mutations: {
    SET_ADDRESS(state, address) {
      state.address = address
    },
    disConnect() {
      localStorage.address = ''
      location.reload()
    }
  },
  actions: {
    async getAccount({ commit }) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      commit('SET_ADDRESS', accounts[0])
      localStorage.address = accounts[0]
      location.reload()
    },

    async switchNetwork(context, chainId: number) {
      try {
        const id = '0x' + Number(chainId).toString(16)
        console.log(id)
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: id }]
        })
      } catch (error: any) {
        console.log(error)
        if (error.code == 4902 || error.data?.originalError.code == 4902) {
          console.log('switch error 2', error)
          await store.dispatch('addChain', chainId)
        } else {
          throw error
        }
      }
    },
    async addChain(context, chainId: number) {
      try {
        const param = (chainInfo as any)[chainId]
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [param]
        })
      } catch (error) {
        console.log('add chain err', error)
      }
    }
  }
})

export function useStore(): Store<IStoreType> {
  return useVuexStore()
}
export default store
