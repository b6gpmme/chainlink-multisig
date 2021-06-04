let { networkConfig } = require('../helper-hardhat-config')
const hardhat = require("hardhat");

//deployments to deploy
//getNamedAccounts to get a deployer
//getChainId for the fund commands
module.exports = async ({
	deployments,
	getNamedAccounts,
	getChainId
}) => {
	const { deploy } = deployments;
	const { deployer } = await getNamedAccounts();

	//Multiple addresses needed to construct a multisig
	const addresses = (await ethers.getSigners()).map(s => s.address)
	const chainId = await getChainId()
	console.log("Being deployed from: ", deployer);
	console.log("Two Signers are: ", addresses);


	//Deploy with two signers and two confirmations requred
	const multsigWallet = await deploy("MultiSigWallet", {
		from: deployer,
		args: [addresses, 2],
		log: false
	});

	//Suggest potential tasks
	console.log("Run the following command to fund contract with LINK:")
 	console.log("npx hardhat fund-link --contract " + multsigWallet.address + " --network " + networkConfig[chainId]['name'])
  	console.log("Run the following command to fund contract with ETH:")
  	console.log("npx hardhat fund-eth --contract " + multsigWallet.address + " --network " + networkConfig[chainId]['name'])
  	console.log("----------------------------------------------------")
}
