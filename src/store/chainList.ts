export const chainInfo = {
  5600: {
    chainId: '0x' + Number(5600).toString(16),
    chainName: 'greenfield',
    rpcUrls: ['https://gnfd-testnet-fullnode-tendermint-us.bnbchain.org'],
    nativeCurrency: {
      name: 'BNB Coin',
      symbol: 'tBNB',
      decimals: 18
    }
  },
  1017: {
    chainId: '0x' + Number(1017).toString(16),
    chainName: 'BNB Greenfield Mainnet',
    rpcUrls: ['https://greenfield-chain.bnbchain.org'],
    nativeCurrency: {
      name: 'BNB Coin',
      symbol: 'tBNB',
      decimals: 18
    }
  },
  97: {
    chainId: '0x' + Number(97).toString(16),
    chainName: 'BSC Chapel',
    rpcUrls: ['https://bsc-testnet.public.blastapi.io'],
    nativeCurrency: {
      name: 'BNB Coin',
      symbol: 'tBNB',
      decimals: 18
    }
    // blockExplorerUrls: [],
  },
  56: {
    chainId: '0x' + Number(56).toString(16),
    chainName: 'BSC Mainnet',
    rpcUrls: ['https://rpc.ankr.com/bsc'],
    nativeCurrency: {
      name: 'Binance Coin',
      symbol: 'BNB',
      decimals: 18
    },
    blockExplorerUrls: ['https://bscscan.com']
  },
  204: {
    chainId: '0x' + Number(204).toString(16),
    chainName: 'opBNB',
    rpcUrls: ['https://opbnb-mainnet-rpc.bnbchain.org'],
    nativeCurrency: {
      name: 'BNB Coin',
      symbol: 'BNB',
      decimals: 18
    }
    // blockExplorerUrls: [],
  }
}
