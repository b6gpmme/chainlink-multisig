const hardhat = require("hardhat");
module.exports = async ({
	deployments,
	getNamedAccounts,
	getUnnamedAccounts
}) => {
	const { deploy } = deployments;
	const { deployer } = await getNamedAccounts();
	const accounts = await hre.ethers.getSigners();
	const addresses = (await ethers.getSigners()).map(s => s.address)

	//const addresses = [accounts[0].address, accounts[1].address];

	console.log("Being deployed from: ", deployer);
	console.log("Two Signers are: ", addresses);


	await deploy("MultiSigWallet", {
		from: deployer,
		args: [addresses, 2],
		log: true
	});
}
