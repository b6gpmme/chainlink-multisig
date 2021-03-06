import { ethers } from 'ethers';
import React, { useState } from "react";
import Web3 from 'web3';
import './App.css';
import MultiSigWallet from "./artifacts/contracts/MultiSigWallet.sol/MultiSigWallet.json";

//Initialize deployed address, Link ABI and address for balance, and web3
const mswAddress =  "0x6DE282021D7a1b9c8377f61BF374AAa08b6c5DB9";
const linkABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"transferAndCall","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"data","type":"bytes"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"}];
const linkAddress = "0xa36085F69e2889c224210F603D836748e7dC0088";
const web3 = new Web3(Web3.givenProvider);

function App() {
  //For Balances
  var [balanceState, setBalanceState] = useState();
  var [balanceUSDState, setBalanceUSDState] = useState();
  var [balanceLinkState, setBalanceLinkState] = useState();
  //For Sending Transactions
  var [transactionReceiver, setTransactionReceiver] = useState();
  var [transactionAmount, setTransactionAmount] = useState();
  var [transactionData, setTransactionData] = useState();
  //For Transaction Info
  var [transactionIndex, setTransactionIndex] = useState();
  var [transactionIsExecuted, setTransactionIsExecuted] = useState();
  var [transactionConfirmations, setTransactionConfirmations] = useState();
  var [transactionCount, setTransactionCount] = useState();
  //For Eth/USD Option
  var [inUSD, setInUSD] = useState();




  //Request access to user MetaMask
  async function requestAccount(){
    await window.ethereum.request({ method: 'eth_requestAccounts'});
  }
  
  //Get ETH, USD Equivalent, and LINK Balance of MultiSigWallet
  async function getBalances() {
    if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const msw = new ethers.Contract(mswAddress,MultiSigWallet.abi, provider);
        const link = new web3.eth.Contract(linkABI, linkAddress);
        const balance = await msw.getBalance();
        const balanceUSD = await msw.getBalanceInUSD();
        const balanceLink = await link.methods.balanceOf(mswAddress).call();
        setBalanceState(web3.utils.fromWei(balance.toString(), "ether") + " ETH");
        setBalanceUSDState(balanceUSD.toString() + " USD");
        setBalanceLinkState(web3.utils.fromWei(balanceLink.toString(), "ether") + " LINK")
        };
    }

  //Submit a transaction in ETH
  async function submitTransaction() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      const msw = new ethers.Contract(mswAddress,MultiSigWallet.abi, signer);
      await msw.submitTransaction(transactionReceiver,transactionAmount,transactionData);
      getTransactionCount();
      setTransactionIndex((Number(transactionCount) + 1).toString());
      setTransactionConfirmations("0");
      setTransactionIsExecuted("False");
      };
  }

  //Submit a transaction in USD
  async function submitTransactionUSD() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      const msw = new ethers.Contract(mswAddress,MultiSigWallet.abi, signer);
      await msw.submitTransactionUSD(transactionReceiver,transactionAmount,transactionData);
      getTransactionCount();
      setTransactionIndex((Number(transactionCount) + 1).toString());
      setTransactionConfirmations("0");
      setTransactionIsExecuted("False");
      };
  }
  //Get Transaction Information
  async function getTransaction() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      const msw = new ethers.Contract(mswAddress,MultiSigWallet.abi, signer);
      const transaction = await msw.getTransaction(transactionIndex)
      setTransactionIsExecuted(transaction.executed.toString());
      setTransactionConfirmations(transaction.numConfirmations.toString() + " of 2 Required");
      setTransactionAmount(web3.utils.fromWei(transaction.value.toString(), "ether") + " ETH");
    }
  }

  //Get Transaction Count
  async function getTransactionCount() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      const msw = new ethers.Contract(mswAddress,MultiSigWallet.abi, signer);
      const transactionCount = await msw.getTransactionCount();
      setTransactionCount(transactionCount.toString());
    }
  }

  //Confirm a transaction
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

//Execute a Transaction
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
  
  //Get transaction count at rendering
  getTransactionCount();

  return (
    <div className="App">
      <header className="App-header">
        <div onChange={e => setInUSD(e.target.value)} placeholder="ETH">
          <input type="radio" value="ETH" name="Currency" defaultChecked/> ETH
          <input type="radio" value="USD" name="Currency" /> USD
        </div>
        <div>
          <button onClick={getBalances}>Get Balances</button>
          {inUSD === "USD"
            ? <p>{balanceUSDState}</p>
            : <p>{balanceState}</p>
          }
          <p>{balanceLinkState}</p>
        </div>

        <div>
          {inUSD === "USD"
            ? <div>
              <button onClick={submitTransactionUSD}>Submit Transaction</button>
              <input onChange={e => setTransactionReceiver(e.target.value)} placeholder="Set Receiver Address" />
              <input onChange={e => setTransactionAmount(e.target.value)} placeholder="Set Amount in USD" />
              <input onChange={e => setTransactionData(e.target.value)} placeholder="0x" />
              </div>
            : <div>
              <button onClick={submitTransaction}>Submit Transaction</button>
              <input onChange={e => setTransactionReceiver(e.target.value)} placeholder="Set Receiver Address" />
              <input onChange={e => setTransactionAmount(e.target.value)} placeholder="Set Amount in Wei" />
              <input onChange={e => setTransactionData(e.target.value)} placeholder="0x" />
              </div>
          }
        </div>
        <div>
          <p>Total Transaction Count: {transactionCount}</p>
          <button onClick={getTransaction}>Get Transaction Data</button>
          <input onChange={e => setTransactionIndex(e.target.value)} placeholder = "Index starts at 0" />
          <p>Transaction: {transactionIndex}</p>
          <p>Confirmations: {transactionConfirmations}</p>
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