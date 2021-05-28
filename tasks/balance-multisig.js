task("balance-multisig", "Prints the ballance of a MultiSig Wallet")
    .addParam("wallet", "The wallet's address")
    .setAction(async taskArgs => {
	const contractAddr = taskArgs.wallet
	const MultiSigWalletContract = await ethers.getContractFactory("MultiSigWallet")
        //Get signer information
        const accounts = await ethers.getSigners()
        const signer = accounts[0]


	const multiSigWalletContract = new ethers.Contract(contractAddr, MultiSigWalletContract.interface , signer);
        await multiSigWalletContract.getBalance().then((data) => {
            console.log('Balance is: ', web3.utils.fromWei(data.toString(), "ether"), "ETH");
        });
    });

module.exports = {}
