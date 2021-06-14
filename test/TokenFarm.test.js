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
        let resultDai
        let expectedDai
        let expectedDapp
        let resultDapp


        it('Correctly stakes the right user for the right amount of Dai tokens', async () => {
            expectedDai = convertToWei('1000')
            resultDai = await daiToken.balanceOf(investor)

            expectedDapp = convertToWei('0')
            resultDapp = await dappToken.balanceOf(investor)

            // check investor balance for staking
            assert.equal(resultDai.toString(), expectedDai, 'investor mock dai correct before staking')
            assert.equal(resultDapp.toString(), expectedDapp, 'investor mock dapp correct before staking')

            // Staking is a 2 step proccess when you user transferFrom in the sol contract.
            // 1. Tokens have to be approved by the investor for the address that's accessing them to stake
            // 2. Tokens can then be accessed by the smart contract (address) and used in transferFrom
            await daiToken.approve(tokenFarm.address, resultDai, { from: investor })
            await tokenFarm.stakeTokens(resultDai, { from: investor })

            // re check balance. Should have staken 
            expectedDai = convertToWei('0')
            resultDai = await daiToken.balanceOf(investor) // check investor balance for staking
            assert.equal(resultDai.toString(), expectedDai, 'investor mock dai correct AFTER staking')

            // checking Daitoken balance for tokenFarms address
            expectedDai = convertToWei('1000')
            resultDai = await daiToken.balanceOf(tokenFarm.address) // check investor balance for staking
            assert.equal(resultDai.toString(), expectedDai, 'token farm mock dai correct AFTER staking')

            // checking we've updated tokenFarm state vars to show investor is staking
            expectedDai = true
            resultDai = await tokenFarm.isStaking(investor) // check investor balance for staking
            assert.equal(resultDai, expectedDai, 'investor appears on tokenFarm as is staking')
            resultDai = await tokenFarm.hasStaked(investor) // check investor balance for staking
            assert.equal(resultDai, expectedDai, 'investor appears on tokenFarm as has staking')
        })

        it('Correctly issues tokens, to the right user, as the right amount of Dapp', async () => {
            // investor should have no dapp before issuing dapp
            expectedDapp = convertToWei('0')
            resultDapp = await dappToken.balanceOf(investor)
            assert.equal(resultDapp.toString(), expectedDapp, 'investor mock dapp correct before issuing dapp')

            expectedDai = convertToWei('1000')
            resultDai = await tokenFarm.stakingBalance(investor)
            assert.equal(resultDai.toString(), expectedDai, 'investor should be staking 1000')

            await tokenFarm.issueTokens()

            // investor should have no dapp before issuing dapp
            expectedDapp = convertToWei('1000')
            resultDapp = await dappToken.balanceOf(investor)
            assert.equal(resultDapp.toString(), expectedDapp, 'investor mock dapp correct after issuing dapp')
        })

        it('change yield rate working. (eg. bonus yield from early stages)', async () => {
            // investor should have no dapp before issuing dapp
            expectedDapp = convertToWei('1000')
            resultDapp = await dappToken.balanceOf(investor)
            assert.equal(resultDapp.toString(), expectedDapp, 'investor mock dapp correct before issuing dapp') // now has 1000 dapp. 

            expectedDai = convertToWei('1000')
            resultDai = await tokenFarm.stakingBalance(investor)
            assert.equal(resultDai.toString(), expectedDai, 'investor should be staking 1000') // still only staking 1000 since no withdraw

            await tokenFarm.changeYieldRate(0.5) // changing yield rate to 0.5
            await tokenFarm.issueTokens() // issue more dapp tokens according to staking balance
            await tokenFarm.changeYieldRate(1) // changing yield rate back to 1.0

            // investor should have no dapp before issuing dapp
            expectedDapp = convertToWei('1500')
            resultDapp = await dappToken.balanceOf(investor)
            assert.equal(resultDapp.toString(), expectedDapp, 'investor mock dapp correct after issuing dapp')
        })
    })
})