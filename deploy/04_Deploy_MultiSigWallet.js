const hre = require("hardhat");

async function main() {
  const accounts = await ethers.provider.listAccounts();
  const MultiSigWallet = await ethers.getContractFactory("MultiSigWallet");
  const multiSigWallet = await MultiSigWallet.deploy(accounts, 2);

  await multiSigWallet.deployed();

  console.log("MultiSigWallet deployed to:", multiSigWallet.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
