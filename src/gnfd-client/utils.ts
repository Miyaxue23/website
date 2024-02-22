import { client, getAllSps } from '@/gnfd-client'
import { GREEN_CHAIN_ID } from '@/gnfd-client/env'
// import { IReturnOffChainAuthKeyPairAndUpload } from "@bnb-chain/greenfield-js-sdk";
export const getOffchainAuthKeys = async (address: string, provider: any) => {
  const storageResStr = localStorage.getItem(address)
  if (storageResStr) {
    const storageRes = JSON.parse(storageResStr)
    if (storageRes.expirationTime < Date.now()) {
      alert('Your auth key has expired, please generate a new one')
      localStorage.removeItem(address)
      return
    }
    return storageRes
  }

  const allSps = await getAllSps()
  const offchainAuthRes = await client.offchainauth.genOffChainAuthKeyPairAndUpload(
    {
      sps: allSps,
      chainId: GREEN_CHAIN_ID,
      expirationMs: 5 * 24 * 60 * 60 * 1000,
      domain: window.location.origin,
      address
    },
    provider
  )
  console.log(1111, offchainAuthRes)
  const { code, body: offChainData } = offchainAuthRes
  if (code !== 0 || !offChainData) {
    throw offchainAuthRes
  }

  localStorage.setItem(address, JSON.stringify(offChainData))
  return offChainData
}
