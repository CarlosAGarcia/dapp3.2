// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./DaiToken.sol"; // token to be staked
import "./DappToken.sol"; // token given as yield for stake

// contract name in files (vs code)
contract TokenFarm { // All actual code goes inside here
   
    // STATE VARIABLES START - will be stored on the blockchain (SMRAT CONTRACT STATE)

    string public name = 'Dapp Token Farm'; // public facing name given to smart contract

    DappToken public dappToken; // initialize the variables for dappToken - will later be a reference to the DappToken smart contract (by address) so we can access its functions and state vars
    DaiToken public daiToken; // initialize the variables for dappToken - will later be a reference to the DaiToken smart contract (by address) so we can access its functions and state vars

    // mapping is a key/value store. Give me Address (key) and we return the value (uint)
    mapping(address => uint) public stakingBalance; // the total staking bal in TokenFarm for (investor) address passed in
    mapping(address => bool) public hasStaked; // All addresses that haev stake prev. This gives us a bool if the (investor) address/ key passed in matches up with a key.
    mapping(address => bool) public isStaking; // is currently staking? 

    // all addresses that have staked 
    address[] public stakers;

    // STATE VARIABLES END



    // Passes in 2 ADDRESSES to the smart contracts DappToken + Daitoken so we can access them.
    // these must be compiled + deployed prior to this constructor so they can be found at their address
    constructor(DappToken _dappToken, DaiToken _daiToken) public {
        dappToken = _dappToken; // save the init to our state
        daiToken = _daiToken; // save the init to our state
    }

    // 1. Deposit DAI to stake and get DAPP (from investor wallet to TokenFarm 'bank' wallet)
    function stakeTokens(uint _amount) public {
        // msg is a GLOBAL VARIABLE in sol (msg.sender -> whoever sent the msg)
        daiToken.transferFrom(msg.sender, address(this), _amount); // transferFrom allows smart contracts to transfer in other smart contracts for them
        
        // We need to keep track of how many tokens are inside + users
        // we use [msg.sender] bc there can be many addresses
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount; // since it's adding to the amount
        
        // Add user address to state vars if they haven't staked alr
        if (!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        hasStaked[msg.sender] = true; // to be safe we always set this to true when called
        isStaking[msg.sender] = true; 
    }
}