import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { ethers, BigNumber, utils } from 'ethers';
import { Link as LinkR } from 'react-router-dom';
import { Button, Menu, Layout, Row, Col, Image } from 'antd';
import imgLogo from './images/Signature2_tr_031672.png';
import iconDAI from './images/DAI.png';
import iconUNI from './images/UNI.png';
import contractAbi from './Ethereum/contractAbi.json';
import IERC20Abi from './Ethereum/IERC20Abi.json';
import { connectWallet } from './Utils/interact';
declare var window: any;
const { Header } = Layout;

function App() {
  const mySwapAddress = '0xa3b296bf345b363a9866Ed6f41E7b15e0166BECf';
  const [token1, setToken1] = useState({
    icon: iconDAI,
    name: 'DAI',
    contractAddress: '0x6A9865aDE2B6207dAAC49f8bCba9705dEB0B0e6D',
  });
  const [token2, setToken2] = useState({
    icon: iconUNI,
    name: 'UNI',
    contractAddress: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
  });
  const [walletAddress, setWalletAddress] = useState('');
  const [tokenAmount, setTokenAmount] = useState('0');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [status, setStatus] = useState('');
  const firstLoadWallet = useRef(false);
  const firstLoadNetwork = useRef(false);

  useEffect(() => {
    async function fetchWallet() {
      const { status, address } = await connectWallet();
      setWalletAddress(address);
      setStatus(status);
      if (address !== '') {
        setIsWalletConnected(true);
      }
    }
    fetchWallet();
  }, []);

  useEffect(() => {
    async function updateWallet() {
      if (firstLoadWallet.current) {
        addWalletListener();
      } else {
        firstLoadWallet.current = true;
      }
    }
    updateWallet();
  }, [walletAddress]);

  useEffect(() => {
    async function updateNetwork() {
      if (firstLoadNetwork.current) {
        getCurrentNetworkConnected();
      } else {
        firstLoadNetwork.current = true;
      }
    }
    updateNetwork();
  }, [status]);
  const toggleTokens = () => {
    const tok = { ...token1 };
    setToken1(token2);
    setToken2(token1);
  };

  const addWalletListener = () => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        } else {
          setWalletAddress('');
          setStatus('🦊 Connect to Metamask using the top right button.');
        }
      });
    } else {
      setStatus(
        `Please install Metamask, a virtual Ethereum wallet, in your browser.`
      );
    }
  };
  const getCurrentNetworkConnected = () => {
    if (window.ethereum) {
      window.ethereum.on('chainChanged', (_chainId) => {
        if (parseInt(_chainId) === 4) {
          setStatus(`🌎 Connected to Rinkeby Test Network`);
        } else {
          setStatus(`🦊 Please connect to Rinkeby Test Network`);
        }
      });
    }
  };
  const onAuthorize = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        4
      );
      const signer = provider.getSigner();
      const token1Contract = new ethers.Contract(
        token1.contractAddress,
        IERC20Abi.abi,
        signer
      );
      try {
        const tx = await token1Contract.approve(
        mySwapAddress,
        utils.parseEther(tokenAmount))
      } catch (error) {
        console.log(error);
      }
    }
  };

  const onSwap = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        4
      );
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        mySwapAddress,
        contractAbi.abi,
        signer
      );
      try {
        const tx = await contract.swap(
        token1.contractAddress,
        token2.contractAddress,
        utils.parseEther(tokenAmount),
        0,
        walletAddress);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <div className='App'>
        <Layout className='navbar'>
          <Header className='navbar__header'>
            <Col>
              <a href='/'>
                <Image src={imgLogo} className='logo' />
              </a>
            </Col>
            <Col>
              <h1 className='title'>MySwap</h1>
            </Col>
            <Col>
              <Button
                type='primary'
                className={
                  isWalletConnected ? 'button-connected' : 'button-connect'
                }
                disabled={isWalletConnected}
              >
                {walletAddress.length > 0
                  ? `Connected: ${String(walletAddress).slice(0, 6)}...${String(
                      walletAddress
                    ).slice(38)}`
                  : `Connect Wallet`}
              </Button>
            </Col>
          </Header>
        </Layout>
        <Layout className='main'>
          <div className='swap-container'>
            <div className='swap-page'>
              <div className='swap-interface'>
                <div>
                  <div className='swap-token'>
                    <div className='swap-token-container'>
                      <div className='swap-token-input-row'>
                        <input
                          className='swap-input'
                          autoComplete='off'
                          autoCorrect='off'
                          type='text'
                          pattern='^[0-9]*[.,]?[0-9]*$'
                          placeholder='0.0'
                          minLength={1}
                          maxLength={79}
                          spellCheck='false'
                          onChange={(e) => setTokenAmount(e.target.value)}
                        />
                        <div>
                          <Image
                            className='icon'
                            src={token1.icon}
                            alt={token1.name}
                          />
                          <span>{token1.name}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='swap-arrow' onClick={toggleTokens}>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='16'
                      height='16'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='#000000'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    >
                      <line x1='12' y1='5' x2='12' y2='19'></line>
                      <polyline points='19 12 12 19 5 12'></polyline>
                    </svg>
                  </div>
                  <div className='swap-token'>
                    <div className='swap-token-container'>
                      <div className='swap-token-input-row'>
                        <input
                          className='swap-input'
                          autoComplete='off'
                          autoCorrect='off'
                          type='text'
                          pattern='^[0-9]*[.,]?[0-9]*$'
                          placeholder='0.0'
                          minLength={1}
                          maxLength={79}
                          spellCheck='false'
                        />
                        <div>
                          <Image
                            className='icon'
                            src={token2.icon}
                            alt={token2.name}
                          />
                          <span>{token2.name}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  {walletAddress.length > 0 ? (
                    <Button
                      type='primary'
                      className='button-connect button-big'
                      onClick={onSwap}
                    >
                      <span>`Swap`</span>
                    </Button>
                  ) : (
                    <Button
                      type='primary'
                      className='button-connect'
                    >
                       Connect Wallet`
                    </Button>
                  )}

                  {isWalletConnected && (
                    <>
                      <div>
                        Before swapping, please authorize MySwap to use your
                        tokens
                      </div>
                      <Button
                        type='primary'
                        className='button-connect button-big'
                        onClick={onAuthorize}
                      >
                        <span>Authorize</span>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Layout>
      </div>
    </>
  );
}

export default App;
