
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