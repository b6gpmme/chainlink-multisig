let { networkConfig } = require('../helper-hardhat-config')
const hardhat = require("hardhat");
module.exports = async ({
	deployments,
	getNamedAccounts,
	getUnnamedAccounts,
	getChainId
}) => {
	const { deploy } = deployments;
	const { deployer } = await getNamedAccounts();
	const accounts = await hre.ethers.getSigners();
	const addresses = (await ethers.getSigners()).map(s => s.address)
	const chainId = await getChainId()


	//const addresses = [accounts[0].address, accounts[1].address];

	console.log("Being deployed from: ", deployer);
	console.log("Two Signers are: ", addresses);


	const multsigWallet = await deploy("MultiSigWallet", {
		from: deployer,
		args: [addresses, 2],
		log: false
	});

	console.log("Run the following command to fund contract with LINK:")
 	console.log("npx hardhat fund-link --contract " + multsigWallet.address + " --network " + networkConfig[chainId]['name'])
  	console.log("Run the following command to fund contract with ETH:")
  	console.log("npx hardhat fund-eth --contract " + multsigWallet.address + " --network " + networkConfig[chainId]['name'])
  	console.log("----------------------------------------------------")
}
