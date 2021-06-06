
// migration contract migrates from one places ot another (the blockchain)
//  -> migrating the state from 1 to another (must encrypt/hash code to deploy)

// we have to migrate the 'db'/blockchain every time we want to update the 'db'/blockchain
// since we can't just update it we have to migrate the entire things and 're-create' it/migrate it
const TokenFarm = artifacts.require("TokenFarm");

module.exports = function(deployer) {
  deployer.deploy(TokenFarm);
};
