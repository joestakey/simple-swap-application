declare var window: any;

export const connectWallet = async () => {
  console.log('we are in connectWallet!');
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      console.log('method works :) ');
      try {
        console.log('we are here now');
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x4' }],
        });
        const obj = {
          status: `🌎 Connected to Rinkeby Test Network`,
          address: addressArray[0],
        };
        console.log(obj.address)
        return obj;
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0x4',
                  chainName: 'Rinkeby Test Network',
                  rpcUrls: ['https://rinkeby.infura.io/v3/'] /* ... */,
                },
              ],
            });
          } catch (addError) {
            return {
              address: '',
              status: `🚫Could not add the Rinkeby Test Network to your wallet`,
            };
          }
        }
        return {
          address: '',
          status: '🚫Unknown error, please check your wallet',
        };
      }
    } catch (err) {
      return {
        address: '',
        status: `😥 Please go to your Metamask extension and login`,
      };
    }
  } else {
    return {
      address: '',
      status: (`Please install Metamask in your browser`)
      ,
    };
  }
};
