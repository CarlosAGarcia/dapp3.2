
// migration contract migrates from one places ot another (the blockchain)
//  -> migrating the state from 1 to another (must encrypt/hash code to deploy)

// we have to migrate the 'db'/blockchain every time we want to update the 'db'/blockchain
// since we can't just update it we have to migrate the entire things and 're-create' it/migrate it
const TokenFarm = artifacts.require("TokenFarm");
const DappToken = artifacts.require("DappToken");
const DaiToken = artifacts.require("DaiToken");

// 
module.exports = async function(deployer, network, accounts) {
  
  await deployer.deploy(DaiToken) // deploying the mock DAI token
  const daiToken = await DaiToken.deployed() // getting the deployed token and saving it for access later

  await deployer.deploy(DappToken) // deploying the mock DAI token
  const dappToken = await DappToken.deployed() // getting the deployed token and saving it for access later

  // we pass in the addresses of the other tokens into the deployed
  await deployer.deploy(TokenFarm, dappToken.address, daiToken.address)
  const tokenFarm = await TokenFarm.deployed()

  // Transfer all DappTokens to TokenFarm (all 1 million - totalSupply in DappToken)
  await dappToken.transfer(tokenFarm.address, '1000000000000000000000000')

  // transferring 1000 mock DAI from account at index 1 (investor)
  await daiToken.transfer(accounts[1], '1000000000000000000000')
};
