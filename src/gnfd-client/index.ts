import { GREEN_CHAIN_ID, GRPC_URL } from './env'
import { Client, PermissionTypes } from '@bnb-chain/greenfield-js-sdk'
// import { ObjectMeta } from '@bnb-chain/greenfield-js-sdk/dist/esm/types/sp/Common'

import { MsgGroupMember } from '@bnb-chain/greenfield-cosmos-types/greenfield/storage/tx'
import { getOffchainAuthKeys } from './utils'
import { ReedSolomon } from '@bnb-chain/reed-solomon'
import { formatEther, parseEther } from 'ethers'
export const client = Client.create(GRPC_URL as string, GREEN_CHAIN_ID.toString(), {
  zkCryptoUrl: 'https://unpkg.com/@bnb-chain/greenfield-zk-crypto@0.0.3/dist/node/zk-crypto.wasm'
})
// export const getSps = async () => {
//   const sps = await client.sp.getStorageProviders()
//   console.log(sps, 'sps')

//   console.log(import.meta.env.VITE_PROVIDER_STORAGE_ADDR.toLocaleUpperCase())
//   const finalSps = (sps ?? []).filter(
//     (v) =>
//       v.operatorAddress.toLocaleUpperCase() ==
//       import.meta.env.VITE_PROVIDER_STORAGE_ADDR.toLocaleUpperCase()
//   )
//   return finalSps
// }

export const getSps = async () => {
  const sps = await client.sp.getStorageProviders()
  const finalSps = (sps ?? []).filter((v) => v.endpoint == 'https://gnfd-sp.4everland.org')
  return finalSps
}

export const getAllSps = async () => {
  const sps = await getSps()
  return sps.map((sp) => {
    return {
      address: sp.operatorAddress,
      endpoint: sp.endpoint,
      name: sp.description?.moniker
    }
  })
}

export const selectSp = async () => {
  const finalSps = await getSps()
  const selectIndex = Math.floor(Math.random() * finalSps.length)
  const secondarySpAddresses = [
    ...finalSps.slice(0, selectIndex),
    ...finalSps.slice(selectIndex + 1)
  ].map((item) => item.operatorAddress)

  console.log(finalSps[selectIndex], finalSps, 'idddddddd')
  const selectSpInfo = {
    id: finalSps[selectIndex].id,
    endpoint: finalSps[selectIndex].endpoint,
    primarySpAddress: finalSps[selectIndex]?.operatorAddress,
    sealAddress: finalSps[selectIndex].sealAddress,
    secondarySpAddresses
  }

  return selectSpInfo
}

export const listObject = async (bucketName: string) => {
  try {
    const spInfo = await selectSp()
    const { body } = await client.object.listObjects({
      bucketName,
      endpoint: spInfo.endpoint
    })
    let objects: any[] = []
    if (body) {
      objects = body.GfSpListObjectsByBucketNameResponse.Objects
    }
    console.log(objects)
  } catch (error) {
    console.log(error)
  }
}

export const getAccountBalance = async (address: string) => {
  const data = await client.account.getAccountBalance({ address, denom: 'BNB' })
  return formatEther(data.balance?.amount!)
}
export const createTx = async (file: File, bucketName: string, address: string, connector: any) => {
  if (!address || !file) return
  const provider = await connector?.getProvider()
  const offChainData = await getOffchainAuthKeys(address, provider)
  if (!offChainData) {
    alert('No offchain, please create offchain pairs first')
    return
  }
  const rs = new ReedSolomon()
  const fileBytes = await file.arrayBuffer()
  const expectCheckSums = rs.encode(new Uint8Array(fileBytes))
  const createObjectTx = await client.object.createObject(
    {
      bucketName: bucketName,
      objectName: file.name,
      creator: address,
      visibility: 'VISIBILITY_TYPE_PUBLIC_READ',
      fileType: file.type,
      redundancyType: 'REDUNDANCY_EC_TYPE',
      contentLength: fileBytes.byteLength,
      expectCheckSums: expectCheckSums
    },
    {
      type: 'EDDSA',
      domain: window.location.origin,
      seed: offChainData.seedString,
      address
    }
  )

  const simulateInfo = await createObjectTx.simulate({
    denom: 'BNB'
  })

  console.log('simulateInfo', simulateInfo)

  const res = await createObjectTx.broadcast({
    denom: 'BNB',
    gasLimit: Number(simulateInfo?.gasLimit),
    gasPrice: simulateInfo?.gasPrice || '5000000000',
    payer: address,
    granter: ''
  })
  if (res.code === 0) {
    console.log('create object success')
    return res.transactionHash
  }
}

export const uploadObject = async (
  file: File,
  bucketName: string,
  address: string,
  connector: any
) => {
  const txnHash = await createTx(file, bucketName, address, connector)
  if (!txnHash) return
  const provider = await connector?.getProvider()
  const offChainData = await getOffchainAuthKeys(address, provider)

  const spInfo = await selectSp()
  console.log('spInfo', spInfo.endpoint)
  if (!offChainData) {
    alert('No offchain, please create offchain pairs first')
    return
  }
  const objectName = file.name
  const uploadRes = await client.object.uploadObject(
    {
      bucketName: bucketName,
      objectName: file.name,
      body: file,
      txnHash
    },
    {
      type: 'EDDSA',
      domain: window.location.origin,
      seed: offChainData.seedString,
      address
    }
  )
  if (uploadRes.code === 0) {
    // alert("success");
    return spInfo.endpoint + '/view/' + bucketName + '/' + objectName
  }
}

export const createBucket = async (address: string, bucketName: string) => {
  if (!address) return
  const spInfo = await selectSp()

  console.log('spInfo', spInfo)
  // const provider = await connector?.getProvider()
  const offChainData = await getOffchainAuthKeys(address, window.ethereum)
  if (!offChainData) {
    throw new Error('No offchain, please create offchain pairs first')
  }
  const createBucketTx = await client.bucket.createBucket(
    {
      bucketName: bucketName,
      creator: address,
      visibility: 'VISIBILITY_TYPE_PUBLIC_READ',
      chargedReadQuota: '10737418240',
      spInfo: {
        primarySpAddress: spInfo.primarySpAddress
      },
      paymentAddress: address
    },
    {
      type: 'EDDSA',
      domain: window.location.origin,
      seed: offChainData.seedString,
      address
    }
  )

  const simulateInfo = await createBucketTx.simulate({
    denom: 'BNB'
  })

  console.log('simulateInfo', simulateInfo)

  const res = await createBucketTx.broadcast({
    denom: 'BNB',
    gasLimit: Number(simulateInfo?.gasLimit),
    gasPrice: simulateInfo?.gasPrice || '5000000000',
    payer: address,
    granter: ''
  })

  if (res.code === 0) {
    // alert("success");
    return true
  }
  return false
}

export const createGroup = async (
  creator: string,
  /** group_name defines the name of the group. it's not globally unique. */
  groupName: string,
  /** extra defines extra info for the group */
  extra: string
) => {
  const createGroupTx = await client.group.createGroup({ creator, groupName, extra })

  const simulateInfo = await createGroupTx.simulate({
    denom: 'BNB'
  })

  console.log('simulateInfo', simulateInfo)
  const res = await createGroupTx.broadcast({
    denom: 'BNB',
    gasLimit: Number(simulateInfo?.gasLimit),
    gasPrice: simulateInfo?.gasPrice || '5000000000',
    payer: creator,
    granter: ''
  })
  if (res.code === 0) {
    console.log('create group success')
    return res.transactionHash
  }
}

export const putGroupPolicy = async (owner: string, operator: string, groupName: string) => {
  const statement: PermissionTypes.Statement = {
    effect: PermissionTypes.Effect.EFFECT_ALLOW,
    actions: [
      PermissionTypes.ActionType.ACTION_CREATE_OBJECT,
      PermissionTypes.ActionType.ACTION_DELETE_OBJECT
    ],
    resources: []
  }
  const putGroupPolicyTx = await client.group.putGroupPolicy(
    owner, // owner
    groupName,
    {
      operator, // address
      statements: [statement],
      principal: {
        type: PermissionTypes.PrincipalType.PRINCIPAL_TYPE_GNFD_ACCOUNT,
        value: '0x0000000000000000000000000000000000000001'
      }
    }
  )

  const simulateInfo = await putGroupPolicyTx.simulate({
    denom: 'BNB'
  })

  console.log('simulateInfo', simulateInfo)
  const res = await putGroupPolicyTx.broadcast({
    denom: 'BNB',
    gasLimit: Number(simulateInfo?.gasLimit),
    gasPrice: simulateInfo?.gasPrice || '5000000000',
    payer: operator,
    granter: ''
  })
  if (res.code === 0) {
    console.log('put group policy success')
    return res.transactionHash
  }
}

export const updateGroupMember = async (
  operator: string,
  /** group_owner defines the account address of the group owner */
  groupOwner: string,
  /** group_name defines the name of the group which to be updated */
  groupName: string,
  /** members_to_add defines a list of members account address which will be add to the group */
  membersToAdd: MsgGroupMember[],
  /** members_to_delete defines a list of members account address which will be remove from the group */
  membersToDelete: string[]
) => {
  const updateGroupMemberTx = await client.group.updateGroupMember({
    operator,
    groupOwner,
    groupName,
    membersToAdd,
    membersToDelete
  })

  const simulateInfo = await updateGroupMemberTx.simulate({
    denom: 'BNB'
  })

  console.log('simulateInfo', simulateInfo)
  const res = await updateGroupMemberTx.broadcast({
    denom: 'BNB',
    gasLimit: Number(simulateInfo?.gasLimit),
    gasPrice: simulateInfo?.gasPrice || '5000000000',
    payer: operator,
    granter: ''
  })
  if (res.code === 0) {
    console.log('update group Member success')
    return res.transactionHash
  }
}
