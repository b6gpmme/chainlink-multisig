import { ethers } from 'ethers';
import React, { Component } from "react";
import logo from './logo.svg';
import './App.css';

import MultiSigWallet from "./artifacts/contracts/MultiSigWallet.sol/MultiSigWallet.json";

const mswAddress =  "0x6DE282021D7a1b9c8377f61BF374AAa08b6c5DB9";

// This is an error code that indicates that the user canceled a transaction
//const ERROR_CODE_TX_REJECTED_BY_USER = 4001;

class App extends Component {
  state = {balance: undefined, loaded:false};

  componentDidMount = async () => {
    try {
      //Get network provider and web3 instance
      this.web3 = await getWeb3();
      // Use web3 to get the user's accounts
      this.accounts = await this.web3.eth.getAccounts();

      // Get contract instance
      const networkId = await this.web3.eth.net.getId();

      this.multisigWallet = new this.web3.eth.Contract(
        MultiSigWallet.abi,
        MultiSigWallet.networks[networkId] && MultiSigWallet.networks[networkId].address,
      );
      this.setState({loaded:true});
    } catch (error) {
      alert(
        'Failed to load web3, accounts, or contract. Check console for details.',
        );
        console.error(error);
      }
    };
  
  //request access to user MetaMask
  //async function requestAccount(){
    //await window.ethereum.request({ method: 'eth_requestAccounts'});
  //}

  //get Balance of MultiSigWallet
  getBalance = async () => {
    const balance = await multisigWallet.getBalance().then((data) => {
            console.log('Balance is: ', web3.utils.fromWei(data.toString(), "ether"), "ETH");
        });
        this.setState({[balance]: balance});
  }
  //async function getBalance() {
  //  if (typeof window.ethereum !== 'undefined') {
  //      const provider = new ethers.providers.Web3Provider(window.ethereum);
  //      const contract = new ethers.Contract(mswAddress,MultiSigWallet.abi, provider)
  //      const balance = await contract.getBalance();
  //      console.log("Balance: ", balance.toString());
  //      this.setState({balance});
  //      };
  //  }
  render() {
      if (!this.state.loaded) {
        return <div>Loading Web3, accounts, and contract...</div>;
      }
    return (
      <div className="App">
        <header className="App-header">
            <button onClick={getBalance}>Get Balance</button>
        </header>
      </div>
    )};
}

export default App;
