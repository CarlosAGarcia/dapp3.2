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
        // transferring 1000 mock DAI from account at index 1 (investor)
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
        it('investor address has correct amount of Dai tokens', async() => {
            const expectedDai = convertToWei('1000')

            let balanceDai = await daiToken.balanceOf(investor)
            console.log(`expected ${expectedDai} DAPP and got ${balanceDai.toString()}`)

            assert.equal(balanceDai.toString(), expectedDai)
        })
    })
})