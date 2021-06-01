
let { networkConfig, getNetworkIdFromName } = require('../helper-hardhat-config')

task("fund-eth", "Funds a contract with .01 ETH")
    .addParam("contract", "The address of the contract that requires ETH")
    .setAction(async (taskArgs) => {
        const contractAddr = taskArgs.contract
        let networkId = await getNetworkIdFromName(network.name)
        console.log("Funding contract ", contractAddr, " on network ", network.name)
        
        //Fund with .01
        const amount = web3.utils.toHex(16)

        //Get signer information
        const accounts = await ethers.getSigners()
        const signer = accounts[0]

        //Create connection to Eth contract and initiate the transfer
        const ethtx = await signer.sendTransaction({
        to: contractAddr,
        value: amount,
         });
        await ethtx.wait();
    })

module.exports = {}

