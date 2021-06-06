
> # 1. Set up pre reqs + env 
    >* `ganache` - instant blockchain 
    >* `truffle` - to deploy smart contracts
    >* `node/ethers/web3` - additional frameworks to help connect things

> # 2. initialize the project structure 
    >* `truffle init/npm init/git init `
        >* `make sure truffle.config is present.` Set up necessary ports/vars
        >* make sure `truffle config points to the correct path` for smart contracts
            >* to change add following to truffle.config:
                >>* contracts_directory: './src/contracts/', (**OR ANY OTHER PATH**)
                >>* contracts_build_directory: './src/abis/', (**OR ANY OTHER PATH**)

> # 3. Should have a contracts folder. Set up a smart contract
    >* `/migrations folder needs to have a deploy file`
    >* eg. ContractName.sol
            >> * this is to deploy any changes / 'migrate' the new blockchain to replace the old one since we cant update it, only 'replace it'

> # 4. compile smart contracts > 'truffle compile'
    >* `should create: Contract Application Binary Interface - (ABI) for each smart contract`
        >>* ABIs are how we interact with smart contracts on the blockchain that have been deployed
    >* The actual ABI code will be stored **inside a JSON file** to read easily. 

> # 5. We put the smart contract on the blockchain >  'truffle migrate'
    >* We are writing to the blockchain which `costs gas`
    >* If successful we pay the ether to deploy the smart contract
        >>* on truffle the first account is the default so it's the one that pays

># 6. **(OPTIONAL)** we can interact with the smart contract on smart chain through **truffle console**
    >* we assign the deployed blockchain code to a variable using **await** since it's async
    >* eg. `tokenFarm = await TokenFarm.deployed()` -> returns undefined
        >>* eg. `tokenFarm` now returns the smart contract vals
        >>* eg. `tokenFarm.address` returns the address of the network
        >>* eg. `tokenFarm.name()` returns the name of the smart contract we gave in the sol file
            >>>* `tokenFarm.name returns a function

># 7. Set up additional logic in smart contract
    >* import the other smart contracts into the tokenFarm contract first
        >>* import "./DaiToken.sol"; // token to be staked
        >>* import "./DappToken.sol"; // token given as yield for stake
    >* Now `we need the smart contract address of the tokens imported to be accessible` to the tokenFarm.sol smart contract
        >>* we need to `deploy DaiToken`
        >>* `deploy DappToken`
        >>* `deploy tokenFarm`
    >* create constructor to save the address to state variables of type DaiToken/DappToken that we created in the other smart contract files

># 8. Deploy the DaiToken + DappToken in the deploy contracts file
    >* We deploy the contract using await and save it to a var
        >>* eg. `await deployer.deploy(DaiToken)`
        >>* eg. `const daiToken = await DaiToken.deployed()`
    >* `We deploy the original tokenFarm smart contract with the addresses of the other tokens` passed in
        >>* eg. `await deployer.deploy(TokenFarm, dappToken.address, daiToken.address)`
    >* As part of yield farming initialise we need to `transfer all DappTokens to the TokenFarm so it can distribute them`
        >>* We transfer all totalSupply to TokenFarm so it has access to them& can send them to users 
    >* As part of yield farming init we `transfer 100 DAI to tokenFarm for liquidity`
        >>* we take this from the investor / address @ index 1 in ganache
            >>>* eg. `await daiToken.transfer(accounts[1], '1000000000000000000000')`
    >* we compile + deploy as below
        >>* `truffle compile`
        >>* ` truffle migrate --reset` to reset the app since its immutable we just replace it
        >>* `truffle console` to test if correctly deployed + correct accounts
            >>>* `mDai = await DaiToken.deployed()`
            >>>* `accounts = await web3.eth.getAccounts()`
            >>>* `accounts[1]` -> should return the address of accounts 1 which `should be address 1 in ganache`
            >>>* `balance = await mDai.balanceOf(address[1])`
                >>>>* mDai.balanceOf() is a mapping/fn created in DaiToken smart contract
            >>>* `formattedBalance = web3.utils.fromWei(balance)`
                >>>>* formattedBalanjce should return whatever you put into daiToken.transfer in deploy contract file in step above
            >>>* 

># 9. Write tests for the smart contracts
    >>* since the `contracts are immutable` we write tests before we deploy anything
    >>* create `/test` folder under main dir 
    >>* create `TokenFarm.test.js` and import required 
        >>>* eg `const TokenFarm = artifacts.require("TokenFarm");`
		>>> `const DappToken = artifacts.require("DappToken");`
		>>>`const DaiToken = artifacts.require("DaiToken");`
		>>>`require('chai')`
	>>* use ***`truffle test`*** to test in terminal
        
    >>* Note. see TokenFarm.test.js for full tests + examples.

># 10. Add functionality to deposit DAI to TokenFarm
    >* Add `function stakeTokens(uint _amount) public { ... }`
        >>* We need to transfer the amount of Dai the investor sends
            >>>* `daiToken.transferFrom(msg.sender, address(this), _amount);` allows us to transfer from the investors address to our address at TokenFarm + amount
        >>* We need to keep track of `how many tokens, who is staked, is a particular address staked`
            >>>* At top of file we create another state var = `mapping(address => uint) public stakingBalance` creates a mapping that can take an address/key and return the 'value' at this 'key', which in this case is of type uint
                >>>>* `stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount` This is included in the stakeTokens function to add the amount to this users 'key'/address
            >>* We now need to create another `state var to see who has tokens staked`
                >>>* `mapping(address => bool) public hasStaked;` this can be used to input an address and see if they have staked 
                    >>>>* `hasStaked[msg.sender] = true;` must be set inside the stakeTokens function
            >>* We also use another `state var to see ALL users staked`
                >>>* `address[] public stakers;` state var
                    >>>>* `if (!hasStaked[msg.sender]) stakers.push(msg.sender);` inside the stakeTokens fn

