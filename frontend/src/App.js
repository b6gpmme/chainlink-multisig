import { ethers } from 'ethers';
import React, { useState } from "react";
import logo from './logo.svg';
import Web3 from 'web3';
import './App.css';


import MultiSigWallet from "./artifacts/contracts/MultiSigWallet.sol/MultiSigWallet.json";

const mswAddress =  "0x6DE282021D7a1b9c8377f61BF374AAa08b6c5DB9";
const LinkAddress = "0xa36085f69e2889c224210f603d836748e7dc0088"
const web3 = new Web3(Web3.givenProvider);
// This is an error code that indicates that the user canceled a transaction
//const ERROR_CODE_TX_REJECTED_BY_USER = 4001;

function App() {
  var [tokenData, setTokenData] = useState();
  var [tokenBalance, setTokenBalance] = useState();
  var [balanceState, setBalanceState] = useState();
  var [balanceUSDState, setBalanceUSDState] = useState();
  
  //request access to user MetaMask
  //async function requestAccount(){
    //await window.ethereum.request({ method: 'eth_requestAccounts'});
  //}

  //get Balance of MultiSigWallet
  async function getBalance() {
    if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(mswAddress,MultiSigWallet.abi, provider)
        const balance = await contract.getBalance();
        const balanceUSD = await contract.getBalanceInUSD();
        //console.log("Balance: ", balance.toString());
        setBalanceState(web3.utils.fromWei(balance.toString(), "ether") + " ETH");
        setBalanceUSDState(balanceUSD.toString() + " USD");
        };
    }

  return (
    <div className="App">
      <header className="App-header">
          <button onClick={getBalance}>Get Balance</button>
          <p>{balanceState}</p>
          <p>{balanceUSDState}</p>
      </header>
    </div>
  );
}

export default App;