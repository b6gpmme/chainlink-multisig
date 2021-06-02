import { ethers } from 'ethers';
import React, { Component } from "react";
import logo from './logo.svg';
import './App.css';

import MultiSigWallet from "./artifacts/contracts/MultiSigWallet.sol/MultiSigWallet.json";

const mswAddress =  "0x6DE282021D7a1b9c8377f61BF374AAa08b6c5DB9";

// This is an error code that indicates that the user canceled a transaction
//const ERROR_CODE_TX_REJECTED_BY_USER = 4001;

function App() {
  
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
        console.log("Balance: ", balance.toString());
        };
    }

  return (
    <div className="App">
      <header className="App-header">
          <button onClick={getBalance}>Get Balance</button>
      </header>
    </div>
  );
}

export default App;
