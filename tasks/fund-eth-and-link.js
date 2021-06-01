
let { networkConfig, getNetworkIdFromName } = require('../helper-hardhat-config')

task("fund-eth-and-link", "Funds a contract with .01 ETH and 1 LINK")
    .addParam("contract", "The address of the contract that requires ETH and LINK")
    .setAction(async (taskArgs) => {
        const contractAddr = taskArgs.contract
        let networkId = await getNetworkIdFromName(network.name)
        console.log("Funding contract ", contractAddr, " on network ", network.name)
        let linkTokenAddress = networkConfig[networkId]['linkToken'] || taskArgs.linkaddress
        const LinkToken = await ethers.getContractFactory("LinkToken")

        //Fund with 1 LINK token
        const amount = web3.utils.toHex(1e18)

        //Get signer information
        const accounts = await ethers.getSigners()
        const signer = accounts[0]

        //Create connection to LINK token contract and initiate the transfer
        const linkTokenContract = new ethers.Contract(linkTokenAddress, LinkToken.interface, signer)
        var result = await linkTokenContract.transfer(contractAddr, amount).then(function (transaction) {
            console.log('Contract ', contractAddr, ' funded with 1 LINK. Transaction Hash: ', transaction.hash)
        })

        //Send .01 ETH Transaction
        const amountETH = web3.utils.toHex(16)
        const ethtx = await signer.sendTransaction({
        to: contractAddr,
        value: amountETH,
        });
        await ethtx.wait();
        console.log('Contract ', contractAddr, ' funded with .01 ETH. Transaction Hash: ', transaction.hash)

    })

module.exports = {}

