const { assert } = require('chai');
const TokenFarm = artifacts.require("TokenFarm");
const DappToken = artifacts.require("DappToken");
const DaiToken = artifacts.require("DaiToken");

require('chai')
    .use(require('chai-as-promised'))
    .should()

function convertToWei(amount) {
    return web3.utils.toWei(amount) // dont need to import web3
}

// passing in (accounts) but deconstructer -> ([owner, investor])
contract('TokenFarm', (accounts) => {
    const [owner, investor] = accounts // spreading the accounts passed in

    //write tests here
    let daiToken
    let dappToken
    let tokenFarm;

    // sets up the instances as if we're compiling/deploying ti
    before(async () => {
        daiToken = await DaiToken.new() // new instance of smart contract
        dappToken = await DappToken.new() // new instance of smart contract

        // init tokenFarm with addresses of dapp/dai tokens
        tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address) // new instance of smart contract
        
        // transfer the tokens to tokenFarm (copied from 2_deploy_contracts.js)
        // Transfer all DappTokens to TokenFarm (all 1 million - totalSupply in DappToken)
        await dappToken.transfer(tokenFarm.address, convertToWei('1000000'))
        // transferring 1000 mock DAI (in wei) from account at index 1 (investor)
        await daiToken.transfer(investor, convertToWei('1000'), { from: owner })
    })

    describe('Mock Dai Development', async () => {
        it('has correct name', async () => {
            const expected = 'Mock DAI Token'
            const name = await daiToken.name() // gets name

            // console.log('Name expected: ', expected ,' vs. real:', name)
            assert.equal(name, expected) // tests name
        })
    })

    describe('Dapp Development', async () => {
        it('has correct name', async () => {
            const expected = 'DApp Token'
            const name = await dappToken.name() // gets name

            // console.log('Name expected: ', expected ,' vs. real:', name)
            assert.equal(name, expected) // tests name
        })
    })

    describe('TokenFarm Development', async () => {
        it('has correct name', async () => {
            const expected = 'Dapp Token Farm'
            const name = await tokenFarm.name() // gets name

            // console.log('Name expected: ', expected ,' vs. real:', name)
            assert.equal(name, expected) // tests name
        })

        it('has correct amount of Dapp tokens', async() => {
            const expectedDapp = convertToWei('1000000')

            let balanceDapp = await dappToken.balanceOf(tokenFarm.address)
            console.log(`expected ${expectedDapp} DAPP and got ${balanceDapp.toString()}`)

            assert.equal(balanceDapp.toString(), expectedDapp)
        })
    })

    describe('Farming Tokens', async () => {
        let result
        let expected

        it('Correctly stakes the right user for the right amount of Dai tokens', async () => {
            expected = convertToWei('1000')
            result = await daiToken.balanceOf(investor)

            // check investor balance for staking
            assert.equal(result.toString(), expected, 'investor mock dai correct before staking')

            // Staking is a 2 step proccess when you user transferFrom in the sol contract.
            // 1. Tokens have to be approved by the investor for the address that's accessing them to stake
            // 2. Tokens can then be accessed by the smart contract (address) and used in transferFrom
            await daiToken.approve(tokenFarm.address, result, { from: investor })
            await tokenFarm.stakeTokens(result, { from: investor })

            // re check balance. Should have staken 
            expected = convertToWei('0')
            result = await daiToken.balanceOf(investor) // check investor balance for staking
            assert.equal(result.toString(), expected, 'investor mock dai correct AFTER staking')

            // checking Daitoken balance for tokenFarms address
            expected = convertToWei('1000')
            result = await daiToken.balanceOf(tokenFarm.address) // check investor balance for staking
            assert.equal(result.toString(), expected, 'token farm mock dai correct AFTER staking')

            // checking we've updated tokenFarm state vars to show investor is staking
            expected = true
            result = await tokenFarm.isStaking(investor) // check investor balance for staking
            assert.equal(result, expected, 'investor appears on tokenFarm as is staking')
            result = await tokenFarm.hasStaked(investor) // check investor balance for staking
            assert.equal(result, expected, 'investor appears on tokenFarm as has staking')
        })
    })
})