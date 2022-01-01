const { assert } = require('chai');

const DaiToken = artifacts.require('DaiToken')
const DappToken = artifacts.require('DappToken')
const TokenFarm = artifacts.require('TokenFarm')

require('chai')
    .use(require('chai-as-promised'))
    .should()

    function tokens(n) {
        return web3.utils.toWei(n,'ether');
    }
contract('TokenFarm',([owner,investor]) =>{
    let daiToken,dappToken,tokenFarm
    before(async () =>{
        daiToken = await DaiToken.new()
        dappToken = await DappToken.new()
        tokenFarm = await TokenFarm.new(dappToken.address,daiToken.address)

        await dappToken.transfer(tokenFarm.address,tokens('1000000'))

        await daiToken.transfer(investor,tokens('100'), {from: owner})
    })
    describe('Mock Dai deployment', async () =>{
        it('has a name', async () => {
            const name = await daiToken.name()
            assert.equal(name, 'Mock DAI Token')
        })
    })

    describe('Dapp token deployment', async () =>{
        it('has a name', async () => {
            const name = await dappToken.name()
            assert.equal(name, 'DApp Token')
        })
    })

    describe('Token Farm deployment', async () =>{
        it('has a name', async () => {
            const name = await tokenFarm.name()
            assert.equal(name, 'Dapp Token Farm')
        })
        it('contract has tokens ', async() => {
            let balance = await dappToken.balanceOf(tokenFarm.address)
            assert.equal(balance.toString(), tokens('1000000'))
        })
    })

    describe('Farming tokens', async () =>{
        it('rewards tokens for farming mdai', async() =>{
            let result
            result = await daiToken.balanceOf(investor)
            assert.equal(result.toString(),tokens('100'), 'not correct balance of investor mockdia before staking' )

            await daiToken.approve(tokenFarm.address, tokens('100'), {from: investor})
            await tokenFarm.stakeTokens('100000000000000000000',{from: investor}) 

            result = await daiToken.balanceOf(investor)
            assert.equal(result.toString(),tokens('0'), 'incorrect balance of investor mockdia before staking' )

            result = await daiToken.balanceOf(tokenFarm.address)
            assert.equal(result.toString(),tokens('100'), 'Token farm balance not correct' )

            result = await tokenFarm.isStaking(investor)
            assert.equal(result.toString(),'true', 'Token farm balance not correct' )

            await tokenFarm.issueToken({from: owner})

            // result = await dappToken.balanceOf(investor)
            // assert.equal(result.toString(),'100',"Dapp token bal not correct")

            await tokenFarm.unstakeTokens({from: investor})
            result = await daiToken.balanceOf(investor)
            assert.equal(result.toString(),tokens('100'),'Incorrect bal after unstake')
        })
    })
})
