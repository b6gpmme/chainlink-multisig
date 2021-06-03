import { ethers } from 'ethers';
import React, { useState } from "react";
import Web3 from 'web3';
import './App.css';
import MultiSigWallet from "./artifacts/contracts/MultiSigWallet.sol/MultiSigWallet.json";


const mswAddress =  "0x6DE282021D7a1b9c8377f61BF374AAa08b6c5DB9";
const linkABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"transferAndCall","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"data","type":"bytes"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"}];
const linkAddress = "0xa36085F69e2889c224210F603D836748e7dC0088";
const web3 = new Web3(Web3.givenProvider);
// This is an error code that indicates that the user canceled a transaction
//const ERROR_CODE_TX_REJECTED_BY_USER = 4001;

function App() {
  //For Balances
  var [balanceState, setBalanceState] = useState();
  var [balanceUSDState, setBalanceUSDState] = useState();
  var [balanceLinkState, setBalanceLinkState] = useState();
  //For Sending Transactions
  var [transactionReceiver, setTransactionReceiver] = useState();
  var [transactionAmount, setTransactionAmount] = useState();
  var [transactionData, setTransactionData] = useState();
  //var [transactionStatus, setTransactionStatus] = useState();
  var [transactionIndex, setTransactionIndex] = useState();
  var [transactionIsExecuted, setTransactionIsExecuted] = useState();
  var [transactionConfirmations, setTransactionConfirmations] = useState();
  var [transactionCount, setTransactionCount] = useState();
  //var [networkState, setNetworkState] = useState();



  //request access to user MetaMask
  async function requestAccount(){
    await window.ethereum.request({ method: 'eth_requestAccounts'});
  }
  
  //get Eth, USD Equivalent, and LINK Balance of MultiSigWallet
  async function getBalances() {
    if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const msw = new ethers.Contract(mswAddress,MultiSigWallet.abi, provider);
        const link = new web3.eth.Contract(linkABI, linkAddress);
        const balance = await msw.getBalance();
        const balanceUSD = await msw.getBalanceInUSD();
        const balanceLink = await link.methods.balanceOf(mswAddress).call();
        //console.log("Balance: ", balance.toString());
        setBalanceState(web3.utils.fromWei(balance.toString(), "ether") + " ETH");
        setBalanceUSDState(balanceUSD.toString() + " USD");
        setBalanceLinkState(web3.utils.fromWei(balanceLink.toString(), "ether") + " LINK")
        };
    }

  //Submit a transaction in Eth
  async function submitTransaction() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      const msw = new ethers.Contract(mswAddress,MultiSigWallet.abi, signer);
      //const link = new web3.eth.Contract(linkABI, linkAddress);
      await msw.submitTransaction(transactionReceiver,transactionAmount,transactionData);
      getTransactionCount();
      setTransactionIndex((Number(transactionCount) + 1).toString());
      setTransactionConfirmations("0");
      setTransactionIsExecuted("False");
      };
  }

  async function getTransaction() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      const msw = new ethers.Contract(mswAddress,MultiSigWallet.abi, signer);
      const transaction = await msw.getTransaction(transactionIndex)
      setTransactionIsExecuted(transaction.executed.toString());
      setTransactionConfirmations(transaction.numConfirmations.toString());
      setTransactionAmount(transaction.value.toString());
    }
  }
  async function getTransactionCount() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      const msw = new ethers.Contract(mswAddress,MultiSigWallet.abi, signer);
      const transactionCount = await msw.getTransactionCount();
      setTransactionCount(transactionCount.toString());
    }
  }


  async function confirmTransaction() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      const msw = new ethers.Contract(mswAddress,MultiSigWallet.abi, signer);
      //const link = new web3.eth.Contract(linkABI, linkAddress);
      await msw.confirmTransaction(transactionIndex);
      };
  }

  async function executeTransaction() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      const msw = new ethers.Contract(mswAddress,MultiSigWallet.abi, signer);
      //const link = new web3.eth.Contract(linkABI, linkAddress);
      await msw.executeTransaction(transactionIndex);
      };
  }

    //async function getNetwork() {
    //  if (typeof window.ethereum !== 'undefined') {
    //    setNetworkState(web3.eth.net.getNetworkType());
    //  }
    //}
  getTransactionCount();

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <button onClick={getBalances}>Get Balances</button>
          <p>{balanceState}</p>
          <p>{balanceUSDState}</p>
          <p>{balanceLinkState}</p>
        </div>
        <div>
          <button onClick={submitTransaction}>Submit Transaction</button>
          <input onChange={e => setTransactionReceiver(e.target.value)} placeholder="Set Receiver Address" />
          <input onChange={e => setTransactionAmount(e.target.value)} placeholder="Set Amount in Wei" />
          <input onChange={e => setTransactionData(e.target.value)} placeholder="0x" />
        </div>
        <div>
          <p>Total Transaction Count: {transactionCount}</p>
          <button onClick={getTransaction}>Get Transaction Data</button>
          <input onChange={e => setTransactionIndex(e.target.value)} placeholder = "Index starts at 0" />
          <p>Transaction: {transactionIndex}</p>
          <p>Confirmations: {transactionConfirmations} of 2 Required</p>
          <p>Executed: {transactionIsExecuted}</p>
          <p>Amount: {transactionAmount}</p>
        </div>
        <div>
          <button onClick={confirmTransaction}>Confirm Transaction</button>
          <input onChange={e => setTransactionIndex(e.target.value)} placeholder = {transactionIndex} />
        </div>
        <div>
          <button onClick={executeTransaction}>Execute Transaction</button>
          <input onChange={e => setTransactionIndex(e.target.value)} placeholder = {transactionIndex} />
        </div>      
      </header>
    </div>
  );
}

export default App;